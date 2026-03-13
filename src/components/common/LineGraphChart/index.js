import React from "react";
import { Line } from "react-chartjs-2";
import SelectInput from "../SelectInput";
import { Icon } from "@iconify/react";
import "./style.css";
const LineGraphChart = (props) => {
  const {
    name = "",
    data,
    options,
    btnOptions,
    currentOption,
    onClick,
    dropDownOptions,
    isPermissions,
    chartHeight = 180,
    chartWidth,
    mountedFor,
  } = props?.lineGraphChartData;
  return (
    <div className="clients-overview_lineChart" style={chartWidth && { width: chartWidth }}>
      <div className="chart-card-header">
        <div>
          <h2>{name}</h2>
          {mountedFor === "CONTENT_DASHBOARD_QUESTION_STAT" && (
            <div className="report-current-status">
              <Icon icon="streamline:graph-arrow-increase" />
              <p>{"23.43%"}</p>
            </div>
          )}
        </div>
        {mountedFor !== "CONTENT_DASHBOARD_QUESTION_STAT" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {data?.datasets.length > 0 && (
              <div className="legend_box">
                {data?.datasets.map((item, idx) => (
                  <div className="label" key={idx} style={{ display: "flex" }}>
                    <span style={{ background: item.borderColor }}></span>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="line-chart-options">
              {btnOptions.length > 0 &&
                btnOptions.map((btnItem) => (
                  <button
                    className={`btn ${currentOption === btnItem.name ? "active" : ""}`}
                    onClick={() => onClick(btnItem.name)}>
                    {btnItem.label}
                  </button>
                ))}
            </div>
          </div>
        )}
        {mountedFor === "CONTENT_DASHBOARD_QUESTION_STAT" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ minWidth: "120px" }}>
              <SelectInput
                name="jobrole"
                placeHolder={"Select Jobrole"}
                value={currentOption}
                handleChange={onClick}
                options={dropDownOptions}
              />
            </div>
          </div>
        )}
      </div>
      <Line height={chartHeight} data={data} options={options} />
    </div>
  );
};

export default LineGraphChart;
