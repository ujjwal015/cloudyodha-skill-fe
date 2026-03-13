/* eslint-disable no-useless-concat */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import {
  ASSESSOR_ATTENDANCE_LIST,
  ASSESSOR_ATTENDANCE_REGULARIZE_PAGE,
} from "../../../../config/constants/routePathConstants/superAdmin";
import "../../../../components/common/table/style.css";
import AssessorAttendanceListList from "./assessorList/list";
import AssessorAttendanceRequestLog from "./requestLog/list";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { getSubRole, userRoleType } from "../../../../utils/projectHelper";
import { useSelector } from "react-redux";
import { authSelector } from "../../../../redux/slicers/authSlice";

const AssessorAttendanceLists = () => {
  const getActiveTab = (location) =>
    location.pathname.split("/")[1].replace("-list", "");

  const navigate = useNavigate();
  const location = useLocation();  
  const [activeTab, setActiveTab] = useState(() => getActiveTab(location));
  const { userInfo = {} } = useSelector(authSelector);
// permission
  const {
    ASSESSOR_ATTENDANCE_FEATURE,
    ASSESSOR_ATTENDANCE_LIST_FEATURE_1,
    ASSESSOR_ATTENDANCE_LIST_FEATURE_2,
  } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = ASSESSOR_ATTENDANCE_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = ASSESSOR_ATTENDANCE_LIST_FEATURE_1;
  const subFeatureName2 = ASSESSOR_ATTENDANCE_LIST_FEATURE_2;
  const isRolePermission1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const isRolePermission2 = getSubRole(roleType?.subFeatures, subFeatureName2);

  useEffect(() => {
    setActiveTab(getActiveTab(location));
  }, [location]);

  const handleActive = (tab) => {
    navigate(
      tab === "assessor-attendance"
        ? ASSESSOR_ATTENDANCE_LIST
        : ASSESSOR_ATTENDANCE_REGULARIZE_PAGE
    );
  };
  return (
    <div className="main-content">
      <div className="title">
        <div className="title-text">
          <h1>Attendance</h1>
        </div>
      </div>
      <div className="scheme-tab">
        <button
          className={activeTab === "assessor-attendance" ? "active" : "scheme-btn"}
          onClick={() => handleActive("assessor-attendance")}
        >
          Attendance Log
        </button>
        <button
          className={activeTab === "attendance-regularize" ? "active" : "scheme-btn"}
          onClick={() => handleActive("attendance-regularize")}
        >
          Attendance Requests
        </button>
      </div>

      {activeTab === "assessor-attendance" ? (
        <>
          <AssessorAttendanceListList />
        </>
      ) : (
        <>
          <AssessorAttendanceRequestLog />
        </>
      )}
    </div>
  );
};

export default AssessorAttendanceLists;
