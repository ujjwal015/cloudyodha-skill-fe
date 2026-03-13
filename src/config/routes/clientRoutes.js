import { lazy } from "react";
import {
  SUPER_ADMIN_MY_PROFILE_PAGE,
  SUPER_ADMIN_SETTINGS_PAGE,
  SUPER_ADMIN_MY_ACCOUNT_PAGE,
  SUPER_ADMIN_MY_SECURITY_PAGE,
  SUPER_ADMIN_MY_DEVICE_MANAGEMENT_PAGE,
  SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
  SUPER_ADMIN_CLIENT_MANAGEMENT_PROFILE_PAGE,
  SUPER_ADMIN_QUESTION_LIST,
  SUPER_ADMIN_QUESTION_ADD,
  SUPER_ADMIN_BULK_UPLOAD_QUESTION,
  SUPER_ADMIN_QUESTION,
  SUPER_ADMIN_QUESTION_BANK_PAGE,
  SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE,
  SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE,
  SUPER_ADMIN_CREATE_QUESTION_PAGE,
  SUPER_ADMIN_QUESTION_PREVIEW_PAGE,
  SUPER_ADMIN_REPORT_AND_ANALYTICS,
  SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW,
  SUPER_ADMIN_SECTION_EDIT_PAGE,
  SUPER_ADMIN_QUESTION_EDIT_PAGE,
  SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
  SUPER_ADMIN_CREATE_ASSESSMENT_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE,
  SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE,
  SUPER_ADMIN_EDIT_EXAM_CENTER_PAGE,
  SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE,
  SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE,
  SUPER_ADMIN_CREATE_BATCH_PAGE,
  SUPER_ADMIN_EDIT_BATCH_PAGE,
  SUPER_ADMIN_ASSIGN_BATCH,
  SUPER_ADMIN_ASSESSMENT_STATS,
  SUPER_ADMIN_LIVE_MONITORING_PAGE,
  SUPER_ADMIN_LIVE_MONITORING__CANDIDATE_PAGE,
  SUPER_ADMIN_CLIENT_MANAGEMENT_BULK_UPLOAD,
  SUPER_ADMIN_USER_DEMO_LEAD_MANAGEMENT,
  SUPER_ADMIN_SCHEME_MANAGEMENT,
  SUPER_ADMIN_SCHEME_MANAGEMENT_CREATE_SCHEME,
  SUPER_ADMIN_SCHEME_MANAGEMENT_EDIT_SCHEME,
  SUPER_ADMIN_SUB_SCHEME_MANAGEMENT,
  SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_CREATE_SCHEME,
  SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_EDIT_SUB_SCHEME,
  BDA_JOB_ROLE_PAGE,
  BDA_JOB_ROLE_CREATE_PAGE,
  UPDATE_CLIENT_PROFILE_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_CREATE_USER_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_EDIT_USER_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_LIST_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_EDIT_ASSIGNED_PERMISSION_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_EDIT_ROLE_AND_PERMISSION_PAGE,
  ASSESSOR_MANAGEMENT_HOME,
  ASSESSOR_MANAGEMENT_ADD_NEW,
  ASSESSOR_MANAGEMENT_UPDATE,
  SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
  SUPER_ADMIN_CREATE_QUESTION_FORM_PAGE,
  SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE,
  INSTRUCTIONS_LIST,
  CREATE_INSTRUCTIONS,
  EDIT_INSTRUCTIONS,
  QUESTION_BANK_NOS,
  QUESTION_BANK_NOS_UPLOAD,
  QUESTION_BANK_NOS_TABLE,
  SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE,
  VERIFICATION_TAB_LIST_PAGE,
  UPLOAD_DOCUMENTS_PAGE,
  SUPER_ADMIN_VIEW_QUESTIONS_PAGE,
  ONLINE_RESULTS_TAB_PAGE,
  OFFLINE_RESULTS_TAB_PAGE,
  PROCTOR_MANAGEMENT_HOME,
  PROCTOR_MANAGEMENT_ADD_NEW,
  PROCTOR_MANAGEMENT_UPDATE,
  SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE,
  SUPER_ADMIN_CREATE_NEW_BATCH_OFFLINE_PAGE,
  SUPER_ADMIN_EDIT_QUESTION_VIVA_PAGE,
  CANDIDATE_RESULTS_PAGE,
  LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST,
  LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST_PATH,
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH,
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH,
  LOGS_MANAGEMENT_PROCTOR_IMAGE_BY_CANDIDATE_PATH,
  LOGS_MANAGEMENT_PROCTOR_VIDEO_BY_CANDIDATE_PATH,
  ADMIN_BUSINESS_DASHBOARD_PAGE,
  ADMIN_CONTENT_DASHBOARD_PAGE,
  ADMIN_HR_DASHBOARD_PAGE,
  ADMIN_OPERATION_DASHBOARD_PAGE,
  ADMIN_QA_DASHBOARD_PAGE,
  ADMIN_MIS_DASHBOARD_PAGE,
  ADMIN_FINANCE_DASHBOARD_PAGE,
  UPLOAD_OFFLINE_RESULTS,
  UPLOAD_OFFLINE_ANSWER_KEYS,
  NOS_WISE_RESULTS_PAGE,
  NOS_WISE_RESULTS_MAIN_TABLE,
  NOS_WISE_OFFLINE_PAGE,
  NOS_WISE_OFFLINE_RESULTS_MAIN_TABLE,
  OFFLINE_RESULTS_STATS,
  UPDATE_CANDIDATE_RESULT_PAGE,
  ASSESSOR_ATTENDANCE_LIST,
  ASSESSOR_ATTENDANCE_REGULARIZE_PAGE,
  SINGLE_ASSESSOR_ATTENDANCE_PAGE,
  ASSESSOR_MANAGEMENT_VIEW,
  LOGS_MANAGEMENT_PROCTOR_THEORY_BY_CANDIDATE_PATH,
  SUPER_ADMIN_ALL_BATCHES,
  SUPER_ADMIN_ALL_BATCHES_REQUEST,
  SUPER_ADMIN_ASSESSMENT_BATCH,
  ASSESSOR_MANAGEMENT_ADD_BULK_UPLOAD,
  PROCTOR_MANAGEMENT_BULK_UPLOAD,
  ADMIN_NCEVT_DASHBOARD_PAGE,
  REGENERATE_RESULT_LIST_PAGE,
  FAILED_CANDIDATE_LIST_PAGE,
  ADMIN_COMMON_DASHBOARD_PAGE,
  DASHBOARD_MANAGE_LIST,
  DASHBOARD_MANAGE_CREATE_PAGE,
  DASHBOARD_MANAGE_EDIT_PAGE,
  SUPER_ADMIN_UPDATE_QUESTION,
  SKILL_ASSESSMENT_BATCH_PAGE,
  SKILL_ASSESSMENT_BATCH_VIEW_CANDIDATE_PAGE,
  SKILL_ASSESSMENT_BATCH_VIEW_ACTION_PAGE,
  SKILL_ASSESSMENT_RESULT_PAGE,
  SKILL_ASSESSMENT_RESULT_VIEW_CANDIDATE_PAGE,
  SKILL_ASSESSMENT_All_CANDIDATE_PAGE,
  SKILL_ASSESSMENT_ASSESSORS_PAGE,
  SKILL_ASSESSMENT_RESULT_VIEW_MARKS_PAGE,
  SKILL_ASSESSMENT_ASSESSORS_USERNAME_PAGE,
  SUPER_ADMIN_MY_PROFILE_ABOUT_PAGE,
  GENERAL_INSTRUCTIONS,
  SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE_BULK_UPLOAD,
} from "./../constants/routePathConstants/superAdmin";
import SuperAdminLayout from "./../../components/common/Layout/SuperAdmin";
import { getSubRole, userRoleType } from "../../utils/projectHelper";
import { ROLESPERMISSIONS } from "../constants/projectConstant";
import CommonDashboardForAll from "../../pages/superAdmin/dashboards/index.jsx";

const BatchRequest = lazy(() =>
  import("../../pages/superAdmin/AllBatches/BatchRequest/index")
);

const AssessmentBatch = lazy(() =>
  import("../../pages/superAdmin/AllBatches/AssessedBatch/index")
);

const Dashboard = lazy(() =>
  import("../../pages/superAdmin/dashboards/dashboard")
);
const AdminDashboard = lazy(() => import("../../pages/admin/dashboard"));

const BusinessDashboard = lazy(() =>
  import("../../pages/superAdmin/dashboards/businessDashboard")
);

const NCEVTDashboard = lazy(() =>
  import("../../pages/superAdmin/dashboards/ncevtDashboard")
);

const ContentDashboard = lazy(() =>
  import("../../pages/superAdmin/dashboards/contentDashboard")
);
const HRDashboard = lazy(() =>
  import("../../pages/superAdmin/dashboards/hrDashboard")
);
// const OperationDashboard = lazy(() =>
//   import("../../pages/superAdmin/dashboards/operationDashboard")
// );
// const QADashboard = lazy(() =>
//   import("../../pages/superAdmin/dashboards/qaDashboard")
// );
// const MISDashboard = lazy(() =>
//   import("../../pages/superAdmin/dashboards/misDashboard")
// );
const FinanceDashboard = lazy(() =>
  import("../../pages/superAdmin/dashboards/financeDashboard")
);

const MyProfile = lazy(() => import("../../pages/superAdmin/profile"));
const Settings = lazy(() => import("../../pages/superAdmin/settings"));
const Account = lazy(() =>
  import("../../pages/superAdmin/settings/tabs/myAccount")
);
const Security = lazy(() =>
  import("../../pages/superAdmin/settings/tabs/security")
);
const DeviceManagement = lazy(() =>
  import("../../pages/superAdmin/settings/tabs/deviceManagement")
);

const ClientManagementList = lazy(() =>
  import("../../pages/superAdmin/clientManagement")
);
const ClientManagementBulkUploadAdmin = lazy(() =>
  import("../../pages/superAdmin/clientManagement/uploadBulkAdmin")
);

const ExamCenterManagementBulkUploadAdmin = lazy(() =>
  import("../../pages/superAdmin/examManagement/examCenter/BulkUpload.js")
);
const ClientManagementProfile = lazy(() =>
  import("../../pages/superAdmin/clientManagement/profile")
);
const UpdateClientProfile = lazy(() =>
  import("../../pages/superAdmin/clientManagement/editProfile")
);

const JobRoleList = lazy(() => import("../../pages/superAdmin/jobRole"));
const JobRoleCreate = lazy(() =>
  import("../../pages/superAdmin/jobRole/addNew")
);
const JobRoleUpdate = lazy(() =>
  import("../../pages/superAdmin/jobRole/update")
);

const QuestionList = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList")
);
const QuestionAdd = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList/QuestionAdd")
);
const UploadQuestions = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList/uploadQuestions")
);
const Questions = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList/QuestionAdd/Questions")
);
const QuestionBankHome = lazy(() =>
  import("../../pages/superAdmin/questionBank")
);
const CreateQuestionBank = lazy(() =>
  import("../../pages/superAdmin/questionBank/createQuestionBank")
);
// const CreateQuestionForm = lazy(() =>
//   import("../../pages/superAdmin/questionBank/createQuestionBank/addNew")
// );
const SaveAndNext = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList/QuestionAdd")
);
const QuestionPreview = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList/QuestionPreview")
);
const SaveDynamic = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList/DynamicSection")
);
const ReportAndAnalytics = lazy(() =>
  import("../../pages/superAdmin/ReportAndAnalytics")
);
const CandidateResultPreview = lazy(() =>
  import("../../pages/superAdmin/ReportAndAnalytics/CandidateResultPreview")
);
const EditSection = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList/EditSection")
);

const EditQuestion = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList/QuestionAdd/EditQuestion")
);

const EditQuestionViva = lazy(() =>
  import("../../pages/superAdmin/QuestionBankList/QuestionAdd/EditVivaQuestion")
);

//Assessment
const AssessmentList = lazy(() => import("../../pages/superAdmin/assessment"));
const CreateAssessment = lazy(() =>
  import("../../pages/superAdmin/assessment/newAssessment")
);
const AssessmentPreview = lazy(() =>
  import("../../pages/superAdmin/assessment/newAssessment/previewAssessment")
);

const VivaAssessmentPreview = lazy(() =>
  import(
    "../../pages/superAdmin/assessment/newAssessment/vivaPracticalQuestionPreview"
  )
);

// Exam Mangement
const ExamManagement = lazy(() =>
  import("../../pages/superAdmin/examManagement")
);
const ExamManagementList = lazy(() =>
  import("../../pages/superAdmin/examManagement/examCenter/ExamCenterList")
);
const CreateExamCenter = lazy(() =>
  import("../../pages/superAdmin/examManagement/examCenter/CreateExamCenter")
);
const EditExamCenter = lazy(() =>
  import("../../pages/superAdmin/examManagement/examCenter/EditExamCenter")
);
// const BatchList = lazy(() =>
//   import("../../pages/superAdmin/examManagement/batch/batchList")
// );
const BatchList = lazy(() =>
  import("../../pages/superAdmin/examManagement/batch/batchManagementList")
);
const LiveMonitoring = lazy(() =>
  import("../../pages/superAdmin/examManagement/batch/liveMonitoring/index")
);
const LiveMonitoringCandidate = lazy(() =>
  import(
    "../../pages/superAdmin/examManagement/batch/liveMonitoring/liveMonitoringCandidate"
  )
);
const CreateBatch = lazy(() =>
  import("../../pages/superAdmin/examManagement/batch/createBatch")
);
const EditBatch = lazy(() =>
  import("../../pages/superAdmin/examManagement/batch/editBatch")
);

const CandidateList = lazy(() =>
  import("../../pages/superAdmin/examManagement/assignBatch/NewCandidateList")
);

// const CandidateList = lazy(() =>
//   import("../../pages/superAdmin/examManagement/assignBatch/CandidateList")
// );
const EditCandidateForm = lazy(() =>
  import("../../pages/superAdmin/examManagement/assignBatch/EditCandidateForm")
);
const AssignBatch = lazy(() =>
  import("../../pages/superAdmin/examManagement/assignBatch")
);
const AssessmentStats = lazy(() =>
  import("../../pages/superAdmin/examManagement/batch/assessmentStats")
);

// Lead Management and Scheme Management
const DemoUserLeadManagement = lazy(() =>
  import("../../pages/superAdmin/LeadsManagement")
);
const SchemeManagement = lazy(() =>
  import("../../pages/superAdmin/schemeManagement/schemeManagementList")
);
const SchemeManagementCreateScheme = lazy(() =>
  import(
    "../../pages/superAdmin/schemeManagement/schemeManagementList/scheme/createScheme"
  )
);
const SchemeManagementEditScheme = lazy(() =>
  import(
    "../../pages/superAdmin/schemeManagement/schemeManagementList/scheme/editScheme"
  )
);
const SchemeManagementCreateSubScheme = lazy(() =>
  import(
    "../../pages/superAdmin/schemeManagement/schemeManagementList/subScheme/createSubScheme"
  )
);
const SchemeManagementEditSubScheme = lazy(() =>
  import(
    "../../pages/superAdmin/schemeManagement/schemeManagementList/subScheme/editSubScheme"
  )
);
const UserManagementUsersList = lazy(() =>
  import("../../pages/superAdmin/userManagement/users/usersList")
);
const CreateUser = lazy(() =>
  import("../../pages/superAdmin/userManagement/users/createUser")
);
const EditUser = lazy(() =>
  import("../../pages/superAdmin/userManagement/users/editUser")
);
const RoleAndPermissionList = lazy(() =>
  import(
    "../../pages/superAdmin/userManagement/roleManagement/rolesPermissionsList"
  )
);
const UserManagementRoleAndPermission = lazy(() =>
  import(
    "../../pages/superAdmin/userManagement/roleManagement/createRoleAndPermissions"
  )
);
const EditUserManagementRoleAndPermission = lazy(() =>
  import(
    "../../pages/superAdmin/userManagement/roleManagement/editRoleAndPermissions"
  )
);
const EditUserManagementAssignedPermission = lazy(() =>
  import(
    "../../pages/superAdmin/userManagement/roleManagement/assignPermissions"
  )
);

// Assessor Management
const AssessorManagementHome = lazy(() =>
  import("../../pages/superAdmin/AssessorManagement")
);
const AssessorManagementAddNew = lazy(() =>
  import("../../pages/superAdmin/AssessorManagement/profile")
);

const AssessorManagementAddBulkUpload = lazy(() =>
  import("../../pages/superAdmin/AssessorManagement/uploadBulkAdmin/index.js")
);

const AssessorManagementUpdate = lazy(() =>
  import("../../pages/superAdmin/AssessorManagement/editProfile")
);
const AssessorManagementView = lazy(() =>
  import("../../pages/superAdmin/AssessorManagement/ViewProfile")
);

// as per new flow question bank form
const QuestionFormList = lazy(() =>
  import("../../pages/superAdmin/questionBank/qbForm/questionFormList")
);
const CreateQuestionForm = lazy(() =>
  import("../../pages/superAdmin/questionBank/qbForm/createQbForm")
);
const EditQuestionForm = lazy(() =>
  import("../../pages/superAdmin/questionBank/qbForm/editQuestionForm")
);
const NOSHomePage = lazy(() =>
  import("../../pages/superAdmin/questionBank/NOS")
);
const NOSBulkUploadPage = lazy(() =>
  import("../../pages/superAdmin/questionBank/NOS/uploadNOS")
);
const NOSDetailsTable = lazy(() =>
  import("../../pages/superAdmin/questionBank/NOS/NOSTable")
);
const QuestionsList = lazy(() =>
  import("../../pages/superAdmin/questionBank/qbForm/questionsList")
);
// Instructions

const InstructionsList = lazy(() =>
  import("../../pages/superAdmin/newInstructions/instructions.js")
);
const GeneralInstructions = lazy(() =>
  import("../../pages/superAdmin/newInstructions/generalInstructions/index.js")
);

//Verification Tab
const VerificationList = lazy(() =>
  import("../../pages/superAdmin/verificationTab")
);
const UploadDocuments = lazy(() =>
  import("../../pages/superAdmin/verificationTab/uploadDocuments")
);

//Regenerate result
const RegenerateResultList = lazy(() =>
  import("../../pages/superAdmin/regenerateResult")
);
const FailedCandidateList = lazy(() =>
  import("../../pages/superAdmin/regenerateResult/FailedCandidates.js")
);

// Results Tabs =>
const OnlineResultsList = lazy(() =>
  import("../../pages/superAdmin/Results/OnlineResults")
);
const OfflineResultsList = lazy(() =>
  import("../../pages/superAdmin/Results/OfflineResults")
);
const CandidatesResultList = lazy(() =>
  import("../../pages/superAdmin/Results/OnlineResults/CandidateResults")
);

const UploadOfflineResults = lazy(() =>
  import("../../pages/superAdmin/Results/OfflineResults/UploadResults")
);

const UploadOfflineAnswerKeys = lazy(() =>
  import("../../pages/superAdmin/Results/OfflineResults/UploadAnswerKeys")
);

const ViewNosWiseResultsList = lazy(() =>
  import("../../pages/superAdmin/Results/OnlineResults/NosWiseResults")
);

const ViewNosWiseOfflineResults = lazy(() =>
  import("../../pages/superAdmin/Results/OfflineResults/NosWiseResults")
);

const NosWiseResultTable = lazy(() =>
  import("../../pages/superAdmin/Results/OnlineResults/NosWiseMainTable")
);
const NosOfflineResultTable = lazy(() =>
  import("../../pages/superAdmin/Results/OfflineResults/NosWiseMainTable")
);
const OfflineResultStats = lazy(() =>
  import("../../pages/superAdmin/Results/OfflineResults/ResultStats")
);
const UpdateCandidateResultQuestion = lazy(() =>
  import(
    "../../pages/superAdmin/ReportAndAnalytics/CandidateResultPreview/UpdateCandidateResult"
  )
);
// Proctor Management
const ProctorManagementHome = lazy(() =>
  import("../../pages/superAdmin/ProctorManagement")
);
const ProctorManagementAddNew = lazy(() =>
  import("../../pages/superAdmin/ProctorManagement/profile")
);
const ProctorManagementUpdate = lazy(() =>
  import("../../pages/superAdmin/ProctorManagement/editProfile")
);
const ProctorManagementBulkUpload = lazy(() =>
  import("../../pages/superAdmin/ProctorManagement/uploadBulkAdmin")
);

const LogsManagementAcitivityLogs = lazy(() =>
  import("../../pages/superAdmin/LogsManagement/activityLogs")
);
const LogsManagementProctorLogs = lazy(() =>
  import("../../pages/superAdmin/LogsManagement/proctorActivity")
);

const LogsManagementProctorLogsByCandidate = lazy(() =>
  import(
    "../../pages/superAdmin/LogsManagement/proctorActivity/CandidatesByBatch"
  )
);
// Need to change path name
const LogsManagementImageProctorLogsByCandidate = lazy(() =>
  import(
    "../../pages/superAdmin/LogsManagement/proctorActivity/ProctorLogs/ImageLogs"
  )
);

const LogsManagementVideoProctorLogsByCandidate = lazy(() =>
  import(
    "../../pages/superAdmin/LogsManagement/proctorActivity/ProctorLogs/VideoLogs"
  )
);

const LogsManagementActivityLogsByBatchId = lazy(() =>
  import("../../pages/superAdmin/LogsManagement/activityLogs/CandidatesByBatch")
);
const AssessorAttendanceList = lazy(() =>
  import("../../pages/superAdmin/assessorAttendance/assessorAttendanceList")
);
const SingleAssessorAttendanceLogList = lazy(() =>
  import(
    "../../pages/superAdmin/assessorAttendance/singleAssessorAttendanceList"
  )
);
const AttendanceRegularizPage = lazy(() =>
  import("../../pages/superAdmin/assessorAttendance/assessorAttendanceList")
);

const SectionWiseroctionDetails = lazy(() =>
  import(
    "../../pages/superAdmin/LogsManagement/proctorActivity/ProctorLogs/sections.js"
  )
);

// Dashboard Manage

const DashboardManageList = lazy(() =>
  import("../../pages/superAdmin/dashboardManage/list/index.js")
);
const CreateDashboard = lazy(() =>
  import("../../pages/superAdmin/dashboardManage/create/index.js")
);
const EditDashboard = lazy(() =>
  import("../../pages/superAdmin/dashboardManage/edit/index.js")
);

//Skill Assessment
const SkillAssessmentBatch = lazy(() =>
  import("../../pages/superAdmin/skillAssessment/batch/index.js")
);
const SkillAssessmentBatchAllCandidate = lazy(() =>
  import("../../pages/superAdmin/skillAssessment/batch/AllCandidates/index.js")
);

const SkillAssessmentBatchAction = lazy(() =>
  import("../../pages/superAdmin/skillAssessment/batch/Action/index.js")
);
const SkillAssessmentAllCandidate = lazy(() =>
  import("../../pages/superAdmin/skillAssessment/AllCandidates/index.js")
);
const SkillAssessmentAssessors = lazy(() =>
  import("../../pages/superAdmin/skillAssessment/assessors/index.js")
);
const SkillAssessmentAssessorsUsername = lazy(() =>
  import("../../pages/superAdmin/skillAssessment/assessors/username/index.js")
);
const SkillAssessmentResults = lazy(() =>
  import("../../pages/superAdmin/skillAssessment/results/index.js")
);
const SkillAssessmentResultViewCandidate = lazy(() =>
  import(
    "../../pages/superAdmin/skillAssessment/results/resultViewCandidate/index.js"
  )
);
const SkillAssessmentResultViewMarksCandidate = lazy(() =>
  import("../../pages/superAdmin/skillAssessment/results/nosMarks/index.js")
);

//Not Found
const NotFound = lazy(() => import("../../pages/notFound"));

const {
  DASHBOARD_FEATURE,
  DASHBOARD_SUB_FEATURE_1,
  DASHBOARD_SUB_FEATURE_2,
  DASHBOARD_SUB_FEATURE_3,
  DASHBOARD_SUB_FEATURE_4,
  DASHBOARD_SUB_FEATURE_5,
  DASHBOARD_SUB_FEATURE_6,
  DASHBOARD_SUB_FEATURE_7,
  DASHBOARD_SUB_FEATURE_8,
  DASHBOARD_SUB_FEATURE_9,
  DASHBOARD_SUB_FEATURE_10,
  CLIENT_MANAGEMENT_FEATURE,
  CLIENT_MANAGEMENT_LIST_FEATURE,
  JOB_ROLE_MANAGEMENT_FEATURE,
  JOB_ROLE_MANAGEMENT_LIST_FEATURE,
  QUESTION_BANK_FEATURE,
  QUESTION_BANK_SUB_FEATURE_1,
  QUESTION_BANK_SUB_FEATURE_2,
  ASSESSMENT_FEATURE,
  ASSESSMENT_LIST_FEATURE,
  EXAM_MANAGEMENT_FEATURE,
  EXAM_MANAGEMENT_SUB_FEATURE_1,
  EXAM_MANAGEMENT_SUB_FEATURE_2,
  EXAM_MANAGEMENT_SUB_FEATURE_3,
  EXAM_MANAGEMENT_SUB_FEATURE_4,
  ALL_BATCHES_SUB_FEATURE_1,
  ALL_BATCHES_SUB_FEATURE_2,
  USER_MANAGEMENT_FEATURE,
  USER_MANAGEMENT_SUB_FEATURE_1,
  USER_MANAGEMENT_SUB_FEATURE_2,
  USER_MANAGEMENT_SUB_FEATURE_3,
  LEAD_MANAGEMENT_FEATURE,
  LEAD_MANAGEMENT_LIST_FEATURE,
  SCHEME_MANAGEMENT_FEATURE,
  SCHEME_MANAGEMENT_LIST_FEATURE_1,
  SCHEME_MANAGEMENT_LIST_FEATURE_2,
  INSTRUCTIONS_FEATURE,
  INSTRUCTIONS_LIST_FEATURE,
  ASSESSOR_MANAGEMENT_FEATURE,
  ASSESSOR_MANAGEMENT_LIST_FEATURE,
  VERIFICATION_FEATURE,
  VERIFICATION_LIST_FEATURE,
  RESULTS_FEATURE,
  REGENERATE_RESULT_FEATURE,
  REGENERATE_RESULT_LIST_FEATURE,
  RESULTS_SUB_FEATURE_1,
  RESULTS_SUB_FEATURE_2,
  PROCTOR_FEATURE,
  PROCTOR_LIST_FEATURE,
  LOG_MANAGEMENT_FEATURE,
  LOG_MANAGEMENT_LIST_FEATURE_1,
  LOG_MANAGEMENT_LIST_FEATURE_2,
  ASSESSOR_ATTENDANCE_FEATURE,
  ASSESSOR_ATTENDANCE_LIST_FEATURE_1,
  ASSESSOR_ATTENDANCE_LIST_FEATURE_2,
  DASHBOARD_MANAGE_FEATURE,
  SKILL_ASSESSMENT,
  SKILL_ASSESSMENT_BATCH,
  SKILL_ASSESSMENT_ALL_CANDIDATES,
  SKILL_ASSESSMENT_ASSESSORS,
  SKILL_ASSESSMENT_RESULT,
} = ROLESPERMISSIONS;

//Dashboard Routes

const DASHBOARD_ROUTES = (userRole) => {
  const featureName = DASHBOARD_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatures = [
    DASHBOARD_SUB_FEATURE_1,
    DASHBOARD_SUB_FEATURE_2,
    DASHBOARD_SUB_FEATURE_3,
    DASHBOARD_SUB_FEATURE_4,
    DASHBOARD_SUB_FEATURE_5,
    DASHBOARD_SUB_FEATURE_6,
    DASHBOARD_SUB_FEATURE_7,
    DASHBOARD_SUB_FEATURE_10,
  ];

  const subRoles = subFeatures.map((subFeature) =>
    getSubRole(roleType?.subFeatures, subFeature)
  );

  const subFeaturesEnabled = subRoles.map(
    (subRole) => subRole?.enabled || false
  );

  const isAnySubFeatureEnabled = subFeaturesEnabled.some(
    (isEnabled) => isEnabled
  );

  const BUSINESSDASHBOARD =
    isAnySubFeatureEnabled && subRoles[0]?.enabled
      ? [
          { path: "/", element: <BusinessDashboard /> },
          {
            path: ADMIN_COMMON_DASHBOARD_PAGE,
            element: <BusinessDashboard />,
          },
        ]
      : [];

  const COMMONDASHBOARD =
    isAnySubFeatureEnabled && subRoles[0]?.enabled
      ? [
          { path: "/", element: <CommonDashboardForAll /> },
          {
            path: ADMIN_BUSINESS_DASHBOARD_PAGE,
            element: <CommonDashboardForAll />,
          },
        ]
      : [];

  const NCEVTDASHBOARD =
    isAnySubFeatureEnabled && subRoles[7]?.enabled
      ? [
          { path: "/", element: <NCEVTDashboard /> },
          {
            path: ADMIN_NCEVT_DASHBOARD_PAGE,
            element: <NCEVTDashboard />,
          },
        ]
      : [];

  const CONTENTDASHBOARD =
    isAnySubFeatureEnabled && subRoles[1]?.enabled
      ? [
          { path: "/", element: <ContentDashboard /> },
          {
            path: ADMIN_CONTENT_DASHBOARD_PAGE,
            element: <ContentDashboard />,
          },
        ]
      : [];

  const HRDASHBOARD =
    isAnySubFeatureEnabled && subRoles[2]?.enabled
      ? [
          { path: "/", element: <HRDashboard /> },
          {
            path: ADMIN_HR_DASHBOARD_PAGE,
            element: <HRDashboard />,
          },
        ]
      : [];

  // const OPERATIONDASHBOARD =
  //   isAnySubFeatureEnabled && subRoles[3]?.enabled
  //     ? [
  //         { path: "/", element: <OperationDashboard /> },
  //         {
  //           path: ADMIN_OPERATION_DASHBOARD_PAGE,
  //           element: <OperationDashboard />,
  //         },
  //       ]
  //     : [];

  // const QADASHBOARD =
  //   isAnySubFeatureEnabled && subRoles[4]?.enabled
  //     ? [
  //         { path: "/", element: <QADashboard /> },
  //         {
  //           path: ADMIN_QA_DASHBOARD_PAGE,
  //           element: <QADashboard />,
  //         },
  //       ]
  //     : [];

  // const MISDASHBOARD =
  //   isAnySubFeatureEnabled && subRoles[5]?.enabled
  //     ? [
  //         { path: "/", element: <MISDashboard /> },
  //         {
  //           path: ADMIN_MIS_DASHBOARD_PAGE,
  //           element: <MISDashboard />,
  //         },
  //       ]
  //     : [];

  const FINANCEDASHBOARD =
    isAnySubFeatureEnabled && subRoles[6]?.enabled
      ? [
          { path: "/", element: <FinanceDashboard /> },
          {
            path: ADMIN_FINANCE_DASHBOARD_PAGE,
            element: <FinanceDashboard />,
          },
        ]
      : [];

  const enabledRoutes = []
    .concat(COMMONDASHBOARD)
    .concat(BUSINESSDASHBOARD)
    .concat(NCEVTDASHBOARD)
    .concat(CONTENTDASHBOARD)
    .concat(HRDASHBOARD)
    // .concat(OPERATIONDASHBOARD)
    // .concat(QADASHBOARD)
    // .concat(MISDASHBOARD)
    .concat(FINANCEDASHBOARD);
  if (isAnySubFeatureEnabled && roleType?.enabled === true) {
    return [{ index: true, element: enabledRoutes[0].element }].concat(
      enabledRoutes.slice(1)
    );
  }

  return [{ index: true, element: <Dashboard /> }];
};

//My Profile Routes
const MY_PROFILE_ROUTES = [
  {
    // path: `${SUPER_ADMIN_MY_PROFILE_PAGE}/:id`,
    path: SUPER_ADMIN_MY_PROFILE_PAGE,
    element: <MyProfile />,
  },
];
//My Account Routes
const MY_ACCOUNT_ROUTES = [
  {
    path: SUPER_ADMIN_SETTINGS_PAGE,
    element: <Settings />,
    children: [
      {
        // index: true,
        path: `${SUPER_ADMIN_MY_ACCOUNT_PAGE}/:id`,
        element: <Account />,
      },
      {
        path: SUPER_ADMIN_MY_SECURITY_PAGE,
        element: <Security />,
      },
      {
        path: SUPER_ADMIN_MY_DEVICE_MANAGEMENT_PAGE,
        element: <DeviceManagement />,
      },
    ],
  },
];
//Client Management Routes
const CLIENT_MANAGEMENT_ROUTES = (userRole) => {
  const featureName = CLIENT_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = CLIENT_MANAGEMENT_LIST_FEATURE;
  const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);

  return roleType?.enabled == true && subUserRole?.enabled == true
    ? [
        subUserRole?.permissions?.["1"]
          ? {
              path: SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
              element: <ClientManagementList />,
            }
          : {},
        subUserRole?.permissions?.["2"]
          ? {
              path: SUPER_ADMIN_CLIENT_MANAGEMENT_PROFILE_PAGE,
              element: <ClientManagementProfile />,
            }
          : {},
        {
          path: `${SUPER_ADMIN_CLIENT_MANAGEMENT_PROFILE_PAGE}/:id`,
          element: <ClientManagementProfile />,
        },
        {
          path: SUPER_ADMIN_CLIENT_MANAGEMENT_BULK_UPLOAD,
          element: <ClientManagementBulkUploadAdmin />,
        },
        {
          path: `${UPDATE_CLIENT_PROFILE_PAGE}/:id`,
          element: <UpdateClientProfile />,
        },
      ]
    : [];
};

// Job Role Management Routes
const JOB_ROLE_MANAGEMENT_ROUTES = (userRole) => {
  const featureName = JOB_ROLE_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = JOB_ROLE_MANAGEMENT_LIST_FEATURE;
  const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);

  return roleType?.enabled == true && subUserRole?.enabled == true
    ? [
        subUserRole?.permissions?.["1"]
          ? {
              path: BDA_JOB_ROLE_PAGE,
              element: <JobRoleList />,
            }
          : {},
        subUserRole?.permissions?.["2"]
          ? { path: BDA_JOB_ROLE_CREATE_PAGE, element: <JobRoleCreate /> }
          : {},

        {
          path: `${BDA_JOB_ROLE_CREATE_PAGE}/:id`,
          element: <JobRoleUpdate />,
        },
      ]
    : [];
};

//Question Bank Routes
const QUESTION_BANK_ROUTES = (userRole) => {
  const featureName = QUESTION_BANK_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = QUESTION_BANK_SUB_FEATURE_1;
  const subUserRole1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const subFeatureName2 = QUESTION_BANK_SUB_FEATURE_2;
  const subUserRole2 = getSubRole(roleType?.subFeatures, subFeatureName2);

  const NL = [
    subUserRole1?.permissions?.["1"]
      ? {
          path: QUESTION_BANK_NOS,
          element: <NOSHomePage />,
        }
      : {},
    subUserRole1?.permissions?.["2"]
      ? {
          path: QUESTION_BANK_NOS_UPLOAD,
          element: <NOSBulkUploadPage />,
        }
      : {},
    subUserRole1?.permissions?.["1"]
      ? {
          path: `${QUESTION_BANK_NOS_TABLE}/:id/:section`,
          element: <NOSDetailsTable />,
        }
      : {},
  ];

  const QBL = [
    // {
    //   path: SUPER_ADMIN_QUESTION_LIST,
    //   element: <QuestionList />,
    // },
    {
      path: SUPER_ADMIN_QUESTION_ADD,
      element: <QuestionAdd />,
    },
    {
      path: `${SUPER_ADMIN_BULK_UPLOAD_QUESTION}/:id`,
      element: <UploadQuestions />,
    },
    {
      path: `${SUPER_ADMIN_QUESTION}/:id`,
      element: <Questions />,
    },
    // {
    //   path: SUPER_ADMIN_QUESTION_BANK_PAGE,
    //   element: <QuestionBankHome />,
    // },
    // {
    //   path: SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE,
    //   element: <CreateQuestionBank />,
    // },
    // {
    //   path: SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE,
    //   element: <CreateQuestionForm />,
    // },
    // {
    //   path: `${SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE}/:id`,
    //   element: <CreateQuestionForm />,
    // },
    {
      path: SUPER_ADMIN_CREATE_QUESTION_PAGE,
      element: <SaveAndNext />,
    },
    // {
    //   path: `${SUPER_ADMIN_QUESTION_PREVIEW_PAGE}/:id`,
    //   element: <QuestionPreview />,
    // },
    {
      path: `${SUPER_ADMIN_CREATE_QUESTION_PAGE}/:id`,
      element: <SaveDynamic />,
    },
    {
      path: `${SUPER_ADMIN_QUESTION}/:qbid/:qId/:lang`, // here
      element: <EditQuestion />,
    },
    {
      path: `${SUPER_ADMIN_SECTION_EDIT_PAGE}/:id`,
      element: <EditSection />,
    },
    {
      path: `${SUPER_ADMIN_EDIT_QUESTION_VIVA_PAGE}/:qbid/:qId/:section/:lang`,
      element: <EditQuestionViva />,
    },
    {
      path: `${SUPER_ADMIN_BULK_UPLOAD_QUESTION}/:id/:section`,
      element: <UploadQuestions />,
    },
    //  New Question Bank Form
    subUserRole2?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
          element: <QuestionFormList />,
        }
      : {},
    {
      path: `${SUPER_ADMIN_QUESTION_FORM_LIST_PAGE}/:section`,
      element: <QuestionFormList />,
    },
    subUserRole2?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_CREATE_QUESTION_FORM_PAGE,
          element: <CreateQuestionForm />,
        }
      : {},
    subUserRole2?.permissions?.["3"]
      ? {
          path: `${SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE}/:formId`,
          element: <EditQuestionForm />,
        }
      : {},
    subUserRole2?.permissions?.["1"]
      ? {
          path: `${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/:id/:section`,
          element: <QuestionsList />,
        }
      : {},
  ];

  const isNOLIEnabled = subUserRole1?.enabled || false;
  const isQUBALIEnabled = subUserRole2?.enabled || false;

  if (roleType?.enabled === true && (isNOLIEnabled || isQUBALIEnabled)) {
    return (isNOLIEnabled ? NL : [])?.concat(isQUBALIEnabled ? QBL : []);
  }

  return [];
};

//Assessment Routes
// const ASSESSMENT_ROUTES = (userRole) => {
//   const featureName = ASSESSMENT_FEATURE;
//   const roleType = userRoleType(userRole, featureName);
//   const subFeatureName = ASSESSMENT_LIST_FEATURE;
//   const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);

//   return roleType?.enabled == true && subUserRole?.enabled == true
//     ? [
//         subUserRole?.permissions?.["1"]
//           ? {
//               path: SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
//               element: <AssessmentList />,
//             }
//           : {},
//         // {
//         //   path: SUPER_ADMIN_CREATE_ASSESSMENT_PAGE,
//         //   element: <CreateAssessment />,
//         // },
//         // {
//         //   path: `${SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE}/:assessmentId`,
//         //   element: <CreateAssessment />,
//         // },
//         // {
//         //   path: `${SUPER_ADMIN_CREATE_ASSESSMENT_PAGE}/:assessmentId`,
//         //   element: <CreateAssessment />,
//         // },
//         // {
//         //   path: `${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/:assessmentId`,
//         //   element: <CreateAssessment />,
//         // },
//         {
//           path: `${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/:assessmentId/:setId`,
//           element: <AssessmentPreview />,
//         },
//         {
//           path: `${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/:previewType`,
//           element: <VivaAssessmentPreview />,
//         },
//       ]
//     : [];
// };

//Exam Management Routes
const EXAM_MANAGEMENT_ROUTES = (userRole) => {
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = EXAM_MANAGEMENT_SUB_FEATURE_1;
  const subUserRole1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const subFeatureName2 = EXAM_MANAGEMENT_SUB_FEATURE_2;
  const subUserRole2 = getSubRole(roleType?.subFeatures, subFeatureName2);
  const subFeatureName3 = EXAM_MANAGEMENT_SUB_FEATURE_3;
  const subUserRole3 = getSubRole(roleType?.subFeatures, subFeatureName3);
  const subFeatureName4 = EXAM_MANAGEMENT_SUB_FEATURE_4;
  const subUserRole4 = getSubRole(roleType?.subFeatures, subFeatureName4);
  const subFeatureName5 = ALL_BATCHES_SUB_FEATURE_1;
  const subUserRole5 = getSubRole(roleType?.subFeatures, subFeatureName5);
  const subFeatureName6 = ALL_BATCHES_SUB_FEATURE_2;
  const subUserRole6 = getSubRole(roleType?.subFeatures, subFeatureName6);

  const EXCE = [
    // {
    //   path: SUPER_ADMIN_EXAM_MANAGEMENT_PAGE,
    //   element: <ExamManagement />,
    // },
    subUserRole1?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE,
          element: <ExamManagementList />,
        }
      : {},
    subUserRole1?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE,
          element: <CreateExamCenter />,
        }
      : {},

    subUserRole1?.permissions?.["3"]
      ? {
          path: `${SUPER_ADMIN_EDIT_EXAM_CENTER_PAGE}/:examCenterId`,
          element: <EditExamCenter />,
        }
      : {},
    {
      path: SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE_BULK_UPLOAD,
      element: <ExamCenterManagementBulkUploadAdmin />,
    },
  ];

  // Batch

  const BA = [
    subUserRole2?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE,
          element: <BatchList />,
        }
      : {},
    {
      path: `${SUPER_ADMIN_LIVE_MONITORING_PAGE}/:id`,
      element: <LiveMonitoring />,
    },
    {
      path: `${SUPER_ADMIN_LIVE_MONITORING__CANDIDATE_PAGE}/:id`,
      element: <LiveMonitoringCandidate />,
    },
    subUserRole2?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_CREATE_BATCH_PAGE,
          element: <CreateBatch />,
        }
      : {},
    subUserRole2?.permissions?.["3"]
      ? {
          path: `${SUPER_ADMIN_EDIT_BATCH_PAGE}/:id`,
          element: <EditBatch />,
        }
      : {},
    {
      path: `${SUPER_ADMIN_ASSESSMENT_STATS}/:assesmentStatsId/:batchId`,
      // path: SUPER_ADMIN_ASSESSMENT_STATS,
      element: <AssessmentStats />,
    },
  ];

  const ASCALI = [
    subUserRole3?.permissions?.["1"]
      ? {
          path: `${SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE}/:batchId`,
          element: <CandidateList />,
        }
      : {},
    subUserRole3?.permissions?.["3"]
      ? {
          path: `${SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE}/:batchId/:candidateId`,
          element: <EditCandidateForm />,
        }
      : {},
    {
      path: SUPER_ADMIN_ASSIGN_BATCH,
      element: <AssignBatch />,
    },
    {
      path: `${SUPER_ADMIN_ASSIGN_BATCH}/:batchId`,
      element: <AssignBatch />,
    },
  ];

  const PRASLI = [
    subUserRole4?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
          element: <AssessmentList />,
        }
      : {},
    {
      path: `${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/:assessmentId/:setId`,
      element: <AssessmentPreview />,
    },
    {
      path: `${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/:previewType`,
      element: <VivaAssessmentPreview />,
    },
  ];

  // New Routes added

  const BARELI = [
    subUserRole5?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_ALL_BATCHES_REQUEST,
          element: <BatchRequest />,
        }
      : {},
    subUserRole5?.permissions?.["1"]
      ? {
          path: `${SUPER_ADMIN_LIVE_MONITORING__CANDIDATE_PAGE}/:id`,
          element: <LiveMonitoringCandidate />,
        }
      : {},
    subUserRole5?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_CREATE_BATCH_PAGE,
          element: <CreateBatch />,
        }
      : {},
    subUserRole5?.permissions?.["3"]
      ? {
          path: `${SUPER_ADMIN_EDIT_BATCH_PAGE}/:id`,
          element: <EditBatch />,
        }
      : {},
    subUserRole5?.permissions?.["1"]
      ? {
          path: `${SUPER_ADMIN_ASSESSMENT_STATS}/:assesmentStatsId/:batchId`,
          // path: SUPER_ADMIN_ASSESSMENT_STATS,
          element: <AssessmentStats />,
        }
      : {},
  ];

  const BASTLI = [
    subUserRole6?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_ASSESSMENT_BATCH,
          element: <AssessmentBatch />,
        }
      : {},
  ];

  const isEXCEnabled = subUserRole1?.enabled || false;
  const isBAEnabled = subUserRole2?.enabled || false;
  const isASCALIEnabled = subUserRole3?.enabled || false;
  const isPRASLIEnabled = subUserRole4?.enabled || false;
  const isBARELIEnabled = subUserRole5?.enabled || false;
  const isBASTLIEnabled = subUserRole6?.enabled || false;

  const resultArray =
    roleType?.enabled === true &&
    (isEXCEnabled ||
      isBAEnabled ||
      isASCALIEnabled ||
      isPRASLIEnabled ||
      isBARELIEnabled ||
      isBASTLIEnabled)
      ? (isEXCEnabled ? EXCE : [])
          .concat(isBAEnabled ? BA : [])
          .concat(isASCALIEnabled ? ASCALI : [])
          .concat(isPRASLIEnabled ? PRASLI : [])
          .concat(isBARELIEnabled ? BARELI : [])
          .concat(isBASTLIEnabled ? BASTLI : [])
      : [];

  return resultArray;
};

//All Batches Routes
const ALL_BATCHES_ROUTES = (userRole) => {
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = EXAM_MANAGEMENT_SUB_FEATURE_1;
  const subUserRole1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const subFeatureName2 = EXAM_MANAGEMENT_SUB_FEATURE_2;
  const subUserRole2 = getSubRole(roleType?.subFeatures, subFeatureName2);
  const subFeatureName3 = EXAM_MANAGEMENT_SUB_FEATURE_3;
  const subUserRole3 = getSubRole(roleType?.subFeatures, subFeatureName3);
  const subFeatureName4 = EXAM_MANAGEMENT_SUB_FEATURE_4;
  const subUserRole4 = getSubRole(roleType?.subFeatures, subFeatureName4);
  // console.log(userRole);

  const EC = [
    // {
    //   path: SUPER_ADMIN_EXAM_MANAGEMENT_PAGE,
    //   element: <ExamManagement />,
    // },
    subUserRole1?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE,
          element: <ExamManagementList />,
        }
      : {},
    subUserRole1?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE,
          element: <CreateExamCenter />,
        }
      : {},
    subUserRole1?.permissions?.["3"]
      ? {
          path: `${SUPER_ADMIN_EDIT_EXAM_CENTER_PAGE}/:examCenterId`,
          element: <EditExamCenter />,
        }
      : {},
  ];

  // Batch

  const B = [
    true
      ? {
          path: SUPER_ADMIN_ALL_BATCHES_REQUEST,
          element: <BatchRequest />,
        }
      : {},
    /* {
      path: SUPER_ADMIN_ALL_BATCHES,
      element: <BatchRequest />,
    }, */
    {
      path: `${SUPER_ADMIN_LIVE_MONITORING__CANDIDATE_PAGE}/:id`,
      element: <LiveMonitoringCandidate />,
    },
    subUserRole2?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_CREATE_BATCH_PAGE,
          element: <CreateBatch />,
        }
      : {},
    subUserRole2?.permissions?.["3"]
      ? {
          path: `${SUPER_ADMIN_EDIT_BATCH_PAGE}/:id`,
          element: <EditBatch />,
        }
      : {},
    {
      path: `${SUPER_ADMIN_ASSESSMENT_STATS}/:assesmentStatsId/:batchId`,
      // path: SUPER_ADMIN_ASSESSMENT_STATS,
      element: <AssessmentStats />,
    },
  ];
  // console.log(B);

  const AB = [
    true
      ? {
          path: SUPER_ADMIN_ASSESSMENT_BATCH,
          element: <AssessmentBatch />,
        }
      : {},
  ];

  const ASMT = [
    subUserRole4?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
          element: <AssessmentList />,
        }
      : {},
    {
      path: `${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/:assessmentId/:setId`,
      element: <AssessmentPreview />,
    },
    {
      path: `${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/:previewType`,
      element: <VivaAssessmentPreview />,
    },
  ];

  const isEXCEnabled = subUserRole1?.enabled || false;
  const isBAEnabled = subUserRole2?.enabled || false;
  const isASBAEnabled = subUserRole3?.enabled || false;
  const isASMTEnabled = subUserRole4?.enabled || false;

  const resultArray =
    roleType?.enabled === true &&
    (isEXCEnabled || isBAEnabled || isASBAEnabled || isASMTEnabled)
      ? (isEXCEnabled ? EC : [])
          .concat(isBAEnabled ? B : [])
          .concat(isASBAEnabled ? AB : [])
          .concat(isASMTEnabled ? ASMT : [])
      : [];

  return resultArray;
};

//Report And Analytics Routes
// const REPORT_AND_ANALYTICS_ROUTES = [
//   {
//     path: SUPER_ADMIN_REPORT_AND_ANALYTICS,
//     element: <ReportAndAnalytics />,
//   },
//   {
//     path: `${SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW}/:id`,
//     element: <CandidateResultPreview />,
//   },
// ];

//User Management Routes
const USER_MANAGEMENT_ROUTES = (userRole) => {
  const featureName = USER_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = USER_MANAGEMENT_SUB_FEATURE_1;
  const subUserRole1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const subFeatureName2 = USER_MANAGEMENT_SUB_FEATURE_2;
  const subUserRole2 = getSubRole(roleType?.subFeatures, subFeatureName2);
  const subFeatureName3 = USER_MANAGEMENT_SUB_FEATURE_3;
  const subUserRole3 = getSubRole(roleType?.subFeatures, subFeatureName3);

  const UR = [
    subUserRole1?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE,
          element: <UserManagementUsersList />,
        }
      : {},
    subUserRole1?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_USER_MANAGEMENT_CREATE_USER_PAGE,
          element: <CreateUser />,
        }
      : {},
    {
      path: `${SUPER_ADMIN_USER_MANAGEMENT_EDIT_USER_PAGE}/:userId`,
      element: <EditUser />,
    },
  ];

  const RP = [
    subUserRole2?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_LIST_PAGE,
          element: <RoleAndPermissionList />,
        }
      : false,
    subUserRole2?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_PAGE,
          element: <UserManagementRoleAndPermission />,
        }
      : {},
    {
      path: `${SUPER_ADMIN_USER_MANAGEMENT_EDIT_ROLE_AND_PERMISSION_PAGE}/:roleId`,
      element: <EditUserManagementRoleAndPermission />,
    },
    {
      path: `${SUPER_ADMIN_USER_MANAGEMENT_EDIT_ASSIGNED_PERMISSION_PAGE}/:roleId`,
      element: <EditUserManagementAssignedPermission />,
    },
  ];

  const DAMA = [
    subUserRole3?.permissions?.["1"]
      ? {
          path: DASHBOARD_MANAGE_LIST,
          element: <DashboardManageList />,
        }
      : {},
    subUserRole3?.permissions?.["2"]
      ? {
          path: `${DASHBOARD_MANAGE_CREATE_PAGE}`,
          element: <CreateDashboard />,
        }
      : {},
    subUserRole3?.permissions?.["3"]
      ? {
          path: `${DASHBOARD_MANAGE_EDIT_PAGE}/:dashboardId`,
          element: <EditDashboard />,
        }
      : {},
  ];

  const isUREnabled = subUserRole1?.enabled || false;
  const isRPEnabled = subUserRole2?.enabled || false;
  const isDAMAEnabled = subUserRole3?.enabled || false;

  const resultArray =
    roleType?.enabled === true && (isUREnabled || isRPEnabled || isDAMAEnabled)
      ? (isRPEnabled ? RP : [])
          .concat(isUREnabled ? UR : [])
          .concat(isDAMAEnabled ? DAMA : [])
      : [];

  return resultArray;
};

//Lead management
const DEMO_USER_LEADS_MANAGEMENT = (userRole) => {
  const featureName = LEAD_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = LEAD_MANAGEMENT_LIST_FEATURE;
  const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);

  return roleType?.enabled == true && subUserRole?.enabled == true
    ? [
        {
          path: SUPER_ADMIN_USER_DEMO_LEAD_MANAGEMENT,
          element: <DemoUserLeadManagement />,
        },
      ]
    : [];
};

// scheme management
const SCHEME_MANAGEMENT = (userRole) => {
  const featureName = SCHEME_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = SCHEME_MANAGEMENT_LIST_FEATURE_1;
  const subUserRole1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const subFeatureName2 = SCHEME_MANAGEMENT_LIST_FEATURE_2;
  const subUserRole2 = getSubRole(roleType?.subFeatures, subFeatureName2);

  const SL = [
    subUserRole1?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_SCHEME_MANAGEMENT,
          element: <SchemeManagement />,
        }
      : {},
    subUserRole1?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_SCHEME_MANAGEMENT_CREATE_SCHEME,
          element: <SchemeManagementCreateScheme />,
        }
      : {},

    subUserRole1?.permissions?.["3"]
      ? {
          path: `${SUPER_ADMIN_SCHEME_MANAGEMENT_EDIT_SCHEME}/:schemeId`,
          element: <SchemeManagementEditScheme />,
        }
      : {},
  ];

  const SSL = [
    subUserRole2?.permissions?.["1"]
      ? {
          path: SUPER_ADMIN_SUB_SCHEME_MANAGEMENT,
          element: <SchemeManagement />,
        }
      : {},
    subUserRole2?.permissions?.["2"]
      ? {
          path: SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_CREATE_SCHEME,
          element: <SchemeManagementCreateSubScheme />,
        }
      : {},
    subUserRole2?.permissions?.["3"]
      ? {
          path: `${SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_EDIT_SUB_SCHEME}/:subSchemeId`,
          element: <SchemeManagementEditSubScheme />,
        }
      : {},
  ];

  const isSLEnabled = subUserRole1?.enabled || false;
  const isSSLEnabled = subUserRole2?.enabled || false;

  if (roleType?.enabled === true && (isSLEnabled || isSSLEnabled)) {
    return (isSLEnabled ? SL : []).concat(isSSLEnabled ? SSL : []);
  }

  return [];
};

const ASSESSOR_ATTENDANCE_ROUTES = (userRole) => {
  const featureName = ASSESSOR_ATTENDANCE_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = ASSESSOR_ATTENDANCE_LIST_FEATURE_1;
  const subUserRole1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const subFeatureName2 = ASSESSOR_ATTENDANCE_LIST_FEATURE_2;
  const subUserRole2 = getSubRole(roleType?.subFeatures, subFeatureName2);

  const AL = [
    subUserRole1?.permissions?.["1"]
      ? {
          path: ASSESSOR_ATTENDANCE_LIST,
          element: <AssessorAttendanceList />,
        }
      : {},
    {
      path: `${SINGLE_ASSESSOR_ATTENDANCE_PAGE}/:assessorId`,
      element: <SingleAssessorAttendanceLogList />,
    },
  ];

  const ARL = [
    subUserRole1?.permissions?.["1"]
      ? {
          path: ASSESSOR_ATTENDANCE_REGULARIZE_PAGE,
          element: <AttendanceRegularizPage />,
        }
      : {},
  ];

  const isALEnabled = subUserRole1?.enabled || false;
  const isATRLEnabled = subUserRole2?.enabled || false;

  if (roleType?.enabled === true && (isALEnabled || isATRLEnabled)) {
    return (isALEnabled ? AL : []).concat(isATRLEnabled ? ARL : []);
  }
  return [];
};

// Instructions Routes
const INSTRUCTIONS_ROUTES = (userRole) => {
  const featureName = INSTRUCTIONS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = INSTRUCTIONS_LIST_FEATURE;
  const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);
  return roleType?.enabled == true && subUserRole?.enabled == true
    ? [
        subUserRole?.permissions?.["1"]
          ? {
              path: INSTRUCTIONS_LIST,
              element: <InstructionsList />,
            }
          : {},
        {
          path: `${GENERAL_INSTRUCTIONS}/:instructionId`,
          element: <GeneralInstructions />,
        },
      ]
    : [];
};

// Assessor Management Routes
const ASSESSOR_MANAGEMENT_ROUTES = (userRole) => {
  const featureName = ASSESSOR_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = ASSESSOR_MANAGEMENT_LIST_FEATURE;
  const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);

  return roleType?.enabled == true && subUserRole?.enabled == true
    ? [
        subUserRole?.permissions?.["1"]
          ? {
              path: ASSESSOR_MANAGEMENT_HOME,
              element: <AssessorManagementHome />,
            }
          : {},
        subUserRole?.permissions?.["2"]
          ? {
              path: ASSESSOR_MANAGEMENT_ADD_NEW,
              element: <AssessorManagementAddNew />,
            }
          : // {
            //   path: ASSESSOR_MANAGEMENT_ADD_BULK_UPLOAD,
            //   element: <AssessorManagementAddBulkUpload />,
            // }

            {},

        subUserRole?.permissions?.["2"]
          ? {
              path: ASSESSOR_MANAGEMENT_ADD_BULK_UPLOAD,
              element: <AssessorManagementAddBulkUpload />,
            }
          : {},
        subUserRole?.permissions?.["3"]
          ? {
              path: `${ASSESSOR_MANAGEMENT_UPDATE}/:id`,
              element: <AssessorManagementUpdate />,
            }
          : {},
        subUserRole?.permissions?.["3"] // Need to create a new ID for this permission
          ? {
              path: `${ASSESSOR_MANAGEMENT_VIEW}/:id`,
              element: <AssessorManagementView />,
            }
          : {},
      ]
    : [];
};

// verification tab Routes
const VERIFICATION_TAB_ROUTES = (userRole) => {
  const featureName = VERIFICATION_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = VERIFICATION_LIST_FEATURE;
  const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);

  return roleType?.enabled == true && subUserRole?.enabled == true
    ? [
        subUserRole?.permissions?.["1"]
          ? {
              path: VERIFICATION_TAB_LIST_PAGE,
              element: <VerificationList />,
            }
          : {},
        subUserRole?.permissions?.["2"]
          ? {
              path: `${UPLOAD_DOCUMENTS_PAGE}/:batchId/:actionId`,
              element: <UploadDocuments />,
            }
          : {},
      ]
    : [];
};

const REGENERATE_RESULT_TAB_ROUTES = (userRole) => {
  const featureName = REGENERATE_RESULT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = REGENERATE_RESULT_LIST_FEATURE;
  const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);

  return roleType?.enabled == true && subUserRole?.enabled == true
    ? [
        subUserRole?.permissions?.["1"]
          ? {
              path: REGENERATE_RESULT_LIST_PAGE,
              element: <RegenerateResultList />,
            }
          : {},
        subUserRole?.permissions?.["2"]
          ? {
              path: `${FAILED_CANDIDATE_LIST_PAGE}/:batchId`,
              element: <FailedCandidateList />,
            }
          : {},
      ]
    : [];
};

// Results
const RESULT_TAB_ROUTES = (userRole) => {
  const featureName = RESULTS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = RESULTS_SUB_FEATURE_1;
  const subUserRole1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const subFeatureName2 = RESULTS_SUB_FEATURE_2;
  const subUserRole2 = getSubRole(roleType?.subFeatures, subFeatureName2);
  const subFeatureName3 = REGENERATE_RESULT_FEATURE;
  const subUserRole3 = getSubRole(roleType?.subFeatures, subFeatureName3);

  const RERE = [
    subUserRole3?.permissions?.["1"]
      ? {
          path: REGENERATE_RESULT_LIST_PAGE,
          element: <RegenerateResultList />,
        }
      : {},
    subUserRole3?.permissions?.["2"]
      ? {
          path: `${FAILED_CANDIDATE_LIST_PAGE}/:batchId`,
          element: <FailedCandidateList />,
        }
      : {},
  ];

  const ONRE = [
    subUserRole1?.permissions?.["1"]
      ? {
          path: ONLINE_RESULTS_TAB_PAGE,
          element: <OnlineResultsList />,
        }
      : {},
    {
      path: `${CANDIDATE_RESULTS_PAGE}/:id`,
      element: <CandidatesResultList />,
    },
    {
      path: `${SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW}/:id/:candId`,
      element: <CandidateResultPreview />,
    },
    {
      path: `${NOS_WISE_RESULTS_PAGE}/:id`,
      element: <ViewNosWiseResultsList />,
    },
    {
      path: `${NOS_WISE_OFFLINE_PAGE}/:id`,
      element: <ViewNosWiseOfflineResults />,
    },
    {
      path: `${NOS_WISE_RESULTS_MAIN_TABLE}/:batchID/:candID`,
      element: <NosWiseResultTable />,
    },
    {
      path: `${NOS_WISE_OFFLINE_RESULTS_MAIN_TABLE}/:batchID/:candID`,
      element: <NosOfflineResultTable />,
    },
    {
      path: `${OFFLINE_RESULTS_STATS}/:batchID/:candID`,
      element: <OfflineResultStats />,
    },
    {
      path: `${UPDATE_CANDIDATE_RESULT_PAGE}/:batchID/:candID/:qstID`,
      element: <UpdateCandidateResultQuestion />,
    },
  ];

  // Batch
  const OFFRE = [
    subUserRole2?.permissions?.["1"]
      ? {
          path: OFFLINE_RESULTS_TAB_PAGE,
          element: <OfflineResultsList />,
        }
      : {},
    {
      path: `${UPLOAD_OFFLINE_RESULTS}/:id/:batchID/:type`,
      element: <UploadOfflineResults />,
    },
    {
      path: `${UPLOAD_OFFLINE_ANSWER_KEYS}/:id/:batchID/:type`,
      element: <UploadOfflineAnswerKeys />,
    },
  ];

  const isONRECEnabled = subUserRole1?.enabled || false;
  const isOFFREEnabled = subUserRole2?.enabled || false;
  const isREREEnabled = subUserRole3?.enabled || false;

  if (
    roleType?.enabled === true &&
    (isONRECEnabled || isOFFREEnabled || isREREEnabled)
  ) {
    return (isONRECEnabled ? ONRE : [])
      .concat(isOFFREEnabled ? OFFRE : [])
      .concat(isREREEnabled ? RERE : []);
  }

  return [];
};

// Proctor Management Routes
const PROCTOR_MANAGEMENT_ROUTES = (userRole) => {
  const featureName = PROCTOR_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = PROCTOR_LIST_FEATURE;
  const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);
  return roleType?.enabled == true && subUserRole?.enabled == true
    ? [
        subUserRole?.permissions?.["1"]
          ? {
              path: PROCTOR_MANAGEMENT_HOME,
              element: <ProctorManagementHome />,
            }
          : {},
        subUserRole?.permissions?.["2"]
          ? {
              path: PROCTOR_MANAGEMENT_ADD_NEW,
              element: <ProctorManagementAddNew />,
            }
          : {},
        subUserRole?.permissions?.["3"]
          ? {
              path: `${PROCTOR_MANAGEMENT_UPDATE}/:id`,
              element: <ProctorManagementUpdate />,
            }
          : {},
        subUserRole?.permissions?.["2"]
          ? {
              path: `${PROCTOR_MANAGEMENT_BULK_UPLOAD}`,
              element: <ProctorManagementBulkUpload />,
            }
          : {},
      ]
    : [];
};

// Logs Mangement Routes

const LOGS_MANAGEMENT_ROUTES = (userRole) => {
  const featureName = LOG_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = LOG_MANAGEMENT_LIST_FEATURE_1;
  const subUserRole1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const subFeatureName2 = LOG_MANAGEMENT_LIST_FEATURE_2;
  const subUserRole2 = getSubRole(roleType?.subFeatures, subFeatureName2);
  const isALGEnabled = subUserRole2?.enabled || false;
  const isPLGEnabled = subUserRole1?.enabled || false;

  const ACLO = [
    subUserRole2?.permissions?.["1"]
      ? {
          path: LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST_PATH,
          element: <LogsManagementAcitivityLogs />,
        }
      : {},

    {
      path: `${LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST}/:batchId/:sipID`,
      element: <LogsManagementActivityLogsByBatchId />,
    },
    {
      path: `${CANDIDATE_RESULTS_PAGE}/:id`,
      element: <CandidatesResultList />,
    },
    {
      path: `${SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW}/:id/:candId`,
      element: <CandidateResultPreview />,
    },
  ];

  const PRLO = [
    subUserRole1?.permissions?.["1"]
      ? {
          path: LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH,
          element: <LogsManagementProctorLogs />,
        }
      : {},
    {
      path: `${LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH}/:batchId`,
      element: <LogsManagementProctorLogsByCandidate />,
    },
    {
      path: `${LOGS_MANAGEMENT_PROCTOR_IMAGE_BY_CANDIDATE_PATH}/:batchId/:candidateId`,
      element: <LogsManagementImageProctorLogsByCandidate />,
    },
    {
      path: `${LOGS_MANAGEMENT_PROCTOR_VIDEO_BY_CANDIDATE_PATH}/:batchId/:candidateId`,
      element: <LogsManagementVideoProctorLogsByCandidate />,
    },

    // New routes
    {
      path: `${LOGS_MANAGEMENT_PROCTOR_THEORY_BY_CANDIDATE_PATH}/:batchId/:candidateId`,
      element: <SectionWiseroctionDetails />,
    },
  ];

  if (roleType?.enabled === true && (isALGEnabled || isPLGEnabled)) {
    return (isALGEnabled ? ACLO : []).concat(isPLGEnabled ? PRLO : []);
  }

  return [];
};

// Dashboard Manage

const DASHBOARD_MANAGE_ROUTES = (userRole) => {
  const featureName = DASHBOARD_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = DASHBOARD_SUB_FEATURE_1;
  const subUserRole = getSubRole(roleType?.subFeatures, subFeatureName);

  return roleType?.enabled == true && subUserRole?.enabled == true
    ? [
        subUserRole?.permissions?.["1"]
          ? {
              path: DASHBOARD_MANAGE_LIST,
              element: <DashboardManageList />,
            }
          : {},
        subUserRole?.permissions?.["2"]
          ? {
              path: `${DASHBOARD_MANAGE_CREATE_PAGE}`,
              element: <CreateDashboard />,
            }
          : {},
        subUserRole?.permissions?.["3"]
          ? {
              path: `${DASHBOARD_MANAGE_EDIT_PAGE}/:dashboardId`,
              element: <EditDashboard />,
            }
          : {},
      ]
    : [];
};

//skill-assessment
const SKILL_ASSESSEMENT_ROUTES = (userRole) => {
  const featureName = SKILL_ASSESSMENT;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = SKILL_ASSESSMENT_BATCH;
  const subUserRole1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const subFeatureName2 = SKILL_ASSESSMENT_ALL_CANDIDATES;
  const subUserRole2 = getSubRole(roleType?.subFeatures, subFeatureName2);
  const subFeatureName3 = SKILL_ASSESSMENT_ASSESSORS;
  const subUserRole3 = getSubRole(roleType?.subFeatures, subFeatureName3);
  const subFeatureName4 = SKILL_ASSESSMENT_RESULT;
  const subUserRole4 = getSubRole(roleType?.subFeatures, subFeatureName4);
  const isALGEnabled = subUserRole2?.enabled || false;
  const isPLGEnabled = subUserRole1?.enabled || false;
  const isASGEnabled = subUserRole3?.enabled || false;
  const isREGEnabled = subUserRole4?.enabled || false;

  const BA = [
    subUserRole2?.permissions?.["1"]
      ? {
          path: `${SKILL_ASSESSMENT_BATCH_PAGE}`,
          element: <SkillAssessmentBatch />,
        }
      : {},
    {
      path: `${SKILL_ASSESSMENT_BATCH_VIEW_CANDIDATE_PAGE}/:id`,
      element: <SkillAssessmentBatchAllCandidate />,
    },
    {
      path: `${SKILL_ASSESSMENT_BATCH_VIEW_ACTION_PAGE}/:id`,
      element: <SkillAssessmentBatchAction />,
    },
  ];

  const ALCA = [
    subUserRole2?.permissions?.["1"]
      ? {
          path: `${SKILL_ASSESSMENT_All_CANDIDATE_PAGE}`,
          element: <SkillAssessmentAllCandidate />,
        }
      : {},
  ];
  const AS = [
    subUserRole2?.permissions?.["1"]
      ? {
          path: `${SKILL_ASSESSMENT_ASSESSORS_PAGE}`,
          element: <SkillAssessmentAssessors />,
        }
      : {},
    {
      path: `${SKILL_ASSESSMENT_ASSESSORS_USERNAME_PAGE}/:id`,
      element: <SkillAssessmentAssessorsUsername />,
    },
  ];
  const RE = [
    subUserRole2?.permissions?.["1"]
      ? {
          path: `${SKILL_ASSESSMENT_RESULT_PAGE}`,
          element: <SkillAssessmentResults />,
        }
      : {},
    {
      path: `${SKILL_ASSESSMENT_RESULT_VIEW_CANDIDATE_PAGE}/:id`,
      element: <SkillAssessmentResultViewCandidate />,
    },
    {
      path: `${SKILL_ASSESSMENT_RESULT_VIEW_MARKS_PAGE}/:id`,
      element: <SkillAssessmentResultViewMarksCandidate />,
    },
  ];

  if (
    roleType?.enabled === true &&
    (isALGEnabled || isPLGEnabled || isASGEnabled || isREGEnabled)
  ) {
    return (isALGEnabled ? BA : [])
      .concat(isPLGEnabled ? ALCA : [])
      .concat(isASGEnabled ? AS : [])
      .concat(isREGEnabled ? RE : []);
  }

  return [];
};

//Not Found Routes
const NOT_FOUND_ROUTES = [
  {
    path: "*",
    element: <NotFound />,
  },
];
const clientRoutes = (userRole) => {
  return [
    {
      path: "/",
      element: <SuperAdminLayout />,
      children: [
        ...DASHBOARD_ROUTES(userRole),
        ...CLIENT_MANAGEMENT_ROUTES(userRole),
        ...JOB_ROLE_MANAGEMENT_ROUTES(userRole),
        ...USER_MANAGEMENT_ROUTES(userRole),
        ...SCHEME_MANAGEMENT(userRole),
        ...DEMO_USER_LEADS_MANAGEMENT(userRole),
        ...QUESTION_BANK_ROUTES(userRole),
        ...EXAM_MANAGEMENT_ROUTES(userRole),
        ...ASSESSOR_MANAGEMENT_ROUTES(userRole),
        ...INSTRUCTIONS_ROUTES(userRole),
        ...VERIFICATION_TAB_ROUTES(userRole),
        ...REGENERATE_RESULT_TAB_ROUTES(userRole),
        // ...ASSESSMENT_ROUTES(userRole),
        // ...REPORT_AND_ANALYTICS_ROUTES,
        ...RESULT_TAB_ROUTES(userRole),
        ...PROCTOR_MANAGEMENT_ROUTES(userRole),
        ...ALL_BATCHES_ROUTES(userRole),
        ...LOGS_MANAGEMENT_ROUTES(userRole),
        ...ASSESSOR_ATTENDANCE_ROUTES(userRole),
        ...SKILL_ASSESSEMENT_ROUTES(userRole),
        ...MY_PROFILE_ROUTES,
        ...MY_ACCOUNT_ROUTES,
        ...NOT_FOUND_ROUTES,
        // ...DASHBOARD_MANAGE_ROUTES(userRole),
      ],
    },
  ];
};

export default clientRoutes;
