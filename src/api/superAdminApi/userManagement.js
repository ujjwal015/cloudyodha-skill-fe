import api from "../../utils/apiHelper.js";
import {
  devConsoleLog,
  errorToast,
  successToast,
} from "../../utils/projectHelper";
import {
  CREATE_USER_MANAGEMENT_ROLES_API,
  GET_USER_MANAGEMENT_ROLES_LIST_API,
  GET_USER_MANAGEMENT_FEATURES_API,
  GET_USER_MANAGEMENT_SINGLE_ROLE_API,
  GET_USER_MANAGEMENT_UPDATE_ROLE_API,
  DELETE_USER_MANAGEMENT_ROLE_API,
  CREATE_USER_MANAGEMENT_USERS_API,
  GET_USER_MANAGEMENT_USERS_LIST_API,
  GET_USER_MANAGEMENT_DELETE_USERS_API,
  GET_USER_MANAGEMENT_SINGLE_USER_API,
  CHANGE_STATUS_USER_MANAGEMENT_API,
  UNLOCK_USER_ACCOUNT_API,
  UPDATE_USER_MANAGEMENT_SINGLE_USER_API,
} from "../../config/constants/apiConstants/superAdmin";
import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_LIST_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE,
} from "../../config/constants/routePathConstants/superAdmin.js";
import {
  getFeatures,
  getRolesList,
  getRoleAndFeature,
  getUsersList,
} from "../../redux/slicers/authSlice.js";

export const createUserRoleApi =
  (formValues, setLoading, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .post(CREATE_USER_MANAGEMENT_ROLES_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          clearFormValues();
          navigate(SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_LIST_PAGE);
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

export const getRolesListApi =
  (setLoading, page, search, limit, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_USER_MANAGEMENT_ROLES_LIST_API}?search=${search}&page=${page}&limit=${limit}`
        : `${GET_USER_MANAGEMENT_ROLES_LIST_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getRolesList(a?.details?.response));
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
export const getFeaturesApi = (setLoading) => (dispatch) => {
  const URL = GET_USER_MANAGEMENT_FEATURES_API;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getFeatures(a?.details));
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

export const getSingleRoleApi =
  (setLoading, setFormValues, roleId) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_USER_MANAGEMENT_SINGLE_ROLE_API}?userRoleId=${roleId}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          dispatch(getRoleAndFeature(a?.details));
          setFormValues({
            userRoleName: a?.details?.userRoleName,
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

export const updateAssignedRoleApi =
  (setLoading, roleId, formValues, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .put(`${GET_USER_MANAGEMENT_UPDATE_ROLE_API}?userRoleId=${roleId}`)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast(msg);
          clearFormValues();
          navigate(SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_LIST_PAGE);
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
export const deleteSingleRoleApi =
  (setLoading, roleId, len, getUserList, setDeleteModal) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_USER_MANAGEMENT_ROLE_API}?userRoleId=${roleId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          getUserList(true, len);
          setLoading(true);
          setDeleteModal(false);
          successToast("Role deleted successfully.");
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
export const createUsersApi =
  (
    formValues,
    setLoading,
    clearFormValues,
    setFormValues,
    initialFormValues,
    navigate
  ) =>
  () => {
    api()
      .root(API_ROOT)
      .post(CREATE_USER_MANAGEMENT_USERS_API)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          clearFormValues();
          successToast(msg);
          setFormValues(initialFormValues);
          navigate(SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE);
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

export const getUsersListApi =
  (setLoading, page, search, limit, setTotalPages) => (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_USER_MANAGEMENT_USERS_LIST_API}?search=${search}&page=${page}&limit=${limit}`
        : `${GET_USER_MANAGEMENT_USERS_LIST_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getUsersList(a?.details?.response));
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

export const getSingleUserApi =
  (setLoading, setFormValues, userId) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_USER_MANAGEMENT_SINGLE_USER_API}?userId=${userId}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          setFormValues({
            firstName: a?.details?.firstName,
            lastName: a?.details?.lastName,
            email: a?.details?.email,
            userName: a?.details?.userName,
            status: a?.details?.status,
            userRole: a?.details?.userRole.map((roleType) => roleType?._id),
            assigndClients: a?.details?.assigndClients.map(
              (client) => client?._id
            ),
            assignedDashboard: a?.details?.assignedDashboard,
            reportinManager:a?.details?.reportinManager
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

export const updateSingleUserApi =
  (
    setLoading,
    userId,
    formValues,
    initialFormValues,
    setFormValues,
    navigate
  ) =>
  () => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_USER_MANAGEMENT_SINGLE_USER_API}?userId=${userId}`)
      .data(formValues)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast(msg);
          setFormValues(initialFormValues);
          navigate(SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE);
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
export const deleteSingleUserApi =
  (setLoading, id, len, getUserList, setDeleteModal) => () => {
    api()
      .root(API_ROOT)
      .delete(`${GET_USER_MANAGEMENT_DELETE_USERS_API}?userId=${id}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          getUserList(true, len);
          setLoading(true);
          setDeleteModal(false);
          successToast("User deleted successfully.");
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

export const changeSingleUserStatusApi =
  (setLoading, userId, formData, getList) => () => {
    api()
      .root(API_ROOT)
      .put(`${CHANGE_STATUS_USER_MANAGEMENT_API}?userId=${userId}`)
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

export const unlockUserAccountApi =
  (setLoading, userId, getList) => () => {
    api()
      .root(API_ROOT)
      .put(`${UNLOCK_USER_ACCOUNT_API}/${userId}`)
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
        errorToast(msg);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
