import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  BULK_UPLOAD_VERIFICATION_TAB_API,
  CHANGE_FILES_STATUS_API,
  CREATE_REMARKS_API,
  DELETE_AADHAR_PHOTO_API,
  DELETE_ANNEXURE_N_ANNEXURE_M_PHOTO_API,
  DELETE_ATTENDANCE_API,
  DELETE_CHECK_IN_CHECK_OUT_IMAGE_API,
  DELETE_EXAM_CENTER_PHOTO_VIDEO_API,
  DELETE_GROUP_PHOTO_API,
  DELETE_PRACTICAL_PHOTO_VIDEOS_API,
  DELETE_THEORY_PHOTO_VIDEO_API,
  DELETE_TOOLS_API,
  DELETE_TP_PHOTO_API,
  DELETE_VIVA_PHOTO_VIDEOS_API,
  DELETE_TIME_STAMP,
  DOWNLOAD_SAMPLE_VERIFICATION,
  GET_AADHAR_PHOTO_API,
  GET_ALL_PHOTOS_AND_VIDEOS_API,
  GET_ANNEXURE_N_ANNEXURE_M_PHOTO_API,
  GET_ATTENDANCE_API,
  GET_CHECK_IN_CHECK_OUT_PHOTO_API,
  GET_EXAM_CENTER_PHOTO_VIDEO_API,
  GET_FILTERED_NAME_LIST,
  GET_FILTERED_VERIFICATION_LIST,
  GET_GROUP_PHOTO_API,
  GET_PRACTICAL_PHOTO_VIDEOS_API,
  GET_REMARKS_API,
  GET_REMINDER_DATA_API,
  GET_THEORY_PHOTO_VIDEO_API,
  GET_TOOLS_PHOTO_API,
  GET_TP_PHOTO_API,
  GET_VERIFICATION_TAB_LIST_API,
  GET_VIVA_PHOTO_VIDEOS_API,
  GET_ZIP_FILE_ALL_DOCUMENTS,
  POST_REMINDER_DATA_API,
  UPLOAD_AADHAR_PHOTO_API,
  UPLOAD_ANNEXURE_N_ANNEXURE_M_PHOTO_API,
  UPLOAD_ATTENDANCE_API,
  UPLOAD_CHECK_IN_CHECK_OUT_PHOTO_API,
  UPLOAD_EXAM_CENTER_PHOTO_VIDEO_API,
  UPLOAD_GROUP_PHOTO_API,
  UPLOAD_PRACTICAL_PHOTO_VIDEOS_API,
  UPLOAD_THEORY_PHOTO_VIDEO_API,
  UPLOAD_TOOLS_API,
  UPLOAD_TP_PHOTO_API,
  UPLOAD_VIVA_PHOTO_VIDEOS_API,
  GET_VERIFICATION_FILES_COUNT,
  GET_VERIFICATION_AUDIT_FILE_API,
} from "../../config/constants/apiConstants/superAdmin";
import {
  getAttendanceSheet,
  getAadharPhotos,
  getAnnexureMPhotos,
  getAnnexureNPhotos,
  getCheckInPhotos,
  getCheckOutPhotos,
  getDescription,
  getGroupPhotos,
  getPracticalPhotos,
  getPracticalVideo,
  getTheoryPhotos,
  getTheoryVideo,
  getVerificationList,
  getVivaPhotos,
  getVivaVideo,
  getToolPhoto,
  getAssessorName,
  getExamCenterPhoto,
  getExamCenterVideo,
  getTpPhoto,
  getReminderData,
} from "../../redux/slicers/superAdmin/verificationTabSlice";
import api from "../../utils/apiHelper";
import {
  devConsoleLog,
  errorToast,
  getLocal,
  successToast,
} from "../../utils/projectHelper";

export const bulkUploadVerificationTabApi =
  (formData, setLoading, setUploadedFile, getList, closeModal) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(BULK_UPLOAD_VERIFICATION_TAB_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          getList();
          setUploadedFile(null);
          successToast(msg);
          closeModal();
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        // errorToast(e.error.error);
        errorToast(e.details ?? e.error);
        devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getVerificationListApi =
  (
    setLoading,
    page,
    limit,
    setTotalPages,
    search = null,
    assessorName,
    from,
    to,
    // isFilterOpen,
    setIsFilterApplied,
    clientId,
    assessorManagementFromDashboard
  ) =>
  (dispatch) => {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (search) queryParams.append("search", search);
    if (assessorName) queryParams.append("assessorName", assessorName);
    if (from) queryParams.append("from", from);
    if (to) queryParams.append("to", to);
    if (to) queryParams.append("to", to);
    if (clientId) queryParams.append("clientId", clientId);
    if (assessorManagementFromDashboard?.dashboardClient)
      queryParams.append("dashboardClient", true);

    const URL = `${GET_VERIFICATION_TAB_LIST_API}?${queryParams.toString()}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getVerificationList(a?.details?.assessmentDetails));
          setTotalPages(a?.details?.totalPages);
          if (assessorName || from || to)
            setIsFilterApplied && setIsFilterApplied(true);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const exportVerificationDataApi =
  (setLoading, isExport = false) =>
  () => {
    const queryParams = new URLSearchParams();
    if (isExport) queryParams.append("isExport", isExport);

    const URL = `${GET_VERIFICATION_TAB_LIST_API}?${queryParams.toString()}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .downloadFilename("Master Export Verification List.xlsx", "blob")
      .success((a) => {
        if (a.statusCode === 200) {
          setLoading && setLoading(false);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const deleteVerificationListSpecificTimeStamp =
  (setLoading, id, setDeleteModal, setTimeStampData, getList) => () => {
    console.log("API-HIT");
    api()
      .root(API_ROOT)
      // .delete(`${DELETE_TIME_STAMP}?id=${id}`)
      .delete(`${DELETE_TIME_STAMP}/${id}`)
      .success((a) => {
        console.log("AAAA", a);
        setLoading && setLoading(false);
        setDeleteModal(false);
        setTimeStampData("");
        successToast("Timestamp Deleted");
        getList();
      })
      .error((err) => {
        setLoading && setLoading(false);
        console.log("Error", err);
        setDeleteModal(false);
        // errorToast("Network Error");
      })
      .send(() => {
        setLoading && setLoading(false);
        setDeleteModal(false);
      });
  };

export const UploadCheckInCheckOutApi =
  (
    formData,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_CHECK_IN_CHECK_OUT_PHOTO_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          // setUploadedFile(null);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
          successToast(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        // devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getAssessorNameListApi = (setLoading) => (dispatch) => {
  const URL = `${GET_FILTERED_NAME_LIST}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getAssessorName(a?.details?.assessorDetails));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      errorToast(msg);
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const getAllPhotosAndVideosApi =
  (batchId, date, assesorId, section, setLoading) => (dispatch) => {
    const URL = `${GET_ALL_PHOTOS_AND_VIDEOS_API}?batchId=${batchId}&date=${date}&assesorId=${assesorId}&section=${section}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getCheckInPhotos(a?.details?.images));
          dispatch(getCheckOutPhotos(a?.details?.checkOutUrls));
          // dispatch(getCheckInPhotos(a?.details?.checkInUrls));
          // dispatch(getCheckOutPhotos(a?.details?.checkOutUrls));

          if (section === "theoryPhoto") {
            console.log(a?.details?.[1]?.videos);
            dispatch(getTheoryPhotos(a?.details?.[0]?.images));
            dispatch(getTheoryVideo(a?.details?.[1]?.videos));
          }
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { message: msg = "" } = e;
        errorToast(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getCheckInCheckOutPhotoApi =
  (batchId, setLoading) => (dispatch) => {
    const URL = `${GET_CHECK_IN_CHECK_OUT_PHOTO_API}/${batchId}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getCheckInPhotos(a?.details?.checkInUrls));
          dispatch(getCheckOutPhotos(a?.details?.checkOutUrls));
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { message: msg = "" } = e;
        errorToast(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const UploadGroupPhotoApi =
  (
    formData,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_GROUP_PHOTO_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        // devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const getGroupPhotoApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_GROUP_PHOTO_API}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getGroupPhotos(a?.details));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      errorToast(msg);
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};
export const deleteGroupPhotoApi = (setLoading, deleteImage, batchId) => () => {
  api()
    .root(API_ROOT)
    .delete(`${DELETE_GROUP_PHOTO_API}/${batchId}`)
    .data(deleteImage)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        successToast("File deleted successfully.");
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      errorToast(e.message);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const UploadExamCenterPhotoAnVideoApi =
  (
    formData,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_EXAM_CENTER_PHOTO_VIDEO_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        // devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getExamCenterPhotoAnVideoApi =
  (batchId, setLoading) => (dispatch) => {
    const URL = `${GET_EXAM_CENTER_PHOTO_VIDEO_API}/${batchId}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getExamCenterPhoto(a?.details?.examcenterPhotoUrls));
          dispatch(getExamCenterVideo(a?.details?.examcenterVideoUrls));
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const deleteExamCenterPhotoAndVideoApi =
  (setLoading, deleteImage, batchId, deletedFileName) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_EXAM_CENTER_PHOTO_VIDEO_API}/${batchId}`)
      .data(deleteImage)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("File deleted successfully.");
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const UploadTheoryPhotoAnVideoApi =
  (
    formData,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_THEORY_PHOTO_VIDEO_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        // devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getTheoryPhotoAnVideoApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_THEORY_PHOTO_VIDEO_API}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getTheoryPhotos(a?.details?.theoryPhotoUrls));
        dispatch(getTheoryVideo(a?.details?.theoryVideoUrls));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const deleteTheoryPhotoAndVideoApi =
  (setLoading, deleteImage, batchId, deletedFileName) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_THEORY_PHOTO_VIDEO_API}/${batchId}`)
      .data(deleteImage)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("File deleted successfully.");
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const UploadPracticalPhotoAnVideoApi =
  (
    formData,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_PRACTICAL_PHOTO_VIDEOS_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getPracticalPhotoAnVideoApi =
  (batchId, setLoading) => (dispatch) => {
    const URL = `${GET_PRACTICAL_PHOTO_VIDEOS_API}/${batchId}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getPracticalPhotos(a?.details?.practicalPhotoUrls));
          dispatch(getPracticalVideo(a?.details?.practicalVideoUrls));
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const deletePracticalPhotoAndVideoApi =
  (setLoading, deleteImage, batchId) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_PRACTICAL_PHOTO_VIDEOS_API}/${batchId}`)
      .data(deleteImage)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("File deleted successfully.");
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const UploadVivaPhotoAnVideoApi =
  (
    formData,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_VIVA_PHOTO_VIDEOS_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        // devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getVivaPhotoAnVideoApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_VIVA_PHOTO_VIDEOS_API}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getVivaPhotos(a?.details?.vivaPhotoUrls));
        dispatch(getVivaVideo(a?.details?.vivaVideoUrls));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const deleteVivaPhotoAndVideoApi =
  (setLoading, deleteImage, batchId) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_VIVA_PHOTO_VIDEOS_API}/${batchId}`)
      .data(deleteImage)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("File deleted successfully.");
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const UploadAnnexureNMApi =
  (
    formData,
    batchId,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_ANNEXURE_N_ANNEXURE_M_PHOTO_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        // devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getAnnexureNMApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_ANNEXURE_N_ANNEXURE_M_PHOTO_API}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getAnnexureNPhotos(a?.details?.annexureNUrls));
        dispatch(getAnnexureMPhotos(a?.details?.annexureMUrls));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const deleteAnnexureNMApi = (setLoading, deleteImage, batchId) => () => {
  api()
    .root(API_ROOT)
    .delete(`${DELETE_ANNEXURE_N_ANNEXURE_M_PHOTO_API}/${batchId}`)
    .data(deleteImage)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        successToast("File deleted successfully.");
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      errorToast(e.message);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const UploadAadharPhotoApi =
  (
    formData,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_AADHAR_PHOTO_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        // devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const getAadharPhotoApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_AADHAR_PHOTO_API}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getAadharPhotos(a?.details));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const deleteAadharPhotoApi =
  (setLoading, deleteImage, batchId) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_AADHAR_PHOTO_API}/${batchId}`)
      .data(deleteImage)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("File deleted successfully.");
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const UploadTpPhotoApi =
  (
    formData,
    batchId,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_TP_PHOTO_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getTpPhotoApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_TP_PHOTO_API}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getTpPhoto(a?.details?.tpUrls));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const deleteTpPhotoApi = (setLoading, deleteImage, batchId) => () => {
  api()
    .root(API_ROOT)
    .delete(`${DELETE_TP_PHOTO_API}/${batchId}`)
    .data(deleteImage)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        successToast("File deleted successfully.");
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      errorToast(e.message);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const UploadAttendanceApi =
  (
    formData,
    batchId,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_ATTENDANCE_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getAttendanceSheetApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_ATTENDANCE_API}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getAttendanceSheet(a?.details?.attendenceUrls));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const deleteAttendanceSheetApi =
  (setLoading, deleteImage, batchId) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_ATTENDANCE_API}/${batchId}`)
      .data(deleteImage)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("File deleted successfully.");
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const UploadToolsApi =
  (
    formData,
    batchId,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues,
    setFileList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_TOOLS_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFileList([]);
          successToast(msg);
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error.error);
        // devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getToolsPhotoApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_TOOLS_PHOTO_API}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getToolPhoto(a?.details?.toolUrls));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const deleteToolPhotoApi = (setLoading, deleteImage, batchId) => () => {
  api()
    .root(API_ROOT)
    .delete(`${DELETE_TOOLS_API}/${batchId}`)
    .data(deleteImage)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        successToast("File deleted successfully.");
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      errorToast(e.message);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const createRemarksApi =
  (
    formData,
    setLoading,
    getRetrieveImagesFromS3,
    setFormData,
    initialFormValues
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_REMARKS_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          // clearFormValues();
          successToast(msg);
          // dispatch(getDescription(a?.details?.remarks));
          getRetrieveImagesFromS3();
          setFormData(initialFormValues);
        } else {
          errorToast(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
        errorToast(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const getRemarksApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_REMARKS_API}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getDescription(a?.details?.remarks));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const downloadZipFileDocsApi = (batchId, setLoading) => (dispatch) => {
  const URL = `${GET_ZIP_FILE_ALL_DOCUMENTS}/${batchId}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        successToast(msg);
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const deleteSingleImageApi =
  (setLoading, deleteImage, batchId) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_CHECK_IN_CHECK_OUT_IMAGE_API}/${batchId}`)
      .data(deleteImage)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("File deleted successfully.");
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
export const generateAuditFilesApi =
  (setLoading, batchId, verificationTabList, setIsLink) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_VERIFICATION_AUDIT_FILE_API}/${batchId}`)
      .downloadFilename()
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast(a?.message || "Audit file generated successfully.");
          const updatedData = verificationTabList.map((item) => {
            if (item?.batchId?._id === batchId) {
              return {
                ...item,
                zipUrl: a?.details?.zipUrl,
              };
            }
            return item;
          });

          setIsLink(a?.details?.zipUrl);
          dispatch(getVerificationList(updatedData));
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const downLoadSampleVerificationApi = (setLoading) => () => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };

  fetch(`${API_ROOT}${DOWNLOAD_SAMPLE_VERIFICATION}`, {
    headers: header,
  }).then((response) => {
    if (response?.status !== 200) {
      setLoading(false);
      errorToast(response?.statusText);
    } else {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "Verification Sample Sheet";
        alink.click();
        setLoading(false);
      });
    }
  });
};

// file status API

export const changeAllFileStatusApi =
  (formValues, setLoading, getRetrieveImagesFromS3, setIsPreviewOpen) => () => {
    api()
      .root(API_ROOT)
      .put(CHANGE_FILES_STATUS_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setIsPreviewOpen(false);
          getRetrieveImagesFromS3();
        } else {
          errorToast(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
        errorToast(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const sendRemindersApi =
  (payload, setLoading, setReminderFormValues, initialFormValues) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(POST_REMINDER_DATA_API)
      .data(payload)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          dispatch(getReminderData(a?.details));
          setReminderFormValues(initialFormValues);
        } else {
          errorToast(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
        errorToast(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const getReminderDataApi =
  (setLoading, QAverificationTimeStampId, setReminderFormValues) =>
  (dispatch) => {
    const URL = `${GET_REMINDER_DATA_API}/${QAverificationTimeStampId}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          getReminderData(a?.details);
          setReminderFormValues({
            addNewMsg: "",
            reminderNo: a?.details?.reminderCount,
            oldMsg: a?.details?.content,
          });
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getVerificationFilesCount =
  (batchIds, setState, setLoading) => (dispatch) => {
    const queryParams = new URLSearchParams({
      ids: JSON.stringify(batchIds),
    }).toString();
    const URL = `${GET_VERIFICATION_FILES_COUNT}?${queryParams}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const totalFields = a.details?.totalFields;
        const data = {};
        for (const [id, count] of Object.entries(a.details?.countResult)) {
          data[id] = `${count}/${totalFields}`;
        }
        setState && setState(data);
        setLoading && setLoading(false);
      })
      .error((e) => {
        setLoading && setLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
