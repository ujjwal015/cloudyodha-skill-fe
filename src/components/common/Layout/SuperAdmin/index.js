import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { useDispatch } from "react-redux";
import { setProfileDropdown } from "../../../../redux/slicers/activitySlice";
import Footer from "./footer";

const SuperAdminLayout = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(setProfileDropdown(false));
  };
  return (
    <div className="admin-dashboard" onClick={handleClick}>
      <NavBar />

      <div className="main-dashboard">
        <SideBar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default SuperAdminLayout;
