import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./style.css";
import {
  SUPER_ADMIN_ASSIGN_BATCH,
  SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../components/common/table";
import { FormSwitch, RadioButton } from "../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import { deleteClientDetails } from "../../../../api/superAdminApi/clientManagement";
import CustomTablePagination from "../../../../components/common/customPagination";
import { PropagateLoader, ClipLoader, PulseLoader } from "react-spinners";
import { ReactComponent as ArrowLeft } from "../../../../assets/icons/chevron-left.svg";
import { Button, Dialog, TextField, Tooltip } from "@mui/material";
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

import {
  deleteCandidateApi,
  downloadBulkUploadCandidateApi,
  getCandidateByBatchId,
  getExportsCandidateDetailApi,
  mannualCandidateLogout,
  reassignCandidateApi,
  restoreCandidateLoginCount,
  updateCandidateStatusApi,
  uploadBulkCandidateApi,
} from "../../../../api/superAdminApi/examManagement";
import { examManagementSelector } from "../../../../redux/slicers/superAdmin/examManagementSlice";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { ReactComponent as EditIcon } from "../../../../assets/icons/edit-icon.svg";
import { ReactComponent as ResetPassword } from "../../../../assets/icons/reset-password-icon.svg";
import { ReactComponent as Clock } from "../../../../assets/icons/clock.svg";
import { ReactComponent as LogOutIcon } from "../../../../assets/icons/logOut.svg";

import ExportModel from "../../../../components/common/Modal/ExportModal";
import ResetPasswordModal from "../assignBatch/ResetPasswordModal";
import IncreaseExamTimeModal from "../assignBatch/IncreaseExamTimeModal";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { ReactComponent as PlusIcon } from "../../../../assets/images/pages/clientManagement/plus-icon.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/close-icon.svg";
import { ReactComponent as ExcelIcon } from "../../../../assets/icons/excel_icon.svg";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete_Icon.svg";
import { ReactComponent as Reassign } from "../../../../assets/icons/reassignicon.svg";
import { clientType } from "../batch/data";
import UploadFiles from "./UploadFilesComponent";
import validateField from "../../../../utils/validateField";
import RefreshIcon from "@mui/icons-material/Refresh";

const exportInitialValues = {
  selectAll: false,
  candidateList: false,
  attendanceList: false,
  practicalAndVive: false,
};

const initialFormValues = {
  type: "",
};

let columnExport = [
  { name: "_id", label: "S.NO" },
  { name: "batchId", label: "Batch ID" },
  { name: "userName", label: "Username" },
  { name: "candidateId", label: "Candidate ID" },
  { name: "name", label: "Candidate Name" },
  { name: "mobile", label: "Mobile No" },
  { name: "email", label: "Email ID" },
  { name: "aadharNumber", label: "Aadhar ID" },
  { name: "rawPassword", label: "Password" },
  { name: "attendance", label: "Attendance" },
];

const CandidateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { userInfo } = useSelector(authSelector);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePermitted] = useState(false);
  const [exportFormValues, setExportFormValues] = useState(exportInitialValues);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [increaseTimeModal, setIncreaseTimeModal] = useState(false);
  const [candidateId, setCandidateId] = useState();
  const [exportType, setExportType] = useState("excel");
  const [spokeData, setSpokeData] = useState();
  const [open, setOpen] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [setStatusLoading] = useState(false);

  const { batchId } = useParams();

  const { candiateByBatch = [], exportCandaiteList = [] } = useSelector(
    examManagementSelector
  );

  // Permission to allow edit and delete etc

  const { EXAM_MANAGEMENT_FEATURE, EXAM_MANAGEMENT_SUB_FEATURE_3 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = EXAM_MANAGEMENT_SUB_FEATURE_3;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const location = useLocation();
  const { state } = location;
  const [candidateType, setCandidateType] = useState("");

  const handleCloseExport = () => {
    setIsExportOpen(false);
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
  }) {
    const deleteFilehandler = (se) => {
      const updateFile = selectedFiles?.filter(
        (select) => select.name !== se.name
      );
      setSelectedFiles(updateFile);
    };

    const handleDownloadSample = (e) => {
      e.preventDefault();
      const formErrors = {};

      if (formValues?.type === "") formErrors["type"] = "Select Client Type";
      setErrors(formErrors);
      if (Object.keys(formErrors).length === 0) {
        dispatch(downloadBulkUploadCandidateApi(formValues?.type));
      }
    };
    const handleUpload = () => {};

    const handleChange = (e) => {
      e.preventDefault();
      const formErrors = {};
      setErrors(formErrors);
      if (Object.keys(formErrors).length === 0) {
      }
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
                <h2>Upload Bulk Candidate</h2>
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
                disabled={candidateType ? true : false}
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
              <div className="note_wrapper">
                <h2>
                  Note:{" "}
                  <span>
                    Please make sure to provide unique mobile number of each
                    candidate in sheet
                  </span>
                </h2>
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
                              <ExcelIcon />{" "}
                              {sele?.name.length > 20 ? (
                                <Tooltip title={sele?.name || "NA"} arrow>
                                  <div
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      cursor: "pointer",
                                      maxWidth: "200px", // Set a maximum width for the cell
                                    }}
                                  >
                                    {sele?.name || "NA"}
                                  </div>
                                </Tooltip>
                              ) : (
                                <span>{sele?.name}</span>
                              )}
                            </p>
                          </div>
                          <div>
                            <DeleteIcon
                              onClick={() => deleteFilehandler(sele)}
                              style={{ cursor: "pointer", width: "17px" }}
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
                <li>Image Question cannot be uploaded from excel.</li>
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
                  disabled={
                    loading && selectedFiles.length === 0 ? true : false
                  }
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

  const getList = (setStatusBtnLoading) => {
    const setLoad = setStatusBtnLoading ? setStatusBtnLoading : setLoading;
    dispatch(
      getCandidateByBatchId(
        batchId,
        setLoad,
        page,
        limit,
        searchQuery,
        setTotalPages
      )
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit]);

  useEffect(() => {
    setSortedData(candiateByBatch);
    if (candiateByBatch[0]?.candidateType) {
      setCandidateType(candiateByBatch[0]?.candidateType);
      setFormValues({ type: candiateByBatch[0]?.candidateType });
    }
  }, [candiateByBatch, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...candiateByBatch].sort((a, b) => {
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
  }, [candiateByBatch, sortOrders]);

  const handleStatusChange = (e, id) => {
    const { checked } = e.target;
    const value = checked ? true : false;
    const formData = {
      status: value,
    };
    dispatch(updateCandidateStatusApi(id, formData, setLoading, getList));
  };

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
      dispatch(
        getCandidateByBatchId(
          batchId,
          setLoading,
          page,
          limit,
          "",
          setTotalPages
        )
      );
    }
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") setLoading(true);
    dispatch(
      getCandidateByBatchId(
        batchId,
        setLoading,
        1,
        limit,
        searchQuery,
        setTotalPages
      )
    );
    setPage(1);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };
  const exportClientData = () => {
    const response = exportCandaiteList;

    // check if select all is true then return all data
    // else return selected data
    // check if canidateList is true then return candidateList
    // check if attendanceList is true then return attendanceList
    // check if practicalAndVive is true then return practicalAndVive
    const { candidateList, attendanceList, practicalAndVive } =
      exportFormValues;
    let result = [];
    if (candidateList) {
      const candidateDetailsList = response?.candidateList?.map((item) => {
        return { ...item, batchId: item?.batchId?.batchId };
      });

      result = [...result, ...candidateDetailsList];
    }
    if (attendanceList) {
      result = [...result, ...response.attendanceList];
    }

    if (practicalAndVive) {
      columnExport = [
        ...columnExport,
        ...response.practicalAndVive.nosList.map((nos, index) => ({
          name: `nos${index + 1}`,
          label: nos.split(".")?.[0],
        })),
      ];
      const emptyData = response.practicalAndVive.nosList.reduce(
        (obj, nos, index) => {
          obj[`nos${index + 1}`] = "";
          return obj;
        },
        {}
      );
      result = [
        ...result,
        ...response.practicalAndVive.candidateList,
        emptyData,
      ];
    }

    // Filter out duplicates based on a unique identifier field
    const uniqueIdentifier = "_id"; // Replace with your unique identifier field
    result = Object.values(
      result.reduce((acc, cur) => {
        acc[cur[uniqueIdentifier]] = cur;
        return acc;
      }, {})
    );

    return result;
  };

  const handleExport = () => {
    setIsExportOpen(true);
  };
  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    dispatch(
      deleteCandidateApi(
        setLoading,
        actionId,
        setDeleteModal,
        getList,
        sortedData.length,
        navigate
      )
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

  const reassignHandler = (candidateId) => {
    dispatch(
      reassignCandidateApi(        
        candidateId,
        setLoading,
      )
    );
  };

  const handleLoginCountRefresh = (candidateID) => {
    dispatch(restoreCandidateLoginCount(candidateID, setLoading));
  };

  const handleCandidateLogout = (candidateID) => {
    dispatch(mannualCandidateLogout(candidateID, setLoading));
  };

  const editBtnHandler = () => {
    navigate(
      `${SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE}/${actionId}`
    );
  };
  const resetHandler = (id) => {
    setResetModal(true);
    setActionOpen(false);
    setCandidateId(id);
  };

  const handleCloseResetModal = () => {
    setResetModal(false);
    setActionOpen(false);
  };
  const increaseTimeHandler = (id) => {
    setIncreaseTimeModal(true);
    setActionOpen(false);
    setCandidateId(id);
  };

  const handleCloseIncreaseTimeModal = () => {
    setIncreaseTimeModal(false);
    setActionOpen(false);
  };
  const exportHandler = (event) => {
    const { name, type, checked } = event.target;

    const fieldValue = type === "checkbox" ? checked : event.target.value;

    if (name === "selectAll") {
      setExportFormValues({
        selectAll: fieldValue,
        candidateList: fieldValue,
        attendanceList: fieldValue,
        practicalAndVive: fieldValue,
      });
    } else {
      setExportFormValues((prevState) => ({
        ...prevState,
        [name]: fieldValue,
      }));
    }
  };

  const handleExportExcel = (e) => {
    setExportType("excel");
    const formData = {
      candidateList: exportFormValues?.candidateList,
      attendanceList: exportFormValues?.attendanceList,
      practicalAndVive: exportFormValues?.practicalAndVive,
    };
    if (Object.values(formData).some((item) => item === true)) {
      dispatch(getExportsCandidateDetailApi(batchId, formData, setLoading));
    }
  };
  const handleExportPDF = (e) => {
    setExportType("pdf");
    const formData = {
      candidateList: exportFormValues?.candidateList,
      attendanceList: exportFormValues?.attendanceList,
      practicalAndVive: exportFormValues?.practicalAndVive,
    };
    if (Object.values(formData).some((item) => item === true)) {
      dispatch(getExportsCandidateDetailApi(batchId, formData, setLoading));
    }
  };

  useEffect(() => {
    const downloadFile = async () => {
      const data = exportData(exportClientData(), columnExport);
      if (data) {
        const tableHeaders = Object.keys(data[0] || {});
        if (tableHeaders.length > 0) {
          if (
            exportCandaiteList?.candidateList?.length > 0 ||
            exportCandaiteList?.practicalAndVive?.candidateList?.length > 0 ||
            exportCandaiteList?.attendanceList?.length > 0
          ) {
            if (exportType === "pdf") {
              // Create a new jsPDF instance
              const doc = new jsPDF();

              // Convert the data to a format that can be used by jsPDF AutoTable
              let tableData = data.map((row) => Object.values(row));
              const upData = {
                ...data[0],
                ...data[data.length - 1],
              };
              const updatedTableHeaders = Object.keys(upData || {});

              // If tableData is empty, set it to an array with a single empty array
              if (tableData.length === 0) {
                tableData = [[]];
              }

              doc?.autoTable({
                head: [updatedTableHeaders],
                body: tableData,
                didDrawPage: (data) => {
                  // Add a header and footer on each page
                  doc.text("Header", data.settings.margin.left, 10);
                  doc.text(
                    "Footer",
                    data.settings.margin.left,
                    doc.internal.pageSize.height - 10
                  );
                },
                styles: {
                  cellWidth: "auto",
                  minCellHeight: 15,
                  textColor: 20,
                  lineColor: "black",
                  lineWidth: 0.65,
                }, // Set textColor and lineColor to black, and add a lineWidth for grid lines
                headStyles: { fillColor: [221, 221, 221] }, // Set fillColor to a light gray for the header
                columnStyles: {
                  0: { cellWidth: "auto" }, // Specify cellWidth for each column as needed
                  // ...
                },
              });

              // Save the PDF
              doc.save("CandidateList.pdf");
            }

            if (exportType === "excel") {
              const workbook = XLSX.utils.book_new();
              const worksheet = XLSX.utils.json_to_sheet(data);
              // Add the worksheet to the workbook
              XLSX.utils.book_append_sheet(workbook, worksheet, "Table");
              // Convert the workbook to an array buffer
              const buffer = XLSX.write(workbook, { type: "array" });
              // Create a blob with the array buffer and trigger a download
              const blob = new Blob([buffer], {
                type: "application/octet-stream",
              });
              saveAs(blob, "Candidate List.xlsx");
            }
          }
        } else {
          // console.error("Table headers are empty.");
        }
      } else {
        console.error("Export data is null or undefined.");
      }
    };

    downloadFile();
  }, [exportCandaiteList]);

  const handleOpen = (data) => {
    setOpen(true);
    setSpokeData(data);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedFiles([]);
    // setFormValues({ ...initialFormValues });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formErrors = {};

    if (formValues?.type === "") formErrors["type"] = "Select Client Type";
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
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="title">
          <h1>
            <ArrowLeft onClick={() => navigate(SUPER_ADMIN_ASSIGN_BATCH)} />
            <span>Candidate List ({candidateType})</span>
          </h1>
          <div>
            <button
              onClick={(e) => {
                handleOpen();
              }}
            >
              <PlusIcon />
              <span>Add New</span>
            </button>
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
                onChange={handleChangeSearch}
                onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="subadmin-btn">
              <button
                className="export-btn"
                onClick={
                  loading || sortedData?.length == 0 ? undefined : handleExport
                }
              >
                {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
              </button>

              {isExportOpen ? (
                <ExportModel
                  handleClose={handleCloseExport}
                  changeHandler={exportHandler}
                  formValues={exportFormValues}
                  setFormValues={setExportFormValues}
                  handleExportExcel={handleExportExcel}
                  handleExportPDF={handleExportPDF}
                  showStatus={true}
                  showAssessorField
                />
              ) : null}
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <TableHeader
                columns={columns}
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
                        <td>{item?.batchId || "NA"}</td>
                        <td>{item?.userName || "NA"}</td>
                        <td>{item?.candidateId || "NA"}</td>
                        <td>{item?.name || "NA"}</td>
                        <td>{item?.mobile || "NA"}</td>
                        <td>{item?.email || "NA"}</td>
                        {/* <td>{item?.aadharNumber || "NA"}</td> */}
                        <td>{item?.schemeName || "NA"}</td>

                        <td style={{ textAlign: "center" }}>
                          <FormSwitch
                            value={item?.status}
                            onChange={(e) => handleStatusChange(e, item?._id)}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div className="action-btn">
                            <ActionDropdown
                              actionOpen={actionOpen}
                              setActionOpen={setActionOpen}
                              deleteHandler={deleteHandler}
                              showDeleteButton={deletePermitted}
                              editBtnHandler={editBtnHandler}
                              MoreBtnHandler={MoreBtnHandler}
                              id={item._id}
                              actionId={actionId}
                              featureName={featureName}
                              subFeatureName={subFeatureName}
                              isCustomized={true}
                              candidateStatus={item?.status}
                              customOptions={
                                item?.batchMode === "offline"
                                  ? [
                                      {
                                        text: "Edit Profile",
                                        icon: <EditIcon />,
                                        handler: () =>
                                          navigate(
                                            `${SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE}/${batchId}/${item._id}`
                                          ),
                                      },
                                      !item?.status
                                        ? {
                                            text: "Delete",
                                            icon: <DeleteIcon />,
                                            handler: () => deleteHandler(),
                                          }
                                        : null,
                                      item?.isTestSubmitted
                                        ? {
                                            text: "Reassign Candidate",
                                            icon: <RefreshIcon />,
                                            handler: () => reassignHandler(item._id),
                                          }
                                        : null,
                                    ]
                                  : [
                                      {
                                        text: "Edit Profile",
                                        icon: <EditIcon />,
                                        handler: () =>
                                          navigate(
                                            `${SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE}/${batchId}/${item._id}`
                                          ),
                                      },
                                      {
                                        text: "Reset Password",
                                        icon: <ResetPassword />,
                                        handler: () => resetHandler(item._id),
                                      },
                                      {
                                        text: "Increase Exam Time",
                                        icon: <Clock />,
                                        handler: () =>
                                          increaseTimeHandler(item._id),
                                      },
                                      {
                                        text: "Refresh",
                                        icon: <RefreshIcon />,
                                        handler: () =>
                                          handleLoginCountRefresh(item._id),
                                      },
                                      {
                                        text: "Logout",
                                        icon: <LogOutIcon />,
                                        handler: () =>
                                          handleCandidateLogout(item._id),
                                      },
                                      !item?.status
                                        ? {
                                            text: "Delete",
                                            icon: <DeleteIcon />,
                                            handler: () => deleteHandler(),
                                          }
                                        : null,

                                      item?.isTestSubmitted
                                        ? {
                                            text: "Reassign Candidate",
                                            icon: <RefreshIcon />,
                                            handler: () => reassignHandler(item._id),
                                          }
                                        : null,
                                    ]
                              }
                            />
                          </div>
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
        />

        <DeleteModal
          title="Delete Candidate"
          confirmDelete={confirmDelete}
          open={deleteModal}
          handleCloseModal={handleCloseModal}
        />
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

        <ResetPasswordModal
          title="Reset Password"
          open={resetModal}
          handleClose={handleCloseResetModal}
          candidateId={candidateId}
          setResetModal={setResetModal}
          setActionOpen={setActionOpen}
          actionId={actionId}
        />
        <IncreaseExamTimeModal
          title="Increase Exam Time"
          open={increaseTimeModal}
          handleClose={handleCloseIncreaseTimeModal}
          candidateId={candidateId}
          setIncreaseTimeModal={setIncreaseTimeModal}
          setActionOpen={setActionOpen}
          actionId={actionId}
        />
      </div>
    </>
  );
};

export default CandidateList;

const columns = [
  { name: "_id", label: "S.NO" },
  { name: "batchId", label: "Batch ID" },
  { name: "userName", label: "Username" },
  { name: "candidateId", label: "Candidate ID (SIP)" },
  { name: "name", label: "Candidate Name" },
  { name: "mobile", label: "Mobile No" },
  { name: "email", label: "Email ID" },
  // { name: "aadharNumber", label: "Aadhar ID" },
  { name: "organisationType", label: "Scheme" }, // No corresponding key in candidateList
  { name: "client_status", label: "STATUS" }, // No corresponding key in candidateList
  { name: "actions", label: "ACTIONS" }, // No corresponding key in candidateList
];
