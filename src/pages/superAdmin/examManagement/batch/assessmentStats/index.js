import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { LinearProgress } from "@mui/material";
import { ReactComponent as BackIcon } from "../../../../../assets/icons/chevron-left.svg";
import { SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar,
  Label,
} from "recharts";
import { Tooltip as MUITooltip } from "@mui/material";
import { getAssessmentStatsByBatchApi } from "../../../../../api/superAdminApi/examManagement";
import { examManagementSelector } from "../../../../../redux/slicers/superAdmin/examManagementSlice";

const AssesmentStats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { assessmentStatsByBatch = {} } = useSelector(examManagementSelector);
  const { assesmentStatsId, batchId } = useParams();
  const [tpDetails, setTpDetails] = useState();

  useEffect(() => {
    dispatch(getAssessmentStatsByBatchApi(setLoading, assesmentStatsId));
  }, []);

  useEffect(() => {
    if (Object.entries(assessmentStatsByBatch).length > 0) {
      setTpDetails({ ...assessmentStatsByBatch?.tpDetails });
    }
  }, [assessmentStatsByBatch]);

  const formatKeyName = (key, value) => {
    const formattedValue = Math.round(value);
    if (key === "completedAssesments")
      return `Completed Assessments- ${formattedValue}`;
    else if (key === "incompeleteAssements")
      return `Incomplete Assessments- ${formattedValue}`;
    else if (key === "notAttended") return `Not Attended- ${formattedValue}`;
    // return key;
  };

  const assesmentChartarr =
    assessmentStatsByBatch?.assesmentChart &&
    Object.entries(assessmentStatsByBatch?.assesmentChart).map(
      ([key, value]) => ({ name: formatKeyName(key, value), value })
    );

  return (
    <div className="main-content">
      <div
        className="title-home_stats"
        style={{
          display: "flex",
        }}
      >
        <div>
          <BackIcon
            onClick={() => navigate(SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE)}
            style={{ cursor: "pointer" }}
          />
        </div>
        <h1>
          Batch ID: <span>{batchId || "-"}</span>
        </h1>
      </div>

      <div className="stats_card_container">
        <div className="innerContainer" style={{ flexDirection: "row" }}>
          <div className="details_container">
            <div className="subtitle">
              <h1>assessment statistics</h1>
              <p>
                Donut chart is a circular statistical graphic, which is divided
                into slices
              </p>
              <p>to illustrate numerical proportion.</p>
            </div>
            <div className="numeric_stats">
              <div className="numeric_box">
                <div className="numeric_card">
                  <p>Student Registered</p>
                  <h1>{assessmentStatsByBatch?.studentRegistered}</h1>
                </div>
                <div className="numeric_card">
                  <p>Student Attended</p>
                  <h1>{assessmentStatsByBatch?.studentAttended}</h1>
                </div>
              </div>
              <div className="percentBar_box">
                <p>
                  Total Students Attended-{" "}
                  <span>
                    {Math.round(
                      assessmentStatsByBatch?.totalStudentAttendedPercentage
                    )}
                    %
                  </span>
                </p>
                <MUITooltip
                  title={Math.round(
                    assessmentStatsByBatch?.totalStudentAttendedPercentage
                  )}
                >
                  <LinearProgress
                    variant="determinate"
                    className="linear_progressBar"
                    value={
                      Math.round(
                        assessmentStatsByBatch?.totalStudentAttendedPercentage
                      ) || 0
                    }
                    sx={{
                      height: "10px",
                      borderRadius: "5px",
                    }}
                  />
                </MUITooltip>
              </div>
            </div>
          </div>
          <div className="stats_container">
            <div
              className="pie_chart_container"
              style={{
                height: 250,
                width: 460,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart height={300} width={300} className={"pie_chart"}>
                  <Pie
                    data={assesmentChartarr}
                    cx="100"
                    cy="100"
                    // midAngle={"100"}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={60}
                    outerRadius={105}
                    legendType={"rect"}
                    fill="#82ca9d"
                    dataKey="value"
                  >
                    {assesmentChartarr?.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                    <Label
                      content={
                        <CustomLabel
                          labelText="Total"
                          value={assesmentChartarr?.reduce((accumulator, currentObject) => accumulator + currentObject.value, 0)  || 0}
                        />
                        
                      }
                      position="center"
                    />
                  </Pie>

                  <Tooltip />
                  <Legend
                    align={"right"}
                    verticalAlign={"middle"}
                    layout={"vertical"}
                    iconType={"square"}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="stats_card_barGraph">
        <div className="innerContainer">
          <div className="details_container">
            <div className="subtitle">
              <h1>assessment graphical representation</h1>
              <p>
                Donut chart is a circular statistical graphic, which is divided
                into slices
              </p>
              <p>to illustrate numerical proportion.</p>
            </div>
            <div
              className="barchart_container"
              style={{ width: "100%", maxWidth: "700px" }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  className="bar_chart"
                  width={900}
                  height={300}
                  data={assessmentStatsByBatch?.assesmentGraphical}
                  margin={{
                    top: 5,
                    right: 0,
                    left: -20,
                    bottom: 0,
                  }}
                  barSize={60}
                >
                  <XAxis
                    dataKey="name"
                    scale="point"
                    padding={{ left: 60, right: 30 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="1 1" />
                  <Bar dataKey="value" fill="#AFE8FF" animationBegin={500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div> */}

      <div className="stats_card">
        <div className="innerContainer">
          <div className="details_container">
            <div className="subtitle">
              <h1>TC/TP details</h1>
            </div>
            <div className="tc_tp_table_container">
              <table>
                <thead>
                  <tr>
                    {table_headings.map((el) => {
                      return <td key={el}>{el}</td>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {tpDetails && Object.entries(tpDetails).length > 0 ? (
                    <tr>
                      {
                        <>
                          <td>{tpDetails?.examCenterName || "-"}</td>
                          <td>{tpDetails?.state || "-"}</td>
                          <td>{tpDetails?.district || "-"}</td>
                          <td>{tpDetails?.address || "-"}</td>
                          <td>
                            {tpDetails?.trainingPartner?.trainingPartner || "-"}
                          </td>
                        </>
                      }
                    </tr>
                  ) : (
                    <tr className="no-list-table">
                      <td></td>
                      <td></td>
                      <td style={{ textAlign: "center" }}>No Results found</td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssesmentStats;

// =========[Donut Chart Data]=============
const COLORS = ["#0077B6", "#00B4D8", "#90E0EF"];

const RADIAN = Math.PI / 180;
const textStyles = { fontWeight: "bold", fontFamily: "Poppins" };
const renderCustomizedLabel = (props) => {
  const iRadius = Number(props.innerRadius) || 0;
  const oRadius = Number(props.outerRadius) || 0;
  const mAngle = Number(props.midAngle) || 0;
  const chartX = Number(props.cx) || 0;
  const chartY = Number(props.cy) || 0;
  const percentage = Number(props.percent) || 0;

  const radius = iRadius + (oRadius - iRadius) * 0.3;
  const x = chartX + radius * Math.cos(-mAngle * RADIAN) + 9;
  const y = chartY + radius * Math.sin(-mAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > chartX ? "start" : "end"}
      dominantBaseline="central"
      style={textStyles}
      fontFamily="Open Sans"
    >
      {`${(percentage * 100).toFixed(0)}%`}
    </text>
  );
};

const table_headings = [
  "Exam Center",
  "EC State",
  "EC district",
  "EC address",
  "Training partner",
];

const CustomLabel = ({ viewBox, labelText, value }) => {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
        fontSize="15"
        fontFamily="Poppins"
        fill="#6E6B7BB2"
      >
        {labelText}
      </text>
      <text
        x={cx}
        y={cy + 20}
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
        fill="#242731"
        fontSize="26"
        fontFamily="Poppins"
        fontWeight="600"
      >
        {value}
      </text>
    </g>
  );
};
