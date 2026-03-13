import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useNavigate } from "react-router-dom";
import WidgetComponent from "../widgets";
import { ReactComponent as SolarSuitcaseSVG } from "../../../../../assets/icons/solar_suitcase-linear.svg";
import { ReactComponent as SuitcaseIcon } from "../../../../../assets/icons/suitcase-svg.svg";
import { ReactComponent as CalenderIcon } from "../../../../../assets/icons/calenderIconNew.svg";
import { ReactComponent as TotalCandidateIcon } from "../../../../../assets/icons/admin/total-candidate-icon.svg";
import { ReactComponent as ToDoIcon } from "../../../../../assets/icons/todotaskIcon.svg";
import { ReactComponent as PeopleSVG } from "../../../../../assets/icons/PeopleSVG.svg";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";
import {
  getSubRole,
  storeLocal,
  userRoleType,
} from "../../../../../utils/projectHelper";
import {
  ASSESSOR_ATTENDANCE_REGULARIZE_PAGE,
  ASSESSOR_MANAGEMENT_HOME,
  BDA_JOB_ROLE_PAGE,
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH,
  OFFLINE_RESULTS_TAB_PAGE,
  ONLINE_RESULTS_TAB_PAGE,
  PROCTOR_MANAGEMENT_HOME,
  QUESTION_BANK_NOS,
  SUPER_ADMIN_ALL_BATCHES_REQUEST,
  SUPER_ADMIN_ASSESSMENT_BATCH,
  SUPER_ADMIN_ASSIGN_BATCH,
  SUPER_ADMIN_BATCH_LIST_PAGE,
  SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
  SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
  SUPER_ADMIN_USER_DEMO_LEAD_MANAGEMENT,
} from "../../../../../config/constants/routePathConstants/superAdmin";
const ResponsiveGridLayout = WidthProvider(Responsive);
const DashboardInfoCardsWidgets = ({
  clientId = "",
  serverData = [],
  updateLayout,
  editStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userInfo = {} } = useSelector(authSelector);
  const {
    QUESTION_BANK_FEATURE,
    QUESTION_BANK_SUB_FEATURE_2,
    JOB_ROLE_MANAGEMENT_FEATURE,
    JOB_ROLE_MANAGEMENT_LIST_FEATURE,
  } = ROLESPERMISSIONS;

  const user_Role_for_jobRole = userInfo?.userRole;
  const jobRole_featureName = JOB_ROLE_MANAGEMENT_FEATURE;
  const jobRole_roleType = userRoleType(
    user_Role_for_jobRole,
    jobRole_featureName
  );
  const jobRole_subFeatureName = JOB_ROLE_MANAGEMENT_LIST_FEATURE;
  const isJobRolePermission = getSubRole(
    jobRole_roleType?.subFeatures,
    jobRole_subFeatureName
  );

  console.log("isJobRolePermission", isJobRolePermission);

  const userRole = userInfo?.userRole;
  const featureName = QUESTION_BANK_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = QUESTION_BANK_SUB_FEATURE_2;
  const isRolePermissionAssessment_creation = getSubRole(
    roleType?.subFeatures,
    subFeatureName
  );
  const [layout, setLayout] = useState([]);
  const [widgetListFilter, setWidgetListFilter] = useState([]);

  const handleTotalBlueprintRoute = () => {
    isRolePermissionAssessment_creation?.permissions?.["1"] &&
      navigate(`${SUPER_ADMIN_QUESTION_FORM_LIST_PAGE}/${"All"}`);
  };

  const handlePrimaryQuestionRoute = () => {
    setTimeout(() => {
      isRolePermissionAssessment_creation?.permissions?.["1"] &&
        navigate(`${SUPER_ADMIN_QUESTION_FORM_LIST_PAGE}/${"All"}`, {
          state: {
            clientId: clientId,
          },
          target: "_blank",
        });
    }, 500);
  };

  const attendanceRequestRoute = () => {
    navigate(ASSESSOR_ATTENDANCE_REGULARIZE_PAGE, {
      state: {
        clientId: clientId,
      },
      target: "_blank",
    });
  };

  const handleActiveLeadsLinkClick = () => {
    storeLocal({ language: "english" }, "primaryQuestionBank");
  };

  const handleTotalJobroleroute = () => {
    // isRolePermission_jobrole?.permissions?.["1"] &&
    navigate(BDA_JOB_ROLE_PAGE);
  };

  const linkDataForPrimaryQuestion = {
    isPermissions: isRolePermissionAssessment_creation?.permissions?.["1"],
    handleRoute: handlePrimaryQuestionRoute,
    linkText: "View Primary Questions",
    isLinkActive: isRolePermissionAssessment_creation?.permissions?.["1"],
    link: `${SUPER_ADMIN_QUESTION_FORM_LIST_PAGE}/${"All"}`,
    handleLinkClick: handleActiveLeadsLinkClick,
  };

  const linkDataForTotalJobrole = {
    isPermissions: isJobRolePermission?.permissions?.["1"],
    handleRoute: handleTotalJobroleroute,
    linkText: "View JobRole",
    isLinkActive: isJobRolePermission?.permissions?.["1"],
    link: BDA_JOB_ROLE_PAGE,
  };

  const linkDataForBlueprint = {
    isPermissions: isRolePermissionAssessment_creation?.permissions?.["1"],
    handleRoute: handleTotalBlueprintRoute,
    linkText: "View Blueprint",
    isLinkActive: isRolePermissionAssessment_creation?.permissions?.["1"],
    link: QUESTION_BANK_NOS,
  };

  const linkDataForAttendanceRequest = {
    isPermissions: true,
    handleRoute: attendanceRequestRoute,
    linkText: "View Attendance Request",
    isLinkActive: true,
    link: ASSESSOR_ATTENDANCE_REGULARIZE_PAGE,
  };

  const linkDataForActiveLeads = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Active Leads",
    isLinkActive: true,
    link: SUPER_ADMIN_USER_DEMO_LEAD_MANAGEMENT,
    handleLinkClick: handleActiveLeadsLinkClick,
  };

  const linkDataForTotalProctors = {
    isPermissions: true,
    linkText: "View Total Proctors",
    isLinkActive: true,
    link: PROCTOR_MANAGEMENT_HOME,
  };

  const linkDataForOngoingBatches = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Live Monitoring",
    isLinkActive: true,
    link: LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH,
  };

  const linkForResultUpload = {
    isPermissions: true,
    handleRoute: () => {},
    linkTextOne: "View Online Batch",
    linkTextTwo: "View Offline Batch",
    isLinkActive: true,
    linkOne: ONLINE_RESULTS_TAB_PAGE,
    linkTwo: OFFLINE_RESULTS_TAB_PAGE,
    title: "resultUpload",
  };

  const linkDataForAssignBatch = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Assign Batch",
    isLinkActive: true,
    link: SUPER_ADMIN_ASSIGN_BATCH,
  };

  const linkDataForTotalClient = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Total Client",
    isLinkActive: true,
    link: SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
  };

  const handleActiveClientLinkClick = () => {
    storeLocal({ status: "Active" }, "query");
  };

  const handleActiveBatchLinkClick = () => {
    storeLocal({ status: true }, "queryActiveBatch");
  };

  const handleTotalBlueprintRouteClick = () => {
    storeLocal({ dashboardClient: true }, "assessorManagementFromDashboard");
  };

  const handleActiveAssessorLinkClick = () => {
    storeLocal({ section: "verified" }, "queryActiveAssessor");
  };

  const handleMasterAssessorLinkClick = () => {
    storeLocal({ assessorType: "Master Assessor" }, "masterAssessor");
  };

  const handleAssessedBatchLinkClick = () => {
    storeLocal({ batchCompleteStatus: "complete" }, "query");
  };

  const handleLiveAssessmentLinkClick = () => {
    // storeLocal({batchCompleteStatus:"complete"},"query")
  };

  const linkDataForActiveClient = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Active Client",
    isLinkActive: true,
    link: SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
    handleLinkClick: handleActiveClientLinkClick,
  };

  const linkDataForActiveAssessors = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Active Assessor",
    isLinkActive: true,
    link: ASSESSOR_MANAGEMENT_HOME,
    handleLinkClick: handleActiveAssessorLinkClick,
  };

  const linkDataForAssignedAssessors = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Assign Assessors",
    isLinkActive: true,
    link: SUPER_ADMIN_ALL_BATCHES_REQUEST,
  };

  const linkDataForTotalBatch = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Total Batch",
    isLinkActive: true,
    link: SUPER_ADMIN_BATCH_LIST_PAGE,
  };

  const linkDataForUpcomingBatch = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Upcoming Batch",
    isLinkActive: true,
    link: SUPER_ADMIN_ASSESSMENT_BATCH,
  };

  const linkDataForActiveBatch = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Active Batch",
    isLinkActive: true,
    link: SUPER_ADMIN_BATCH_LIST_PAGE,
    handleLinkClick: handleActiveBatchLinkClick,
  };

  const linkDataForTotalAssessor = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Total Assessor",
    isLinkActive: true,
    link: ASSESSOR_MANAGEMENT_HOME,
    linkQuery: { dashboardClient: true },
    handleLinkClick: handleTotalBlueprintRouteClick,
  };

  const linkDataForMasterAssessor = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Master Assessor",
    isLinkActive: true,
    link: ASSESSOR_MANAGEMENT_HOME,
    handleLinkClick: handleMasterAssessorLinkClick,
  };
  const linkDataForAssessedBatch = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Assessed Batch",
    isLinkActive: true,
    link: SUPER_ADMIN_ASSESSMENT_BATCH,
    query: "complete",
    handleLinkClick: handleAssessedBatchLinkClick,
  };

  const linkDataForLiveAssessment = {
    isPermissions: true,
    handleRoute: () => {},
    linkText: "View Live Assessment",
    isLinkActive: true,
    link: SUPER_ADMIN_ASSESSMENT_BATCH,
    handleLinkClick: handleLiveAssessmentLinkClick,
  };

  const linkDataForTotalQuestionBank = {
    isPermissions: true,
    handleRoute: handleTotalBlueprintRoute,
    linkText: "View Question Bank",
    isLinkActive: true,
    link: SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
  };

  useEffect(() => {
    if (serverData.length > 0) {
      const arr = [];
      for (let item of serverData) {
        arr.push(
          `${item?.componentId?.component_name} ${item?.componentId?.component_category}`
        );
      }
      if (arr.length > 0) {
        setWidgetListFilter(arr);
      }
    }
  }, [serverData]);

  useEffect(() => {
    if (widgetListFilter?.length > 0 && serverData.length > 0) {
      let arr = [];
      for (let item of widgetListFilter) {
        const elements = serverData?.findIndex((value) => {
          return (
            `${value?.componentId?.component_name} ${value?.componentId?.component_category}` ===
            item
          );
        });
        const element2 = serverData?.find((value) => {
          return (
            `${value?.componentId?.component_name} ${value?.componentId?.component_category}` ===
            item
          );
        });

        if (elements && element2)
          if (element2?.is_user_layout_available) {
            arr.push({
              w: Number(element2?.user_layout?.w),
              h: Number(element2?.user_layout?.h),
              x: Number(element2?.user_layout?.x),
              y: Number(element2?.user_layout?.y),
              i: String(element2?.user_layout?.widget_order),
            });
          }
      }

      if (arr.length > 0) {
        setLayout(arr);
      } else {
        setLayout([
          { w: 1, h: 1, x: 0, y: 0, i: "0" },
          { w: 1, h: 1, x: 1, y: 0, i: "1" },
          { w: 1, h: 1, x: 3, y: 0, i: "2" },
          { w: 1, h: 1, x: 2, y: 0, i: "3" },
        ]);
      }
    }
  }, [serverData, widgetListFilter]);

  const handleLayoutChange = (newLayout) => {
    const modifiedResponseData = serverData?.map((item) => {
      const element = newLayout?.find(
        (val) =>
          widgetListFilter[val?.i] ===
          `${item?.componentId?.component_name} ${item?.componentId?.component_category}`
      );
      return {
        ...item,
        is_user_layout_available: true,
        user_layout: {
          h: String(element?.h),
          w: String(element?.w),
          x: String(element?.x),
          y: String(element?.y),
          widget_order: Number(element?.i),
        },
      };
    });
    setLayout(newLayout);
    updateLayout(modifiedResponseData);
  };

  const activeLeadsComponentDataBD = {
    borderColor: "#9747FF",
    stopOneColor: "#0B3DEF80",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const totalClientComponentDataBD = {
    borderColor: "#FE8A37",
    stopOneColor: "#FE8A3780",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const totalJobroleComponentDataBD = {
    borderColor: "#FF4747",
    stopOneColor: "#FF4747",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const liveAssessmentComponentDataOD = {
    borderColor: "#00CE6B",
    stopOneColor: "#00CE6B80",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const batchAssessmentComponentDataOD = {
    borderColor: "#9747FF",
    stopOneColor: "#0B3DEF80",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const totalAssessorComponentDataOD = {
    borderColor: "#FE8A37",
    stopOneColor: "#FE8A3780",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const assignedApplicantsComponentDataOD = {
    borderColor: "#4399FF",
    stopOneColor: "#4399FF",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const assignedAssessorComponentDataQA = {
    borderColor: "#EF0B34",
    stopOneColor: "#EE1D4280",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const assessedApplicantsComponentDataQA = {
    borderColor: "#9747FF",
    stopOneColor: "#0B3DEF80",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const activeBatchComponentDataQA = {
    borderColor: "#FE8A37",
    stopOneColor: "#FE8A3780",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const totalBatchComponentDataQA = {
    borderColor: "#00CE6B",
    stopOneColor: "#00CE6B80",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const totalAssessorComponentDataHR = {
    borderColor: "#00CE6B",
    stopOneColor: "#00CE6B80",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };
  const activeAssessorComponentDataHR = {
    borderColor: "#FE8A3780",
    stopOneColor: "#FE8A3780",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const totalProcterComponentDataHR = {
    borderColor: "#9747FF",
    stopOneColor: "#0B3DEF80",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const attendaceRequestComponentDataHR = {
    borderColor: "#EF0B34",
    stopOneColor: "#EE1D4280",
    stopTwoColor: "rgba(0, 206, 107, 0)",
  };

  const allWidgetList = [
    {
      widgetName: "Total Jobrole Business",
      widgetComponent: (
        <WidgetComponent
          dashboardName={"Business"}
          widgetName="Total Jobrole"
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalJobroleComponentDataBD}
          clientId={clientId}
          linkData={linkDataForTotalJobrole}
        />
      ),
    },
    {
      widgetName: "Primary Question Content",
      widgetComponent: (
        <WidgetComponent
          isLineGraphRequired={false}
          SVGIcon={SolarSuitcaseSVG}
          widgetName="Primary Question"
          linkData={linkDataForPrimaryQuestion}
          dashboardName={"Content"}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
        />
      ),
    },
    {
      widgetName: "Total jobrole Content",
      widgetComponent: (
        <WidgetComponent
          isLineGraphRequired={false}
          SVGIcon={SuitcaseIcon}
          widgetName="Total jobrole"
          linkData={linkDataForTotalJobrole}
          dashboardName={"Content"}
          serverData={serverData}
          widgetSpecificData={totalJobroleComponentDataBD}
          clientId={clientId}
        />
      ),
    },
    {
      widgetName: "Total Blueprint Content",
      widgetComponent: (
        <WidgetComponent
          isLineGraphRequired={false}
          SVGIcon={SuitcaseIcon}
          widgetName="Total Blueprint"
          dashboardName={"Content"}
          linkData={linkDataForBlueprint}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
        />
      ),
    },
    {
      widgetName: "Active Assessor HR",
      widgetComponent: (
        <WidgetComponent
          widgetName="Active Assessor"
          dashboardName={"HR"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={activeAssessorComponentDataHR}
          clientId={clientId}
          linkData={linkDataForActiveAssessors}
        />
      ),
    },
    {
      widgetName: "Active Client Business",
      widgetComponent: (
        <WidgetComponent
          widgetName="Active Client"
          dashboardName={"Business"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
          linkData={linkDataForActiveClient}
        />
      ),
    },
    {
      widgetName: "Active Batch QA",
      widgetComponent: (
        <WidgetComponent
          widgetName="Active Batch"
          dashboardName={"QA"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={activeBatchComponentDataQA}
          clientId={clientId}
          linkData={linkDataForActiveBatch}
        />
      ),
    },
    {
      widgetName: "Active Leads Business",
      widgetComponent: (
        <WidgetComponent
          widgetName="Active Leads"
          dashboardName={"Business"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={activeLeadsComponentDataBD}
          clientId={clientId}
          linkData={linkDataForActiveLeads}
        />
      ),
    },
    {
      widgetName: "Assessed Applicants MIS",
      widgetComponent: (
        <WidgetComponent
          widgetName="Assessed Applicants"
          dashboardName={"MIS"}
          SVGIcon={PeopleSVG}
          isLineGraphRequired={false}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
        />
      ),
    },
    {
      widgetName: "Assessed Applicants QA",
      widgetComponent: (
        <WidgetComponent
          widgetName="Assessed Applicants"
          dashboardName={"QA"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={assessedApplicantsComponentDataQA}
          clientId={clientId}
        />
      ),
    },
    {
      widgetName: "Assessed batch MIS",
      widgetComponent: (
        <WidgetComponent
          widgetName="Assessed batch"
          dashboardName={"MIS"}
          SVGIcon={SuitcaseIcon}
          isLineGraphRequired={false}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
          linkData={linkDataForAssessedBatch}
        />
      ),
    },
    {
      widgetName: "Batch Assessed Operations",
      widgetComponent: (
        <WidgetComponent
          widgetName="Batch Assessed"
          dashboardName={"Operations"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={batchAssessmentComponentDataOD}
          clientId={clientId}
        />
      ),
    },
    {
      widgetName: "Assigned Applicants Operations",
      widgetComponent: (
        <WidgetComponent
          widgetName="Assigned Applicants"
          dashboardName={"Operations"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={assignedApplicantsComponentDataOD}
          clientId={clientId}
          linkData={linkDataForAssignBatch}
        />
      ),
    },
    {
      widgetName: "Assigned Applicants MIS",
      widgetComponent: (
        <WidgetComponent
          widgetName="Assigned Applicants"
          dashboardName={"MIS"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
        />
      ),
    },
    {
      widgetName: "Assigned Assessor QA",
      widgetComponent: (
        <WidgetComponent
          widgetName="Assigned Assessor"
          dashboardName={"QA"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={assignedAssessorComponentDataQA}
          clientId={clientId}
          linkData={linkDataForAssignedAssessors}
        />
      ),
    },
    {
      widgetName: "Attendance Request  HR",
      widgetComponent: (
        <WidgetComponent
          widgetName="Attendance Request "
          dashboardName={"HR"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={attendaceRequestComponentDataHR}
          clientId={clientId}
          linkData={linkDataForAttendanceRequest}
        />
      ),
    },
    {
      widgetName: "Live Assessments Operations",
      widgetComponent: (
        <WidgetComponent
          widgetName="Live Assessments"
          dashboardName={"Operations"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={liveAssessmentComponentDataOD}
          clientId={clientId}
          linkData={linkDataForLiveAssessment}
        />
      ),
    },
    {
      widgetName: "Live Steaming Operations",
      widgetComponent: (
        <WidgetComponent
          widgetName="Live Steaming"
          dashboardName={"Operations"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
        />
      ),
    },
    {
      widgetName: "Ongoing Batch MIS",
      widgetComponent: (
        <WidgetComponent
          widgetName="Ongoing Batch"
          dashboardName={"MIS"}
          SVGIcon={CalenderIcon}
          isLineGraphRequired={false}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
          linkData={linkDataForOngoingBatches}
        />
      ),
    },
    {
      widgetName: "Result Upload  MIS",
      widgetComponent: (
        <WidgetComponent
          widgetName="Result Upload "
          dashboardName={"MIS"}
          SVGIcon={ToDoIcon}
          isLineGraphRequired={false}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
          linkData={linkForResultUpload}
        />
      ),
    },
    // {
    //   widgetName: "Total Assessor Operations",
    //   widgetComponent: (
    //     <WidgetComponent
    //       widgetName="Total Assessor"
    //       dashboardName={"Operations"}
    //       isLineGraphRequired={true}
    //       serverData={serverData}
    //       widgetSpecificData={totalAssessorComponentDataOD}
    //       clientId={clientId}
    //       linkData={linkDataForTotalAssessor}
    //     />
    //   ),
    // },
    {
      // widgetName: "Total Assessor HR",
      widgetName: "Total Assessor (Valid / Registered) HR",
      widgetComponent: (
        <WidgetComponent
          widgetName="Total Assessor (Valid / Registered)"
          dashboardName={"HR"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalAssessorComponentDataHR}
          clientId={clientId}
          linkData={linkDataForTotalAssessor}
        />
      ),
    },
    {
      widgetName: "Master Assessor HR",
      widgetComponent: (
        <WidgetComponent
          widgetName="Master Assessor"
          dashboardName={"HR"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalAssessorComponentDataHR}
          clientId={clientId}
          linkData={linkDataForMasterAssessor}
        />
      ),
    },
    {
      widgetName: "Total batch QA",
      widgetComponent: (
        <WidgetComponent
          widgetName="Total batch"
          dashboardName={"QA"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalBatchComponentDataQA}
          clientId={clientId}
          linkData={linkDataForTotalBatch}
        />
      ),
    },
    {
      widgetName: "Upcoming Batch QA",
      widgetComponent: (
        <WidgetComponent
          widgetName="Upcoming Batch"
          dashboardName={"QA"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalBatchComponentDataQA}
          clientId={clientId}
          linkData={linkDataForUpcomingBatch}
        />
      ),
    },
    {
      widgetName: "Total Client Business",
      widgetComponent: (
        <WidgetComponent
          widgetName="Total Client"
          dashboardName={"Business"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
          linkData={linkDataForTotalClient}
        />
      ),
    },
    {
      widgetName: "Total Proctors HR",
      widgetComponent: (
        <WidgetComponent
          widgetName="Total Proctors"
          dashboardName={"HR"}
          isLineGraphRequired={true}
          serverData={serverData}
          widgetSpecificData={totalProcterComponentDataHR}
          clientId={clientId}
          linkData={linkDataForTotalProctors}
        />
      ),
    },

    {
      widgetName: "Total Question Bank Content",
      widgetComponent: (
        <WidgetComponent
          isLineGraphRequired={false}
          SVGIcon={TotalCandidateIcon}
          widgetName="Total Question Bank"
          dashboardName={"Content"}
          linkData={linkDataForTotalQuestionBank}
          serverData={serverData}
          widgetSpecificData={totalClientComponentDataBD}
          clientId={clientId}
        />
      ),
    },
  ];

  return (
    <div style={{ marginBottom: "-10px" }}>
      <ResponsiveGridLayout
        className="responsive-grid"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1547 }}
        maxRows={1}
        rowHeight={120}
        compactType={"horizontal"}
        isResizable={false}
        isDraggable={editStatus}
        cols={{ lg: 4 }}
        onDragStop={handleLayoutChange}
      >
        {widgetListFilter?.map((Item, index) => (
          <div
            className="dashboard-total-listitem"
            key={index?.toString()}
            style={{
              boxShadow: editStatus
                ? "0px 0px 6px rgb(0, 0, 0)"
                : "0px 0px 6px rgba(175, 170, 170, 0.76)",
            }}
          >
            {
              allWidgetList?.find((Value) => Value?.widgetName === Item)
                ?.widgetComponent
            }
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardInfoCardsWidgets;
