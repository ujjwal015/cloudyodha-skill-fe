import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dashboardSelector } from "../../../../../redux/slicers/admin/dashboardSlice";
import { ReactComponent as ActiveBatchIcon } from "../../../../../assets/icons/admin/active-batch-icon.svg";
import { ReactComponent as TotalBatchIcon } from "../../../../../assets/icons/admin/total-batch-icon.svg";
import { ReactComponent as TotalCandidateIcon } from "../../../../../assets/icons/admin/total-candidate-icon.svg";
import { ReactComponent as ExamCenterIcon } from "../../../../../assets/icons/admin/exam-center-icon.svg";
import { getWidgetStatsApi } from "../../../../../api/adminApi/dashboard";
import CardInfo from "../../../../../components/common/CardInfo";


const ProgressInfoCard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { widgetStats = {} } = useSelector(dashboardSelector);
  console.log("widgetStats",widgetStats)

  useEffect(() => {
    dispatch(getWidgetStatsApi(setLoading));
  }, []);

  const options = {
    scales: {
      y: {
        display: false,
        type:"linear",
      },
      x: {
        display: false,
        type:"category",
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
    ], // Extend labels to cover 12 months
    datasets: [
      {
        label: "Government",
        data: [20, 3, 57, 1, 30, 5, 70, 0, 90, 5, 60, 55], // Extend data for 12 months
        borderColor: "rgba(0, 206, 107, 1)",
        borderWidth: 2,
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
          gradient.addColorStop(0, "rgba(0, 206, 107, 0.7)");
          gradient.addColorStop(1, "rgba(0, 206, 107, 0)");
          return gradient;
        },
      },
    ],
  };

  const data1 = {
    ...data,
    datasets: [
      {
        ...data.datasets[0],
        data: [25, 10, 50, 5, 35, 10, 65, 5, 85, 10, 55, 50],
        borderColor: "rgba(254, 138, 55, 1)",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height
          );
          gradient.addColorStop(0, "rgba(254, 138, 55, 0.7)");
          gradient.addColorStop(1, "rgba(254, 138, 55, 0)");
          return gradient;
        },
      },
    ],
  };

  const data2 = {
    ...data,
    datasets: [
      {
        ...data.datasets[0],
        data: [25, 5, 60, 12, 40, 8, 75, 2, 85, 8, 65, 60],
        borderColor: "rgba(151, 71, 255, 1)",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height
          );
          gradient.addColorStop(0, "rgba(151, 71, 255, 0.7)");
          gradient.addColorStop(1, "rgba(151, 71, 255, 0)");
          return gradient;
        },
      },
    ],
  };

  const data3 = {
    ...data,
    datasets: [
      {
        ...data.datasets[0],
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

  const ListItems = [
    {
      name: "Active Clients",
      value: widgetStats?.activeClients,
      Icon: ActiveBatchIcon,
      className: "listitem1",
      data: data,
      options: options,
      percentage: "-23.22%",
      currentStatus: "Increased last month",
      isPermissions: {
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: true,
      },
    },
    {
      name: "Total Clients",
      value: widgetStats?.activeClients,
      Icon: TotalBatchIcon,
      className: "listitem2",
      data: data1,
      options: options,
      percentage: "+23.22%",
      currentStatus: "Increased last month",
      isPermissions: {
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: true,
      },
    },
    {
      name: "Active Leads",
      value: widgetStats?.activeLeads,
      Icon: TotalCandidateIcon,
      className: "listitem3",
      data: data2,
      options: options,
      percentage: "+23.22%",
      currentStatus: "Increased last month",
      isPermissions: {
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: true,
      },
    },
    {
      name: "Total Jobrole",
      value: widgetStats?.activeLeads,
      Icon: ExamCenterIcon,
      className: "listitem4",
      data: data3,
      options: options,
      percentage: "+23.22%",
      currentStatus: "Increased last month",
      isPermissions: {
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: true,
      },
    },
  ];

  return (
    <div className="dashboard-totalview">
      <CardInfo cardLists={ListItems} />
    </div>
  );
};

export default ProgressInfoCard;
