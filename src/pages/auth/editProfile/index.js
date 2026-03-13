import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { ReactComponent as MobileIcon } from "../../../assets/icons/mobile-icon.svg";
import {
  editProfileApi,
  getCityListsApi,
  getOrganizationListsApi,
  getStateListsApi,
} from "../../../api/authApi";
import Banner from "../Banner";
import SelectInput from "../../../components/common/SelectInput";
import {
  USER_TYPE_MENUS,
  GENDER_MENUS,
  COUNTRY,
} from "../../../config/constants/projectConstant";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../utils/validateField";
import Input from "../../../components/common/input";
import { authSelector, getCityLists } from "../../../redux/slicers/authSlice";
import { getUserDetails } from "../../../utils/projectHelper";

const initialFormValues = {
  firstName: "",
  lastName: "",
  gender: "",
  mobile: "",
  email: "",
  address: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  userType: "",
  organisationName: "",
  description: "",
};

const EditProfile = () => {
  const {
    firstName = "",
    lastName = "",
    mobile = "",
    email = "",
    userType = "",
    organisationName = "",
  } = getUserDetails();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const {
    stateLists = [],
    cityLists = [],
    organizationLists = [],
  } = useSelector(authSelector);

  useEffect(() => {
    setFormValues((pre) => ({
      ...pre,
      firstName,
      lastName,
      mobile,
      email,
      userType,
      organisationName,
    }));
    dispatch(getOrganizationListsApi(setLoading));
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
      const stateLabel = stateLists.find(
        (item) => item.value == formValues.state
      ).label;

      const formData = { ...formValues, state: stateLabel };
      setLoading(true);
      dispatch(
        editProfileApi(formData, setErr, navigate, setLoading, clearFormValues)
      );
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
    setCityLoading(true)
    dispatch(getCityListsApi(formData, setCityLoading));
    setFormValues((pre) => ({ ...pre, city: "" }));
  };

  return (
    <div className="login-container edit-profile">
      <Banner />
      <div className="login-form-container">
        <div className="edit-profile-text-wrapper">
          <h5>Edit Profile</h5>
          <p>
            Fields marked with&nbsp;<span>*</span>&nbsp;are mandatory!
          </p>
        </div>
        <div className="complete-profile-text-wrapper">
          <h5>COMPLETE YOUR PROFILE</h5>
        </div>
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
                    label="First name"
                    name="firstName"
                    mandatory
                    disabled
                    placeholder="Enter First Name"
                    onFocus={focusHandler}
                    error={errors?.firstName}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.firstName}
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Last Name"
                    name="lastName"
                    mandatory
                    disabled
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
                  <SelectInput
                    name="gender"
                    label="Gender"
                    mandatory
                    placeHolder="Select your Gender"
                    value={formValues?.gender}
                    handleChange={changeHandler}
                    options={GENDER_MENUS}
                    error={errors?.gender}
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
                    mandatory
                    disabled
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
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    disabled
                    placeholder="Enter your mail ID"
                    onFocus={focusHandler}
                    error={errors?.email}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.email}
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Address"
                    name="address"
                    mandatory
                    placeholder="Enter your Address"
                    onFocus={focusHandler}
                    error={errors?.address}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.address}
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <SelectInput
                    name="country"
                    label="Country"
                    placeHolder="Select your Country"
                    value={formValues?.country}
                    mandatory
                    handleChange={(e) => {
                      changeHandler(e);
                      getStateListsHandler(e);
                    }}
                    options={COUNTRY}
                    error={errors?.country}
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <SelectInput
                    name="state"
                    label="State"
                    placeHolder="Select your State"
                    value={formValues?.state}
                    mandatory
                    handleChange={(e) => {
                      changeHandler(e);
                      getCityListsHandler(e);
                    }}
                    options={stateLists}
                    error={errors?.state}
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <SelectInput
                    name="city"
                    label="City"
                    placeHolder="Select your City"
                    value={formValues?.city}
                    mandatory
                    loading={cityLoading}
                    handleChange={changeHandler}
                    options={cityLists}
                    error={errors?.city}
                  />
                </div>
                <div
                  style={{ width: "calc(50% - 10px)" }}
                  className="form-group"
                >
                  <Input
                    label="Pincode"
                    type={"number"}
                    name="pincode"
                    placeholder="Select your Pincode"
                    mandatory
                    onFocus={focusHandler}
                    error={errors?.pincode}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.pincode}
                  />
                </div>
                <div className="form-group" style={{ width: "100%" }}>
                  <SelectInput
                    name="userType"
                    label="Role"
                    disabled
                    placeHolder="Select user type"
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
                    disabled
                    value={formValues?.organisationName}
                    handleChange={changeHandler}
                    options={organizationLists}
                    error={errors?.organisationName}
                  />
                </div>
                <div className="form-group" style={{ width: "100%" }}>
                  <Input
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    onFocus={focusHandler}
                    error={errors?.description}
                    onBlur={blurHandler}
                    onChange={changeHandler}
                    value={formValues?.description}
                  />
                </div>
              </div>
              <Button
                className={`light-blue-btn submit-btn`}
                variant="contained"
                onClick={handleSubmit}
                sx={{ width: "192px", height: "52px", textTransform: "unset" }}
                disabled={loading ? true : false}
              >
                {loading ? (
                  <PulseLoader size="10px" color="white" />
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
