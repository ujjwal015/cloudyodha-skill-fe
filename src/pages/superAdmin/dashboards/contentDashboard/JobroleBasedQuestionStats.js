import React, { useState } from "react";
import LineGraphChart from "../../../../components/common/LineGraphChart";

const JobroleBasedQuestionStats = () => {
  const [selectedJobrole, setSelectedJobrole] = useState("");

  const data = {
    labels: ["English", "Hindi", "Tamil", "Marathi", "Bengali"],
    datasets: [
      {
        label: "",
        data: [50, 53, 57, 41, 30],
        borderColor: "#165BAA",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        grid: {
          color: "rgba(214, 214, 223, 0.5)", // for the grid lines
          offset: false,
          borderDash: [3, 3],
          drawTicks: false, // true is default
        },
        beginAtZero: true,
      },
      x: {
        grid: {
          display: false,
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
    elements: {
      point: {
        backgroundColor: (context) => context.dataset.borderColor,
        pointRadius: 2,
        hoverRadius: 4,
      },
    },
  };

  const handleJobroleChange = (option) => {
    const selectedValue = option?.target?.value;
    setSelectedJobrole(selectedValue);
  };

  const lineGraphChartData = {
    name: "Question Stats",
    data: data,
    options: options,
    btnOptions: [],
    dropDownOptions: [
      { label: "ASS1", value: "ASS1" },
      { label: "ASS2", value: "ASS2" },
      { label: "ASS3", value: "ASS3" },
    ],
    currentOption: selectedJobrole,
    chartHeight: 140,
    chartWidth:'50%',
    onClick: handleJobroleChange,
    mountedFor: "CONTENT_DASHBOARD_QUESTION_STAT",
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },
  };

  return <LineGraphChart lineGraphChartData={lineGraphChartData} />;
};

export default JobroleBasedQuestionStats;
