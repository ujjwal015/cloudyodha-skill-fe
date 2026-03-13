import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./style.css";
import {
  SUPER_ADMIN_ASSIGN_BATCH,
  SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { FormSwitch, RadioButton } from "../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import { Button, Checkbox, Dialog, Tooltip } from "@mui/material";
import {
  exportData,
  getSubRole,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../components/common/DropDown";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../redux/slicers/authSlice";

import {
  deleteCandidateApi,
  disableFaceRecognitionApi,
  downloadBulkUploadCandidateApi,
  getCandidateByBatchId,
  getExportsCandidateDetailApi,
  getExportsCandidateDetailsApi,
  getLoginTokenApi,
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

import { ReactComponent as CloseIcon } from "../../../../assets/icons/close-icon.svg";
import { ReactComponent as ExcelIcon } from "../../../../assets/icons/excel_icon.svg";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete_Icon.svg";
import { clientType } from "../batch/data";
import UploadFiles from "./UploadFilesComponent";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomTable from "../../../../components/common/CustomTable";
import { STUDENT_TOKEN_LOGIN_PAGE } from "../../../../config/constants/routePathConstants/student";
import { ArrowLeft } from "@mui/icons-material";
import { ReactComponent as PlusIcon } from "../../../../assets/images/pages/clientManagement/plus-icon.svg";

const exportInitialValues = {
  selectAll: false,
  candidateList: false,
  attendanceList: false,
  practicalAndVive: false,
  links: false,
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
  { name: "fatherName", label: "Father Name" },
  { name: "mobile", label: "Mobile No" },
  { name: "email", label: "Email ID" },
  { name: "aadharNumber", label: "Aadhar ID" },
  { name: "rawPassword", label: "Password" },
  { name: "attendance", label: "Attendance" },
  // { name: "organisationType", label: "Organization Type" },
  { name: "status", label: "Status" },
  { name: "faceMatchStatus", label: "Face Match Status" },
];

const CandidateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState({
    excel: false,
    pdf: false,
  });

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
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [statusLoading, setStatusLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [loadingTokenId, setLoadingTokenId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [allChecked, setAllChecked] = useState(false);
  const [candidateIds, setCandidateIds] = useState({
    candidateIds: [],
    status: null,
  });
  const [checkedRows, setCheckedRows] = useState([]);
  const [ableToDelete, setAbleToDelete] = useState([]);
  const [singleCandidateData, setSingleCandidateData] = useState({});

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

  const getList = useCallback(
    (setStatusBtnLoading) => {
      const setLoad = setStatusBtnLoading ? setStatusBtnLoading : setLoading;
      dispatch(
        getCandidateByBatchId(
          batchId,
          setLoad,
          page,
          limit,
          setTotalPages,
          searchQuery
        )
      );
    },
    [batchId, page, limit, searchQuery, dispatch]
  );

  useEffect(() => {
    if (searchQuery) {
      const handler = setTimeout(() => {
        getList();
      }, 2000);
      return () => clearTimeout(handler);
    } else {
      getList();
    }
  }, [searchQuery, getList]);

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
    setActionId(id);
    const formData = {
      status: value,
    };

    if (candidateIds?.candidateIds?.length > 0) {
      const bulkFormData = {
        candidateIds: candidateIds.candidateIds,
        status: value,
      };

      dispatch(
        updateCandidateStatusApi(
          candidateIds?.candidateIds,
          bulkFormData,
          setLoading,
          getList,
          setAbleToDelete
        )
      );

      return false;
    }

    dispatch(
      updateCandidateStatusApi(
        id,
        formData,
        setLoading,
        getList,
        setAbleToDelete
      )
    );
  };

  const handleChangePage = (e, nxtPage) => {
    setLoading(true);
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const exportClientData = () => {
    if (!exportCandaiteList?.candidateList?.length > 0) {
      return false;
    }
    const response = exportCandaiteList;

    // check if select all is true then return all data
    // else return selected data
    // check if canidateList is true then return candidateList
    // check if attendanceList is true then return attendanceList
    // check if practicalAndVive is true then return practicalAndVive
    const { candidateList, attendanceList, practicalAndVive, links } =
      exportFormValues;
    let result = [];

    if (links) {
      columnExport = [
        ...columnExport,
        { name: "urlEncodedLink", label: "Link" },
      ];

      const candidateDetailsList = response?.candidateList?.map((item) => {
        return (
          {
            ...item,
            batchId: item?.batchId?.batchId,
            status: item?.status ? "Active" : "Inactive",
            urlEncodedLink: item?.urlEncodedLink,
          } || []
        );
      });

      result = [...result, ...candidateDetailsList];
    }

    if (candidateList) {
      const candidateDetailsList = response?.candidateList?.map((item) => {
        return (
          {
            ...item,
            batchId: item?.batchId?.batchId,
            links: links ? item?.urlEncodedLink : null,
            status: item?.status ? "Active" : "Inactive",
            faceMatchStatus: item?.faceRecognition?.adminApproved
              ? "Approved By Admin"
              : item?.faceMatchStatus,
          } || []
        );
      });

      result = [...result, ...candidateDetailsList];
    }
    if (attendanceList) {
      result = response.attendanceList.map((item) => {
        return {
          ...item,
          status: item?.status ? "Active" : "Inactive",
        };
      });
    }

    if (practicalAndVive) {
      columnExport = [
        ...columnExport,
        ...response.practicalAndVive.nosList.map((nos, index) => ({
          name: `nos${index + 1}`,
          label: nos?.split(".")?.[0],
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
    setLoading(true);
    dispatch(
      deleteCandidateApi(
        setLoading,
        actionId,
        setDeleteModal,
        getList,
        sortedData?.length,
        navigate,
        ableToDelete,
        setAbleToDelete,
        setCandidateIds,
        setCheckedRows,
        setAllChecked
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
    dispatch(reassignCandidateApi(candidateId, setLoading));
  };

  const disableFaceRecognitionHandler = (candidateId) => {
    dispatch(disableFaceRecognitionApi(candidateId, setLoading, getList));
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
  const resetHandler = (row) => {
    setResetModal(true);
    setActionOpen(false);
    setCandidateId(row._id);
    setSingleCandidateData(row);
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
        links: fieldValue,
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
      links: exportFormValues?.links,
    };
    if (Object.values(formData).some((item) => item === true)) {
      setExportLoading((prev) => ({
        ...prev,
        excel: true,
      }));
      dispatch(
        getExportsCandidateDetailApi(
          batchId,
          formData,
          setExportLoading,
          setExportFormValues,
          exportInitialValues,
          setIsExportOpen
        )
      );
    }
  };
  const handleExportPDF = async (e) => {
    setExportType("pdf");
    const formData = {
      candidateList: exportFormValues?.candidateList,
      attendanceList: exportFormValues?.attendanceList,
      practicalAndVive: exportFormValues?.practicalAndVive,
      links: exportFormValues?.links,
    };
    if (Object.values(formData).some((item) => item === true)) {
      setExportLoading((prev) => ({
        ...prev,
        pdf: true,
      }));
      dispatch(
        getExportsCandidateDetailsApi(
          batchId,
          formData,
          setExportLoading,
          setExportFormValues,
          exportInitialValues,
          setIsExportOpen
        )
      );
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
      }
      // else {
      //   console.log("Export data is null or undefined.");
      // }
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

  // new table start from here

  const Tooltips = (value) => {
    if (!value) return "-";
    return value.length > 10 ? (
      <Tooltip title={value}>
        <span>{value.slice(0, 10) + "..."}</span>
      </Tooltip>
    ) : (
      value
    );
  };

  const batchMode = sortedData?.find((item) => {
    return item?.batchMode === "offline";
  })?.batchMode;

  const columns = () => {
    return [
      {
        name: "checkBox",
        label:
          // isPermission
          //   isRolePermission?.permissions?.["5"] && (
          true && (
            <Checkbox
              checked={allChecked}
              onChange={handleAllCheckedChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          ),
        sorting: false,
        selector: (row) => {
          const isChecked = checkedRows?.some((item) => item?._id === row._id);
          return (
            // isPermission
            // isRolePermission?.permissions?.["5"] && (
            true && (
              <Checkbox
                key={row._id}
                checked={checkedRows?.some((r) => r._id === row._id)}
                onChange={() => handleCheckedChange(row)}
                inputProps={{ "aria-label": "controlled" }}
                // disabled={!row?.status}
              />
            )
          );
        },
      },
      {
        name: "batchId",
        label: "Batch ID",
        sorting: false,
        selector: (row) => Tooltips(row?.batchId),
      },
      {
        name: "userName",
        label: "User Name",
        sorting: false,
        selector: (row) => Tooltips(row?.userName),
      },
      {
        name: "candidateId",
        label: "candidate Id",
        sorting: false,
        selector: (row) => (
          <span style={{ color: "#007bff", cursor: "pointer" }}>
            {Tooltips(row?.candidateId)}
          </span>
        ),
      },
      {
        name: "name",
        label: "Name",
        sorting: false,
        selector: (row) => Tooltips(row?.name),
      },
      batchMode !== "offline"
        ? {
            name: "fatherName",
            label: "Father Name",
            sorting: false,
            selector: (row) => Tooltips(row?.fatherName),
          }
        : null,
      {
        name: "mobile",
        label: "MOBILE NUMBER",
        sorting: false,
        selector: (row) => Tooltips(row?.mobile),
      },
      {
        name: "email",
        label: "EMAIL ADDRESS",
        sorting: false,
        selector: (row) => Tooltips(row?.email),
      },

      // {
      //   name: "organisationType",
      //   label: "Organization Type",
      //   sorting: false,
      //   selector: (row) => Tooltips(row?.organisationType),
      // },
      batchMode !== "offline"
        ? {
            name: "faceMatchStatus",
            label: "Face Match Status",
            sorting: false,
            selector: (row) => {
              const faceMatch = row?.faceMatchStatus || "Not Attempted";
              const isAdminApproved =
                !!row?.disabledFaceRecognition?.adminApproved;

              const styles = {
                Matched: {
                  label: "Matched",
                  bgColor: "#d4edda",
                  textColor: "#155724",
                },
                "Not Matched": {
                  label: "Not Matched",
                  bgColor: "#f8d7da",
                  textColor: "#721c24",
                },
                "Not Attempted": {
                  label: "Not Attempted",
                  bgColor: "#fff3cd",
                  textColor: "#856404",
                },
                "Approved By Admin": {
                  label: "Approved By Admin",
                  bgColor: "#d1ecf1",
                  textColor: "#0c5460",
                },
              };

              const finalLabel = isAdminApproved
                ? "Approved By Admin"
                : faceMatch;
              const { label, bgColor, textColor } =
                styles[finalLabel] || styles["Not Attempted"];

              return (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      padding: "4px 6px",
                      fontSize: "12px",
                      borderRadius: "4px",
                      backgroundColor: bgColor,
                      color: textColor,
                      border: "none",
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            },
          }
        : null,
      {
        name: "status",
        label: "STATUS",
        sorting: false,
        selector: (row, index) => {
          return (
            isRolePermission?.permissions?.["6"] && (
              <>
                {statusLoading && actionId === row._id ? (
                  <PulseLoader size="10px" color="#0bbbfe" />
                ) : (
                  <FormSwitch
                    value={row?.status ? true : false}
                    onChange={(e) => handleStatusChange(e, row?._id)}
                    disabled={
                      candidateIds?.candidateIds?.length > 0 &&
                      candidateIds?.candidateIds?.[0] !== row?._id
                    }
                  />
                )}
              </>
            )
          );
        },
      },
      {
        name: "action",
        label: "ACTIONS",
        sorting: false,
        selector: (row) => (
          <div className="action-btn">
            <ActionDropdown
              actionOpen={actionOpen}
              setActionOpen={setActionOpen}
              deleteHandler={deleteHandler}
              showDeleteButton={deletePermitted}
              editBtnHandler={editBtnHandler}
              MoreBtnHandler={MoreBtnHandler}
              id={row._id}
              actionId={actionId}
              featureName={featureName}
              subFeatureName={subFeatureName}
              isCustomized={true}
              candidateStatus={row?.status}
              customOptions={
                row?.batchMode === "offline"
                  ? [
                      {
                        text: "Edit Profile",
                        icon: <EditIcon />,
                        handler: () =>
                          navigate(
                            `${SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE}/${batchId}/${row._id}`
                          ),
                      },
                      !row?.status
                        ? {
                            text: "Delete",
                            icon: <DeleteIcon />,
                            handler: () => deleteHandler(),
                          }
                        : null,
                      row?.isTestSubmitted
                        ? {
                            text: "Reassign Candidate",
                            icon: <RefreshIcon />,
                            handler: () => reassignHandler(row._id),
                          }
                        : null,
                    ]
                  : [
                      {
                        text: "Edit Profile",
                        icon: <EditIcon />,
                        handler: () =>
                          navigate(
                            `${SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE}/${batchId}/${row._id}`
                          ),
                      },
                      {
                        text: "Reset Password",
                        icon: <ResetPassword />,
                        handler: () => resetHandler(row),
                      },
                      {
                        text: "Increase Exam Time",
                        icon: <Clock />,
                        handler: () => increaseTimeHandler(row._id),
                      },
                      {
                        text: "Refresh",
                        icon: <RefreshIcon />,
                        handler: () => handleLoginCountRefresh(row._id),
                      },
                      {
                        text: "Logout",
                        icon: <LogOutIcon />,
                        handler: () => handleCandidateLogout(row._id),
                      },
                      !row?.status
                        ? {
                            text: "Delete",
                            icon: <DeleteIcon />,
                            handler: () => deleteHandler(),
                          }
                        : null,

                      row?.isTestSubmitted
                        ? {
                            text: "Reassign Candidate",
                            icon: <RefreshIcon />,
                            handler: () => reassignHandler(row._id),
                          }
                        : null,

                      row?.faceRecognition &&
                      !["Matched"]?.includes(row?.faceMatchStatus) &&
                      !row?.disabledFaceRecognition?.adminApproved
                        ? {
                            text: "Disable Face Recognition",
                            icon: <RefreshIcon />,
                            handler: () =>
                              disableFaceRecognitionHandler(row._id),
                          }
                        : null,
                    ]
              }
            />
          </div>
        ),
      },
    ]?.filter(Boolean);
  };

  const exportDataList = () => {
    return [
      {
        name: "export",
        isPermission: true,
        label: "Export",
        isDisable: false,
        handleExport: (e) => handleExport(e),
      },
    ];
  };

  const exportDataOptions = {
    loading: loading,
    setLoading: setLoading,
    isPermissions: {
      1: isRolePermission?.permissions?.["1"],
      5: isRolePermission?.permissions?.["5"],
    },
    isExport: isRolePermission?.permissions?.["5"],
    exportDataList: exportDataList(),
  };

  const deleteMultipleData = {
    isMultiDelete: ableToDelete?.length > 0,
    selectedRows: ableToDelete?.length,
    deletehandler: deleteHandler,
    icon: <DeleteIcon />,
  };

  const handleAllCheckedChange = () => {
    const baseStatus = sortedData[0]?.status ?? null;

    if (allChecked) {
      setCheckedRows([]);
      setCandidateIds({ candidateIds: [], status: null });
      setAbleToDelete([]); // Clear
      setAllChecked(false);
    } else {
      const allRows = [...sortedData];
      setCheckedRows(allRows);
      setAllChecked(true);

      const matchingStatusIds = allRows
        ?.filter((row) => row?.status === baseStatus)
        ?.map((row) => row?._id);

      const inactiveIds = allRows
        ?.filter((row) => row?.status === false)
        ?.map((row) => row?._id);

      setCandidateIds({
        candidateIds: matchingStatusIds,
        status: baseStatus,
      });

      setAbleToDelete(inactiveIds);
    }
  };

  const table = {
    isPermission: true,
    headerColumn: columns(isRolePermission),
    bodyData: sortedData,
    isCheckBox: true,
    selectedCheckBoxs: checkedRows,
    canDeleteAllSelectedBox: false,
  };

  const search = {
    searchTitle: "",
    isSearch: true,
    searchQuery: searchQuery,
    setSearchQuery: setSearchQuery,
    endAdornment: true,
    isPermission: true,
    isDisable: false,
  };

  const pagination = {
    isPagination: true,
    totalPages: totalPages,
    count: totalPages,
    page: page,
    limit: limit,
    setTotalPages: setTotalPages,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  };

  const handleCheckedChange = (row) => {
    setCheckedRows((prev) => {
      const isChecked = prev?.some((item) => item?._id === row?._id);
      let updatedRows;

      if (isChecked) {
        updatedRows = prev?.filter((item) => item?._id !== row?._id);
      } else {
        updatedRows = [...prev, row];
      }

      const baseStatus = updatedRows[0]?.status ?? null;

      const matchingStatusIds = updatedRows
        ?.filter((item) => item?.status === baseStatus)
        ?.map((item) => item?._id);

      const inactiveIds = updatedRows
        ?.filter((item) => item?.status === false)
        ?.map((item) => item?._id);

      setCandidateIds({
        candidateIds: matchingStatusIds,
        status: baseStatus,
      });

      setAbleToDelete(inactiveIds);

      setAllChecked(updatedRows?.length === sortedData?.length);

      return updatedRows;
    });
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
          <div className="table-wrapper">
            <CustomTable
              table={table}
              loading={loading}
              setLoading={setLoading}
              pagination={pagination}
              search={search}
              deleteMultipleData={deleteMultipleData}
              exportOptions={exportDataOptions}
            />
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

        {isExportOpen ? (
          <ExportModel
            anchorEl={isExportOpen}
            handleClose={handleCloseExport}
            changeHandler={exportHandler}
            formValues={exportFormValues}
            setIsFilterOpen={setIsExportOpen}
            handleExportExcel={handleExportExcel}
            handleExportPDF={handleExportPDF}
            loading={exportLoading}
          />
        ) : null}

        <DeleteModal
          title="Delete Candidate"
          content={`${
            ableToDelete?.length > 0
              ? `Are you sure you want to delete ${ableToDelete?.length} ${
                  ableToDelete?.length > 1 ? "candidate(s)" : "candidate"
                } ?`
              : "Are you sure you want to delete?"
          }`}
          confirmDelete={confirmDelete}
          open={deleteModal}
          handleCloseModal={handleCloseModal}
        />

        <ResetPasswordModal
          title="Reset Password"
          open={resetModal}
          handleClose={handleCloseResetModal}
          candidateId={candidateId}
          setResetModal={setResetModal}
          setActionOpen={setActionOpen}
          actionId={actionId}
          singleCandidateData={singleCandidateData}
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
