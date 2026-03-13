import { createSlice } from "@reduxjs/toolkit";

const verificationTabSlice = createSlice({
  name: "verificationTab",
  initialState: {
    verificationTabList: [],
    checkInPhoto: [],
    checkOutPhoto: [],
    examCenterPhoto: [],
    examCenterVideo: [],
    groupPhoto: [],
    aadharPhoto: [],
    theoryPhoto: [],
    theoryVideo: [],
    practicalPhoto: [],
    practicalVideo: [],
    vivaPhoto: [],
    vivaVideo: [],
    annexureN: [],
    annexureM: [],
    attendanceSheet: [],
    tpPhoto: [],
    toolPhoto: [],
    description: "",
    assessorNameList: [],
    reminderData: {},
  },
  reducers: {
    getVerificationList: (state, { payload }) => {
      state.verificationTabList = payload;
    },
    getCheckInPhotos: (state, { payload }) => {
      state.checkInPhoto = payload;
    },
    getExamCenterPhoto: (state, { payload }) => {
      state.examCenterPhoto = payload;
    },
    getExamCenterVideo: (state, { payload }) => {
      state.examCenterVideo = payload;
    },
    getCheckOutPhotos: (state, { payload }) => {
      state.checkOutPhoto = payload;
    },
    getGroupPhotos: (state, { payload }) => {
      state.groupPhoto = payload;
    },
    getAadharPhotos: (state, { payload }) => {
      state.aadharPhoto = payload;
    },
    getTheoryPhotos: (state, { payload }) => {
      state.theoryPhoto = payload;
    },
    getTheoryVideo: (state, { payload }) => {
      state.theoryVideo = payload;
    },
    getPracticalPhotos: (state, { payload }) => {
      state.practicalPhoto = payload;
    },
    getPracticalVideo: (state, { payload }) => {
      state.practicalVideo = payload;
    },
    getVivaPhotos: (state, { payload }) => {
      state.vivaPhoto = payload;
    },
    getVivaVideo: (state, { payload }) => {
      state.vivaVideo = payload;
    },
    getAnnexureNPhotos: (state, { payload }) => {
      state.annexureN = payload;
    },
    getAnnexureMPhotos: (state, { payload }) => {
      state.annexureM = payload;
    },
    getAttendanceSheet: (state, { payload }) => {
      state.attendanceSheet = payload;
    },
    getTpPhoto: (state, { payload }) => {
      state.tpPhoto = payload;
    },
    getToolPhoto: (state, { payload }) => {
      state.toolPhoto = payload;
    },
    getDescription: (state, { payload }) => {
      state.remarks = payload;
    },
    getAssessorName: (state, { payload }) => {
      state.assessorNameList = payload;
    },
    getReminderData: (state, { payload }) => {
      state.reminderData = payload;
    },
  },
});

export const {
  getVerificationList,
  getCheckInPhotos,
  getCheckOutPhotos,
  getExamCenterPhoto,
  getExamCenterVideo,
  getGroupPhotos,
  getAadharPhotos,
  getTheoryPhotos,
  getTheoryVideo,
  getPracticalPhotos,
  getPracticalVideo,
  getVivaPhotos,
  getVivaVideo,
  getAnnexureNPhotos,
  getAnnexureMPhotos,
  getTpPhoto,
  getAttendanceSheet,
  getToolPhoto,
  getDescription,
  getAssessorName,
  getReminderData,
} = verificationTabSlice.actions;

export const verificationTabSelector = (state) =>
  state.superAdmin.verificationTab;
const verificationTabReducer = verificationTabSlice.reducer;

export default verificationTabReducer;
