import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CustomTable from "../../../../../components/common/CustomTableForNCEVT";

import { getDemoUserListApi } from "../../../../../api/authApi";

import { useDispatch, useSelector } from "react-redux";
import {
  getSubRole,
  navigate,
  toolTip,
  userRoleType,
} from "../../../../../utils/projectHelper";

import { Avatar } from "@mui/material";
import { getLiveBatchesLogs } from "../../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../../redux/slicers/admin/dashboardSlice";
import {
  LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST,
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import {
  dashboardConstants,
  ROLESPERMISSIONS,
  SECTORWISE_DROPDOWN,
} from "../../../../../config/constants/projectConstant";
import {
  authSelector,
  setUserInfo,
} from "../../../../../redux/slicers/authSlice";
import { getTableDataAPI } from "../../../../../api/superAdminApi/dashboard";
import { useInView } from "react-intersection-observer";
import RingLoaderCompoenent from "../../../../../components/common/RingLoader";
import TableSkeleton from "./skeleton";

const CommonTable = ({
  clientId = "",
  dashboardType = "",
  title = "",
  headerColumn = [],
  tableSpecificData = {},
  componentList = [],
  componentType = "Table",
  // isDropdownSelectRequired=false
  // selectInputDetails={}
}) => {
  const { userInfo = {} } = useSelector(authSelector);
  const {
    LOG_MANAGEMENT_FEATURE,
    LOG_MANAGEMENT_LIST_FEATURE_1,
    LOG_MANAGEMENT_LIST_FEATURE_2,
  } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = LOG_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = LOG_MANAGEMENT_LIST_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const subFeatureNameActivity = LOG_MANAGEMENT_LIST_FEATURE_2;
  const isRolePermissionActivity = getSubRole(
    roleType?.subFeatures,
    subFeatureNameActivity
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(null);
  const { liveBatchLogs = [] } = useSelector(dashboardSelector);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [resultCounts, setResultCounts] = useState(0);
  const [componentSpecificUrl, setComponentSpecificUrl] = useState("");
  const [commonTableData, setCommonTableData] = useState({});
  const [specificTableData, setSpecificTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("weekly");
  const { ref, inView } = useInView({ threshold: 0.5 });
  const prevTextRef = useRef(clientId)


  const updateCommonTableData = (data) => {
    // if(dlength>0){
    setCommonTableData(data);
    // }
  };
  useEffect(() => {
    // setSpecificTableData(commonTableData?.result);
    if (
      `${title} ${dashboardType}` ===
      dashboardConstants?.AssignedAssessorOperation
    ) {
      setSpecificTableData(
        commonTableData?.length > 0 ? commonTableData.slice(0, 6) : []
      );
      // setTotalPages(commonTableData?.totalPages);
      // setPage(commonTableData?.page);
    } else {
      setSpecificTableData(
        commonTableData?.result?.length > 0 ? commonTableData?.result : []
      );
      setTotalPages(commonTableData?.totalPages);
      setPage(commonTableData?.page);
    }
  }, [commonTableData]);

  const selectInputDetails = {
    currentOption: selectedOption,
    onClick: (e) => setSelectedOption(e.target.value),
    dropDownOptions: SECTORWISE_DROPDOWN,
    isDropdownSelectRequired: tableSpecificData?.isDropdownSelectRequired,
  };

  const getTableData = (url) => {
    setLoading(true);
    dispatch(
      getTableDataAPI(
        url,
        clientId,
        setLoading,
        updateCommonTableData,
        page,
        limit,
        searchQuery,
        selectedOption,
        tableSpecificData
      )
    );
  };

  const getTableDataWithQuery = () => {
    if (componentSpecificUrl) {
      setLoading(true);
      dispatch(
        getTableDataAPI(
          componentSpecificUrl,
          clientId,
          setLoading,
          updateCommonTableData,
          page,
          limit,
          searchQuery,
          selectedOption,
          tableSpecificData
        )
      );
    }
  };

  useEffect(() => {
    if (inView) {
      getTableDataWithQuery();
    }
  }, [page, limit, searchQuery, selectedOption]);

  useEffect(() => {
    if (componentList?.length > 0) {
      const element = componentList?.find(
        (item) =>
          `${item?.componentId?.component_name} ${item?.componentId?.component_category} ${item?.componentId?.component_type}` ===
          `${title} ${dashboardType} ${componentType}`
      );
      if (element) {
        setComponentSpecificUrl(element?.componentId?.endpoint);
      }
    }
  }, [componentList]);

 
  useEffect(() => {
    if (componentSpecificUrl && inView && (clientId !== prevTextRef.current)) {
      prevTextRef.current = clientId;
      setLoading(true);
      getTableDataWithQuery();
    }
    else if(componentSpecificUrl && inView && (clientId === "" && !Object.keys(commonTableData)?.length>0)){
      setLoading(true);
      getTableDataWithQuery();
    }
  }, [componentSpecificUrl, inView, clientId]);


  const handleProtoceringLog = useCallback((job) => {
    const isViewEnabled = isRolePermission?.permissions?.["1"] === true;
    if (isViewEnabled) {
      navigate(
        `${LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH}/${job._id}`
      );
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
      navigate(
        `${LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST}/${job._id}/${job.batchId}`
      );
    }
  }, []);

  //permission

  const DateFormatter = (date) => {
    const dateObject = new Date(date);
    return dateObject.toISOString().split("T")[0];
  };

  const tableData = {
    isPermission: true,
    headerColumn: headerColumn,
    bodyData: specificTableData,
    isCheckBox: false,
  };

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
      isPagination: tableSpecificData?.isPaginationRequired,
      count: totalPages, //resultCounts
      totalPages: totalPages,
      page: page,
      limit: limit,
      setTotalPages: setTotalPages,
      onPageChange: handleChangePage,
      onRowsPerPageChange: handleChangeRowsPerPage,
    };
  }, [handleChangePage, handleChangeRowsPerPage, limit, page, totalPages]);

  // const handleSearchSubmit = useCallback(() => {
  //   getClientList();
  // }, [getClientList]);

  const clientListsearch = useMemo(() => {
    return {
      searchTitle: (
        <h3 style={{ fontSize: "large", fontWeight: "bold" }}>
          <span>{tableSpecificData?.title}</span>
        </h3>
      ),
      isPermissions: {},
      isSearch: tableSpecificData?.isSearchRequired,
      searchQuery: searchQuery,
      setSearchQuery: setSearchQuery,
      endAdornment: true,
      apiHandler: getTableDataAPI,
      handleSearchSubmit: getTableDataWithQuery,
      isDisable: false,
    };
  }, [searchQuery]);

  return (
    <div ref={ref}>
      {loading ? (
        // <RingLoaderCompoenent />
        <TableSkeleton/>
      ) : (
        <div className="ClientListTable">
          <div className="ClientListTable__body">
            <CustomTable
              table={tableData}
              loading={loading}
              setLoading={setLoading}
              pagination={pagination}
              search={clientListsearch}
              selectInputDetails={selectInputDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonTable;
