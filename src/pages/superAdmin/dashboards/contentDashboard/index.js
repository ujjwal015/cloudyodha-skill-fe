import React, { useEffect, useRef, useState } from "react";
import "./style.css";
// import "../businessDashboard/businessDashboard.css"; 
// import "../businessDashboard/style.css";

import { capitalizeFunc } from "./../../../../utils/projectHelper";

import DashboardInfoCards from "./DashboardInfoCards";
import BarChart from "./chart";
import PieChart from "./pieChart.js";
import { ReactComponent as Arrow } from "../../../../assets/icons/dropdown-arrow.svg";
import { ReactComponent as MoreIcon } from "../../../../assets/icons/more-icon.svg";
import ActivityTimeline from "./activityTimeline";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardsDataAPI } from "../../../../api/adminApi/dashboards";
import { GET_CONTENT_DASHBOARD_API } from "../../../../config/constants/apiConstants/admin";
import HeaderTitle from "../../../../components/common/HeaderTitle/index.js";
import BreadCrumbs from "../../../../components/common/Breadcrumbs/index.js";
import { navigate, currentClockTime } from "./../../../../utils/projectHelper";
import TimeSpentChart from "./TimeSpentChart.jsx";
import AssessmentAnalyticsChart from "./AssessmentAnalyticsChart.js";
import QuestionBankAnalyticsChart from "./QuestionBankAnalyticsChart.js";
import TeamMembersTable from "./TeamMembersTable.js";
import ClientBasedJobRoleTable from "./ClientBasedJobRoleTable.js";
import UpcomingBatches from "./UpcomingBatches.js";
import JobroleBasedQuestionStats from "./JobroleBasedQuestionStats.js";
import LanguageDistributionChart from "./LanguageDistributionChart.js";
import TeamMemberActivities from "./TeamMemberActivities.js";
import JobRoleOccurance from "./JobRoleOccurance.js";
import { authSelector } from "../../../../redux/slicers/authSlice.js";
import GlobalClientSelect from "./GlobalClientSelect.js";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [clockIn, setClockIn] = useState(false);

  // Current location & date and time
  const [clientId,setClientId]=useState("")
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAttendenceModal, setIsAttendenceModal] = useState(false);
  const [globalSelectedIds,setGlobalSelectedIds]=useState([]);
  console.log("globalSelectedIds",globalSelectedIds)
  const [location, setLocation] = useState("");

  const [assignedClientList,setAssignedClientList]=useState([])
  const {userInfo={}}=useSelector(authSelector);
  console.log("userInfoVVVV",userInfo)

useEffect(()=>{
  if(userInfo.assigndClients && userInfo.assigndClients.length>0){
    const arrlist=[]
    for(let item of userInfo.assigndClients){
      arrlist.push({label:item.clientcode, id:item._id})
    }
    arrlist.length>0 && setAssignedClientList(arrlist)
  }
},[userInfo])

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.popState(null, document.title, window.location.href);
    });
    dispatch(getDashboardsDataAPI(GET_CONTENT_DASHBOARD_API));
  }, []);

  const getLocationName = async (latitude, longitude) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        setLocation(data.display_name);
        // You can set state or perform any action with the obtained location name here
      })
      .catch((error) => console.error("Error fetching location name:", error));
  };

  const getCurrentLocation = () => {
    return new Promise(async (resolve, reject) => {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationName = await getLocationName(latitude, longitude);
          },
          (error) => reject(error),
          { enableHighAccuracy: true }
        );
      } catch (error) {
        reject(error);
      }
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    const data = getCurrentLocation();

    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate1 = currentClockTime(currentTime?.toLocaleDateString());
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  const formattedDate = currentTime.toLocaleDateString("en-US", options);

  const handleToggleAttendence = (isClockOut = false) => {
    setClockIn((prev) => !prev);
    if (isClockOut) {
      // API Call
      console.log(isClockOut, "isClockOut");
    } else {
      console.log(isClockOut, "isClockIn");
    }
  };

  const handleOpenAttendanceModal = () => {
    setIsAttendenceModal(true);
  };

  const handleBreadCrumbClick = (event, name, path) => {
    navigate(path);
  };

  const breadCrumbsData = [
    {
      name: "Overview",
      isLink: true,
      key: "1",
      path: "/",
      onClick: handleBreadCrumbClick,
      isPermissions: {
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: true,
      }, // User Role permission
      isDisable: false,
    },
    {
      name: "Content Dashboard",
      isLink: false,
      key: "2",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {
        1: true,
        2: false,
        3: false,
        4: true,
        5: false,
        6: true,
      },
      isDisable: false,
    },
  ];

  const attendanceData = {
    locationName: location?.split(",")[0],
    formattedTime,
    formattedDate,
    isClockIn: clockIn,
    onClick: handleToggleAttendence,
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // Handle "Select All" case
    if (value[value.length - 1] === "all") {
      if (globalSelectedIds.length === assignedClientList.length) {
        setGlobalSelectedIds([]); // Deselect all if already selected
      } else {
        setGlobalSelectedIds(assignedClientList.map((item) => item.id)); // Select all
      }
      return;
    }

    // Update the state with selected IDs
    setGlobalSelectedIds(value.map(item => item.id));
  };

  

  return (
    <div className="main-content adm-dashboard">
      <div className="dashboard-topheader">
        <div className="dashboard-welcome">
          <HeaderTitle greeting="Welcome" userName={userInfo.firstName|| + " "+ userInfo.lastName} />
          <div className="breadcrumbs">
            <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
          </div>
        </div>
        <GlobalClientSelect
        selectedIds={globalSelectedIds}
        setSelectedIds={setGlobalSelectedIds}
        assignedClientList={assignedClientList}
        handleChange={handleChange}
        label={"clients"}
        />
      </div>
      <div className="card-info-wrapper">
        <DashboardInfoCards clientId={globalSelectedIds}/>
      </div>
      <div className="cards-grid">
        <TimeSpentChart />
        <AssessmentAnalyticsChart assignedClientList={assignedClientList} /> 
      </div>
      <div className="cards-grid">
        <QuestionBankAnalyticsChart assignedClientList={assignedClientList} globalSelectedIds={globalSelectedIds}/>
        <LanguageDistributionChart  assignedClientList={assignedClientList} globalSelectedIds={globalSelectedIds}/>
      </div>
      <div className="cards-grid">
        <JobRoleOccurance assignedClientList={assignedClientList} globalSelectedIds={globalSelectedIds}/>
        <TeamMembersTable />
      </div>
      <div className="cards-grid">
        <ClientBasedJobRoleTable />
        <UpcomingBatches clientId={globalSelectedIds}/>
      </div>
      <div className="cards-grid">
        <TeamMemberActivities />
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
