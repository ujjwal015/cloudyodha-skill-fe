import api from "../../utils/apiHelper.js";
import { API_ROOT } from "../../config/constants/apiConstants/auth.js";
import {
  CREATE_PROCTOR_PROFILE_API,
  DELETE_PROCTOR_PROFILE_API,
  GET_PROCTOR_LIST_API,
  GET_SPECIFIC_PROCTOR_API,
  GET_SUSPICIOUS_ACTIVITY_VIDEO_API,
  GET_SUSPISIOUS_ACTIVITY_IMAGE_API,
  POST_ACTIVITY_PRACTICAL_UPLOAD_IMAGE,
  POST_ACTIVITY_PRACTICAL_UPLOAD_VIDEO,
  POST_ACTIVITY_THEORY_UPLOAD_IMAGE,
  POST_ACTIVITY_THEORY_UPLOAD_VIDEO,
  POST_ACTIVITY_VIVA_UPLOAD_IMAGE,
  POST_ACTIVITY_VIVA_UPLOAD_VIDEO,
  POST_SUSPICIOUS_ACTIVITY_IMAGE_API,
  POST_SUSPICIOUS_ACTIVITY_VIDEO_API,
  UPDATE_PROCTOR_PROFILE_API,
  UPDATE_PROCTOR_STATUS_API,
  UPLOAD_FILES_S3_API,
} from "../../config/constants/apiConstants/superAdmin.js";
import { errorToast, successToast, warningToast } from "../../utils/projectHelper.js";
import { PROCTOR_MANAGEMENT_HOME } from "../../config/constants/routePathConstants/superAdmin.js";
import { getSpecificAssessor } from "../../redux/slicers/authSlice.js";
import { getProctorsList } from "../../redux/slicers/clientSlice.js";
import { LogOutStudentApi } from "../studentApi/index.js";

export const postSuspiciousImageActivityApi =
  (payload, candidateId, setLoading, navigate, setCapturedImages) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${POST_SUSPICIOUS_ACTIVITY_IMAGE_API}/${candidateId}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.details?.isMultiFace && a?.details?.suspiciousActivityLeft === -1) {
          warningToast("Warning: No Face / Multi Face Detected");
          dispatch(LogOutStudentApi(setLoading, navigate));
        } else if (a?.details?.isMultiFace) {
          warningToast("Warning: No Face / Multi Face Detected");
          setCapturedImages([]);
        }
      })
      .error((err) => {
        console.log(err.message);
      })
      .upload(() => {
        console.log("Uploaded");
      });
  };
export const getSuspiciousImageActivityApi = (setLoading, candidateId, setImageList, section) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_SUSPISIOUS_ACTIVITY_IMAGE_API}/${candidateId}?section=${section}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode == 200) {
        const { result } = a?.details;
        setImageList(a?.details);
      }
    })
    .error((err) => {
      errorToast(err?.message);
      setLoading && setLoading(false);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};
export const getSuspiciousVideoActivityApi = (setLoading, candidateId, setVideoList, activeTab) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_SUSPICIOUS_ACTIVITY_VIDEO_API}/${candidateId}?section=${activeTab}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode == 200) {
        const { result } = a?.details;
        setVideoList(a?.details);
      }
    })
    .error((err) => {
      errorToast(err?.message);
      setLoading && setLoading(false);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const postSuspiciousVideoActivityApi = (payload, candidateId, setLoading, setRecordedVideos) => () => {
  api()
    .root(API_ROOT)
    .post(`${POST_SUSPICIOUS_ACTIVITY_VIDEO_API}/${candidateId}`)
    .data(payload)
    .success((a) => {
      setLoading && setLoading(false);
      setRecordedVideos([]);
    })
    .error((err) => {
      console.log(err.message);
    })
    .upload(() => {
      console.log("Uploaded");
    });
};
export const updateProctorProfileApi = (payload, setLoading, clearFormValues, navigate, id) => () => {
  api()
    .root(API_ROOT)
    .put(`${UPDATE_PROCTOR_PROFILE_API}/${id}`)
    .data(payload)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        successToast(a?.message);
        clearFormValues();
        navigate(PROCTOR_MANAGEMENT_HOME);
      }
    })
    .error((err) => {
      setLoading && setLoading(false);
      errorToast(err?.error || "Something went wrong");
    })
    .upload(() => {
      setLoading && setLoading(false);
    });
};

export const getProctorsApi = (setLoading, page, limit, searchQuery, setTotalPages) => (dispatch) => {
  const URL =
    searchQuery && searchQuery !== ""
      ? `${GET_PROCTOR_LIST_API}?page=${page}&limit=${limit}&sortOrder=-1&search=${searchQuery}`
      : `${GET_PROCTOR_LIST_API}?page=${page}&limit=${limit}&sortOrder=-1`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode == 200) {
        const { result, totalPages } = a?.details;
        dispatch(getProctorsList(result));
        setTotalPages && setTotalPages(totalPages);
      }
    })
    .error((err) => {
      errorToast(err?.message);
      setLoading && setLoading(false);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const getSpecificProctorApi = (setLoading, id) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_SPECIFIC_PROCTOR_API}/${id}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode == 200) dispatch(getSpecificAssessor([a?.details]));
    })
    .error((err) => {
      setLoading && setLoading(false);
      errorToast(err?.message || "Something went wrong");
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const updateProctorApi = (payload, setLoading, clearFormValues, navigate, id) => () => {
  api()
    .root(API_ROOT)
    .put(`${UPDATE_PROCTOR_PROFILE_API}/${id}`)
    .data(payload)
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode === 200) {
        successToast("Profile Updated");
        clearFormValues();
        navigate();
      }
    })
    .error((err) => {
      setLoading && setLoading(false);
      errorToast(err?.message || "Something went wrong");
    })
    .upload(() => {
      setLoading && setLoading(false);
    });
};

export const deleteProctorApi = (setLoading, id, setDeleteModal, getList) => () => {
  api()
    .root(API_ROOT)
    .delete(`${DELETE_PROCTOR_PROFILE_API}/${id}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode == 200 || 201) {
        successToast(a?.message || "Assessor Deleted");
        setDeleteModal(false);
        getList();
      }
    })
    .error((err) => {
      setLoading && setLoading(false);
      errorToast(err?.message || "Something went wrong");
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const uploadFilesS3Api = (payload, setLoading) => () => {
  api()
    .root(API_ROOT)
    .post(UPLOAD_FILES_S3_API)
    .data(payload)
    .upload(() => {
      setLoading && setLoading(false);
    });
};

export const changeStatusProctorApi = (id, payload, setLoading, getList) => {
  api()
    .root(API_ROOT)
    .put(`${UPDATE_PROCTOR_STATUS_API}/${id}`)
    .data(payload)
    .success((a) => {
      const { message: msg = "" } = a;
      if (a.statusCode === 200) {
        successToast(msg);
        getList(setLoading);
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      const { message: msg = "" } = e;
      errorToast(msg);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const postAcitivityPracticalImageApi =
  (setLoading, payload, candidateId, batchId, formReset, getDataAfterImageUpload) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${POST_ACTIVITY_PRACTICAL_UPLOAD_IMAGE}/${candidateId}/${batchId}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        successToast(a?.message);
        getDataAfterImageUpload();
        formReset();
      })
      .error((err) => {
        setLoading && setLoading(false);
        console.log(err.message);
      })
      .upload(() => {
        console.log("Uploaded");
      });
  };

export const postAcitivityVivaImageApi =
  (setLoading, payload, candidateId, batchId, formReset, getDataAfterImageUpload) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${POST_ACTIVITY_VIVA_UPLOAD_IMAGE}/${candidateId}/${batchId}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        successToast(a?.message);
        getDataAfterImageUpload();
        formReset();
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .upload(() => {
        console.log("Uploaded");
      });
  };

  export const postAcitivityTheoryImageApi =
  (setLoading, payload, candidateId, batchId, formReset, getDataAfterImageUpload) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${POST_ACTIVITY_THEORY_UPLOAD_IMAGE}/${candidateId}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        successToast(a?.message);
        getDataAfterImageUpload();
        formReset();
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .upload(() => {
        console.log("Uploaded");
      });
  };

export const postAcitivityPracticalVideoApi =
  (setLoading, payload, candidateId, batchId, formReset, getData) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${POST_ACTIVITY_PRACTICAL_UPLOAD_VIDEO}/${candidateId}/${batchId}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        successToast(a?.message);
        getData();
        formReset();
      })
      .error((err) => {
        setLoading && setLoading(false);
        console.log(err.message);
      })
      .upload(() => {
        console.log("Uploaded");
      });
  };

  

  export const postAcitivityVivaVideoApi =
  (setLoading, payload, candidateId, batchId, formReset, getData) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${POST_ACTIVITY_VIVA_UPLOAD_VIDEO}/${candidateId}/${batchId}`)
      .data(payload)
      .success((a) => {
        successToast(a?.message);
        setLoading && setLoading(false);
        getData();
        formReset();
      })
      .error((err) => {
        setLoading && setLoading(false);
        console.log(err.message);
      })
      .upload(() => {
        console.log("Uploaded");
      });
  };

  export const postAcitivityTheoryVideoApi =
  (setLoading, payload, candidateId, batchId, formReset, getData) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${POST_ACTIVITY_THEORY_UPLOAD_VIDEO}/${candidateId}`)
      .data(payload)
      .success((a) => {
        successToast(a?.message);
        setLoading && setLoading(false);
        getData();
        formReset();
      })
      .error((err) => {
        setLoading && setLoading(false);
        console.log(err.message);
      })
      .upload(() => {
        console.log("Uploaded");
      });
  };

