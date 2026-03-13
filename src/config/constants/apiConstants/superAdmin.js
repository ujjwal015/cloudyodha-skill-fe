// Decide Render
export const DECIDE_RENDER_API = "api/decide-render";

//dashboard
export const UPDATE_LAYOUT_CHANGE = "api/updateUserDashboard";

export const GET_DASHBOARD_GRID_STYLE_API = "api/get-dashboard-style";
export const SET_DASHBOARD_GRID_STYLE_API = "api/set-dashboard-style";
export const GET_ADMIN_DASHBOARD_BASIC_DETAILS_API =
  "api/admin-dashboard-basic-details";
export const POST_UPCOMING_ASSESSMENT_API = "api/upcoming-assignment";
export const GET_ASSESSMENT_STATISTICS_API = "api/assessment-statistics";
export const GET_ACTIVE_CLIENT_STATISTICS_API = "api/active-client-statistics";
export const GET_DASHBOARD_NOTIFICATION_API = "api/dashboard-notification";

export const STATUS_API = "api/status";
export const SUB_ADMIN_STATUS_CHANGE_API = "api/changeclientstatus";
export const CREATE_CLIENT_MANAGEMENT_PROFILE_API = "api/client";
export const GET_ALL_SUB_ADMIN_PROFILE_API = "api/getAllSubadminProfile";
export const GET_ALL_CLIENT_PROFILE_API = "api/getallclients";
export const GET_SPECIFIC_CLIENT_API = "api/getoneclient";
export const UPDATE_SPECIFIC_CLIENT_API = "api/updateclient";
export const DELETE_SPECIFIC_CLIENT_API = "api/deleteclient";
export const BULK_UPLOAD_ADMIN_API = "api/bulkuploadAdminProfile";
export const DOWNLOAD_SAMPLE_ADMIN_API = "api/downloadclientsamplefile";
export const GET_ALL_USERS_LIST_API = "api/getAllUserProfile";
export const CREATE_QUESTIONBANK_FORM_API = "api/createQuestion";
export const CREATE_QUESTIONBANK_SECTION_API = "api/create-section";
export const GET_QUESTION_BANK_LIST_API = "api/questionbank-list";
export const PUT_DASHBOARD_SCHEDULE_MEETING_API = "api/schedule-meeting";
export const CHANGE_QUESTION_BANK_LIST_STATUS_API =
  "api/change-questionbank-status";
export const GET_QUESTION_LIST_API = "api/section-list";
export const CHANGE_QUESTION_LIST_STATUS_API = "api/change-section-status";
export const GET_QUESTION_PREVIEW_API = "api/question-by-section";
export const TOUR_API = "api/admin-routes/tour";
export const BULK_UPLOAD_CLIENT_API = "api/bulkuploadclients";
export const ASSIGNED_CLIENT_LIST_API = "api/getAllClientsList";

export const QUESTION_BANK_FILTER_BY_ID_API = "api/questionbank-edit-detail";
export const QUESTION_BANK_FILTER_NEW_API = "api/questionbank-filter";
export const QUESTION_BANK_SECTION_FILTER_API = "api/section-list";
export const CREATE_QUESTION_FINAL_API = "api/create-question";
export const BULK_UPLOAD_QUESTIONS_API = "api/bulkuploadqb";
export const DOWNLOAD_SAMPLE_QUESTIONS_API = "api/download-question-samplefile";
export const GET_CANDIDATE_RESULT_API = "api/candidate-reportlist";
export const GET_CANDIDATE_RESULT_PREVIEW_API = "api/candidate-reportDetails";
export const UPLOAD_OPTION_IMAGE_S3_API = "api/upload-questionOptions";
export const DOWNLOAD_SAMPLE_CANDIDATE_BULK_UPLOAD_API =
  "api/download-candidate-bulk-upload-file";

export const UPLOAD_BULK_CANDIDATE_IN_BATCH_API = "api/uploadBulkCandidate";
export const UPDATE_CANDIDATE_STATUS_API = "api/changeCandidateStatus";
export const UPDATE_MULTIPLE_CANDIDATE_STATUS_API =
  "api/changeMultipleCandidateStatus";
export const GET_EXPORT_DATA_API = "api/candidateListExport";
export const GET_CANDIDATE_EXPORT_DATA_API = "api/candidateListExportPDF";
export const BDA_JOB_ROLE_SECTOR_LIST_API = "api/get-sector-list";


// As per new Flow Question Bank APIs

export const CREATE_QUESTION_FORM_API = "api/createQuestion";
export const QUESTION_FORM_LIST_API = "api/questionbank-list";
export const NOS_LIST_API = "api/nos-List";
export const SECTION_WISE_NOS_LIST_API = "api/noslistBySection";
export const QUESTION_FORM_STATUS_CHANGE_API = "api/change-questionbank-status";
export const GET_SINGLE_QUESTION_FORM_API = "api/questionbankId-detail";
export const UPDATE_SINGLE_QB_FORM_API = "api/update-questionBank-list";
export const DELETE_QB_FORM_API = "api/removeQuestionbank-list";
export const VIEW_ALL_QUESTIONS_API = "api/getQuestionBy-questionbankId";
export const UPDATE_QUESTION_API = "api/update-question-details";

//assessment
export const GET_ASSESSMENT_LIST_API = "api/assesment-list";
export const GET_PREVIEW_ASSESSMENT_LIST_API = "api/preview-assesment-list";
export const CREATE_ASSESSMENT_API = "api/create-assesment";
export const UPDATE_ASSESSMENT_API = "api/update-assessment";
export const CREATE_FINAL_ASSESSMENT_API = "api/final-assessment-create";
export const GET_JOBROLE_BASED_QUESTION_BANK_LIST_API =
  "api/questionbank-list?jobRole=";
export const SELECT_ASSESSMENT_QUESTION_API = "api/select-assesment-question";
export const GET_ASSESSMENT_QUESTION_PREVIEW_API = "api/get-questionByQBankId";
export const GET_PREVIEW_ASSESSMENT_API = "api/preview-assessment";
export const GET_JOBROLE_LIST_API = "api/questionbank-list";
export const REMOVE_QUESTION_ASSESSMENT_API = "api/remove-question-assessment";
export const DELETE_ASSESSMENT_API = "api/delete-assessment";
export const GET_ASSESSMENT_PREVIEW_BY_ID = "api/get-set-by-id";

// Exam Management
export const EXAM_MANAGEMENT_LIST_API = "api/getallexamcenters";
export const EXAM_MANAGEMENT_LIST_STATUS_API = "api/examcenterstatus";
export const EXAM_MANAGEMENT_DELETE_LIST_API = "api/removeexamcenter";
export const GET_SINGLE_EXAM_CENTER_API = "api/getexamcenterbyid";
export const CREATE_EXAM_CENTER_API = "api/createexamcenter";
export const GET_TRAINING_PARTNER_API = "api/gettrainingpartnername";
export const EXAM_CENTER_LIST_API = "api/getallexamcenters";
export const DELETE_EXAM_CENTER_API = "api/removeexamcenter";
export const EDIT_EXAM_CENTER_API = "api/updateexamcenter";
export const GET_ASSESSMENT_NAME_API = "api/get-assessmentName";
export const CREATE_BATCH_API = "api/createbatch";
export const UPDATE_BATCH_API = "api/update-batch";
export const EDIT_BATCH_API = "api/updatebatch";
export const SINGLE_BATCH_API = "api/single-batch";
export const GET_CANDIDATE_PASSWORD_API = "api/getRawPassword";
export const CANDIDATE_RESET_PASSWORD_API = "api/candidatePasswordReset";
export const INCREASE_EXAM_TIME_API = "api/increaseExamTime";
export const GET_MULTI_LANGUAGE_DECIDER_API = "api/multi-lang-decider";
export const CREATE_TRAINING_PARTNER_API = "api/create-training-partner";

//batch options api endpoints
export const BATCH_SCHEME_LIST_API = "api/scheme-list-batch";
export const BATCH_SUB_SCHME_LIST_API = "api/sub-scheme-list-batch";
export const BATCH_PROCTOR_LIST_API = "api/proctor-list-batch";
export const BATCH_JOB_ROLE_LIST_API = "api/job-role-list-batch";
export const BATCH_ACCESSOR_LIST_API = "api/assessor-list-batch";
export const GET_ALL_BATCH_LIST_API = "api//total-batch-list";

export const BATCH_QUESTION_BANK_LIST_API = "api/question-bank-list-batch";
export const BATCH_EXAM_CENTER_LIST_API = "api/getAllExamCenterList";
export const BATCH_INSTRUCTION_LIST_API = "api/choose-instruction-batch";
export const CANDIDATE_LIST_API = "api/getCandiateByBatch";
export const CANDIDATE_ACTIVITY_LIST_API = "api/candidateActivityByBatch";

export const GET_BATCH_QUESTION_BANK_OPTIONS_API = "api/assessor-list-batch";
export const GET_ASSESSMENT_OPTIONS_API = "api/assesment-list";
export const EXAM_CENTRE_DOWNLOAD_SAMPLE_ADMIN_API =
  "api/download-sampleFile-tp-tc";
export const EXAM_CENTRE_BULK_UPLOAD_API = "api/bulkupload-tp-tc";
export const GET_BATCH_LIST_API = "api/batch-list";
export const GET_BATCH_LIST_API_ASSIGNMENT =
  "api/get-asignCandidate-batch-list";
export const GET_BATCH_LIST_API_V2 = "api/batch-list-v2";
export const DELETE_BATCH_LIST_API = "api/remove-batch";
export const EDIT_BATCH_LIST_API = "api/batch-status";
export const GET_ASSESSMENT_STATS_BY_BATCH_API = "api/assesmentStatsByBatchId";

//assign batch api endpoints
export const GET_ASSIGN_BATCH_LIST_API = "api/batchlist2";
export const PUT_ASSIGN_BATCH_API = "api/add-assignBatch";
export const GET_CANDIDATE_BY_ASSIGN_BATCH_API = "api/getCandiateByBatch";
export const PUT_CANDIDATE_BY_ASSIGN_BATCH_API = "api/updateCandidate";
export const PUT_CANDIDATE_PASSWORD_RESET_BY_BATCH_API =
  "api/candidatePasswordReset";
export const GET_CANDIDATE_BY_ID = "api/getCandidateById";
export const GET_RAW_PASSWORD_BY_BATCH_API = "api/getRawPassword";
export const POST_BULK_CANDIDATE_ASSIGN_BATCH_API = "api/uploadBulkCandidate";
export const GET_ALL_Assign_BATCH_LIST_API =
  "api/get-asignCandidate-allExport-list";

export const DOWNLOAD_ATTENDANCE_SHEET_API = "api/download-attendance-pdf";
export const DOWNLOAD_RESULT_SHEET_API = "api/download-result-pdf";

// edit and delete questionBankForm endpoints
export const EDIT_QUESTION_BANK_FORM_API = "api/update-questionBank-list";
export const DELETE_QUESTION_BANK_FORM_API = "api/removeQuestionbank-list";
export const DELETE_QUESTION_SECTION_API = "api/remove-section";
export const GET_SECTION_DETAILS_BY_ID_API = "api/getEditSection-list";
export const EDIT_SECTION_DETAILS_API = "api/update-section";
export const GET_PARTICULAR_QUESTION_DETAILS_API = "api/getQuestion-detail";
export const UPDATE_PARTICULAR_QUESTION_DETAILS_API = "api/update-question";
export const DELETE_PARTICULAR_QUESTION_DETAILS_API = "api/remove-questionbank";

// create assessor
export const CREATE_ASSESSOR_FORM_API = "api/add-assessor";
// export const GET_ASSESSOR_LIST_API = "api/get-assessorList";
export const GET_ASSESSOR_LIST_API = "api/get-assessorAdminList";
export const GET_SINGLE_ASSESSOR_DETAILS_API = "api/get-assessorListById";
export const EDIT_ASSESSOR_DETAILS_API = "api/update-assessor";
export const DELETE_ASSESSOR_FORM_API = "api/remove-assessor";
export const UPDATE_STATUS_SINGLE_ASSESSOR_API = "api/assessor-status";
export const UPLOAD_FILES_S3_API = "api/upload-file";
export const CHANGE_STATUS_ASSESSOR_API = "api/assessor-status";
export const UNLOCK_ASSESSOR_ACCOUNT_API = "api/assessor-unlock-account";
export const UNLOCK_ASSESSOR_OTP_LOCKOUT_API = "api/unlock-otp-lockout";
export const GET_BULK_UPLOAD_ASSESSOR_API = "api/assessor-bulk-sample-download";
export const POST_BULK_UPLOAD_ASSESSOR_API = "api/bulk-upload-assessor";

// Utkarsh changes

export const POST_ASSESSOR_PERSONAL_DETAILS_API =
  "api/add-assessorPersonalDetail";

// New Design and Flow of Assessor Onboarding ->
export const CREATE_BASICINFO_ASSESSOR_API = "api/add-assessorBasicDetails";
export const GET_BASICINFO_ASSESSOR_API = "api/getAssesor-profileList";
export const UPDATE_BASICINFO_ASSESSOR_API = "api/update-assessorBasicDetails";

// Personal Details
export const GET_ASSESSOR_PERSONAL_DETAILS_API =
  "api/getAssesor-personalDetailList";
export const UPDATE_ASSESSOR_PERSONAL_DETAILS_API =
  "api/update-assessorPersonalDetail";
export const DELETE_ASSESSOR_PERSONAL_DETAILS_API =
  "api/deleteAssesor-personalDetailList";

// Experience Documents
export const UPLOAD_EXPERIENCE_ASSESSOR_API = "api/add-assessorExperience";
export const GET_EXPERIENCE_ASSESSOR_API = "api/getAssesor-experienceList";
export const UPDATE_EXPERIENCE_ASSESSOR_API = "api/update-assessorExperience";
export const DELETE_EXPERIENCE_ASSESSOR_API =
  "api/deleteAssesor-experienceList";
// Education Documents
export const UPLOAD_EDUCATION_ASSESSOR_API = "api/add-assessorEducation";
export const GET_EDUCATION_ASSESSOR_API = "api/getAssesor-educationList";
export const UPDATE_EDUCATION_ASSESSOR_API = "api/update-assessorEducation";
export const DELETE_EDUCATION_ASSESSOR_API =
  "api/deleteAssesor-educationDetail";
// Agreement Documents
export const UPLOAD_AGREEMENT_ASSESSOR_API = "api/add-assessorAgreement";
export const GET_AGREEMENT_ASSESSOR_API = "api/getAssesor-agreementList";
export const UPDATE_AGREEMENT_ASSESSOR_API = "api/update-assessorAgreement";
export const DELETE_AGREEMENT_ASSESSOR_API = "api/deleteAssesor-agreementList";

// JobRole Documents
export const UPLOAD_JOBROLE_ASSESSOR_API = "api/add-assessorJobrole";
export const GET_JOBROLE_ASSESSOR_API = "api/getAssesor-jobRoleDetailList";
export const UPDATE_JOBROLE_ASSESSOR_API = "api/update-assessorJobrole";
export const DELETE_JOBROLE_ASSESSOR_API = "api/deleteAssesor-jobRoleList";

// Assessor Bank Details
export const UPLOAD_BANKDETAILS_ASSESSOR_API = "api/update-assessorBankDetails";
export const UPDATE_BANKDETAILS_ASSESSOR_API = "api/update-assessorBankDetails";
export const DELETE_BANKDETAILS_ASSESSOR_API = "api/deleteAssesor-bankDetail";
export const GET_BANKDETAILS_ASSESSOR_API = "api/getAssesor-BankDetailList";

// Assessor Attendance List API routes

export const GET_ASSESSOR_ATTENDANCE_LIST_API = "api/get-assessorAdminList";
// export const GET_ASSESSOR_ATTENDANCE_LIST_API = "api/get-assessorAssignToBatchList";
export const GET_SINGLE_ASSESSOR_BATCH_WISE_ATTENDANCE_LIST_API =
  "api/assesor-attendance-list";
export const GET_ASSESSOR_ATTENDANCE_REQUEST_LIST_API =
  "api/assesor-attendanceRegularize-requestList";
export const UPDATE_ASSESSOR_ATTENDANCE_REQUEST_API =
  "api/assesor-attendanceRegularize-requestApprove";

// Scheme Management
export const CREATE_SCHEME_MANAGEMENT_API = "api/registerScheme";
export const GET_SCHEME_MANAGEMENT_API = "api/getScheme";
export const EDIT_SINGLE_SCHEME_MANAGEMENT_API = "api/getSchemeById";
export const UPDATE_SINGLE_SCHEME_MANAGEMENT_API = "api/updateSchemeById";
export const DELETE_SINGLE_SCHEME_MANAGEMENT_API = "api/removeSchemeById";
export const CHANGE_STATUS_SINGLE_SCHEME_MANAGEMENT_API =
  "api/changeScheme-status";

// sub scheme management
export const CREATE_SUB_SCHEME_MANAGEMENT_API = "api/add-sub-scheme";
export const GET_SUB_SCHEME_MANAGEMENT_LIST_API = "api/sub-scheme-list";
export const EDIT_SINGLE_SUB_SCHEME_MANAGEMENT_API =
  "api/get-single-sub-scheme";
export const UPDATE_SINGLE_SUB_SCHEME_MANAGEMENT_API = "api/update-sub-scheme";
export const DELETE_SINGLE_SUB_SCHEME_MANAGEMENT_API = "api/delete-sub-scheme";
export const CHANGE_STATUS_SINGLE_SUB_SCHEME_MANAGEMENT_API =
  "api/change-sub-scheme-status";

// Job Role
export const BDA_JOB_ROLE_CREATE_API = "api/add-jobRole";
export const BDA_GET_ALL_JOB_ROLES_API = "api/jobRole-list";
export const BDA_GET_ALL_JOB_ROLES_LIST_API = "api/sector-details-list";
export const NCEVT_CLIENT_BASED_JOBROLE = "api/getAllClientsList"; //"api/clientJobrole-adminDashboard";
export const BDA_DELETE_JOB_ROLE_API = "api/delete-jobRole";
export const BDA_CHANGE_STATUS_JOB_ROLE_API = "api/change-jobRole-status";
export const BDA_GET_SPECIFIC_JOB_ROLE_API = "api/get-single-jobRole";
export const BDA_UPDATE_JOB_ROLE_API = "api/update-jobRole";

// lead management
export const GET_LEAD_MANAGEMENT_LIST_API = "api/getdemouser";
export const GET_LEAD_MANAGEMENT_FILTER_API = "api/getdemoList";
export const CHANGE_SINGLE_DEMO_USER_STATUS_API = "api/demo-users-status";
export const CHANGE_SINGLE_DEMO_USER_REMARKS_API = "api/createRemark";
export const DELETE_SINGLE_DEMO_USER_API = "api/remove-userdemoById";
export const FILTER_DEMO_USER_API = "api/getorganisation-name";

// user management
export const CREATE_USER_MANAGEMENT_ROLES_API = "api/createuserrole";
export const GET_USER_MANAGEMENT_ROLES_LIST_API = "api/getuserroles";
export const GET_USER_MANAGEMENT_FEATURES_API = "api/getfeatures";
export const GET_USER_MANAGEMENT_SINGLE_ROLE_API = "api/edituserrolepage";
export const GET_USER_MANAGEMENT_UPDATE_ROLE_API = "api/edituserrole";
export const DELETE_USER_MANAGEMENT_ROLE_API = "api/deleteuserrole";
export const GET_USER_MANAGEMENT_USERS_LIST_API = "api/getusers";
export const CREATE_USER_MANAGEMENT_USERS_API = "api/createuser";
export const CHANGE_STATUS_USER_MANAGEMENT_API = "api/changeuserstatus";
export const UNLOCK_USER_ACCOUNT_API = "api/user-unlock-account";
export const GET_USER_MANAGEMENT_SINGLE_USER_API = "api/getoneuser2";
export const UPDATE_USER_MANAGEMENT_SINGLE_USER_API = "api/updateuser";
export const GET_USER_MANAGEMENT_DELETE_USERS_API = "api/deleteuser";

// instruction management
export const GET_INSTRUCTION_LIST_API = "api/get-instruction";
export const CREATE_INSTRUCTION_API = "api/add-instruction";
export const DELETE_SINGLE_INSTRUCTION_API = "api/remove-instruction";
// export const GET_SINGLE_INSTRUCTION_API = "api/get-instructionById";
export const GET_SINGLE_INSTRUCTION_API = "api/get-instructionListById";
export const UPDATE_SINGLE_INSTRUCTION_API = "api/update-instruction";
export const CHANGE_SINGLE_INSTRUCTION_STATUS_API = "api/change-status";
// NOS Management
export const DOWNLOAD_SAMPLE_NOS_PRACTICAL_API =
  "api/download-nos-viva-samplefile";
export const DOWNLOAD_SAMPLE_NOS_THEORY_API =
  "api/download-nos-theory-samplefile";
export const UPLOAD_NOS_PRACTICAL_API = "api/bulkupload-viva-nos";
export const UPLOAD_NOS_THEORY_API = "api/bulkupload-theory-nos";
export const NOS_LIST_THEORY_API = "api/nos-theory-List";
export const NOS_LIST_VIVA_API = "api/nos-viva-List";
export const NOS_LIST_ALL_API = "api/allnos-List";
export const SPECIFIC_NOS_DETAILS_API = "api/get-nosById";
export const DELETE_NOS_API = "api/nos-removeById";

// Ajay End Points
export const NOS_THEORY_LIST_API = "api/nos-theory-List";
export const NOS_VIVA_LIST_API = "api/nos-viva-List";

// Proctor Management
export const CREATE_PROCTOR_PROFILE_API = "api/add-proctor";
export const GET_PROCTOR_LIST_API = "api/get-proctor-List";
export const GET_SPECIFIC_PROCTOR_API = "api/get-proctorListById";
export const UPDATE_PROCTOR_PROFILE_API = "api/update-proctor";
export const DELETE_PROCTOR_PROFILE_API = "api/remove-proctor";
export const UPDATE_PROCTOR_STATUS_API = "api/proctor-status";
export const BULK_UPLOAD_PROCTORS_API = "api/bulk-upload-proctor";
export const GET_BULK_UPLOAD_SAMPLE_PROCTOR_API =
  "api/proctor-bulk-sample-download";

// MIS [ Results ]
export const GET_BATCH_RESULTS_API = "api/resultBatchList";
export const GET_ONLINE_RESULT_BATCH_RESULTS_API =
  "api/online-result-batchList";
export const GET_CANDIDATES_RESULTS_BY_BATCH_API =
  "api/getCandiateResultByBatch";
export const GET_FAILED_CANDIDATES_RESULT_BY_BATCH_API =
  "api/candidate-list-failed"; // /6621ec4d4c61900a3237147f
export const REGENERATE_RESULT_BY_BATCH = "api/admin-first-console";
export const GET_SPECIFIC_CANDIDATE_RESULT_API = "api/singleCandidateResult";
export const GET_SPECIFIC_CANDIDATE_FEEDBACK_API = "api/getFeedback";
export const GET_NOS_WISE_RESULTS_API = "api/getCandiateNosWiseResultByBatch";
export const GET_OFFLINE_BATCH_LIST_API = "api/resultBatchListOffline";
export const GET_OFFLINE_BATCH_DETAILS_API =
  "api/getCandiateResultByBatchOffline";
export const GET_CANDIDATE_LIST_WITH_QUESTIONS =
  "api/getCandidateListWithQuestion"; //  /668d1e9b6b45c8f614268177'
export const UPLOAD_CANDIDATE_OMR_SHEET = "api/uploadOfflineOMR"; // /668d1e9b6b45c8f614268177'
export const UPLOAD_OFFLINE_RESULT_API = "api/offlineResultUpload";
export const UPLOAD_ONLINE_RESULT_API = "api/onlineResultUpload";
export const GET_PORTAL_STATS_SINGLE_CANDIDATE_OFFLINE =
  "api/offlinePortalStats"; ///66979df24bf7f11b15d333cc'
export const GET_SINGLE_CANDIDATE_RESULT_OFFLINE_API =
  "api/singleCandidateResultOffline";
export const DOWNLOAD_ONLINE_RESULTS_SAMPLE_API =
  "api/downloadExcelOnlineByBatch";
export const DOWNLOAD_OFFLINE_RESULTS_SAMPLE_API =
  "api/downloadExcelOfflineByBatch";
export const GET_SINGLE_CANDIDATE_RESULT_ONLINE_API =
  "api/singleCandidateResultOnline";
export const GET_CANDIDATE_ANSWERED_QUESTION_DETAILS_API = "api/singleQuestion";
export const UPDATE_CANDIDATE_RESULT_QUESTION_API = "api/saveSingleQuestion";
export const DOWNLOAD_ONLINE_RESULTS_API =
  "api/downloadExcelOnlineByBatchWithMarks";
export const DOWNLOAD_OFFLINE_RESULTS_API =
  "api/downloadExcelOfflineByBatchWithMarks";
export const DOWNLOAD_ONLINE_RESULTS_WITH_OPTION_API =
  "api/download-excel-single-with-correct-option";
export const DOWNLOAD_ONLINE_RESULT_WITH_CANDIDATE_DATA_API =
  "api/downloadExcelOnlineBatch";
export const DOWNLOAD_BATCH_RESULTS_ZIP_API =
  "api/download-excel-batch-with-correct-option";
export const DOWNLOAD_BATCH_ATTENDANCE_API = "api/download-attendance-sheet";

// Verification Tab

export const BULK_UPLOAD_VERIFICATION_TAB_API =
  "api/bulkupload-verificationAssessment";
export const GET_VERIFICATION_TAB_LIST_API = "api/get-verificationAssementList";
export const GET_ALL_PHOTOS_AND_VIDEOS_API = "api/getVerificationFiles";
export const UPLOAD_CHECK_IN_CHECK_OUT_PHOTO_API = "api/upload-checkFile";
export const GET_CHECK_IN_CHECK_OUT_PHOTO_API = "api/get-checkFile";
export const UPLOAD_GROUP_PHOTO_API = "api/upload-groupFile";
export const GET_GROUP_PHOTO_API = "api/get-groupFile";
export const DELETE_GROUP_PHOTO_API = "api/remove-groupFile";
export const DELETE_TIME_STAMP = "api/deleteTimeStamp";
export const UPLOAD_EXAM_CENTER_PHOTO_VIDEO_API = "api/upload-examcenterFile";
export const GET_EXAM_CENTER_PHOTO_VIDEO_API = "api/get-examcenterFile";
export const DELETE_EXAM_CENTER_PHOTO_VIDEO_API = "api/remove-examcenterFile";
export const UPLOAD_THEORY_PHOTO_VIDEO_API = "api/upload-theoryFile";
export const DELETE_THEORY_PHOTO_VIDEO_API = "api/remove-theoryFile";
export const GET_THEORY_PHOTO_VIDEO_API = "api/get-theoryFile";
export const UPLOAD_PRACTICAL_PHOTO_VIDEOS_API = "api/upload-practicalFile";
export const DELETE_PRACTICAL_PHOTO_VIDEOS_API = "api/remove-practicalFile";
export const GET_PRACTICAL_PHOTO_VIDEOS_API = "api/get-practicalFile";
export const UPLOAD_VIVA_PHOTO_VIDEOS_API = "api/upload-vivaFile";
export const GET_VIVA_PHOTO_VIDEOS_API = "api/get-vivaFile";
export const DELETE_VIVA_PHOTO_VIDEOS_API = "api/remove-vivaFile";
export const UPLOAD_ANNEXURE_N_ANNEXURE_M_PHOTO_API = "api/upload-annexureFile";
export const GET_ANNEXURE_N_ANNEXURE_M_PHOTO_API = "api/get-annexureFile";
export const DELETE_ANNEXURE_N_ANNEXURE_M_PHOTO_API = "api/remove-annexureFile";
export const UPLOAD_AADHAR_PHOTO_API = "api/upload-aadharFile";
export const GET_AADHAR_PHOTO_API = "api/get-aadharFile";
export const DELETE_AADHAR_PHOTO_API = "api/remove-aadharFile";
export const UPLOAD_TP_PHOTO_API = "api/upload-tpFile";
export const GET_TP_PHOTO_API = "api/get-tpFile";
export const DELETE_TP_PHOTO_API = "api/remove-tpFile";
export const UPLOAD_ATTENDANCE_API = "api/upload-attendenceFile";
export const GET_ATTENDANCE_API = "api/get-attendenceFile";
export const DELETE_ATTENDANCE_API = "api/remove-attendenceFile";
export const UPLOAD_TOOLS_API = "api/upload-toolsFile";
export const DELETE_TOOLS_API = "api/remove-toolFile";
export const GET_TOOLS_PHOTO_API = "api/get-toolFile";
export const CREATE_REMARKS_API = "api/add-remark";
export const GET_REMARKS_API = "api/get-remark";
export const DELETE_CHECK_IN_CHECK_OUT_IMAGE_API = "api/remove-checkFile";
export const GET_ZIP_FILE_ALL_DOCUMENTS = "api/get-qaFileList";
export const GET_FILTERED_VERIFICATION_LIST =
  "api/get-filteredVerificationList";
export const GET_FILTERED_NAME_LIST = "api/getfilter-AssessorNameList";
export const DOWNLOAD_SAMPLE_VERIFICATION =
  "api/download-verification-samplefile";

export const GET_VERIFICATION_AUDIT_FILE_API = "api/get-audit-data";

// QB Management New APIs
export const GET_VIVA_QUESTION_DETAILS_API = "api/getVivaQuestion-detailById";
export const GET_PRACTICAL_QUESTION_DETAILS_API =
  "api/getPracticalQuestion-detailById";
export const UPDATE_PRACTICAL_QUESTION_DETAILS_API =
  "api/update-Practicalquestion-details";
export const UPDATE_VIVA_QUESTION_DETAILS_API =
  "api/update-Vivaquestion-details";
export const DELETE_PRACTICAL_QUESTION_API = "api/remove-Practicalquestion";
export const DELETE_VIVA_QUESTION_API = "api/remove-Vivaquestion";
export const DOWNLOAD_PRACTICAL_SAMPLE_FILE_API =
  "api/download-practical-questionSamplefile";
export const DOWNLOAD_VIVA_SAMPLE_FILE_API =
  "api/download-viva-questionSamplefile";
export const STATUS_CHANGE_NOS_API = "api/change-nos-status";
export const DOWNLOAD_SAMPLE_SECONDARY_LANG_QB_API =
  "api/downloadMoreLangExcelFile";
export const UPLOAD_SECONDARY_LANG_QSTNS_API =
  "api/moreLangBulkUploadQuestionTheory";
export const DOWNLOAD_SAMPLE_SECONDARY_LANG_VIVAPRACTICAL_QB_API =
  "api/downloadExcelFileMoreLangPracticalViva";
export const UPLOAD_SECONDARY_LANG_VP_QSTNS_API =
  "api/moreLangBulkUploadQuestionPracticalViva";

export const GET_LENGTH_OF_QUESTIONS = "api/qbStatus";

//skill assessment apis

export const SKILL_ASSESSMENT_BATCH_LIST_API = "api/skill/batch-list";
export const SKILL_ASSESSMENT_PARTNER_OPTIONS_LIST_API =
  "api/skill/partner-options";
export const SKILL_ASSESSMENT_ALL_CANDIDATES_LIST_API =
  "api/skill/candiate-list";
export const SKILL_ASSESSMENT_VIEW_CANDIDATES_LIST_API =
  "api/skill/candiate-list";
export const SKILL_ASSESSMENT_ACCESSOR_LIST_API = "api/skill/assesor-list";
export const SKILL_ASSESSMENT_ACCESSOR_DETAILS_LIST_API =
  "api/skill/assesor-details";
export const SKILL_ASSESSMENT_RESULTS_LIST_API = "api/skill/result-list";
export const SKILL_ASSESSMENT_RESULTS_VIEW_CANDIDATE_LIST_API =
  "api/skill/candidate-results";
export const SKILL_ASSESSMENT_RESULTS_VIEW_MARKS_LIST_API =
  "api/skill/candidate-nos-result";
export const SKILL_ASSESSMENT_RESULTS_JOBROLE_LIST_API =
  "api/skill/jobRole-options";

// Suspicious Activity Capture API's

export const POST_SUSPICIOUS_ACTIVITY_IMAGE_API =
  "api/proctor/suspicous-activity-image-capturing";
export const GET_SUSPISIOUS_ACTIVITY_IMAGE_API =
  "api/proctor/suspicous-activity-image-capturing";

export const GET_SUSPICIOUS_ACTIVITY_VIDEO_API =
  "api/proctor/activity-video-capturing";

export const POST_SUSPICIOUS_ACTIVITY_VIDEO_API =
  "api/proctor/activity-video-capturing";

export const POST_ACTIVITY_PRACTICAL_UPLOAD_IMAGE =
  "api/proctor/activity-practical-upload-image";
export const POST_ACTIVITY_PRACTICAL_UPLOAD_VIDEO =
  "api/proctor/activity-practical-upload-video";
export const POST_ACTIVITY_VIVA_UPLOAD_IMAGE =
  "api/proctor/activity-viva-upload-image";
export const POST_ACTIVITY_THEORY_UPLOAD_IMAGE =
  "api/proctor/activity-theory-upload-image";
export const POST_ACTIVITY_VIVA_UPLOAD_VIDEO =
  "api/proctor/activity-viva-upload-video";
export const POST_ACTIVITY_THEORY_UPLOAD_VIDEO =
  "api/proctor/activity-theory-upload-video";

// BatchCreation Level And Version EndPoints
export const GET_JOBROLE_LEVEL_AND_VERSION_API = "api/nos-list-by-jobRole";
export const GET_JOBROLE_AND_VERSION_API = "api/nos-list-by-jobRole-version";
// Assigned Client List
export const GET_ONLY_ASSIGNED_CLIENTS_API = "api/getAllClientsList";

// Assessor Documents Accept Rejct
export const ACCEPT_REJECT_DOCUMENT_ASSESSOR_API =
  "api/change-checkAssessorFileStatus";

//Change File Status API's

export const CHANGE_FILES_STATUS_API = "api/change-checkFileStatus";
export const GET_REMINDER_DATA_API = "api/qaGetReminder";
export const POST_REMINDER_DATA_API = "api/qaSendReminder";
export const GET_VERIFICATION_FILES_COUNT = "api/getUploadedFilesCount";

// Batch Accept Reject API's
export const ACCEPT_REJECT_BATCH_API = "api/batchRequest-list";
export const REASSIGN_ASSESSOR_API = "api/assessorReassign";

// Assessed Batch API's
export const GET_ASSESSED_BATCH_LIST_API = "api/assessedBatch-list";

// Delete Candidate from batch
export const DELETE_CANDIDATE_BATCH_API = "api/deleteCandidate";
export const DELETE_MULTIPLE_CANDIDATE_BATCH_API =
  "api/deleteMultipleCandidate";

// Restore candidate login count
export const RESTORE_CANDIDATE_LOGIN_COUNT = "api/refresh-wrongLogin-attempt";

// to logout any candidate by Super admin
export const MANNUAL_CANDIDATE_LOGOUT = "api/manualCandidateLogout"; // /:id
export const GET_CANDIDATE_LOGIN_TOKEN_API = "api/get-login-token";

// Reassign candidate
export const REASSIGN_CANDIDATE_API = "api/reassignCandidate";

// disbale face recognition api

export const DISABLE_FACE_RECOGNITION_API = "api/disableFaceRecognition";

// Dashboard manage
export const GET_ALL_DROPDOWN_API = "api/getAllComponents";
export const CREATE_DASHBOARD_API = "api/addDashboard";
export const GET_SINGLE_DASHBOARD_API = "api/getDashboardById";
export const GET_ALL_DASHBOARD_LIST_API = "api/getAllDashboards";
export const UPDATE_DASHBOARD_LIST_API = "api/updateDashboard";

//skill assesment
export const SKILL_BATCH_LIST = "api/skill/batch-list";
export const DELETE_DASHBOARD_API = "api/deleteDashboard";
export const UPDATE_DASHBOARD_STATUS_API = "api/changeDashboardStatus";
