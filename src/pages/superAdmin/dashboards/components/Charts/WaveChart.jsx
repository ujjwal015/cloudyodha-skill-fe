import React, { useEffect, useRef, useState } from "react";
import CategoryWise from "../../../../../components/common/CategoryWise";
import { useDispatch } from "react-redux";
import { getCurveDataApi } from "../../../../../api/superAdminApi/dashboard";
import { dashboardConstants } from "../../../../../config/constants/projectConstant";
import { useInView } from "react-intersection-observer";

const CurveChart = ({
  title = "",
  clientId = "",
  dashboardType = "",
  componentSpecificData = {},
  componentList,
  selectOptions=[]
}) => {
  const [componentSpecificUrl, setComponentSpecificUrl] = useState("");
  const [curveData, setCurveData] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [curveOneData, setCurveOneData] = useState([]);
  const [curveTwoData, setCurveTwoData] = useState([]);
  const [totalCountOne,setTotalCountOne]=useState(0);
  const [totalCountTwo,setTotalCountTwo]=useState(0);
  const [labelList, setLabelList] = useState([]);
  const [currentDateSelected,setCurrentDateSelected]=useState("weekly");
  const { ref, inView } = useInView({ threshold: 0.5 }); 
  const prevTextRef = useRef(clientId)


  
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }
  useEffect(() => {
    if (curveData && Object.keys(curveData)?.length > 0) {
      if((title+" ", dashboardType) === dashboardConstants?.ActivityQA){
        setLabelList(Object.keys(curveData).filter((item)=>isObject(curveData[item])));
        const curveDataOne = [];
        const curveDataTwo = [];
  
        for (let items of Object.values(curveData)) {
          if (isObject(items)) {
            curveDataOne?.push(items?.totalClient);
            curveDataTwo?.push(items?.totalJobRole);
          }
        }
        const label = [];
        setCurveOneData(curveDataOne);
        setCurveTwoData(curveDataTwo);
        setTotalCountTwo(curveData?.totalJobRole)
        setTotalCountOne(curveData?.totalClient) 
      }
      else if(`${title} ${dashboardType}`=== dashboardConstants?.DailyWorkProgressCD){
        const label=[]
        const curveOne=[];
        const curveTwo=[];
        let curveOneSum=0;
        let curveTwoSum=0;
        for(let item of (curveData?.weeklyData || curveData?.monthlyData)){
          label.push(item?.day || item?.month);
          curveOne.push(item?.totalBluePrint)
          curveTwo.push(item?.totalQuestionBank)   
          curveOneSum= curveOneSum + (item?.totalBluePrint)  
          curveTwoSum= curveOneSum + (item?.totalQuestionBank)  
        }
        setLabelList(label)
        setCurveOneData(curveOne);
        setCurveTwoData(curveTwo);
        setTotalCountTwo(curveTwoSum)
        setTotalCountOne(curveOneSum) 
      }
      else if(`${title} ${dashboardType}`=== dashboardConstants?.AssessmentAnalyticsOD){
        const label=[]
        const curveOne=[];
        const curveTwo=[];
        let curveOneSum=0;
        let curveTwoSum=0;
        for(let item of (curveData?.response)){
          label.push(Object.keys(item)?.[0]);
          curveOne.push(typeof(item)==="object" && Object.values(item)?.[0]?.online)
          curveTwo.push(typeof(item)==="object" && Object.values(item)?.[0]?.offline)   
          curveOneSum= curveOneSum + (typeof(item)==="object" && Object.values(item)?.[0]?.online)  
          curveTwoSum= curveTwoSum + (typeof(item)==="object" && Object.values(item)?.[0]?.offline)  
        }
        setLabelList(label)
        setCurveOneData(curveOne);
        setCurveTwoData(curveTwo);
        setTotalCountTwo(curveTwoSum)
        setTotalCountOne(curveOneSum) 
      }
      else if(`${title} ${dashboardType}`=== dashboardConstants?.ActivityQA){
        const label=[]
        const curveOne=[];
        const curveTwo=[];
        let curveOneSum=0;
        let curveTwoSum=0;
        for(let item of (curveData?.monthlyCounts || curveData?.weeklyCounts)){
          label.push(item?.month || item?.day);
          curveOne.push(item?.Assessors);
          curveTwo.push(item?.qualityAssurance);
          curveOneSum= curveOneSum + Number(item?.Assessors)  
          curveTwoSum= curveOneSum + Number(item?.qualityAssurance)  
        }
        setLabelList(label)
        setCurveOneData(curveOne);
        setCurveTwoData(curveTwo);
        setTotalCountTwo(curveTwoSum)
        setTotalCountOne(curveOneSum) 

      }
      else if(`${title} ${dashboardType}`=== dashboardConstants?.AssessmentAnalysisHR){
        const label=[]
        const curveOne=[];
        const curveTwo=[];
        let curveOneSum=0;
        let curveTwoSum=0;
        for(let item of (curveData?.response)){
          label.push(Object.keys(item)?.[0]);
          curveOne.push(typeof(item)==="object" && Object.values(item)?.[0]?.online)
          curveTwo.push(typeof(item)==="object" && Object.values(item)?.[0]?.offline)   
          curveOneSum= curveOneSum + (typeof(item)==="object" && Object.values(item)?.[0]?.online)  
          curveTwoSum= curveOneSum + (typeof(item)==="object" && Object.values(item)?.[0]?.offline)  
        }
        setLabelList(label)
        setCurveOneData(curveOne);
        setCurveTwoData(curveTwo);
        setTotalCountTwo(curveTwoSum)
        setTotalCountOne(curveOneSum) 
      }
      else if(`${title} ${dashboardType}`=== dashboardConstants?.ResultAnalysisMIS){
        const label=[]
        const curveOne=[];
        const curveTwo=[];
        let curveOneSum=0;
        let curveTwoSum=0;

        for(let item of (curveData?.weeklyCount ||curveData?.monthlyCount)){
          label.push(item?.day || item?.month);
          curveOne.push(Number(item?.onlineResultCount));
          curveTwo.push(Number(item?.offlineResultCount));
          curveOneSum=curveOneSum+ Number(item?.onlineResultCount);
          curveTwoSum=curveTwoSum+ Number(item?.offlineResultCount);
        }

        setLabelList(label)
        setCurveOneData(curveOne);
        setCurveTwoData(curveTwo);
        setTotalCountTwo(curveTwoSum)
        setTotalCountOne(curveOneSum) 

      }
    }
    else if((title+" ", dashboardType) !== dashboardConstants?.ActivityQA){
      setLabelList(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"])
      setCurveOneData([0,23,45,12,34,50,34,2,44,21,23,0]);
      setCurveTwoData([0,55,45,43,24,11,32,12,9,23,11,0]);
      setTotalCountTwo(2311)
      setTotalCountOne(2342) 

    }
  }, [curveData]);

  const updateData = (data) => {
    setCurveData(data);
  };

  const getCurveData = (url) => {
    if(currentDateSelected){
      setLoading(true)
      dispatch(getCurveDataApi(url, setLoading, clientId, updateData,currentDateSelected,title,dashboardType));
    }
  };


  useEffect(()=>{
    if(currentDateSelected && componentSpecificUrl && inView ){
      setLoading(true)
      dispatch(getCurveDataApi(componentSpecificUrl, setLoading, clientId, updateData,currentDateSelected,title,dashboardType));
    }
  },[currentDateSelected])

  

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
      getCurveData(componentSpecificUrl);
    }
    else if(componentSpecificUrl && inView && (clientId === "" && !Object.keys(curveData)?.length>0)){
      getCurveData(componentSpecificUrl);
    }
  }, [componentSpecificUrl, inView, clientId]);

  const data = {
    labels: labelList,
    datasets: [
      {
        label: componentSpecificData?.datasets[0]?.label,
        data: curveOneData,
        totalCount:totalCountOne,
        fill: componentSpecificData?.datasets[0]?.fill,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height
          );
          gradient.addColorStop(
            0,
            componentSpecificData?.datasets[0]?.backgroundColor?.color1
          );
          gradient.addColorStop(
            1,
            componentSpecificData?.datasets[0]?.backgroundColor?.color2
          );
          return gradient;
        },
        icon: componentSpecificData?.datasets[0]?.icon,
        borderColor: componentSpecificData?.datasets[0]?.borderColor,
        borderWidth: componentSpecificData?.datasets[0]?.borderWidth,
        tension: componentSpecificData?.datasets[0]?.tension,
      },
      {
        label: componentSpecificData?.datasets[1]?.label,
        data: curveTwoData,
        totalCount:totalCountTwo,
        fill: componentSpecificData?.datasets[1]?.fill,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height
          );
          gradient.addColorStop(
            0,
            componentSpecificData?.datasets[1]?.backgroundColor?.color1
          );
          gradient.addColorStop(
            1,
            componentSpecificData?.datasets[1]?.backgroundColor?.color2
          );
          return gradient;
        },
        icon: componentSpecificData?.datasets[1]?.icon,
        borderColor: componentSpecificData?.datasets[1]?.borderColor,
        borderWidth: componentSpecificData?.datasets[1]?.borderWidth,
        tension: componentSpecificData?.datasets[1]?.tension,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        grid: {
          color: "rgba(214, 214, 223, 0.5)",
          offset: false,
          borderDash: [3, 3],
          drawTicks: false,
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

  const handleClick=(e)=>{
    setCurrentDateSelected(e.target.value)
  }

  const catergoryWiseData = {
    categoryName: <span>{title}</span>,
    data,
    options,
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },
    currentOption:currentDateSelected,
    dropDownOptions:selectOptions,
    onClick:handleClick,
    isSelectFieldRequired:true,
    loading:loading,
    ref:ref

  };
  return <CategoryWise catergoryWiseData={catergoryWiseData} />;
};

export default CurveChart;
