import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell, Legend, Label } from "recharts";
import { ActionComp } from ".";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";
import { SyncLoader } from "react-spinners";
import { getDashboardsDataAPI } from "../../../../api/adminApi/dashboards";
import { GET_CONTENT_DASHBOARD_API } from "../../../../config/constants/apiConstants/admin";

const PieChartComp = () => {
  const dispatch = useDispatch();
  const {
    dashboardsData,
  } = useSelector(dashboardSelector);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [pieChartData, setPieChartData] = useState([
    {
      name: "Theory",
      value: 0,
      fill: "#0077B6",
    },
    {
      name: "Practical",
      value: 0,
      fill: "#00B4D8",
    },
    {
      name: "Viva",
      value: 0,
      fill: "#90E0EF",
    },
  ]);

  const handleRemove = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    setLoading(true);
    dispatch(getDashboardsDataAPI(GET_CONTENT_DASHBOARD_API,setLoading));
    setOpen(false);
  };

  useEffect(() => {
    if (Object.entries(dashboardsData).length) {
      setPieChartData(dashboardsData?.QuestionBankStatics?.QuestionBankDetails);
    }
  }, [dashboardsData]);


  const RADIAN = Math.PI / 180;
  const textStyles = { fontWeight: "bold", fontFamily: "Open Sans" };
  const renderCustomizedLabel = (props) => {
    const iRadius = Number(props.innerRadius) || 0;
    const oRadius = Number(props.outerRadius) || 0;
    const mAngle = Number(props.midAngle) || 0;
    const chartX = Number(props.cx) || 0;
    const chartY = Number(props.cy) || 0;
    const percentage = Number(props.percent) || 0;

    const radius = iRadius + (oRadius - iRadius) * 0.3;
    const x = chartX + radius * Math.cos(-mAngle * RADIAN);
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

  return (
    <div className="list-card client-statistics">
      <div className="card-title">
        <h2>Question Bank Statistics</h2>
        <div className="select-and-more-wrapper">
          <ActionComp
            open={open}
            setOpen={setOpen}
            handleRefresh={handleRefresh}
            handleRemove={handleRemove}
          />
        </div>
      </div>
      {loading ? (
        <div className="loading-wrapper">
          <SyncLoader color="#2ea8db" />
        </div>
      ) : (
        <div className="card-lists pie-results">
          <PieChart width={300} height={300}>
            <Pie
              dataKey="value"
              data={pieChartData}
              innerRadius={65}
              outerRadius={105}
              fill="#82ca9d"
              labelLine={false}
              stroke={0.1}
              label={renderCustomizedLabel}
            >
              {pieChartData?.map((entry, index) => (
                <Cell
                  onClick={() => console.log(entry)}
                  key={`cell-${index}`}
                  fill={entry?.fill}
                />
              ))}
              <Label
                content={
                  <CustomLabel labelText="Batch ID" value={dashboardsData?.QuestionBankStatics?.activeQuesBankCount} />
                }
                position="center"
              />
            </Pie>
            <Legend wrapperStyle={{ fontFamily: "Poppins" }} />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default PieChartComp;

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
        fontFamily="Open Sans"
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
        fontFamily="Open Sans"
        fontWeight="600"
      >
        {value}
      </text>
    </g>
  );
};
