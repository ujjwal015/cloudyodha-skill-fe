import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "./../../../../utils/validateField";
import Input from "./../../../../components/common/input";
import { getUserProfileApi, updateSocialProfileApi } from "./../../../../api/authApi";
import { Button } from "@mui/material";
import { getUserDetails } from "./../../../../utils/projectHelper";

const initialFormValues = {
  twitter: "",
  linkedIn: "",
  facebook: "",
  youtube: "",
};

const SocialProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [userId, setUserId] = useState("");
  const { _id = "" } = getUserDetails();

  const getUserProfile = () => {
    setLoading(true);
    dispatch(
      getUserProfileApi(_id, setUserId, setFormValues, setLoading,true)
    );
  };

  useEffect(() => {
    getUserProfile();
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
      setLoading(true);
      dispatch(updateSocialProfileApi(_id, formValues, setErr, setLoading));
    }
  };

  return (
    <div className="edit-profile social-media-wrapper">
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
              <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                <Input
                  label="Twitter"
                  name="twitter"
                  placeholder="https://twitter.com/username"
                  onFocus={focusHandler}
                  error={errors?.twitter}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.twitter}
                />
              </div>
              <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                <Input
                  label="LinkedIn"
                  name="linkedIn"
                  placeholder="https://linkedin.com/username"
                  onFocus={focusHandler}
                  error={errors?.linkedIn}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.linkedIn}
                />
              </div>
              <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                <Input
                  label="Facebook"
                  name="facebook"
                  placeholder="https://facebook.com/username"
                  onFocus={focusHandler}
                  error={errors?.facebook}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.facebook}
                />
              </div>
              <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                <Input
                  label="Youtube"
                  name="youtube"
                  placeholder="https://youtube.com/username"
                  onFocus={focusHandler}
                  error={errors?.youtube}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.youtube}
                />
              </div>
            </div>
            <div className="action-btn">
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
                  "Save Profile"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="img-upload-wrapper"></div>
    </div>
  );
};

export default SocialProfile;