import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import Webcam from "react-webcam";
import {
  errorToast,
  getLocal
} from "../../utils/projectHelper";
import {
  useDispatch
} from "react-redux";
import {
  postSuspiciousImageActivityApi,
  postSuspiciousVideoActivityApi,
} from "../../api/superAdminApi/suspicousActivityManagementApi";
import {
  useNavigate,
  useParams
} from "react-router-dom";
import classes from "./style.module.css";
import {
  LogOutStudentApi
} from "../../api/studentApi";

const isImageDark = (imageBase64) => {
  return new Promise((resolve, reject) => {
    if (!imageBase64) {
      return resolve(false);
    }

    const BRIGHTNESS_THRESHOLD = 20; // How dark the image can be (0=black, 255=white).
    const DETAIL_THRESHOLD = 10; // How much detail/variance the image must have.

    const img = new Image();
    img.src = imageBase64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true
      });
      if (!ctx) return reject(new Error("Could not get canvas context."));
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      const pixelCount = data.length / 4;
      
      let sumBrightness = 0;
      const brightnessValues = [];

      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        sumBrightness += brightness;
        brightnessValues.push(brightness);
      }

      const averageBrightness = sumBrightness / pixelCount;

      // Check 1: Is the image extremely dark? (e.g., shutter closed)
      if (averageBrightness < BRIGHTNESS_THRESHOLD) {
        console.log(`Obscured due to low brightness: ${averageBrightness.toFixed(2)}`);
        return resolve(true);
      }

      let sumOfSquaredDifferences = 0;
      for (const value of brightnessValues) {
        sumOfSquaredDifferences += Math.pow(value - averageBrightness, 2);
      }
      const stdDev = Math.sqrt(sumOfSquaredDifferences / pixelCount);

      if (stdDev < DETAIL_THRESHOLD) {
        console.log(`Obscured due to low detail (std dev): ${stdDev.toFixed(2)}`);
        return resolve(true);
      }

      resolve(false);
    };
    img.onerror = () => reject(new Error("Image failed to load for analysis."));
  });
};


const VideoAndScreenShot = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    candidateId
  } = useParams();

  const [recordedVideoFile, setRecordedVideoFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const handleCameraReady = useCallback(() => {
    console.log("Camera is active and ready.");
    setIsCameraReady(true);
  }, []);

  const handleCameraError = useCallback((error) => {
    console.error("Camera permission denied or hardware error:", error);
    setCameraError("Camera access is required. Please allow camera permission and refresh.");
  }, [dispatch, navigate]);


  useEffect(() => {
    if (!isCameraReady) return;

    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
      const stream = webcamRef.current.video.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm"
      });
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const timestamp = new Date().getTime();
          const file = new File([event.data], `video_${candidateId}_${timestamp}.webm`, {
            type: "video/webm",
          });
          setRecordedVideoFile(file);
        }
      };
    }

    const initialCheckTimeout = setTimeout(() => {
      runPeriodicCameraCheck("initial");
    }, 1000);


    const userData = getLocal("userData");
    const intervals = [];

    if (userData.batchDetails?.proctoring?.imageProctor?.imageProctoringTime) {
      const screenshotInterval = setInterval(
        captureScreenshot,
        Number(userData.batchDetails.proctoring.imageProctor.imageProctoringTime) * 60 * 1000
      );
      intervals.push(screenshotInterval);
    }

    const permissionCheckInterval = setInterval(runPeriodicCameraCheck, 3000); // Check every 3 seconds
    intervals.push(permissionCheckInterval);

    if (
      userData.batchDetails?.proctoring?.videoStream?.videoStreaming &&
      userData.batchDetails?.proctoring?.videoStream?.videoInterval &&
      userData.batchDetails?.proctoring?.videoStream?.videoDuration
    ) {
      const videoInterval = setInterval(() => {
        startRecording();
        setTimeout(
          stopRecording,
          Number(userData.batchDetails.proctoring.videoStream.videoDuration) * 1000
        );
      }, Number(userData.batchDetails.proctoring.videoStream.videoInterval) * 60 * 1000);
      intervals.push(videoInterval);
    }

    return () => {
      clearTimeout(initialCheckTimeout);
      intervals.forEach(clearInterval);
    };
  }, [isCameraReady]);


  useEffect(() => {
    if (capturedImage) {
      const file = base64ToFile(capturedImage, `${candidateId}_${new Date().getTime()}.jpeg`);
      if(file) {
        const formData = new FormData();
        formData.append("image", file);
        dispatch(
          postSuspiciousImageActivityApi(formData, candidateId, setLoading, navigate, setCapturedImage)
        );
      }
    }
  }, [capturedImage, candidateId, dispatch, navigate]);

  useEffect(() => {
    if (recordedVideoFile) {
      const formData = new FormData();
      formData.append("video", recordedVideoFile);
      dispatch(postSuspiciousVideoActivityApi(formData, candidateId, setLoading));
    }
  }, [recordedVideoFile, candidateId, dispatch]);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      console.log("Starting video recording...");
      mediaRecorderRef.current.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      console.log("Stopping video recording...");
      mediaRecorderRef.current.stop();
    }
  };

  const captureScreenshot = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  };

  const runPeriodicCameraCheck = async (mode = "periodic") => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();

    try {
      const formData = new FormData();
      const isCovered = await isImageDark(screenshot);

      if (isCovered) {
        const file = base64ToFile(screenshot, `${candidateId}_${new Date().getTime()}.jpeg`);
        if(file) {
          formData.append("image", file);
          dispatch(
            postSuspiciousImageActivityApi(formData, candidateId, setLoading, navigate, setCapturedImage)
          );
          dispatch(LogOutStudentApi(setLoading, navigate));
          localStorage.clear();
        }
      }
    } catch (error) {
      console.error("Failed to perform camera check:", error);
    }
  };

    const base64ToFile = (base64, filename) => {
    // --- FIX 1: ADD ROBUST VALIDATION ---
    // Ensure the input is a valid-looking base64 data URI string.
    if (typeof base64 !== 'string' || !base64.includes(',')) {
      console.error('base64ToFile error: input is not a valid base64 string.', base64);
      return null;
    }

    try {
      const arr = base64.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);

      if (!mimeMatch || !mimeMatch[1]) {
        console.error('base64ToFile error: Could not determine MIME type.');
        return null;
      }
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {
        type: mime
      });
    } catch (error) {
      console.error('base64ToFile error: Failed to process base64 string.', error);
      return null;
    }
  };

  if (cameraError) {
    return (
      <div className={classes.errorContainer}>
        <h2>Camera Error</h2>
        <p>{cameraError}</p>
      </div>
    );
  }

  return (
    <div className={classes.webCam}>
      <Webcam
        audio={true}
        audioConstraints={{ echoCancellation: true }}
        ref={webcamRef}
        style={{ width: "100%", height: "auto" }}
        muted={true}
        onUserMedia={handleCameraReady}
        onUserMediaError={handleCameraError}
        screenshotFormat="image/jpeg"
      />
      {!isCameraReady && <div className={classes.loadingOverlay}>Initializing Camera...</div>}
    </div>
  );
};

export default VideoAndScreenShot;
