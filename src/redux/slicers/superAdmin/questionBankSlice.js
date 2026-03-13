import { createSlice } from "@reduxjs/toolkit";

const qbManagementSlice = createSlice({
  name: "qbManagement",
  initialState: {
    qbFormList: [],
    nosTheoryList: [],
    nosVivaList: [],
    nosList: [],
    specificNosDetails: {},
    allQuestions: [],
    sectionWiseNos: [],
    practicalQuestionDetails: [],
    vivaQuestionDetails: [],
    questionsLength:{},
    jobRoleListForFilter: [],
  },
  reducers: {
    getQbFormList: (state, { payload }) => {
      state.qbFormList = payload;
    },
    getNosTheoryList: (state, { payload }) => {
      state.nosTheoryList = payload;
    },
    getNosVivaList: (state, { payload }) => {
      state.nosVivaList = payload;
    },
    getNosList: (state, { payload }) => {
      state.nosList = payload;
    },
    getSectionWiseNosList: (state, { payload }) => {
      state.sectionWiseNos = payload;
    },
    getSpecificNosDetails: (state, { payload }) => {
      state.specificNosDetails = payload;
    },
    getAllQuestions: (state, { payload }) => {
      state.allQuestions = payload;
    },
    getPracticalQuestionDetails: (state, { payload }) => {
      state.practicalQuestionDetails = payload;
    },
    getVivaQuestionDetails: (state, { payload }) => {
      state.vivaQuestionDetails = payload;
    },
    getQuestionsLength:(state,{payload})=>{
      state.questionsLength=payload;
    },
    getjobRoleListForFilter: (state, { payload }) => {
      state.jobRoleListForFilter = payload;
    },
  },
});

export const {
  getQbFormList,
  getNosTheoryList,
  getNosVivaList,
  getNosList,
  getSpecificNosDetails,
  getAllQuestions,
  getSectionWiseNosList,
  getPracticalQuestionDetails,
  getVivaQuestionDetails,
  getQuestionsLength,
  getjobRoleListForFilter,
} = qbManagementSlice.actions;

export const qbManagementSelector = (state) => state.superAdmin.qbManagement;
const qbManagementReducer = qbManagementSlice.reducer;

export default qbManagementReducer;
