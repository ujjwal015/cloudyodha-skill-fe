import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Responsive, WidthProvider } from "react-grid-layout";
import layoutConfig from "./layoutConfig";
import "react-grid-layout/css/styles.css";
import "./style.css";
import { capitalizeFunc } from "../../../../utils/projectHelper";
import { authSelector } from "../../../../redux/slicers/authSlice";
import Notification from "./Notification";
import DashboardInfoCards from "./DashboardInfoCards";
import UpcomingAssignment from "./UpcomingAssignment";
import AssessmentStatistics from "./AssessmentStatistics";
import ClientStatistics from "./ClientStatistics";
import { ReactComponent as Arrow } from "../../../../assets/icons/dropdown-arrow.svg";
import { ReactComponent as MoreIcon } from "../../../../assets/icons/more-icon.svg";
import {
  getDashboardGridStyleApi,
  postDashboardGridStyleApi,
} from "../../../../api/superAdminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/superAdmin/dashboardSlice";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const { userInfo = {} } = useSelector(authSelector);
  const { dashboardGridStyle = layoutConfig } = useSelector(dashboardSelector);
  const dispatch = useDispatch();
  const { userType = 6, _id, firstName = "", lastName = "" } = userInfo;
  const fullName = firstName + " " + lastName;
  const [isLayoutChange, setIsLayoutChange] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBreakPointChange = (breakpoint) => {
    // setState((pre) => ({ ...pre, currentBreakpoint: breakpoint }));
  };

  // useEffect(() => {
  //   dispatch(getDashboardGridStyleApi(_id, setLoading));
  // }, []);

  const handleLayoutChange = (layout, layouts) => {
    console.log("@@@@@@@@");
    const formData = {
      id: _id,
      layout: layouts,
    };
    if (isLayoutChange) {
      dispatch(postDashboardGridStyleApi(formData, setLoading));
      setIsLayoutChange(false);
    }
  };

  const handleDragOrResize = () => {
    console.log("handleDragOrResize");
    setIsLayoutChange(true);
  };

  return (
    <div className="main-content dashboard">
      <div className="dashboard-title">
        <h1>Welcome back, {capitalizeFunc(fullName)}</h1>
        <p>Dashboard Overview</p>
      </div>
      <DashboardInfoCards />
      <div className="charts-wrapper">
        <div className="charts">
          <AssessmentStatistics />
          <ClientStatistics />
          <Notification />
        </div>
        <div className="calendar">
          <UpcomingAssignment />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

export const DropDown = ({ dropDown, setDropDown, clickHandler }) => {
  // close more option popup
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setDropDown((pre) => ({ ...pre, open: false }));
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  const handleClick = (value) => {
    setDropDown({ open: false, text: value });
    clickHandler && clickHandler();
  };

  return (
    <div className="custom-type-select">
      <div
        className="select-type-dropdown"
        ref={ref}
        onClick={(event) => {
          event.stopPropagation();
          setDropDown((pre) => ({ ...pre, open: !dropDown.open }));
        }}
      >
        <span>This {capitalizeFunc(dropDown.text)}</span>
        <Arrow
          style={{
            transform: dropDown.open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>
      <ul
        style={{ display: dropDown.open ? "block" : "none" }}
        className="select-dropdown-ul"
      >
        <li
          onClick={() => handleClick("week")}
          className={dropDown.text == "week" ? "active" : ""}
        >
          This Week
        </li>
        <li
          onClick={() => handleClick("month")}
          className={dropDown.text == "month" ? "active" : ""}
        >
          This Month
        </li>
        <li
          onClick={() => handleClick("year")}
          className={dropDown.text == "year" ? "active" : ""}
        >
          This Year
        </li>
      </ul>
    </div>
  );
};

export const ActionComp = ({ setOpen, open, handleRefresh, handleRemove }) => {
  // close more option popup
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="more-icon-wrapper">
      <MoreIcon
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
        className="db-more-icon"
        ref={ref}
      />
      <ul
        className="more-dropdown"
        style={{ display: open ? "block" : "none" }}
      >
        <li onClick={handleRefresh}>
          <span>Refresh</span>
        </li>
        <li onClick={handleRemove}>
          <span>Remove</span>
        </li>
      </ul>
    </div>
  );
};
