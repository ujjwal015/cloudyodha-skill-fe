import React, { useState } from "react";
import HorizontalBarChart from "../../../../components/common/HorizontalBarChart";

const LeadsByCategoryBarChart = () => {
  const [value, setValue] = useState("Today");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const dropDownOptions = [
    {value: "Today", label:'Today'},
    {value: "Weekly", label:'Weekly'},
    {value: "Monthly", label:'Monthly'},
  ];  

  const options = {
    indexAxis: "y",
    responsive: true,
    scales: {
      y: {
        grid: {
          color: "rgba(214, 214, 223, 0.5)", // for the grid lines
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
      legend: {
        display: false,
      },
    },
  };
  const data = {
    labels: ["Training Partner", "Business"],
    datasets: [
      {
        data: [188, 335],
        backgroundColor: "rgba(255, 92, 92, 1)",
        barThickness: 35,
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  };

  const horizonBarChartData = {
    horizonBarChartName: "Leads by Category",
    data,
    options,
    currentValue: value,
    onChange: handleChange,
    dropDownOptions: dropDownOptions,
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },
    total: 421,
    percentage: "+32.40%",
  };

  return (
    <HorizontalBarChart horizonBarChartData={horizonBarChartData} />
  );
};

export default LeadsByCategoryBarChart;
