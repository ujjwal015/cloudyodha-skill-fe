import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../module.createQuestionBank.css";
// import "../../../../../components/common/table/style.css"
import { BarLoader, PulseLoader } from "react-spinners";
import validateField from "../../../../../utils/validateField";
import SelectInput from "../../../../../components/common/SelectInput";
import Input from "../../../../../components/common/input";

import {
  createQuestionBankFormAndNextApi,
  createQuestionBankFormApi,
  getStateListsApi,
} from "../../../../../api/authApi";

import { Button } from "@mui/material";
import { STATUS, QUESTION_TYPES, SECTOR } from "../../../../../config/constants/projectConstant";

import { ReactComponent as ArrowLeft } from "../../../../../assets/images/pages/clientManagement/arrow-left.svg";
import { ReactComponent as UploadIcon } from "../../../../../assets/icons/upload-cloud.svg";
import { ReactComponent as ListIcon } from "../../../../../assets/icons/list.svg";
import { SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import validateFieldQST from "../../../../../utils/validateQST";
import { editQuestionBankFormApi, getQuestionBankSearchResultApi } from "../../../../../api/superAdminApi/questionBank";
import clientReducer, { clientSelector } from "../../../../../redux/slicers/clientSlice";
import axios from "axios";

const initialFormValues = {
  questionBankName: "",
  questionType: "",
  jobRole: "",
  jobLevel: "",
  code: "",
  sector: "",
  subSector: "",
  sectorCode: "",
  schemeName: "",
  schemeCode: "",
  nos: "",
  nosCode: "",
  theoryMarks: "",
  practicalMarks: "",
  status: "",
};

const CreateQuestionForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const params = useParams();
  const [edit, setEdit] = useState();
  const { searchResultsQuestionBank = [] } = useSelector(clientSelector);

  const getSearchRes = () => {
    if (edit) {
      setLoading(true);
      dispatch(getQuestionBankSearchResultApi(setLoading, edit));
    }
  };

  useEffect(() => {
    if (params?.id) setEdit(params.id);
    getSearchRes();
  }, [edit]);

  useEffect(() => {
    if (edit && searchResultsQuestionBank.length > 0) {
      setFormValues(...searchResultsQuestionBank);
    }
  }, [searchResultsQuestionBank.length, edit]);

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    if (name == "questionBankName") {
      const formErrors = {};
      const value = formValues.questionBankName;
      const fieldError = validateFieldQST(name, value);
      if (fieldError) {
        formErrors.questionBankName = fieldError;
      }

      setErrors(formErrors);
    }
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

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
      setLoading(true);
      if (edit) {
        const formValues_2 = {
          questionBankName: formValues.questionBankName,
          questionType: formValues.questionType,
          jobRole: formValues.jobRole,
          jobLevel: formValues.jobLevel,
          code: formValues.code,
          sector: formValues.sector,
          subSector: formValues.subSector,
          sectorCode: formValues.sectorCode,
          schemeName: formValues.schemeName,
          schemeCode: formValues.schemeCode,
          nos: formValues.nos,
          nosCode: formValues.nosCode,
          theoryMarks: formValues.theoryMarks,
          practicalMarks: formValues.practicalMarks,
          status: formValues.status,
          _id: formValues._id,
        };
        dispatch(editQuestionBankFormApi(setLoading, formValues_2, navigate, clearFormValues));
      } else {
        dispatch(createQuestionBankFormApi(formValues, navigate, setLoading, clearFormValues));
      }
    }
  };

  const handleSaveAndNext = (e) => {
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
      formValues.practicalMarks = +formValues.practicalMarks;
      formValues.theoryMarks = +formValues.theoryMarks;
      // console.log(formValues);
      dispatch(createQuestionBankFormAndNextApi(formValues, navigate, setLoading, clearFormValues));
    }
  };

  return (
    <div className="main-content">
      {loading ? (
        <div className="data_loader">
          <BarLoader color="#00b2ff" />
        </div>
      ) : (
        <>
          <div className="title">
            <div className="title_card" style={{ justifyContent: "flex-start" }}>
              <ArrowLeft
                onClick={() => navigate(SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE)}
                style={{ cursor: "pointer" }}
              />
              <h1>{edit ? "Edit" : "Create"} Question Bank Form</h1>
            </div>
            <div className="title_card" style={{ justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  navigate("/");
                }}
                variant={"light-blue-btn"}
                sx={{
                  width: "150px",
                  height: "42px",
                  textTransform: "unset",
                }}
                style={{ padding: "0px" }}
              >
                {<UploadIcon />}Upload NOS
              </Button>
              <Button
                onClick={() => {
                  navigate(SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE);
                }}
                variant={"light-blue-btn"}
                sx={{
                  width: "150px",
                  height: "42px",
                  textTransform: "unset",
                  padding: "0px",
                }}
                style={{ padding: "0px" }}
              >
                {<ListIcon />}View List
              </Button>
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
                  {/* ============Form Starts here ========= */}
                  <form>
                    <div className="inputFeilds">
                      <div className="form_title">
                        <h1>Question Bank Form</h1>
                      </div>
                      <div className="duo_inputBox">
                        <div className="form-group">
                          <Input
                            label="Question Bank"
                            name="questionBankName"
                            placeholder="Enter Question Bank Name"
                            onFocus={focusHandler}
                            error={errors?.questionBankName}
                            onBlur={blurHandler}
                            disabled={edit ? true : false}
                            onChange={changeHandler}
                            value={formValues?.questionBankName}
                            mandatory
                          />
                        </div>
                        <div className="form-group">
                          <div className="select_md">
                            <SelectInput
                              name="questionType"
                              disabled={edit ? true : false}
                              label="Question Type"
                              placeHolder="Select Question Type"
                              value={formValues?.questionType}
                              handleChange={changeHandler}
                              options={QUESTION_TYPES}
                              error={errors?.questionType}
                              mandatory
                            />
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
                            error={errors?.jobRole}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.jobRole}
                            mandatory
                          />
                        </div>
                      </div>

                      <div className="duo_inputBox">
                        <div className="form-group">
                          <Input
                            label="Job Level"
                            type={"text"}
                            name="jobLevel"
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                            placeholder="Enter Job Level"
                            onFocus={focusHandler}
                            error={errors?.jobLevel}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.jobLevel}
                            mandatory
                          />
                        </div>
                        <div className="form-group">
                          <Input
                            label="Code"
                            disabled={edit ? true : false}
                            type={"text"}
                            name="code"
                            placeholder="Enter the code"
                            onFocus={focusHandler}
                            error={errors?.code}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.code}
                            mandatory
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="input_lg">
                          <div className="form-group">
                            <Input
                              label="Sector"
                              type={"text"}
                              name="sector"
                              placeholder="Enter your sector"
                              onFocus={focusHandler}
                              error={errors?.sector}
                              onBlur={blurHandler}
                              onChange={changeHandler}
                              value={formValues?.sector}
                              // mandatory
                            />
                          </div>
                        </div>
                      </div>

                      <div className="duo_inputBox">
                        <div className="form-group">
                          <Input
                            label="Sub Sector"
                            type={"text"}
                            name="subSector"
                            placeholder="Enter your Sub Sector"
                            onFocus={focusHandler}
                            error={errors?.subSector}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.subSector}
                            // mandatory
                          />
                        </div>

                        <div className="form-group">
                          <Input
                            label="Sector Code"
                            name="sectorCode"
                            type={"number"}
                            hideExponants={true}
                            placeholder="Enter Sector Code"
                            onFocus={focusHandler}
                            error={errors?.sectorCode}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.sectorCode}
                            // mandatory
                          />
                        </div>
                      </div>

                      <div className="duo_inputBox">
                        <div className="form-group">
                          <Input
                            label="Scheme"
                            name="schemeName"
                            placeholder="Enter Scheme Name"
                            onFocus={focusHandler}
                            error={errors?.schemeName}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.schemeName}
                          />
                        </div>
                        <div className="form-group">
                          <Input
                            label="Scheme Code"
                            name="schemeCode"
                            placeholder="Enter Scheme Code"
                            onFocus={focusHandler}
                            error={errors?.schemeCode}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.schemeCode}
                          />
                        </div>
                      </div>

                      <div className="duo_inputBox">
                        <div className="form-group">
                          <Input
                            label="NOS Name"
                            name="nos"
                            placeholder="Enter NOS Name"
                            onFocus={focusHandler}
                            error={errors?.nos}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.nos}
                            mandatory
                          />
                        </div>
                        <div className="form-group">
                          <Input
                            label="NOS Code"
                            name="nosCode"
                            placeholder="Enter NOS Code"
                            onFocus={focusHandler}
                            error={errors?.nosCode}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.nosCode}
                            mandatory
                          />
                        </div>
                      </div>

                      <div className="duo_inputBox">
                        <div className="form-group">
                          <Input
                            label="Theory Marks"
                            name="theoryMarks"
                            type={"number"}
                            placeholder="Enter Theory Marks"
                            hideExponants={true}
                            onFocus={focusHandler}
                            error={errors?.theoryMarks}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.theoryMarks}
                            mandatory
                          />
                        </div>
                        <div className="form-group">
                          <Input
                            label="Practical Marks"
                            name="practicalMarks"
                            placeholder="Enter Practical Marks"
                            type={"number"}
                            hideExponants={true}
                            onFocus={focusHandler}
                            error={errors?.practicalMarks}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.practicalMarks}
                            mandatory
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="select_md">
                          <SelectInput
                            name="status"
                            label="Status"
                            placeHolder="Status"
                            value={formValues?.status}
                            handleChange={(e) => {
                              changeHandler(e);
                            }}
                            options={STATUS}
                            error={errors?.status}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
          <section className="buttonsBox">
            <div className="action-btn-box">
              <div className="action-btn-card">
                <Button
                  className={`outlined-btn submit-btn`}
                  variant="outlined"
                  onClick={clearFormValues}
                  disabled={loading ? true : false}
                >
                  Cancel
                </Button>
                <Button
                  className={`outlined-btn submit-btn`}
                  variant="outlined"
                  onClick={() => navigate(SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE)}
                  disabled={loading ? true : false}
                >
                  Back
                </Button>
                <Button
                  className={`light-blue-btn submit-btn`}
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading ? true : false}
                >
                  {loading ? <PulseLoader size="10px" color="white" /> : "Save"}
                </Button>
              </div>
              <div className="action-btn-card">
                <div className="action_btn_lg">
                  <Button
                    className={`light-blue-btn submit-btn`}
                    onClick={handleSaveAndNext}
                    disabled={loading ? true : false}
                  >
                    {loading ? <PulseLoader size="10px" color="white" /> : "Save and Next"}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default CreateQuestionForm;
