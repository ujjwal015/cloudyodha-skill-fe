import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, styled } from "@mui/material";
import { getAllJobRoleDashboard } from "../../../../../../api/adminApi/dashboard";
// import { getAllJobRoles } from "../../../../../api/superAdminApi/jobRoleManagement";
// import CustomTableNCVET from "../../../../../components/common/CustomTableNCVET";
import { getSubRole, toolTip, userRoleType } from "../../../../../../utils/projectHelper";

import { dashboardSelector } from "../../../../../../redux/slicers/admin/dashboardSlice";
import {
  BDA_CLIENT_WISE_VIEW_JOB_ROLE_PAGE,
  BDA_JOB_ROLE_PAGE,
} from "../../../../../../config/constants/routePathConstants/superAdmin";
import { useNavigate } from "react-router-dom";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ToolTipContent from "../../ToolTipContent";
// import ToolTipNCEVT from "../../../../../components/common/ToolTipNCEVT";
import CustomTable from "../../../../../../components/common/CustomTableForNCEVT";
import { ROLESPERMISSIONS } from "../../../../../../config/constants/projectConstant";
import { authSelector, setUserInfo } from "../../../../../../redux/slicers/authSlice";

const ClientBasedJobRoleTable = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { clientListWithJobRole = [] } = useSelector(dashboardSelector);
  const [clientListData, setClientListData] = useState([]);
  const { userInfo = {} } = useSelector(authSelector);

  const navigate = useNavigate();
  const MAX_LENGTH_FOR_TOOLTIP = 13;

  //   const {LOG_MANAGEMENT_FEATURE,LOG_MANAGEMENT_LIST_FEATURE_1, LOG_MANAGEMENT_LIST_FEATURE_2, JOB_ROLE_MANAGEMENT_FEATURE, JOB_ROLE_MANAGEMENT_LIST_FEATURE}=ROLESPERMISSIONS;
  // const userRole = setUserInfo?.userRole;
  // const featureName = JOB_ROLE_MANAGEMENT_FEATURE;
  // const roleType = userRoleType(userRole, featureName);
  // console.log("roleType",userRole)
  // const subFeatureName = JOB_ROLE_MANAGEMENT_LIST_FEATURE;
  // const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const { JOB_ROLE_MANAGEMENT_FEATURE, JOB_ROLE_MANAGEMENT_LIST_FEATURE } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = JOB_ROLE_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = JOB_ROLE_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  console.log("isRolePermission", isRolePermission);

  // const subFeatureNameActivity=LOG_MANAGEMENT_LIST_FEATURE_2;
  // const isRolePermissionActivity=getSubRole(roleType?.subFeatures, subFeatureNameActivity);

  const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#ffffff",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 1000,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
        paddingLeft: 0,
      },
    }),
  );

  const getClientBasedJobRoleData = useCallback(() => {
    dispatch(getAllJobRoleDashboard(setLoading));
  }, [dispatch]);

  useEffect(() => {
    getClientBasedJobRoleData();
  }, []);

  // const getClientBasedJobRole = useCallback(() => {
  //   dispatch(getAllJobRoles(setLoading, Infinity, Infinity, "", 1));
  // },[]);

  // useEffect(() => {
  //   getClientBasedJobRole();
  // }, []);

  useEffect(() => {
    // if(clientListWithJobRole.length>0){
    setClientListData(clientListData);
    // }
  }, [clientListWithJobRole]);

  const handleViewJobRole = useCallback(
    (e, job) => {
      e.preventDefault();
      const path = `${BDA_CLIENT_WISE_VIEW_JOB_ROLE_PAGE}/${job._id}/${job.clientId.clientname}`;
      navigate(path);
    },
    [navigate],
  );

  // Table
  const headerColumns = useMemo(() => {
    return [
      {
        name: "clientcode",
        label: "CLIENT CODE",
        sorting: false,
        selector: (row) => (
          <div className="username-cell">
            <Avatar
              sx={{
                width: 35,
                height: 35,
                border: "1px solid #ccc",
                marginBottom: "5px",
                marginTop: "5px",
              }}
              variant="rounded"
              alt={"some-alt"}
              src={(row?.url && row.url) || "https://www.ficsi.in/public/front/images/favicon.png"}
            />
            <div style={{ marginBottom: "5px", marginTop: "5px" }}>
              <h2>{(row?.clientCode && row.clientCode) || "-"}</h2>
              <p>{(row?.clientemail && row.clientemail) || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        name: "fullClientName",
        label: "FULLCLIENTNAME",
        sorting: false,
        selector: (row) => {
          return row?.clientname && row.clientname.length > MAX_LENGTH_FOR_TOOLTIP ? (
            toolTip(row?.clientname && row.clientname)
          ) : (
            <div>{(row?.clientname && row.clientname) || "-"}</div>
          );
        },
      },
      {
        name: "noOfJobRole",
        label: "NO OF JOBROLE",
        sorting: false,
        selector: (row) => {
          const jobRoleCount = row?.jobRoleByClient.length;
          return <div className="jobrole-chip">JobRole ({jobRoleCount > 0 ? jobRoleCount : "0"})</div>;
        },
      },
    ];
  }, []);

  const table = useMemo(() => {
    return {
      isPermission: true,
      headerColumn: headerColumns,
      bodyData: clientListWithJobRole,
      isCheckBox: false,
      // selectedCheckBoxs: checkedRows,
      canDeleteAllSelectedBox: false,
    };
  }, [clientListWithJobRole, headerColumns]);

  const handleAchortagcolor = () => {
    if (isRolePermission?.permissions?.["1"]) {
      return "#2F80ED";
    } else {
      return "#d6d3d3";
    }
  };

  const handleClickJobRoleNavigate = (e) => {
    e.preventDefault();
    if (isRolePermission?.permissions?.["1"]) {
      // return () => {
      navigate(BDA_JOB_ROLE_PAGE);
      // }
    } else {
      // return -1
    }
  };

  return (
    <div className="ClientListTable">
      <div className="ClientBasedJobRoleTitle">
        <h1
          style={{
            lineHeight: "19.36px",
            fontSize: "large",
            fontWeight: "bold",
          }}>
          Client based jobrole
        </h1>
        {/* {isRolePermission?.permissions?.["1"] &&  */}
        <a
          // onClick={() => {
          //   navigate(BDA_JOB_ROLE_PAGE);
          // }}
          onClick={(e) => handleClickJobRoleNavigate(e)}
          aria-disabled="true"
          style={{
            fontSize: "small",
            fontWeight: "bold",
            color: handleAchortagcolor(),
            cursor: isRolePermission?.permissions?.["1"] ? "pointer" : "not-allowed",
          }}>
          View all
        </a>
        {/* } */}
      </div>

      <hr></hr>
      <CustomTable table={table} loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default memo(ClientBasedJobRoleTable);
