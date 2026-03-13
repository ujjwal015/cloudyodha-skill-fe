import React, { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Banner from "../Banner";
import { ReactComponent as MailVector } from "../../../assets/icons/mail-vector.svg";
import { ReactComponent as TestaLogo } from "../../../assets/icons/TestaLogo.svg";
// import { ReactComponent as VisibilityIcon } from "../../../assets/icons/visibility.svg";
import { IconButton } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import {
  FORGOT_PASSWORD,
  SIGNUP,
  GET_DEMO,
} from "../../../config/constants/routePathConstants/auth";
import { signInApi } from "../../../api/authApi";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../utils/validateField";
import Input from "./../../../components/common/input";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "../../../utils/projectHelper";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    sToken: "",
  });
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveCred, setSaveCred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRefDekstop = useRef(null);
  const recaptchaRefMobile = useRef(null);
  const SITE_KEY = process.env.REACT_APP_BASE_URL_SITE_KEY;

  function onRecaptchaChange(value) {
    setFormValues((prev) => ({
      ...prev,
      sToken: value,
    }));
  }

  useEffect(() => {
    const savedCreds = getCookie("savedCreds");
    if (savedCreds) {
      const { email, password } = JSON.parse(savedCreds);
      setFormValues((prev) => ({ ...prev, email, password }));
      setSaveCred(true);
    }
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
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const handleCaptchaReset = () => {
    if (recaptchaRefDekstop?.current) recaptchaRefDekstop.current.reset();
    if (recaptchaRefMobile?.current) recaptchaRefMobile.current.reset();
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

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      if (saveCred) {
        setCookie("savedCreds", JSON.stringify(formValues), 1);
      } else {
        deleteCookie("savedCreds");
      }
      handleCaptchaReset();
      dispatch(
        signInApi(formValues, setErr, navigate, setLoading, setFormValues)
      );
    }
  };

  const handleRememberMe = (e) => {
    const { checked } = e.target;
    setSaveCred(checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderDesktopView = () => (
    <div className="login-container">
      <Banner />
      <div className="login-form-container">
        <div>
          <div className="get-started-wrapper desktop-get-started">
            <p className="text">Don't have an account yet? </p>
            <Button
              className="outlined-btn"
              variant="outlined"
              size="small"
              sx={{ color: "#2EA8DB" }}
              onClick={() => navigate(GET_DEMO)}
            >
              Request a Demo
            </Button>
          </div>
          <div className="form-wrapper">
            <div className="text-wrapper">
              <p className="welcome-text">Welcome back 👋</p>
              <h4 className="login-text">Login to your account </h4>
            </div>

            {err && (
              <div className="error-box">
                <p className="error-text">{err}</p>
              </div>
            )}

            <div className="form">
              <form onSubmit={handleSubmit}>
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
                    endAdornment={<MailVector style={{ width: "20px" }} />}
                  />
                </div>
                <div className="form-group">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your Password"
                    onFocus={focusHandler}
                    error={errors?.password}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.password}
                    endAdornment={
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    }
                    // endAdornment={
                    //   <VisibilityIcon
                    //     style={{ width: "20px", cursor: "pointer" }}
                    //     onClick={togglePasswordVisibility}
                    //   />
                    // }
                  />
                </div>
                <div className="remember-forget">
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      checked={saveCred}
                      label="Remember me"
                      onChange={handleRememberMe}
                    />
                  </FormGroup>
                  <Link className="forget-password" to={FORGOT_PASSWORD}>
                    Forgot password?
                  </Link>
                </div>

                <div
                  className="recaptcha-container"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "100%",
                    margin: "10px 0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      transform: "scale(0.85)",
                      transformOrigin: "left",
                      width: "fit-content",
                    }}
                  >
                    <ReCAPTCHA
                      ref={recaptchaRefDekstop}
                      sitekey={SITE_KEY}
                      onChange={onRecaptchaChange}
                    />
                  </div>
                </div>

                <Button
                  className="light-blue-btn"
                  variant="contained"
                  sx={{
                    width: "100%",
                    cursor: formValues?.sToken ? "pointer" : "no-drop",
                  }}
                  disabled={loading || !formValues?.sToken ? true : false}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <PulseLoader size="10px" color="white" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="mobile-login-container">
      <div className="mobile-header">
        <TestaLogo />
        <div className="header-text">
          <h2>Unleash Your Potential with Modernized Skill Assessments</h2>
          <p>
            Testa offers an AI-Driven Online Assessment Platform for corporates,
            higher educational institutes, and government organizations.
          </p>
        </div>
      </div>

      <div className="mobile-get-started">
        <p className="text">Don't have an account yet?</p>
        <Button
          className="outlined-btn"
          variant="outlined"
          size="small"
          onClick={() => navigate(GET_DEMO)}
        >
          Request a Demo
        </Button>
      </div>

      <div className="mobile-login-form">
        <div className="form-header">
          <p className="welcome-text">Welcome to Testa 👋</p>
          <h4 className="login-text">Login to your account</h4>
        </div>

        {err && (
          <div className="error-box">
            <p className="error-text">{err}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              label="Email Address"
              type="email"
              name="email"
              required
              placeholder="Enter your mail ID"
              onFocus={focusHandler}
              error={errors?.email}
              onBlur={blurHandler}
              onChange={changeHandler}
              value={formValues?.email}
              endAdornment={<MailVector style={{ width: "20px" }} />}
            />
          </div>
          <div className="form-group">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Enter your Password"
              onFocus={focusHandler}
              error={errors?.password}
              onBlur={blurHandler}
              onChange={changeHandler}
              value={formValues?.password}
              // endAdornment={
              //   <VisibilityIcon
              //     style={{ width: "20px", cursor: "pointer" }}
              //     onClick={togglePasswordVisibility}
              //   />
              // }

              endAdornment={
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
          </div>

          <div className="remember-forget">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                checked={saveCred}
                label="Remember me"
                onChange={handleRememberMe}
              />
            </FormGroup>
            <Link className="forget-password" to={FORGOT_PASSWORD}>
              Forgot password?
            </Link>
          </div>
          <div
            className="recaptcha-container"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              maxWidth: "100%",
              margin: "10px 0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                transform: "scale(0.85)",
                transformOrigin: "left",
                width: "fit-content",
              }}
            >
              <ReCAPTCHA
                ref={recaptchaRefMobile}
                sitekey={SITE_KEY}
                onChange={onRecaptchaChange}
              />
            </div>
          </div>

          <Button
            className="login-btn"
            variant="contained"
            fullWidth
            disabled={loading}
            type="submit"
          >
            {loading ? <PulseLoader size="10px" color="white" /> : "Log in"}
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

export default Login;
