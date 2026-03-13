import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { FAILED_CANDIDATE_LIST_PAGE } from "../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../components/common/customPagination";
import { ClipLoader, PropagateLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "../../../assets/icons/search-icon-grey.svg";
import { Button, InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { authSelector } from "../../../redux/slicers/authSlice";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import { getResultsByBatchApi } from "../../../api/superAdminApi/misResults";
import { misResultsSelector } from "../../../redux/slicers/superAdmin/misResults";

const RegenerateResult = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [section, setSection] = useState("Result");

  // tabs
  const { userInfo = {} } = useSelector(authSelector);
  const { resultsList = [] } = useSelector(misResultsSelector);

  // permission
  const { RESULTS_FEATURE, RESULTS_SUB_FEATURE_1 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = RESULTS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = RESULTS_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = () => {
    setLoading(true);
    dispatch(
      getResultsByBatchApi(setLoading, page, searchQuery, limit, setTotalPages)
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit, section]);

  useEffect(() => {
    setSortedData(resultsList);
    setTotalPagesUser(totalPages);
  }, [resultsList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...resultsList].sort((a, b) => {
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
  }, [resultsList, sortOrders]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "") {
      setLoading(true);
      dispatch(
        getResultsByBatchApi(
          setLoading,
          page,
          searchQuery,
          limit,
          setTotalPages
        )
      );
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setLoading(true);
      dispatch(
        getResultsByBatchApi(setLoading, page, "", limit, setTotalPages)
      );
    }
    setSearchQuery(value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };
  const exportClientData = () => {
    const exportData = resultsList?.map((item) => {
      return {
        batchId: item?.batchId,
        assessorName: item?.accessorName,
        jobRole: item?.jobRole,
        batchSize: item?.batchSize,
        assessmentStartDate: item?.assessmentStartDate,
        assessmentEndDate: item?.assessmentEndDate,
      };
    });
    return exportData;
  };
  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportClientData(), getColumnsExports())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "First Console List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "First Console List.xlsx");
  };

  const MAX_LENGTH_FOR_TOOLTIP = 10;
  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        getList();
      }, 500);

      return () => clearTimeout(getData);
    }
  }, [searchQuery]);

  return (
    <div className="main-content">
      <div className="title" style={{ display: "block" }}>
        <h1>First Console</h1>
        <div className="title-btn" style={{ paddingTop: "10px" }}></div>
      </div>
      {
        <>
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
                <button
                  className="export-btn"
                  onClick={
                    loading || sortedData?.length == 0
                      ? undefined
                      : handleExport
                  }
                >
                  {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
                </button>
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
                      <td className="sync-loader-wrapper">
                        <PropagateLoader color="#2ea8db" />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {sortedData?.length > 0 ? (
                      sortedData?.map((item, index) => (
                        <tr key={item?._id} className="main_row">
                          <td>{(page - 1) * limit + (index + 1)}</td>
                          <td>
                            {item?.batchId?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                              <Tooltip title={item?.batchId || "-"} arrow>
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                    maxWidth: "100px", // Set a maximum width for the cell
                                  }}
                                >
                                  {item?.batchId || "-"}
                                </div>
                              </Tooltip>
                            ) : (
                              <div>{item?.batchId || "-"}</div>
                            )}
                          </td>

                          <td>
                            {item?.jobRole?.length > MAX_LENGTH_FOR_TOOLTIP ||
                            item?.isMultiJobRole ? (
                              <Tooltip
                                title={
                                  <pre style={{ margin: 0 }}>
                                    {item?.isMultiJobRole
                                      ? item?.jobRoleList
                                          ?.map(
                                            (jobrole) =>
                                              jobrole?.jobRoleId?.jobRole
                                          )
                                          ?.join(",  \n")
                                      : item?.jobRole || "NA"}
                                  </pre>
                                }
                                arrow
                              >
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                    maxWidth: "100px", // Set a maximum width for the cell
                                  }}
                                >
                                  {item?.isMultiJobRole
                                    ? item?.jobRoleList?.[0]?.jobRoleId
                                        ?.jobRole +
                                      ` +${item?.jobRoleList?.length - 1}`
                                    : item?.jobRole || "NA"}
                                </div>
                              </Tooltip>
                            ) : (
                              <div>{item?.jobRole || "NA"}</div>
                            )}
                          </td>
                          <td>{item?.assessmentStartDate || "-"}</td>
                          <td>{item?.assessmentEndDate || "-"}</td>
                          <td>{item?.passedPercentage || "-"}</td>

                          <td>{item?.failedCandidate || "-"}</td>
                          <td>{item?.resultRegenerated || "-"}</td>

                          <td>
                            {item?.accessorName?.length >
                            MAX_LENGTH_FOR_TOOLTIP ? (
                              <Tooltip title={item?.accessorName || "-"} arrow>
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                    maxWidth: "100px", // Set a maximum width for the cell
                                  }}
                                >
                                  {item?.accessorName || "-"}
                                </div>
                              </Tooltip>
                            ) : (
                              <div>{item?.accessorName || "-"}</div>
                            )}
                          </td>
                          <td>
                            {
                              <Button
                                sx={{
                                  textTransform: "none",
                                }}
                                onClick={(e) =>
                                  navigate(
                                    `${FAILED_CANDIDATE_LIST_PAGE}/${item?._id}`
                                  )
                                }
                              >
                                View Details
                              </Button>
                            }
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="no-list-table">
                        <td>
                          <p>No Results Found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </>
      }

      <div
        style={{
          display: [totalPages > 0 ? "" : "none"],
        }}
      >
        <CustomTablePagination
          count={totalPagesUser}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default RegenerateResult;

const getColumnsExports = () => {
  let columns = [
    { name: "batchId", label: "Batch SIP ID" },
    { name: "assessorName", label: "Assigned Assessor" },
    { name: "jobRole", label: "Job Role" },
    { name: "assessmentStartDate", label: "Assessment Start Date" },
    { name: "assessmentEndDate", label: "Assessment End Date" },
    { name: "passingPercentage", label: "Passing %" },
    { name: "failedCandidates", label: "Failed Candidate" },
    { name: "processed", label: "Processed " },
    { name: "failedCandidates", label: "Failed Candidate" },
  ];
  return columns;
};
const getColumns = () => {
  let columns = [
    { name: "_id", label: "S.No." },
    { name: "batch", label: "Batch SIP ID" },
    { name: "jobRole", label: "Job Role" },
    { name: "examDate", label: "Assessment Start Date" },
    { name: "examDate", label: "Assessment End Date" },
    { name: "passingPercentage", label: "Passing %" },
    { name: "failedCandidates", label: "Failed Candidate" },
    { name: "processed", label: "Processed " },
    { name: "assessorName", label: "Assigned Assessor" },
    { name: "viewCandidates", label: "View Candidates" },
  ];
  return columns;
};
