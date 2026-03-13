import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import dayjs from "dayjs";
import { ReactComponent as Step1Icon } from "./../../../assets/images/pages/student/registrationDetails/step1.svg";
import { ReactComponent as Step2Icon } from "./../../../assets/images/pages/student/registrationDetails/step2.svg";
import { ReactComponent as Step3Icon } from "./../../../assets/images/pages/student/registrationDetails/step3.svg";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import "../registrationDetails/style.css";
import { Button } from "@mui/material";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../redux/slicers/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { capturestudentBasicDetailsApi } from "../../../api/studentApi";
import Input from "../../../components/common/input";
import validateField from "../../../utils/validateField";
import SelectInput from "../../../components/common/SelectInput";
import { GENDER_MENUS, STEPS } from "../../../config/constants/projectConstant";
import DateInput from "../../../components/common/DateInput";
import "./style.css";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import {
  ASSESSMENT_PAGE,
  STUDENT_DETAILS_PAGE,
  STUDENT_GENERAL_INSTRUCTIONS,
} from "../../../config/constants/routePathConstants/student";
import {
  capitalizeFirstLetter,
  getDynamicRoute,
} from "../../../utils/projectHelper";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#2EA8DB",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#2EA8DB",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    background: "#fff",
    border: "2px solid #2EA8DB",
    "& svg path": {
      fill: "#2EA8DB",
    },
  }),
  ...(ownerState.completed && {
    background: "#2EA8DB",
  }),

  "& svg": {
    width: "24px",
  },
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <Step1Icon />,
    2: <Step2Icon />,
    3: <Step3Icon />,
    4: <ContactMailOutlinedIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const StudentBasicDetails = () => {
  const initialFormValues = {
    fatherName: "",
    gender: "",
    dob: "",
    aadharNo: "",
    mobile: "",
    student_email: "",
  };

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState("");
  const { userInfo } = useSelector(authSelector);
  const batchId = userInfo?.assessment?.batch_id;
  const schemeName = userInfo?.assessment?.scheme?.toLowerCase();
  const candidateId = userInfo?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questionId } = useParams();
  const IS_SSC_CANDIDATE = "ssc"?.includes(userInfo?.candidateType);

  React.useEffect(() => {
    const screenStep = JSON.parse(localStorage.getItem("screenStep"));
    if (screenStep) {
      if (
        screenStep?.allStepsCompletedStatus &&
        screenStep?.isResumeNavigate === false
      ) {
        navigate(`${STUDENT_DETAILS_PAGE}/${batchId}/${candidateId}`);
      } else {
        if (
          screenStep?.allStepsCompletedStatus &&
          screenStep?.isResumeNavigate === true
        ) {
          navigate(
            `${ASSESSMENT_PAGE}/${batchId}/${candidateId}/${questionId}`
          );
        }
      }
    }
  }, []);

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

    let newErrors = { ...errors };

    if (fieldError) {
      newErrors[name] = fieldError;
    } else {
      delete newErrors[name];
    }

    delete newErrors["student_email"];
    if (schemeName !== "mock") {
      delete newErrors["fatherName"];
    }

    setErrors(newErrors);

    setFormValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleDateChange = (newDate, name) => {
    const formattedDate = dayjs(newDate).format("DD-MMM-YYYY");
    const fieldError = validateField(name, formattedDate);

    setFormValues((pre) => ({ ...pre, [name]: formattedDate }));

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const handleByPass = () => {
    navigate(
      `${STUDENT_GENERAL_INSTRUCTIONS}/${batchId}/${candidateId}/${questionId}`
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });
    setErrors(formErrors);

    if (userInfo?.candidateType === "private") {
      delete formErrors?.mobile;
    }

    if (schemeName !== "mock") {
      delete formErrors?.fatherName;
    }
 
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const payload = {};

      for (let key in formValues) {
        const value = formValues[key];

        if (value !== "") {
          if (key === "student_email") {
            payload["email"] = value;
          } else if (key !== "email") {
            payload[key] = value;
          }
        }
      }

      dispatch(
        capturestudentBasicDetailsApi(
          payload,
          candidateId,
          setFormValues,
          initialFormValues,
          setLoading,
          "NAV_PATH",
          navigate,
          batchId,
          questionId
        )
      );
    }
  };
  const startOfDOB = dayjs("1947-08-15T00:00:00.000");
  const endOfDOB = dayjs("2010-12-31T00:00:00.000");
  return (
    <>
      <div className="section-layout hscreen">
        <Stepper
          alternativeLabel
          activeStep={4}
          connector={<ColorlibConnector />}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": { marginTop: "5px !important" },
                }}
                StepIconComponent={ColorlibStepIcon}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="card-wrapper">
          <div className="main-content registration-details">
            <div className="title">
              <div className="registration-title-text">
                <h1 className="title"> Basic Information </h1>
                <p className="sub-title">
                  Enter Your Basic information here to proceed test.
                </p>
              </div>
            </div>
            <div className="basic-detail-wrapper">
              <div className="form-group">
                <Input
                  label="Father Name"
                  type="text"
                  name="fatherName"
                  placeholder="Enter father name"
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  error={errors.fatherName}
                  onFocus={focusHandler}
                  value={formValues?.fatherName}
                  mandatory={schemeName === "mock"}
                  // hideExponants={true}
                />
              </div>

              <div className="form-group">
                <SelectInput
                  name="gender"
                  label="Gender"
                  placeHolder="Select gender"
                  options={GENDER_MENUS}
                  value={formValues?.gender}
                  handleChange={changeHandler}
                  error={errors?.gender}
                  mandatory={
                    !(schemeName === "FICSI-CSR" || schemeName === "NAPS")
                  }
                />
              </div>
              <div className="form-group">
                <DateInput
                  label="Date Of Birth"
                  name="dob"
                  value={formValues?.dob}
                  setFormValues={setFormValues}
                  error={errors?.dob}
                  onBlur={blurHandler}
                  handleDateChange={(e) => handleDateChange(e, "dob")}
                  mandatory={
                    !(schemeName === "FICSI-CSR" || schemeName === "NAPS")
                  }
                  disableFuture
                  minDate={startOfDOB}
                  maxDate={endOfDOB}
                />
              </div>
              <div className="form-group">
                <Input
                  label="Aadhar ID"
                  type="number"
                  name="aadharNo"
                  placeholder="Enter aadhar ID"
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  error={errors.aadharNo}
                  onFocus={focusHandler}
                  value={formValues?.aadharNo}
                  mandatory={
                    !(schemeName === "FICSI-CSR" || schemeName === "NAPS")
                  }
                  hideExponants={true}
                />
              </div>
              {IS_SSC_CANDIDATE && userInfo?.candidateType == "ssc" && (
                <>
                  <div className="form-group">
                    <Input
                      label="Mobile No."
                      type="number"
                      name="mobile"
                      placeholder="Enter contact no"
                      onBlur={blurHandler}
                      onChange={changeHandler}
                      error={errors.mobile}
                      onFocus={focusHandler}
                      value={formValues?.mobile}
                      mandatory={
                        !(schemeName === "FICSI-CSR" || schemeName === "NAPS")
                      }
                      hideExponants={true}
                    />
                  </div>
                  <div className="form-group">
                    <Input
                      label="Email ID"
                      type="text"
                      name="student_email"
                      placeholder="Enter email ID"
                      onBlur={blurHandler}
                      onChange={changeHandler}
                      error={errors?.student_email}
                      onFocus={focusHandler}
                      value={formValues?.student_email}
                      // mandatory
                      // hideExponants={true}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="action-btn_userProfile">
              <Button
                className={`light-blue-btn submit-btn`}
                variant="contained"
                onClick={
                  schemeName === "FICSI-CSR" || schemeName === "NAPS"
                    ? handleByPass
                    : handleSubmit
                }
                sx={{
                  width: "121px",
                  height: "40px",
                  marginTop: "25px",
                  textTransform: "unset",
                }}
                disabled={loading ? true : false}
              >
                {loading ? (
                  <PulseLoader size="10px" color="white" />
                ) : (
                  "Proceed"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentBasicDetails;
