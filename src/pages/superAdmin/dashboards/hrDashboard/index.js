import React, { useEffect, useRef } from "react";
import "./style.css";
import { capitalizeFunc } from "./../../../../utils/projectHelper";
import DashboardInfoCards from "./DashboardInfoCards";
import UpcomingAssignment from "./UpcomingAssignment";
import BarChart from "./chart";
import PieChart from "./pieChart.js";
import { ReactComponent as Arrow } from "../../../../assets/icons/dropdown-arrow.svg";
import { ReactComponent as MoreIcon } from "../../../../assets/icons/more-icon.svg";
import ActivityTimeline from "./activityTimeline";
import { useDispatch } from "react-redux";
import { getDashboardsDataAPI } from "../../../../api/adminApi/dashboards";
import { GET_HR_DASHBOARD_API } from "../../../../config/constants/apiConstants/admin";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.popState(null, document.title, window.location.href);
    });
    dispatch(getDashboardsDataAPI(GET_HR_DASHBOARD_API));
  }, []);

  return (
    <div className="main-content adm-dashboard">
      <div className="dashboard-title">
        <h1>Welcome back, HR Dashboard</h1>
        <p>Dashboard Overview</p>
      </div>
      <DashboardInfoCards />
      <div className="charts-wrapper">
        <div className="charts">
          <BarChart />
          <PieChart />
          <ActivityTimeline />
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
        {/* <li onClick={handleRemove}>
          <span>Remove</span>
        </li> */}
      </ul>
    </div>
  );
};
