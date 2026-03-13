import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import validateField from "../../../../../../utils/validateField";
import Input from "../../../../../../components/common/input";
import "./style.css";
import "../../../common.style.css";
import { ReactComponent as ArrowLeft } from "../../../../../../assets/icons/chevron-left.svg";
import { ReactComponent as ListIcon } from "../../../../../../assets/icons/list.svg";
import { SUPER_ADMIN_SUB_SCHEME_MANAGEMENT } from "../../../../../../config/constants/routePathConstants/superAdmin";

import {
    getSchemeListApi, createSubSchemeApi
} from "../../../../../../api/superAdminApi/schemeManagement";
import SelectInput from "../../../../../../components/common/SelectInput";
import { authSelector } from "../../../../../../redux/slicers/authSlice";
import { useEffect } from "react";
import { PulseLoader } from "react-spinners";
import SubmitButton from "../../../../../../components/SubmitButton";
const initialFormValues = {
    schemeId: "",
    subSchemeCode: "",
    subSchemeName: "",
};

const CreateSubScheme = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const { schemeList = [] } = useSelector(authSelector);
    const [focusedInput, setFocusedInput] = useState("");
    const [formValues, setFormValues] = useState(initialFormValues);


    const getSchemeList = () => {
        setLoading(true);
        dispatch(getSchemeListApi(setLoading, 1, "", 100, ""));
    };
    useEffect(() => {
        getSchemeList();
    }, []);

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
        navigate(SUPER_ADMIN_SUB_SCHEME_MANAGEMENT);
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
            dispatch(
                createSubSchemeApi(formValues, setLoading, clearFormValues, navigate)
            );
        }
    };


    return (
        <div className="main-content">
            <div className="title">
                <div className="title_card">
                    <ArrowLeft
                        onClick={() => navigate(-1)}
                        style={{ cursor: "pointer" }}
                    />
                    <h1> Create Sub-Scheme Form</h1>
                </div>
                <div className="view-list-btn">
                    <button
                        onClick={() => {
                            navigate(SUPER_ADMIN_SUB_SCHEME_MANAGEMENT);
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
                            <h1>Sub Scheme Form</h1>
                        </div>
                        <div className="inputBox_duo">
                            <div className="form_group">
                                <div className="select-md">
                                    <SelectInput
                                        name="schemeId"
                                        label="Scheme Name"
                                        placeHolder="Select Scheme Name"
                                        options={schemeList}
                                        value={formValues?.schemeId}
                                        handleChange={changeHandler}
                                        error={errors?.schemeId}
                                        mandatory
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="inputBox_duo">
                        <div className="form_group">
                                <Input
                                    label="Sub-Scheme Name"
                                    name="subSchemeName"
                                    id="subSchemeName"
                                    placeholder="Enter sub-scheme name"
                                    onFocus={focusHandler}
                                    onBlur={blurHandler}
                                    error={errors?.subSchemeName}
                                    onChange={changeHandler}
                                    value={formValues?.subSchemeName}
                                    mandatory
                                />
                            </div>
                            <div className="form_group">
                                <Input
                                    label="Sub-Scheme Code"
                                    name="subSchemeCode"
                                    id="schemeName"
                                    placeholder="Enter sub-scheme code"
                                    error={errors.subSchemeCode}
                                    onFocus={focusHandler}
                                    onBlur={blurHandler}
                                    onChange={changeHandler}
                                    value={formValues?.subSchemeCode}
                                    mandatory
                                />
                            </div>
                            
                        </div>
                    </div>
                </form>
            </section>

            <SubmitButton
                cancelBtnText='Cancel'
                submitBtnText='Save'
                handleSubmit={handleSubmit}
                clearFormValues={clearFormValues}
                loading={loading}
            />
        </div>
    );
};

export default CreateSubScheme;
