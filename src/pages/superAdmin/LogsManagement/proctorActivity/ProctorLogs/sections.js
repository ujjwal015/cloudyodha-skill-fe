/* Start of Selection */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import "../../../../../components/common/table/style.css";
import {
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH,
  LOGS_MANAGEMENT_PROCTOR_THEORY_BY_CANDIDATE_PATH,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
  getSuspiciousImageActivityApi,
  getSuspiciousVideoActivityApi,
  postAcitivityPracticalImageApi,
  postAcitivityPracticalVideoApi,
  postAcitivityTheoryImageApi,
  postAcitivityTheoryVideoApi,
  postAcitivityVivaImageApi,
  postAcitivityVivaVideoApi,
} from "../../../../../api/superAdminApi/suspicousActivityManagementApi";
import { capitalizeFirstLetter } from "../../../../../utils/projectHelper";
import { ReactComponent as ArrowLeft } from "./../../../../../assets/icons/chevron-left.svg";
import NoDataImg from "../../../../../assets/images/common/No-data-found 2.png";
import {
  downloadCandidateLogsByCandidateId,
  uploadCandidateImageLogsByBatchId,
  uploadCandidateVideoLogsByBatchId,
} from "../../../../../api/superAdminApi/proctorManagement";
import CommonModal from "../../../../../components/common/Modal/CommonModal";
import { toast } from "react-toastify";
import FileUploadModal from "../../../../../components/common/Modal/FileUploadModal";
import VideoUploadModal from "../../../../../components/common/Modal/VideoUploadModal";
import { examManagementSelector, getSectionTableList } from "../../../../../redux/slicers/superAdmin/examManagementSlice";

const SuspiciousVideoList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();                                                                                           
  const { sectionTableList=[] } = useSelector(
      examManagementSelector
  );
  const {practical={},viva={},theory={}}=sectionTableList;
  const { batchId, candidateId } = useParams();
  const [videoList, setVideoList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [theorysectionImageList, setTheorySectionImageList] = useState([]);
  const [practicalsectionImageList, setPracticalSectionImageList] = useState([]);
  const [vivasectionImageList, setVivaSectionImageList] = useState([]);
  const [theorysectionVideoList, setTheorySectionVideoList] = useState([]);
  const [practicalsectionVideoList, setPracticalSectionVideoList] = useState([]);
  const [vivasectionVideoList, setVivaSectionVideoList] = useState([]);

  // console.log(
  //   "vivasection______VideoList",
  //   (theorysectionImageList?.imageUrls?.length ?? 0) +
  //     (practicalsectionImageList?.imageUrls?.length ?? 0) +
  //     (vivasectionImageList?.imageUrls?.length ?? 0) +
  //     (theorysectionVideoList?.videoUrls?.length ?? 0) +
  //     (practicalsectionVideoList?.videoUrls?.length ?? 0) +
  //     (vivasectionVideoList?.videoUrls?.length ?? 0),
  // );

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const [showVideos, setShowVideos] = useState(false);
  const [files, setFiles] = useState([]);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [openVideoUpload, setOpenVideoUpload] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState([]);

  const ImageStateSelector = () => {
    if (activeTab === "theory") {
      return theorysectionImageList;
    } else if (activeTab === "practical") {
      return practicalsectionImageList;
    } else if (activeTab === "viva") {
      return vivasectionImageList;
    } else {
      return [];
    }
  };

  const VideoStateSelector = () => {
    if (activeTab === "theory") {
      return theorysectionVideoList;
    } else if (activeTab === "practical") {
      return practicalsectionVideoList;
    } else if (activeTab === "viva") {
      return vivasectionVideoList;
    } else {
      return [];
    }
  };
  const [activeTab, setActiveTab] = useState(location?.search?.split("=")?.[1] || "theory");
  const batchMode = localStorage.getItem("batchMode");
  
  useEffect(() => {
    if (location?.state?.batchMode) {
      localStorage.setItem("batchMode", location?.state?.batchMode);
    }
  }, [location?.state]);

  const handleActive = (tab) => {
    setActiveTab(tab);
    navigate(`${LOGS_MANAGEMENT_PROCTOR_THEORY_BY_CANDIDATE_PATH}/${batchId}/${candidateId}?section=${activeTab}`);
  };

  // useEffect(() => {
  //   // navigate(`${LOGS_MANAGEMENT_PROCTOR_THEORY_BY_CANDIDATE_PATH}/${batchId}/${candidateId}?section=${activeTab}`);

  //   setShowImages(true);
  //   setShowVideos(false);
  // }, [activeTab]);

  const postProctoeringImages = (payload, formReset) => {
    setLoading(true);
    dispatch(
      postAcitivityPracticalImageApi(
        setLoading,
        payload,
        candidateId,
        batchId,
        formReset,
        getDataAfterImageUploadPractical,
      ),
    );
  };

  //video upload
  const postProctoeringVideo = (payload, formReset) => {
    setLoading(true);
    dispatch(
      postAcitivityPracticalVideoApi(
        setLoading,
        payload,
        candidateId,
        batchId,
        formReset,
        getPracticalDataAfterVideoUpload,
      ),
    );
  };

  const postProctoringTheoryVideo = (payload, formReset) => {
    setLoading(true);
    dispatch(
      postAcitivityTheoryVideoApi(setLoading, payload, candidateId, batchId, formReset, getTheoryDataAfterVideoUpload),
    );
  };

  const postProctoringVivaVideo = (payload, formReset) => {
    setLoading(true);
    dispatch(
      postAcitivityVivaVideoApi(setLoading, payload, candidateId, batchId, formReset, getVivaDataAfterVideoUpload),
    );
  };

  //image upload
  const postProctoringVivaImages = (payload, formReset) => {
    setLoading(true);
    dispatch(
      postAcitivityVivaImageApi(setLoading, payload, candidateId, batchId, formReset, getDataAfterImageUploadViva),
    );
  };

  const postProctoringTheoryImages = (payload, formReset) => {
    setLoading(true);
    dispatch(
      postAcitivityTheoryImageApi(setLoading, payload, candidateId, batchId, formReset, getDataAfterImageUploadTheory),
    );
  };

  //getImageData
  const getDataAfterImageUploadTheory = () => {
    setShowImages(true);
    dispatch(getSuspiciousImageActivityApi(setLoading, candidateId, setTheorySectionImageList, "theory"));
  };

  const getDataAfterImageUploadPractical = () => {
    setShowImages(true);
    dispatch(getSuspiciousImageActivityApi(setLoading, candidateId, setPracticalSectionImageList, "practical"));
  };

  const getDataAfterImageUploadViva = () => {
    setShowImages(true);
    dispatch(getSuspiciousImageActivityApi(setLoading, candidateId, setVivaSectionImageList, "viva"));
  };

  const getDataAfterImageUpload = () => {
    setShowImages(true);
    dispatch(getSuspiciousImageActivityApi(setLoading, candidateId, setImageList, activeTab));
  };

  //getVideoData

  // const getDataAfterVideoUpload = () => {
  //   setShowVideos(true);
  //   dispatch(getSuspiciousVideoActivityApi(setLoading, candidateId, setVideoList, activeTab));
  // };

  const getTheoryDataAfterVideoUpload = () => {
    setShowVideos(true);
    dispatch(getSuspiciousVideoActivityApi(setLoading, candidateId, setTheorySectionVideoList, "theory"));
  };
  const getPracticalDataAfterVideoUpload = () => {
    setShowVideos(true);
    dispatch(getSuspiciousVideoActivityApi(setLoading, candidateId, setPracticalSectionVideoList, "practical"));
  };
  const getVivaDataAfterVideoUpload = () => {
    setShowVideos(true);
    dispatch(getSuspiciousVideoActivityApi(setLoading, candidateId, setVivaSectionVideoList, "viva"));
  };

  useEffect(() => {
    if(activeTab==="theory"){
      dispatch(getSuspiciousVideoActivityApi(setLoading, candidateId, setTheorySectionVideoList, "theory"));
      dispatch(getSuspiciousImageActivityApi(setLoading, candidateId, setTheorySectionImageList, "theory"));
    }

    if(activeTab==="practical"){
      dispatch(getSuspiciousVideoActivityApi(setLoading, candidateId, setPracticalSectionVideoList, "practical"));
      dispatch(getSuspiciousImageActivityApi(setLoading, candidateId, setPracticalSectionImageList, "practical"));
    }

    if(activeTab==="viva"){
      dispatch(getSuspiciousVideoActivityApi(setLoading, candidateId, setVivaSectionVideoList, "viva"));
      dispatch(getSuspiciousImageActivityApi(setLoading, candidateId, setVivaSectionImageList, "viva"));
    }

    navigate(`${LOGS_MANAGEMENT_PROCTOR_THEORY_BY_CANDIDATE_PATH}/${batchId}/${candidateId}?section=${activeTab}`);

    setShowImages(true);
    setShowVideos(false);

  }, [activeTab]);

  const handleNavigateProctoring = () => {
    localStorage.removeItem("batchMode");
    navigate(`${LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH}/${batchId}`);
  };

  const handleShowFiles = (fileType) => {
    if (fileType === "image") {
      setShowImages(!showImages);
    } else {
      setShowVideos(!showVideos);
    }
  };

  const handleUploadImageFilePopUp = () => {
    setOpenImageUpload(true);
    setFiles([]);
    // setPreviewUrls([]);
  };

  const handleUploadVideoFilePopUp = () => {
    setOpenVideoUpload(true);
    setVideoFiles([]);
    // setVideoPreviewUrls([]);
  };

  const handleDownloadImageFilePopUp = () => {
    setBtnLoading(true);
    dispatch(downloadCandidateLogsByCandidateId(candidateId, setBtnLoading));
  };

  const handleCloseImageModal = () => {
    setFiles([]);
    // setPreviewUrls([]);
  };

  const handleCloseVideoModal = () => {
    setOpenVideoUpload(false);
    setVideoFiles([]);
    // setVideoPreviewUrls([]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"));
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleVideoFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("video/"));
    setVideoFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleRemoveVideoFile = (index) => {
    const updatedFiles = [...videoFiles];
    updatedFiles.splice(index, 1);
    setVideoFiles(updatedFiles);
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error("No images selected for upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`image`, file);
    });
    dispatch(uploadCandidateImageLogsByBatchId(batchId, candidateId, formData, setLoading, setImageList, activeTab));
    handleCloseImageModal();
  };

  const handleVideoSubmit = () => {
    if (videoFiles.length === 0) {
      toast.error("No videos selected for upload.");
      return;
    }

    const formData = new FormData();
    videoFiles.forEach((file) => {
      formData.append(`video`, file);
    });
    dispatch(uploadCandidateVideoLogsByBatchId(batchId, candidateId, formData, setLoading, setVideoList, activeTab));
    handleCloseVideoModal();
  };

  useEffect(() => {
    if (files.length > 0) {
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      // setPreviewUrls(newPreviewUrls);

      return () => {
        newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      // setPreviewUrls([]);
    }
  }, [files]);

  useEffect(() => {
    if (videoFiles.length > 0) {
      const newPreviewUrls = videoFiles.map((file) => URL.createObjectURL(file));
      // setVideoPreviewUrls(newPreviewUrls);
      return () => {
        newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      // setVideoPreviewUrls([]);
    }
  }, [videoFiles]);

  const handleCloseModal = () => setOpenImageUpload(false);

  const ImageHandlerSelectionMethod = () => {
    if (activeTab === "theory") {
      return postProctoringTheoryImages;
    } else if (activeTab === "practical") {
      return postProctoeringImages;
    } else if (activeTab === "viva") {
      return postProctoringVivaImages;
    }
  };

  const videoHandlerSelectionMethod = () => {
    if (activeTab === "theory") {
      return postProctoringTheoryVideo;
    } else if (activeTab === "practical") {
      return postProctoeringVideo;
    } else if (activeTab === "viva") {
      return postProctoringVivaVideo;
    }
  };

  const handleBackgroundColor = () => {
    if (
      !(
        (theorysectionImageList?.imageUrls?.length ?? 0) +
          (practicalsectionImageList?.imageUrls?.length ?? 0) +
          (vivasectionImageList?.imageUrls?.length ?? 0) +
          (theorysectionVideoList?.videoUrls?.length ?? 0) +
          (practicalsectionVideoList?.videoUrls?.length ?? 0) +
          (vivasectionVideoList?.videoUrls?.length ?? 0) >
        0
      )
    ) {
      return { backgroundColor: "grey",cursor:"not-allowed" };
    }
  };

  return (
    <>
      <FileUploadModal
        open={openImageUpload}
        onClose={handleCloseModal}
        submit={ImageHandlerSelectionMethod()}
        loading={loading}
      />
      <VideoUploadModal
        open={openVideoUpload}
        onClose={handleCloseVideoModal}
        submit={videoHandlerSelectionMethod()}
        loading={loading}
      />
      <div className="main-content">
        <div className="client-image-header">
          <div className="client-title">
            <div className="client-title-text">
              <ArrowLeft width={16} onClick={handleNavigateProctoring} />
              <h2>{videoList?.candidateName}</h2>
            </div>
            <div className="client-title-time">
              <h3>
                Duration : <span>{videoList?.examDuration ?? 0} min</span>
              </h3>
            </div>
          </div>
        </div>
        <div className="subadmin-table">
          <div className="proctor-wrapper">
            <div className="scheme-tab">
              <div className="scheme-tab-childs">
                <button
                  className={activeTab === "theory" ? "active" : "scheme-btn"}
                  onClick={() => handleActive("theory")}
                  disabled={!theory.isSelected}
                  >
                  Theory
                </button>
                <button
                  className={activeTab === "practical" ? "active" : "scheme-btn"}
                  onClick={() => handleActive("practical")}
                  disabled={!practical.isSelected}
                  >
                  Practical
                </button>
                <button className={activeTab === "viva" ? "active" : "scheme-btn"} 
                onClick={() => handleActive("viva")}
                disabled={!viva.isSelected}
                >
                  Viva
                </button>
              </div>
              <div>
                <button
                  className="table-green-btn"
                  onClick={
                    btnLoading ||
                    (theorysectionImageList?.imageUrls?.length ?? 0) +
                      (practicalsectionImageList?.imageUrls?.length ?? 0) +
                      (vivasectionImageList?.imageUrls?.length ?? 0) +
                      (theorysectionVideoList?.videoUrls?.length ?? 0) +
                      (practicalsectionVideoList?.videoUrls?.length ?? 0) +
                      (vivasectionVideoList?.videoUrls?.length ?? 0) >
                      0 ? 
                      handleDownloadImageFilePopUp
                      : () => {}
                  }
                  style={handleBackgroundColor()}
                  // style={{}}
                  disabled={
                    btnLoading ||
                    !((theorysectionImageList?.imageUrls?.length ?? 0) +
                      (practicalsectionImageList?.imageUrls?.length ?? 0) +
                      (vivasectionImageList?.imageUrls?.length ?? 0) +
                      (theorysectionVideoList?.videoUrls?.length ?? 0) +
                      (practicalsectionVideoList?.videoUrls?.length ?? 0) +
                      (vivasectionVideoList?.videoUrls?.length ?? 0) > 0)
                  }>
                  {btnLoading ? "Downloading" : "Download Files"}
                </button>
              </div>
            </div>

            <div className="file-type">
              <div className="content">
                <p>{capitalizeFirstLetter(activeTab)} Photos</p>
              </div>
              <div style={{ display: "grid", placeItems: "center" }} onClick={() => handleShowFiles("image")}>
                <ArrowLeft
                  style={{
                    rotate: showImages ? "90deg" : "270deg",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
            <div></div>
            <div></div>
            {/* Images */}
            {showImages && (
              <>
                {(activeTab !== "theory" || batchMode !== "online") && (
                  <div className="scheme-tab">
                    <button
                      style={{ marginTop: "10px", marginBottom: "20px", padding: "10px" }}
                      onClick={handleUploadImageFilePopUp}>
                      Upload Images
                    </button>
                  </div>
                )}
                <div className="proctor-wrapper__ele">
                  {ImageStateSelector?.()?.imageUrls?.length > 0 ? (
                    ImageStateSelector?.()?.imageUrls.map((item, index) => (
                      <div className="proctor__element" key={`${index}+img`}>
                        <img src={item?.url} alt="images" width={"100%"} height={"100%"} />
                      </div>
                    ))
                  ) : (
                    <div className="notfound-component">
                      <img width={100} src={NoDataImg} alt={"dummy-data"} />
                      <h6>No Data Found !</h6>
                      <p>we’ll notify you when there is something new.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="file-type">
              <div className="content">
                <p>{capitalizeFirstLetter(activeTab)} Videos</p>
              </div>
              <div style={{ display: "grid", placeItems: "center" }} onClick={() => handleShowFiles("video")}>
                <ArrowLeft
                  style={{
                    rotate: showVideos ? "90deg" : "270deg",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
            <div></div>

            {/* Videos */}
            {showVideos && (
              <>
                {(activeTab !== "theory" || batchMode !== "online") && (
                  <div className="scheme-tab">
                    <button
                      className="scheme-tab"
                      style={{ marginTop: "10px", marginBottom: "20px", padding: "10px" }}
                      onClick={handleUploadVideoFilePopUp}>
                      Upload Videos
                    </button>
                  </div>
                )}
                <div className="proctor-wrapper__ele">
                  {VideoStateSelector?.()?.videoUrls?.length > 0 ? (
                    VideoStateSelector?.()?.videoUrls?.map((item, index) => (
                      <div className="proctor__element" key={index}>
                        <video width="100%" height="100%" controls>
                          <source src={item?.url} type="video/mp4" />
                        </video>
                      </div>
                    ))
                  ) : (
                    <div className="notfound-component">
                      <img width={100} src={NoDataImg} alt="no-data" />
                      <h6>No Data Found !</h6>
                      <p>we’ll notify you when there is something new.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SuspiciousVideoList;
