import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../getDemo/style.css";
import "./style.css";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ReactComponent as MobileIcon } from "../../../../assets/icons/mobile-icon.svg";
import {
  getSingleDemoUserApi,
  updateDemoUserApi,
  sendOtpApi,
} from "../../../../api/authApi";
import Banner from "../../Banner";
import SelectInput from "../../../../components/common/SelectInput";
import { getLocal } from "../../../../utils/projectHelper";
import { GET_DEMO_USER_TYPE_MENUS } from "../../../../config/constants/projectConstant";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../utils/validateField";
import Input from "../../../../components/common/input";
import TermsAndCondition from "../../termsAndCondition";
import { authSelector } from "../../../../redux/slicers/authSlice";

const initialFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  userRole: "",
  mobile: "",
  organisationName: "",
  acceptTermCondition: false,
};

const EditDemoUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [openBox, setOpenBox] = useState(false);
  const [edit, setEdit] = useState(false);
  const { demoUser = {} } = useSelector(authSelector);
  const [demoUserId, setDemoUserId] = useState();
  const [userData, setUserData] = useState();

  const data = getLocal("demoUserData");

  useEffect(() => {
    setUserData(demoUser);
  }, []);

  useEffect(() => {
    setDemoUserId(data?._id);
    setEdit(true);
    dispatch(getSingleDemoUserApi(setLoading, setFormValues, data?._id));
  }, []);

  useEffect(() => {
    if (errors?.lastName === "Last name is required") {
      setErrors({});
    }
  }, [errors]);
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
    });
    if (!formValues?.lastName) delete formErrors["lastName"];
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Submit the form data
      setLoading(true);
      dispatch(
        updateDemoUserApi(setLoading, formValues, navigate, demoUserId, setErr)
      );
    }
  };
  const ReSendOtp = () => {
    const mobile = { mobile: formValues?.mobile };
    dispatch(sendOtpApi(setErr, setLoading, mobile));
  };

  const renderDesktopView = () => (
    <div className="login-container">
      <Banner />
      <div className="login-form-container">
        <div
          className="form-wrapper"
          style={{ marginTop: "10%", overflowY: "hidden" }}
        >
          <div className="text-wrapper">
            <p className="welcome-text">Get Started 👋</p>
            <h4 className="login-text">Edit Profile</h4>
            <p className="cred-text">
              Just drop in your details here and we'll get back to you!
            </p>
          </div>
          {err && (
            <div className="error-box">
              <p className="error-text">{err}</p>
            </div>
          )}
          <div className="form">
            <form>
              <div className="form-container">
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="First name"
                    name="firstName"
                    placeholder="Enter First Name"
                    onFocus={focusHandler}
                    error={errors?.firstName}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.firstName}
                    disabled={edit ? true : false}
                    mandatory
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter Last Name"
                    onFocus={focusHandler}
                    error={errors?.lastName}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.lastName}
                    disabled={edit ? true : false}
                    // mandatory
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
                    placeholder="Enter your mail ID"
                    onFocus={focusHandler}
                    error={errors?.email}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.email}
                    disabled={edit ? true : false}
                    mandatory
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Mobile No."
                    type={"number"}
                    name="mobile"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    placeholder="Enter Mobile No."
                    onFocus={focusHandler}
                    error={errors?.mobile}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.mobile}
                    endAdornment={<MobileIcon />}
                    hideExponants
                    mandatory
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Organization"
                    name="organisationName"
                    placeholder="Enter your organization"
                    onFocus={focusHandler}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.organisationName}
                    disabled={edit ? true : false}
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <SelectInput
                    name="userRole"
                    label="Role"
                    placeHolder="Your role"
                    value={formValues?.userRole}
                    handleChange={changeHandler}
                    options={GET_DEMO_USER_TYPE_MENUS}
                    error={errors?.userRole}
                    disabled={edit ? true : false}
                    mandatory
                  />
                </div>
              </div>

              <div className="lisence-argrement">
                <FormGroup
                  style={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    marginBottom: "35px",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="acceptTermCondition"
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        checked={formValues.acceptTermCondition}
                      />
                    }
                    style={{ marginRight: "0", marginBottom: "0" }}
                  />
                  <p style={{ fontSize: '12px', color: '#666666' }}>
                    Disclaimer: By using our offerings and services, you are
                    agreeing to the
                    <span onClick={() => setOpenBox(true)}>
                      &nbsp;Terms of Services
                    </span>
                    &nbsp; and understand that your use and access will be
                    subject to the terms and conditions and
                    <span onClick={() => setOpenBox(true)}>
                      &nbsp;Privacy Notice
                    </span>
                  </p>
                </FormGroup>
              </div>
              <Button
                className={`light-blue-btn submit-btn ${
                  !formValues?.acceptTermCondition ? "disabled" : ""
                }`}
                variant="contained"
                onClick={
                  formValues?.acceptTermCondition ? handleSubmit : undefined
                }
                sx={{ width: "100%" }}
                disabled={loading ? true : false}
              >
                {loading ? (
                  <PulseLoader size="10px" color="white" />
                ) : (
                  edit && "Update"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* //terms and condition */}
      <TermsAndCondition
        setFormValues={setFormValues}
        openBox={openBox}
        setOpenBox={setOpenBox}
      />
    </div>
  );

  const renderMobileView = () => (
    <div className="mobile-edit-container">
      <div className="mobile-header">
        {/* <Logo /> */}
        <div className="header-text">
          <h2>Get Started 👋</h2>
          <p>Edit Profile</p>
        </div>
      </div>
      <div className="mobile-edit-form">
        <div className="form-header">
          <p className="welcome-text"> Just drop in your details here and we'll get back to you !</p>
        </div>
        {err && (
          <div className="error-box">
            <p className="error-text">{err}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <div className="form-group">
              <Input
                label="First Name"
                name="firstName"
                placeholder="Enter your first name"
                onFocus={focusHandler}
                error={errors?.firstName}
                onBlur={blurHandler}
                onChange={changeHandler}
                value={formValues?.firstName}
                disabled={edit ? true : false}
                mandatory
              />
            </div>
            <div className="form-group">
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Enter your last name"
                onFocus={focusHandler}
                error={errors?.lastName}
                onBlur={blurHandler}
                onChange={changeHandler}
                value={formValues?.lastName}
                disabled={edit ? true : false}
              />
            </div>
            <div className="form-group">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
                onFocus={focusHandler}
                error={errors?.email}
                onBlur={blurHandler}
                onChange={changeHandler}
                value={formValues?.email}
                disabled={edit ? true : false}
                mandatory
              />
            </div>
            <div className="form-group">
              <Input
                label="Mobile No."
                type={"number"}
                name="mobile"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                placeholder="Enter Mobile No."
                onFocus={focusHandler}
                error={errors?.mobile}
                onBlur={blurHandler}
                onChange={changeHandler}
                value={formValues?.mobile}
                endAdornment={<MobileIcon />}
                hideExponants
                mandatory
              />
            </div>
            <div className="form-group">
              <Input
                label="Organization"
                name="organisationName"
                placeholder="Enter your organization"
                onFocus={focusHandler}
                onBlur={blurHandler}
                onChange={changeHandler}
                value={formValues?.organisationName}
                disabled={edit ? true : false}
              />
            </div>
            <div className="form-group">
              <SelectInput
                name="userRole"
                label="Role"
                placeHolder="Your role"
                value={formValues?.userRole}
                handleChange={changeHandler}
                options={GET_DEMO_USER_TYPE_MENUS}
                error={errors?.userRole}
                disabled={edit ? true : false}
                mandatory
              />
            </div>
          </div>

          <div className="lisence-argrement">
            <FormGroup
              style={{
                flexDirection: "row",
                flexWrap: "nowrap",
                alignItems: "center",
                marginBottom: "35px",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="acceptTermCondition"
                    onFocus={focusHandler}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    checked={formValues.acceptTermCondition}
                  />
                }
                style={{ marginRight: "0", marginBottom: "0" }}
              />
              <p style={{ fontSize: '12px', color: '#666666' }}>
                Disclaimer: By using our offerings and services, you are
                agreeing to the
                <span onClick={() => setOpenBox(true)}>
                  &nbsp;Terms of Services
                </span>
                &nbsp; and understand that your use and access will be
                subject to the terms and conditions and
                <span onClick={() => setOpenBox(true)}>
                  &nbsp;Privacy Notice
                </span>
              </p>
            </FormGroup>
          </div>
          <Button
            className={`submit-btn ${
              !formValues?.acceptTermCondition ? "disabled" : ""
            }`}
            variant="contained"
            onClick={
              formValues?.acceptTermCondition ? handleSubmit : undefined
            }
            disabled={loading ? true : false}
          >
            {loading ? (
              <PulseLoader size="10px" color="white" />
            ) : (
              edit && "Update Information"
            )}
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {renderDesktopView()}
      {renderMobileView()}
    </>
  );
};

export default EditDemoUser;