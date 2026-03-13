import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useEffect } from "react";
import "./style.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import validateField from "../../../../../utils/validateField";
import { PulseLoader } from "react-spinners";
import { ReactComponent as CloseIcon } from "../../../../../assets/icons/close-icon.svg";
import { ReactComponent as ClockIcon } from "../../../../../assets/icons/clockIcon.svg";
import { increaseExamTimeApi } from "../../../../../api/superAdminApi/examManagement";
import Input from "../../../../../components/common/input";

const initialFormValues = {
  examTime: "",
  reasonToIncreaseExamTime: "",
};

const IncreaseExamTimeModal = ({
  title,
  open,
  handleClose,
  candidateId,
  setIncreaseTimeModal,
  setActionOpen,
  actionId,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  useEffect(() => {
    if (actionId === candidateId) {
      setFormValues(initialFormValues);
      setErrors({});
    }
  }, [open]);

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(
      name,
      fieldValue,
      formValues?.examTime,
      formValues?.reasonToIncreaseExamTime
    );

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

  // const focusHandler = (event) => {
  //   setFocusedInput(event.target.name);
  // };

  // const blurHandler = () => {
  //   setFocusedInput("");
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = {};

    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(
        name,
        value,
        formValues?.examTime,
        formValues?.reasonToIncreaseExamTime
      );
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Submit the form data
      setLoading(true);
      const formData = {
        examTime: formValues?.examTime,
        reasonToIncreaseExamTime: formValues?.reasonToIncreaseExamTime,
      };
      dispatch(
        increaseExamTimeApi(
          candidateId,
          formData,
          setErr,
          setLoading,
          clearFormValues,
          setIncreaseTimeModal,
          setActionOpen
        )
      );
    }
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-wrapper increase-exam-time "
      >
        <Box className="increase-exam-time-Modal">
          <Box className="title-wrapper">
            <Box className="icon-title-wrapper">
              <Box className="time-icon">
                <ClockIcon />
              </Box>
              <DialogTitle
                id="alert-dialog-title"
                sx={{ padding: 0 }}
                className="title"
              >
                <Box>
                  <h6>{title ?? ""}</h6>
                </Box>
              </DialogTitle>
            </Box>
            <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>
          <DialogContent sx={{ padding: 0 }} className="content-body">
            <Box>
              <div className="edit-profile security">
                <div className="form-wrapper">
                  {err && (
                    <div className="error-box">
                      <p className="error-text">{err}</p>
                    </div>
                  )}
                  <div className="form">
                    <form>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ width: "100%" }} className="form-group">
                          <Input
                            label="Exam Time"
                            type={"number"}
                            name="examTime"
                            placeholder="Exam Time in minutes"
                            error={errors?.examTime}
                            // onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.examTime}
                            endAdornment
                            mandatory
                          />
                        </div>

                        <div style={{ width: "100%" }} className="form-group">
                          <Input
                            label="Reason"
                            type={"text"}
                            name="reasonToIncreaseExamTime"
                            placeholder="Write a brief Reason to increase exam time..."
                            error={errors?.reasonToIncreaseExamTime}
                            // onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.reasonToIncreaseExamTime}
                            mandatory
                            textarea
                            multiline
                            rows={4}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Box>
            <DialogActions sx={{ padding: 0 }}>
              <Box
                sx={{
                  justifyContent: "end",
                  padding: 0,
                  color: "#00000",
                  display: "flex",
                }}
              ></Box>
              <Box className="action-btn-wrapper">
                <Button
                  className={`yes-btn`}
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading ? true : false}
                >
                  {loading ? (
                    <PulseLoader size="10px" color="white" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </Box>
            </DialogActions>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default IncreaseExamTimeModal;
