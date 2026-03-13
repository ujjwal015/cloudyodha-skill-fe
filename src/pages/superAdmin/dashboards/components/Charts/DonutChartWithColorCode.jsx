import React, { useEffect, useState } from "react";
import LineGraphChart from "../../../../../components/common/LineGraphChart";
import { useDispatch } from "react-redux";
import { getDonutDataWithColorCodeAPI } from "../../../../../api/superAdminApi/dashboard";


const DonutChartWithColorCode = ({className,clientId,dashboardType,title,componentSpecificData={},componentList=[]}) => {
  const [currentOption, setCurrentOption] = useState("monthly");
  const [buttonOptions, setButtonOptions] = useState([{name: "monthly", label: "Monthly"}, {name: "yearly", label: "Yearly"}]);
  const [componentSpecificUrl,setComponentSpecificUrl]=useState("");
  const [loading,setLoading]=useState(false)
  const [componentDonutData,setComponentData]=useState([]);
  const dispatch=useDispatch()

  const updateData=(data)=>{
    setComponentData(data);
  }

  const getDonutDataWithColorCode=(url)=>{
    dispatch(getDonutDataWithColorCodeAPI(url,setLoading,updateData))
  }

  
  useEffect(()=>{
    if(componentList?.length>0){
      const element = componentList?.find(
        (item) =>{ 
          return `${item?.componentId?.component_name} ${item?.componentId?.component_category}` === `${title} ${dashboardType}`}
      );

      if (element) {
        setComponentSpecificUrl(element?.componentId?.endpoint);
      }
    }
  },[componentList])

  useEffect(()=>{
    if(componentSpecificUrl){
      getDonutDataWithColorCode(componentSpecificUrl);
    }
  },[componentSpecificUrl])
  
  const data = {
    labels: componentSpecificData?.label, 
    datasets: [
      {
        label: componentSpecificData?.dataset?.[0]?.label,
        data: [50, 53, 57, 41, 30, 65, 70, 80, 90, 25, 60, 45], 
        borderColor:componentSpecificData?.dataset?.[0]?.borderColor ,
        borderWidth: componentSpecificData?.dataset?.[0]?.borderWidth,
      },
      {
        label:componentSpecificData?.dataset?.[1]?.label,
        data: [32, 60, 85, 51, 84, 76, 80, 70, 60, 50, 40, 30], 
        borderColor:componentSpecificData?.dataset?.[1]?.borderColor,
        borderWidth: componentSpecificData?.dataset?.[1]?.borderWidth,
      },
      {
        label:  componentSpecificData?.dataset?.[2]?.label,
        data: [10, 90, 26, 60, 100, 132, 20, 161, 118, 121, 112, 130], 
        borderColor:  componentSpecificData?.dataset?.[2]?.borderColor,
        borderWidth:  componentSpecificData?.dataset?.[2]?.borderWidth,
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
    elements: {
      point: {
        backgroundColor: (context) => context.dataset.borderColor,
        pointRadius: 2,
        hoverRadius: 4,
      },
    },
  };

  const handleClickCurrentOptions = (option) =>{
    setCurrentOption(option)
  };
  
  const lineGraphChartData = {
    name: <span>{title}</span>,
    data: data,
    className: className,
    options: options,
    btnOptions: buttonOptions,
    currentOption: currentOption,
    onClick: handleClickCurrentOptions,
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },  
  };

  return (
   <LineGraphChart lineGraphChartData={lineGraphChartData}/>
  );
};

export default DonutChartWithColorCode;
