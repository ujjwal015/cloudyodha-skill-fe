import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import {
  NOS_WISE_OFFLINE_RESULTS_MAIN_TABLE,
  OFFLINE_RESULTS_STATS,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "../../../../../assets/icons/search-icon-grey.svg";
import { Button, InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import {
  deleteSingleQbFormApi,
  getAllNosListApi,
} from "../../../../../api/superAdminApi/questionBank";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";
import {
  getMasterDownloadSheetApi,
  getNOSWiseOfflineResultApi,
} from "../../../../../api/superAdminApi/misResults";
import { misResultsSelector } from "../../../../../redux/slicers/superAdmin/misResults";
import { ReactComponent as ArrowLeft } from "./../../../../../assets/icons/chevron-left.svg";

const UserManagementList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [section, setSection] = useState();
  const [exportLoading, setExportLoading] = useState(false);

  // tabs
  const [candidateTable, setCandidateTable] = useState(true);
  const { userInfo = {} } = useSelector(authSelector);
  const { NOSWiseOfflineBatchDetails = [] } = useSelector(misResultsSelector);

  // permission
  const { RESULTS_FEATURE, RESULTS_SUB_FEATURE_1 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = RESULTS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = RESULTS_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const params = useParams();

  const getList = () => {
    dispatch(
      getNOSWiseOfflineResultApi(
        setLoading,
        params.id,
        page,
        searchQuery,
        limit,
        setTotalPages
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    getList();
  }, [page, limit, section]);

  useEffect(() => {
    setSortedData(
      NOSWiseOfflineBatchDetails.length > 0 ? NOSWiseOfflineBatchDetails : []
    );
    setTotalPagesUser(totalPages);
  }, [NOSWiseOfflineBatchDetails, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...NOSWiseOfflineBatchDetails].sort((a, b) => {
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
  }, [NOSWiseOfflineBatchDetails, sortOrders]);

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
        getNOSWiseOfflineResultApi(
          setLoading,
          params.id,
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
        getNOSWiseOfflineResultApi(
          setLoading,
          params.id,
          page,
          "",
          limit,
          setTotalPages
        )
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
    const exportData = NOSWiseOfflineBatchDetails?.map((item) => {
      return {
        username: item?.userName,
        name: item?.candidateName,
        candidateId: item?.candidateId,
        obtainedTotalTheoryMarks: item?.obtainedTotalTheoryMarks,
        obtainedTotalPracticalMarks: item?.obtainedTotalPracticalMarks,
        obtainedTotalVivaMarks: item?.obtainedTotalVivaMarks,
        obtainedGrandTotalMarks: item?.obtainedGrandTotalMarks,
        percentage: item?.percentage,
        grade: item?.grade,
        result: item?.result,
      };
    });
    return exportData;
  };
  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportClientData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${NOSWiseOfflineBatchDetails[0]?.batchId || "Batch"} Results.xlsx`
    );

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(
      blob,
      `${NOSWiseOfflineBatchDetails[0]?.batchId || "Batch"} Results.xlsx`
    );
  };

  const confirmDelete = () => {
    const len = NOSWiseOfflineBatchDetails?.length;
    dispatch(
      deleteSingleQbFormApi(setLoading, actionId, len, getList, setDeleteModal)
    );
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };

  const handleDownloadAllData = () => {
    setExportLoading(true);
    dispatch(
      getMasterDownloadSheetApi(
        setExportLoading,
        params.id,
        "offline",
        NOSWiseOfflineBatchDetails[0]?.batchId
      )
    );
  };

  const MAX_LENGTH_FOR_TOOLTIP = 13;

  return (
    <div className="main-content">
      <div className="title">
        <div className="back_button_wrapper">
          <ArrowLeft onClick={() => navigate(-1)} />
          <h1>NOS Wise Offline Results</h1>
        </div>
      </div>

      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search by Name"
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
            <div className="single_export_wrapper">
              {isRolePermission?.permissions?.["5"] && (
                <>
                  <button
                    className="export-btn"
                    onClick={
                      loading || sortedData?.length == 0
                        ? undefined
                        : handleExport
                    }
                  >
                    {loading ? (
                      <ClipLoader size={14} color="#24273" />
                    ) : (
                      "Export"
                    )}
                  </button>

                  <button
                    className="export-btn"
                    onClick={() => handleDownloadAllData()}
                  >
                    {exportLoading ? (
                      <ClipLoader size={14} color="#24273" />
                    ) : (
                      "Master Export"
                    )}
                  </button>
                </>
              )}
            </div>
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
                    <tr key={index} className="main_row">
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>
                        {item?.userName?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.userName || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.userName || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.userName || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.candidateName?.length >
                        MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.candidateName || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "150px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.candidateName || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.candidateName || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.candidateId?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.candidateId || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.candidateId || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.candidateId || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.obtainedTotalTheoryMarks &&
                        item?.totalTheoryMarks
                          ? item?.obtainedTotalTheoryMarks +
                            "/" +
                            item?.totalTheoryMarks
                          : "-"}
                      </td>

                      <td>
                        {item?.obtainedTotalPracticalMarks &&
                        item?.totalPracticalMarks
                          ? item?.obtainedTotalPracticalMarks +
                            "/" +
                            item?.totalPracticalMarks
                          : "-"}
                      </td>
                      <td>
                        {item?.obtainedTotalVivaMarks && item?.totalVivaMarks
                          ? item?.obtainedTotalVivaMarks +
                            "/" +
                            item?.totalVivaMarks
                          : "-"}
                      </td>
                      <td>
                        {item?.obtainedGrandTotalMarks && item?.grandTotalMarks
                          ? item?.obtainedGrandTotalMarks +
                            "/" +
                            item?.grandTotalMarks
                          : "-"}
                      </td>
                      <td>{item?.percentage || "NA"}</td>
                      <td>{item?.grade || "-"}</td>
                      <td>{item?.result || "NA"}</td>
                      <td>
                        {
                          <Button
                            sx={{
                              textTransform: "none",
                            }}
                            onClick={(e) =>
                              navigate(
                                `${NOS_WISE_OFFLINE_RESULTS_MAIN_TABLE}/${params?.id}/${item?.candidate_mongo_id}`
                              )
                            }
                          >
                            View Details
                          </Button>
                        }
                      </td>
                      <td>
                        {
                          <Button
                            sx={{
                              textTransform: "none",
                            }}
                            onClick={(e) =>
                              navigate(
                                `${OFFLINE_RESULTS_STATS}/${params?.id}/${item?.candidate_mongo_id}`
                              )
                            }
                          >
                            View Stats
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
      <DeleteModal
        title="Delete Question Bank Form"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
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

export default UserManagementList;

const getColumns = () => {
  let columns = [
    { name: "_id", label: "S.No." },
    { name: "username", label: "Username" },
    { name: "name", label: "Name" },
    { name: "candidateID", label: "Candidate ID (SIP)" },
    { name: "obtainedTotalTheoryMarks", label: "Theory Marks" },
    { name: "obtainedTotalPracticalMarks", label: "Practical Marks" },
    { name: "obtainedTotalVivaMarks", label: "Viva Marks" },
    { name: "obtainedGrandTotalMarks", label: "Total Marks" },
    { name: "percentage", label: "Percentage" },
    { name: "grade", label: "Grade" },
    { name: "result", label: "Result" },
    { name: "NOS", label: "NOS Results" },
    { name: "resultStats", label: "Result Stats" },
  ];
  return columns;
};
