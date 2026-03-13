import { createSlice } from "@reduxjs/toolkit";

const examManagementSlice = createSlice({
  name: "examManagement",
  initialState: {
    examManagementList: [],
    examCenterList: [],
    singleBatch: {},
    assessmentOptions: [],
    examManagementbatchList: [],
    assessmentStatsByBatch: {},
    schemeList: [],
    subSchemeList: [],
    examCenterNameList: [],
    jobRoleList: [],
    jobRoleList2: [],
    proctorList: [],
    assessorList: [],
    bankQBcodeList: [],
    assignBatchList: [],
    candiateByBatch: [],
    sectionTableList:[],
    chooseInstructions: [],
    qbCodeList: [],
    singleCandiateData: {},
    exportCandaiteList: [],
    jobRoleLevel: [],
    jobRoleVersion: [],
    jobRoleNOS: [],
    allJobRoleData: [],
    secondaryLanguage: "",
    isMultiLanguageEnabled: false,
    clientSpecificJobRole: [],
  },
  reducers: {
    getExamManagementList: (state, { payload }) => {
      state.examManagementList = payload;
    },
    getExamCenterList: (state, { payload }) => {
      state.examCenterList = payload;
    },
    getSingleBatch: (state, { payload }) => {
      state.singleBatch = payload;
    },
    getAssessmentOptions: (state, { payload }) => {
      state.assessmentOptions = payload;
    },
    getExamManagementBatchList: (state, { payload }) => {
      state.examManagementbatchList = payload;
    },
    getAssessmentStatsByBatch: (state, { payload }) => {
      state.assessmentStatsByBatch = payload;
    },
    getSchemeList: (state, { payload }) => {
      state.schemeList = payload;
    },
    getSubSchemeList: (state, { payload }) => {
      state.subSchemeList = payload;
    },
    getExamCenterNameList: (state, { payload }) => {
      state.examCenterNameList = payload;
    },
    getJobRoleList: (state, { payload }) => {
      state.jobRoleList = payload.jobData;
      state.qbCodeList = payload.qpCode;
      state.allJobRoleData = payload.allJobRoleData;
      state.jobRoleList2 = payload.jobData2;
    },
    getProctorList: (state, { payload }) => {
      state.proctorList = payload;
    },
    getAssessorList: (state, { payload }) => {
      state.assessorList = payload;
    },
    getBankQBcodeList: (state, { payload }) => {
      state.bankQBcodeList = payload;
    },
    getAssignBatchList: (state, { payload }) => {
      state.assignBatchList = payload;
    },
    getCandiateByBatch: (state, { payload }) => {
      state.candiateByBatch = payload;
    },
    getSectionTableList: (state, { payload }) => {
      state.sectionTableList = payload;
    },
    getInstuctionList: (state, { payload }) => {
      state.chooseInstructions = payload;
    },
    getSingleCandiateData: (state, { payload }) => {
      state.singleCandiateData = payload;
    },
    getExportCandaiteList: (state, { payload }) => {
      state.exportCandaiteList = payload;
    },
    getSecondaryLanguage: (state, { payload }) => {
      state.secondaryLanguage = payload;
    },

    getJobRoleLevelVersion: (state, { payload }) => {
      const { levelOptions } = payload;
      state.jobRoleLevel = levelOptions;
    },
    getJobRoleVersion: (state, { payload }) => {
      const { versionOptions } = payload;
      state.jobRoleVersion = versionOptions;
    },
    getJobRoleNOS: (state, { payload }) => {
      const { jobRoleNOS, levelOptions } = payload;
      state.jobRoleNOS = jobRoleNOS;
      state.jobRoleLevel = levelOptions;
    },
    getIsMultiLanguageEnabled: (state, { payload }) => {
      state.isMultiLanguageEnabled = payload;
    },
    getClientSpecificJobRole: (state, { payload }) => {
      state.clientSpecificJobRole = payload;
    },
  },
});

export const {
  getExamManagementList,
  getExamCenterList,
  getSingleBatch,
  getAssessorList,
  getAssessmentOptions,
  getExamManagementBatchList,
  getAssessmentStatsByBatch,
  getSubSchemeList,
  getExamCenterNameList,
  getSchemeList,
  getJobRoleList,
  getProctorList,
  getBankQBcodeList,
  getAssignBatchList,
  getCandiateByBatch,
  getSectionTableList,
  getInstuctionList,
  getSingleCandiateData,
  getExportCandaiteList,
  getJobRoleLevelVersion,
  getSecondaryLanguage,
  getJobRoleVersion,
  getJobRoleNOS,
  getIsMultiLanguageEnabled,
  getClientSpecificJobRole,
} = examManagementSlice.actions;

export const examManagementSelector = (state) => state.superAdmin.examManagement;
const examManagementReducer = examManagementSlice.reducer;

export default examManagementReducer;
