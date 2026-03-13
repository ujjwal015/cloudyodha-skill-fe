import * as React from "react";
import "./style.css";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import validateField from "../../../utils/validateField";
import { useDispatch } from "react-redux";
import { createSingleRemarksApi } from "../../../api/authApi";
import { useEffect } from "react";
import { capitalizeFirstLetter } from "../../../utils/projectHelper";
import { Tooltip } from "@mui/material";
import EditIcon from "../../../assets/images/pages/leadManagement/edit.png";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs({
  id,
  getDemoUserList,
  remarks,
  isRemarks,
  setLoading,
  isFilterOpen,
}) {
  const initialFormValues = {
    remarks: "",
  };
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [formValues, setFormValues] = React.useState(initialFormValues);
  const [wordCount, setWordCount] = React.useState(0);
  const [isRemarkSave, setIsRemarkSave] = React.useState(false);
  const maxCharacter = 100;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    remarks?.length > 0 ? setIsRemarkSave(true) : setIsRemarkSave(false);
    remarks?.length > 0
      ? setFormValues({ remarks: remarks })
      : setFormValues(initialFormValues);
    setOpen(false);
  };

  useEffect(() => {
    setFormValues({
      remarks: remarks,
    });
    setWordCount(countWords(remarks?.trimStart()));
    setIsRemarkSave(isRemarks);
  }, [remarks, isRemarks]);

  useEffect(() => {
    remarks?.length > 0 && isRemarks
      ? setIsRemarkSave(true)
      : setIsRemarkSave(false);
  }, []);

  const countWords = (count) => {
    if (!count) {
      return 0;
    } else {
      count = count.replace(/\s+/g, " ");
      count = count.trim();
      return count.split(" ").length;
    }
  };

  const changeHandler = (event) => {
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

    setWordCount(countWords(fieldValue?.trimStart()));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
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
      const formData = {
        demoId: id,
        remark: formValues?.remarks,
      };
      dispatch(
        createSingleRemarksApi(
          setLoading,
          formData,
          getDemoUserList,
          setIsRemarkSave,
          isRemarkSave
        )
      );
    }
  };

  const clearFormValues = () => {
    remarks && formValues?.remarks && remarks?.length > 0
      ? setFormValues({ remarks: remarks })
      : setFormValues(initialFormValues);
    remarks && remarks?.length > 0
      ? setIsRemarkSave(true)
      : setIsRemarkSave(false);
    setWordCount(0);
    setOpen(false);
  };
  const handleEditRemarks = (e) => {
    setIsRemarkSave(false);
  };

  return (
    <div>
      {isRemarks && remarks?.length > 10 ? (
        <Tooltip title={remarks || "NA"} arrow>
          <div
            onClick={handleClickOpen}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              maxWidth: "100px", // Set a maximum width for the cell
            }}
          >
            {capitalizeFirstLetter(remarks || "NA")}
          </div>
        </Tooltip>
      ) : (
        <div onClick={handleClickOpen}>
          {capitalizeFirstLetter(remarks || "Write your remarks ")}
          <img src={EditIcon} alt="edi-icon" height="20px" width="20px" />
          {/* <BorderColorIcon/> */}
        </div>
      )}

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="dialog-box-title">
          Remarks
        </DialogTitle>

        <div className="sub-title-wrapper">
          <h3 className="sub-title">
            {remarks && isRemarkSave && isRemarks ? "Update" : "Write"} your
            remarks
          </h3>
          {/* {remarks && isRemarkSave && isRemarks && <EditIcon onClick={handleEditRemarks} />} */}
        </div>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <textarea
            id="remarks"
            rows="4"
            cols="50"
            name="remarks"
            placeholder="Write your remarks...."
            value={formValues?.remarks}
            onChange={changeHandler}
            readOnly={isRemarkSave}
            minLength={10}
            maxLength={maxCharacter}
          ></textarea>
        </DialogContent>
        <div className="word-count">{`${
          formValues?.remarks?.trim()?.length || 0
        }/${maxCharacter}`}</div>
        <div className="remarks-submit-btn-wrapper">
          {remarks && isRemarkSave && isRemarks && (
            <button id="remark-cancel-btn" onClick={handleEditRemarks}>
              Edit
            </button>
          )}
          <button
            id="remark-submit-btn"
            style={{
              backgroundColor:
                isRemarkSave || formValues?.remarks === undefined
                  ? "lightgray"
                  : formValues?.remarks?.trim()?.length < 1
                  ? "lightgray"
                  : "",
            }}
            disabled={
              isRemarkSave || formValues?.remarks === undefined
                ? true
                : formValues?.remarks?.trim()?.length < 1
                ? true
                : false
            }
            onClick={handleSubmit}
          >
            {"Save"}
          </button>
        </div>
      </BootstrapDialog>
    </div>
  );
}
