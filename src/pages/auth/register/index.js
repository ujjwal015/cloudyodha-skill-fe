import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import { ReactComponent as MobileIcon } from "../../../assets/icons/mobile-icon.svg";
import { ReactComponent as GoogleIcon } from "../../../assets/icons/GoogleIcon.svg";
import { getOrganizationListsApi, resendEmailApi, signUpApi } from "../../../api/authApi";
import useFetch from "../../../hooks/useFectch";
import Banner from "../Banner";
import SelectInput from "../../../components/common/SelectInput";
import { SIGNIN, WEBSITE } from "../../../config/constants/routePathConstants/auth";
import { API_ROOT, SIGNUP_API } from "../../../config/constants/apiConstants/auth";
import { USER_TYPE_MENUS } from "../../../config/constants/projectConstant";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../utils/validateField";
import Input from "../../../components/common/input";
import { authSelector } from "../../../redux/slicers/authSlice";
import VerifyEmailImg from "../../../assets/images/auth/verify-email.png";
import TermsAndCondition from "../termsAndCondition";

const initialFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  userType: "",
  mobile: "",
  organisationName: "",
  acceptTermCondition: false,
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const { organizationLists = [] } = useSelector(authSelector);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [openBox, setOpenBox] = useState(false);

  useEffect(() => {
    dispatch(getOrganizationListsApi(setLoading));
  }, []);

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
      // Submit the form data
      setLoading(true);
      dispatch(signUpApi(formValues, setErr, navigate, setLoading, clearFormValues, handleClickOpen));
    }
  };
  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  const resendEmailHandler = () => {
    dispatch(resendEmailApi());
    setOpen1(false);
  };

  return (
    <div className="login-container">
      <Banner />
      <div className="login-form-container">
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
            <p className="welcome-text">Get Started 👋</p>
            <h4 className="login-text">Create Account</h4>
            <p className="cred-text">Get started by creating your new account</p>
          </div>
          {err && (
            <div className="error-box">
              <p className="error-text">{err}</p>
            </div>
          )}
          <div className="form">
            <form>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                  <Input
                    label="First name"
                    name="firstName"
                    placeholder="Enter First Name"
                    onFocus={focusHandler}
                    error={errors?.firstName}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.firstName}
                  />
                </div>
                <div style={{ width: "calc(50% - 10px)" }} className="form-group">
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
                <div style={{ width: "calc(50% - 10px)" }} className="form-group">
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
                  />
                </div>
                <div style={{ width: "calc(50% - 10px)" }} className="form-group">
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
                  />
                </div>
                <div style={{ width: "calc(50% - 10px)" }} className="form-group">
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
                  />
                </div>
                <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                  <SelectInput
                    name="userType"
                    label="Role"
                    placeHolder="Enter your Role"
                    value={formValues?.userType}
                    handleChange={changeHandler}
                    options={USER_TYPE_MENUS}
                    error={errors?.userType}
                  />
                </div>
                <div style={{ width: "100%" }} className="form-group">
                  <SelectInput
                    name="organisationName"
                    label="Organization"
                    placeHolder="Enter your Organisation"
                    value={formValues?.organisationName}
                    handleChange={changeHandler}
                    options={organizationLists}
                    error={errors?.organisationName}
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
                  <p>
                    By clicking on “I Accept”, you hereby accept and acknowledge the{" "}
                    <span onClick={() => setOpenBox(true)}>Terms of Services, License Agreement</span> and
                    <span onClick={() => setOpenBox(true)}> Privacy Notice</span> and agree to be bound by the same.
                  </p>
                </FormGroup>
              </div>
              <Button
                className={`light-blue-btn submit-btn ${!formValues?.acceptTermCondition ? "disabled" : ""}`}
                variant="contained"
                onClick={formValues?.acceptTermCondition ? handleSubmit : undefined}
                sx={{ width: "100%" }}
                disabled={loading ? true : false}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "Register"}
              </Button>
              {/* <div>
                <div className="register-with">
                  <p>or Register With</p>
                </div>
                <Button
                  id="signUpDiv"
                  className="sign-up-google"
                  startIcon={<GoogleIcon />}
                  variant="outlined"
                >
                  Sign up with Google
                </Button>
              </div> */}
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
              <h1>Successful Registration</h1>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ padding: 0 }}>
            <DialogContentText id="alert-dialog-description" className="success-description">
              We have sent an activation link to your account to continue with the registration process.
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

      <Dialog
        open={open1}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-wrapper"
        maxWidth="md"
      >
        <Box className="verify-email-Modal">
          <DialogTitle id="alert-dialog-title" sx={{ padding: 0 }}>
            <Box className="verify-email-title">
              <h1>Verify your email</h1>
              <p>You will need to verify your email to complete registration</p>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ padding: 0 }} className="verify-email-content">
            <div>
              <img src={VerifyEmailImg} />
            </div>
            <DialogContentText id="alert-dialog-description" className="verify-email-description">
              An email has been sent to Testadomain@radiant.com with a link to verify your account.
              <br /> If you have not received the email after a few minutes, please Resend Email
            </DialogContentText>
          </DialogContent>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <DialogActions sx={{ padding: 0 }} className="verify-email-action">
              <Button variant="contained" onClick={resendEmailHandler} autoFocus>
                Verify your email
              </Button>
              <Button variant="outlined" onClick={handleClose} className="outlined">
                Resend Email
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Dialog>

      {/* //terms and condition */}
      <TermsAndCondition setFormValues={setFormValues} openBox={openBox} setOpenBox={setOpenBox} />
    </div>
  );
};

export default Register;

// const { handleGoogle } = useFetch(`${API_ROOT}${SIGNUP_API}`);
// useEffect(() => {
//   if (window.google) {
//     window.google.accounts.id.initialize({
//       client_id: process.env.REACT_APP_API_CLIENT_ID,
//       callback: handleGoogle,
//     });

//     window.google.accounts.id.renderButton(
//       document.getElementById("signUpDiv"),
//       {
//         text: "Sign Up with Google",
//       }
//     );
//   }
// }, [handleGoogle]);
