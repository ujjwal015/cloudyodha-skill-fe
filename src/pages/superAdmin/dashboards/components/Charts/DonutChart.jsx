import React, { useEffect, useRef, useState } from "react";
import TimeSpentPieChart from "../../../../../components/common/TimeSpentPieChart/index";
import { getDonutDataAPI } from "../../../../../api/superAdminApi/dashboard";
import { useDispatch } from "react-redux";
import { dashboardConstants } from "../../../../../config/constants/projectConstant";
import { useNavigate } from "react-router-dom";
import { ASSESSOR_ATTENDANCE_LIST } from "../../../../../config/constants/routePathConstants/superAdmin";
import { useInView } from "react-intersection-observer";

const DonutChart = ({
  title = "",
  clientId = "",
  dashboardType = "",
  componentSpecificData = {},
  componentList,
}) => {
  const [currentValue, setCurrentValue] = useState("weekly");
  const [componentSpecificUrl, setComponentSpecificUrl] = useState("");
  const [componentData, setComponentData] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const navigate=useNavigate();
  const { ref, inView } = useInView({ threshold: 0.5 }); 
    const prevTextRef = useRef(clientId)
  

  const handleChange = (event) => {
    setCurrentValue(event.target.value);
  };

  useEffect(() => {
    if (Object.keys(componentData)?.length > 0) {
      if (
        title + " " + dashboardType ===
        dashboardConstants?.EmploymentTypeHR
      ) {
        let total = 0;
        const data = [];
        const label = [];

        for (let item of Object.keys(componentData)) {
          if (item === "totalAssessorCounts") {
            total = total + componentData[item];
          } else {
            data.push(componentData[item]);
            label.push(item);
          }
        }
        setDataList(data);
        setLabelList(label);
        setTotalCount(total);
      }
    }
    else {
      setDataList([6, 1]);
      setLabelList(["Online Time", "Idle Time"]);
      setTotalCount(7);
    }
  }, [componentData]);

  const updateData = (data) => {
    setComponentData(data);
  };

  const getDonutData = (url) => {
    setLoading(true);
    dispatch(getDonutDataAPI(url, setLoading, clientId, updateData));
  };

  // useEffect(()=>{
  //   if(componentSpecificUrl && inView){
  //   setComponentData({})
  //     setLoading(true)
  //   dispatch(getDonutDataAPI(componentSpecificUrl,setLoading,clientId, updateData));
  //   }
  // },[clientId]);

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
      getDonutData(componentSpecificUrl);
    }
    else if(componentSpecificUrl && inView && (clientId === "" && !(Object.keys(componentData)?.length>0))){
      getDonutData(componentSpecificUrl);
    }
  }, [componentSpecificUrl, inView, clientId]);


  const data = {
    labels: labelList,
    datasets: [
      {
        label: labelList, //componentSpecificData?.title,
        data: dataList,
        backgroundColor: componentSpecificData?.backgroundColor,
        borderRadius: componentSpecificData?.borderRadius || 20,
        cutout: componentSpecificData?.cutout,
        spacing: componentSpecificData?.spacing,
        rotation: 90,
        borderWidth: componentSpecificData?.borderWidth || 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    width: componentSpecificData?.width || 100,
    height: componentSpecificData?.height || 100,
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
        display: false,
      },
    },
  };

  const dropOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const viewAttendanceData={
    viewAttendanceRequired:false,
    handleViewAttendance:()=>{
      navigate(ASSESSOR_ATTENDANCE_LIST);
    }
  }

  const timeSpentChartData = {
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },
    title: <span>{componentSpecificData?.title}</span>,
    value: currentValue,
    dropDownOptions: dropOptions,
    handleChange: handleChange,
    loading:loading,
    data: data,
    options: options,
    hour: "",
    mins: "",
    viewAttendanceRequired: componentSpecificData?.viewAttendanceRequired,
    selectInputRequired: componentSpecificData?.selectInputRequired,
    viewAttendanceData,
    totalCount: totalCount,
    centerCircleTitle: componentSpecificData?.centerCircleTitle,
    ref:ref
  };
  return <TimeSpentPieChart charts={timeSpentChartData} />;
};

export default DonutChart;
