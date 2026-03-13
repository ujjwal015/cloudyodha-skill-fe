import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.css";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { GridLoader, HashLoader } from "react-spinners";
import {
  activitySelector,
  setMenu,
} from "../../../../../redux/slicers/activitySlice";

//skeleton
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";

import { ReactComponent as RolesPermissionIcon } from "../../../../../assets/icons/roles-permission-icon.svg";
import { ReactComponent as SchemeIcon } from "../../../../../assets/icons/git-merge.svg";
import { ReactComponent as UserSubMenu } from "../../../../../assets/icons/chevron-right.svg";

import { ReactComponent as DashboardIcon } from "../../../../../assets/new-icons/Dashboard.svg";
import { ReactComponent as ClientManagement } from "../../../../../assets/new-icons/ClientManagement.svg";
import { ReactComponent as QBmanagementIcon } from "../../../../../assets/new-icons/qbmanagement.svg";
import { ReactComponent as Leads } from "../../../../../assets/new-icons/Leads.svg";
import { ReactComponent as UserManagement } from "../../../../../assets/new-icons/usermanagement.svg";
import { ReactComponent as Assessment } from "../../../../../assets/new-icons/Assessment.svg";
import { ReactComponent as ExamManagementIcon } from "../../../../../assets/new-icons/exammanagement.svg";
import { ReactComponent as InstructionIcon } from "../../../../../assets/new-icons/Instructions.svg";
import { ReactComponent as VerificationIcon } from "../../../../../assets/new-icons/qaverify.svg";
import { ReactComponent as RegenerateResultIcon } from "../../../../../assets/new-icons/regenerateResult.svg";

import { ReactComponent as JobRoleIcon } from "../../../../../assets/new-icons/Jobrole.svg";
import { ReactComponent as ReasultIcon } from "../../../../../assets/new-icons/Result.svg";
import { ReactComponent as ProctorIcon } from "../../../../../assets/new-icons/Proctor.svg";
import { ReactComponent as SkillAssessmentIcon } from "../../../../../assets/new-icons/Proctor.svg";
import {
  SUPER_ADMIN_DASHBOARD_PAGE,
  SUPER_ADMIN_MY_ACCOUNT_PAGE,
  SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
  SUPER_ADMIN_CLIENT_MANAGEMENT_PROFILE_PAGE,
  SUPER_ADMIN_QUESTION_LIST,
  SUPER_ADMIN_QUESTION_ADD,
  SUPER_ADMIN_QUESTION,
  SUPER_ADMIN_QUESTION_BANK_PAGE,
  SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE,
  // SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE,
  SUPER_ADMIN_QUESTION_PREVIEW_PAGE,
  SUPER_ADMIN_BULK_UPLOAD_QUESTION,
  SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
  SUPER_ADMIN_CREATE_ASSESSMENT_PAGE,
  SUPER_ADMIN_REPORT_AND_ANALYTICS,
  SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW,
  SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE,
  SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_PAGE,
  SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE,
  SUPER_ADMIN_EDIT_EXAM_CENTER_PAGE,
  SUPER_ADMIN_CREATE_BATCH_PAGE,
  SUPER_ADMIN_EDIT_BATCH_PAGE,
  SUPER_ADMIN_ASSIGN_BATCH,
  SUPER_ADMIN_LIVE_MONITORING_PAGE,
  SUPER_ADMIN_LIVE_MONITORING__CANDIDATE_PAGE,
  SUPER_ADMIN_ASSESSMENT_STATS,
  SUPER_ADMIN_CLIENT_MANAGEMENT_BULK_UPLOAD,
  SUPER_ADMIN_USER_DEMO_LEAD_MANAGEMENT,
  SUPER_ADMIN_SCHEME_MANAGEMENT,
  SUPER_ADMIN_SCHEME_MANAGEMENT_CREATE_SCHEME,
  SUPER_ADMIN_SUB_SCHEME_MANAGEMENT,
  SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_CREATE_SCHEME,
  SUPER_ADMIN_SCHEME_MANAGEMENT_EDIT_SCHEME,
  SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_EDIT_SUB_SCHEME,
  BDA_JOB_ROLE_PAGE,
  BDA_JOB_ROLE_CREATE_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_CREATE_USER_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_EDIT_USER_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_LIST_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_EDIT_ROLE_AND_PERMISSION_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_EDIT_ASSIGNED_PERMISSION_PAGE,
  ASSESSOR_MANAGEMENT_HOME,
  SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
  SUPER_ADMIN_CREATE_QUESTION_FORM_PAGE,
  SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE,
  INSTRUCTIONS_LIST,
  CREATE_INSTRUCTIONS,
  EDIT_INSTRUCTIONS,
  QUESTION_BANK_NOS,
  SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE,
  VERIFICATION_TAB_LIST_PAGE,
  UPLOAD_DOCUMENTS_PAGE,
  QUESTION_BANK_NOS_UPLOAD,
  QUESTION_BANK_NOS_TABLE,
  ONLINE_RESULTS_TAB_PAGE,
  OFFLINE_RESULTS_TAB_PAGE,
  PROCTOR_MANAGEMENT_HOME,
  SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE,
  SUPER_ADMIN_VIEW_QUESTIONS_PAGE,
  LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST_PATH,
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH,
  ADMIN_CONTENT_DASHBOARD_PAGE,
  ADMIN_HR_DASHBOARD_PAGE,
  ADMIN_OPERATION_DASHBOARD_PAGE,
  ADMIN_QA_DASHBOARD_PAGE,
  ADMIN_MIS_DASHBOARD_PAGE,
  ADMIN_BUSINESS_DASHBOARD_PAGE,
  ADMIN_NCEVT_DASHBOARD_PAGE,
  ADMIN_FINANCE_DASHBOARD_PAGE,
  UPLOAD_OFFLINE_RESULTS,
  UPLOAD_OFFLINE_ANSWER_KEYS,
  ASSESSOR_ATTENDANCE_LIST,
  ASSESSOR_ATTENDANCE_REGULARIZE_PAGE,
  SINGLE_ASSESSOR_ATTENDANCE_PAGE,
  SUPER_ADMIN_ALL_BATCHES,
  SUPER_ADMIN_ASSESSMENT_BATCH,
  SUPER_ADMIN_ALL_BATCHES_REQUEST,
  REGENERATE_RESULT_LIST_PAGE,
  FAILED_CANDIDATE_LIST_PAGE,
  ADMIN_COMMON_DASHBOARD_PAGE,
  DASHBOARD_MANAGE_LIST,
  DASHBOARD_MANAGE_CREATE_PAGE,
  DASHBOARD_MANAGE_EDIT_PAGE,
  SKILL_ASSESSMENT_BATCH_PAGE,
  SKILL_ASSESSMENT_RESULT_PAGE,
  SKILL_ASSESSMENT_All_CANDIDATE_PAGE,
  SKILL_ASSESSMENT_ASSESSORS_PAGE,
  GENERAL_INSTRUCTIONS,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { stayBackFilter } from "../../../../../utils/projectHelper";
import { TramRounded } from "@mui/icons-material";
// import { AssessorAttendanceList } from "../../../../../pages/superAdmin/assessorAttendance";
const {
  DASHBOARD_FEATURE,
  DASHBOARD_SUB_FEATURE_1,
  DASHBOARD_SUB_FEATURE_2,
  DASHBOARD_SUB_FEATURE_3,
  DASHBOARD_SUB_FEATURE_4,
  DASHBOARD_SUB_FEATURE_5,
  DASHBOARD_SUB_FEATURE_6,
  DASHBOARD_SUB_FEATURE_7,
  DASHBOARD_SUB_FEATURE_10,
  CLIENT_MANAGEMENT_FEATURE,
  JOB_ROLE_MANAGEMENT_FEATURE,
  QUESTION_BANK_FEATURE,
  QUESTION_BANK_SUB_FEATURE_1,
  QUESTION_BANK_SUB_FEATURE_2,
  ASSESSMENT_FEATURE,
  EXAM_MANAGEMENT_FEATURE,
  EXAM_MANAGEMENT_SUB_FEATURE_1,
  EXAM_MANAGEMENT_SUB_FEATURE_2,
  EXAM_MANAGEMENT_SUB_FEATURE_3,
  EXAM_MANAGEMENT_SUB_FEATURE_4,
  USER_MANAGEMENT_FEATURE,
  USER_MANAGEMENT_SUB_FEATURE_1,
  USER_MANAGEMENT_SUB_FEATURE_2,
  USER_MANAGEMENT_SUB_FEATURE_3,
  LEAD_MANAGEMENT_FEATURE,
  SCHEME_MANAGEMENT_FEATURE,
  SCHEME_MANAGEMENT_LIST_FEATURE_2,
  INSTRUCTIONS_FEATURE,
  ASSESSOR_MANAGEMENT_FEATURE,
  VERIFICATION_FEATURE,
  RESULTS_FEATURE,
  RESULTS_SUB_FEATURE_1,
  RESULTS_SUB_FEATURE_2,
  REGENERATE_RESULT_FEATURE,
  PROCTOR_FEATURE,
  LOG_MANAGEMENT_FEATURE,
  LOG_MANAGEMENT_LIST_FEATURE_1,
  LOG_MANAGEMENT_LIST_FEATURE_2,
  ASSESSOR_ATTENDANCE_FEATURE,
  ALL_BATCHES_FEATURE,
  ALL_BATCHES_SUB_FEATURE_1,
  ALL_BATCHES_SUB_FEATURE_2,
  SKILL_ASSESSMENT,
  SKILL_ASSESSMENT_BATCH,
  SKILL_ASSESSMENT_ALL_CANDIDATES,
  SKILL_ASSESSMENT_ASSESSORS,
  SKILL_ASSESSMENT_RESULT,
} = ROLESPERMISSIONS;

const SideBar = () => {
  const { pathname: PATH_NAME } = useLocation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const { userInfo = {} } = useSelector(authSelector);
  const userRole = userInfo?.userRole;
  const sidebarItems = [
    // {
    //   label: "Dashboard",
    //   featureName: DASHBOARD_FEATURE,
    //   slug: "dashboard",
    //   icon: <DashboardIcon />,
    //   path: SUPER_ADMIN_DASHBOARD_PAGE,
    //   isActive: PATH_NAME === SUPER_ADMIN_DASHBOARD_PAGE,
    // },

    {
      label: "Dashboard",
      featureName: DASHBOARD_FEATURE,
      slug: "dashboard",
      icon: <DashboardIcon />,
      path: SUPER_ADMIN_DASHBOARD_PAGE,
      isActive: PATH_NAME === SUPER_ADMIN_DASHBOARD_PAGE,
      // ||
      // PATH_NAME.includes(ADMIN_BUSINESS_DASHBOARD_PAGE) ||
      // PATH_NAME.includes(ADMIN_NCEVT_DASHBOARD_PAGE) ||
      // PATH_NAME.includes(ADMIN_CONTENT_DASHBOARD_PAGE) ||
      // PATH_NAME.includes(ADMIN_HR_DASHBOARD_PAGE) ||
      // PATH_NAME.includes(ADMIN_OPERATION_DASHBOARD_PAGE) ||
      // PATH_NAME.includes(ADMIN_QA_DASHBOARD_PAGE) ||
      // PATH_NAME.includes(ADMIN_MIS_DASHBOARD_PAGE) ||
      // PATH_NAME.includes(ADMIN_FINANCE_DASHBOARD_PAGE),

      // submenu: [
      // {
      //   label: "Dashboard",
      //   subFeatureName: DASHBOARD_SUB_FEATURE_1,
      //   slug: "dashboard",
      //   path: ADMIN_COMMON_DASHBOARD_PAGE,
      //   isActive: true,
      // },
      // {
      //   label: "Business Dashboard",
      //   subFeatureName: DASHBOARD_SUB_FEATURE_1,
      //   slug: "businessDashboard",
      //   path: ADMIN_BUSINESS_DASHBOARD_PAGE,
      //   isActive: PATH_NAME === ADMIN_BUSINESS_DASHBOARD_PAGE,
      // },
      // {
      //   label: "NCVET Dashboard",
      //   subFeatureName: DASHBOARD_SUB_FEATURE_10,
      //   slug: "ncvetDashboard",
      //   path: ADMIN_NCEVT_DASHBOARD_PAGE,
      //   isActive: PATH_NAME === ADMIN_NCEVT_DASHBOARD_PAGE,
      // },
      // {
      //   label: "Content Dashboard",
      //   subFeatureName: DASHBOARD_SUB_FEATURE_2,
      //   slug: "contentDashboard",
      //   path: ADMIN_CONTENT_DASHBOARD_PAGE,
      //   isActive: PATH_NAME === ADMIN_CONTENT_DASHBOARD_PAGE,
      // },
      // {
      //   label: "HR Dashboard",
      //   subFeatureName: DASHBOARD_SUB_FEATURE_3,
      //   slug: "hrDashboard",
      //   path: ADMIN_HR_DASHBOARD_PAGE,
      //   isActive: PATH_NAME === ADMIN_HR_DASHBOARD_PAGE,
      // },
      // {
      //   label: "Operation Dashboard",
      //   subFeatureName: DASHBOARD_SUB_FEATURE_4,
      //   slug: "operationDashboard",
      //   path: ADMIN_OPERATION_DASHBOARD_PAGE,
      //   isActive: PATH_NAME === ADMIN_OPERATION_DASHBOARD_PAGE,
      // },
      // {
      //   label: "QA Dashboard",
      //   subFeatureName: DASHBOARD_SUB_FEATURE_5,
      //   slug: "qaDashboard",
      //   path: ADMIN_QA_DASHBOARD_PAGE,
      //   isActive: PATH_NAME === ADMIN_QA_DASHBOARD_PAGE,
      // },
      // {
      //   label: "MIS Dashboard",
      //   subFeatureName: DASHBOARD_SUB_FEATURE_6,
      //   slug: "misDashboard",
      //   path: ADMIN_MIS_DASHBOARD_PAGE,
      //   isActive: PATH_NAME === ADMIN_MIS_DASHBOARD_PAGE,
      // },
      // {
      //   label: "Finance Dashboard",
      //   subFeatureName: DASHBOARD_SUB_FEATURE_7,
      //   slug: "financeDashboard",
      //   path: ADMIN_FINANCE_DASHBOARD_PAGE,
      //   isActive: PATH_NAME === ADMIN_FINANCE_DASHBOARD_PAGE,
      // },
      // ],
    },
    {
      label: "Client Management",
      featureName: CLIENT_MANAGEMENT_FEATURE,
      slug: "client",
      icon: <ClientManagement />,
      path: SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
      isActive:
        PATH_NAME === SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE ||
        PATH_NAME === SUPER_ADMIN_CLIENT_MANAGEMENT_PROFILE_PAGE ||
        PATH_NAME === SUPER_ADMIN_CLIENT_MANAGEMENT_BULK_UPLOAD,
    },
    {
      label: "Jobrole Management",
      featureName: JOB_ROLE_MANAGEMENT_FEATURE,
      slug: "JobRoleManagement",
      icon: <JobRoleIcon />,
      path: BDA_JOB_ROLE_PAGE,
      isActive:
        PATH_NAME === BDA_JOB_ROLE_PAGE ||
        PATH_NAME === BDA_JOB_ROLE_CREATE_PAGE ||
        PATH_NAME.includes(BDA_JOB_ROLE_CREATE_PAGE),
    },
    {
      label: "Scheme Management",
      featureName: SCHEME_MANAGEMENT_FEATURE,
      slug: "schemeManagement",
      icon: <SchemeIcon />,
      path: SUPER_ADMIN_SCHEME_MANAGEMENT,
      isActive:
        PATH_NAME === SUPER_ADMIN_SCHEME_MANAGEMENT ||
        PATH_NAME.includes(SUPER_ADMIN_SCHEME_MANAGEMENT_CREATE_SCHEME) ||
        PATH_NAME.includes(SUPER_ADMIN_SUB_SCHEME_MANAGEMENT) ||
        PATH_NAME.includes(SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_CREATE_SCHEME) ||
        PATH_NAME.includes(SUPER_ADMIN_SCHEME_MANAGEMENT_EDIT_SCHEME) ||
        PATH_NAME.includes(SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_EDIT_SUB_SCHEME),
    },
    {
      label: "Leads Management",
      featureName: LEAD_MANAGEMENT_FEATURE,
      slug: "leadManagement",
      icon: <Leads />,
      path: SUPER_ADMIN_USER_DEMO_LEAD_MANAGEMENT,
      isActive: PATH_NAME === SUPER_ADMIN_USER_DEMO_LEAD_MANAGEMENT,
    },
    {
      label: "QB Management",
      featureName: QUESTION_BANK_FEATURE,
      slug: "qbManagement",
      icon: <QBmanagementIcon />,
      path: "#",
      isActive:
        PATH_NAME === SUPER_ADMIN_QUESTION_BANK_PAGE ||
        // PATH_NAME === SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE ||
        PATH_NAME === SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE ||
        PATH_NAME === SUPER_ADMIN_QUESTION_LIST ||
        PATH_NAME === SUPER_ADMIN_QUESTION_ADD ||
        PATH_NAME === SUPER_ADMIN_QUESTION ||
        PATH_NAME === SUPER_ADMIN_QUESTION_FORM_LIST_PAGE ||
        PATH_NAME.includes(SUPER_ADMIN_BULK_UPLOAD_QUESTION) ||
        PATH_NAME.includes(SUPER_ADMIN_QUESTION_FORM_LIST_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_QUESTION_PREVIEW_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_CREATE_QUESTION_FORM_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE) ||
        PATH_NAME.includes(QUESTION_BANK_NOS) ||
        PATH_NAME.includes(QUESTION_BANK_NOS_UPLOAD) ||
        PATH_NAME.includes(SUPER_ADMIN_VIEW_QUESTIONS_PAGE) ||
        PATH_NAME.includes(QUESTION_BANK_NOS_TABLE) ||
        PATH_NAME.includes(SUPER_ADMIN_QUESTION),
      submenu: [
        {
          label: "Assessment Blueprint",
          subFeatureName: QUESTION_BANK_SUB_FEATURE_2,
          slug: "nosCreation",
          path: QUESTION_BANK_NOS,
          isActive:
            PATH_NAME === QUESTION_BANK_NOS ||
            PATH_NAME.includes(QUESTION_BANK_NOS_TABLE) ||
            PATH_NAME.includes(QUESTION_BANK_NOS_UPLOAD),
        },
        {
          label: "Question Bank",
          subFeatureName: QUESTION_BANK_SUB_FEATURE_1,
          slug: "questionBank",
          path: SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
          isActive:
            PATH_NAME === SUPER_ADMIN_QUESTION_FORM_LIST_PAGE ||
            PATH_NAME.includes(SUPER_ADMIN_QUESTION_FORM_LIST_PAGE) ||
            PATH_NAME.includes(SUPER_ADMIN_CREATE_QUESTION_FORM_PAGE) ||
            PATH_NAME.includes(SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE) ||
            PATH_NAME.includes(SUPER_ADMIN_VIEW_QUESTIONS_PAGE) ||
            PATH_NAME.includes(SUPER_ADMIN_QUESTION),
        },
      ],
    },
    // {
    //   label: "Assessment",
    //   featureName: ASSESSMENT_FEATURE,
    //   slug: "assessment",
    //   icon: <Assessment />,
    //   path: SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
    //   isActive:
    //     PATH_NAME === SUPER_ADMIN_ASSESSMENT_LIST_PAGE ||
    //     PATH_NAME === SUPER_ADMIN_CREATE_ASSESSMENT_PAGE ||
    //     PATH_NAME.includes(SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE) ||
    //     PATH_NAME.includes(SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE),
    // },
    // {
    //   label: "Assessment Result",
    //   slug: "assessment-result",
    //   icon: <ExamManagementIcon />,
    //   path: "/",
    //   isActive: false,
    // },
    {
      label: "Exam Management",
      featureName: EXAM_MANAGEMENT_FEATURE,
      slug: "examManagement",
      icon: <ExamManagementIcon />,
      path: "#",
      isActive:
        PATH_NAME === SUPER_ADMIN_EXAM_MANAGEMENT_PAGE ||
        PATH_NAME === SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE ||
        PATH_NAME === SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE ||
        PATH_NAME.includes(SUPER_ADMIN_EDIT_EXAM_CENTER_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_LIVE_MONITORING_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_LIVE_MONITORING__CANDIDATE_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_ASSESSMENT_STATS) ||
        PATH_NAME.includes(SUPER_ADMIN_CREATE_BATCH_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_EDIT_BATCH_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_ASSIGN_BATCH) ||
        PATH_NAME.includes(SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_ASSESSMENT_LIST_PAGE) ||
        PATH_NAME.includes(SUPER_ADMIN_ALL_BATCHES_REQUEST),
      submenu: [
        {
          label: "Exam Centre",
          subFeatureName: EXAM_MANAGEMENT_SUB_FEATURE_1,
          slug: "examManagement",
          path: SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE,
          isActive: PATH_NAME === SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE,
        },
        {
          label: "Create Batch",
          subFeatureName: EXAM_MANAGEMENT_SUB_FEATURE_2,
          slug: "examManagement",
          path: SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE,
          isActive: PATH_NAME === SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE,
        },
        {
          label: "Assign Candidate",
          subFeatureName: EXAM_MANAGEMENT_SUB_FEATURE_3,
          slug: "examManagement",
          path: SUPER_ADMIN_ASSIGN_BATCH,
          isActive:
            PATH_NAME === SUPER_ADMIN_ASSIGN_BATCH ||
            PATH_NAME.includes(SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE),
        },
        {
          label: "Preview Assessment",
          subFeatureName: EXAM_MANAGEMENT_SUB_FEATURE_4,
          slug: "examManagement",
          path: SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
          isActive:
            PATH_NAME === SUPER_ADMIN_ASSESSMENT_LIST_PAGE ||
            PATH_NAME === SUPER_ADMIN_CREATE_ASSESSMENT_PAGE ||
            PATH_NAME.includes(SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE) ||
            PATH_NAME.includes(SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE),
        },
        {
          label: "Batch Request",
          subFeatureName: ALL_BATCHES_SUB_FEATURE_1,
          slug: "allBatches",
          path: SUPER_ADMIN_ALL_BATCHES_REQUEST,
          isActive: PATH_NAME === SUPER_ADMIN_ALL_BATCHES_REQUEST,
        },
        {
          label: "Batch Status",
          subFeatureName: ALL_BATCHES_SUB_FEATURE_2,
          slug: "allBatches",
          path: SUPER_ADMIN_ASSESSMENT_BATCH,
          isActive: PATH_NAME === SUPER_ADMIN_ASSESSMENT_BATCH,
        },
      ],
    },
    // {
    //   label: "Roles & Permissions",
    //   slug: "role-and-permission",
    //   icon: <RolesPermissionIcon />,
    //   path: "/",
    //   isActive: false,
    // },
    // {
    //   label: "Report & Analytics",
    //   slug: "report-and-analytics",
    //   icon: <FileTextIcon />,
    //   path: SUPER_ADMIN_REPORT_AND_ANALYTICS,
    //   isActive:
    //     PATH_NAME === SUPER_ADMIN_REPORT_AND_ANALYTICS ||
    //     PATH_NAME.includes(SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW),
    // },
    // {
    //   label: "Subscription Billing",
    //   slug: "subscription-billing",
    //   icon: <BillingIcon />,
    //   path: "/",
    //   isActive: false,
    // },
    // {
    //   label: "Settings",
    //   slug: "settings",
    //   icon: <SettingsIcon />,
    //   path: "/",
    //   isActive: false,
    // },
    // {
    //   label: "My Account",
    //   slug: "my-account",
    //   icon: <MyAccountIcon />,
    //   path: SUPER_ADMIN_MY_ACCOUNT_PAGE,
    //   isActive: PATH_NAME === SUPER_ADMIN_MY_ACCOUNT_PAGE,
    // },
    {
      label: "Assessor Management",
      featureName: ASSESSOR_MANAGEMENT_FEATURE,
      slug: "assesorManagement",
      icon: <RolesPermissionIcon />,
      path: ASSESSOR_MANAGEMENT_HOME,
      isActive:
        PATH_NAME === ASSESSOR_MANAGEMENT_HOME ||
        PATH_NAME.includes(ASSESSOR_MANAGEMENT_HOME),
    },
    {
      label: "Proctor Management",
      featureName: PROCTOR_FEATURE,
      slug: "assesorManagement",
      icon: <ProctorIcon />,
      path: PROCTOR_MANAGEMENT_HOME,
      isActive:
        PATH_NAME === PROCTOR_MANAGEMENT_HOME ||
        PATH_NAME.includes(PROCTOR_MANAGEMENT_HOME),
    },
    // {
    //   label: "All Batches",
    //   featureName: ALL_BATCHES_FEATURE,
    //   slug: "allBatches",
    //   icon: <ExamManagementIcon />,
    //   path: "#",
    //   isActive:
    //     PATH_NAME === SUPER_ADMIN_ALL_BATCHES_REQUEST ||
    //     PATH_NAME === SUPER_ADMIN_ASSESSMENT_BATCH,
    //   submenu: [
    //     {
    //       label: "Batch Request",
    //       subFeatureName: ALL_BATCHES_SUB_FEATURE_1,
    //       slug: "allBatches",
    //       path: SUPER_ADMIN_ALL_BATCHES_REQUEST,
    //       isActive: PATH_NAME === SUPER_ADMIN_ALL_BATCHES_REQUEST,
    //     },
    //     {
    //       label: "Assessment Status",
    //       subFeatureName: ALL_BATCHES_SUB_FEATURE_2,
    //       slug: "allBatches",
    //       path: SUPER_ADMIN_ASSESSMENT_BATCH,
    //       isActive: PATH_NAME === SUPER_ADMIN_ASSESSMENT_BATCH,
    //     },
    //   ],
    // },
    {
      label: "Instructions",
      featureName: INSTRUCTIONS_FEATURE,
      slug: "instruction",
      icon: <InstructionIcon />,
      path: INSTRUCTIONS_LIST,
      isActive:
        PATH_NAME === INSTRUCTIONS_LIST ||
        PATH_NAME.includes(CREATE_INSTRUCTIONS) ||
        PATH_NAME.includes(EDIT_INSTRUCTIONS) ||
        PATH_NAME.includes(GENERAL_INSTRUCTIONS),
    },
    {
      label: "Verification Tab",
      featureName: VERIFICATION_FEATURE,
      slug: "verificationTab",
      icon: <VerificationIcon />,
      path: VERIFICATION_TAB_LIST_PAGE,
      // path: '#',
      isActive:
        PATH_NAME === VERIFICATION_TAB_LIST_PAGE ||
        PATH_NAME.includes(UPLOAD_DOCUMENTS_PAGE),
    },

    {
      label: "Results",
      featureName: RESULTS_FEATURE,
      slug: "",
      icon: <ReasultIcon />,
      path: "#",
      isActive:
        PATH_NAME === ONLINE_RESULTS_TAB_PAGE ||
        PATH_NAME.includes(OFFLINE_RESULTS_TAB_PAGE) ||
        PATH_NAME.includes(ONLINE_RESULTS_TAB_PAGE) ||
        PATH_NAME.includes(UPLOAD_OFFLINE_RESULTS) ||
        PATH_NAME.includes(UPLOAD_OFFLINE_ANSWER_KEYS) ||
        PATH_NAME.includes(SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW),
      submenu: [
        {
          label: "Online Batch",
          subFeatureName: RESULTS_SUB_FEATURE_1,
          slug: "nosCreation",
          path: ONLINE_RESULTS_TAB_PAGE,
          isActive:
            PATH_NAME === ONLINE_RESULTS_TAB_PAGE ||
            PATH_NAME.includes(ONLINE_RESULTS_TAB_PAGE) ||
            PATH_NAME.includes(SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW) ||
            PATH_NAME.includes(UPLOAD_OFFLINE_RESULTS && "/online"),
        },
        {
          label: "Offline Batch",
          subFeatureName: RESULTS_SUB_FEATURE_2,
          slug: "questionBank",
          path: OFFLINE_RESULTS_TAB_PAGE,
          isActive:
            PATH_NAME === OFFLINE_RESULTS_TAB_PAGE ||
            PATH_NAME.includes(OFFLINE_RESULTS_TAB_PAGE) ||
            PATH_NAME.includes(UPLOAD_OFFLINE_RESULTS && "/offline") ||
            PATH_NAME.includes(UPLOAD_OFFLINE_ANSWER_KEYS && "/offline"),

        },
      ],
    },

    {
      label: "User Management",
      featureName: USER_MANAGEMENT_FEATURE,
      slug: "userManagement",
      icon: <UserManagement />,
      path: "#",
      isActive:
        PATH_NAME ===
          SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_LIST_PAGE ||
        PATH_NAME === SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE ||
        PATH_NAME === SUPER_ADMIN_USER_MANAGEMENT_CREATE_USER_PAGE ||
        PATH_NAME.includes(SUPER_ADMIN_USER_MANAGEMENT_EDIT_USER_PAGE) ||
        PATH_NAME.includes(
          SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_PAGE
        ) ||
        PATH_NAME.includes(
          SUPER_ADMIN_USER_MANAGEMENT_EDIT_ROLE_AND_PERMISSION_PAGE
        ) ||
        PATH_NAME.includes(
          SUPER_ADMIN_USER_MANAGEMENT_EDIT_ASSIGNED_PERMISSION_PAGE
        ) ||
        PATH_NAME.includes(DASHBOARD_MANAGE_LIST),
      submenu: [
        {
          label: "Role Management",
          subFeatureName: USER_MANAGEMENT_SUB_FEATURE_2,
          slug: "roleManagement",
          path: SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_LIST_PAGE,
          isActive:
            PATH_NAME ===
            SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_LIST_PAGE,
        },
        {
          label: "Users",
          subFeatureName: USER_MANAGEMENT_SUB_FEATURE_1,
          slug: "users",
          path: SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE,
          isActive: PATH_NAME === SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE,
        },
        {
          label: "Dashboard Manage",
          subFeatureName: USER_MANAGEMENT_SUB_FEATURE_3,
          slug: "dashboardManage",
          path: DASHBOARD_MANAGE_LIST,
          isActive:
            PATH_NAME === DASHBOARD_MANAGE_LIST ||
            PATH_NAME.includes(DASHBOARD_MANAGE_CREATE_PAGE) ||
            PATH_NAME.includes(DASHBOARD_MANAGE_EDIT_PAGE),
        },
      ],
    },
    {
      label: "Logs Management",
      featureName: LOG_MANAGEMENT_FEATURE,
      slug: "logsManagement",
      icon: <UserManagement />, //Need to change icon
      path: "#",
      isActive:
        PATH_NAME === LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST_PATH ||
        PATH_NAME.includes(
          LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH
        ),
      submenu: [
        {
          label: "Activity Logs",
          subFeatureName: LOG_MANAGEMENT_LIST_FEATURE_2,
          slug: "activityLogs",
          path: LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST_PATH,
          isActive: PATH_NAME === LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST_PATH,
        },
        {
          label: "Proctor Logs",
          subFeatureName: LOG_MANAGEMENT_LIST_FEATURE_1,
          slug: "proctorLogs",
          path: LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH,
          isActive:
            PATH_NAME ===
            LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH,
        },
      ],
    },
    {
      label: "Attendance",
      featureName: ASSESSOR_ATTENDANCE_FEATURE,
      slug: "attendanceTab",
      icon: <VerificationIcon />,
      path: ASSESSOR_ATTENDANCE_LIST,
      isActive:
        PATH_NAME === ASSESSOR_ATTENDANCE_LIST ||
        PATH_NAME.includes(ASSESSOR_ATTENDANCE_REGULARIZE_PAGE) ||
        PATH_NAME.includes(SINGLE_ASSESSOR_ATTENDANCE_PAGE),
    },
    {
      label: "Admin Console",
      featureName: REGENERATE_RESULT_FEATURE,
      slug: "regenerateResult",
      icon: <RegenerateResultIcon />,
      path: REGENERATE_RESULT_LIST_PAGE,
      isActive:
        PATH_NAME === REGENERATE_RESULT_LIST_PAGE ||
        PATH_NAME.includes(FAILED_CANDIDATE_LIST_PAGE),
    },
    // {
    //   label: "Dashboard Manage",
    //   featureName: ASSESSOR_ATTENDANCE_FEATURE,
    //   slug: "attendanceTab",
    //   icon: <VerificationIcon />,
    //   path: DASHBOARD_MANAGE_LIST,
    //   isActive:
    //     PATH_NAME === DASHBOARD_MANAGE_LIST ||
    //     PATH_NAME.includes(DASHBOARD_MANAGE_CREATE_PAGE) ||
    //     PATH_NAME.includes(DASHBOARD_MANAGE_EDIT_PAGE),
    // },
    {
      label: "Skill Assessment",
      featureName: SKILL_ASSESSMENT,
      slug: "skillAssessment",
      icon: <SkillAssessmentIcon />,
      path: "#",
      isActive:
        PATH_NAME === SKILL_ASSESSMENT_BATCH_PAGE ||
        PATH_NAME === SKILL_ASSESSMENT_RESULT_PAGE,
      submenu: [
        {
          label: "Batch",
          subFeatureName: SKILL_ASSESSMENT_BATCH,
          slug: "skillAssessmentBatch",
          path: SKILL_ASSESSMENT_BATCH_PAGE,
          isActive: PATH_NAME === SKILL_ASSESSMENT_BATCH_PAGE,
        },
        {
          label: "All Candidate",
          subFeatureName: SKILL_ASSESSMENT_ALL_CANDIDATES,
          slug: "skillAssessmentAllCandidate",
          path: SKILL_ASSESSMENT_All_CANDIDATE_PAGE,
          isActive: PATH_NAME === SKILL_ASSESSMENT_All_CANDIDATE_PAGE,
        },
        {
          label: "Assessors",
          subFeatureName: SKILL_ASSESSMENT_ASSESSORS,
          slug: "skillAssessmentAssessors",
          path: SKILL_ASSESSMENT_ASSESSORS_PAGE,
          isActive: PATH_NAME === SKILL_ASSESSMENT_ASSESSORS_PAGE,
        },
        {
          label: "Results",
          subFeatureName: SKILL_ASSESSMENT_RESULT,
          slug: "skillAssessmentResults",
          path: SKILL_ASSESSMENT_RESULT_PAGE,
          isActive: PATH_NAME === SKILL_ASSESSMENT_RESULT_PAGE,
        },
      ],
    },
  ];
  const menuState = useSelector(activitySelector);
  const handleMenuClose = () => {
    dispatch(setMenu(false));
  };

  const handleMenuClick = (slug, submenu) => {
    if (submenu) {
      if (openSubMenu === slug) {
        setOpenSubMenu(null);
        setActiveTab(null); // Clear active main menu when submenu is closed
      } else {
        setOpenSubMenu(slug);
        setActiveTab(slug); // Set active main menu when submenu is opened
      }
    } else {
      setOpenSubMenu(null);
      setActiveTab(slug); // Set active main menu
    }
  };

  const enabledFeatures = userRole
    ?.filter(
      (userData) =>
        userData?.enabled &&
        !userData?.subFeatures?.every((item) => !item?.enabled)
    )
    ?.map((userData) => userData?.featureName);

  if (!enabledFeatures?.includes("dashboard")) {
    enabledFeatures?.push("dashboard");
  }

  const enabledSubfeatures = userRole
    ?.filter((userData) => userData?.enabled && userData?.subFeatures)
    ?.map((userData) => userData?.subFeatures)
    ?.reduce((acc, subFeatures) => acc?.concat(subFeatures), [])
    ?.filter((userData) => userData.enabled);

  const FilteredSideBarItems = sidebarItems?.filter((item) => {
    if (enabledFeatures?.includes(item?.featureName)) {
      return true;
    }
    return false;
  });

  const defaultRoute = { label: "Dashboard", isActive: true };
  const activeRoute = sidebarItems?.find((route) => {
    if (route.isActive == true) return route || defaultRoute;
  });
  const { label = "Dashboard", isActive } = activeRoute ?? {
    label: "Dashboard",
    isActive: true,
  };
  localStorage.setItem("activeRoute", JSON.stringify({ label, isActive }));

  useEffect(() => {
    const isActiveFilter = JSON.parse(localStorage.getItem("activeRoute"));
    const { label } = isActiveFilter;
    stayBackFilter(label);
  }, [label]);

  const FilteredSubMenu = (submenu) => {
    return submenu?.filter((subitem) => {
      return enabledSubfeatures?.find(
        (item) => item?.subFeatureName === subitem?.subFeatureName
      );
    });
  };

  window.onclick = function (event) {
    if (event.target.id === "overlay") {
      handleMenuClose();
    }
  };

  return (
    <>
      <div
        className={`dashboard-leftsidebar ${
          menuState.isMenuOpen ? "show" : ""
        }`}
      >
        <div className="menu-box" style={{ float: "right", marginTop: "20px" }}>
          <button className="hamburger-menu" onClick={handleMenuClose}>
            ✖
          </button>
        </div>
        <ul>
          {!loading ? (
            FilteredSideBarItems?.map(
              ({ label, icon, path, isActive, slug, submenu, ...rest }) => {
                if (submenu) {
                  const isOpen = openSubMenu === slug;
                  return (
                    <li
                      key={label}
                      className={`${isActive ? "active-main" : ""} ${
                        openSubMenu === slug ? "open" : ""
                      }`}
                      id={"menu-list-item-" + slug}
                      onClick={() => handleMenuClick(slug, submenu)}
                    >
                      <Link to={path}>
                        <span>{icon}</span>
                        <div className="sub-item-btn">
                          {label}
                          <UserSubMenu
                            style={{ width: "18px" }}
                            className={
                              submenu &&
                              (openSubMenu === slug ? "rotate-item" : "")
                            }
                          />
                        </div>
                      </Link>
                      {isOpen && (
                        <ul className="sub-list">
                          {FilteredSubMenu(submenu)?.map((subitem) => (
                            <li
                              key={subitem?.label}
                              className={` sub-list-items ${
                                subitem?.isActive ? "active" : ""
                              }`}
                              id={"submenu-list-item-" + subitem?.slug}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <Link
                                to={subitem?.path}
                                onClick={handleMenuClose}
                              >
                                <span>{subitem?.icon}</span>
                                {subitem?.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                } else {
                  // return permissionsStatus?.map((el) => {
                  //   if (el === slug) {
                  return (
                    <li
                      key={label}
                      className={isActive ? "active-main" : ""}
                      id={"menu-list-item-" + slug}
                      onClick={() => handleMenuClick(slug, submenu)}
                    >
                      <Link to={path} onClick={handleMenuClose}>
                        <span>{icon}</span>
                        {label}
                      </Link>
                    </li>
                  );
                  //   }
                  // });
                }
              }
            )
          ) : (
            <div className="permission_loader">
              <Stack
                spacing={2}
                sx={{
                  marginTop: 1,
                }}
              >
                {[...Array(8)].map((x, index) => (
                  <Skeleton
                    key={index}
                    sx={{ bgcolor: "#f7f8fb" }}
                    variant="rounded"
                    width={200}
                    height={60}
                  />
                ))}
              </Stack>
            </div>
          )}
        </ul>
      </div>
    </>
  );
};

export default SideBar;
