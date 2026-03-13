import React, { useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Banner from "../Banner";
import { ReactComponent as MailVector } from "../../../assets/icons/mail-vector.svg";
import { ReactComponent as TestaLogo } from "../../../assets/icons/TestaLogo.svg";
import { SIGNIN } from "../../../config/constants/routePathConstants/auth";
import { forgetPasswordApi } from "../../../api/authApi";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../utils/validateField";
import Input from "./../../../components/common/input";
import ReCAPTCHA from "react-google-recaptcha";
import "./style.css";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ email: "", sToken: "" });
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const recaptchaRefDekstop=useRef(null);
  const recaptchaRefMobile=useRef(null);
  const [open, setOpen] = useState(false);
  const [resetText,setResetText]=useState("We have sent a reset password link to your account.")
  const SITE_KEY = process.env.REACT_APP_BASE_URL_SITE_KEY;

  function onChange(value) {
    setFormValues((pre) => ({
      ...pre,
      sToken: value,
    }));
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

   const handleCaptchaReset=()=>{
    if(recaptchaRefDekstop?.current)recaptchaRefDekstop.current.reset();
    if(recaptchaRefMobile?.current)recaptchaRefMobile.current.reset();
  }

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
    handleCaptchaReset();
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      dispatch(
        forgetPasswordApi(
          formValues,
          setErr,
          navigate,
          setLoading,
          handleClickOpen,
          setResetText,
          setFormValues,
        )
      );
    }
  };

  const renderDesktopView = () => (
    <div className="login-container">
      <Banner />
      <div className="login-form-container">
        <div className="form-wrapper center-wrapper">
          <div className="text-wrapper">
            <h4 className="login-text">Forgot your password? </h4>
            <p className="cred-text">
              Start the process to reset your password
            </p>
          </div>
          {err && (
            <div className="error-box">
              <p className="error-text">{err}</p>
            </div>
          )}
          <div className="form">
            <form>
              <div className="form-group">
                <Input
                  label="Registered email address"
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
              <div
                className="recaptcha-container"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "100%",
                  margin: "10px 0",
                  overflow: "hidden"
                }}
              >
                <div style={{ 
                  transform: "scale(0.85)", 
                  transformOrigin: "left",
                  width: "fit-content"
                }}>
                  <ReCAPTCHA ref={recaptchaRefDekstop} sitekey={SITE_KEY} onChange={onChange} />
                </div>
              </div>
              <div className="reset-btn-wrapper">
                <Button
                  className="light-blue-btn"
                  variant="contained"
                  color="error"
                  sx={{
                    width: "170px",
                    height: "40px",
                    cursor: formValues?.sToken ? "pointer" : "no-drop",
                  }}
                  disabled={!formValues?.sToken}
                  onClick={formValues?.sToken ? handleSubmit : undefined}
                >
                  {loading ? (
                    <PulseLoader size="10px" color="white" />
                  ) : (
                    "Reset"
                  )}
                </Button>
                <Link to={SIGNIN}>Return to login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="mobile-forgot-container">
      <div className="mobile-header">
        <TestaLogo />
        <div className="header-text">
          <h2>Unleash Your Potential with Modernized Skill Assessments</h2>
          <p>Testa offers an AI-Driven Online Assessment Platform for corporates, higher educational institutes, and government organizations.</p>
        </div>
      </div>

      <div className="mobile-forgot-form">
        <div className="form-header">
          <h4 className="login-text">Forgot your password?</h4>
          <p className="welcome-text">
            Start the process to reset your password
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
              label="Registered email address"
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
          <div
            className="recaptcha-container"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              maxWidth: "100%",
              margin: "10px 0",
              overflow: "hidden"
            }}
          >
            <div style={{ 
              transform: "scale(0.85)", 
              transformOrigin: "left",
              width: "fit-content"
            }}>
              <ReCAPTCHA ref={recaptchaRefMobile} sitekey={SITE_KEY} onChange={onChange} />
            </div>
          </div>
          <Button
            className="reset-btn"
            variant="contained"
            disabled={!formValues?.sToken}
            type="submit"
          >
            {loading ? <PulseLoader size="10px" color="white" /> : "Reset"}
          </Button>
          <Link to={SIGNIN} className="return-login">
            Return to login
          </Link>
        </form>
      </div>
    </div>
  );

  const renderSuccessDialog = () => (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog-wrapper"
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          minHeight: 'auto',
          margin: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
    >
      <Box className="success-Modal" sx={{ width: '100%' }}>
        <Box 
          className="success-loader-logo" 
          sx={{ 
            transform: 'scale(0.7)',
            margin: '-10px 0'
          }}
        >
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </Box>

        <DialogTitle 
          id="alert-dialog-title" 
          sx={{ 
            padding: '8px 0',
            '& h1': {
              fontSize: '1.2rem',
              margin: 0,
              fontWeight: 500
            }
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <h1>Reset Password</h1>
          </Box>
        </DialogTitle>

        <DialogContent 
          sx={{ 
            padding: '0',
            overflow: 'visible'
          }}
        >
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              fontSize: '0.875rem',
              textAlign: 'center',
              margin: '8px 0'
            }}
          >
            {resetText}
          </DialogContentText>
        </DialogContent>

        <DialogActions 
          sx={{ 
            padding: '8px 0 0',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <Button 
            variant="contained" 
            onClick={handleClose} 
            autoFocus
            sx={{
              minWidth: '100px',
              height: '36px',
              fontSize: '0.875rem',
              backgroundColor: '#1976d2',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );

  return (
    <>
      {renderDesktopView()}
      {renderMobileView()}
      {renderSuccessDialog()}
    </>
  );
};

export default ForgotPassword;
