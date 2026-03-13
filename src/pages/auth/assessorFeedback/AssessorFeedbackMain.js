import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Paper, Typography, Box, Grid, Divider, Alert } from "@mui/material";
import { PulseLoader } from "react-spinners";
import Input, { RadioButton } from "../../../components/common/input";
import DateInput from "../../../components/common/DateInput";
import "./style.css";
import { getFeedbackBatchApi, submitAssessorFeedbackApi } from "../../../api/authApi";

export default function AssessorFeedbackMain() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { feedbackBatchDetails } = useSelector((state) => state.auth);

  const [feedbackData, setFeedbackData] = useState({
    // Assessment Details
    assessorName: "",
    assessmentDate: "",
    batchId: "",
    jobRole: "",
    trainingPartnerName: "",
    trainingCentreAddress: "",
    
    // Centre Coordination & Readiness
    spocAvailable: "",
    spocRemarks: "",
    assessmentCenterLocation:"",
    centreReady: "",
    centreReadyRemarks: "",
    geoLocationShared: "",
    candidatesPresent: "",
    candidateIssuesCount: "",
    
    // Infrastructure & Logistics
    toolsAvailable: "",
    toolsSpecify: "",
    classroomsSuitable: "",
    
    // Assessment Conduct
    assessmentOnTime: "",
    aadhaarIssues: "",
    aadhaarDescription: "",
    theoryExamSmooth: "",
    theoryExamComments: "",
    
    // Training Provider Conduct
    pressureMalpractice: "",
    pressureDetails: "",
    manipulationRequest: "",
    manipulationDetails: "",
    
    // Other Remarks
    otherRemarks: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getFeedbackBatchApi(token, 'assessor'));
    }
  }, [token]);

  useEffect(() => {
    if (feedbackBatchDetails) {
      setFeedbackData(prevData => ({
        ...prevData,
        assessorName: feedbackBatchDetails.assessorName || "",
        trainingPartnerName: feedbackBatchDetails.trainingPartnerName || "",
        trainingCentreAddress: feedbackBatchDetails.trainingCentreAddress || "",
        jobRole: feedbackBatchDetails.jobRole || "",
        assessmentDate: feedbackBatchDetails.assessmentDate 
          ? new Date(feedbackBatchDetails.assessmentDate).toISOString().split('T')[0]
          : "",
        batchId: feedbackBatchDetails.batchId || "",
      }));
      
      // Check if feedback has already been submitted
      if (feedbackBatchDetails.alreadySubmitted) {
        setAlreadySubmitted(true);
      }
    }
  }, [feedbackBatchDetails]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedbackData({ ...feedbackData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setFeedbackData({ ...feedbackData, [name]: value });
    
    // Clear error when user makes selection
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleDateChange = (date) => {
    setFeedbackData({ 
      ...feedbackData, 
      assessmentDate: date ? date.format("YYYY-MM-DD") : "" 
    });
    
    // Clear error when user selects date
    if (errors.assessmentDate) {
      setErrors({ ...errors, assessmentDate: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Assessment Details validation
    if (!feedbackData.assessorName.trim()) {
      newErrors.assessorName = "Assessor Name is required";
    }
    if (!feedbackData.assessmentDate) {
      newErrors.assessmentDate = "Assessment Date is required";
    }
    if (!feedbackData.batchId.trim()) {
      newErrors.batchId = "Batch ID(s) is required";
    }
    if (!feedbackData.jobRole.trim()) {
      newErrors.jobRole = "Job Role is required";
    }
    if (!feedbackData.trainingPartnerName.trim()) {
      newErrors.trainingPartnerName = "Training Partner Name is required";
    }
    if (!feedbackData.trainingCentreAddress.trim()) {
      newErrors.trainingCentreAddress = "Training Centre Address is required";
    }

    // Radio button validations
    const radioFields = [
      'spocAvailable', 'assessmentCenterLocation','centreReady', 'geoLocationShared', 'candidatesPresent',
      'toolsAvailable', 'classroomsSuitable', 'assessmentOnTime',
      'aadhaarIssues', 'theoryExamSmooth', 'pressureMalpractice', 'manipulationRequest'
    ];

    radioFields.forEach(field => {
      if (!feedbackData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Conditional field validations - validate details/remarks/comments when required
    if (feedbackData.spocAvailable === "No" && !feedbackData.spocRemarks?.trim()) {
      newErrors.spocRemarks = "Remarks are required when SPOC was not available/cooperative";
    }

    if (feedbackData.centreReady === "No" && !feedbackData.centreReadyRemarks?.trim()) {
      newErrors.centreReadyRemarks = "Remarks are required when centre was not ready on time";
    }

    if (feedbackData.candidatesPresent === "No" && !feedbackData.candidateIssuesCount?.trim()) {
      newErrors.candidateIssuesCount = "Number of issues is required when candidates were not present properly";
    }

    if (feedbackData.toolsAvailable === "No" && !feedbackData.toolsSpecify?.trim()) {
      newErrors.toolsSpecify = "Details are required when tools/equipment were not available";
    }

    if (feedbackData.aadhaarIssues === "Yes" && !feedbackData.aadhaarDescription?.trim()) {
      newErrors.aadhaarDescription = "Description is required when there were Aadhaar authentication issues";
    }

    if (feedbackData.theoryExamSmooth === "No" && !feedbackData.theoryExamComments?.trim()) {
      newErrors.theoryExamComments = "Comments are required when theory exam was not conducted smoothly";
    }

    if (feedbackData.pressureMalpractice === "Yes" && !feedbackData.pressureDetails?.trim()) {
      newErrors.pressureDetails = "Details are required when there was pressure/malpractice/misconduct";
    }

    if (feedbackData.manipulationRequest === "Yes" && !feedbackData.manipulationDetails?.trim()) {
      newErrors.manipulationDetails = "Details are required when there was manipulation request";
    }

    // Validate other remarks word count (limit to 200 words)
    if (feedbackData.otherRemarks) {
      const wordCount = feedbackData.otherRemarks.trim().split(/\s+/).length;
      if (wordCount > 200) {
        newErrors.otherRemarks = "Other remarks must be limited to 200 words";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const data = {
      assessorName: feedbackData.assessorName,
      assessmentDate: feedbackData.assessmentDate,
      batchId: feedbackData.batchId,
      jobRole: feedbackData.jobRole,
      trainingPartnerName: feedbackData.trainingPartnerName,
      trainingCentreAddress: feedbackData.trainingCentreAddress,
      assessmentCenterLocation:feedbackData.assessmentCenterLocation,
      spocAvailable: feedbackData.spocAvailable,
      spocRemarks: feedbackData.spocRemarks,
      centreReady: feedbackData.centreReady,
      centreReadyRemarks: feedbackData.centreReadyRemarks,
      geoLocationShared: feedbackData.geoLocationShared,
      candidatesPresent: feedbackData.candidatesPresent,
      candidateIssuesCount: feedbackData.candidateIssuesCount,
      toolsAvailable: feedbackData.toolsAvailable,
      toolsSpecify: feedbackData.toolsSpecify,
      classroomsSuitable: feedbackData.classroomsSuitable,
      assessmentOnTime: feedbackData.assessmentOnTime,
      aadhaarIssues: feedbackData.aadhaarIssues,
      aadhaarDescription: feedbackData.aadhaarDescription,
      theoryExamSmooth: feedbackData.theoryExamSmooth,
      theoryExamComments: feedbackData.theoryExamComments,
      pressureMalpractice: feedbackData.pressureMalpractice,
      pressureDetails: feedbackData.pressureDetails,
      manipulationRequest: feedbackData.manipulationRequest,
      manipulationDetails: feedbackData.manipulationDetails,
      otherRemarks: feedbackData.otherRemarks,
    }

    dispatch(submitAssessorFeedbackApi(data, setLoading, token));
    
  };

  // Radio button options
  const yesNoOptions = [
    { name: "Yes", label: "Yes" },
    { name: "No", label: "No" }
  ];

  return (
    <div className="feedback-container">
      <Paper elevation={3} className="feedback-paper">
        <Typography variant="h4" className="form-title">
          Assessor Feedback Form
        </Typography>

        {alreadySubmitted || !token ? (
          <Alert severity="info" style={{ marginBottom: "20px" }}>
            {!token ? "URL is invalid" : "You have already submitted feedback for this batch."}
          </Alert>
        ) : (
          <div>
        {/* Assessment Details */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            Assessment Details
          </Typography>
          <Divider className="section-divider" />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className="form-group">
                <Input
                  label="Assessor Name"
                  name="assessorName"
                  placeholder="Enter Assessor Name"
                  onChange={handleInputChange}
                  value={feedbackData.assessorName}
                  error={errors.assessorName}
                  disabled={true}
                  mandatory
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="form-group">
                <DateInput
                  label="Assessment Date"
                  name="assessmentDate"
                  value={feedbackData.assessmentDate}
                  handleDateChange={handleDateChange}
                  error={errors.assessmentDate}
                  placeholder="Select Assessment Date"
                  mandatory
                  disabled={true}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="form-group">
                <Input
                  label="Batch ID(s)"
                  name="batchId"
                  placeholder="Enter Batch ID(s)"
                  onChange={handleInputChange}
                  value={feedbackData.batchId}
                  error={errors.batchId}
                  disabled={true}
                  mandatory
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="form-group">
                <Input
                  label="Job Role"
                  name="jobRole"
                  placeholder="Enter Job Role"
                  onChange={handleInputChange}
                  value={feedbackData.jobRole}
                  error={errors.jobRole}
                  disabled={true}
                  mandatory
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="form-group">
                <Input
                  label="Training Partner Name"
                  name="trainingPartnerName"
                  placeholder="Enter Training Partner Name"
                  onChange={handleInputChange}
                  value={feedbackData.trainingPartnerName}
                  error={errors.trainingPartnerName}
                  disabled={true}
                  mandatory
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="form-group">
                <Input
                  label="Training Centre Address"
                  name="trainingCentreAddress"
                  placeholder="Enter Training Centre Address"
                  onChange={handleInputChange}
                  value={feedbackData.trainingCentreAddress}
                  error={errors.trainingCentreAddress}
                  disabled={true}
                  multiline
                  rows={2}
                  mandatory
                />
              </div>
            </Grid>
          </Grid>
        </Box>

        {/* 1. Centre Coordination & Readiness */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            1. Centre Coordination & Readiness
          </Typography>
          <Divider className="section-divider" />

          <div className="feedback-section">
            <RadioButton
              label="Was the assessment centre at the location shared by AA?"
              name="assessmentCenterLocation"
              options={yesNoOptions}
              value={feedbackData.assessmentCenterLocation}
              handleChange={handleRadioChange}
              error={errors.assessmentCenterLocation}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>
          
          <div className="feedback-section">
            <RadioButton
              label="Was the SPOC available and cooperative?"
              name="spocAvailable"
              options={yesNoOptions}
              value={feedbackData.spocAvailable}
              handleChange={handleRadioChange}
              error={errors.spocAvailable}
              disabled={alreadySubmitted}
              mandatory
            />
            {feedbackData.spocAvailable === "No" && (
              <div className="form-group" style={{ marginTop: "15px" }}>
                <Input
                  label="Remarks"
                  name="spocRemarks"
                  placeholder="Enter remarks..."
                  onChange={handleInputChange}
                  value={feedbackData.spocRemarks}
                  error={errors.spocRemarks}
                  disabled={alreadySubmitted}
                  mandatory
                />
              </div>
            )}
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Was the center opened and ready on time?"
              name="centreReady"
              options={yesNoOptions}
              value={feedbackData.centreReady}
              handleChange={handleRadioChange}
              error={errors.centreReady}
              disabled={alreadySubmitted}
              mandatory
            />
            {feedbackData.centreReady === "No" && (
              <div className="form-group" style={{ marginTop: "15px" }}>
                <Input
                  label="Remarks"
                  name="centreReadyRemarks"
                  placeholder="Enter remarks..."
                  onChange={handleInputChange}
                  value={feedbackData.centreReadyRemarks}
                  error={errors.centreReadyRemarks}
                  disabled={alreadySubmitted}
                  mandatory
                />
              </div>
            )}
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Was the geo-location shared 24 hrs before the assessment?"
              name="geoLocationShared"
              options={yesNoOptions}
              value={feedbackData.geoLocationShared}
              handleChange={handleRadioChange}
              error={errors.geoLocationShared}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Were candidates present on time with original ID & self-attested copies?"
              name="candidatesPresent"
              options={yesNoOptions}
              value={feedbackData.candidatesPresent}
              handleChange={handleRadioChange}
              error={errors.candidatesPresent}
              disabled={alreadySubmitted}
              mandatory
            />
            {feedbackData.candidatesPresent === "No" && (
              <div className="form-group" style={{ marginTop: "15px" }}>
                <Input
                  label="No. of issues"
                  name="candidateIssuesCount"
                  placeholder="Enter number of issues"
                  onChange={handleInputChange}
                  value={feedbackData.candidateIssuesCount}
                  error={errors.candidateIssuesCount}
                  type="number"
                  disabled={alreadySubmitted}
                  mandatory
                />
              </div>
            )}
          </div>
        </Box>

        {/* 2. Infrastructure & Logistics */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            2. Infrastructure & Logistics
          </Typography>
          <Divider className="section-divider" />
          
          <div className="feedback-section">
            <RadioButton
              label="Were practical tools/equipment available and functional?"
              name="toolsAvailable"
              options={yesNoOptions}
              value={feedbackData.toolsAvailable}
              handleChange={handleRadioChange}
              error={errors.toolsAvailable}
              disabled={alreadySubmitted}
              mandatory
            />
            {feedbackData.toolsAvailable === "No" && (
              <div className="form-group" style={{ marginTop: "15px" }}>
                <Input
                  label="If no, specify"
                  name="toolsSpecify"
                  placeholder="Specify what was missing or not functional..."
                  onChange={handleInputChange}
                  value={feedbackData.toolsSpecify}
                  error={errors.toolsSpecify}
                  disabled={alreadySubmitted}
                  multiline
                  rows={2}
                  mandatory
                />
              </div>
            )}
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Were classrooms/labs clean and suitable for assessment?"
              name="classroomsSuitable"
              options={yesNoOptions}
              value={feedbackData.classroomsSuitable}
              handleChange={handleRadioChange}
              error={errors.classroomsSuitable}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>
        </Box>

        {/* 3. Assessment Conduct */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            3. Assessment Conduct
          </Typography>
          <Divider className="section-divider" />
          
          <div className="feedback-section">
            <RadioButton
              label="Did assessment begin on time?"
              name="assessmentOnTime"
              options={yesNoOptions}
              value={feedbackData.assessmentOnTime}
              handleChange={handleRadioChange}
              error={errors.assessmentOnTime}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Any issues with Aadhaar authentication via SIDH App?"
              name="aadhaarIssues"
              options={yesNoOptions}
              value={feedbackData.aadhaarIssues}
              handleChange={handleRadioChange}
              error={errors.aadhaarIssues}
              disabled={alreadySubmitted}
              mandatory
            />
            {feedbackData.aadhaarIssues === "Yes" && (
              <div className="form-group" style={{ marginTop: "15px" }}>
                <Input
                  label="Describe"
                  name="aadhaarDescription"
                  placeholder="Describe the issues..."
                  onChange={handleInputChange}
                  value={feedbackData.aadhaarDescription}
                  error={errors.aadhaarDescription}
                  disabled={alreadySubmitted}
                  multiline
                  rows={2}
                  mandatory
                />
              </div>
            )}
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Was the theory exam conducted smoothly using the online link?"
              name="theoryExamSmooth"
              options={yesNoOptions}
              value={feedbackData.theoryExamSmooth}
              handleChange={handleRadioChange}
              error={errors.theoryExamSmooth}
              disabled={alreadySubmitted}
              mandatory
            />
            {feedbackData.theoryExamSmooth === "No" && (
              <div className="form-group" style={{ marginTop: "15px" }}>
                <Input
                  label="Comments"
                  name="theoryExamComments"
                  placeholder="Enter comments..."
                  onChange={handleInputChange}
                  value={feedbackData.theoryExamComments}
                  error={errors.theoryExamComments}
                  disabled={alreadySubmitted}
                  multiline
                  rows={2}
                  mandatory
                />
              </div>
            )}
          </div>
        </Box>

        {/* 4. Training Provider Conduct */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            4. Training Provider Conduct
          </Typography>
          <Divider className="section-divider" />
          
          <div className="feedback-section">
            <RadioButton
              label="Any pressure, malpractice, or misconduct by TP/Trainer?"
              name="pressureMalpractice"
              options={yesNoOptions}
              value={feedbackData.pressureMalpractice}
              handleChange={handleRadioChange}
              error={errors.pressureMalpractice}
              disabled={alreadySubmitted}
              mandatory
            />
            {feedbackData.pressureMalpractice === "Yes" && (
              <div className="form-group" style={{ marginTop: "15px" }}>
                <Input
                  label="Details"
                  name="pressureDetails"
                  placeholder="Provide details..."
                  onChange={handleInputChange}
                  value={feedbackData.pressureDetails}
                  error={errors.pressureDetails}
                  disabled={alreadySubmitted}
                  multiline
                  rows={3}
                  mandatory
                />
              </div>
            )}
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Any request for manipulation of attendance/documents?"
              name="manipulationRequest"
              options={yesNoOptions}
              value={feedbackData.manipulationRequest}
              handleChange={handleRadioChange}
              error={errors.manipulationRequest}
              disabled={alreadySubmitted}
              mandatory
            />
            {feedbackData.manipulationRequest === "Yes" && (
              <div className="form-group" style={{ marginTop: "15px" }}>
                <Input
                  label="Details"
                  name="manipulationDetails"
                  placeholder="Provide details..."
                  onChange={handleInputChange}
                  value={feedbackData.manipulationDetails}
                  error={errors.manipulationDetails}
                  disabled={alreadySubmitted}
                  multiline
                  rows={3}
                  mandatory
                />
              </div>
            )}
          </div>
        </Box>

        {/* 5. Other Remarks */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            5. Any other Remarks? (Limit 200 Words)
          </Typography>
          <Divider className="section-divider" />
          
          <div className="feedback-section">
            <div className="form-group">
              <Input
                label="Other Remarks"
                name="otherRemarks"
                placeholder="Enter any additional remarks or observations..."
                onChange={handleInputChange}
                value={feedbackData.otherRemarks}
                error={errors.otherRemarks}
                disabled={alreadySubmitted}
                multiline
                rows={4}
              />
              <Typography variant="caption" style={{ color: "#666", marginTop: "5px" }}>
                {feedbackData.otherRemarks ? feedbackData.otherRemarks.trim().split(/\s+/).length : 0}/200 words
              </Typography>
            </div>
          </div>
        </Box>

        {/* Submit Button */}
        <Box className="submit-section">
          <button
            className="feedback-submit-btn"
            onClick={handleSubmit}
            disabled={loading || alreadySubmitted}
          >
            {loading ? (
              <>
                <PulseLoader size={8} color="#ffffff" />
                &nbsp; Submitting...
              </>
            ) : alreadySubmitted ? (
              "Feedback Already Submitted"
            ) : (
              "Submit Feedback"
            )}
          </button>
        </Box>
        </div>
        )}
      </Paper>
    </div>
  );
} 