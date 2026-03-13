import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  CREATE_DASHBOARD_API,
  DELETE_DASHBOARD_API,
  GET_ALL_DASHBOARD_LIST_API,
  GET_ALL_DROPDOWN_API,
  GET_SINGLE_DASHBOARD_API,
  UPDATE_DASHBOARD_LIST_API,
  UPDATE_DASHBOARD_STATUS_API,
} from "../../config/constants/apiConstants/superAdmin";
import { DASHBOARD_MANAGE_LIST } from "../../config/constants/routePathConstants/superAdmin";
import {
  getAllDashboardList,
  getDashboardDropDownList,
  getSingleDashboard,
} from "../../redux/slicers/clientSlice";
import api from "../../utils/apiHelper";
import {
  devConsoleLog,
  errorToast,
  successToast,
} from "../../utils/projectHelper";

export const getAllDropdownListApi = (setLoading) => (dispatch) => {
  const URL = GET_ALL_DROPDOWN_API;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        const transformData = (data) => {
          const allCategories = { ...data };
          const categories = Object.entries(allCategories).map(
            ([category, components], index) => {
              return {
                name: `${index + 1}.${category} Dashboard`,
                options: components.map((component) => ({
                  _id: component?._id,
                  label: component.component_name,
                  value: component.component_name,
                })),
              };
            }
          );

          return categories;
        };

        const graph = transformData(a?.details?.Graph);
        const widget = transformData(a?.details?.Widget);
        const table = transformData(a?.details?.Table);

        dispatch(getDashboardDropDownList({ graph, widget, table }));
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

export const createDashboardApi =
  (formValues, setLoading, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .post(CREATE_DASHBOARD_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 201) {
          clearFormValues();
          navigate(DASHBOARD_MANAGE_LIST);
          successToast(msg);
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

export const getSingleDashboardApi =
  (setLoading, id = null) =>
  (dispatch) => {
    const URL = `${GET_SINGLE_DASHBOARD_API}/${id}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const sortedData = {
            dashboard_name: a?.details?.dashboard_name,
            components: a?.details?.components?.map((item) => {
              return {
                _id: item?._id,
                component_name: item?.component_name,
                component_type: item?.component_type,
              };
            }),
          };
          dispatch(getSingleDashboard(sortedData));
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

export const getAllDashboardListApi =
  (setLoading, page, limit, search, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_ALL_DASHBOARD_LIST_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_ALL_DASHBOARD_LIST_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getAllDashboardList(a?.details?.response));
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

export const updateDashboardApi =
  (payload, id, setLoading, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_DASHBOARD_LIST_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          clearFormValues();
          successToast("Details Updated Successfully");
          navigate(DASHBOARD_MANAGE_LIST);
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
export const deleteDashboardApi =
  (id, setLoading, getList, setDeleteModal) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_DASHBOARD_API}/${id}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          successToast(a?.message);
          setDeleteModal(false);
          getList()
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e?.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
export const updateDashboardStatusApi =
  (payload, id, setLoading, getList,) => () => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_DASHBOARD_STATUS_API}?id=${id}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200 || 201) {
          successToast(a?.message);
          getList()
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
