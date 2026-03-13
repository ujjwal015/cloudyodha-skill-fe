import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React from "react";
import "./style.css";
import { useState } from "react";
import { getStudentFeedbackApi } from "../../../api/studentApi";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
export default function FeedbackPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { batchId, candidateId } = params;
  const initialFeedBackData = {
    trainerQuality: "",
    trainerMaterialQuality: "",
    infrastructureQuality: "",
    counselingMentoring: "",
    trainingEffectiveness: "",
    comments: "",
  };
  const [loading, setLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState(initialFeedBackData);

  const handleRadioChange = (category, value) => {
    setFeedbackData({ ...feedbackData, [category]: value });
  };

  const handleCommentsChange = (event) => {
    setFeedbackData({ ...feedbackData, comments: event.target.value });
  };

  const handleSubmit = () => {
    setLoading(true);
    dispatch(
      getStudentFeedbackApi(
        feedbackData,
        batchId,
        candidateId,
        setLoading,
        feedbackData,
        navigate
      )
    );
  };
  return (
    <div>
      <div className="feedback-container">
        <h2>Feedback Form</h2>
        <div className="feedback-card">
          <h3>
            1.Quality of the trainer (in terms of Friendliness Clarity In
            Instructions Given. etc.)
          </h3>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="Very Good"
                control={<Radio />}
                label="Very Good"
                onClick={() => handleRadioChange("trainerQuality", "Very Good")}
              />
              <FormControlLabel
                value="Good"
                control={<Radio />}
                label="Good"
                onClick={() => handleRadioChange("trainerQuality", "Good")}
              />
              <FormControlLabel
                value="Average"
                control={<Radio />}
                label="Average"
                onClick={() => handleRadioChange("trainerQuality", "Average")}
              />
              <FormControlLabel
                value="Poor"
                control={<Radio />}
                label="Poor"
                onClick={() => handleRadioChange("trainerQuality", "Poor")}
              />
              <FormControlLabel
                value="Very Poor"
                control={<Radio />}
                label="Very Poor"
                onClick={() => handleRadioChange("trainerQuality", "Very Poor")}
              />
            </RadioGroup>
          </FormControl>
        </div>

        {/* <div className="feedback-card">
          <h3>
            2.Quality of the trainer material provided to the candidates (in
            terms of Relevance,Depth,Coverage,etc.)
          </h3>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="Very Good"
                control={<Radio />}
                label="Very Good"
                onClick={() =>
                  handleRadioChange("trainerMaterialQuality", "Very Good")
                }
              />
              <FormControlLabel
                value="Good"
                control={<Radio />}
                label="Good"
                onClick={() =>
                  handleRadioChange("trainerMaterialQuality", "Good")
                }
              />
              <FormControlLabel
                value="Average"
                control={<Radio />}
                label="Average"
                onClick={() =>
                  handleRadioChange("trainerMaterialQuality", "Average")
                }
              />
              <FormControlLabel
                value="Poor"
                control={<Radio />}
                label="Poor"
                onClick={() =>
                  handleRadioChange("trainerMaterialQuality", "Poor")
                }
              />
              <FormControlLabel
                value="Very Poor"
                control={<Radio />}
                label="Very Poor"
                onClick={() =>
                  handleRadioChange("trainerMaterialQuality", "Very Poor")
                }
              />
            </RadioGroup>
          </FormControl>
        </div> */}

        <div className="feedback-card">
          <h3>
            2.Infrastructure present at the Establishment (in terms of No of
            classrooms, State of Laboratories etc.)
          </h3>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="Very Good"
                control={<Radio />}
                label="Very Good"
                onClick={() =>
                  handleRadioChange("infrastructureQuality", "Very Good")
                }
              />
              <FormControlLabel
                value="Good"
                control={<Radio />}
                label="Good"
                onClick={() =>
                  handleRadioChange("infrastructureQuality", "Good")
                }
              />
              <FormControlLabel
                value="Average"
                control={<Radio />}
                label="Average"
                onClick={() =>
                  handleRadioChange("infrastructureQuality", "Average")
                }
              />
              <FormControlLabel
                value="Poor"
                control={<Radio />}
                label="Poor"
                onClick={() =>
                  handleRadioChange("infrastructureQuality", "Poor")
                }
              />
              <FormControlLabel
                value="Very Poor"
                control={<Radio />}
                label="Very Poor"
                onClick={() =>
                  handleRadioChange("infrastructureQuality", "Very Poor")
                }
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="feedback-card">
          <h3>
            3.Counseling and Mentoring support (in terms of Relevance, Usability
            etc.)
          </h3>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="Very Good"
                control={<Radio />}
                label="Very Good"
                onClick={() =>
                  handleRadioChange("counselingMentoring", "Very Good")
                }
              />
              <FormControlLabel
                value="Good"
                control={<Radio />}
                label="Good"
                onClick={() => handleRadioChange("counselingMentoring", "Good")}
              />
              <FormControlLabel
                value="Average"
                control={<Radio />}
                label="Average"
                onClick={() =>
                  handleRadioChange("counselingMentoring", "Average")
                }
              />
              <FormControlLabel
                value="Poor"
                control={<Radio />}
                label="Poor"
                onClick={() => handleRadioChange("counselingMentoring", "Poor")}
              />
              <FormControlLabel
                value="Very Poor"
                control={<Radio />}
                label="Very Poor"
                onClick={() =>
                  handleRadioChange("counselingMentoring", "Very Poor")
                }
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="feedback-card">
          <h3>
            4.Overall On Job training effectiveness (in terms of knowledge gained, up
            skilling etc.)
          </h3>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="Very Good"
                control={<Radio />}
                label="Very Good"
                onClick={() =>
                  handleRadioChange("trainingEffectiveness", "Very Good")
                }
              />
              <FormControlLabel
                value="Good"
                control={<Radio />}
                label="Good"
                onClick={() =>
                  handleRadioChange("trainingEffectiveness", "Good")
                }
              />
              <FormControlLabel
                value="Average"
                control={<Radio />}
                label="Average"
                onClick={() =>
                  handleRadioChange("trainingEffectiveness", "Average")
                }
              />
              <FormControlLabel
                value="Poor"
                control={<Radio />}
                label="Poor"
                onClick={() =>
                  handleRadioChange("trainingEffectiveness", "Poor")
                }
              />
              <FormControlLabel
                value="Very Poor"
                control={<Radio />}
                label="Very Poor"
                onClick={() =>
                  handleRadioChange("trainingEffectiveness", "Very Poor")
                }
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="feedback-card">
          <h3>5. Feel free to add any other comments and suggestions:</h3>
          <TextField
            sx={{ width: "60%", marginTop: 2 }}
            multiline
            variant="outlined"
            rows={4}
            placeholder="Write your remarks..."
            value={feedbackData.comments}
            onChange={handleCommentsChange}
          />
        </div>

        {loading ? (
          <PulseLoader size="10px" color="white" />
        ) : (
          <button className={`feedback-card-submit-btn`} onClick={handleSubmit}>
            Submit & Log out
          </button>
        )}
      </div>
    </div>
  );
}
