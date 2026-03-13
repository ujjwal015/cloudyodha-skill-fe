import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ReactComponent as ReminderClzIcon } from "../../../assets/icons/remide-close.svg";
import "./reminder.style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getReminderDataApi,
  sendRemindersApi,
} from "../../../api/superAdminApi/verificationTab";
import { verificationTabSelector } from "../../../redux/slicers/superAdmin/verificationTabSlice";
import { ReactComponent as BellReminderIcon } from "../../../assets/icons/bellPlus.svg";

import validateField from "../../../utils/validateField";

const initialFormValues = {
  addNewMsg: "",
  reminderNo: "",
  oldMsg: "",
};
export default function ReminderModel({
  batchId,
  QAverificationTimeStampId,
  setLoading,
  loading,
  assesorId,
  setErrors,
  errors,
  iconRequired=false
}) {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [reminderFormValues, setReminderFormValues] =
    useState(initialFormValues);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const getReminderData = () => {
    dispatch(
      getReminderDataApi(
        setLoading,
        QAverificationTimeStampId,
        setReminderFormValues
      )
    );
  };

  const handleClickOpen = () => {
    getReminderData();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReminderChange = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    if (fieldError) {
      setErrors((pre) => ({
        ...pre,
        [name]: fieldError,
      }));
    }
    setReminderFormValues((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handleSubmitReminder = (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(reminderFormValues).forEach((name) => {
      const value = reminderFormValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const payload = {
        message: reminderFormValues?.addNewMsg,
        assesorId: assesorId,
        QAverificationTimeStampId: QAverificationTimeStampId,
        reminderCount: reminderFormValues?.reminderNo,
      };
      dispatch(
        sendRemindersApi(
          payload,
          setLoading,
          setReminderFormValues,
          initialFormValues
        )
      );
    }
  };

  return (
    <React.Fragment>
      {!iconRequired && <button onClick={handleClickOpen}> Send Reminder</button>}
      {iconRequired && <BellReminderIcon  onClick={handleClickOpen} style={{cursor:"pointer"}}/>}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <div style={{ padding: "15px" }}>
          <div className="model-header-wrapper">
            <div className="model-header">
              <h3>Send Reminder</h3>
              <p>
                Messages to remind the user to perform specific actions.
                <span>*</span>
              </p>
            </div>
            <ReminderClzIcon onClick={handleClose} />
          </div>

          <div className="model-input-group">
            <input
              type="text"
              name="addNewMsg"
              value={reminderFormValues?.addNewMsg}
              placeholder="Add a new message"
              onChange={handleReminderChange}
            />
            {errors ? <p>{errors?.addNewMsg}</p> : ""}
          </div>

          <div className="form-group">
            <label>Added Messages:</label>
            <textarea
              rows={5}
              placeholder={
                reminderFormValues?.oldMsg?.length > 0
                  ? "view old message"
                  : "No old message"
              }
              value={reminderFormValues?.oldMsg}
              disabled
            />
          </div>

          <div className="model-bottom">
            <h1>Minimum number of reminders</h1>
            <p>
              Set the maximum number of reminders your reviewer can send to
              assessors.
            </p>
          </div>

          <input
            type="number"
            name="reminderNo"
            value={reminderFormValues?.reminderNo}
            className="reminder-no"
            onChange={handleReminderChange}
            placeholder="0"
          />
          {errors ? <p className="reminder-err">{errors?.reminderNo}</p> : ""}
          <div className="save-btn">
            <button onClick={handleSubmitReminder}>
              {loading ? "Loading" : "Save"}
            </button>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
