import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    clientLists: [],
    clientStatistics: {},
    clientSummaryList: [],
    widgetStats: [],
    batchStatistics: {},
    dashboardsData: {},
    overViewTableData: [],
    assessedApplicant:{},
    assessedBatch:{},
    liveBatch:{},
    jobRole:{},
    assessorOnboard:{},
    sectorWiseAssessmentData:[],
    data:[],
    assessorDataByLocation:[],
    assessmentAnalyticsData:{},
    clientListWithJobRole:{},
    liveBatchLogs:[],
    scheduledBatch:[],
    contentDashboardWidgetsData:{},
    questionBankAnalyticsContentDashboard:{},
    languageAnalyticsContentDashboard:{},
    jobRoleOccuranceTableData:[],
    teamMemberList:[],
    clientwithJobRoleList:[],
    scheduledBatch_CD:[],
    totalJobRoleCD:[]
  },
  reducers: {
    getClientLists: (state, { payload }) => {
      state.clientLists = payload;
    },
    getClientStatistics: (state, { payload }) => {
      state.clientStatistics = payload;
    },
    getClientSummaryList: (state, { payload }) => {
      state.clientSummaryList = payload;
    },
    getWidgetStats: (state, { payload }) => {
      state.widgetStats = payload;
    },
    getBatchStatistics: (state, { payload }) => {
      state.batchStatistics = payload;
    },
    getDashboardsData: (state, { payload }) => {
      state.dashboardsData = payload;
    },
    getOveriewTableData: (state, { payload }) => {
      state.overViewTableData = payload;
    },
    getAssessedApplicant:(state,{payload})=>{
      state.assessedApplicant=payload
    },
    
    getAssessedBatch:(state, {payload})=>{
      state.assessedBatch=payload;
    },
    getliveBatch:(state,{payload})=>{
      state.liveBatch=payload;
    },
    getJobRole:(state,{payload})=>{
      state.jobRole=payload;
    },
    getassessorOnboard:(state,{payload})=>{
      state.assessorOnboard=payload;
    },
    getAssessmentAnalyticsData:(state,{payload})=>{
      state.assessmentAnalyticsData=payload
    },
    getAssessorByLocationData:(state,{payload})=>{
      state.assessorDataByLocation=payload;
    },
    getClientWithJobRole:(state,{payload})=>{
      state.clientListWithJobRole=payload;
    },
    getScheduledBatch:(state,{payload})=>{
      state.scheduledBatch=payload;
    },
    getScheduledBatchList_ContentDashboard:(state,{payload})=>{
      state.scheduledBatch_CD=payload;
    },
    getLiveBatchLogsData:(state,{payload})=>{
      state.liveBatchLogs=payload
    },
    getSectorWiseAssessmentdata:(state,{payload})=>{
      state.sectorWiseAssessmentData=payload;
    },
    getContentDashboardWidgetsData:(state,{payload})=>{
      state.contentDashboardWidgetsData=payload
    },
    getQuestionBankAnalyticsDataContentDashboard:(state,{payload})=>{
      state.questionBankAnalyticsContentDashboard=payload;
    },
    getLanguageAnalyticsDataContentDashboard:(state,{payload})=>{
      state.languageAnalyticsContentDashboard=payload;
    },
    getJobRoleOccuranceDataContentDashboard:(state,{payload})=>{
      state.jobRoleOccuranceTableData=payload
    },
    getTeamMemberListContentDashboard:(state,{payload})=>{
      state.teamMemberList=payload;
    },
    getClientWithJobRoleContentDashboard:(state,{payload})=>{
      state.clientwithJobRoleList=payload;
    },
    getTotalJobRoleCD:(state,{payload})=>{
      state.totalJobRoleCD=payload;
    },
  },
});

export const {
  getClientLists,
  getClientStatistics,
  getClientSummaryList,
  getWidgetStats,
  getBatchStatistics,
  getDashboardsData,
  getOveriewTableData,
  getAssessedApplicant,
  getAssessedBatch,
  getliveBatch,
  getJobRole,
  getassessorOnboard,
  getAssessmentAnalyticsData,
  getAssessorByLocationData,
  getClientWithJobRole,
  getScheduledBatch,
  getLiveBatchLogsData,
  getSectorWiseAssessmentdata,
  getContentDashboardWidgetsData,
  getQuestionBankAnalyticsDataContentDashboard,
  getLanguageAnalyticsDataContentDashboard,
  getJobRoleOccuranceDataContentDashboard,
  getTeamMemberListContentDashboard,
  getClientWithJobRoleContentDashboard,
  getScheduledBatchList_ContentDashboard,
  getTotalJobRoleCD
} = dashboardSlice.actions;

export const dashboardSelector = (state) => state.admin.dashboard;
const dashboardReducer = dashboardSlice.reducer;

export default dashboardReducer;
