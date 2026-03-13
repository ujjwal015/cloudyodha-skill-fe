import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import TimeSpentPieChart from "../../../components/common/TimeSpentPieChart/index";
import AssessedApplicants from "../../../components/common/AssessedApplicant";
import { useDispatch, useSelector } from "react-redux";
import { getAssessedApplicantData } from "../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../redux/slicers/admin/dashboardSlice";


const AssessmentApplicantDonut = ({clientId}) => {
  const [currentValue, setCurrentValue] = useState("Today");
  const [loading,setLoading]= useState(true)
  const dispatch=useDispatch();
  const {assessedApplicant={}}=useSelector(dashboardSelector)
  const [failedCount,setFailedCount]=useState(0);
  const [passedCount,setPassedCount]=useState(0);
  const [notGivenTestCount,setNotGivenTestCount]=useState(0);
  const [totalCandidates,setTotalCandidates]=useState(0);

  
  const getAssessedApplicants=useCallback(()=>{
    dispatch(getAssessedApplicantData(setLoading,clientId))
  },[clientId, dispatch])

  useEffect(()=>{
    // if(clientId){
      getAssessedApplicants()
    // }
  },[clientId]);

  useEffect(()=>{
    if(Object.keys(assessedApplicant).length>0){
      setFailedCount(assessedApplicant.failedCandidate);
      setPassedCount(assessedApplicant.passedCandidate);
      setNotGivenTestCount(assessedApplicant.notGivenTest);
      setTotalCandidates(assessedApplicant.totalCandidates)
    }
  },[assessedApplicant])

  const handleChange = useCallback((event) => {    
    setCurrentValue(event.target.value);
  },[]);
  
  const data = useMemo(()=>{
    return {
      labels: ["Pass", "Fail", "Not Attempted"],
      datasets: [
        {
          label:" ",
          data: [Math.floor((parseInt(passedCount)/100)*totalCandidates) ||0, Math.floor(parseInt(failedCount)/100*totalCandidates) ||0 , Math.floor(parseInt(notGivenTestCount)/100*totalCandidates|| 0)],
          backgroundColor: ["#4CDDA9", "#FFB571","#5B3256"],
          borderRadius: 20,
          cutout: "70%",
          spacing: 3,
          rotation: 90,
          borderWidth: 0,
        },
      ],
    };
  },[failedCount, notGivenTestCount, passedCount, totalCandidates])
  
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
  
  const assessedApplicantData = useMemo(()=>{
    return {
      isPermissions: {
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: true,
      },
      title: <h1 style={{fontWeight:"bold"}}>Assessed Applicant</h1>,
      value: currentValue,
      handleChange:handleChange,
      data: data,
      options: options,
      hour: "",
      mins: "",
      selectInputRequired: false,
      viewAttendanceRequired: false,
      isAssessedApplicant:true,
      totalAssessedApplicants:totalCandidates,
      total:<h1 style={{fontSize:"large",fontWeight:"bold"}}>{totalCandidates}</h1>,
      // percentage:"30%"
    };
  },[currentValue, data, handleChange, options, totalCandidates])
  
  return (
    <AssessedApplicants charts={assessedApplicantData} />
  );
};

export default memo(AssessmentApplicantDonut);
