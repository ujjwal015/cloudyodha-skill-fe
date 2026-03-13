import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import SelectInput from "./../../../../components/common/SelectInput";
import Input from "./../../../../components/common/input";
import { getCityListsApi, getStateListsApi } from "./../../../../api/authApi";
import { Button } from "@mui/material";
import {
  BANKS,
  CONFIRMATION,
  EXPERIENCE,
  GENDER_MENUS,
  MODE_OF_AGREEMENT_OPTIONS,
} from "../../../../config/constants/projectConstant";
import {
  authSelector,
  getCityLists,
} from "./../../../../redux/slicers/authSlice";
import { errorToast } from "./../../../../utils/projectHelper";
import { ReactComponent as ArrowLeft } from "./../../../../assets/icons/chevron-left.svg";
import { ReactComponent as UploadIcon } from "./../../../../assets/images/pages/clientManagement/upload-icon.svg";
import { ReactComponent as UploadIconWhite } from "./../../../../assets/icons/upload-cloud_white.svg";
import { ReactComponent as DeleteIcon } from "./../../../../assets/images/pages/clientManagement/delete-icon.svg";
import { ReactComponent as PaperClip } from "./../../../../assets/icons/paperclip.svg";
import { ReactComponent as InfoIcon } from "./../../../../assets/icons/informationIcon.svg";
import { ReactComponent as TrashIcon } from "./../../../../assets/icons/deleteIconTrashBin.svg";
import { ReactComponent as RemoveIcon } from "./../../../../assets/icons/remove_minus_icon.svg";
import UserProfile from "./../../../../assets/images/pages/clientManagement/dummy-user-profile.png";
import { ASSESSOR_MANAGEMENT_HOME } from "../../../../config/constants/routePathConstants/superAdmin";
import { FadeLoader, RiseLoader } from "react-spinners";
import DateInput from "../../../../components/common/DateInput";
import dayjs from "dayjs";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { getAllJobRoles } from "../../../../api/superAdminApi/jobRoleManagement";
import {
  createAssessorBasicInfoApi,
  createAssessorProfileApi,
  getAssessorBankDetailsApi,
  getAssessorPersonalDetailsApi,
  uploadFilesS3Api,
  viewAllAssessorDetailsApi,
} from "../../../../api/superAdminApi/assessorManagement";
import { getClientManagementListsApi } from "../../../../api/superAdminApi/clientManagement";
import axios from "axios";
import { API_ROOT } from "../../../../config/constants/apiConstants/auth";
import { UPLOAD_FILES_S3_API } from "../../../../config/constants/apiConstants/superAdmin";
import moment from "moment/moment";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Icon } from "@iconify/react";
import BankDetail from "./BankDetail";
import PersonalDetail from "./PersonalDetail";
import Certification from "./Certification";
import BasicInfo from "./BasicInfo";
import { getAssessorBasicDetails } from "../../../../redux/slicers/superAdmin/assessorAttendanceSlice";

const initialFormValues = () => {
  return {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    state: "",
    pinCode: "",
    district: "",
    experience: "",
    cv: "",
    aadharNo: "",
    aadharCard: "",
    panCard: "",
    panCardNo: "",
    bankName: "",
    bankAccount: "",
    bankIFSC: "",
    agreementSigned: "",
    agreementValidity: "",
    assessorPhoto: "",
    experienceCertificate: "",
    agreementCertificate: "",
    sipDetails: [
      {
        jobroleId: "",
        jobRoleName: "",
        sipCertificate: "",
        sipCertificateName: "",
        sipValidity: "",
      },
    ],
    highSchoolCertificate: "",
    intermediateCertificate: "",
    diplomaCertificate: "",
    undergradCertificate: "",
    postgradCertificate: "",
    otherCertificate: "",
    modeofAgreement: "",
  };
};

const initialBasicInfoValues = () => {
  return {
    firstName: "",
    arId: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    state: "",
    pinCode: "",
    district: "",
  };
};

const AssessorManagementProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const location = useLocation();
   const SECTION = location?.search?.split("=")?.["1"];
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues());
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState("");
  const { stateLists = [], cityLists = [] } = useSelector(authSelector);
  const [ImgURL, setImgURL] = useState(UserProfile);
  const { jobRolesListAll = [] } = useSelector(clientManagementSelector);
  const [jobRoles, setJobRoles] = useState();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [basicInfoValues, setBasicInfoValues] = useState(
    initialBasicInfoValues()
  );
  const [tabValue, setTabValue] = useState(0);
  const params = useParams();
  const [schemeType,setSchemeType]=useState([]);

  const assessorMDBId = params.id;

  useEffect(() => {
    if (tabValue === 0) {
      setLoading(true);
      dispatch(viewAllAssessorDetailsApi(assessorMDBId, setLoading));
    }
    tabValue === 1 && dispatch(getAssessorPersonalDetailsApi(assessorMDBId));
    tabValue === 3 && dispatch(getAssessorBankDetailsApi(assessorMDBId));
  }, [tabValue]);


  useEffect(() => {
    return () => {
      assessorMDBId && localStorage.removeItem("bscInf_AsR");
    };
  }, []);

  useEffect(() => {
    if (jobRolesListAll.length > 0) {
      const JobRolesArray = new Array();
      jobRolesListAll.map((el) => {
        const option = {
          label: el?.jobRole,
          value: el?._id,
        };
        JobRolesArray.push(option);
      });
      setJobRoles([...JobRolesArray]);
    }
  }, [jobRolesListAll]);

  // useEffect(() => {
  // }, [basicInfoValues]);

  const changeHandler = (event, section) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    if (section === "basicInfo") {
      setBasicInfoValues({ ...basicInfoValues, [name]: fieldValue });
    }

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const sendData = (data) => {
    const sipFormArr = data?.sipDetails;
    const sipDoc = sipFormArr.map((el) => {
      return el.sipCertificate;
    });
    const promiseArr = sipDoc.map((file, index) => {
      const formData = new FormData();
      formData.append(`sipCertificate`, file);
      formData.append("jobRoleId", sipFormArr?.[index]?.jobroleId);
      // return dispatch(uploadFilesS3Api(formData));
      const localData = window.localStorage.getItem("token");
      return axios.post(`${API_ROOT}${UPLOAD_FILES_S3_API}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Auth-Token": localData,
        },
      });
    });
    Promise.all(promiseArr)
      .then((res) => {
        const responseArr = res.map((el) => {
          return el?.data?.details;
        });
        return Promise.all(responseArr);
      })
      .then((dataArray) => {
        const sipCopy = [...sipFormArr];
        const updatedSIPArr = sipCopy.map((el, index) => {
          const newDetail = {
            jobroleId: el?.jobroleId,
            sipCertificateKey: dataArray?.[index]?.sipCertificateKey,
            sipValidity: el?.sipValidity,
            jobroleName: el?.jobRoleName,
            sipCertificateName: el?.sipCertificateName,
          };
          return newDetail;
        });
        const newData = { ...data, sipDetails: updatedSIPArr };

        // Final Data will be dispatched from here =>
        // if (newData?.assessorPhoto === "") {
        //   delete newData?.assessorPhoto
        // }
        const dataFinalFormData = createFormData(newData);
        dispatch(
          createAssessorProfileApi(
            dataFinalFormData,
            setLoading,
            clearFormValues,
            navigate
          )
        );
      })
      .catch((error) => {
        errorToast("Unable to upload files");
        setLoading(false);
      });
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues());
  };

  const getCityListsHandler = (event) => {
    dispatch(getCityLists([]));
    const { value } = event.target;
    const formData = {
      fipsCode: value,
    };
    setCityLoading(true);
    dispatch(getCityListsApi(formData, setCityLoading));
    // setFormValues((prev) => ({ ...prev, district: "" }));
  };

  const loadFile = (event, index) => {
    const { name, value } = event.target;
    const fieldError = validateField(name, value);

    if (event.target.files) {
      const { name, id, files } = event.target;
      if (id === "sipCertificate") {
        let targetSIP = formValues?.sipDetails[index];
        const updatedSIP = { ...targetSIP, [id]: files[0] };
        const updatedSIP2 = {
          ...updatedSIP,
          sipCertificateName: files[0].name,
        };

        let existingSIP = formValues?.sipDetails;
        existingSIP[index] = updatedSIP2;
        setFormValues({ ...formValues, sipDetails: existingSIP });
      }
      // const { id, files } = event.target;
      if (id === "assessorPhoto") {
        var newImageUrl = URL.createObjectURL(event.target.files[0]);
        setImgURL(newImageUrl);
      }
      if (id !== "sipCertificate")
        // setFormValues({ ...formValues, [id]: files[0] });
        setBasicInfoValues({ ...basicInfoValues, [id]: files[0] });
    }

    if (fieldError) {
      setErrors({
        [`${name}${index}`]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const deleteImage = (e) => {
    const name = e.target.getAttribute("name");
    let existingFormData = formValues;
    if (!name) {
      setImgURL(UserProfile);
      existingFormData.assessorPhoto = "";
      setFormValues(existingFormData);

      var fileInput = document.getElementById("assessorPhoto");
      var parent = fileInput.parentElement;
      var next = fileInput.nextSibling;
      parent.removeChild(fileInput);

      var newFileInput = document.createElement("input");
      newFileInput.type = "file";
      newFileInput.id = "assessorPhoto";
      newFileInput.accept = "image/*";
      newFileInput.name = "assessorPhoto";
      newFileInput.style.display = "none";
      newFileInput.addEventListener("change", (e) => loadFile(e));

      parent.insertBefore(newFileInput, next);
    }
    setFormValues({ ...existingFormData, [name]: "" });
  };

  const handleIconHover = (event) => {
    const { clientX, clientY } = event;
    setShowTooltip(true);
    setTooltipPosition({ x: clientX, y: clientY + 10 });
  };

  const handleIconLeave = () => {
    setShowTooltip(false);
  };

  const addNewSipHandler = () => {
    const existingSIP = formValues?.sipDetails;
    const newSIP = {
      jobroleId: "",
      sipCertificate: "",
      sipValidity: "",
    };
    const newSIPArr = [...existingSIP, newSIP];
    setFormValues({ ...formValues, sipDetails: newSIPArr });
  };

  const removeSIPHandler = (index) => {
    const existingSIP = formValues?.sipDetails;
    existingSIP.splice(index, 1);
    setFormValues({ ...formValues, sipDetails: existingSIP });
    errorToast(`SIP Form ${index + 1} Removed`);
  };

  const changeHandlerSIP = (e, index) => {
    const { name, value, type, checked } = e.target;
    const fieldError = validateField(name, value);

    let targetSIP = formValues?.sipDetails[index];
    let updatedSIP = { ...targetSIP, [name]: value };

    if (name === "jobroleId") {
      const targetJobRoleId = updatedSIP?.jobroleId;
      const findJobRole = jobRoles.filter((el) => {
        if (el?.value === targetJobRoleId) {
          return el.label;
        }
      });
      const jobRoleNameResult = findJobRole[0].label;
      updatedSIP.jobRoleName = jobRoleNameResult;
    }

    let existingSIP = formValues?.sipDetails;
    existingSIP[index] = updatedSIP;

    setFormValues({ ...formValues, sipDetails: existingSIP });

    if (fieldError) {
      setErrors({
        [`${name}${index}`]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const startOfDOB = dayjs("1947-08-15T00:00:00.000");
  const endOfDOB = dayjs("2004-01-01T00:00:00.000");

  const abortProfileCreation = () => {
    clearFormValues();
     navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=${SECTION}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmitBasicInfo = (event) => {
    event.preventDefault();
    const formErrors = {};

    Object.keys(basicInfoValues).forEach((name) => {
      const value = basicInfoValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Submit the form data
      const stateLabel = stateLists.find(
        (item) => item.value == basicInfoValues.state
      ).label;
      const formDataNew = {
        ...basicInfoValues,
        state: stateLabel,
      };


      // setLoading(true);
      dispatch(
        createAssessorBasicInfoApi(
          formDataNew,
          setLoading,
          clearFormValues,
          navigate
        )
      );
    } else {
      errorToast("Kindly fill mandatory details.");
    }
  };

  const updateSchemeSelectedParent=(data)=>{
    setSchemeType(data)
  }


  return (
    <div className="main-content">
      <div className="assessorForm__title">
        <ArrowLeft
          width={18}
          onClick={() =>{
          dispatch(getAssessorBasicDetails({}));
          navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=${SECTION}`)
          }
          }
        />
        <div>
          <h1>Assessor Form</h1>
          <p className="sub-heading">
            In the account section, You can edit and view your account
            information.
          </p>
        </div>
      </div>

      {loading ? (
        <>
          <div className="loader_container">
            <FadeLoader color="#2ea8db" />
          </div>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                sx={{ "& button": { textTransform: "capitalize" } }}
                value={tabValue}
                onChange={handleTabChange}
                aria-label="assessor tabs"
              >
                <Tab label="Basic Info" {...a11yProps(0)} />
                <Tab label="personal details" {...a11yProps(1)} />
                <Tab label="Degree & Certifications" {...a11yProps(2)} />
                <Tab label="Bank Details" {...a11yProps(3)} />
              </Tabs>
            </Box>
            <AssessorTabPanel tabValue={tabValue} index={0}>
              <BasicInfo controlFunc={setTabValue} currentTab={tabValue} updateSchemeSelectedParent={updateSchemeSelectedParent}/>
            </AssessorTabPanel>
            <AssessorTabPanel tabValue={tabValue} index={1}>
              <PersonalDetail controlFunc={setTabValue} currentTab={tabValue} schemeType={schemeType}/>
            </AssessorTabPanel>
            <AssessorTabPanel tabValue={tabValue} index={2}>
              <Certification schemeType={schemeType}/>
            </AssessorTabPanel>
            <AssessorTabPanel tabValue={tabValue} index={3}>
              <BankDetail schemeType={schemeType} />
            </AssessorTabPanel>
          </Box>
        </>
      )}
    </div>
  );
};

export default AssessorManagementProfile;

function createFormData(data) {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (let i = 0; i < data[key].length; i++) {
        const subObj = data[key][i];
        for (const subKey in subObj) {
          formData.append(`${key}[${i}][${subKey}]`, subObj[subKey]);
        }
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
}

function AssessorTabPanel(props) {
  const { children, tabValue, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tabValue !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tabValue === index && (
        <Box sx={{ pt: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

AssessorTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  tabValue: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Reference code Old
{
  /* <section className="sub-admin-wrapper">
            <div className="tab-content">
              <div className="edit-profile" style={{ display: "block" }}>
                <div className="form-wrapper">
                  <div className="form_title">
                    <h1>Educational Details</h1>
                  </div>
                  <div className="form">
                    <form>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className="custom_input"
                          style={{ width: "calc(50% - 10px)" }}
                        >
                          <div className="input_label">
                            <label>High School</label>
                            <p style={{ color: "red" }}>*</p>
                          </div>
                          <div
                            className="upload_input"
                            style={{
                              border: [
                                errors?.highSchoolCertificate
                                  ? "1px solid #D70000"
                                  : "",
                              ],
                              width: "100%",
                            }}
                          >
                            <p className="greyText">
                              {formValues?.highSchoolCertificate
                                ? formValues?.highSchoolCertificate?.name
                                : "No File Provided"}
                            </p>
                            <Button
                              variant="contained"
                              component="label"
                              className={`light-blue-btn upload_inside_btn`}
                            >
                              <UploadIconWhite />
                              <input
                                type="file"
                                id="highSchoolCertificate"
                                hidden
                                onChange={(e) => loadFile(e)}
                              />
                            </Button>
                          </div>
                          <p className="error-input">
                            {errors?.highSchoolCertificate || ""}
                          </p>
                        </div>

                        <div
                          className="custom_input"
                          style={{ width: "calc(50% - 10px)" }}
                        >
                          <div className="input_label">
                            <label>Intermediate</label>
                          </div>
                          <div
                            className="upload_input"
                            style={{ width: "100%" }}
                          >
                            <p className="greyText">
                              {formValues?.intermediateCertificate
                                ? formValues?.intermediateCertificate?.name
                                : "No File Provided"}
                            </p>
                            <Button
                              variant="contained"
                              component="label"
                              className={`light-blue-btn upload_inside_btn`}
                            >
                              <UploadIconWhite />
                              <input
                                type="file"
                                id="intermediateCertificate"
                                hidden
                                onChange={(e) => loadFile(e)}
                              />
                            </Button>
                          </div>
                        </div>

                        <div
                          className="custom_input"
                          style={{ width: "calc(50% - 10px)" }}
                        >
                          <div className="input_label">
                            <label>Diploma</label>
                          </div>
                          <div
                            className="upload_input"
                            style={{ width: "100%" }}
                          >
                            <p className="greyText">
                              {formValues?.diplomaCertificate
                                ? formValues?.diplomaCertificate?.name
                                : "No File Provided"}
                            </p>
                            <Button
                              variant="contained"
                              component="label"
                              className={`light-blue-btn upload_inside_btn`}
                            >
                              <UploadIconWhite />
                              <input
                                type="file"
                                id="diplomaCertificate"
                                hidden
                                onChange={(e) => loadFile(e)}
                              />
                            </Button>
                          </div>
                        </div>

                        <div
                          className="custom_input"
                          style={{ width: "calc(50% - 10px)" }}
                        >
                          <div className="input_label">
                            <label>Undergraduation</label>
                          </div>
                          <div
                            className="upload_input"
                            style={{ width: "100%" }}
                          >
                            <p className="greyText">
                              {formValues?.undergradCertificate
                                ? formValues?.undergradCertificate?.name
                                : "No File Provided"}
                            </p>
                            <Button
                              variant="contained"
                              component="label"
                              className={`light-blue-btn upload_inside_btn`}
                            >
                              <UploadIconWhite />
                              <input
                                type="file"
                                id="undergradCertificate"
                                hidden
                                onChange={(e) => loadFile(e)}
                              />
                            </Button>
                          </div>
                        </div>

                        <div
                          className="custom_input"
                          style={{ width: "calc(50% - 10px)" }}
                        >
                          <div className="input_label">
                            <label>Postgraduate</label>
                          </div>
                          <div
                            className="upload_input"
                            style={{ width: "100%" }}
                          >
                            <p className="greyText">
                              {formValues?.postgradCertificate
                                ? formValues?.postgradCertificate?.name
                                : "No File Provided"}
                            </p>
                            <Button
                              variant="contained"
                              component="label"
                              className={`light-blue-btn upload_inside_btn`}
                            >
                              <UploadIconWhite />
                              <input
                                type="file"
                                id="postgradCertificate"
                                hidden
                                onChange={(e) => loadFile(e)}
                              />
                            </Button>
                          </div>
                        </div>

                        <div
                          className="custom_input"
                          style={{ width: "calc(50% - 10px)" }}
                        >
                          <div className="input_label">
                            <label>Others (If Any)</label>
                          </div>
                          <div
                            className="upload_input"
                            style={{ width: "100%" }}
                          >
                            <p className="greyText">
                              {formValues?.otherCertificate
                                ? formValues?.otherCertificate?.name
                                : "No File Provided"}
                            </p>
                            <Button
                              variant="contained"
                              component="label"
                              className={`light-blue-btn upload_inside_btn`}
                            >
                              <UploadIconWhite />
                              <input
                                type="file"
                                id="otherCertificate"
                                hidden
                                onChange={(e) => loadFile(e)}
                              />
                            </Button>
                          </div>
                        </div>

                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <SelectInput
                            name="experience"
                            label="Experience"
                            placeHolder="Select Experience"
                            value={formValues?.experience}
                            handleChange={changeHandler}
                            options={EXPERIENCE}
                            error={errors?.experience}
                            mandatory
                          />
                          <div className="card_upload_doc">
                            <input
                              type="file"
                              name="experienceCertificate"
                              id="experienceCertificate"
                              style={{ display: "none" }}
                              onChange={(e) => loadFile(e)}
                            />
                            <div className="img_upload_title_extention">
                              <PaperClip width={15} height={15} />
                              <label
                                htmlFor="experienceCertificate"
                                style={{ cursor: "pointer" }}
                              >
                                Add Attachment
                              </label>
                              <div className="info_icon_container">
                                <InfoIcon
                                  width={15}
                                  className="infoIcon"
                                  onMouseOver={handleIconHover}
                                  onMouseLeave={handleIconLeave}
                                />

                                {showTooltip && (
                                  <div
                                    className="dialog-box"
                                    style={{
                                      left: `${tooltipPosition.x}px`,
                                      top: `${tooltipPosition.y}px`,
                                    }}
                                  >
                                    <p>
                                      Allowed formats are .png.jpg, .jpeg, .doc,
                                      .docx, .pdf. The file size should not
                                      exceed 20MB
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div
                              className="uploaded_image_container"
                              style={{
                                display: [
                                  formValues?.experienceCertificate?.name
                                    ? ""
                                    : "none",
                                ],
                              }}
                            >
                              <p>
                                {formValues?.experienceCertificate?.name || ""}
                              </p>
                              <TrashIcon
                                width={18}
                                name="experienceCertificate"
                                onClick={(e) => deleteImage(e)}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                            <p className="error-input">
                              {errors?.experienceCertificate || ""}
                            </p>
                          </div>
                        </div>

                        <div
                          className="custom_input"
                          style={{ width: "calc(50% - 10px)" }}
                        >
                          <div className="input_label">
                            <label>Upload CV</label>
                            <p style={{ color: "red" }}>*</p>
                          </div>
                          <div
                            className="upload_input"
                            style={{
                              border: [errors?.cv ? "1px solid #D70000" : ""],
                              width: "100%",
                            }}
                          >
                            <p className="greyText">
                              {formValues?.cv
                                ? formValues?.cv?.name
                                : "No File Provided"}
                            </p>
                            <Button
                              variant="contained"
                              component="label"
                              className={`light-blue-btn upload_inside_btn`}
                            >
                              <UploadIconWhite />
                              <input
                                type="file"
                                id="cv"
                                hidden
                                onChange={(e) => loadFile(e)}
                              />
                            </Button>
                          </div>
                          <p className="error-input">{errors?.cv || ""}</p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section> */
}
