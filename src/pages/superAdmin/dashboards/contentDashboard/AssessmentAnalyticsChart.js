import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import "./style.css";
import "../businessDashboard/style.css";
// import "../businessDashboard/businessDashboard.css";
import SelectInput from "../../../../components/common/SelectInput";
import MultipleSelect from "../../../../components/common/MultiSelect";
import CustomMultiSelect from "../../../../components/common/CustomMultiSelect";

const chartLabels = {
  weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  yearly: Array.from({ length: 10 }, (_, i) => moment().subtract(i, "years").format("YYYY")),
};

const chartBatchStats = {
  weekly: {
    online: [1, 12, 0, 15, 17, 1, 0],
    offline: [8, 5, 12, 1, 4, 16, 18],
  },
  monthly: {
    online: [10, 53, 37, 60, 12, 65, 30, 75, 50, 85, 30, 95],
    offline: [45, 28, 50, 22, 55, 80, 63, 18, 72, 27, 80, 15],
  },
};

const AssessmentAnalyticsChart = ({ assignedClientList = [] }) => {
  const [currentOption, setCurrentOption] = useState("weekly");
  const [buttonOptions, setButtonOptions] = useState([
    { name: "weekly", label: "Weekly" },
    { name: "monthly", label: "Monthly" },
  ]);

  const initialChartData = {
    labels: chartLabels.monthly,
    datasets: [
      {
        label: "Question Bank",
        data: [50, 53, 57, 41, 30, 65, 70, 80, 90, 25, 60, 45], // Extend data for 12 months
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
          gradient.addColorStop(0, "rgba(185, 116, 255, 1)");
          gradient.addColorStop(1, "rgba(185, 116, 255, 0)");
          return gradient;
        },
        icon: "tabler:user-up",
        borderColor: "#9787FF ",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "NOS Blueprints  ",
        data: [32, 60, 85, 51, 84, 76, 80, 70, 60, 50, 40, 30], // Extend data for 12 months
        fill: "start",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
          gradient.addColorStop(0, "rgba(0, 111, 238, 1)");
          gradient.addColorStop(1, "rgba(0, 111, 238, 0)");
          return gradient;
        },
        icon: "tabler:users-plus",
        borderColor: "#1975FF",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const [chartData, setChartData] = useState({ ...initialChartData });

  //

  const options = {
    scales: {
      y: {
        grid: {
          color: "rgba(214, 214, 223, 0.5)", // for the grid lines
          offset: false,
          borderDash: [3, 3],
          offset: false,
          drawTicks: false, // true is default
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

  useEffect(() => {
    setChartData((prevData) => {
      return {
        ...prevData,
        labels: chartLabels[currentOption],
        datasets: [
          {
            ...prevData.datasets[0],
            data: chartBatchStats?.[currentOption]?.online || [],
          },
          {
            ...prevData.datasets[1],
            data: chartBatchStats?.[currentOption]?.offline || [],
          },
        ],
      };
    });
  }, [currentOption]);

  const handleClickCurrentOptions = (option) => {
    setCurrentOption(option);
  };

  return (
    <div className="assessment-analytics_areaChart">
      <div className="chart-card-header">
        <h2>{"Daily Work Progress"}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {chartData?.datasets.length > 0 && (
            <div className="legend_box">
              {chartData?.datasets.map((item, idx) => (
                <div className="label" key={idx} style={{ display: "flex" }}>
                  <span style={{ background: item.borderColor }}></span>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          )}
          <div className="line-chart-options">
            {buttonOptions.length > 0 &&
              buttonOptions.map((btnItem) => (
                <button
                  className={`btn ${currentOption === btnItem.name ? "active" : ""}`}
                  onClick={() => handleClickCurrentOptions(btnItem.name)}>
                  {btnItem.label}
                </button>
              ))}
          </div>
        </div>
      </div>
      <Line height={150} data={chartData} options={options} />
    </div>
  );
};

export default AssessmentAnalyticsChart;
