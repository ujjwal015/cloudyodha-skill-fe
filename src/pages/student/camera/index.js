import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate, useParams } from "react-router-dom";
import {
  studentFaceCaptureApi,
  studentIdCaptureApi,
} from "../../../api/studentApi";
import { useDispatch, useSelector } from "react-redux";
import {
  detectHumanFace,
  studentSelector,
} from "../../../redux/slicers/studentSlice";
import { authSelector } from "../../../redux/slicers/authSlice";
import { getDynamicRoute } from "../../../utils/projectHelper";
import useFullscreen from "../../../hooks/useFullscreen";
const Camera = ({ captureBtnText, navigatePath }) => {
  const { enterFullscreen, exitFullscreen } = useFullscreen();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { batchId, candidateId, questionId } = params;
  const { humanFaceDetection = [] } = useSelector(studentSelector);
  const {
    userInfo,
    allStepsCompleted = [],
    allStepsCompletedStatus = false,
  } = useSelector(authSelector);
  const webcamRef = useRef(null);
  const [url, setUrl] = React.useState(null);
  const [cameraIsOn, setCameraIsOn] = useState(true);
  const [loading, setLoading] = useState(false);

  const capturePhoto = React.useCallback(async () => {

    const imageSrc = webcamRef.current.getScreenshot({
      screenshotFormat: "image/jpeg",
    });
    const byteCharacters = atob(imageSrc.split(",")[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: "image/jpeg" });

    // Create a File object
    const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });

    // Do something with the captured file
    setUrl(imageSrc);
    setCameraIsOn(false);

    // Wait for the state updates to complete before dispatching the action
    await new Promise((resolve) => setTimeout(resolve, 0));

    const data = new FormData();
    data.append("pic", file);
    const screenStep = JSON.parse(localStorage.getItem("screenStep"));
    if (captureBtnText === "Capture Face") {
      !screenStep?.allStepsCompletedStatus &&
        dispatch(studentFaceCaptureApi(data, candidateId, setLoading));
    } else {
      !screenStep?.allStepsCompletedStatus &&
        dispatch(studentIdCaptureApi(data, candidateId, setLoading));
    }
  }, [webcamRef, setUrl, setCameraIsOn, dispatch]);

  const onUserMedia = (e) => {};

  const handleReCapture = () => {
    dispatch(detectHumanFace([]));
    setUrl(null);
    setCameraIsOn(true);
  };
  const screenStep = JSON.parse(localStorage.getItem("screenStep"));
  const allSteps = screenStep?.steps;
  const handleNextStep = () => {
    if (humanFaceDetection?.length > 0) {
      if (!allStepsCompletedStatus) {
        if (allSteps && allSteps?.length > 0) {
          const currentStep = allSteps?.find(
            (step) => step?.isCompleted === false
          );
          if (currentStep) {
            return getDynamicRoute(
              currentStep,
              batchId,
              candidateId,
              questionId
            );
          }
        }
      }
      setCameraIsOn(true);
    }
  };

  return (
    <>
      {cameraIsOn ? (
        <Webcam
          ref={webcamRef}
          audio={false}
          // mirrored={false}
          mirrored={captureBtnText === "Capture Face" ? true : false}
          screenshotFormat="image/jpeg"
          onUserMedia={onUserMedia}
        />
      ) : (
        <img src={url} className="captured-img" alt="student-img" />
      )}
      <div className="capture-img">
        <button
          className="capture-btn"
          onClick={url ? handleReCapture : capturePhoto}
        >
          {url ? "Retake" : `${captureBtnText}`}
        </button>
        {url && humanFaceDetection?.length > 0 && (
          <button className="capture-btn" onClick={handleNextStep}>
            Next Step
          </button>
        )}
      </div>
    </>
  );
};

export default Camera;
