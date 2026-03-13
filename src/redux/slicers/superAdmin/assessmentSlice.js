import { createSlice } from "@reduxjs/toolkit";

const assessmentSlice = createSlice({
  name: "assessment",
  initialState: {
    assessmentList: [],
    jobRoleList: [],
    schemeList: [],
    assessmentPreview: [],
    questionBankList: [],
    previewAssessment: [],
    singleAssessmentDetail: {},
    batchList: [],
    batchListDetailed: [],
    assessmentStats: [],
    assessmentPreviewById: [],
    assessmentLangs: [],
    previewAssessmentForAddQn: [],
  },
  reducers: {
    getAssessmentList: (state, { payload }) => {
      state.assessmentList = payload;
    },
    getSingleAssessmentDetail: (state, { payload }) => {
      state.singleAssessmentDetail = payload;
    },
    getJobRoleList: (state, { payload }) => {
      state.jobRoleList = payload;
    },
    getSchemeList: (state, { payload }) => {
      state.schemeList = payload;
    },
    getAssessmentPreviewList: (state, { payload }) => {
      state.assessmentPreview = payload;
    },
    getQuestionBankList: (state, { payload }) => {
      state.questionBankList = payload;
    },
    getPreviewAssessment: (state, { payload }) => {
      state.previewAssessment = payload[0];
      state.assessmentLangs = payload[1];
    },
    getPreviewAssessmentForAddQn: (state, { payload }) => {
      state.previewAssessmentForAddQn = payload;
    },
    getBatchList: (state, { payload }) => {
      state.batchList = payload;
    },
    getDetailedBatchList: (state, { payload }) => {
      state.batchListDetailed = payload;
    },
    getAssessmentStats: (state, { payload }) => {
      state.assessmentStats = payload;
    },
    getAssessmentPreviewById: (state, { payload }) => {
      state.assessmentPreviewById = payload;
    },
    getAssessmentLangs: (state, { payload }) => {
      state.assessmentLangs = payload;
    },
  },
});

export const {
  getAssessmentList,
  getSingleAssessmentDetail,
  getJobRoleList,
  getSchemeList,
  getAssessmentPreviewList,
  getQuestionBankList,
  getPreviewAssessment,
  getPreviewAssessmentForAddQn,
  getBatchList,
  getDetailedBatchList,
  getAssessmentStats,
  getAssessmentPreviewById,
  getAssessmentLangs,
} = assessmentSlice.actions;

export const assessmentSelector = (state) => state.superAdmin.assessment;
const assessmentReducer = assessmentSlice.reducer;

export default assessmentReducer;
