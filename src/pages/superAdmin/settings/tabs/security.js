import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../utils/validateField";
import Input from "../../../../components/common/input";
import { changePasswordApi } from "../../../../api/authApi";
import { Button } from "@mui/material";

import { getIP, getLocation, getUserDetails } from "../../../../utils/projectHelper";
import "./style.css";

const initialFormValues = {
  olDPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const Security = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const { _id = "",deviceId } = getUserDetails();

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(
      name,
      fieldValue,
      formValues?.newPassword,
      formValues?.olDPassword,
      formValues?.confirmNewPassword
    );

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

  const getLogoutDetails=async()=>{
        const [geolocation,userIp]=await Promise.all([getLocation(),getIP()])
        return  {
          userId: _id,
          isAllLogout: true,
          deviceId: deviceId,
          addreiss: userIp,
          latitude: geolocation.latitude,
          longitude: geolocation.longitude,
          alsoFromCurrentDevice: true,
        };
      }

  const handleSubmit = async(event) => {
    event.preventDefault();
    const formErrors = {};

    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(
        name,
        value,
        formValues?.newPassword,
        formValues?.olDPassword,
        formValues?.confirmNewPassword
      );
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Submit the form data
      setLoading(true);
      const formData = {
        oldPassword: formValues?.olDPassword,
        newPassword: formValues?.newPassword,
        confirmNewPassword: formValues?.confirmNewPassword,
        userId: _id,
      };
      const logoutPayload = await getLogoutDetails();
      dispatch(
        changePasswordApi(formData, setErr, setLoading, clearFormValues,logoutPayload)
      );
    }
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  return (
    <>
      <div className="form_title">
        <h1>Security</h1>
        <p>Update your password from here.</p>
      </div>
      <div className="edit-profile security">
        <div className="form-wrapper">
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
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Current Password"
                    type={"password"}
                    name="olDPassword"
                    placeholder="Type Password"
                    onFocus={focusHandler}
                    error={errors?.olDPassword}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.olDPassword}
                    endAdornment
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="New Password"
                    type={"password"}
                    name="newPassword"
                    placeholder="Type Password"
                    onFocus={focusHandler}
                    error={errors?.newPassword}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.newPassword}
                    endAdornment
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Confirm Password"
                    type={"password"}
                    name="confirmNewPassword"
                    placeholder="Type Password"
                    onFocus={focusHandler}
                    error={errors?.confirmNewPassword}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.confirmNewPassword}
                    endAdornment
                  />
                </div>
              </div>
              <div className="action-btn">
                <Button
                  className={`light-blue-btn submit-btn`}
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading ? true : false}
                >
                  {loading ? (
                    <PulseLoader size="10px" color="white" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Security;
