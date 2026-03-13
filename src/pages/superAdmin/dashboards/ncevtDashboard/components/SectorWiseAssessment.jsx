import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import DoughNut from "../../../../../components/common/Doughnut/index";

import { Chart, registerables } from "chart.js";
import SectorWiseDohNut from "../../../../../components/common/SectorWiseDonut";
import { useDispatch, useSelector } from "react-redux";
import { getSectorWiseAssessmentData } from "../../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../../redux/slicers/admin/dashboardSlice";
// import { dashboardSelector } from "../../../../../redux/slicers/superAdmin/dashboardSlice";

Chart.register(...registerables);



const SectorWiseAssessmentDoughnutChart = ({clientId}) => {
  const [value, setValue] = useState("Today");
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(true);
  const {sectorWiseAssessmentData=[]} = useSelector(dashboardSelector)
  const [clientList,setClientList]=useState([]);
  const [clientBasisBatchCount,setClientBasisBatchCount]=useState([])
  const [totalBatchCount,setTotalBatchCount]=useState(0);


  const getSectorWiseAssessment=useCallback(()=>{
    dispatch(getSectorWiseAssessmentData(clientId,setLoading));

  },[clientId, dispatch])

  useEffect(()=>{
    getSectorWiseAssessment();
  },[clientId])


  useEffect(()=>{
    let arrayListClientName=[];
    let arrayListBatchCount=[]
    if(sectorWiseAssessmentData.length>0){
      for(let client of sectorWiseAssessmentData){
        if(client.clientCode){
          arrayListClientName.push(client.clientCode);
          arrayListBatchCount.push(client.BatchCount);
        }
      }
    }
    setClientList(arrayListClientName);
    setClientBasisBatchCount(arrayListBatchCount);
    
  },[sectorWiseAssessmentData])

  useEffect(()=>{
    let total=0
    if(clientBasisBatchCount.length>0){
      for(let x of clientBasisBatchCount){
        total=total+x;
      }
    }
    setTotalBatchCount(total);
  },[clientBasisBatchCount])

  const  getRandomColor=useCallback(()=> {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
},[]);

const generateColorArray=useCallback((length) =>{
  const colors = [];
  for (let i = 0; i < length; i++) {
      colors.push(getRandomColor());
  }
  return colors;
},[getRandomColor])

const colorRange = ["LSSSDC", "THSC", "FISCI", "RASCI", "CSDCI", "TELECOM", "SCPwD","SPORTS","MORTSAMARTH"];
const colorCodes=[
  "#FB923C",
  "#450A0A",
  "#F87171",
  "#F9A8D4",
  "#8B5CF6",
  "#2E1065",
  "#1E1B4B",
  "#2563EB",
  "#0EA5E9",
  "#A3E635",
  "#67B7DC",
  "#6694DB",
  "#6670DC",
  "#8067DC",
  "#A267DC",
  "#C767DC",
  "#2ED1C6",
  "#2DD4BF",
  "#1AAB40",
  "#6B7280",
  "#F59E0B",
  "#FDE047",
  "#D4D4D4"
]

  const data = useMemo(()=>{
    return {
      labels:clientList,
      datasets: [
        {
          label: " ",
          data:clientBasisBatchCount,
          backgroundColor: colorCodes.splice(0,clientList.length),
          borderRadius: 5,
          cutout: "60%",
          spacing: clientId !=="" ? 0 :5,
          hoverOffset: 5,
        },
      ],
    };
    
  },[clientBasisBatchCount, clientList])
  
  const options = useMemo(()=>{
    return {
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
  
  },[])
    
  const plugins = useMemo(()=>{
    return [
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
  
  },[])


  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  },[]);


//   const dropDownOptions = [
//     {value: "Today", label:'Today'},
//     {value: "Weekly", label:'Weekly'},
//     {value: "Monthly", label:'Monthly'},
//   ];

  const doughNutData = useMemo(()=>{
    return {
      doughNutName: "Client Wise Assessment",
      data: data,
      options: options,    
      currentValue: value,
      onChange: handleChange,
      // dropDownOptions: dropDownOptions,
      plugins: plugins,
      isPermissions: {
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: true,
      },
      total: totalBatchCount,
      // percentage: "+32.40%",  
      isdropDownOptions:false ,
      issectorValueRequired:false 
    };
    
  
  },[data, handleChange, options, plugins, totalBatchCount, value])
  
  return (
    <SectorWiseDohNut doughNutData={doughNutData} />
  );
};

export default memo(SectorWiseAssessmentDoughnutChart);
