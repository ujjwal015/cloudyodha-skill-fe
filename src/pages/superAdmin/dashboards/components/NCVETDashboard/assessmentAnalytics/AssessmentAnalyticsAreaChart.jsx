import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import SectorWise from "../../../../../../components/common/SectorWise";
import { getAssessorAnalyticsData } from "../../../../../../api/adminApi/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { dashboardSelector } from "../../../../../../redux/slicers/admin/dashboardSlice";

const AssessmentAnalyticsAreaChart = ({ clientId = "", className }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { assessmentAnalyticsData = {} } = useSelector(dashboardSelector);
  const [filterValue, setFilterValue] = useState("weekly");
  const [WeeklyDataOnline, setWeeklyDataOnline] = useState([]);
  const [WeeklyDataOffline, setWeeklyDataOffline] = useState([]);
  const [monthlyOnline, setMonthlyOnline] = useState([]);
  const [monthlyOffline, setMonthlyOffline] = useState([]);

  const getAssessmentAnalyticsData = useCallback(() => {
    dispatch(getAssessorAnalyticsData(setLoading, clientId));
  }, [clientId, dispatch]);

  useEffect(() => {
    getAssessmentAnalyticsData();
  }, [clientId]);

  useEffect(() => {
    const monthData = [];
    const weekData = [];
    const montharrayOnline = [];
    const montharrayOffline = [];
    const weekarrayOnline = [];
    const weekarrayOffline = [];

    for (let item of Object.keys(assessmentAnalyticsData)) {
      if (item === "monthResponse") {
        for (let data of assessmentAnalyticsData[item]) {
          monthData.push(Object.values(data)[0]);
        }
      } else if (item === "weekResponse") {
        for (let data of assessmentAnalyticsData[item]) {
          weekData.push(Object.values(data)[0]);
        }
      }
    }

    for (let data of monthData) {
      if (Object.keys(data).length > 0) {
        montharrayOnline.push(data.online || 0);
        montharrayOffline.push(data.offline || 0);
      } else {
        montharrayOnline.push(0);
        montharrayOffline.push(0);
      }
    }

    for (let data of weekData) {
      if (Object.keys(data).length > 0) {
        weekarrayOnline.push(data.online || 0);
        weekarrayOffline.push(data.offline || 0);
      } else {
        weekarrayOnline.push(0);
        weekarrayOffline.push(0);
      }
    }
    setMonthlyOffline(montharrayOffline);
    setMonthlyOnline(montharrayOnline);
    setWeeklyDataOffline(weekarrayOffline);
    setWeeklyDataOnline(weekarrayOnline);
  }, [assessmentAnalyticsData]);

  const handleConditionalDataRenderOnline = useCallback(() => {
    if (filterValue === "weekly") {
      return WeeklyDataOnline;
    } else if (filterValue === "monthly") {
      return monthlyOnline;
    }
  }, [WeeklyDataOnline, filterValue, monthlyOnline]);

  const handleConditionalDataRenderOffline = useCallback(() => {
    if (filterValue === "weekly") {
      return WeeklyDataOffline;
    } else if (filterValue === "monthly") {
      return monthlyOffline;
    }
  }, [WeeklyDataOffline, filterValue, monthlyOffline]);

  const handlelabel = useCallback(() => {
    if (filterValue === "weekly") {
      return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    } else if (filterValue === "monthly") {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
  }, [filterValue]);

  const data = useMemo(() => {
    return {
      labels: handlelabel(),
      datasets: [
        {
          label: "Online",
          data: handleConditionalDataRenderOnline(),
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
            gradient.addColorStop(0, "rgba(151, 135, 255,1)");
            gradient.addColorStop(1, "rgba(151, 135, 255,0)");
            return gradient;
          },
          icon: "tabler:user-up",
          borderColor: "#9787FF",
          borderWidth: 1,
          tension: 0.4,
        },
        {
          label: "Offline",
          data: handleConditionalDataRenderOffline(),
          fill: "start",
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
            gradient.addColorStop(0, "rgba(251, 191, 36,1)");
            gradient.addColorStop(1, "rgba(251, 191, 36,0)");
            return gradient;
          },
          icon: "tabler:users-plus",
          borderColor: "#FBBF24",
          borderWidth: 1,
          tension: 0.4,
        },
      ],
    };
  }, [handleConditionalDataRenderOffline, handleConditionalDataRenderOnline, handlelabel]);

  const options = useMemo(() => {
    return {
      scales: {
        y: {
          grid: {
            color: "rgba(214, 214, 223, 0.5)",
            offset: false,
            borderDash: [3, 3],
            offset: false,
            drawTicks: false,
          },

          beginAtZero: true,
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          titleFont: {
            size: 13,
          },
          bodyFont: {
            size: 10,
          },
        },
        legend: {
          display: false,
        },
      },
    };
  }, []);

  const catergoryWiseData = useMemo(() => {
    return {
      categoryName: "Assessement Analytics",
      data,
      options,
      isPermissions: {
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: true,
      },
      setFilterValue,
      className,
      isAssessmentAnalyticsSection: true,
    };
  }, [data, options]);

  return <SectorWise catergoryWiseData={catergoryWiseData} />;
};

export default memo(AssessmentAnalyticsAreaChart);
