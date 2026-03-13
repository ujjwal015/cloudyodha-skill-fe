import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getScheduledBatchList_CD } from "../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";
import ScheduleBatch from "../../../../components/common/ScheduleBatch";

const UpcomingBatches = ({clientId=[]}) => {

  const getFormattedDate = useCallback(()=>{
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); 
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
},[])

const convertDateFormat=(dateStr)=> {
  const [day, month, year] = dateStr.split('/');
  return `${day}-${month}-${year}`;
}

  const [addNewModal, setAddNewModal] = useState(false);
  const [loading,setLoading]=useState(true)
  const [startDate,setStartDate]=useState(getFormattedDate());
  const {scheduledBatch=[], scheduledBatch_CD=[]}=useSelector(dashboardSelector)
  console.log("scheduledBatch_CD",startDate)


  const [isStatus,setIsStatus]=useState("complete")
  const dispatch=useDispatch();

  const getScheduleBatchListData=useCallback(()=>{
  dispatch(getScheduledBatchList_CD(setLoading,isStatus,startDate,clientId.join(",")))
  },[clientId, dispatch, isStatus, startDate])

  useEffect(()=>{
    if(startDate){
      getScheduleBatchListData()
    }
  },[startDate,clientId])

  const handleSelectedDate=useCallback((data)=>{
    setStartDate(convertDateFormat(data));
  },[])

const scheduleCalendar= useMemo(()=>{
  return {
  calenderName: "Schedule Batches",
  listName: "Schedule list",
}},[]);

  return (
    <>
      <ScheduleBatch calendar={scheduleCalendar} handleSelectedDate={handleSelectedDate} scheduledBatch={scheduledBatch_CD}/>
    </>
  );
};

export default memo(UpcomingBatches);
