import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { ReactComponent as CalenderIcon } from "../../../../assets/icons/calendar-icon.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/CloseIcon.svg";
import "./style.css";
import Input from "../../input";
import validateField from "../../../../utils/validateField";
import { InputLabel } from "@mui/material";
import { putDashboardScheduleMeetingApi } from "../../../../api/superAdminApi/dashboard";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../../../../utils/projectHelper";

const initialFormValues = {
  scheduleTitle: "",
  schedule_startDate: "",
  start_time: "",
  schedule_endDate: "",
  end_time: "",
};

const AddNewMeetingModal = (props) => {
  
  const { open, handleClose } = props;
  const dispatch = useDispatch();
  const userData = getUserDetails();  
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [focusedInput, setFocusedInput] = useState("");
  const [selectedStartDateTime, setSelectedStartDateTime] = useState(null);  
  const [selectedEndDateTime, setSelectedEndDateTime] = useState(null);  
  const [errors, setErrors] = useState({});

  const handleResetScheduleFormValues = () =>{
    setFormValues(initialFormValues);
    setSelectedStartDateTime(null);
    setSelectedEndDateTime(null);
    setErrors({});
    handleClose();
  };

  const handleDateChange = (newDate, setter, date, time) => {       
    setErrors({});
    setter(newDate);
    const updatedFormValues = {
      ...formValues,
      [date]: newDate ? dayjs(newDate).format("DD/MM/YYYY") : "",
      [time]: newDate ? dayjs(newDate).format("hh:mm A") : "",
    };
    setFormValues(updatedFormValues);

    const startDate = date === "schedule_startDate" ? newDate : selectedStartDateTime;
    const endDate = date === "schedule_endDate" ? newDate : selectedEndDateTime;        
    
    const dateErrors = validateDates(startDate, endDate, updatedFormValues);    
    setErrors(dateErrors);
  };
  
  const validateDates = (startDateTime, endDateTime, formValues) => {
    const errors = {};

    if (!startDateTime) {
      errors.schedule_startDate = "Schedule Start date is required";
    }
    if (!endDateTime) {
      errors.schedule_endDate = "Schedule End date is required";
    }

    if (startDateTime && endDateTime) {
      if (dayjs(startDateTime).isAfter(dayjs(endDateTime))) {
        errors.schedule_startDate = "Start date cannot be after end date";
        errors.schedule_endDate = "End date cannot be before start date";
      }
      if (dayjs(startDateTime).isSame(dayjs(endDateTime))) {
        console.log('working')
        const startTime = formValues.start_time;
        const endTime = formValues.end_time;

        if (!startTime) {
          errors.start_time = "Start time is required";
        }
        if (!endTime) {
          errors.end_time = "End time is required";
        }

        if (startTime && endTime) {
          const startTimeValue = dayjs(startTime, "hh:mm A");
          const endTimeValue = dayjs(endTime, "hh:mm A");

          if (startTimeValue.isAfter(endTimeValue)) {
            errors.start_time = "Start time cannot be after end time";
            errors.end_time = "End time cannot be before start time";
          }
        }
      }
    }

    return errors;
  };

  const formatDateTime = (date) => {
    console.log(date);
    return date ? dayjs(date).format("DD/MM/YYYY hh:mm A") : "";
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    const formErrors = {};
    
    Object.keys(formValues).forEach((name) => {      
      if (['schedule_startDate', "schedule_endDate", "start_time", "end_time"].includes(name)) {
        const err = validateDates(selectedStartDateTime, selectedEndDateTime, formValues);
        Object.keys(err).forEach((key)=>{
          formErrors[key] = err[key];
        })   
        console.log(formErrors,'formerrrorr')     
      }else{      
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    }
    });    
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      console.log(formValues,'final formvalues');
      const {scheduleTitle: title, ...rest} = formValues;
      const formData = {title: title, from_userid: userData?._id, ...rest};
      console.log(formData,'formData')
      // handleResetFormValues();
      // Submit the form data
      setLoading(true);
      dispatch(putDashboardScheduleMeetingApi(setLoading, userData?._id,  formData, handleResetScheduleFormValues));
    }
  };  
  console.log(formValues)
  return (
    <Dialog
      open={open}
      onClose={handleResetScheduleFormValues}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{height: "auto"}}
    >
      <DialogTitle
        id="alert-dialog-title"
        className="addnewmeeting-modal-dialog-title"
      >
        <div className="addnewmeeting-modal-title-wrapper">
          <div>
            <CalenderIcon />
          </div>
          <div className="addnewmeeting-modal-title">
            <h3>Add New Schedule</h3>
            <p>Create your company profile for free in less than 5 minutes.</p>
          </div>
          <div className="addnewmeeting-modal-close">
            <CloseIcon onClick={handleResetScheduleFormValues} />
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <div style={{ width: "calc(100% - 10px)", padding: "17px 0px" }} className="form-group">
          <Input
            label="Schedule Title"
            name="scheduleTitle"
            mandatory            
            placeholder="Write your meeting title"
            onFocus={focusHandler}
            error={errors?.scheduleTitle}
            onBlur={blurHandler}
            onChange={changeHandler}
            value={formValues.scheduleTitle}
          />
        </div>
        {/* {formValues.schedule_startDate == ""? */}
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <InputLabel
              htmlFor={`outlined-adornment-add-meeting-schedule`}
              className="input-label"
            >
              Schedule Start Date & StartTime {true ? <span className="mandatory">&nbsp;*</span> : ""}
            </InputLabel>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Schedule Start Date & Time"
                value={selectedStartDateTime}
                onChange={(e)=> handleDateChange(e, setSelectedStartDateTime, 'schedule_startDate', 'start_time')}
                minDate={dayjs()} // Disable past dates                
              />
            </DemoContainer>
            <p className="error-input">
              {errors.schedule_startDate} {errors.start_time}
            </p>
          </LocalizationProvider>
        </div>
        {/* : */}
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <InputLabel
              htmlFor={`outlined-adornment-add-meeting-schedule`}
              className="input-label"
            >
              Schedule End Date & End Time {true ? <span className="mandatory">&nbsp;*</span> : ""}
            </InputLabel>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Schedule End Date & End Time"
                value={selectedEndDateTime}
                onChange={(e)=> handleDateChange(e, setSelectedEndDateTime, 'schedule_endDate', 'end_time')}
                minDate={dayjs()} // Disable past dates
              />
            </DemoContainer>
            <p className="error-input">
              {errors.schedule_endDate} {errors.end_time}
            </p>
          </LocalizationProvider>
        </div>
        {/* } */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleResetScheduleFormValues}>cancel</Button>
        <Button onClick={handleSave} autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewMeetingModal;
