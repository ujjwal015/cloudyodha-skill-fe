import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { ActionComp, DropDown } from ".";
import { getAssessmentStatisticsApi } from "../../../../api/superAdminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/superAdmin/dashboardSlice";

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="graph_tooltip">
        <h5>{label}</h5>
        <p>In Progress: {`${payload && payload[0]?.value}`}</p>
      </div>
    );
  }
  return null;
};

const AssessmentStatistics = () => {
  const [dropDown, setDropDown] = useState({ open: false, text: "year" });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(1);
  const dispatch = useDispatch();
  const { assessmentStatistics = [] } = useSelector(dashboardSelector);

  // refresh component
  const handleRefresh = () => {
    const type = "year";
    setDropDown({ open: false, text: "year" });
    dispatch(getAssessmentStatisticsApi(setLoading, type, setKey));
    setOpen(false);
  };

  const handleRemove = () => {
    setOpen(false);
  };

  const type = dropDown.text;
    useEffect(() => {
    dispatch(getAssessmentStatisticsApi(setLoading, type, setKey));
    }, [dropDown.text]);
  
  const data =
    dropDown.text == "year" || dropDown.text == "week"
      ? assessmentStatistics.map((item) => ({
          ...item,
          name: item?.name?.slice(0, 3).toUpperCase(),
        }))
      : assessmentStatistics;

  return (
    <div className="list-card earning-statistics">
      <div className="card-title">
        <h2>Assessment Statistics</h2>
        <div className="select-and-more-wrapper">
          <DropDown
            dropDown={dropDown}
            setDropDown={setDropDown}
          />
          <ActionComp
            open={open}
            setOpen={setOpen}
            handleRefresh={handleRefresh}
            handleRemove={handleRemove}
          />
        </div>
      </div>
      <div className="card-lists">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            key={key}
            width={730}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1991EB" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1991EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              style={{ fontFamily: "Poppins" }}
              axisLine={false}
              tickLine={false}
              height={35}
              dy={15}
              minTickGap={-200}
              fontSize={13}
            />
            <YAxis
              style={{ fontFamily: "Poppins" }}
              axisLine={false}
              tickLine={false}
              fontSize={13}
            />
            <CartesianGrid stroke="#EDEDED" vertical={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />

            <Area
              dot={{ stroke: "#1991EB", strokeWidth: 1, r: 5, fill: "white" }}
              activeDot={{
                stroke: "#fff",
                strokeWidth: 4,
                r: 7,
                fill: "#2196f3",
              }}
              type="monotone"
              dataKey="value"
              stroke="#1991EB"
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssessmentStatistics;
