import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "./../../../../utils/validateField";
import SelectInput from "./../../../../components/common/SelectInput";
import Input from "./../../../../components/common/input";
import {
  changePasswordApi,
  getCityListsApi,
  getStateListsApi,
  signUpApi,
} from "./../../../../api/authApi";
import { Button } from "@mui/material";
import {
  USER_TYPE_MENUS,
  GENDER_MENUS,
  COUNTRY,
} from "../../../../config/constants/projectConstant";
import { ReactComponent as MobileIcon } from "../../../../assets/icons/mobile-icon.svg";
import { authSelector } from "./../../../../redux/slicers/authSlice";
import { getUserDetails,getIP, getLocation } from "./../../../../utils/projectHelper";

const initialFormValues = {
  oldPassword: "",
  newPassword: "",
  reEnterPassword: "",
};

const Password = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const { _id = "", deviceId = "" } = getUserDetails();

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(
      name,
      fieldValue,
      formValues?.newPassword,
      formValues?.oldPassword
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
        formValues?.oldPassword
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
        oldPassword: formValues?.oldPassword,
        newPassword: formValues?.newPassword,
        id: _id,
      };
      const logoutPayload= await getLogoutDetails();
      dispatch(
        changePasswordApi(formData, setErr, setLoading, clearFormValues,logoutPayload)
      );
    }
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  return (
    <div className="edit-profile">
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
              <div style={{ width: "100%" }} className="form-group">
                <Input
                  label="Current Password"
                  type={"password"}
                  name="oldPassword"
                  placeholder="Enter your Password"
                  onFocus={focusHandler}
                  error={errors?.oldPassword}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.oldPassword}
                />
              </div>
              <div style={{ width: "100%" }} className="form-group">
                <Input
                  label="New Password"
                  type={"password"}
                  name="newPassword"
                  placeholder="Enter New Password"
                  onFocus={focusHandler}
                  error={errors?.newPassword}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.newPassword}
                  endAdornment
                />
              </div>
              <div style={{ width: "100%" }} className="form-group">
                <Input
                  label="Re-enter Password"
                  type={"password"}
                  name="reEnterPassword"
                  placeholder="Enter Re-enter Password"
                  onFocus={focusHandler}
                  error={errors?.reEnterPassword}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.reEnterPassword}
                  endAdornment
                />
              </div>
            </div>
            <div className="action-btn">
              <Button
                className={`outlined-btn submit-btn`}
                variant="outlined"
                onClick={clearFormValues}
                sx={{ width: "192px", height: "52px", textTransform: "unset" }}
                disabled={loading ? true : false}
              >
                CANCEL
              </Button>
              <Button
                className={`light-blue-btn submit-btn`}
                variant="contained"
                onClick={handleSubmit}
                sx={{ width: "192px", height: "52px", textTransform: "unset" }}
                disabled={loading ? true : false}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "SAVE"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="img-upload-wrapper"></div>
    </div>
  );
};

export default Password;
