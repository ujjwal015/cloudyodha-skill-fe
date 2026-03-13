import api from "../../utils/apiHelper.js";
import {
  devConsoleLog,
  errorToast,
  successToast,
  convertOptions,
  getLocal,
} from "../../utils/projectHelper";

import {
  API_ROOT,
  CHANGE_PASSWORD_API,
} from "../../config/constants/apiConstants/auth";
import {
  EXAM_MANAGEMENT_LIST_API,
  EXAM_MANAGEMENT_LIST_STATUS_API,
  EXAM_MANAGEMENT_DELETE_LIST_API,
  CREATE_EXAM_CENTER_API,
  GET_SINGLE_EXAM_CENTER_API,
  EDIT_EXAM_CENTER_API,
  CREATE_BATCH_API,
  GET_ASSESSMENT_LIST_API,
  PUT_ASSIGN_BATCH_API,
  EXAM_CENTER_LIST_API,
  SINGLE_BATCH_API,
  GET_ASSESSMENT_OPTIONS_API,
  DELETE_BATCH_LIST_API,
  EDIT_BATCH_LIST_API,
  GET_ASSESSMENT_STATS_BY_BATCH_API,
  GET_BATCH_LIST_API,
  GET_TRAINING_PARTNER_API,
  DELETE_EXAM_CENTER_API,
  BATCH_SCHEME_LIST_API,
  BATCH_PROCTOR_LIST_API,
  BATCH_JOB_ROLE_LIST_API,
  BATCH_ACCESSOR_LIST_API,
  BATCH_QUESTION_BANK_LIST_API,
  BATCH_EXAM_CENTER_LIST_API,
  BATCH_SUB_SCHME_LIST_API,
  EDIT_BATCH_API,
  BATCH_INSTRUCTION_LIST_API,
  DOWNLOAD_SAMPLE_CANDIDATE_BULK_UPLOAD_API,
  UPLOAD_BULK_CANDIDATE_IN_BATCH_API,
  CANDIDATE_LIST_API,
  GET_CANDIDATE_BY_ID,
  GET_CANDIDATE_PASSWORD_API,
  CANDIDATE_RESET_PASSWORD_API,
  PUT_CANDIDATE_BY_ASSIGN_BATCH_API,
  INCREASE_EXAM_TIME_API,
  UPDATE_CANDIDATE_STATUS_API,
  GET_EXPORT_DATA_API,
  CANDIDATE_ACTIVITY_LIST_API,
  GET_JOBROLE_LEVEL_AND_VERSION_API,
  GET_JOBROLE_AND_VERSION_API,
  REASSIGN_ASSESSOR_API,
  DELETE_CANDIDATE_BATCH_API,
  RESTORE_CANDIDATE_LOGIN_COUNT,
  GET_MULTI_LANGUAGE_DECIDER_API,
  MANNUAL_CANDIDATE_LOGOUT,
  GET_ALL_BATCH_LIST_API,
  REASSIGN_CANDIDATE_API,
  DISABLE_FACE_RECOGNITION_API,
  GET_CANDIDATE_LOGIN_TOKEN_API,
  UPDATE_MULTIPLE_CANDIDATE_STATUS_API,
  DELETE_MULTIPLE_CANDIDATE_BATCH_API,
  GET_BATCH_LIST_API_V2,
  CREATE_TRAINING_PARTNER_API,
  GET_BATCH_LIST_API_ASSIGNMENT,
  EXAM_CENTRE_DOWNLOAD_SAMPLE_ADMIN_API,
  EXAM_CENTRE_BULK_UPLOAD_API,
  GET_ALL_Assign_BATCH_LIST_API,
  DOWNLOAD_ATTENDANCE_SHEET_API,
  GET_CANDIDATE_EXPORT_DATA_API,
  DOWNLOAD_RESULT_SHEET_API,
} from "../../config/constants/apiConstants/superAdmin";
import {
  SUPER_ADMIN_ASSIGN_BATCH,
  SUPER_ADMIN_BATCH_LIST_PAGE,
  SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_PAGE,
} from "../../config/constants/routePathConstants/superAdmin";
import {
  getAssessmentOptions,
  getAssessmentStatsByBatch,
  getAssessorList,
  getBankQBcodeList,
  getExamCenterList,
  getExamManagementBatchList,
  getExamManagementList,
  getSingleBatch,
  getSchemeList,
  getExamCenterNameList,
  getJobRoleList,
  getProctorList,
  getSubSchemeList,
  getInstuctionList,
  getCandiateByBatch,
  getSingleCandiateData,
  getExportCandaiteList,
  getJobRoleLevelVersion,
  getSecondaryLanguage,
  getJobRoleVersion,
  getJobRoleNOS,
  getIsMultiLanguageEnabled,
  getClientSpecificJobRole,
  getSectionTableList,
} from "../../redux/slicers/superAdmin/examManagementSlice";
import {
  getAssessmentList,
  getBatchList,
} from "../../redux/slicers/superAdmin/assessmentSlice.js";
import { convertString } from "../../pages/superAdmin/examManagement/batch/data.js";
import moment from "moment";

//EXAM MANAGEMENT APIS -------------START------------------
export const getExamManagementListApi =
  (setLoading, id, page, limit, search, setTotalPages, setStatusLoading) =>
  (dispatch) => {
    const URL =
      search && search !== ""
        ? `${EXAM_MANAGEMENT_LIST_API}?search=${search}&page=${page}&limit=${limit}`
        : `${EXAM_MANAGEMENT_LIST_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        setLoading && setLoading(false);
        setStatusLoading && setStatusLoading(false);
        if (a.statusCode === 200) {
          dispatch(getExamManagementList(a?.details?.getAllExamCenterList));
          setTotalPages(a?.details?.totalPages);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        setStatusLoading && setStatusLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
        setStatusLoading && setStatusLoading(false);
      });
  };

export const putExamManagementStatus =
  (
    setLoading,
    id,
    formData,
    setStatusLoading,
    page,
    limit,
    searchQuery,
    setTotalPages
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${EXAM_MANAGEMENT_LIST_STATUS_API}/${id}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast(msg);
          setStatusLoading(false);
          dispatch(
            getExamCenterListApi(
              setLoading,
              id,
              page,
              limit,
              searchQuery,
              setTotalPages,
              setStatusLoading
            )
          );
        }
      })
      .error((e) => {
        setStatusLoading && setStatusLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setStatusLoading && setStatusLoading(false);
      });
  };

export const deleteExamManagementApi =
  (setLoading, id, setDeleteModal, getList, len) => (dispatch) => {
    api()
      .root(API_ROOT)
      .delete(`${EXAM_MANAGEMENT_DELETE_LIST_API}/${id}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          getList(true, len);
          successToast(msg);
          setDeleteModal(false);
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

export const createExamCenterApi =
  (formValues, setLoading, clearFormValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_EXAM_CENTER_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          clearFormValues();
          successToast(msg);
          navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE);
        } else {
          errorToast(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        errorToast(e.error || "Oops, Something went wrong!");
      })
      .send(() => {
        setLoading(false);
      });
  };

export const getTrainingPartnerListApi =
  (setLoading, setOptions) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(GET_TRAINING_PARTNER_API)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          let arr = [];
          a?.details.forEach((element) => {
            arr.push({
              value: element.trainingPartner,
              label: element.trainingPartner,
            });
          });
          setOptions(arr);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message || "Oops, Something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getSingleExamCenterListApi =
  (setLoading, setFormValues, examId) => () => {
    api()
      .root(API_ROOT)
      .get(`${GET_SINGLE_EXAM_CENTER_API}/${examId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          setFormValues({
            examCenterName: a?.details?.examCenterName,
            examCenterCode: a?.details?.examCenterCode,
            mobile: a?.details?.mobile,
            state: a?.details?.state,
            district: a?.details?.district,
            pincode: a?.details?.pincode,
            addressLineOne: a?.details?.addressLineOne,
            addressLineTwo: a?.details?.addressLineTwo,
            noOfSeats: a?.details?.noOfSeats.toString(),
            status: a?.details?.status,
          });
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message || "Oops, Something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getExamCenterListApi =
  (setLoading, id, page, limit, searchQuery, setTotalPages, setStatusLoading) =>
  (dispatch) => {
    const URL =
      searchQuery && searchQuery !== ""
        ? `${EXAM_CENTER_LIST_API}/?page=${page}&limit=${limit}&sortOrder=-1&search=${searchQuery}`
        : `${EXAM_CENTER_LIST_API}/?page=${page}&limit=${limit}&sortOrder=-1`;
    // const DATE_URL = `${EXAM_CENTER_LIST_API}/${id}?from=${from}&to=${to}&page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        setLoading && setLoading(false);

        if (a?.statusCode === 200) {
          dispatch(getExamCenterList(a?.details?.examCenterList));
          setTotalPages && setTotalPages(a?.details?.totalPages);
          setStatusLoading(false);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message || "Oops, Something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const editExamCenterApi =
  (setLoading, examCenterId, formValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${EDIT_EXAM_CENTER_API}/${examCenterId}`)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast(msg);
          navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.error || "Oops, Something went wrong!");
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const deleteExamCenterApi =
  (setLoading, id, setDeleteModal, getList, len) => (dispatch) => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_EXAM_CENTER_API}/${id}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          getList(true, len);
          successToast(msg);
          setDeleteModal(false);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message || "Oops, Something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getSingleExamCenterDetailApi =
  (setLoading, setFormValues, examId) => () => {
    api()
      .root(API_ROOT)
      .get(`${GET_SINGLE_EXAM_CENTER_API}/${examId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          setFormValues({
            trainingPartner: a?.details?.trainingPartner?.trainingPartner,
            examCenterName: a?.details?.examCenterName,
            trainingCenterId: a?.details?.trainingCenterId,
            mobile: a?.details?.mobile,
            state: a?.details?.state,
            district: a?.details?.district,
            pincode: a?.details?.pincode,
            address: a?.details?.address,
            noOfSeats: a?.details?.noOfSeats.toString(),
            locationURL: a?.details?.locationURL,
            poc: a?.details?.poc,
          });
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message || "Oops, Something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const createBatchApi = (formValues, setLoading, navigate) => () => {
  api()
    .root(API_ROOT)
    .post(CREATE_BATCH_API)
    .data(formValues)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading(false);
      if (a.statusCode === 200) {
        successToast(msg);
        navigate(SUPER_ADMIN_BATCH_LIST_PAGE);
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

export const EditBatchApi = (id, formValues, setLoading, navigate) => () => {
  api()
    .root(API_ROOT)
    .put(`${EDIT_BATCH_API}/${id}`)
    .data(formValues)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading(false);
      if (a.statusCode === 200) {
        successToast(msg);
        navigate(SUPER_ADMIN_BATCH_LIST_PAGE);
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

export const getAssessmentsApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_ASSESSMENT_LIST_API)
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode === 200) {
        dispatch(getAssessmentList(a.details?.AssesmentDetails));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      errorToast(e.message || "Oops, Something went wrong!");
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const getAssessmentDetailsByBatchIdApi =
  (setLoading, batchId, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      // .get(`${GET_ASSESSMENT_STATS_BY_BATCHID}/${batchId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          // dispatch(getAssessmentStats(a?.details))
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { message } = e;
        errorToast(message);
        navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getSingleBatchApi =
  (
    setLoading,
    id,
    setBasicDetailsFormValues,
    setProctoringFormValues,
    setQuestionPaperFormValues,
    setAssessorProctor
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${SINGLE_BATCH_API}/${id}`)
      .success((a) => {
        if (a?.statusCode === 200) {
          const formValues = a?.details;
          setBasicDetailsFormValues({
            batchId: formValues?.batchId,
            startDate: moment(formValues?.startDate, "DD/MM/YYYY").toDate(),
            endDate: moment(formValues?.endDate, "DD/MM/YYYY").toDate(),
            startTime: formValues?.startTime,
            endTime: formValues?.endTime,
            examCenterId: formValues?.examCenterId?._id || "",
            batchMode: formValues?.batchMode,
            batchSize: formValues?.batchSize,
            schemeId: formValues?.schemeId || "",
            subSchemeId: formValues?.subSchemeId || "",
            trainingPartner:
              formValues?.examCenterId?.trainingPartner?.trainingPartner || "",
            batchStartDate:
              moment(formValues?.batchStartDate).format("MM/DD/YYYY") || "",
            batchEndDate:
              moment(formValues?.batchEndDate).format("MM/DD/YYYY") || "",
          });

          setProctoringFormValues({
            imageProctorStatus: convertString(
              formValues?.proctoring?.imageProctor?.imageProctorStatus
            ),
            imageProctoringTime:
              formValues?.proctoring?.imageProctor?.imageProctoringTime, //need to check
            videoStreaming: convertString(
              formValues?.proctoring?.videoStream?.videoStreaming
            ),
            videoDuration: formValues?.proctoring?.videoStream?.videoDuration, //need to check
            videoInterval: formValues?.proctoring?.videoStream?.videoInterval,
            wrongLoginStatus: convertString(
              formValues?.proctoring?.wrongLogin?.wrongLoginStatus
            ),
            noOfWrongLogin:
              formValues?.proctoring?.wrongLogin?.noOfWrongLogin?.toString(),
            browserExitAlert: convertString(
              formValues?.proctoring?.browserExit?.browserExitAlert
            ), //need to check
            noOfBrowserExit:
              formValues?.proctoring?.browserExit?.noOfBrowserExit?.toString(), //need to check
            faceRecognition: convertString(
              formValues?.proctoring?.faceRecognition
            ),
            faceDetection: convertString(formValues?.proctoring?.faceDetection),
            videoScreensharingProctoringStatus: convertString(
              formValues?.proctoring?.videoScreensharingProctoringStatus
            ),
            isAutoLogout: convertString(formValues?.proctoring?.isAutoLogout),
            capturingImageStatus: convertString(
              formValues?.proctoring?.capturingImageStatus
            ),
            identityProofStatus: convertString(
              formValues?.proctoring?.identityProofStatus
            ),
          });
          dispatch(
            getSecondaryLanguage(
              formValues?.questionPaper?.secondaryLanguage || ""
            )
          );
          setQuestionPaperFormValues({
            isMultiJobRole: convertString(
              formValues?.questionPaper?.isMultiJobRole
            ),
            colorAndTTSEnabled: convertString(
              formValues?.questionPaper?.colorAndTTSEnabled || false
            ),
            multipleJobRole: formValues?.questionPaper?.multipleJobRole || [],
            suffleQuestion: convertString(
              formValues?.questionPaper?.suffleQuestion
            ),
            optionRandom: convertString(
              formValues?.questionPaper?.optionRandom
            ),
            markForReview: convertString(
              formValues?.questionPaper?.markForReview
            ),
            questionNavigation: convertString(
              formValues?.questionPaper?.questionNavigation
            ),
            paginationStatus: convertString(
              formValues?.questionPaper?.paginationStatus
            ),
            assesmentStatus: convertString(
              formValues?.questionPaper?.assesmentStatus
            ),
            examLanguageConduct: formValues?.questionPaper?.examLanguageConduct
              ? "true"
              : "false",
            primaryLanguage: formValues?.questionPaper?.primaryLanguage,
            secondaryLanguage:
              formValues?.questionPaper?.secondaryLanguage || "",
            chooseInstructions: formValues?.questionPaper?.chooseInstructions,
            jobRole: formValues?.jobRole,
            qpCode: formValues?.questionPaper?.qpCode,
            level: formValues?.questionPaper?.level,
            version: formValues?.questionPaper?.version || "",
            questionSet: formValues?.questionPaper?.questionSet,
            questionType: formValues?.questionPaper?.questionType,
            sectionTable: formValues?.questionPaper?.sectionTable,
            passingPercentage: formValues?.questionPaper?.passingPercentage,
            status: formValues?.questionPaper?.status,
          });

          setAssessorProctor({
            assignAssessorProctor: formValues?.assignAssessorProctor
              ? "true"
              : "false" || "false",
            accessorId: formValues?.accessorId || "",
            clientId: formValues?.clientId,
            assessorFeePerCandidate: formValues?.assessorFeePerCandidate || "",
            proctorId: formValues?.proctorId,
          });
          setLoading && setLoading(false);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

// get multiple language decider API

export const getMultipleLanguageDeciderApi =
  (setLoading, jobRoleID, level, version) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_MULTI_LANGUAGE_DECIDER_API}/${jobRoleID}/${level}/${version}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getIsMultiLanguageEnabled(a?.details?.secondaryLanguage));
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message || "Oops, Something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getAssessmentOptionsApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_ASSESSMENT_OPTIONS_API)
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode === 200) {
        const lists = convertOptions(
          a?.details?.AssesmentDetails,
          "_id",
          "assessmentName"
        );
        dispatch(getAssessmentOptions(lists));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const postExamCentreBulkUploadAdminApi =
  (formData, setLoading, setFormValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(EXAM_CENTRE_BULK_UPLOAD_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setFormValues(null);
          successToast(msg);
          navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "", error: { details = "" } = {} } = e;
        errorToast(e.error);
        // devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getExamCentreSampleExcelAdminApi = () => (dispatch) => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };

  fetch(`${API_ROOT}${EXAM_CENTRE_DOWNLOAD_SAMPLE_ADMIN_API}`, {
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
        alink.download = "Exam centre bulk upload sample file";
        alink.click();
      });
    }
  });
};

export const getExamManagementBatchListApi =
  (
    setLoading,
    page = 1,
    limit = 50,
    search,
    setTotalPages,
    setStatusLoading,
    clientName,
    jobRole,
    schemeName,
    from,
    to,
    setIsFilterApplied,
    type
  ) =>
  (dispatch) => {
    const baseParams = {
      page: page,
      limit: limit,
      sortOrder: -1,
    };

    const optionalParams = {
      search: search !== undefined ? search : "",
      from: from,
      to: to,
      jobRole: jobRole,
      schemeName: schemeName,
      clientname: clientName,
      type: type,
    };

    // Include all params, including empty strings
    const allParams = {
      ...baseParams,
      ...Object.fromEntries(
        Object.entries(optionalParams).filter(
          ([, value]) => value !== undefined
        )
      ),
    };

    const url = `${GET_BATCH_LIST_API_V2}?${new URLSearchParams(
      allParams
    ).toString()}`;
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        if (clientName || jobRole || schemeName || from || to)
          setIsFilterApplied && setIsFilterApplied(true);
        setStatusLoading && setStatusLoading(false);
        if (a.statusCode === 200) {
          dispatch(
            getExamManagementBatchList(
              a?.details?.batchDetails || a?.details?.data
            )
          );
          setTotalPages && setTotalPages(a?.details?.totalPages);
          setTotalPages(a?.details?.totalPages);
          // handleClearAll();
        }
        setLoading && setLoading(false);
      })
      .error((e) => {
        setLoading && setLoading(false);
        setStatusLoading && setStatusLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
        setStatusLoading && setStatusLoading(false);
      });
  };

export const getAssignCandidateBatchListApi =
  (
    setLoading,
    page = 1,
    limit = 50,
    search,
    setTotalPages,
    setStatusLoading,
    clientName,
    jobRole,
    schemeName,
    from,
    to,
    setIsFilterApplied,
    type
  ) =>
  (dispatch) => {
    const baseParams = {
      page: page,
      limit: limit,
      sortOrder: -1,
    };

    const optionalParams = {
      search: search !== undefined ? search : "",
      from: from,
      to: to,
      jobRole: jobRole,
      schemeName: schemeName,
      clientname: clientName,
      type: type,
    };

    // Include all params, including empty strings
    const allParams = {
      ...baseParams,
      ...Object.fromEntries(
        Object.entries(optionalParams).filter(
          ([, value]) => value !== undefined
        )
      ),
    };

    const url = `${GET_BATCH_LIST_API_ASSIGNMENT}?${new URLSearchParams(
      allParams
    ).toString()}`;
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        if (clientName || jobRole || schemeName || from || to)
          setIsFilterApplied && setIsFilterApplied(true);
        setStatusLoading && setStatusLoading(false);
        if (a.statusCode === 200) {
          dispatch(
            getExamManagementBatchList(
              a?.details?.batchDetails || a?.details?.data
            )
          );
          setTotalPages && setTotalPages(a?.details?.totalPages);
          setTotalPages(a?.details?.totalPages);
          // handleClearAll();
        }
        setLoading && setLoading(false);
      })
      .error((e) => {
        setLoading && setLoading(false);
        setStatusLoading && setStatusLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
        setStatusLoading && setStatusLoading(false);
      });
  };

export const getExamManagementBatchListApiV2 =
  (
    setLoading,
    page = 1,
    limit = 50,
    search,
    setTotalPages,
    setStatusLoading,
    clientName,
    jobRole,
    schemeName,
    from,
    to,
    setIsFilterApplied,
    type
  ) =>
  (dispatch) => {
    const baseParams = {
      page: page,
      limit: limit,
      sortOrder: -1,
    };

    const optionalParams = {
      search: search !== undefined ? search : "",
      from: from,
      to: to,
      jobRole: jobRole,
      schemeName: schemeName,
      clientname: clientName,
      type: type,
    };

    // Include all params, including empty strings
    const allParams = {
      ...baseParams,
      ...Object.fromEntries(
        Object.entries(optionalParams).filter(
          ([, value]) => value !== undefined
        )
      ),
    };

    const url = `${GET_BATCH_LIST_API_V2}?${new URLSearchParams(
      allParams
    ).toString()}`;
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        if (clientName || jobRole || schemeName || from || to)
          setIsFilterApplied && setIsFilterApplied(true);
        setStatusLoading && setStatusLoading(false);
        if (a.statusCode === 200) {
          dispatch(
            getExamManagementBatchList(
              a?.details?.batchDetails || a?.details?.data
            )
          );
          setTotalPages && setTotalPages(a?.details?.totalPages);
          setTotalPages(a?.details?.totalPages);
          // handleClearAll();
        }
        setLoading && setLoading(false);
      })
      .error((e) => {
        setLoading && setLoading(false);
        setStatusLoading && setStatusLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
        setStatusLoading && setStatusLoading(false);
      });
  };

export const deleteBatchApi =
  (setLoading, id, setDeleteModal, getList, len) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_BATCH_LIST_API}/${id}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          getList(len);
          successToast(msg);
          setDeleteModal(false);
        }
      })
      .error((e) => {
        const { message } = e;
        errorToast(message);
        setLoading && setLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const editBatchListStatusApi =
  (setLoading, id, formData, setStatusLoading, examManagementbatchList) =>
  () => {
    api()
      .root(API_ROOT)
      .put(`${EDIT_BATCH_LIST_API}/${id}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          examManagementbatchList();
          successToast(msg);
          // setStatusLoading(false);
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

export const getAssessmentStatsByBatchApi =
  (setLoading, assesmentStatsId) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_ASSESSMENT_STATS_BY_BATCH_API}/${assesmentStatsId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          dispatch(getAssessmentStatsByBatch(a.details));
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

export const getAssignBatchListApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get()
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode === 200) {
        dispatch(getBatchList(a.details?.getAssignBatchList));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const putAssignBatchApi =
  (setLoading, payload, handleCancel, navigate) => () => {
    api()
      .root(API_ROOT)
      .put(PUT_ASSIGN_BATCH_API)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200 || 201) {
          successToast("Batch Assigned" || a.message);
          handleCancel();
          navigate(SUPER_ADMIN_EXAM_MANAGEMENT_PAGE);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message || "Oops, something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

// from here all list options api for batch
export const getBatchSubSchemeListApi = (id, setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${BATCH_SUB_SCHME_LIST_API}?schemeId=${id}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode === 200) {
        const data = a?.details.map((element) => {
          return {
            value: element._id,
            label: element.subSchemeName,
          };
        });
        dispatch(getSubSchemeList(data));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
      errorToast(e.message || "Oops, Something went wrong!");
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};
// export const BATCH_SCHEME_LIST_API = "api/scheme-list-batch"
// export const BATCH_SUB_SCHME_LIST_API = "api/sub-scheme-list-batch"
// export const BATCH_PROCTOR_LIST_API = "api/proctor-list-batch"
// export const BATCH_JOB_ROLE_LIST_API = "api/job-role-list-batch"
// export const BATCH_ACCESSOR_LIST_API = "api/assessor-list-batch"
// export const BATCH_QUESTION_BANK_LIST_API = "api/question-bank-list-batch"

export const getBatchData =
  (status = "") =>
  async (dispatch) => {
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
        callSchemeApi(),
        callProctorApi(),
        callJobRoleApi(),
        callAccesorApi(),
        callQBList(),
        callExamCenterApi(status),
        getAllInstructions(),
      ]);

      // Handle the responses as needed
      if (api1Response.statusCode === 200) {
        const data = api1Response.details.map((element) => {
          return {
            value: element._id,
            label: element.schemeName,
          };
        });
        dispatch(getSchemeList(data));
      }
      if (api2Response.statusCode === 200) {
        const data = api2Response.details.map((element) => {
          return {
            value: element._id,
            label: element.proctorName,
          };
        });
        dispatch(getProctorList(data));
      }
      if (api3Response.statusCode === 200) {
        const jobData = api3Response.details.map((element) => {
          return {
            value: element._id,
            label: element.jobRole,
          };
        });
        const jobData2 = api3Response.details.map((element) => {
          return {
            value: element._id,
            label: `${element.jobRole}-${element?.qpCode}`,
          };
        });
        const qpCode = api3Response.details.map((element) => {
          return {
            value: element._id,
            label: element.qpCode,
          };
        });
        const allJobRoleData = api3Response.details;
        dispatch(getJobRoleList({ jobData, qpCode, allJobRoleData, jobData2 }));
      }
      if (api4Response.statusCode === 200) {
        const data = api4Response.details.map((element) => {
          return {
            value: element._id,
            label: element.fullName,
          };
        });
        dispatch(getAssessorList(data));
      }
      if (api5Response.statusCode === 200) {
        const data = api5Response.details.map((element) => {
          return {
            value: element._id,
            label: element.qpCode,
          };
        });
        dispatch(getBankQBcodeList(data));
      }
      if (api6Response.statusCode === 200) {
        const data = api6Response?.details?.examCenterList?.map((element) => {
          return {
            value: element._id,
            label: element.examCenterName,
            trainingPartner: element.trainingPartner,
            ...element,
          };
        });
        dispatch(getExamCenterNameList(data));
      }
      if (api7Response.statusCode === 200) {
        const data = api7Response.details.map((element) => {
          return {
            value: element._id,
            label: element.instructionName,
          };
        });
        dispatch(getInstuctionList(data));
      }

      // Handle errors if necessary
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  };

// Define separate functions for each API call
export const callSchemeApi = async () => {
  let data;

  await api()
    .root(API_ROOT)
    .get(BATCH_SCHEME_LIST_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};
const callProctorApi = async () => {
  let data;
  await api()
    .root(API_ROOT)
    .get(BATCH_PROCTOR_LIST_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};
const callJobRoleApi = async () => {
  let data;
  await api()
    .root(API_ROOT)
    .get(BATCH_JOB_ROLE_LIST_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};
export const callAccesorApi = async (schemeId = null) => {
  let data;
  const params = {};
  if (schemeId) {
    params["schemeId"] = schemeId;
  }
  const queryParams = new URLSearchParams(params).toString();
  const urlWithParams = `${BATCH_ACCESSOR_LIST_API}?${queryParams}`;
  await api()
    .root(API_ROOT)
    .get(urlWithParams)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};
const callQBList = async () => {
  let data;
  await api()
    .root(API_ROOT)
    .get(BATCH_QUESTION_BANK_LIST_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};
const callExamCenterApi = async (status = "") => {
  let data;
  let url = `${BATCH_EXAM_CENTER_LIST_API}`;
  if (status) {
    url = `${url}?status=${status}`;
  }
  await api()
    .root(API_ROOT)
    .get(url)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};

const getAllInstructions = async () => {
  let data;
  await api()
    .root(API_ROOT)
    .get(BATCH_INSTRUCTION_LIST_API)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};

export const downloadBulkUploadCandidateApi = (type) => (dispatch) => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };

  fetch(`${API_ROOT}${DOWNLOAD_SAMPLE_CANDIDATE_BULK_UPLOAD_API}/${type}`, {
    headers: header,
  }).then((response) => {
    response.blob().then((blob) => {
      // Creating new object of PDF file
      const fileURL = window.URL.createObjectURL(blob);
      // Setting various property values
      let alink = document.createElement("a");
      alink.href = fileURL;
      alink.download = "Candidate Bulk Upload Sample";
      alink.click();
    });
  });
};

export const exportAllAssignCandidateBatchListApi =
  (setLoading, formatData, getColumns, handleAllExport) => (dispatch) => {
    const url = `${GET_ALL_Assign_BATCH_LIST_API}`;
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        if (a?.details?.batchDetails?.length > 0) {
          handleAllExport(
            formatData,
            getColumns,
            a?.details?.batchDetails,
            () => successToast("Exported Successfully")
          );
          setLoading && setLoading(false);
        } else {
          errorToast("No Data Found");
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

export const uploadBulkCandidateApi =
  (
    id,
    formData,
    setLoading,
    page,
    limit,
    search,
    setTotalPages,
    setStatusLoading,
    setFormValues,
    handleClose,
    type,
    getList
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_BULK_CANDIDATE_IN_BATCH_API}/${id}/${type}`)
      .data(formData)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          setFormValues([]);
          successToast("Uploded Successfully");
          // dispatch(
          //   getAssignCandidateBatchListApi(
          //     setLoading,
          //     page,
          //     limit,
          //     search,
          //     setTotalPages,
          //     setStatusLoading
          //   )
          // );
          getList?.();
        }
        handleClose();
      })
      .error((e) => {
        setLoading(false);
        handleClose();
        errorToast(e?.error?.error || e?.message);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const downloadStudentAttendanceSheetApi =
  (batchId, setLoading) => () => {
    api()
      .root(API_ROOT)
      .get(`${DOWNLOAD_ATTENDANCE_SHEET_API}/${batchId}`)
      .downloadFilename(`Attendance_Sheet_${batchId}.pdf`, "blob")
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast("Downloaded Successfully");
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

export const downloadStudentResultSheetApi = (batchId, setLoading) => () => {
  api()
    .root(API_ROOT)
    .get(`${DOWNLOAD_RESULT_SHEET_API}/${batchId}`)
    .downloadFilename(`Result_Sheet_${batchId}.pdf`, "blob")
    .success((a) => {
      setLoading && setLoading(false);
      if (a?.statusCode === 200) {
        successToast("Downloaded Successfully");
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
export const getJobRoleWithClientIDApi =
  (clientId, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${BATCH_JOB_ROLE_LIST_API}?clientId=${clientId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          const data = a?.details.map((element) => {
            return {
              value: element._id,
              label: element.jobRole,
            };
          });
          dispatch(getClientSpecificJobRole(data));
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message || "Oops, Something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getCandidateByBatchId =
  (
    id = null,
    setLoading,
    page,
    limit,
    setTotalPages,
    search,
    from,
    to,
    status
  ) =>
  (dispatch) => {
    const baseUrl = `${CANDIDATE_LIST_API}/${id}`;
    const params = new URLSearchParams({
      page: page,
      limit: limit,
      sortOrder: "-1",
    });

    if (search && search !== "") {
      params.set("search", search);
    }
    const URL = `${baseUrl}?${params?.toString()}`;

    const dateParams = new URLSearchParams({
      from: from,
      to: to,
      page: page,
      limit: limit,
      sortOrder: "-1",
    });

    const DATE_URL = `${baseUrl}?${dateParams}`;
    api()
      .root(API_ROOT)
      .get(from ? DATE_URL : URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, candidateList, sectionTable } = a.details;
          setTotalPages && setTotalPages(totalPages);
          dispatch(getCandiateByBatch(candidateList));
          dispatch(getSectionTableList(sectionTable));
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

// GET ACITIVITIEY OF CANDIDATE BY BATCH ID
export const getCandidateActivityByBatchId =
  (id, setLoading, page, limit, search, setTotalPages, from, to, status) =>
  (dispatch) => {
    const URL =
      search && search !== ""
        ? `${CANDIDATE_ACTIVITY_LIST_API}/${id}?page=${page}&limit=${limit}&sortOrder=1&search=${search}`
        : `${CANDIDATE_ACTIVITY_LIST_API}/${id}?page=${page}&limit=${limit}&sortOrder=1`;
    const DATE_URL = `${CANDIDATE_ACTIVITY_LIST_API}/${id}?from=${from}&to=${to}&page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(from ? DATE_URL : URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, candidateList } = a.details;
          setTotalPages && setTotalPages(totalPages);
          dispatch(getCandiateByBatch(candidateList));
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

export const getSingleCandidateDetailApi =
  (setLoading, setFormValues, candidateId) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_CANDIDATE_BY_ID}/${candidateId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getSingleCandiateData(a?.details));
          setFormValues({
            batchId: a?.details?.batchId,
            name: a?.details?.name,
            email: a?.details?.email,
            mobile: a?.details?.mobile,
            aadharNumber: a?.details?.aadharNumber,
            userName: a?.details?.userName,
            _id: a?.details?._id,
            logInSendViaEmail: a?.details?.logInSendViaEmail,
          });
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

export const updateCandidateData =
  (setLoading, candidateId, candiateData, formValues, navigate) =>
  (dispatch) => {
    const formData = {
      ...formValues,
      isTestSubmitted: candiateData?.isTestSubmitted,
    };

    api()
      .root(API_ROOT)
      .put(`${PUT_CANDIDATE_BY_ASSIGN_BATCH_API}/${candidateId}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast(msg);
          navigate(
            `${SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE}/${candiateData?.batchId_mongoId}`
          );
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

export const getCandidatePasswordApi =
  (candidateId, setFormValues, setLoading) => () => {
    api()
      .root(API_ROOT)
      .get(`${GET_CANDIDATE_PASSWORD_API}/${candidateId}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          setFormValues((pre) => ({
            ...pre,
            oldPassword: a?.details,
          }));
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

export const candidateResetPasswordApi =
  (
    candidateId,
    formData,
    setErr,
    setLoading,
    clearFormValues,
    setResetModal,
    setActionOpen
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${CANDIDATE_RESET_PASSWORD_API}/${candidateId}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          setErr("");
          clearFormValues();
          setResetModal(false);
          setActionOpen(false);
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const increaseExamTimeApi =
  (
    candidateId,
    formData,
    setErr,
    setLoading,
    clearFormValues,
    setIncreaseTimeModal,
    setActionOpen
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${INCREASE_EXAM_TIME_API}/${candidateId}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          setErr("");
          clearFormValues();
          setIncreaseTimeModal(false);
          setActionOpen(false);
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };
export const updateCandidateStatusApi =
  (id, formData, setLoading, getList, setAbleToDelete) => () => {
    let url;
    if (Array.isArray(id)) {
      url = UPDATE_MULTIPLE_CANDIDATE_STATUS_API;
    } else {
      url = `${UPDATE_CANDIDATE_STATUS_API}/${id}`;
    }
    api()
      .root(API_ROOT)
      .put(url)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        // setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          getList();
          if (Array.isArray(id)) {
            setAbleToDelete((prev) => {
              if (formData?.status === false) {
                const toAdd = id?.filter((id) => !prev.includes(id));
                return [...prev, ...toAdd];
              } else {
                return prev.filter(
                  (delId) => !formData.candidateIds.includes(delId)
                );
              }
            });
          }
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e?.message);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
export const getExportsCandidateDetailApi =
  (
    batchId,
    formData,
    setLoading,
    setExportFormValues,
    exportInitialValues,
    setIsExportOpen
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${GET_EXPORT_DATA_API}/${batchId}`)
      .data(formData)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          dispatch(getExportCandaiteList(a?.details));
          setIsExportOpen(false);
          setExportFormValues(exportInitialValues);
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
export const getExportsCandidateDetailsApi =
  (
    batchId,
    formData,
    setExportLoading,
    setExportFormValues,
    exportInitialValues,
    setIsExportOpen
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${GET_CANDIDATE_EXPORT_DATA_API}/${batchId}`)
      .data(formData)
      .downloadFilename("candidateList", "blob")
      .success((a) => {
        setExportLoading && setExportLoading({ excel: false, pdf: false });
        setIsExportOpen(false);
        setExportFormValues(exportInitialValues);
        dispatch(getExportCandaiteList([]));
        if (a?.statusCode === 200) {
        }
      })
      .error((e) => {
        setExportLoading && setExportLoading({ excel: false, pdf: false });
        devConsoleLog(e);
      })
      .send(() => {
        setExportLoading && setExportLoading({ excel: false, pdf: false });
      });
  };

export const getLevelandVersionofJobRoleApi =
  (setLoading, id) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_JOBROLE_LEVEL_AND_VERSION_API}/${id}`)
      .success((a) => {
        if (a?.statusCode === 200) {
          const { level, theoryNosList } = a?.details;
          const levelOptions = level.map((el) => {
            return {
              label: el,
              value: el,
            };
          });

          const payload = {
            levelOptions,
            jobRoleNOS: theoryNosList,
            jobRoleId: id,
          };
          dispatch(getJobRoleNOS(payload));
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.message);
        dispatch(getJobRoleLevelVersion([]));
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getLevelandVersionofParticularJobRoleApi =
  (setLoading, id, updateLevelState) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_JOBROLE_LEVEL_AND_VERSION_API}/${id}`)
      .success((a) => {
        if (a?.statusCode === 200) {
          const { level, theoryNosList } = a?.details;
          const levelOptions = level.map((el) => {
            return {
              label: el,
              value: el,
            };
          });

          const payload = {
            levelOptions,
            jobRoleNOS: theoryNosList,
            jobRoleId: id,
          };
          // dispatch(getJobRoleNOS(payload));
          updateLevelState(levelOptions);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.message);
        // dispatch(getJobRoleLevelVersion([]));
        updateLevelState([]);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getVersionOfJobRoleSelectedApi =
  (id, levelValue, versionStateUpdate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_JOBROLE_AND_VERSION_API}/${id}/${levelValue}`)
      .success((a) => {
        if (a?.statusCode === 200) {
          const { version } = a?.details;

          const versionOptions = version.map((el) => {
            return {
              label: el,
              value: el,
            };
          });
          const payload = {
            versionOptions,
            jobRoleId: id,
          };
          // dispatch(getJobRoleVersion(payload));
          versionStateUpdate(versionOptions);
        }
      })
      .error((err) => {
        // setLoading && setLoading(false);
        errorToast(err?.message);
        // dispatch(getJobRoleLevelVersion([]));
        versionStateUpdate([]);
      })
      .send(() => {
        // setLoading && setLoading(false);
      });
  };

export const getLevelAndVersionApi = (id, levelValue) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_JOBROLE_AND_VERSION_API}/${id}/${levelValue}`)
    .success((a) => {
      if (a?.statusCode === 200) {
        const { version } = a?.details;

        const versionOptions = version.map((el) => {
          return {
            label: el,
            value: el,
          };
        });
        const payload = {
          versionOptions,
          jobRoleId: id,
        };
        dispatch(getJobRoleVersion(payload));
      }
    })
    .error((err) => {
      // setLoading && setLoading(false);
      errorToast(err?.message);
      dispatch(getJobRoleLevelVersion([]));
    })
    .send(() => {
      // setLoading && setLoading(false);
    });
};

export const getAssesorList = (id, levelValue) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${BATCH_ACCESSOR_LIST_API}`)
    .success((a) => {
      if (a?.statusCode === 200) {
        const data = a.details.map((element) => {
          return {
            value: element._id,
            label: element.fullName,
          };
        });

        dispatch(getAssessorList(data));
      }
    })
    .error((err) => {
      // setLoading && setLoading(false);
      errorToast(err?.message);
      dispatch(getJobRoleLevelVersion([]));
    })
    .send(() => {
      // setLoading && setLoading(false);
    });
};
export const reAssignAssessor =
  (setLoading, setReassignModal, formValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${REASSIGN_ASSESSOR_API}`)
      .data(formValues)
      .success((a) => {
        if (a?.statusCode === 200) {
          successToast(a?.message);
          setReassignModal(false);
          setLoading(false);
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

export const deleteCandidateApi =
  (
    setLoading,
    id,
    setDeleteModal,
    getList,
    totalRes,
    navigate,
    ableToDelete,
    setAbleToDelete,
    setCandidateIds,
    setCheckedRows,
    setAllChecked
  ) =>
  () => {
    let url =
      ableToDelete?.length > 0
        ? DELETE_MULTIPLE_CANDIDATE_BATCH_API
        : `${DELETE_CANDIDATE_BATCH_API}/${id}`;

    const formData = {
      candidateIds: ableToDelete,
    };
    api()
      .root(API_ROOT)
      .delete(`${url}`)
      .data(formData)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          const { message } = a;
          successToast(message);
          setDeleteModal(false);
          setAbleToDelete([]);
          setCandidateIds([]);
          setCheckedRows([]);
          setAllChecked(false);
          getList();
          if (totalRes === 1) navigate(SUPER_ADMIN_ASSIGN_BATCH);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        const { message } = err;
        errorToast(message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

//Restore candidate count

export const restoreCandidateLoginCount = (id, setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .put(`${RESTORE_CANDIDATE_LOGIN_COUNT}/${id}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        successToast(a?.message);
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

// api to logout candidate by super admin
export const mannualCandidateLogout = (id, setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .put(`${MANNUAL_CANDIDATE_LOGOUT}/${id}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        successToast(a?.message);
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

export const getAssessorsApi =
  (jobRoleId = null, schemeId = null) =>
  (dispatch) => {
    let URL;
    if (jobRoleId && schemeId) {
      URL = `${BATCH_ACCESSOR_LIST_API}?jobRoleId=${jobRoleId}&schemeId=${schemeId}`;
    } else if (jobRoleId) {
      URL = `${BATCH_ACCESSOR_LIST_API}?jobRoleId=${jobRoleId}`;
    } else if (schemeId) {
      URL = `${BATCH_ACCESSOR_LIST_API}?schemeId=${schemeId}`;
    } else {
      URL = `${BATCH_ACCESSOR_LIST_API}`;
    }
    api()
      .root(API_ROOT)
      .get(`${URL}`)
      .success((a) => {
        if (a.statusCode === 200) {
          const data = a?.details?.map((item) => {
            return { label: item?.fullName, value: item?._id };
          });
          dispatch(getAssessorList(data));
        }
      })
      .error((e) => {
        console.log(e);
      })
      .send(() => {});
  };

export const reassignCandidateApi = (candidateId, setLoading) => () => {
  api()
    .root(API_ROOT)
    .put(`${REASSIGN_CANDIDATE_API}/${candidateId}`)
    .success((a) => {
      if (a?.statusCode === 200) {
        successToast(a?.message);
        setLoading(false);
      }
    })
    .error((e) => {
      errorToast(e?.message);
      setLoading && setLoading(false);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const getLoginTokenApi = (candidateId, callback) => (dispatch) => {
  if (!candidateId) {
    callback(null, { error: "Invalid candidate ID" });
    return;
  }

  api()
    .root(API_ROOT)
    .get(`${GET_CANDIDATE_LOGIN_TOKEN_API}/${candidateId}`)
    .success((response) => {
      if (response?.statusCode === 200) {
        callback(response?.details, null);
      } else {
        callback(null, {
          error: response?.message || "Failed to get login token",
        });
      }
    })
    .error((error) => {
      const errorMsg = error?.error || "Failed to get login token";
      callback(null, { error: errorMsg });
    })
    .send(() => {
      // Handle timeout or unexpected errors
      // This is a fallback in case neither success nor error is called
      if (callback) {
        callback(null, { error: "Request timed out" });
      }
    });
};

export const disableFaceRecognitionApi =
  (candidateId, setLoading, getList) => () => {
    const formData = {
      faceRecognitionStatus: true,
    };
    api()
      .root(API_ROOT)
      .put(`${DISABLE_FACE_RECOGNITION_API}/${candidateId}`)
      .data(formData)
      .success((a) => {
        if (a?.statusCode === 200) {
          successToast(a?.message);
          setLoading(false);
          getList();
        }
      })
      .error((e) => {
        errorToast(e?.message);
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const exportAllExamManagementBatchListApi =
  (setLoading, formatData, getColumns, handleAllExport) => (dispatch) => {
    const url = `${GET_ALL_BATCH_LIST_API}`;
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        if (a?.details?.batchDetails?.length > 0) {
          handleAllExport(
            formatData,
            getColumns,
            a?.details?.batchDetails,
            () => successToast("Exported Successfully")
          );
          setLoading && setLoading(false);
        } else {
          errorToast("No Data Found");
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

export const createTrainingPartnerApi = (
  formData,
  setLoading,
  onSuccess,
  onError
) => {
  return (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_TRAINING_PARTNER_API)
      .data(formData)
      .success((response) => {
        setLoading(false);
        if (response.statusCode === 200) {
          onSuccess && onSuccess(response.details);
        }
      })
      .error((error) => {
        setLoading(false);
        onError && onError(error);
      })
      .send(() => {
        setLoading(false);
      });
  };
};

// Email trigger API for SPOC after batch end date
export const sendBatchEndEmailToSPOCApi =
  (batchId, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`/api/v1/superAdmin/batch/${batchId}/send-end-email-spoc`)
      .success((response) => {
        setLoading && setLoading(false);
        if (response.statusCode === 200) {
          successToast("Email sent successfully to SPOC");
        }
      })
      .error((error) => {
        setLoading && setLoading(false);
        errorToast(error.message || "Failed to send email to SPOC");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

// Email trigger API for Assessor after batch end date
export const sendBatchEndEmailToAssessorApi =
  (batchId, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`/api/v1/superAdmin/batch/${batchId}/send-end-email-assessor`)
      .success((response) => {
        setLoading && setLoading(false);
        if (response.statusCode === 200) {
          successToast("Email sent successfully to Assessor");
        }
      })
      .error((error) => {
        setLoading && setLoading(false);
        errorToast(error.message || "Failed to send email to Assessor");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
