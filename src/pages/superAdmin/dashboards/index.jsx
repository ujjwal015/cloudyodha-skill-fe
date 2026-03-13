import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./style.css";
import "./adminDashboard.css";
import {
  ButtonList_IndiaMap,
  formatDate,
  formatDateInStringFormat,
  getSubRole,
  getWidthAndHeightOfComponentDashboard,
  navigate,
  storeLocal,
  toolTip,
  userRoleType,
} from "../../../utils/projectHelper.js";
import BreadCrumbs from "../../../components/common/Breadcrumbs/index.js";
import HeaderTitle from "../../../components/common/HeaderTitle/index.js";
import AssessmentApplicantDonut from "./AssessmentApplicantDonut.jsx";
import { useDispatch, useSelector } from "react-redux";
import { clientManagementSelector } from "../../../redux/slicers/superAdmin/clientManagement.js";
import ClientSelect from "../../../components/common/ClientSelect.js";
import DashboardInfoCardsWidgets from "./components/DashboardInfoCard/index.jsx";
import { authSelector } from "../../../redux/slicers/authSlice.js";
import DonutChart from "./components/Charts/DonutChart.jsx";
import DonutChartWithDescription from "./components/Charts/DonutChartWithDescription.jsx";
import { ReactComponent as POCFlag } from "../../../assets/icons/featureFlagIcon.svg";

import IndiaMap from "./components/Charts/IndiaMap.jsx";
import CurveChart from "./components/Charts/WaveChart.jsx";
import HorizontalChart from "./components/Charts/HorizontalBarChart.jsx";
import { ReactComponent as EyeSVG } from "../../../assets/icons/eyeSVG.svg";
import { ReactComponent as BellReminderIcon } from "../../../assets/icons/bellPlus.svg";
import { ReactComponent as ToggleEye } from "../../../assets/icons/ToggleEye.svg";

import {
  ASSESSOR_MANAGEMENT_HOME,
  ASSESSOR_MANAGEMENT_VIEW,
  LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST,
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH,
  SUPER_ADMIN_ASSESSMENT_BATCH,
  SUPER_ADMIN_BATCH_LIST_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE,
  UPLOAD_OFFLINE_RESULTS,
  VERIFICATION_TAB_LIST_PAGE,
} from "../../../config/constants/routePathConstants/superAdmin.js";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import {
  dashboardConstants,
  ROLESPERMISSIONS,
  SECTORWISE_DROPDOWN,
} from "../../../config/constants/projectConstant.js";
import CommonTable from "./components/table/table.jsx";
import {
  getAllClientsApi,
  sendLayoutChangeDataToServerAPI,
} from "../../../api/superAdminApi/dashboard.js";
import MyFilledBtn from "../../../components/common/newCommon/Buttons/MyFilledBtn.jsx";
import { RingLoader } from "react-spinners";
import MultipleDonut from "./components/Charts/MultipleDonut.jsx";
import DonutChartWithDetailDescription from "./components/Charts/DonutChartWithDetailDescription.jsx";
import ScheduledBatchCalender from "./components/Calender/schduleCalender/index.jsx";
import LineChart from "./components/Charts/LineChart.jsx";
import LineCurveChart from "./components/Charts/LineChart.jsx";
import DottedProgressBar from "./components/customComponents/progressBar/index.jsx";
import ReminderModel from "./components/modal/ReminderModal.jsx";
import JobRoleViewModalNCVET from "../../../components/common/Modal/JobRoleModalNCVET/index.js";
import JobRoleTableModal from "../../../components/common/Modal/jobRoleModalList/index.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { GetUserPermissionApi } from "../../../api/authApi.js";
const ResponsiveGridLayout = WidthProvider(Responsive);

const CommonDashboardForAll = () => {
  const MAX_LENGTH_FOR_TOOLTIP = 13;
  const { userInfo = {} } = useSelector(authSelector);
  const dispatch = useDispatch();
  const {
    LOG_MANAGEMENT_FEATURE,
    LOG_MANAGEMENT_LIST_FEATURE_1,
    LOG_MANAGEMENT_LIST_FEATURE_2,
  } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = LOG_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = LOG_MANAGEMENT_LIST_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const subFeatureNameActivity = LOG_MANAGEMENT_LIST_FEATURE_2;
  const isRolePermissionActivity = getSubRole(
    roleType?.subFeatures,
    subFeatureNameActivity
  );
  const [loading, setLoading] = useState(false);
  const navigatePath = useNavigate();
  console.log("navigatePath_navigatePath", navigatePath);
  const [editLayout, setEditLayout] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [selectedClientName, setSelectedClientName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const { clientManagementLists = [], allClients = [] } = useSelector(
    clientManagementSelector
  );
  const [componentsListFromBackend, setComponentListFromBackend] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);
  const location = useLocation();
  const [widgetList, setWidgetList] = useState([]);
  const [elementList, setElementList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [layout, setLayout] = useState([]);
  const [changedComponentLayout, setChangedComponentLayout] = useState([]);
  const [changedWidgetLayout, setChangedWidgetLayout] = useState([]);
  const [dashboardId, setDashboardId] = useState("");
  // const [modalOpen, setModaOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [errors, setErrors] = useState({});
  const [clientListUpdated, setClientListUpdated] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [jobRoleData, setjobRoleData] = useState([]);
  const [clientNameOfJobRoleList, setClientNameOfJobRoleList] = useState("");
  const [spokeData, setSpokeData] = useState([]);

  const [pocModalOpen, setPOCModalOpen] = useState(false);

  useEffect(() => {
    const x = clientListUpdated?.find(
      (item) => item?.clientId === selectedClientId
    );
    if (x) {
      storeLocal(x?.clientName, "SelectedClient");
    }

    storeLocal(selectedClientId, "SelectedClientId");
  }, [selectedClientId]);

  useEffect(() => {
    storeLocal(undefined, "SelectedClient");
  }, []);

  const handleOpen = (data) => {
    setPOCModalOpen(true);
    setSpokeData(data?.spoke);
  };

  const handleModalOpen = (e, row) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleJobRoleClick = (event, data) => {
    event.preventDefault();
    if (data?.jobRoleArray?.length > 0) {
      setjobRoleData(data?.jobRoleArray);
      setClientNameOfJobRoleList(data?.clientname);
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setjobRoleData([]);
    setClientNameOfJobRoleList("");
  };

  const sendLayoutChangeDataToServer = (data) => {
    dispatch(sendLayoutChangeDataToServerAPI(data, dashboardId));
  };

  useEffect(() => {
    dispatch(getAllClientsApi(setLoading, 1, 100));
  }, [dispatch]);

  useEffect(() => {
    if (allClients?.length > 0) {
      const arr = [];
      for (let item of allClients) {
        arr.push({ clientName: item?.clientname, clientId: item?._id });
      }
      setClientListUpdated(arr);
    }
  }, [allClients]);

  useEffect(() => {
    if (changedComponentLayout?.length > 0 && changedWidgetLayout?.length > 0) {
      sendLayoutChangeDataToServer([
        ...changedComponentLayout,
        ...changedWidgetLayout,
      ]);
    } else if (
      !changedComponentLayout?.length > 0 &&
      changedWidgetLayout?.length > 0
    ) {
      sendLayoutChangeDataToServer([...componentList, ...changedWidgetLayout]);
    } else if (
      changedComponentLayout?.length > 0 &&
      !changedWidgetLayout?.length > 0
    ) {
      sendLayoutChangeDataToServer([...changedComponentLayout, ...widgetList]);
    }
  }, [changedComponentLayout, changedWidgetLayout]);

  useEffect(() => {
    if (componentList?.length > 0) {
      const initialLayout = componentList.map((component, index) => {
        if (!component?.is_user_layout_available) {
          return {
            i: `${component?.componentId?.component_name} ${component?.componentId?.component_category}`,
            x: index % 2 === 0 ? 0 : 6,
            y: Math.floor(index / 2) * 2,
            w: getWidthAndHeightOfComponentDashboard(
              `${component?.componentId?.component_name} ${component?.componentId?.component_category}`
            )?.w,
            h: getWidthAndHeightOfComponentDashboard(
              `${component?.componentId?.component_name} ${component?.componentId?.component_category}`
            )?.h,
          };
        }
        return {};
        // return {
        //   // i:item?.user_layout?.widget_order,
        //   // x:item?.user_layout?.x,
        //   // y:item?.user_layout?.y,
        //   // h:item?.user_layout?.x,
        //   // w:item?.user_layout?.,
        // };
      });

      console.log("_DW_23_555", componentList, initialLayout);
      setLayout(initialLayout);
    }
  }, [componentList]);

  const handleProtoceringLog = useCallback((job) => {
    const isViewEnabled = isRolePermission?.permissions?.["1"] === true;
    if (isViewEnabled) {
      navigate(
        `${LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH}/${job._id}`
      );
    }
  }, []);

  const handleStyle = useCallback((batchMode) => {
    if (batchMode === "online") {
      return {
        backgroundColor: "rgba(236, 249, 242, 1)",
        color: "rgba(64, 191, 127, 1)",
        border: "1px solid rgba(64, 191, 127, 1)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: "15px",
        padding: "6px",
      };
    } else if (batchMode === "offline") {
      return {
        backgroundColor: "rgba(255, 227, 223, 1)",
        color: "rgba(255, 99, 78, 1)",
        border: "1px solid rgba(255, 99, 78, 1)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: "15px",
        padding: "6px",
      };
    }
  }, []);

  const handleActivityLog = useCallback((job) => {
    const isViewEnabled = isRolePermissionActivity?.permissions?.["1"] === true;
    if (isViewEnabled) {
      navigate(
        `${LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST}/${job._id}/${job.batchId}`
      );
    }
  }, []);

  const setDataInLocalStorage = () => {
    storeLocal({ dashboardClient: true }, "assessorManagementFromDashboard");
  };

  const handleVerificationTabRoute = (e, row) => {
    e.preventDefault();
    setDataInLocalStorage();
    window.open(VERIFICATION_TAB_LIST_PAGE, "_blank");
  };

  const clientListHeaderColumns = useMemo(() => {
    return [
      {
        name: "clientcode",
        label: "CLIENT CODE",
        sorting: false,
        selector: (row) => (
          <div className="username-cell">
            <Avatar
              sx={{ width: 35, height: 35, border: "1px solid #ccc" }}
              variant="rounded"
              alt={"some-alt"}
              src={
                row?.webpage ||
                "https://www.ficsi.in/public/front/images/favicon.png"
              }
            />
            <div>
              <h2>{row?.clientcode || "-"}</h2>
              <p>{row?.email || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        name: "clientname",
        label: "CLIENT NAME",
        sorting: false,
        selector: (row) => {
          return row?.clientname?.length > MAX_LENGTH_FOR_TOOLTIP ? (
            toolTip(row?.clientname)
          ) : (
            <div style={{ width: "100px", textWrap: "wrap" }}>
              {row?.clientname || "-"}
            </div>
          );
        },
      },
      {
        name: "sector",
        label: "SECTOR",
        sorting: false,
        selector: (row) => row?.sector || "-",
      },
      {
        name: "organisationType",
        label: "ORGANISATION TYPE",
        sorting: false,
        selector: (row) => (
          <div style={handleStyle(row?.batchMode)}>
            {row?.organisationType || "-"}
          </div>
        ),
      },
      {
        name: "noOfJobRole",
        label: "NO. OF JOBROLE",
        sorting: false,
        selector: (row) =>
          row?.jobRoleArray?.length > 0 && (
            <div
              className="view-btn"
              onClick={(e) => handleJobRoleClick(e, row)}
            >
              {row?.jobRoleArray?.length > 0 &&
                `Jobrole(${row?.jobRoleArray?.length})`}
            </div>
          ),
      },
      {
        name: "poc",
        label: "POINT OF CONTACT",
        sorting: false,
        selector: (row) => (
          <div className="view-btn" onClick={() => handleOpen(row)}>
            View Details
          </div>
        ),
      },
      {
        name: "createdOn",
        label: "CREATED ON",
        sorting: false,
        selector: (row) =>
          (row?.createdAt && formatDate(row?.createdAt)) || "-",
      },
    ];
  }, []);

  const allActivitiesHeaderColumns = useMemo(() => {
    return [
      {
        name: "titleName",
        label: "TITLE NAME",
        sorting: false,
        selector: (row) => (
          <div style={{ textWrap: "wrap", width: "300px" }}>
            {row?.titleName ||
              "Create a Question bank for a job role:'Retails source app Assistant' maps to qualification pack: RAS/#234SDER"}
          </div>
        ),
      },
      {
        name: "activtyType",
        label: "ACTIVITY TYPE",
        sorting: false,
        selector: (row) => (
          <div style={handleStyle(row?.batchMode)}>
            {row?.actvityType || "Task"}
          </div>
        ), //change handleStyle as per response
      },
      {
        name: "createdBy",
        label: "CREATED BY",
        sorting: false,
        selector: (row) => row?.jobrolecount || "Sangita",
      },
      {
        name: "dueDate",
        label: "DUE DATE",
        sorting: false,
        selector: (row) => row?.dueDate || "20/11/2024",
      },
      {
        name: "status",
        label: "STATUS",
        sorting: false,
        selector: (row) => (
          <div style={handleStyle(row?.status)}>
            {row?.status || "Completed"}
          </div>
        ), //change handleStyle as per response
      },
    ];
  }, []);

  const clientBasedobRoleHeaderColumnsBD = useMemo(() => {
    return [
      {
        name: "clientcode",
        label: "CLIENT CODE",
        sorting: false,
        selector: (row) => (
          <div className="username-cell">
            <Avatar
              sx={{ width: 35, height: 35, border: "1px solid #ccc" }}
              variant="rounded"
              alt={"some-alt"}
              src={
                row?.isProfilePicUploaded
                  ? row?.webpage
                  : "https://www.ficsi.in/public/front/images/favicon.png"
              }
            />
            <div>
              <h2>{row?.clientcode || "-"}</h2>
              <p>{row?.email || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        name: "clientname",
        label: "CLIENT NAME",
        sorting: false,
        selector: (row) => {
          return row?.clientname?.length > MAX_LENGTH_FOR_TOOLTIP ? (
            toolTip(row?.clientname)
          ) : (
            <div style={{ width: "100px", textWrap: "wrap" }}>
              {row?.clientname || "-"}
            </div>
          );
        },
      },
      {
        name: "noOfJobRole",
        label: "NO. OF JOBROLE",
        sorting: false,
        selector: (row) =>
          row?.jobRoleArray?.length > 0 && (
            <div
              className="view-btn"
              style={{ cursor: "pointer" }}
              onClick={(e) => handleJobRoleClick(e, row)}
            >
              {`Jobrole(${row?.jobRoleArray?.length || "-"})`}
            </div>
          ),
      },
    ];
  }, []);

  const jobRoleOccuranceHeaderColumns = useMemo(() => {
    return [
      {
        name: "jobRole",
        label: "JOBROLE",
        sorting: false,
        selector: (row) => row?.jobRole || "-",
      },
      {
        name: "qpCode",
        label: "QP CODE",
        sorting: false,
        selector: (row) => row?.qpCode || "-",
      },
      {
        name: "occurance",
        label: "OCCURANCE",
        sorting: false,
        selector: (row) =>
          row?.jobroleOccurence && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                alignItems: "center",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <EyeSVG />
              {row?.jobroleOccurence || "-"}
            </div>
          ),
      },
    ];
  }, []);

  const teamMemberHeaderColumnsBD = useMemo(() => {
    return [
      {
        name: "memberName",
        label: "MEMBER NAME",
        sorting: false,
        selector: (row) => (
          <div className="username-cell">
            <Avatar
              sx={{ width: 35, height: 35, border: "1px solid #ccc" }}
              variant="rounded"
              alt={"some-alt"}
              src={"https://www.ficsi.in/public/front/images/favicon.png"}
            />
            <div>
              <h2>{row?.firstName || "-"}</h2>
              <p>{row?.email || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        name: "designation",
        label: "DESIGNATION",
        sorting: false,
        selector: (row) => row?.userRole?.[0]?.userRoleName || "-",
      },
      {
        name: "reportingManager",
        label: "REPORTING MANAGER",
        sorting: false,
        selector: (row) =>
          (row?.userRole?.[0]?.userId &&
            `${row?.userRole?.[0]?.userId?.firstName} ${row?.userRole?.[0]?.userId?.lastName}`) ||
          "-",
      },
    ];
  }, []);

  const handleAssessorPageRoute = (event, row) => {
    event.preventDefault();
    if (row?._id) {
      navigate(`${ASSESSOR_MANAGEMENT_VIEW}/${row?._id}?section=${"all"}`);
    }
  };

  const colorSelector = (value) => {
    if (value === "Pending") {
      return "rgba(255, 178, 26, 1)";
    } else if (value === "Completed") {
      return "rgba(64, 191, 127, 1)";
    } else {
      return "";
    }
  };

  const assessorListHR = useMemo(() => {
    return [
      {
        name: "assessorId",
        label: "ASSESSOR SIP ID",
        sorting: false,
        selector: (row) => row?.assessorId || "-",
      },
      {
        name: "assessorName",
        label: "ASSESSOR NAME",
        sorting: false,
        selector: (row) => (
          <div className="username-cell">
            <Avatar
              sx={{ width: 35, height: 35, border: "1px solid #ccc" }}
              variant="rounded"
              alt={row?._id || "-"}
              src={row?.url}
            />
            <div>
              <h2>{row?.fullName || "-"}</h2>
              <p>{row?.email || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        name: "jobRole",
        label: "JOBROLE",
        sorting: false,
        selector: (row) =>
          (row?.jobRole?.length > 0 &&
            row?.jobRole?.map((item) => item?.jobroleName)?.join(", ")) ||
          "-",
      },
      {
        name: "email",
        label: "EMAIL",
        sorting: false,
        selector: (row) => row?.email || "-",
      },
      {
        name: "location",
        label: "LOCATION",
        sorting: false,
        selector: (row) => row?.address || "-",
      },
      // {
      //   name: "progress",
      //   label: "PROGRESS",
      //   sorting: false,
      //   selector: (row) => (
      //     <DottedProgressBar progress={row?.profilePercentage || 0} />
      //   ),
      // },
      // {
      //   name: "createdAt",
      //   label: "CREATED AT",
      //   sorting: false,
      //   selector: (row) => formatDateInStringFormat(row?.createdAt) || "-",
      // },
      // {
      //   name: "modifiedAt",
      //   label: "MODIFIED AT",
      //   sorting: false,
      //   selector: (row) => formatDateInStringFormat(row?.updatedAt) || "-",
      // },
      // {
      //   name: "status",
      //   label: "STATUS",
      //   sorting: false,
      //   selector: (row) => (
      //     <div
      //       style={{
      //         border: `1px solid ${colorSelector(row?.profileStatus)}`,
      //         borderRadius: "20px",
      //         padding: "5px",
      //         display: "flex",
      //         alignItems: "center",
      //         justifyContent: "center",
      //       }}
      //     >
      //       <p
      //         style={{
      //           color: colorSelector(row?.profileStatus),
      //           fontWeight: "bold",
      //         }}
      //       >
      //         {row?.profileStatus}
      //       </p>
      //     </div>
      //   ),
      // },
      // {
      //   name: "action",
      //   label: "ACTION",
      //   sorting: false,
      //   selector: (row) => (
      //     <ToggleEye
      //       style={{ cursor: "pointer" }}
      //       onClick={(e) => handleAssessorPageRoute(e, row)}
      //     />
      //   ),
      // },
    ];
  }, []);

  const handleActiveAssessorRoute = (e, row) => {
    e.preventDefault();
    navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=verified`);
  };

  const handleTotalAssessorRoute = (e, row) => {
    e.preventDefault();
    navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=All`);
  };

  const clientBasedAssessorColumnOperation = useMemo(() => {
    return [
      {
        name: "clientname",
        label: "CLIENT NAME",
        sorting: false,
        selector: (row) => {
          return row?.clientname?.length > MAX_LENGTH_FOR_TOOLTIP ? (
            toolTip(row?.clientname)
          ) : (
            <div style={{ width: "100px", textWrap: "wrap" }}>
              {row?.clientname || "-"}
            </div>
          );
        },
      },
      {
        name: "totalAssessor",
        label: "TOTAL ASSESSOR",
        sorting: false,
        selector: (row) => (
          <div
            style={{
              border: "1px solid rgba(26, 117, 255, 1)",
              borderRadius: "30px",
              cursor: "pointer",
              width: "fit-content",
              display: "flex",
              justifyContent: "flex-end",
              padding: "5px",
            }}
            onClick={(e) => handleTotalAssessorRoute(e, row)}
          >
            <span
              style={{
                color: "rgba(26, 117, 255, 1)",
                fontWeight: "bold",
                width: "fit-content",
              }}
            >
              {row?.totalAssessorCount}
            </span>
          </div>
        ),
      },
      {
        name: "activeAssessor",
        label: "ACTIVE ASSESSOR",
        sorting: false,
        selector: (row) => (
          <div
            style={{
              border: "1px solid rgba(26, 117, 255, 1)",
              borderRadius: "30px",
              cursor: "pointer",
              width: "fit-content",
              display: "flex",
              justifyContent: "flex-end",
              padding: "5px",
            }}
            onClick={(e) => handleActiveAssessorRoute(e, row)}
          >
            <span
              style={{
                color: "rgba(26, 117, 255, 1)",
                fontWeight: "bold",
                width: "fit-content",
              }}
            >
              {row?.activeAssessorCount}
            </span>
          </div>
        ),
      },
    ];
  }, []);

  const handleAssignedApplicantRoute = (e, data) => {
    e.preventDefault();
    if (data?._id) {
      navigate(
        `${SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE}/${data?._id}`
      );
    }
  };

  const livaBatchStatsColumnOperations = useMemo(() => {
    return [
      {
        name: "batchId",
        label: "BATCH ID",
        sorting: false,
        selector: (row) => row?.batchId || "-",
      },
      {
        name: "clientname",
        label: "CLIENT NAME",
        sorting: false,
        selector: (row) => {
          return row?.clientId?.clientname?.length > MAX_LENGTH_FOR_TOOLTIP ? (
            toolTip(row?.clientId?.clientname)
          ) : (
            <div style={{ width: "100px", textWrap: "wrap" }}>
              {row?.clientId?.clientname || "-"}
            </div>
          );
        },
      },
      {
        name: "jobRole",
        label: "JOBROLE",
        sorting: false,
        selector: (row) =>
          (row?.jobRole?.length > 0 &&
            row?.jobRole?.map((item) => item?.jobRole)?.join(",")) ||
          "-",
      },
      {
        name: "batchStartDate",
        label: "BATCH START DATE",
        sorting: false,
        selector: (row) => row?.startDate || "-",
      },
      {
        name: "batchenDDate",
        label: "BATCH END DATE",
        sorting: false,
        selector: (row) => row?.endDate || "-",
      },
      {
        name: "assignedApplicants",
        label: "ASSIGNED APPLICANTS",
        sorting: false,
        selector: (row) => (
          <div
            style={{
              border: "1px solid #0564f2",
              borderRadius: "15px",
              width: "fit-content",
              padding: "5px",
              color: "#0564f2",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={(e) => handleAssignedApplicantRoute(e, row)}
          >
            view
          </div>
        ),
      },
    ];
  }, []);

  const handleAssessedBatchRoute = (e, data) => {
    e.preventDefault();
    navigate(SUPER_ADMIN_ASSESSMENT_BATCH);
  };

  const handleAssignBatchRoute = (e, data) => {
    e.preventDefault();
    navigate(SUPER_ADMIN_BATCH_LIST_PAGE);
  };

  const assignedAssessorColumnOperation = useMemo(() => {
    return [
      {
        name: "assessorName",
        label: "ASSESSOR NAME",
        sorting: false,
        selector: (row) => (
          <div className="username-cell">
            <Avatar
              sx={{ width: 35, height: 35, border: "1px solid #ccc" }}
              variant="rounded"
              alt={"some-alt"}
              src={
                row?.url ||
                "https://www.ficsi.in/public/front/images/favicon.png"
              }
            />
            <div>
              <h2>{row?.fullName || "-"}</h2>
              <p>{row?.email || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        name: "assessedBatches",
        label: "ASSESSED BATCHES",
        sorting: false,
        selector: (row) => (
          <p
            style={{
              fontWeight: "bold",
              fontStyle: "underline",
              color: "rgba(25, 117, 255, 1)",
              cursor: "pointer",
            }}
            onClick={(e) => handleAssessedBatchRoute(e, row)}
          >
            {row?.assessedBatch}
          </p>
        ),
      },
      {
        name: "assignedBatches",
        label: "ASSIGNED BATCHES",
        sorting: false,
        selector: (row) => (
          <p
            style={{
              fontWeight: "bold",
              fontStyle: "underline",
              color: "rgba(25, 117, 255, 1)",
              cursor: "pointer",
            }}
            onClick={(e) => handleAssignBatchRoute(e, row)}
          >
            {row?.assignedBatch}
          </p>
        ),
      },
    ];
  }, []);

  const teamMemberColumnOperation = useMemo(() => {
    return [
      {
        name: "assessorName",
        label: "ASSESSOR NAME",
        sorting: false,
        selector: (row) => (
          <div className="username-cell">
            <Avatar
              sx={{ width: 35, height: 35, border: "1px solid #ccc" }}
              variant="rounded"
              alt={"some-alt"}
              src={"https://www.ficsi.in/public/front/images/favicon.png"}
            />
            <div>
              <h2>{row?.membername || "-"}</h2>
              <p>{row?.email || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        name: "assessedBatches",
        label: "ASSESSED BATCHES",
        sorting: false,
        selector: (row) => row?.assessedBatches || "-",
      },
      {
        name: "assignedBatches",
        label: "ASSIGNED BATCHES",
        sorting: false,
        selector: (row) => row?.assignedBatches || "-",
      },
    ];
  }, []);

  const teamMemberColumnQA = useMemo(() => {
    return [
      {
        name: "assessorName",
        label: "ASSESSOR NAME",
        sorting: false,
        selector: (row) => (
          <div className="username-cell">
            <Avatar
              sx={{ width: 35, height: 35, border: "1px solid #ccc" }}
              variant="rounded"
              alt={"some-alt"}
              src={"https://www.ficsi.in/public/front/images/favicon.png"}
            />
            <div>
              <h2>{row?.firstName || "-"}</h2>
              <p>{row?.email || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        name: "designation",
        label: " DESIGNATION",
        sorting: false,
        selector: (row) => row?.designation || "-",
      },
      {
        name: "reportingManager",
        label: "REPORTING MANAGER",
        sorting: false,
        selector: (row) => row?.reportingManager || "-",
      },
    ];
  }, []);

  const handleMoniteringLogRoute = (e, row) => {
    navigate(
      `${LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH}/${row?._id}`
    );
  };

  const batchListColumnOperation = useMemo(() => {
    return [
      {
        name: "batchId",
        label: "BATCH ID (SIP)",
        sorting: false,
        selector: (row) => row?.batchId || "-",
      },
      {
        name: "jobrole",
        label: "JOBROLE",
        sorting: false,
        selector: (row) =>
          (row?.jobRole?.length > 0 &&
            row?.jobRole?.map((item) => item?.jobRole)?.join(",")) ||
          "-",
      },
      {
        name: "qpCode",
        label: "QP CODE",
        sorting: false,
        selector: (row) =>
          (row?.jobRole?.length > 0 &&
            row?.jobRole?.map((item) => item?.qpCode)?.join(",")) ||
          "-",
      },
      {
        name: "schemeName",
        label: "SCHEME NAME",
        sorting: false,
        selector: (row) => row?.schemeId?.schemeName || "-",
      },
      {
        name: "subSchemeName",
        label: "SUB SCHEME NAME",
        sorting: false,
        selector: (row) => row?.subSchemeId?.subSchemeName || "-",
      },
      {
        name: "trainingCenterName",
        label: "TRAINING CENTRE NAME",
        sorting: false,
        selector: (row) => row?.examCenterId?.examCenterName || "-",
      },
      {
        name: "batchStartDate",
        label: "BATCH START DATE",
        sorting: false,
        selector: (row) => row?.startDate || "-",
      },
      {
        name: "batchEndsDate",
        label: "BATCH END DATE",
        sorting: false,
        selector: (row) => row?.endDate || "-",
      },
      {
        name: "batchSize",
        label: "BATCH SIZE",
        sorting: false,
        selector: (row) => row?.batchSize || "-",
      },
      {
        name: "batchMode",
        label: "BATCH MODE",
        sorting: false,
        selector: (row) => row?.batchMode || "-",
      },
      {
        name: "assignedAssessor",
        label: "ASSIGNED ASSESSOR",
        sorting: false,
        selector: (row) =>
          row?.accessorId?.map((item) => item?.fullName)?.join(",") || "-",
      },
      {
        name: "monitoringLogs",
        label: "MONITORING LOGS",
        sorting: false,
        selector: (row) => (
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={(e) => handleMoniteringLogRoute(e, row)}
          >
            View Logs
          </div>
        ),
      },
      {
        name: "status",
        label: "STATUS",
        sorting: false,
        selector: (row) => row?.status || "-",
      },
    ];
  }, []);

  const clientWiseBatchColumnMIS = useMemo(() => {
    return [
      {
        name: "clientname",
        label: "CLIENT NAME",
        sorting: false,
        selector: (row) => {
          return row?.clientname?.length > MAX_LENGTH_FOR_TOOLTIP ? (
            toolTip(row?.clientname)
          ) : (
            <div style={{ width: "100px", textWrap: "wrap" }}>
              {row?.clientname || "-"}
            </div>
          );
        },
      },
      {
        name: "totalBatches",
        label: "TOTAL BATCHES",
        sorting: false,
        selector: (row) => row?.batchCount || "-",
      },
      {
        name: "onlineBatches",
        label: "ONLINE BATCHES",
        sorting: false,
        selector: (row) =>
          row?.onlineBatch && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <ToggleEye />
              <p>{row?.onlineBatch || "-"}</p>
            </div>
          ),
      },
      {
        name: "offlineBatches",
        label: "OFFLINE BATCHES",
        sorting: false,
        selector: (row) =>
          row?.offlineBatch && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <ToggleEye />
              <p>{row?.offlineBatch || "-"}</p>
            </div>
          ),
      },
      {
        name: "assessedApplicants",
        label: "ASSESSED APPLICANTS",
        sorting: false,
        selector: (row) => row?.assessedCandidates || "-",
      },
    ];
  }, []);

  const handleUploadRoute = (e, row) => {
    console.log("|||||||||||||||||||||||||", row);
    e.preventDefault();
    navigate(
      `${UPLOAD_OFFLINE_RESULTS}/${encodeURIComponent(
        row?._id
      )}/${encodeURIComponent(row?.batchId)}/${row?.batchMode}`
    );
  };

  const nosResultColumnMIS = useMemo(() => {
    return [
      {
        name: "batchId",
        label: "BATCH ID",
        sorting: false,
        selector: (row) => row?.batchId || "-",
      },
      {
        name: "jobRole",
        label: "JOBROLE",
        sorting: false,
        selector: (row) => row?.jobRole || "-",
      },
      {
        name: "trainingCenterName",
        label: "TRAINING CENTER NAME",
        sorting: false,
        selector: (row) => {
          return row?.trainingCenterName?.length > MAX_LENGTH_FOR_TOOLTIP ? (
            toolTip(row?.trainingCenterName)
          ) : (
            <div style={{ width: "100px", textWrap: "wrap" }}>
              {row?.trainingCenterName || "-"}
            </div>
          );
        },
      },
      {
        name: "assessmentDate",
        label: "ASSESSMENT DATE",
        sorting: false,
        selector: (row) => row?.assessmentDate || "-",
      },

      {
        name: "batchMode",
        label: "BATCH MODE",
        sorting: false,
        selector: (row) => row?.batchMode || "-",
      },
      {
        name: "batchSize",
        label: "BATCH SIZE",
        sorting: false,
        selector: (row) => row?.batchSize || "-",
      },
      {
        name: "enrollApplicant",
        label: "ENROLL APPLICANT",
        sorting: false,
        selector: (row) => row?.enrollApplicantCount || "-",
      },
      {
        name: "assignedAssessor",
        label: "ASSIGNED ASSESSOR",
        sorting: false,
        selector: (row) => row?.assignedAssessor || "-",
      },
      {
        name: "uploadResult",
        label: "UPLOAD RESULT",
        sorting: false,
        selector: (row) => (
          <div
            style={{
              borderRadius: "20px",
              border: "1px solid #367BF5",
              padding: "5px",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={(e) => handleUploadRoute(e, row)}
          >
            <h2 style={{ color: "#367BF5", fontWeight: "bold" }}>Upload</h2>
          </div>
        ),
      },
    ];
  }, []);

  const realTimeMoniteringSpecificColumn = useMemo(() => {
    return [
      {
        name: "date",
        label: "DATE",
        sorting: false,
        selector: (row) => row?.date || "-",
      },
      {
        name: "batchId",
        label: "BATCH ID (SIP)",
        sorting: false,
        selector: (row) => row?.batchId?.batchId || "-",
      },
      {
        name: "jobrole",
        label: "JOBROLE",
        sorting: false,
        selector: (row) => row?.batchId?.jobRole?.jobRole || "-",
      },
      {
        name: "assignedAssessor",
        label: "ASSIGNED ASSESSOR",
        sorting: false,
        selector: (row) => row?.assesorId?.fullName || "-",
      },
      {
        name: "viewVerificationTab",
        label: "View",
        sorting: false,
        selector: (row) => (
          <div
            style={{
              border: "1px solid black",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
              padding: "8px",
            }}
            onClick={(e) => handleVerificationTabRoute(e, row?.batchId)}
          >
            view
          </div>
        ),
      },
      {
        name: "checkInPhoto",
        label: "CHECKINPHOTO",
        sorting: false,
        selector: (row) => row?.checkInTime || "-",
      },
      {
        name: "checkoutPhoto",
        label: "CHECKOUTPHOTO",
        sorting: false,
        selector: (row) => row?.checkOutTime || "-",
      },
      {
        name: "groupPhotos",
        label: "GROUP PHOTOS",
        sorting: false,
        selector: (row) => row?.groupPhotoTime || "-",
      },
      {
        name: "theoryPhoto",
        label: "THEORY PHOTOS",
        sorting: false,
        selector: (row) => row?.theoryPhotoTime || "-",
      },
      {
        name: "theoryVideo",
        label: "THEORY VIDEO",
        sorting: false,
        selector: (row) => row?.theoryVideoTime || "-",
      },
      {
        name: "practicalPhoto",
        label: "PRACTICAL PHOTOS",
        sorting: false,
        selector: (row) => row?.practicalPhotoTime || "-",
      },
      {
        name: "practicalVideo",
        label: "PRACTICAL VIDEO",
        sorting: false,
        selector: (row) => row?.practicalVideoTime || "-",
      },
      {
        name: "vivaPhoto",
        label: "VIVA PHOTOS",
        sorting: false,
        selector: (row) => row?.vivaPhotoTime || "-",
      },
      {
        name: "viva video",
        label: "VIVA VIDEO",
        sorting: false,
        selector: (row) => row?.vivaVideoTime || "-",
      },
      {
        name: "adhaar photos",
        label: "ADHAAR PHOTOS",
        sorting: false,
        selector: (row) => row?.aadharHolding || "-",
      },
      {
        name: "annexureM",
        label: "ANNEXURE M",
        sorting: false,
        selector: (row) => row?.annexureM || "-",
      },
      {
        name: "annexureN",
        label: "ANNEXURE N",
        sorting: false,
        selector: (row) => row?.annexureN || "-",
      },
      {
        name: "attendanceSheet",
        label: "ATTENDANCE SHEET",
        sorting: false,
        selector: (row) => row?.attendanceSheet || "-",
      },
      {
        name: "TP UNDERTAKING",
        label: "tpUndertaking",
        sorting: false,
        selector: (row) => row?.tpUndertaking || "-",
      },
      {
        name: "questionPaper",
        label: "QUESTION PAPER \n (If Applicable)",
        sorting: false,
        selector: (row) => row?.questionPaper || "-",
      },
      {
        name: "toolsPhoto",
        label: "TOOLS PHOTO \n (If Applicable)",
        sorting: false,
        selector: (row) => row?.toolPhotoTime || "-",
      },
      {
        name: "tpUndertaking",
        label: "TP UNDERTAKING \n (If Applicable)",
        sorting: false,
        selector: (row) => row?.tpUndertaking || "-",
      },
      {
        name: "audit",
        label: "AUDIT\n(If any)",
        sorting: false,
        selector: (row) => row?.audit || "-",
      },
      {
        name: "reminder",
        label: "REMINDER",
        sorting: false,
        selector: (row) => (
          <ReminderButton
            // batchId={item?.batchId?.batchId}
            // QAverificationTimeStampId={item?._id}
            row={row}
            setLoading={setLoading}
            loading={loading}
            // assesorId={item?.assesorId}
            // setErrors={setErrors}
            // errors={errors}
          />
        ),

        // <BellReminderIcon onClick={(e)=>handleModalOpen(e,row)} />,
      },
    ];
  }, []);

  useEffect(() => {
    if (userInfo?.userDashboard && hasMounted) {
      setComponentListFromBackend(userInfo?.userDashboard?.components);
      setDashboardId(userInfo?.userDashboard?._id);
    }
  }, [userInfo, hasMounted]); //location, hasMounted

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    dispatch(GetUserPermissionApi(setLoading));
  }, [hasMounted]);

  useEffect(() => {
    if (componentsListFromBackend?.length > 0) {
      const arr1 = [];
      const arr2 = [];
      for (let item of componentsListFromBackend) {
        if (item?.componentId?.component_type === "Widget") {
          arr1.push(item);
        } else {
          arr2?.push(item);
        }
      }
      if (arr1.length > 0) {
        setWidgetList(arr1);
      }
      if (arr2?.length > 0) {
        setComponentList(arr2);
      }
    }
  }, [componentsListFromBackend]);

  const timeSpentChartData = {
    title: "Time Spent",
    backgroundColor: ["rgba(25, 117, 255, 1)", "rgba(176, 115, 255, 1)"],
    cutout: "80%",
    spacing: 5,
    width: 100,
    height: 100,
    borderRadius: 15,
    viewAttendanceRequired: true,
    centerCircleTitle: "Working Hrs",
    selectInputRequired: true,
  };

  const EmploymentTypeHRData = {
    title: "Employment Type",
    backgroundColor: ["#FFC047", "#02BA5B"],
    cutout: "65%",
    spacing: 5,
    width: 100,
    height: 100,
    borderRadius: 5,
    viewAttendanceRequired: false,
    selectInputRequired: false,
    centerCircleTitle: <span>Employment</span>,
  };

  const handleClientChange = useCallback((data) => {
    console.log("CALLBACK_TOCECHJ", data);
    setSelectedClientId(data);
  }, []);

  useEffect(() => {
    let newArr = [];
    if (clientManagementLists.length > 0) {
      for (let item of clientManagementLists) {
        // if(ListedClients.includes(item.clientcode)){
        newArr.push({
          clientName: item.clientCode,
          clientId: item._id,
        });
        // }
      }
    }
    setClientList(newArr);
  }, [clientManagementLists]);

  const handleBreadCrumbClick = useCallback((event, name, path) => {
    navigate(path);
  }, []);

  const breadCrumbsData = useMemo(() => {
    return [
      {
        name: "Overview",
        isLink: true,
        key: "1",
        path: "/",
        onClick: handleBreadCrumbClick,
        isPermissions: {
          1: true,
          2: false,
          3: false,
          4: true,
          5: false,
          6: true,
        }, // User Role permission
        isDisable: false,
      },
      {
        name: "Dashboard",
        isLink: false,
        key: "2",
        path: "",
        onClick: handleBreadCrumbClick,
        isPermissions: {
          1: true,
          2: false,
          3: false,
          4: true,
          5: false,
          6: true,
        },
        isDisable: false,
      },
    ];
  }, [handleBreadCrumbClick]);

  const leadAnalyticsBDData = {
    labels: ["Follow up", "Contacted", "Meeting Scheduled", "Not Interested"],
    backgroundColor: [
      "rgba(64, 191, 127, 1)",
      "rgba(51, 169, 255, 1)",
      "rgba(255, 136, 25, 1)",
      "rgba(246, 76, 76, 1)",
    ],
    borderRadius: 8,
    cutout: "60%",
    spacing: 10,
    hoverOffset: 5,
  };
  const questionAnalyticsCDData = {
    labels: ["Theory Questions ", "Viva Questions", "Practical Questions"],
    backgroundColor: ["#46C7A8", "#3AC5DE", "#FF9661"],
    borderRadius: 5,
    cutout: "50%",
    spacing: 10,
    hoverOffset: 8,
  };
  const clientOverviewBD = {
    label: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    dataset: [
      {
        label: "Government",
        borderColor: "rgba(64, 191, 127, 1)",
        borderWidth: 2,
      },
      {
        label: "Corporate",
        borderColor: "rgba(51, 169, 255, 1)",
        borderWidth: 2,
      },
      {
        label: "Education",
        borderColor: "rgba(246, 76, 76, 1)",
        borderWidth: 2,
      },
    ],
  };
  const sectorWiseOverviewData = {
    labels: [
      "RASCI",
      "THSC",
      "TSC",
      "FISCI",
      "LSSSDC",
      "SCPWD",
      "TSSC",
      "IASC",
      "AMHSSC",
    ],

    datasets: [
      {
        label: "Clients",
        fill: true,
        backgroundColor: {
          color1: "rgba(185, 116, 255, 1)",
          color2: "rgba(185, 116, 255, 0)",
        },
        icon: "tabler:user-up",
        borderColor: "rgba(185, 116, 255, 1)",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Job role",
        fill: "start",
        backgroundColor: {
          color1: "rgba(0, 111, 238, 1)",
          color2: "rgba(0, 111, 238, 0)",
        },
        icon: "tabler:users-plus",
        borderColor: "rgba(0, 111, 238, 1)",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const assessmentHistoryData = {
    labels: [
      "RASCI",
      "THSC",
      "TSC",
      "FISCI",
      "LSSSDC",
      "SCPWD",
      "TSSC",
      "IASC",
      "AMHSSC",
    ],

    datasets: [
      {
        label: "Clients",
        fill: true,
        backgroundColor: {
          color1: "rgba(185, 116, 255, 1)",
          color2: "rgba(185, 116, 255, 0)",
        },
        icon: "tabler:user-up",
        borderColor: "rgba(185, 116, 255, 1)",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Job role",
        fill: "start",
        backgroundColor: {
          color1: "rgba(0, 111, 238, 1)",
          color2: "rgba(0, 111, 238, 0)",
        },
        icon: "tabler:users-plus",
        borderColor: "rgba(0, 111, 238, 1)",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const dailWorkProgressData = {
    labels: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "QB",
        fill: true,
        backgroundColor: {
          color1: "rgba(185, 116, 255, 1)",
          color2: "rgba(185, 116, 255, 0)",
        },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "rgba(185, 116, 255, 1)",
            }}
          ></span>
        ),
        borderColor: "rgba(185, 116, 255, 1)",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "NOS Blueprints",
        fill: "start",
        backgroundColor: {
          color1: "rgba(0, 111, 238, 1)",
          color2: "rgba(0, 111, 238, 0)",
        },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 111, 238, 1)",
            }}
          ></span>
        ),
        borderColor: "rgba(0, 111, 238, 1)",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };
  const assessmentAnalyticsData = {
    labels: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Online",
        fill: true,
        backgroundColor: { color1: "#9787FF", color2: "#D3CCFF36" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#9787FF",
            }}
          ></span>
        ),
        borderColor: "#9787FF",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Offline",
        fill: "start",
        backgroundColor: { color1: "#FBBF24", color2: "#FFFBEF" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#FBBF24",
            }}
          ></span>
        ),
        borderColor: "#FBBF24",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };
  const resultAnalysisData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Online",
        fill: true,
        backgroundColor: { color1: "#0096C7", color2: "#FFFFFF" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#0096C7",
            }}
          ></span>
        ),
        borderColor: "#0096C7",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Offline",
        fill: "start",
        backgroundColor: { color1: "#A267DC", color2: "#F7EEFF1A" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#A267DC",
            }}
          ></span>
        ),
        borderColor: "#A267DC",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };
  const assessmentAnalysisData = {
    labels: [
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026",
      "2027",
    ],
    datasets: [
      {
        label: "Online",
        fill: true,
        backgroundColor: { color1: "#9787FF", color2: "#D3CCFF36" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#9787FF",
            }}
          ></span>
        ),
        borderColor: "#9787FF",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Offline",
        fill: "start",
        backgroundColor: { color1: "#FBBF24", color2: "#FFFBEF" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#FBBF24",
            }}
          ></span>
        ),
        borderColor: "#FBBF24",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };
  const activityData = {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
    datasets: [
      {
        label: "Assessors",
        fill: true,
        backgroundColor: { color1: "#1BBB57", color2: "#ECFFF4" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#9787FF",
            }}
          ></span>
        ),
        borderColor: "#1BBB57",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Quality Assurance",
        fill: "start",
        backgroundColor: { color1: "#FBBF24", color2: "#FFFBEF" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#FBBF24",
            }}
          ></span>
        ),
        borderColor: "#FBBF24",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };
  const assessmentAnalysisHR = {
    labels: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "QB",
        fill: true,
        backgroundColor: { color1: "#9787FF", color2: "#D3CCFF36" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#9787FF",
            }}
          ></span>
        ),
        borderColor: "#9787FF",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "NOS Blueprints",
        fill: "start",
        backgroundColor: { color1: "#FBBF24", color2: "#FFFBEF" },
        icon: (
          <span
            style={{
              height: "2px",
              width: "2px",
              borderRadius: "50%",
              backgroundColor: "#FBBF24",
            }}
          ></span>
        ),
        borderColor: "#FBBF24",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };
  const leadByCategoryData = {
    labels: ["Training Partner", "Business"],
    backgroundColor: ["rgba(255, 92, 92, 1)", "rgba(54, 162, 235, 1)"],
    barThickness: 40,
    borderWidth: 0,
    borderRadius: 10,
  };
  const schemeAnalysisData = {
    labels: ["UPSDM", "RPL", "TNSDC", "CSR", "Non-PMKVY", "NAPS", "PMKVY"],
    backgroundColor: [
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
    ],
    barThickness: 40,
    borderWidth: 0,
    borderRadius: 10,
    barPercentage: 0.6,
  };
  const batchResultStatusData = {
    backgroundColor: [
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
      "#1975FF",
    ],
    barThickness: 40,
    borderWidth: 0,
    borderRadius: 10,
    barPercentage: 0.6,
  };
  const schemeAnalysisDataMIS = {
    labels: ["UPSDM", "RPL", "TNSDC", "CSR", "Non-PMKVY", "NAPS", "PMKVY"],
    backgroundColor: [
      "#37B566",
      "#FFC047",
      "#F44C4C",
      "#F64EA9",
      "#9787FF",
      "#38BDF8",
      "#8067DC",
    ],
    barThickness: 40,
    borderWidth: 0,
    borderRadius: 10,
    barPercentage: 0.6,
  };
  const teamMembertableData = {
    isPaginationRequired: true,
    title: <span>Team Member</span>,
    isSearchRequired: false,
  };
  const clientBasedAssessorDataOperation = {
    isPaginationRequired: true,
    title: <span>Client Based Assessor</span>,
    isSearchRequired: false,
  };

  const liveBatchStatsDataOperation = {
    isPaginationRequired: true,
    title: <span>Live Batch Stats</span>,
    isSearchRequired: false,
  };

  const assignedAssessorDataOperation = {
    isPaginationRequired: true,
    title: <span>Assigned Assessor</span>,
    isSearchRequired: false,
    isDropdownSelectRequired: true,
  };
  const teamMemberDataOperation = {
    isPaginationRequired: true,
    title: <span>Team Member</span>,
    isSearchRequired: false,
  };
  const batchListDataOperation = {
    isPaginationRequired: true,
    title: <span>Batch List</span>,
    isSearchRequired: false,
  };

  const clientWiseBatchesDataOperation = {
    isPaginationRequired: true,
    title: <span>Client Wise Batches</span>,
    isSearchRequired: false,
  };

  const nosResultDataOperation = {
    isPaginationRequired: true,
    title: <span>NOS Result</span>,
    isSearchRequired: false,
  };

  const teamMemberQAData = {
    isPaginationRequired: true,
    title: <span>Team Member</span>,
    isSearchRequired: false,
  };

  const realTimeMoniteringSpecificData = {
    isPaginationRequired: true,
    title: <span>Real Time Monitoring & QA List</span>,
    isSearchRequired: false,
  };
  const assessorListDataHR = {
    isPaginationRequired: true,
    title: <span>Assessor List</span>,
    isSearchRequired: false,
  };
  const clientBasedJobRoletableData = {
    isPaginationRequired: true,
    title: <span>Client based JobRole</span>,
    isSearchRequired: false,
  };
  const allActivitiestableData = {
    isPaginationRequired: true,
    title: <span>All Activities</span>,
    isSearchRequired: false,
  };
  const clientListtableData = {
    isPaginationRequired: true,
    title: <span>Client List</span>,
    isSearchRequired: false,
  };
  const jobRoleOccurancetableData = {
    isPaginationRequired: true,
    title: <span>Jobrole Occurance</span>,
    isSearchRequired: false,
  };

  const scheduleCalenderBDData = {
    calenderName: "Upcoming Batches",
    listName: "Scheduled list",
  };

  const upcomingBatchCDData = {
    calenderName: "Schedule Batches",
    listName: "Schedule list",
  };

  const upcomingBatchODData = {
    calenderName: "Upcoming Batches",
    listName: "Schedule list",
  };

  const upcomingBatchMISData = {
    calenderName: "Upcoming Batches",
    listName: "Schedule list",
  };

  // const selectInputDetails_AssignedAssessorOperation={
  //   currentOption:,
  //   onClick:(e)=>
  // }

  const AllComponentList = {
    [dashboardConstants?.TimeSpentBD]: (
      <DonutChart
        title="Time Spent"
        dashboardType="Business"
        componentSpecificData={timeSpentChartData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ClientByLocationBD]: (
      <IndiaMap
        title="Client by location"
        dashboardType="Business"
        isButtonRequired={true}
        componentList={componentList}
        buttonsDetails={ButtonList_IndiaMap(
          dashboardConstants?.ClientByLocationBD
        )}
        clientId={selectedClientId}
      />
    ),

    [dashboardConstants?.MasterAssessorsByLocation]: (
      <IndiaMap
        title="State-Wise Master Assessor"
        dashboardType="Operations"
        isButtonRequired={true}
        componentList={componentList}
        buttonsDetails={ButtonList_IndiaMap(
          dashboardConstants?.MasterAssessorsByLocation
        )}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ExamCenter]: (
      <IndiaMap
        title="Exam Centre"
        dashboardType="Operations"
        isButtonRequired={true}
        componentList={componentList}
        buttonsDetails={ButtonList_IndiaMap(dashboardConstants?.ExamCenter)}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.SectorWiseOverviewBD]: (
      <CurveChart
        title="Sector-wise overview"
        dashboardType="Business"
        componentSpecificData={sectorWiseOverviewData}
        componentList={componentList}
        selectOptions={SECTORWISE_DROPDOWN}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ClientOverviewBD]: (
      <LineCurveChart
        title="Client overview"
        dashboardType="Business"
        componentSpecificData={leadAnalyticsBDData}
        componentList={componentList}
        selectOptions={SECTORWISE_DROPDOWN}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ApplicantAnalysisMIS]: (
      <DonutChartWithDescription
        title="Applicant Analytics"
        dashboardType="MIS"
        componentSpecificData={leadAnalyticsBDData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ScheduleCalenderBD]: (
      <ScheduledBatchCalender
        title="Schedule calendar"
        dashboardType="Business"
        componentSpecificData={scheduleCalenderBDData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.TimeSpentCD]: (
      <DonutChart
        title="Time spent"
        dashboardType="Content"
        componentSpecificData={timeSpentChartData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.DailyWorkProgressCD]: (
      <CurveChart
        title="Daily work progress"
        dashboardType="Content"
        componentSpecificData={dailWorkProgressData}
        componentList={componentList}
        selectOptions={SECTORWISE_DROPDOWN}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.QuestionAnalyticsCD]: (
      <DonutChartWithDescription
        title="Question analytics"
        dashboardType="Content"
        componentSpecificData={questionAnalyticsCDData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.LanguageDistributionCD]: (
      <DonutChartWithDetailDescription
        dashboardType="Content"
        title="Language Distribution"
        componentList={componentList}
        componentSpecificData={{ title: <span>Language Distribution</span> }}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.UpcomingBatchCD]: (
      <ScheduledBatchCalender
        title="Upcoming batches"
        dashboardType="Content"
        componentSpecificData={upcomingBatchCDData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.UpcomingBatchCalenderOD]: (
      <ScheduledBatchCalender
        title="Upcoming batches"
        dashboardType="Operations"
        componentSpecificData={upcomingBatchODData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.AssessorByLocationOD]: (
      <IndiaMap
        title="Assessor by location"
        dashboardType="Operations"
        isButtonRequired={true}
        componentList={componentList}
        buttonsDetails={ButtonList_IndiaMap(
          dashboardConstants?.AssessorByLocationOD
        )}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.AssessmentAnalyticsOD]: (
      <CurveChart
        title="Assessment Analytics"
        dashboardType="Operations"
        componentSpecificData={assessmentAnalyticsData}
        componentList={componentList}
        selectOptions={SECTORWISE_DROPDOWN}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ClientWiseAssessmentOD]: (
      <DonutChartWithDetailDescription
        componentSpecificData={{ title: <span>Client Wise Assessment</span> }}
        dashboardType="Operations"
        title="Client wise assessment"
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.SchemeAnalysisOD]: (
      <HorizontalChart
        title="Scheme Analysis"
        dashboardType="Operations"
        componentSpecificData={schemeAnalysisData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.SchemeAnalysisMIS]: (
      <HorizontalChart
        title="Scheme Analysis"
        dashboardType="MIS"
        componentSpecificData={schemeAnalysisDataMIS}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.AssessmentHistoryOD]: (
      <DonutChartWithDetailDescription
        dashboardType="Operations"
        title="Assessment history"
        componentList={componentList}
        componentSpecificData={{ title: <span>Assessment History</span> }}
        clientId={selectedClientId}
        selectInputRequired={false}
      />
    ),
    [dashboardConstants?.UpcomingBatchMIS]: (
      <ScheduledBatchCalender
        title="Upcoming batches"
        dashboardType="MIS"
        componentSpecificData={upcomingBatchMISData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.BatchVerificationStatsQA]: (
      <DonutChartWithDetailDescription
        componentSpecificData={{ title: <span>Batch Verification Stats</span> }}
        dashboardType="QA"
        title="Batch Verification Stats"
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ActivityQA]: (
      <CurveChart
        title="Activity"
        dashboardType="QA"
        componentSpecificData={activityData}
        componentList={componentList}
        selectOptions={SECTORWISE_DROPDOWN}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.BatchStaticsQA]: (
      <MultipleDonut
        title="Batch Statistics"
        dashboardType="QA"
        componentSpecificData={activityData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.EmploymentTypeHR]: (
      <DonutChart
        title="Employment Type"
        dashboardType="HR"
        componentSpecificData={EmploymentTypeHRData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.AssessmentAnalysisHR]: (
      <CurveChart
        title="Assessment Analysis"
        dashboardType="HR"
        componentSpecificData={assessmentAnalysisHR}
        selectOptions={SECTORWISE_DROPDOWN}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ResultAnalysisMIS]: (
      <CurveChart
        title="Result analytics"
        dashboardType="MIS"
        componentSpecificData={resultAnalysisData}
        componentList={componentList}
        selectOptions={SECTORWISE_DROPDOWN}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.AssessorByLocationHR]: (
      <IndiaMap
        title="Assessor by location"
        dashboardType="HR"
        isButtonRequired={true}
        componentList={componentList}
        buttonsDetails={ButtonList_IndiaMap(
          dashboardConstants?.AssessorByLocationHR
        )}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.TeamMemberBusiness]: (
      <CommonTable
        dashboardType="Business"
        title="Team member"
        headerColumn={teamMemberHeaderColumnsBD}
        tableSpecificData={teamMembertableData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),

    [dashboardConstants?.TeamMemberQA]: (
      <CommonTable
        dashboardType="QA"
        title="Team member"
        headerColumn={teamMemberHeaderColumnsBD}
        tableSpecificData={teamMembertableData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),

    [dashboardConstants?.ClientListBusiness]: (
      <CommonTable
        dashboardType="Business"
        title="Client list"
        headerColumn={clientListHeaderColumns}
        tableSpecificData={clientListtableData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),

    [dashboardConstants?.JobroleOccuranceContent]: (
      <CommonTable
        dashboardType="Content"
        title="Jobrole occurrence"
        headerColumn={jobRoleOccuranceHeaderColumns}
        tableSpecificData={jobRoleOccurancetableData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ClientBasedJobroleContent]: (
      <CommonTable
        dashboardType="Content"
        title="Client based jobrole"
        headerColumn={clientBasedobRoleHeaderColumnsBD}
        tableSpecificData={clientBasedJobRoletableData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.LiveBatchStatsOperation]: (
      <CommonTable
        dashboardType="Operations"
        title="Live batch stats"
        headerColumn={livaBatchStatsColumnOperations}
        tableSpecificData={liveBatchStatsDataOperation}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),

    [dashboardConstants?.ClientBasedAssessorOperation]: (
      <CommonTable
        dashboardType="Operations"
        title="Client based Assessor"
        headerColumn={clientBasedAssessorColumnOperation}
        tableSpecificData={clientBasedAssessorDataOperation}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.AssignedAssessorOperation]: (
      <CommonTable
        dashboardType="Operations"
        title="Assigned Assessor"
        headerColumn={assignedAssessorColumnOperation}
        tableSpecificData={assignedAssessorDataOperation}
        componentList={componentList}
        isDropdownSelectRequired={true}
        clientId={selectedClientId}
      />
    ),

    [dashboardConstants?.TeamMemberOperation]: (
      <CommonTable
        dashboardType="Operations"
        title="Team member"
        headerColumn={teamMemberHeaderColumnsBD}
        tableSpecificData={teamMemberDataOperation}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.BatchListOperation]: (
      <CommonTable
        dashboardType="Operations"
        title="Batch list"
        headerColumn={batchListColumnOperation}
        tableSpecificData={batchListDataOperation}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.ClientWiseBatchMIS]: (
      <CommonTable
        dashboardType="MIS"
        title="Client wise batch"
        headerColumn={clientWiseBatchColumnMIS}
        tableSpecificData={clientWiseBatchesDataOperation}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.NOSResultMIS]: (
      <CommonTable
        dashboardType="MIS"
        title="Nos Result"
        headerColumn={nosResultColumnMIS}
        tableSpecificData={nosResultDataOperation}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
    [dashboardConstants?.TeamMemberQA]: (
      <CommonTable
        dashboardType="QA"
        title="Team member"
        headerColumn={teamMemberHeaderColumnsBD}
        tableSpecificData={teamMemberQAData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),

    [dashboardConstants?.RealTimeMoniteringAndQALISTQA]: (
      <CommonTable
        dashboardType="QA"
        title="Real Time Monitoring & QA List"
        headerColumn={realTimeMoniteringSpecificColumn}
        tableSpecificData={realTimeMoniteringSpecificData}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),

    [dashboardConstants?.AssessorListHR]: (
      <CommonTable
        dashboardType="HR"
        title="Assessor list"
        headerColumn={assessorListHR}
        tableSpecificData={assessorListDataHR}
        componentList={componentList}
        clientId={selectedClientId}
      />
    ),
  };

  const updateLayoutStateOfWidget = (data = []) => {
    if (data?.length > 0) {
      setChangedWidgetLayout(data);
    }
  };

  const filteredComponents = elementList?.map((componentKey) => ({
    key: componentKey,
    component: AllComponentList?.[componentKey],
  }));

  const handleLayoutChange = (newLayout) => {
    const modifiedResponseData = componentList?.map((item) => {
      const element = newLayout?.find(
        (val) =>
          val?.i ===
          `${item?.componentId?.component_name} ${item?.componentId?.component_category}`
      );
      const payload = {
        components: {
          ...item,
          is_user_layout_available: true,
          user_layout: {
            h: element?.h,
            w: element?.w,
            x: element?.x,
            y: element?.y,
            widget_order: null,
          },
        },
      };

      return {
        ...item,
        is_user_layout_available: true,
        user_layout: {
          h: element?.h,
          w: element?.w,
          x: element?.x,
          y: element?.y,
          widget_order: null,
        },
      };
    });
    if (modifiedResponseData?.length > 0) {
      setChangedComponentLayout(modifiedResponseData);
    }
    setLayout(newLayout);
  };

  useEffect(() => {
    if (componentList?.length > 0) {
      const arr = [];
      for (let item of componentList) {
        if (item?.componentId?.component_type !== "Widget") {
          arr.push(
            `${item?.componentId?.component_name} ${item?.componentId?.component_category}`
          );
        }
      }
      if (arr.length > 0) {
        setElementList(arr);
      }
    }
  }, [componentList]);

  useEffect(() => {
    if (elementList?.length > 0 && componentList.length > 0) {
      let arr = [];
      for (let item of elementList) {
        const element2 = componentList?.find((value) => {
          return (
            `${value?.componentId?.component_name} ${value?.componentId?.component_category}` ===
            item
          );
        });
        if (element2?.is_user_layout_available) {
          arr.push({
            w:
              Number(element2?.user_layout?.w) ||
              getWidthAndHeightOfComponentDashboard(
                `${element2?.componentId?.component_name} ${element2?.componentId?.component_category}`
              )?.w,
            h:
              Number(element2?.user_layout?.h) ||
              getWidthAndHeightOfComponentDashboard(
                `${element2?.componentId?.component_name} ${element2?.componentId?.component_category}`
              )?.h,
            x: Number(element2?.user_layout?.x),
            y: Number(element2?.user_layout?.y),
            i: `${element2?.componentId?.component_name} ${element2?.componentId?.component_category}`,
          });
        }
      }

      if (arr.length > 0) {
        setTimeout(() => {
          setLayout((prev) => [...arr, ...prev]);
        }, 1000);
      }
    }
  }, [componentList, elementList]);

  const handleEditClick = () => {
    setEditLayout(!editLayout);
  };

  const buttonData = {
    name: "edit",
    text: !editLayout ? "Start Edit" : "Stop Edit",
    onClick: handleEditClick,
    path: "",
    loading: loading,
    disabled: loading ? true : false,
    isPermissions: {},
  };

  const ReminderButton = ({ setLoading, loading, row }) => {
    return (
      <>
        <div className="upload-btn-wrapper">
          <ReminderModel
            batchId={row?.batchId?.batchId}
            QAverificationTimeStampId={row?._id}
            setLoading={setLoading}
            loading={loading}
            assesorId={row?.assesorId?._id}
            setErrors={setErrors}
            errors={errors}
            iconRequired={true}
          />
        </div>
      </>
    );
  };

  function POCModal() {
    return (
      <div>
        <Dialog
          open={pocModalOpen}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="sm"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <div className="poc-title">
            {<POCFlag />}
            <h2>Point of Contact</h2>
            <p>See All Details of Poc here.</p>
          </div>

          <DialogContent>
            {spokeData?.length > 0 ? (
              <>
                <Box>
                  {spokeData?.map((el, index) => {
                    return (
                      <div key={index}>
                        <div className="POC_card">
                          <h1>{`POC : ${index + 1}`}</h1>
                          <Grid container>
                            <Grid item xs={12} sm={6}>
                              <p>
                                <span>Name :</span> {el?.spoke_name}
                              </p>
                              <p>
                                <span>Department :</span> {el?.spoke_department}
                              </p>
                              <p>
                                <span>Contact Number :</span>{" "}
                                {el?.spoke_mobile || "Not Provided"}
                              </p>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <p>
                                <span>Email :</span> {el?.spoke_email}
                              </p>
                              <p>
                                <span>Designation :</span>{" "}
                                {el?.spoke_designation || "Not provided"}
                              </p>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    );
                  })}
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Point of Contact Details
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    No Results to show
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  const handleClose = () => setPOCModalOpen(false);

  return (
    <div className="main-content adm-dashboard">
      <div className="dashboard-topheader">
        <div className="dashboard-welcome">
          <HeaderTitle greeting="Welcome" userName={"Team"} />
          <div className="breadcrumbs">
            <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <ClientSelect
            label="Select"
            value={selectedClientName}
            options={clientListUpdated}
            handleClientChange={handleClientChange}
            clientList={clientListUpdated}
          />
          <MyFilledBtn
            variant="contained"
            btnItemData={buttonData}
            disabled={loading ? true : false}
            text={
              loading ? <RingLoader size="25px" color="white" /> : "Create Lead"
            }
          />
        </div>
      </div>
      {loading ? (
        "loading..."
      ) : (
        <>
          <DashboardInfoCardsWidgets
            clientId={selectedClientId}
            serverData={widgetList}
            updateLayout={updateLayoutStateOfWidget}
            editStatus={editLayout}
          />
          <ResponsiveGridLayout
            className="responsive-grid"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1500 }}
            rowHeight={125}
            isResizable={false}
            isDraggable={editLayout}
            cols={{ lg: 2 }}
            onDragStop={handleLayoutChange}
          >
            {layout?.map((item) => (
              <div
                key={item.i}
                className="chart-card"
                style={{
                  overflowY: "scroll",
                  boxShadow: editLayout
                    ? "0px 0px 6px rgb(0, 0, 0)"
                    : "0px 0px 6px rgba(175, 170, 170, 0.76)",
                  scrollbarWidth: "none",
                }}
              >
                {
                  filteredComponents.find((comp) => comp.key === item.i)
                    ?.component
                }
              </div>
            ))}
          </ResponsiveGridLayout>
        </>
      )}
      <JobRoleTableModal
        open={modalOpen}
        onClose={handleModalClose}
        data={jobRoleData}
        clientNameOfJobRoleList={clientNameOfJobRoleList}
      />

      <POCModal data={setSpokeData} />
    </div>
  );
};

export default CommonDashboardForAll;
