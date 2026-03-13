import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell, Legend, Label } from "recharts";
import { ActionComp } from ".";
import { dashboardSelector } from "../../../redux/slicers/admin/dashboardSlice";
import { getClientStatisticsApi } from "../../../api/adminApi/dashboard";
import { SyncLoader } from "react-spinners";

const PieChartComp = () => {
  const dispatch = useDispatch();
  const { clientStatistics: { totalClient = 0, categorziedData = [] } = {} } =
    useSelector(dashboardSelector);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleRemove = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    setLoading(true)
    dispatch(getClientStatisticsApi(setLoading));
    setOpen(false);
  };

  const getClientStatistics = () => {
    dispatch(getClientStatisticsApi(setLoading));
  };

  useEffect(() => {
    getClientStatistics();
  }, []);
  const datas = [
    {
      name: "Government",
      value: 0,
      fill: "#0077B6",
    },
    {
      name: "Private",
      value: 0,
      fill: "#00B4D8",
    },
    {
      name: "Other sectors",
      value: 0,
      fill: "#90E0EF",
    },
  ];
  const filteredData = datas?.map((data) => {
    const stat = categorziedData?.find((item) => item?._id == data?.name);
    return {
      name: data?.name,
      value: stat?.count ? stat?.count : 0,
      fill: data?.fill,
    };
  });

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
        <h2>Clients Statistics</h2>
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
              data={filteredData}
              innerRadius={65}
              outerRadius={105}
              fill="#82ca9d"
              labelLine={false}
              stroke={0.1}
              label={renderCustomizedLabel}
            >
              {filteredData?.map((entry, index) => (
                <Cell
                  onClick={() => console.log(entry)}
                  key={`cell-${index}`}
                  fill={entry?.fill}
                />
              ))}
              <Label
                content={
                  <CustomLabel labelText="Total Client" value={totalClient} />
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
