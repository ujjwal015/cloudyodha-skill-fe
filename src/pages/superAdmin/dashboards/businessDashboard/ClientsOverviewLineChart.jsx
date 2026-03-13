import React, { useState } from "react";
import LineGraphChart from "../../../../components/common/LineGraphChart";


const ClientsOverviewLineChart = ({className}) => {
  const [currentOption, setCurrentOption] = useState("monthly");
  const [buttonOptions, setButtonOptions] = useState([{name: "monthly", label: "Monthly"}, {name: "yearly", label: "Yearly"}]);
  
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Extend labels to cover 12 months
    datasets: [
      {
        label: "Government",
        data: [50, 53, 57, 41, 30, 65, 70, 80, 90, 25, 60, 45], // Extend data for 12 months
        borderColor: "rgba(64, 191, 127, 1)",
        borderWidth: 2,
      },
      {
        label: "Corporate",
        data: [32, 60, 85, 51, 84, 76, 80, 70, 60, 50, 40, 30], // Extend data for 12 months
        borderColor: "rgba(51, 169, 255, 1)",
        borderWidth: 2,
      },
      {
        label: "Education", // Add one more category
        data: [10, 90, 26, 60, 100, 132, 20, 161, 118, 121, 112, 130], // Extend data for 12 months
        borderColor: "rgba(246, 76, 76, 1)",
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

  const handleClickCurrentOptions = (option) =>{
    setCurrentOption(option)
  };
  
  const lineGraphChartData = {
    name: "Client Overview",
    data: data,
    className: className,
    options: options,
    btnOptions: buttonOptions,
    currentOption: currentOption,
    onClick: handleClickCurrentOptions,
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },  
  };

  return (
   <LineGraphChart lineGraphChartData={lineGraphChartData}/>
  );
};

export default ClientsOverviewLineChart;
