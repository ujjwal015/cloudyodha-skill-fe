import api from "../../utils/apiHelper.js";
import {
  devConsoleLog,
  errorToast,
  getLocal,
  successToast,
  getUniqueValue,
} from "../../utils/projectHelper";

import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  BULK_UPLOAD_QUESTIONS_API,
  DOWNLOAD_SAMPLE_QUESTIONS_API,
  QUESTION_BANK_FILTER_BY_ID_API,
  EDIT_QUESTION_BANK_FORM_API,
  DELETE_QUESTION_BANK_FORM_API,
  DELETE_QUESTION_SECTION_API,
  GET_SECTION_DETAILS_BY_ID_API,
  EDIT_SECTION_DETAILS_API,
  GET_PARTICULAR_QUESTION_DETAILS_API,
  UPDATE_PARTICULAR_QUESTION_DETAILS_API,
  DELETE_PARTICULAR_QUESTION_DETAILS_API,
  QUESTION_BANK_SECTION_FILTER_API,
  QUESTION_BANK_FILTER_NEW_API,
  CREATE_QUESTION_FORM_API,
  QUESTION_FORM_LIST_API,
  QUESTION_FORM_STATUS_CHANGE_API,
  GET_SINGLE_QUESTION_FORM_API,
  UPDATE_SINGLE_QB_FORM_API,
  DELETE_QB_FORM_API,
  NOS_LIST_API,
  DOWNLOAD_SAMPLE_ADMIN_API,
  DOWNLOAD_SAMPLE_NOS_PRACTICAL_API,
  UPLOAD_NOS_PRACTICAL_API,
  NOS_LIST_VIVA_API,
  DOWNLOAD_SAMPLE_NOS_THEORY_API,
  UPLOAD_NOS_THEORY_API,
  NOS_THEORY_LIST_API,
  NOS_VIVA_LIST_API,
  NOS_LIST_ALL_API,
  SECTION_WISE_NOS_LIST_API,
  SPECIFIC_NOS_DETAILS_API,
  VIEW_ALL_QUESTIONS_API,
  DELETE_NOS_API,
  GET_VIVA_QUESTION_DETAILS_API,
  GET_PRACTICAL_QUESTION_DETAILS_API,
  UPDATE_PRACTICAL_QUESTION_DETAILS_API,
  UPDATE_VIVA_QUESTION_DETAILS_API,
  DELETE_VIVA_QUESTION_API,
  DELETE_PRACTICAL_QUESTION_API,
  DOWNLOAD_PRACTICAL_SAMPLE_FILE_API,
  DOWNLOAD_VIVA_SAMPLE_FILE_API,
  STATUS_CHANGE_NOS_API,
  DOWNLOAD_SAMPLE_SECONDARY_LANG_QB_API,
  UPLOAD_SECONDARY_LANG_QSTNS_API,
  DOWNLOAD_SAMPLE_SECONDARY_LANG_VIVAPRACTICAL_QB_API,
  UPLOAD_SECONDARY_LANG_VP_QSTNS_API,
  GET_LENGTH_OF_QUESTIONS,
  BATCH_JOB_ROLE_LIST_API,
} from "../../config/constants/apiConstants/superAdmin";

import {
  getQuestionDetailsByID,
  getSearchResultsQuestionBank,
  getSectionDetailsByID,
  getSectionsByJobRole,
} from "../../redux/slicers/clientSlice.js";
import {
  getQbFormList,
  getNosList,
  getNosVivaList,
  getNosTheoryList,
  getSpecificNosDetails,
  getAllQuestions,
  getSectionWiseNosList,
  getPracticalQuestionDetails,
  getVivaQuestionDetails,
  getQuestionsLength,
  getjobRoleListForFilter,
} from "../../redux/slicers/superAdmin/questionBankSlice.js";
import {
  getQuestionBankListApi,
  getQuestionListApi,
  getQuestionPreviewApi,
} from "./../authApi.js";

import {
  SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE,
  SUPER_ADMIN_QUESTION_LIST,
  SUPER_ADMIN_QUESTION_PREVIEW_PAGE,
  SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
  SUPER_ADMIN_QUESTION,
  SUPER_ADMIN_BULK_UPLOAD_QUESTION,
  QUESTION_BANK_NOS,
  SUPER_ADMIN_VIEW_QUESTIONS_PAGE,
} from "../../config/constants/routePathConstants/superAdmin.js";
import { clear } from "@testing-library/user-event/dist/clear.js";
//QUESTION BANK APIS -------------START------------------
export const postBulkUploadQuestionsApi =
  (formData, setLoading, navigate, section, qbID) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(BULK_UPLOAD_QUESTIONS_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          // dispatch(getDashboardGridStyle(a?.details));
          navigate(`${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${qbID}/${section}`);
          successToast("Questions Uploaded Successfully in Primary Language");
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        errorToast(`${e?.error} in Primary Language`);
        devConsoleLog(e);
        navigate(`${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${qbID}/${section}`);
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const getSampleQuestionsDownloadApi = (section) => (dispatch) => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };
  const URL =
    section === "practical"
      ? DOWNLOAD_PRACTICAL_SAMPLE_FILE_API
      : section === "viva"
      ? DOWNLOAD_VIVA_SAMPLE_FILE_API
      : DOWNLOAD_SAMPLE_QUESTIONS_API;

  fetch(`${API_ROOT}${URL}`, {
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
        alink.download =
          (section && `sample_file_${section}-qn_bank`) ||
          "sample_file_theory-qn_bank";
        alink.click();
      });
    }
  });
};

export const getQuestionBankSearchResultApi =
  (setLoading, query) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${QUESTION_BANK_FILTER_BY_ID_API}/${query}`)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getSearchResultsQuestionBank([a?.details]));
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading(false);
      });
  };
export const getQuestionBankSearchResultNewApi =
  (setLoading, query) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${QUESTION_BANK_FILTER_NEW_API}?search=${query}`)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          dispatch(
            getSearchResultsQuestionBank(a?.details.questionBankDetails)
          );
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const getSectionDetailsByJobRoleApi =
  (setLoading, query) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${QUESTION_BANK_SECTION_FILTER_API}?page=1&search=${query}`)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getSectionsByJobRole(a?.details.sectionDetails));
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const editQuestionBankFormApi =
  (setLoading, payload, navigate, clearFormValues) => () => {
    api()
      .root(API_ROOT)
      .put(`${EDIT_QUESTION_BANK_FORM_API}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("Details Updated Successfully!");
          clearFormValues();
          navigate(SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE);
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

export const deleteQuestionBankFormApi =
  (setLoading, setDeleteModal, id, getQuestionList) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_QUESTION_BANK_FORM_API}/${id}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          setLoading(true);
          getQuestionList();
          setDeleteModal();
          successToast("Question Bank Deleted");
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
export const deleteSectionApi =
  (setLoading, setDeleteModal, id, getList) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_QUESTION_SECTION_API}/${id}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          setLoading(true);
          setDeleteModal(false);
          getList();
          successToast("Question Section Deleted");
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

export const getSectionDetailsApi = (setLoading, id) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_SECTION_DETAILS_BY_ID_API}/${id}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getSectionDetailsByID(a.details));
      }
    })
    .error((e) => {
      setLoading && setLoading(false);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const editSectionDetailsApi =
  (setLoading, payload, id, clearFormValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${EDIT_SECTION_DETAILS_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("Details Updated Successfully!");
          clearFormValues();
          navigate(SUPER_ADMIN_QUESTION_LIST);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast("Something went wrong please try again!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getParticularQuestionDetailsApi =
  (setLoading, id, setFormValues, lang) => (dispatch) => {
    if (lang === "def") lang = "";
    api()
      .root(API_ROOT)
      .get(`${GET_PARTICULAR_QUESTION_DETAILS_API}/${id}?lang=${lang}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const fetchedData = a?.details;
          const fetchedOptions = fetchedData?.options;
          const updatedOptions = fetchedOptions.map((el, index) => {
            // console.log(el);
            const option = {
              title: el?.optionValue,
              optionId: el?.optionKey,
              isSelect: el?.isSelect,
              optionUrl: el?.optionUrl,
              optionImgKey: el?.optionImgKey,
            };
            return option;
          });

          const filteredDetails = {
            question_bank_id: fetchedData?.question_bank_id,
            questions: [
              {
                difficulty_level: fetchedData?.difficulty_level,
                marks: fetchedData?.marks,
                answer: fetchedData?.answer[0]?.rawAnswer.toLowerCase(),
                questionText: fetchedData?.questionText,
                options: updatedOptions,
              },
            ],
          };

          const newData = { ...filteredDetails };
          setFormValues({ ...newData });
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const updateParticularQuestionApi =
  (setLoading, payload, id, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_PARTICULAR_QUESTION_DETAILS_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const id = localStorage.getItem("section_id");
          localStorage.removeItem("section_id");
          navigate(-1);
          successToast(a.message);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast("Oops, Something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const deleteParticularQuestionApi =
  (setLoading, setDeleteModal, id, getList, section) => () => {
    const URL =
      section === "practical"
        ? DELETE_PRACTICAL_QUESTION_API
        : section === "viva"
        ? DELETE_VIVA_QUESTION_API
        : DELETE_PARTICULAR_QUESTION_DETAILS_API;
    api()
      .root(API_ROOT)
      .delete(`${URL}/${id}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode == 200) {
          setDeleteModal(false);
          successToast("Question Deleted Successfully!");
          getList();
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast("Oops, Something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

// As per new flow Question Form API

export const getQuestionFormListApi =
  (
    setLoading,
    page,
    search,
    limit,
    setTotalPages,
    section = "",
    language = "",
    jobRole = "",
    clientId = "",
    customFilter = false,
    setIsFilterApplied,
    setFormValues
  ) =>
  (dispatch) => {
    if (section === "All") section = "";
    const savedFilter = JSON.parse(localStorage.getItem("qbFilter"));
    if (savedFilter) {
      setFormValues((pre) => ({
        ...pre,
        jobRole: savedFilter?.jobRole,
        clientId: savedFilter?.clientId,
        customFilter: savedFilter?.customFilter,
      }));

      jobRole = savedFilter?.jobRole;
      clientId = savedFilter?.clientId;
      customFilter = savedFilter?.customFilter;
    }
    const URL =
      search && search !== ""
        ? `${QUESTION_FORM_LIST_API}?search=${search}&page=${page}&limit=${limit}&section=${section}&language=${language}&jobRole=${jobRole}&clientId=${clientId}&customFilter=${customFilter}`
        : `${QUESTION_FORM_LIST_API}?page=${page}&limit=${limit}&section=${section}&language=${language}&jobRole=${jobRole}&clientId=${clientId}&customFilter=${customFilter}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        if (jobRole || clientId) setIsFilterApplied && setIsFilterApplied(true);
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getQbFormList(a?.details?.questionDetails));
          setTotalPages(a?.details?.totalPages);
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

export const getNosListApi = (setLoading) => (dispatch) => {
  const URL = NOS_LIST_API;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getNosList(a?.details?.nosDetails));
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
export const getNosListSectionWiseApi =
  (setLoading, jobRole, section) => (dispatch) => {
    const URL = SECTION_WISE_NOS_LIST_API;
    api()
      .root(API_ROOT)
      .get(`${URL}?jobRole=${jobRole}&section=${section}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getSectionWiseNosList(a?.details?.nosDetails));
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

export const createQbFormApi =
  (formValues, setLoading, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .post(CREATE_QUESTION_FORM_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 201) {
          successToast(msg);
          clearFormValues();
          navigate(SUPER_ADMIN_QUESTION_FORM_LIST_PAGE);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
        // errorToast(msg);
        errorToast(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const changeSingleQbFormStatusApi =
  (setLoading, formData, getList) => () => {
    api()
      .root(API_ROOT)
      .post(`${QUESTION_FORM_STATUS_CHANGE_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast(msg);
          getList();
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

export const getSingleQbFormApi =
  (setLoading, setFormValues, formId) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_SINGLE_QUESTION_FORM_API}/${formId}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          setFormValues({
            jobRole: a?.details?.jobRole,
            nos: a?.details?.nos,
            qpCode: a?.details?.qpCode,
            jobLevel: a?.details?.jobLevel,
            version: a?.details?.version,
            section: a?.details?.section,
            questionType: a?.details?.questionType,
            language: a?.details?.language,
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

export const updateSingleQbFormApi =
  (setLoading, formValues, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_SINGLE_QB_FORM_API}`)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast("Question form updated successfully .");
          navigate(SUPER_ADMIN_QUESTION_FORM_LIST_PAGE);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
        errorToast("Please enter valid input");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const deleteSingleQbFormApi =
  (setLoading, formId, len, getList, setDeleteModal) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_QB_FORM_API}/${formId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          getList(true, len);
          setLoading(true);
          setDeleteModal(false);
          successToast("Question bank form deleted successfully .");
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

export const getSampleExcelNOSPracticalApi = () => (dispatch) => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };

  fetch(`${API_ROOT}${DOWNLOAD_SAMPLE_NOS_PRACTICAL_API}`, {
    headers: header,
  }).then((response) => {
    response.blob().then((blob) => {
      // Creating new object of PDF file
      const fileURL = window.URL.createObjectURL(blob);
      // Setting various property values
      let alink = document.createElement("a");
      alink.href = fileURL;
      alink.download = "sample_file_bulk_nos_viva-practical";
      alink.click();
    });
  });
};
export const getSampleExcelNOSTheoryApi = () => (dispatch) => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };

  fetch(`${API_ROOT}${DOWNLOAD_SAMPLE_NOS_THEORY_API}`, {
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
        alink.download = "sample_file_bulk_nos_theory";
        alink.click();
      });
    }
  });
};

export const postBulkUploadNOSPracticalApi =
  (formData, setLoading, clearFormValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(UPLOAD_NOS_PRACTICAL_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          clearFormValues();
          successToast(msg);
          navigate(QUESTION_BANK_NOS);
        }
      })
      .error((e) => {
        setLoading(false);
        errorToast(e?.error|| e?.message?.message);
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const postBulkUploadNOSTheoryApi =
  (formData, setLoading, clearFormValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(UPLOAD_NOS_THEORY_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          clearFormValues();
          successToast(msg);
          navigate(QUESTION_BANK_NOS);
        }
      })
      .error((e) => {
        setLoading(false);
        errorToast(e?.error || e?.message?.message);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getNOSListVivaPracticalApi =
  (setLoading, page, search, limit, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${NOS_LIST_VIVA_API}?search=${search}&page=${page}&limit=${limit}`
        : `${NOS_LIST_VIVA_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          // dispatch(getNosList(a?.details?.nosDetails));
          setTotalPages(a?.details?.totalPages);
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

export const getTheoryNosListApi = (setLoading) => (dispatch) => {
  const URL = NOS_THEORY_LIST_API;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getNosTheoryList(a?.details?.nosDetails));
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

export const getVivaNosListApi = (setLoading) => (dispatch) => {
  const URL = NOS_VIVA_LIST_API;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getNosVivaList(a?.details?.nosDetails));
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

export const getAllNosListApi =
  (setLoading, page, search, limit, setTotalPages, section = "All") =>
  (dispatch) => {
    const URL =
      search && search !== ""
        ? `${NOS_LIST_ALL_API}?nos=${section}&search=${search}&page=${page}&limit=${limit}`
        : `${NOS_LIST_ALL_API}?nos=${section}&page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(`${URL}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode == 200) {
          if (section != "All") {
            dispatch(getNosList(a?.details?.nosDetails));
          } else dispatch(getNosList(a?.details?.allnos));
          setTotalPages(a?.details?.totalPages);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        const { message: msg = "" } = err;
        // const { error } = err.error;
        // errorToast(msg);
      })
      .send(() => setLoading && setLoading(false));
  };

export const getSpecificNOSApi =
  (setLoading, id, search, setTotalPages) => (dispatch) => {
    const url =
      (search && `${SPECIFIC_NOS_DETAILS_API}/${id}?search=${search}`) ||
      `${SPECIFIC_NOS_DETAILS_API}/${id}`;
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getSpecificNosDetails([a?.details]));
          setTotalPages && setTotalPages(a?.details?.totalPages);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast("Something went wrong");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const createQbFormAndNextApi =
  (formValues, setLoading, clearFormValues, navigate, section) => () => {
    api()
      .root(API_ROOT)
      .post(CREATE_QUESTION_FORM_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 201) {
          successToast(msg);
          clearFormValues();
          if (a?.details?.section === "Theory") {
            navigate(`${SUPER_ADMIN_QUESTION}/${a?.details?._id}`);
          } else
            navigate(
              `${SUPER_ADMIN_BULK_UPLOAD_QUESTION}/${a?.details?._id}/${section}`
            );
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
        // errorToast(msg);
        errorToast(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const getQuestionsListApi =
  (
    setLoading,
    page,
    search,
    limit,
    setTotalPages,
    id,
    lang,
    setFetchedLanguages
  ) =>
  (dispatch) => {
    const URL =
      search && search !== ""
        ? `${VIEW_ALL_QUESTIONS_API}/${id}?search=${search}&page=${page}&limit=${limit}&lang=${lang}`
        : `${VIEW_ALL_QUESTIONS_API}/${id}?page=${page}&limit=${limit}&lang=${lang}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { questions, uniqueLanguages } = a.details;
          dispatch(getAllQuestions(questions));
          setTotalPages(a?.details?.totalPages);
          const modifiedData = uniqueLanguages.map((el) => {
            return {
              label: el,
              value: el,
            };
          });

          setFetchedLanguages([...modifiedData]);
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

export const deleteNOSApi =
  (setLoading, id, len, getList, setDeleteModal) => (dispatch) => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_NOS_API}/${id}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          getList(true, len);
          setLoading(true);
          setDeleteModal(false);
          successToast("NOS deleted successfully .");
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

export const getVivaQuestionDetailsApi =
  (setLoading, id, lang) => (dispatch) => {
    if (lang === "def") lang = "";
    api()
      .root(API_ROOT)
      .get(`${GET_VIVA_QUESTION_DETAILS_API}/${id}?lang=${lang}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { details } = a;
          dispatch(getPracticalQuestionDetails([details]));
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
export const getPracticalQuestionDetailsApi =
  (setLoading, id, lang) => (dispatch) => {
    if (lang === "def") lang = "";
    api()
      .root(API_ROOT)
      .get(`${GET_PRACTICAL_QUESTION_DETAILS_API}/${id}?lang=${lang}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { details } = a;
          dispatch(getPracticalQuestionDetails([details]));
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const updatePracticalQuestionApi =
  (payload, navigate, setLoading, clearFormValues, qId, qbid, section) =>
  () => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_PRACTICAL_QUESTION_DETAILS_API}/${qId}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200 || 201) {
          successToast(a?.message);
          clearFormValues();
          navigate(`${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${qbid}/${section}`);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.error);
      })
      .send(() => {
        setLoading(false);
      });
  };
export const updateVivaQuestionApi =
  (payload, navigate, setLoading, clearFormValues, qId, qbid, section) =>
  () => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_VIVA_QUESTION_DETAILS_API}/${qId}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200 || 201) {
          successToast(a?.message);
          clearFormValues();
          navigate(`${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${qbid}/${section}`);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.error);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const changeStatusNOSApi =
  (setLoading, payload, getList) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(STATUS_CHANGE_NOS_API)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          getList();
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

export const downloadSecondaryLangSampleApi = (id, setLoading) => () => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };

  fetch(`${API_ROOT}${DOWNLOAD_SAMPLE_SECONDARY_LANG_QB_API}/${id}`, {
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
        alink.download = "Secondary Language QB Sample";
        alink.click();
        setLoading(false);
      });
    }
  });
};

export const uploadSecondaryLangQuestionsApi =
  (payload, setLoading, navigate, qbId) => () => {
    api()
      .root(API_ROOT)
      .post(UPLOAD_SECONDARY_LANG_QSTNS_API)
      .data(payload)
      .success((a) => {
        if (a?.statusCode === 200) {
          const { message } = a.details;
          navigate(`${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${qbId}/Theory`);
          successToast("Questions Uploaded Successfully in Secondary Language");
        }
      })
      .error((err) => {
        setLoading(false);
        const { error, message } = err;
        errorToast(`${message} in Secondary Language`);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const downloadSecondaryLangSampleVivaPracticalApi =
  (id, section, setLoading) => () => {
    const token = getLocal();
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "x-auth-token": token,
    };

    fetch(
      `${API_ROOT}${DOWNLOAD_SAMPLE_SECONDARY_LANG_VIVAPRACTICAL_QB_API}/${id}/${section}`,
      {
        headers: header,
      }
    ).then((response) => {
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
          alink.download = `${section} secondary-lang sample`;
          alink.click();
          setLoading(false);
        });
      }
    });
  };

export const uploadVPSecondaryLangQuestionsApi =
  (payload, section, setLoading, navigate, qbId) => () => {
    api()
      .root(API_ROOT)
      .post(`${UPLOAD_SECONDARY_LANG_VP_QSTNS_API}/${section}`)
      .data(payload)
      .success((a) => {
        if (a?.statusCode === 200) {
          const { message } = a.details;
          navigate(`${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${qbId}/${section}`);
          successToast("Questions Uploaded Successfully in Secondary Language");
        }
      })
      .error((err) => {
        setLoading(false);
        const { error, message } = err;
        errorToast(`${message} in Secondary Language`);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const getLengthOfQuestionsApi =
  (qbId, setLoading, section) => (dispatch) => {
    if (section === "viva") section = "Viva";
    else if (section === "practical") section = "Practical";
    else section = "Theory";
    api()
      .root(API_ROOT)
      .get(`${GET_LENGTH_OF_QUESTIONS}/${qbId}?section=${section}`)
      .success((a) => {
        if (a?.statusCode === 200) {
          dispatch(getQuestionsLength(a?.details));
        }
      })
      .error((err) => {
        setLoading(false);
        const { error, message } = err;
        // errorToast(`${message} in Secondary Language`);
      })
      .upload(() => {
        setLoading(false);
      });
  };
export const getAllJobRoleforBatchApi = (setLoading, clientId = null) => (dispatch) => {
  const URL=clientId?`${BATCH_JOB_ROLE_LIST_API}?clientId=${clientId}`:BATCH_JOB_ROLE_LIST_API
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      if (a?.statusCode === 200) {
        setLoading(false);
        const { details } = a;
        dispatch(getjobRoleListForFilter(details));
      }
    })
    .error((err) => {
      setLoading(false);
    })
    .send(() => {
      setLoading(false);
    });
};
