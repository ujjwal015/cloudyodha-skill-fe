import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST } from "../../../../config/constants/routePathConstants/superAdmin";

import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../../assets/icons/search-icon.svg";
import { SyncLoader } from "react-spinners";
import { getExamManagementBatchListApi } from "../../../../api/superAdminApi/examManagement";
import { examManagementSelector } from "../../../../redux/slicers/superAdmin/examManagementSlice";

import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import CustomTablePagination from "../../../../components/common/customPagination";
import { TableHeader } from "../../../../components/common/table";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { authSelector } from "../../../../redux/slicers/authSlice";

const BatchList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { examManagementbatchList = [] } = useSelector(examManagementSelector);

  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setStatusLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { userInfo = {} } = useSelector(authSelector);

  // permission
  const { EXAM_MANAGEMENT_FEATURE, EXAM_MANAGEMENT_SUB_FEATURE_2 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = EXAM_MANAGEMENT_SUB_FEATURE_2;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = (search = true) => {
    setLoading(true);
    dispatch(
      getExamManagementBatchListApi(
        setLoading,
        page,
        limit,
        search ? searchQuery : "",
        setTotalPages,
        setLoading,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        'online'
      )
    );
    // setPage(pageNum);
  };
  useEffect(() => {
    getList();
  }, [page, limit]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(
      getExamManagementBatchListApi(
        setLoading,
        nxtPage,
        limit,
        searchQuery,
        setTotalPages,
        setLoading,
        setStatusLoading
      )
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getExamManagementBatchListApi(
        setLoading,
        1,
        limit,
        searchQuery,
        setTotalPages,
        setStatusLoading
      )
    );
    setLimit(parseInt(event.target.value, 10));
    // setPage(1);
  };

  useEffect(() => {
    setSortedData(examManagementbatchList);
  }, [examManagementbatchList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...examManagementbatchList].sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc"
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          } else {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
          }
        });
        setSortedData(sortedData);
      }
    };

    sortData();
  }, [examManagementbatchList, sortOrders]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value == "") {
      getList(false);
    }
    setSearchQuery(value);
  };
  const handleSearch = () => {
    if (searchQuery !== "")
      dispatch(
        getExamManagementBatchListApi(
          setLoading,
          1,
          limit,
          searchQuery,
          setTotalPages,
          setStatusLoading
        )
      );
    // setPage(1);
  };

  const exportBatchData = () => {
    const exportData = examManagementbatchList?.map((item) => {
      return {
        batchId: item?.batchId,
        batchName: item?.batchName,
        clientId: item?.clientname || "N/A",
        scheme: item?.schemeName || "N/A",
        subSchemeName: item?.subSchemeName || "N/A",
        batchStartDate: item?.startDate,
        batchEndDate: item?.endDate,
        jobRole: item?.jobRoleNames ?? "N/A",
        assessmentDate: item?.assessmentDate,
        batchSize: item?.batchSize,
        batchMode: item?.batchMode,
        assessorName: item?.assessorName || "N/A",
        batchProctoring: item?.batchProctoring,
      };
    });
    return exportData;
  };
  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportBatchData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Activity Log List.xlsx");
  };

  const handleNavigateAcitivityLogs = (sipId, id) => {
    const safeSipID = encodeURIComponent(sipId);
    navigate(`${LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST}/${id}/${safeSipID}`);
  };
  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        getList();
      }, 500);

      return () => clearTimeout(getData);
    }
  }, [searchQuery]);
  const MAX_LENGTH_FOR_TOOLTIP = 10;

  return (
    <div className="main-content exam-management-batch-list">
      <div className="title">
        <div className="title-text">
          <h1>Activity Logs</h1>
        </div>
      </div>

      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search"
              value={searchQuery}
              style={{ background: "#F8F8F8", padding: "2px" }}
              onChange={handleChange}
              onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "#231F20", width: 15 }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="subadmin-btn">
            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={loading ? undefined : handleExport}
              >
                {loading ? "loading..." : "Export"}
              </button>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <TableHeader
              columns={getColumns(isRolePermission)}
              sortOrders={sortOrders}
              setSortOrders={setSortOrders}
            />
            {loading ? (
              <tbody>
                <tr className="table-loading-wrapper">
                  <div className="sync-loader-wrapper">
                    <SyncLoader color="#2ea8db" />
                  </div>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr key={item?._id}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>
                        {item?.batchId?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.batchId || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.batchId || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.batchId || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.clientname.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.clientname || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.clientname || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.clientname || "NA"}</div>
                        )}
                      </td>
                      <td>           

                        {(item?.jobRoleNames &&
                          (Array.isArray(item.jobRoleNames) ? (
                            item.jobRoleNames.join(", ").length >
                            MAX_LENGTH_FOR_TOOLTIP ? (
                              <Tooltip
                                title={
                                  <ul
                                    style={{ margin: 0, paddingLeft: "20px" }}
                                  >
                                    {item.jobRoleNames.map((role, index) => (
                                      <li key={index}>{role}</li>
                                    ))}
                                  </ul>
                                }
                                arrow
                              >
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {item.jobRoleNames.join(", ")}
                                </div>
                              </Tooltip>
                            ) : (
                              <div>{item.jobRoleNames.join(", ")}</div>
                            )
                          ) : item.jobRoleNames.length >
                            MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip title={item.jobRoleNames} arrow>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "200px",
                                }}
                              >
                                {item.jobRoleNames}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item.jobRoleNames}</div>
                          ))) || <div>NA</div>}
                       
                      </td>
                      <td>{item?.startDate || "N/A"}</td>
                      <td>{item?.endDate || "N/A"}</td>

                      <td>
                        <div className="assesment-stats-btn">
                          <button
                            className="table-green-btn"
                            onClick={() =>
                              handleNavigateAcitivityLogs(
                                item?.batchId,
                                item?._id
                              )
                            }
                          >
                            <span>View Activity Logs</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>
                      <p>No Activity Log Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {sortedData && sortedData?.length > 0 && (
        <CustomTablePagination
          count={totalPages}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};

export default BatchList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "SNO." },
    { name: "batchId", label: "BATCH SIP ID" },
    { name: "clientId", label: "CLIENT NAME" },
    { name: "jobRole", label: "JOB ROLE" },
    { name: "batchStartDate", label: "BATCH START DATE" },
    { name: "batchEndDate", label: "BATCH END DATE" },
    // { name: "assessmentDate", label: "ASSESSMENT DATE" },
    { name: "activityLogs", label: "Activity Logs" },
  ];
  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns?.filter((column) => column?.name !== "status");
  }
  if (
    !isRolePermission?.permissions?.["3"] &&
    !isRolePermission?.permissions?.["4"]
  ) {
    columns = columns?.filter((column) => column?.name !== "actions");
  }
  return columns;
};

const getExportColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "SNO." },
    { name: "batchId", label: "BATCH SIP ID" },
    { name: "batchSize", label: "BATCH SIZE" },
    { name: "startDate", label: "BATCH START DATE" },
    { name: "endDate", label: "BATCH END DATE" },
    { name: "examCenterId", label: "EXAM CENTER ID" },
    { name: "schemeId", label: "SCHEME ID" },
    { name: "subSchemeId", label: "SUB-SCHEME ID" },
    { name: "batchMode", label: "BATCH MODE" },
    // { name: "assessmentDate", label: "ASSESSMENT DATE" },
    { name: "report_id", label: "REPORT ID" },
    { name: "assignAssessorProctor", label: "ASSIGN ASSESSOR PROCTOR" },
    { name: "jobRole", label: "JOB ROLE" },
    { name: "clientId", label: "CLIENT ID" },
    { name: "status", label: "STATUS" },
    { name: "candidateAssigned", label: "CANDIDATE ASSIGNED" },
  ];

  return columns;
};
