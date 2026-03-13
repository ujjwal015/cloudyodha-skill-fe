import { useCallback, useState } from "react";
import "../../../userManagement/users/users.style.css";
import "../createQbForm/style.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import validateField from "../../../../../utils/validateField";
import { ReactComponent as ArrowLeft } from "../../../../../assets/icons/chevron-left.svg";
import {
  QUESTION_TYPES,
  LANGUAGE,
  SECTIONS2,
} from "../../../../../config/constants/projectConstant";
import Input from "../../../../../components/common/input";
import {
  updateSingleQbFormApi,
  getSingleQbFormApi,
  getAllNosListApi,
  getNosListSectionWiseApi,
} from "../../../../../api/superAdminApi/questionBank";
import SelectInput from "../../../../../components/common/SelectInput";
import { clientManagementSelector } from "../../../../../redux/slicers/superAdmin/clientManagement";
import { useEffect } from "react";
import { FadeLoader, RotateLoader } from "react-spinners";
import { getAllJobRoles } from "../../../../../api/superAdminApi/jobRoleManagement";
import { SUPER_ADMIN_QUESTION_FORM_LIST_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import SubmitButton from "../../../../../components/SubmitButton";
import { qbManagementSelector } from "../../../../../redux/slicers/superAdmin/questionBankSlice";
import { ALPHABETIC_SORT } from "../../../../../utils/projectHelper";

export default function EditQuestionForm() {
  const initialFormValues = {
    jobRole: "",
    qpCode: "",
    jobLevel: "",
    version: "",
    section: "",
    nos: "",
    questionType: "",
    language: "",
  };

  const { formId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [formValues, setFormValues] = useState(initialFormValues);
  const { jobRolesListAll = [] } = useSelector(clientManagementSelector);

  const { sectionWiseNos = [] } = useSelector(qbManagementSelector);
  const nosLists = [];
  let nosId = "";
  sectionWiseNos?.forEach((item) => {
    item?.nosData?.forEach((nosData) => {
      nosId = nosData?._id;
      nosLists?.push({ label: nosData.NOS, value: nosData.NOS });
    });
  });

  const getClientList = () => {
    setLoading(true);
    dispatch(getSingleQbFormApi(setLoading, setFormValues, formId));
    dispatch(getAllJobRoles(setLoading, "", Infinity, "", "", ""));
    dispatch(getAllNosListApi(setLoading, 1, "", 10, ""));
  };
  useEffect(() => {
    getClientList();
  }, []);

  useEffect(() => {
    if (formValues?.jobRole !== "" && jobRolesListAll.length > 0) {
      const { jobRole, section } = formValues;
      const jbID = jobRolesListAll.find(
        (el) => jobRole === el?._id || el?.jobRole
      );
      dispatch(getNosListSectionWiseApi(setLoading, jbID?._id, section));
    }
  }, [formValues?.jobRole, jobRolesListAll.length]);

  const changeHandler = useCallback(
    (event) => {
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
    },
    [formValues]
  );

  const modifiedJobRoleList = jobRolesListAll?.map((item) => ({
    label: item?.jobRole,
    value: item?.jobRole,
  }));

  const getJobLevel = () => {
    const targetNosData = sectionWiseNos
      ?.find((el) => {
        return el?.nosData.find((nosData) => nosData?.NOS === formValues?.nos);
      })
      .nosData.find((nosData) => nosData?.NOS === formValues?.nos);

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      jobLevel: targetNosData?.level,
      version: targetNosData?.version,
      language: targetNosData?.language.toLowerCase(),
    }));
  };

  useEffect(() => {
    formValues?.nos !== "" && sectionWiseNos.length > 0 && getJobLevel();
  }, [formValues?.nos]);

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
    navigate(SUPER_ADMIN_QUESTION_FORM_LIST_PAGE);
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
      formValues["nosId"] = nosId;
      const formValuesWithId = {
        ...formValues,
        _id: formId,
      };
      const jobRoleName = jobRolesListAll?.find(
        (item) => item.jobRole === formValues.jobRole
      );

      const data = {
        ...formValuesWithId,
        jobRole: jobRoleName?._id,
      };

      setLoading(true);
      dispatch(
        updateSingleQbFormApi(setLoading, data, clearFormValues, navigate)
      );
    }
  };
  return (
    <div className="main-content">
      {loading ? (
        <div className="loader_container">
          {/* <RotateLoader size={50} margin={100} color="#2ea8db" /> */}
          <FadeLoader color="#2ea8db" />
        </div>
      ) : (
        <>
          <div className="title">
            <h1>
              <ArrowLeft onClick={() => navigate(-1)} />
              <span>Edit Question Bank</span>
            </h1>
          </div>
          <section className="sub-admin-wrapper">
            <div className="tab-content">
              <div className="edit-profile" style={{ display: "block" }}>
                <div className="form-label">
                  <label>Question Bank Form</label>
                </div>
                <div className="form-wrapper">
                  <div className="flex-form">
                    <div className="form-group-full">
                      <SelectInput
                        name="jobRole"
                        label="Job Role"
                        placeHolder="Select job role"
                        options={ALPHABETIC_SORT(modifiedJobRoleList)}
                        value={formValues?.jobRole}
                        handleChange={changeHandler}
                        error={errors?.jobRole}
                        disabled={true}
                        mandatory
                      />
                    </div>
                    <div className="form-group">
                      <SelectInput
                        label="Section"
                        name="section"
                        placeHolder="Select section"
                        options={SECTIONS2}
                        value={formValues?.section}
                        handleChange={changeHandler}
                        error={errors?.section}
                        disabled={true}
                        mandatory
                      />
                    </div>
                    <div className="form-group-full">
                      {/* <SelectInput
                        label="NOS"
                        name="nos"
                        placeHolder="Select nos name"
                        options={nosLists}
                        value={formValues?.nos}
                        handleChange={changeHandler}
                        error={errors?.nos}
                        disabled={true}
                        mandatory
                      /> */}
                      <Input
                        label="NOS"
                        type="text"
                        name="nos"
                        placeholder="Select nos name"
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        error={errors?.qpCode}
                        disabled={true}
                        onFocus={focusHandler}
                        value={formValues?.nos}
                        mandatory
                      />
                    </div>

                    <div className="form-group">
                      <Input
                        label="QP Code"
                        type="text"
                        name="qpCode"
                        placeholder="Enter qp code"
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        error={errors?.qpCode}
                        disabled={true}
                        onFocus={focusHandler}
                        value={formValues?.qpCode}
                        mandatory
                      />
                    </div>

                    <div className="form-group">
                      <Input
                        label="Job Level"
                        type="number"
                        name="jobLevel"
                        placeholder="Enter job role level"
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        error={errors?.jobLevel}
                        onFocus={focusHandler}
                        value={formValues?.jobLevel}
                        disabled={true}
                        mandatory
                        hideExponants
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        label="Version"
                        type="text"
                        name="version"
                        placeholder="Enter version"
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        error={errors?.version}
                        onFocus={focusHandler}
                        value={formValues?.version}
                        disabled={true}
                        mandatory
                        hideExponants
                      />
                    </div>
                    <div className="form-group">
                      <SelectInput
                        label="Question Type"
                        name="questionType"
                        placeHolder="Select question type"
                        options={QUESTION_TYPES}
                        value={formValues?.questionType}
                        handleChange={changeHandler}
                        error={errors?.questionType}
                        disabled={true}
                        // disabled={formValues?.section === 'Theory' ? true : false}
                        mandatory
                      />
                    </div>
                    <div className="form-group">
                      <SelectInput
                        label="Language"
                        name="language"
                        placeHolder="Select language"
                        options={LANGUAGE}
                        value={formValues?.language}
                        handleChange={changeHandler}
                        error={errors?.language}
                        disabled={true}
                        mandatory
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <SubmitButton
            cancelBtnText="Back"
            submitBtnText="Save"
            saveAndNextBtnText="Save and Next"
            handleSubmit={handleSubmit}
            clearFormValues={clearFormValues}
            navigate={navigate}
            loading={loading}
          /> */}
        </>
      )}
    </div>
  );
}
