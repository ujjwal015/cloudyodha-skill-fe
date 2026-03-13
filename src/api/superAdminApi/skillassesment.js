import api from "../../utils/apiHelper.js";
import {
  devConsoleLog,
  errorToast,
  successToast,
  getUniqueValue,
} from "../../utils/projectHelper";

import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
    SKILL_BATCH_LIST
} from "../../config/constants/apiConstants/superAdmin";

import {
    getBatchList,
} from "../../redux/slicers/superAdmin/skillAssesmentSlice.js";

import {
  SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE,
  SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
} from "../../config/constants/routePathConstants/superAdmin.js";


export const getBatchListApi =
  (setLoading, page, limit, search, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${SKILL_BATCH_LIST}?page=${page}&limit=${limit}&search=${search}`
        : `${SKILL_BATCH_LIST}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getBatchList(a?.details));
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