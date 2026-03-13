import React, { useState } from "react";
import Account from "./tabs/myAccount";
import Security from "./tabs/security";
import DeviceManagement from "./tabs/deviceManagement";
import "./style.css";
import { Button } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  SUPER_ADMIN_MY_ACCOUNT_PAGE,
  SUPER_ADMIN_MY_DEVICE_MANAGEMENT_PAGE,
  SUPER_ADMIN_MY_SECURITY_PAGE,
} from "../../../config/constants/routePathConstants/superAdmin";
import { getUserDetails } from "../../../utils/projectHelper";
const MyAccount = () => {
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { _id = "" } = getUserDetails();

  const tabs = [
    { id: 1, label: "Account", content: <Account />, pathname: `${SUPER_ADMIN_MY_ACCOUNT_PAGE}/${_id}` },
    { id: 2, label: "Security", content: <Security />, pathname: SUPER_ADMIN_MY_SECURITY_PAGE },
    {
      id: 3,
      label: "Device Management",
      content: <DeviceManagement />,
      pathname: SUPER_ADMIN_MY_DEVICE_MANAGEMENT_PAGE,
    },
  ];

  const activeTabContent = tabs.find((tab) => tab.id === activeTab).content;

  const handleActiveTab = (tabId, pathname) => {
    navigate(pathname);
    setActiveTab(tabId);
  };

  return (
    <div className="main-content">
      <div className="title">
        <h1>Settings</h1>
      </div>
      <section className="my-account-wrapper">
        <div className="tabs-wrapper">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              // className={`tab ${activeTab === tab.id ? "active" : ""}`}
              className={`tab ${pathname === tab.pathname ? "active" : ""}`}
              onClick={() => handleActiveTab(tab.id, tab.pathname)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default MyAccount;
