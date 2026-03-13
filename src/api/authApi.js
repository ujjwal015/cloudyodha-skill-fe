import bowser from "bowser";
import api from "../utils/apiHelper.js";
import {
  ConfirmAlert,
  devConsoleLog,
  errorAlert,
  errorToast,
  getUserData,
  sessionDestroy,
  storeLocal,
  storeSession,
  SuccessAlert,
  successToast,
  getLocal,
  removeLocalWithoutNavigatingTosignin,
} from "../utils/projectHelper";

import {
  GET_ALL_USERS_LIST_API,
  CREATE_QUESTIONBANK_FORM_API,
  GET_QUESTION_BANK_LIST_API,
  GET_QUESTION_LIST_API,
  TOUR_API,
  CHANGE_QUESTION_BANK_LIST_STATUS_API,
  CHANGE_QUESTION_LIST_STATUS_API,
  GET_QUESTION_PREVIEW_API,
  CREATE_QUESTIONBANK_SECTION_API,
  QUESTION_BANK_FILTER_BY_ID_API,
  CREATE_QUESTION_FINAL_API,
  GET_CANDIDATE_RESULT_API,
  GET_CANDIDATE_RESULT_PREVIEW_API,
  STATUS_API,
  CREATE_ASSESSOR_FORM_API,
  GET_ASSESSOR_LIST_API,
  GET_SINGLE_ASSESSOR_DETAILS_API,
  EDIT_ASSESSOR_DETAILS_API,
  UPDATE_STATUS_SINGLE_ASSESSOR_API,
  DELETE_ASSESSOR_FORM_API,
  GET_LEAD_MANAGEMENT_LIST_API,
  CHANGE_SINGLE_DEMO_USER_STATUS_API,
  GET_LEAD_MANAGEMENT_FILTER_API,
  CHANGE_SINGLE_DEMO_USER_REMARKS_API,
  DELETE_SINGLE_DEMO_USER_API,
  FILTER_DEMO_USER_API,
  UPDATE_QUESTION_API,
} from "../config/constants/apiConstants/superAdmin";
import {
  API_ROOT,
  SIGNIN_API,
  SIGNUP_API,
  FORGOT_PASSWORD_API,
  RESET_PASSWORD_API,
  VERIFY_EMAIL_API,
  GET_STATES_API,
  GET_CITIES_API,
  CHANGE_PASSWORD_API,
  GET_USER_PROFILE_API,
  UPDATE_PROFILE_API,
  BASIC_USER_DETAIL_API,
  GET_ORGANIZATION_API,
  CREATE_PROFILE_API,
  RESEND_EMAIL_API,
  UPDATE_USER_SOCIAL_PROFILE_API,
  GET_DEMO_API,
  GET_INDIVIDUAL_DEMO_USER_API,
  UPDATE_INDIVIDUAL_DEMO_USER_API,
  SEND_OTP_API,
  VERIFY_OTP_API,
  GET_USER_PERMISSION_API,
  GET_DEVICE_DETAIL_API,
  SIGN_OUT_API,
  FORGET_RESET_PASSWORD_API,
  UPDATE_USER_EXPREIENCE_API,
  UPDATE_USER_DEREE_API,
  DELETE_USER_EXPERIENCE_API,
  DELETE_USER_EDUCATION_API,
  UPDATE_USER_DOCUMENTS_API,
  GET_USER_LOGGED_IN_STATUS_API,
  SUBMIT_TRAINING_PARTNER_FEEDBACK_API,
  SUBMIT_ASSESSOR_FEEDBACK_API,
  GET_FEEDBACK_API,
  GET_FEEDBACK_BATCH_API,
  CHECK_PASSWORD_RESET_API,
  DELETE_PROFILE_API,
} from "../config/constants/apiConstants/auth";
import {
  SIGNIN,
  EDIT_PROFILE,
  GET_OTP,
} from "../config/constants/routePathConstants/auth";

import {
  SUPER_ADMIN_QUESTION,
  SUPER_ADMIN_CREATE_QUESTION_PAGE,
  SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE,
  SUPER_ADMIN_QUESTION_LIST,
  SUPER_ADMIN_USER_MANAGEMENT_ASSESSOR_LIST,
  SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
  SUPER_ADMIN_VIEW_QUESTIONS_PAGE,
} from "../config/constants/routePathConstants/superAdmin.js";
import { USER_DATA } from "../config/constants/projectConstant.js";
import {
  getCityLists,
  getOrganizationLists,
  getPagination,
  getStateLists,
  getUserLists,
  setUserInfo,
  getQuestionBankList,
  getQuestionList,
  getQuestionPreviewList,
  getQuestionBankById,
  getCandidateResultList,
  getCandidateResultPreview,
  getAssessorList,
  getDemoUser,
  getDemoUserList,
  getUserFilterDropDown,
  getUserPermission,
  setUserRole,
  getDeviceLists,
  getProfileInfo,
  getFeedbackBatchDetails,
  getIsLinkValid,
  getProfileImageUrl,
} from "../redux/slicers/authSlice.js";
import {
  getBatchClientNameList,
  getBatchJobRoleList,
  getBatchSchemeFilter,
} from "../redux/slicers/superAdmin/examManagementSlice.js";

export const signUpApi =
  (formData, setErr, navigate, setLoading, clearFormValues, handleClickOpen) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(SIGNUP_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          clearFormValues();
          handleClickOpen();
          setErr("");
        } else if (a.statusCode === 400) {
          setErr(msg);
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const createDemoAPI =
  (formData, setErr, navigate, setLoading, clearFormValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(GET_DEMO_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          clearFormValues();
          setErr("");
          successToast("OTP sent on your registered mobile no.");
          storeLocal(a?.details, "demoUserData");
          dispatch(getDemoUser(a?.details));
          const mobile = { mobile: a?.details?.mobile };
          dispatch(sendOtpApi(setErr, setLoading, mobile));
          navigate(GET_OTP);
        } else if (a.statusCode === 400) {
          setErr(msg);
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const sendOtpApi = (setErr, setLoading, mobile) => (dispatch) => {
  api()
    .root(API_ROOT)
    .post(SEND_OTP_API)
    .data(mobile)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading(false);
      if (a.statusCode === 200) {
        setErr("");
      } else if (a.statusCode === 400) {
        setErr(msg);
      } else {
        setErr(msg);
      }
    })
    .error((e) => {
      setLoading(false);
      const { message: msg = "" } = e;
      setErr(msg);
      devConsoleLog(e);
    })
    .send(() => {
      setLoading(false);
    });
};
export const verifyOtpApi =
  (formData, setErr, setLoading, setOpen) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(VERIFY_OTP_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          setErr("");
          setOpen(true);
        } else if (a.statusCode === 400) {
          setErr(msg);
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };
export const getSingleDemoUserApi =
  (setLoading, setFormValues, demoUserId) => () => {
    api()
      .root(API_ROOT)
      .get(`${GET_INDIVIDUAL_DEMO_USER_API}/${demoUserId}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          setFormValues({
            firstName: a?.details.firstName,
            lastName: a?.details.lastName,
            email: a?.details.email,
            mobile: a?.details.mobile,
            userRole: a?.details.userRole,
            organisationName: a?.details.organisationName,
            acceptTermCondition: false,
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

export const updateDemoUserApi =
  (setLoading, formData, navigate, demoUserId, setErr) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_INDIVIDUAL_DEMO_USER_API}/${demoUserId}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          storeLocal(a?.details, "demoUserData");
          dispatch(getDemoUser(a?.details));
          const mobile = { mobile: a?.details?.mobile };
          dispatch(sendOtpApi(setErr, setLoading, mobile));
          successToast("Mobile no. updated successfully !");
          navigate(GET_OTP);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { message: msg = "" } = e;
        errorToast("Mobile no. already exist");
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getDemoUserListApi =
  (
    setLoading,
    page,
    search,
    limit,
    setTotalPages,
    mobileVerified = "",
    userRole = "",
    status = "",
    isFilterOpen
  ) =>
  (dispatch) => {
    const queryParams = new URLSearchParams();

    // Only add params that have values
    if (search) queryParams.append("search", search);
    if (mobileVerified !== "")
      queryParams.append("isMobileVerified", mobileVerified);
    if (userRole) queryParams.append("userRole", userRole);
    if (status) queryParams.append("status", status);

    // Always add pagination params
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    const URL = `${GET_LEAD_MANAGEMENT_LIST_API}?${queryParams.toString()}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getDemoUserList(a?.details?.userdemoDetails));
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

export const changeSingleDemoUserStatusApi =
  (setLoading, id, formData, getDemoUserList) => () => {
    api()
      .root(API_ROOT)
      .put(`${CHANGE_SINGLE_DEMO_USER_STATUS_API}/${id}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          successToast(msg);
          getDemoUserList();
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

export const createSingleRemarksApi =
  (setLoading, formData, getDemoUserList, setIsRemarkSave, isRemarkSave) =>
  () => {
    api()
      .root(API_ROOT)
      .put(`${CHANGE_SINGLE_DEMO_USER_REMARKS_API}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          setIsRemarkSave(a?.details?.isremark);
          successToast("Remarks added successfully.");
          getDemoUserList();
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

export const deleteSingleLeadApi =
  (setLoading, actionId, len, getDemoUserList, setDeleteModal) => () => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_SINGLE_DEMO_USER_API}/${actionId}`)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          getDemoUserList(true, len);
          setLoading(true);
          setDeleteModal(false);
          successToast("Lead deleted successfully.");
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

export const getOrganisationNameApi = (setLoading) => (dispatch) => {
  const URL = `${FILTER_DEMO_USER_API}`;
  api()
    .root(API_ROOT)
    .get(URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getUserFilterDropDown(a?.details?.userdemoDetails));
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

export const signInApi =
  (formData, setErr, navigate, setLoading, setFormValues) =>
  async (dispatch) => {
    const browser = bowser.getParser(window.navigator.userAgent);
    const browserName = browser.getBrowserName();
    const device = browser.getPlatform().type;

    const getLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(error),
          { enableHighAccuracy: true } // Request high accuracy for better results
        );
      });
    };

    const getIP = async () => {
      const response = await fetch("https://api64.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    };

    try {
      const [geolocation, userIp] = await Promise.all([getLocation(), getIP()]);

      const devicedetailsObj = {
        device: device,
        browser: browserName,
        addreiss: userIp,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        ...formData,
      };

      api()
        .root(API_ROOT)
        .post(SIGNIN_API)
        .data(devicedetailsObj)
        .success((a) => {
          setLoading && setLoading(false);
          // setLoading(false);
          const { message: msg = "" } = a;
          if (a.statusCode === 200) {
            const { userRole, ...rest } = a?.details;
            storeLocal(a?.details?.token);
            storeLocal(rest, USER_DATA);
            storeLocal(1, "pageNumber");
            storeLocal(1, "batchlistPage");
            storeLocal(1, "verificationListPage");
            dispatch(setUserInfo(a?.details));
            setLoading && setLoading(false);
            if (!a?.details?.isUserProfileCreated) {
              navigate(EDIT_PROFILE);
            } else {
              successToast(msg);
              navigate("/");
              setLoading && setLoading(false);
            }
            setErr("");
          } else {
            setErr(msg);
          }
        })
        .error((e) => {
          const { message: msg = "" } = e;
          if (e.statusCode === 426) {
            const data = {
              email: formData?.email,
            };
            dispatch(getBasicUserDetailApi(data, navigate));
          } else {
            setErr(msg);
          }
          setLoading && setLoading(false);
          devConsoleLog(e);
        })
        .send(() => {
          setFormValues((pre) => ({
            ...pre,
            sToken: "",
          }));
          setLoading && setLoading(false);
        });
    } catch (error) {
      setLoading && setLoading(false);
      setErr("Please enable location services to log in.");
    }
  };

export const signOutApi =
  (
    formData,
    setIsBtnLoading,
    setLoading,
    _id,
    setBtnLogoutId
    // page,
    // limit,
    // setTotalPages,
  ) =>
  async (dispatch) => {
    setIsBtnLoading(true);
    api()
      .root(API_ROOT)
      .post(SIGN_OUT_API)
      .data(formData)
      .success((a) => {
        setIsBtnLoading(false);
        if (a.statusCode === 200) {
          const { message: msg = "" } = a;
          dispatch(getDeviceDetailListsApi(setLoading, _id));
          successToast(msg);
          setIsBtnLoading(false);
        }
      })
      .error((e) => {
        // devConsoleLog(e);
        errorToast(e?.message);
        console.log(e);
        setIsBtnLoading(false);
      })
      .send(() => {
        setIsBtnLoading(false);
        setBtnLogoutId("");
      });
  };
export const getBasicUserDetailApi = (formData, navigate) => (dispatch) => {
  api()
    .root(API_ROOT)
    .post(BASIC_USER_DETAIL_API)
    .data(formData)
    .success((a) => {
      const { message: msg = "" } = a;
      if (a.statusCode === 200) {
        storeLocal(a?.details, USER_DATA);
        dispatch(setUserInfo(a?.details));
        navigate && navigate(EDIT_PROFILE);
      }
    })
    .error((e) => {
      const { message: msg = "" } = e;
      errorAlert(msg);
      devConsoleLog(e);
    })
    .send(() => {});
};

export const forgetPasswordApi =
  (
    formData,
    setErr,
    navigate,
    setLoading,
    handleClickOpen,
    setResetText,
    setFormValues
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(FORGOT_PASSWORD_API)
      .data(formData)
      .success((a) => {
        setLoading(false);
        const { message: msg = "" } = a;
        setFormValues({ email: "", sToken: "" });
        if (a.statusCode === 200) {
          setErr("");
          setResetText(a?.message);
          handleClickOpen();
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setFormValues((pre) => ({
          ...pre,
          sToken: "",
        }));
        setLoading(false);
        const { message: msg = "" } = e;
        errorToast(msg);
        devConsoleLog(e);
        setErr(msg);
      })
      .send((e) => {
        if (e?.status == 404) {
          errorToast(e?.data?.message);
        }
        setLoading(false);
      });
  };

export const resetPasswordApi =
  (formData, setErr, navigate, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(RESET_PASSWORD_API)
      .data(formData)
      .success((a) => {
        setLoading(false);
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          successToast(msg);
          navigate(SIGNIN);
          setErr("");
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const forgetResetPasswordApi =
  (formData, setErr, navigate, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(FORGET_RESET_PASSWORD_API)
      .data(formData)
      .success((a) => {
        setLoading(false);
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          successToast(msg);
          navigate(SIGNIN);
          setErr("");
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const editProfileApi =
  (formData, setErr, navigate, setLoading, clearFormValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_PROFILE_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          navigate(SIGNIN);
          setErr("");
          clearFormValues();
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const updateProfileApi =
  (
    id,
    formData,
    setFormValues,
    setErrors,
    setLoading,
    setUserId,
    setImgURL,
    onClose
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_PROFILE_API}/${id}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          onClose();
          dispatch(
            getUserProfileApi(
              id,
              setUserId,
              setFormValues,
              setLoading,
              setImgURL
            )
          );
          setErrors("");
        } else {
          setErrors(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErrors(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
    // .upload(() => {
    //   setLoading(false);
    // });
  };

export const updateProfileExperienceApi =
  (
    id,
    idToUpdate,
    formData,
    setFormValues,
    setErrors,
    setLoading,
    setUserId,
    setImgURL,
    onClose
  ) =>
  (dispatch) => {
    let URL = `${UPDATE_USER_EXPREIENCE_API}?profile_id=${id}`;
    if (idToUpdate) {
      URL += `&IdToUpdate=${idToUpdate}`;
    }
    api()
      .root(API_ROOT)
      .put(URL)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          onClose();
          dispatch(
            getUserProfileApi(
              id,
              setUserId,
              setFormValues,
              setLoading,
              setImgURL
            )
          );
          setErrors("");
        } else {
          setErrors(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErrors(msg);
        devConsoleLog(e);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const updateProfileDegreeApi =
  (
    id,
    idToUpdate,
    formData,
    setFormValues,
    setErrors,
    setLoading,
    setUserId,
    setImgURL,
    onClose
  ) =>
  (dispatch) => {
    let URL = `${UPDATE_USER_DEREE_API}?profile_id=${id}`;
    if (idToUpdate) {
      URL += `&IdToUpdate=${idToUpdate}`;
    }
    api()
      .root(API_ROOT)
      .put(URL)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          onClose();
          dispatch(
            getUserProfileApi(
              id,
              setUserId,
              setFormValues,
              setLoading,
              setImgURL
            )
          );
          setErrors("");
        } else {
          setErrors(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErrors(msg);
        devConsoleLog(e);
      })
      // .send(() => {
      //   setLoading(false);
      // });
      .upload(() => {
        setLoading(false);
      });
  };
export const DeleteProfileExperienceApi =
  (id, idToDelete, keyToDelete) => (dispatch) => {
    let URL = `${DELETE_USER_EXPERIENCE_API}?profile_id=${id}`;
    if (idToDelete) {
      URL += `&IdToDelete=${idToDelete}&keyToDelete=${keyToDelete}`;
    }
    api()
      .root(API_ROOT)
      .delete(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        // setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          // onClose();
          dispatch(
            getUserProfileApi(
              id,
              () => {},
              () => {},
              () => {},
              () => {}
            )
          );
          // setErrors("");
        } else {
          // setErrors(msg);
        }
      })
      .error((e) => {
        // setLoading(false);
        const { message: msg = "" } = e;
        // setErrors(msg);
        devConsoleLog(msg);
      })
      .send(() => {
        // setLoading(false);
      });
  };
export const DeleteProfileEducationApi =
  (id, idToDelete, keyToDelete) => (dispatch) => {
    let URL = `${DELETE_USER_EDUCATION_API}?profile_id=${id}`;
    if (idToDelete) {
      URL += `&IdToDelete=${idToDelete}&keyToDelete=${keyToDelete}`;
    }
    api()
      .root(API_ROOT)
      .delete(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        // setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          dispatch(
            getUserProfileApi(
              id,
              () => {},
              () => {},
              () => {},
              () => {}
            )
          );
          // setErrors("");
        } else {
          // setErrors(msg);
        }
      })
      .error((e) => {
        const { message: msg = "" } = e;
        devConsoleLog(msg);
      })
      .send(() => {
        // setLoading(false);
      });
  };

export const updateProfileImageApi =
  (id, formData, setLoading, setErrors, setImgURL) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_PROFILE_API}/${id}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          dispatch(getProfileInfo(a?.details?.updatedUser));
          dispatch(getProfileImageUrl(a?.details?.updatedUser?.ProfileUrl));
          setImgURL(a?.details?.updatedUser?.ProfileUrl);
          setErrors("");
        } else {
          setErrors(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErrors(msg);
        devConsoleLog(e);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const deleteProfileImageApi =
  (id, setLoading, setErrors, setImgURL) => (dispatch) => {
    api()
      .root(API_ROOT)
      .delete(`${DELETE_PROFILE_API}/${id}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          dispatch(getProfileInfo(a?.details?.updatedUser));
          dispatch(getProfileImageUrl(a?.details?.updatedUser?.ProfileUrl));
          setImgURL(a?.details?.updatedUser?.ProfileUrl);
          setErrors("");
        } else {
          setErrors(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErrors(msg);
        devConsoleLog(e);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const updateUseDocumentsApi =
  (id, formData, setLoading, setErrors, onClose) => (dispatch) => {
    api()
      .root(API_ROOT)
      .patch(`${UPDATE_USER_DOCUMENTS_API}/${id}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          dispatch(
            getUserProfileApi(
              id,
              () => {},
              () => {},
              setLoading,
              () => {}
            )
          );
          onClose();
          setErrors("");
        } else {
          setErrors(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErrors(msg);
        devConsoleLog(e);
      })
      .upload(() => {
        setLoading(false);
      });
  };

export const updateProfileAboutApi =
  (
    id,
    formData,
    setLoading,
    setInitialValues,
    setActive,
    section,
    newData,
    setError
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_PROFILE_API}/${id}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          dispatch(
            getUserProfileApi(
              id,
              () => {},
              () => {},
              () => {},
              () => {}
            )
          );
          setInitialValues((prev) => ({ ...prev, [section]: newData }));
          setActive("none");
          setError(null);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        devConsoleLog(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const updateSocialProfileApi =
  (id, formData, setErr, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${UPDATE_USER_SOCIAL_PROFILE_API}/${id}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          setErr("");
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };
export const changePasswordApi =
  (formData, setErr, setLoading, clearFormValues, logoutPayload) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CHANGE_PASSWORD_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
          setErr("");
          clearFormValues();
          if (logoutPayload) {
            dispatch(logoutFromDeviceApi(logoutPayload));
          }
        } else {
          setErr(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        errorToast(msg);
        setErr(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const verifyEmailApi =
  (formData, navigate, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(VERIFY_EMAIL_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          storeLocal(a?.details, USER_DATA);
          dispatch(setUserInfo(a?.details));
          const data = {
            email: a?.details.email,
          };
          dispatch(getBasicUserDetailApi(data));
        } else {
          errorToast(msg);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        navigate(SIGNIN);
        devConsoleLog(e);
        errorToast(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const resendEmailApi =
  (formData, navigate, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(RESEND_EMAIL_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
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

export const getStateListsApi = (formData, setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .post(GET_STATES_API)
    .data(formData)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        const states = a?.details?.states?.map((item) => ({
          label: item?.name,
          value: item?.fipsCode,
        }));
        dispatch(getStateLists(states));
      } else {
        errorToast(msg);
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

export const getCityListsApi = (formData, setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .post(GET_CITIES_API)
    .data(formData)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        const cities = a?.details?.cities?.map((item) => ({
          label: item?.name,
          value: item?.name,
        }));
        dispatch(getCityLists(cities));
      } else {
        errorToast(msg);
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

export const getUserProfileApi =
  (id, setUserId, setLoading, setImgURL) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_USER_PROFILE_API}/${id}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getProfileInfo(a?.details?.user));
          dispatch(getProfileImageUrl(a?.details?.user?.ProfileUrl));
          setImgURL(a?.details?.user?.ProfileUrl);
          // dispatch(GetUserPermissionApi(setLoading));
          setUserId(a?.details?.userId);
          dispatch(getStateListsForProfileApi({ country: "India" }));
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

export const getUserListApi =
  (setLoading, page = 1, limit = 10, order = -1) =>
  (dispatch) => {
    if (page < 1) page = 1;
    api()
      .root(API_ROOT)
      .get(
        `${GET_ALL_USERS_LIST_API}?page=${page}&limit=${limit}&sortOrder=${order}`
      )
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, totalCounts, userProfile } = a.details;
          dispatch(getUserLists(userProfile));
          dispatch(getPagination({ totalCount: totalCounts, totalPages }));
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

export const getOrganizationListsApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_ORGANIZATION_API)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading(false);
      if (a.statusCode === 200) {
        const lists = a?.details?.map((item) => ({
          label: item?.organisationName,
          value: item?.organisationName,
        }));
        dispatch(getOrganizationLists(lists));
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

export const acceptOrRejectApi = (formData, setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .put(STATUS_API)
    .data(formData)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading(false);
      if (a.statusCode === 200) {
        successToast(msg);
        dispatch(getUserListApi());
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

export const logoutApi = () => {
  sessionDestroy();
  window.localStorage.removeItem("assessorManagementFromDashboard");
};

export const logoutFromDeviceApi = (formData) => async (dispatch) => {
  // setIsBtnLoading(true);
  api()
    .root(API_ROOT)
    .post(SIGN_OUT_API)
    .data(formData)
    .success((a) => {
      // setIsBtnLoading(false);
      if (a.statusCode === 200) {
        const { message: msg = "" } = a;
        successToast(msg);
        logoutApi();
        removeLocalWithoutNavigatingTosignin("masterAssessor");

        // setIsBtnLoading(false);
      }
    })
    .error((e) => {
      // devConsoleLog(e);
      errorToast(e?.message);
      console.log(e);
      // setIsBtnLoading(false);
    })
    .send(() => {
      // setIsBtnLoading(false);
      // setBtnLogoutId("");
    });
};

export const createQuestionBankFormApi =
  (formValues, navigate, setLoading, clearFormValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_QUESTIONBANK_FORM_API)
      .data(formValues)
      .success((a) => {
        if (a.statusCode === 201 || 200) {
          setLoading(false);
          successToast("Question Bank Form Created Successfully");
          clearFormValues();
          // localStorage.setItem("userQuestionBankID", JSON.stringify(a.details._id))
          navigate(SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE);
        }
      })
      .error((e) => {
        setLoading(false);
        const { message: msg = "" } = e;
        errorToast(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };
export const createQuestionBankFormAndNextApi =
  (formValues, navigate, setLoading, clearFormValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_QUESTIONBANK_FORM_API)
      .data(formValues)
      .success((a) => {
        if (a.statusCode === 201 || 200) {
          setLoading(false);
          successToast("Question Bank Form Created Successfully");
          clearFormValues();
          navigate(`${SUPER_ADMIN_CREATE_QUESTION_PAGE}/${a.details._id}`);
        }
      })
      .error((e) => {
        setLoading(false);
        const { error: msg = "" } = e;
        errorToast(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const getQuestionBankListApi =
  (setLoading, page = 1, limit = 10) =>
  (dispatch) => {
    if (page < 1) page = 1;
    api()
      .root(API_ROOT)
      .get(`${GET_QUESTION_BANK_LIST_API}?page=${page}&limit=${limit}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, totalCounts, questionBankDetails } = a.details;
          dispatch(getQuestionBankList(questionBankDetails));
          dispatch(getPagination({ totalCount: totalCounts, totalPages }));
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
export const getQuestionBankByID = (qid) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${QUESTION_BANK_FILTER_BY_ID_API}/${qid}`)
    .success((a) => {
      const { message: msg = "" } = a;
      if (a.statusCode === 200 || 201) {
        dispatch(getQuestionBankById([a.details]));
      }
    })
    .error((e) => {
      // setLoading && setLoading(false);
      const { message: msg = "" } = e;
      devConsoleLog(e);
    })
    .send(() => {
      // setLoading && setLoading(false);
    });
};

export const getQuestionListApi =
  (setLoading, page = 1, limit = 10) =>
  (dispatch) => {
    if (page < 1) page = 1;
    api()
      .root(API_ROOT)
      .get(`${GET_QUESTION_LIST_API}?page=${page}&limit=${limit}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, totalCounts, sectionDetails } = a.details;
          dispatch(getQuestionList(sectionDetails));
          dispatch(getPagination({ totalCount: totalCounts, totalPages }));
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

export const tourApi = (id) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${TOUR_API}/${id}`)
    .success((a) => {
      const { message: msg = "" } = a;
      // successToast(msg)
      const userData = getUserData();
      storeLocal({ ...userData, isTourComplete: true }, USER_DATA);
      dispatch(setUserInfo(a?.details));
    })
    .error((e) => {
      const { message: msg = "" } = e;
      errorToast(msg);
    })
    .send(() => {
      // setLoading(false)
    });
};

export const changeQuestionBankListStatus =
  (formData, getQuestionList, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CHANGE_QUESTION_BANK_LIST_STATUS_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        successToast(msg);
        if (a.statusCode === 200) {
          getQuestionList();
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

export const changeQuestionListStatusApi =
  (formData, getQuestionList, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CHANGE_QUESTION_LIST_STATUS_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        successToast(msg);
        if (a.statusCode === 200) {
          dispatch(getQuestionListApi());
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

export const createQuestionSection =
  (formValues, navigate, setLoading, clearFormValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_QUESTIONBANK_SECTION_API)
      .data(formValues)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 201 || 200) {
          successToast("Section Created Successfully");
          clearFormValues();
          localStorage.setItem("sectionDetails", JSON.stringify(a.details));
          navigate(SUPER_ADMIN_QUESTION);
        }
        if (a.statusCode === 500) errorToast("Please Refresh and try again!");
      })
      .error((e) => {
        setLoading(false);
        const { error: msg = "" } = e;
        errorToast(msg);
      })
      .send(() => {
        setLoading(false);
      });
  };
export const createQuestionFinal =
  (formValues, navigate, setLoading, clearFormValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(CREATE_QUESTION_FINAL_API)
      .data(formValues)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 201 || 200) {
          successToast("Question Created Successfully");
          clearFormValues();
          navigate(-1);
        }
      })
      .error((e) => {
        setLoading(false);
        const { error: msg = "" } = e;
        // clearFormValues();
        errorToast(msg);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getQuestionPreviewApi =
  (id, setLoading, page = 1, limit = 8, searchQuery = "") =>
  (dispatch) => {
    if (page < 1) page = 1;
    const URL =
      searchQuery && searchQuery !== ""
        ? `${GET_QUESTION_PREVIEW_API}?id=${id}&page=${page}&limit=${limit}&search=${searchQuery}`
        : `${GET_QUESTION_PREVIEW_API}?id=${id}&page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(`${URL}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          const { totalPages, totalCounts } = a?.details;
          dispatch(getQuestionPreviewList(a?.details));
          dispatch(getPagination({ totalCount: totalCounts, totalPages }));
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

export const getCandidateResultApi =
  (setLoading, page = 1, search, limit = 10) =>
  (dispatch) => {
    const URL =
      search && search !== ""
        ? `${GET_CANDIDATE_RESULT_API}?page=${page}&limit=${limit}&search=${search}`
        : `${GET_CANDIDATE_RESULT_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, totalCounts } = a?.details;
          dispatch(getCandidateResultList(a?.details));
          dispatch(getPagination({ totalCount: totalCounts, totalPages }));
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

export const getCandidateResultPreviewApi = (id, setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_CANDIDATE_RESULT_PREVIEW_API}?id=${id}`)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a?.statusCode === 200) {
        const { candidateDetails } = a?.details;
        dispatch(getCandidateResultPreview(candidateDetails));
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

export const UpdateQuestionApi =
  (formValues, navigate, setLoading, clearFormValues, id, lang) =>
  (dispatch) => {
    if (lang === "def") lang = "";
    api()
      .root(API_ROOT)
      .put(`${UPDATE_QUESTION_API}/${id}?lang=${lang}`)
      .data(formValues)
      .success((a) => {
        setLoading(false);
        if (a.statusCode === 201 || 200) {
          successToast(a?.message);
          clearFormValues();
          navigate(
            `${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${
              a?.details?.question_bank_id
            }/${"Theory"}`
          );
        }
      })
      .error((e) => {
        setLoading(false);
        const { error: msg = "" } = e;
        // clearFormValues();
        errorToast(msg);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
export const GetUserPermissionApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_USER_PERMISSION_API)
    .success((a) => {
      setLoading(false);
      if (a?.statusCode === 200) {
        dispatch(setUserInfo(a?.details));
        dispatch(getProfileImageUrl(a?.details?.ProfileUrl));
      }
    })
    .error((e) => {
      setLoading(false);
      const { error: msg = "", message = "" } = e;
      errorToast(message);
    })
    .send(() => {
      setLoading(false);
    }, "candidate");
};

export const getDeviceDetailListsApi =
  (setLoading, _id, _, page, limit, setTotalPages) => (dispatch) => {
    const URL = `${GET_DEVICE_DETAIL_API}?userId=${_id}&page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a?.statusCode === 200) {
          const { totalPages, deviceDetails } = a.details;

          dispatch(getDeviceLists(deviceDetails));
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
export const getStateListsForProfileApi =
  (formData, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(GET_STATES_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const states = a?.details?.states?.map((item) => ({
            label: item?.name,
            value: item?.name,
          }));
          dispatch(getStateLists(states));
        } else {
          errorToast(msg);
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

export const updateUserLoggedInStatusApi =
  (formData, setErr, setLoading) => async (dispatch) => {
    const browser = bowser.getParser(window.navigator.userAgent);
    const browserName = browser.getBrowserName();
    const device = browser.getPlatform().type;

    const getLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(error),
          { enableHighAccuracy: true }
        );
      });
    };

    const getIP = async () => {
      const response = await fetch("https://api64.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    };

    try {
      const [geolocation, userIp] = await Promise.all([getLocation(), getIP()]);

      const deviceDetails = {
        device: device,
        browser: browserName,
        ipAddress: userIp,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        ...formData,
      };

      api()
        .root(API_ROOT)
        .patch(GET_USER_LOGGED_IN_STATUS_API)
        .data(deviceDetails)
        .success((a) => {
          const { message: msg = "" } = a;
          setLoading(false);
          if (a.statusCode === 200) {
            // successToast(msg);
            // dispatch(getDeviceDetailListsApi(() => { }, deviceDetails?.userId))
            setErr("");
          } else {
            setErr(msg);
          }
        })
        .error((e) => {
          const { message: msg = "" } = e;
          errorToast(msg);
          setLoading && setLoading(false);
          devConsoleLog(e);
        })
        .send(() => {
          setLoading && setLoading(false);
        });
    } catch (error) {
      setLoading && setLoading(false);
      setErr("Please enable location.");
    }
  };

export const submitTrainingPartnerFeedbackApi =
  (formData, setLoading, token) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${SUBMIT_TRAINING_PARTNER_FEEDBACK_API}?token=${token}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
        } else {
          errorToast(msg);
        }
      })
      .error((e) => {
        const { message: msg = "" } = e;
        errorToast(msg);
        setLoading && setLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      })
      .finally(() => {
        setLoading && setLoading(false);
      });
  };

export const submitAssessorFeedbackApi =
  (formData, setLoading, token) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${SUBMIT_ASSESSOR_FEEDBACK_API}?token=${token}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          successToast(msg);
        } else {
          errorToast(msg);
        }
      })
      .error((e) => {
        const { message: msg = "" } = e;
        errorToast(msg);
        setLoading && setLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      })
      .finally(() => {
        setLoading && setLoading(false);
      });
  };

export const getFeedbackApi = (batchId, type) => (dispatch) => {
  if (!type || !["assessor", "trainingPartner"].includes(type)) {
    errorToast(
      "Invalid feedback type. Type must be 'assessor' or 'trainingPartner'"
    );
    return;
  }

  return new Promise((resolve, reject) => {
    api()
      .root(API_ROOT)
      .get(`${GET_FEEDBACK_API}/${batchId}?type=${type}`)
      .downloadFilename(`${type}_feedback_${batchId}.pdf`, "blob")
      .success((response) => {
        successToast("Feedback downloaded successfully");
        resolve(response);
      })
      .error((e) => {
        const { message: msg = "" } = e;
        errorToast(msg || "Failed to download feedback");
        reject(e);
      })
      .send();
  });
};

export const getFeedbackBatchApi =
  (token, type = "assessor") =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_FEEDBACK_BATCH_API}?token=${token}`)
      .success((response) => {
        dispatch(getFeedbackBatchDetails(response?.details));
      })
      .error((e) => {
        const { message: msg = "" } = e;
        errorToast(msg || "Failed to get feedback batch");
      })
      .send();
  };

export const checkPasswordResetApi = (token) => (dispatch) => {
  api()
    .root(API_ROOT)
    .post(`${CHECK_PASSWORD_RESET_API}`)
    .data(token)
    .success((res) => {
      dispatch(
        getIsLinkValid({
          message: res.message,
          isLinkValid: res?.details?.isLinkValid,
        })
      );
    })
    .error(() => {})
    .send();
};
