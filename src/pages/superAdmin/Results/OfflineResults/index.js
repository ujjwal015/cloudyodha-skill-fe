import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  NOS_WISE_OFFLINE_PAGE,
  NOS_WISE_RESULTS_PAGE,
  QUESTION_BANK_NOS,
  QUESTION_BANK_NOS_TABLE,
  QUESTION_BANK_NOS_UPLOAD,
  SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE,
  UPLOAD_OFFLINE_RESULTS,
  UPLOAD_OFFLINE_ANSWER_KEYS,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../components/common/table";
import { FormSwitch } from "../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "../../../../assets/icons/search-icon-grey.svg";
import { Button, InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../components/common/DropDown";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { qbManagementSelector } from "../../../../redux/slicers/superAdmin/questionBankSlice";
import {
  getQuestionFormListApi,
  changeSingleQbFormStatusApi,
  deleteSingleQbFormApi,
  getNOSListVivaPracticalApi,
  getAllNosListApi,
} from "../../../../api/superAdminApi/questionBank";
import FilterModal from "../../../../components/common/Modal/FilterModal";
import validateField from "../../../../utils/validateField";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { misResultsSelector } from "../../../../redux/slicers/superAdmin/misResults";
import {
  getOfflineResultsApi,
  getOfflineResultsByBatchApi,
  getResultsByBatchApi,
} from "../../../../api/superAdminApi/misResults";
import { getFeedbackApi } from "../../../../api/authApi";

const UserManagementList = () => {
  const initialFormValues = {
    F_status: "",
    from: "",
    to: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { nosList } = useSelector(qbManagementSelector);

  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("offlineResultsPage");
    return savedPage ? parseInt(savedPage) : 1;
  });

  const [limit, setLimit] = useState(() => {
    const savedLimit = localStorage.getItem("offlineResultsLimit");
    return savedLimit ? parseInt(savedLimit) : 50;
  });

  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionBtn, setActionBtn] = useState(null);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [section, setSection] = useState();

  const { userInfo = {} } = useSelector(authSelector);
  const { resultsList = [], offlineResults = [] } =
    useSelector(misResultsSelector);

  // permission
  const { RESULTS_FEATURE, RESULTS_SUB_FEATURE_2 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = RESULTS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = RESULTS_SUB_FEATURE_2;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = () => {
    setLoading(true);
    dispatch(
      getOfflineResultsApi(setLoading, page, searchQuery, limit, setTotalPages)
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit, section]);

  useEffect(() => {
    setSortedData(offlineResults);
    setTotalPagesUser(totalPages);
  }, [offlineResults, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...offlineResults].sort((a, b) => {
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
  }, [offlineResults.length, sortOrders]);

  useEffect(() => {
    return () => {
      localStorage.setItem("offlineResultsPage", page);
      localStorage.setItem("offlineResultsLimit", limit);
    };
  }, [page, limit]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    localStorage.setItem("offlineResultsPage", nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(1);
    localStorage.setItem("offlineResultsLimit", newLimit);
    localStorage.setItem("offlineResultsPage", 1);
  };

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "") {
      setLoading(true);
      dispatch(
        getOfflineResultsApi(
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
        getOfflineResultsApi(setLoading, page, "", limit, setTotalPages)
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
    const exportData = offlineResults?.map((item) => {
      return {
        clientName: item?.clientName,
        jobRole: item?.jobRole,
        qpCode: item?.qpCode,
        jobLevel: item?.jobLevel,
        nosName: item?.nos,
        version: item?.version,
        status: item?.status,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Question Form List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Offline Results.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = offlineResults?.length;
    dispatch(
      deleteSingleQbFormApi(setLoading, actionId, len, getList, setDeleteModal)
    );
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const editBtnHandler = () => {
    setShowActionBtn(false);
    // navigate(`${SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE}/${actionId}`);
  };
  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;

    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };
  const handleDateChange = (newDate, name) => {
    const formattedDate = newDate.format("YYYY-MM-DD");
    const fieldError = validateField(
      name,
      formattedDate,
      formValues?.startDate
    );
    setFormValues((pre) => ({ ...pre, [name]: formattedDate }));
    if (fieldError) {
      setErrors({ [name]: fieldError });
    } else {
      setErrors({});
    }
  };
  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const handleClose = () => {
    setIsFilterOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const from = formValues?.from;
      const to = formValues?.to;
      const status = formValues?.F_status;
      handleClose();
    }
  };
  const handleClearAll = () => {
    setFormValues(initialFormValues);
  };

  const handleSection = (data) => {
    setSection(data);
  };

  // Function to download Assessor & Training Partner feedback
  const handleFeedbackDownload = async (batchId, type) => {
    setLoading(true);
    try {
      await dispatch(getFeedbackApi(batchId, type));
    } catch (error) {
      console.error("Error downloading feedback:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="title">
        <h1>Offline Batch</h1>
      </div>

      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search by Batch ID"
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
          {/* <div className="subadmin-btn">
            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={
                  loading || sortedData?.length === 0 ? undefined : handleExport
                }
              >
                {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
              </button>
            )}
          </div> */}
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
                        {item?.clientName?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.clientName || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.clientName || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.clientName || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.jobRole?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.jobRole || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.jobRole || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.jobRole || "NA"}</div>
                        )}
                      </td>
                      <td>{item?.assessmentStartDate || "-"}</td>
                      <td>{item?.assessmentEndDate || "-"}</td>
                      <td>
                        {item?.accessorName?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.accessorName || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.accessorName || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.accessorName || "NA"}</div>
                        )}
                      </td>
                      {/* <td>{item?.accessorName || "NA"}</td> */}
                      <td>{item?.batchSize || "NA"}</td>
                      <td>
                        {`${item?.candidate_Appeared_In_Batch?.candidateAttended}/ ${item?.candidate_Appeared_In_Batch?.totalCandidates}` ||
                          "-"}
                      </td>
                      <td>
                        {
                          <Button
                            sx={{
                              textTransform: "none",
                            }}
                            onClick={(e) =>
                              navigate(`${NOS_WISE_OFFLINE_PAGE}/${item?._id}`)
                            }
                          >
                            View
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
                                `${UPLOAD_OFFLINE_ANSWER_KEYS}/${item?._id}/${
                                  item?.batchId
                                }/${`offline`}`
                              )
                            }
                          >
                            Upload
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
                                `${UPLOAD_OFFLINE_RESULTS}/${encodeURIComponent(
                                  item?._id
                                )}/${encodeURIComponent(
                                  item?.batchId
                                )}/${`offline`}`
                              )
                            }
                          >
                            Upload
                          </Button>
                        }
                      </td>
                      {/* New cells for downloading feedback */}
                      <td>
                        <Button
                          sx={{
                            textTransform: "none",
                            backgroundColor: item?.isAssessorSubmittedFeedback
                              ? "#1976d2"
                              : "#d3d3d3",
                            color: item?.isAssessorSubmittedFeedback
                              ? "white"
                              : "#666",
                            "&:hover": {
                              backgroundColor: item?.isAssessorSubmittedFeedback
                                ? "#1565c0"
                                : "#d3d3d3",
                            },
                          }}
                          disabled={!item?.isAssessorSubmittedFeedback}
                          onClick={() =>
                            handleFeedbackDownload(item?.batchId, "assessor")
                          }
                        >
                          Download Assessor Feedback
                        </Button>
                      </td>
                      <td>
                        <Button
                          sx={{
                            textTransform: "none",
                            backgroundColor:
                              item?.isTrainingPartnerSubmittedFeedback
                                ? "#1976d2"
                                : "#d3d3d3",
                            color: item?.isTrainingPartnerSubmittedFeedback
                              ? "white"
                              : "#666",
                            "&:hover": {
                              backgroundColor:
                                item?.isTrainingPartnerSubmittedFeedback
                                  ? "#1565c0"
                                  : "#d3d3d3",
                            },
                          }}
                          disabled={!item?.isTrainingPartnerSubmittedFeedback}
                          onClick={() =>
                            handleFeedbackDownload(
                              item?.batchId,
                              "trainingPartner"
                            )
                          }
                        >
                          Download TP Feedback
                        </Button>
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

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "S.No." },
    { name: "batch", label: "Batch SIP ID" },
    { name: "clientName", label: "Client Name" },
    { name: "jobRole", label: "Job Role" },
    { name: "endDate", label: "Assessment Start Date" },
    { name: "startData", label: "Assessment End Date" },
    { name: "assessorName", label: "Assessor Name" },
    { name: "batchSize", label: "Batch Size" },
    { name: "appearedCandidate", label: "Appeared Candidate" },
    { name: "nosResult", label: "NOS Result" },
    { name: "uploadAnswerKeys", label: "Answer Keys" },
    { name: "uploadResult", label: "Upload Result" },
    { name: "assessorFeedback", label: "Assessor Feedback" },
    { name: "tpFeedback", label: "TP Feedback" },
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
