import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
} from "@mui/material";
import { ReactComponent as ProctorIcon } from "../../../../../assets/images/pages/examManagement/proctor-eye.svg";
import validateField from "../../../../../utils/validation/superAdmin/examManagement";
import SelectInput from "../../../../../components/common/SelectInput";
import {
  LANGUAGE,
  QUESTIONTYPES,
} from "../../../../../config/constants/projectConstant";

import Input, { RadioButton } from "../../../../../components/common/input";
import { ASSESSMENTSTATUS, groupItems, yesNo } from "../data";
import {
  examManagementSelector,
  getJobRoleLevelVersion,
  getJobRoleVersion,
} from "../../../../../redux/slicers/superAdmin/examManagementSlice";
import {
  getJobRoleWithClientIDApi,
  getLevelAndVersionApi,
  getLevelandVersionofJobRoleApi,
  getMultipleLanguageDeciderApi,
} from "../../../../../api/superAdminApi/examManagement";
import ViewNOSModal from "./ViewNOSModal";
import {
  ALPHABETIC_SORT,
  ExamConductLanguages,
} from "../../../../../utils/projectHelper";
import AutoCompleteAsyncInput from "../../../../../components/common/AutoCompleteAsyncInput";
import MultiJobRoleTable from "./MultiJobRoleTable";

const QuestionPaper = (props) => {
  const { formValues, setFormValues, errors, setErrors, isOnline } = props;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [jobRoleLoading, setJobRoleLoading] = useState(false);
  const [modifiedNOSData, setModifiedNOSData] = useState([]);

  const {
    jobRoleList2 = [],
    qbCodeList = [],
    bankQBcodeList = [],
    chooseInstructions = [],
    jobRoleLevel = [],
    jobRoleVersion = [],
    jobRoleNOS = [],
    allJobRoleData = [],
    isMultiLanguageEnabled = false,
    clientSpecificJobRole = [],
  } = useSelector(examManagementSelector);

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  useEffect(() => {
    if (jobRoleNOS?.[formValues?.jobRole]?.length > 0) {
      const collectNos = new Array();
      jobRoleNOS?.[formValues?.jobRole].map((el) => {
        el?.nosData.map((el2) => {
          collectNos.push(el2);
        });
      });

      setModifiedNOSData([...collectNos]);
    }
  }, [jobRoleNOS?.[formValues?.jobRole]]);

  const handleChange = (event, sectionName) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;

    // Validate the field.
    // const fieldError = validateField(name, fieldValue, null, null);

    if (name === "sectionName") {
      setErrors((prev) => {
        const { sectionTable, ...rest } = prev;
        return rest;
      });
    }
    if (name === "examLanguageConduct") {
      setErrors((prevErrors) => {
        // If examLanguageConduct is false, clear any errors for secondaryLanguage
        if (fieldValue === "false") {
          const { secondaryLanguage, ...rest } = prevErrors;
          return rest;
        } else {
          // If examLanguageConduct is true, clear the error for secondaryLanguage
          return {
            ...prevErrors,
            secondaryLanguage: undefined, // Clear error
          };
        }
      });
    } else {
      // Validate the field unless it's secondaryLanguage and examLanguageConduct is false
      if (
        name !== "secondaryLanguage" ||
        formValues.examLanguageConduct === "true"
      ) {
        const fieldError = validateField(name, fieldValue);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: fieldError || undefined,
        }));
      } else if (
        name === "secondaryLanguage" &&
        formValues.examLanguageConduct === "false"
      ) {
        setErrors((prevErrors) => {
          const { [name]: removedError, ...rest } = prevErrors;
          return rest;
        });
      }
    }
    // Handle the form values update.
    if (["sectionName", "sectionOrder", "examDuration"].includes(name)) {
      setFormValues((prev) => ({
        ...prev,
        sectionTable: prev.sectionTable.map((item) => {
          if (name === "sectionName") {
            return item.sectionName === value
              ? {
                  ...item,
                  isSelected: !item.isSelected,
                  examDuration: item.isSelected ? null : item.examDuration,
                  sectionOrder: item.isSelected ? null : item.sectionOrder,
                }
              : { ...item };
          } else {
            return item.sectionName === sectionName
              ? { ...item, [name]: fieldValue }
              : { ...item };
          }
        }),
      }));
    } else if (name === "examLanguageConduct") {
      setFormValues((prev) => ({
        ...prev,
        [name]: fieldValue,
        secondaryLanguage: fieldValue === "true" ? prev.secondaryLanguage : "", // Reset secondary language if examLanguageConduct is false
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
    }
    if (name === "multipleJobRole") {
      console.log("fieldValues", fieldValue);
      // setFormValues((prev)=>({...prev,multipleJobRole:[...prev?.multipleJobRole,fieldValue]}))
    }
  };

  useEffect(() => {
    if (formValues.jobRole) {
      setFormValues((prev) => {
        const jobRoleId = jobRoleList2?.find(
          (job) => job?.value === formValues?.jobRole
        )?.value;
        dispatch(getLevelandVersionofJobRoleApi(setJobRoleLoading, jobRoleId));
        const qpCode = qbCodeList?.find(
          (item) => item.value === jobRoleId || item._id === jobRoleId
        )?.value;
        return {
          ...prev,
          qpCode: qpCode,
        };
      });

      setErrors((prevErrors) => {
        const { ["qpCode"]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
    // setFormValues((pre) => ({
    //   ...pre,
    //   level: "",
    //   version: ""
    // }))
  }, [formValues.jobRole]);

  // call api to get job levels in case multiple job role
  useEffect(() => {
    if (formValues.multipleJobRole?.length > 0) {
      setErrors((prevState) => {
        return {
          ...prevState,
          multipleJobRole: "",
        };
      });
      const jobRoleId =
        formValues.multipleJobRole[formValues.multipleJobRole?.length - 1]
          ?.jobRoleId;
      dispatch(getLevelandVersionofJobRoleApi(setJobRoleLoading, jobRoleId));
    }
  }, [formValues.multipleJobRole?.length]);

  useEffect(() => {
    if (
      formValues?.isMultiJobRole === "true" &&
      formValues?.multipleJobRole?.length === 1
    ) {
      const clientId = allJobRoleData?.find(
        (job) =>
          job?._id ===
          formValues.multipleJobRole[formValues?.multipleJobRole?.length - 1]
            ?.jobRoleId
      )?.clientId;
      setLoading(true);
      dispatch(getJobRoleWithClientIDApi(clientId, setLoading));
    }
  }, [formValues.multipleJobRole?.length]);

  useEffect(() => {
    setFormValues((preVal) => ({
      ...preVal,
      multipleJobRole: [],
      jobRole: "",
    }));
  }, [formValues?.isMultiJobRole]);

  useEffect(() => {
    setFormValues((prev) => {
      let temp = [...prev.sectionTable];
      temp[0].isSelected = true;
      temp[0].sectionOrder = 1;
      temp[1].isSelected = false;
      temp[2].isSelected = false;
      return {
        ...prev,
        sectionTable: temp,
      };
    });
  }, [formValues?.isMultiJobRole]);

  // for select Level
  useEffect(() => {
    if (formValues.level) {
      const jobRoleId = jobRoleList2?.find(
        (job) => job.value === formValues.jobRole
      )?.value;

      dispatch(getLevelAndVersionApi(jobRoleId, formValues.level));
      setFormValues((pre) => ({
        ...pre,
        version: "",
      }));
    }
  }, [formValues.level]);

  // decide multi language enable or not

  useEffect(() => {
    if (formValues?.level && formValues?.version) {
      dispatch(
        getMultipleLanguageDeciderApi(
          setLoading,
          formValues?.jobRole,
          formValues?.level,
          formValues?.version
        )
      );
    }
  }, [formValues?.level, formValues?.version]);

  return (
    <>
      <section className="sub-admin-wrapper question-paper">
        <div className="tab-content">
          <div className="form-title">
            <h1>Question Paper</h1>
            <ProctorIcon />
          </div>
          <div className="form-wrapper">
            <div className="form">
              {/* ============ Form Starts here ========= */}
              <form
                style={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                {isOnline && (
                  <>
                    <div
                      className="form-group"
                      style={{ width: "calc(33.33% - 10px)" }}
                    >
                      <RadioButton
                        handleChange={handleChange}
                        options={yesNo}
                        name="markForReview"
                        label="Mark for Review"
                        value={formValues?.markForReview}
                        error={errors?.markForReview}
                        mandatory
                      />
                    </div>
                    <div
                      className="form-group"
                      style={{ width: "calc(33.33% - 10px)" }}
                    >
                      <RadioButton
                        handleChange={handleChange}
                        options={groupItems}
                        name="questionNavigation"
                        label="Question Navigation"
                        value={formValues?.questionNavigation}
                        error={errors?.questionNavigation}
                        mandatory
                      />
                    </div>
                    <div
                      className="form-group"
                      style={{ width: "calc(33.33% - 10px)" }}
                    >
                      <RadioButton
                        handleChange={handleChange}
                        options={yesNo}
                        name="paginationStatus"
                        label="Pagination Status"
                        value={formValues?.paginationStatus}
                        error={errors?.paginationStatus}
                        mandatory
                      />
                    </div>
                    <div
                      className="form-group"
                      style={{ width: "calc(33.33% - 10px)" }}
                    >
                      <RadioButton
                        handleChange={handleChange}
                        options={yesNo}
                        name="isMultiJobRole"
                        label="Multi-select Jobrole"
                        value={formValues?.isMultiJobRole}
                        error={errors?.isMultiJobRole}
                        mandatory
                      />
                    </div>
                    <div
                      className="form-group"
                      style={{ width: "calc(33.33% - 10px)" }}
                    >
                      <RadioButton
                        handleChange={handleChange}
                        options={yesNo}
                        name="colorAndTTSEnabled"
                        label="Color contrast and TTS Enabled"
                        value={formValues?.colorAndTTSEnabled}
                        error={errors?.colorAndTTSEnabled}
                        mandatory
                      />
                    </div>
                  </>
                )}

                <div
                  className="form-group"
                  style={{
                    width:
                      formValues?.isMultiJobRole === "true"
                        ? "calc(100%)"
                        : "calc(33.33% - 10px)",
                  }}
                >
                  <AutoCompleteAsyncInput
                    name={
                      formValues?.isMultiJobRole === "true"
                        ? "multipleJobRole"
                        : "jobRole"
                    }
                    label="Job Role"
                    value={
                      formValues?.isMultiJobRole === "true"
                        ? formValues?.multipleJobRole
                        : formValues?.jobRole
                    }
                    onchange={handleChange}
                    setter={setFormValues}
                    optionLists={
                      formValues?.isMultiJobRole === "true" &&
                      formValues?.multipleJobRole?.length > 0
                        ? ALPHABETIC_SORT(clientSpecificJobRole)
                        : ALPHABETIC_SORT(jobRoleList2)
                    }
                    error={
                      formValues?.isMultiJobRole === "true"
                        ? errors?.multipleJobRole
                        : errors?.jobRole
                    }
                    mandatory
                    qpCodeList={qbCodeList}
                    enableMultiSelect={
                      formValues?.isMultiJobRole === "true" ? true : false
                    }
                  />

                  {jobRoleNOS?.[formValues?.jobRole]?.length > 1 && (
                    <ViewNOSModal
                      data={modifiedNOSData}
                      jobRoleName={
                        jobRoleList2?.find(
                          (job) => job.value === formValues.jobRole
                        )?.label
                      }
                    />
                  )}
                </div>

                {formValues?.isMultiJobRole === "true" && isOnline && (
                  <MultiJobRoleTable
                    jobRoleList={formValues?.multipleJobRole}
                    setter={setFormValues}
                    name={"multipleJobRole"}
                    jobRoleLoading={jobRoleLoading}
                    // jobRoleLevels={jobRoleLevel}
                    // jobRoleVersions={jobRoleVersion}
                    errors={errors}
                    setErrors={setErrors}
                    formValues={formValues}
                  />
                )}
                {formValues?.isMultiJobRole === "false" && (
                  <div
                    className="form-group"
                    style={{ width: "calc(33.33% - 10px)" }}
                  >
                    <SelectInput
                      name="qpCode"
                      label="QP Code"
                      placeHolder="Select QP Code"
                      value={formValues?.qpCode}
                      handleChange={handleChange}
                      options={qbCodeList}
                      error={errors?.qpCode}
                      disabled={true}
                      mandatory
                    />
                  </div>
                )}
                {formValues?.isMultiJobRole === "false" && (
                  <div
                    className="form-group"
                    style={{ width: "calc(33.33% - 10px)" }}
                  >
                    <SelectInput
                      name="level"
                      label="Level"
                      placeHolder="Select Level"
                      value={formValues?.level}
                      handleChange={handleChange}
                      options={jobRoleLevel || []}
                      error={errors?.level}
                      mandatory
                      // disabled={jobRoleLevel?.length < 1}
                      disabled={jobRoleLevel?.length === 0}
                      loading={jobRoleLoading}
                    />
                  </div>
                )}
                {formValues?.isMultiJobRole === "false" && (
                  <div
                    className="form-group"
                    style={{ width: "calc(33.33% - 10px)" }}
                  >
                    <SelectInput
                      name="version"
                      label="Version"
                      placeHolder="Select Version"
                      value={formValues?.version}
                      handleChange={handleChange}
                      options={jobRoleVersion || []}
                      error={errors?.version}
                      mandatory
                      disabled={formValues?.level === "" ? true : false}
                      loading={jobRoleLoading}
                    />
                  </div>
                )}

                <div
                  className="form-group"
                  style={{ width: "calc(33.33% - 10px)" }}
                >
                  <SelectInput
                    name="chooseInstructions"
                    label="Choose Instructions"
                    placeHolder="Select Instructions"
                    value={formValues?.chooseInstructions}
                    handleChange={handleChange}
                    options={chooseInstructions}
                    error={errors?.chooseInstructions}
                    mandatory
                  />
                </div>

                <div
                  className="form-group"
                  style={{ width: "calc(33.33% - 10px)" }}
                >
                  <Input
                    label="Question Set"
                    name="questionSet"
                    type={"number"}
                    hideExponants={true}
                    placeholder="Enter Question Set"
                    onFocus={focusHandler}
                    error={errors?.questionSet}
                    onBlur={blurHandler}
                    onChange={handleChange}
                    value={formValues?.questionSet}
                    mandatory
                  />
                </div>
                <div
                  className="form-group"
                  style={{ width: "calc(33.33% - 10px)" }}
                >
                  <SelectInput
                    name="questionType"
                    label="Question Type"
                    placeHolder="Select Question Type"
                    value={formValues?.questionType}
                    handleChange={handleChange}
                    options={QUESTIONTYPES}
                    error={errors?.questionType}
                    disabled={true}
                    mandatory
                  />
                </div>

                <div style={{ width: "calc(33.33% - 10px)" }}>
                  <div className="form-group">
                    <Input
                      label="Passing Percentage"
                      type={"number"}
                      hideExponants={true}
                      name="passingPercentage"
                      placeholder="Enter Passing Percentage"
                      onFocus={focusHandler}
                      error={errors?.passingPercentage}
                      onBlur={blurHandler}
                      onChange={handleChange}
                      value={formValues?.passingPercentage}
                      mandatory
                    />
                  </div>
                </div>

                {/* from here-1 */}

                {isOnline && (
                  <div
                    className="form-group"
                    style={{ width: "calc(33.33% - 10px)" }}
                  >
                    <RadioButton
                      handleChange={handleChange}
                      options={yesNo}
                      name="suffleQuestion"
                      label="Shuffle question"
                      value={formValues?.suffleQuestion}
                      error={errors?.suffleQuestion}
                      mandatory
                    />
                  </div>
                )}
                {isOnline && (
                  <div
                    className="form-group"
                    style={{ width: "calc(33.33% - 10px)" }}
                  >
                    <RadioButton
                      handleChange={handleChange}
                      options={groupItems}
                      name="optionRandom"
                      label="Option Randomization"
                      value={formValues?.optionRandom}
                      error={errors?.optionRandom}
                      mandatory
                    />
                  </div>
                )}

                {(isMultiLanguageEnabled || isOnline) && (
                  <div
                    className="form-group"
                    style={{ width: "calc(33.33% - 10px)" }}
                  >
                    <RadioButton
                      handleChange={handleChange}
                      options={yesNo}
                      name="examLanguageConduct"
                      label="Conduct exam in Multiple Language"
                      value={formValues?.examLanguageConduct}
                      error={errors?.examLanguageConduct}
                    />
                  </div>
                )}

                <div
                  className="form-group"
                  style={{ width: "calc(33.33% - 10px)", display: "none" }}
                >
                  <SelectInput
                    name="primaryLanguage"
                    label="Primary Language"
                    placeHolder="Select Primary Language"
                    value={formValues?.primaryLanguage}
                    handleChange={handleChange}
                    options={LANGUAGE}
                    error={errors?.primaryLanguage}
                    mandatory
                  />
                </div>
                <div
                  className="form-group"
                  style={{
                    width: "calc(33.33% - 10px)",
                    display: [
                      isMultiLanguageEnabled &&
                      formValues.examLanguageConduct === "true" &&
                      !isOnline
                        ? ""
                        : "none",
                    ],
                  }}
                >
                  <SelectInput
                    name="secondaryLanguage"
                    label="Secondary Language"
                    placeHolder="Secondary Language"
                    value={formValues?.secondaryLanguage}
                    handleChange={handleChange}
                    options={ExamConductLanguages}
                    error={errors?.secondaryLanguage}
                    disabled={formValues.examLanguageConduct !== "true"} // Disable if examLanguageConduct is not true
                    mandatory={formValues.examLanguageConduct === "true"}
                  />
                </div>

                <div
                  className="form-group"
                  style={{ width: "calc(33.33% - 10px)" }}
                >
                  <InputLabel
                    htmlFor="acceptTermCondition"
                    className="input-label"
                  >
                    Section
                    <span className="mandatory">&nbsp;*</span>
                  </InputLabel>
                  <FormGroup
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "nowrap",
                      gap: "10px",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="sectionName"
                          value="theory"
                          onFocus={focusHandler}
                          onBlur={blurHandler}
                          onChange={handleChange}
                          size="md"
                          checked={formValues?.sectionTable?.some(
                            (item) =>
                              item.sectionName === "theory" &&
                              item.isSelected === true
                          )}
                        />
                      }
                      style={{ marginRight: "0", marginBottom: "0" }}
                      label="Theory"
                    />
                    {/* {formValues?.isMultiJobRole !== "false" && ( */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="sectionName"
                          value="viva"
                          onFocus={focusHandler}
                          onBlur={blurHandler}
                          onChange={handleChange}
                          size="md"
                          checked={formValues?.sectionTable?.some(
                            (item) =>
                              item.sectionName === "viva" &&
                              item.isSelected === true
                          )}
                        />
                      }
                      style={{ marginRight: "0", marginBottom: "0" }}
                      label="Viva"
                    />
                    {/* )} */}
                    {/* {formValues?.isMultiJobRole !== "false" && ( */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="sectionName"
                          value="practical"
                          onFocus={focusHandler}
                          onBlur={blurHandler}
                          onChange={handleChange}
                          size="md"
                          checked={formValues?.sectionTable?.some(
                            (item) =>
                              item.sectionName === "practical" &&
                              item.isSelected === true
                          )}
                        />
                      }
                      style={{ marginRight: "0", marginBottom: "0" }}
                      label="Practical"
                    />
                    {/* )} */}
                  </FormGroup>
                  {errors && (
                    <p className="error-input">{errors.sectionTable}</p>
                  )}
                </div>

                {formValues?.sectionTable?.some((item) => item.isSelected) && (
                  <div className="question-paper-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Section</th>
                          <th>Order</th>
                          <th>Exam Duration (in minutes)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formValues?.sectionTable
                          ?.filter((value) => value.isSelected === true)
                          ?.map((val) => (
                            <tr key={val?.sectionName}>
                              <td>
                                {val?.sectionName?.charAt(0).toUpperCase() +
                                  val?.sectionName.slice(1)}
                              </td>
                              <td>
                                <SelectInput
                                  name="sectionOrder"
                                  // label="Section Order"
                                  placeHolder="Select Section Order"
                                  value={
                                    // formValues?.sectionTable?.[0]?.sectionOrder
                                    val?.sectionOrder
                                  }
                                  handleChange={(e) =>
                                    handleChange(e, val?.sectionName)
                                  }
                                  options={[
                                    {
                                      label: "1",
                                      value: 1,
                                      disabled: formValues?.sectionTable?.some(
                                        (item) => item.sectionOrder === 1
                                      ),
                                    },
                                    {
                                      label: "2",
                                      value: 2,
                                      disabled: formValues?.sectionTable?.some(
                                        (item) => item.sectionOrder === 2
                                      ),
                                    },
                                    {
                                      label: "3",
                                      value: 3,
                                      disabled: formValues?.sectionTable?.some(
                                        (item) => item.sectionOrder === 3
                                      ),
                                    },
                                  ].slice(
                                    0,
                                    formValues?.sectionTable?.filter(
                                      (item) => item.isSelected === true
                                    ).length
                                  )}
                                  disabled={false}
                                  error={
                                    errors[val?.sectionName + "sectionOrder"]
                                  }
                                />
                              </td>
                              <td>
                                <Input
                                  name="examDuration"
                                  type={"number"}
                                  hideExponants={true}
                                  placeholder="Enter Exam Duration"
                                  onFocus={focusHandler}
                                  error={
                                    errors[val?.sectionName + "examDuration"]
                                  }
                                  onBlur={blurHandler}
                                  onChange={(e) =>
                                    handleChange(e, val?.sectionName)
                                  }
                                  value={val?.examDuration}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div
                  className="form-group"
                  style={{ width: "calc(33.33% - 10px)", display: "none" }}
                >
                  <div className="assesment-status-wrapper">
                    <RadioButton
                      handleChange={handleChange}
                      options={ASSESSMENTSTATUS}
                      name="assesmentStatus"
                      label="Assessment Status"
                      value={formValues?.assesmentStatus}
                      error={errors?.assesmentStatus}
                      mandatory
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default QuestionPaper;
