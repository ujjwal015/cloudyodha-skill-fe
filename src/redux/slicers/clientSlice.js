import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "client",
  initialState: {
    navPath: null,
    searchResultsQuestionBank: [],
    sectionsByJobRole: [],
    sectionByID: [],
    questionByID: [],
    questionPreviewSearchResults: [],
    specificClientDetails: [],
    proctorsList: [],
    dashboardDropDownList: {},
    singleDashboard: {},
    getAllDashboardList: [],
  },

  reducers: {
    navigatePath: (state, { payload }) => {
      state.navPath = payload;
    },
    getSearchResultsQuestionBank: (state, { payload }) => {
      state.searchResultsQuestionBank = payload;
    },
    getSectionDetailsByID: (state, { payload }) => {
      state.sectionByID = payload;
    },
    getQuestionDetailsByID: (state, { payload }) => {
      state.questionByID = payload;
    },
    getSectionsByJobRole: (state, { payload }) => {
      state.sectionsByJobRole = payload;
    },
    getQuestionsPreviewSearchResults: (state, { payload }) => {
      state.questionPreviewSearchResults = payload;
    },
    getSpecificClientDetails: (state, { payload }) => {
      state.specificClientDetails = payload;
    },
    getProctorsList: (state, { payload }) => {
      state.proctorsList = payload;
    },
    getDashboardDropDownList: (state, { payload }) => {
      state.dashboardDropDownList = payload;
    },
    getSingleDashboard: (state, { payload }) => {
      state.singleDashboard = payload;
    },
    getAllDashboardList: (state, { payload }) => {
      state.getAllDashboardList = payload;
    },
  },
});

export const {
  navigatePath,
  getSearchResultsQuestionBank,
  getSectionDetailsByID,
  getQuestionDetailsByID,
  getSectionsByJobRole,
  getQuestionsPreviewSearchResults,
  getSpecificClientDetails,
  getProctorsList,
  getDashboardDropDownList,
  getSingleDashboard,
  getAllDashboardList,
} = clientSlice.actions;

export const clientSelector = (state) => state.client;
const clientReducer = clientSlice.reducer;
export default clientReducer;
