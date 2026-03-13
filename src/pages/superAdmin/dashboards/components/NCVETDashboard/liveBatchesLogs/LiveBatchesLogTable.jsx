import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import CustomTable from "../../../../../../components/common/CustomTableForNCEVT";

import { getDemoUserListApi } from "../../../../../../api/authApi";

import { useDispatch, useSelector } from "react-redux";
import { getSubRole, navigate, toolTip, userRoleType } from "../../../../../../utils/projectHelper";

import { Avatar } from "@mui/material";
import { getLiveBatchesLogs } from "../../../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../../../redux/slicers/admin/dashboardSlice";
import {
  LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST,
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH,
} from "../../../../../../config/constants/routePathConstants/superAdmin";
import { ROLESPERMISSIONS } from "../../../../../../config/constants/projectConstant";
import { authSelector, setUserInfo } from "../../../../../../redux/slicers/authSlice";

const LiveBatchesLogTable = ({ clientId }) => {
  const { userInfo = {} } = useSelector(authSelector);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(null);
  const { liveBatchLogs = [] } = useSelector(dashboardSelector);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [resultCounts, setResultCounts] = useState(0);

  const MAX_LENGTH_FOR_TOOLTIP = 13;

  const getClientList = useCallback(() => {
    dispatch(getLiveBatchesLogs(setLoading, page, limit, setTotalPages, setResultCounts, clientId));
  }, [dispatch, limit, page, clientId]);

  useEffect(() => {
    getClientList();
  }, [page, limit, clientId]);

  const handleProtoceringLog = useCallback((job) => {
    const isViewEnabled = isRolePermission?.permissions?.["1"] === true;
    if (isViewEnabled) {
      navigate(`${LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH}/${job._id}`);
    }
  }, []);

  const handleStyle = useCallback((batchMode) => {
    if (batchMode === "online") {
      return {
        backgroundColor: "rgba(236, 249, 242, 1)",
        color: "rgba(64, 191, 127, 1)",
        border: "1px solid rgba(64, 191, 127, 1)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: "15px",
        padding: "6px",
      };
    } else if (batchMode === "offline") {
      return {
        backgroundColor: "rgba(255, 227, 223, 1)",
        color: "rgba(255, 99, 78, 1)",
        border: "1px solid rgba(255, 99, 78, 1)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: "15px",
        padding: "6px",
      };
    }
  }, []);

  const handleActivityLog = useCallback((job) => {
    const isViewEnabled = isRolePermissionActivity?.permissions?.["1"] === true;
    if (isViewEnabled) {
      navigate(`${LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST}/${job._id}/${job.batchId}`);
    }
  }, []);

  //permission
  const { LOG_MANAGEMENT_FEATURE, LOG_MANAGEMENT_LIST_FEATURE_1, LOG_MANAGEMENT_LIST_FEATURE_2 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = LOG_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = LOG_MANAGEMENT_LIST_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const subFeatureNameActivity = LOG_MANAGEMENT_LIST_FEATURE_2;
  const isRolePermissionActivity = getSubRole(roleType?.subFeatures, subFeatureNameActivity);

  console.log("isRolePermissionActivity", isRolePermissionActivity);

  console.log("isRolePermission", isRolePermission);

  const headerColumns = useMemo(() => {
    return [
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
              src={"https://www.ficsi.in/public/front/images/favicon.png"}
            />
            <div>
              <h2>{row.clientId.clientcode || "-"}</h2>
              <p>{row?.clientId.email || "-"}</p>
            </div>
          </div>
        ),
      },
      {
        name: "clientname",
        label: "CLIENT NAME",
        sorting: false,
        selector: (row) => {
          return row?.clientId.clientname.length > MAX_LENGTH_FOR_TOOLTIP ? (
            toolTip(row?.clientId.clientname)
          ) : (
            <div>{(row?.clientId && row.clientId.clientname) || "-"}</div>
          );
        },
      },
      {
        name: "batchId",
        label: "BATCH ID(SIP)",
        sorting: false,
        selector: (row) => row.batchId || "N/A",
      },
      {
        name: "jobRole",
        label: "JOBROLE",
        sorting: false,
        selector: (row) => (row.jobRole && row.jobRole.jobRole) || "N/A",
      },
      {
        name: "batchSize",
        label: "BATCH SIZE",
        sorting: false,
        selector: (row) => row.batchSize || "N/A",
      },
      {
        name: "batchMode",
        label: "BATCH MODE",
        sorting: false,
        selector: (row) => <div style={handleStyle(row.batchMode)}>{row.batchMode || "NA"}</div>,
      },

      //permission
      {
        name: "proctoringLog",
        label: "PROTORING LOG",
        sorting: false,
        selector: (row) => (
          <div className="view-btn" onClick={() => handleProtoceringLog(row)}>
            View
          </div>
        ),
      },
      {
        name: "activityLog",
        label: "ACTIVITY LOG",
        sorting: false,
        selector: (row) => (
          <div className="view-btn" onClick={() => handleActivityLog(row)}>
            View
          </div>
        ),
      },
    ];
  }, []);

  const table = useMemo(() => {
    return {
      isPermission: true,
      headerColumn: headerColumns,
      bodyData: liveBatchLogs,
      isCheckBox: false,
    };
  }, [headerColumns, liveBatchLogs]);

  const handleChangePage = useCallback((e, nxtPage) => {
    setLoading(true);
    setPage(nxtPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  }, []);

  const pagination = useMemo(() => {
    return {
      isPagination: true,
      count: totalPages, //resultCounts
      totalPages: totalPages,
      page: page,
      limit: limit,
      setTotalPages: setTotalPages,
      onPageChange: handleChangePage,
      onRowsPerPageChange: handleChangeRowsPerPage,
    };
  }, [handleChangePage, handleChangeRowsPerPage, limit, page, totalPages]);

  const handleSearchSubmit = useCallback(() => {
    getClientList();
  }, [getClientList]);

  const search = useMemo(() => {
    return {
      searchTitle: <h3 style={{ fontSize: "large", fontWeight: "bold", marginRight: "20px" }}>Live Batches Logs</h3>,
      isPermissions: {},
      isSearch: false,
      searchQuery: searchQuery,
      setSearchQuery: setSearchQuery,
      endAdornment: true,
      apiHandler: getDemoUserListApi,
      handleSearchSubmit: handleSearchSubmit,
      isPermissions: {},
      isDisable: false,
    };
  }, [handleSearchSubmit, searchQuery]);

  return (
    <div className="ClientListTable">
      <div className="ClientListTable__body">
        <CustomTable table={table} loading={loading} setLoading={setLoading} pagination={pagination} search={search} />
      </div>
    </div>
  );
};

export default memo(LiveBatchesLogTable);
