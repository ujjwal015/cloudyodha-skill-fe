import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style.css";
import { ReactComponent as PlusIcon } from "../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  ASSESSOR_MANAGEMENT_ADD_NEW,
  ASSESSOR_MANAGEMENT_UPDATE,
  ASSESSOR_MANAGEMENT_VIEW,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../components/common/table";
import { FormSwitch } from "../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../components/common/customPagination";
import { PropagateLoader, ClipLoader, RiseLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "./../../../../assets/icons/search-icon-grey.svg";
// import { ReactComponent as RessignIcon } from "./../../../../assets/icons/reassignicon.svg";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Input,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  exportData,
  getLocal,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../components/common/DropDown";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../redux/slicers/authSlice";
import DummyImage from "../../../../assets/images/common/no-preview.png";
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
  getAssessedBatchListApi,
} from "../../../../api/superAdminApi/assessorManagement";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { Icon } from "@iconify/react";
import Slide from "@mui/material/Slide";
import SelectInput from "./../../../../components/common/SelectInput";
import {
  getAssesorList,
  reAssignAssessor,
} from "../../../../api/superAdminApi/examManagement";
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

const AssessedBatch = () => {
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
  const { assessedBatchList = [] } = useSelector(authSelector);
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
  const [section, setSection] = useState("pending");
  const [reassignModal, setReassignModal] = useState(false);
  const [itemID, setItemID] = useState();
  const [assign, setAssign] = useState(initialAssignValues);
  const selectedClient=getLocal("SelectedClient");
  const divRef = useRef(null);

  const location=useLocation();

  const store=getLocal("query");
  
  useEffect(()=>{
    return window.localStorage.removeItem("query");
  },[])

useEffect(()=>{
  if(store?.batchCompleteStatus){
    setSection(store?.batchCompleteStatus)
  }
},[store])


  useEffect(()=>{
    setSearchQuery(selectedClient);
  },[selectedClient])

  const { ASSESSOR_MANAGEMENT_FEATURE, ASSESSOR_MANAGEMENT_LIST_FEATURE } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = ASSESSOR_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = ASSESSOR_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const [open, setOpen] = React.useState(false);
  const [isFilerApplied, setIsFilterApplied] = useState(false);

  const handleOpen = (data) => {
    setOpen(true);
    setAssessorData(data);
    setBasicDetails(data[0]);
  };
  const handleClose = () => setOpen(false);

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const getList = (setStatusBtnLoading) => {
    const setLoad = setStatusBtnLoading ? setStatusBtnLoading : setLoading;
    dispatch(
      getAssessedBatchListApi(
        setLoad,
        page,
        limit,
        searchQuery,
        setTotalPages,
        formValues,
        section,
        setIsFilterApplied
      )
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit,searchQuery, section]);

  useEffect(() => {
    if (renderDecider.length > 0) {
      setRenderDetails(renderDecider);
      setDeletePermitted(renderDecider[0].client?.delete);
      setEditPermitted(renderDecider[0].client?.edit);
    }
  }, [renderDecider.length]);

  useEffect(() => {
    setSortedData(assessedBatchList);
    setTotalPagesUser(totalPages);
  }, [assessedBatchList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...assessedBatchList].sort((a, b) => {
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
  }, [assessedBatchList, sortOrders]);

  const handleStatusChange = (e, id) => {
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(id);
    const formData = {
      status: value,
    };
    setStatusLoading(true);
    dispatch(changeStatusAssessorApi(id, formData, setStatusLoading, getList));
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
    // if (value == "") {
      // setLoading(true);
      // setSearchQuery("");
      // getList();
    // }
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") setLoading(true);

    dispatch(
      getAssessedBatchListApi(
        setLoading,
        1,
        limit,
        searchQuery,
        setTotalPages,
        formValues,
        section
      )
    );
    setPage(1);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

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
    { name: "present", label: "PRESENT" },
    { name: "absent", label: "ABSENT" },
    { name: "batchMode", label: "BATCH MODE" },
    { name: "assessorName", label: "ASSESSOR NAME" },
    { name: "status", label: "STATUS" },
    { name: "action", label: "ACTION" },
  ];

  const exportClientData = () => {
    const exportData = assessedBatchList?.map((item) => {
      return {
        clientName: item?.clientId?.clientname,
        batchSIPID: item?.batchId,
        jobRole: item?.jobRole?.jobRole,
        qpCode: item?.questionPaper?.qpCode,
        scheme: item?.schemeId?.schemeName,
        subSchemeName: item?.subSchemeId?.subSchemeName,
        examCenter: item?.examCenterId?.examCenterName,
        assessmentDate: item?.startDate,
        batchSize: item?.batchSize,
        present: item?.present,
        absent: item?.absent,
        batchMode: item?.batchMode,
        assessorName: item?.accessorId?.fullName,
        status: section,
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
    saveAs(blob, "Batch Status List.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    dispatch(deleteAssesorApi(setLoading, actionId, setDeleteModal, getList));
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };

  /*  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }); */

  useEffect(() => {
    if (reassignModal) {
      dispatch(getAssesorList());
    }
  }, [reassignModal]);

  const handleReassignModal = (item) => {
    console.log(item, "called");
    setReassignModal(true);
    setAssign((prev) => ({
      ...prev,
      batchId: item?._id,
      assessorId: item?.accessorId?._id,
      currentAssesorName: item?.accessorId?.fullName,
    }));
  };
  // console.log(reassignModal, "item");

  const clearFormValues = () => {
    setAssign(initialAssignValues);
  };

  const handleDialogClose = (e) => {
    // e.preventDefault();
    clearFormValues();
    setReassignModal(false);
  };
  // console.log(assign, "ddd");
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
    console.log(value, fieldValue, "editChangeHandler");
    setAssign({
      ...assign,
      [name]: fieldValue,
    });
  };
  // console.log(assign, "assign");
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

  const handleClearAll = () => {
    setFormValues(initialFormValues);
    setLoading(true);
    getList();
    handleCloseFilter();
    setIsFilterApplied(false);
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
      if (isPresent)
        dispatch(
          getAssessedBatchListApi(
            setLoading,
            page,
            limit,
            searchQuery,
            setTotalPages,
            formValues,
            section,
            setIsFilterApplied
          )
        );
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
          aria-describedby="scroll-dialog-description"
        >
          <div className="heading_container">
            <div className="poc-title">
              <h2>Assessor Details</h2>
              <p>See All Details of Assessor here</p>
            </div>
            <div className="close_icon">
              {<CloseIcon onClick={handleClose} />}
            </div>
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
                            {`${assessorData[0]?.firstName} ${
                              assessorData[0]?.lastName || ""
                            }`}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Email</span>
                          <span className="bold_text">
                            {assessorData[0]?.email}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Contact No.</span>
                          <span className="bold_text">{`+91 ${assessorData[0]?.mobile}`}</span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Gender</span>
                          <span className="bold_text">
                            {`${assessorData[0]?.gender}`.replace(
                              /^./,
                              assessorData[0]?.gender[0].toUpperCase()
                            )}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Date of Birth</span>
                          <span className="bold_text">
                            {assessorData[0]?.dob}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Address</span>
                          <span className="bold_text">
                            {assessorData[0]?.address}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">State</span>
                          <span className="bold_text">
                            {assessorData[0]?.state}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">District</span>
                          <span className="bold_text">
                            {assessorData[0]?.district}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">PIN Code</span>
                          <span className="bold_text">
                            {assessorData[0]?.pinCode}
                          </span>
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
                                  if (el?.key === "highSchoolCertificate")
                                    return el?.url;
                                })?.url
                              }
                              target="blank"
                            >
                              {assessorData?.find((el) => {
                                if (el?.key === "highSchoolCertificate")
                                  return el?.url;
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
                                  if (el?.key === "intermediateCertificate")
                                    return el?.url;
                                })?.url
                              }
                              target="blank"
                            >
                              {assessorData?.find((el) => {
                                if (el?.key === "intermediateCertificate")
                                  return el?.url;
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
                                  if (el?.key === "undergradCertificate")
                                    return el?.url;
                                })?.url
                              }
                              target="blank"
                            >
                              {assessorData?.find((el) => {
                                if (el?.key === "undergradCertificate")
                                  return el?.url;
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
                                  if (el?.key === "postgradCertificate")
                                    return el?.url;
                                })?.url
                              }
                              target="blank"
                            >
                              {assessorData?.find((el) => {
                                if (el?.key === "postgradCertificate")
                                  return el?.url;
                              })?.url
                                ? "View Document"
                                : "-"}
                            </a>
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Experience</span>
                          <span className="extension_text">
                            {assessorData[0]?.experience}
                          </span>
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
                              target="blank"
                            >
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
                          <span className="bold_text">
                            {assessorData[0]?.aadharNo}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">PAN</span>
                          <span className="bold_text">
                            {assessorData[0]?.panCardNo}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Bank Name</span>
                          <span className="bold_text">
                            {assessorData[0]?.bankName}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Account No.</span>
                          <span className="bold_text">
                            {assessorData[0]?.bankAccount}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">IFSC Code</span>
                          <span className="bold_text">
                            {assessorData[0]?.bankIFSC}
                          </span>
                        </p>
                      </Grid>
                    </Grid>
                    <hr className="card_divider" />
                    <Grid container className="outer_container_assessorModal">
                      <Grid item className="inner_container_assessorModal">
                        <h1>Agreement Details</h1>
                        <p className="modal_row">
                          <span className="grey_text">Agreement Signed</span>
                          <span className="bold_text">
                            {assessorData[0]?.agreementSigned}
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Agreement Document</span>
                          <span className="extension_text">
                            <a
                              href={
                                assessorData?.find((el) => {
                                  if (el?.key === "agreementCertificate")
                                    return el?.url;
                                })?.url
                              }
                              target="blank"
                            >
                              {assessorData?.find((el) => {
                                if (el?.key === "agreementCertificate")
                                  return el?.url;
                              })?.url
                                ? "View Document"
                                : "-"}
                            </a>
                          </span>
                        </p>
                        <p className="modal_row">
                          <span className="grey_text">Agreement Validity</span>
                          <span className="bold_text">
                            {assessorData[0]?.agreementValidity || "-"}
                          </span>
                        </p>
                      </Grid>
                    </Grid>
                  </div>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
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

  function ChipDetails({ data, dataFor } = data) {
    let ChipDetailsText = "...loading";
    let collect = "";
    data.map((el, index) => {
      if (dataFor === "jobRoles") {
        if (index != +data.length - 1) collect += el?.jobroleName + ", ";
        else collect += el?.jobroleName;
      } else {
        if (index != +data.length - 1) collect += el?.clientname + ", ";
        else collect += el?.clientname;
      }
    });
    ChipDetailsText = collect;
    return (
      <>
        <Tooltip title={ChipDetailsText} arrow>
          <div
            className="chip_quantity_circle"
            style={{
              display: [data.length > 1 ? "" : "none"],
              backgroundColor: [dataFor === "jobRoles" ? "#D3F2FF" : ""],
            }}
          >{`${"+"}${+data.length - 1}`}</div>
        </Tooltip>
      </>
    );
  }

  function processExperience(yrs, mnth) {
    if (!yrs && !mnth) return "-";
    else if (yrs && mnth) return `${yrs}.${mnth}yr`;
    else if (!yrs && mnth) return `0.${mnth}yr`;
    else if (yrs && !mnth) return `${yrs}yr`;
  }

  function capitalizeWords(inputString) {
    if (!inputString) return "-";
    return inputString.replace(/\b\w/g, (match) => match.toUpperCase());
  }
  const handleSection = (data) => {
    setSection(data);
  };

  useEffect(() => {
    // console.log(section);
  }, [section]);

  const handleAssign = () => {};

  const handleSave = (e) => {
    e.preventDefault();
    const { batchId, newAssessorName: assessorId } = assign;
    dispatch(
      reAssignAssessor(setBtnLoading, setReassignModal, {
        batchId,
        assessorId,
      })
    );
    // if (!assessorMDBId)
    /* const formErrors = {};

    Object.keys(experienceDetails).forEach((name) => {
      const value = experienceDetails[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0) {
      if (section === "exp") {
        const data = createFormData(experienceDetails);
        if (assessorMDBId) {
          setLoading(true);
          dispatch(
            uploadAssessorExperienceApi(
              data,
              setLoading,
              assessorMDBId,
              setTabDegreeValue,
              clearFormValues,
              setOpenExp,
              setSelectedFiles
            )
          );
        } else {
          setOpenExp(false);
          clearFormValues();
          errorToast("Please fill basic info first");
        }
      }
    } */
  };

  const handleUpdate = (e, section) => {
    e.preventDefault();
    const formErrors = {};

    /* Object.keys(experienceDetails).forEach((name) => {
      const value = experienceDetails[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      if (activeSection === "exp") {
        const data = createFormData(experienceDetails);
        setLoading(true);
        dispatch(
          updateAssessorExperienceApi(
            data,
            setLoading,
            assessorMDBId,
            setTabDegreeValue,
            clearFormValues,
            setOpenExp,
            setSelectedFiles,
            itemID,
            setItemID
          )
        );
      }
    } */
  };

  // const [isClickedOutside, setIsClickedOutside] = useState(false);

  /*  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setReassignModal(false);
      } else {
        setReassignModal(true);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []); */
  // console.log(assessedBatchList, "reassignModal");

  const MAX_LENGTH_FOR_TOOLTIP=13;
  return (
    <div className="main-content">
      <div className="title" style={{ display: "block" }}>
        <h1>Batch Status</h1>
        <div className="title-btn" style={{ paddingTop: "10px" }}>
          <div className="sub_sections" style={{ paddingTop: "10px" }}>
            <button
              onClick={() => handleSection("pending")}
              style={{
                cursor: "pointer",
                background: [section != "pending" ? "white" : ""],
                color: [section != "pending" ? "#00b2ff" : ""],
                border: [section != "pending" ? "1px solid #00b2ff" : ""],
              }}
            >
              <span>Pending</span>
            </button>
            <button
              onClick={() => handleSection("complete")}
              style={{
                cursor: "pointer",
                background: [section != "complete" ? "white" : ""],
                color: [section != "complete" ? "#00b2ff" : ""],
                border: [section != "complete" ? "1px solid #00b2ff" : ""],
              }}
            >
              <span>Completed</span>
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
            <button
              className="filter-btn clear_all_btn"
              onClick={handleClearAll}
              style={{ display: [isFilerApplied ? "" : "none"] }}
            >
              Clear All
            </button>
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
            
            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={
                  loading || sortedData?.length == 0 ? undefined : handleExport
                }
              >
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

                        {/* {item?.questionPaper?.qpCode|| "-"} */}
                        </td>
                      <td>{item?.schemeId?.schemeName ?? "-"}</td>
                      <td>{item?.subSchemeId?.subSchemeName || "-"}</td>
                      <td>{item?.examCenterId?.examCenterName || "-"}</td>
                      <td>{item?.startDate + " - " + item?.endDate ?? "-"}</td>
                      <td>{item?.batchSize ?? "-"}</td>
                      <td>{item?.present ?? "-"}</td>
                      <td>{item?.absent ?? "-"}</td>
                      <td>{item?.batchMode ?? "-"}</td>
                      <td>{item?.accessorId?.fullName ?? "-"}</td>

                      {section === "pending" ? (
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
                            <button className="completed">
                              <span>Completed</span>
                            </button>
                          </div>
                        </td>
                      )}
                      {/*  {section === "Rejected" && (
                        <td>
                          <div className="assesment-stats-btn">
                            <button
                              className="reassign"
                              onClick={() => handleReassignModal(item)}
                            >
                              <span>Reassign</span>
                            </button>
                          </div>
                        </td>
                      )} */}
                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
                        <td
                          style={{
                            paddingLeft: "30px",
                          }}
                        >
                          <ActionDropdown
                            actionOpen={actionOpen}
                            setActionOpen={setActionOpen}
                            deleteHandler={deleteHandler}
                            editBtnHandler={editBtnHandler}
                            MoreBtnHandler={MoreBtnHandler}
                            id={item._id}
                            actionId={actionId}
                            featureName={featureName}
                            subFeatureName={subFeatureName}
                            showDelete={
                              item?.status !== "active" ? true : false
                            }
                          />
                        </td>
                      ) : null}

                      {/* <td>
                        {item[0]?.jobRole.length > 0 && (
                          <div>
                            <div className="multi_chip_container">
                              <div
                                className="chip_heading"
                                style={{ backgroundColor: "#D3F2FF" }}
                              >
                                {capitalizeWords(
                                  item[0]?.jobRole[0]?.jobroleName
                                )}
                              </div>
                              <ChipDetails
                                data={item[0]?.jobRole}
                                dataFor={"jobRoles"}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                      <td>
                        {processExperience(
                          item?.[0]?.totalExperience?.years,
                          item?.[0]?.totalExperience?.months
                        )}
                      </td>
                      <td>
                        {capitalizeWords(item?.[0]?.agreementSigned) || "-"}
                      </td> */}
                      {/* <td>{item?.[0]?.agreementValidity || "-"}</td>
                      <td>
                        {
                          <div
                            className={`highlightedContainer ${
                              item[0].modeofAgreement === "payroll"
                                ? "green"
                                : item[0].modeofAgreement === "freelance"
                                ? "red"
                                : ""
                            }`}
                          >
                            {capitalizeWords(item[0]?.modeofAgreement)}
                          </div>
                        }
                      </td> */}
                      {/* <td style={{ textAlign: "center" }}>
                        <Icon
                          icon={"mdi:eye"}
                          width={20}
                          onClick={() => viewBtnHandler(item?.[0]?._id)}
                          style={{ color: "#00b2ff", cursor: "pointer" }}
                        />
                      </td> */}
                      {/*   {isRolePermission?.permissions?.["6"] && (
                        <td style={{ textAlign: "center" }}>
                          {statusLoading && id == item._id ? (
                            <FormSwitch
                              value={
                                item[0]?.client_status == "active"
                                  ? true
                                  : false
                              }
                              onChange={(e) =>
                                handleStatusChange(e, item?.[0]?._id)
                              }
                            />
                          ) : (
                            <FormSwitch
                              value={
                                item[0]?.client_status == "active"
                                  ? true
                                  : false
                              }
                              onChange={(e) =>
                                handleStatusChange(e, item?.[0]?._id)
                              }
                            />
                          )}
                        </td>
                      )}

                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
                        <td style={{ textAlign: "center" }}>
                          <div className="action-btn">
                            <ActionDropdown
                              actionOpen={actionOpen}
                              setActionOpen={setActionOpen}
                              deleteHandler={deleteHandler}
                              showDeleteButton={deletePermitted}
                              editBtnHandler={editBtnHandler}
                              MoreBtnHandler={MoreBtnHandler}
                              id={item[0]?._id}
                              actionId={actionId}
                              featureName={featureName}
                              subFeatureName={subFeatureName}
                              showDelete={item[0]?.client_status === "inactive"}
                            />
                          </div>
                        </td>
                      ) : null} */}
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
        }}
      >
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
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      >
        <DialogTitle>
          <div className="Dialog__tabBox">
            <div className="Dialog__title">
              <div style={{ width: "100%" }}>
                <div>{/* <RessignIcon style={{ width: "12%" }} /> */}</div>
                <div></div>

                {/*   <div>
                  <h1>Reassign Batch</h1>
                  <div
                    onClick={handleDialogClose}
                    className="Dialog__closeIcon"
                  >
                    <Icon className="close__icon" icon="iconamoon:close-light">
                      {`Close`}
                    </Icon>
                  </div>
                </div> */}
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
                }}
              >
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
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
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <SelectInput
                    name="newAssessorName"
                    label="Assessor Name"
                    placeHolder="Select New Assessor Name"
                    value={assign?.newAssessorName}
                    handleChange={(e) => {
                      editChangeHandler(e, "basicInfo");
                      // getCityListsHandler(e);
                    }}
                    options={assessorList}
                    error={errors?.state}
                    mandatory
                  />
                </div>
                {/*  {activeSection === "exp" ? (
                  <ExperienceFields />
                ) : (
                  <EducationFields />
                )} */}
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="actions_wrapper">
            {/* <Button
              onClick={(e) => handleAssign(e, "exp")}
              sx={{ display: [itemID ? "" : "none"] }}
            >
              Assign
            </Button>
            */}
            <Button
              onClick={handleDialogClose}
              sx={{ display: [itemID ? "none" : ""] }}
            >
              Cancel
            </Button>

            <Button
              onClick={(e) => handleSave(e)}
              className={`light-blue-btn submit-btn`}
              variant="contained"
              disabled={loading ? true : false}
              sx={{ display: [itemID ? "none" : ""] }}
            >
              {loading ? <RiseLoader size="5px" color="white" /> : "Assign"}
            </Button>
            <Button
              onClick={(e) => handleUpdate(e, "exp")}
              className={`light-blue-btn submit-btn`}
              variant="contained"
              disabled={loading ? true : false}
              sx={{ display: [itemID ? "" : "none"] }}
            >
              {loading ? <RiseLoader size="5px" color="white" /> : "Update"}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssessedBatch;

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
    { name: "present", label: "PRESENT" },
    { name: "absent", label: "ABSENT" },
    { name: "batchMode", label: "BATCH MODE" },
    { name: "assessorName", label: "ASSESSOR NAME" },
    { name: "status", label: "STATUS" },
    { name: "action", label: "ACTION" },
  ];

  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns.filter((column) => column.name !== "status");
  }
  // console.log(columns, "columns");

  return columns;
};

// const getColumns = (isRolePermission) => {
//   let columns = [
//     { name: "_id", label: "S.NO" },
//     { name: "photo", label: "Photo" },
//     { name: "assessorID", label: "Assessor ID" },
//     { name: "firstname", label: "Assessor Name" },
//     // { name: "clientName", label: "Client Name" },
//     { name: "jobRole", label: "Job Role" },
//     { name: "experience", label: "Experience" },
//     { name: "agreementSigned", label: "Agreement Signed" },
//     { name: "agreementValidity", label: "Agreement Validity" },
//     { name: "modeofAgreement", label: "Assessor Mode" },
//     { name: "viewDetails", label: "View" },
//     { name: "client_status", label: "STATUS" },
//     { name: "actions", label: "ACTIONS" },
//   ];
//   if (!isRolePermission?.permissions?.["6"]) {
//     columns = columns?.filter((column) => column?.name !== "client_status");
//   }
//   if (
//     !isRolePermission?.permissions?.["3"] &&
//     !isRolePermission?.permissions?.["4"]
//   ) {
//     columns = columns?.filter((column) => column?.name !== "actions");
//   }
//   return columns;
// };

{
  /* <tr key={index}>
  <td>{(page - 1) * limit + (index + 1)}</td>
  <td>
    {item?.url ? (
      <img src={item?.url} className="client_logo" />
    ) : (
      <DummyImage className="client_logo" />
    )}
  </td>
</tr>; */
}

{
  /* <tr key={index}>
                      {console.log(item)}
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>
                        {
                          <div className="assessor_photo_container">
                            {item?.find((el) => {
                              if (el.key === "assessorPhoto") return true;
                            }) ? (
                              <img
                                src={
                                  item?.find((el) => {
                                    if (el.key === "assessorPhoto")
                                      return el?.url;
                                  })?.url
                                }
                              />
                            ) : (
                              <img src={DummyImage} />
                            )}
                          </div>
                        }
                      </td>
                      <td>{item?.[0]?.assessorId}</td>
                      <td>
                        <div
                          className="assessor_details_modal"
                          onClick={(e) => handleOpen(item)}
                        >
                          {`${item?.[0]?.firstName}
                            ${item[0]?.lastName ? item[0]?.lastName : ""}`}
                        </div>
                      </td>
                      <td>
                        {
                          <div>
                            <div className="multi_chip_container">
                              <div className="chip_heading">{`${item[0]?.clientDetail[0]?.clientname}`}</div>
                              <ChipDetails
                                data={item[0]?.clientDetail}
                                dataFor={"clientDetail"}
                              />
                            </div>
                          </div>
                        }
                      </td>
                      <td>
                        {
                          <div>
                            <div className="multi_chip_container">
                              <div
                                className="chip_heading"
                                style={{ backgroundColor: "#D3F2FF" }}
                              >
                                {`${item[0]?.jobRole}`}
                              </div>
                              <ChipDetails
                                data={item[0]?.jobRole}
                                dataFor={"jobRoles"}
                              />
                            </div>
                          </div>
                        }
                      </td>
                      <td>{item?.[0].experience || "NA"}</td>
                      <td>{item[0]?.agreementSigned || "NA"}</td>
                      <td>{item[0]?.agreementValidity || "NA"}</td>
                      <td>{item[0]?.modeofAgreement || "NA"}</td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td style={{ textAlign: "center" }}>
                          {statusLoading && id == item._id ? (
                            <FormSwitch
                              value={
                                item[0]?.client_status == "active"
                                  ? true
                                  : false
                              }
                              onChange={(e) =>
                                handleStatusChange(e, item?.[0]?._id)
                              }
                            />
                          ) : (
                            <FormSwitch
                              value={
                                item[0]?.client_status == "active"
                                  ? true
                                  : false
                              }
                              onChange={(e) =>
                                handleStatusChange(e, item?.[0]?._id)
                              }
                            />
                          )}
                        </td>
                      )}
                      <td>
                        
}
//     <Icon
//       icon={"mdi:eye"}
//       onClick={() => viewBtnHandler(item?.[0]?._id)}
//     />
//   </td>
//   {isRolePermission?.permissions?.["3"] ||
//   isRolePermission?.permissions?.["4"] ? (
//     <td style={{ textAlign: "center" }}>
//       <div className="action-btn">
//         <ActionDropdown
//           actionOpen={actionOpen}
//           setActionOpen={setActionOpen}
//           deleteHandler={deleteHandler}
//           showDeleteButton={deletePermitted}
//           editBtnHandler={editBtnHandler}
//           MoreBtnHandler={MoreBtnHandler}
//           id={item[0]?._id}
//           actionId={actionId}
//           featureName={featureName}
//           subFeatureName={subFeatureName}
//           showDelete={item[0]?.client_status === "inactive"}
//         />
//       </div>
//     </td>
//   ) : null}
// </tr> */
}
