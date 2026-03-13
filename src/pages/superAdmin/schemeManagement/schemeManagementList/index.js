/* eslint-disable no-useless-concat */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import "../../userManagement/AssessorList/style.css";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  SUPER_ADMIN_SCHEME_MANAGEMENT,
  SUPER_ADMIN_SCHEME_MANAGEMENT_CREATE_SCHEME,
  SUPER_ADMIN_SUB_SCHEME_MANAGEMENT,
  SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_CREATE_SCHEME,
} from "../../../../config/constants/routePathConstants/superAdmin";
import "../../../../components/common/table/style.css";
import SchemeManagementList from "./scheme/schemeList/index";
import SubSchemeManagementList from "./subScheme/subSchemeList/index";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { getSubRole, userRoleType } from "../../../../utils/projectHelper";
import { useSelector } from "react-redux";
import { authSelector } from "../../../../redux/slicers/authSlice";

const SchemeManagementLists = () => {
  const getActiveTab = (location) =>
    location.pathname.split("/")[1].replace("-management-list", "");

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => getActiveTab(location));
  const { userInfo = {} } = useSelector(authSelector);

  // permission
  const {
    SCHEME_MANAGEMENT_FEATURE,
    SCHEME_MANAGEMENT_LIST_FEATURE_1,
    SCHEME_MANAGEMENT_LIST_FEATURE_2,
  } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = SCHEME_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName1 = SCHEME_MANAGEMENT_LIST_FEATURE_1;
  const subFeatureName2 = SCHEME_MANAGEMENT_LIST_FEATURE_2;
  const isRolePermission1 = getSubRole(roleType?.subFeatures, subFeatureName1);
  const isRolePermission2 = getSubRole(roleType?.subFeatures, subFeatureName2);

  useEffect(() => {
    setActiveTab(getActiveTab(location));
  }, [location]);

  const handleActive = (tab) => {
    navigate(
      tab === "scheme"
        ? SUPER_ADMIN_SCHEME_MANAGEMENT
        : SUPER_ADMIN_SUB_SCHEME_MANAGEMENT
    );
  };
  return (
    <div className="main-content">
      <div className="title">
        <div className="title-text">
          <h1>Scheme Management List</h1>
        </div>
        <div className="title-btn">
          {((isRolePermission1?.permissions?.["2"] && activeTab === "scheme") ||
            (isRolePermission2?.permissions?.["2"] && activeTab !== "scheme")) &&
             (<button
              onClick={() => {
                const schemeType =
                  activeTab === "scheme"
                    ? SUPER_ADMIN_SCHEME_MANAGEMENT_CREATE_SCHEME
                    : SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_CREATE_SCHEME;
                navigate(schemeType);
              }}
            >
              <PlusIcon />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>
      <div className="scheme-tab">
        <button
          className={activeTab === "scheme" ? "active" : "scheme-btn"}
          onClick={() => handleActive("scheme")}
        >
          Scheme
        </button>
        <button
          className={activeTab === "sub-scheme" ? "active" : "scheme-btn"}
          onClick={() => handleActive("sub-scheme")}
        >
          Sub-Scheme
        </button>
      </div>

      {activeTab === "scheme" ? (
        <>
          <SchemeManagementList />
        </>
      ) : (
        <>
          <SubSchemeManagementList />
        </>
      )}
    </div>
  );
};

export default SchemeManagementLists;
