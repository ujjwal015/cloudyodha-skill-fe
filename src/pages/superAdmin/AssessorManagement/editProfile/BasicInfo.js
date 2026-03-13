import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import SelectInput from "./../../../../components/common/SelectInput";
import Input, { RadioButton } from "./../../../../components/common/input";
import { getCityListsApi, getStateListsApi } from "./../../../../api/authApi";
import { Button } from "@mui/material";
import {
  assessorTypeOption,
  GENDER_MENUS,
  MODE_OF_AGREEMENT_OPTIONS,
  TOA_TYPE,
} from "../../../../config/constants/projectConstant";
import {
  authSelector,
  getCityLists,
} from "./../../../../redux/slicers/authSlice";
import {
  ALPHABETIC_SORT,
  errorToast,
  getSchemeType,
  schemeOptions,
} from "./../../../../utils/projectHelper";
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
  getAssessorBasicDetailsApi,
  updateAssessorBasicInfoApi,
} from "../../../../api/superAdminApi/assessorManagement";
import { getClientManagementListsApi, getSectorListApi } from "../../../../api/superAdminApi/clientManagement";
import { Icon } from "@iconify/react";
import { assessorAttendanceSelector } from "../../../../redux/slicers/superAdmin/assessorAttendanceSlice";
import { yesNo } from "../../examManagement/batch/data";
import SchemeEditCheckbox from "./components/SchemeCheckbox";
import AutoCompleteAsyncInput from "../../../../components/common/AutoCompleteAsyncInput";

const initialBasicInfoValues = () => {
  return {
    fullName: "",
    assessorSipId: "",
    email: "",
    sector: "",
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
    assessorType:""
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
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState("");
  const { stateLists = [], cityLists = [] } = useSelector(authSelector);

  const [ImgURL, setImgURL] = useState(UserProfile);
  const { jobRolesListAll = [] ,sectorList} = useSelector(clientManagementSelector);
  const [jobRoles, setJobRoles] = useState();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [basicInfoValues, setBasicInfoValues] = useState({});
  const params = useParams();
  const assessorMDBId = params.id;

  const [isSessionActive, setisSessionActive] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formattedStateList, setFormattedStateList] = useState([]);
  const [formattedDistrictList, setFormattedDistrictList] = useState([]);
  const { assessBasicDetails = {} } = useSelector(assessorAttendanceSelector);
  const [schemeSelected, setSchemeSelected] = useState([]);
  const [useEvent, setUserEvent] = useState(false);
  const basicInfoValuesRef = useRef(basicInfoValues);
  const assessorMDBIdMemoized = useMemo(() => assessorMDBId, [assessorMDBId]);
  const [incomingScheme, setIncomingScheme] = useState([]);
  const [incomingSeparatedScheme, setIncomingSeparatedScheme] = useState([]);
  const RemainingScheme = [];

  const filterSchemeMentioned = (data = []) => {
    const sortedarr = schemeOptions.map((item) => item.value);
    let arr = [];
    if (data?.scheme?.length > 0) {
      for (let items of data?.scheme) {
        arr = sortedarr.filter((data) => data !== items);
      }
    }
  };

  const getCommonSchemes = (schemeOptions, options = []) => {
    if (options?.length > 0) {
      return schemeOptions
        .filter((option) => options?.includes(option?.value))
        .map((option) => option?.value);
    }
  };

  const getIntersectionSchemes = (schemeOptions, options = []) => {
    if (options?.length > 0) {
      const schemeValues = schemeOptions?.map((option) => option?.value);
      return options?.filter((value) => !schemeValues?.includes(value));
    }
  };

  useEffect(() => {
    if (
      Object.keys(assessBasicDetails).length > 0 &&
      assessBasicDetails?.scheme?.length > 0
    ) {
      // filterSchemeMentioned(assessBasicDetails);
      // setSchemeSelected(assessBasicDetails?.scheme);
      setIncomingScheme(
        getCommonSchemes(schemeOptions, assessBasicDetails?.scheme)
      );
      setIncomingSeparatedScheme(
        getIntersectionSchemes(schemeOptions, assessBasicDetails?.scheme)
      );
      updateSchemeSelectedParent(assessBasicDetails?.scheme);
    }
  }, [assessBasicDetails]);

  useEffect(() => {
    if (incomingScheme.length > 0) {
      setSchemeSelected(incomingScheme);
    }
  }, [incomingScheme]);

  useEffect(() => {
    if (schemeSelected?.length > 0) {
      setBasicInfoValues((prevValues) => {
        let updatedValues = {};
        if (
          getSchemeType(schemeSelected).includes("Non PMKVY") ||
          getSchemeType(schemeSelected).includes("PMKVY")
        ) {
          updatedValues = initialBasicInfoValues();
        } else {
          updatedValues = initialBasicInfoValuesForVishwakarmascheme();
        }
        const filteredAssessDetails = {};
        for (let key in updatedValues) {
          if (key in assessBasicDetails) {
            filteredAssessDetails[key] = assessBasicDetails[key];
          }
        }
        return {
          // ...prevValues,
          ...updatedValues,
          ...filteredAssessDetails,
          assessorPhoto: assessBasicDetails?.profileKey,
          RadiantFundToa: assessBasicDetails?.RadiantFundToa,
        };
      });
    }
  }, [schemeSelected, assessBasicDetails]);

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
    dispatch(getCityLists([]));
    dispatch(getStateListsApi(formData, setLoading));
    dispatch(getAllJobRoles(setLoading));
    dispatch(getClientManagementListsApi(setLoading));
    dispatch(getSectorListApi(setLoading));
    dispatch(
      getAssessorBasicDetailsApi(
        setLoading,
        assessorMDBId,
        setBasicInfoValues,
        setFormattedDistrictList
      )
    );
  };

  useEffect(() => {
    currentTab === 0 && getDetails();
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

    setBasicInfoValues((pre) => ({ ...pre, [name]: formattedDate }));

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

  const clearFormValues = () => {
    // setFormValues(initialFormValues());
    setBasicInfoValues({});
    setImgURL(UserProfile);
  };
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

    delete basicInfoValues?.url;

    if (event.target.files) {
      const { name, id, files } = event.target;

      // const { id, files } = event.target;
      if (id === "assessorPhoto") {
        var newImageUrl = URL.createObjectURL(event.target.files[0]);
        setImgURL(newImageUrl);
      }
      if (id !== "sipCertificate")
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
    let existingFormData = { ...basicInfoValues };
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
  };

  const handleIconHover = (event) => {
    const { clientX, clientY } = event;
    setShowTooltip(true);
    setTooltipPosition({ x: clientX, y: clientY + 10 });
  };

  const handleIconLeave = () => {
    setShowTooltip(false);
  };

  const startOfDOB = dayjs("1947-08-15T00:00:00.000");
  const endOfDOB = dayjs("2004-01-01T00:00:00.000");

  const abortProfileCreation = () => {
    // clearFormValues();
    navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=${SECTION}`);
  };

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
        let payload = {};
        if (
          getSchemeType(schemeSelected).includes("PM Vishvakarma") &&
          schemeSelected.length > 0
        ) {
          payload = { ...formData, scheme: schemeSelected };
        } else {
          payload = {
            ...formData,
            scheme: [...schemeSelected, ...incomingSeparatedScheme],
          };
        }

        if (Array.isArray(payload.sector) && payload.sector.length === 0) {
            payload.sector = JSON.stringify([]); 
        } else if (Array.isArray(payload.sector)) {
            payload.sector = JSON.stringify(payload.sector.map(s => ({
                sectorId: s.jobRoleId, 
                sectorName: s.jobRoleLabel
            })));
        }
        setLoading(true);
        dispatch(
          updateAssessorBasicInfoApi(
            payload,
            setLoading,
            clearFormValues,
            controlFunc,
            assessorMDBId
          )
        );
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
  };

  const setSchemeHandler = (data) => {
    setSchemeSelected(data);
    updateSchemeSelectedParent(data);
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
                    Onboarding in Progress{" "}
                    <Icon icon={"formkit:trash"} onClick={destroySession} />
                  </p>
                )}
              </div>
              <h1>BASIC DETAILS</h1>
            </div>
            <div className="form_mainContainer">
              <div className="form" style={{ width: "75%" }}>
                <SchemeEditCheckbox
                  updateScheme={setSchemeHandler}
                  incomingScheme={schemeSelected}
                  title={"Select Scheme"}
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
                      }}
                    >
                      <div
                        style={{ width: "calc(50% - 10px)" }}
                        className="form-group"
                      >
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
                      <div
                        style={{ width: "calc(50% - 10px)" }}
                        className="form-group"
                      >
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
                        value={basicInfoValues?.sector?.map((item) => ({
                          value: item?.sectorId || item?.jobRoleId || item?.value, 
                          label: item?.sectorName || item?.jobRoleLabel || item?.label
                        }))||[]}
                        onchange={changeHandler}
                        setter={setBasicInfoValues}
                        optionLists={ALPHABETIC_SORT(sectorList)}
                        error={errors?.sector}
                        enableMultiSelect={true}
                      />
                      </div>
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
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
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <Input
                            label="Email Address"
                            name="email"
                            placeholder="Enter Email Address"
                            onFocus={focusHandler}
                            error={errors?.email}
                            onBlur={blurHandler}
                            onChange={(e) => changeHandler(e, "basicInfo")}
                            value={basicInfoValues?.email}
                            disabled={assessBasicDetails?.email}
                            mandatory
                            // disabled={((getSchemeType(schemeSelected).includes("Non PMKVY") ||
                            //   getSchemeType(schemeSelected).includes("PMKVY")) && basicInfoValues?.email)}
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
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
                            // disabled={assessBasicDetails?.mobile}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <SelectInput
                            name="gender"
                            label="Gender"
                            placeHolder="Select Gender"
                            value={basicInfoValues?.gender || ""}
                            handleChange={(e) => changeHandler(e, "basicInfo")}
                            options={GENDER_MENUS}
                            error={errors?.gender}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <DateInput
                            name="dob"
                            label="Date Of Birth"
                            placeholder="Dd-Mm-Yy"
                            value={basicInfoValues?.dob}
                            setFormValues={setBasicInfoValues}
                            onFocus={focusHandler}
                            onBlur={blurHandler}
                            error={errors?.dob}
                            handleDateChange={(e) =>
                              dateChangeHandler(e, "dob")
                            }
                            mandatory
                            disableFuture
                            minDate={startOfDOB}
                            maxDate={endOfDOB}
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div
                          className="form-group"
                          style={{ width: "calc(100% - 10px)" }}
                        >
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
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <SelectInput
                            name="state"
                            label="State"
                            placeHolder="Select State"
                            value={basicInfoValues?.state || ""}
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
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <SelectInput
                            name="district"
                            label="District"
                            placeHolder="Select District"
                            value={basicInfoValues?.district || ""}
                            loading={cityLoading}
                            handleChange={(e) => changeHandler(e, "basicInfo")}
                            options={formattedDistrictList}
                            error={errors?.district}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
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
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <SelectInput
                            name="modeofAgreement"
                            label="Assessor Mode"
                            placeHolder="Select"
                            value={basicInfoValues?.modeofAgreement || " "}
                            handleChange={(e) => changeHandler(e, "basicInfo")}
                            options={MODE_OF_AGREEMENT_OPTIONS}
                            error={errors?.modeofAgreement}
                            mandatory
                          />
                        </div>
                      )}
                      {(getSchemeType(schemeSelected).includes("Non PMKVY") ||
                        getSchemeType(schemeSelected).includes("PMKVY")) && (
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <SelectInput
                            name="ToaType"
                            label="TOA Type"
                            placeHolder="Select"
                            value={basicInfoValues?.ToaType || "-"}
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
                          <div
                            style={{ width: "calc(50% - 10px)" }}
                            className="form-group"
                          >
                            <RadioButton
                              handleChange={(e) =>
                                changeHandler(e, "basicInfo")
                              }
                              options={yesNo}
                              name="RadiantFundToa"
                              label="Does Radiant funded for training?"
                              value={basicInfoValues?.RadiantFundToa}
                              error={errors?.RadiantFundToa}
                              mandatory={
                                basicInfoValues?.ToaType === "Radiant"
                                  ? true
                                  : false
                              }
                            />
                          </div>
                        )}
                    </div>
                  </form>
                )}
              </div>
              <div
                className="img-upload-wrapper_assessor"
                style={{ width: "calc(25% - 20px)" }}
              >
                <div
                  className="new_img_upload"
                  style={{
                    border: [errors?.assessorPhoto ? "1px solid #D70000" : ""],
                  }}
                >
                  <img src={ImgURL} loading="lazy" />
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
                    <label
                      htmlFor="assessorPhoto"
                      style={{ cursor: "pointer" }}
                    >
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
