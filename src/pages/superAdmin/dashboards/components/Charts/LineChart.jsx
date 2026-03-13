import React, { useEffect, useRef, useState } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./style.css";
import {
  getDonutDataDetailsApi,
  getLineCurveDataApi,
} from "../../../../../api/superAdminApi/dashboard";
import { useDispatch } from "react-redux";
import { useInView } from "react-intersection-observer";
import RingLoaderCompoenent from "../../../../../components/common/RingLoader";
import LineChartSkeleton from "./skeleton/LineChartSkeleton";

function LineCurveChart({
  title,
  clientId,
  dashboardType,
  componentSpecificData,
  componentList,
}) {
  const [componentSpecificUrl, setComponentSpecificUrl] = useState("");
  const [lineCurveData, setLineCurveData] = useState({});
  const [filter, setFilter] = useState("weekly");
  const [monthlyData, setMonthlyData] = useState([]);

  const [monthlyUpdatedData, setMonthlyUpdatedData] = useState([
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ]);

  const [weeklyUpdatedData, setWeeklyUpdatedData] = useState([
    1, 1, 1, 1, 1, 1, 1,
  ]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { ref, inView } = useInView({ threshold: 0.5 });
  const prevTextRef = useRef(clientId)


  const updateDonutData = (data) => {
    setLineCurveData(data);
  };

  useEffect(() => {
    if (Object.keys(lineCurveData)?.length > 0) {
      setMonthlyData(lineCurveData?.monthlyCounts);
      setWeeklyData(lineCurveData?.weeklyCounts);
    }
  }, [lineCurveData]);

  const convertMonthlyData = (data = []) => {
    const result = {
      January: { Government: 0, Private: 0, Others: 0 },
      February: { Government: 0, Private: 0, Others: 0 },
      March: { Government: 0, Private: 0, Others: 0 },
      April: { Government: 0, Private: 0, Others: 0 },
      May: { Government: 0, Private: 0, Others: 0 },
      June: { Government: 0, Private: 0, Others: 0 },
      July: { Government: 0, Private: 0, Others: 0 },
      August: { Government: 0, Private: 0, Others: 0 },
      September: { Government: 0, Private: 0, Others: 0 },
      October: { Government: 0, Private: 0, Others: 0 },
      November: { Government: 0, Private: 0, Others: 0 },
      December: { Government: 0, Private: 0, Others: 0 },
    };

    if (data?.length > 0) {
      data.forEach((item) => {
        const { organisationType, months } = item;
        months.forEach((monthData) => {
          if (monthData && organisationType) {
            result[monthData?.name][organisationType] += monthData?.count;
          }
        });
      });
      return Object.entries(result)?.map(([month, counts]) => ({
        month: month,
        ...counts,
      }));
    }
  };

  const convertWeeklyData = (data = []) => {
    const result = {
      Monday: { Government: 0, Private: 0, Others: 0 },
      Tuesday: { Government: 0, Private: 0, Others: 0 },
      Wednesday: { Government: 0, Private: 0, Others: 0 },
      Thursday: { Government: 0, Private: 0, Others: 0 },
      Friday: { Government: 0, Private: 0, Others: 0 },
      Saturday: { Government: 0, Private: 0, Others: 0 },
      Sunday: { Government: 0, Private: 0, Others: 0 },
    };

    if (data?.length > 0) {
      data.forEach((item) => {
        const { organisationType, days } = item;
        days.forEach((day) => {
          if (day && organisationType) {
            result[day?.name][organisationType] += day?.count;
          }
        });
      });
      return Object.entries(result)?.map(([month, counts]) => ({
        day: month,
        ...counts,
      }));
    }
  };

  useEffect(() => {
    if (monthlyData?.length > 0) {
      const data = convertMonthlyData(monthlyData || []);
      if (data?.length > 0) {
        setMonthlyUpdatedData(data);
      }
    }
  }, [monthlyData]);

  useEffect(() => {
    if (weeklyData?.length > 0) {
      const data1 = convertWeeklyData(weeklyData || []);
      if (data1?.length > 0) {
        setWeeklyUpdatedData(data1);
      }
    }
  }, [weeklyData]);

  const getLineCurveDetails = (url) => {
    setLoading(true);
    dispatch(getLineCurveDataApi(url, clientId, setLoading, updateDonutData));
  };

  useEffect(() => {
    if (componentList?.length > 0) {
      const element = componentList?.find(
        (item) =>
          `${item?.componentId?.component_name} ${item?.componentId?.component_category}` ===
          `${title} ${dashboardType}`
      );
      if (element) {
        setComponentSpecificUrl(element?.componentId?.endpoint);
      }
    }
  }, [componentList]);

  useEffect(() => {
    if (componentSpecificUrl && inView && (clientId !== prevTextRef.current)) {
      prevTextRef.current = clientId;
      getLineCurveDetails(componentSpecificUrl);

    }
    else if(componentSpecificUrl && inView && (clientId === "" && !Object.keys(lineCurveData)?.length>0)){
      getLineCurveDetails(componentSpecificUrl);

    }
  }, [componentSpecificUrl, inView, clientId]);


 
  return (
    <div ref={ref}>
      {loading ? (
        // <RingLoaderCompoenent />
        <LineChartSkeleton/>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Clients Overview</h2>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="legend">
                <div className="legend-item">
                  <div
                    className="legend-dot"
                    style={{ backgroundColor: "rgb(16, 185, 129)" }}
                  />
                  <span className="legend-label">Government</span>
                </div>
                <div className="legend-item">
                  <div
                    className="legend-dot"
                    style={{ backgroundColor: "rgb(59, 130, 246)" }}
                  />
                  <span className="legend-label">Private</span>
                </div>
                <div className="legend-item">
                  <div
                    className="legend-dot"
                    style={{ backgroundColor: "rgb(244, 63, 94)" }}
                  />
                  <span className="legend-label">Others</span>
                </div>
              </div>
              <div className="select-container">
                <select
                  className="select-trigger"
                  defaultValue={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="90%">
                <LineChart
                  data={
                    filter === "weekly" ? weeklyUpdatedData : monthlyUpdatedData
                  }
                  //   margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey={filter === "weekly" ? "day" : "month"}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    tick={{ fill: "#888", fontSize: 10 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    dx={-20}
                    tick={{ fill: "#888", fontSize: 10 }}
                  />
                  <Tooltip />
                  <Line
                    type="linear"
                    dataKey="Government"
                    stroke="rgb(16, 185, 129)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="linear"
                    dataKey="Private"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="linear"
                    dataKey="Others"
                    stroke="rgb(244, 63, 94)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LineCurveChart;
