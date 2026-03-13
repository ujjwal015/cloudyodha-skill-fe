import api from "../../utils/apiHelper.js";
import { devConsoleLog, errorToast, getLocal, successToast } from "../../utils/projectHelper";

import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  ASSIGNED_CLIENT_LIST_API,
  BDA_JOB_ROLE_SECTOR_LIST_API,
  BULK_UPLOAD_ADMIN_API,
  BULK_UPLOAD_CLIENT_API,
  CREATE_CLIENT_MANAGEMENT_PROFILE_API,
  DELETE_SPECIFIC_CLIENT_API,
  DOWNLOAD_SAMPLE_ADMIN_API,
  GET_ALL_CLIENT_PROFILE_API,
  GET_ALL_SUB_ADMIN_PROFILE_API,
  GET_ONLY_ASSIGNED_CLIENTS_API,
  GET_SPECIFIC_CLIENT_API,
  NCEVT_CLIENT_BASED_JOBROLE,
  SUB_ADMIN_STATUS_CHANGE_API,
  UPDATE_SPECIFIC_CLIENT_API,
} from "../../config/constants/apiConstants/superAdmin";
import {
  getAssignedClientsList,
  getclientListAll,
  getclientManagementLists,
  getJobRoleSectorList,
} from "../../redux/slicers/superAdmin/clientManagement";

import {
  BDA_JOB_ROLE_PAGE,
  SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
} from "../../config/constants/routePathConstants/superAdmin";
import { getSpecificClientDetails } from "../../redux/slicers/clientSlice.js";

export const getClientManagementListsApi =
  (setLoading, page, limit, search, setTotalPages, organisationType = "", state = "", setIsFilterApplied) =>
  (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_ALL_CLIENT_PROFILE_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_ALL_CLIENT_PROFILE_API}?page=${page}&limit=${limit}`;
    const DATE_URL = `${GET_ALL_CLIENT_PROFILE_API}?organisationType=${organisationType}&state=${state}&page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(organisationType || state ? DATE_URL : URL)
      .success((a) => {
        if (organisationType || state) setIsFilterApplied(true);
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, result } = a.details;
          dispatch(getclientManagementLists(result));
          setTotalPages && setTotalPages(totalPages);
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

  
export const getSectorListApi =
  (setLoading, sectorFilter = false) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .get(BDA_JOB_ROLE_SECTOR_LIST_API)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const sectorList = !sectorFilter
            ? a?.details?.map((item) => ({
                label: item.sector,
                value: item._id,
              }))
            : a?.details?.map((item) => ({
                name: item.sector,
                id: item._id,
              })) || [];
          dispatch(getJobRoleSectorList(sectorList));
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


export const getClientManagementAllListsApi =
  (setLoading, page, limit, search, setTotalPages, organisationType = "", state = "", setIsFilterApplied, setPage) =>
  (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_ALL_CLIENT_PROFILE_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_ALL_CLIENT_PROFILE_API}?page=${page}&limit=${limit}`;
    const DATE_URL = `${GET_ALL_CLIENT_PROFILE_API}?organisationType=${organisationType}&state=${state}&page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(organisationType || state ? DATE_URL : URL)
      .success((a) => {
        if (organisationType || state) setIsFilterApplied(true);
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { page, totalPages, result } = a.details;
          dispatch(getclientListAll(result));
          setTotalPages && setTotalPages(totalPages);

          if (page !== totalPages) {
            setPage(page + 1);
          }
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

export const clientManagementChangeStatusApi = (id, formData, setLoading, getList) => (dispatch) => {
  api()
    .root(API_ROOT)
    .put(`${SUB_ADMIN_STATUS_CHANGE_API}?id=${id}`)
    .data(formData)
    .success((a) => {
      const { message: msg = "" } = a;
      if (a.statusCode === 200) {
        successToast(msg);
        setLoading(false);
        getList();
      }
    })
    .error((e) => {
      const { message: msg = "" } = e;
      devConsoleLog(e);
      setLoading(false);
    })
    .send(() => {
      setLoading(false);
    });
};

export const createClientProfile = (formData, setLoading, clearFormValues, navigate) => () => {
  api()
    .root(API_ROOT)
    .post(CREATE_CLIENT_MANAGEMENT_PROFILE_API)
    .data(formData)
    .success((a) => {
      setLoading(false);
      if (a.statusCode === 200) {
        clearFormValues();
        successToast("Client Profile Created");
        navigate(SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE);
      }
    })
    .error((e) => {
      setLoading(false);
      errorToast(e?.error);
    })
    .upload(() => {
      setLoading(false);
    });
};

export const getSpecificClient = (setLoading, payload, navigate) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_SPECIFIC_CLIENT_API}?id=${payload}`)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode == 200 || 203) {
        dispatch(getSpecificClientDetails([a.details]));
      }
    })
    .error((err) => {
      setLoading && setLoading(false);
      errorToast(`Can't update job role as ${err.message}`);
      navigate(BDA_JOB_ROLE_PAGE);
    })
    .send(() => {
      setLoading && setLoading(false);
    });
};

export const updateClientDetails = (payload, setLoading, id, clearFormValues, navigate) => () => {
  api()
    .root(API_ROOT)
    .put(`${UPDATE_SPECIFIC_CLIENT_API}?id=${id}`)
    .data(payload)
    .success((a) => {
      setLoading && setLoading(false);
      if (a.statusCode == 200) successToast("Details Edited");
      clearFormValues();
      navigate(SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE);
    })
    .error((err) => {
      setLoading && setLoading(false);
      errorToast(err?.error);
    })
    .upload(() => {
      setLoading(false);
    });
};

export const deleteClientDetails = (setLoading, id, setDeleteModal, getList) => () => {
  api()
    .root(API_ROOT)
    .delete(`${DELETE_SPECIFIC_CLIENT_API}?id=${id}`)
    .success((a) => {
      setLoading && setLoading(false);
      setDeleteModal(false);
      successToast("Client Deleted");
      getList();
    })
    .error((err) => {
      setLoading && setLoading(false);
      setDeleteModal(false);
      errorToast("Something went wrong");
    })
    .send(() => {
      setLoading && setLoading(false);
      setDeleteModal(false);
    });
};

export const postBulkUploadAdminApi = (formData, setLoading, setFormValues, navigate) => (dispatch) => {
  api()
    .root(API_ROOT)
    .post(BULK_UPLOAD_CLIENT_API)
    .data(formData)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading(false);
      if (a.statusCode === 200) {
        setFormValues(null);
        successToast(msg);
        navigate(-1);
      }
    })
    .error((e) => {
      setLoading(false);
      const { message: msg = "", error: { details = "" } = {} } = e;
      errorToast(e.error.error);
      // devConsoleLog();
    })
    .upload(() => {
      setLoading(false);
    });
};

export const getSampleExcelAdminApi = () => (dispatch) => {
  const token = getLocal();
  const header = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-auth-token": token,
  };

  fetch(`${API_ROOT}${DOWNLOAD_SAMPLE_ADMIN_API}`, {
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
        alink.download = "Client bulk upload";
        alink.click();
      });
    }
  });
};

export const getAssignedClientsListsApi =
  (setLoading, page, limit, search, setTotalPages, organisationType = "", state = "") =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .get(ASSIGNED_CLIENT_LIST_API)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, clientsData } = a.details;
          dispatch(getAssignedClientsList(clientsData));
          setTotalPages && setTotalPages(totalPages);
          if (!clientsData || Object.entries(clientsData).length < 1) errorToast(a?.message);
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

export const getAssignedClientManagementListsApi =
  (setLoading, page, limit, search, setTotalPages, organisationType = "", state = "") =>
  (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_ONLY_ASSIGNED_CLIENTS_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_ONLY_ASSIGNED_CLIENTS_API}?page=${page}&limit=${limit}`;
    const DATE_URL = `${GET_ONLY_ASSIGNED_CLIENTS_API}?organisationType=${organisationType}&state=${state}&page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(organisationType || state ? DATE_URL : URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, clientsData } = a.details;
          dispatch(getclientManagementLists(clientsData));
          setTotalPages && setTotalPages(totalPages);
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

export const getAllClientListsApi =
  (
    setLoading,
    page,
    limit,
    // search = "",
    // setTotalPages,
    // organisationType = "",
    // state = "",
    // setIsFilterApplied,
    // setResultCounts,
    // setTabList,
    // sectorFilterIds = ""
  ) =>
  (dispatch) => {
    const END_URL = `${NCEVT_CLIENT_BASED_JOBROLE}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(END_URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, clientDetails, totalCounts = 0 } = a.details;
          dispatch(getclientManagementLists(clientDetails));
          // setTotalPages && setTotalPages(totalPages);
          // setResultCounts && setResultCounts(totalCounts);

          // setTabList &&
          //   setTabList((prevTabs) => {
          //     const activeTabIndex = prevTabs?.findIndex(
          //       (tab) => tab?.key === organisationType
          //     );
          //     prevTabs[activeTabIndex].count = totalCounts;
          //     return [...prevTabs];
          //   });
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
