import React, { useEffect, useState } from "react";
import "./style.css";
import { ReactComponent as Settings } from "../../../../../assets/images/pages/examManagement/settings.svg";
import validateField from "../../../../../utils/validation/superAdmin/examManagement";
import SelectInput from "../../../../../components/common/SelectInput";
import Input from "../../../../../components/common/input";
import DateInput from "../../../../../components/common/DateInput";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { examManagementSelector, getAssessorList } from "../../../../../redux/slicers/superAdmin/examManagementSlice";
import { BATCHMODE } from "../data";
import { callAccesorApi, getBatchSubSchemeListApi } from "../../../../../api/superAdminApi/examManagement";
import { LocalizationProvider } from "@mui/x-date-pickers";
import DateTimePickerComponent from "../../../../../components/common/TimeInput";
import moment from "moment";
import AutoCompleteAsyncInput from "../../../../../components/common/AutoCompleteAsyncInput";
import { ALPHABETIC_SORT } from "../../../../../utils/projectHelper";

// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

// function DateTimePickerOpenTo() {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer components={['MobileDateTimePicker', 'MobileDateTimePicker']}>
//         <DateTimePicker label={'"year"'} openTo="year" />
//         <MobileTimePicker label={'"hours"'} openTo="hours" />
//       </DemoContainer>
//     </LocalizationProvider>
//   );
// }

const BasicDetails = (props) => {
  const { formValues, setFormValues, errors, setErrors } = props;
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const dispatch = useDispatch();
  const {
    schemeList = [],
    subSchemeList = [],
    examCenterNameList = [],
  } = useSelector(examManagementSelector);

  // useEffect(() => {
  //   dispatch(getBatchSubSchemeListApi(formValues.schemeId, setLoading));
  // }, [formValues.schemeId]);

  const onChangeScheme = async (schemeId) => {
    dispatch(
      getBatchSubSchemeListApi(schemeId, setLoading, formValues)
    );
    const response = await callAccesorApi(schemeId);
    if (response.statusCode === 200) {
      const data = response.details.map((element) => {
        return {
          value: element._id,
          label: element.fullName,
        };
      });
      dispatch(getAssessorList(data));
    }
  }

  useEffect(() => {
    if (formValues.schemeId === "") return;
    onChangeScheme(formValues.schemeId);
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
      const selectedCenter = examCenterNameList.find(center => center.value === value);
      if (selectedCenter) {
        setFormValues((prev) => ({
          ...prev,
          trainingPartner: selectedCenter?.trainingPartner,
        }));
      }
    }

    // Skip validation for the subSchemeId field if subSchemeList is empty.
    if (name === "subSchemeId" && subSchemeList.length === 0) {
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
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    } else {
      setErrors((prev) => ({ ...prev, startDate: "", endDate: "" }));
    }
  };
  // const handleTimeChange = (newValue, name) => {

  //   let time = newValue.format('hh:mmA');
  //   const fieldError = validateField(name, time);

  //   console.log(time);

  //   setFormValues(prev => ({ ...prev, [name]: time }));

  //   if (fieldError) {
  //     setErrors(prevErrors => ({ ...prevErrors, [name]: fieldError }));
  //   } else {
  //     setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  //   }
  // };

  const handleTimeChange = (newValue, name) => {
    if (newValue) {
      const parsedDate = dayjs(newValue).format("HH:mm");

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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  <div className="form-group" style={{ width: "100%" }}>
                    <SelectInput
                      name="examCenterId"
                      label="Exam Center"
                      placeHolder="Select Exam Center"
                      value={formValues?.examCenterId}
                      handleChange={handleChange}
                      options={ALPHABETIC_SORT(examCenterNameList)}
                      error={errors?.examCenterId}
                      // mandatory
                    />
                  </div>

                  <div className="form-group" style={{ width: "100%" }}>
                    <Input
                      label="Training Partner (TP) Name"
                      name="trainingPartner"
                      type="text"
                      placeholder="TP name will be auto-populated"
                      value={formValues?.trainingPartner || ""}
                      disabled={true}
                      onChange={() => {}} // Empty handler since it's disabled
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ width: "calc(50% - 10px)" }}
                  >
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
                      mandatory
                      tooltipText={"Please Enter the SIP ID Provided by NCVT"}
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{ width: "calc(50% - 10px)" }}
                  >
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
                  <div
                    className="form-group"
                    style={{ width: "calc(50% - 10px)" }}
                  >
                    <SelectInput
                      name="schemeId"
                      label="Scheme"
                      placeHolder="Select Scheme"
                      value={formValues?.schemeId}
                      handleChange={handleChange}
                      options={schemeList}
                      error={errors?.schemeId}
                      mandatory
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{ width: "calc(50% - 10px)" }}
                  >
                    <SelectInput
                      name="subSchemeId"
                      label="Sub-Scheme"
                      placeHolder="Select Sub Scheme"
                      value={formValues?.subSchemeId}
                      handleChange={handleChange}
                      options={subSchemeList}
                      error={errors?.subSchemeId}
                      //mandatory={subSchemeList.length > 0}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ width: "calc(50% - 10px)" }}
                  >
                    <DateInput
                      label="Batch Start Date"
                      name="batchStartDate"
                      mandatory
                      value={formValues?.batchStartDate}
                      setFormValues={setFormValues}
                      error={errors?.batchStartDate}
                      onBlur={blurHandler}
                      placeholder="Select Batch Start Date"
                      handleDateChange={(e) => handleDateChange(e, "batchStartDate")}
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{ width: "calc(50% - 10px)" }}
                  >
                    <DateInput
                      name="batchEndDate"
                      label="Batch End Date"
                      mandatory
                      value={formValues?.batchEndDate}
                      setFormValues={setFormValues}
                      error={errors?.batchEndDate}
                      onBlur={blurHandler}
                      placeholder="Select Batch End Date"
                      handleDateChange={(e) => handleDateChange(e, "batchEndDate")}
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{ width: "calc(50% - 10px)" }}
                  >
                    <DateInput
                      label="Assessment Start Date"
                      name="startDate"
                      mandatory
                      value={formValues?.startDate}
                      setFormValues={setFormValues}
                      error={errors?.startDate}
                      onBlur={blurHandler}
                      placeholder="Select assessment start date"
                      handleDateChange={(e) => handleDateChange(e, "startDate")}
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{ width: "calc(50% - 10px)" }}
                  >
                    <DateInput
                      name="endDate"
                      label="Assessment End Date"
                      mandatory
                      value={formValues?.endDate}
                      setFormValues={setFormValues}
                      error={errors?.endDate}
                      onBlur={blurHandler}
                      placeholder="Select assessment end date"
                      handleDateChange={(e) => handleDateChange(e, "endDate")}
                    />
                  </div>
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

                  {/* <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                    <ResponsiveDateRangePicker />
                  </div> */}
                  <div className="form-group" style={{ width: "100%" }}>
                    <SelectInput
                      name="batchMode"
                      label="Batch Mode"
                      placeHolder="Select Mode"
                      value={formValues?.batchMode}
                      handleChange={handleChange}
                      options={BATCHMODE}
                      error={errors?.batchMode}
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

export default BasicDetails;
