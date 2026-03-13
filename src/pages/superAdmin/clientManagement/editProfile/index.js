import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import SelectInput from "./../../../../components/common/SelectInput";
import Input, { FormSwitch } from "./../../../../components/common/input";
import { getCityListsApi, getStateListsApi } from "./../../../../api/authApi";
import {
  createClientManagementProfileApi,
  createClientProfile,
  getSectorListApi,
  getSpecificClient,
  updateClientDetails,
} from "./../../../../api/superAdminApi/clientManagement";
import { Button } from "@mui/material";
import {
  SUB_ADMIN_ORGANISATION_TYPE_MENUS,
  STATUS,
  ROLE_TYPE,
  DEPARTMENT_LIST,
} from "../../../../config/constants/projectConstant";
import { ReactComponent as MobileIcon } from "../../../../assets/icons/mobile-icon.svg";
import {
  authSelector,
  getCityLists,
} from "./../../../../redux/slicers/authSlice";
import {
  ALPHABETIC_SORT,
  errorToast,
  getUserDetails,
  successToast,
} from "./../../../../utils/projectHelper";
import { ReactComponent as ArrowLeft } from "./../../../../assets/icons/chevron-left.svg";
import { ReactComponent as UploadIcon } from "./../../../../assets/images/pages/clientManagement/upload-icon.svg";
import { ReactComponent as DeleteIcon } from "./../../../../assets/images/pages/clientManagement/delete-icon.svg";
import UserProfile from "./../../../../assets/images/pages/clientManagement/dummy-user-profile.png";
import { SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import {
  BarLoader,
  FadeLoader,
  GridLoader,
  MoonLoader,
  RingLoader,
} from "react-spinners";
import {
  clientSelector,
  getSpecificClientDetails,
} from "../../../../redux/slicers/clientSlice";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AutoCompleteAsyncInput from "../../../../components/common/AutoCompleteAsyncInput";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";

const initialFormValues = {
  clientname: "",
  clientcode: "",
  email: "",
  mobile: "",
  landLine: "",
  webpage: "",
  address: "",
  state: "",
  sector:[],
  client_city: "",
  pincode: "",
  organisationType: "",
  client_status: "inactive",
  password: "",
  confirm_password: "",
  logo_status: false,
  spoke: [
    {
      spoke_designation: "",
      spoke_department: "",
      spoke_name: "",
      spoke_email: "",
      spoke_mobile: "",
    },
  ],
};

const ClientManagementProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const newdataformValues = formValues?.sector?.map((item) => ({
    value: item?.sectorId || item?.jobRoleId || item?.value, 
    label: item?.sectorName || item?.jobRoleLabel || item?.label
  }));
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const { stateLists = [], cityLists = [] } = useSelector(authSelector);
  const {sectorList}=useSelector(clientManagementSelector);
  const [ImgURL, setImgURL] = useState(null);
  const [clientId, setClientId] = useState();
  const [collectLogo, setCollectLogo] = useState(false);
  const params = useParams();
  const { specificClientDetails = {} } = useSelector(clientSelector);

  const getClientDetails = () => {
    setLoading(true);
    dispatch(getSpecificClient(setLoading, params.id));
  };

  useEffect(() => {
    if (params.id) {
      setClientId(params.id);
      getClientDetails();
    }
  }, []);

  useEffect(() => {
    setFormValues({ ...formValues, logo_status: collectLogo });
  }, [collectLogo]);

  useEffect(() => {
    if (specificClientDetails.length > 0) {
      const details = specificClientDetails[0];
      setFormValues({ ...details, logo_status: collectLogo });
      setImgURL(specificClientDetails[0]?.url);
    }
  }, [specificClientDetails]);

  useEffect(() => {
    const formData = {
      country: "India",
    };
    dispatch(getStateListsApi(formData, setLoading));
    dispatch(getSectorListApi(setLoading));
  }, []);

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
    if (name === "confirm_password") {
      if (value !== formValues?.password) {
        setErrors({ [name]: "Password doesn't match" });
      }
    }
  };

  const changeHandlerPOC = (e, index) => {
    const { name, value, type, checked } = e.target;
    const fieldError = validateField(name, value);

    let targetPOC = formValues?.spoke[index];
    const updatedPOC = { ...targetPOC, [name]: value };
    var existingPOC = [...formValues?.spoke];
    existingPOC[index] = updatedPOC;

    setFormValues({ ...formValues, spoke: existingPOC });

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

    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
      if (name === "spoke") {
        formValues?.spoke.map((el, index) => {
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
      // const stateLabel = stateLists.find(
      //   (item) => item.value == formValues.state
      // ).label;
      const formDataNew = { ...formValues };

      if (formDataNew?.password !== formDataNew?.confirm_password) {
        errorToast("Password Doesn't Match");
        setErrors({
          ...formErrors,
          confirm_password: "Password doesn't match",
        });
      } else {
        const { confirm_password, ...formData } = formDataNew;
        setLoading(true);
        delete formData._id;
        delete formData.isProfilePicUploaded;
        delete formData.createdAt;
        delete formData.updatedAt;
        delete formData.__v;
        delete formData.url;
        if (formData?.logo) {
          formData["logo_status"] = true;
        }

        if (Array.isArray(formData.sector) && formData.sector.length === 0) {
            formData.sector = JSON.stringify([]); 
        } else if (Array.isArray(formData.sector)) {
            formData.sector = JSON.stringify(formData.sector.map(s => ({
                sectorId: s.jobRoleId, 
                sectorName: s.jobRoleLabel
            })));
        }
        const data = createFormData(formData);
        dispatch(
          updateClientDetails(
            data,
            setLoading,
            params.id,
            clearFormValues,
            navigate
          )
        );
      }
    } else {
      errorToast("Kindly fill mandatory details.");
    }
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  const getStateListsHandler = (event) => {
    const { value } = event.target;
    const formData = {
      country: value,
    };
    dispatch(getStateListsApi(formData, setLoading));
  };

  const getCityListsHandler = (event) => {
    dispatch(getCityLists([]));
    const { value } = event.target;
    const formData = {
      fipsCode: value,
    };
    setCityLoading(true);
    dispatch(getCityListsApi(formData, setCityLoading));
    setFormValues((pre) => ({ ...pre, client_city: "" }));
  };

  const toggleClientLogo = () => {
    setCollectLogo(true);
    deleteImage();
  };

  const loadFile = (event) => {
    if (event.target.files) {
      setImgURL(URL.createObjectURL(event.target.files[0]));
      const logo_data = event.target.files[0];
      setFormValues({ ...formValues, logo: logo_data });
    }
  };

  const deleteImage = () => {
    setImgURL(null);
    let existingFormData = formValues;
    delete existingFormData.logo;
    setFormValues({ ...existingFormData });

    var fileInput = document.getElementById("new-file-input");
    var parent = fileInput.parentElement;
    var next = fileInput.nextSibling;
    parent.removeChild(fileInput);

    var newFileInput = document.createElement("input");
    newFileInput.type = "file";
    newFileInput.id = "new-file-input";
    newFileInput.accept = "image/*";
    newFileInput.name = "new-file-input";
    newFileInput.style.display = "none";
    newFileInput.addEventListener("change", (e) => loadFile(e));

    parent.insertBefore(newFileInput, next);
  };

  const addPOCHandler = () => {
    const existingPOC = formValues?.spoke;
    const newPOC = {
      spoke_designation: "",
      spoke_department: "",
      spoke_name: "",
      spoke_email: "",
      spoke_mobile: "",
    };
    const newPOCArr = [...existingPOC, newPOC];
    setFormValues({ ...formValues, spoke: newPOCArr });
  };
  const removePOCHandler = (index) => {
    const existingPOC = formValues?.spoke;
    existingPOC.splice(index, 1);
    setFormValues({ ...formValues, spoke: existingPOC });
    errorToast(`POC Form ${index + 1} Removed`);
  };

  const handleCancel = () => {
    clearFormValues();
    navigate(-1);
  };

  const handleInputTrimPaste = (event) => {
    event.preventDefault();

    const { name, value, type, checked } = event.target;
    const pastedText = event.clipboardData.getData("text/plain");
    const fieldValue = type === "checkbox" ? checked : pastedText.trim();
    const fieldError = validateField(name, pastedText);

    setFormValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const handlePOCTrimPaste = (event, index) => {
    event.preventDefault();
    const { name, value, type, checked } = event.target;
    const pastedText = event.clipboardData.getData("text/plain");
    const fieldValue = type === "checkbox" ? checked : pastedText.trim();
    const fieldError = validateField(name, pastedText);

    let targetPOC = formValues?.spoke[index];
    const updatedPOC = { ...targetPOC, [name]: fieldValue };
    let existingPOC = formValues?.spoke;
    existingPOC[index] = updatedPOC;
    // setFormValues({ ...formValues, spoke: existingPOC });

    setFormValues((prev) => ({
      ...prev,
      spoke: existingPOC,
    }));

    if (fieldError) {
      setErrors({
        [`${name}${index}`]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  return (
    <div className="main-content">
      {loading ? (
        <div className="loader_container">
          <FadeLoader color="#2ea8db" />
        </div>
      ) : (
        <>
          <div className="title">
            <h1>
              <ArrowLeft
                onClick={() => navigate(SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE)}
              />
              <span>Edit Client Form</span>
            </h1>
          </div>

          <section className="sub-admin-wrapper">
            <div className="tab-content">
              <div className="edit-profile" style={{ display: "block" }}>
                <div className="form-wrapper">
                  {err && (
                    <div className="error-box">
                      <p className="error-text">{err}</p>
                    </div>
                  )}
                  <div className="form_title">
                    <h1>CLIENT INFO</h1>
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
                            label="Client Name"
                            name="clientname"
                            placeholder="Enter Client Name"
                            onFocus={focusHandler}
                            error={errors?.clientname}
                            onBlur={blurHandler}
                            onPaste={handleInputTrimPaste}
                            onChange={changeHandler}
                            value={formValues?.clientname}
                            mandatory
                          />
                        </div>
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <Input
                            label="Client Code"
                            name="clientcode"
                            placeholder="Enter Client Code"
                            onFocus={focusHandler}
                            error={errors?.clientcode}
                            onBlur={blurHandler}
                            onPaste={handleInputTrimPaste}
                            onChange={changeHandler}
                            value={formValues?.clientcode}
                            mandatory
                            disabled
                          />
                        </div>
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="Enter Email here"
                            onFocus={focusHandler}
                            error={errors?.email}
                            onBlur={blurHandler}
                            onPaste={handleInputTrimPaste}
                            onChange={changeHandler}
                            value={formValues?.email}
                            mandatory
                            disabled
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
                            onPaste={handleInputTrimPaste}
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
                          <Input
                            label="Landline Number"
                            type={"number"}
                            name="landLine"
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                            }}
                            placeholder="Enter Landline No."
                            onFocus={focusHandler}
                            onPaste={handleInputTrimPaste}
                            error={errors?.landLine}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.landLine}
                            hideExponants={true}
                            // mandatory
                          />
                        </div>
                        <div style={{ width: "calc(50% - 10px)" }}
                          className="form-group">
                          <AutoCompleteAsyncInput
                            name="sector"
                            label="Sector"
                            value={newdataformValues||[]}
                            onchange={changeHandler}
                            setter={setFormValues}
                            optionLists={ALPHABETIC_SORT(sectorList)}
                            error={errors?.sector}
                            enableMultiSelect={true}
                          />
                      </div>
                        <div
                          className="form-group"
                          style={{ width: "calc(50% - 10px)" }}
                        >
                          <Input
                            label="Website link"
                            type="text"
                            name={"webpage"}
                            placeholder="Enter Website Link"
                            onFocus={focusHandler}
                            error={errors?.webpage}
                            onBlur={blurHandler}
                            onPaste={handleInputTrimPaste}
                            onChange={changeHandler}
                            value={formValues?.webpage}
                          />
                        </div>
                        <div className="form-group" style={{ width: "100%" }}>
                          <Input
                            label="Address"
                            type="text"
                            name={"address"}
                            placeholder="Enter Client Address"
                            onFocus={focusHandler}
                            error={errors?.address}
                            onBlur={blurHandler}
                            onPaste={handleInputTrimPaste}
                            onChange={changeHandler}
                            value={formValues?.address}
                            mandatory
                          />
                        </div>
                        {/* <div
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
                    </div> */}
                        {/* <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <SelectInput
                        name="client_city"
                        label="City"
                        placeHolder="Enter City Name"
                        value={formValues?.client_city}
                        loading={cityLoading}
                        handleChange={changeHandler}
                        options={cityLists}
                        error={errors?.client_city}
                      />
                    </div> */}
                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <Input
                            label="Pincode"
                            type={"number"}
                            name="pincode"
                            placeholder="Enter your Pincode"
                            mandatory
                            onFocus={focusHandler}
                            error={errors?.pincode}
                            onPaste={handleInputTrimPaste}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.pincode}
                            hideExponants={true}
                          />
                        </div>

                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <SelectInput
                            name="organisationType"
                            label="Organisation Type"
                            placeHolder="Select Organisation Type"
                            value={formValues?.organisationType}
                            handleChange={changeHandler}
                            options={SUB_ADMIN_ORGANISATION_TYPE_MENUS}
                            error={errors?.organisationType}
                            mandatory
                          />
                        </div>

                        <div
                          style={{ width: "calc(50% - 10px)" }}
                          className="form-group"
                        >
                          <div className="img_upload_switch">
                            <div className="img_upload_title">
                              <h1>
                                Update Logo{" "}
                                <span
                                  style={{
                                    color: "red",
                                    display: [collectLogo ? "" : "none"],
                                  }}
                                >
                                  *
                                </span>
                              </h1>
                              {
                                <FormSwitch
                                  onChange={toggleClientLogo}
                                  value={collectLogo}
                                  disabled={collectLogo}
                                />
                              }
                            </div>
                            <p
                              className="logo_update_warning"
                              style={{
                                display: [collectLogo ? "none" : ""],
                              }}
                            >
                              Switching on this button will delete existing logo
                            </p>
                          </div>

                          <div
                            className="new-file-box"
                            style={{
                              display: [collectLogo ? "block" : "none"],
                            }}
                          >
                            <div className="new-file-input-container">
                              <input
                                type="text"
                                className="new-file-input-text"
                                value={
                                  formValues?.logo?.name ?? "No File Selected"
                                }
                                readOnly
                              />
                              <label
                                htmlFor="new-file-input"
                                style={{
                                  display: [collectLogo ? "flex" : "none"],
                                }}
                                className="new-file-input-button"
                              >
                                <UploadIcon width={30} height={30} />{" "}
                                <span>upload</span>
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                name="image"
                                style={{ display: "none" }}
                                onChange={(e) => loadFile(e)}
                                id="new-file-input"
                                className="new-file-input"
                              />
                            </div>
                            <p>
                              File size upto 1 mb (Allowed formats jpg, png,
                              jpeg)
                            </p>
                          </div>

                          <div
                            className="new-files-area"
                            style={{
                              display: [ImgURL ? "" : "none"],
                            }}
                          >
                            <div className="cross-mark">
                              <CloseOutlinedIcon
                                sx={{ color: "#CBCBCB" }}
                                onClick={() => deleteImage()}
                              />
                            </div>
                            <div className="file-icon">
                              {ImgURL ? (
                                <img width={35} src={ImgURL} />
                              ) : (
                                <InsertDriveFileIcon
                                  sx={{ color: "#13B8FF" }}
                                />
                              )}
                            </div>
                            <div className="file-info">
                              <h5>
                                {formValues?.logo?.name ?? "No File Selected"}
                              </h5>
                              <p>
                                {formValues?.logo?.size
                                  ? (formValues.logo.size / 1024).toFixed(1) +
                                    " KB"
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Password"
                        type={"password"}
                        name="password"
                        placeholder="Enter your Password"
                        onFocus={focusHandler}
                        error={errors?.password}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.password}
                        endAdornment
                        mandatory
                      />
                    </div> */}
                        {/* <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Confirm Password"
                        type={"password"}
                        name="confirm_password"
                        placeholder="Enter your Password"
                        onFocus={focusHandler}
                        error={errors?.confirm_password}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.confirm_password}
                        endAdornment
                        mandatory
                      />
                    </div> */}
                      </div>
                    </form>
                  </div>
                </div>
                {/* <div className="img_upload_switch">
                  <div className="img_upload_title">
                    <h1>
                      Update Logo{" "}
                      <span
                        style={{
                          color: "red",
                          display: [collectLogo ? "" : "none"],
                        }}
                      >
                        *
                      </span>
                    </h1>
                    {
                      <FormSwitch
                        onChange={toggleClientLogo}
                        value={collectLogo}
                        disabled={collectLogo}
                      />
                    }
                    <p
                      className="logo_update_warning"
                      style={{
                        display: [collectLogo ? "none" : ""],
                      }}
                    >
                      Switching on this button will delete existing logo
                    </p>
                  </div>
                </div>
                <div className="img-upload-wrapper">
                  <div
                    className="new_img_upload"
                    style={{
                      backgroundImage: `url(${ImgURL})`,
                      backgroundSize: "100%",
                      backgroundRepeat: "no-repeat",
                      filter: "brightness(80%)",
                    }}
                  ></div>
                  <div className="img_upload_container">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        id="file"
                        style={{ display: "none" }}
                        onChange={(e) => loadFile(e)}
                      />
                    </div>
                    <div
                      className="upload_icon_controlBox"
                      style={{
                        display: [collectLogo ? "block" : "none"],
                      }}
                    >
                      <div className="upload_icon_container">
                        <label htmlFor="file" style={{ cursor: "pointer" }}>
                          {<UploadIcon />}
                        </label>
                        <label>
                          <DeleteIcon onClick={() => deleteImage()} />
                        </label>
                      </div>
                      <div className="img-upload-text">
                        <h1>
                          <label>Upload Image</label>
                        </h1>
                        <p>
                          File size up to 1 mb (supported formats jpg, png,
                          jpeg)
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </section>

          {formValues.spoke.length > 0 ? (
            <>
              {formValues?.spoke?.map((el, index) => {
                return (
                  <div key={index}>
                    <section className="sub-admin-wrapper">
                      <div className="tab-content" style={{ marginTop: 30 }}>
                        <div className="edit-profile">
                          <div className="form-wrapper">
                            <div className="form_title">
                              <h1>
                                POC FORM <span>{index + 1}</span>
                              </h1>
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
                                    className="form-group"
                                    style={{ width: "100%" }}
                                  >
                                    <Input
                                      label="Name"
                                      type="text"
                                      name={"spoke_name"}
                                      placeholder="Enter Name"
                                      onFocus={focusHandler}
                                      error={errors?.[`spoke_name${index}`]}
                                      onBlur={blurHandler}
                                      onPaste={(e) =>
                                        handlePOCTrimPaste(e, index)
                                      }
                                      onChange={(e) =>
                                        changeHandlerPOC(e, index)
                                      }
                                      value={
                                        formValues?.spoke[index].spoke_name
                                      }
                                      mandatory
                                    />
                                  </div>
                                  <div
                                    className="form-group"
                                    style={{ width: "100%" }}
                                  >
                                    <SelectInput
                                      name="spoke_department"
                                      label="Department"
                                      placeHolder="Select Department"
                                      value={
                                        formValues?.spoke[index]
                                          .spoke_department
                                      }
                                      handleChange={(e) =>
                                        changeHandlerPOC(e, index)
                                      }
                                      options={DEPARTMENT_LIST}
                                      error={
                                        errors?.[`spoke_department${index}`]
                                      }
                                      mandatory
                                    />
                                  </div>
                                  <div
                                    className="form-group"
                                    style={{ width: "100%" }}
                                  >
                                    <SelectInput
                                      name="spoke_designation"
                                      label="Designation"
                                      placeHolder="Select Designation"
                                      value={
                                        formValues?.spoke[index]
                                          .spoke_designation
                                      }
                                      handleChange={(e) =>
                                        changeHandlerPOC(e, index)
                                      }
                                      options={ROLE_TYPE}
                                      error={
                                        errors?.[`spoke_designation${index}`]
                                      }
                                    />
                                  </div>
                                  <div
                                    style={{ width: "calc(50% - 10px)" }}
                                    className="form-group"
                                  >
                                    <Input
                                      label="Email Address"
                                      type="email"
                                      name="spoke_email"
                                      placeholder="Enter Email here"
                                      onFocus={focusHandler}
                                      error={errors?.[`spoke_email${index}`]}
                                      onBlur={blurHandler}
                                      onPaste={(e) =>
                                        handlePOCTrimPaste(e, index)
                                      }
                                      onChange={(e) =>
                                        changeHandlerPOC(e, index)
                                      }
                                      value={
                                        formValues?.spoke[index].spoke_email
                                      }
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
                                      name="spoke_mobile"
                                      inputProps={{
                                        inputMode: "numeric",
                                        pattern: "[0-9]*",
                                      }}
                                      placeholder="Enter Contact No."
                                      onFocus={focusHandler}
                                      error={errors?.[`spoke_mobile${index}`]}
                                      onBlur={blurHandler}
                                      onPaste={(e) =>
                                        handlePOCTrimPaste(e, index)
                                      }
                                      onChange={(e) =>
                                        changeHandlerPOC(e, index)
                                      }
                                      value={
                                        formValues?.spoke[index].spoke_mobile
                                      }
                                      hideExponants={true}
                                    />
                                  </div>
                                  <div className="addNewPOC_container">
                                    <Button
                                      className={`light-blue-btn submit-btn`}
                                      variant="contained"
                                      onClick={addPOCHandler}
                                      sx={{
                                        width: "112px",
                                        height: "42px",
                                        textTransform: "unset",
                                      }}
                                    >
                                      Add New
                                    </Button>
                                    <Button
                                      className={`light-red-btn submit-btn`}
                                      variant="contained"
                                      onClick={(e) => removePOCHandler(index)}
                                      sx={{
                                        width: "112px",
                                        height: "42px",
                                        textTransform: "unset",
                                        display: [
                                          formValues?.spoke.length > 1
                                            ? "inline-flex"
                                            : "none",
                                        ],
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                );
              })}
            </>
          ) : (
            <section className="sub-admin-wrapper">
              <div className="tab-content" style={{ marginTop: 30 }}>
                <div className="edit-profile">
                  <h1 className="no_poc">No POC Found</h1>
                </div>
              </div>
            </section>
          )}

          <div className="action-btn-card">
            <Button
              className={`outlined-btn submit-btn`}
              variant="outlined"
              onClick={handleCancel}
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
              {loading ? (
                <RingLoader size="25px" color="white" />
              ) : (
                [clientId ? "Update" : "Save"]
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientManagementProfile;

function createFormData(data) {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (let i = 0; i < data[key].length; i++) {
        const subObj = data[key][i];
        for (const subKey in subObj) {
          if (`${key}[${i}][${subKey}]` !== `spoke[${i}][_id]`)
            formData.append(`${key}[${i}][${subKey}]`, subObj[subKey]);
        }
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
}
