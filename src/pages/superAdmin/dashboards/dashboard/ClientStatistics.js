import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Sector, Tooltip, Cell } from "recharts";
import { ActionComp, DropDown } from ".";
import { getActiveClientStatisticsApi } from "../../../../api/superAdminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/superAdmin/dashboardSlice";

const ClientStatistics = () => {
  const dispatch = useDispatch();
  const { activeClientStatistics = {} } = useSelector(dashboardSelector);

  const [dropDown, setDropDown] = useState({ open: false, text: "year" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [key, setKey] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isHovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRemove = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    const type = "year";
    setDropDown({ open: false, text: "year" });
    dispatch(getActiveClientStatisticsApi(setLoading, type, setKey));
    setOpen(false);
  };

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
    setHovered(true);
  };
  const onPieLeave = () => setHovered(false);

  const type = dropDown.text;

  useEffect(() => {
    dispatch(getActiveClientStatisticsApi(setLoading, type, setKey));
  }, [dropDown.text]);

  const data =
    activeClientStatistics &&
    activeClientStatistics?.data?.map((item, i) => ({
      ...item,
      name: item?.name,
      value: typeof item?.per == "number"?item?.per:Number(item?.per),
    }));
  const activeClientStatisticsLength = Array.isArray(activeClientStatistics)
    ? activeClientStatistics.length
    : Object.values(activeClientStatistics)?.length;
  return (
    <div className="list-card client-statistics">
      <div className="card-title">
        <h2>Client Statistics</h2>
        <div className="select-and-more-wrapper">
          <DropDown dropDown={dropDown} setDropDown={setDropDown} />
          <ActionComp
            open={open}
            setOpen={setOpen}
            handleRefresh={handleRefresh}
            handleRemove={handleRemove}
          />
        </div>
      </div>
      <div className="card-lists">
        {activeClientStatisticsLength > 0 ? (
          <PieChart width={200} height={200}>
            <Pie
              key={key}
              activeIndex={isHovered ? activeIndex : null}
              activeShape={renderActiveShape}
              dataKey="value"
              data={data}
              cx={100}
              cy={100}
              innerRadius={51}
              outerRadius={80}
              fill="#82ca9d"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              stroke={0.1}
            >
              {data?.map((entry, index) => (
                <Cell
                  onClick={() => console.log(entry)}
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        ) : (
          <div className="no-client-statistics">No Users</div>
        )}
        <div className="card-total">
          <p>
            <span>
              {activeClientStatisticsLength > 0
                ? activeClientStatistics?.total
                : "0"}
            </span>{" "}
            Total Users
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientStatistics;

const COLORS = ["#00B2FF", "#0953A9", "#8A3CAC1A"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="donut-tooltip">
        <h4>{payload && payload[0]?.name}</h4>
        <p>{`${payload && payload[0]?.value}%`}</p>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props) => {
  const { cx, cy, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={40}
        outerRadius={90}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={10}
      />
    </g>
  );
};
