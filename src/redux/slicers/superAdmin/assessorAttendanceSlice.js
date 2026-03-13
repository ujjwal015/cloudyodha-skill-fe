import { createSlice } from "@reduxjs/toolkit";

const assessorAttendanceSlice = createSlice({
  name: "assessorAttendance",
  initialState: {
    assessorAttendanceList: [],
    attendanceLogBatchWise: [],
    assessorAttendanceRequest: [],
    assessorExperienceDetails: [],
    assessBasicDetails: [],
    assessorPersonalDetails: [],
    assessorEducationDetails: [],
    assessorAgreementDetails: [],
    assessorTrainingDetails: [],
    assessorBankDetails: [],
    educationDetailsNew: [],
    agreementDetails: [],
    jobrolesDetails: [],
  },
  reducers: {
    getAssessorAttendanceList: (state, { payload }) => {
      state.assessorAttendanceList = payload;
    },
    getAttendanceBatchWise: (state, { payload }) => {
      state.attendanceLogBatchWise = payload;
    },
    getAssessorAttendanceRequest: (state, { payload }) => {
      state.assessorAttendanceRequest = payload;
    },
    getExperienceDetails: (state, { payload }) => {
      state.assessorExperienceDetails = payload;
    },
    getAssessorBasicDetails: (state, { payload }) => {
      state.assessBasicDetails = payload;
    },
    getAssessorPersonalDetails: (state, { payload }) => {
      state.assessorPersonalDetails = payload;
    },
    getAssessorEducationDetails: (state, { payload }) => {
      state.assessorEducationDetails = payload;
    },
    getAssessorExperienceDetails: (state, { payload }) => {
      state.assessorExperienceDetails = payload;
    },
    getAssessorAgreementDetails: (state, { payload }) => {
      state.assessorAgreementDetails = payload;
    },
    getAssessorTrainingDetails: (state, { payload }) => {
      state.assessorTrainingDetails = payload;
    },
    getAssessorBankDetails: (state, { payload }) => {
      state.assessorBankDetails = payload;
    },
    getEducationDetails: (state, { payload }) => {
      state.educationDetailsNew = payload;
    },
    getAgreementDetails: (state, { payload }) => {
      state.agreementDetails = payload;
    },
    jobrolesDetails: (state, { payload }) => {
      state.jobrolesDetails = payload;
    },
  },
});

export const {
  getAssessorAttendanceList,
  getAttendanceBatchWise,
  getAssessorAttendanceRequest,
  getExperienceDetails,
  getAssessorBasicDetails,
  getAssessorPersonalDetails,
  getAssessorEducationDetails,
  getAssessorExperienceDetails,
  getAssessorAgreementDetails,
  getAssessorTrainingDetails,
  getAssessorBankDetails,
  getEducationDetails,
  getAgreementDetails,
  jobrolesDetails,
} = assessorAttendanceSlice.actions;

export const assessorAttendanceSelector = (state) =>
  state.superAdmin.assessorAttendance;
const assessorAttendanceReducer = assessorAttendanceSlice.reducer;

export default assessorAttendanceReducer;
