import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { ReactComponent as Step1Icon } from "./../../../assets/images/pages/student/registrationDetails/step1.svg";
import { ReactComponent as Step2Icon } from "./../../../assets/images/pages/student/registrationDetails/step2.svg";
import { ReactComponent as Step3Icon } from "./../../../assets/images/pages/student/registrationDetails/step3.svg";
import CorrectWayImg from "./../../../assets/images/pages/student/registrationDetails/correct-img.png";
import WrongWayImg from "./../../../assets/images/pages/student/registrationDetails/blur-img.png";
import SideImg from "./../../../assets/images/pages/student/registrationDetails/side-img.png";

import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import "./style.css";
import Camera from "../camera";
import { useNavigate, useParams } from "react-router-dom";
import {
  ASSESSMENT_PAGE,
  STUDENT_DETAILS_PAGE,
  STUDENT_ID_CAPTURE,
} from "../../../config/constants/routePathConstants/student";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import { STEPS } from "../../../config/constants/projectConstant";

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
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
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
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
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

export default function FaceCapture() {
  const params = useParams();
  const navigate = useNavigate();
  const { batchId, candidateId, questionId } = params;
  const NAVIGATE_PATH = `${STUDENT_ID_CAPTURE}/${batchId}/${candidateId}/${questionId}`;

  React.useEffect(() => {
    const screenStep = JSON.parse(localStorage.getItem("screenStep"));
    if (screenStep) {
      if (screenStep?.allStepsCompletedStatus && screenStep?.isResumeNavigate === false) {
        navigate(`${STUDENT_DETAILS_PAGE}/${batchId}/${candidateId}`);
      } else {
        if (screenStep?.allStepsCompletedStatus && screenStep?.isResumeNavigate === true) {
          navigate(`${ASSESSMENT_PAGE}/${batchId}/${candidateId}/${questionId}`);
        }
      }
    }
  }, []);
  return (
    <div className="face-capture-container hscreen">
      <div className="inner-card-body">
        <Stepper alternativeLabel activeStep={2} connector={<ColorlibConnector />}>
          {STEPS?.map((label) => (
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

        <div className="inner-card">
          <div className="face-card">
            <h2>Instructions</h2>
            <div className="face-card-body">
              <ul>
                <li> Photo needs to be taken correctly,</li>
                <li>Light needs to be proper</li>
              </ul>

              <div className="image-quality">
                <div className="correct-image">
                  <h4>Correct Way</h4>
                  <img src={CorrectWayImg} alt="correct-way" />
                  <p>Face Straight</p>
                </div>
                <div className="wrong-image-side">
                  <h4>Wrong way</h4>
                  <div className="wrong-image">
                    <div className="wrong-image-box">
                      <img src={WrongWayImg} alt="wrong-way" />
                      <p>Blurred Image</p>
                    </div>
                    <div className="wrong-image-box">
                      <img src={SideImg} alt="side-img" />
                      <p>Side Face cut</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="face-card">
            <h2>Capture Face</h2>
            <div className="face-card-body">
              <p>Please centre yourself to the screen ond press "Capture Face" button.</p>
              <div className="camera-module-wrapper">
                <Camera captureBtnText="Capture Face" navigatePath={NAVIGATE_PATH} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
