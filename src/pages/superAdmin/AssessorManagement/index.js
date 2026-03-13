import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../assets/images/pages/clientManagement/plus-icon.svg";
import { ReactComponent as UploadIcon } from "../../../assets/icons/upload-cloud.svg";
import { ReactComponent as DownloadIcon } from "../../../assets/images/common/download-icon.svg";
import {
  ASSESSOR_MANAGEMENT_ADD_BULK_UPLOAD,
  ASSESSOR_MANAGEMENT_ADD_NEW,
  ASSESSOR_MANAGEMENT_HOME,
  ASSESSOR_MANAGEMENT_UPDATE,
  ASSESSOR_MANAGEMENT_VIEW,
  SUPER_ADMIN_EXAM_MANAGEMENT_EDIT_CANDIDATE_FORM_PAGE,
} from "../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../components/common/table";
import { FormSwitch } from "../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../components/common/customPagination";
import { PropagateLoader, ClipLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "./../../../assets/icons/search-icon-grey.svg";
import { ReactComponent as ResetPassword } from "../../../assets/icons/reset-password-icon.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete-icon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit-icon.svg";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  exportData,
  getSchemeType,
  getLocal,
  getSubRole,
  handleTrimPaste,
  userRoleType,
  removeLocal,
  removeLocalWithoutNavigatingTosignin,
} from "../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../components/common/DropDown";
import DeleteModal from "../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../redux/slicers/authSlice";
import DummyImage from "../../../assets/images/common/no-preview.png";
import { ReactComponent as CloseIcon } from "../../../assets/icons/CloseIcon.svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FilterModal from "../../../components/common/Modal/FilterModal";
import validateField from "../../../utils/validateField";
import {
  changeStatusAssessorApi,
  deleteAssesorApi,
  getAssessorsApi,
  unlockAssessorAccountApi,
  unlockAssessorOtpLockoutApi,
  downloadAssessorCvApi,
  masterExportCvsApi,
} from "../../../api/superAdminApi/assessorManagement";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import { Icon } from "@iconify/react";
import ResumePDF from "./Resume";
import JSZip from "jszip";
import { callSchemeApi } from "../../../api/superAdminApi/examManagement";
import { getSchemeList } from "../../../redux/slicers/superAdmin/examManagementSlice";
import ResetPasswordModal from "../examManagement/assignBatch/ResetPasswordModal";

const initialFormValues = {
  modeofAgreement_filter: "",
  agreementSigned: "",
  schemeType: "",
  from: "",
  to: "",
  state: "",
  schemeId: "",
  clientId: "",
};

const AssessorManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { assessorList = [] } = useSelector(authSelector);
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
  // const [candidateId, setCandidateId] = useState();
  const [assessorId, setAssessorId] = useState("");

  const { userInfo = {}, schemeList = [] } = useSelector(authSelector);
  const [docUrls, setDocUrls] = useState();
  const [section, setSection] = useState(
    location?.search?.split("=")?.["1"] || "All"
  );

  const [resetModal, setResetModal] = useState(false);
  const assessorManagementFromDashboard = getLocal(
    "assessorManagementFromDashboard"
  );

  const selectedClient = getLocal("SelectedClient");
  const selectedClientId = getLocal("SelectedClientId");

  const handleCloseResetModal = () => {
    setResetModal(false);
    setActionOpen(false);
  };

  const resetHandler = (id) => {
    setResetModal(true);
    setActionOpen(false);
    setAssessorId(id[0]?._id);
  };

  useEffect(() => {
    setFormValues({
      ...formValues,
      clientId: selectedClientId,
    });
  }, [selectedClientId]);

  useEffect(() => {
    if (selectedClientId && formValues?.clientId) {
      handleSubmitBasedOnClientId();
    }
  }, [selectedClientId, formValues?.clientId]);

  const [sectionFromDashboard, setSectionFromDashboard] = useState(
    getLocal("queryActiveAssessor")
  );

  // useEffect(()=>{
  //   return window.localStorage.removeItem("queryActiveAssessor");
  // },[])

  useEffect(() => {
    if (sectionFromDashboard?.section) {
      setSection(sectionFromDashboard?.section);
    }
  }, [sectionFromDashboard]);

  useEffect(() => {
    navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=${section}`);
  }, [section]);

  useEffect(() => {
    localStorage.getItem("bscInf_AsR") && localStorage.removeItem("bscInf_AsR");
  }, []);

  // permission
  const { ASSESSOR_MANAGEMENT_FEATURE, ASSESSOR_MANAGEMENT_LIST_FEATURE } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = ASSESSOR_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = ASSESSOR_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const [isFilerApplied, setIsFilterApplied] = useState(false);
  // modal
  const [open, setOpen] = React.useState(false);

  const masterAssessor = getLocal("masterAssessor");

  console.log("masterAssessor_masterAssessor", masterAssessor);

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

  const getList = async (search = true, clearAll) => {
    setLoading(true);
    dispatch(
      getAssessorsApi(
        setLoading,
        page,
        limit,
        search ? searchQuery : "",
        setTotalPages,
        clearAll ? initialFormValues : formValues,
        section,
        setIsFilterApplied,
        masterAssessor?.assessorType,
        assessorManagementFromDashboard
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    getList();
  }, [page, limit, section, assessorManagementFromDashboard?.dashboardClient]);

  useEffect(() => {
    if (section === "pending") {
      setPage(1);
    } else if (section === "verified") {
      setPage(1);
    } else {
      setPage(page);
    }
  }, [section]);

  useEffect(() => {
    if (renderDecider.length > 0) {
      setRenderDetails(renderDecider);
      setDeletePermitted(renderDecider[0].client?.delete);
      setEditPermitted(renderDecider[0].client?.edit);
    }
  }, [renderDecider, renderDecider.length]);

  useEffect(() => {
    setSortedData(assessorList);
    setTotalPagesUser(totalPages);
  }, [assessorList, totalPages]);

  const handleStatusChange = (e, id) => {
    e.preventDefault();
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(id);
    const formData = {
      status: value,
    };
    setStatusLoading(true);
    dispatch(changeStatusAssessorApi(id, formData, setStatusLoading, getList));
  };

  const handleUnlockAccount = (assessorId) => {
    setStatusLoading(true);
    setId(assessorId);
    dispatch(unlockAssessorAccountApi(assessorId, setStatusLoading, getList));
  };

  const handleUnlockOtpLockout = (assessorId) => {
    setStatusLoading(true);
    setId(assessorId);
    dispatch(
      unlockAssessorOtpLockoutApi(assessorId, setStatusLoading, getList)
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

  const handleChangeSearch = (e) => {
    const { value } = e.target;
    setSearchQuery(value);

    // If search is cleared, immediately fetch all data
    if (value === "") {
      setLoading(true);
      getList(false, false); // Don't search, don't clear filters
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") setLoading(true);

    dispatch(
      getAssessorsApi(
        setLoading,
        1,
        limit,
        searchQuery,
        setTotalPages,
        formValues,
        section,
        setIsFilterApplied,
        masterAssessor?.assessorType
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
    const exportData = [];

    assessorList?.forEach((item, index) => {
      const jobRoles = item[0]?.jobRole ?? [];
      console.log("jobRoles",jobRoles);
      
      // For the first job role, combine it with the general data
      if (jobRoles.length > 0) {
        const firstJobRole = jobRoles[0]; // First job role
        const firstRow = {
          _id: index + 1,
          assessorID: item?.[0]?.assessorId ?? "-",
          scheme:
            (item?.[0]?.scheme && handleSchemeType(item?.[0]?.scheme)) ?? "-",
          assessorSipId: item?.[0]?.assessorSipId ?? "-",
          fullName: item[0]?.fullName ?? "-",
          email: item[0]?.email ?? "-",
          mobile: item[0]?.mobile ?? "-",
          gender: item[0]?.gender ?? "-",
          dob: item[0]?.dob ?? "-",
          address: item[0]?.address ?? "-",
          state: item[0]?.state ?? "-",
          pincode: item[0]?.pinCode ?? "-",
          district: item[0]?.district ?? "-",
          RadiantFundToa:
            item[0]?.RadiantFundToa === true ? "Yes" : "No" ?? "-",
          ToaType: item[0]?.ToaType ?? "-",
          adhaar:
            item[0]?.personalDetail?.length > 0
              ? item[0]?.personalDetail[0]?.cardNo
              : "-",
          pancard:
            item[0]?.personalDetail?.length > 0
              ? item[0]?.personalDetail[1]?.cardNo
              : "-",
          education: item[0]?.education?.length > 0 ? "Yes" : "NA",
          previousExprience: item[0]?.experiences?.length > 0 ? "Yes" : "NA",
          bankName: item[0]?.bankName ?? "-",
          branchName: item[0]?.bankBranchName ?? "-",
          ifsc: item[0]?.bankIFSC ?? "-",
          accountNumber: item[0]?.bankAccount ?? "-",
          experience: processExperience(
            item[0]?.totalExperience?.years,
            item[0]?.totalExperience?.months
          ),
          agreementSigned: item[0]?.agreementSigned ?? "-",
          agreementValidity: item[0]?.agreementValidity ?? "-",
          modeofAgreement: item[0]?.modeofAgreement ?? "-",
          client_status: item[0]?.client_status ?? "-",
          jobRoleStart: firstJobRole?.issueDate ?? "-",
          jobRoleEnd: firstJobRole?.validUpto ?? "-",
          jobRole: firstJobRole?.jobroleName ?? "-",
          clientName: firstJobRole?.jobRoleClientName ?? "-",
        };

        exportData.push(firstRow);

        // Adding rows for subsequent job roles
        jobRoles.slice(1).forEach((role) => {
          const roleData = {
            _id: "",
            jobRoleStart: role?.issueDate ?? "-",
            jobRoleEnd: role?.validUpto ?? "-",
            jobRole: role?.jobroleName ?? "-",
            clientName: role?.jobRoleClientName ?? "-",
            // All other fields will be empty
            assessorID: "",
            scheme: "",
            assessorSipId: "",
            fullName: "",
            email: "",
            mobile: "",
            gender: "",
            dob: "",
            address: "",
            state: "",
            sector:"",
            pincode: "",
            district: "",
            RadiantFundToa: "",
            ToaType: "",
            adhaar: "",
            pancard: "",
            education: "",
            previousExprience: "",
            bankName: "",
            branchName: "",
            ifsc: "",
            accountNumber: "",
            experience: "",
            agreementSigned: "",
            agreementValidity: "",
            modeofAgreement: "",
            client_status: "",
          };
          exportData.push(roleData);
        });
      } else {
        const firstRow = {
          _id: index + 1,
          assessorID: item?.[0]?.assessorId ?? "-",
          scheme:
            item?.[0]?.scheme?.length > 0
              ? handleSchemeType(item?.[0]?.scheme)
              : "-",
          assessorSipId: item?.[0]?.assessorSipId ?? "-",
          fullName: item[0]?.fullName ?? "-",
          email: item[0]?.email ?? "-",
          mobile: item[0]?.mobile ?? "-",
          gender: item[0]?.gender ?? "-",
          dob: item[0]?.dob ?? "-",
          address: item[0]?.address ?? "-",
          state: item[0]?.state ?? "-",
          pincode: item[0]?.pinCode ?? "-",
          district: item[0]?.district ?? "-",
          RadiantFundToa:
            item[0]?.RadiantFundToa === true ? "Yes" : "No" ?? "-",
          ToaType: item[0]?.ToaType ?? "-",
          adhaar:
            item[0]?.personalDetail?.length > 0
              ? item[0]?.personalDetail[0]?.cardNo
              : "-",
          pancard:
            item[0]?.personalDetail?.length > 0
              ? item[0]?.personalDetail[1]?.cardNo
              : "-",
          education: item[0]?.education?.length > 0 ? "Yes" : "NA",
          previousExprience: item[0]?.experiences?.length > 0 ? "Yes" : "NA",
          bankName: item[0]?.bankName ?? "-",
          branchName: item[0]?.bankBranchName ?? "-",
          ifsc: item[0]?.bankIFSC ?? "-",
          accountNumber: item[0]?.bankAccount ?? "-",
          experience: processExperience(
            item[0]?.totalExperience?.years,
            item[0]?.totalExperience?.months
          ),
          agreementSigned: item[0]?.agreementSigned ?? "-",
          agreementValidity: item[0]?.agreementValidity ?? "-",
          modeofAgreement: item[0]?.modeofAgreement ?? "-",
          client_status: item[0]?.client_status ?? "-",
          jobRoleStart: item[0]?.jobRole?.issueDate ?? "-",
          jobRoleEnd: item[0]?.jobRole?.validUpto ?? "-",
          jobRole: item[0]?.jobRole?.jobroleName ?? "-",
          clientName: item[0]?.jobRole?.jobRoleClientName ?? "-",
        };

        exportData.push(firstRow);
      }
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
    saveAs(blob, "Assessors List.xlsx");
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

  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const editBtnHandler = () => {
    setShowActionBtn(false);
    navigate(`${ASSESSOR_MANAGEMENT_UPDATE}/${actionId}?section=${section}`);
  };

  const viewBtnHandler = (id) => {
    // setShowActionBtn(false);
    navigate(`${ASSESSOR_MANAGEMENT_VIEW}/${id}?section=${section}`);
  };

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
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

  const handleClearAll = () => {
    setFormValues(initialFormValues);
    setLoading(true);
    getList(true, true);
    handleCloseFilter();
    setIsFilterApplied(false);
    // setSearchQuery("");
    window.localStorage.removeItem("SelectedClient");
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
          getAssessorsApi(
            setLoading,
            page,
            limit,
            searchQuery,
            setTotalPages,
            formValues,
            section,
            setIsFilterApplied,
            masterAssessor?.assessorType
          )
        );
      else getList();
      handleCloseFilter();
    }
  };

  const handleSubmitBasedOnClientId = () => {
    // e.preventDefault();
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
          getAssessorsApi(
            setLoading,
            page,
            limit,
            searchQuery,
            setTotalPages,
            formValues,
            section,
            setIsFilterApplied,
            masterAssessor?.assessorType
          )
        );
      else getList();
      handleCloseFilter();
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        setLoading(true);
        dispatch(
          getAssessorsApi(
            setLoading,
            1,
            limit,
            searchQuery,
            setTotalPages,
            formValues,
            section,
            setIsFilterApplied,
            masterAssessor?.assessorType
          )
        );
        setPage(1);
      }
    }, 700);

    return () => clearTimeout(timeoutId);
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
    else if (yrs && mnth) return `${yrs}yr ${mnth}m`;
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

  const handleSchemeType = (schemeData = []) => {
    let pmVishwakarmaFound = false;
    let pmkvyFound = false;
    let nonPmKvyFound = false;

    const schemes = getSchemeType(schemeData);

    for (const scheme of schemes) {
      if (scheme === "PM Vishvakarma") {
        pmVishwakarmaFound = true;
      } else if (scheme === "PMKVY") {
        pmkvyFound = true;
      } else if (scheme === "Non PMKVY") {
        nonPmKvyFound = true;
      }
    }

    if (pmVishwakarmaFound && !pmkvyFound && !nonPmKvyFound) {
      return "PM Vishwakarma";
    } else if (
      schemeData.length > 0 &&
      (pmkvyFound || nonPmKvyFound) &&
      pmVishwakarmaFound
    ) {
      return "Both";
    } else if (
      schemeData.length > 0 &&
      (pmkvyFound || nonPmKvyFound) &&
      !pmVishwakarmaFound
    ) {
      return "General";
    }
  };

  const handleMasterExportCV = async () => {
    try {
      const params = {
        page: page,
        limit: limit,
        scheme: formValues.schemeType || "",
        status: section !== "All" ? section : "",
        search: searchQuery || "",
        modeofAgreement: formValues.modeofAgreement_filter || "",
        agreementSigned: formValues.agreementSigned || "",
        from: formValues.from || "",
        to: formValues.to || "",
        state: formValues.state || "",
        clientId: formValues.clientId || "",
      };

      dispatch(masterExportCvsApi(params, setLoading));
    } catch (error) {
      console.error("Error exporting CVs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCv = (user) => {
    console.log("user[0]", user[0]);
    const assessorId = user[0]?.assessorId;
    const name = `${user[0]?.fullName.replace(" ", "_")}_Resume.pdf`;
    if (assessorId) {
      dispatch(downloadAssessorCvApi(assessorId, name, setLoading));
    }
  };

  const handleClearMasterAssessorFilter = () => {
    removeLocalWithoutNavigatingTosignin("masterAssessor");
    setLoading(true);
    dispatch(
      getAssessorsApi(
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
  };

  return (
    <div className="main-content">
      <div className="title" style={{ display: "block" }}>
        <h1>Assessor Management</h1>
        <div className="title-btn" style={{ paddingTop: "10px" }}>
          <div className="sub_sections" style={{ paddingTop: "10px" }}>
            <button
              onClick={() => handleSection("All")}
              style={{
                cursor: "pointer",
                background: [section != "All" ? "white" : ""],
                color: [section != "All" ? "#00b2ff" : ""],
                border: [section != "All" ? "1px solid #00b2ff" : ""],
              }}
            >
              <span>All Assessors</span>
            </button>
            <button
              onClick={() => handleSection("verified")}
              style={{
                cursor: "pointer",
                background: [section != "verified" ? "white" : ""],
                color: [section != "verified" ? "#00b2ff" : ""],
                border: [section != "verified" ? "1px solid #00b2ff" : ""],
              }}
            >
              <span>Verified</span>
            </button>
            <button
              onClick={() => handleSection("pending")}
              style={{
                cursor: "pointer",
                background: [section != "pending" ? "white" : ""],
                color: [section != "pending" ? "#00b2ff" : ""],
                border: [section != "pending" ? "1px solid #00b2ff" : ""],
              }}
            >
              <span>Pending Approval</span>
            </button>
          </div>
          {isRolePermission?.permissions?.["2"] && (
            <div className="bulk-upload-container">
              <button
                onClick={() =>
                  navigate(
                    `${ASSESSOR_MANAGEMENT_ADD_BULK_UPLOAD}?section=${section}`
                  )
                }
              >
                <UploadIcon width={18} height={18} />
                <span>Bulk Upload</span>
              </button>
              <button
                onClick={() =>
                  navigate(`${ASSESSOR_MANAGEMENT_ADD_NEW}?section=${section}`)
                }
              >
                <PlusIcon />
                <span>Add New</span>
              </button>
            </div>
          )}
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
            {masterAssessor?.assessorType && (
              <button
                className="filter-btn clear_all_btn"
                onClick={handleClearMasterAssessorFilter}
              >
                Master Assessor
              </button>
            )}
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
            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={
                  loading || sortedData?.length == 0
                    ? undefined
                    : handleMasterExportCV
                }
              >
                {loading ? (
                  <ClipLoader size={14} color="#24273" />
                ) : (
                  "Master Export CV"
                )}
              </button>
            )}
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <TableHeader
              columns={getTableColumns(isRolePermission)}
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
                        {
                          <div className="assessor_photo_container">
                            {item?.find((el) => {
                              if (el?.key === "assessorPhoto") return true;
                            }) ? (
                              <img
                                src={
                                  item?.find((el) => {
                                    if (el?.key === "assessorPhoto")
                                      return el?.url;
                                  })?.url
                                }
                                alt=""
                              />
                            ) : (
                              <img src={DummyImage} alt="" />
                            )}
                          </div>
                        }
                      </td>
                      {/* <td>{item?.[0]?.assessorId || "-"}</td> */}
                      <td>{item?.[0]?.assessorType || "-"}</td>
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
                      </td>
                      <td>
                        {item?.[0]?.scheme?.length > 0
                          ? handleSchemeType(item?.[0]?.scheme)
                          : // ? getSchemeType(item?.[0]?.scheme)
                            "-"}
                      </td>
                      <td>{item?.[0]?.assessorSipId || "-"}</td>
                      <td>{item?.[0]?.fullName || "-"}</td>
                      <td>{item?.[0]?.ToaType || "-"}</td>
                      <td>
                        {item[0]?.jobRole?.length > 0 ? (
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
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ paddingRight: "40px" }}>
                        {item?.[0]?.sector?.length > 1 ? (
                          <Tooltip title={item?.[0]?.sector?.map((el) => el?.sectorName).join(", ") || ""} arrow>
                            <div
                              style={{
                                display: "inline-block", 
                                maxWidth: "120px",      
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                verticalAlign: "middle",
                              }}
                            >
                              {item?.[0]?.sector?.map((el) => el?.sectorName).join(", ") || ""}
                            </div>
                          </Tooltip>
                        ) : (
                          <div style={{ verticalAlign: "middle" }}>
                            {item?.[0]?.sector?.[0]?.sectorName || "-"}
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
                      </td>
                      <td>{item?.[0]?.agreementValidity || "-"}</td>

                      <td>
                        <Icon
                          icon={"mdi:eye"}
                          width={20}
                          onClick={() => viewBtnHandler(item?.[0]?._id)}
                          style={{ color: "#00b2ff", cursor: "pointer" }}
                        />
                      </td>
                      <td>
                        <span
                          onClick={() => handleDownloadCv(item)}
                          style={{ cursor: "pointer" }}
                        >
                          <DownloadIcon width={20} />
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {item[0]?.isAccountLocked ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleUnlockAccount(item?.[0]?._id)
                              }
                              disabled={statusLoading && item?.[0]?._id === id}
                              style={{
                                background: "#ff6b6b",
                                color: "white",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "10px",
                                cursor:
                                  statusLoading && item?.[0]?._id === id
                                    ? "not-allowed"
                                    : "pointer",
                                opacity:
                                  statusLoading && item?.[0]?._id === id
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {statusLoading && item?.[0]?._id === id
                                ? "..."
                                : "Unlock Account"}
                            </button>
                            <button
                              onClick={() =>
                                handleUnlockOtpLockout(item?.[0]?._id)
                              }
                              disabled={statusLoading && item?.[0]?._id === id}
                              style={{
                                background: "#ffa726",
                                color: "white",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "10px",
                                cursor:
                                  statusLoading && item?.[0]?._id === id
                                    ? "not-allowed"
                                    : "pointer",
                                opacity:
                                  statusLoading && item?.[0]?._id === id
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {statusLoading && item?.[0]?._id === id
                                ? "..."
                                : "Unlock OTP"}
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#4caf50", fontSize: "12px" }}>
                            Account Unlocked
                          </span>
                        )}
                      </td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td style={{ textAlign: "center" }}>
                          <FormSwitch
                            value={
                              item[0]?.client_status == "active" ? true : false
                            }
                            onChange={(e) =>
                              handleStatusChange(e, item?.[0]?._id)
                            }
                            disabled={statusLoading && item?.[0]?._id === id}
                          />
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
                      ) : null}
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
    </div>
  );
};

export default AssessorManagement;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "S.NO" },
    { name: "photo", label: "Photo" },
    // { name: "assessorID", label: "Assessor ID" },
    { name: "scheme", label: "Scheme" },
    { name: "fullName", label: "Assessor Name" },
    { name: "assessorSipId", label: "Assessor SIP ID" },
    { name: "email", label: "Email" },
    { name: "mobile", label: "Mobile Number" },
    { name: "gender", label: "Gender" },
    { name: "dob", label: "Date of Berth" },
    { name: "address", label: "Address" },
    { name: "state", label: "State" },
    { name: "pincode", label: "Pincode" },
    { name: "district", label: "District" },
    { name: "RadiantFundToa", label: "Does Randiant Funded You In Training?" },
    { name: "ToaType", label: "TOA Type" },
    { name: "adhaar", label: "Adhaar Card" },
    { name: "pancard", label: "Pancard" },
    { name: "education", label: "Education Details" },
    { name: "previousExprience", label: "Previous Experience" },
    { name: "bankName", label: "Bank Name" },
    { name: "branchName", label: "Branch Name" },
    { name: "ifsc", label: "IFSC Code" },
    { name: "accountNumber", label: "Bank Account Number" },
    { name: "jobRole", label: "Job Role" },
    { name: "jobRoleStart", label: "Job Role Start Date" },
    { name: "jobRoleEnd", label: "Job Role End Date" },
    { name: "experience", label: "Experience" },
    { name: "agreementSigned", label: "Agreement Signed" },
    { name: "agreementValidity", label: "Agreement Validity" },
    { name: "modeofAgreement", label: "Assessor Mode" },
    { name: "viewDetails", label: "Details" },
    { name: "client_status", label: "STATUS" },
    { name: "actions", label: "ACTIONS" },
  ];
  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns?.filter((column) => column?.name !== "client_status");
  }
  if (
    !isRolePermission?.permissions?.["3"] &&
    !isRolePermission?.permissions?.["4"]
  ) {
    columns = columns?.filter((column) => column?.name !== "actions");
  }
  return columns;
};

const getTableColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "S.NO" },
    { name: "photo", label: "Photo" },
    // { name: "assessorID", label: "Assessor ID" },
    { name: "assessorType", label: "Assessor Type" },
    { name: "modeofAgreement", label: "Assessor Mode" },
    { name: "scheme", label: "Scheme" },
    { name: "assessorSipId", label: "Assessor SIP ID" },
    { name: "assessorName", label: "Assessor Name" },

    // { name: "email", label: "Email" },
    // { name: "mobile", label: "Mobile Number" },
    // { name: "gender", label: "Gender" },
    // { name: "dob", label: "Date of Berth" },
    // { name: "address", label: "Address" },
    // { name: "state", label: "State" },
    // { name: "pincode", label: "Pincode" },
    // { name: "district", label: "District" },
    { name: "ToaType", label: "TOA Type" },
    // { name: "funding", label: "DOES RADIANT FUNDED YOU IN TRAINING" },
    // { name: "adhaar", label: "ADHAAR CARD" },
    // { name: "pancard", label: "PANCARD" },
    // { name: "education", label: "EDUCATION DETAILS" },
    // { name: "previousExprience", label: "PREVIOUS EXPERIENCE" },
    // { name: "bankName", label: "BANK NAME" },
    // { name: "branchName", label: "BRANCH NAME" },
    // { name: "ifsc", label: "IFSC CODE" },
    // { name: "accountNumber", label: "BANK ACCOUNT NUMBER" },
    { name: "jobRole", label: "Job Role" },
    { name: "sector", label: "Sector"},
    { name: "experience", label: "Experience" },
    { name: "agreementSigned", label: "Agreement Signed" },
    { name: "agreementValidity", label: "Agreement Validity" },
    { name: "viewDetails", label: "View" },
    { name: "resume", label: "CV" },
    { name: "accountLockStatus", label: "Account Lock Status" },
    { name: "client_status", label: "STATUS" },
    { name: "actions", label: "ACTIONS" },
  ];

  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns?.filter((column) => column?.name !== "client_status");
  }
  // if (
  //   !isRolePermission?.permissions?.["3"] &&
  //   !isRolePermission?.permissions?.["4"]
  // ) {
  //   columns = columns?.filter((column) => column?.name !== "actions");
  // }

  return columns;
};
