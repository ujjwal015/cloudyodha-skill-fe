import React, { useEffect, useState } from "react";
import DoughNut from "../../../../components/common/Doughnut/index";
import { Chart, registerables } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionBankAnalyticsData_CD } from "../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";

Chart.register(...registerables);

const QuestionBankAnalyticsChart = ({assignedClientList=[],globalSelectedIds=[]}) => {
  const [value, setValue] = useState("Today");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading,setLoading]=useState(false);
  const dispatch=useDispatch();
  const {questionBankAnalyticsContentDashboard={}}=useSelector(dashboardSelector)

  const getQuestionBankAnalyticsData=(id)=>{
    dispatch(getQuestionBankAnalyticsData_CD(setLoading,id))
  }

  useEffect(()=>{
    if(selectedIds.length>0){
      getQuestionBankAnalyticsData(selectedIds.join(","))
    }
    else{
      getQuestionBankAnalyticsData("")
    }
  },[selectedIds])

  useEffect(() => {
      setSelectedIds(globalSelectedIds);
  }, [globalSelectedIds]);

  const data = {
    labels: ["Theory Questions", "Viva Questions", "Practical Questions"],
    datasets: [
      {
        label: ":",
        data: [questionBankAnalyticsContentDashboard.theory ||0, questionBankAnalyticsContentDashboard.viva ||0, questionBankAnalyticsContentDashboard.practical ||0],
        backgroundColor: [
          "rgba(64, 191, 127, 1)",
          "rgba(51, 169, 255, 1)",
          "rgba(255, 136, 25, 1)",
        ],
        borderRadius: 8,
        cutout: "60%",
        spacing: 10,
        hoverOffset: 25
        ,
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

  const handleChangeData = (event) => {
    setValue(event.target.value);
  };

  const dropDownOptions = [
    { value: "XXXX", label: "XXXX" },
    { value: "YYYY", label: "YYYY" },
    { value: "ZZZZ", label: "ZZZZ" },
  ];

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

    setSelectedIds(value.map(item => item.id));
  };
  const filterData={
    setSelectedIds:setSelectedIds,
    selectedIds :selectedIds ,
    assignedClientList: assignedClientList,
    handleChange : handleChange,
    label:"client"
    }

  const doughNutData = {
    doughNutName: <h1 style={{fontSize:"normal",fontWeight:"bold"}}>Question Analytics</h1>,
    data: data,
    options: options,
    placeHolder:"Select",
    currentValue: value,
    onChange: handleChangeData,
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
    total: <h1 style={{fontSize:"large",fontWeight:"bold"}}>{(questionBankAnalyticsContentDashboard.theory ||0) + (questionBankAnalyticsContentDashboard.viva ||0) + (questionBankAnalyticsContentDashboard.practical ||0)}</h1>,
    filterData,
    isFilterRequired:true
  };

  return <DoughNut doughNutData={doughNutData} />;
};

export default QuestionBankAnalyticsChart;
