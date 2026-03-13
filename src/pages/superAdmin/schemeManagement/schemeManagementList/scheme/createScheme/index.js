import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import validateField from "../../../../../../utils/validateField";
import Input from "../../../../../../components/common/input";
import "./style.css";
import "../../../common.style.css";
import { ReactComponent as ArrowLeft } from "../../../../../../assets/icons/chevron-left.svg";
import { ReactComponent as ListIcon } from "../../../../../../assets/icons/list.svg";
import { SUPER_ADMIN_SCHEME_MANAGEMENT } from "../../../../../../config/constants/routePathConstants/superAdmin";
import { PulseLoader } from "react-spinners";
import { createSchemeApi } from "../../../../../../api/superAdminApi/schemeManagement";
import SubmitButton from "../../../../../../components/SubmitButton";
const initialFormValues = {
  schemeName: "",
  schemeCode: "",
};

const CreateScheme = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [formValues, setFormValues] = useState(initialFormValues);

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
    navigate(SUPER_ADMIN_SCHEME_MANAGEMENT);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      // setFormValues(initialFormValues);
      dispatch(createSchemeApi(formValues, setLoading, clearFormValues, navigate));
    }
  };

  const handleInputTrimPaste = (event)=>{
    event.preventDefault();
    
    const { name, value, type, checked } = event.target;
    const pastedText = event.clipboardData.getData('text/plain');
    const fieldValue = type === "checkbox" ? checked : pastedText.trim();
    const fieldError = validateField(name, pastedText);
 
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

  }

  return (
    <div className="main-content">
      <div className="title">
        <div className="title_card">
          <ArrowLeft onClick={() => navigate(SUPER_ADMIN_SCHEME_MANAGEMENT)} style={{ cursor: "pointer" }} />
          <h1> Create Scheme Form</h1>
        </div>
        <div className="view-list-btn">
          <button
            className="light-blue-btn"
            onClick={() => {
              navigate(SUPER_ADMIN_SCHEME_MANAGEMENT);
            }}
          >
            {<ListIcon />}View List
          </button>
        </div>
      </div>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="form-wrapper">
            {err && (
              <div className="error-box">
                <p className="error-text">{err}</p>
              </div>
            )}
            <div className="form_title">
              <h1>Scheme Form</h1>
            </div>
            <div className="form">
              <form>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                    <Input
                      label="Scheme Name"
                      name="schemeName"
                      id="schemeName"
                      placeholder="Enter scheme name"
                      error={errors.schemeName}
                      onFocus={focusHandler}
                      onPaste={handleInputTrimPaste}
                      onBlur={blurHandler}
                      onChange={changeHandler}
                      value={formValues?.schemeName}
                      mandatory
                    />
                  </div>
                  <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                    <Input
                      label="Scheme Code"
                      name="schemeCode"
                      id="schemeCode"
                      placeholder="Enter scheme Code"
                      onFocus={focusHandler}
                      onPaste={handleInputTrimPaste}
                      onBlur={blurHandler}
                      error={errors?.schemeCode}
                      onChange={changeHandler}
                      value={formValues?.schemeCode}
                      mandatory
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <SubmitButton
        cancelBtnText="Cancel"
        submitBtnText="Save"
        handleSubmit={handleSubmit}
        clearFormValues={clearFormValues}
        loading={loading}
      />
    </div>
  );
};

export default CreateScheme;
