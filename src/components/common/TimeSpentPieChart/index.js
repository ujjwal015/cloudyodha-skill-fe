import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Chart, registerables } from "chart.js";
import { FormControl, InputLabel } from "@mui/material";
import { ReactComponent as GetReportIcon } from "../../../assets/icons/admin/get-report-icon.svg";

import SelectInput from "../SelectInput";
import RingLoaderCompoenent from "../RingLoader";
import MapSkeleton from "../../../pages/superAdmin/dashboards/components/Charts/skeleton";
import CurveChartSkeleton from "../../../pages/superAdmin/dashboards/components/Charts/skeleton";
import CurveSkeletonCircle from "../../../pages/superAdmin/dashboards/components/Charts/skeleton/curveSkeletonCircle";

Chart.register(...registerables);

const TimeSpentPieChart = (props) => {
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
    loading,
    selectInputRequired = true,
    viewAttendanceRequired = true,
    isAssessedApplicant = false,
    viewAttendanceData,
    totalAssessedApplicants = "",
    totalCount,
    centerCircleTitle,
    total,
    percentage,
    ref,
  } = props?.charts;
  return (
    <div ref={ref}>
      {loading ? (
        // <RingLoaderCompoenent />
        <CurveSkeletonCircle/>
      ) : (
        <div
          className="time-spent_pieChart"
          style={{ gridColumn: 1 / 3, width: "auto", height: "auto" }}
        >
          <div
            className="chart-card-header"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <h2>{title}</h2>
            {totalAssessedApplicants && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <p>
                  {total}{" "}
                  <span style={{ alignSelf: "baseline" }}>
                    <GetReportIcon style={{ alignSelf: "baseline" }} />{" "}
                    {percentage}
                  </span>{" "}
                </p>
              </div>
            )}
            {selectInputRequired && (
              <div style={{ width: "auto" }}>
                <SelectInput
                  name="Filter by Time spent"
                  value={value}
                  handleChange={handleChange}
                  options={dropDownOptions}
                  placeHolder={""}
                />
              </div>
            )}
          </div>
          <div className="chart-wrapper">
            <Doughnut options={options} data={data} width={250} height={250} />
            <div className="total-time">
              <h3>{hours ? `${hours}h` : mins && `${mins}mins`}</h3>
              <p style={{ fontSize: "large", fontWeight: "bold" }}>
                {totalCount}
              </p>
              <p>{centerCircleTitle}</p>
            </div>
          </div>
          <div className="chart-wrapper-legend">
            {data.labels.map((item, idx) => (
              <div
                style={{ display: "flex", gap: 5, alignItems: "center" }}
                key={idx}
              >
                <span
                  style={{
                    background: data?.datasets[0]?.backgroundColor[idx],
                  }}
                ></span>
                <div>
                  <h5>{data?.datasets[0].data[idx]}</h5>
                  <p>{item && item?.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>

          {viewAttendanceData?.viewAttendanceRequired && (
            <div
              className="time-spent_pieChart__footer"
              style={{ display: "flex", alignItems: "center" }}
            >
              <h6
                style={{
                  fontSize: "small",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={viewAttendanceData?.handleViewAttendance}
              >
                View Attendance
              </h6>
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.22518 4.16683C3.37788 2.17416 5.53236 0.833496 7.99997 0.833496C11.6819 0.833496 14.6666 3.81826 14.6666 7.50016C14.6666 11.1821 11.6819 14.1668 7.99997 14.1668C5.53236 14.1668 3.37788 12.8262 2.22518 10.8335M7.99992 10.1668L10.6666 7.50016M10.6666 7.50016L7.99992 4.8335M10.6666 7.50016H1.33325"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSpentPieChart;
