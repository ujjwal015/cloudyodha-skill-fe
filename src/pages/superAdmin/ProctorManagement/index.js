import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  ASSESSOR_MANAGEMENT_ADD_NEW,
  ASSESSOR_MANAGEMENT_UPDATE,
  PROCTOR_MANAGEMENT_ADD_NEW,
  PROCTOR_MANAGEMENT_BULK_UPLOAD,
  PROCTOR_MANAGEMENT_UPDATE,
} from "../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../components/common/table";
import { FormSwitch } from "../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientManagementListsApi,
  clientManagementChangeStatusApi,
} from "../../../api/superAdminApi/clientManagement";
import CustomTablePagination from "../../../components/common/customPagination";
import { PropagateLoader, ClipLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "./../../../assets/icons/search-icon-grey.svg";
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
  getLocal,
  getSubRole,
  getUserType,
  handleTrimPaste,
  userRoleType,
} from "../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../components/common/DropDown";
import DeleteModal from "../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../redux/slicers/authSlice";
import DummyImage from "../../../assets/images/common/no-preview.png";
import { ReactComponent as CloseIcon } from "../../../assets/icons/CloseIcon.svg";
//modal
import Box from "@mui/material/Box";
// import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import FilterModal from "../../../components/common/Modal/FilterModal";
import validateField from "../../../utils/validateField";
import {
  changeStatusAssessorApi,
  deleteAssesorApi,
  getAssessorsApi,
} from "../../../api/superAdminApi/assessorManagement";
import {
  changeStatusProctorApi,
  deleteProctorApi,
  getProctorsApi,
} from "../../../api/superAdminApi/proctorManagement";
import { clientSelector } from "../../../redux/slicers/clientSlice";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import { ReactComponent as UploadIcon } from "../../../assets/icons/upload-cloud.svg";

const initialFormValues = {
  modeofAgreement_filter: "",
  agreementSigned: "",
  from: "",
  to: "",
};

const AssessorManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { assessorList = [] } = useSelector(authSelector);
  const { proctorsList = [] } = useSelector(clientSelector);
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

  // permission
  const { PROCTOR_FEATURE, PROCTOR_LIST_FEATURE } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = PROCTOR_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = PROCTOR_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const [isFilerApplied, setIsFilterApplied] = useState(false);
  const selectedClientId=getLocal("SelectedClientId")


  useEffect(()=>{
    setFormValues({
      ...formValues,
      clientId:selectedClientId
    })
  },[selectedClientId])


  useEffect(()=>{
    if(selectedClientId && formValues?.clientId){
      handleSubmitBasedonClientId()
    }

  },[selectedClientId,formValues?.clientId])

  // modal
  const [open, setOpen] = React.useState(false);
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

  const getList = (search = true, clearAll = false) => {
    setLoading(true);
    dispatch(
      getProctorsApi(
        setLoading,
        page,
        limit,
        search ? searchQuery : "",
        setTotalPages,
        clearAll ? initialFormValues : formValues
      )
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit]);

  useEffect(() => {
    if (renderDecider.length > 0) {
      setRenderDetails(renderDecider);
      setDeletePermitted(renderDecider[0].client?.delete);
      setEditPermitted(renderDecider[0].client?.edit);
    }
  }, [renderDecider.length]);

  useEffect(() => {
    setSortedData(proctorsList);
    setTotalPagesUser(totalPages);
  }, [proctorsList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...proctorsList].sort((a, b) => {
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

    // sortData();
  }, [proctorsList, sortOrders]);


  const handleStatusChange = (e, id) => {
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(id);
    const formData = {
      status: value,
    };
    setStatusLoading(true);
    dispatch(changeStatusProctorApi(id, formData, setStatusLoading, getList));
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
      setSearchQuery("");
      getList(null, false);
    }
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") setLoading(true);
    dispatch(getProctorsApi(setLoading, 1, limit, searchQuery, setTotalPages));
    setPage(1);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };
  const exportClientData = () => {
    const exportData = proctorsList?.map((item) => {
      return {
        photo: item?.[5]?.url,
        proctorID: item?.[0].proctorId,
        proctorName: item[0]?.proctorName,
        experience: item[0]?.experience,
        agreementSigned: item[0]?.agreementSigned,
        agreementValidity: item[0]?.agreementValidity,
        modeofAgreement: item[0]?.modeofAgreement,
        client_status: item[0]?.client_status,
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
    saveAs(blob, "Proctors List.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    dispatch(deleteProctorApi(setLoading, actionId, setDeleteModal, getList));
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
    navigate(`${PROCTOR_MANAGEMENT_UPDATE}/${actionId}`);
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
    localStorage.removeItem("SelectedClientId");
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
          getProctorsApi(
            setLoading,
            page,
            limit,
            searchQuery,
            setTotalPages,
            formValues,
            setIsFilterApplied
          )
        );
      else getList();
      handleCloseFilter();
    }
  };

  const handleSubmitBasedonClientId = () => {
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
          getProctorsApi(
            setLoading,
            page,
            limit,
            searchQuery,
            setTotalPages,
            formValues,
            setIsFilterApplied
          )
        );
      else getList();
      handleCloseFilter();
    }
  };


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
              <h2>Proctor Details</h2>
              <p>See All Details of Proctor here</p>
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
                          <span className="grey_text">Proctor Name</span>
                          <span className="bold_text">{`${assessorData[0]?.proctorName}`}</span>
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
        <div className="title_container">
          <h1>Proctors List</h1>
          <div className="title-btn">
            {isRolePermission?.permissions?.["2"] && (
              <>
                <button
                  onClick={() => navigate(PROCTOR_MANAGEMENT_BULK_UPLOAD)}
                  className="light-blue-btn"
                >
                  <UploadIcon width={18} height={18} />
                  <span>Bulk Upload</span>
                </button>
                <button
                  onClick={() => navigate(PROCTOR_MANAGEMENT_ADD_NEW)}
                  className="light-blue-btn"
                >
                  <PlusIcon />
                  <span>Add New</span>
                </button>
              </>
            )}
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
                      <td>{item?.[0]?.proctorId || "NA"}</td>
                      <td>
                        <div
                          className="assessor_details_modal"
                          onClick={(e) => handleOpen(item)}
                        >
                          {`${item?.[0].proctorName}`}
                        </div>
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
                              showEdit={isRolePermission?.permissions?.['3']}                          
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
        title="Delete Proctor"
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
    { name: "proctorID", label: "Proctor ID" },
    { name: "proctorName", label: "Name" },
    { name: "experience", label: "Experience" },
    { name: "agreementSigned", label: "Agreement Signed" },
    { name: "agreementValidity", label: "Agreement Validity" },
    { name: "modeofAgreement", label: "Proctor Mode" },
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
