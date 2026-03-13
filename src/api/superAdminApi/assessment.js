import api from "../../utils/apiHelper.js";
import {
  devConsoleLog,
  errorToast,
  successToast,
  getUniqueValue,
} from "../../utils/projectHelper";

import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  GET_ASSESSMENT_LIST_API,
  CREATE_ASSESSMENT_API,
  GET_ASSESSMENT_QUESTION_PREVIEW_API,
  SELECT_ASSESSMENT_QUESTION_API,
  GET_PREVIEW_ASSESSMENT_API,
  GET_JOBROLE_LIST_API,
  GET_JOBROLE_BASED_QUESTION_BANK_LIST_API,
  DELETE_ASSESSMENT_API,
  CREATE_FINAL_ASSESSMENT_API,
  REMOVE_QUESTION_ASSESSMENT_API,
  UPDATE_ASSESSMENT_API,
  GET_ASSESSMENT_PREVIEW_BY_ID,
  GET_PREVIEW_ASSESSMENT_LIST_API,
} from "../../config/constants/apiConstants/superAdmin";

import {
  getAssessmentList,
  getAssessmentPreviewList,
  getQuestionBankList,
  getPreviewAssessment,
  getJobRoleList,
  getSchemeList,
  getSingleAssessmentDetail,
  getPreviewAssessmentForAddQn,
  getAssessmentPreviewById,
  getAssessmentLangs,
} from "../../redux/slicers/superAdmin/assessmentSlice";

import {
  SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE,
  SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
} from "../../config/constants/routePathConstants/superAdmin.js";

export const getAssessmentListApi =
  (setLoading, page, limit, search, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_ASSESSMENT_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_ASSESSMENT_LIST_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getAssessmentList(a?.details));
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

export const getPreviewAssessmentListApi =
  (setLoading, page, limit, search, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_PREVIEW_ASSESSMENT_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_PREVIEW_ASSESSMENT_LIST_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getAssessmentList(a?.details));
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

export const createAssessmentApi =
  (formValues, setLoading, clearFormValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_ASSESSMENT_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          clearFormValues();
          const { _id = "" } = a?.details;
          navigate(`${SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE}/${_id}`);
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

export const selectAssessmentQuestionApi =
  (formValues, setLoading, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(SELECT_ASSESSMENT_QUESTION_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          // successToast(msg)
          navigate(
            `${SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE}/${formValues.assessment_id}`
          );
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const updateAssessmentApi =
  (setLoading, id, payload, navigate) => () => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_ASSESSMENT_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          successToast("Details Updated Successfully");
          navigate(SUPER_ADMIN_ASSESSMENT_LIST_PAGE);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast("Oops, something went wrong!");
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getAssessmentQuestionPreviewApi =
  (
    setLoading,
    id,
    page,
    limit,
    setTotalPages,
    setQuestionType,
    handlePreSelectQn
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .get(
        `${GET_ASSESSMENT_QUESTION_PREVIEW_API}?id=${id}&page=${page}&limit=${limit}`
      )
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          dispatch(getAssessmentPreviewList(a?.details?.questions));
          setTotalPages(a?.details?.totalPages);
          setQuestionType(a?.details?.questionType);
          handlePreSelectQn && handlePreSelectQn(a?.details?.questions);
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

export const getSelectionQuestionApi =
  (setLoading, JOBROLE, page, limit, search, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_JOBROLE_BASED_QUESTION_BANK_LIST_API}${JOBROLE}&page=${page}&limit=${limit}&search=${search}`
        : `${GET_JOBROLE_BASED_QUESTION_BANK_LIST_API}${JOBROLE}&page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          setTotalPages(a?.details?.totalPages);
          dispatch(getQuestionBankList(a?.details?.questionBankDetails));
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

const callSetIdOneApi = async (setId) => {
  let data;
  const URL = `${GET_ASSESSMENT_PREVIEW_BY_ID}/${setId}`;
  await api()
    .root(API_ROOT)
    .get(URL)
    .success((res) => {
      data = res;
    })
    .send();
  return data;
};

export const downloadTheoryVivaPracticalSet = async (
  sets,
  generateTheoryPdf,
  selectedLanguage,
  clientName,
  clientLogo
) => {
  const promises = [];

  for (const set of sets) {
    if (set.isChecked) {
      const promise = callSetIdOneApi(set.setID)
        .then((result) => {
          const setName = result?.details?.existingSet?.setName;
          const questions = result.details.existingSet.question_id;
          const setStatus = result?.details?.existingSet?.status;
          generateTheoryPdf(setName,questions,selectedLanguage,clientName,clientLogo)
          // below code is not used currently for downloading pdf data
          const allResponses = result.details?.existingSet?.question_id?.map(
            (item) => ({
              setName: setName,
              question: item?.questionText,
              // difficulty_level:item?.difficulty_level,
              option_1: item?.options[0]?.optionValue || "NA",
              option_2: item?.options[1]?.optionValue || "NA",
              option_3: item?.options[2]?.optionValue || "NA",
              option_4: item?.options[3]?.optionValue || "NA",
              question_Status: item?.questionStatus?.notAttempt
                ? "Not Attempt"
                : item?.questionStatus?.answered
                ? "Answered"
                : item?.questionStatus?.notAnswered
                ? "Not Answered"
                : item?.questionStatus?.markForReview
                ? "Mark For Review"
                : item?.questionStatus?.answeredMarkForReview
                ? "Answered Mark For Review"
                : "NA",
              // status:setStatus?"Active":"Inactive"
            })
          );
          return allResponses;
        })
        .catch((error) => {
          // Handle the error appropriately
          throw error;
        });

      promises.push(promise);
    } else {
    }
  }
  try {
    const allResponses = await Promise.all(promises);
    const flattenedResponses = allResponses.flat();
    // downloadPdfDocument(flattenedResponses);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getPreviewAssessmentByIdApi =
  (setLoading, setId, downloadPdfDocument) => (dispatch) => {
    const URL = `${GET_ASSESSMENT_PREVIEW_BY_ID}/${setId}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getAssessmentPreviewById(a?.details?.existingSet));
          const setName = a?.details?.existingSet?.setName;
          const setStatus = a?.details?.existingSet?.status;
          const allData = a?.details?.existingSet?.question_id?.map(
            (item, index) => ({
              setName: setName,
              question: item?.questionText,
              // difficulty_level:item?.difficulty_level,
              option_1: item?.options[0]?.optionValue || "NA",
              option_2: item?.options[1]?.optionValue || "NA",
              option_3: item?.options[2]?.optionValue || "NA",
              option_4: item?.options[3]?.optionValue || "NA",
              question_Status: item?.questionStatus?.notAttempt
                ? "Not Attempt"
                : item?.questionStatus?.answered
                ? "Answered"
                : item?.questionStatus?.notAnswered
                ? "Not Answered"
                : item?.questionStatus?.markForReview
                ? "Mark For Review"
                : item?.questionStatus?.answeredMarkForReview
                ? "Answered Mark For Review"
                : "NA",
              // status:setStatus?"Active":"Inactive"
            })
          );
          downloadPdfDocument(allData);
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

export const getPreviewAssessmentDataForPdf=(assesmentId,setId,setLanguages,page=1,limit=50,lang="",type="Theory") =>
  (dispatch)=>{
  const URL = `${GET_PREVIEW_ASSESSMENT_API}?id=${assesmentId}&set_id=${setId}&page=${page}&limit=${limit}&lang=${lang}&type=${type}`;

  api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        if (a.statusCode === 200) {
          const { totalPages, totalCounts, Assesment, uniqueLanguages } =
            a?.details;
          const payload = [Assesment, uniqueLanguages];
          if (uniqueLanguages.length > 0) {
            const filteredLangs = uniqueLanguages?.filter((lang)=>lang!=="").map((el) => {
              return {
                label: el,
                value: el,
              };
            });
            setLanguages([...filteredLangs]);
          } else setLanguages([]);

          dispatch(getPreviewAssessment(payload));
        }
      })
      .error((e) => {
        const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
      });
}
export const getPreviewAssessmentApi =
  (
    id,
    setId,
    setLoading,
    page,
    limit,
    setTotalPages,
    setTotalCounts,
    lang,
    type,
    setQnId,
    qnId
  ) =>
  (dispatch) => {
    if (type && type !== "Theory") type = "Viva";
    const URL = `${GET_PREVIEW_ASSESSMENT_API}?id=${id}&set_id=${setId}&page=${page}&limit=${limit}&lang=${lang}&type=${type}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, totalCounts, Assesment, uniqueLanguages } =
            a?.details;
          setTotalPages(totalPages);
          setTotalCounts(totalCounts);
          const payload = [Assesment, uniqueLanguages];

          dispatch(getPreviewAssessment(payload));
          // dispatch(getAssessmentLangs(uniqueLanguages));
          setQnId && setQnId(qnId);
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

export const getPreviewAssessmentForAddQnApi =
  (id, setLoading, setQuestionIds) => (dispatch) => {
    const URL = `${GET_PREVIEW_ASSESSMENT_API}?id=${id}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(
            getPreviewAssessmentForAddQn(a?.details?.Assesment?.question_id)
          );
          const ids = a?.details?.Assesment?.question_id?.map(
            (item) => item?._id
          );
          setQuestionIds(ids);
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

export const getAssessmentDetailApi = (id, getQuestionList) => (dispatch) => {
  const URL = `${GET_PREVIEW_ASSESSMENT_API}?id=${id}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      if (a.statusCode === 200) {
        dispatch(getSingleAssessmentDetail(a?.details?.Assesment));
        getQuestionList(a?.details?.Assesment?.jobRole);
      }
    })
    .error((e) => {
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {});
};
export const getJobroleListApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_JOBROLE_LIST_API)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(
          getJobRoleList(
            getUniqueValue(a?.details?.questionBankDetails, "jobRole")
          )
        );
        dispatch(
          getSchemeList(
            getUniqueValue(a?.details?.questionBankDetails, "schemeName")
          )
        );
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
export const deleteAssessmentApi =
  (setLoading, setDeleteModal, id, getList) => (dispatch) => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_ASSESSMENT_API}/${id}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          getList();
          successToast(msg);
          setDeleteModal(false);
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

export const deleteQuestionApi =
  (setLoading, setDeleteModal, formData, getList, len) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(REMOVE_QUESTION_ASSESSMENT_API)
      .data(formData)
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
        const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const createFinalAssessmentApi =
  (setLoading, formValues, navigate) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_FINAL_ASSESSMENT_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          navigate(SUPER_ADMIN_ASSESSMENT_LIST_PAGE);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        errorToast(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };
