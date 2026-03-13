import api from "../../utils/apiHelper.js";
import { devConsoleLog } from "../../utils/projectHelper.js";
import { API_ROOT } from "../../config/constants/apiConstants/auth.js";
import { getDashboardsData, getOveriewTableData } from "../../redux/slicers/admin/dashboardSlice.js";

export const getDashboardsDataAPI = (_url, setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(_url)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getDashboardsData(a?.details));
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
export const getOverviewTableAPI = (
  URL,
  setLoading,
  page,
  limit,
  setTotalPages
) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${URL}?page=${page}&limit=${limit}`)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        setTotalPages(a?.details?.totalPages);
        dispatch(getOveriewTableData(a?.details));
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
