import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  DOWNLOAD_OFFLINE_RESULTS_API,
  DOWNLOAD_OFFLINE_RESULTS_SAMPLE_API,
  DOWNLOAD_ONLINE_RESULTS_API,
  DOWNLOAD_ONLINE_RESULTS_SAMPLE_API,
  GET_BATCH_RESULTS_API,
  GET_CANDIDATES_RESULTS_BY_BATCH_API,
  GET_CANDIDATE_ANSWERED_QUESTION_DETAILS_API,
  GET_NOS_WISE_RESULTS_API,
  GET_OFFLINE_BATCH_DETAILS_API,
  GET_OFFLINE_BATCH_LIST_API,
  GET_SINGLE_CANDIDATE_RESULT_OFFLINE_API,
  GET_SINGLE_CANDIDATE_RESULT_ONLINE_API,
  GET_SPECIFIC_CANDIDATE_RESULT_API,
  GET_CANDIDATE_LIST_WITH_QUESTIONS,
  UPLOAD_CANDIDATE_OMR_SHEET,
  UPDATE_CANDIDATE_RESULT_QUESTION_API,
  UPLOAD_OFFLINE_RESULT_API,
  UPLOAD_ONLINE_RESULT_API,
  GET_FAILED_CANDIDATES_RESULT_BY_BATCH_API,
  REGENERATE_RESULT_BY_BATCH,
  GET_SPECIFIC_CANDIDATE_FEEDBACK_API,
  DOWNLOAD_BATCH_ATTENDANCE_API,
  DOWNLOAD_BATCH_RESULTS_ZIP_API,
  DOWNLOAD_ONLINE_RESULTS_WITH_OPTION_API,
  DOWNLOAD_ONLINE_RESULT_WITH_CANDIDATE_DATA_API,
  GET_ONLINE_RESULT_BATCH_RESULTS_API,
  GET_PORTAL_STATS_SINGLE_CANDIDATE_OFFLINE,
} from "../../config/constants/apiConstants/superAdmin";
import {
  getCandidateDetailsNOSWiseOffline,
  getCandidateFeedback,
  getCandidateListWithQuestions,
  getCandidatesResult,
  getNOSWiseOfflineBatchDetails,
  getNOSWiseResultsList,
  getOfflineResultsList,
  getOfflineSingleCandidatePortalStats,
  getResultsList,
  getSpecificCandidateResult,
  setFailedCandidatesResult,
} from "../../redux/slicers/superAdmin/misResults";
import api from "../../utils/apiHelper";
import { errorToast, getLocal, successToast } from "../../utils/projectHelper";

export const getResultsByBatchApi =
  (setLoading, page, search, limit, setTotalPages) => (dispatch) => {
    //GET_BATCH_RESULTS_API
    const URL =
      search && search !== ""
        ? `${GET_BATCH_RESULTS_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_BATCH_RESULTS_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, batchList } = a.details;
          dispatch(getResultsList(batchList));
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

export const getOnlineResultsByBatchListApi =
  (setLoading, page, search, limit, setTotalPages) => (dispatch) => {
    //GET_BATCH_RESULTS_API
    const URL =
      search && search !== ""
        ? `${GET_ONLINE_RESULT_BATCH_RESULTS_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_ONLINE_RESULT_BATCH_RESULTS_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        if (a.statusCode === 200) {
          const { totalPages, batchList } = a.details;
          dispatch(getResultsList(batchList));
          setTotalPages && setTotalPages(totalPages);
        }
        setLoading && setLoading(false);
      })
      .error((err) => {
        setLoading && setLoading(false);
        dispatch(getResultsList([]));
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getCandidatesResultsByBatchApi =
  (setLoading, id, page, search, limit, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_CANDIDATES_RESULTS_BY_BATCH_API}/${id}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_CANDIDATES_RESULTS_BY_BATCH_API}/${id}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(`${URL}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          const { totalPages, result } = a.details;
          const newData = {
            candiateReport: a?.details?.candiateReport,
            sectionTable: a?.details?.sectionTable,
            batch: a?.details?.batch,
          };
          if (!newData.sectionTable) {
            newData["batchName"] = a?.details?.batchName ?? "Default BatchName";
          }
          dispatch(getCandidatesResult(newData));
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

export const getFailedCandidatesResultsByBatchApi =
  (setLoading, id, page, search, limit, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_FAILED_CANDIDATES_RESULT_BY_BATCH_API}/${id}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_FAILED_CANDIDATES_RESULT_BY_BATCH_API}/${id}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(`${URL}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          dispatch(setFailedCandidatesResult(a?.details?.candiateReport ?? []));
          setTotalPages && setTotalPages(a.details?.totalPages);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const regenerateReseltByBatchIdApi =
  (setLoading, payload, setSelectedRows, getList) => (dispatch) => {
    const URL = REGENERATE_RESULT_BY_BATCH;

    api()
      .root(API_ROOT)
      .post(`${URL}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          setSelectedRows(new Set());
          getList?.();
          successToast(a?.message);
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

export const getSpecificCandidateResultApi =
  (setLoading, batchID, candidateID, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_SPECIFIC_CANDIDATE_RESULT_API}/${batchID}/${candidateID}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          dispatch(getSpecificCandidateResult([a?.details]));
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.message);
        navigate(-1);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getSpecificCandidateFeedbackApi =
  (setLoading, batchID, candidateID, getDetails) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_SPECIFIC_CANDIDATE_FEEDBACK_API}/${batchID}/${candidateID}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          getDetails();
          dispatch(getCandidateFeedback(a?.details));
        }
      })
      .error((err) => {
        dispatch(getSpecificCandidateResult([]));
        setLoading && setLoading(false);
        errorToast(err?.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getNOSWiseResultApi = (setLoading, batchID) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_NOS_WISE_RESULTS_API}/${batchID}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200 || 201) {
        dispatch(getNOSWiseResultsList([a?.details]));
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

// Offline Results

export const getOfflineResultsApi =
  (setLoading, page, search, limit, setTotalPages) => (dispatch) => {
    //GET_OFFLINE_BATCH_LIST_API
    const URL =
      search && search !== ""
        ? `${GET_OFFLINE_BATCH_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_OFFLINE_BATCH_LIST_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        if (a?.statusCode === 200) {
          setLoading && setLoading(false);
          const { totalPages, batchList } = a.details;
          dispatch(getOfflineResultsList(batchList));
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

export const getNOSWiseOfflineResultApi =
  (setLoading, batchID, page, search, limit, setTotalPages) => (dispatch) => {
    dispatch(getNOSWiseOfflineBatchDetails([]));
    const URL =
      search && search !== ""
        ? `${GET_OFFLINE_BATCH_DETAILS_API}/${batchID}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_OFFLINE_BATCH_DETAILS_API}/${batchID}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(`${URL}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          const { totalPages, result } = a.details;

          dispatch(
            getNOSWiseOfflineBatchDetails(a?.details?.candidateResultList)
          );
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

export const uploadResultApi =
  (setLoading, formData, type, navigate) => (dispatch) => {
    const URL =
      type === "offline" ? UPLOAD_OFFLINE_RESULT_API : UPLOAD_ONLINE_RESULT_API;
    api()
      .root(API_ROOT)
      .post(URL)
      .data(formData)
      .success((a) => {
        if (a?.statusCode === 200 || 201) {
          setLoading && setLoading(false);
          successToast(a?.message);
          navigate(-1);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.error?.error ?? err?.message);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getSingleCandidateResultOfflineApi =
  (setLoading, batchId, canId, page, limit) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_SINGLE_CANDIDATE_RESULT_OFFLINE_API}/${batchId}/${canId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          dispatch(
            getCandidateDetailsNOSWiseOffline([a?.details?.candidateResult])
          );
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

export const getSampleResultSheetApi =
  (setLoading, batchID, type) => (dispatch) => {
    const URL =
      type === "online"
        ? DOWNLOAD_ONLINE_RESULTS_SAMPLE_API
        : DOWNLOAD_OFFLINE_RESULTS_SAMPLE_API;
    const token = getLocal();
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "x-auth-token": token,
    };

    fetch(`${API_ROOT}${URL}/${batchID}`, {
      headers: header,
    }).then((response) => {
      if (response?.status !== 200) {
        errorToast("No Candidate Found");
      } else {
        response.blob().then((blob) => {
          // Creating new object of PDF file
          const fileURL = window.URL.createObjectURL(blob);
          // Setting various property values
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.download = `sample_file_${type}_results.xlsx`;
          alink.click();
        });
      }
    });
  };

export const getSingleCandidateResultOnlineApi =
  (setLoading, batchId, canId) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_SINGLE_CANDIDATE_RESULT_ONLINE_API}/${batchId}/${canId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          dispatch(
            getCandidateDetailsNOSWiseOffline([a?.details?.candidateResult])
          );
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

export const getCandidateAnswerDetailsApi =
  (setLoading, batchID, candidateID, quesID, setFormValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(
        `${GET_CANDIDATE_ANSWERED_QUESTION_DETAILS_API}/${batchID}/${candidateID}/${quesID}`
      )
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          const allDetails = a?.details?.questionList?.questions[0];
          setFormValues({ ...allDetails });
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
export const updateCandidateAnswerDetailsApi =
  (setLoading, batchID, candidateID, quesID, payload, navigate) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(
        `${UPDATE_CANDIDATE_RESULT_QUESTION_API}/${batchID}/${candidateID}/${quesID}`
      )
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast(a?.message);
          navigate(-1);
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

export const getMasterDownloadSheetApi =
  (setLoading, batchID, type, batchName = "Batch", isMultiJobRole = false) =>
  (dispatch) => {
    const URL =
      type === "online"
        ? DOWNLOAD_ONLINE_RESULTS_API
        : DOWNLOAD_OFFLINE_RESULTS_API;
    const token = getLocal();
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "x-auth-token": token,
    };

    fetch(`${API_ROOT}${URL}/${batchID}`, {
      headers: header,
    }).then((response) => {
      if (response?.status !== 200) {
        errorToast("No Candidate Found");
        setLoading(false);
      } else {
        setLoading(false);
        response.blob().then((blob) => {
          // Creating new object of PDF file
          const fileURL = window.URL.createObjectURL(blob);
          // Setting various property values
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.download = isMultiJobRole
            ? `${batchName}.zip`
            : `${batchName} NOSwise Result.xlsx`;
          alink.click();
        });
      }
    });
  };

export const getOnlineResultDownloadSheetApi =
  (setLoading, batchID, candidateId, candidateName) => (dispatch) => {
    const URL = DOWNLOAD_ONLINE_RESULTS_WITH_OPTION_API;
    const token = getLocal();
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "x-auth-token": token,
    };

    fetch(`${API_ROOT}${URL}/${batchID}/${candidateId}`, {
      headers: header,
    }).then((response) => {
      if (response?.status !== 200) {
        errorToast("No Candidate Found");
        setLoading && setLoading(false);
      } else {
        setLoading && setLoading(false);
        response.blob().then((blob) => {
          // Creating new object of PDF file
          const fileURL = window.URL.createObjectURL(blob);
          // Setting various property values
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.download = `${candidateName} Result.xlsx`;
          alink.click();
        });
      }
    });
  };

export const getOnlineResultDownloadSheetApiWithCandidateData =
  (setLoading, batchID, batchIdName) => (dispatch) => {
    const URL = DOWNLOAD_ONLINE_RESULT_WITH_CANDIDATE_DATA_API;
    const token = getLocal();
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "x-auth-token": token,
    };

    fetch(`${API_ROOT}${URL}/${batchID}`, {
      headers: header,
    }).then((response) => {
      if (response?.status !== 200) {
        errorToast("No Candidate Found");
        setLoading && setLoading(false);
      } else {
        setLoading && setLoading(false);
        response.blob().then((blob) => {
          // Creating new object of PDF file
          const fileURL = window.URL.createObjectURL(blob);
          // Setting various property values
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.download = `${batchIdName} Result.xlsx`;
          alink.click();
        });
      }
    });
  };

export const downloadAttendanceSheetApi =
  (setLoading, batchID, batchName) => (dispatch) => {
    const URL = DOWNLOAD_BATCH_ATTENDANCE_API;
    const token = getLocal();
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "x-auth-token": token,
    };

    fetch(`${API_ROOT}${URL}/${batchID}`, {
      headers: header,
    }).then((response) => {
      if (response?.status !== 200) {
        errorToast("No Candidate Found");
        setLoading && setLoading(false);
      } else {
        setLoading && setLoading(false);
        response.blob().then((blob) => {
          // Creating new object of PDF file
          const fileURL = window.URL.createObjectURL(blob);
          // Setting various property values
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.download = `${batchName} Attendance.xlsx`;
          alink.click();
        });
      }
    });
  };

export const getBatchResultsDownloadZipApi =
  (setLoading, batchID, zipName) => (dispatch) => {
    const URL = DOWNLOAD_BATCH_RESULTS_ZIP_API; // Update with the correct API endpoint for ZIP download
    const token = getLocal();
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "x-auth-token": token,
    };

    fetch(`${API_ROOT}${URL}/${batchID}`, {
      headers: header,
    })
      .then((response) => {
        if (response?.status !== 200) {
          errorToast("No Results Found for Batch");
          setLoading && setLoading(false);
        } else {
          setLoading && setLoading(false);
          response.blob().then((blob) => {
            // Creating a URL for the ZIP file
            const fileURL = window.URL.createObjectURL(blob);
            // Creating a link to download the ZIP file
            let alink = document.createElement("a");
            alink.href = fileURL;
            alink.download = `${zipName}.zip`;
            alink.click();
          });
        }
      })
      .catch((error) => {
        setLoading && setLoading(false);
        errorToast("An error occurred while downloading results");
        console.error("Error downloading ZIP:", error);
      });
  };

export const getCandidatesWithQuestionsApi = (setLoading, id) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_CANDIDATE_LIST_WITH_QUESTIONS}/${id}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200 || 201) {
        dispatch(getCandidateListWithQuestions(a?.details));
      }
    })
    .error((err) => {
      setLoading && setLoading(false);
      errorToast(err?.message);
      dispatch(getCandidateListWithQuestions([]));
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const uploadCandidatesAnswerSheetApi =
  (setLoading, id, payload) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_CANDIDATE_OMR_SHEET}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          successToast("Data Updated Succesfully");
          dispatch(getCandidatesWithQuestionsApi(setLoading, id));
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

export const getSingleCandidatePortalStatsOfflineApi =
  (setLoading, id) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_PORTAL_STATS_SINGLE_CANDIDATE_OFFLINE}/${id}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          dispatch(getOfflineSingleCandidatePortalStats(a?.details));
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.message);
        dispatch(getOfflineSingleCandidatePortalStats({}));
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
