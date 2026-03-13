import React, { useState, useEffect } from "react";
import "./style.css";
import { ReactComponent as ProctorIcon } from "../../../../../assets/images/pages/examManagement/proctor-eye.svg";
import validateField from "../../../../../utils/validation/superAdmin/examManagement";
import SelectInput from "../../../../../components/common/SelectInput";
import { yesNo } from "../data";
import Input, { RadioButton } from "../../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import { examManagementSelector } from "../../../../../redux/slicers/superAdmin/examManagementSlice";
import AutoCompleteAsyncInput from "../../../../../components/common/AutoCompleteAsyncInput";


const AssessorProctorAssign = (props) => {
  const { formValues, setFormValues, errors, setErrors } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { proctorList = [], assessorList = [] } = useSelector(
    examManagementSelector
  );

  useEffect(() => {
    if (formValues?.proctorId === "" || undefined || null) {
      setFormValues((prev) => ({
        ...prev,
        proctorId: ""
      }))
    }
  }, [])
  const handleChange = (event) => {
    const { value, name } = event.target;
    const fieldError = formValues?.assignAssessorProctor 
      ? validateField(name, value, { assignAssessorProctor: formValues?.assignAssessorProctor })
      : validateField(name, value);
    console.log("check", value);

    if (fieldError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...restErrors } = prevErrors;
        return restErrors;
      });
    }

    if ((formValues?.proctorId === "" || undefined || null) || (formValues?.assignAssessorProctor=='false')) {
      setFormValues((prev) => ({
        ...prev,
        proctorId: ""
      }))
    }
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const focusHandler = (event) => { };
  const blurHandler = () => { };
  return (
    <>
      <section className="sub-admin-wrapper assessor-proctor">
        <div className="tab-content">
          <div className="form-title">
            <h1>Assessor/Proctor Assignment</h1>
            <ProctorIcon />
          </div>
          <div className="form-wrapper">
            <div className="form">
              {/* ============Form Starts here ========= */}
              <form>
                <div
                  className="inputFeilds"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: "80%",
                    gap: "16px",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <RadioButton
                      handleChange={handleChange}
                      options={yesNo}
                      name="assignAssessorProctor"
                      label="Do you want to assign Assessor & Proctor"
                      value={formValues?.assignAssessorProctor || 'false'}
                      error={errors?.assignAssessorProctor}
                      mandatory
                    />
                  </div>
                  {formValues?.assignAssessorProctor == 'true' && (
                    <>
                      <div style={{ width: "calc(50% - 8px)" }}>
                        <div className="form-group">
                          <div className="input_lg">
                            <div className="input_select">
                              {/* <SelectInput
                                name="accessorId"
                                label="Assessor"
                                placeHolder="Select Assessor"
                                value={formValues?.accessorId || ""}
                                handleChange={handleChange}
                                options={assessorList}
                                error={errors?.accessorId}
                                mandatory
                              /> */}
                              <AutoCompleteAsyncInput
                                name="accessorId"
                                label="Assessor"
                                value={formValues?.accessorId || ""}
                                placeHolder="Select Assessor"
                                onchange={handleChange}
                                setter={setFormValues}
                                optionLists={assessorList}
                                error={errors?.accessorId}
                                mandatory
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ width: "calc(50% - 8px)" }}>
                        <div className="form-group">
                          <div className="input_lg">
                            <div className="input_select">
                              <SelectInput
                                name="proctorId"
                                label="Proctor"
                                placeHolder="Select Proctor"
                                value={formValues?.proctorId || ""}
                                handleChange={handleChange}
                                options={proctorList}
                                error={errors?.proctorId}
                              // mandatory
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ width: "calc(50% - 8px)" }}>
                        <div className="form-group">
                          <Input
                            label="Assessor Fee per Candidate"
                            name="assessorFeePerCandidate"
                            type="number"
                            placeholder="Enter fee amount"
                            onFocus={focusHandler}
                            error={errors?.assessorFeePerCandidate}
                            onBlur={blurHandler}
                            onChange={handleChange}
                            value={formValues?.assessorFeePerCandidate || ""}
                            hideExponants={true}
                            mandatory={formValues?.assignAssessorProctor === "true"}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AssessorProctorAssign;
