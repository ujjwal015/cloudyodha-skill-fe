import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "../style.css";
import { Button } from "@mui/material";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { ReactComponent as ArrowLeft } from "../../../../../assets/images/pages/clientManagement/arrow-left.svg";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../../utils/validation/superAdmin/assessment"
import SelectInput from "../../../../../components/common/SelectInput";
import Input from "../../../../../components/common/input";
import { createAssessmentApi, getJobroleListApi, updateAssessmentApi } from "../../../../../api/superAdminApi/assessment";
import { STATUS, SECTOR } from "../../../../../config/constants/projectConstant";
import { SUPER_ADMIN_ASSESSMENT_LIST_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { assessmentSelector } from "../../../../../redux/slicers/superAdmin/assessmentSlice";

const initialFormValues = {
  assessmentName: "",
  assessmentCode: "",
  totalMarks: "",
  passingPercentage: "",
  jobRole: "",
  scheme: "",
  status: "",
  createdBy: ""
};

const CreateAssessment = ({ setActiveStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobRoleList = [], schemeList = [] } = useSelector(assessmentSelector);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState("");
  const { userInfo = {} } = useSelector(authSelector);
  const { _id } = userInfo;
  const params = useParams();

  useEffect(() => {
    setFormValues((pre) => ({ ...pre, createdBy: _id }))
    dispatch(getJobroleListApi(setLoading))
    setActiveStep(0)
  }, [])

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
      if (params?.assessmentId) {
        dispatch(updateAssessmentApi(setLoading, params?.assessmentId, formValues, navigate))
      }
      else dispatch(createAssessmentApi(formValues, setLoading, clearFormValues, navigate));
    }
  };

  return (
    <div className="main-container assessment-page">
      <div className="title">
        <div className="title-text">
          <ArrowLeft
            onClick={() => navigate(SUPER_ADMIN_ASSESSMENT_LIST_PAGE)}
          />
          <h1> {params?.assessmentId ? "Edit" : "Create New"} Assessment</h1>
        </div>
        <div className="view-list-btn">
          <button
            className="view-list-btn-text"
            onClick={() => navigate(SUPER_ADMIN_ASSESSMENT_LIST_PAGE)}
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
              {/* ============Form Starts here ========= */}
              <form>
                <div className="inputFeilds">
                  <div className="duo_inputBox">
                    <div className="form-group">
                      <Input
                        label="Assessment Name "
                        name="assessmentName"
                        placeholder="Enter Assessment Name"
                        onFocus={focusHandler}
                        error={errors?.assessmentName}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.assessmentName}
                        mandatory
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        label="Assessment Code"
                        name="assessmentCode"
                        type={"number"}
                        hideExponants={true}
                        placeholder="Enter Assessment Code"
                        onFocus={focusHandler}
                        error={errors?.assessmentCode}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.assessmentCode}
                        mandatory
                      />
                    </div>
                  </div>

                  <div className="duo_inputBox">
                    <div className="form-group">
                      <Input
                        label="Total Marks "
                        name="totalMarks"
                        type={"number"}
                        hideExponants={true}
                        placeholder="Enter Total  Marks "
                        onFocus={focusHandler}
                        error={errors?.totalMarks}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.totalMarks}
                        mandatory
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        label="Passing Percentage"
                        name="passingPercentage"
                        type={"number"}
                        hideExponants={true}
                        placeholder="Enter Passing Percentage"
                        onFocus={focusHandler}
                        error={errors?.passingPercentage}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.passingPercentage}
                        mandatory
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input_lg">
                      <div className="input_select">
                        <SelectInput
                          name="jobRole"
                          label="Job Role"
                          placeHolder="Select Job Role"
                          value={formValues?.jobRole}
                          handleChange={changeHandler}
                          options={jobRoleList}
                          error={errors?.jobRole}
                          mandatory
                        />
                      </div>
                    </div>
                  </div>

                  <div className="duo_inputBox">
                    <div className="form-group">
                      <div className="select_md">
                        <div className="input_select">
                          <SelectInput
                            name="scheme"
                            label="Scheme"
                            placeHolder="Select Scheme"
                            value={formValues?.scheme}
                            handleChange={changeHandler}
                            options={schemeList}
                            error={errors?.scheme}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="select_md">
                        <div className="input_select">
                          <SelectInput
                            name="status"
                            label="Status"
                            placeHolder="Select Status"
                            value={formValues?.status}
                            handleChange={changeHandler}
                            options={STATUS}
                            error={errors?.status}
                            mandatory
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="buttonsBox">
        <div className="action-btn">
          <div
            className="action-btn-card"
          >
            <Button
              className={`outlined-btn back-btn`}
              variant="outlined"
              onClick={() => navigate(SUPER_ADMIN_ASSESSMENT_LIST_PAGE)}
            >
              Back
            </Button>
            {params?.assessmentId ? (
              <Button
                className={`light-blue-btn submit-btn`}
                variant="contained"
                onClick={handleSubmit}
                disabled={loading ? true : false}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "Update"}
              </Button>
            ) : (
              <Button
                className={`light-blue-btn submit-btn`}
                variant="contained"
                onClick={handleSubmit}
                disabled={loading ? true : false}
              >
                {loading ? (
                  <PulseLoader size="10px" color="white" />
                ) : (
                  "Next Step"
                )}
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateAssessment;
