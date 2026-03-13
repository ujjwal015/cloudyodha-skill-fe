import React, { useEffect, useRef, useState } from "react";
import DoughNut from "../../../../../components/common/Doughnut/index";
import { Chart, registerables } from "chart.js";
import { useDispatch } from "react-redux";
import { getDonutDataDetailsApi } from "../../../../../api/superAdminApi/dashboard";
import { dashboardConstants } from "../../../../../config/constants/projectConstant";
import { useInView } from "react-intersection-observer";

Chart.register(...registerables);

const DonutChartWithDescription = ({clientId="",dashboardType="",title="",componentSpecificData={},componentList=[]}) => {
  const [optionSelectedValue, setOptionSelectedValue] = useState("weekly");
  const [loading,setLoading]=useState(true);
  const [componentSpecificUrl,setComponentSpecificUrl]=useState("")
  const [donutData,setDonutData]=useState({});
  const [totalCount,setTotalCount]=useState(0);
  const [dropdownselect,setDropdownselect]=useState("weekly")
  const [labellist,setLabellist]=useState([]);
  const [donutdatalist,setDonutdatalist]=useState([])
  const dispatch=useDispatch()
  const { ref, inView } = useInView({ threshold: 0.5 }); 
  const prevTextRef = useRef(clientId)





  useEffect(()=>{
    if(Object.keys(donutData)?.length>0){
      if(`${title} ${dashboardType}`=== dashboardConstants?.ApplicantAnalysisMIS){
        const label=[];
        const value=[];
        let total=0
        for(let item of Object.keys(donutData)){
          if(item==="totalCandidates"){
            total=total + donutData[item]
          }
          else{
            label.push(item);
            value.push(donutData[item]);
          }
        }
        setLabellist(label);
        setDonutdatalist(value);
        setTotalCount(total);
      }
      else if(`${title} ${dashboardType}`=== dashboardConstants?.QuestionAnalyticsCD){
        const label=[];
        const value=[];
        let total=0
        for(let item in donutData?.questionCount){
            label.push(item);
            value.push(donutData?.questionCount[item]);
            total=total+ donutData?.questionCount[item];
        }
        setLabellist(label);
        setDonutdatalist(value);
        setTotalCount(total);
      }
    }
  },[donutData])


  const updateDonutData=(data)=>{
    setDonutData(data)
  }

  const getDonutDataDetails=(url)=>{
    setLoading(true)
    dispatch(getDonutDataDetailsApi(url,setLoading,clientId,optionSelectedValue,updateDonutData))
  }

  useEffect(()=>{
    if(optionSelectedValue && componentSpecificUrl && inView){
      setLoading(true)
    dispatch(getDonutDataDetailsApi(componentSpecificUrl,setLoading,clientId,optionSelectedValue,updateDonutData))
    }
  },[optionSelectedValue])

  // useEffect(()=>{
  //   if(componentSpecificUrl && inView){
  //     setLoading(true)
  //   dispatch(getDonutDataDetailsApi(componentSpecificUrl,setLoading,clientId,optionSelectedValue,updateDonutData))
  //   }
  // },[clientId])

  useEffect(()=>{
    if(componentList?.length>0){
      const element = componentList?.find(
        (item) =>
          `${item?.componentId?.component_name} ${item?.componentId?.component_category}` ===
          `${title} ${dashboardType}`,
      );
      if (element) {
        setComponentSpecificUrl(element?.componentId?.endpoint);
      }
    }
  },[componentList])

  useEffect(() => {
    if (componentSpecificUrl && inView && (clientId !== prevTextRef.current)) {
      prevTextRef.current = clientId;
      getDonutDataDetails(componentSpecificUrl);
    }
    else if(componentSpecificUrl && inView && (clientId === "" && !Object.keys(donutData)?.length>0)){
      getDonutDataDetails(componentSpecificUrl);
    }
  }, [componentSpecificUrl, inView, clientId]);


  const data = {
    labels:labellist, // componentSpecificData?.labels,
    datasets: [
      {
        label: ":",
        data:(`${title} ${dashboardType}`=== dashboardConstants?.LeadAnalyticsBD) ? [550,44,103,113] : donutdatalist,
        backgroundColor:componentSpecificData?.backgroundColor,
        borderRadius: componentSpecificData?.borderRadius,
        cutout: componentSpecificData?.cutout,
        spacing: componentSpecificData?.spacing,
        hoverOffset: componentSpecificData?.hoverOffset,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: true,
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
  
  const plugins = [
    {
      beforeDraw: (chart, args, opts) => {
        const { ctx } = chart;
        const arcs = chart.getDatasetMeta(0).data;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(231, 231, 231, 1)";
        arcs.forEach((a) => {
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.innerRadius + 1 / 2, a.startAngle, a.endAngle);
          ctx.stroke();
        });
      },
    },
  ];

  const handleChange = (event) => {
    setOptionSelectedValue(event.target.value);
    setDropdownselect(event.target.value);
  };

  const dropDownOptions = [
    {value: "weekly", label:'Weekly'},
    {value: "monthly", label:'Monthly'},
  ];

  const handleClick=(e)=>{
    e.preventDefault();
  }

  const doughNutData = {
    doughNutName:<span>{title}</span>,
    data: data,
    options: options,
    currentValue: optionSelectedValue,
    onChange: handleChange,
    dropDownOptions: dropDownOptions,
    plugins: plugins,
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },
    total: `${title} ${dashboardType}`=== dashboardConstants?.LeadAnalyticsBD ? 421 : totalCount,
    isSelectFieldRequired:true,
    currentOption:dropdownselect,
    dropDownOptions:dropDownOptions,
    onClick:handleChange,
    loading:loading,
    ref:ref
    // percentage: "+32.40%",  
  };
  

  return (
    <DoughNut doughNutData={doughNutData} />
  );
};

export default DonutChartWithDescription;
