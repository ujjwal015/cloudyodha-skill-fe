import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ReactComponent as MobileIcon } from "../../../../assets/icons/mobile-icon.svg";
import { ReactComponent as TestaLogo } from "../../../../assets/icons/TestaLogo.svg";
import { createDemoAPI } from "../../../../api/authApi";
import Banner from "../../Banner";
import SelectInput from "../../../../components/common/SelectInput";
import { SIGNIN } from "../../../../config/constants/routePathConstants/auth";
import { GET_DEMO_USER_TYPE_MENUS } from "../../../../config/constants/projectConstant";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../utils/validateField";
import Input from "../../../../components/common/input";
import TermsAndCondition from "../../termsAndCondition";
import ReCAPTCHA from "react-google-recaptcha";
const initialFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  userRole: "",
  mobile: "",
  organisationName: "",
  acceptTermCondition: false,
  sToken: "",
};

const GetDemo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [openBox, setOpenBox] = useState(false);
  const SITE_KEY = process.env.REACT_APP_BASE_URL_SITE_KEY;

  useEffect(() => {
    if (errors?.lastName === "Last name is required") {
      setErrors({});
    }
  }, [errors]);

  function onChange(value) {
    setFormValues((pre) => ({
      ...pre,
      sToken: value,
    }));
  }

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
        createDemoAPI(formValues, setErr, navigate, setLoading, clearFormValues)
      );
    }
  };
  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  const renderDesktopView = () => (
    <div className="login-container" style={{ height: '100vh' }}>
      <Banner />
      <div className="login-form-container" style={{ 
        height: 'calc(100vh - 60px)', // Assuming Banner height is 60px
        padding: "10px"
      }}>
        <div style={{ height: '100%' }}>
          <div className="get-started-wrapper desktop-get-started">
            <p className="text">Already got an account?</p>
            <Button
              className="outlined-btn"
              variant="outlined"
              sx={{ color: "#2EA8DB" }}
              onClick={() => navigate(SIGNIN)}
            >
              Log in
            </Button>
          </div>

          <div className="form-wrapper">
            <div className="text-wrapper">
              <h4 className="login-text">Request a Demo</h4>
              <p className="cred-text">
                Just drop in your details here and we'll get back to you!
              </p>
            </div>
            {err && (
              <div className="error-box">
                <p className="error-text">{err}</p>
              </div>
            )}
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
                    label="First name"
                    name="firstName"
                    placeholder="Enter First Name"
                    onFocus={focusHandler}
                    error={errors?.firstName}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.firstName}
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
                    error={errors?.organisationName}
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
                    mandatory
                  />
                </div>
              </div>
              <div>
                <FormGroup
                  style={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    marginBottom: "15px",  // Reduced margin
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
                  <p style={{ fontSize: '12px', opacity: 0.7 }}>
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
              <div className="recaptcha-container">
                <div style={{ display: 'flex', justifyContent:"flex-start", width: '100%' }}>
                  <ReCAPTCHA sitekey={SITE_KEY} onChange={onChange} />
                </div>
              </div>
              <Button
                className={`light-blue-btn submit-btn ${
                  !formValues?.acceptTermCondition || !formValues?.sToken
                    ? "disabled"
                    : ""
                }`}
                variant="contained"
                onClick={
                  formValues?.acceptTermCondition && formValues?.sToken
                    ? handleSubmit
                    : undefined
                }
                sx={{ width: "100%" }}
                disabled={loading ? true : false}
              >
                {loading ? (
                  <PulseLoader size="10px" color="white" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </div>

          <div className="get-started-wrapper mob-get-started">
            <p className="text">Already got an account?</p>
            <Button
              className="outlined-btn"
              variant="outlined"
              sx={{ color: "#2EA8DB" }}
              onClick={() => navigate(SIGNIN)}
            >
              Log in
            </Button>
          </div>
        </div>
      </div>

      
    </div>
  );

  const renderMobileView = () => (
    <div className="mobile-demo-container">
      <div className="mobile-header">
        <TestaLogo />
        <div className="header-text">
          <h2>Unleash Your Potential with Modernized Skill Assessments</h2>
          <p>Testa offers an AI-Driven Online Assessment Platform for corporates, higher educational institutes, and government organizations.</p>
        </div>
      </div>

      <div className="mobile-demo-form">
        <div className="form-header">
          <h4 className="login-text">Request a Demo</h4>
          <p className="welcome-text">
            Just drop in your details here and we'll get back to you!
          </p>
        </div>

        {err && (
          <div className="error-box">
            <p className="error-text">{err}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              label="First name"
              name="firstName"
              placeholder="Enter First Name"
              onFocus={focusHandler}
              error={errors?.firstName}
              onBlur={blurHandler}
              onChange={changeHandler}
              value={formValues?.firstName}
              mandatory
            />
          </div>

          <div className="form-group">
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Enter Last Name"
              onFocus={focusHandler}
              error={errors?.lastName}
              onBlur={blurHandler}
              onChange={changeHandler}
              value={formValues?.lastName}
            />
          </div>

          <div className="form-group">
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
              error={errors?.organisationName}
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
              mandatory
            />
          </div>

          <div className="terms-container">
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
            />
            <p style={{ fontSize: '12px', opacity: 0.7 }}>
              Disclaimer: By using our offerings and services, you are agreeing to the
              <span onClick={() => setOpenBox(true)}> Terms of Services</span>
              and understand that your use and access will be subject to the terms and conditions and
              <span onClick={() => setOpenBox(true)}> Privacy Notice</span>
            </p>
          </div>

          <div className="recaptcha-container">
            {/* <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}> */}
              <div style={{ transform: "scale(0.9)", transformOrigin: "center" }}>
              <ReCAPTCHA sitekey={SITE_KEY} onChange={onChange} />
            </div>
          </div>

          <Button
            className={`reset-btn ${
              !formValues?.acceptTermCondition || !formValues?.sToken
                ? "disabled"
                : ""
            }`}
            variant="contained"
            disabled={!formValues?.acceptTermCondition || !formValues?.sToken || loading}
            type="submit"
          >
            {loading ? <PulseLoader size="10px" color="white" /> : "Submit"}
          </Button>

          <div className="return-login">
            <p>Already got an account?</p>
            <Button
              className="outlined-btn"
              variant="outlined"
              onClick={() => navigate(SIGNIN)}
            >
              Log in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {renderDesktopView()}
      {renderMobileView()}
      <TermsAndCondition
        setFormValues={setFormValues}
        openBox={openBox}
        setOpenBox={setOpenBox}
      />
    </>
  );
};

export default GetDemo;
