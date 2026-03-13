import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DeleteIcon from '@mui/icons-material/Delete';
import "./index.css";
import SelectInput from "../../../../../components/common/SelectInput";
import Input from "../../../../../components/common/input";
import DateInput from "../../../../../components/common/DateInput";
import dayjs from "dayjs";
import validateField from "../../../../../utils/validateField";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateProfileApi, updateProfileImageApi, updateUseDocumentsApi } from "../../../../../api/authApi";
import { errorToast } from "../../../../../utils/projectHelper";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Model({ card, onClose, open, getUserProfile, userId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState([]);
  const [permanentState, setPermanentState] = useState(currentState);
  const [errors, setErrors] = useState({});
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  const [formValues, setFormValues] = useState(
    card.content.reduce((acc, field) => {
      acc[field.key] = field.value || "";
      return acc;
    }, {})
  );

  const handleDeleteFile = (key) => {
    const updatedFiles = { ...uploadedFiles };
    delete updatedFiles[key];
    setUploadedFiles(updatedFiles);

    const updatedFormValues = { ...formValues };
    updatedFormValues[key] = "";
    setFormValues(updatedFormValues);
  };

  useEffect(() => {
    const currentState = card?.content
      .filter((item) => item.options)
      .reduce((acc, item) => {
        acc[item.key] = item.options.map((option) => option);
        return acc;
      }, {});

    setCurrentState(currentState?.currentState);
    setPermanentState(currentState?.permanentState);
  }, [card]);

  const isAddressCard = card?.title === "Address";

  useEffect(() => {
    const updatedFiles = {};

    Object.keys(formValues).forEach((key) => {
      if (formValues[key]) {
        updatedFiles[key] = formValues[key];
      }
    });
    setUploadedFiles((prev) => ({
      ...prev,
      ...updatedFiles,
    }));

  }, []);

  const handleChange = (e, key) => {
    const { name, value, files, checked, type } = e.target;
    const fieldValue =
      type === "file" ? files[0] : type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }

    if (type === 'file' && files[0]) {
      setUploadedFiles({
        ...uploadedFiles,
        [key]: files[0].name,
      });
    }
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };


  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsCurrent(isChecked);

    if (isChecked) {
      setFormValues((prev) => ({
        ...prev,
        permanentStreet: prev.currentStreet,
        permanentState: prev.currentState,
        permanentCity: prev.currentCity,
        permanentPinCode: prev.currentPinCode,
        sameAsCurrentAddress: isChecked,
      }));
    } else {
      setFormValues((pre) => ({
        ...pre,
        sameAsCurrentAddress: false,
      }));
    }
  };
  const startOfDOB = dayjs("1947-08-15T00:00:00.000");
  const endOfDOB = dayjs("2006-12-31T00:00:00.000");
  const handleDateChange = (newDate, name) => {
    const formattedDate = dayjs(newDate).format("DD-MMM-YYYY");
    const fieldError = validateField(name, formattedDate);

    if (fieldError) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
    setFormValues((pre) => ({ ...pre, [name]: formattedDate }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
        errorToast(formErrors[name])
      }
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      if (formValues?.currentState) {
        const permanentAddress = {
          address1: formValues?.permanentStreet,
          state: formValues?.permanentState,
          city: formValues?.permanentCity,
          pinCode: formValues?.permanentPinCode,
        };
        const currentAddress = {
          address1: formValues?.currentStreet,
          state: formValues?.currentState,
          city: formValues?.currentCity,
          pinCode: formValues?.currentPinCode,
        };
        const payload = {
          permanentAddress,
          currentAddress,
          sameAsCurrentAddress: sameAsCurrent,
        };

        dispatch(
          updateProfileApi(
            userId,
            payload,
            () => { },
            setErrors,
            setLoading,
            () => { },
            () => { },
            onClose
          )
        );
      } else if (Object.keys(formValues).includes('panCard') ||
        Object.keys(formValues).includes('aadharCard')) {
        const formData = new FormData();
        Object.keys(formValues)?.map((item) => {
          formData.append(item, formValues[item])
        })

        dispatch(
          updateUseDocumentsApi(
            userId,
            formData,
            setLoading,
            setErrors,
            onClose

          )
        );



      } else {
        delete formValues["sameAsCurrentAddress"];
        const payload = { ...formValues };

        dispatch(
          updateProfileApi(
            userId,
            payload,
            () => { },
            setErrors,
            setLoading,
            () => { },
            () => { },
            onClose
          )
        );
      }
    }
  };

  return (
    <>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {card?.title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {!isAddressCard ? (
            <div className="form-group-wrapper">
              {card?.content?.map((field, index) => {

                return (
                  <div key={index} className="form-group-profile">
                    {field?.type === "text" && (
                      <Input
                        label={field?.label}
                        name={field?.key}
                        placeholder={`Enter ${field?.label}`}
                        error={errors[field?.key]}
                        onChange={handleChange}
                        value={formValues[field?.key]}
                        disabled={
                          field.key === "email" || field.key === "fullName"
                            ? true
                            : false
                        }
                        mandatory
                      />
                    )}

                    {field?.type === "date" && (
                      <DateInput
                        label={field?.label}
                        name={field?.key}
                        mandatory
                        value={formValues[field?.key]}
                        error={errors[field?.key]}
                        placeholder={`Select ${formValues[field?.label]}`}
                        handleDateChange={(e) => handleDateChange(e, field?.key)}
                        disableFuture={field?.key === 'dob' ? true : false}
                        minDate={startOfDOB}
                        maxDate={endOfDOB}
                      />
                    )}
                    {field?.type === "select" && (
                      <SelectInput
                        name={field?.key}
                        label={field?.label}
                        placeHolder={`Select ${field?.label}`}
                        options={field?.options}
                        error={errors[field?.key]}
                        value={formValues[field?.key]}
                        handleChange={handleChange}
                        mandatory
                      />
                    )}

                    {field?.type === "file" && (
                      <div className="file-upload-wrapper">
                        <label
                          htmlFor={field?.key}
                          className="file-upload-label">
                          {field?.key === "aadharCard"
                            ? "Upload Aadhar Card"
                            : "Upload Pan Card"}</label>
                        <input
                          id={field?.key}
                          type="file"
                          name={field?.key}
                          onChange={(e) => handleChange(e, field?.key)}
                          style={{ display: 'none' }}
                        />

                        {uploadedFiles[field?.key] && (
                          <div className="uploaded-file-container">
                            <p className="uploaded-file-name">{uploadedFiles[field?.key]}</p>
                            <DeleteIcon onClick={() => handleDeleteFile(field?.key)} sx={{ cursor: 'pointer' }} />
                          </div>
                        )}

                      </div>

                    )}
                  </div>
                )
              }
              )}
            </div>
          ) : (
            <>
              <div className="address-section">
                <div className="current-address">
                  <Typography variant="h6">Current Address</Typography>
                  <div>
                    <Input
                      label="Address 1"
                      name="currentStreet"
                      placeholder="Select street"
                      value={formValues?.currentStreet}
                      onChange={handleChange}
                      error={errors?.currentStreet}
                      mandatory
                    />
                  </div>

                  <div>
                    <SelectInput
                      name={"currentState"}
                      label="State"
                      placeHolder={`Select state`}
                      options={currentState}
                      error={errors?.currentState}
                      value={formValues?.currentState || ""}
                      handleChange={handleChange}
                      mandatory
                    />
                  </div>
                  <div>
                    <Input
                      label="City"
                      name="currentCity"
                      placeholder="Select city"
                      value={formValues?.currentCity}
                      onChange={handleChange}
                      error={errors?.currentCity}
                      mandatory
                    />
                  </div>

                  <div>
                    <Input
                      label="Pin Code"
                      name="currentPinCode"
                      placeholder="Select pin code"
                      value={formValues?.currentPinCode}
                      onChange={handleChange}
                      error={errors?.currentPinCode}
                      mandatory
                    />
                  </div>
                </div>
                <div className="permanent-address">
                  <Typography variant="h6">Permanent Address</Typography>
                  <div>
                    <Input
                      label="Address 1"
                      name="permanentStreet"
                      placeholder="Select street"
                      value={formValues?.permanentStreet}
                      onChange={handleChange}
                      error={errors?.permanentStreet}
                      disabled={sameAsCurrent}
                      mandatory
                    />
                  </div>

                  <div>
                    <SelectInput
                      name={"permanentState"}
                      label="State"
                      placeHolder={`Select state`}
                      options={permanentState}
                      error={errors?.permanentState}
                      value={formValues?.permanentState || ""}
                      handleChange={handleChange}
                      disabled={sameAsCurrent}
                      mandatory
                    />
                  </div>

                  <div>
                    <Input
                      label="City"
                      name="permanentCity"
                      placeholder="Select city"
                      value={formValues.permanentCity}
                      onChange={handleChange}
                      error={errors.permanentCity}
                      disabled={sameAsCurrent}
                      mandatory
                    />
                  </div>

                  <div>
                    <Input
                      label="Pin Code"
                      name="permanentPinCode"
                      placeholder="Select pin code"
                      value={formValues.permanentPinCode}
                      onChange={handleChange}
                      error={errors.permanentPinCode}
                      disabled={sameAsCurrent}
                      mandatory
                    />
                  </div>
                </div>
              </div>

              <div className="same-as-current">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    checked={sameAsCurrent}
                    label="Same as Current Address"
                    onChange={(e) => handleCheckboxChange(e)}
                  // required={true}
                  // error={!sameAsCurrent}
                  />
                </FormGroup>
              </div>
            </>
          )}

          {/* {} */}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose}>
            Cancel
          </Button>
          <Button autoFocus onClick={handleSubmit}>
            Update
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
