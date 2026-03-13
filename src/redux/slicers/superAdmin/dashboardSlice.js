import { createSlice } from "@reduxjs/toolkit";
import layoutConfig from "../../../pages/superAdmin/dashboards/dashboard/layoutConfig";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboardGridStyle: layoutConfig,
    basicDetail: {},
    assessmentDetail: [],
    assessmentStatistics: [],
    activeClientStatistics: {},
    notifications: [],
  },
  reducers: {
    getDashboardGridStyle: (state, { payload }) => {
      state.dashboardGridStyle = payload;
    },
    getSuperAdminBasicDetail: (state, { payload }) => {
      state.basicDetail = payload;
    },
    getAssessmentDetail: (state, { payload }) => {
      state.assessmentDetail = payload;
    },
    getAssessmentStatistics: (state, { payload }) => {
      state.assessmentStatistics = payload;
    },
    getActiveClientStatistics: (state, { payload }) => {
      state.activeClientStatistics = payload;
    },
    getNotifications: (state, { payload }) => {
      state.notifications = payload;
    },
  },
});

export const {
  getDashboardGridStyle,
  getSuperAdminBasicDetail,
  getAssessmentDetail,
  getAssessmentStatistics,
  getActiveClientStatistics,
  getNotifications,
} = dashboardSlice.actions;

export const dashboardSelector = (state) => state.superAdmin.dashboard;
const dashboardReducer = dashboardSlice.reducer;

export default dashboardReducer;
