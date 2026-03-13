import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader, RiseLoader } from "react-spinners";
import {
  Button,
  FormControlLabel,
  Box,
  FormControl,
  FormGroup,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mui/material";
import "./style.css";
import ExamSummary from "../../../../student/questionLists/examSummary/index";
import QuestionNav from "../../../../student/questionLists/questions/questionNav";
import {
  getQuestionApi,
  saveSingleQuestionPostUpdateApi,
  getAssessmentApi,
  submitTestApi,
} from "../../../../../api/studentApi";
// import { TextSkeletonLoader } from "../../../../components/common/skeleton";
import ChooseQuestions from "../../../../student/questionLists/questions/chooseQuestions";
// import { getSession, padZero } from "../../../../utils/projectHelper";
// import { authSelector } from "../../../../redux/slicers/authSlice";

// import { STUDENT_FEEDBACK_PAGE } from "../../../../config/constants/routePathConstants/student";
import {
  studentSelector,
  getQuestion,
} from "../../../../../redux/slicers/studentSlice";
import { TextSkeletonLoader } from "../../../../../components/common/skeleton";
import { padZero, getSession } from "../../../../../utils/projectHelper";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { STUDENT_FEEDBACK_PAGE } from "../../../../../config/constants/routePathConstants/student";
import {
  getCandidateAnswerDetailsApi,
  updateCandidateAnswerDetailsApi,
} from "../../../../../api/superAdminApi/misResults";

const initialValues = () => {
  return {
    questionText: "Sample Question",
    marks: "10",
    options: [
      {
        isSelect: false,
        optionKey: "OptionA",
        optionValue: "Sample Option-1",
      },
      {
        isSelect: false,
        optionKey: "OptionB",
        optionValue: "Sample Option-2",
      },
      {
        isSelect: false,
        optionKey: "OptionC",
        optionValue: "Sample Option-3",
      },
      {
        isSelect: false,
        optionKey: "OptionD",
        optionValue: "Sample Option-4",
      },
    ],
  };
};

const Question = () => {
  const { batchId, candidateId, batchID, candID, qstID } = useParams();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const { userInfo } = useSelector(authSelector);
  const { questionAll = {}, question = {} } = useSelector(studentSelector);
  let qId;
  if (userInfo?.resumeStatus) {
    qId = questionAll?.questionList?.lastQuestionId;
  } else {
    qId = questionAll?.questionList?.questions?.["0"]?._id;
  }
  const options = question?.options?.map((opt) => opt);
  // State variables
  const [examSummary, setExamSummary] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serialBtnLoading, setSerialBtnLoading] = useState(true);
  const [formValues, setFormValues] = useState(initialValues());

  const getDetails = () => {
    dispatch(
      getCandidateAnswerDetailsApi(
        setLoading,
        batchID,
        candID,
        qstID,
        setFormValues
      )
    );
  };

  useEffect(() => {
    getDetails();
  }, []);

  // Current Question Data
  const currentQuestion = question;

  // Current QuestionID
  const currentQuestionID = currentQuestion?._id;
  // Question Lists
  const questionLists = questionAll?.questionList?.questions;

  // Current Question SerialNo
  const currentQuestionSerialNo = questionLists?.find(
    (question) => question?._id === currentQuestionID
  )?.serialNo;

  // CurrentQuestionOptions
  const currentQuestionOptions = question?.options?.map((opt) => opt);

  // Current QuestionSelected Options
  const isSelectedOptions = currentQuestionOptions?.some(
    (option) => option?.isSelect
  );

  const handleChange = (e, index) => {
    const { checked } = e.target;
    const existingOptions = [...formValues?.options];
    existingOptions.map((el) => {
      el.isSelect = false;
    });
    existingOptions[index].isSelect = checked;
    setFormValues({ ...formValues, options: existingOptions });
  };

  const markAsReviewHandle = () => {
    const { questionStatus = {} } = question;
    const updateQuestion = {
      ...question,
      options: [...question?.options],
      questionStatus: {
        ...questionStatus,
        answeredMarkForReview: isSelectedOptions
          ? !questionStatus?.answeredMarkForReview
          : false,
        markForReview: !isSelectedOptions
          ? !questionStatus?.markForReview
          : false,
        answered: !questionStatus?.answeredMarkForReview
          ? false
          : isSelectedOptions,
        notAnswered:
          (!questionStatus?.answeredMarkForReview &&
            questionStatus?.markForReview &&
            !isSelectedOptions) ||
          false,
        notAttempt: false,
      },
    };

    dispatch(getQuestion(updateQuestion));
  };

  const handlePrevious = () => {
    if (currentQuestionSerialNo > 1) {
      const previousQuestion = questionAll?.questionList?.questions?.find(
        (question) => question?.serialNo === currentQuestionSerialNo - 1
      );

      if (previousQuestion) {
        const previousQuestionId = previousQuestion?._id;
        dispatch(
          getQuestionApi(batchId, candidateId, previousQuestionId, setLoading)
        );
      }
    }
  };

  const handlesubmit = () => {
    setLoading(true);
    // const navigatePath = `${STUDENT_FEEDBACK_PAGE}/${batchId}/${candidateId}`;
    dispatch(
      updateCandidateAnswerDetailsApi(
        setLoading,
        batchID,
        candID,
        qstID,
        formValues,
        navigate
      )
    );
  };

  const clearFormValues = () => {
    setFormValues(initialValues());
  };
  const handleCancel = () => {
    clearFormValues();
    navigate(-1);
  };

  return (
    <>
      <div
        className="bg-gray_new question question-lists"
        style={{ float: "left" }}
      >
        <div className="card-wrapper">
          <div className="main-content assessment-layout_new">
            <div className="main-content general-assessment_new">
              <div className="qn-card-wrapper scroll4">
                {loading ? (
                  <div className="card question-card">
                    <TextSkeletonLoader />
                  </div>
                ) : (
                  <div className="card question-card">
                    <div className="question-no">
                      <div>
                        <h1>Question </h1>
                      </div>
                      <div className="question-marks">
                        <p>
                          <span>Marks</span>
                          <span>{padZero(formValues?.marks)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="question-title">
                      <p>{formValues?.questionText}</p>
                    </div>
                    <div className="answers-wrapper">
                      <Box sx={{ display: "flex" }}>
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                          >
                            {formValues?.options?.map((opt, index) => {
                              return (
                                opt?.optionValue && (
                                  <FormControlLabel
                                    key={index}
                                    value={opt?._id}
                                    control={
                                      <Radio
                                        checked={opt?.isSelect}
                                        onChange={(e) => handleChange(e, index)}
                                        name="questionOption"
                                      />
                                    }
                                    label={opt?.optionValue}
                                  />
                                )
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="general-assessment-buttons">
            <div className="btn-layout">
              <div className="left-side-btn">
                <div className="left-side-btn-box">
                  {currentQuestionSerialNo !== 1 && (
                    <div className="action-btn_userProfile">
                      <Button
                        className={`light-blue-btn submit-btn`}
                        variant="contained"
                        onClick={handlesubmit}
                        sx={{
                          textTransform: "unset",
                        }}
                        disabled={
                          !loading && currentQuestionSerialNo == 0
                            ? true
                            : false
                        }
                      >
                        {loading ? (
                          <RiseLoader size="5px" color="white" />
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </div>
                  )}
                  <div className="action-btn_userProfile">
                    <Button
                      className={`outlined-btn`}
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{
                        textTransform: "unset",
                        cursor: "pointer",
                      }}
                      disabled={loading ? true : false}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Question;
