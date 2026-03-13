import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboardBasicDetailsApi } from "../../../../api/superAdminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/superAdmin/dashboardSlice";
import OnlineTestStreaming from "../../../../assets/images/pages/dashboard/online-test-streaming.png";
import TotalAssessment from "../../../../assets/images/pages/dashboard/total-assessment.png";
import ActiveClients from "../../../../assets/images/pages/dashboard/active-clients.png";
import ScheduledAssessment from "../../../../assets/images/pages/dashboard/scheduled-assessment.png";
import { navigate } from "../../../../utils/projectHelper";
import { useNavigate } from "react-router";
import {
  SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
  SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
} from "../../../../config/constants/routePathConstants/superAdmin";
const DashboardInfoCards = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { basicDetail = {} } = useSelector(dashboardSelector);

  useEffect(() => {
    dispatch(getAdminDashboardBasicDetailsApi(setLoading));
  }, []);

  const ListItems = [
    {
      title: "Online Test Streaming",
      value: basicDetail?.onlineTestStreaming,
      imgSrc: OnlineTestStreaming,
      className: "listitem1",
      route: '/',
    },
    {
      title: "Total Assessment",
      value: basicDetail?.totalAssessment,
      imgSrc: TotalAssessment,
      className: "listitem2",
      // route: SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
    },
    {
      title: "Active Clients",
      value: basicDetail?.activeClients,
      imgSrc: ActiveClients,
      className: "listitem3",
      route: SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
    },
    {
      title: "Scheduled Assessment",
      value: basicDetail?.scheduledAssessement,
      imgSrc: ScheduledAssessment,
      className: "listitem4",
      route: '/',
    },
  ];

  const onClickHandler = (route) => {
    navigate(route);
  }
  return (
    <div className="dashboard-totalview">
      {ListItems?.map((item) => (
        <div className={`total-listitem ${item?.className}`}
          key={item?.title}
          onClick={() => { onClickHandler(item?.route) }}>
          <div className="listitem-content">
            <p className="total-title">{item?.title}</p>
            <p className="total-count">{item?.value}</p>
          </div>
          <div className="listitem-image">
            <img src={item?.imgSrc} alt="user-icon" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardInfoCards;