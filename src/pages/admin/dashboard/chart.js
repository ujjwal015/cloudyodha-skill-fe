import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, ResponsiveContainer, Bar } from "recharts";
import { ActionComp } from ".";
import { getClientSummaryApi } from "../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../redux/slicers/admin/dashboardSlice";
import { SyncLoader } from "react-spinners";

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

const Chart = () => {
  const dispatch = useDispatch();
  const { clientSummaryList = [] } = useSelector(dashboardSelector);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // refresh component
  const handleRefresh = () => {
    setLoading(true);
    dispatch(getClientSummaryApi(setLoading));
    setOpen(false);
  };

  const handleRemove = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getClientSummaryApi(setLoading));
  }, []);

  const data = clientSummaryList.map((item) => ({
    ...item,
    name: item?.name?.slice(0, 3).toUpperCase(),
  }));

  return (
    <div className="list-card earning-statistics">
      <div className="card-title">
        <h2>Client Summary</h2>
        <div className="select-and-more-wrapper">
          <ActionComp open={open} setOpen={setOpen} handleRefresh={handleRefresh} handleRemove={handleRemove} />
        </div>
      </div>
      {loading ? (
        <div className="loading-wrapper">
          <SyncLoader color="#2ea8db" />
        </div>
      ) : (
        <div className="card-lists">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} style={{ margin: "0 -20px" }}>
              <CartesianGrid stroke="#EDEDED" strokeDasharray="3 3" vertical={false} /> {/* Set strokeDasharray */}
              <XAxis
                dataKey="name"
                style={{ fontFamily: "Poppins" }}
                stroke="#5B5B98"
                axisLine={false}
                tickLine={false}
                height={45}
                dy={15}
                fontSize={12}
                minTickGap={-100}
              />
              <YAxis
                style={{ fontFamily: "Poppins" }}
                stroke="#5B5B98"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="value" fill="#2DB6F5" radius={5} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Chart;
