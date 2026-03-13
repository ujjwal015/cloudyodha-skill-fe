import api from "../../utils/apiHelper.js";
import {
  devConsoleLog,
  errorToast,
  getLocal,
  successToast,
} from "../../utils/projectHelper";

import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  BDA_CHANGE_STATUS_JOB_ROLE_API,
  BDA_DELETE_JOB_ROLE_API,
  BDA_GET_ALL_JOB_ROLES_API,
  BDA_GET_SPECIFIC_JOB_ROLE_API,
  BDA_JOB_ROLE_CREATE_API,
  BDA_UPDATE_JOB_ROLE_API,
} from "../../config/constants/apiConstants/superAdmin.js";

import {
  getAllJobRolesListNew,
  getSpecificJobRole,
} from "../../redux/slicers/superAdmin/clientManagement.js";
import {
  BDA_JOB_ROLE_CREATE_PAGE,
  BDA_JOB_ROLE_PAGE,
} from "../../config/constants/routePathConstants/superAdmin.js";

export const addJobRoleApi =
  (payload, setLoading, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .post(BDA_JOB_ROLE_CREATE_API)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          successToast("Job Role Created");
          clearFormValues();
          navigate(BDA_JOB_ROLE_PAGE);
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

export const getAllJobRoles =
  (setLoading, page, limit, searchQuery, setTotalPages) => (dispatch) => {
    const URL =
      searchQuery && searchQuery !== ""
        ? `${BDA_GET_ALL_JOB_ROLES_API}?page=${page}&limit=${limit}&search=${searchQuery}`
        : `${BDA_GET_ALL_JOB_ROLES_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode == 200) {
          const { jobRoleDetails, totalPages } = a.details;
          dispatch(getAllJobRolesListNew(jobRoleDetails));
          setTotalPages && setTotalPages(totalPages);
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        errorToast(err?.error);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const deleteJobRoleApi =
  (setLoading, setDeleteModal, id, getList) => () => {
    api()
      .root(API_ROOT)
      .delete(`${BDA_DELETE_JOB_ROLE_API}/${id}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode == 200) {
          setDeleteModal(false);
          getList();
          successToast("Job Role Deleted");
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

export const changeStatusJobRoleApi = (id, payload, getList) => () => {
  api()
    .root(API_ROOT)
    .post(BDA_CHANGE_STATUS_JOB_ROLE_API)
    .data(payload)
    .success((a) => {
      getList();
      successToast("Status Changed");
    })
    .error((err) => {
      errorToast("Something went wrong");
    })
    .send(() => {});
};

export const getSpecificJobRoleApi = (setLoading, id) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${BDA_GET_SPECIFIC_JOB_ROLE_API}/${id}`)
    .success((a) => {
      setLoading && setLoading(false);
      dispatch(getSpecificJobRole(a.details));
    })
    .error((err) => {
      setLoading && setLoading(false);
      errorToast("Unable to fetch details");
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const updateJobRoleApi =
  (setLoading, payload, id, clearFormValues, navigate) => () => {
    api()
      .root(API_ROOT)
      .put(`${BDA_UPDATE_JOB_ROLE_API}/${id}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode == 200) {
          successToast("Details Updated");
          clearFormValues();
          navigate(BDA_JOB_ROLE_PAGE);
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
