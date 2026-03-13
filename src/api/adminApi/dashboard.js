import api from "../../utils/apiHelper.js";
import { devConsoleLog } from "../../utils/projectHelper";

import { API_ROOT } from "../../config/constants/apiConstants/auth";
import {
  GET_CLIENT_STATISTICS_API,
  GET_LIST_OF_ALL_ITEMS_API,
  GET_CLIENT_SUMMARY_API,
  GET_WIDGET_STATS_API,
  GET_WIDGET_STATS_MIS_API,
  GET_TOTAL_BATCH_OVERVIEW_API,
  GET_BATCH_STATISTICS_API,
  GET_ASSESSED_APPLICANTS,
  GET_ASSESSEDBATCH_ADMINDASHBOARD,
  GET_LIVE_BATCH_ADMINDASHBOARD,
  GET_JOBROLE_ADMINDASHBOARD,
  GET_ASSESSOR_ONBOARD_ADMINDASHBOARD,
  GET_ASSESSMENT_ANALYTICS,
  GET_ASSESSOR_BY_LOCATION,
  GET_SCHEDULED_BATCH_LIST,
  GET_LIVE_BATCH_LIST,
  GET_SECTOR_WISE_ASSESSMENT,
  GET_WIDGET_STATS_CD,
  GET_QUESTION_BANK_ANALYTICS_CD,
  GET_LANGUAGE_DISTRIBUTION_ANALYTICS_CD,
  GET_ALL_JOBROLE_OCCURANCE,
  GET_ALL_TEAM_MEMBER_LIST_CD,
  GET_ALL_CLIENT_WITH_JOBROLE,
  GET_SCHEDULED_BATCH_LIST_CD,
  GET_TOTAL_JOBROLE_COMMONDASHBOARD,
} from "../../config/constants/apiConstants/admin";
import {
  getClientSummaryList,
  getClientLists,
  getClientStatistics,
  getWidgetStats,
  getBatchStatistics,
  getAssessedApplicant,
  getassessorOnboard,
  getJobRole,
  getliveBatch,
  getAssessmentAnalyticsData,
  getAssessorByLocationData,
  getScheduledBatch,
  getClientWithJobRole,
  getLiveBatchLogsData,
  getSectorWiseAssessmentdata,
  getAssessedBatch,
  getContentDashboardWidgetsData,
  getQuestionBankAnalyticsDataContentDashboard,
  getLanguageAnalyticsDataContentDashboard,
  getJobRoleOccuranceDataContentDashboard,
  getTeamMemberListContentDashboard,
  getClientWithJobRoleContentDashboard,
  getScheduledBatchList_ContentDashboard,
  getTotalJobRoleCD,
  // getLanguageAnalyticsDataContentDashboard
} from "../../redux/slicers/admin/dashboardSlice";
import { getAssessedBatchList } from "../../redux/slicers/authSlice.js";
import { BDA_GET_ALL_JOB_ROLES_API, BDA_GET_ALL_JOB_ROLES_LIST_API, NCEVT_CLIENT_BASED_JOBROLE } from "../../config/constants/apiConstants/superAdmin.js";

export const getClientListsApi =
  (setLoading, page, limit, setTotalPages) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_LIST_OF_ALL_ITEMS_API}?page=${page}&limit=${limit}`)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          dispatch(getClientLists(a?.details?.result));
          setTotalPages(a?.details?.totalPages);
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

export const getClientStatisticsApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_CLIENT_STATISTICS_API)
    .success((a) => {
      const { message: msg = "" } = a;
      if (a.statusCode === 200) {
        dispatch(getClientStatistics(a?.details));
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

export const getClientSummaryApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_CLIENT_SUMMARY_API)
    .success((a) => {
      const { message: msg = "" } = a;
      if (a.statusCode === 200) {
        dispatch(getClientSummaryList(a?.details));
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

export const getWidgetStatsApi = (setLoading) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(GET_WIDGET_STATS_API)
    .success((a) => {
      const { message: msg = "" } = a;
      if (a.statusCode === 200) {
        dispatch(getWidgetStats(a?.details));
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

export const getWidgetStatsMISApi = (setLoading, id) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_WIDGET_STATS_MIS_API}/${id}`)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getWidgetStats(a?.details));
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

export const getTotalBatchOverviewApi = (setLoading, ID) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_TOTAL_BATCH_OVERVIEW_API}/${ID}`)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getClientSummaryList(a?.details));
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

export const getBatchStatisticsApi = (setLoading, clientId) => (dispatch) => {
  api()
    .root(API_ROOT)
    .get(`${GET_BATCH_STATISTICS_API}/${clientId}`)
    .success((a) => {
      const { message: msg = "" } = a;
      setLoading && setLoading(false);
      if (a.statusCode === 200) {
        dispatch(getBatchStatistics([a?.details]));
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

export const getAssessedApplicantData =
  (setLoading, clientId = "") =>
  (dispatch) => {
    let url="";
    if(clientId){
      url = `${GET_ASSESSED_APPLICANTS}?clientId=${clientId}`;
    }
    else{
      url = `${GET_ASSESSED_APPLICANTS}`;
    }

    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {

          if (a.details && Object.keys(a.details).length > 0) {
            const data = a.details;
            dispatch(getAssessedApplicant(data));
          }
          setLoading(false);
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

  export const getassessedBatch = (setLoading, clientId) => (dispatch) => {
    
    let url="";
    if(clientId){
      url = `${GET_ASSESSEDBATCH_ADMINDASHBOARD}?clientId=${clientId}`;
    }
    else{
      url = `${GET_ASSESSEDBATCH_ADMINDASHBOARD}`;
    }
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          const data = a.details.adminStats;
          // dispatch(getWidgetStats(a?.details));
          dispatch(getAssessedBatch(data));
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
  
  export const getLiveBatch = (setLoading, clientId) => (dispatch) => {
    let url="";
    if(clientId){
        url = `${GET_LIVE_BATCH_ADMINDASHBOARD}?clientId=${clientId}`
    }
    else{
      url = `${GET_LIVE_BATCH_ADMINDASHBOARD}`
    }
    
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          // dispatch(getWidgetStats(a?.details));
          const data = a.details.adminStats;
          dispatch(getliveBatch(data));
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
  

  
  
  export const getAssessorOnboardData = (setLoading, clientId) => (dispatch) => {
    let url="";
    if(clientId){
      url=`${GET_ASSESSOR_ONBOARD_ADMINDASHBOARD}?clientId=${clientId}`
    }
    else{
      url=`${GET_ASSESSOR_ONBOARD_ADMINDASHBOARD}`
    }
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          const data = a.details;
          dispatch(getassessorOnboard(data));
          // dispatch(getWidgetStats(a?.details));
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
  
  export const getAssessorAnalyticsData = (setLoading, clientId) => (dispatch) => {

    let url="";
    if(clientId){
      url=`${GET_ASSESSMENT_ANALYTICS}?clientId=${clientId}`
    }
    else{
      url=`${GET_ASSESSMENT_ANALYTICS}`;
    }
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
  
          if (a.details) {
            const data = a.details;
            // dispatch(getAssessorByLocation(data));
            dispatch(getAssessmentAnalyticsData(data));
            // dispatch(getSectorWiseAssessmentdata(data))
          }
          setLoading(false);
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

  export const getAssessorByLocation = (setLoading,clientId) => (dispatch) => {
    let url="";
    if(clientId){
      url=`${GET_ASSESSOR_BY_LOCATION}?clientId=${clientId}`
    }
    else{
      url= `${GET_ASSESSOR_BY_LOCATION}`
    }
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
  
          if (a.details.assessorStats) {
            const data = a.details.assessorStats;
            dispatch(getAssessorByLocationData(data));
  
            // dispatch(getSectorWiseAssessmentdata(data))
          }
          setLoading(false);
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

  export const getAllJobRoleDashboard = (setLoading) => (dispatch) => {
    const URL = `${NCEVT_CLIENT_BASED_JOBROLE}?page=1&limit=5`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode == 200) {
          // const { jobRoleDetails, totalPages, totalCounts } = a.details;
          const { clientDetails, totalPages, totalCounts } = a.details;
          dispatch(getClientWithJobRole(clientDetails));
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
        // errorToast(err?.error);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
  
  export const getScheduledBatchList =
    (setLoading, isStatus, startDate, clientId="") => (dispatch) => {
      let URL="";
      if(clientId){
        URL = `${GET_SCHEDULED_BATCH_LIST}?startDate=${startDate}&clientId=${clientId}`;
      }
      else{
        URL=`${GET_SCHEDULED_BATCH_LIST}?startDate=${startDate}`;
      }
  
      api()
        .root(API_ROOT)
        .get(URL)
        .success((a) => {
          setLoading && setLoading(false);
          if (a.statusCode == 200) {
            const data=a.details.batchList
            dispatch(getScheduledBatch(data))
          }
        })
        .error((err) => {
          setLoading && setLoading(false);
        })
        .send(() => {
          setLoading && setLoading(false);
        });
    };

    
  export const getScheduledBatchList_CD =
  (setLoading, isStatus, startDate, clientId="") => (dispatch) => {
    let URL="";
    if(clientId){
      URL = `${GET_SCHEDULED_BATCH_LIST_CD}?startDate=${startDate}&clientId=${clientId}`;
    }
    else{
      URL=`${GET_SCHEDULED_BATCH_LIST_CD}?startDate=${startDate}`;
    }
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode == 200) {
          const data=a.details.batchList
          data && dispatch(getScheduledBatchList_ContentDashboard(data))
        }
      })
      .error((err) => {
        setLoading && setLoading(false);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };


    export const getSectorWiseAssessmentData = (clientId,setLoading) => (dispatch) => {
      let url="";
      if(clientId){
        url= `${GET_SECTOR_WISE_ASSESSMENT}?clientId=${clientId}`
      }
      else{
        url = `${GET_SECTOR_WISE_ASSESSMENT}`
      }
      api()
        .root(API_ROOT)
        .get(url)
        .success((a) => {
          const { message: msg = "" } = a;
          if (a.statusCode === 200) {
    
            if (a.details.clientId) {
              const data = a.details.clientId;
              dispatch(getSectorWiseAssessmentdata(data));
            }
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

    export const getLiveBatchesLogs =(setLoading, page, limit, setTotalPages, setResultCounts,clientId) => (dispatch) => {
    let URL="";
      if(clientId){
        URL = `${GET_LIVE_BATCH_LIST}?clientId=${clientId}&page=${page}&limit=${limit}`             ;
      }
      else{
        URL=`${GET_LIVE_BATCH_LIST}?page=${page}&limit=${limit}`;
      }
    api()
      .root(API_ROOT)
      .get(
        URL
      )
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          const data = a.details.batchList;
          // setTotalPages(a?.details?.totalPages);
          // setResultCounts && setResultCounts(a?.details?.totalCounts);
          dispatch(getLiveBatchLogsData(data));
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
//Content Dashboard API
  export const getWidgetStatsData_CD =(setLoading,clientId='') => (dispatch) => {
    let URL="";
      if(clientId){
        URL = `${GET_WIDGET_STATS_CD}?clientId=${clientId}`             ;
      }
      else{
        URL=`${GET_WIDGET_STATS_CD}`;
      }
    api()
      .root(API_ROOT)
      .get(
        URL
      )
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          const data = a?.details;
          data && dispatch(getContentDashboardWidgetsData(data))
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

  export const getQuestionBankAnalyticsData_CD =(setLoading,clientId='') => (dispatch) => {
    let URL="";
      if(clientId){
        URL = `${GET_QUESTION_BANK_ANALYTICS_CD}?clientId=${clientId}`             ;
      }
      else{
        URL=`${GET_QUESTION_BANK_ANALYTICS_CD}`;
      }
    api()
      .root(API_ROOT)
      .get(
        URL
      )
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {

          const data = a.details;
          a?.details?.questionCount && dispatch(getQuestionBankAnalyticsDataContentDashboard(a?.details?.questionCount))
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


  export const getLanguageDistributionData_CD =(setLoading,clientId='') => (dispatch) => {
    let URL="";
      if(clientId){
        URL = `${GET_LANGUAGE_DISTRIBUTION_ANALYTICS_CD}?clientId=${clientId}`             ;
      }
      else{
        URL=`${GET_LANGUAGE_DISTRIBUTION_ANALYTICS_CD}`;
      }
    api()
      .root(API_ROOT)
      .get(
        URL
      )
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {

          a?.details && dispatch(getLanguageAnalyticsDataContentDashboard(a?.details))
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
  
  export const getJobRoleOccurance_CD =(setLoading, page=1, limit=5, setTotalPages,clientId="") => (dispatch) => {
    let URL="";
    if(clientId){
      URL=`${GET_ALL_JOBROLE_OCCURANCE}?clientId=${clientId}&page=${page}&limit=${limit}`;
    }
    else{
      URL=`${GET_ALL_JOBROLE_OCCURANCE}?page=${page}&limit=${limit}`;
    }
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          a?.details?.jobRoleDetails && dispatch(getJobRoleOccuranceDataContentDashboard(a?.details?.jobRoleDetails))
          a?.details?.totalPages && setTotalPages(a?.details?.totalPages);
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

  export const getTeamMemberListApi =(setLoading, page=1, limit=5, setTotalPages,) => (dispatch) => {
    
    const URL=`${GET_ALL_TEAM_MEMBER_LIST_CD}?page=${page}&limit=${limit}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          a?.details?.userDetails && dispatch(getTeamMemberListContentDashboard(a?.details?.userDetails))
          a?.details?.totalPages && setTotalPages(a?.details?.totalPages);
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

  export const getJobRoleData = (setLoading, clientId) => (dispatch) => {
    let url="";
    if(clientId){
      url=`${GET_JOBROLE_ADMINDASHBOARD}?clientId=${clientId}`
    }
    else{
      url=`${GET_JOBROLE_ADMINDASHBOARD}`
    }
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          const data = a.details;
          // dispatch(getWidgetStats(a?.details));
          dispatch(getJobRole(data));
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

  export const getClientWithJobRoleApi =(setLoading, page=1, limit=5, setTotalPages) => (dispatch) => {
    const URL=`${GET_ALL_CLIENT_WITH_JOBROLE}?page=${page}&limit=${limit}`;
  
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          a?.details?.result && dispatch(getClientWithJobRoleContentDashboard(a?.details?.result))
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


  export const getTotalJobRoleData_CD = (setLoading, clientId) => (dispatch) => {
    let url="";
    if(clientId){
      url=`${GET_TOTAL_JOBROLE_COMMONDASHBOARD}?clientId=${clientId}`
    }
    else{
      url=`${GET_TOTAL_JOBROLE_COMMONDASHBOARD}`
    }
    api()
      .root(API_ROOT)
      .get(url)
      .success((a) => {
        const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          const data = a.details;
          dispatch(getTotalJobRoleCD(data));
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