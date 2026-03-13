import { createSlice } from "@reduxjs/toolkit";

const misResultsSlice = createSlice({
  name: "resultsManagement",
  initialState: {
    resultsList: [],
    candidatesResults: [],
    failedCandidateResults: [],
    specificCandidateResult: [],
    offlineResults: [],
    NOSWiseResults: [],
    NOSWiseOfflineBatchDetails: [],
    CandidateDetailsNOSWiseOffline: [],
    candidateFeedback: {},
    candidateListWithQuestions: [],
    offlineSingleCandidatePortalStats: {},
  },

  reducers: {
    getResultsList: (state, { payload }) => {
      state.resultsList = payload;
    },
    getCandidatesResult: (state, { payload }) => {
      state.candidatesResults = payload;
    },
    setFailedCandidatesResult: (state, { payload }) => {
      state.failedCandidateResults = payload;
    },
    getSpecificCandidateResult: (state, { payload }) => {
      state.specificCandidateResult = payload;
    },
    getOfflineResultsList: (state, { payload }) => {
      state.offlineResults = payload;
    },
    getNOSWiseResultsList: (state, { payload }) => {
      state.NOSWiseResults = payload;
    },
    getNOSWiseOfflineBatchDetails: (state, { payload }) => {
      state.NOSWiseOfflineBatchDetails = payload;
    },
    getCandidateDetailsNOSWiseOffline: (state, { payload }) => {
      state.CandidateDetailsNOSWiseOffline = payload;
    },
    getCandidateFeedback: (state, { payload }) => {
      state.candidateFeedback = payload;
    },
    getCandidateListWithQuestions: (state, { payload }) => {
      state.candidateListWithQuestions = payload;
    },
    getOfflineSingleCandidatePortalStats: (state, { payload }) => {
      state.offlineSingleCandidatePortalStats = payload;
    },
  },
});

export const {
  getResultsList,
  getCandidatesResult,
  setFailedCandidatesResult,
  getSpecificCandidateResult,
  getOfflineResultsList,
  getNOSWiseResultsList,
  getNOSWiseOfflineBatchDetails,
  getCandidateDetailsNOSWiseOffline,
  getCandidateFeedback,
  getCandidateListWithQuestions,
  getOfflineSingleCandidatePortalStats,
} = misResultsSlice.actions;

export const misResultsSelector = (state) => state.superAdmin.resultsManagement;

const misResultsReducer = misResultsSlice.reducer;

export default misResultsReducer;
