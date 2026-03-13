import api from "../../utils/apiHelper.js";
import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  BULK_UPLOAD_PROCTORS_API,
  CREATE_PROCTOR_PROFILE_API,
  DELETE_PROCTOR_PROFILE_API,
  GET_BULK_UPLOAD_SAMPLE_PROCTOR_API,
  GET_PROCTOR_LIST_API,
  GET_SPECIFIC_PROCTOR_API,
  UPDATE_PROCTOR_PROFILE_API,
  UPDATE_PROCTOR_STATUS_API,
  UPLOAD_FILES_S3_API,
} from "../../config/constants/apiConstants/superAdmin.js";
import {
  errorToast,
  getLocal,
  successToast,
} from "../../utils/projectHelper.js";
import { PROCTOR_MANAGEMENT_HOME } from "../../config/constants/routePathConstants/superAdmin.js";
import { getSpecificAssessor } from "../../redux/slicers/authSlice.js";
import { getProctorsList } from "../../redux/slicers/clientSlice.js";
import { DOWNLOAD_CANDIDATE_LOGS_BY_BATCH_ID, DOWNLOAD_CANDIDATE_LOGS_BY_CANDIDATE_ID, UPLOAD_CANDIDATE_PRACTICAL_IMAGE_LOGS_BY_BATCH_ID, UPLOAD_CANDIDATE_PRACTICAL_VIDEO_LOGS_BY_BATCH_ID } from "../../config/constants/apiConstants/proctor.js";
import { getSuspiciousImageActivityApi, getSuspiciousVideoActivityApi } from "./suspicousActivityManagementApi.js";

export const createProctorProfileApi =
  (payload, setLoading, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .post(CREATE_PROCTOR_PROFILE_API)
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
export const updateProctorProfileApi =
  (payload, setLoading, clearFormValues, navigate, id) => () => {
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

export const getProctorsApi =
  (
    setLoading,
    page,
    limit,
    searchQuery,
    setTotalPages,
    formValues,
    setIsFilterApplied
  ) =>
  (dispatch) => {
    const { modeofAgreement_filter, agreementSigned, from, to } = formValues;
    const PAGINATE = `page=${page}&limit=${limit}`;
    const SEARCH = `&search=${searchQuery}`;
    const FORM_VALUES = `&modeofAgreement=${formValues?.modeofAgreement_filter}&agreementSigned=${formValues?.agreementSigned}&from=${formValues?.from}&to=${formValues?.to}`;
    const FILTERED =
      modeofAgreement_filter || agreementSigned || from || to
        ? `${GET_PROCTOR_LIST_API}?${PAGINATE}${FORM_VALUES}`
        : `${GET_PROCTOR_LIST_API}?${PAGINATE}`;
    const FULL_URL = `${FILTERED}${SEARCH}`;
    const DEFAULT = `${FILTERED}`;
    const COMBINED_URL = searchQuery ? FULL_URL : DEFAULT;

    api()
      .root(API_ROOT)
      .get(COMBINED_URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode == 200) {
          const { result, totalPages } = a?.details;
          dispatch(getProctorsList(result));
          setTotalPages && setTotalPages(totalPages);
          if (modeofAgreement_filter || agreementSigned || from || to)
            setIsFilterApplied && setIsFilterApplied(true);
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

export const updateProctorApi =
  (payload, setLoading, clearFormValues, navigate, id) => () => {
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

export const deleteProctorApi =
  (setLoading, id, setDeleteModal, getList) => () => {
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

export const changeStatusProctorApi =
  (id, payload, setLoading, getList) => () => {
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

export const getSampleExcelProctorApi = () => (dispatch) => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };

  fetch(`${API_ROOT}${GET_BULK_UPLOAD_SAMPLE_PROCTOR_API}`, {
    headers: header,
  }).then((response) => {
    if (response?.status !== 200) {
      errorToast(response?.statusText);
    } else {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "Proctor bulk upload";
        alink.click();
      });
    }
  });
};

export const postProctorBulkUploadAdminApi =
  (formData, setLoading, setFormValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(BULK_UPLOAD_PROCTORS_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a?.statusCode === 200) {
          setFormValues(null);
          successToast(msg);
          navigate(PROCTOR_MANAGEMENT_HOME);
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

export const downloadCandidateLogsByBatchId =
(batchId, setLoading) => async(dispatch) => {
  try{
    api()
    .root(API_ROOT)
    .get(`${DOWNLOAD_CANDIDATE_LOGS_BY_BATCH_ID}/${batchId}`)
    .success((a) => {
      setLoading && setLoading(false);
      successToast("Download started");
    })
    .downloadZip(`candidate_logs_${batchId}.zip`)
    .error((e) => {
      setLoading && setLoading(false);
      errorToast(e.message);
    })
    .send();
  }
  catch(error){
    errorToast(error.message);
    setLoading && setLoading(false);
  }
};

export const downloadCandidateLogsByCandidateId =
  (candidateId, setLoading) => async (dispatch) => {
    setLoading && setLoading(true);
    try {
      api()
        .root(API_ROOT)
        .get(`${DOWNLOAD_CANDIDATE_LOGS_BY_CANDIDATE_ID}/${candidateId}`)
        .downloadZip(`candidate_logs_${candidateId}.zip`)
        .success((a) => {
          successToast("Download started.");
          setLoading && setLoading(false);
        })
        .error((e) => {
          setLoading && setLoading(false);
          errorToast(e.message);
        })
        .send();
    } catch (error) {
      errorToast(error.message);
      setLoading && setLoading(false);
    }
  };

export const uploadCandidateImageLogsByBatchId =
  (batchId, candidateId, formData, setLoading, setImageList, section) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_CANDIDATE_PRACTICAL_IMAGE_LOGS_BY_BATCH_ID}/${candidateId}/${batchId}`)
      .data(formData)
      .success((a) => {
        setLoading && setLoading(false);
        dispatch(getSuspiciousImageActivityApi(setLoading, candidateId, setImageList, section));
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .upload(() => {
        setLoading && setLoading(false);
      });
  };

export const uploadCandidateVideoLogsByBatchId =
  (batchId, candidateId, formData, setLoading, setVideoList, section) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_CANDIDATE_PRACTICAL_VIDEO_LOGS_BY_BATCH_ID}/${candidateId}/${batchId}`)
      .data(formData)
      .success((a) => {
        setLoading && setLoading(false);
        dispatch(getSuspiciousVideoActivityApi(setLoading, candidateId, setVideoList, section));
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .upload(() => {
        setLoading && setLoading(false);
      });
  };


  

