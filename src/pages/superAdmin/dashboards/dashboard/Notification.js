import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import { ActionComp } from ".";
import { getNotificationsApi } from "../../../../api/superAdminApi/dashboard";
import notify1 from "../../../../assets/images/common/notify1.png";
import { dashboardSelector } from "../../../../redux/slicers/superAdmin/dashboardSlice";
import { getTimeDifference } from "../../../../utils/projectHelper";

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications = [] } = useSelector(dashboardSelector);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getNotifications = () => {
    setLoading(true);
    dispatch(getNotificationsApi(setLoading));
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const handleRemove = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    setOpen(false);
    getNotifications();
  };
  return (
    <div className="list-card notifications">
      <div
        className="card-title select-and-more-wrapper"
        style={{ position: "relative" }}
      >
        <h2>Notifications</h2>
        <ActionComp
          open={open}
          setOpen={setOpen}
          handleRefresh={handleRefresh}
          handleRemove={handleRemove}
        />
      </div>
      <div className="card-lists notify-cards">
        {loading ? (
          <div className="notification-loading">
            <PulseLoader size="10px" color="#0bbbfe" />
          </div>
        ) : (
          notifications.length > 0 ?notifications?.map((item) => (
            <div className="card-list" key={item?._id}>
              <img src={notify1} alt="no-iamge" />
              <div className="detail-hours">
                <p className="detail">{item?.message}</p>
                <p className="hours">{getTimeDifference(item?.createdAt)}</p>
              </div>
            </div>
          )):<div className="no-notifications">No Notifications</div>
        )}
      </div>
    </div>
  );
};

export default Notification;
