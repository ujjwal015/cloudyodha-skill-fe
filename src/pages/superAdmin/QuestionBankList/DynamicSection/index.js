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
import { PulseLoader } from "react-spinners";

const initialFormValues = {
    questionBankName: "",
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

export default function QuestionAdd() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState(initialFormValues);
    const [errors, setErrors] = useState({});
    const [focusedInput, setFocusedInput] = useState("");
    const { questionBankbyID = {} } = useSelector(authSelector);
    const [questionListData, setQuestionListData] = useState([])
    const [qstID, setQstID] = useState([{ label: "default", value: "1" }])
    const [received, setReceived] = useState(false)
    const params = useParams()

    useEffect(() => {
        setLoading(true)
        dispatch(getQuestionBankByID(params.id))
    }, []);

    useEffect(() => {
        if (questionBankbyID.length > 0) {
            setLoading(false)
            setReceived(true)
            setQstID([{
                label: questionBankbyID[0].questionBankName,
                value: questionBankbyID[0].questionBankName
            }])
            setFormValues({
                ...formValues,
                questionBankName: questionBankbyID[0].questionBankName,
                questionType: questionBankbyID[0].questionType,
                jobRole: questionBankbyID[0].jobRole,
                nos: questionBankbyID[0].nos,
                question_bank_id: params.id
            })
        }
    }, [questionBankbyID])

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

            delete formValues.questionBankName
            dispatch(createQuestionSection(formValues, navigate, setLoading, clearFormValues))
        }
    }
    const clearFormValues = () => {
        setFormValues(initialFormValues);
    };

    return (
        <div className="main-container">
            <div className="create-question-heading">
                <div className="create-question-text">
                    <div className="back-arrow">
                        <ArrowBackOutlinedIcon
                            sx={{ fontSize: "20px", mr: 1, cursor: "pointer" }}
                            // onClick={() => navigate(SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE)}
                        />
                    </div>
                    <div className="question-heading-text">
                        <h1>Create Question Bank</h1>
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
                                                    name="Question Bank Name"
                                                    label="Question Bank Name"
                                                    placeHolder="Select Question Bank"
                                                    value={formValues?.questionBankName}
                                                    disabled={received}
                                                    handleChange={changeHandler}
                                                    options={qstID}
                                                    error={errors?.questionType}
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
                                                    disabled={received}
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
                                                disabled={received}
                                                error={errors?.jobRole}
                                                onBlur={blurHandler}
                                                onChange={changeHandler}
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
                                                disabled={received}
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
            <div className="next-step-btn">
                <button onClick={handleSubmit}>
                    {loading ? <PulseLoader size="10px" color="white" /> : "Next step"}
                    <EastOutlinedIcon sx={{ marginLeft: "10px", fontSize: "17px" }} />
                </button>
            </div>
        </div>
    );
}
