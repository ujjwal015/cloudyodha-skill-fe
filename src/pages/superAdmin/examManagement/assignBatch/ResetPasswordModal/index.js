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
import { handleCopyInput } from "../../../../../utils/projectHelper";
import validateField from "../../../../../utils/validateField";
import { PulseLoader } from "react-spinners";
import { ReactComponent as FlagIcon } from "../../../../../assets/icons/flag-reset.svg";
import { ReactComponent as CloseIcon } from "../../../../../assets/icons/close-icon.svg";
import { ReactComponent as CopyIcon } from "../../../../../assets/icons/copy-icon.svg";
import {
  candidateResetPasswordApi,
  getCandidatePasswordApi,
} from "../../../../../api/superAdminApi/examManagement";
import Input from "../../../../../components/common/input";
import CopyButton from "../../../../../components/common/copyButton";

const initialFormValues = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const ResetPasswordModal = ({
  title,
  cancelText,
  open,
  handleClose,
  candidateId,
  setResetModal,
  setActionOpen,
  actionId,
  singleCandidateData = {},
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    if (candidateId) {
      dispatch(getCandidatePasswordApi(candidateId, setFormValues, setLoading));
    }
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
      formValues?.newPassword,
      formValues?.oldPassword,
      formValues?.confirmNewPassword
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

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = {};

    Object.keys(formValues).forEach((name) => {
      if (name === "oldPassword") {
        return;
      }
      const value = formValues[name];

      // check if the value name is oldPassword and remove the error

      const fieldError = validateField(
        name,
        value,
        formValues?.newPassword,
        formValues?.oldPassword
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
        oldPassword: formValues?.oldPassword,
        newPassword: formValues?.newPassword,
      };
      // console.log(formErrors);
      dispatch(
        candidateResetPasswordApi(
          candidateId,
          formData,
          setErr,
          setLoading,
          clearFormValues,
          setResetModal,
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
        className="dialog-wrapper reset-password "
      >
        <Box className="reset-Modal">
          <Box className="title-wrapper">
            <Box className="icon-title-wrapper">
              <Box className="flag-icon">
                <FlagIcon />
              </Box>
              <DialogTitle
                id="alert-dialog-title"
                sx={{ padding: 0 }}
                className="title"
              >
                <Box className="title-copy-wrapper">
                  <h6>
                    {title} <span>({singleCandidateData?.userName})</span>
                  </h6>
                  <CopyButton textToCopy={singleCandidateData?.userName} />
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
                        <div
                          style={{ width: "calc(95% - 10px)" }}
                          className="form-group"
                        >
                          <Input
                            label="Current Password"
                            type={"password"}
                            name="oldPassword"
                            placeholder="Type Password"
                            onFocus={focusHandler}
                            // error={errors?.oldPassword}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.oldPassword}
                            endAdornment
                            mandatory
                            disabled={true}
                            copyOnClick={true}
                          />
                        </div>
                        <div
                          style={{ width: "calc(95% - 10px)" }}
                          className="form-group"
                        >
                          <Input
                            label="New Password"
                            type={"password"}
                            name="newPassword"
                            placeholder="Type Password"
                            onFocus={focusHandler}
                            error={errors?.newPassword}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.newPassword}
                            endAdornment
                            mandatory
                          />
                        </div>
                        <div className="input-copy-wrapper">
                          <div
                            style={{ width: "calc(100% - 10px)" }}
                            className="form-group"
                          >
                            <Input
                              label="Confirm Password"
                              type={"password"}
                              name="confirmNewPassword"
                              placeholder="Type Password"
                              onFocus={focusHandler}
                              error={errors?.confirmNewPassword}
                              onBlur={blurHandler}
                              onChange={changeHandler}
                              value={formValues?.confirmNewPassword}
                              endAdornment
                              mandatory
                            />
                          </div>
                          <CopyIcon
                            style={{
                              cursor: "pointer",
                              pointerEvents:
                                formValues?.confirmNewPassword?.length === 0
                                  ? "none"
                                  : "auto",
                              fill: isCopied ? "gray" : "",
                            }}
                            onClick={() => {
                              handleCopyInput(formValues?.confirmNewPassword);
                              setIsCopied(true);
                            }}
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
                <Button className="no-btn" onClick={handleClose}>
                  {cancelText ?? "Cancel"}
                </Button>
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

export default ResetPasswordModal;
