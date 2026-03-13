import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import "./style.css";
import "../../questionBank/createQuestionBank/module.createQuestionBank.css"
import { SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE, SUPER_ADMIN_QUESTION, SUPER_ADMIN_QUESTION_LIST } from "../../../../config/constants/routePathConstants/superAdmin";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import SelectInput from "../../../../components/common/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import validateField from "../../../../utils/validateField";
import Input from "../../../../components/common/input";
import { LANGUAGES, QUESTION_TYPES, SECTIONS } from "../../../../config/constants/projectConstant";
import { createQuestionSection, getQuestionBankByID, getQuestionBankListApi, getQuestionListApi } from "../../../../api/authApi";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { BarLoader, PropagateLoader, PulseLoader } from "react-spinners";
import axios from "axios";
import { editSectionDetailsApi, getSectionDetailsApi } from "../../../../api/superAdminApi/questionBank";
import { clientSelector } from "../../../../redux/slicers/clientSlice";
import { Button } from "@mui/material";


const initialFormValues = {
    questionType: "",
    jobRole: "",
    section: "",
    nos: "",
    performanceCriteria: "",
    question_bank_id: "",
    language: "",
    isNext: false
}

const errors = {}

export default function EditSection() {
    const questionFormData = JSON.parse(localStorage.getItem("formData")) || false;
    const questionFormGeneratedID = JSON.parse(localStorage.getItem("userQuestionBankID")) || false;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState(initialFormValues);
    const [errors, setErrors] = useState({});
    const [err, setErr] = useState("");
    const [focusedInput, setFocusedInput] = useState("");
    const { getQuestionBankList = {}, questionBankbyID = {} } = useSelector(authSelector);
    const { sectionByID = {} } = useSelector(clientSelector)
    const [questionListData, setQuestionListData] = useState([])
    const [sectionData, setSectionData] = useState()
    const [finalData, setFinalData] = useState([])

    const [qstID, setQstID] = useState([{ label: "default", value: "1" }])
    const [received, setReceived] = useState(false)
    const params = useParams()

    useEffect(() => {
        setLoading(true)
        if (params.id) dispatch(getSectionDetailsApi(setLoading, params.id))
        dispatch(getQuestionBankListApi(setLoading, 1, Infinity))
    }, []);

    useEffect(() => {
        setSectionData(sectionByID)
        if (typeof sectionData === "object") {
            if (getQuestionBankList.length > 0) {
                setQuestionListData(getQuestionBankList)
            }
            const questBankName = questionListData?.filter((el) => {
                if (el._id === sectionData.question_bank_id) return el
            })
            if (questBankName.length > 0) {
                const qtnIdList = questBankName.map((el) => {
                    return {
                        label: el.questionBankName,
                        value: el._id
                    }
                })
                setQstID(qtnIdList)
                setFormValues({
                    ...formValues,
                    question_bank_id: sectionData?.question_bank_id,
                    questionType: sectionData?.questionType,
                    jobRole: sectionData?.jobRole,
                    nos: sectionData?.nos,
                    section: sectionData?.section,
                    language: sectionData?.language,
                    performanceCriteria: sectionData?.performanceCriteria
                })
            }
        }
    }, [sectionByID, sectionData, questionListData.length > 0, getQuestionBankList])

    useEffect(() => {
        if (questionFormGeneratedID) {
            const selectedItem2 = questionListData.filter((e) => {
                if (e._id === questionFormGeneratedID) return e
            })
            if (selectedItem2.length > 0) setFinalData(selectedItem2[0])
        }
    }, [])



    const changeHandler = (event) => {
        event.preventDefault()
        const { name, value, type, checked } = event.target;
        const selectedItem = questionListData.filter((e) => {
            if (e._id === value) return e
        })
        const fieldValue = type === "checkbox" ? checked : value;

        setFormValues({
            ...formValues,
            question_bank_id: selectedItem[0]._id,
            jobRole: selectedItem[0].jobRole,
            questionType: selectedItem[0].questionType,
            nos: selectedItem[0].nos
        })
        setReceived(true)
    };
    const changeHandler2 = (event) => {
        event.preventDefault()

        const { name, value, type, checked } = event.target;
        const fieldValue = type === "checkbox" ? checked : value;

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
            setLoading(true)
            dispatch(editSectionDetailsApi(setLoading, formValues, params.id, clearFormValues, navigate))
        }
    }



    return (
        <div className="main-container">
            {loading ? <div className="data_loader">
                <BarLoader color="#00b2ff" /> </div> : <>
                <div className="create-question-heading">
                    <div className="create-question-text">
                        <div className="back-arrow">
                            <ArrowBackOutlinedIcon
                                sx={{ fontSize: "20px", mr: 1, cursor: "pointer" }}
                                onClick={() => navigate(SUPER_ADMIN_QUESTION_LIST)}
                            />
                        </div>
                        <div className="question-heading-text">
                            <h1>Edit Question Bank</h1>
                        </div>
                    </div>
                    <div className="view-list-btn">
                        <button
                            className="view-list-btn-text"
                            onClick={() => navigate(SUPER_ADMIN_QUESTION_LIST)}
                        >
                            <ListOutlinedIcon
                                sx={{ fontSize: "20px", color: "#FFFFFF", mr: 1 }}
                            />
                            View List
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
                            <div className="form">
                                <form>
                                    <div className="inputFeilds">
                                        <div className="form_title">
                                            <h1>Question Bank Form</h1>
                                        </div>
                                        <div className="duo_inputBox">
                                            <div className="form-group">
                                                <div className="select_md">
                                                    <SelectInput
                                                        name="question_bank_id"
                                                        label="Question Bank Name"
                                                        placeHolder={"Select Question Bank Name"}
                                                        value={formValues?.question_bank_id}
                                                        disabled={sectionData ? true : false}
                                                        handleChange={changeHandler}
                                                        options={qstID}
                                                        error={errors?.question_bank_id}
                                                        mandatory />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="select_md">
                                                    <SelectInput
                                                        name="questionType"
                                                        label="Question Type"
                                                        placeHolder="Select Question Type"
                                                        value={formValues?.questionType}
                                                        disabled={sectionData ? true : false}
                                                        handleChange={changeHandler}
                                                        options={QUESTION_TYPES}
                                                        error={errors?.questionType}
                                                        mandatory />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="input_lg">
                                                <Input
                                                    label="Job Role"
                                                    type="text"
                                                    name="jobRole"
                                                    placeholder="Enter Job Role"
                                                    onFocus={focusHandler}
                                                    disabled={sectionData ? true : false}
                                                    error={errors?.jobRole}
                                                    onBlur={blurHandler}
                                                    onChange={changeHandler2}
                                                    value={formValues?.jobRole}
                                                    mandatory />
                                            </div>
                                        </div>

                                        <div className="duo_inputBox">
                                            <div className="form-group">
                                                <Input
                                                    label="NOS"
                                                    name="nos"
                                                    placeholder="Enter NOS"
                                                    onFocus={focusHandler}
                                                    disabled={sectionData ? true : false}
                                                    error={errors?.nos}
                                                    onBlur={blurHandler}
                                                    onChange={changeHandler}
                                                    value={formValues?.nos}
                                                    mandatory
                                                />
                                            </div>
                                            <div className="form-group">
                                                <div className="select_md">
                                                    <SelectInput
                                                        name="section"
                                                        label="Section"
                                                        placeHolder="Select Section"
                                                        disabled={sectionData ? true : false}
                                                        value={formValues?.section}
                                                        handleChange={changeHandler2}
                                                        options={SECTIONS}
                                                        error={errors?.section}
                                                        mandatory />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="duo_inputBox">
                                            <div className="form-group">
                                                <Input
                                                    label="Performance Criteria"
                                                    name="performanceCriteria"
                                                    placeholder="Enter Performance Criteria"
                                                    onFocus={focusHandler}
                                                    error={errors?.performanceCriteria}
                                                    onBlur={blurHandler}
                                                    onChange={changeHandler2}
                                                    value={formValues?.performanceCriteria}
                                                    mandatory
                                                />
                                            </div>
                                            <div className="form-group">
                                                <div className="select_md">
                                                    <SelectInput
                                                        name="language"
                                                        label="Language"
                                                        placeHolder="Select Language"
                                                        disabled={sectionData ? true : false}
                                                        value={formValues?.language}
                                                        handleChange={changeHandler2}
                                                        options={LANGUAGES}
                                                        error={errors?.language}
                                                        mandatory />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="button-box">
                    <div className="cancel-btn outlined-btn">
                        <Button
                            className={`outlined-btn submit-btn`}
                            variant="outlined"
                            onClick={() => navigate(SUPER_ADMIN_QUESTION_LIST)}
                            sx={{
                                width: "90px",
                                height: "42px",
                                textTransform: "unset",
                            }}
                            disabled={loading ? true : false}
                        >
                            Back
                        </Button>
                    </div>
                    <div className="next-step-btn">
                        <Button
                            className={`light-blue-btn submit-btn`}
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                width: "180px",
                                height: "42px",
                                textTransform: "unset",
                                backgroundColor: "#00b2ff !important"
                            }}
                            disabled={loading ? true : false}
                        >
                            {loading ? <PulseLoader size="10px" color="white" /> : "Update Details"}
                        </Button>
                    </div>
                </div>
            </>}
        </div>
    );
}
