import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../utils/validateField";
import SelectInput from "../../../../components/common/SelectInput";
import Input from "../../../../components/common/input";
import {
  getStateListsForProfileApi,
  getUserProfileApi,
  updateProfileApi,
} from "../../../../api/authApi";
import { Button } from "@mui/material";
import {
  GENDER_MENUS,
  COUNTRY,
} from "../../../../config/constants/projectConstant";
import { ReactComponent as MobileIcon } from "../../../../assets/icons/mobile-icon.svg";
import { ReactComponent as UploadIcon } from "../../../../assets/images/pages/userProfile/upload-icon.svg";
import { ReactComponent as DeleteIcon } from "../../../../assets/images/pages/userProfile/delete-icon.svg";
import UserProfile from "../../../../assets/images/pages/userProfile/dummy-user-profile.png";

import { authSelector } from "../../../../redux/slicers/authSlice";
import { getUserDetails } from "../../../../utils/projectHelper";
import "./style.css";

const initialFormValues = {
  firstName: "",
  lastName: "",
  gender: "",
  mobile: "",
  email: "",
  address: "",
  country: "",
  state: "",
  userPhoto: "",
};

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [userId, setUserId] = useState("");
  const [ImgURL, setImgURL] = useState();

  const { stateLists = [], userInfo = {} } = useSelector(authSelector);
  const { _id = "" } = getUserDetails();
  const { id } = useParams();
  const getUserProfile = () => {
    setLoading(true);
    dispatch(
      getUserProfileApi(_id, setUserId, setFormValues, setLoading, setImgURL)
    );
  };
  useEffect(() => {
    getUserProfile();
  }, []);



  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    // Update the errors state for this specific field.
    setErrors((prevErrors) => {
      return fieldError
        ? { ...prevErrors, [name]: fieldError } // Set error for the field
        : { ...prevErrors, [name]: undefined }; // Clear error for the field
    });

    // Update form values.
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };
  function base64ToFile(base64, filename) {
    return fetch(base64)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], filename, { type: "image/webp" });
        return file;
      });
  }

  const handleSubmit = async (event) => {
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
      const stateLabel = stateLists.find(
        (item) => item.value == formValues.state
      ).label;
      const { userType, state, ProfileUrl, ...rest } = formValues;

      const formData = new FormData();
      const data = { ...rest };

      for (let key in data) {
        let val = data[key];
        formData.append(key, val);
      }

      formData.delete("userPhoto");
      formData.append("id", userId);
      if (typeof ImgURL !== "string") {
        formData.append("isProfilePicUploaded", true);
        formData.append("userPhoto", ImgURL);
      }
      formData.append("state", stateLabel);

      setLoading(true);

      try {
        const imageUrl = await dispatch(
          updateProfileApi(
            id,
            formData,
            setFormValues,
            setErrors,
            setLoading,
            setUserId,
            setImgURL
          )
        );

      } catch (error) {
        console.error("Error uploading profile:", error);
      }
    }
  };

  const getStateListsHandler = (event) => {
    const { value } = event.target;
    const formData = {
      country: value,
    };
    dispatch(getStateListsForProfileApi(formData, setLoading));
  };

  const loadFile = (event) => {
    if (event.target.files) {
      setImgURL(event.target.files[0]);
      // setImgURL(event.target.files[0]);
    }
  };

  const deleteImage = async () => {
    try {
      const file = await base64ToFile(UserProfile, `file.webp`);
      setImgURL(file);
    } catch (error) {
      console.error("Error converting base64 to file:", error);

      return;
    }
  };
  return (
    <>
      <div className="form_title">
        <h1>Profile</h1>
        <p>Update your photo and personal details here.</p>
      </div>
      <div className="edit-profile my-account">
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
                    placeholder="Enter First Name"
                    mandatory
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
                    placeholder="Enter Last Name"
                    mandatory
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
                    placeHolder="Select your Gender"
                    value={formValues?.gender}
                    mandatory
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
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    placeholder="Enter Mobile No."
                    mandatory
                    // disabled
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
                    placeholder="Enter your Email ID"
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
                    }}
                    options={stateLists}
                    error={errors?.state}
                  />
                </div>
              </div>
              <div className="action-btn">
                <button
                  className={`light-blue-btn submit-btn`}
                  onClick={handleSubmit}
                  disabled={loading ? true : false}
                >
                  {loading ? (
                    <PulseLoader size="10px" color="white" />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="img-upload-wrapper">
          <div className="img-upload">
            <div className="img_container">
              <img
                src={
                  typeof ImgURL === "string"
                    ? ImgURL
                    : ImgURL instanceof Blob || ImgURL instanceof File
                    ? URL.createObjectURL(ImgURL)
                    : UserProfile
                }
                alt="logo"
              />
            </div>
            <div className="icon-wrapper">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="userprofile"
                  style={{ display: "none" }}
                  onChange={(e) => loadFile(e)}
                />
              </div>
              <div>
                <label htmlFor="userprofile">{<UploadIcon />}</label>
              </div>
              <DeleteIcon onClick={() => deleteImage()} />
            </div>
            <div className="img-upload-text">
              <p>PNG or JPG no bigger than 500px wide and tall.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
