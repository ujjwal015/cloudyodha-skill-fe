import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { ReactComponent as Step1Icon } from "./../../../assets/images/pages/student/registrationDetails/step1.svg";
import { ReactComponent as Step2Icon } from "./../../../assets/images/pages/student/registrationDetails/step2.svg";
import { ReactComponent as Step3Icon } from "./../../../assets/images/pages/student/registrationDetails/step3.svg";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import "./style.css";
import { Button } from "@mui/material";
import { PulseLoader } from "react-spinners";
import UserProfile from "../../../assets/images/pages/student/registrationDetails/registration_profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { navigate } from "../../../utils/projectHelper";
import { authSelector } from "../../../redux/slicers/authSlice";
import { SingleTextSkeletonLoader } from "../../../components/common/skeleton";
import { ASSESSMENT_PAGE } from "../../../config/constants/routePathConstants/student";
import { getAssessmentApi, startAssessmentApi } from "../../../api/studentApi";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import { STEPS } from "../../../config/constants/projectConstant";
import { studentSelector } from "../../../redux/slicers/studentSlice";
import useFullscreen from "../../../hooks/useFullscreen";

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

const RegistrationDetails = () => {
  const { enterFullscreen } = useFullscreen();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  const { userInfo } = useSelector(authSelector);
  const isAssessmentSubmitted = JSON.parse(
    localStorage.getItem("isAssessmentSubmitted")
  );
  const batchId = userInfo?.assessment?.batch_id;
  const candidateId = userInfo?._id;
  const studentName = userInfo?.name?.split(" ");
  let firstName = studentName?.[0];
  let lastName = studentName?.[1];
  const mobile = userInfo?.mobile;
  const emailId = userInfo?.email;
  const jobRole = userInfo?.assessment?.jobRole;
  const dispatch = useDispatch();
  useEffect(() => {
    const screenStep = JSON.parse(localStorage.getItem("screenStep"));
    if (screenStep) {
      if (screenStep?.isResumeNavigate && screenStep?.allStepsCompletedStatus) {
        dispatch(
          getAssessmentApi(
            setLoading,
            batchId,
            candidateId,
            "",
            navigate,
            `${ASSESSMENT_PAGE}/${batchId}/${candidateId}`
          )
        );
      }
    }
  }, []);

  const handleProceed = () => {
    dispatch(
      startAssessmentApi(
        setLoading,
        batchId,
        candidateId,
        navigate,
        "NAV_PATH",
        enterFullscreen
      )
    );
  };

  const handleResume = () => {
    setLoading(true);
    const screenStep = JSON.parse(localStorage.getItem("screenStep"));
    if (screenStep) {
      screenStep.isResumeNavigate = true;
      localStorage.setItem("screenStep", JSON.stringify(screenStep));
    }
    dispatch(
      getAssessmentApi(
        setLoading,
        batchId,
        candidateId,
        "",
        navigate,
        `${ASSESSMENT_PAGE}/${batchId}/${candidateId}`,
        enterFullscreen
      )
    );
  };

  const registrationDetails = [
    {
      label: "First Name",
      value: firstName?.toLowerCase() || "NA",
      className: "captail",
      candidateType: userInfo?.candidateType,
    },
    {
      label: "Last Name",
      value: lastName?.toLowerCase() || "NA",
      className: "captail",
      candidateType: userInfo?.candidateType,
    },
    {
      label: "Gender",
      value: userInfo?.gender?.toLowerCase() || "NA",
      className: "captail",
      candidateType: userInfo?.candidateType,
    },
    {
      label: "Mobile No.",
      value: mobile || "NA",
      className: "captail",
      candidateType: userInfo?.candidateType,
    },
    {
      label: "Email ID",
      value: emailId || "NA",
      className: "lower",
      candidateType: userInfo?.candidateType,
    },
    {
      label: "Assessment Name",
      value: jobRole?.toLowerCase() || "NA",
      className: "captail",
      candidateType: userInfo?.candidateType,
    },
    {
      label: "Batch ID",
      value: userInfo?.batchDetails?.batchId || "NA",
      className: "lower",
      candidateType: userInfo?.candidateType,
    },
    {
      label: "Aadhar Card No",
      value: userInfo?.aadharNo || "NA",
      className: "captail",
      candidateType: userInfo?.candidateType,
    },
  ];

  let modifiedRegistrationDetails = [];

  if (userInfo?.candidateType === "private") {
    modifiedRegistrationDetails = registrationDetails.filter(
      (item) => item.label !== "Aadhar Card No"
    );
    if (userInfo?.aadharNo) {
      modifiedRegistrationDetails.push({
        label: "Aadhar Card No",
        value: userInfo.aadharNo,
        className: "captail",
        candidateType: userInfo?.candidateType,
      });
    }
  } else if (userInfo?.candidateType === "ssc") {
    modifiedRegistrationDetails = registrationDetails.filter(
      (item) =>
        item.label !== "Aadhar Card No" &&
        item.label !== "Email ID" &&
        item.label !== "Mobile No."
    );
    if (userInfo?.aadharNo) {
      modifiedRegistrationDetails.push({
        label: "Aadhar Card No",
        value: userInfo.aadharNo,
        className: "captail",
        candidateType: userInfo?.candidateType,
      });
    }
    if (mobile && mobile !== "") {
      modifiedRegistrationDetails.push({
        label: "Mobile No.",
        value: mobile,
        className: "captail",
        candidateType: userInfo?.candidateType,
      });
    }
    if (emailId && emailId !== "") {
      modifiedRegistrationDetails.push({
        label: "Email ID",
        value: emailId,
        className: "lower",
        candidateType: userInfo?.candidateType,
      });
    }
  } else {
    modifiedRegistrationDetails = registrationDetails;
    if (userInfo?.aadharNo) {
      modifiedRegistrationDetails.push({
        label: "Aadhar Card No",
        value: userInfo.aadharNo,
        className: "captail",
        candidateType: userInfo?.candidateType,
      });
    }
    if (mobile && mobile !== "") {
      modifiedRegistrationDetails.push({
        label: "Mobile No.",
        value: mobile,
        className: "captail",
        candidateType: userInfo?.candidateType,
      });
    }
    if (emailId && emailId !== "") {
      modifiedRegistrationDetails.push({
        label: "Email ID",
        value: emailId,
        className: "lower",
        candidateType: userInfo?.candidateType,
      });
    }
  }

  // Function to check if an object with the same label exists
  const hasLabel = (label) =>
    modifiedRegistrationDetails.some((item) => item.label === label);

  // Add objects for fields that exist and are not already present
  if (firstName && !hasLabel("First Name")) {
    modifiedRegistrationDetails.push({
      label: "First Name",
      value: firstName.toLowerCase(),
      className: "captail",
      candidateType: userInfo?.candidateType,
    });
  }
  if (lastName && !hasLabel("Last Name")) {
    modifiedRegistrationDetails.push({
      label: "Last Name",
      value: lastName.toLowerCase(),
      className: "captail",
      candidateType: userInfo?.candidateType,
    });
  }
  if (userInfo?.gender && !hasLabel("Gender")) {
    modifiedRegistrationDetails.push({
      label: "Gender",
      value: userInfo.gender.toLowerCase(),
      className: "captail",
      candidateType: userInfo?.candidateType,
    });
  }
  if (jobRole && !hasLabel("Assessment Name")) {
    modifiedRegistrationDetails.push({
      label: "Assessment Name",
      value: jobRole.toLowerCase(),
      className: "captail",
      candidateType: userInfo?.candidateType,
    });
  }
  if (userInfo?.batchDetails?.batchId && !hasLabel("Batch ID")) {
    modifiedRegistrationDetails.push({
      label: "Batch ID",
      value: userInfo.batchDetails.batchId,
      className: "lower",
      candidateType: userInfo?.candidateType,
    });
  }

  const screenStep = JSON.parse(localStorage.getItem("screenStep"));
  return (
    <>
      <div className="section-layout hscreen">
        <Stepper
          alternativeLabel
          activeStep={screenStep?.allStepsCompletedStatus ? 4 : 1}
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
                <h1> Registration Details </h1>
              </div>
            </div>
            <div className="registration">
              <div className="registration-wrapper">
                <div className="registration-list-wrap">
                  {modifiedRegistrationDetails?.map((detail, index) => (
                    <div key={index} className="registration-list">
                      <span className="registration-label">{detail.label}</span>
                      {textLoading ? (
                        <SingleTextSkeletonLoader />
                      ) : (
                        <span className={`input-text ${detail.className}`}>
                          {detail.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="img-wrapper">
                <div className="img-upload">
                  <div className="img_container">
                    <img src={UserProfile} alt="logo" />
                  </div>
                </div>
              </div>
            </div>
            {!isAssessmentSubmitted && (
              <div className="action-btn_userProfile">
                {userInfo && btnLoading ? (
                  <PulseLoader size="10px" color="white" />
                ) : screenStep?.allStepsCompletedStatus ? (
                  <Button
                    className={`light-blue-btn submit-btn`}
                    variant="contained"
                    onClick={handleResume}
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
                      "Resume"
                    )}
                  </Button>
                ) : (
                  <Button
                    className={`light-blue-btn submit-btn`}
                    variant="contained"
                    onClick={handleProceed}
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
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationDetails;
