import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactComponent as MailVector } from "../../../../assets/icons/mail-vector.svg";
import { ReactComponent as GetOtpImg } from "../../../../assets/images/common/getOtp.svg";
import { GET_RESPONSE, EDIT_DEMO_USER } from "../../../../config/constants/routePathConstants/auth";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../utils/validateField";
import Input from "./../../../../components/common/input";
import { sendOtpApi, verifyOtpApi } from "../../../../api/authApi";
import { getLocal } from "../../../../utils/projectHelper";
import { authSelector } from "../../../../redux/slicers/authSlice";
import TestaLogo from '../../../../assets/icons/TestaLogo.svg';
import "./style.css";
const GetOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ otp: "" });
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [open, setOpen] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const { demoUser = {} } = useSelector(authSelector);
  const [userData, setUserData] = useState();
  const [mobile, setMobile] = useState("");
  const [timer, setTimer] = useState(60);

  const handleClose = () => {
    setOpen(false);
    navigate(GET_RESPONSE);
  };
  useEffect(() => {
    const data = getLocal("demoUserData");
    const mobile = data?.mobile;
    setUserData(demoUser);
    setMobile(mobile);
  }, [demoUser, userData, mobile]);

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
  const handleVerify = (event) => {
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
      const formData = {
        mobile: mobile,
        inputOTP: formValues?.otp,
      };
      dispatch(verifyOtpApi(formData, setErr, setLoading, setOpen));
    }
  };

  useEffect(() => {
    let timeInterval;
    if (timer > 0) {
      timeInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setShowResendButton(true);
    }
    return () => {
      clearInterval(timeInterval);
    };
  }, [timer]);

  const handleResendOTP = () => {
    setTimer(60);
    setShowResendButton(false);
    dispatch(sendOtpApi(setErr, setLoading, { mobile: mobile }));
  };

  const mobileChangeHandler = () => {
    navigate(EDIT_DEMO_USER);
  };

  const renderDesktopView = () => (
    <div className="login-container">
      <div className="login-banner">
        <GetOtpImg />
      </div>
      <div className="login-form-container">
        <div className="form-wrapper">
          <div className="form-header">
            <p className="welcome-text">Welcome Back!</p>
            <h2 className="login-text">OTP Verification</h2>
            <p className="cred-text">
              Please enter the OTP sent to your mobile no.({mobile}) &nbsp;
              <span className="mobile-change-btn" onClick={mobileChangeHandler}>
                Change
              </span>
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
                  label="Enter OTP"
                  type="number"
                  name="otp"
                  placeholder="Enter 6 Digit OTP"
                  onFocus={focusHandler}
                  error={errors?.otp}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.otp}
                  endAdornment={<MailVector style={{ width: "20px" }} />}
                  hideExponants
                />
              </div>
              <div className="not-received-otp-wrapper">
                <div className="not-received-text">
                  <p>Didn't receive OTP?</p>
                </div>
                <div className="resend-btn">
                  {timer > 0 && !showResendButton ? (
                    <p>0:{timer} Sec</p>
                  ) : (
                    <button onClick={handleResendOTP}>Resend OTP</button>
                  )}
                </div>
              </div>
              <div className="otp-verify-btn">
                <Button
                  className={`light-blue-btn submit-btn ${formValues?.otp?.length !== 6 ? "disabled" : ""}`}
                  variant="contained"
                  onClick={handleVerify}
                  sx={{ width: "100%" }}
                  disabled={loading}
                >
                  {loading ? <PulseLoader size="10px" color="white" /> : "Verify"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="mobile-otp-container">
      <div className="mobile-header">
        <img src={TestaLogo} alt="Testa Logo" />
        <div className="header-text">
          <h2>Welcome Back!</h2>
        </div>
      </div>
      <div className="mobile-otp-form">
        <div className="form-header">
          <h2 className="login-text">OTP Verification</h2>
          <p className="cred-text">
            Please enter the OTP sent to your mobile no.({mobile}) &nbsp;
            <span className="mobile-change-btn" onClick={mobileChangeHandler}>
              Change
            </span>
          </p>
        </div>
        {err && (
          <div className="error-box">
            <p className="error-text">{err}</p>
          </div>
        )}
        <div className="form-group">
          <Input
            label="Enter OTP"
            type="number"
            name="otp"
            placeholder="Enter 6 Digit OTP"
            onFocus={focusHandler}
            error={errors?.otp}
            onBlur={blurHandler}
            onChange={changeHandler}
            value={formValues?.otp}
            endAdornment={<MailVector style={{ width: "20px" }} />}
            hideExponants
          />
        </div>
        <div className="not-received-otp-wrapper">
          <div className="not-received-text">
            <p>Didn't receive OTP?</p>
          </div>
          <div className="resend-btn">
            <button
              onClick={handleResendOTP}
              disabled={timer > 0}
              style={{ opacity: timer > 0 ? 0.5 : 1 }}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
        <Button
          variant="contained"
          className="verify-btn"
          onClick={handleVerify}
          disabled={loading || formValues?.otp?.length !== 6}
        >
          {loading ? <PulseLoader size="10px" color="white" /> : "Verify OTP"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {renderDesktopView()}
      {renderMobileView()}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-wrapper"
      >
        <Box className="success-Modal">
          <Box className="success-loader-logo">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </Box>

          <DialogTitle id="alert-dialog-title" sx={{ padding: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }} className="success-title">
              <h1>OTP Verified</h1>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ padding: 0 }}>
            <DialogContentText id="alert-dialog-description" className="success-description">
              Your OTP has been verified successfully.
            </DialogContentText>
          </DialogContent>

          <Box sx={{ display: "flex", justifyContent: "center" }} className="success-btn-wrapper">
            <DialogActions sx={{ padding: 0 }}>
              <Button variant="contained" onClick={handleClose} autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default GetOtp;
