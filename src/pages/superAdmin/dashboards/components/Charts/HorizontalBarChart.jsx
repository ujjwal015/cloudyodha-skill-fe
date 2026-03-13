import React, { useEffect, useRef, useState } from "react";
import HorizontalBarChart from "../../../../../components/common/HorizontalBarChart";
import { useDispatch } from "react-redux";
import { getHorizontalBarDataApi } from "../../../../../api/superAdminApi/dashboard";
import { dashboardConstants } from "../../../../../config/constants/projectConstant";
import { generateRandomColors } from "../../../../../utils/projectHelper";
import { useInView } from "react-intersection-observer";

const HorizontalChart = ({
  clientId = "",
  dashboardType = "",
  title = "",
  componentSpecificData = {},
  componentList,
}) => {
  const [value, setValue] = useState("weekly");
  const [componentSpecificUrl, setComponentSpecificUrl] = useState("");
  const [horizontalBarChartData, setHorizontalBarChartData] = useState([]);
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [totalCountWeekly, setTotalCountWeekly] = useState(0);
  const [totalCountMontly, setTotalCountMonthly] = useState(0);
  const [labellist, setLabelList] = useState([]);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const prevTextRef = useRef(clientId)



  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const dropDownOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

const options = {
    indexAxis: "y",
    responsive: true,
    scales: {
      y: {
        grid: {
          color: "rgba(214, 214, 223, 0.5)", // for the grid lines
          drawTicks: false, // true is default
        },

        beginAtZero: true,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

const data = {
    labels:
      `${title} ${dashboardType}` === dashboardConstants?.LeadByCategoryBD
        ? ["Training Partner", "Business"]
        : labellist,
    datasets: [
      {
        data:
          `${title} ${dashboardType}` === dashboardConstants?.LeadByCategoryBD
            ? [150, 75]
            : value === "weekly"
            ? weeklyData
            : monthlyData,
        backgroundColor: generateRandomColors(
          weeklyData?.length || monthlyData?.length
        ), //componentSpecificData?.backgroundColor,
        barThickness: componentSpecificData?.barThickness,
        borderWidth: componentSpecificData?.borderWidth,
        borderRadius: componentSpecificData?.borderRadius,
        barPercentage: componentSpecificData?.barPercentage,
      },
    ],
  };

  const horizonBarChartData = {
    horizonBarChartName: <span>{title}</span>,
    data,
    options,
    currentValue: value,
    onChange: handleChange,
    dropDownOptions: dropDownOptions,
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },
    total:
      `${title} ${dashboardType}` === dashboardConstants?.LeadByCategoryBD
        ? "490"
        : value === "weekly"
        ? totalCountWeekly
        : totalCountMontly,
    reference: ref,
    loading:loading,
    // percentage: "+32.40%",
  };

  useEffect(() => {
    if (horizontalBarChartData?.length > 0) {
      if (
        title + " " + dashboardType ===
        dashboardConstants?.SchemeAnalysisOD
      ) {
        const monthlyData = [];
        const weeklyData = [];
        let totalCountWeekly = 0;
        let totalCountMontly = 0;
        const label = [];
        for (let item of horizontalBarChartData) {
          monthlyData.push(item?.BatchCountMonthly);
          weeklyData.push(item?.BatchCountWeekly);
          totalCountWeekly = totalCountWeekly + item?.BatchCountWeekly;
          totalCountMontly = totalCountMontly + item?.BatchCountMonthly;
          label.push(item?.schemeName);
        }
        if (monthlyData?.length > 0) {
          setMonthlyData(monthlyData);
        }
        if (weeklyData?.length > 0) {
          setWeeklyData(weeklyData);
        }
        if (totalCountWeekly) {
          setTotalCountWeekly(totalCountWeekly);
        }
        if (totalCountMontly) {
          setTotalCountMonthly(totalCountMontly);
        }
        if (label?.length > 0) {
          setLabelList(label);
        }
      } else if (
        title + " " + dashboardType ===
        dashboardConstants?.SchemeAnalysisMIS
      ) {
        const monthlyData = [];
        const weeklyData = [];
        let totalCountWeekly = 0;
        let totalCountMontly = 0;
        const label = [];
        for (let item of horizontalBarChartData) {
          monthlyData.push(Number(item?.BatchCountMonthly));
          weeklyData.push(Number(item?.BatchCountWeekly));
          totalCountWeekly = totalCountWeekly + Number(item?.BatchCountWeekly);
          totalCountMontly = totalCountMontly + Number(item?.BatchCountMonthly);
          label.push(item?.schemeName);
        }
        if (monthlyData?.length > 0) {
          setMonthlyData(monthlyData);
        }
        setWeeklyData(weeklyData);
        setTotalCountWeekly(totalCountWeekly);
        setTotalCountMonthly(totalCountMontly);
        if (label?.length > 0) {
          setLabelList(label);
        }
      }
    } else if (
      title + " " + dashboardType ===
      dashboardConstants?.BatchResultStatusMIS
    ) {
      setMonthlyData([90, 32, 55, 75, 21, 12]);
      setWeeklyData([40, 60, 10, 45, 34, 90]);
      setTotalCountWeekly([160]);
      setTotalCountMonthly([400]);
      setLabelList([
        "Result by Assessor",
        "Result acepted by AA",
        "Send back to assessor",
        "Send to SSC",
        "Sent back by SSC",
        "SSC Approved",
      ]);
    }
  }, [dashboardType, horizontalBarChartData, title]);

  const updateStateHandler = (data) => {
    setHorizontalBarChartData(data);
  };

  const getHorizontalBarData = (url) => {
    setLoading(true);
    dispatch(
      getHorizontalBarDataApi(url, clientId, setLoading, updateStateHandler)
    );
  };

  useEffect(() => {
    if (componentList?.length > 0) {
      const element = componentList?.find((item) => {
        return (
          `${item?.componentId?.component_name} ${item?.componentId?.component_category}` ===
          `${title} ${dashboardType}`
        );
      });

      if (element) {
        setComponentSpecificUrl(element?.componentId?.endpoint);
      }
    }
  }, [componentList]);


  useEffect(() => {
    if (componentSpecificUrl && inView && (clientId !== prevTextRef.current)) {
      prevTextRef.current = clientId;
      getHorizontalBarData(componentSpecificUrl);
    }
    else if(componentSpecificUrl && inView && (clientId === "" && !horizontalBarChartData?.length>0)){
      getHorizontalBarData(componentSpecificUrl);
    }
  }, [componentSpecificUrl, inView, clientId]);


  // useEffect(() => {
  //   if (componentSpecificUrl && inView) {
  //     setLoading(true);
  //     dispatch(
  //       getHorizontalBarDataApi(
  //         componentSpecificUrl,
  //         clientId,
  //         setLoading,
  //         updateStateHandler
  //       )
  //     );
  //   }
  // }, [clientId]);

  return <HorizontalBarChart horizonBarChartData={horizonBarChartData} />;
};

export default HorizontalChart;
