import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
  name: "student",
  initialState: {
    navPath: null,
    startTime: "",
    questionAll: [],
    question: {},
    questionStats: {},
    resumeTimer: "2:0:0",
    newResumeTimer: 10000,
    humanFaceDetection: [],
    studentBrowserInfo: {},
    lastQuestionId: "",
    updatedQuestionStats: {},
    layoutColor: {
      bgColor: "",
      textColor: "",
    },
    fontSizes: {
      title: 14,
      subtitle: 13,
      content: 12,
    },
  },
  reducers: {
    navigatePath: (state, { payload }) => {
      state.navPath = payload;
    },
    getStartTime: (state, { payload }) => {
      state.startTime = payload;
    },
    getAssessment: (state, { payload }) => {
      state.questionAll = payload;
    },
    getQuestion: (state, { payload }) => {
      state.question = payload;
    },
    getQuestionStats: (state, { payload }) => {
      state.questionStats = payload;
    },
    updateResumeTimer: (state, { payload }) => {
      state.resumeTimer = payload;
    },
    updateResumeNewTimer: (state, { payload }) => {
      state.newResumeTimer = payload;
    },
    detectHumanFace: (state, { payload }) => {
      state.humanFaceDetection = payload;
    },
    getStudentBrowserInfo: (state, { payload }) => {
      state.studentBrowserInfo = payload;
    },
    getLastQuestionId: (state, { payload }) => {
      state.lastQuestionId = payload;
    },
    getUpdatedStats: (state, { payload }) => {
      state.updatedQuestionStats = payload;
    },
    setLayoutBackgroundColor: (state, { payload }) => {
      state.layoutColor = payload;
    },
    setLayoutFontSize: (state, { payload }) => {
      state.layoutFontSize = payload;
    },
    setTitleFontSize: (state, { payload }) => {
      state.fontSizes.title = payload;
    },
    setSubtitleFontSize: (state, { payload }) => {
      state.fontSizes.subtitle = payload;
    },
    setContentFontSize: (state, { payload }) => {
      state.fontSizes.content = payload;
    },
    resetFontSizes: (state) => {
      state.fontSizes = { title: 14, subtitle: 13, content: 12 };
    },
    getSecondoryLanguage: (state,{payload}) => {
      state.signleQuestionSecondoryLanguage=payload;
    },
    getCandidateResultSummary: (state, { payload }) => {
      state.candidateResultSummary = payload;
    },
    suspiciousActivityLeft: (state, { payload }) => {
      state.suspiciousActivityLeft = payload;
    },
  },
});

export const {
  navigatePath,
  getAssessment,
  getQuestion,
  getQuestionStats,
  getStartTime,
  updateResumeTimer,
  detectHumanFace,
  getStudentBrowserInfo,
  getLastQuestionId,
  getUpdatedStats,
  updateResumeNewTimer,
  setLayoutBackgroundColor,
  setLayoutFontSize,
  setTitleFontSize,
  setSubtitleFontSize,
  setContentFontSize,
  resetFontSizes,
  getCandidateResultSummary,
  suspiciousActivityLeft,
  getSecondoryLanguage
} = studentSlice.actions;

export const studentSelector = (state) => state.student;
const studentReducer = studentSlice.reducer;
export default studentReducer;
