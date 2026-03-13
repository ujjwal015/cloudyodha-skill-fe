import React, { useState, useEffect } from "react";
import Banner from "../Banner";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PulseLoader from "react-spinners/PulseLoader";
import { resetPasswordApi } from "../../../api/authApi";
import validateField from "../../../utils/validateField";
import Input from "./../../../components/common/input";
import AuthBackgroundImage from "../../../assets/images/auth/AuthBackgroundImage.png";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    olDPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue, formValues.password);

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
      const fieldError = validateField(name, value, formValues.password);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Submit the form data
      const formData = {
        newPassword: formValues.newPassword,
        oldPassword: formValues.olDPassword,
        email: formValues.email,
      };
      setLoading(true);
      dispatch(resetPasswordApi(formData, setErr, navigate, setLoading));
    }
  };

  return (
    <div className="login-container">
      {!isMobile && <Banner />}
      <div
        className="login-form-container"
        style={{
          padding: isMobile ? "20px" : "40px",
          // width: "100%",
          ...(isMobile && {
            backgroundImage: `url(${AuthBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          })
        }}
      >
        <div
          className="form-wrapper center-wrapper"
          style={{
            width: "100%",
            maxWidth: isMobile ? "100%" : "450px",
            margin: "0 auto",
          }}
        >
          <div
            className="text-wrapper"
            style={{
              textAlign: isMobile ? "left" : "center",
              marginBottom: isMobile ? "1.5rem" : "2rem",
            }}
          >
            <h4
              className="login-text"
              style={{
                fontSize: isMobile ? "24px" : "32px",
              }}
            >
              Reset Password
            </h4>
            <p
              className="cred-text"
              style={{
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              Start the process to reset your new password
            </p>
          </div>
          {err && (
            <div className="error-box" style={{ margin: "0 0 20px 0" }}>
              <p className="error-text">{err}</p>
            </div>
          )}
          <div className="form">
            <form style={{ width: "100%" }}>
              <div
                className="form-group"
                style={{ marginBottom: isMobile ? "16px" : "20px" }}
              >
                <Input
                  label="Email"
                  type={"email"}
                  name="email"
                  placeholder="Enter your email"
                  onFocus={focusHandler}
                  error={errors?.email}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.email}
                />
              </div>
              <div
                className="form-group"
                style={{ marginBottom: isMobile ? "16px" : "20px" }}
              >
                <Input
                  label="Old Password"
                  type={"password"}
                  name="olDPassword"
                  placeholder="Enter your old password"
                  onFocus={focusHandler}
                  error={errors?.olDPassword}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.olDPassword}
                  endAdornment
                />
              </div>
              <div
                className="form-group"
                style={{ marginBottom: isMobile ? "16px" : "20px" }}
              >
                <Input
                  label="New Password"
                  type={"password"}
                  name="newPassword"
                  placeholder="Enter your new password"
                  onFocus={focusHandler}
                  error={errors?.newPassword}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.newPassword}
                  endAdornment
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: isMobile ? "stretch" : "center",
                }}
              >
                <Button
                  className="light-blue-btn"
                  variant="contained"
                  sx={{
                    width: isMobile ? "100%" : "48%",
                    textTransform: "unset",
                    padding: isMobile ? "12px" : "10px",
                    fontSize: isMobile ? "16px" : "inherit",
                  }}
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <PulseLoader size="10px" color="white" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;