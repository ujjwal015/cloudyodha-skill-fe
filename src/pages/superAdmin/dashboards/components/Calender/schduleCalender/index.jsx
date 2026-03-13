import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import ScheduleCalendarNCEVT from "../../../../../../components/common/ScheduleCalenderNCEVT";
import { useDispatch, useSelector } from "react-redux";
import { getScheduledBatchList } from "../../../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../../../redux/slicers/admin/dashboardSlice";
import { getCalenderDataApi } from "../../../../../../api/superAdminApi/dashboard";
import { useInView } from "react-intersection-observer";
import RingLoaderCompoenent from "../../../../../../components/common/RingLoader";

const ScheduledBatchCalender = ({
  clientId = "",
  title = "",
  dashboardType = "",
  componentList,
  componentSpecificData = {},
}) => {
  const getFormattedDate = useCallback(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(getFormattedDate());

  const { ref, inView } = useInView({ threshold: 0.5 });

  const [calenderData, setCalenderData] = useState([]);
  const prevTextRef = useRef(clientId)


  console.log("startDate_STARTDATE",startDate,inView)

  const handleUpdateDateState = (data) => {
    // if(data){
    //   setUpdateCalenderDate(data)
    // }
  };
  const [componentSpecificUrl, setComponentSpecificUrl] = useState("");

  const dispatch = useDispatch();

  const handleSelectedDate = useCallback((data) => {
    setStartDate(data);
  }, []);

  const updateState = (data) => {
    if (data?.length > 0) {
      setCalenderData(data);
    } else {
      setCalenderData([]);
    }
  };

  const getCalenderData = (url) => {
    setLoading(true);
    dispatch(
      getCalenderDataApi(url, clientId, startDate, setLoading, updateState)
    );
  };

  useEffect(() => {
    if (componentList?.length > 0) {
      const element = componentList?.find(
        (item) =>
          `${item?.componentId?.component_name} ${item?.componentId?.component_category}` ===
          `${title} ${dashboardType}`
      );
      if (element) {
        setComponentSpecificUrl(element?.componentId?.endpoint);
      }
    }
  }, [componentList]);

  // useEffect(() => {
  //   if (componentSpecificUrl && inView) {
  //     //&& !calenderData?.length>0
  //   }
  // }, [componentSpecificUrl, inView, clientId]);

  useEffect(() => {
    if (componentSpecificUrl && inView && (clientId !== prevTextRef.current)) {
      prevTextRef.current = clientId;
      getCalenderData(componentSpecificUrl);
    }
    else if(componentSpecificUrl && inView && (clientId === "" && !calenderData?.length>0)){
      getCalenderData(componentSpecificUrl);
    }
  }, [componentSpecificUrl, inView, clientId]);


  useEffect(() => {
    if (componentSpecificUrl && inView) {
      getCalenderData(componentSpecificUrl);
    }
  }, [startDate]);

  // useEffect(()=>{
  //   if(componentSpecificUrl && inView){
  //     setLoading(true)
  //   dispatch(getCalenderDataApi(componentSpecificUrl,clientId,startDate,setLoading,updateState))
  //   }
  // },[clientId])

  return (

        <ScheduleCalendarNCEVT
          calendar={componentSpecificData}
          handleSelectedDate={handleSelectedDate}
          scheduledBatch={calenderData}
          handleUpdateDateState={handleUpdateDateState}
          loading={loading}
          reference={ref}
        />
  );
};

export default ScheduledBatchCalender;
