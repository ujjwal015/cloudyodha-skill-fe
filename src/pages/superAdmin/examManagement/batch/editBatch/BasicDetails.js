import React, { useEffect, useState } from "react";
import "./style.css";
import { ReactComponent as Settings } from "../../../../../assets/images/pages/examManagement/settings.svg";
import validateField from "../../../../../utils/validation/superAdmin/examManagement";
import SelectInput from "../../../../../components/common/SelectInput";
import Input from "../../../../../components/common/input";
import { BATCH_FOR } from "../../../../../config/constants/projectConstant";
import DateInput from "../../../../../components/common/DateInput";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { examManagementSelector } from "../../../../../redux/slicers/superAdmin/examManagementSlice";
import {
  getBatchSubSchemeListApi,
  getSingleBatchApi,
} from "../../../../../api/superAdminApi/examManagement";
import { BATCHMODE } from "../data";
import { useParams } from "react-router-dom";
import DateTimePickerComponent from "../../../../../components/common/TimeInput";
import moment from "moment";
import AutoCompleteAsyncInput from "../../../../../components/common/AutoCompleteAsyncInput";
import { ALPHABETIC_SORT } from "../../../../../utils/projectHelper";

const BasicDetails = ({ formValues, setFormValues, errors, setErrors }) => {
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    schemeList = [],
    subSchemeList = [],
    examCenterNameList = [],
  } = useSelector(examManagementSelector);

  useEffect(() => {
    if (formValues.schemeId === "") return;
    dispatch(getBatchSubSchemeListApi(formValues.schemeId, setLoading));
  }, [formValues.schemeId]);

  useEffect(() => {
    if (subSchemeList.length === 0)
      setFormValues((prev) => ({ ...prev, subSchemeId: "" }));
  }, [subSchemeList]);

  const handleChange = (event) => {
    const { value, name } = event.target;

    // Update form values.
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle exam center selection to populate TP name
    if (name === "examCenterId") {
      delete errors['trainingPartner'];
      const selectedCenter = examCenterNameList.find(
        (center) => center.value === value
      );
      if (selectedCenter) {
        setFormValues((prev) => ({
          ...prev,
          trainingPartner: selectedCenter?.trainingPartner,
        }));
        // Clear training partner error when exam center is selected and TP is populated
        if (selectedCenter?.trainingPartner) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            trainingPartner: undefined,
          }));
        }
      }
    }

    // Skip validation for the subSchemeId field if subSchemeList is empty.
    if (name === "subSchemeId") {
      // Clear any existing errors for subSchemeId
      setErrors((prevErrors) => {
        const { subSchemeId, ...restErrors } = prevErrors;
        return restErrors;
      });
      return;
    }

    // Validate the field.
    const fieldError = validateField(name, value);

    // Update the errors state for this specific field.
    setErrors((prevErrors) => {
      return fieldError
        ? { ...prevErrors, [name]: fieldError } // Set error for the field
        : { ...prevErrors, [name]: undefined }; // Clear error for the field
    });
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const handleDateChange = (newDate, name) => {
    const formattedDate = dayjs(newDate).format("DD-MMM-YYYY");
    const fieldError = validateField(
      name,
      formattedDate,
      formValues?.startDate,
      null,
      null,
      null,
      null,
      formValues?.endDate
    );

    setFormValues((pre) => ({ ...pre, [name]: formattedDate }));

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors((prev) => ({ ...prev, startDate: "", endDate: "" }));
    }
  };

  const handleTimeChange = (newValue, name) => {
    if (newValue) {
      const parsedDate = dayjs(newValue).format("HH:mm");

      // const parsedDate = moment(newValue,"hh:mm").format("HH:mmA");
      // const fieldError = validateField(
      //   name,
      //   parsedDate,
      //   null,
      //   formValues?.startTime,
      //   null,
      //   null,
      //   formValues?.endTime
      // );

      const options = {
        startDate: formValues?.startDate,
        startTime: parsedDate,
        checked: null,
        len: null,
        endTime: formValues?.endTime,
        endDate: formValues?.endDate,
        assignAssessorProctor: null,
      };
      const fieldError = validateField(name, parsedDate, options);

      setFormValues((prev) => ({ ...prev, [name]: parsedDate }));

      if (fieldError) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          startTime: "",
          endTime: "",
        }));
      }
    }
  };

  return (
    <>
      <section className="sub-admin-wrapper basic-details">
        <div className="tab-content">
          <div className="form-title">
            <h1>Basic Details</h1>
            <Settings />
          </div>
          <div className="form-wrapper">
            <div className="form">
              {/* ============Form Starts here ========= */}
              <form>
                <div className="inputFields">
                  <div className="form-group">
                    <div className="input_lg">
                      <div className="input_select">
                        <SelectInput
                          name="examCenterId"
                          label="Exam Center"
                          placeHolder="Select Exam Center"
                          value={formValues?.examCenterId}
                          handleChange={handleChange}
                          options={examCenterNameList}
                          error={errors?.examCenterId}
                          // mandatory
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input_lg">
                      <Input
                        label="Training Partner (TP) Name"
                        name="trainingPartner"
                        type="text"
                        placeholder="TP name will be auto-populated"
                        value={formValues?.trainingPartner || ""}
                        disabled={true}
                        onChange={() => {}} // Empty handler since it's disabled
                        error={errors?.trainingPartner}
                      />
                    </div>
                  </div>

                  <div className="duo_inputBox">
                    <div className="form-group">
                      <Input
                        label="Batch ID (SIP)"
                        name="batchId"
                        type="text"
                        placeholder="Enter Batch ID"
                        onFocus={focusHandler}
                        error={errors?.batchId}
                        onBlur={blurHandler}
                        onChange={handleChange}
                        value={formValues?.batchId}
                        disabled={true}
                        mandatory
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        label="Batch Size"
                        name="batchSize"
                        type="number"
                        placeholder="Enter Batch Size"
                        onFocus={focusHandler}
                        error={errors?.batchSize}
                        onBlur={blurHandler}
                        onChange={(e) => handleChange(e)}
                        value={formValues?.batchSize}
                        mandatory
                      />
                    </div>
                  </div>
                  <div className="duo_inputBox">
                    <div className="form-group">
                      <div className="input_lg">
                        <div className="input_select">
                          <SelectInput
                            name="schemeId"
                            label="Scheme"
                            placeHolder="Select Scheme"
                            value={formValues?.schemeId || ""}
                            handleChange={handleChange}
                            options={schemeList}
                            error={errors?.schemeId}
                            mandatory
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input_lg">
                        <div className="input_select">
                          <SelectInput
                            name="subSchemeId"
                            label="Sub-Scheme"
                            placeHolder="Select Sub Scheme"
                            value={formValues?.subSchemeId || ""}
                            handleChange={handleChange}
                            options={subSchemeList}
                            error={errors?.subSchemeId}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="duo_inputBox">
                    <div className="form-group">
                      <DateInput
                        label="Batch Start Date"
                        name="batchStartDate"
                        mandatory
                        value={formValues?.batchStartDate}
                        setFormValues={setFormValues}
                        error={errors?.batchStartDate}
                        onBlur={blurHandler}
                        placeholder="Select Start name"
                        handleDateChange={(e) =>
                          handleDateChange(e, "batchStartDate")
                        }
                        // disabled={true}
                      />
                    </div>
                    <div className="form-group">
                      <DateInput
                        name="endDate"
                        label="Batch End Date"
                        mandatory
                        value={formValues?.batchEndDate}
                        setFormValues={setFormValues}
                        error={errors?.batchEndDate}
                        onBlur={blurHandler}
                        placeholder="Select End name"
                        handleDateChange={(e) =>
                          handleDateChange(e, "batchEndDate")
                        }
                        // disabled={true}
                      />
                    </div>
                  </div>
                  <div className="duo_inputBox">
                    <div className="form-group">
                      <DateInput
                        label="Assessment Start Date"
                        name="startDate"
                        mandatory
                        value={formValues?.startDate}
                        setFormValues={setFormValues}
                        error={errors?.startDate}
                        onBlur={blurHandler}
                        placeholder="Select Start name"
                        handleDateChange={(e) =>
                          handleDateChange(e, "startDate")
                        }
                        // disabled={true}
                      />
                    </div>
                    <div className="form-group">
                      <DateInput
                        name="endDate"
                        label="Assessment End Date"
                        mandatory
                        value={formValues?.endDate}
                        setFormValues={setFormValues}
                        error={errors?.endDate}
                        onBlur={blurHandler}
                        placeholder="Select End name"
                        handleDateChange={(e) => handleDateChange(e, "endDate")}
                        // disabled={true}
                      />
                    </div>
                  </div>
                  <div className="duo_inputBox">
                    <div
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
                    >
                      <DateTimePickerComponent
                        label={"Assessment Start Time"}
                        mandatory
                        value={formValues?.startTime}
                        setFormValues={setFormValues}
                        handleTimeChange={(newValue) =>
                          handleTimeChange(newValue, "startTime")
                        }
                        error={errors?.startTime}
                        onBlur={blurHandler}
                        placeholder="Select assessment start time"
                      />
                    </div>

                    <div
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
                    >
                      <DateTimePickerComponent
                        label={"Assessment End Time"}
                        mandatory
                        value={formValues?.endTime}
                        setFormValues={setFormValues}
                        error={errors?.endTime}
                        onBlur={blurHandler}
                        placeholder="Select assessment end time"
                        handleTimeChange={(e) => handleTimeChange(e, "endTime")}
                      />
                    </div>
                  </div>
                  <div className="duo_inputBox">
                    <div className="form-group">
                      <div className="input_lg">
                        <div className="input_select">
                          <SelectInput
                            name="batchMode"
                            label="Batch Mode"
                            placeHolder="Select Mode"
                            value={formValues?.batchMode}
                            handleChange={handleChange}
                            options={BATCHMODE}
                            error={errors?.batchMode}
                            disabled={true}
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
    </>
  );
};

export default BasicDetails;
