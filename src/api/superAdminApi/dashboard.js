import api from "../../utils/apiHelper.js";
import {
  devConsoleLog,
  errorToast,
  successToast,
  getUniqueValue,
  shouldAppendDateParams,
} from "../../utils/projectHelper";

import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  GET_DASHBOARD_GRID_STYLE_API,
  SET_DASHBOARD_GRID_STYLE_API,
  GET_ADMIN_DASHBOARD_BASIC_DETAILS_API,
  POST_UPCOMING_ASSESSMENT_API,
  GET_ASSESSMENT_STATISTICS_API,
  GET_ACTIVE_CLIENT_STATISTICS_API,
  GET_DASHBOARD_NOTIFICATION_API,
  PUT_DASHBOARD_SCHEDULE_MEETING_API,
  GET_ALL_CLIENT_PROFILE_API,
  UPDATE_LAYOUT_CHANGE,
  NCEVT_CLIENT_BASED_JOBROLE,
} from "../../config/constants/apiConstants/superAdmin";

import {
  getDashboardGridStyle,
  getSuperAdminBasicDetail,
  getAssessmentDetail,
  getAssessmentStatistics,
  getActiveClientStatistics,
  getNotifications,
} from "../../redux/slicers/superAdmin/dashboardSlice";
import {
  getAllClient,
  getclientManagementLists,
} from "../../redux/slicers/superAdmin/clientManagement.js";
import { dashboardConstants } from "../../config/constants/projectConstant.js";
import moment from "moment";

export const getDashboardGridStyleApi = (id, setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_DASHBOARD_GRID_STYLE_API}/${id}`)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        const { lg, md, sm, xs, xxs } = a?.details;
        dispatch(getDashboardGridStyle({ lg, md, sm, xs, xxs }));
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

export const postDashboardGridStyleApi =
  (formData, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(SET_DASHBOARD_GRID_STYLE_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          const { lg, md, sm, xs, xxs } = a?.details;
          dispatch(getDashboardGridStyle({ lg, md, sm, xs, xxs }));
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

export const getAdminDashboardBasicDetailsApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_ADMIN_DASHBOARD_BASIC_DETAILS_API)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getSuperAdminBasicDetail(a?.details));
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

export const postUpcomingAssessmentApi =
  (formData, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(POST_UPCOMING_ASSESSMENT_API)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getAssessmentDetail(a?.details));
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

export const getAssessmentStatisticsApi =
  (setLoading, type, setKey) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_ASSESSMENT_STATISTICS_API}?type=${type}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getAssessmentStatistics(a?.details));
          setKey((pre) => (pre == 1 ? 2 : 1));
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

export const getActiveClientStatisticsApi =
  (setLoading, type, setKey) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_ACTIVE_CLIENT_STATISTICS_API}?type=${type}`)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(getActiveClientStatistics(a?.details));
          setKey((pre) => (pre == 1 ? 2 : 1));
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

export const getNotificationsApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_DASHBOARD_NOTIFICATION_API)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getNotifications(a?.details));
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

export const putDashboardScheduleMeetingApi =
  (setLoading, id, formData, handleResetScheduleFormValues) => (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${PUT_DASHBOARD_SCHEDULE_MEETING_API}/${id}`)
      .data(formData)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          successToast(msg);
          setLoading && setLoading(false);
          // getList();
          handleResetScheduleFormValues && handleResetScheduleFormValues();
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

export const getAllClientListsApi =
  (
    setLoading,
    page,
    limit
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
    // const URL =
    //   search && search !== ""
    //     ? `${GET_ALL_CLIENT_PROFILE_API}?page=${page}&limit=${limit}&search=${search}&organisationType=${organisationType}`
    //     : `${GET_ALL_CLIENT_PROFILE_API}?page=${page}&limit=${limit}`;
    // const DATE_URL = `${GET_ALL_CLIENT_PROFILE_API}?organisationType=${organisationType}&state=${state}&page=${page}&limit=${limit}`;
    // const FILTER_URL = `${GET_ALL_CLIENT_PROFILE_API}?page=${page}&limit=${limit}&sectorFilterIds=${sectorFilterIds}&organisationType=${organisationType}`;
    const END_URL = `${GET_ALL_CLIENT_PROFILE_API}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(END_URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          const { totalPages, result, totalCounts = 0 } = a.details;
          dispatch(getclientManagementLists(result));
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

export const sendLayoutChangeDataToServerAPI =
  (payloadToSend, id) => (dispatch) => {
    const payload = { components: [...payloadToSend] };
    api()
      .root(API_ROOT)
      .put(`${UPDATE_LAYOUT_CHANGE}/${id}`)
      .data(payload)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          // successToast(msg);
          // setLoading && setLoading(false);
        }
      })
      .error((e) => {
        const { message: msg = "" } = e;
        devConsoleLog(e);
        errorToast(msg);
        // setLoading(false);
      })
      .send(() => {
        // setLoading(false);
      });
  };

export const getSpecificWidgetDataAPI =
  (setLoading, url, clientId, updateWidgetData) => (dispatch) => {
    let baseurl = url;
    if (clientId) {
      baseurl = baseurl + `?clientId=${clientId}`;
    }
    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateWidgetData(a?.details);
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

export const getTableDataAPI =
  (
    url,
    clientId,
    setLoading,
    updateTableData,
    page = 1,
    limit = 5,
    searchQuery = "",
    selectInputData = "",
    tableSpecificData
  ) =>
  (dispatch) => {
    let baseurl = url + `?page=${page}&limit=${limit}`;

    if (searchQuery && tableSpecificData?.isSearchRequired) {
      baseurl = baseurl + `&search=${searchQuery}`;
    }

    if (selectInputData && tableSpecificData?.isDropdownSelectRequired) {
      baseurl = baseurl + `&filterType=${selectInputData}`;
    }
    if (clientId) {
      baseurl = baseurl + `&clientId=${clientId}`;
    }

    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateTableData(a?.details || a?.message);
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

export const getDonutDataDetailsApi =
  (url, setLoading, clientId, optionSelectedValue = "", updateDonutData) =>
  (dispatch) => {
    let baseurl = url;
    if (optionSelectedValue && !clientId) {
      baseurl = baseurl + `?filterType=${optionSelectedValue}`;
    }

    if (clientId && !optionSelectedValue) {
      baseurl = baseurl + `?clientId=${clientId}`;
    }

    if (clientId && optionSelectedValue) {
      baseurl =
        baseurl + `?clientId=${clientId}&filterType=${optionSelectedValue}`;
    }
    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateDonutData(a?.details);
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

export const getDonutDataWithColorCodeAPI =
  (url, clientId, setLoading, optionSelected, updateDonutData) =>
  (dispatch) => {
    let baseurl = url;
    if (optionSelected && !clientId) {
      baseurl = baseurl + `?filterBy=${optionSelected}`;
    }
    if (clientId && !optionSelected) {
      baseurl = baseurl + `&clientId=${clientId}`;
    }

    if (clientId && optionSelected) {
      baseurl = baseurl + `?filterBy=${optionSelected}&clientId=${clientId} `;
    }
    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateDonutData(a?.details);
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

export const getDonutDataAPI =
  (url, setLoading, clientId, updateDonutData) => (dispatch) => {
    let baseurl = url;
    if (clientId) {
      baseurl = baseurl + `?clientId=${clientId}`;
    }
    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateDonutData(a?.details);
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

export const getDataForIndiaMapAPI =
  (url, setLoading, clientId, updateData) => () => {
    let baseurl = url;
    if (clientId) {
      baseurl = baseurl + `?clientId=${clientId}`;
    }
    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          updateData(a?.details);
          setLoading && setLoading(false);
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

export const getCurveDataApi =
  (url, setLoading, clientId, updateData, filter, title, dashboardType) =>
  () => {
    let baseurl = url;
    if (
      filter &&
      `${title} ${dashboardType}` === dashboardConstants?.DailyWorkProgressCD
    ) {
      baseurl = `${url}?filterType=${filter}`;
    } else if (
      filter &&
      `${title} ${dashboardType}` === dashboardConstants?.AssessmentAnalyticsOD
    ) {
      baseurl = `${url}?filterBy=${filter}`;
    } else if (
      filter &&
      `${title} ${dashboardType}` === dashboardConstants?.AssessmentAnalysisHR
    ) {
      baseurl = `${url}?filterBy=${filter}`;
    } else if (filter) {
      baseurl = `${url}?filterBy=${filter}`;
    }

    if (clientId) {
      baseurl = baseurl + `&clientId=${clientId}`;
    }

    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateData(a?.details);
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

export const getCalenderDataApi =
  (url, clientId, startDate, setLoading, updateData) => () => {
    let baseurl = url;
    if (startDate) {
      baseurl = baseurl + `?startDate=${startDate}`;
    }

    if (clientId) {
      baseurl = baseurl + `&clientId=${clientId}`;
    }

    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateData(
            a?.details?.batchList || a?.details?.MeetingScheduleList || []
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

export const getHorizontalBarDataApi =
  (url, clientId, setLoading, updateData) => () => {
    let baseurl = url;

    if (clientId) {
      baseurl = baseurl + `?clientId=${clientId}`;
    }
    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateData(a?.details?.schemeAnalytics);
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

export const getLineCurveDataApi =
  (url, clientId, setLoading, updateData) => () => {
    let baseurl = url;
    if (clientId) {
      baseurl = baseurl + `?clientId=${clientId}`;
    }
    api()
      .root(API_ROOT)
      .get(baseurl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateData(a?.details);
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

export const getAllClientsApi = (setLoading, page, limit) => (dispatch) => {
  const END_URL = `${NCEVT_CLIENT_BASED_JOBROLE}?page=${page}&limit=${limit}`;
  api()
    .root(API_ROOT)
    .get(END_URL)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getAllClient(a?.details?.clientsData));
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

export const getMultipleCurveDataApi =
  (url, clientId, setLoading, updateData, range) => () => {
    let baseurl = url;
    const params = new URLSearchParams();

    if (clientId) {
      params.append("clientId", clientId);
    }

    // if (currentOption) {
    //   params.append("filterType", currentOption);
    // }

    if (shouldAppendDateParams(range)) {
      params.append(
        "startOfDate",
        moment(range[0].startDate).format("DD-MM-YYYY")
      );
      params.append("endOfDate", moment(range[0].endDate).format("DD-MM-YYYY"));
    }

    const finalUrl = params.toString()
      ? `${baseurl}?${params.toString()}`
      : baseurl;

    api()
      .root(API_ROOT)
      .get(finalUrl)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          updateData(a?.details?.operationStats);
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
