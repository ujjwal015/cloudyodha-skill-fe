import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import SelectInput from "./../../../../components/common/SelectInput";
import Input, { RadioButton } from "./../../../../components/common/input";
import { getCityListsApi, getStateListsApi } from "./../../../../api/authApi";
import { Button, Icon } from "@mui/material";
import {
  assessorTypeOption,
  GENDER_MENUS,
  MODE_OF_AGREEMENT_OPTIONS,
  TOA_TYPE,
} from "../../../../config/constants/projectConstant";
import { authSelector, getCityLists } from "./../../../../redux/slicers/authSlice";
import { ALPHABETIC_SORT, errorToast, getSchemeType } from "./../../../../utils/projectHelper";
import { ReactComponent as UploadIcon } from "./../../../../assets/images/pages/clientManagement/upload-icon.svg";
import { ReactComponent as DeleteIcon } from "./../../../../assets/images/pages/clientManagement/delete-icon.svg";
import UserProfile from "./../../../../assets/images/pages/clientManagement/dummy-user-profile.png";
import { ASSESSOR_MANAGEMENT_HOME } from "../../../../config/constants/routePathConstants/superAdmin";
import { RiseLoader } from "react-spinners";
import DateInput from "../../../../components/common/DateInput";
import dayjs from "dayjs";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { getAllJobRoles } from "../../../../api/superAdminApi/jobRoleManagement";
import {
  createAssessorBasicInfoApi,
  getAssessorBasicDetailsApi,
  updateAssessorBasicInfoApi,
} from "../../../../api/superAdminApi/assessorManagement";
import { getClientManagementListsApi, getSectorListApi } from "../../../../api/superAdminApi/clientManagement";
import {
  assessorAttendanceSelector,
  getAssessorBasicDetails,
} from "../../../../redux/slicers/superAdmin/assessorAttendanceSlice";
import { yesNo } from "../../examManagement/batch/data";
import SchemeCheckbox from "./components/SchemeCheckbox";
import AutoCompleteAsyncInput from "../../../../components/common/AutoCompleteAsyncInput";



const initialBasicInfoValues = () => {
  return {
    fullName: "",
    assessorSipId: "",
    email: "",
    sector: [],
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    state: "",
    pinCode: "",
    district: "",
    modeofAgreement: "",
    ToaType: "",
    RadiantFundToa: "",
    assessorType:""
  };
};

const initialBasicInfoValuesForVishwakarmascheme = () => {
  return {
    fullName: "",
    assessorSipId: "",
    assessorType:"",
    sector: [],
  };
};

const BasicInfo = (props) => {
  const { controlFunc, currentTab, updateSchemeSelectedParent } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const SECTION = location?.search?.split("=")?.["1"];
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState("");
  const { stateLists = [], cityLists = [] } = useSelector(authSelector);
  const [ImgURL, setImgURL] = useState(UserProfile);
  const { jobRolesListAll = [], sectorList } = useSelector(clientManagementSelector);
  const [jobRoles, setJobRoles] = useState();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [basicInfoValues, setBasicInfoValues] = useState({});
  const assessorMDBId = localStorage.getItem("bscInf_AsR") || false;
  const [isSessionActive, setisSessionActive] = useState(false);
  const [formattedDistrictList, setFormattedDistrictList] = useState([]);
  const { assessBasicDetails = {} } = useSelector(assessorAttendanceSelector);
  const [formattedStateList, setFormattedStateList] = useState([]);
  const [schemeSelected, setSchemeSelected] = useState(["65aa7bf1b19149328d4ec965"]);
  const [useEvent, setUserEvent] = useState(false);
  const basicInfoValuesRef = useRef(basicInfoValues);
  const assessorMDBIdMemoized = useMemo(() => assessorMDBId, [assessorMDBId]);

  useEffect(() => {
    setBasicInfoValues({});
    dispatch(getAssessorBasicDetails({}));
  }, []);
useEffect(() => {
  if (!assessBasicDetails || !schemeSelected?.length) return;

  const updatedValues =
    getSchemeType(schemeSelected).includes("Non PMKVY") ||
    getSchemeType(schemeSelected).includes("PMKVY")
      ? initialBasicInfoValues()
      : initialBasicInfoValuesForVishwakarmascheme();

  const filteredAssessDetails = {};

  Object.keys(updatedValues).forEach(key => {
    if (assessBasicDetails[key] !== undefined) {
      filteredAssessDetails[key] = assessBasicDetails[key];
    }
  });

  setBasicInfoValues({
    ...updatedValues,
    ...filteredAssessDetails,
    assessorPhoto: assessBasicDetails?.profileKey,
    RadiantFundToa: assessBasicDetails?.RadiantFundToa,
  });

  setImgURL(assessBasicDetails?.url || UserProfile);

}, [assessBasicDetails, schemeSelected]);


  useEffect(() => {
    if (Object.keys(assessBasicDetails).length > 0 && assessorMDBIdMemoized) {

      setBasicInfoValues((prevValues) => {
        const updatedValues = { ...prevValues };

        for (let key in prevValues) {
          updatedValues[key] = assessBasicDetails[key] || updatedValues[key];
        }

        return {
          ...updatedValues,
          assessorPhoto: assessBasicDetails?.profileKey,
          RadiantFundToa: assessBasicDetails?.RadiantFundToa,
        };
      });

      setImgURL(assessBasicDetails?.url || UserProfile);
    }
  }, [assessBasicDetails, assessorMDBIdMemoized]);

  const getDetails = () => {
    const formData = {
      country: "India",
    };
    dispatch(getStateListsApi(formData, setLoading));
    dispatch(getAllJobRoles(setLoading));
    dispatch(getClientManagementListsApi(setLoading));
    dispatch(getSectorListApi(setLoading));
    if (assessorMDBId) {
      dispatch(getAssessorBasicDetailsApi(setLoading, assessorMDBId, setBasicInfoValues, setFormattedDistrictList));
    } else clearFormValues();
  };

  const setSchemeHandler = (data) => {
    setSchemeSelected(data);
    updateSchemeSelectedParent(data);
  };

  useEffect(() => {
    console.log(44444);

    assessorMDBId && setisSessionActive(true);
    currentTab === 0 && getDetails();

    return () => {
      clearFormValues();
      // destroySession();
    };
  }, []);

  useEffect(() => {
    if (stateLists.length > 0) {
      const filteredList = stateLists.map((state) => {
        return {
          label: state?.label,
          value: state?.label,
        };
      });
      setFormattedStateList([...filteredList]);
    }
  }, [stateLists.length]);

  useEffect(() => {
    if (cityLists.length > 0) {
      const filteredList = cityLists.map((state) => {
        return {
          label: state?.label,
          value: state?.label,
        };
      });

      setFormattedDistrictList([...filteredList]);
    }
  }, [cityLists.length]);

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

  const [hasUpdated, setHasUpdated] = useState(false);

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

  const dateChangeHandler = (e, name, index) => {
    const formattedDate = dayjs(e).format("MM-DD-YYYY");
    const fieldError = validateField(name, formattedDate);

    if (name === "sipValidity") {
      let targetSIP = [...formValues?.sipDetails];
      const updatedSIP = { ...targetSIP[index] };
      updatedSIP[name] = formattedDate;
      targetSIP[index] = updatedSIP;
      setFormValues({ ...formValues, sipDetails: targetSIP });
    } else {
      setBasicInfoValues((pre) => ({ ...pre, [name]: formattedDate }));
    }

    if (fieldError) {
      setErrors({
        [`${name}${index}`]: fieldError,
      });
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

  // const handleClearScheme=()=>{
  //   setSchemeSelected([]);

  // }

  const clearFormValues = () => {
    // setFormValues({});
    setBasicInfoValues({});
    // setSchemeSelected([])
    setImgURL(UserProfile);
  };

  useEffect(() => {
    if (basicInfoValues?.state) {
      const value = basicInfoValues?.state;
      dispatch(getCityLists([]));
      const findFips = stateLists.find((el) => {
        if (el?.label === value) return el;
      })?.value;
      const formData = {
        fipsCode: findFips,
      };
      setCityLoading(true);
      dispatch(getCityListsApi(formData, setCityLoading));
    }
  }, [basicInfoValues?.state]);

  const getCityListsHandler = (event) => {
    dispatch(getCityLists([]));
    const { value } = event.target;
    const findFips = stateLists.find((el) => {
      if (el?.label === value) return el;
    }).value;
    const formData = {
      fipsCode: findFips,
    };
    setCityLoading(true);
    dispatch(getCityListsApi(formData, setCityLoading));
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
    let existingFormData = basicInfoValues;
    if (!name) {
      setImgURL(UserProfile);
      existingFormData.assessorPhoto = "";
      setBasicInfoValues(existingFormData);

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
    setBasicInfoValues({ ...existingFormData, [name]: "" });
  };

  const startOfDOB = dayjs("1947-08-15T00:00:00.000");
  const endOfDOB = dayjs("2004-01-01T00:00:00.000");

  const abortProfileCreation = () => {
    clearFormValues();
    localStorage.removeItem("bscInf_AsR");
    setErrors({});
    navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=${SECTION}`);
  };

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmitBasicInfo = (event) => {
    event.preventDefault();
    if (schemeSelected?.length > 0) {
      const formErrors = {};
      Object.keys(basicInfoValues).forEach((name) => {
        const value = basicInfoValues[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
          if (basicInfoValues?.ToaType !== "Radiant") {
            delete formErrors?.RadiantFundToa;
          }
        }
      });

      setErrors(formErrors);
      const formData = { ...basicInfoValues };
      if (basicInfoValues?.ToaType !== "Radiant") {
        delete formData?.RadiantFundToa;
      }
      if (Object.keys(formErrors).length === 0) {
        // Submit the form data
        setLoading(true);
        const payloadData = { ...formData, scheme: schemeSelected };
        
        if (Array.isArray(payloadData.sector) && payloadData.sector.length === 0) {
            payloadData.sector = JSON.stringify([]); 
        } else if (Array.isArray(payloadData.sector)) {
            payloadData.sector = JSON.stringify(payloadData.sector.map(s => ({
                sectorId: s.jobRoleId, 
                sectorName: s.jobRoleLabel
            })));
        }

        if (assessorMDBId) {
          dispatch(updateAssessorBasicInfoApi(payloadData, setLoading, clearFormValues, controlFunc, assessorMDBId));
        } else dispatch(createAssessorBasicInfoApi(payloadData, setLoading, clearFormValues, controlFunc));
      } else {
        errorToast("Kindly fill mandatory details.");
      }
    } else {
      errorToast("Please Select Scheme");
    }
  };

  const destroySession = () => {
    localStorage.removeItem("bscInf_AsR");
    setisSessionActive(false);
    clearFormValues();
  };

  return (
    <section className="sub-admin-wrapper">
      <div className="tab-content">
        <div className="edit-profile" style={{ display: "flex" }}>
          <div className="form-wrapper" style={{ width: "100%" }}>
            <div className="form_title">
              <div className="active_onb_message">
                {isSessionActive && (
                  <p className="wrapper">
                    Onboarding in Progress <Icon icon={"formkit:trash"} onClick={destroySession} />
                  </p>
                )}
              </div>
              <h1>BASIC DETAILS</h1>
            </div>
            <div className="form_mainContainer">
              <div className="form" style={{ width: "75%" }}>
                <SchemeCheckbox
                  updateScheme={setSchemeHandler}
                  incomingScheme={schemeSelected}
                  handleUserClick={(data) => {
                    setUserEvent(data);
                  }}
                />
                {getSchemeType(schemeSelected)?.length > 0 && (
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
                          name="fullName"
                          placeholder="Enter Name"
                          onFocus={focusHandler}
                          error={errors?.fullName}
                          onBlur={blurHandler}
                          onChange={(e) => changeHandler(e, "basicInfo")}
                          value={basicInfoValues?.fullName}
                          mandatory
                        />
                      </div>
                     
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <SelectInput
                            name="assessorType"
                            label="Assessor Type"
                            placeHolder="Select Assessor Type"
                            value={basicInfoValues?.assessorType}
                            handleChange={(e) => changeHandler(e, "basicInfo")}
                            options={assessorTypeOption}
                            error={errors?.assessorType}
                            mandatory
                          />
                        </div>
                      <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                        <Input
                          label="AR ID (SIP)"
                          name="assessorSipId"
                          placeholder="Enter AR ID"
                          onFocus={focusHandler}
                          // error={errors?.lastName}
                          onBlur={blurHandler}
                          onChange={(e) => changeHandler(e, "basicInfo")}
                          value={basicInfoValues?.assessorSipId}
                          // mandatory
                        />
                      </div>
                      <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                        <AutoCompleteAsyncInput
                        name="sector"
                        label="Sector"
                        value={basicInfoValues?.sector || []}
                        handleChange={changeHandler}
                        setter={setBasicInfoValues}
                        optionLists={ALPHABETIC_SORT(sectorList)}
                        error={errors?.sector}
                        enableMultiSelect={true}
                      />
                      </div>
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <Input
                            label="Email Address"
                            name="email"
                            placeholder="Enter Email Address"
                            onFocus={focusHandler}
                            error={errors?.email}
                            onBlur={blurHandler}
                            onChange={(e) => changeHandler(e, "basicInfo")}
                            value={basicInfoValues?.email}
                            mandatory
                            // disabled={assessorMDBId ? true : false}
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <Input
                            label="Contact Number"
                            type={"number"}
                            name="mobile"
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                            }}
                            placeholder="Enter Contact No."
                            onFocus={focusHandler}
                            error={errors?.mobile}
                            onBlur={blurHandler}
                            onChange={(e) => changeHandler(e, "basicInfo")}
                            value={basicInfoValues?.mobile}
                            hideExponants={true}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <SelectInput
                            name="gender"
                            label="Gender"
                            placeHolder="Select Gender"
                            value={basicInfoValues?.gender || " "}
                            handleChange={(e) => changeHandler(e, "basicInfo")}
                            options={GENDER_MENUS}
                            error={errors?.gender}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <DateInput
                            name="dob"
                            label="Date Of Birth"
                            placeholder="DD-MM-YYYY"
                            value={basicInfoValues?.dob}
                            setFormValues={setFormValues}
                            onFocus={focusHandler}
                            onBlur={blurHandler}
                            error={errors?.dob}
                            handleDateChange={(e) => dateChangeHandler(e, "dob")}
                            mandatory
                            disableFuture
                            minDate={startOfDOB}
                            maxDate={endOfDOB}
                            // format
                          />
                        </div>
                      )}
                     
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <SelectInput
                            name="state"
                            label="State"
                            placeHolder="Select State"
                            value={basicInfoValues?.state || ``}
                            handleChange={(e) => {
                              changeHandler(e, "basicInfo");
                              getCityListsHandler(e);
                            }}
                            options={formattedStateList}
                            error={errors?.state}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <SelectInput
                            name="district"
                            label="District"
                            placeHolder="Select District"
                            value={basicInfoValues?.district || ``}
                            loading={cityLoading}
                            handleChange={(e) => changeHandler(e, "basicInfo")}
                            options={cityLists}
                            error={errors?.district}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <Input
                            label="Pincode"
                            type={"number"}
                            name="pinCode"
                            placeholder="Enter your Pincode"
                            mandatory
                            onFocus={focusHandler}
                            error={errors?.pinCode}
                            onBlur={blurHandler}
                            onChange={(e) => changeHandler(e, "basicInfo")}
                            value={basicInfoValues?.pinCode}
                            hideExponants={true}
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <SelectInput
                            name="modeofAgreement"
                            label="Assessor Mode"
                            placeHolder="Select"
                            value={basicInfoValues?.modeofAgreement || ""}
                            handleChange={(e) => changeHandler(e, "basicInfo")}
                            options={MODE_OF_AGREEMENT_OPTIONS}
                            error={errors?.modeofAgreement}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                          <SelectInput
                            name="ToaType"
                            label="TOA Type"
                            placeHolder="Select"
                            value={basicInfoValues?.ToaType || ""}
                            handleChange={(e) => changeHandler(e, "basicInfo")}
                            options={TOA_TYPE}
                            error={errors?.ToaType}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) &&
                        basicInfoValues?.ToaType === "Radiant" && (
                          <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                            <RadioButton
                              handleChange={(e) => changeHandler(e, "basicInfo")}
                              options={yesNo}
                              name="RadiantFundToa"
                              label="Does Radiant funded for training?"
                              value={basicInfoValues?.RadiantFundToa}
                              error={errors?.RadiantFundToa}
                              mandatory={basicInfoValues?.ToaType === "Radiant" ? true : false}
                            />
                          </div>
                        )}

                         {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div className="form-group" style={{ width: "calc(100% - 10px)" }}>
                          <Input
                            label="Address"
                            type="text"
                            name={"address"}
                            placeholder="Enter Address"
                            onFocus={focusHandler}
                            error={errors?.address}
                            onBlur={blurHandler}
                            onChange={(e) => changeHandler(e, "basicInfo")}
                            value={basicInfoValues?.address}
                            mandatory
                          />
                        </div>
                      )}
                    </div>
                  </form>
                )}
              </div>
              <div className="img-upload-wrapper_assessor" style={{ width: "calc(25% - 20px)" }}>
                <div
                  className="new_img_upload"
                  style={{
                    border: [errors?.assessorPhoto ? "1px solid #D70000" : ""],
                  }}>
                  <img src={ImgURL} />
                  <div className="img_upload_container">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        name="assessorPhoto"
                        id="assessorPhoto"
                        style={{ display: "none" }}
                        onChange={(e) => loadFile(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="upload_icon_controlBox">
                  <div className="upload_icon_container">
                    <label htmlFor="assessorPhoto" style={{ cursor: "pointer" }}>
                      {<UploadIcon className="control_icon" />}
                    </label>
                    <label>
                      <DeleteIcon className="control_icon" name="assessorPhoto" onClick={(e) => deleteImage(e)} />
                    </label>
                  </div>
                  <div className="img-upload-text">
                    <p className="greyText">PNG or JPG no bigger than 500px wide and tall.</p>
                  </div>
                </div>
                <p className="error-input">{errors?.assessorPhoto || ""}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="action-btn-card">
        <Button
          className={`outlined-btn`}
          variant="outlined"
          onClick={abortProfileCreation}
          disabled={loading ? true : false}>
          Cancel
        </Button>
        <Button
          className={`light-blue-btn submit-btn`}
          variant="contained"
          onClick={handleSubmitBasicInfo}
          disabled={loading ? true : false}>
          {loading ? <RiseLoader size="5px" color="white" /> : "Save"}
        </Button>
      </div>
    </section>
  );
};

export default BasicInfo;

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
