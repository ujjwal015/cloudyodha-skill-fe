import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Paper, Typography, Box, Grid, Divider, Alert } from "@mui/material";
import { PulseLoader } from "react-spinners";
import Input, { RadioButton } from "../../../components/common/input";
import DateInput from "../../../components/common/DateInput";
import "./style.css";
import { submitTrainingPartnerFeedbackApi, getFeedbackBatchApi } from "../../../api/authApi";

export default function TrainingPartnerFeedbackMain() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { feedbackBatchDetails } = useSelector((state) => state.auth);

  console.log('feedbackBatchDetails',feedbackBatchDetails?.trainingCentreId?.trainingCenterId)

  const [feedbackData, setFeedbackData] = useState({
    // Basic Details
    trainingPartnerName: "",
    trainingPartnerId: "",
    centreName: "",
    centreAddress: "",
    trainingCentreId: "",
    batchId: "",
    dateOfAssessment: "",

    // Assessor's Readiness
    assessorOnTime: "",
    assessorDocuments: "",
    assessorAware: "",

    // Assessor's Professional Behavior
    assessorRespectful: "",
    assessorCooperative: "",

    // Assessor's Adherence to Guidelines
    aadhaarVerification: "",
    assessmentPhotos: "",
    assessorFormalAttire: "",

    // Communication & Coordination
    assessorCommunication: "",
    assessorDelays: "",

    // Final Feedback
    recommendAssessor: "",
    incidents: "",
    overallRating: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getFeedbackBatchApi(token, 'trainingPartner'));
    }
  }, [token]);

  useEffect(() => {
    if (feedbackBatchDetails) {
      setFeedbackData(prevData => ({
        ...prevData,
        trainingPartnerName: feedbackBatchDetails.trainingPartnerName || "",
        trainingPartnerId: feedbackBatchDetails.trainingPartnerId || "",
        centreName: feedbackBatchDetails.centreName || "",
        centreAddress: feedbackBatchDetails.centreAddress || "",
        trainingCentreId: feedbackBatchDetails?.trainingCentreId?.trainingCenterId || "",
        batchId: feedbackBatchDetails.batchId || "",
        dateOfAssessment: feedbackBatchDetails.dateOfAssessment 
          ? new Date(feedbackBatchDetails.dateOfAssessment).toISOString().split('T')[0]
          : "",
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
      dateOfAssessment: date ? date.format("YYYY-MM-DD") : ""
    });

    // Clear error when user selects date
    if (errors.dateOfAssessment) {
      setErrors({ ...errors, dateOfAssessment: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic Details validation
    if (!feedbackData.trainingPartnerName.trim()) {
      newErrors.trainingPartnerName = "Training Partner Name is required";
    }
    if (!feedbackData.trainingPartnerId.trim()) {
      newErrors.trainingPartnerId = "Training Partner ID is required";
    }
    if (!feedbackData.centreName.trim()) {
      newErrors.centreName = "Centre Name is required";
    }
    if (!feedbackData.trainingCentreId.trim()) {
      newErrors.trainingCentreId = "Training Centre ID is required";
    }
    if (!feedbackData.dateOfAssessment) {
      newErrors.dateOfAssessment = "Date of Assessment is required";
    }

    // Radio button validations
    const radioFields = [
      'assessorOnTime', 'assessorDocuments', 'assessorAware',
      'assessorRespectful', 'assessorCooperative',
      'aadhaarVerification', 'assessmentPhotos', 'assessorFormalAttire',
      'assessorCommunication', 'assessorDelays', 'recommendAssessor',
      'overallRating'
    ];

    radioFields.forEach(field => {
      if (!feedbackData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const data = {
      trainingPartnerName: feedbackData.trainingPartnerName,
      trainingPartnerId: feedbackData.trainingPartnerId,
      centreName: feedbackData.centreName,
      centreAddress: feedbackData.centreAddress,
      trainingCentreId: feedbackData.trainingCentreId,
      batchId: feedbackData.batchId,
      dateOfAssessment: feedbackData.dateOfAssessment,
      assessorOnTime: feedbackData.assessorOnTime,
      assessorDocuments: feedbackData.assessorDocuments,
      assessorAware: feedbackData.assessorAware,
      assessorRespectful: feedbackData.assessorRespectful,
      assessorCooperative: feedbackData.assessorCooperative,
      aadhaarVerification: feedbackData.aadhaarVerification,
      assessmentPhotos: feedbackData.assessmentPhotos,
      assessorFormalAttire: feedbackData.assessorFormalAttire,
      assessorCommunication: feedbackData.assessorCommunication,
      assessorDelays: feedbackData.assessorDelays,
      recommendAssessor: feedbackData.recommendAssessor,
      incidents: feedbackData.incidents,
      overallRating: feedbackData.overallRating,
    };

    dispatch(submitTrainingPartnerFeedbackApi(data, setLoading, token));

  };

  // Radio button options
  const yesNoOptions = [
    { name: "Yes", label: "Yes" },
    { name: "No", label: "No" }
  ];

  const ratingOptions = [
    { name: "Excellent", label: "Excellent" },
    { name: "Good", label: "Good" },
    { name: "Average", label: "Average" },
    { name: "Below Average", label: "Below Average" },
    { name: "Poor", label: "Poor" }
  ];

  return (
    <div className="feedback-container">
      <Paper elevation={3} className="feedback-paper">
        <Typography variant="h4" className="form-title">
          Training Partner Feedback Form
        </Typography>

        {alreadySubmitted || !token ? (
          <Alert severity="info" style={{ marginBottom: "20px" }}>
            {!token ? "URL is invalid" : "You have already submitted feedback for this batch."}
          </Alert>
        ) : (
        <div>
        {/* 1. Basic Details */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            1. Basic Details
          </Typography>
          <Divider className="section-divider" />

          <Grid container spacing={3}>
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
                  label="Training Partner ID"
                  name="trainingPartnerId"
                  placeholder="Enter Training Partner ID"
                  onChange={handleInputChange}
                  value={feedbackData.trainingPartnerId}
                  error={errors.trainingPartnerId}
                  disabled={true}
                  mandatory
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="form-group">
                <Input
                  label="Centre Name"
                  name="centreName"
                  placeholder="Enter Centre Name"
                  onChange={handleInputChange}
                  value={feedbackData.centreName}
                  error={errors.centreName}
                  disabled={true}
                  mandatory
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="form-group">
                <Input
                  label="Training Centre ID"
                  name="trainingCentreId"
                  placeholder="Enter Training Centre ID"
                  onChange={handleInputChange}
                  value={feedbackData.trainingCentreId}
                  error={errors.trainingCentreId}
                  disabled={true}
                  mandatory
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="form-group">
                <Input
                  label="Centre Address"
                  name="centreAddress"
                  placeholder="Enter Centre Address"
                  onChange={handleInputChange}
                  value={feedbackData.centreAddress}
                  error={errors.centreAddress}
                  disabled={true}
                  multiline
                  rows={2}
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
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="form-group">
                <DateInput
                  label="Date of Assessment"
                  name="dateOfAssessment"
                  value={feedbackData.dateOfAssessment}
                  handleDateChange={handleDateChange}
                  error={errors.dateOfAssessment}
                  placeholder="Select Assessment Date"
                  mandatory
                  disabled={true}
                  disableFuture={false}
                />
              </div>
            </Grid>
          </Grid>
        </Box>

        {/* 2. Assessor's Readiness */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            2. Assessor's Readiness
          </Typography>
          <Divider className="section-divider" />

          <div className="feedback-section">
            <RadioButton
              label="Did Assessor arrive on time?"
              name="assessorOnTime"
              options={yesNoOptions}
              value={feedbackData.assessorOnTime}
              handleChange={handleRadioChange}
              error={errors.assessorOnTime}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Did Assessor carry the required documents (attendance sheet, necessary annexures/documents etc.)?"
              name="assessorDocuments"
              options={yesNoOptions}
              value={feedbackData.assessorDocuments}
              handleChange={handleRadioChange}
              error={errors.assessorDocuments}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Was the Assessor aware of scheme/job role requirements?"
              name="assessorAware"
              options={yesNoOptions}
              value={feedbackData.assessorAware}
              handleChange={handleRadioChange}
              error={errors.assessorAware}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>
        </Box>

        {/* 3. Assessor's Professional Behavior */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            3. Assessor's Professional Behavior
          </Typography>
          <Divider className="section-divider" />

          <div className="feedback-section">
            <RadioButton
              label="Was the Assessor respectful and unbiased toward candidates?"
              name="assessorRespectful"
              options={yesNoOptions}
              value={feedbackData.assessorRespectful}
              handleChange={handleRadioChange}
              error={errors.assessorRespectful}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Was the Assessor cooperative with center staff?"
              name="assessorCooperative"
              options={yesNoOptions}
              value={feedbackData.assessorCooperative}
              handleChange={handleRadioChange}
              error={errors.assessorCooperative}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>
        </Box>

        {/* 4. Assessor's Adherence to Guidelines */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            4. Assessor's Adherence to Guidelines
          </Typography>
          <Divider className="section-divider" />

          <div className="feedback-section">
            <RadioButton
              label="Was Aadhaar verification done for all candidates?"
              name="aadhaarVerification"
              options={yesNoOptions}
              value={feedbackData.aadhaarVerification}
              handleChange={handleRadioChange}
              error={errors.aadhaarVerification}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Were assessment photos/videos captured as per protocol?"
              name="assessmentPhotos"
              options={yesNoOptions}
              value={feedbackData.assessmentPhotos}
              handleChange={handleRadioChange}
              error={errors.assessmentPhotos}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Was the Assessor in formal attire?"
              name="assessorFormalAttire"
              options={yesNoOptions}
              value={feedbackData.assessorFormalAttire}
              handleChange={handleRadioChange}
              error={errors.assessorFormalAttire}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>
        </Box>

        {/* 5. Communication & Coordination */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            5. Communication & Coordination
          </Typography>
          <Divider className="section-divider" />

          <div className="feedback-section">
            <RadioButton
              label="Was the Assessor in touch at least a day before the assessment?"
              name="assessorCommunication"
              options={yesNoOptions}
              value={feedbackData.assessorCommunication}
              handleChange={handleRadioChange}
              error={errors.assessorCommunication}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Did the Assessor communicate delays/issues promptly?"
              name="assessorDelays"
              options={yesNoOptions}
              value={feedbackData.assessorDelays}
              handleChange={handleRadioChange}
              error={errors.assessorDelays}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>
        </Box>

        {/* 6. Final Feedback */}
        <Box className="form-section">
          <Typography variant="h5" className="section-title">
            6. Final Feedback
          </Typography>
          <Divider className="section-divider" />

          <div className="feedback-section">
            <RadioButton
              label="Would you recommend this Assessor for future assessments?"
              name="recommendAssessor"
              options={yesNoOptions}
              value={feedbackData.recommendAssessor}
              handleChange={handleRadioChange}
              error={errors.recommendAssessor}
              disabled={alreadySubmitted}
              mandatory
            />
          </div>

          <div className="feedback-section">
            <div className="form-group">
              <Input
                label="Any incidents or misconduct to report?"
                name="incidents"
                placeholder="Please describe any incidents or misconduct..."
                onChange={handleInputChange}
                value={feedbackData.incidents}
                error={errors.incidents}
                disabled={alreadySubmitted}
                multiline
                rows={4}
              />
            </div>
          </div>

          <div className="feedback-section">
            <RadioButton
              label="Overall rating of the Assessor's performance:"
              name="overallRating"
              options={ratingOptions}
              value={feedbackData.overallRating}
              handleChange={handleRadioChange}
              error={errors.overallRating}
              disabled={alreadySubmitted}
              mandatory
            />
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