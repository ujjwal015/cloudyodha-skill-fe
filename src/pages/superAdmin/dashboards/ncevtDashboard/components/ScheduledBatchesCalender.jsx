import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
// import Calendar from "../../../../../components/common/ScheduleCalendar/index";
// import AddNewMeetingModal from "../../../../../components/common/Modal/AddNewMeetingModal";
import { ReactComponent as Clock } from "../../../../../assets/icons/clock.svg";
// import { ReactComponent as VerticalDotsIcon } from "../../../../assets/icons/Vertical_threeDots.svg";
import "../style.css";
import ScheduleCalendarNCEVT from "../../../../../components/common/ScheduleCalenderNCEVT";
import { useDispatch, useSelector } from "react-redux";
import { getScheduledBatchList } from "../../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../../redux/slicers/admin/dashboardSlice";

const ScheduledBatchCalendar = ({clientId}) => {

  const getFormattedDate = useCallback(()=>{
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Get day with leading zero if needed
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Get month with leading zero if needed
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
},[])

  const [addNewModal, setAddNewModal] = useState(false);
  const [loading,setLoading]=useState(true)
  const [startDate,setStartDate]=useState(getFormattedDate());
  const {scheduledBatch=[]}=useSelector(dashboardSelector)


  const [isStatus,setIsStatus]=useState("complete")
  const dispatch=useDispatch();

  const getScheduleBatchListData=useCallback(()=>{
  dispatch(getScheduledBatchList(setLoading,isStatus,startDate,clientId))
  },[clientId, dispatch, isStatus, startDate])

  useEffect(()=>{
    if(startDate){
      getScheduleBatchListData()
    }
  },[startDate,clientId])

  const handleSelectedDate=useCallback((data)=>{
    setStartDate(data);
  },[])



  // const handleAddNewClick = () => {
  //   // setAddNewModal(true);
  // };

const scheduleCalendar= useMemo(()=>{
  return {
  calenderName: "Schedule Batches",
  listName: "Schedule list",
}},[]);

  return (
    <>
      <ScheduleCalendarNCEVT calendar={scheduleCalendar} handleSelectedDate={handleSelectedDate} scheduledBatch={scheduledBatch}/>
    </>
  );
};

export default memo(ScheduledBatchCalendar);
