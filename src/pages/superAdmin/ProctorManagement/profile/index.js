import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import {
  ASSESSOR_MANAGEMENT_HOME,
  PROCTOR_MANAGEMENT_HOME,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { RiseLoader } from "react-spinners";
import DateInput from "../../../../components/common/DateInput";
import dayjs from "dayjs";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { getAllJobRoles } from "../../../../api/superAdminApi/jobRoleManagement";
import {
  createAssessorProfileApi,
  uploadFilesS3Api,
} from "../../../../api/superAdminApi/assessorManagement";
import { getClientManagementListsApi } from "../../../../api/superAdminApi/clientManagement";
import axios from "axios";
import { API_ROOT } from "../../../../config/constants/apiConstants/auth";
import { UPLOAD_FILES_S3_API } from "../../../../config/constants/apiConstants/superAdmin";
import { createProctorProfileApi } from "../../../../api/superAdminApi/proctorManagement";
import validateFileField from "../../../../utils/validateFileField";

const initialFormValues = () => {
  return {
    proctorName: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    state: "",
    pinCode: "",
    district: "",
    experience: "",
    cv: {},
    aadharNo: "",
    aadharCard: {},
    panCard: {},
    panCardNo: "",
    bankName: "",
    bankAccount: "",
    bankIFSC: "",
    agreementSigned: "",
    agreementValidity: "",
    assessorPhoto: "",
    experienceCertificate: {},
    agreementCertificate: {},
    highSchoolCertificate: {},
    intermediateCertificate: {},
    diplomaCertificate: {},
    undergradCertificate: {},
    postgradCertificate: {},
    otherCertificate: {},
    modeofAgreement: "",
  };
};

const ProctorManagementProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  

  useEffect(() => {
    const formData = {
      country: "India",
    };
    dispatch(getStateListsApi(formData, setLoading));
    dispatch(getAllJobRoles(setLoading));
    dispatch(getClientManagementListsApi(setLoading));
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

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });

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
      let targetSIP = formValues?.sipDetails[index];
      const updatedSIP = { ...targetSIP, [name]: formattedDate };
      let existingSIP = formValues?.sipDetails;
      existingSIP[index] = updatedSIP;

      setFormValues({ ...formValues, sipDetails: existingSIP });
    } else setFormValues((pre) => ({ ...pre, [name]: formattedDate }));

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = {};
    const data = { ...formValues };
    if (data.agreementSigned == "No") {
      delete data.modeofAgreement;
    }
    Object.keys(data).forEach((name) => {
      const value = formValues[name];
      if(typeof value ==="object"){
        console.log("<---->",typeof value);
        const fieldError = validateFileField(name, value);
     
        if (fieldError) {
          formErrors[name] = fieldError;
        }
        console.log("fieldError",fieldError)
      }
      else{
        const fieldError = validateField(name, value);

        if (fieldError) {
          formErrors[name] = fieldError;
        }
      }
      if (name === "sipDetails") {
        formValues?.sipDetails.map((el, index) => {
          Object.keys(el).forEach((poc_name) => {
            const value_poc = el[poc_name];
            const fieldError_poc = validateField(poc_name, value_poc);
            if (fieldError_poc) {
              formErrors[`${poc_name}${index}`] = fieldError_poc;
            }
          });
        });
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
    
      
      // Submit the form data
      const stateLabel = stateLists.find(
        (item) => item.value == formValues.state
      ).label;
      const formDataNew = {
        ...formValues,
        state: stateLabel,
      };

      setLoading(true);
      const data = createFormData(formDataNew);
      dispatch(
        createProctorProfileApi(
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
    setFormValues((prev) => ({ ...prev, district: "" }));
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
      if (id === "assessorPhoto")
        setImgURL(URL.createObjectURL(event.target.files[0]));
      if (id !== "sipCertificate")
        setFormValues({ ...formValues, [id]: files[0] });
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

  const startOfDOB = dayjs("1970-01-01T00:00:00.000");
  const endOfDOB = dayjs("2004-01-01T00:00:00.000");

  const abortProfileCreation = () => {
    clearFormValues();
    navigate(PROCTOR_MANAGEMENT_HOME);
  };

  return (
    <div className="main-content">
      <div className="title">
        <h1>
          <ArrowLeft onClick={() => navigate(PROCTOR_MANAGEMENT_HOME)} />
          <span>Proctor Form</span>
        </h1>
      </div>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "flex" }}>
            <div className="form-wrapper" style={{ width: "100%" }}>
              <div className="form_title">
                <h1>BASIC DETAILS</h1>
              </div>
              <div className="form_mainContainer">
                <div className="form">
                  <form>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "100%" }} className="form-group">
                        <Input
                          label="Proctor Name"
                          name="proctorName"
                          placeholder="Enter Proctor Name"
                          onFocus={focusHandler}
                          error={errors?.proctorName}
                          onBlur={blurHandler}
                          onChange={changeHandler}
                          value={formValues?.proctorName}
                          mandatory
                        />
                      </div>
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
                          onChange={changeHandler}
                          value={formValues?.email}
                          mandatory
                        />
                      </div>
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
                          onChange={changeHandler}
                          value={formValues?.mobile}
                          hideExponants={true}
                          mandatory
                        />
                      </div>
                      <div
                        style={{ width: "calc(50% - 10px)" }}
                        className="form-group"
                      >
                        <SelectInput
                          name="gender"
                          label="Gender"
                          placeHolder="Select Gender"
                          value={formValues?.gender}
                          handleChange={changeHandler}
                          options={GENDER_MENUS}
                          error={errors?.gender}
                          mandatory
                        />
                      </div>
                      <div
                        style={{ width: "calc(50% - 10px)" }}
                        className="form-group"
                      >
                        <DateInput
                          name="dob"
                          label="Date Of Birth"
                          placeholder="MM-DD-YYYY"
                          value={formValues?.dob}
                          setFormValues={setFormValues}
                          onFocus={focusHandler}
                          onBlur={blurHandler}
                          error={errors?.dob}
                          handleDateChange={(e) => dateChangeHandler(e, "dob")}
                          mandatory
                          minDate={startOfDOB}
                          maxDate={endOfDOB}
                        />
                      </div>
                      <div
                        className="form-group"
                        style={{ width: "calc(50% - 10px)" }}
                      >
                        <Input
                          label="Address"
                          type="text"
                          name={"address"}
                          placeholder="Enter Address"
                          onFocus={focusHandler}
                          error={errors?.address}
                          onBlur={blurHandler}
                          onChange={changeHandler}
                          value={formValues?.address}
                          mandatory
                        />
                      </div>
                      <div
                        style={{ width: "calc(50% - 10px)" }}
                        className="form-group"
                      >
                        <SelectInput
                          name="state"
                          label="State"
                          placeHolder="Select State"
                          value={formValues?.state}
                          handleChange={(e) => {
                            changeHandler(e);
                            getCityListsHandler(e);
                          }}
                          options={stateLists}
                          error={errors?.state}
                          mandatory
                        />
                      </div>
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
                          onChange={changeHandler}
                          value={formValues?.pinCode}
                          hideExponants={true}
                        />
                      </div>
                      <div
                        style={{ width: "calc(50% - 10px)" }}
                        className="form-group"
                      >
                        <SelectInput
                          name="district"
                          label="District"
                          placeHolder="Select District"
                          value={formValues?.district}
                          loading={cityLoading}
                          handleChange={changeHandler}
                          options={cityLists}
                          error={errors?.district}
                          mandatory
                        />
                      </div>
                      {/* <div style={{ width: "100%" }} className="form-group">
                        <SelectInput
                          name="clientName"
                          label="Client Name"
                          placeHolder="Select Job Role"
                          value={formValues?.clientName}
                          handleChange={changeHandler}
                          options={clientsList}
                          error={errors?.clientName}
                          mandatory
                        />
                      </div> */}
                    </div>
                  </form>
                </div>
                <div className="img-upload-wrapper_assessor">
                  <div
                    className="new_img_upload"
                    style={{
                      border: [
                        errors?.assessorPhoto ? "1px solid #D70000" : "",
                      ],
                    }}
                  >
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
                      <label
                        htmlFor="assessorPhoto"
                        style={{ cursor: "pointer" }}
                      >
                        {<UploadIcon width={35} />}
                      </label>
                      <label>
                        <DeleteIcon
                          width={35}
                          name="assessorPhoto"
                          onClick={(e) => deleteImage(e)}
                        />
                      </label>
                    </div>
                    <div className="img-upload-text">
                      <p className="greyText">
                        PNG or JPG no bigger than 500px wide and tall.
                      </p>
                    </div>
                  </div>
                  <p className="error-input">{errors?.assessorPhoto || ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub-admin-wrapper">
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
                            {formValues?.highSchoolCertificate ? formValues?.highSchoolCertificate?.name ?formValues?.highSchoolCertificate?.name :"No File" :"No File"}
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
                      <div className="upload_input">
                        <p className="greyText">
                        {formValues?.intermediateCertificate ? formValues?.intermediateCertificate?.name ?formValues?.intermediateCertificate?.name :"No File" :"No File"}

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
                      <div className="upload_input">
                        <p className="greyText">
                        {formValues?.diplomaCertificate ? formValues?.diplomaCertificate?.name ?formValues?.diplomaCertificate?.name :"No File" :"No File"}
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
                      <div className="upload_input">
                        <p className="greyText">
                        {formValues?.undergradCertificate ? formValues?.undergradCertificate?.name ?formValues?.undergradCertificate?.name :"No File" :"No File"}

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
                      <div className="upload_input">
                        <p className="greyText">
                        {formValues?.postgradCertificate ? formValues?.postgradCertificate?.name ?formValues?.postgradCertificate?.name :"No File" :"No File"}

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
                      <div className="upload_input">
                        <p className="greyText">
                        {formValues?.otherCertificate ? formValues?.otherCertificate?.name ?formValues?.otherCertificate?.name :"No File" :"No File"}

                            
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
                                  .docx, .pdf. The file size should not exceed
                                  20MB
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
                          <p>{formValues?.experienceCertificate?.name || ""}</p>
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
                        {/* <div>
                          <p className="greyText">
                            Max file size allowed is 20MB
                          </p>
                        </div> */}
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
                        {formValues?.cv ? formValues?.cv?.name ?formValues?.cv?.name :"No File" :"No File"}

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
      </section>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "block" }}>
            <div className="form-wrapper">
              <div className="form_title">
                <h1>Personal Details</h1>
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
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Aadhar No"
                        type={"text"}
                        name="aadharNo"
                        placeholder="Enter Aadhar Number"
                        onFocus={focusHandler}
                        error={errors?.aadharNo}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.aadharNo}
                        mandatory
                      />
                      <div className="card_upload_doc">
                        <input
                          type="file"
                          name="image"
                          id="aadharCard"
                          style={{ display: "none" }}
                          onChange={(e) => loadFile(e)}
                        />
                        <div className="img_upload_title_extention">
                          <PaperClip width={15} height={15} />
                          <label
                            htmlFor="aadharCard"
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
                                  .docx, .pdf. The file size should not exceed
                                  20MB
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className="uploaded_image_container"
                          style={{
                            display: [formValues?.aadharCard?.name ? "" : "none"],
                          }}
                        >
                          <p>
                            {formValues?.aadharCard
                              ? formValues?.aadharCard?.name?formValues?.aadharCard?.name:""
                              : ""}
                          </p>
                          <TrashIcon
                            width={18}
                            name="aadharCard"
                            onClick={(e) => deleteImage(e)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <p className="error-input">
                          {errors?.aadharCard || ""}
                        </p>
                        <div>
                          <p className="greyText">
                            Max file size allowed is 20MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="PAN Card No"
                        type={"text"}
                        name="panCardNo"
                        placeholder="Enter PAN Card Number"
                        onFocus={focusHandler}
                        error={errors?.panCardNo}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.panCardNo}
                        mandatory
                      />
                      <div className="card_upload_doc">
                        <input
                          type="file"
                          name="image"
                          id="panCard"
                          style={{ display: "none" }}
                          onChange={(e) => loadFile(e)}
                        />
                        <div className="img_upload_title_extention">
                          <PaperClip width={15} height={15} />
                          <label
                            htmlFor="panCard"
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
                                  .docx, .pdf. The file size should not exceed
                                  20MB
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className="uploaded_image_container"
                          style={{
                            display: [formValues?.panCard?.name ? "" : "none"],
                          }}
                        >
                          <p>
                              {formValues?.panCard
                              ? formValues?.panCard?.name?formValues?.panCard?.name:""
                              : ""}
                          </p>
                          <TrashIcon
                            width={18}
                            name="panCard"
                            onClick={(e) => deleteImage(e)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <p className="error-input">{errors?.panCard || ""}</p>
                        <div>
                          <p className="greyText">
                            Max file size allowed is 20MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div style={{ width: "100%" }} className="form-group">
                      <SelectInput
                        name="bankName"
                        label="Bank Name"
                        placeHolder="Select Education"
                        value={formValues?.bankName}
                        handleChange={changeHandler}
                        options={BANKS}
                        error={errors?.bankName}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Bank Account No"
                        type={"text"}
                        name="bankAccount"
                        placeholder="Enter Bank Account Number"
                        onFocus={focusHandler}
                        error={errors?.bankAccount}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.bankAccount}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="IFSC Code"
                        type={"text"}
                        name="bankIFSC"
                        placeholder="Enter IFSC Code"
                        onFocus={focusHandler}
                        error={errors?.bankIFSC}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.bankIFSC}
                        mandatory
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "block" }}>
            <div className="form-wrapper">
              <div className="form_title">
                <h1>Agreement Details</h1>
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
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <SelectInput
                        name="agreementSigned"
                        label="Agreement Signed"
                        placeHolder="Select an option"
                        value={formValues?.agreementSigned}
                        handleChange={changeHandler}
                        options={CONFIRMATION}
                        error={errors?.agreementSigned}
                        mandatory
                      />
                    </div>

                    <div
                      style={{
                        width: "calc(50% - 10px)",
                        display: [
                          formValues?.agreementSigned === "Yes" ? "" : "none",
                        ],
                      }}
                      className="form-group"
                    >
                      <DateInput
                        name="agreementValidity"
                        label="Agreement Validity"
                        placeholder="Dd-Mm-Yy"
                        value={formValues?.agreementValidity}
                        setFormValues={setFormValues}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        error={errors?.agreementValidity}
                        handleDateChange={(e) =>
                          dateChangeHandler(e, "agreementValidity")
                        }
                        disablePast
                      />
                    </div>

                    <div
                      style={{
                        width: "calc(50% - 10px)",
                        display: [
                          formValues?.agreementSigned === "Yes" ? "" : "none",
                        ],
                      }}
                      className="form-group"
                    >
                      <SelectInput
                        name="modeofAgreement"
                        label="Mode of Agreement"
                        placeHolder="Select an option"
                        value={formValues?.modeofAgreement}
                        handleChange={changeHandler}
                        options={MODE_OF_AGREEMENT_OPTIONS}
                        error={errors?.modeofAgreement}
                        mandatory={
                          formValues.agreementSigned === "Yes" ? true : false
                        }
                      />
                    </div>

                    <div
                      className="custom_input"
                      style={{
                        width: "48%",
                        display: [
                          formValues?.agreementSigned === "Yes" ? "" : "none",
                        ],
                      }}
                    >
                      <div className="input_label">
                        <label>Upload Agreement</label>
                        {/* <p style={{ color: "red" }}>*</p> */}
                      </div>
                      <div
                        className="upload_input"
                        style={{
                          border: [
                            errors?.agreementCertificate
                              ? "1px solid #D70000"
                              : "",
                          ],
                          width: "79%",
                        }}
                      >

                        <p className="greyText">
                          {formValues?.agreementCertificate
                            ? formValues?.agreementCertificate.name ?formValues?.agreementCertificate.name :"No File"
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
                            hidden
                            id="agreementCertificate"
                            onChange={(e) => loadFile(e)}
                          />
                        </Button>
                      </div>
                      <p className="error-input">
                        {errors?.agreementCertificate || ""}
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="action-btn-card">
        <Button
          className={`outlined-btn`}
          variant="outlined"
          onClick={abortProfileCreation}
          disabled={loading ? true : false}
        >
          Cancel
        </Button>
        <Button
          className={`light-blue-btn submit-btn`}
          variant="contained"
          onClick={handleSubmit}
          disabled={loading ? true : false}
        >
          {loading ? <RiseLoader size="5px" color="white" /> : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default ProctorManagementProfile;

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
