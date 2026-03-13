import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import "../../questionBank/createQuestionBank/module.createQuestionBank.css";
import { SUPER_ADMIN_QUESTION_LIST } from "../../../../config/constants/routePathConstants/superAdmin";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import SelectInput from "../../../../components/common/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import validateField from "../../../../utils/validateField";
import Input from "../../../../components/common/input";
import { LANGUAGES, QUESTION_TYPES, SECTIONS } from "../../../../config/constants/projectConstant";
import { createQuestionSection, getQuestionBankListApi, getQuestionListApi } from "../../../../api/authApi";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { PulseLoader } from "react-spinners";

const initialFormValues = {
  questionType: "",
  jobRole: "",
  section: "",
  nos: "",
  performanceCriteria: "",
  question_bank_id: "",
  language: "",
  isNext: false,
};

const errors = {};

export default function QuestionAdd() {
  const questionFormData = JSON.parse(localStorage.getItem("formData")) || false;
  const questionFormGeneratedID = JSON.parse(localStorage.getItem("userQuestionBankID")) || false;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const { getQuestionList = {}, getQuestionBankList = {} } = useSelector(authSelector);
  const [questionListData, setQuestionListData] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [qstID, setQstID] = useState([{ label: "default", value: "1" }]);
  const [received, setReceived] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getQuestionBankListApi(setLoading, 1, Infinity));
  }, [questionFormData]);

  useEffect(() => {
    setQuestionListData(getQuestionBankList);
    if (questionListData.length > 0) setAllData();
  }, [questionListData.length, loading]);

  const setAllData = () => {
    const qtnIdList = questionListData.map((el) => {
      return {
        label: el.questionBankName,
        value: el._id,
      };
    });
    setQstID(qtnIdList);
    setReceived(true);
  };

  useEffect(() => {
    if (questionFormGeneratedID) {
      const selectedItem2 = questionListData.filter((e) => {
        if (e._id === questionFormGeneratedID) return e;
      });
      if (selectedItem2.length > 0) setFinalData(selectedItem2[0]);
    }
  }, []);

  const changeHandler = (event) => {
    event.preventDefault();
    const { name, value, type, checked } = event.target;

    const selectedItem = questionListData.filter((e) => {
      if (e._id === value) return e;
    });
    const fieldValue = type === "checkbox" ? checked : value;
    setFormValues({
      ...formValues,
      question_bank_id: selectedItem[0]._id,
      jobRole: selectedItem[0].jobRole,
      questionType: selectedItem[0].questionType,
      nos: selectedItem[0].nos,
    });
    setReceived(true);
  };
  const changeHandler2 = (event) => {
    event.preventDefault();

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
      setLoading(true);
      dispatch(createQuestionSection(formValues, navigate, setLoading, clearFormValues));
    }
  };
  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  return (
    <div className="main-content">
      <div className="create-question-heading">
        <div className="create-question-text">
          <div className="back-arrow">
            <ArrowBackOutlinedIcon
              sx={{ fontSize: "20px", mr: 1, cursor: "pointer" }}
              onClick={() => navigate(SUPER_ADMIN_QUESTION_LIST)}
            />
          </div>
          <div className="question-heading-text">
            <h1>Create Question List</h1>
          </div>
        </div>
        <div className="view-list-btn">
          <button className="light-blue-btn" onClick={() => navigate(SUPER_ADMIN_QUESTION_LIST)}>
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
              <div className="form_title">
                <h1>Question Bank Form</h1>
              </div>
              <form>
                <div
                  className="inputFeilds"
                  style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}
                >
                  <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                    <SelectInput
                      name="question_bank_id"
                      label="Question Bank"
                      placeHolder={loading ? <PulseLoader color={"#00b2ff"} /> : "Select Question Bank Name"}
                      value={formValues?.question_bank_id}
                      disabled={questionFormData || loading}
                      handleChange={changeHandler}
                      options={qstID}
                      error={errors?.question_bank_id}
                      mandatory
                    />
                  </div>
                  <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                    <SelectInput
                      name="questionType"
                      label="Question Type"
                      placeHolder="Select Question Type"
                      value={formValues?.questionType}
                      disabled={questionFormData || received}
                      handleChange={changeHandler}
                      options={QUESTION_TYPES}
                      error={errors?.questionType}
                      mandatory
                    />
                  </div>

                  <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                    <Input
                      label="Job Role"
                      type="text"
                      name="jobRole"
                      placeholder="Enter Job Role"
                      onFocus={focusHandler}
                      disabled={questionFormData || received}
                      error={errors?.jobRole}
                      onBlur={blurHandler}
                      onChange={changeHandler}
                      value={formValues?.jobRole}
                      mandatory
                    />
                  </div>

                  <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                    <Input
                      label="NOS"
                      name="nos"
                      placeholder="Enter NOS"
                      onFocus={focusHandler}
                      disabled={questionFormData || received}
                      error={errors?.nos}
                      onBlur={blurHandler}
                      onChange={changeHandler}
                      value={formValues?.nos}
                      mandatory
                    />
                  </div>
                  <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                    <SelectInput
                      name="section"
                      label="Section"
                      placeHolder="Select Section"
                      value={formValues?.section}
                      handleChange={changeHandler2}
                      options={SECTIONS}
                      error={errors?.section}
                      mandatory
                    />
                  </div>

                  <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
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
                  <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                    <SelectInput
                      name="language"
                      label="Language"
                      placeHolder="Select Language"
                      value={formValues?.language}
                      handleChange={changeHandler2}
                      options={LANGUAGES}
                      error={errors?.language}
                      mandatory
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div className="next-step-btn">
        <button onClick={handleSubmit}>
          {loading ? <PulseLoader color="white" /> : "Next Step"}
          <EastOutlinedIcon sx={{ marginLeft: "10px", fontSize: "17px" }} />
        </button>
      </div>
    </div>
  );
}
