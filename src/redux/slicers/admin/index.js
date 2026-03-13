import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardSlice";

const adminReducer = combineReducers({
  dashboard: dashboardReducer,
});

export default adminReducer;
