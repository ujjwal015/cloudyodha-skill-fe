import { useEffect, useRef, useState } from "react";
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
// import validateField from "../../../../../utils/validateField";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateProfileApi, updateProfileDegreeApi, updateProfileExperienceApi } from "../../../../../api/authApi";
import { endDateValidation, startDateValidation } from "../../../../../utils/validation/validationHelper";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const initalValuesExperience=[
{label: 'COMPANY NAME', value: '', key: 'companyName', type: 'text'},
{label: 'JOB TITLE', value: '', key: 'jobTitle', type: 'text'}, 
{label: 'DATE OF JOINING', value: '', type: 'date', key: 'dateOfJoining'}, 
{label: 'DATE OF RELIEVING', value: '', type: 'date', key: 'dateOfReceiving'},
{label: 'EXPERIENCE CERTIFICATE', value: '', type: 'file', key: 'experienceCertificate'}
]

const initalValuesDegree=[
{label: 'DEGREE', value: '', key: 'degree', type: 'text'},
{label: 'BRANCH/SPECIALIZATION', value: '', key: 'specilization', type: 'text'},
{label: 'YEAR OF JOINING', value: '', type: 'date', key: 'yearOfJoining'},
{label: 'YEAR OF COMPLETING', value: '', type: 'date', key: 'yearOfCompletion'},
{label: 'DEGREE CERTIFICATE', value: '', type: 'file', key: 'degreeCertificate'},
]

export default function ExperienceModel({ card, onClose, open, getUserProfile, userId,id,addExperience}) {
  const isExpreienceCard=card?.title==="Previous Experience";
  const isDegreeCard=card?.title==="Degrees & Certificates";
  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState([]);
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [permanentState, setPermanentState] = useState(currentState);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [errors, setErrors] = useState({});

  const [formValues, setFormValues] = useState(() => {
    if(addExperience){
      if(isExpreienceCard){
        return initalValuesExperience.reduce((acc, field) => {
          acc[field.key] = field?.value || "";
          return acc;
        }, {});;
      }
      else if(isDegreeCard){
        return initalValuesDegree.reduce((acc, field) => {
          acc[field.key] = field?.value || "";
          return acc;
        }, {});
      }
    }else{
      const matchingItem = card?.content?.find(item => item._id === userId);
      if (matchingItem) {
        return matchingItem?.contents?.reduce((acc, field) => {
          if(field.type==='file'){
            setUploadedFiles({
             [field.key]: field?.value
            })
          }
          acc[field.key] = field?.value || "";
          return acc;
        }, {});
      }
    }
    return {};
  });

  const validateField = (name, fieldValue) => {
    if (!fieldValue) {
      return "This field is required"; // Common error message for empty fields
    }

    switch (name) {
      case 'experienceCertificate':
      case 'degreeCertificate':
        if (!fieldValue) {
          return "Please upload a file";
        }
        break;
      case 'dateOfJoining':
        return startDateValidation(fieldValue, formValues['dateOfReceiving']);
      case 'dateOfReceiving':
        return endDateValidation(fieldValue, formValues['dateOfJoining']);
      case 'yearOfJoining':
        return startDateValidation(fieldValue, formValues['yearOfCompletion']);
      case 'yearOfCompletion':
        return endDateValidation(fieldValue, formValues['yearOfJoining']);
      default:
        break;
    }
    return ""; 
  };

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


  const handleChange = (e, key) => {
    const { name, value, files, checked, type } = e.target;
    const fieldValue = type === "file" ? files[0] : type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);
    // Update the errors state if validation fails
    if (fieldError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];  // Remove error if the field is valid
        return newErrors;
      });
    }

    if (type === 'file' && files[0]) {
      setUploadedFiles({
        ...uploadedFiles,
        [key]: files[0].name,
      });
    }
  
    // Update form values
    setFormValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };
  
  

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsCurrent(isChecked);

    if (isChecked) {
      setFormValues((prev) => ({
        ...prev,
        permanentStreet: prev.currentStreet,
        permanentCity: prev.currentCity,
        sameAsCurrentAddress: isChecked,
      }));
    } else {
      setFormValues((pre) => ({
        ...pre,
        sameAsCurrentAddress: false,
      }));
    }
  };

  const handleDateChange = (newDate, name) => {
    const formattedDate = dayjs(newDate).format("DD-MMM-YYYY");
    const fieldError = validateField(name, formattedDate); 
    if (fieldError) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];  // Remove error if the field is valid
        return newErrors;
      });
    }
    setFormValues((pre) => ({ ...pre, [name]: formattedDate }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    
    Object.keys(formValues).forEach((name) => {
      const field = formValues[name];
      const fieldError = validateField(name,field);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    if (Object.keys(formErrors).length === 0) {
      setErrors({});
      if(addExperience){
        if(isExpreienceCard){
          dispatch(
            updateProfileExperienceApi(
              id,
              userId,
              formValues,
              () => {},
              setErrors,
              setLoading,
              () => {},
              () => {},
              onClose
            )
          );
        }else if(isDegreeCard){
          if(isDegreeCard){
            dispatch(
              updateProfileDegreeApi(
                id,
                userId,
                formValues,
                () => {},
                setErrors,
                setLoading,
                () => {},
                () => {},
                onClose
              )
            );
          }
        }

      }else{
        if(isExpreienceCard){
          dispatch(
            updateProfileExperienceApi(
              id,
              userId,
              formValues,
              () => {},
              setErrors,
              setLoading,
              () => {},
              () => {},
              onClose
            )
          );
        }

        if(isDegreeCard){
          dispatch(
            updateProfileDegreeApi(
              id,
              userId,
              formValues,
              () => {},
              setErrors,
              setLoading,
              () => {},
              () => {},
              onClose
            )
          );
        }
      } 
      
    }else {
      setErrors(formErrors);
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
          {
            // for add model
            (addExperience)
            ?
            <div className="form-group-wrapper-profile">
              {
                  (isExpreienceCard)
                  ?
                  initalValuesExperience.map((field, index) => (
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
                          disableFuture
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
                          {field?.label}</label>
                        <input
                          mandatory
                          id={field?.key}
                          type="file"
                          name={field?.key}
                          onChange={(e) => handleChange(e, field?.key)}
                          style={uploadedFiles[field?.key]? {display: 'none' }:{display:'block'}}
                        />
                        {errors[field?.key] && (
                          <span className="error-text">{errors[field?.key]}</span>
                        )}
                        {uploadedFiles[field?.key] && (
                          <div className="uploaded-file-container-profile">
                            <p className="uploaded-file-name-profile">{uploadedFiles[field?.key]}</p>
                            <DeleteIcon onClick={() => handleDeleteFile(field?.key)} sx={{ cursor: 'pointer' }} />
                          </div>
                        )}

                      </div>

                    )}
                    </div>
                  ))
                  :
                  initalValuesDegree.map((field, index) => (
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
                            disableFuture
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
                          {field.label}</label>
                        <input
                          id={field?.key}
                          type="file"
                          name={field?.key}
                          onChange={(e) => handleChange(e, field?.key)}
                          style={uploadedFiles[field?.key]? {display: 'none' }:{display:'block'}}
                        />
                        {errors[field?.key] && (
                          <span className="error-text">{errors[field?.key]}</span>
                        )}
                        {uploadedFiles[field?.key] && (
                          <div className="uploaded-file-container-profile">
                            <p className="uploaded-file-name-profile">{uploadedFiles[field?.key]}</p>
                            <DeleteIcon onClick={() => handleDeleteFile(field?.key)} sx={{ cursor: 'pointer' }} />
                          </div>
                        )}
                      </div>
                    )}
                        
                      </div>
                  ))
                  
              }
            </div>
            :
            <div className="form-group-wrapper-profile">
              {card?.content?.map((item)=>{
              return <>
              {(userId===item._id)&&
                (
                  item.contents.map((field, index) => (
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
                          disableFuture
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
                          {field.label}</label>
                        <input
                          id={field?.key}
                          type="file"
                          name={field?.key}
                          onChange={(e) => handleChange(e, field?.key)}
                          style={uploadedFiles[field?.key]? {display: 'none' }:{display:'block'}}
                        />
                        {errors[field?.key] && (
                          <span className="error-text">{errors[field?.key]}</span>
                        )}
                        {uploadedFiles[field?.key] && (
                          <div className="uploaded-file-container-profile">
                            <p className="uploaded-file-name-profile">{uploadedFiles[field?.key]}</p>
                            <DeleteIcon onClick={() => handleDeleteFile(field?.key)} sx={{ cursor: 'pointer' }} />
                          </div>
                        )}
                      </div>

                    )}      
                    </div>
                  ))
                )
              }
              </>

              })}
              </div>
          }
          
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose}>
            Cancel
          </Button>
          <Button autoFocus onClick={handleSubmit}>
            {addExperience?'ADD':'UPDATE'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
