import React, { useEffect, useState } from 'react'
import Input from "../../input";
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
import {  InputLabel } from '@mui/material';
import validateField from '../../../../utils/validateField';
import { getUserDetails } from '../../../../utils/projectHelper';
import { useDispatch } from 'react-redux';
import { putDashboardScheduleMeetingApi } from '../../../../api/superAdminApi/dashboard';

const EditScheduleModal = (props) => {
  const { open, handleClose, editData = {scheduleTitle: "d",
  from_userid: "65c5da1a65491290ea447989",
  schedule_startDate: "14/06/2024",
  start_time: "12:00 AM",
  schedule_endDate: "14/06/2024",
  end_time: "12:00 AM"} } = props;
  const dispatch = useDispatch();
  const userData = getUserDetails();
  const [loading, setLoading] = useState(false);
  const [editFormValues, setEditFormValues] = useState(editData);
  const [focusedInput, setFocusedInput] = useState("");
  const [editErrors, setEditErrors] = useState({});
  const [selectedStartDateTime, setSelectedStartDateTime] = useState(null);
  const [selectedEndDateTime, setSelectedEndDateTime] = useState(null);  
  
  console.log(editFormValues,'editFormValues');
  useEffect(() => {
    if (editData.schedule_startDate && editData.start_time) {
      setSelectedStartDateTime(dayjs(`${editData.schedule_startDate} ${editData.start_time}`, "DD/MM/YYYY hh:mm A"));
    }
    if (editData.schedule_endDate && editData.end_time) {
      setSelectedEndDateTime(dayjs(`${editData.schedule_endDate} ${editData.end_time}`, "DD/MM/YYYY hh:mm A"));
    }
  }, [editData]);

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

    setEditFormValues({
      ...editFormValues,
      [name]: fieldValue,
    });

    if (fieldError) {
      setEditErrors({
        [name]: fieldError,
      });
    } else {
      setEditErrors({});
    }
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

  const handleDateChange = (newDate, setter, date, time) => {       
    setEditErrors({});
    setter(newDate);
    const updatedFormValues = {
      ...editFormValues,
      [date]: newDate ? dayjs(newDate).format("DD/MM/YYYY") : "",
      [time]: newDate ? dayjs(newDate).format("hh:mm A") : "",
    };
    setEditFormValues(updatedFormValues);

    const startDate = date === "schedule_startDate" ? newDate : selectedStartDateTime;
    const endDate = date === "schedule_endDate" ? newDate : selectedEndDateTime;        
    
    const dateErrors = validateDates(startDate, endDate, updatedFormValues);    
    setEditErrors(dateErrors);
  };

  const handleUpdateMeetingSave = (event) => {
    event.preventDefault();
    const formErrors = {};
    
    Object.keys(editFormValues).forEach((name) => {      
      if (['schedule_startDate', "schedule_endDate", "start_time", "end_time"].includes(name)) {
        const err = validateDates(selectedStartDateTime, selectedEndDateTime, editFormValues);
        Object.keys(err).forEach((key)=>{
          formErrors[key] = err[key];
        });   
        console.log(formErrors,'formerrrorr')     
      }else{      
      const value = editFormValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    }
    });    
    setEditErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      console.log(editFormValues,'final formvalues');
      const {scheduleTitle: title, ...rest} = editFormValues;
      const formData = {title: title, from_userid: userData?._id, ...rest};
      console.log(formData,'formData')
      // handleResetFormValues();
      // Submit the form data
      setLoading(true);
      dispatch(putDashboardScheduleMeetingApi(setLoading, userData?._id,  formData));
    }
  };  


  return (
    <Dialog
    open={open}
    onClose={handleClose}
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
          <h3>Edit Schedule</h3>
          <p>Create your company profile for free in less than 5 minutes.</p>
        </div>
        <div className="addnewmeeting-modal-close">
          <CloseIcon onClick={handleClose} />
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
          error={editErrors?.scheduleTitle}
          onBlur={blurHandler}
          onChange={changeHandler}
          value={editFormValues.scheduleTitle}
        />
      </div>     
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
              label="Schedule Date & Time"
              value={selectedStartDateTime}
              onChange={(e)=> handleDateChange(e, setSelectedStartDateTime, 'schedule_startDate', 'start_time')}
              minDate={dayjs()} // Disable past dates                
            />
          </DemoContainer>
          <p className="error-input">
            {editErrors.schedule_startDate} {editErrors.start_time}
          </p>
        </LocalizationProvider>
      </div>      
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
              label="Schedule Date & End Time"
              value={selectedEndDateTime}
              onChange={(e)=> handleDateChange(e, setSelectedEndDateTime, 'schedule_endDate', 'end_time')}
              minDate={dayjs()} // Disable past dates
            />
          </DemoContainer>
          <p className="error-input">
            {editErrors.schedule_endDate} {editErrors.end_time}
          </p>
        </LocalizationProvider>
      </div>      
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>cancel</Button>
      <Button onClick={handleUpdateMeetingSave} autoFocus>
        Update
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default EditScheduleModal