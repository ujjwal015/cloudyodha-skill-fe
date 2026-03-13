import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Chart, registerables } from "chart.js";
import { FormControl, InputLabel } from "@mui/material";
import { ReactComponent as GetReportIcon } from "../../../assets/icons/admin/get-report-icon.svg";

import SelectInput from "../SelectInput";

Chart.register(...registerables);

const AssessedApplicants = (props) => {
  const {
    dropDownOptions,
    value,
    handleChange,
    name,
    title,
    hours,
    mins,
    data,
    options,
    selectInputRequired = true,
    viewAttendanceRequired = true,
    isAssessedApplicant = false,
    totalAssessedApplicants = "",
    total,
    percentage,
  } = props?.charts;
  return (
    <div className="time-spent_pieChart" style={{ gridColumn: 2 / 3, width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}>
        <h2>{title}</h2>
        {totalAssessedApplicants && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}>
            <p>
              {total}{" "}
              <span style={{ alignSelf: "baseline" }}>
                {/* <GetReportIcon style={{ alignSelf: "baseline" }} /> {percentage} */}
              </span>{" "}
            </p>
          </div>
        )}
      </div>
      <div className="chart-wrapper" style={{ maxHeight: "100%" }}>
        <Doughnut options={options} data={data} />
        <div className="total-time">
          {isAssessedApplicant ? (
            <p style={{ fontSize: "large", fontWeight: "bold" }}>{totalAssessedApplicants}</p>
          ) : (
            <p></p>
          )}
        </div>
      </div>
      <div className="chart-wrapper-legend" style={{}}>
        {data.labels.map((item, idx) => (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }} key={idx}>
            <span style={{ background: data?.datasets[0].backgroundColor[idx] }}></span>
            <div>
              <h6 style={{ fontWeight: "normal", fontSize: "small" }}>
                {item} <span>{data?.datasets[0].data[idx]}</span>
              </h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessedApplicants;
