import React, { useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../style.css";
import { Tab, Tabs } from "@mui/material";
import { ReactComponent as ArrowLeft } from "../../../../assets/icons/chevron-left.svg";
import { ReactComponent as CheckIn } from "../../../../assets/icons/camera.svg";
import { ReactComponent as GroupPic } from "../../../../assets/icons/users.svg";
import { ReactComponent as Practical } from "../../../../assets/icons/airplay.svg";
import { ReactComponent as Viva } from "../../../../assets/icons/user-check.svg";
import { ReactComponent as AadhaarPhotos } from "../../../../assets/icons/interface-share-user--human-person-share-signal-transmit-user.svg";
import { ReactComponent as Annexure } from "../../../../assets/icons/file-text.svg";
import { ReactComponent as Theory } from "../../../../assets/icons/interface-file-clipboard-text--edition-form-task-checklist-edit-clipboard.svg";
import { ReactComponent as Tool } from "../../../../assets/icons/tool.svg";
import { ReactComponent as Attendence } from "../../../../assets/icons/money-graph-bar--product-data-bars-analysis-analytics-graph-business-chart.svg";
import { ReactComponent as Remarks } from "../../../../assets/icons/message_edit.svg";
import { ReactComponent as UploadIcon } from "../../../../assets/icons/upload-icon-effect.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/close-icon.svg";
import { ReactComponent as ApprovedIcon } from "../../../../assets/icons/Approved.svg";
import { ReactComponent as RejectIcon } from "../../../../assets/icons/Decline.svg";
import { ReactComponent as PDFIcon } from "../../../../assets/new-icons/IconPDF.svg";
import { ReactComponent as ExcelFileIcon } from "../../../../assets/icons/excel-file-icon.svg";
import { ReactComponent as DocsFileIcon } from "../../../../assets/icons/docs-file-icon.svg";

import {
  UploadAadharPhotoApi,
  UploadAnnexureNMApi,
  UploadAttendanceApi,
  UploadCheckInCheckOutApi,
  UploadExamCenterPhotoAnVideoApi,
  UploadGroupPhotoApi,
  UploadPracticalPhotoAnVideoApi,
  UploadTheoryPhotoAnVideoApi,
  UploadToolsApi,
  UploadTpPhotoApi,
  UploadVivaPhotoAnVideoApi,
  changeAllFileStatusApi,
  createRemarksApi,
  deleteAadharPhotoApi,
  deleteAnnexureNMApi,
  deleteAttendanceSheetApi,
  deleteExamCenterPhotoAndVideoApi,
  deleteGroupPhotoApi,
  deletePracticalPhotoAndVideoApi,
  deleteSingleImageApi,
  deleteTheoryPhotoAndVideoApi,
  deleteToolPhotoApi,
  deleteTpPhotoApi,
  deleteVivaPhotoAndVideoApi,
  getAadharPhotoApi,
  getAnnexureNMApi,
  getAttendanceSheetApi,
  getCheckInCheckOutPhotoApi,
  getExamCenterPhotoAnVideoApi,
  getGroupPhotoApi,
  getPracticalPhotoAnVideoApi,
  getRemarksApi,
  getTheoryPhotoAnVideoApi,
  getToolsPhotoApi,
  getTpPhotoApi,
  getVivaPhotoAnVideoApi,
} from "../../../../api/superAdminApi/verificationTab";
import { useDispatch, useSelector } from "react-redux";
import {
  getAadharPhotos,
  getAnnexureMPhotos,
  getAnnexureNPhotos,
  getAttendanceSheet,
  getCheckInPhotos,
  getCheckOutPhotos,
  getGroupPhotos,
  getPracticalPhotos,
  getPracticalVideo,
  getTheoryPhotos,
  getTheoryVideo,
  getToolPhoto,
  getVivaPhotos,
  getVivaVideo,
  getExamCenterPhoto,
  getExamCenterVideo,
  getTpPhoto,
  verificationTabSelector,
} from "../../../../redux/slicers/superAdmin/verificationTabSlice";
import { useEffect } from "react";
import { FadeLoader, PulseLoader } from "react-spinners";
import { VERIFICATION_TAB_LIST_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import PreviewImageModel from "../previewImage";

const FileUploader = ({
  label,
  accept,
  name,
  updateFormData,
  formData,
  getRetrieveImagesFromS3,
  imgLoading,
  setFormData,
  fileLists,
  viewBtn,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { batchId, actionId } = params;
  const [fileList, setFileList] = useState(fileLists);
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState("");
  const [deletedFileName, setDeletedFileName] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);

  const {
    checkInPhoto = [],
    checkOutPhoto = [],
    examCenterPhoto = [],
    examCenterVideo = [],
    groupPhoto = [],
    aadharPhoto = [],
    theoryPhoto = [],
    theoryVideo = [],
    practicalPhoto = [],
    practicalVideo = [],
    vivaPhoto = [],
    vivaVideo = [],
    annexureN = [],
    annexureM = [],
    attendanceSheet = [],
    tpPhoto = [],
    toolPhoto = [],
    remarks = "",
  } = useSelector(verificationTabSelector);

  const batchName = checkInPhoto?.[0]?.batchId?.batchId;

  const fileInputRef = useRef(null);
  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFileList([...fileList, ...newFiles]);
    updateFormData([...fileList, ...newFiles]);
  };
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const fieldValue = type === "file" ? e.target.files : value;
    if (type === "file") {
      setFileList([...fileList, ...fieldValue]);
      updateFormData([...fileList, ...fieldValue]);
    } else {
      updateFormData(fieldValue, name);
      setRemark(fieldValue);
    }
  };

  useEffect(() => {
    setFileList(fileLists);
  }, [fileLists]);

  useEffect(() => {
    setRemark(remarks);
  }, [remarks]);

  useEffect(() => {
    setDeletedFileName(name);
  }, [name]);

  const handleRemoveFile = (index) => {
    const newFiles = [...fileList];
    newFiles?.splice(index, 1);
    setFileList(newFiles);
    updateFormData(newFiles, name);
  };

  const handleRemoveS3File = (e, index, imgKey, name, QAStampId) => {
    e.stopPropagation();
    if (name === "checkInPhoto" || name === "checkOutPhoto") {
      if (name === "checkInPhoto") {
        const newFiles = [...checkInPhoto];
        newFiles?.splice(index, 1);
        dispatch(getCheckInPhotos(newFiles));
      }

      if (name === "checkOutPhoto") {
        const newFiles = [...checkOutPhoto];
        newFiles?.splice(index, 1);
        dispatch(getCheckOutPhotos(newFiles));
      }
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(deleteSingleImageApi(setLoading, deleteImage, batchId));
    }
    if (name === "examcenterPhoto" || name === "examcenterVideo") {
      if (name === "examcenterPhoto") {
        const newFiles = [...examCenterPhoto];
        newFiles?.splice(index, 1);
        dispatch(getExamCenterPhoto(newFiles));
      }

      if (name === "examcenterVideo") {
        const newFiles = [...examCenterVideo];
        newFiles?.splice(index, 1);
        dispatch(getExamCenterVideo(newFiles));
      }
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(
        deleteExamCenterPhotoAndVideoApi(setLoading, deleteImage, batchId)
      );
    }
    if (name === "groupPhoto") {
      const newFiles = [...groupPhoto];
      newFiles?.splice(index, 1);
      dispatch(getGroupPhotos(newFiles));
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(deleteGroupPhotoApi(setLoading, deleteImage, batchId));
    }
    if (name === "theoryPhoto" || name === "theoryVideo") {
      if (name === "theoryPhoto") {
        const newFiles = [...theoryPhoto];
        newFiles?.splice(index, 1);
        dispatch(getTheoryPhotos(newFiles));
      }

      if (name === "theoryVideo") {
        const newFiles = [...theoryVideo];
        newFiles?.splice(index, 1);
        dispatch(getTheoryVideo(newFiles));
      }
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(deleteTheoryPhotoAndVideoApi(setLoading, deleteImage, batchId));
    }
    if (name === "practicalPhoto" || name === "practicalVideo") {
      if (name === "practicalPhoto") {
        const newFiles = [...practicalPhoto];
        newFiles?.splice(index, 1);
        dispatch(getPracticalPhotos(newFiles));
      }

      if (name === "practicalVideo") {
        const newFiles = [...practicalVideo];
        newFiles?.splice(index, 1);
        dispatch(getPracticalVideo(newFiles));
      }
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(
        deletePracticalPhotoAndVideoApi(setLoading, deleteImage, batchId)
      );
    }
    if (name === "vivaPhoto" || name === "vivaVideo") {
      if (name === "vivaPhoto") {
        const newFiles = [...vivaPhoto];
        newFiles?.splice(index, 1);
        dispatch(getVivaPhotos(newFiles));
      }

      if (name === "vivaVideo") {
        const newFiles = [...vivaVideo];
        newFiles?.splice(index, 1);
        dispatch(getVivaVideo(newFiles));
      }
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };

      dispatch(deleteVivaPhotoAndVideoApi(setLoading, deleteImage, batchId));
    }
    if (name === "annexureN" || name === "annexureM") {
      if (name === "annexureN") {
        const newFiles = [...annexureN];
        newFiles?.splice(index, 1);
        dispatch(getAnnexureNPhotos(newFiles));
      }

      if (name === "annexureM") {
        const newFiles = [...annexureM];
        newFiles?.splice(index, 1);
        dispatch(getAnnexureMPhotos(newFiles));
      }
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(deleteAnnexureNMApi(setLoading, deleteImage, batchId));
    }
    if (name === "aadharPhoto") {
      const newFiles = [...aadharPhoto];
      newFiles?.splice(index, 1);
      dispatch(getAadharPhotos(newFiles));
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(deleteAadharPhotoApi(setLoading, deleteImage, batchId));
    }
    if (name === "toolPhoto") {
      const newFiles = [...toolPhoto];
      newFiles?.splice(index, 1);
      dispatch(getToolPhoto(newFiles));
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(deleteToolPhotoApi(setLoading, deleteImage, batchId));
    }
    if (name === "attendenceSheet") {
      const newFiles = [...attendanceSheet];
      newFiles?.splice(index, 1);
      dispatch(getAttendanceSheet(newFiles));
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(deleteAttendanceSheetApi(setLoading, deleteImage, batchId));
    }
    if (name === "tpPhoto") {
      const newFiles = [...tpPhoto];
      newFiles?.splice(index, 1);
      dispatch(getTpPhoto(newFiles));
      setLoading(true);
      let deleteImage = {
        keyToDelete: imgKey,
        QAverificationTimeStampId: QAStampId,
      };
      dispatch(deleteTpPhotoApi(setLoading, deleteImage, batchId));
    }
  };

  const handleAcceptImg = async (
    e,
    index,
    imgKey,
    name,
    imageId,
    fileType,
    fileStatus
  ) => {
    e.stopPropagation();
    let payload = {
      QAverificationTimeStampId: actionId,
      imageUpdates: [
        {
          objectName: name,
          imageId: imageId,
          newStatus: "accepted",
          fileType: fileType,
        },
      ],
    };
    dispatch(
      changeAllFileStatusApi(
        payload,
        setLoading,
        getRetrieveImagesFromS3,
        setIsPreviewOpen
      )
    );
  };

  const handleRejectImg = (
    e,
    index,
    imgKey,
    name,
    imageId,
    fileType,
    fileStatus
  ) => {
    e.stopPropagation();
    let payload = {
      QAverificationTimeStampId: actionId,
      imageUpdates: [
        {
          objectName: name,
          imageId: imageId,
          newStatus: "rejected",
          fileType: fileType,
        },
      ],
    };
    dispatch(
      changeAllFileStatusApi(
        payload,
        setLoading,
        getRetrieveImagesFromS3,
        setIsPreviewOpen
      )
    );
  };

  const handlePreview = (event, url, index) => {
    event.stopPropagation();
    setIsPreviewOpen(true);
    setImgUrl(url?.url);
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };
  return (
    <div className="inner-tab">
      <div className="tab-labels">
        <h3>{label} </h3>
      </div>
      <div className="tab-fields">
        {accept === "text" ? (
          <textarea
            name="description"
            cols={50}
            rows={3}
            placeholder="Write remarks..."
            value={remark}
            onChange={handleInputChange}
            disabled={viewBtn}
          />
        ) : (
          <div>
            {!viewBtn ? (
              <>
                <input
                  name={name}
                  type="file"
                  accept={accept}
                  multiple
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current.click()}
                  className="drop-zone"
                >
                  <UploadIcon />
                  {accept === "image/*" ? (
                    <p>
                      <span>Click to upload</span> or drag and drop SVG, PNG,
                      JPG or GIF <br />
                      {/* (max. 800x400px) */}
                    </p>
                  ) : accept.includes(".pdf") ||
                    accept.includes(".jpeg") ||
                    accept.includes(".jpg") ||
                        accept.includes(".png") ||
                        accept.includes("application/vnd.ms-excel") ||
                        accept.includes("application/vnd.ms-excel") ? (
                    <p>
                      <span>Click to upload</span> or drag and drop
                            JPEG,JPG,PNG,PDF,EXCEL etc. <br />
                      {/* (max. 5 MB) */}
                    </p>
                  ) : (
                    <p>
                      <span>Click to upload</span> or drag and drop MKV, AVI,
                      MP4 or MOV etc. <br />
                      {/* (max. 5 MB) */}
                    </p>
                  )}
                </div>
              </>
            ) : (
              ""
            )}

            <>
              <PreviewImageModel
                handlePreview={handlePreview}
                isPreviewOpen={isPreviewOpen}
                setIsPreviewOpen={setIsPreviewOpen}
                handlePreviewClose={handlePreviewClose}
                url={imgUrl}
                name={name}
                batchName={batchName}
              />
              {/* Check In Photo */}
              <div className="uploads-preview">
                {name === "checkInPhoto" &&
                  checkInPhoto &&
                  checkInPhoto?.length > 0 &&
                  checkInPhoto?.map((url, index) => (
                    <div className="img-box">
                      <div
                        className="img-fill"
                        key={index}
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Check-Out Photo */}
              <div className="uploads-preview">
                {name === "checkOutPhoto" &&
                  checkOutPhoto &&
                  checkOutPhoto?.length > 0 &&
                  checkOutPhoto?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Exam-center-Photo */}

              <div className="uploads-preview">
                {name === "examcenterPhoto" &&
                  examCenterPhoto &&
                  examCenterPhoto?.length > 0 &&
                  examCenterPhoto?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Exam-center-Videos */}

              <div className="uploads-preview">
                {name === "examcenterVideo" &&
                  examCenterVideo &&
                  examCenterVideo?.length > 0 &&
                  examCenterVideo?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "videos",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "videos",
                                        url?.status
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <video width="100" height="100" controls={false}>
                            <source src={url?.url} />
                          </video>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Group Photo */}

              <div className="uploads-preview">
                {name === "groupPhoto" &&
                  groupPhoto &&
                  groupPhoto?.length > 0 &&
                  groupPhoto?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Theory Photo */}
              <div className="uploads-preview">
                {name === "theoryPhoto" &&
                  theoryPhoto &&
                  theoryPhoto?.length > 0 &&
                  theoryPhoto?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Theory Video */}

              <div className="uploads-preview">
                {name === "theoryVideo" &&
                  theoryVideo &&
                  theoryVideo?.length > 0 &&
                  theoryVideo?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "videos",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "videos",
                                        url?.status
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <video width="100" height="100" controls={false}>
                            <source src={url?.url} />
                          </video>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Practical Photo */}

              <div className="uploads-preview">
                {name === "practicalPhoto" &&
                  practicalPhoto &&
                  practicalPhoto?.length > 0 &&
                  practicalPhoto?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Practical Video */}
              <div className="uploads-preview">
                {name === "practicalVideo" &&
                  practicalVideo &&
                  practicalVideo?.length > 0 &&
                  practicalVideo?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "videos",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "videos",
                                        url?.status
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <video width="100" height="100" controls={false}>
                            <source src={url?.url} />
                          </video>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Viva Photo */}

              <div className="uploads-preview">
                {name === "vivaPhoto" &&
                  vivaPhoto &&
                  vivaPhoto?.length > 0 &&
                  vivaPhoto?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Viva Video */}

              <div className="uploads-preview">
                {name === "vivaVideo" &&
                  vivaVideo &&
                  vivaVideo?.length > 0 &&
                  vivaVideo?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "videos",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "videos",
                                        url?.status
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <video width="100" height="100" controls={false}>
                            <source src={url?.url} />
                          </video>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* annexureN */}

                <div className="uploads-preview">
                  {name === "annexureN" &&
                    annexureN &&
                    annexureN?.length > 0 &&
                    annexureN?.map((url, index) => (
                      <div className="img-box" key={index}>
                        <div
                          className="img-fill"
                          // onClick={(e) => handlePreview(e, url, index)}
                          onClick={(e) => {
                            if (
                              url &&
                              (url.fileName.includes(".png") ||
                                url.fileName.includes(".jpg") ||
                                url.fileName.includes(".jpeg"))
                            ) {
                              handlePreview(e, url, index);
                            }
                          }}
                        >
                          {viewBtn ? (
                            !url?.adminUploaded ? (
                              <div
                                className={
                                  url?.adminUploaded ? "" : "img-overlay"
                                }
                                // onClick={(e) => handlePreview(e, url, index)}
                                onClick={() => window.open(url?.url)}
                              >
                                {url?.status === "accepted" ? (
                                  <p className="accepted-img">Accepted</p>
                                ) : url?.status === "rejected" ? (
                                  <p className="rejected-img">Rejected</p>
                                ) : url?.status === "noAction" ? (
                                  <>
                                    <button
                                      className="icon-check"
                                      onClick={(e) =>
                                        handleAcceptImg(
                                          e,
                                          index,
                                          url?.key,
                                          name="annexureN"?"annexureNPhoto":name,
                                          url?._id,
                                          "images",
                                          url?.status
                                        )
                                          }
                                        >
                                          <ApprovedIcon />
                                        </button>
                                        <button
                                          className="icon-close"
                                          onClick={(e) =>
                                            handleRejectImg(
                                              e,
                                              index,
                                              url?.key,
                                          name="annexureN"?"annexureNPhoto":name,
                                          url?._id,
                                          "images",
                                          url?.status,
                                          true
                                        )
                                      }
                                    >
                                      <RejectIcon />
                                    </button>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            <>
                              <button
                                className="remove-btn"
                                onClick={(e) =>
                                  handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                                }
                              >
                                <CloseIcon />
                              </button>
                            </>
                          )}
                          {imgLoading ? (
                            <FadeLoader color="#1AB6F7" />
                          ) : url?.fileName.includes(".pdf") ? (
                            <div className="preview-pdf-doc">
                              <PDFIcon />
                              <p onClick={() => window.open(url?.url)}>
                                {url?.fileName}
                              </p>
                            </div>
                          ) : url?.fileName.includes(".png") ||
                            url?.fileName.includes(".jpg") ? (
                            <img src={url?.url} alt={`Preview ${url?.key}`} />
                          ) : url?.fileName.includes(".xlsx") ? (
                            <div className="preview-pdf-doc">
                              <ExcelFileIcon />
                              <p onClick={() => window.open(url?.url)}>
                                {url?.fileName}
                              </p>
                            </div>
                          ) : url?.fileName.includes('docx') ? (
                            <div className="preview-pdf-doc">
                              <DocsFileIcon />
                              <p onClick={() => window.open(url?.url)}>
                                {url?.fileName}
                              </p>
                            </div>
                          ) : ""}
                        </div>
                      </div>
                    ))}
                </div>

              {/* annexureM */}

                {/* <div className="uploads-preview">
                {name === "annexureM" &&
                  annexureM &&
                  annexureM?.length > 0 &&
                  annexureM?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name + "Photo",
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={() =>
                                      handleRejectImg(
                                        index,
                                        url?.key,
                                        name + "Photo",
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div> */}

                <div className="uploads-preview">
                  {name === "annexureM" &&
                    annexureM &&
                    annexureM?.length > 0 &&
                    annexureM?.map((url, index) => (
                      <div className="img-box" key={index}>
                        <div
                          className="img-fill"
                          // onClick={(e) => handlePreview(e, url, index)}
                          onClick={(e) => {
                            if (
                              url &&
                              (url.fileName.includes(".png") ||
                                url.fileName.includes(".jpg") ||
                                url.fileName.includes(".jpeg"))
                            ) {
                              handlePreview(e, url, index);
                            }
                          }}
                        >
                          {viewBtn ? (
                            !url?.adminUploaded ? (
                              <div
                                className={
                                  url?.adminUploaded ? "" : "img-overlay"
                                }
                                // onClick={(e) => handlePreview(e, url, index)}
                                onClick={() => window.open(url?.url)}
                              >
                                {url?.status === "accepted" ? (
                                  <p className="accepted-img">Accepted</p>
                                ) : url?.status === "rejected" ? (
                                  <p className="rejected-img">Rejected</p>
                                ) : url?.status === "noAction" ? (
                                  <>
                                    <button
                                      className="icon-check"
                                      onClick={(e) =>
                                        handleAcceptImg(
                                          e,
                                          index,
                                          url?.key,
                                          name="annexureM"?"annexureMPhoto":name,
                                          url?._id,
                                          "images",
                                          url?.status
                                        )
                                      }
                                    >
                                      <ApprovedIcon />
                                    </button>
                                    <button
                                      className="icon-close"
                                      onClick={(e) =>
                                        handleRejectImg(
                                          e,
                                          index,
                                          url?.key,
                                          name="annexureM"?"annexureMPhoto":name,
                                          url?._id,
                                          "images",
                                          url?.status,
                                          true
                                        )
                                      }
                                    >
                                      <RejectIcon />
                                    </button>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            <>
                              <button
                                className="remove-btn"
                                onClick={(e) =>
                                  handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                                }
                              >
                                <CloseIcon />
                              </button>
                            </>
                          )}
                          {imgLoading ? (
                            <FadeLoader color="#1AB6F7" />
                          ) : url?.fileName.includes(".pdf") ? (
                            <div className="preview-pdf-doc">
                              <PDFIcon />
                              <p onClick={() => window.open(url?.url)}>
                                {url?.fileName}
                              </p>
                            </div>
                          ) : url?.fileName.includes(".png") ||
                            url?.fileName.includes(".jpg") ? (
                            <img src={url?.url} alt={`Preview ${url?.key}`} />
                          ) : url?.fileName.includes(".xlsx") ? (
                            <div className="preview-pdf-doc">
                              <ExcelFileIcon />
                              <p onClick={() => window.open(url?.url)}>
                                {url?.fileName}
                              </p>
                            </div>
                          ) : url?.fileName.includes('docx') ? (
                            <div className="preview-pdf-doc">
                              <DocsFileIcon />
                              <p onClick={() => window.open(url?.url)}>
                                {url?.fileName}
                              </p>
                            </div>
                          ) : ""}
                        </div>
                      </div>
                    ))}
                </div>

              {/* aadharPhoto */}

              <div className="uploads-preview">
                {name === "aadharPhoto" &&
                  aadharPhoto &&
                  aadharPhoto?.length > 0 &&
                  aadharPhoto?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* TP Photo */}

              <div className="uploads-preview">
                {name === "tpPhoto" &&
                  tpPhoto &&
                  tpPhoto?.length > 0 &&
                  tpPhoto?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        // onClick={(e) => handlePreview(e, url, index)}
                        onClick={(e) => {
                          if (
                            url &&
                            (url.fileName.includes(".png") ||
                              url.fileName.includes(".jpg") ||
                              url.fileName.includes(".jpeg"))
                          ) {
                            handlePreview(e, url, index);
                          }
                        }}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              // onClick={(e) => handlePreview(e, url, index)}
                              onClick={() => window.open(url?.url)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : url?.fileName.includes(".pdf") ? (
                          <div className="preview-pdf-doc">
                            <PDFIcon />
                            <p onClick={() => window.open(url?.url)}>
                              {url?.fileName}
                            </p>
                          </div>
                        ) : url?.fileName.includes(".png") ||
                          url?.fileName.includes(".jpg") ? (
                          <img src={url?.url} alt={`Preview ${url?.key}`} />
                        ) : url?.fileName.includes(".xlsx") ? (
                          <div className="preview-pdf-doc">
                            <ExcelFileIcon />
                            <p onClick={() => window.open(url?.url)}>
                              {url?.fileName}
                            </p>
                          </div>
                        ) : url?.fileName.includes('docx') ? (
                          <div className="preview-pdf-doc">
                            <DocsFileIcon />
                            <p onClick={() => window.open(url?.url)}>
                              {url?.fileName}
                            </p>
                          </div>
                        ) : ""}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AttendanceSheet */}

                <div className="uploads-preview">
                  {name === "attendenceSheet" &&
                    attendanceSheet &&
                    attendanceSheet?.length > 0 &&
                    attendanceSheet?.map((url, index) => (
                      <div className="img-box" key={index}>
                        <div
                          className="img-fill"
                          // onClick={(e) => handlePreview(e, url, index)}
                          onClick={(e) => {
                            if (
                              url &&
                              (url.fileName.includes(".png") ||
                                url.fileName.includes(".jpg") ||
                                url.fileName.includes(".jpeg")
                              )
                            ) {
                              handlePreview(e, url, index);
                            }
                          }}
                        >
                          {viewBtn ? (
                            !url?.adminUploaded ? (
                              <div
                                className={
                                  url?.adminUploaded ? "" : "img-overlay"
                                }
                                // onClick={(e) => handlePreview(e, url, index)}
                                onClick={() => window.open(url?.url)}
                              >
                                {url?.status === "accepted" ? (
                                  <p className="accepted-img">Accepted</p>
                                ) : url?.status === "rejected" ? (
                                  <p className="rejected-img">Rejected</p>
                                ) : url?.status === "noAction" ? (
                                  <>
                                    <button
                                      className="icon-check"
                                      onClick={(e) =>
                                        handleAcceptImg(
                                          e,
                                          index,
                                          url?.key,
                                          name,
                                          url?._id,
                                          "images",
                                          url?.status
                                        )
                                      }
                                    >
                                      <ApprovedIcon />
                                    </button>
                                    <button
                                      className="icon-close"
                                      onClick={(e) =>
                                        handleRejectImg(
                                          e,
                                          index,
                                          url?.key,
                                          name,
                                          url?._id,
                                          "images",
                                          url?.status,
                                          true
                                        )
                                      }
                                    >
                                      <RejectIcon />
                                    </button>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            ) : (
                              ""
                            )
                          ) : (
                            <>
                              <button
                                className="remove-btn"
                                onClick={(e) =>
                                  handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                                }
                              >
                                <CloseIcon />
                              </button>
                            </>
                          )}
                          {imgLoading ? (
                            <FadeLoader color="#1AB6F7" />
                          ) : url?.fileName.includes(".pdf") ? (
                            <div className="preview-pdf-doc">
                              <PDFIcon />
                              <p onClick={() => window.open(url?.url)}>
                                {url?.fileName}
                              </p>
                            </div>
                          ) : url?.fileName.includes(".png") ||
                            url?.fileName.includes(".jpg") ? (
                            <img src={url?.url} alt={`Preview ${url?.key}`} />
                          ) : url?.fileName.includes(".xlsx") ? (
                            <div className="preview-pdf-doc">
                              <ExcelFileIcon />
                              <p onClick={() => window.open(url?.url)}>
                                {url?.fileName}
                              </p>
                            </div>
                          ) : url?.fileName.includes('docx') ? (
                            <div className="preview-pdf-doc">
                              <DocsFileIcon />
                              <p onClick={() => window.open(url?.url)}>
                                {url?.fileName}
                              </p>
                            </div>
                          ) : ""}
                        </div>
                      </div>
                    ))}
                </div>

              {/* Tool Photo */}
              <div className="uploads-preview">
                {name === "toolPhoto" &&
                  toolPhoto &&
                  toolPhoto?.length > 0 &&
                  toolPhoto?.map((url, index) => (
                    <div className="img-box" key={index}>
                      <div
                        className="img-fill"
                        onClick={(e) => handlePreview(e, url, index)}
                      >
                        {viewBtn ? (
                          !url?.adminUploaded ? (
                            <div
                              className={
                                url?.adminUploaded ? "" : "img-overlay"
                              }
                              onClick={(e) => handlePreview(e, url, index)}
                            >
                              {url?.status === "accepted" ? (
                                <p className="accepted-img">Accepted</p>
                              ) : url?.status === "rejected" ? (
                                <p className="rejected-img">Rejected</p>
                              ) : url?.status === "noAction" ? (
                                <>
                                  <button
                                    className="icon-check"
                                    onClick={(e) =>
                                      handleAcceptImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status
                                      )
                                    }
                                  >
                                    <ApprovedIcon />
                                  </button>
                                  <button
                                    className="icon-close"
                                    onClick={(e) =>
                                      handleRejectImg(
                                        e,
                                        index,
                                        url?.key,
                                        name,
                                        url?._id,
                                        "images",
                                        url?.status,
                                        true
                                      )
                                    }
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <>
                            <button
                              className="remove-btn"
                              onClick={(e) =>
                                handleRemoveS3File(e, index, url?.key, name, url?.QAverificationTimeStampId)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </>
                        )}
                        {imgLoading ? (
                          <FadeLoader color="#1AB6F7" />
                        ) : (
                          <img src={url.url} alt={`Preview ${url?.key}`} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </>

            {/* All upload preview are from  here*/}

            <div className="uploads-preview">
              {fileList &&
                fileList?.map((file, index) => (
                  <div key={index} className="img-box">
                    <div className="img-fill">
                      {file.type.startsWith("image") ? (
                        <>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                          />
                        </>
                      ) : file?.name.includes(".pdf") ? (
                        <div className="preview-pdf-doc">
                          <PDFIcon />
                          <p
                            onClick={() =>
                              window.open(URL.createObjectURL(file))
                            }
                          >
                            {file?.name}
                          </p>
                        </div>
                        ) : file?.name.includes("xlsx") ||
                          file?.name.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ? (
                          <div className="preview-pdf-doc">
                            <ExcelFileIcon />
                            <p
                              onClick={() =>
                                window.open(URL.createObjectURL(file))
                              }
                            >
                              {file?.name}
                            </p>
                          </div>
                        ) :
                          file?.name.includes("docx") ? (
                            <div className="preview-pdf-doc">
                              <DocsFileIcon />
                              <p
                                onClick={() =>
                                  window.open(URL.createObjectURL(file))
                                }
                              >
                                {file?.name}
                              </p>
                            </div>
                            ) : (
                              <video width="100" height="100" controls={false}>
                                <source
                                  src={URL.createObjectURL(file)}
                                  type={file.type}
                                />
                              </video>
                        )
                      }
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function UploadDocuments() {
  const initialFormValues = {
    checkInPhoto: [],
    checkOutPhoto: [],
    examcenterPhoto: [],
    examcenterVideo: [],
    groupPhoto: [],
    theoryPhoto: [],
    theoryVideo: [],
    practicalPhoto: [],
    practicalVideo: [],
    vivaPhoto: [],
    vivaVideo: [],
    aadharPhoto: [],
    annexureN: [],
    annexureM: [],
    attendenceSheet: [],
    tpPhoto: [],
    toolPhoto: [],
    description: "",
  };
  const dispatch = useDispatch();
  const params = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { batchName, viewBtn, date } = state;
  const { batchId, actionId } = params;
  const [formData, setFormData] = useState(initialFormValues);
  const [loading, setLoading] = useState(false);
  const [TabIndex, setTabIndex] = useState(0);
  const [value, setValue] = useState(0);
  const [fileList, setFileList] = useState([]);
  const updateFormData = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabIndex(newValue);
    setFormData(initialFormValues);
  };

  const getRetrieveImagesFromS3 = () => {
    setLoading(true);
    if (TabIndex === 0) {
      //check-in and check out Photo
      dispatch(getCheckInCheckOutPhotoApi(actionId, setLoading));
    } else if (TabIndex === 1) {
      // Exam center
      dispatch(getExamCenterPhotoAnVideoApi(actionId, setLoading));
    } else if (TabIndex === 2) {
      // Group Photo
      dispatch(getGroupPhotoApi(actionId, setLoading));
    } else if (TabIndex === 3) {
      // Theory Photo
      dispatch(getTheoryPhotoAnVideoApi(actionId, setLoading));
    } else if (TabIndex === 4) {
      //practical
      dispatch(getPracticalPhotoAnVideoApi(actionId, setLoading));
    } else if (TabIndex === 5) {
      //viva
      dispatch(getVivaPhotoAnVideoApi(actionId, setLoading));
    } else if (TabIndex === 6) {
      dispatch(getAadharPhotoApi(actionId, setLoading));
    } else if (TabIndex === 7) {
      //annexure
      dispatch(getAnnexureNMApi(actionId, setLoading));
    } else if (TabIndex === 8) {
      //TP Declaration
      dispatch(getTpPhotoApi(actionId, setLoading));
    } else if (TabIndex === 9) {
      //attendance
      dispatch(getAttendanceSheetApi(actionId, setLoading));
    } else if (TabIndex === 10) {
      //tool
      dispatch(getToolsPhotoApi(actionId, setLoading));
    } else if (TabIndex === 11) {
      dispatch(getRemarksApi(actionId, setLoading));
    }
  };

  useEffect(() => {
    getRetrieveImagesFromS3();
  }, [TabIndex]);

  const handleSubmit = () => {
    const payload = new FormData();
    payload.append("QAverificationTimeStampId", actionId);

    let checkFileName;
    for (const fieldName of Object.keys(formData)) {
      const value = formData[fieldName.split("[")[0]];
      if (Array.isArray(value) && value?.length > 0) {
        // eslint-disable-next-line no-loop-func
        value.forEach((item) => {
          checkFileName = fieldName;
          payload.append(fieldName, item);
        });
      } else if (value?.length > 0) {
        checkFileName = "description";
        payload.append(fieldName, value);
      }
    }
    setLoading(true);
    if (checkFileName === "checkInPhoto" || checkFileName === "checkOutPhoto") {
      dispatch(
        UploadCheckInCheckOutApi(
          payload,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (
      checkFileName === "examcenterPhoto" ||
      checkFileName === "examcenterVideo"
    ) {
      dispatch(
        UploadExamCenterPhotoAnVideoApi(
          payload,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (checkFileName === "groupPhoto") {
      dispatch(
        UploadGroupPhotoApi(
          payload,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (checkFileName === "theoryPhoto" || checkFileName === "theoryVideo") {
      dispatch(
        UploadTheoryPhotoAnVideoApi(
          payload,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (
      checkFileName === "practicalPhoto" ||
      checkFileName === "practicalVideo"
    ) {
      dispatch(
        UploadPracticalPhotoAnVideoApi(
          payload,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (checkFileName === "vivaPhoto" || checkFileName === "vivaVideo") {
      dispatch(
        UploadVivaPhotoAnVideoApi(
          payload,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (checkFileName === "aadharPhoto") {
      dispatch(
        UploadAadharPhotoApi(
          payload,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (checkFileName === "annexureN" || checkFileName === "annexureM") {
      dispatch(
        UploadAnnexureNMApi(
          payload,
          batchId,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (checkFileName === "tpPhoto") {
      dispatch(
        UploadTpPhotoApi(
          payload,
          batchId,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (checkFileName === "attendenceSheet") {
      dispatch(
        UploadAttendanceApi(
          payload,
          batchId,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (checkFileName === "toolPhoto") {
      dispatch(
        UploadToolsApi(
          payload,
          batchId,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues,
          setFileList
        )
      );
    }
    if (checkFileName === "description") {
      dispatch(
        createRemarksApi(
          payload,
          setLoading,
          getRetrieveImagesFromS3,
          setFormData,
          initialFormValues
        )
      );
    }
  };

  return (
    <div className="verification-upload-docs main-content">
      <div className="title">
        <h1>
          <ArrowLeft onClick={() => navigate(VERIFICATION_TAB_LIST_PAGE)} />
          <span>Batch ID : {batchName}</span>
        </h1>
      </div>

      <div className="subadmin-table">
        <div className="tab-row">
          <div className="tab-col-left">
            <Tabs
              orientation="vertical"
              className="tab-list"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
            >
              <Tab
                icon={<CheckIn />}
                label="Check In / Out Photo"
                {...a11yProps(0)}
              />
              <Tab
                icon={<Remarks />}
                label="Exam Center Photo & Video"
                {...a11yProps(1)}
              />
              <Tab icon={<GroupPic />} label="Group Photo" {...a11yProps(2)} />
              <Tab
                icon={<Theory />}
                label="Theory Photo/Video"
                {...a11yProps(3)}
              />
              <Tab
                icon={<Practical />}
                label="Practical Photo/Video"
                {...a11yProps(4)}
              />
              <Tab icon={<Viva />} label="Viva Photo/Video" {...a11yProps(5)} />
              <Tab
                icon={<AadhaarPhotos />}
                label="Aadhaar Photos"
                {...a11yProps(6)}
              />
              <Tab icon={<Annexure />} label="Annexure" {...a11yProps(7)} />
              <Tab
                icon={<Attendence />}
                label="TP Declaration"
                {...a11yProps(8)}
              />
              <Tab
                icon={<Attendence />}
                label="Attendance Sheet"
                {...a11yProps(9)}
              />
              <Tab icon={<Tool />} label="Tools Photos" {...a11yProps(10)} />
              {!viewBtn && (
                <Tab icon={<Remarks />} label="Remarks" {...a11yProps(11)} />
              )}
              {/* <Tab icon={<Remarks />} label="Test Case" {...a11yProps(12)} /> */}
            </Tabs>
          </div>
          <div className="tab-col-right">
            <div className="tab-content">
              <TabPanel value={value} index={0}>
                <div className="tab-head-title">
                  <h2>CHECK IN/OUT DETAILS</h2>
                  <p>Update Group Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Check in Photo :"
                    accept="image/*"
                    name="checkInPhoto"
                    updateFormData={(value) =>
                      updateFormData("checkInPhoto", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  <FileUploader
                    label="Check out Photo :"
                    accept="image/*"
                    name="checkOutPhoto"
                    updateFormData={(value) =>
                      updateFormData("checkOutPhoto", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.checkInPhoto?.length > 0 ||
                  formData?.checkOutPhoto?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div className="tab-head-title">
                  <h2>EXAM CENTER PHOTOS DETAILS</h2>
                  <p>Update Exam Center Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Exam Center Photos :"
                    accept="image/*"
                    name="examcenterPhoto"
                    updateFormData={(value) =>
                      updateFormData("examcenterPhoto", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  <FileUploader
                    label="Exam Center Videos :"
                    accept="video/*"
                    name="examcenterVideo"
                    updateFormData={(value) =>
                      updateFormData("examcenterVideo", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.examcenterPhoto?.length > 0 ||
                  formData?.examcenterVideo?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <div className="tab-head-title">
                  <h2>GROUP PHOTO DETAILS</h2>
                  <p>Update Group Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Group Photos :"
                    accept="image/*"
                    name="groupPhoto"
                    updateFormData={(value) =>
                      updateFormData("groupPhoto", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.groupPhoto?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <div className="tab-head-title">
                  <h2>THEORY PHOTOS DETAILS</h2>
                  <p>Update theory Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Theory Photos :"
                    accept="image/*"
                    name="theoryPhoto"
                    updateFormData={(value) =>
                      updateFormData("theoryPhoto", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  <FileUploader
                    label="Theory Videos :"
                    accept="video/*"
                    name="theoryVideo"
                    updateFormData={(value) =>
                      updateFormData("theoryVideo", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.theoryPhoto?.length > 0 ||
                  formData?.theoryVideo?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={4}>
                <div className="tab-head-title">
                  <h2>Practical Details</h2>
                  <p>Update practical Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Practical Photo :"
                    accept="image/*"
                    name="practicalPhoto"
                    updateFormData={(value) =>
                      updateFormData("practicalPhoto", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  <FileUploader
                    label="Practical Videos  :"
                    accept="video/*"
                    name="practicalVideo"
                    updateFormData={(value) =>
                      updateFormData("practicalVideo", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.practicalPhoto?.length > 0 ||
                  formData?.practicalVideo?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={5}>
                <div className="tab-head-title">
                  <h2>Viva Details</h2>
                  <p>Update Viva Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="viva Photo :"
                    accept="image/*"
                    name="vivaPhoto"
                    updateFormData={(value) =>
                      updateFormData("vivaPhoto", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  <FileUploader
                    label="viva Videos  :"
                    accept="video/*"
                    name="vivaVideo"
                    updateFormData={(value) =>
                      updateFormData("vivaVideo", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.vivaPhoto?.length > 0 ||
                  formData?.vivaVideo?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={6}>
                <div className="tab-head-title">
                  <h2>Aadhar Details</h2>
                  <p>Update aadhar Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Aadhar Photo :"
                    accept="image/*"
                    name="aadharPhoto"
                    updateFormData={(value) =>
                      updateFormData("aadharPhoto", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.aadharPhoto?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={7}>
                <div className="tab-head-title">
                  <h2>Annexure Details</h2>
                  <p>Update Annexure Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Annexure N :"
                    // accept="image/*"
                    accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    name="annexureN"
                    updateFormData={(value) =>
                      updateFormData("annexureN", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  <FileUploader
                    label="Annexure M :"
                    // accept="image/*"
                    accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    name="annexureM"
                    updateFormData={(value) =>
                      updateFormData("annexureM", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {(formData?.annexureN?.length > 0 || 
                  formData?.annexureM?.length > 0) ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={8}>
                <div className="tab-head-title">
                  <h2>TP Declaration</h2>
                  <p>Update TP Declaration of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="TP PHOTO :"
                    // accept=".pdf, .jpeg, .jpg, .png"
                    accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    name="tpPhoto"
                    updateFormData={(value) => updateFormData("tpPhoto", value)}
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.tpPhoto?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={9}>
                <div className="tab-head-title">
                  <h2>Attendance Details</h2>
                  <p>Update Attendance Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Attendance Sheet :"
                    // accept="image/*"
                    accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    name="attendenceSheet"
                    updateFormData={(value) =>
                      updateFormData("attendenceSheet", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.attendenceSheet?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={10}>
                <div className="tab-head-title">
                  <h2>Tools Details</h2>
                  <p>Update tools Photos of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Tools used :"
                    accept="image/*"
                    name="toolPhoto"
                    updateFormData={(value) =>
                      updateFormData("toolPhoto", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.toolPhoto?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={11}>
                <div className="tab-head-title">
                  <h2>Remarks Details</h2>
                  <p>Update remarks of Selected Batch.</p>
                </div>
                <div>
                  <FileUploader
                    label="Remarks :"
                    accept="text"
                    name="description"
                    updateFormData={(value) =>
                      updateFormData("description", value)
                    }
                    formData={formData}
                    getRetrieveImagesFromS3={getRetrieveImagesFromS3}
                    imgLoading={loading}
                    fileLists={fileList}
                    viewBtn={viewBtn}
                  />
                  {formData?.description?.length > 0 ? (
                    <button className="tab-blue-btn" onClick={handleSubmit}>
                      {loading ? (
                        <PulseLoader size="10px" color="white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </TabPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
