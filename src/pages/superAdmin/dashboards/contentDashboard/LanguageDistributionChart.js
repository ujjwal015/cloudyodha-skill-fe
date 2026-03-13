import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import moment from "moment";
import MultipleSelect from "../../../../components/common/MultiSelect";
import { useDispatch, useSelector } from "react-redux";
import { getLanguageDistributionData_CD } from "../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";

const LanguageDistributionChart = ({ assignedClientList = [], globalSelectedIds = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const { languageAnalyticsContentDashboard = {} } = useSelector(dashboardSelector);
  const [label, setLabel] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [percentageList, setPercentageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getLanguageDistributionData = (id) => {
    dispatch(getLanguageDistributionData_CD(setLoading, id));
  };

  useEffect(() => {
    if (selectedIds.length > 0) {
      getLanguageDistributionData(selectedIds.join(","));
    } else {
      getLanguageDistributionData("");
    }
  }, [selectedIds]);

  useEffect(() => {
    setSelectedIds(globalSelectedIds);
  }, [globalSelectedIds]);

  useEffect(() => {
    if (languageAnalyticsContentDashboard) {
      setTotalCount(languageAnalyticsContentDashboard.totalCount);
      if (
        Array.isArray(languageAnalyticsContentDashboard.languages) &&
        languageAnalyticsContentDashboard.languages.length > 0
      ) {
        const langugaeGroup = [];
        const valuelist = [];
        const percentagelist = [];
        for (let item of languageAnalyticsContentDashboard.languages) {
          if (item.language !== "") {
            langugaeGroup.push(item.language);
            valuelist.push(item.count);
            percentagelist.push(`${item.percentage}`);
          }
        }
        langugaeGroup.length > 0 && setLabel(langugaeGroup);
        percentagelist.length > 0 && setPercentageList(percentagelist);
      }
    }
  }, [languageAnalyticsContentDashboard]);

  const data = {
    labels: label,
    datasets: [
      {
        data: percentageList,
        backgroundColor: [
          "#B19DFF",
          "#72AEFF",
          "rgba(133, 77, 14, 1)",
          "#F87171",
          "#3AC5DE",
          "#46C7A8",
          "#D946EF",
          "#46C7A8",
          "#68C17A",
          "#0EA5E9",
          "#99B65F",
          "#D1A656",
          "#10B981",
          "#FF9661",
          "#A3E635",
          "#FF8A7E",
          "#737373",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      tooltip: {
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 10,
        },
      },
      legend: {
        display: true,
        position: "right",
        labels: {
          font: {
            size: 12,
            weight: "500",
          },
          color: "#637381",
          boxWidth: 15,
          boxHeight: 15,
          borderRadius: 4,
          padding: 12,
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    radius: "100%",
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value[value.length - 1] === "all") {
      if (selectedIds.length === assignedClientList.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(assignedClientList.map((item) => item.id));
      }
      return;
    }
    setSelectedIds(value.map((item) => item.id));
  };

  return (
    <div className="languageDistrubution-overview_PieChart">
      <div className="chart-card-header">
        <div>
          <h1 style={{ fontSize: "normal", fontWeight: "bold" }}>{" Language Distribution"}</h1>
          <h1 style={{ fontSize: "large", fontWeight: "bold" }}>{totalCount}</h1>
        </div>
        <div>
          <MultipleSelect
            setSelectedIds={setSelectedIds}
            selectedIds={selectedIds}
            options={assignedClientList}
            handleChange={handleChange}
            label="client"
          />
        </div>
      </div>
      <div>
        <Pie data={data} options={options} height={180} />
      </div>
    </div>
  );
};

export default LanguageDistributionChart;
