import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardSlice";
import assessmentReducer from "./assessmentSlice";
import examManagementReducer from "./examManagementSlice";
import clientManagementReducer from "./clientManagement";
import qbManagementReducer from "./questionBankSlice";
import instructionManagementReducer from "./instructionsSlice";
import verificationTabReducer from "./verificationTabSlice";
import misResultsReducer from "./misResults";
import assessorAttendanceReducer from "./assessorAttendanceSlice";
import skillAssementSliceReduce from "./skillAssessment";

const superAdminReducer = combineReducers({
  dashboard: dashboardReducer,
  assessment: assessmentReducer,
  examManagement: examManagementReducer,
  clientManagement: clientManagementReducer,
  qbManagement: qbManagementReducer,
  instructionsManagement: instructionManagementReducer,
  verificationTab: verificationTabReducer,
  resultsManagement: misResultsReducer,
  assessorAttendance:assessorAttendanceReducer,
  skillAssessment:skillAssementSliceReduce,
});

export default superAdminReducer;
