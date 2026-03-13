import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionComp, DropDown } from ".";
import { getActiveClientStatisticsApi } from "../../../api/superAdminApi/dashboard";
import { dashboardSelector } from "../../../redux/slicers/superAdmin/dashboardSlice";
import DummyImg from "../../../assets/images/pages/admin/dummy-activity.png";

const ActivityTimeline = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleRemove = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    // dispatch(getActiveClientStatisticsApi(setLoading, type, setKey));
    setOpen(false);
  };


  useEffect(() => {
    // dispatch(getActiveClientStatisticsApi(setLoading, type, setKey));
  }, []);

  return (
    <div className="list-card client-statistics">
      <div className="card-title">
        <h2>Activity Timeline</h2>
        <div className="select-and-more-wrapper">
          <ActionComp
            open={open}
            setOpen={setOpen}
            handleRefresh={handleRefresh}
            handleRemove={handleRemove}
          />
        </div>
      </div>
      <div className="timelines">
        {[1,2,3]?.map(item=>(
          <div className="timeline" key={item}>
            <h3>8 Invoices have been paid</h3>
            <div className="msg">
            <div className="img">
              <img src={DummyImg}/>
            </div>
              <p>Invoices have been paid to the company Tagus.</p>
            </div>
            <h6>02:14 PM Today</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
