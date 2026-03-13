import React, { useState } from "react";
import TimeSpentPieChart from "../../../../components/common/TimeSpentPieChart/index";



const TimeSpentChart = () => {
  const [currentValue, setCurrentValue] = useState("Today");

  const handleChange = (event) => {    
    setCurrentValue(event.target.value);
  };
  const data = {
    labels: ["Online Time", "Idle Time"],
    datasets: [
      {
        label: "Time Spent",
        data: [6, 1],
        backgroundColor: ["rgba(25, 117, 255, 1)", "rgba(176, 115, 255, 1)"],
        borderRadius: 20,
        cutout: "80%",
        spacing: 3,
        rotation: 90,
        borderWidth: 0,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: true,
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
  
  const dropOptions = [
    {value: "Today", label:'Today'},
    {value: "Weekly", label:'Weekly'},
    {value: "Monthly", label:'Monthly'},
  ] ;
  const timeSpentChartData = {
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },
    title: "Time Spent",
    value: currentValue,
    dropDownOptions: dropOptions,
    handleChange: handleChange,
    data: data,
    options: options,
    hours: "7",
    mins: "",
  };
  return (
    <TimeSpentPieChart charts={timeSpentChartData} />
  );
};

export default TimeSpentChart;
