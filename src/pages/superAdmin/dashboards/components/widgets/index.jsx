import { Line } from "react-chartjs-2";
import "./style.css";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { dashboardSelector } from "../../../../../redux/slicers/admin/dashboardSlice";
import { getTotalJobRoleData_CD } from "../../../../../api/adminApi/dashboard";
import { getSpecificWidgetDataAPI } from "../../../../../api/superAdminApi/dashboard";
import { useInView } from "react-intersection-observer";
import { RingLoader } from "react-spinners";
import SyncReactLoader from "../../../../../components/common/syncLoader";
import WidgetSkeleton from "./skeleton";
import { Link, NavLink } from "react-router-dom";

const WidgetComponent = ({
  widgetName,
  dashboardName = "",
  clientId = "",
  key,
  SVGIcon,
  isLineGraphRequired = true,
  linkData = {},
  serverData = {},
  widgetSpecificData = {},
}) => {
  console.log(
    "widgetName",
    widgetName,
    "dashboardName",
    dashboardName,
    "linkData",
    linkData
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { widgetStats = {} } = useSelector(dashboardSelector);
  const [widgetURL, setWidgetURL] = useState("");
  const [widgetData, setWidgetData] = useState({});
  const [todoCount, setTodoCount] = useState(0);

  const { ref, inView } = useInView({ threshold: 0.5 });
  const prevTextRef = useRef(clientId);

  const updateWidgetData = (data) => {
    if (Object.keys(data)?.length > 0) {
      setWidgetData(data);
      if (data?.toDoBluePrint || data?.toDoQuestionBank) {
        setTodoCount(data?.toDoBluePrint || data?.toDoQuestionBank);
      }
    }
  };

  const getWidgetDataAPI = (url) => {
    setLoading(true);
    dispatch(
      getSpecificWidgetDataAPI(setLoading, url, clientId, updateWidgetData)
    );
  };

  useEffect(() => {
    if (serverData?.length > 0) {
      const element = serverData?.find(
        (item) =>
          `${item?.componentId?.component_name} ${item?.componentId?.component_category}` ===
          `${widgetName} ${dashboardName}`
      );
      if (element) {
        setWidgetURL(element?.componentId?.endpoint);
      }
    }
  }, [serverData]);
  useEffect(() => {
    if (widgetURL && inView && clientId !== prevTextRef.current) {
      prevTextRef.current = clientId;
      getWidgetDataAPI(widgetURL);
    } else if (
      widgetURL &&
      inView &&
      clientId === "" &&
      !Object.keys(widgetData)?.length > 0
    ) {
      getWidgetDataAPI(widgetURL);
    }
  }, [widgetURL, inView, clientId]);

  const data = {
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
        label: "Government",
        data: [20, 3, 57, 1, 30, 5, 70, 0, 90, 5, 60, 55],
        borderColor: widgetSpecificData?.borderColor || "rgba(0, 206, 107, 1)",
        borderWidth: 3,
        tension: 0.4,
        fill: "start",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height
          );
          gradient.addColorStop(
            0,
            widgetSpecificData?.stopOneColor || "rgba(0, 206, 107, 0.7)"
          ); //rgba(0, 206, 107, 0.7)
          gradient.addColorStop(
            1,
            widgetSpecificData?.stopTwoColor || "rgba(0, 206, 107, 0)"
          );
          return gradient;
        },
      },
    ],
  };

  const options = {
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
    plugins: {
      tooltip: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        pointRadius: 0,
        hoverRadius: 0,
      },
    },
  };

  const data3 = {
    datasets: [
      {
        data: [10, 7, 65, 3, 45, 12, 80, 3, 100, 12, 70, 65],
        borderColor: "rgba(255, 71, 71, 1)",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height
          );
          gradient.addColorStop(0, "rgba(255, 71, 71, 0.7)");
          gradient.addColorStop(1, "rgba(255, 71, 71, 0)");
          return gradient;
        },
      },
    ],
  };

  const dataOfWidgets = {
    name: <span>{widgetName}</span>,
    value:
      widgetData?.totalBluePrintCount ??
      widgetData?.totalClient ??
      widgetData?.totalProctor ??
      widgetData?.jobRoleCount ??
      widgetData?.totalQuestionBankCount ??
      widgetData?.primaryQuestionCount ??
      widgetData?.jobRoleCount ??
      widgetData?.activeClients ??
      widgetData?.activeLeads ??
      widgetData?.totalClient ??
      widgetData?.totalAssesorCount ??
      widgetData?.totalAssesorCount ??
      widgetData?.totalBatch ??
      widgetData?.adminStats?.liveBatch ??
      widgetData?.totalProctor ??
      widgetData?.AssignedApplicantCount ??
      widgetData?.adminStats?.assessedBatch ??
      widgetData?.adminStats?.liveBatch ??
      widgetData?.activeBatch ??
      widgetData?.activeAssesorCount ??
      widgetData?.OngoingBatch ??
      widgetData?.totalAttendanceRequestCounts ??
      widgetData?.result ??
      widgetData?.totalAssignedAssessorCount ??
      widgetData?.upcomingBatch ??
      widgetData?.masterAssessor ??
      widgetData?.totalAssessorCountByTotalValidAssessorCount,
    Icon: <SVGIcon />,
    className: "listitem4",
    data: data3,
    options: options,
    percentage: "+23.22%",
    currentStatus: "Increased last month",
    isLinkActive: linkData?.isLinkActive,
    linkQuery: linkData?.linkQuery ?? {},
    handleRoute: linkData?.handleRoute,
    growthStatus: true,
    isPermissions: linkData?.isPermissions,
    linkText: linkData?.linkText,
    isTodoListReq: true,
    link: linkData?.link,
    query: linkData?.query,
    handleLinkClick: linkData?.handleLinkClick,
    title: linkData?.title,
    linkTextOne: linkData?.linkTextOne,
    linkTextTwo: linkData?.linkTextTwo,
    linkOne: linkData?.linkOne,
    linkTwo: linkData?.linkTwo,
  };

  return (
    <div ref={ref}>
      {loading ? (
        <WidgetSkeleton />
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", height: "auto" }}
        >
          <div className="card-title">
            <div>
              <p>{dataOfWidgets?.name}</p>
              <div className="val-txt">
                <h3 style={{ fontWeight: "bold" }}>
                  {loading ? (
                    <SyncReactLoader
                      loading={loading}
                      size={5}
                      color="#000000"
                    />
                  ) : (
                    dataOfWidgets?.value
                  )}
                </h3>
              </div>
            </div>
            <div className="chart" style={{ width: 80 }}>
              {isLineGraphRequired ? (
                <Line data={data} options={options} />
              ) : (
                <SVGIcon />
              )}
            </div>
          </div>
          <div className="info"></div>
          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "7px" }}
          >
            {dataOfWidgets?.title === "resultUpload" &&
              dataOfWidgets?.isLinkActive &&
              !loading && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Link
                    to={{
                      pathname: dataOfWidgets?.linkOne,
                      state: {
                        clientId: clientId,
                        query: dataOfWidgets?.query,
                      },
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={dataOfWidgets?.handleLinkClick}
                  >
                    <p
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: "bold",
                        color: dataOfWidgets?.growthStatus
                          ? "rgba(25, 117, 255, 1)"
                          : "rgba(244, 29, 29, 1)",
                        textDecoration: "underline",
                        paddingLeft: "5px",
                        cursor: dataOfWidgets?.isPermissions
                          ? "pointer"
                          : "not-allowed",
                      }}
                    >
                      {dataOfWidgets?.linkTextOne}
                    </p>
                  </Link>
                  <Link
                    to={{
                      pathname: dataOfWidgets?.linkTwo,
                      state: {
                        clientId: clientId,
                        query: dataOfWidgets?.query,
                      },
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={dataOfWidgets?.handleLinkClick}
                  >
                    <p
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: "bold",
                        color: dataOfWidgets?.growthStatus
                          ? "rgba(25, 117, 255, 1)"
                          : "rgba(244, 29, 29, 1)",
                        textDecoration: "underline",
                        paddingLeft: "5px",
                        cursor: dataOfWidgets?.isPermissions
                          ? "pointer"
                          : "not-allowed",
                      }}
                      onClick={dataOfWidgets?.handleRoute}
                    >
                      {dataOfWidgets?.linkTextTwo}
                    </p>
                  </Link>
                </div>
              )}

            {dataOfWidgets?.title !== "resultUpload" &&
              dataOfWidgets?.isLinkActive &&
              !loading && (
                <Link
                  to={{
                    pathname: dataOfWidgets?.link,
                  }}
                  state={{
                    ...dataOfWidgets?.linkQuery,
                    clientId: clientId,
                    query: dataOfWidgets?.query,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dataOfWidgets?.handleLinkClick}
                >
                  <p
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      color: dataOfWidgets?.growthStatus
                        ? "rgba(25, 117, 255, 1)"
                        : "rgba(244, 29, 29, 1)",
                      textDecoration: "underline",
                      paddingLeft: "5px",
                      cursor: dataOfWidgets?.isPermissions
                        ? "pointer"
                        : "not-allowed",
                    }}
                    // onClick={dataOfWidgets?.handleRoute}
                  >
                    {dataOfWidgets?.linkText}
                  </p>
                </Link>
              )}
            {!dataOfWidgets?.isLinkActive &&
              loading &&
              // dataOfWidgets?.isTodoListReq &&
              Boolean(todoCount) && (
                <p
                  style={{
                    color: "rgba(144, 149, 160, 1)",
                    fontSize: "0.5rem",
                    paddingLeft: "5px",
                  }}
                >
                  To-do List{" "}
                  {todoCount && (
                    <span style={{ opacity: "0.8", fontSize: ".10rem" }}>
                      ({todoCount})
                    </span>
                  )}
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetComponent;
