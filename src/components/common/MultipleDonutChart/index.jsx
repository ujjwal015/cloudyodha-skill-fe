import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./multiple-chart.css";

Chart.register(...registerables);

const MulltipleDonutChart = ({ data, title }) => {
  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }, // Disable tooltips
    },
    hover: { mode: null }, // Disable hover effect
    animation: { duration: 0 }, // Disable animations
    cutout: "80%", // Inner circle size
  };

  // Inline plugin for the custom background ring
  const customBackgroundRingPlugin = {
    id: "customBackgroundRing",
    beforeDraw: (chart) => {
      const { ctx } = chart;
      const arcs = chart.getDatasetMeta(0).data; // Get the chart data
      const arc = arcs[0]; // Use the first arc for radius calculations

      if (arc) {
        const { x, y, innerRadius, outerRadius } = arc;

        // Draw the ring behind the chart
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, 0, 2 * Math.PI); // Outer circle
        ctx.arc(x, y, innerRadius, 0, 2 * Math.PI, true); // Inner circle
        ctx.closePath();
        ctx.fillStyle = "rgba(200, 200, 200, 0.5)"; // Ring background color
        ctx.fill();
        ctx.restore();
      }
    },
  };

  // Ensure dataset border is set to 0
  const modifiedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderWidth: 0, // Remove border
      borderRadius: 5,
    })),
  };

  return (
    <div className="multiple-chart_pieChart">
      <div className="multiple-chart-wrapper">
        <Doughnut
          data={modifiedData}
          options={options}
          plugins={[customBackgroundRingPlugin]} // Add the custom plugin here
        />
        <div className="chart-inner-label">
          <p>{data.datasets[0].data[0]}</p>
        </div>
      </div>
      <h3 className="chart-label">{title}</h3>
    </div>
  );
};

export default MulltipleDonutChart;
