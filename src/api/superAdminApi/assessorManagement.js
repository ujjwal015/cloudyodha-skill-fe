import api from "../../utils/apiHelper.js";
import {
  API_ROOT,
  DOWNLOAD_ASSESSOR_CV,
  GET_ASSESSOR_PASSWORD,
  MASTER_EXPORT_CVS,
} from "../../config/constants/apiConstants/auth";
import {
  ACCEPT_REJECT_BATCH_API,
  ACCEPT_REJECT_DOCUMENT_ASSESSOR_API,
  BATCH_ACCESSOR_LIST_API,
  BATCH_EXAM_CENTER_LIST_API,
  BATCH_JOB_ROLE_LIST_API,
  BATCH_QUESTION_BANK_LIST_API,
  CHANGE_STATUS_ASSESSOR_API,
  CREATE_ASSESSOR_FORM_API,
  CREATE_BASICINFO_ASSESSOR_API,
  DELETE_AGREEMENT_ASSESSOR_API,
  DELETE_ASSESSOR_FORM_API,
  DELETE_ASSESSOR_PERSONAL_DETAILS_API,
  DELETE_EDUCATION_ASSESSOR_API,
  DELETE_EXPERIENCE_ASSESSOR_API,
  DELETE_JOBROLE_ASSESSOR_API,
  EDIT_ASSESSOR_DETAILS_API,
  GET_ASSESSED_BATCH_LIST_API,
  GET_AGREEMENT_ASSESSOR_API,
  GET_ASSESSOR_ATTENDANCE_LIST_API,
  GET_ASSESSOR_ATTENDANCE_REQUEST_LIST_API,
  GET_ASSESSOR_LIST_API,
  GET_ASSESSOR_PERSONAL_DETAILS_API,
  GET_BANKDETAILS_ASSESSOR_API,
  GET_BASICINFO_ASSESSOR_API,
  GET_EDUCATION_ASSESSOR_API,
  GET_EXPERIENCE_ASSESSOR_API,
  GET_JOBROLE_ASSESSOR_API,
  GET_SINGLE_ASSESSOR_BATCH_WISE_ATTENDANCE_LIST_API,
  GET_SINGLE_ASSESSOR_DETAILS_API,
  POST_ASSESSOR_PERSONAL_DETAILS_API,
  UPDATE_AGREEMENT_ASSESSOR_API,
  UPDATE_ASSESSOR_ATTENDANCE_REQUEST_API,
  UPDATE_ASSESSOR_PERSONAL_DETAILS_API,
  UPDATE_BASICINFO_ASSESSOR_API,
  UPDATE_EDUCATION_ASSESSOR_API,
  UPDATE_EXPERIENCE_ASSESSOR_API,
  UPDATE_JOBROLE_ASSESSOR_API,
  UPLOAD_AGREEMENT_ASSESSOR_API,
  UPLOAD_BANKDETAILS_ASSESSOR_API,
  UPLOAD_EDUCATION_ASSESSOR_API,
  UPLOAD_EXPERIENCE_ASSESSOR_API,
  UPLOAD_FILES_S3_API,
  UPLOAD_JOBROLE_ASSESSOR_API,
  GET_BULK_UPLOAD_ASSESSOR_API,
  POST_BULK_UPLOAD_ASSESSOR_API,
  UNLOCK_ASSESSOR_ACCOUNT_API,
  UNLOCK_ASSESSOR_OTP_LOCKOUT_API,
} from "../../config/constants/apiConstants/superAdmin.js";
import {
  errorToast,
  getLocal,
  successToast,
} from "../../utils/projectHelper.js";
import { ASSESSOR_MANAGEMENT_HOME } from "../../config/constants/routePathConstants/superAdmin.js";
import {
  getAssessedBatchList,
  getAssessorList,
  getBatchAcceptRejectList,
  getSpecificAssessor,
} from "../../redux/slicers/authSlice.js";
import {
  getAssessorAttendanceList,
  getAssessorAttendanceRequest,
  getAttendanceBatchWise,
  getExperienceDetails,
  getAssessorAgreementDetails,
  getAssessorBasicDetails,
  getAssessorEducationDetails,
  getAssessorExperienceDetails,
  getAssessorPersonalDetails,
  getAssessorTrainingDetails,
  getEducationDetails,
  getAgreementDetails,
  jobrolesDetails,
  getAssessorBankDetails,
} from "../../redux/slicers/superAdmin/assessorAttendanceSlice.js";

export const createAssessorProfileApi =
  (payload, setLoading, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .post(CREATE_ASSESSOR_FORM_API)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast(a?.message);
          clearFormValues();
          navigate(ASSESSOR_MANAGEMENT_HOME);
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
export const updateAssessorProfileApi =
  (payload, setLoading, clearFormValues, navigate, id) => () => {
    api()
      .root(API_ROOT)
      .put(`${EDIT_ASSESSOR_DETAILS_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast(a?.message);
          clearFormValues();
          navigate(ASSESSOR_MANAGEMENT_HOME);
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

export const getAssessorsApi =
  (
    setLoading,
    page,
    limit,
    searchQuery,
    setTotalPages,
    formValues,
    section,
    setIsFilterApplied,
    assessorType="",
    assessorManagementFromDashboard={}
  ) =>
  (dispatch) => {
    const {
      modeofAgreement_filter,
      agreementSigned,
      from,
      to,
      state,
      schemeType,
      clientId,

    } = formValues;
    const PAGINATE = `page=${page}&limit=${limit}`;
    const SEARCH = `&search=${searchQuery}`;
    let FORM_VALUES = "";
    
    if (modeofAgreement_filter) {
      FORM_VALUES += `&modeofAgreement=${modeofAgreement_filter}`;
    }
    if (agreementSigned) {
      FORM_VALUES += `&agreementSigned=${agreementSigned}`;
    }
    if (from) {
      FORM_VALUES += `&from=${from}`;
    }
    if (to) {
      FORM_VALUES += `&to=${to}`;
    }
    if (state) {
      FORM_VALUES += `&state=${state}`;
    }
    if (schemeType) {
      FORM_VALUES += `&schemeType=${schemeType}`;
    }
    if (clientId) {
      FORM_VALUES += `&clientId=${clientId}`;
    }
    const SECTION = `&${section}=true`;

    const FILTERED = FORM_VALUES
      ? `${GET_ASSESSOR_LIST_API}?${PAGINATE}${SECTION}${FORM_VALUES}`
      : `${GET_ASSESSOR_LIST_API}?${PAGINATE}${SECTION}`;
    const FULL_URL = `${FILTERED}${SEARCH}`;
    const DEFAULT = `${FILTERED}`;

     const COMBINED_URL = searchQuery ? FULL_URL : DEFAULT;
    let New_URL=COMBINED_URL

    if(assessorType){
      New_URL=`${New_URL}&assessorType=${assessorType}`
    }

     if(assessorManagementFromDashboard?.dashboardClient){
      New_URL=`${New_URL}&dashboardClient=true`;
    }

    api()
      .root(API_ROOT)
      .get(New_URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (FORM_VALUES) setIsFilterApplied && setIsFilterApplied(true);
        if (a?.statusCode == 200) {
          const { result, totalPages } = a?.details;
          dispatch(getAssessorList(result));
          setTotalPages && setTotalPages(totalPages);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getSpecificAssessorApi = (setLoading, id) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_SINGLE_ASSESSOR_DETAILS_API}/${id}`)
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

export const updateAssessorApi =
  (payload, setLoading, clearFormValues, navigate, id) => () => {
    api()
      .root(API_ROOT)
      .put(`${EDIT_ASSESSOR_DETAILS_API}/${id}`)
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

export const deleteAssesorApi =
  (setLoading, id, setDeleteModal, getList) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_ASSESSOR_FORM_API}/${id}`)
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

export const changeStatusAssessorApi =
  (id, payload, setLoading, getList) => () => {
    api()
      .root(API_ROOT)
      .put(`${CHANGE_STATUS_ASSESSOR_API}/${id}`)
      .data(payload)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          successToast(msg);
          getList();
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

export const unlockAssessorAccountApi =
  (id, setLoading, getList) => () => {
    api()
      .root(API_ROOT)
      .put(`${UNLOCK_ASSESSOR_ACCOUNT_API}/${id}`)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          successToast(msg);
          getList();
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

export const unlockAssessorOtpLockoutApi =
  (assessorId, setLoading, getList) => () => {
    api()
      .root(API_ROOT)
      .post(`${UNLOCK_ASSESSOR_OTP_LOCKOUT_API}/${assessorId}`)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          successToast(msg);
          getList();
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

// Assessor-Attendance

export const getAssessorAttendanceListApi =
  (setLoading, page, searchQuery, limit, setTotalPages) => (dispatch) => {
    const URL =
      searchQuery && searchQuery !== ""
        ? `${GET_ASSESSOR_ATTENDANCE_LIST_API}?search=${searchQuery}&page=${page}&limit=${limit}&verified=${true}`
        : `${GET_ASSESSOR_ATTENDANCE_LIST_API}?page=${page}&limit=${limit}&verified=${true}`;
    api()
      .root(API_ROOT)
      .get(`${URL}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getAssessorAttendanceList(a?.details.result));
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getAssessorAttendanceBatchWiseApi =
  (setLoading, assessorId = null, page, searchQuery, limit, totalPagesUser) =>
  (dispatch) => {
    const URL =
      searchQuery && searchQuery !== ""
        ? `${GET_SINGLE_ASSESSOR_BATCH_WISE_ATTENDANCE_LIST_API}?search=${searchQuery}&page=${page}&limit=${limit}`
        : `${GET_SINGLE_ASSESSOR_BATCH_WISE_ATTENDANCE_LIST_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(`${URL}&assesor_id=${assessorId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          dispatch(getAttendanceBatchWise(a?.details?.attendanceList));
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getAssessorAttendanceRequestApi =
  (setLoading, actionId, searchQuery, getMarkedAttendanceLocation) =>
  (dispatch) => {
    const URL =
      searchQuery && searchQuery !== ""
        ? `${GET_ASSESSOR_ATTENDANCE_REQUEST_LIST_API}?search=${searchQuery}`
        : `${GET_ASSESSOR_ATTENDANCE_REQUEST_LIST_API}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          dispatch(
            getAssessorAttendanceRequest(
              a?.details?.updatedAttendenceRequestList
            )
          );
          // getMarkedAttendanceLocation(lat, lang);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const updateAssessorAttendanceRegularizeApi =
  (setLoading, id, payload, getList, setShowRightSide) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_ASSESSOR_ATTENDANCE_REQUEST_API}/${id}`)
      .data(payload)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          successToast(msg);
          setShowRightSide(false);
          getList();
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

// New Design and Flow of Assessor Onboarding ->
export const createAssessorBasicInfoApi =
  (payload, setLoading, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .post(CREATE_BASICINFO_ASSESSOR_API)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          // clearFormValues();
          localStorage.setItem("bscInf_AsR", a?.details?._id);
          navigate(1);
        }
      })
      .error((e) => {
        setLoading(false);
        const { error } = e;
        errorToast(error);
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const uploadAssessorExperienceApi =
  (
    payload,
    setLoading,
    id,
    navigate,
    clearFormValues,
    setOpenExp,
    setSelectedFiles
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_EXPERIENCE_ASSESSOR_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          // navigate(1);
          setOpenExp(false);
          setSelectedFiles([]);
          setLoading(true);

          dispatch(getAssessorExperienceDetailsApi(setLoading, id));
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getAssessorExperienceDetailsApi =
  (setLoading, id) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_EXPERIENCE_ASSESSOR_API}/${id}`)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { uploadedFiles } = a.details;
          dispatch(getExperienceDetails(uploadedFiles));
        }
      })
      .error((err) => {
        setLoading(false);
        const { message } = err;
        // errorToast(message);
        dispatch(getExperienceDetails([]));
      })
      .send(() => {
        setLoading(false);
      });
  };

export const updateAssessorExperienceApi =
  (
    payload,
    setLoading,
    id,
    navigate,
    clearFormValues,
    setOpenExp,
    setSelectedFiles,
    expID,
    setItemID
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(
        `${UPDATE_EXPERIENCE_ASSESSOR_API}?assessor_id=${id}&IdToUpdate=${expID}`
      )
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          setOpenExp(false);
          setSelectedFiles([]);
          setLoading(true);
          dispatch(getAssessorExperienceDetailsApi(setLoading, id));
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
        setOpenExp(false);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const deleteAssessorExperienceApi =
  (
    setLoading,
    assessorMDBId,
    itemID,
    setOpenExp,
    getList,
    clearFormValues,
    setItemID
  ) =>
  () => {
    api()
      .root(API_ROOT)
      .delete(
        `${DELETE_EXPERIENCE_ASSESSOR_API}?assesor_id=${assessorMDBId}&experienceId=${itemID}`
      )
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode == 200 || 201) {
          successToast(a?.message || "Deleted");
          setOpenExp(false);
          getList();
          clearFormValues();
          setItemID(null);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        // errorToast(err?.message || "Something went wrong");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const viewAllAssessorDetailsApi =
  (id, setLoading) => async (dispatch) => {
    try {
      // Use Promise.all to call multiple APIs concurrently
      const [
        api1Response,
        api2Response,
        api3Response,
        api4Response,
        api5Response,
        api6Response,
        api7Response,
      ] = await Promise.all([
        getBasicDetails(id, setLoading),
        getPersonalDetails(id),
        educationDetails(id),
        experienceDetails(id),
        agreementDetails(id),
        trainingDetails(id),
        getBankDetailsApi(id),
      ]);

      // Handle the responses as needed
      if (api1Response.statusCode === 200) {
        dispatch(getAssessorBasicDetails(api1Response?.details));
      }
      if (api2Response.statusCode === 200) {
        dispatch(getAssessorPersonalDetails(api2Response?.details));
      }
      if (api3Response.statusCode === 200) {
        dispatch(
          getAssessorEducationDetails(api3Response?.details?.uploadedFiles)
        );
      }
      if (api4Response.statusCode === 200) {
        dispatch(
          getAssessorExperienceDetails(api4Response?.details?.uploadedFiles)
        );
      }
      if (api5Response.statusCode === 200) {
        dispatch(
          getAssessorAgreementDetails(api5Response?.details?.uploadedFiles)
        );
      }
      if (api6Response.statusCode === 200) {
        dispatch(
          getAssessorTrainingDetails(api6Response?.details?.uploadedFiles)
        );
      }
      if (api7Response.statusCode === 200) {
        dispatch(getAssessorBankDetails(api7Response?.details));
      }

      // Handle errors if necessary
    } catch (error) {
      console.error(error);
    }
  };

// Define separate functions for each API call
const getBasicDetails = async (id, setLoading) => {
  let data;
  let GET_ASSESSOR_BASIC_DETAILS = `api/getAssesor-profileList/${id}`;
  await api()
    .root(API_ROOT)
    .get(GET_ASSESSOR_BASIC_DETAILS)
    .success((res) => {
      data = res;
      setLoading && setLoading(false);
    })
    .error(() => {
      setLoading && setLoading(false);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
  return data;
};
const getPersonalDetails = async (id) => {
  let data;
  let PERSONAL_DETAILS_API = `api/getAssesor-personalDetailList/${id}`;
  await api()
    .root(API_ROOT)
    .get(PERSONAL_DETAILS_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};
const educationDetails = async (id) => {
  let data;
  let PERSONAL_DETAILS_API = `api/getAssesor-educationList/${id}`;
  await api()
    .root(API_ROOT)
    .get(PERSONAL_DETAILS_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};
const experienceDetails = async (id) => {
  let data;
  let EXPERIENCE_DETAILS_API = `api/getAssesor-experienceList/${id}`;
  await api()
    .root(API_ROOT)
    .get(EXPERIENCE_DETAILS_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};
const agreementDetails = async (id) => {
  let data;
  let AGREEMENT_DETAILS_API = `api/getAssesor-agreementList/${id}`;
  await api()
    .root(API_ROOT)
    .get(AGREEMENT_DETAILS_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};
const trainingDetails = async (id) => {
  let data;
  let AGREEMENT_DETAILS_API = `api/getAssesor-jobRoleDetailList/${id}`;
  await api()
    .root(API_ROOT)
    .get(AGREEMENT_DETAILS_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};

const getBankDetailsApi = async (id) => {
  let data;
  let BANK_DETAILS_API = `api/getAssesor-BankDetailList/${id}`;
  await api()
    .root(API_ROOT)
    .get(BANK_DETAILS_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};

export const acceptRejectAssessorDocumentApi =
  (setLoading, payload, refresh) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(ACCEPT_REJECT_DOCUMENT_ASSESSOR_API)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a?.statusCode === 200) {
          const { message } = a;
          successToast(message);
          refresh();
        }
      })
      .error((err) => {
        setLoading(false);
        const { message } = err;
        errorToast(message);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const getAssessorEducationDetailsApi =
  (setLoading, id) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_EDUCATION_ASSESSOR_API}/${id}`)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { uploadedFiles } = a.details;
          dispatch(getEducationDetails(uploadedFiles));
        }
      })
      .error((err) => {
        setLoading(false);
        const { message } = err;
        dispatch(getEducationDetails([]));
        errorToast(message);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const uploadAssessorEducationApi =
  (
    payload,
    setLoading,
    id,
    navigate,
    clearFormValues,
    setOpenExp,
    setSelectedFiles
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_EDUCATION_ASSESSOR_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          setOpenExp(false);
          setSelectedFiles([]);
          setLoading(true);
          const asRId = localStorage.getItem("bscInf_AsR");
          dispatch(getAssessorEducationDetailsApi(setLoading, id));
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const deleteAssessorEducationeApi =
  (
    setLoading,
    assessorMDBId,
    itemID,
    setOpenExp,
    getList,
    clearFormValues,
    setItemID
  ) =>
  () => {
    api()
      .root(API_ROOT)
      .delete(
        `${DELETE_EDUCATION_ASSESSOR_API}?assesor_id=${assessorMDBId}&education_id=${itemID}`
      )
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode == 200 || 201) {
          successToast(a?.message || "Deleted");
          setOpenExp(false);
          getList();
          clearFormValues();
          setItemID(null);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        // errorToast(err?.message || "Something went wrong");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const updateAssessorEducationApi =
  (
    payload,
    setLoading,
    id,
    navigate,
    clearFormValues,
    setOpenExp,
    setSelectedFiles,
    itemID
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(
        `${UPDATE_EDUCATION_ASSESSOR_API}?assessor_id=${id}&education_id=${itemID}`
      )
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          setOpenExp(false);
          setSelectedFiles([]);
          setLoading(true);
          dispatch(getAssessorEducationDetailsApi(setLoading, id));
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
        setOpenExp(false);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const uploadAssessorAgreementApi =
  (
    payload,
    setLoading,
    id,
    navigate,
    clearFormValues,
    setOpenExp,
    setSelectedFiles
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_AGREEMENT_ASSESSOR_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          setOpenExp(false);
          setSelectedFiles([]);
          setLoading(true);
          const asRId = localStorage.getItem("bscInf_AsR");
          dispatch(getAssessorAgreementDetailsApi(setLoading, id));
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getAssessorAgreementDetailsApi =
  (setLoading, id) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_AGREEMENT_ASSESSOR_API}/${id}`)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { uploadedFiles } = a.details;
          dispatch(getAgreementDetails(uploadedFiles));
        }
      })
      .error((err) => {
        setLoading(false);
        const { message } = err;
        dispatch(getAgreementDetails([]));
        errorToast(message);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const deleteAssessorAgreementApi =
  (
    setLoading,
    assessorMDBId,
    itemID,
    setOpenExp,
    getList,
    clearFormValues,
    setItemID
  ) =>
  () => {
    api()
      .root(API_ROOT)
      .delete(
        `${DELETE_AGREEMENT_ASSESSOR_API}?assesor_id=${assessorMDBId}&agreement_id=${itemID}`
      )
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode == 200 || 201) {
          successToast(a?.message || "Deleted");
          setOpenExp(false);
          getList();
          clearFormValues();
          setItemID(null);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        // errorToast(err?.message || "Something went wrong");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const updateAssessorAgreementApi =
  (
    payload,
    setLoading,
    id,
    navigate,
    clearFormValues,
    setOpenExp,
    setSelectedFiles,
    itemID
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(
        `${UPDATE_AGREEMENT_ASSESSOR_API}?assessor_id=${id}&agreement_id=${itemID}`
      )
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          setOpenExp(false);
          setSelectedFiles([]);
          setLoading(true);
          dispatch(getAssessorAgreementDetailsApi(setLoading, id));
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
        setOpenExp(false);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const uploadAssessorJobroleApi =
  (
    payload,
    setLoading,
    id,
    navigate,
    clearFormValues,
    setOpenExp,
    setSelectedFiles
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_JOBROLE_ASSESSOR_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          setOpenExp(false);
          setSelectedFiles([]);
          setLoading(true);
          const asRId = localStorage.getItem("bscInf_AsR");
          dispatch(getAssessorJobrolesDetailsApi(setLoading, id));
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const getAssessorJobrolesDetailsApi = (setLoading, id) => (dispatch) => {
  dispatch(jobrolesDetails([]));
  api()
    .root(API_ROOT)
    .get(`${GET_JOBROLE_ASSESSOR_API}/${id}`)
    .success((a) => {
      setLoading(false);
      if (a.statusCode === 200) {
        const { uploadedFiles } = a.details;
        dispatch(jobrolesDetails(uploadedFiles));
      }
    })
    .error((err) => {
      setLoading(false);
      const { message } = err;
      dispatch(jobrolesDetails([]));
      errorToast(message);
    })
    .send(() => {
      setLoading(false);
    });
};
export const deleteAssessorJobroleApi =
  (
    setLoading,
    assessorMDBId,
    itemID,
    setOpenExp,
    getList,
    clearFormValues,
    setItemID
  ) =>
  () => {
    api()
      .root(API_ROOT)
      .delete(
        `${DELETE_JOBROLE_ASSESSOR_API}?assesor_id=${assessorMDBId}&jobrole_id=${itemID}`
      )
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode == 200 || 201) {
          successToast(a?.message || "Deleted");
          setOpenExp(false);
          getList();
          clearFormValues();
          setItemID(null);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        // errorToast(err?.message || "Something went wrong");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const updateAssessorJobroleApi =
  (
    payload,
    setLoading,
    id,
    navigate,
    clearFormValues,
    setOpenExp,
    setSelectedFiles,
    itemID
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(
        `${UPDATE_JOBROLE_ASSESSOR_API}?assessor_id=${id}&jobrole_id=${itemID}`
      )
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          setOpenExp(false);
          setSelectedFiles([]);
          setLoading(true);
          // const asRId = localStorage.getItem("bscInf_AsR");
          dispatch(getAssessorJobrolesDetailsApi(setLoading, id));
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
        setOpenExp(false);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const createAssessorPersonalDetailsApi =
  (setLoading, id, payload, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .post(`${POST_ASSESSOR_PERSONAL_DETAILS_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          navigate(2);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const updateAssessorBankDetailsApi =
  (setLoading, id, payload, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .put(`${UPLOAD_BANKDETAILS_ASSESSOR_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          navigate(ASSESSOR_MANAGEMENT_HOME);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const createAssessorBankDetailsApi =
  (setLoading, id, payload, clearFormValues, navigate, edit) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${UPLOAD_BANKDETAILS_ASSESSOR_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          !edit && clearFormValues();
          dispatch(getAssessorBankDetailsApi(id));
          // handleClearScheme()
          navigate(ASSESSOR_MANAGEMENT_HOME);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
      })
      .send(() => {
        setLoading(false);
      });
  };

// APIS for editing assessor profile=>
export const getAssessorBasicDetailsApi =
  (setLoading, id, setFormValues, setFormattedDistrictList) => (dispatch) => {
    // dispatch(jobrolesDetails([]));
    api()
      .root(API_ROOT)
      .get(`${GET_BASICINFO_ASSESSOR_API}/${id}`)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { details } = a;
          const tempCity = {
            label: details?.district,
            value: details?.district,
          };
          setFormattedDistrictList([tempCity]);
          const normalizedDetails = {
          ...details,
          sector: Array.isArray(details?.sector)
            ? details.sector.map(item => ({
                _id: item?._id,
                value: item?.sectorId,
                label: item?.sectorName,
                jobRoleId: item?.sectorId,
                jobRoleLabel: item?.sectorName,
              }))
            : []
        };

        dispatch(getAssessorBasicDetails(normalizedDetails));
        }
      })
      .error((err) => {
        setLoading(false);
        const { message } = err;
        // dispatch(jobrolesDetails([]));
        errorToast(message);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const updateAssessorBasicInfoApi =
  (payload, setLoading, clearFormValues, navigate, id) => () => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_BASICINFO_ASSESSOR_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          clearFormValues();
          navigate(1);
        }
      })
      .error((e) => {
        setLoading(false);
        const { error } = e;
        errorToast(error);
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const getAssessorPersonalDetailsApi =
  (id, setFormValues) => (dispatch) => {
    dispatch(getAssessorPersonalDetails([]));
    api()
      .root(API_ROOT)
      .get(`${GET_ASSESSOR_PERSONAL_DETAILS_API}/${id}`)
      .success((a) => {
        // setLoading(false);
        if (a.statusCode === 200) {
          const { details, error } = a;
          if (details?.length > 0) {
            dispatch(getAssessorPersonalDetails(details));
            setFormValues([...details]);
          } else dispatch(getAssessorPersonalDetails([]));
        }
      })
      .error((err) => {
        // setLoading(false);
        const { message } = err;
        errorToast(message);
      })
      .send(() => {
        // setLoading(false);
      });
  };
export const updateAssessorPersonalDetailsApi =
  (setLoading, id, payload, clearFormValues, navigate, pId) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(
        `${UPDATE_ASSESSOR_PERSONAL_DETAILS_API}?assessor_id=${id}&personal_id=${pId}`
      )
      .data(payload)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          const { message } = a;
          successToast(message);
          // clearFormValues();
          navigate(2);
          dispatch(viewAllAssessorDetailsApi(id));
        }
      })
      .error((e) => {
        setLoading(false);
        const { message } = e;
        errorToast(message);
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const deleteAssessorPersonalDetailsApi =
  (setLoading, assessorMDBId, itemID) => (dispatch) => {
    api()
      .root(API_ROOT)
      .delete(
        `${DELETE_ASSESSOR_PERSONAL_DETAILS_API}?assesor_id=${assessorMDBId}&personal_id=${itemID}`
      )
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode == 200 || 201) {
          successToast(a?.message || "Deleted");
          dispatch(getAssessorPersonalDetailsApi(assessorMDBId));
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
export const getAssessorBankDetailsApi = (id) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_BANKDETAILS_ASSESSOR_API}/${id}`)
    .success((a) => {
      if (a.statusCode === 200) {
        const { details } = a;
        dispatch(getAssessorBankDetails(details));
      }
    })
    .error((err) => {
      const { message } = err;
      errorToast(message);
    })
    .send(() => {});
};

export const getBatchAcceptRejectApi =
  (setLoading, page, limit, searchQuery, setTotalPages, formValues, section) =>
  (dispatch) => {
    let hasSection =
      section === "Accepted"
        ? true
        : section === "Rejected"
        ? false
        : section === "Pending"
        ? "pending"
        : "";
    const PAGINATE = `page=${page}&limit=${limit}`;
    const SEARCH = `&search=${searchQuery}`;
    const SECTION = `&isAccept=${hasSection}`;
    const FILTERED = `${ACCEPT_REJECT_BATCH_API}?${PAGINATE}${SECTION}`;
    const FULL_URL = `${FILTERED}${SEARCH}`;
    const DEFAULT = `${FILTERED}`;
    const COMBINED_URL = searchQuery ? FULL_URL : DEFAULT;

    api()
      .root(API_ROOT)
      .get(COMBINED_URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode == 200) {
          const { BatchList, totalPages } = a?.details;
          dispatch(getBatchAcceptRejectList(BatchList));
          setTotalPages && setTotalPages(totalPages);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getAssessedBatchListApi =
  (
    setLoading,
    page,
    limit,
    searchQuery,
    setTotalPages,
    formValues,
    section,
    setIsFilterApplied
  ) =>
  (dispatch) => {
    // let hasSection = section === "pending" ? true : false;

    // const URL =
    //   searchQuery && searchQuery !== ""
    //     ? `${GET_ASSESSED_BATCH_LIST_API}?page=${page}&limit=${limit}&search=${searchQuery}&isStatus=${section}`
    //     : `${GET_ASSESSED_BATCH_LIST_API}?page=${page}&limit=${limit}&isStatus=${section}`;

    // const FILTER_URL = `${GET_ASSESSED_BATCH_LIST_API}?page=${page}&limit=${limit}&isStatus=${section}`;

    const { modeofAgreement_filter, agreementSigned, from, to } = formValues;
    const PAGINATE = `page=${page}&limit=${limit}`;
    const SEARCH = `&search=${searchQuery}`;
    const FORM_VALUES = `&modeofAgreement=${formValues?.modeofAgreement_filter}&agreementSigned=${formValues?.agreementSigned}&from=${formValues?.from}&to=${formValues?.to}`;
    const SECTION = `&isStatus=${section}`;
    const FILTERED =
      modeofAgreement_filter || agreementSigned || from || to
        ? `${GET_ASSESSED_BATCH_LIST_API}?${PAGINATE}${SECTION}${FORM_VALUES}`
        : `${GET_ASSESSED_BATCH_LIST_API}?${PAGINATE}${SECTION}`;
    const FULL_URL = `${FILTERED}${SEARCH}`;
    const DEFAULT = `${FILTERED}`;
    const COMBINED_URL = searchQuery ? FULL_URL : DEFAULT;

    api()
      .root(API_ROOT)
      .get(COMBINED_URL)
      .success((a) => {
        if (modeofAgreement_filter || agreementSigned || from || to)
          setIsFilterApplied(true);
        setLoading && setLoading(false);
        if (a?.statusCode == 200) {
          const { batchList, totalPages } = a?.details;
          dispatch(getAssessedBatchList(batchList));
          setTotalPages && setTotalPages(totalPages);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

//Bulk upload assessor API's

export const getSampleExcelAdminApi = () => (dispatch) => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };

  fetch(`${API_ROOT}${GET_BULK_UPLOAD_ASSESSOR_API}`, {
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
        alink.download = "Assessor bulk upload";
        alink.click();
      });
    }
  });
};

export const postAssessorBulkUploadAdminApi =
  (formData, setLoading, setFormValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(POST_BULK_UPLOAD_ASSESSOR_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a?.statusCode === 200) {
          setFormValues(null);
          successToast(msg);
          navigate(-1);
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



  export const getPasswordAssessorAPI = (setLoading, _id) => (dispatch) => {
    const URL = `${GET_ASSESSOR_PASSWORD}/${_id}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          // const { totalPages, deviceDetails } = a.details;
          // dispatch(getPasswordAssessor());
          // dispatch(getDeviceLists(deviceDetails));
          // setTotalPages && setTotalPages(totalPages);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { message: msg = "" } = e;
        // devConsoleLog(e);
      })
    .send(() => {
      setLoading && setLoading(false);
    });
};

// Download CV API
export const downloadAssessorCvApi = (assessorId, name, setLoading) => () => {
  api()
    .root(API_ROOT)
    .get(`${DOWNLOAD_ASSESSOR_CV}/${assessorId}`)
    .downloadZip(`${name}`)
    .success((response) => {
      successToast("CV downloaded successfully");
    })
    .error((err) => {
      errorToast(err?.message || "Failed to download CV");
    })
    .send(() => {}
  )
};

export const masterExportCvsApi = (params, setLoading) => async (dispatch) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
      queryParams.append(key, params[key]);
    }
  });

  const url = `${MASTER_EXPORT_CVS}?${queryParams.toString()}`;

    api()
      .root(API_ROOT)
      .get(url)
      .downloadZip(`AllCVs`)
      .success((response) => {
        setLoading && setLoading(false);  
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.message || "Failed to export CVs");
      })
        .send(() => {
          setLoading && setLoading(false);
        });
  };
