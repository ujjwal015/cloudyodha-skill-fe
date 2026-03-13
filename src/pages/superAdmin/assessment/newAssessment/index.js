import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";
import "../style.css";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import CreateAssessment from "./createAssessment/index";
import SelectQuestions from "./addQuestions";
import PreviewAssessment from "./previewAssessment/index";
import {
  SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE,
  SUPER_ADMIN_CREATE_ASSESSMENT_PAGE,
} from "../../../../config/constants/routePathConstants/superAdmin";

const steps = ["Create New Assessment", "Add Questions", "Preview & Create"];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 17,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#00B2FF",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#00B2FF",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 10,
  },
}));

const stepLabels = {
  [`& .Mui-active.css-1hv8oq8-MuiStepLabel-label`]: {
    color: "#00B2FF",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "18px",
    lineHeight: "23px",
  },
  [`& .Mui-completed.css-1hv8oq8-MuiStepLabel-label`]: {
    color: "#00B2FF",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "18px",
    lineHeight: "23px",
  },
  [`& .css-1hv8oq8-MuiStepLabel-label`]: {
    color: "#4F547B",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "18px",
    lineHeight: "23px",
  },

  [`& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-active`]: {
    color: "#00B2FF",
    fontWeight: "600",
    borderRadius: "50%",
    border: "3px solid #00B2FF",
    p: "4px",
  },
  [`& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-completed`]: {
    color: "#00B2FF",
    fontWeight: "600",
    borderRadius: "50%",
    border: "3px solid #00B2FF",
    p: "4px",
  },
  [`& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root`]: {
    color: "#C8D6D9",
    fontWeight: "600",
    borderRadius: "50%",
    border: "3px solid #C8D6D9",
    p: "4px",
  },
  [`& .css-vnkopk-MuiStepLabel-iconContainer.MuiStepLabel-alternativeLabel`]: {
    zIndex: "1",
  },
};

const AssesmentSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const StepperIcon = ({ num, stepActive, completed }) => {
    return (
      <span
        className={`${
          stepActive || completed ? "Mui-active" : "Mui-disabled"
        } MuiStepLabel-iconContainer MuiStepLabel-alternativeLabel css-vnkopk-MuiStepLabel-iconContainer`}
      >
        <svg
          className={`${
            stepActive || completed ? "Mui-active" : ""
          } MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiStepIcon-root css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root`}
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="12"></circle>
          <text
            className="MuiStepIcon-text css-117w1su-MuiStepIcon-text"
            x="12"
            y="12"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {num}
          </text>
        </svg>
      </span>
    );
  };
  const stepsId = location?.pathname.includes(SUPER_ADMIN_CREATE_ASSESSMENT_PAGE)
    ? 0
    : location?.pathname.includes(SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE)
    ? 1
    : 2;

  const Steps = {
    0: <CreateAssessment setActiveStep={setActiveStep} />,
    1: <SelectQuestions setActiveStep={setActiveStep} />,
    2: <PreviewAssessment setActiveStep={setActiveStep} />,
  };

  const ColorlibStepIcon = ({ icon, active, completed }) => {
    const icons = {
      1: <StepperIcon num={1} stepActive={active} completed={completed} />,
      2: <StepperIcon num={2} stepActive={active} completed={completed} />,
      3: <StepperIcon num={3} stepActive={active} completed={completed} />,
    };
    return icons[String(icon)];
  };

  return (
    <div className="main-content">
      <Box
        sx={{
          maxWidth: "100%",
          minHeight: "95vh",
        }}
      >
        <Stepper sx={stepLabels} activeStep={activeStep} alternativeLabel connector={<QontoConnector />}>
          {steps.map((label) => {
            return (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {Steps[stepsId]}
      </Box>
    </div>
  );
};

export default AssesmentSteps;
