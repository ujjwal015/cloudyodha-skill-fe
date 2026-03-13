import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import "./style.css";
import ScheduleCalendarNCEVT from "../../../../../../components/common/ScheduleCalenderNCEVT";
import { useDispatch, useSelector } from "react-redux";
import { getScheduledBatchList } from "../../../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../../../redux/slicers/admin/dashboardSlice";

const ScheduledBatchCalendar = ({ clientId }) => {
  const getFormattedDate = useCallback(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); 
    const month = String(today.getMonth() + 1).padStart(2, "0"); 
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  }, []);

  const [addNewModal, setAddNewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(getFormattedDate());
  const { scheduledBatch = [] } = useSelector(dashboardSelector);

  const [isStatus, setIsStatus] = useState("complete");
  const dispatch = useDispatch();

  const getScheduleBatchListData = useCallback(() => {
    dispatch(getScheduledBatchList(setLoading, isStatus, startDate, clientId));
  }, [clientId, dispatch, isStatus, startDate]);

  useEffect(() => {
    if (startDate) {
      getScheduleBatchListData();
    }
  }, [startDate, clientId]);

  const handleSelectedDate = useCallback((data) => {
    setStartDate(data);
  }, []);

  const scheduleCalendar = useMemo(() => {
    return {
      calenderName: "Schedule Batches",
      listName: "Schedule list",
    };
  }, []);

  return (
    <>
      <ScheduleCalendarNCEVT
        calendar={scheduleCalendar}
        handleSelectedDate={handleSelectedDate}
        scheduledBatch={scheduledBatch}
      />
    </>
  );
};

export default memo(ScheduledBatchCalendar);
