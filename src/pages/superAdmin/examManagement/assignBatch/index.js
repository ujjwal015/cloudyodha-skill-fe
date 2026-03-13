import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../components/common/table";
import { RadioButton } from "../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadBulkUploadCandidateApi,
  getAssignCandidateBatchListApi,
  uploadBulkCandidateApi,
  exportAllAssignCandidateBatchListApi,
  downloadStudentAttendanceSheetApi,
  downloadStudentResultSheetApi,
} from "../../../../api/superAdminApi/examManagement";
import CustomTablePagination from "../../../../components/common/customPagination";
import { PropagateLoader, ClipLoader, PulseLoader } from "react-spinners";
import { Button, Dialog, TextField, Tooltip } from "@mui/material";
import {
  errorToast,
  exportData,
  getLocal,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/close-icon.svg";
import { ReactComponent as ExcelIcon } from "../../../../assets/icons/excel_icon.svg";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete_Icon.svg";

//modal
import validateField from "../../../../utils/validateField";
import { clientType } from "../batch/data";
import UploadFiles from "./UploadFilesComponent";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { examManagementSelector } from "../../../../redux/slicers/superAdmin/examManagementSlice";
import GetAppIcon from "@mui/icons-material/GetApp";

const initialFormValues = {
  type: "",
};
function POCModal({
  handleClose,
  formValues,
  setFormValues,
  errors,
  selectedFiles,
  setSelectedFiles,
  handleSave,
  setLoading,
  loading,
  setOpen,
  open,
  dispatch,
  singleBatchData = {},
}) {
  const deleteFilehandler = (se) => {
    const updateFile = selectedFiles?.filter(
      (select) => select.name !== se.name
    );
    setSelectedFiles(updateFile);
  };

  const handleDownloadSample = () => {
    dispatch(downloadBulkUploadCandidateApi(formValues?.type));
  };
  const handleUpload = () => {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="md"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className="assign-batch-dialog-modal"
      >
        <div className="assign-batch-upload-modal">
          <div className="assign-batch-header">
            <div className="assign-batch-upload-title">
              <h2>
                Upload Bulk Candidate &nbsp;
                {singleBatchData && (
                  <>
                    <span>({singleBatchData?.batchId})</span>
                  </>
                )}
              </h2>
              <p>Upload and attach files to this Batch.</p>
            </div>
            <div onClick={handleUpload} style={{ cursor: "pointer" }}>
              <span>
                <CloseIcon onClick={handleClose} />
              </span>
            </div>
          </div>
          <div>
            <RadioButton
              handleChange={handleChange}
              options={clientType}
              name="type"
              label="Select Client Type"
              value={formValues?.type}
              error={errors?.type}
              mandatory
            />
            <div>
              <div className="assign-batch-sample-btn">
                <Button
                  className={`outlined-btn back-btn`}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  onClick={handleDownloadSample}
                >
                  Download Sample
                </Button>
              </div>
            </div>
          </div>

          <div className="drop-file-container">
            {/* <div className="assign-batch-upload-file">  */}
            <div className="upload-files-container">
              <UploadFiles
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            </div>
            {/* </div>  */}
            <div className="assign-batch-downloaded-file">
              <div>
                <ul>
                  {selectedFiles?.map((sele, key) => {
                    return (
                      <li id={key} className="assign-batch-download-list">
                        <div>
                          <p className="assign-batch-download-items">
                            <ExcelIcon /> <span>{sele?.name}</span>
                          </p>
                        </div>
                        <div>
                          <DeleteIcon
                            onClick={() => deleteFilehandler(sele)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="assign-batch-note-section">
            <ul className="assign-batch-note-list">
              <li>
                <span>Note:</span> Don't remove the header row while uploading
                the data, as shown in sample file.
              </li>
              <li>
                Do not delete any column, if there is no corresponding data
                leave it empty.
              </li>
              <li>
                Upload the data in same sequence as in sample download file.
              </li>
              <li>Image question cannot be uploaded from excel.</li>
            </ul>
          </div>
          {/* <DialogActions sx={{ justifyContent: "center" }}> */}
          <section className="assign-batch-buttonsBox">
            <div className="assign-batch-action-btn">
              <Button
                className={`outlined-btn back-btn`}
                variant="outlined"
                onClick={() => {
                  setOpen(false);
                  setSelectedFiles();
                  // navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE);
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="assign-batch-action-btn">
              <Button
                className={`light-blue-btn  save-btn`}
                variant="contained"
                onClick={handleSave}
                disabled={loading && selectedFiles.length === 0 ? true : false}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "Save"}
              </Button>
            </div>
          </section>
          {/* </DialogActions> */}
        </div>
      </Dialog>
    </div>
  );
}

const AssignBatch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownLoadLoading] = useState(false);
  const [resultSheetDownloadLoading, setResultSheetDownLoadLoading] =
    useState(false);
  const [setStatusLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { examManagementbatchList = [] } = useSelector(examManagementSelector);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [spokeData, setSpokeData] = useState();
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [batchId, setBatchId] = useState("");
  const { userInfo = {} } = useSelector(authSelector);
  const selectedClient = getLocal("SelectedClient");
  const [masterExportLoading, setMasterExportLoading] = useState(false);
  const [singleBatchData, setSingleBatchData] = useState({});

  useEffect(() => {
    setSearchQuery(selectedClient);
  }, [selectedClient]);

  const { EXAM_MANAGEMENT_FEATURE, EXAM_MANAGEMENT_SUB_FEATURE_3 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = EXAM_MANAGEMENT_SUB_FEATURE_3;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  // modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = (data) => {
    setOpen(true);
    setSingleBatchData(data || {});
    setSpokeData(data?.spoke);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedFiles([]);
  };

  const getList = (setStatusBtnLoading, search = true) => {
    setLoading(true);
    dispatch(
      getAssignCandidateBatchListApi(
        setLoading,
        page,
        limit,
        search ? searchQuery : "",
        setTotalPages,
        setStatusBtnLoading
      )
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit]);

  useEffect(() => {
    setSortedData(examManagementbatchList);
    // setTotalPagesUser(totalPages);
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

  const handleChangePage = (e, nxtPage) => {
    setLoading(true);
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleChangeSearch = (e) => {
    const { value } = e.target;
    if (value == "") {
      setLoading(true);
      getList(null, false);
    }
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") setLoading(true);
    dispatch(
      getAssignCandidateBatchListApi(
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
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  const exportClientData = () => {
    const exportData = examManagementbatchList?.map((item) => {
      let jobRole;
      if (Array.isArray(item?.jobRoleNames)) {
        jobRole = item?.jobRoleNames?.join(", "); // Convert array to comma-separated string
      } else if (typeof item?.jobRoleNames === "string") {
        jobRole = item?.jobRoleNames;
      }

      return {
        batchSipId: item?.batchId,
        clientname: item?.clientname,
        jobRole: jobRole,
        scheme: item?.schemeName,
        webpage: item?.candidate_Appeared_In_Batch?.totalCandidates,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Assign Batch Management List.xlsx");
  };

  const handleAllExport = (batchbata, column, data, successCall) => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(batchbata(data), column())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Assign Batch List.xlsx");
    successCall();
  };

  const formatData = (data) => {
    const exportData = data?.map((item) => {
      let jobRole;
      if (Array.isArray(item?.jobRoleNames)) {
        jobRole = item?.jobRoleNames?.join(", ");
      } else if (typeof item?.jobRoleNames === "string") {
        jobRole = item?.jobRoleNames;
      }

      return {
        batchSipId: item?.batchId,
        clientName: item?.clientname,
        scheme: item?.schemeName,
        jobRole: jobRole, // Use processed jobRole
        webpage: item?.candidate_Appeared_In_Batch?.totalCandidates,
      };
    });

    return exportData;
  };

  const handleMasterExport = () => {
    setMasterExportLoading(true);
    dispatch(
      exportAllAssignCandidateBatchListApi(
        setMasterExportLoading,
        formatData,
        getColumns,
        handleAllExport
      )
    );
  };

  const handleSave = (e) => {
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
      const formData = new FormData();
      formData.append("uploadCandidate", selectedFiles[0]);
      dispatch(
        uploadBulkCandidateApi(
          batchId,
          formData,
          setLoading,
          page,
          limit,
          searchQuery,
          setTotalPages,
          setStatusLoading,
          setFormValues,
          handleClose,
          formValues?.type,
          getList
        )
      );
      // handleClose();
    }
  };

  const MAX_LENGTH_FOR_TOOLTIP = 13;
  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        getList();
      }, 500);

      return () => clearTimeout(getData);
    }
  }, [searchQuery]);

  const handleBreadCrumbClick = (event, path) => {
    event.preventDefault();
    path && navigate(`${path}`);
  };

  const breadCrumbsData = [
    {
      name: "Exam Management",
      isLink: false,
      key: "1",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "Assign Candidate",
      isLink: false,
      key: "2",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
  ];

  const handleDownloadAttendanceSheet = (item) => {
    setDownLoadLoading(true);
    setBatchId(item?._id);
    item?.candidate_Appeared_In_Batch?.totalCandidates > 0
      ? dispatch(
          downloadStudentAttendanceSheetApi(item?._id, setDownLoadLoading)
        )
      : errorToast("No candidates have appeared in this batch.");
  };
  const handleDownloadResultSheet = (item) => {
    setResultSheetDownLoadLoading(true);
    setBatchId(item?._id);
    item?.candidate_Appeared_In_Batch?.totalCandidates > 0
      ? dispatch(
          downloadStudentResultSheetApi(
            item?._id,
            setResultSheetDownLoadLoading
          )
        )
      : errorToast("No candidates have appeared in this batch.");
  };

  return (
    <div className="main-content">
      <div className="title">
        <h1>Assign Candidate</h1>
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
              onChange={handleChangeSearch}
              onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="subadmin-btn">
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
                  {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
                </button>

                <button
                  className="export-btn"
                  onClick={
                    loading || sortedData?.length == 0
                      ? undefined
                      : handleMasterExport
                  }
                >
                  {loading ? (
                    <ClipLoader size={14} color="#24273" />
                  ) : (
                    "Export All"
                  )}
                </button>
              </>
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
                  <td className="sync-loader-wrapper">
                    <PropagateLoader color="#2ea8db" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {sortedData?.length > 0 ? (
                  sortedData?.map((item, index) => (
                    <tr key={index}>
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
                        {item?.clientname?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.clientname || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.clientname || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.clientname || "-"}</div>
                        )}
                      </td>
                      <td>
                        {/* {item?.questionPaper?.isMultiJobRole ? (
                          item?.questionPaper?.multipleJobRole
                            ?.map((item) =>item?.jobRoleId?.jobRole)
                            ?.join("\n")?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={
                                // (item?.questionPaper?.multipleJobRole
                                //   ?.map((item) => item?.jobRoleId && getJobRoleById(item?.jobRoleId))
                                //   ?.join(",\n")) || "NA"
                                <ul>
                                  {item?.questionPaper?.multipleJobRole
                                    ?.map((item) => item?.jobRoleId?.jobRole)
                                    ?.map((val, index) => (
                                      <li key={index}>{`${
                                        index + 1
                                      }. ${val}`}</li>
                                    )) || "NA"}
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
                                  maxWidth: "100px",
                                }}
                              >
                                {item?.questionPaper?.multipleJobRole
                                  ?.map((item) => item?.jobRoleId?.jobRole)
                                  ?.join("\n") || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>
                              {item?.questionPaper?.multipleJobRole
                                ?.map((item) => item?.jobRoleId?.jobRole)
                                ?.join("\n") || "NA"}
                            </div>
                          )
                        ) : item?.jobRole?.jobRole?.length >
                          MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.jobRole?.jobRole || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.jobRole?.jobRole || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.jobRole?.jobRole || "NA"}</div>
                        )} */}

                        {/* {item?.jobRole?.jobRole?.length >
                        MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.jobRole?.jobRole || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.jobRole?.jobRole || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.jobRole?.jobRole || "-"}</div>
                        )} */}
                        {item?.isMultiJobRole ? (
                          // If multi-job role and it's an array
                          Array.isArray(item?.jobRoleNames) &&
                          item?.jobRoleNames?.join(", ")?.length >
                            MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={
                                <ul>
                                  {item?.jobRoleNames?.map((val, index) => (
                                    <li key={index}>{`${
                                      index + 1
                                    }. ${val}`}</li>
                                  )) || "NA"}
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
                                  maxWidth: "100px",
                                }}
                              >
                                {item?.jobRoleNames?.join(", ") || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>
                              {Array.isArray(item?.jobRoleNames)
                                ? item?.jobRoleNames?.join(", ")
                                : item?.jobRoleNames || "NA"}
                            </div>
                          )
                        ) : typeof item?.jobRoleNames === "string" &&
                          item?.jobRoleNames?.length >
                            MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.jobRoleNames || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px",
                              }}
                            >
                              {item?.jobRoleNames || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.jobRoleNames || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.schemeName?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.schemeName || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.schemeName || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.schemeName || "-"}</div>
                        )}
                      </td>

                      <td className="batch-actions">
                        {item?.candidate_Appeared_In_Batch?.totalCandidates >
                        0 ? (
                          <Button
                            style={{
                              color: "white",
                              fontFamily: "Poppins",
                              textTransform: "capitalize",
                              background: "#2EA8DB",
                            }}
                            onClick={(e) =>
                              navigate(
                                `${SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE}/${item?._id}`,
                                { state: item?.batchMode }
                              )
                            }
                          >
                            View &nbsp;
                            {item?.candidate_Appeared_In_Batch
                              ?.totalCandidates || 0}
                          </Button>
                        ) : (
                          <Button
                            sx={{
                              color: "white",
                              fontFamily: "Poppins",
                              background: "#04D375",
                              "&:hover": {
                                background: "#04D375",
                              },
                            }}
                            onClick={(e) => {
                              handleOpen(item);
                              setBatchId(item?._id);
                            }}
                          >
                            Assign
                          </Button>
                        )}
                      </td>

                      {downloadLoading && item?._id === batchId ? (
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "30px",
                          }}
                        >
                          <PulseLoader type="pulse" size="8px" />
                        </td>
                      ) : (
                        isRolePermission?.permissions?.["5"] && (
                          <td style={{ textAlign: "center" }}>
                            <GetAppIcon
                              sx={{ cursor: "pointer" }}
                              color={
                                item?.candidate_Appeared_In_Batch
                                  ?.totalCandidates > 0
                                  ? "primary"
                                  : "disabled"
                              }
                              onClick={() =>
                                handleDownloadAttendanceSheet(item)
                              }
                            />
                          </td>
                        )
                      )}
                      {resultSheetDownloadLoading && item?._id === batchId ? (
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "30px",
                          }}
                        >
                          <PulseLoader type="pulse" size="8px" />
                        </td>
                      ) : (
                        isRolePermission?.permissions?.["5"] && (
                          <td style={{ textAlign: "center" }}>
                            <GetAppIcon
                              sx={{ cursor: "pointer" }}
                              color={
                                item?.candidate_Appeared_In_Batch
                                  ?.totalCandidates > 0
                                  ? "primary"
                                  : "disabled"
                              }
                              onClick={() => handleDownloadResultSheet(item)}
                            />
                          </td>
                        )
                      )}
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

      {sortedData && sortedData?.length > 0 && (
        <div>
          <CustomTablePagination
            count={totalPages}
            page={page}
            limit={limit}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
      <POCModal
        data={setSpokeData}
        handleClose={handleClose}
        formValues={formValues}
        setFormValues={setFormValues}
        errors={errors}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        handleSave={handleSave}
        setLoading={setLoading}
        loading={loading}
        setOpen={setOpen}
        open={open}
        dispatch={dispatch}
        singleBatchData={singleBatchData}
      />
    </div>
  );
};

export default AssignBatch;

// Need to add roles and permission in feature -> isRolePermission
const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "S.NO" },
    { name: "batchSipId", label: "Batch SIP ID" },
    { name: "clientname", label: "Client Name" },
    { name: "jobRole", label: "Job Role" },
    { name: "scheme", label: "Scheme" },
    { name: "webpage", label: "Candidates" },
    isRolePermission?.permissions?.["5"] && {
      name: "attendanceSheet",
      label: " Attendance Sheet",
    },
    isRolePermission?.permissions?.["5"] && {
      name: "resultSheet",
      label: " Result Sheet",
    },
  ];

  return columns;
};
