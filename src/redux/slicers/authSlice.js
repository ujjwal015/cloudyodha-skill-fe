import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: {},
    stateLists: [],
    cityLists: [],
    organizationLists: [],
    userLists: [],
    totalPages: 0,
    totalCount: 0,
    paginate: {},
    getQuestionBankList: [],
    getQuestionList: [],
    questionBankbyID: [],
    changeQuestionBankListStatus: {},
    changeQuestionListStatus: {},
    questionPreview: [],
    candidateResult: [],
    candidateResultPreview: {},
    assessorList: [],
    demoUser: {},
    demoUserList: [],
    demoUserFilterDropDown: [],
    schemeList: [],
    subSchemeList: [],
    renderDecider: [],
    featuresList: [],
    rolesList: [],
    editRoleAndFeature: [],
    usersList: [],
    specificAssessor: {},
    deviceLists: [],
    allStepsCompleted: [],
    allStepsCompletedStatus: false,
    acceptRejectBatchList: [],
    assessedBatchList: [],
    assessedBatch: {},
    getProfileDetails: {},
    feedbackBatchDetails: {},
    isFullscreenEnabled: false,
    isLinkValid: {},
    profileImageUrl: null,
  },
  reducers: {
    setUserInfo: (state, { payload }) => {
      state.userInfo = payload;
    },
    getStateLists: (state, { payload }) => {
      state.stateLists = payload;
    },
    getCityLists: (state, { payload }) => {
      state.cityLists = payload;
    },
    getOrganizationLists: (state, { payload }) => {
      state.organizationLists = payload;
    },
    getUserLists: (state, { payload }) => {
      state.userLists = payload;
    },
    getTotalPages: (state, { payload }) => {
      state.totalPages = payload;
    },
    getCount: (state, { payload }) => {
      state.totalCount = payload;
    },
    getPagination: (state, { payload }) => {
      state.paginate = payload;
    },
    getQuestionBankList: (state, { payload }) => {
      state.getQuestionBankList = payload;
    },
    getQuestionList: (state, { payload }) => {
      state.getQuestionList = payload;
    },
    getQuestionBankById: (state, { payload }) => {
      state.questionBankbyID = payload;
    },
    changeStatus: (state, { payload }) => {
      state.changeQuestionBankListStatus = payload;
    },
    changeStatusQuestionList: (state, { payload }) => {
      state.changeQuestionListStatus = payload;
    },
    getQuestionPreviewList: (state, { payload }) => {
      state.questionPreview = payload;
    },
    getCandidateResultList: (state, { payload }) => {
      state.candidateResult = payload;
    },
    getCandidateResultPreview: (state, { payload }) => {
      state.candidateResultPreview = payload;
    },
    getAssessorList: (state, { payload }) => {
      state.assessorList = payload;
    },
    getDemoUser: (state, { payload }) => {
      state.demoUser = payload;
    },
    getDemoUserList: (state, { payload }) => {
      state.demoUserList = payload;
    },
    getUserFilterDropDown: (state, { payload }) => {
      state.demoUserFilterDropDown = payload;
    },
    getSchemeList: (state, { payload }) => {
      state.schemeList = payload;
    },
    getSubSchemeList: (state, { payload }) => {
      state.subSchemeList = payload;
    },
    getRenderDecider: (state, { payload }) => {
      state.renderDecider = payload;
    },
    getFeatures: (state, { payload }) => {
      state.featuresList = payload;
    },
    getRolesList: (state, { payload }) => {
      state.rolesList = payload;
    },
    getRoleAndFeature: (state, { payload }) => {
      state.editRoleAndFeature = payload;
    },
    getUsersList: (state, { payload }) => {
      state.usersList = payload;
    },

    getSpecificAssessor: (state, { payload }) => {
      state.specificAssessor = payload;
    },
    getDeviceLists: (state, { payload }) => {
      state.deviceLists = payload;
    },
    getAllStepCompleted: (state, { payload }) => {
      state.allStepsCompleted = payload;
    },
    getAllStepCompletedStatus: (state, { payload }) => {
      state.allStepsCompletedStatus = payload;
    },
    getBatchAcceptRejectList: (state, { payload }) => {
      state.acceptRejectBatchList = payload;
    },
    getAssessedBatchList: (state, { payload }) => {
      state.assessedBatchList = payload;
    },
    getAssessedBatch: (state, { payload }) => {
      state.assessedBatch = payload;
    },
    getProfileInfo: (state, { payload }) => {
      state.getProfileDetails = payload;
    },
    getFeedbackBatchDetails: (state, { payload }) => {
      state.feedbackBatchDetails = payload;
    },
    getIsFullScreenEnabled: (state, { payload }) => {
      state.isFullscreenEnabled = payload;
    },
    getIsLinkValid: (state, { payload }) => {
      state.isLinkValid = payload;
    },
    getProfileImageUrl: (state, { payload }) => {
      state.profileImageUrl = payload;
    },
  },
});

export const {
  setUserInfo,
  getStateLists,
  getCityLists,
  getOrganizationLists,
  getUserLists,
  getTotalPages,
  getCount,
  getPagination,
  getQuestionBankList,
  getQuestionList,
  getQuestionBankById,
  changeStatus,
  changeStatusQuestionList,
  getQuestionPreviewList,
  getCandidateResultList,
  getCandidateResultPreview,
  getAssessorList,
  getDemoUser,
  getDemoUserList,
  getUserFilterDropDown,
  getSchemeList,
  getSubSchemeList,
  getRenderDecider,
  getFeatures,
  getRolesList,
  getRoleAndFeature,
  getUsersList,
  getSpecificAssessor,
  getDeviceLists,
  getAllStepCompleted,
  getAllStepCompletedStatus,
  getBatchAcceptRejectList,
  getAssessedBatchList,
  getAssessedBatch,
  getProfileInfo,
  getFeedbackBatchDetails,
  getIsFullScreenEnabled,
  getIsLinkValid,
  getProfileImageUrl,
} = authSlice.actions;

export const authSelector = (state) => state.auth;
const authReducer = authSlice.reducer;
export default authReducer;
