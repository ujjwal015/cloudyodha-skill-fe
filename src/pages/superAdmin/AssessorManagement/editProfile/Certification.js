import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import { Button } from "@mui/material";
import UserProfile from "./../../../../assets/images/pages/clientManagement/dummy-user-profile.png";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Icon } from "@iconify/react";
import Input from "../../../../components/common/input";
import DateInput from "../../../../components/common/DateInput";
import { ReactComponent as UploadIcon } from "./../../../../assets/icons/upload-cloud-file.svg";
import { ReactComponent as DeleteIcon } from "./../../../../assets/icons/delete-icon.svg";
import PDFIcon from "./../../../../assets/new-icons/IconPDF.svg";
import ExperienceIcon from "./../../../../assets/new-icons/ExperienceIcon.svg";
import Dropzone from "react-dropzone";
import dayjs from "dayjs";
import {
  deleteAssessorAgreementApi,
  deleteAssessorEducationeApi,
  deleteAssessorExperienceApi,
  deleteAssessorJobroleApi,
  getAssessorAgreementDetailsApi,
  getAssessorEducationDetailsApi,
  getAssessorExperienceDetailsApi,
  getAssessorJobrolesDetailsApi,
  updateAssessorAgreementApi,
  updateAssessorEducationApi,
  updateAssessorExperienceApi,
  updateAssessorJobroleApi,
  uploadAssessorAgreementApi,
  uploadAssessorEducationApi,
  uploadAssessorExperienceApi,
  uploadAssessorJobroleApi,
} from "../../../../api/superAdminApi/assessorManagement";
import { RiseLoader } from "react-spinners";
import {
  assessorAttendanceSelector,
  getAgreementDetails,
  getEducationDetails,
  getExperienceDetails,
} from "../../../../redux/slicers/superAdmin/assessorAttendanceSlice";
import { ALPHABETIC_SORT, errorToast, getSchemeType } from "../../../../utils/projectHelper";
import SelectInput from "../../../../components/common/SelectInput";
import { getAllJobRoles } from "../../../../api/superAdminApi/jobRoleManagement";
import Image from "../Image.js";

const experienceInitialValues = () => {
  return {
    designation: "",
    companyName: "",
    startDate: "",
    endDate: "",
    experienceCertificate: "",
  };
};

const educationInitialValues = () => {
  return {
    collegeName: "",
    degree: "",
    startDate: "",
    endDate: "",
    educationCertificate: "",
  };
};

const agreementInitialValues = () => {
  return {
    agreementName: "",
    agreementValidFrom: "",
    agreementValidTo: "",
    agreementCertificate: "",
  };
};
const jobRoleInitialValues = () => {
  return {
    jobroleName: "",
    experience: "",
    issueDate: "",
    validUpto: "",
    jobRoleCertificate: "",
  };
};

const Certification = ({schemeType}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [ImgURL, setImgURL] = useState(UserProfile);
  const { jobRolesListAll = [] } = useSelector(clientManagementSelector);
  const [jobRoles, setJobRoles] = useState();
  const [focusedInput, setFocusedInput] = useState("");
  const [experienceDetails, setExperienceDetails] = useState(
    experienceInitialValues()
  );
  const [educationDetails, setEducationDetails] = useState(
    educationInitialValues()
  );
  const [agreementFormValues, setAgreementFormValues] = useState(
    agreementInitialValues()
  );
  const [jobRoleFormValues, setJobRoleFormValues] = useState(
    jobRoleInitialValues()
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openExp, setOpenExp] = useState(false);
  const params = useParams();
  const assessorMDBId = params.id;
  const {
    assessorExperienceDetails = [],
    educationDetailsNew = [],
    agreementDetails = [],
    jobrolesDetails = [],
  } = useSelector(assessorAttendanceSelector);

  const [activeSection, setActiveSection] = useState("exp");
  const [tabDegreeValue, setTabDegreeValue] = useState(0);
  const [isEditActive, setIsEditActive] = useState(false);

  const [endDateLimit, setEndDateLimitExp] = useState();
  const [startDateLimit, setStartDateLimitExp] = useState();

  const [endDateLimitEdc, setEndDateLimitEdc] = useState();
  const [startDateLimitEdc, setStartDateLimitEdc] = useState();

  const [endDateLimitAgr, setEndDateLimitAgr] = useState();
  const [startDateLimitAgr, setStartDateLimitAgr] = useState();

  const [endDateLimitJbc, setEndDateLimitJbc] = useState();
  const [startDateLimitJbc, setStartDateLimitJbc] = useState();

  useEffect(()=>{
    if(schemeType.length>0){
      if (getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY") ){
        setTabDegreeValue(0)
        setActiveSection('exp')
      }
      else{
        setTabDegreeValue(3)
        setActiveSection("jbc")
      }
    }
  },[schemeType])

  useEffect(() => {
    dispatch(getExperienceDetails([]));
    dispatch(getEducationDetails([]));
    dispatch(getAgreementDetails([]));
  }, []);

  const getList = () => {
    if (assessorMDBId) {
      if (activeSection === "exp" && tabDegreeValue === 0) {
        setLoading(true);
        dispatch(getAssessorExperienceDetailsApi(setLoading, assessorMDBId));
      } else if (activeSection === "edc" && tabDegreeValue === 1) {
        setLoading(true);
        dispatch(getAssessorEducationDetailsApi(setLoading, assessorMDBId));
      } else if (activeSection === "agr" && tabDegreeValue === 2) {
        setLoading(true);
        dispatch(getAssessorAgreementDetailsApi(setLoading, assessorMDBId));
      } else if (tabDegreeValue === 3) {
        dispatch(getAllJobRoles(setLoading, Infinity, Infinity, "", 1));
        dispatch(getAssessorJobrolesDetailsApi(setLoading, assessorMDBId));
      }
    }
  };

  useEffect(() => {
    getList();
  }, [tabDegreeValue]);

  useEffect(() => {
    if (jobRolesListAll.length > 0) {
      const JobRolesArray = new Array();
      jobRolesListAll.map((el) => {
        const option = {
          label: el?.jobRole,
          value: el?.jobRole,
        };
        JobRolesArray.push(option);
      });
      setJobRoles([...JobRolesArray]);
    }
  }, [jobRolesListAll]);

  const handleTabDegreeChange = (event, newValue) => {
    if (
      newValue === 0 &&
      !(getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY"))
    ) {
      setActiveSection("jbc");
      setTabDegreeValue(3);
    }
    else{
      if (newValue === 1) setActiveSection("edc");
      else if (newValue === 2) setActiveSection("agr");
      else if (newValue === 3) setActiveSection("jbc");
      else setActiveSection("exp");
      setTabDegreeValue(newValue);
    }
  };

  const handleClickDialogOpen = (e) => {
    e.preventDefault();
    setOpenExp(true);
  };

  const handleDialogClose = (e) => {
    e.preventDefault();
    clearFormValues();
    setIsEditActive(false);
    setOpenExp(false);
    setErrors({});
  };
  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };
  const blurHandler = () => {
    setFocusedInput("");
  };

  const changeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const formErrors = {};
    const fieldError = validateField(name, value);
    if (activeSection === "exp")
      setExperienceDetails({ ...experienceDetails, [name]: value });
    else if (activeSection === "edc")
      setEducationDetails({ ...educationDetails, [name]: value });
    else if (activeSection === "agr")
      setAgreementFormValues({ ...agreementFormValues, [name]: value });
    else setJobRoleFormValues({ ...jobRoleFormValues, [name]: value });

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };
  const dateChangeHandler = (e, name) => {
    const formattedDate = dayjs(e).format("MM-DD-YYYY");
    const fieldError = validateField(name, formattedDate);

    if (activeSection === "exp") {
      setExperienceDetails((pre) => ({ ...pre, [name]: formattedDate }));
    } else if (activeSection === "edc") {
      setEducationDetails((pre) => ({ ...pre, [name]: formattedDate }));
    } else if (activeSection === "agr") {
      setAgreementFormValues((pre) => ({ ...pre, [name]: formattedDate }));
    } else setJobRoleFormValues((pre) => ({ ...pre, [name]: formattedDate }));

    if (fieldError) {
      setErrors({
        [`${name}`]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const loadFile = (e) => {
    setErrors({});
    const { files } = e.target;
    const allSelectedFiles = Object.keys(files).map((el, ind) => {
      return files[ind];
    });

    setSelectedFiles([...allSelectedFiles]);
    if (activeSection === "exp") {
      setExperienceDetails((pre) => ({
        ...pre,
        experienceCertificate: allSelectedFiles[0],
      }));
    } else if (activeSection === "edc") {
      setEducationDetails((pre) => ({
        ...pre,
        educationCertificate: allSelectedFiles[0],
      }));
    } else if (activeSection === "agr") {
      setAgreementFormValues((pre) => ({
        ...pre,
        agreementCertificate: allSelectedFiles[0],
      }));
    } else if (activeSection === "jbc") {
      setJobRoleFormValues((pre) => ({
        ...pre,
        jobRoleCertificate: allSelectedFiles[0],
      }));
    }
  };

  const deleteFileExp = (e, ind) => {
    const allFiles = [...selectedFiles];
    allFiles.splice(ind, 1);
    setSelectedFiles([...allFiles]);
  };

  const clearFormValues = () => {
    setSelectedFiles([]);
    setExperienceDetails(experienceInitialValues());
    setEducationDetails(educationInitialValues());
    setAgreementFormValues(agreementInitialValues());
    setJobRoleFormValues(jobRoleInitialValues());
    removeAllLimiters();
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formErrors = {};

    if (activeSection === "exp") {
      Object.keys(experienceDetails).forEach((name) => {
        const value = experienceDetails[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);
    } else if (activeSection === "edc") {
      Object.keys(educationDetails).forEach((name) => {
        const value = educationDetails[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);
    } else if (activeSection === "agr") {
      Object.keys(agreementFormValues).forEach((name) => {
        const value = agreementFormValues[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);
    } else if (activeSection === "jbc") {
      Object.keys(jobRoleFormValues).forEach((name) => {
        const value = jobRoleFormValues[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);
    }

    if (Object.keys(formErrors).length === 0) {
      if (assessorMDBId) {
        if (activeSection === "exp") {
          const data = createFormData(experienceDetails);
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
        } else if (activeSection === "edc") {
          const data = createFormData(educationDetails);
          setLoading(true);
          dispatch(
            uploadAssessorEducationApi(
              data,
              setLoading,
              assessorMDBId,
              setTabDegreeValue,
              clearFormValues,
              setOpenExp,
              setSelectedFiles
            )
          );
        } else if (activeSection === "agr") {
          const data = createFormData(agreementFormValues);
          setLoading(true);
          dispatch(
            uploadAssessorAgreementApi(
              data,
              setLoading,
              assessorMDBId,
              setTabDegreeValue,
              clearFormValues,
              setOpenExp,
              setSelectedFiles
            )
          );
        } else if (activeSection === "jbc") {
          const data = createFormData(jobRoleFormValues);
          setLoading(true);
          dispatch(
            uploadAssessorJobroleApi(
              data,
              setLoading,
              assessorMDBId,
              setTabDegreeValue,
              clearFormValues,
              setOpenExp,
              setSelectedFiles
            )
          );
        }
      } else {
        setOpenExp(false);
        clearFormValues();
        errorToast("Please fill basic info first");
      }
    }
  };

  function formatMonthYear(inputDate) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const dateParts = inputDate.split("-").map(Number);
    const monthIndex = dateParts[0] - 1;  // Convert mm to 0-based index
  
    const monthName = months[monthIndex];
    const year = dateParts[2];
  
    return `${monthName} ${year}`;
  }
  
  function getCurrentDate() {
    const currentDate = new Date();
  
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString();
  
    return `${month}-${day}-${year}`; // mm-dd-yyyy format
  }
  
  function dateDuration(date1, date2) {
    if (!date1) return "Invalid Dates";
    if (!date2) {
      date2 = getCurrentDate();
    }
  
    const date1Parts = date1.split("-").map(Number);
    const date2Parts = date2.split("-").map(Number);

    const date1Obj = new Date(date1Parts[2], date1Parts[0] - 1, date1Parts[1]); // yyyy-mm-dd
    const date2Obj = new Date(date2Parts[2], date2Parts[0] - 1, date2Parts[1]); // yyyy-mm-dd

    let monthsDiff = (date2Obj.getFullYear() - date1Obj.getFullYear()) * 12 + (date2Obj.getMonth() - date1Obj.getMonth());
  
    if (date2Obj.getDate() < date1Obj.getDate()) {
      monthsDiff--;
    }

    const years = Math.floor(monthsDiff / 12);
    const months = monthsDiff % 12;

    const startDate = formatMonthYear(date1);
    const endDate = formatMonthYear(date2);

    if (years > 0) {
      return `${startDate} - ${date2 === getCurrentDate() ? "Present" : endDate} (${years}yrs ${months}months)`;
    } else {
      return `${startDate} - ${date2 === getCurrentDate() ? "Present" : endDate} (${months} months)`;
    }
  }
  
  
  const editDetailsHandler = (e, id, index) => {
    e.preventDefault();
    setIsEditActive(true);
    if (activeSection === "exp") {
      const targetDetails = assessorExperienceDetails[index];
      setExperienceDetails({ ...targetDetails });
      setOpenExp(true);
    } else if (activeSection === "edc") {
      const targetDetails = educationDetailsNew[index];
      setEducationDetails({ ...targetDetails });
      setOpenExp(true);
    } else if (activeSection === "agr") {
      const targetDetails = agreementDetails[index];
      setAgreementFormValues({ ...targetDetails });
      setOpenExp(true);
    } else if (activeSection === "jbc") {
      const targetDetails = jobrolesDetails[index];
      setJobRoleFormValues({ ...targetDetails });
      setOpenExp(true);
    }
  };

  const handleUpdate = (e, section) => {
    e.preventDefault();
    const formErrors = {};

    if (activeSection === "exp") {
      Object.keys(experienceDetails).forEach((name) => {
        const value = experienceDetails[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);
    } else if (activeSection === "edc") {
      Object.keys(educationDetails).forEach((name) => {
        const value = educationDetails[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);
    } else if (activeSection === "agr") {
      Object.keys(agreementFormValues).forEach((name) => {
        const value = agreementFormValues[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);
    } else if (activeSection === "jbc") {
      Object.keys(jobRoleFormValues).forEach((name) => {
        const value = jobRoleFormValues[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);
    }

    if (Object.keys(formErrors).length === 0) {
      if (assessorMDBId) {
        if (activeSection === "exp") {
          const data = createFormData(experienceDetails);
          const itemID = experienceDetails?._id;
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
              itemID
            )
          );
          setIsEditActive(false);
        } else if (activeSection === "edc") {
          const data = createFormData(educationDetails);
          const itemID = educationDetails?._id;
          setLoading(true);
          dispatch(
            updateAssessorEducationApi(
              data,
              setLoading,
              assessorMDBId,
              setTabDegreeValue,
              clearFormValues,
              setOpenExp,
              setSelectedFiles,
              itemID
            )
          );
          setIsEditActive(false);
        } else if (activeSection === "agr") {
          const data = createFormData(agreementFormValues);
          const itemID = agreementFormValues?._id;
          setLoading(true);
          dispatch(
            updateAssessorAgreementApi(
              data,
              setLoading,
              assessorMDBId,
              setTabDegreeValue,
              clearFormValues,
              setOpenExp,
              setSelectedFiles,
              itemID
            )
          );
          setIsEditActive(false);
        } else if (activeSection === "jbc") {
          const data = createFormData(jobRoleFormValues);
          const itemID = jobRoleFormValues?._id;
          setLoading(true);
          dispatch(
            updateAssessorJobroleApi(
              data,
              setLoading,
              assessorMDBId,
              setTabDegreeValue,
              clearFormValues,
              setOpenExp,
              setSelectedFiles,
              itemID
            )
          );
          setIsEditActive(false);
        }
      } else {
        setOpenExp(false);
        clearFormValues();
        errorToast("Please fill basic info first");
      }
    }
  };

  const updateEditActiveStatus=()=>{
    setIsEditActive(false);
  }

  const handleDelete = (e) => {
    e.preventDefault();
    if (activeSection === "exp") {
      const itemID = experienceDetails?._id;
      dispatch(
        deleteAssessorExperienceApi(
          setLoading,
          assessorMDBId,
          itemID,
          setOpenExp,
          getList,
          clearFormValues,
          updateEditActiveStatus
        )
      );
    } else if (activeSection === "edc") {
      const itemID = educationDetails?._id;
      dispatch(
        deleteAssessorEducationeApi(
          setLoading,
          assessorMDBId,
          itemID,
          setOpenExp,
          getList,
          clearFormValues,
          updateEditActiveStatus
          // setItemID
        )
      );
    } else if (activeSection === "agr") {
      const itemID = agreementFormValues?._id;
      dispatch(
        deleteAssessorAgreementApi(
          setLoading,
          assessorMDBId,
          itemID,
          setOpenExp,
          getList,
          clearFormValues,
          updateEditActiveStatus
          // setItemID
        )
      );
    } else if (activeSection === "jbc") {
      const itemID = jobRoleFormValues?._id;
      dispatch(
        deleteAssessorJobroleApi(
          setLoading,
          assessorMDBId,
          itemID,
          setOpenExp,
          getList,
          clearFormValues,
          updateEditActiveStatus
          // setItemID
        )
      );
    }
  };

  function convertDate(dateStr) {
    const [month, day, year] = dateStr.split("-");
    const formattedDate = `${year}-${month}-${day}T00:00:00.000`;
    return formattedDate;
  }

  const processStartDate = () => {
    if (experienceDetails?.startDate) {
      const formattedDate = convertDate(experienceDetails?.startDate);
      setEndDateLimitExp(dayjs(formattedDate));
    } else if (educationDetails.startDate) {
      const formattedDate = convertDate(educationDetails?.startDate);
      setEndDateLimitEdc(dayjs(formattedDate));
    } else if (agreementFormValues.agreementValidFrom) {
      const formattedDate = convertDate(agreementFormValues.agreementValidFrom);
      setEndDateLimitAgr(dayjs(formattedDate));
    } else if (jobRoleFormValues.issueDate) {
      const formattedDate = convertDate(jobRoleFormValues.issueDate);
      setEndDateLimitJbc(dayjs(formattedDate));
    } else return false;
  };

  const processEndDate = () => {
    if (experienceDetails?.endDate) {
      const formattedDate = convertDate(experienceDetails?.endDate);
      setStartDateLimitExp(dayjs(formattedDate));
    } else if (educationDetails.endDate) {
      const formattedDate = convertDate(educationDetails?.endDate);
      setStartDateLimitEdc(dayjs(formattedDate));
    } else if (agreementFormValues.agreementValidTo) {
      const formattedDate = convertDate(agreementFormValues.agreementValidTo);
      setStartDateLimitAgr(dayjs(formattedDate));
    } else if (jobRoleFormValues.validUpto) {
      const formattedDate = convertDate(jobRoleFormValues.validUpto);
      setStartDateLimitJbc(dayjs(formattedDate));
    } else return false;
  };

  useEffect(() => {
    processStartDate();
  }, [
    experienceDetails?.startDate,
    educationDetails.startDate,
    agreementFormValues.agreementValidFrom,
    jobRoleFormValues.issueDate,
  ]);

  useEffect(() => {
    processEndDate();
  }, [
    experienceDetails?.endDate,
    educationDetails.endDate,
    agreementFormValues.agreementValidTo,
    jobRoleFormValues.validUpto,
  ]);

  function removeAllLimiters() {
    setEndDateLimitExp(null);
    setStartDateLimitExp(null);
    setEndDateLimitEdc(null);
    setStartDateLimitEdc(null);
    setEndDateLimitAgr(null);
    setStartDateLimitAgr(null);
    setEndDateLimitJbc(null);
    setStartDateLimitJbc(null);
  }

  return (
    <section className="sub-admin-wrapper">
      <div className="tab-content">
        <div className="edit-profile" style={{ display: "block" }}>
          <div className="tab-wrapper">
            <div className="form_title">
              <h1>Degree & Certifications</h1>
            </div>
            <div className="form">
              <div className="Certifications__tabpanel">
                <Box
                  sx={{
                    borderRight: 1,
                    borderColor: "divider",
                    width: "25%",
                  }}
                >
                  <Tabs
                    orientation="vertical"
                    sx={{
                      "& button": {
                        textTransform: "capitalize",
                        alignItems: "flex-start",
                      },
                    }}
                    value={tabDegreeValue}
                    onChange={handleTabDegreeChange}
                    aria-label="assessor tabs"
                  >
                    {(getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY") ) && <Tab label="Previous Experience" {...a12yProps(0)} />}
                    {(getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY") ) && <Tab label="Educational Details" {...a12yProps(1)} />}
                    {(getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY") ) && <Tab label="Agreement" {...a12yProps(2)} />}
                    <Tab label="Job role Certificate" {...a12yProps(3)} />
                  </Tabs>
                </Box>
                <AssessorTabDegreePanel
                  tabDegreeValue={tabDegreeValue}
                  index={0}
                >
                  <div className="Degree__tabBox">
                    <div className="Degree__title">
                      <h4>Previous Experience</h4>
                      <p>Edit or Update the Total Experience</p>
                    </div>
                    <button onClick={handleClickDialogOpen} className="add-exp">
                      Add Experience
                    </button>
                  </div>
                  {assessorExperienceDetails.length > 0 ? (
                    assessorExperienceDetails.map((item, index) => (
                      <div key={index} className="Degree__contentBox">
                        <div className="Degree__contentBox_title">
                        <Image certificateName={item?.experienceCertificateName} />
                          <div>
                            <h3>{item?.designation || "-"} </h3>
                            <h5>{item?.companyName || "-"}</h5>
                            <p>
                              {dateDuration(item?.startDate, item?.endDate) ||
                                "-"}
                            </p>
                            <a
                              href={item?.url}
                              target="location"
                              className="file_link"
                            >
                              {item?.experienceCertificateName}
                            </a>
                          </div>
                        </div>
                        <div
                          onClick={handleClickDialogOpen}
                          className="edit__icon_box"
                        >
                          <Icon
                            className="edit__icon"
                            icon="fluent:edit-32-regular"
                            onClick={(e) =>
                              editDetailsHandler(e, item?._id, index, "exp")
                            }
                          ></Icon>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="Degree__contentBox">
                      <p style={{ fontSize: "12px" }}>No Results Found</p>
                    </div>
                  )}
                </AssessorTabDegreePanel>

                <AssessorTabDegreePanel
                  tabDegreeValue={tabDegreeValue}
                  index={1}
                >
                  <div className="Degree__tabBox">
                    <div className="Degree__title">
                      <h4>Educational Details</h4>
                      <p>Edit or Update the Total Experience</p>
                    </div>
                    <button className="add-exp" onClick={handleClickDialogOpen}>
                      Add Education
                    </button>
                  </div>
                  {educationDetailsNew.length > 0 ? (
                    educationDetailsNew.map((item, index) => (
                      <div key={index} className="Degree__contentBox">
                        <div className="Degree__contentBox_title">
                        <Image certificateName={item?.educationCertificateName} />

                          <div>
                            <h3>{item?.collegeName || "-"} </h3>
                            <h5>{item?.degree || "-"}</h5>
                            <p>
                              {dateDuration(item?.startDate, item?.endDate) ||
                                "-"}
                            </p>
                            <a
                              href={item?.url}
                              target="location"
                              className="file_link"
                            >
                              {item?.educationCertificateName}
                            </a>
                          </div>
                        </div>
                        <div
                          onClick={handleClickDialogOpen}
                          className="edit__icon_box"
                        >
                          <Icon
                            className="edit__icon"
                            icon="fluent:edit-32-regular"
                            onClick={(e) =>
                              editDetailsHandler(e, item?._id, index)
                            }
                          ></Icon>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="Degree__contentBox">
                      <p style={{ fontSize: "12px" }}>No Results Found</p>
                    </div>
                  )}
                </AssessorTabDegreePanel>

                <AssessorTabDegreePanel
                  tabDegreeValue={tabDegreeValue}
                  index={2}
                >
                  <div className="Degree__tabBox">
                    <div className="Degree__title">
                      <h4>Agreement</h4>
                      <p>Edit or Update the Total Experience</p>
                    </div>
                    <button className="add-exp" onClick={handleClickDialogOpen}>
                      Add Agreement
                    </button>
                  </div>
                  {agreementDetails.length > 0 ? (
                    agreementDetails.map((item, index) => (
                      <div key={index} className="Degree__contentBox">
                        <div className="Degree__contentBox_title">
                        <Image certificateName={item?.agreementCertificateName} />
                          <div>
                            <h3>{item?.agreementName || "-"} </h3>
                            {/* <h5>{item?.degree || "-"}</h5> */}
                            <p>
                              {`Valid from ${dateDuration(
                                item?.agreementValidFrom,
                                item?.agreementValidTo
                              )}` || "-"}
                            </p>
                            <a
                              href={item?.url}
                              target="location"
                              className="file_link"
                            >
                              {item?.agreementCertificateName}
                            </a>
                          </div>
                        </div>
                        <div
                          onClick={handleClickDialogOpen}
                          className="edit__icon_box"
                        >
                          <Icon
                            className="edit__icon"
                            icon="fluent:edit-32-regular"
                            onClick={(e) =>
                              editDetailsHandler(e, item?._id, index)
                            }
                          ></Icon>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="Degree__contentBox">
                      <p style={{ fontSize: "12px" }}>No Results Found</p>
                    </div>
                  )}
                </AssessorTabDegreePanel>

                <AssessorTabDegreePanel
                  tabDegreeValue={tabDegreeValue}
                  index={3}
                >
                  <div className="Degree__tabBox">
                    <div className="Degree__title">
                      <h4>Job role Certificate</h4>
                      <p>Edit or Update the Total Experience</p>
                    </div>
                    <button className="add-exp" onClick={handleClickDialogOpen}>
                      Add Certificate
                    </button>
                  </div>
                  {jobrolesDetails.length > 0 ? (
                    jobrolesDetails.map((item, index) => (
                      <div key={index} className="Degree__contentBox">
                        <div className="Degree__contentBox_title">
                        <Image certificateName={item?.jobRoleCertificateName} />
                          <div>
                            <h3>{item?.jobroleName || "-"} </h3>
                            <h5>{`${item?.experience}yrs` || "-"}</h5>
                            <p>
                              {`Valid from ${dateDuration(
                                item?.issueDate,
                                item?.validUpto
                              )}` || "-"}
                            </p>
                            <a
                              href={item?.url}
                              target="location"
                              className="file_link"
                            >
                              {item?.jobRoleCertificateName}
                            </a>
                          </div>
                        </div>
                        <div
                          onClick={handleClickDialogOpen}
                          className="edit__icon_box"
                        >
                          <Icon
                            className="edit__icon"
                            icon="fluent:edit-32-regular"
                            onClick={(e) =>
                              editDetailsHandler(e, item?._id, index)
                            }
                          ></Icon>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="Degree__contentBox">
                      <p style={{ fontSize: "12px" }}>No Results Found</p>
                    </div>
                  )}
                </AssessorTabDegreePanel>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={openExp}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        maxWidth={"xs"}
        onClose={handleDialogClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      >
        <DialogTitle>
          <div className="Dialog__tabBox">
            <div className="Dialog__title">
              <h4>
                {activeSection === "exp"
                  ? "Previous Experience"
                  : activeSection === "edc"
                  ? "Education Details"
                  : activeSection === "agr"
                  ? "Agreement"
                  : "Job Role Certificate"}
              </h4>
              <p>
                {activeSection === "exp"
                  ? `${isEditActive ? "Edit" : "Add"} Previous Experience`
                  : activeSection === "edc"
                  ? `${isEditActive ? "Edit" : "Add"} Education Details`
                  : activeSection === "agr"
                  ? "Add Agreement"
                  : `${isEditActive ? "Edit" : "Add"} Job Role Certificate`}
              </p>
            </div>
            <div onClick={handleDialogClose} className="Dialog__closeIcon">
              <Icon className="close__icon" icon="iconamoon:close-light">
                {`Close`}
              </Icon>
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
                {activeSection === "exp" ? (
                  <>
                    <div
                      style={{ width: "calc(100% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Designation"
                        name="designation"
                        placeholder="Enter Designation"
                        onFocus={focusHandler}
                        error={errors?.designation}
                        onBlur={blurHandler}
                        onChange={(e) => changeHandler(e)}
                        value={experienceDetails?.designation}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(100% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Company Name"
                        name="companyName"
                        placeholder="Enter company name"
                        onFocus={focusHandler}
                        error={errors?.companyName}
                        onBlur={blurHandler}
                        onChange={(e) => changeHandler(e)}
                        value={experienceDetails?.companyName}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <DateInput
                        name="startDate"
                        label="Start Date"
                        placeholder="Dd-Mm-Yy"
                        value={experienceDetails?.startDate}
                        setFormValues={setExperienceDetails}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        error={errors?.startDate}
                        handleDateChange={(e) =>
                          dateChangeHandler(e, "startDate")
                        }
                        mandatory
                        disableFuture
                        maxDate={startDateLimit}
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <DateInput
                        name="endDate"
                        label="End Date"
                        placeholder="Dd-Mm-Yy"
                        value={experienceDetails?.endDate}
                        setFormValues={setExperienceDetails}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        error={errors?.endDate}
                        handleDateChange={(e) =>
                          dateChangeHandler(e, "endDate")
                        }
                        // disableFuture
                        minDate={endDateLimit}
                      />
                    </div>
                    <div className="upload_files_container">
                      <div className="content_wrapper">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx .docx, .gif, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          id="exp"
                          onChange={loadFile}
                          hidden
                          // multiple
                        />
                        <label className="icon_wrapper" htmlFor="exp">
                          <UploadIcon width={40} />
                        </label>
                        <div className="controls_box">
                          <label htmlFor="exp">Click to upload</label>
                        </div>
                        {selectedFiles.length === 0 &&
                          experienceDetails?.experienceCertificateName && (
                            <p style={{ fontSize: "10px" }}>
                              {experienceDetails?.experienceCertificateName}
                              {"\u2705"}
                            </p>
                          )}
                        <div className="selected_files">
                          {selectedFiles.length > 0 &&
                            selectedFiles.map((el, ind) => {
                              return (
                                <p key={ind}>
                                  {el?.name}
                                  <span>
                                    {
                                      <DeleteIcon
                                        width={11}
                                        onClick={(e) => deleteFileExp(e, ind)}
                                        style={{ cursor: "pointer" }}
                                      />
                                    }
                                  </span>
                                </p>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <p className="error-input">
                      {activeSection === "exp"
                        ? errors?.experienceCertificate
                        : activeSection === "edc"
                        ? errors?.educationCertificate
                        : activeSection === "agr"
                        ? errors?.agreementCertificate
                        : errors?.jobroleCertificate}
                    </p>
                  </>
                ) : activeSection === "edc" ? (
                  <>
                    <div
                      style={{ width: "calc(100% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="School/College Name"
                        name="collegeName"
                        placeholder="Enter your College Name"
                        onFocus={focusHandler}
                        error={errors?.collegeName}
                        onBlur={blurHandler}
                        onChange={(e) => changeHandler(e)}
                        value={educationDetails?.collegeName}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(100% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Degree"
                        name="degree"
                        placeholder="Enter Degree"
                        onFocus={focusHandler}
                        error={errors?.degree}
                        onBlur={blurHandler}
                        onChange={(e) => changeHandler(e)}
                        value={educationDetails?.degree}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <DateInput
                        name="startDate"
                        label="Start Date"
                        placeholder="Dd-Mm-Yy"
                        value={educationDetails?.startDate}
                        setFormValues={setEducationDetails}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        error={errors?.startDate}
                        handleDateChange={(e) =>
                          dateChangeHandler(e, "startDate")
                        }
                        mandatory
                        disableFuture
                        maxDate={startDateLimitEdc}
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <DateInput
                        name="endDate"
                        label="End Date"
                        placeholder="Dd-Mm-Yy"
                        value={educationDetails?.endDate}
                        setFormValues={setEducationDetails}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        error={errors?.endDate}
                        handleDateChange={(e) =>
                          dateChangeHandler(e, "endDate")
                        }
                        minDate={endDateLimitEdc}
                      />
                    </div>
                    <div className="upload_files_container">
                      <div className="content_wrapper">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx .docx, .gif, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          id="exp"
                          onChange={loadFile}
                          hidden
                          // multiple
                        />
                        <label className="icon_wrapper" htmlFor="exp">
                          <UploadIcon width={40} />
                        </label>
                        <div className="controls_box">
                          <label htmlFor="exp">Click to upload</label>
                        </div>
                        {selectedFiles.length === 0 &&
                          educationDetails?.educationCertificateName && (
                            <p style={{ fontSize: "10px" }}>
                              {educationDetails?.educationCertificateName}
                              {"\u2705"}
                            </p>
                          )}
                        <div className="selected_files">
                          {selectedFiles.length > 0 &&
                            selectedFiles.map((el, ind) => {
                              return (
                                <p key={ind}>
                                  {el?.name}
                                  <span>
                                    {
                                      <DeleteIcon
                                        width={11}
                                        onClick={(e) => deleteFileExp(e, ind)}
                                        style={{ cursor: "pointer" }}
                                      />
                                    }
                                  </span>
                                </p>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <p className="error-input">
                      {errors?.educationCertificate}
                    </p>
                  </>
                ) : activeSection === "agr" ? (
                  <>
                    <div
                      style={{ width: "calc(100% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Agreement Name"
                        name="agreementName"
                        placeholder="Enter your organization"
                        error={errors?.agreementName}
                        onBlur={blurHandler}
                        onFocus={focusHandler}
                        onChange={(e) => changeHandler(e)}
                        value={agreementFormValues?.agreementName}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <DateInput
                        name="agreementValidFrom"
                        label="Start Date"
                        placeholder="Dd-Mm-Yy"
                        value={agreementFormValues?.agreementValidFrom}
                        setFormValues={setAgreementFormValues}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        error={errors?.agreementValidFrom}
                        handleDateChange={(e) =>
                          dateChangeHandler(e, "agreementValidFrom")
                        }
                        mandatory
                        maxDate={startDateLimitAgr}
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <DateInput
                        name="agreementValidTo"
                        label="End Date"
                        placeholder="Dd-Mm-Yy"
                        value={agreementFormValues?.agreementValidTo}
                        setFormValues={setAgreementFormValues}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        error={errors?.agreementValidTo}
                        handleDateChange={(e) =>
                          dateChangeHandler(e, "agreementValidTo")
                        }
                        minDate={endDateLimitAgr}
                      />
                    </div>
                    <div className="upload_files_container">
                      <div className="content_wrapper">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx .docx, .gif, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          id="exp"
                          onChange={loadFile}
                          hidden
                          // multiple
                        />
                        <label className="icon_wrapper" htmlFor="exp">
                          <UploadIcon width={40} />
                        </label>
                        <div className="controls_box">
                          <label htmlFor="exp">Click to upload</label>
                        </div>
                        {selectedFiles.length === 0 &&
                          agreementFormValues?.agreementCertificateName && (
                            <p style={{ fontSize: "10px" }}>
                              {agreementFormValues?.agreementCertificateName}
                              {"\u2705"}
                            </p>
                          )}
                        <div className="selected_files">
                          {selectedFiles.length > 0 &&
                            selectedFiles.map((el, ind) => {
                              return (
                                <p key={ind}>
                                  {el?.name}
                                  <span>
                                    {
                                      <DeleteIcon
                                        width={11}
                                        onClick={(e) => deleteFileExp(e, ind)}
                                        style={{ cursor: "pointer" }}
                                      />
                                    }
                                  </span>
                                </p>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <p className="error-input">
                      {errors?.agreementCertificate}
                    </p>
                  </>
                ) : (
                  <>
                    <div
                      style={{ width: "calc(100% - 10px)" }}
                      className="form-group"
                    >
                      <SelectInput
                        name="jobroleName"
                        label="Jobrole Name"
                        placeHolder="Select Jobrole"
                        value={jobRoleFormValues?.jobroleName}
                        handleChange={(e) => changeHandler(e)}
                        options={ALPHABETIC_SORT(jobRoles)}
                        error={errors?.jobroleName}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(100% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Experience"
                        name="experience"
                        placeholder="Enter your experience"
                        error={errors?.experience}
                        onBlur={blurHandler}
                        onFocus={focusHandler}
                        onChange={(e) => changeHandler(e)}
                        value={jobRoleFormValues?.experience}
                        mandatory
                        type="number"
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <DateInput
                        name="issueDate"
                        label="Start Date"
                        placeholder="Dd-Mm-Yy"
                        value={jobRoleFormValues?.issueDate}
                        setFormValues={setAgreementFormValues}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        error={errors?.issueDate}
                        handleDateChange={(e) =>
                          dateChangeHandler(e, "issueDate")
                        }
                        mandatory
                        maxDate={startDateLimitJbc}
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <DateInput
                        name="validUpto"
                        label="End Date"
                        placeholder="Dd-Mm-Yy"
                        value={jobRoleFormValues?.validUpto}
                        setFormValues={setAgreementFormValues}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        error={errors?.endDate}
                        handleDateChange={(e) =>
                          dateChangeHandler(e, "validUpto")
                        }
                        minDate={endDateLimitJbc}
                      />
                    </div>
                    <div className="upload_files_container">
                      <div className="content_wrapper">
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx .docx, .gif, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          id="exp"
                          onChange={loadFile}
                          hidden
                          // multiple
                        />
                        <label className="icon_wrapper" htmlFor="exp">
                          <UploadIcon width={40} />
                        </label>
                        <div className="controls_box">
                          <label htmlFor="exp">Click to upload</label>
                        </div>
                        {selectedFiles.length === 0 &&
                          jobRoleFormValues?.jobRoleCertificateName && (
                            <p style={{ fontSize: "10px" }}>
                              {jobRoleFormValues?.jobRoleCertificateName}
                              {"\u2705"}
                            </p>
                          )}
                        <div className="selected_files">
                          {selectedFiles.length > 0 &&
                            selectedFiles.map((el, ind) => {
                              return (
                                <p key={ind}>
                                  {el?.name}
                                  <span>
                                    {
                                      <DeleteIcon
                                        width={11}
                                        onClick={(e) => deleteFileExp(e, ind)}
                                        style={{ cursor: "pointer" }}
                                      />
                                    }
                                  </span>
                                </p>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <p className="error-input">{errors?.jobRoleCertificate}</p>
                  </>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="actions_wrapper">
            <Button
              onClick={(e) => handleDelete(e)}
              sx={{ display: [isEditActive ? "" : "none"] }}
            >
              Delete
            </Button>
            <Button
              onClick={handleDialogClose}
              sx={{ display: [isEditActive ? "none" : ""] }}
            >
              Cancel
            </Button>

            <Button
              onClick={(e) => handleSave(e)}
              className={`light-blue-btn submit-btn`}
              variant="contained"
              disabled={loading ? true : false}
              sx={{ display: [isEditActive ? "none" : ""] }}
            >
              {loading ? <RiseLoader size="5px" color="white" /> : "Save"}
            </Button>
            <Button
              onClick={(e) => handleUpdate(e)}
              className={`light-blue-btn submit-btn`}
              variant="contained"
              disabled={loading ? true : false}
              sx={{ display: [isEditActive ? "" : "none"] }}
            >
              {loading ? <RiseLoader size="5px" color="white" /> : "Update"}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Certification;

function AssessorTabDegreePanel(props) {
  const { children, tabDegreeValue, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tabDegreeValue !== index}
      id={`degree-tabpanel-${index}`}
      aria-labelledby={`degree-tab-${index}`}
      {...other}
    >
      {tabDegreeValue === index && <Box sx={{ width: "100%" }}>{children}</Box>}
    </div>
  );
}
AssessorTabDegreePanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  tabDegreeValue: PropTypes.number.isRequired,
};
function a12yProps(index) {
  return {
    id: `degree-tab-${index}`,
    "aria-controls": `degree-tabpanel-${index}`,
  };
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UploadFiles(props) {
  const { selectedFiles, setSelectedFiles } = props;
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

  const upload = () => {
    const currentFile = selectedFiles[0];
    setSelectedFiles([]);
  };

  const onDrop = (files) => {
    // const allowedFileTypes = [
    //   "application/vnd.ms-excel",
    //   "text/csv",
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // ];

    // // Filter the dropped files to include only XLSX and CSV files
    // const filteredFiles = files.filter((file) =>
    //   allowedFileTypes.includes(file.type)
    // );

    setSelectedFiles(files[0]);
    // if (filteredFiles.length > 0) {
    // } else {
    //   // Show an error message if the file type is not allowed
    //   setMessage("Please select a valid XLSX or CSV file.");
    // }
  };

  return (
    <div className="assign-batch-upload-file">
      <div>
        <Dropzone onDrop={onDrop} multiple={true}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />

                <>
                  <div className="assign-batch-upload-item">
                    <div>
                      <UploadIcon />
                    </div>
                    <div>
                      <button
                        className="btn btn-success upload-btn"
                        disabled={!selectedFiles}
                        onClick={upload}
                      >
                        Click to upload
                      </button>
                      <span>or drag and drop</span>
                    </div>
                    <p> Supported Format XLSX, CSV etc.</p>
                  </div>
                </>
              </div>
            </section>
          )}
        </Dropzone>

        <div className="alert alert-light" role="alert">
          {message}
        </div>

        {fileInfos.length > 0 && (
          <div className="card">
            <div className="card-header">List of Files</div>
            <ul className="list-group list-group-flush">
              {fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function createFormData(data) {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (let i = 0; i < data[key].length; i++) {
        const subObj = data[key][i];
        // for (const subKey in subObj) {
        // }
        formData.append(`${key}[${i}]`, subObj);
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
}
