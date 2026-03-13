import api from "../../utils/apiHelper.js";
import {
    devConsoleLog,
    errorToast,
    successToast,
} from "../../utils/projectHelper";
import {
    CREATE_SCHEME_MANAGEMENT_API,
    GET_SCHEME_MANAGEMENT_API,
    EDIT_SINGLE_SCHEME_MANAGEMENT_API,
    UPDATE_SINGLE_SCHEME_MANAGEMENT_API,
    DELETE_SINGLE_SCHEME_MANAGEMENT_API,
    CHANGE_STATUS_SINGLE_SCHEME_MANAGEMENT_API,
    GET_SUB_SCHEME_MANAGEMENT_LIST_API,
    CREATE_SUB_SCHEME_MANAGEMENT_API,
    EDIT_SINGLE_SUB_SCHEME_MANAGEMENT_API,
    UPDATE_SINGLE_SUB_SCHEME_MANAGEMENT_API,
    DELETE_SINGLE_SUB_SCHEME_MANAGEMENT_API,
    CHANGE_STATUS_SINGLE_SUB_SCHEME_MANAGEMENT_API,
} from "../../config/constants/apiConstants/superAdmin";
import {
    API_ROOT,
} from "../../config/constants/apiConstants/auth";
import {
    SUPER_ADMIN_SCHEME_MANAGEMENT,
    SUPER_ADMIN_SUB_SCHEME_MANAGEMENT
} from "../../config/constants/routePathConstants/superAdmin.js";
import {
    getSchemeList,
    getSubSchemeList
} from "../../redux/slicers/authSlice.js";

export const createSchemeApi = (formValues, setLoading, clearFormValues, navigate) => () => {
    api()
        .root(API_ROOT)
        .post(CREATE_SCHEME_MANAGEMENT_API)
        .data(formValues)
        .success((a) => {
            const { message: msg = "" } = a;
            setLoading(false);
            if (a.statusCode === 200) {
                clearFormValues();
                successToast(msg);
                navigate(SUPER_ADMIN_SCHEME_MANAGEMENT);
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

export const getSchemeListApi = (setLoading, page, search, limit, setTotalPages) =>
    (dispatch) => {
        const URL =
            search && search !== ""
                ? `${GET_SCHEME_MANAGEMENT_API}?search=${search}&page=${page}&limit=${limit}`
                : `${GET_SCHEME_MANAGEMENT_API}?page=${page}&limit=${limit}`;
        api()
            .root(API_ROOT)
            .get(URL)
            .success((a) => {
                const { message: msg = "" } = a;
                setLoading && setLoading(false);
                if (a.statusCode === 200) {
                    dispatch(getSchemeList
                        (a?.details?.schemeDetails));
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


export const getSingleSchemeDetailApi = (setLoading, setFormValues, schemeId) => () => {
    api()
        .root(API_ROOT)
        .get(`${EDIT_SINGLE_SCHEME_MANAGEMENT_API}/${schemeId}`)
        .success((a) => {
            const { message: msg = "" } = a;
            setLoading && setLoading(false);
            if (a.statusCode === 200) {
                setFormValues({
                    schemeName: a?.details?.schemeName,
                    schemeCode: a?.details?.schemeCode
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

export const updateSchemeDetailsApi = (setLoading, schemeId, formValues, navigate,clearFormValues) => () => {
    api()
        .root(API_ROOT)
        .put(`${UPDATE_SINGLE_SCHEME_MANAGEMENT_API}/${schemeId}`)
        .data(formValues)
        .success((a) => {
            const { message: msg = "" } = a;
            setLoading && setLoading(false);
            if (a?.statusCode === 200) {
                clearFormValues();
                successToast(msg);
                navigate(SUPER_ADMIN_SCHEME_MANAGEMENT);
            }
        })
        .error((e) => {
            setLoading(false);
            const { message: msg = "" } = e;
            devConsoleLog(e);
            errorToast(msg);
        })
        .send(() => {
            setLoading && setLoading(false);
        });
};

export const deleteSingleSchemeApi = (setLoading, id, len, getSchemeList, setDeleteModal) => () => {
    api()
        .root(API_ROOT)
        .delete(`${DELETE_SINGLE_SCHEME_MANAGEMENT_API}/${id}`)
        .success((a) => {
            setLoading && setLoading(false);
            if (a.statusCode === 200) {
                getSchemeList(true, len)
                setLoading(true);
                setDeleteModal(false);
                successToast("Scheme deleted successfully.");
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

export const changeSingleSchemeStatusApi = (setLoading, schemeId, formData, getSchemeList) => () => {
    api()
        .root(API_ROOT)
        .post(`${CHANGE_STATUS_SINGLE_SCHEME_MANAGEMENT_API}`)
        .data(formData)
        .success((a) => {
            const { message: msg = "" } = a;
            setLoading && setLoading(false);
            if (a?.statusCode === 200) {
                successToast(msg);
                getSchemeList();
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

export const createSubSchemeApi = (formValues, setLoading, clearFormValues, navigate) => () => {
    api()
        .root(API_ROOT)
        .post(CREATE_SUB_SCHEME_MANAGEMENT_API)
        .data(formValues)
        .success((a) => {
            const { message: msg = "" } = a;
            setLoading(false);
            if (a.statusCode === 200) {
                clearFormValues();
                successToast(msg);
                navigate(SUPER_ADMIN_SUB_SCHEME_MANAGEMENT);
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

export const getSubSchemeListApi = (setLoading, page, search, limit, setTotalPages) =>
    (dispatch) => {
        const URL =
            search && search !== ""
                ? `${GET_SUB_SCHEME_MANAGEMENT_LIST_API}?search=${search}&page=${page}&limit=${limit}`
                : `${GET_SUB_SCHEME_MANAGEMENT_LIST_API}?page=${page}&limit=${limit}`;
        api()
            .root(API_ROOT)
            .get(URL)
            .success((a) => {
                setLoading && setLoading(false);
                if (a.statusCode === 200) {
                    dispatch(getSubSchemeList
                        (a?.details?.subSchemeDetails));
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

export const getSingleSubSchemeDetailApi = (setLoading, setFormValues, subSchemeId) => () => {
    api()
        .root(API_ROOT)
        .get(`${EDIT_SINGLE_SUB_SCHEME_MANAGEMENT_API}/${subSchemeId}`)
        .success((a) => {
            const { message: msg = "" } = a;
            setLoading && setLoading(false);
            if (a.statusCode === 200) {
                setFormValues({
                    schemeId: a?.details?.schemeId,
                    subSchemeCode: a?.details?.subSchemeCode,
                    subSchemeName: a?.details?.subSchemeName
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
export const updateSubSchemeDetailsApi = (setLoading, subSchemeId, formValues, navigate,clearFormValues) => () => {
    api()
        .root(API_ROOT)
        .put(`${UPDATE_SINGLE_SUB_SCHEME_MANAGEMENT_API}/${subSchemeId}`)
        .data(formValues)
        .success((a) => {
            const { message: msg = "" } = a;
            setLoading && setLoading(false);
            if (a?.statusCode === 200) {
                clearFormValues();
                successToast(msg);
                navigate(SUPER_ADMIN_SUB_SCHEME_MANAGEMENT);
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

export const deleteSingleSubSchemeApi = (setLoading, id, len, getSubSchemeList, setDeleteModal) => () => {
    api()
        .root(API_ROOT)
        .delete(`${DELETE_SINGLE_SUB_SCHEME_MANAGEMENT_API}/${id}`)
        .success((a) => {
            setLoading && setLoading(false);
            if (a.statusCode === 200) {
                getSubSchemeList(true, len)
                setLoading(true);
                setDeleteModal(false);
                successToast("Sub-Scheme deleted successfully.");
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

export const changeSingleSubSchemeStatusApi = (setLoading, schemeId, formData, getSubSchemeList) => () => {
    api()
        .root(API_ROOT)
        .post(`${CHANGE_STATUS_SINGLE_SUB_SCHEME_MANAGEMENT_API}`)
        .data(formData)
        .success((a) => {
            const { message: msg = "" } = a;
            setLoading && setLoading(false);
            if (a?.statusCode === 200) {
                successToast(msg);
                getSubSchemeList();
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