import api from "../../utils/apiHelper.js";
import {
  devConsoleLog,
  errorToast,
  successToast,
} from "../../utils/projectHelper";
import {
  CREATE_INSTRUCTION_API,
  GET_INSTRUCTION_LIST_API,
  DELETE_SINGLE_INSTRUCTION_API,
  GET_SINGLE_INSTRUCTION_API,
  UPDATE_SINGLE_INSTRUCTION_API,
  CHANGE_SINGLE_INSTRUCTION_STATUS_API,
  BULK_UPLOAD_VERIFICATION_TAB_API,
} from "../../config/constants/apiConstants/superAdmin";
import { API_ROOT } from "../../config/constants/apiConstants/auth";
import { INSTRUCTIONS_LIST } from "../../config/constants/routePathConstants/superAdmin.js";

import { getInstructionsList } from "../../redux/slicers/superAdmin/instructionsSlice.js";
import { GET_STUDENT_INSTRUCTION_API } from "../../config/constants/apiConstants/student.js";
export const createInstructionApi =
  (formData, setLoading, clearFormValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_INSTRUCTION_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          clearFormValues();
          successToast(msg);
          dispatch(getInstructionListApi(setLoading));
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

export const getInstructionListApi =
  (setLoading, page, limit, setTotalPages, search) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_INSTRUCTION_LIST_API}?search=${search}&page=${page}&limit=${limit}`
        : `${GET_INSTRUCTION_LIST_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getInstructionsList(a?.details?.instructionDetails));
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

export const deleteSingleInstructionApi =
  (setLoading, id, len, getList, setDeleteModal) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_SINGLE_INSTRUCTION_API}/${id}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          getList(true, len);
          setLoading(true);
          setDeleteModal(false);
          successToast("Instruction deleted successfully.");
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

export const getSingleInstructionDetailApi =
  (
    setLoading,
    setFormValues,
    instructionId,
    setInitialLanguages,
    setInstructions,
    portal = "superAdmin"
  ) =>
  () => {
    const url =
      portal === "superAdmin"
        ? GET_SINGLE_INSTRUCTION_API
        : GET_STUDENT_INSTRUCTION_API;
    api()
      .root(API_ROOT)
      .get(`${url}/${instructionId}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const existingLangs = a?.details?.instructions
            ?.filter((item) => item.language.toLowerCase() !== "english")
            ?.map((item) => ({
              language: item.language.toLowerCase(),
            }));

          setInitialLanguages(existingLangs);
          setFormValues({
            instructionName: a?.details?.instructionName,
            languageEntries: a?.details?.instructions?.map((item) => ({
              language: item?.language,
              description: item?.instructionDescription,
            })),
          });
          a?.details?.instructions?.length > 0 &&
            a?.details?.instructions?.map((item) => {
              if (item?.language === "English") {
                setFormValues((prev) => ({
                  ...prev,
                  primaryDescription: item?.instructionDescription,
                }));
              }
            });
          a?.details?.instructions?.length > 0 && setInstructions(a?.details);
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

export const getSingleInstructionDetailPreviewApi =
  (setLoading, setFormValues, instructionId, setGeneralIns) => () => {
    api()
      .root(API_ROOT)
      .get(`${GET_SINGLE_INSTRUCTION_API}/${instructionId}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          setFormValues(a?.details?.instructions);
          setGeneralIns(a?.details);
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

export const updateInstructionDetailsApi =
  (payload, setLoading, instructionId, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_SINGLE_INSTRUCTION_API}/${instructionId}`)
      .data(payload)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          clearFormValues();
          navigate(INSTRUCTIONS_LIST);
          successToast(msg);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const changeSingleInstructionStatusApi =
  (setLoading, instructionId, formData, getList) => () => {
    api()
      .root(API_ROOT)
      .put(`${CHANGE_SINGLE_INSTRUCTION_STATUS_API}/${instructionId}`)
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
