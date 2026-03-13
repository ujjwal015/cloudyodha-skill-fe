import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import {
  ASSESSOR_MANAGEMENT_UPDATE,
  ASSESSOR_MANAGEMENT_VIEW,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../components/common/customPagination";
import { PropagateLoader, ClipLoader, RiseLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "./../../../../assets/icons/search-icon-grey.svg";
import { ReactComponent as RessignIcon } from "./../../../../assets/icons/reassignicon.svg";
import { Button, Dialog, DialogContent, Grid, Input, InputAdornment, TextField, Tooltip } from "@mui/material";
import { exportData, getLocal, getSubRole, handleTrimPaste, userRoleType } from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/CloseIcon.svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FilterModal from "../../../../components/common/Modal/FilterModal";
import validateField from "../../../../utils/validateField";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {
  changeStatusAssessorApi,
  deleteAssesorApi,
  getBatchAcceptRejectApi,
} from "../../../../api/superAdminApi/assessorManagement";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import SelectInput from "./../../../../components/common/SelectInput";
import { getAssesorList, reAssignAssessor } from "../../../../api/superAdminApi/examManagement";
import { examManagementSelector } from "../../../../redux/slicers/superAdmin/examManagementSlice";

const initialFormValues = {
  modeofAgreement_filter: "",
  agreementSigned: "",
  from: "",
  to: "",
};

const initialAssignValues = {
  currentAssesorName: "",
  newAssessorName: "",
};

const BatchRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessorList = [] } = useSelector(examManagementSelector);
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnBoading, setBtnLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { acceptRejectBatchList = [] } = useSelector(authSelector);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionBtn, setActionBtn] = useState(null);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const { renderDecider = {} } = useSelector(authSelector);
  const [renderDetails, setRenderDetails] = useState();
  const [deletePermitted, setDeletePermitted] = useState(false);
  const [editPermitted, setEditPermitted] = useState();
  const [assessorData, setAssessorData] = useState();
  const [basicDetails, setBasicDetails] = useState();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [focusedInput, setFocusedInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { userInfo = {} } = useSelector(authSelector);
  const [docUrls, setDocUrls] = useState();
  const [section, setSection] = useState("Accepted");
  const [reassignModal, setReassignModal] = useState(false);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [itemID, setItemID] = useState();
  const [assign, setAssign] = useState(initialAssignValues);
  const [viewHistoryDetails, setViewHistoryDetails] = useState({});

  const divRef = useRef(null);

  // permission
  const { ASSESSOR_MANAGEMENT_FEATURE, ASSESSOR_MANAGEMENT_LIST_FEATURE } =
   ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = ASSESSOR_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = ASSESSOR_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const selectedClient=getLocal("SelectedClient");

  useEffect(()=>{
    setSearchQuery(selectedClient)
  },[selectedClient])

  // modal
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const getList = (setStatusBtnLoading) => {
    setLoading(true);
    const setLoad = setStatusBtnLoading ? setStatusBtnLoading : setLoading;
    dispatch(getBatchAcceptRejectApi(setLoad, page, limit, searchQuery, setTotalPages, formValues, section));
  };

  useEffect(() => {
    getList();
  }, [page, limit, section]);

  useEffect(() => {
    if (renderDecider.length > 0) {
      setRenderDetails(renderDecider);
      setDeletePermitted(renderDecider[0].client?.delete);
      setEditPermitted(renderDecider[0].client?.edit);
    }
  }, [renderDecider.length]);

  useEffect(() => {
    setSortedData(acceptRejectBatchList);
    setTotalPagesUser(totalPages);
  }, [acceptRejectBatchList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find((columnName) => sortOrders[columnName] !== null);
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...acceptRejectBatchList].sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
          } else {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
          }
        });
        setSortedData(sortedData);
      }
    };
  }, [acceptRejectBatchList, sortOrders]);

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
      setSearchQuery("");
    }
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") {
      setLoading(true);

      dispatch(getBatchAcceptRejectApi(setLoading, 1, limit, searchQuery, setTotalPages, formValues, section));
      setPage(1);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  const exportClientData = () => {
    const exportData = acceptRejectBatchList?.map((item) => {
      return {
        clientName: item?.clientId?.clientname,
        batchSIPID: item?.batchId,
        jobRole: item?.jobRole?.jobRole,
        qpCode: item?.jobRole?.qpCode,
        scheme: item?.schemeId?.schemeName,
        subSchemeName: item?.subSchemeId?.subSchemeName,
        examCenter: item?.examCenterId?.examCenterName,
        assessmentDate: item?.startDate,
        batchSize: item?.batchSize,
        batchMode: item?.batchMode,
        assessorName: item?.accessorId?.fullName,
      };
    });
    return exportData;
  };
  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData(exportClientData(), getColumns()));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Assessors List.xlsx");
  };

  const confirmDelete = () => {
    // dispatch(deleteAssesorApi(setLoading, actionId, setDeleteModal, getList));
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };

  useEffect(() => {
    if (reassignModal) {
      dispatch(getAssesorList());
    }
  }, [reassignModal]);

  const handleReassignModal = (item) => {
    setReassignModal(true);
    setAssign((prev) => ({
      ...prev,
      batchId: item?._id,
      assessorId: item?.RejctedAccessorId?.[item?.RejctedAccessorId.length - 1]?._id,
      currentAssesorName: item?.RejctedAccessorId?.[item?.RejctedAccessorId.length - 1]?.fullName || "",
    }));
    setViewHistoryDetails(item);
  };

  const clearFormValues = () => {
    setAssign(initialAssignValues);
  };

  const handleViewHistoryDialogClose = (e) => {
    // e.preventDefault();
    // clearFormValues();
    setReassignModal(true);
    setViewHistoryModal(false);
  };

  const handleDialogClose = (e) => {
    // e.preventDefault();
    clearFormValues();
    setReassignModal(false);
    setViewHistoryDetails({});
  };

  const handleViewHistory = () => {
    setViewHistoryModal(true);
  };

  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const editBtnHandler = () => {
    setShowActionBtn(false);
    navigate(`${ASSESSOR_MANAGEMENT_UPDATE}/${actionId}`);
  };

  const viewBtnHandler = (id) => {
    // setShowActionBtn(false);
    navigate(`${ASSESSOR_MANAGEMENT_VIEW}/${id}`);
  };

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };

  const editChangeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setAssign({
      ...assign,
      [name]: fieldValue,
    });
  };

  const handleDateChange = (newDate, name) => {
    const formattedDate = newDate.format("YYYY-MM-DD");
    const fieldError = validateField(name, formattedDate, formValues?.startDate);
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

  const handleClearAll = () => {
    setFormValues(initialFormValues);
    setLoading(true);
    getList();
    handleCloseFilter();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = {};
    if (formValues?.from != "" || formValues?.to != "") {
      if (formValues?.from == "") {
        formErrors["from"] = "Enter Date";
      } else if (formValues?.to == "") {
        formErrors["to"] = "Enter Date";
      }
    }

    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      const isPresent = Object.keys(formValues).find((el) => {
        if (formValues[el] !== "") return el;
      });

      setLoading(true);
      if (isPresent) dispatch(getBatchAcceptRejectApi(setLoading, page, limit, "", setTotalPages, formValues, section));
      else getList();
      handleCloseFilter();
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        getList();
      }, 500);

      return () => clearTimeout(getData);
    }
  }, [searchQuery]);

  function AssessorDetailsModal() {
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="sm"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description">
          <div className="heading_container">
            <div className="poc-title">
              <h2>Assessor Details</h2>
              <p>See All Details of Assessor here</p>
            </div>
            <div className="close_icon">{<CloseIcon onClick={handleClose} />}</div>
          </div>

          <DialogContent>
            {assessorData?.length > 0 ? (
              <>
                <Box>
                  <div className="POC_card">
                    <Grid container className="outer_container_assessorModal">
                      <Grid item className="inner_container_assessorModal">
                        <h1>Basic Details</h1>
                        <p className="modal_row">
                          <span className="grey_text">Assessor Name</span>
                          <span className="bold_text">
                            {`${assessorData[0]?.firstName} ${assessorData[0]?.lastName || ""}`}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Email</span>
                          <span className="bold_text">{assessorData[0]?.email}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Contact No.</span>
                          <span className="bold_text">{`+91 ${assessorData[0]?.mobile}`}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Gender</span>
                          <span className="bold_text">
                            {`${assessorData[0]?.gender}`.replace(/^./, assessorData[0]?.gender[0].toUpperCase())}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Date of Birth</span>
                          <span className="bold_text">{assessorData[0]?.dob}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Address</span>
                          <span className="bold_text">{assessorData[0]?.address}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">State</span>
                          <span className="bold_text">{assessorData[0]?.state}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">District</span>
                          <span className="bold_text">{assessorData[0]?.district}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">PIN Code</span>
                          <span className="bold_text">{assessorData[0]?.pinCode}</span>
                        </p>
                      </Grid>
                    </Grid>
                    {/* <Divider /> */}
                    <hr className="card_divider" />
                    <Grid container className="outer_container_assessorModal">
                      <Grid item className="inner_container_assessorModal">
                        <h1>Education Details</h1>
                        <p className="modal_row">
                          <span className="grey_text">High School</span>
                          <span className="extension_text">
                            <a
                              href={
                                assessorData?.find((el) => {
                                  if (el?.key === "highSchoolCertificate") return el?.url;
                                })?.url
                              }
                              target="blank">
                              {assessorData?.find((el) => {
                                if (el?.key === "highSchoolCertificate") return el?.url;
                              })?.url
                                ? "View Document"
                                : "-"}
                            </a>
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Intermediate</span>
                          <span className="extension_text">
                            <a
                              href={
                                assessorData?.find((el) => {
                                  if (el?.key === "intermediateCertificate") return el?.url;
                                })?.url
                              }
                              target="blank">
                              {assessorData?.find((el) => {
                                if (el?.key === "intermediateCertificate") return el?.url;
                              })?.url
                                ? "View Document"
                                : "-"}
                            </a>
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Graduation</span>
                          <span className="extension_text">
                            <a
                              href={
                                assessorData?.find((el) => {
                                  if (el?.key === "undergradCertificate") return el?.url;
                                })?.url
                              }
                              target="blank">
                              {assessorData?.find((el) => {
                                if (el?.key === "undergradCertificate") return el?.url;
                              })?.url
                                ? "View Document"
                                : "-"}
                            </a>
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Post Graduation</span>
                          <span className="extension_text">
                            <a
                              href={
                                assessorData?.find((el) => {
                                  if (el?.key === "postgradCertificate") return el?.url;
                                })?.url
                              }
                              target="blank">
                              {assessorData?.find((el) => {
                                if (el?.key === "postgradCertificate") return el?.url;
                              })?.url
                                ? "View Document"
                                : "-"}
                            </a>
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Experience</span>
                          <span className="extension_text">{assessorData[0]?.experience}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Resume</span>
                          <span className="extension_text">
                            <a
                              href={
                                assessorData?.find((el) => {
                                  if (el?.key === "cv") return el?.url;
                                })?.url
                              }
                              target="blank">
                              {assessorData?.find((el) => {
                                if (el?.key === "cv") return el?.url;
                              })?.url
                                ? "View Document"
                                : "-"}
                            </a>
                          </span>
                        </p>
                      </Grid>
                    </Grid>
                    <hr className="card_divider" />
                    <Grid container className="outer_container_assessorModal">
                      <Grid item className="inner_container_assessorModal">
                        <h1>Personal Details</h1>
                        <p className="modal_row">
                          <span className="grey_text">Aadhar No.</span>
                          <span className="bold_text">{assessorData[0]?.aadharNo}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">PAN</span>
                          <span className="bold_text">{assessorData[0]?.panCardNo}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Bank Name</span>
                          <span className="bold_text">{assessorData[0]?.bankName}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Account No.</span>
                          <span className="bold_text">{assessorData[0]?.bankAccount}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">IFSC Code</span>
                          <span className="bold_text">{assessorData[0]?.bankIFSC}</span>
                        </p>
                      </Grid>
                    </Grid>
                    <hr className="card_divider" />
                    <Grid container className="outer_container_assessorModal">
                      <Grid item className="inner_container_assessorModal">
                        <h1>Agreement Details</h1>
                        <p className="modal_row">
                          <span className="grey_text">Agreement Signed</span>
                          <span className="bold_text">{assessorData[0]?.agreementSigned}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Agreement Document</span>
                          <span className="extension_text">
                            <a
                              href={
                                assessorData?.find((el) => {
                                  if (el?.key === "agreementCertificate") return el?.url;
                                })?.url
                              }
                              target="blank">
                              {assessorData?.find((el) => {
                                if (el?.key === "agreementCertificate") return el?.url;
                              })?.url
                                ? "View Document"
                                : "-"}
                            </a>
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Agreement Validity</span>
                          <span className="bold_text">{assessorData[0]?.agreementValidity || "-"}</span>
                        </p>
                      </Grid>
                    </Grid>
                  </div>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Point of Contact Details
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    No Results to show
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function capitalizeWords(inputString) {
    if (!inputString) return "-";
    return inputString.replace(/\b\w/g, (match) => match.toUpperCase());
  }
  const handleSection = (data) => {
    setSection(data);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const { batchId, newAssessorName: assessorId } = assign;
    dispatch(
      reAssignAssessor(setBtnLoading, setReassignModal, {
        batchId,
        assessorId,
      }),
    );
  };
  const handleUpdate = (e, section) => {
    e.preventDefault();
    const formErrors = {};
  };

  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        getList();
      }, 500);

      return () => clearTimeout(getData);
    } else getList();
  }, [searchQuery]);

  const MAX_LENGTH_FOR_TOOLTIP=13;
  return (
    <div className="main-content">
      <div className="title" style={{ display: "block" }}>
        <h1>Batch Request</h1>
        <div className="title-btn" style={{ paddingTop: "10px" }}>
          <div className="sub_sections" style={{ paddingTop: "10px" }}>
            <button
              onClick={() => handleSection("Accepted")}
              style={{
                cursor: "pointer",
                background: [section != "Accepted" ? "white" : ""],
                color: [section != "Accepted" ? "#00b2ff" : ""],
                border: [section != "Accepted" ? "1px solid #00b2ff" : ""],
              }}>
              <span>Accepted</span>
            </button>
            <button
              onClick={() => handleSection("Pending")}
              style={{
                cursor: "pointer",
                background: [section != "Pending" ? "white" : ""],
                color: [section != "Pending" ? "#00b2ff" : ""],
                border: [section != "Pending" ? "1px solid #00b2ff" : ""],
              }}>
              <span>Pending Approval</span>
            </button>
            <button
              onClick={() => handleSection("Rejected")}
              style={{
                cursor: "pointer",
                background: [section != "Rejected" ? "white" : ""],
                color: [section != "Rejected" ? "#00b2ff" : ""],
                border: [section != "Rejected" ? "1px solid #00b2ff" : ""],
              }}>
              <span>Rejected</span>
            </button>
          </div>
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon width={15} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="subadmin-btn">
            {/* <button className="filter-btn" onClick={handleFilter}>
              Filter
            </button> */}

            {isFilterOpen ? (
              <FilterModal
                handleClose={handleCloseFilter}
                focusHandler={focusHandler}
                blurHandler={blurHandler}
                changeHandler={changeHandler}
                formValues={formValues}
                setFormValues={setFormValues}
                handleDateChange={handleDateChange}
                handleClearAll={handleClearAll}
                handleSubmit={handleSubmit}
                showStatus={false}
                showAssessorFilter
                errorMessage={errors}
              />
            ) : (
              ""
            )}
            {isRolePermission?.permissions?.["5"] && (
              <button className="export-btn" onClick={loading || sortedData?.length == 0 ? undefined : handleExport}>
                {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
              </button>
            )}
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <TableHeader
              columns={getColumns(isRolePermission, section)}
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
                      <td>{item?.clientId?.clientname || "-"}</td>
                      <td>{item?.batchId || "-"}</td>

                      <td>
                      {item?.questionPaper?.isMultiJobRole ? (
                          item?.questionPaper?.multipleJobRole
                            ?.map((item) =>item?.jobRoleId?.jobRole)
                            ?.join("\n")?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={
                                // (item?.questionPaper?.multipleJobRole
                                //   ?.map((item) => item?.jobRoleId && getJobRoleById(item?.jobRoleId))
                                //   ?.join(",\n")) || "NA"
                                <ul>{(item?.questionPaper?.multipleJobRole
                                  ?.map((item) => item?.jobRoleId?.jobRole)
                                  ?.map((val,index)=><li key={index}>{`${index+1}. ${val}`}</li>)) || "NA"}</ul>
                              }
                              arrow >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px",
                                }}>
                                {(item?.questionPaper?.multipleJobRole
                                  ?.map((item) => item?.jobRoleId?.jobRole)
                                  ?.join("\n")) || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>
                              {item?.questionPaper?.multipleJobRole
                                ?.map( (item) => item?.jobRoleId?.jobRole )
                                ?.join("\n") || "NA"}
                            </div>
                          )
                        ) : (item?.jobRole?.jobRole?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.jobRole?.jobRole || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}>
                              {item?.jobRole?.jobRole || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.jobRole?.jobRole || "NA"}</div>
                        ))}

                        {/* {item?.jobRole?.jobRole || "-"} */}
                      </td>
                      <td>

                      {item?.questionPaper?.isMultiJobRole ? (
                          item?.questionPaper?.multipleJobRole
                            ?.map((item) =>item?.jobRoleId?.qpCode)
                            ?.join("\n")?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={
                                // (item?.questionPaper?.multipleJobRole
                                //   ?.map((item) => item?.jobRoleId && getJobRoleById(item?.jobRoleId))
                                //   ?.join(",\n")) || "NA"
                                <ul>{(item?.questionPaper?.multipleJobRole
                                  ?.map((item) => item?.jobRoleId?.qpCode)
                                  ?.map((val,index)=><li key={index}>{`${index+1}. ${val}`}</li>)) || "NA"}</ul>
                              }
                              arrow >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px",
                                }}>
                                {(item?.questionPaper?.multipleJobRole
                                  ?.map((item) => item?.jobRoleId?.qpCode)
                                  ?.join("\n")) || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>
                              {item?.questionPaper?.multipleJobRole
                                ?.map( (item) => item?.jobRoleId?.jobRole )
                                ?.join("\n") || "NA"}
                            </div>
                          )
                        ) : (item?.jobRole?.qpCode?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.jobRole?.qpCode || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}>
                              {item?.jobRole?.qpCode || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.jobRole?.qpCode || "NA"}</div>
                        ))}
                        {/* {item?.jobRole?.qpCode || "-"} */}
                        </td>
                      <td>{item?.schemeId?.schemeName ?? "-"}</td>
                      <td>{item?.subSchemeId?.subSchemeName || "-"}</td>
                      <td>{item?.examCenterId?.examCenterName || "-"}</td>
                      <td>{item?.startDate + " - " + item?.endDate ?? "-"}</td>
                      <td>{item?.batchSize ?? "-"}</td>
                      <td>{item?.batchMode ?? "-"}</td>
                      <td>
                        {(item?.accessorId?.fullName ||
                          item?.RejctedAccessorId?.[item?.RejctedAccessorId.length - 1]?.fullName) ??
                          "-"}
                      </td>

                      {section === "Rejected" ? (
                        <td>
                          <div className="assesment-stats-btn">
                            <button className="reject">
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      ) : section === "Pending" ? (
                        <td>
                          <div className="assesment-stats-btn">
                            <button className="pending">
                              <span>Pending</span>
                            </button>
                          </div>
                        </td>
                      ) : (
                        <td>
                          <div className="assesment-stats-btn">
                            <button className="accept">
                              <span>Accepted</span>
                            </button>
                          </div>
                        </td>
                      )}
                      {section === "Rejected" && (
                        <td>
                          <div className="assesment-stats-btn">
                            <button className="reassign" onClick={() => handleReassignModal(item)}>
                              <span>Reassign</span>
                            </button>
                          </div>
                        </td>
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

      <DeleteModal
        title="Delete Assessor"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      <div
        style={{
          display: [totalPages > 0 ? "" : "none"],
        }}>
        <CustomTablePagination
          count={totalPages}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <AssessorDetailsModal data={setAssessorData} />
      <Dialog
        // ref={divRef}
        open={reassignModal}
        // TransitionComponent={Transition}
        // keepMounted
        fullWidth={true}
        maxWidth={"xs"}
        onClose={handleDialogClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}>
        <DialogTitle>
          <div className="Dialog__tabBox">
            <div className="Dialog__title">
              <div style={{ width: "100%" }}>
                <div>
                  <RessignIcon style={{ width: "12%" }} />
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="form-wrapper" style={{ width: "100%" }}>
            <form>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}>
                <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                  <Input
                    label="Assessor Name"
                    name="currentAssesorName"
                    placeholder="Enter Name"
                    onFocus={focusHandler}
                    error={errors?.currentAssesorName}
                    onBlur={blurHandler}
                    onChange={(e) => editChangeHandler(e)}
                    value={assign?.currentAssesorName}
                    mandatory
                    disabled={true}
                  />
                  {viewHistoryDetails?.RejctedAccessorId?.length > 1 ? (
                    <h2 onClick={handleViewHistory}>View History</h2>
                  ) : (
                    <h2 style={{ fontSize: "12px" }}>No history data</h2>
                  )}
                </div>
                <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                  <SelectInput
                    name="newAssessorName"
                    label="Assessor Name"
                    placeHolder="Select Assessor Name"
                    value={assign?.newAssessorName}
                    handleChange={(e) => {
                      editChangeHandler(e, "basicInfo");
                      // getCityListsHandler(e);
                    }}
                    // options={assign.assessorId ?  assessorList.filter((assessorItem)=> assessorItem?.value !== assign?.assessorId) : assessorList }
                    options={
                      assessorList?.length > 1
                        ? [...assessorList]?.sort((a, b) => a?.label?.localeCompare(b?.label))
                        : assessorList
                    }
                    // options={assessorList}
                    error={errors?.state}
                    mandatory
                  />
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="actions_wrapper">
            <Button onClick={handleDialogClose} sx={{ display: [itemID ? "none" : ""] }}>
              Cancel
            </Button>

            <Button
              onClick={(e) => handleSave(e)}
              className={`submit-btn ${assign?.currentAssesorName && assign?.newAssessorName ? "light-blue-btn" : ""}`}
              variant="contained"
              disabled={assign?.currentAssesorName && assign?.newAssessorName ? false : true}
              sx={{ display: [itemID ? "none" : ""] }}>
              {loading ? <RiseLoader size="5px" color="white" /> : "Assign"}
            </Button>
            <Button
              onClick={(e) => handleUpdate(e, "exp")}
              className={`light-blue-btn submit-btn`}
              variant="contained"
              disabled={loading ? true : false}
              sx={{ display: [itemID ? "" : "none"] }}>
              {loading ? <RiseLoader size="5px" color="white" /> : "Update"}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        // ref={divRef}
        open={viewHistoryModal}
        // TransitionComponent={Transition}
        // keepMounted
        fullWidth={true}
        // maxWidth={"sm"}
        onClose={handleViewHistoryDialogClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}>
        <DialogTitle>
          <div className="Dialog__tabBox">
            <div className="Dialog__title">
              <div style={{ width: "100%" }}>
                <div>
                  <h1>Batch history: {viewHistoryDetails.batchId}</h1>
                  {/* <RessignIcon style={{ width: "12%" }} /> */}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="form-wrapper" style={{ width: "100%", height: "220px" }}>
            <form>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}>
                <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                  <SelectInput
                    name="newAssessorName"
                    label=""
                    // placeHolder="History assign assessors"
                    // value={assign?.newAssessorName}
                    handleChange={(e) => {
                      // editChangeHandler(e, "basicInfo");
                    }}
                    // options={viewHistoryDetails?.RejctedAccessorId?.length > 1 ? viewHistoryDetails?.RejctedAccessorId?.slice(0, viewHistoryDetails?.RejctedAccessorId?.length-1).map((item, index)=> ({label: `${index + 1}. ${item.fullName}`, value: item._id})):[]}
                    options={
                      viewHistoryDetails?.RejctedAccessorId?.length > 1
                        ? viewHistoryDetails?.RejctedAccessorId?.map((item, index) => ({
                            label: `${index + 1}. ${item.fullName}`,
                            value: item._id,
                          }))
                        : []
                    }
                    error={errors?.state}
                  />
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="actions_wrapper">
            <Button onClick={handleViewHistoryDialogClose}>Cancel</Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BatchRequest;

const getColumns = (isRolePermission, section) => {
  let columns = [
    { name: "_id", label: "S.No" },
    { name: "clientName", label: "CLIENT NAME" },
    { name: "batchSIPID", label: "BATCH SIP ID" },
    { name: "jobRole", label: "JOB ROLE" },
    { name: "qpCode", label: "QP CODE" },
    { name: "scheme", label: "SCHEME" },
    { name: "subSchemeName", label: "SUB-SCHEME NAME" },
    { name: "examCenter", label: "EXAM CENTER" },
    { name: "assessmentDate", label: "ASSESSMENT DATE" },
    { name: "batchSize", label: "BATCH SIZE" },
    { name: "batchMode", label: "BATCH MODE" },
    { name: "assessorName", label: "ASSESSOR NAME" },
    { name: "status", label: "STATUS" },
    { name: "action", label: "ACTION" },
  ];

  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns.filter((column) => column.name !== "status");
  }
  if (section === "Accepted") {
    columns = columns?.filter((column) => column.name !== "action");
  }
  if (section === "Pending") {
    columns = columns?.filter((column) => column.name !== "action");
  }
  // console.log(columns, "columns");

  return columns;
};
