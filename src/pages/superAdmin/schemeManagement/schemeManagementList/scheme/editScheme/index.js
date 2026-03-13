import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import validateField from "../../../../../../utils/validateField";
import Input from "../../../../../../components/common/input";
import "../createScheme/style.css";
// import "../../../../userManagement/AssessorList/CreateAssessor/style.css";
import { ReactComponent as ArrowLeft } from "../../../../../../assets/icons/chevron-left.svg";
import { ReactComponent as ListIcon } from "../../../../../../assets/icons/list.svg";
import { SUPER_ADMIN_SCHEME_MANAGEMENT } from "../../../../../../config/constants/routePathConstants/superAdmin";
import { PulseLoader } from 'react-spinners'
import { updateSchemeDetailsApi, getSingleSchemeDetailApi } from "../../../../../../api/superAdminApi/schemeManagement";
import SubmitButton from "../../../../../../components/SubmitButton";
const initialFormValues = {
    schemeName: "",
    schemeCode: "",
};

const EditScheme = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { schemeId } = useParams();
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
            dispatch(
                updateSchemeDetailsApi(setLoading, schemeId, formValues, navigate,clearFormValues)
            );
        }
    };
    useEffect(() => {
        dispatch(getSingleSchemeDetailApi(setLoading, setFormValues, schemeId))
    }, []);

    return (
        <div className="main-content">
            <div className="title">
                <div className="title_card">
                    <ArrowLeft
                        onClick={() => navigate(-1)}
                        style={{ cursor: "pointer" }}
                    />
                    <h1> Edit Scheme Form</h1>
                </div>
                <div className="view-list-btn">
                    <button
                        onClick={() => {
                            navigate(SUPER_ADMIN_SCHEME_MANAGEMENT);
                        }}
                    >
                        {<ListIcon />}View List
                    </button>
                </div>
            </div>

            <section className="scheme-wrapper">
                {err && (
                    <div className="error-box">
                        <p className="error-text">{err}</p>
                    </div>
                )}
                {/* ============Form Starts here ========= */}
                <form>
                    <div className="inputFields">
                        <div className="form_title">
                            <h1>Scheme Form</h1>
                        </div>
                        <div className="inputBox_duo">
                            <div className="form_group">
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
                            <div className="form_group">
                                <Input
                                    label="Scheme Code"
                                    name="schemeCode"
                                    id="schemeCode"
                                    placeholder="Enter scheme Code"
                                    onFocus={focusHandler}
                                    onBlur={blurHandler}
                                    onPaste={handleInputTrimPaste}
                                    error={errors?.schemeCode}
                                    onChange={changeHandler}
                                    value={formValues?.schemeCode}
                                    mandatory
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            <SubmitButton
                cancelBtnText='Cancel'
                submitBtnText='Update'
                handleSubmit={handleSubmit}
                clearFormValues={clearFormValues}
                loading={loading}
            />
        </div>
    );
};

export default EditScheme;
