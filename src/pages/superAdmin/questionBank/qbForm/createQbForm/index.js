import { useCallback, useState } from "react";
import "../../../userManagement/users/users.style.css";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import validateField from "../../../../../utils/validateField";
import { ReactComponent as ArrowLeft } from "../../../../../assets/icons/chevron-left.svg";
import {
  SECTIONS2,
  SECTIONS,
  LANGUAGE,
  QUESTION_TYPES,
  QUESTION_TYPES2,
} from "../../../../../config/constants/projectConstant";
import Input from "../../../../../components/common/input";
import {
  createQbFormApi,
  getAllNosListApi,
  createQbFormAndNextApi,
  getNosListSectionWiseApi,
} from "../../../../../api/superAdminApi/questionBank";
import SelectInput from "../../../../../components/common/SelectInput";
import { clientManagementSelector } from "../../../../../redux/slicers/superAdmin/clientManagement";
import { useEffect } from "react";
import { FadeLoader, RotateLoader } from "react-spinners";
import { getAllJobRoles } from "../../../../../api/superAdminApi/jobRoleManagement";
import {
  SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE,
  SUPER_ADMIN_QUESTION,
  SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import SubmitButton from "../../../../../components/SubmitButton";
import { qbManagementSelector } from "../../../../../redux/slicers/superAdmin/questionBankSlice";
import {
  ALPHABETIC_SORT,
  capitalizeFirstLetter,
} from "../../../../../utils/projectHelper";
import AutoCompleteAsyncInput from "../../../../../components/common/AutoCompleteAsyncInput";

export default function CreateQuestionForm() {
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

  // useEffect(() => {
  //   if (formValues?.section === "Theory") {
  //     setFormValues({ ...formValues, questionType: "objective", nos: "" });
  //   } else if (formValues?.section === "viva") {
  //     setFormValues({
  //       ...formValues,
  //       questionType: "oral questioning",
  //       nos: "",
  //     });
  //   } else if (formValues?.section === "practical") {
  //     setFormValues({ ...formValues, questionType: "demonstrating", nos: "" });
  //   }
  // }, [formValues?.section, formValues?.jobRole]);

  const getClientList = () => {
    setLoading(true);
    dispatch(getAllJobRoles(setLoading, 1, Infinity, "", "", ""));
    dispatch(getAllNosListApi(setLoading, 1, "", Infinity, ""));
  };
  useEffect(() => {
    const { jobRole, section } = formValues;
    if (jobRole && section) {
      setLoading(true);
      dispatch(getNosListSectionWiseApi(setLoading, jobRole, section));

      if (section === "Theory") {
        setFormValues({
          ...formValues,
          questionType: "objective",
          jobLevel: "",
          version: "",
          language: "",
        });
      } else if (section === "viva") {
        setFormValues({
          ...formValues,
          questionType: "oral questioning",
          jobLevel: "",
          version: "",
          language: "",
        });
      } else if (section === "practical") {
        setFormValues({
          ...formValues,
          questionType: "demonstrating",
          jobLevel: "",
          version: "",
          language: "",
        });
      }
    } else {
      setFormValues({
        ...formValues,
        nos: "",
      });
    }
  }, [formValues?.jobRole, formValues?.section]);

  useEffect(() => {
    getClientList();
  }, []);
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

  const modifiedJobRoleList = jobRolesListAll?.map((item) => {
    return {
      label: item?.jobRole,
      value: item?._id,
    };
  });

  const getQpCode = () => {
    const selectedJobRole = jobRolesListAll?.find(
      (jobRole) => jobRole?._id === formValues?.jobRole ?? " "
    );
    if (selectedJobRole) {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        qpCode: selectedJobRole?.qpCode,
      }));
      return selectedJobRole?.qpCode;
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        jobRole: "",
        qpCode: "",
      }));
      return "";
    }
  };

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
    getQpCode();
  }, [formValues?.jobRole]);
  useEffect(() => {
    formValues?.nos !== "" && getJobLevel();
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

  const saveAndNextHandle = (e) => {
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

    let nosID2;
    sectionWiseNos?.forEach((item) => {
      item?.nosData?.forEach((nosData) => {
        if (formValues?.nos === nosData.NOS) {
          nosID2 = nosData?._id;
          return;
        }
      });
      if (nosID2) return;
    });

    formValues["nosId"] = nosID2;
    const jobRoleName = jobRolesListAll?.find(
      (item) => item._id === formValues.jobRole
    );
    const data = {
      ...formValues,
      jobRole: jobRoleName?._id,
    };

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      dispatch(
        createQbFormAndNextApi(
          data,
          setLoading,
          clearFormValues,
          navigate,
          formValues?.section
        )
      );
    }
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
      let nosID2;
      sectionWiseNos?.forEach((item) => {
        item?.nosData?.forEach((nosData) => {
          if (formValues?.nos === nosData.NOS) {
            nosID2 = nosData?._id;
            return;
          }
        });
        if (nosID2) return;
      });

      formValues["nosId"] = nosID2;

      const jobRoleName = jobRolesListAll?.find(
        (item) => item._id === formValues.jobRole
      );
      const data = {
        ...formValues,
        jobRole: jobRoleName?._id,
      };
      // console.log("submit->", data);
      setLoading(true);
      dispatch(createQbFormApi(data, setLoading, clearFormValues, navigate));
    }
  };

  return (
    <div className="main-content">
      {loading ? (
        <div className="loader_container">
          <FadeLoader color="#2ea8db" />
        </div>
      ) : (
        <>
          <div className="title">
            <h1>
              <ArrowLeft
                onClick={() => navigate(SUPER_ADMIN_QUESTION_FORM_LIST_PAGE)}/>
              <span>Create Question Bank</span>
            </h1>
          </div>
          <section className="sub-admin-wrapper">
            <div className="tab-content">
              <div className="edit-profile" style={{ display: "block" }}>
                <div className="form-label">
                  <label> Question Bank Form</label>
                </div>
                <div className="form-wrapper">
                  <div className="flex-form">
                    <div className="form-group-full">
                      <AutoCompleteAsyncInput
                        name="jobRole"
                        label="Job Role"
                        value={formValues?.jobRole}
                        onchange={changeHandler}
                        setter={setFormValues}
                        optionLists={ALPHABETIC_SORT(modifiedJobRoleList)}
                        error={errors?.jobRole}
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
                        mandatory
                      />
                    </div>
                    <div className="form-group-full">
                      <SelectInput
                        label="NOS"
                        name="nos"
                        placeHolder="Select nos name"
                        options={nosLists}
                        value={formValues?.nos}
                        handleChange={changeHandler}
                        error={errors?.nos}
                        mandatory
                        loading={loading}
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
                        disabled={formValues?.jobLevel !== "" ? true : false}
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
                        disabled={formValues?.version !== "" ? true : false}
                        mandatory
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
                        disabled={formValues?.section !== "" ? true : false}
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
                        disabled={formValues?.language !== "" ? true : false}
                        handleChange={changeHandler}
                        error={errors?.language}
                        mandatory
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <SubmitButton
            cancelBtnText="Back"
            submitBtnText="Save"
            saveAndNextBtnText="Save & Next"
            handleSubmit={handleSubmit}
            clearFormValues={clearFormValues}
            navigate={navigate}
            loading={loading}
            showSaveAndNextBtn={true}
            saveAndNextHandler={saveAndNextHandle}
          />
        </>
      )}
    </div>
  );
}
