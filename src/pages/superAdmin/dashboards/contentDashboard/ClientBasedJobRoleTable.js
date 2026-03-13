import React, { useEffect, useState } from "react";
import CustomTable from "../../../../components/common/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { getSubRole, navigate, toolTip, userRoleType } from "../../../../utils/projectHelper";
import { Avatar } from "@mui/material";
import { getClientListsApi, getClientWithJobRoleApi } from "../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";
import { BDA_JOB_ROLE_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { authSelector } from "../../../../redux/slicers/authSlice";

const ClientBasedJobRoleTable = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const { jobRolesListAll = {} } = useSelector(clientManagementSelector);
  const { clientLists = [], clientwithJobRoleList = [] } = useSelector(dashboardSelector);
  const { userInfo = {} } = useSelector(authSelector);

  const { JOB_ROLE_MANAGEMENT_FEATURE, JOB_ROLE_MANAGEMENT_LIST_FEATURE } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = JOB_ROLE_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = JOB_ROLE_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [resultCounts, setResultCounts] = useState();

  const MAX_LENGTH_FOR_TOOLTIP = 13;

  const getClientList = () => {
    dispatch(getClientListsApi(setLoading, page, limit, setTotalPages, setResultCounts));
    dispatch(getClientWithJobRoleApi(setLoading, page, limit, setTotalPages, setResultCounts));
  };
  useEffect(() => {
    getClientList();
  }, [page, limit]);

  const handleViewJobRole = (job) => {
    console.log("item", job);
  };

  const headerColumns = [
    {
      name: "clientcode",
      label: "CLIENT CODE",
      sorting: false,
      selector: (row) => (
        <div className="username-cell">
          <Avatar
            sx={{ width: 35, height: 35, border: "1px solid #ccc" }}
            variant="rounded"
            alt={"some-alt"}
            src={row?.webpage || "https://www.ficsi.in/public/front/images/favicon.png"}
          />
          <div>
            <h2>{row?.clientcode || "-"}</h2>
            <p>{row?.email || "-"}</p>
          </div>
        </div>
      ),
    },
    {
      name: "clientname",
      label: "CLIENT NAME",
      sorting: false,
      selector: (row) => {
        return row?.clientname?.length > MAX_LENGTH_FOR_TOOLTIP ? (
          toolTip(row?.clientname)
        ) : (
          <div>{row?.clientname || "-"}</div>
        );
      },
    },

    {
      name: "noOfJobRole",
      label: "NO OF JOBROLE",
      sorting: false,
      selector: (row) => (
        <div className="view-btn" onClick={() => handleViewJobRole(row)}>{`Job Role (${
          row?.jobRoleArray?.length || 0
        })`}</div>
      ),
    },
  ];

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
      navigate(BDA_JOB_ROLE_PAGE);
    }
  };

  const table = {
    isPermission: true,
    headerColumn: headerColumns,
    bodyData: clientwithJobRoleList.slice(0, 6),
    isCheckBox: false,
    canDeleteAllSelectedBox: false,
  };

  return (
    <div className="ClientsJobRole">
      <div className="chart-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Clients Based Jobrole</h2>
        <button
          onClick={handleClickJobRoleNavigate}
          style={{
            fontSize: "small",
            fontWeight: "bold",
            color: handleAchortagcolor(),
            cursor: isRolePermission?.permissions?.["1"] ? "pointer" : "not-allowed",
          }}>
          View All
        </button>
      </div>
      <CustomTable table={table} loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default ClientBasedJobRoleTable;
