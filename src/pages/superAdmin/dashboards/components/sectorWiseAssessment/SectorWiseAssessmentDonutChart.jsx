import React, { useState } from "react";
import DoughNut from "../../../../../components/common/Doughnut/index";

import { Chart, registerables } from "chart.js";

Chart.register(...registerables);



const SectorWiseAssessmentDonutChart = () => {
  const [value, setValue] = useState("Today");

  const data = {
    labels: ["Follow up", "Contacted", "Meeting Scheduled", "Not Interested"],
    datasets: [
      {
        label: ":",
        data: [55, 44, 13, 43],
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
  
  const plugins = [
    {
      beforeDraw: (chart, args, opts) => {
        const { ctx } = chart;
        const arcs = chart.getDatasetMeta(0).data;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(231, 231, 231, 1)";
        // console.log(ctx.strokeStyle);
        arcs.forEach((a) => {
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.innerRadius + 1 / 2, a.startAngle, a.endAngle);
          ctx.stroke();
        });
      },
    },
  ];

  const handleChange = (event) => {
    setValue(event.target.value);
  };


  const dropDownOptions = [
    {value: "Today", label:'Today'},
    {value: "Weekly", label:'Weekly'},
    {value: "Monthly", label:'Monthly'},
  ];

  const doughNutData = {
    doughNutName: "Leads Analytics",
    data: data,
    options: options,
    currentValue: value,
    onChange: handleChange,
    dropDownOptions: dropDownOptions,
    plugins: plugins,
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },
    total: 422,
    percentage: "+32.40%",    
  };
  

  return (
    <DoughNut doughNutData={doughNutData} />
  );
};

export default SectorWiseAssessmentDonutChart;
