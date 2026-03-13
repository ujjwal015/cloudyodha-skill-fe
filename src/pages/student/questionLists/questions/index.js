/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import {
  Button,
  FormControlLabel,
  Box,
  FormControl,
  Radio,
  RadioGroup,
} from "@mui/material";
import "./style.css";
import ExamSummary from "../examSummary/index";
import QuestionNav from "./questionNav";
import {
  getQuestionApi,
  saveSingleQuestionPostUpdateApi,
  getAssessmentApi,
  submitTestApi,
} from "../../../../api/studentApi";
import { TextSkeletonLoader } from "../../../../components/common/skeleton";
import ChooseQuestions from "./chooseQuestions";
import {
  getDynamicStyle,
  getTextColorStyle,
  getTextColorValue,
  padZero,
} from "../../../../utils/projectHelper";
import { authSelector } from "../../../../redux/slicers/authSlice";
import {
  getQuestion,
  studentSelector,
} from "../../../../redux/slicers/studentSlice";
import {
  ASSESSMENT_PAGE,
  STUDENT_FEEDBACK_PAGE,
  STUDENT_RESULT_SUMMARY,
} from "../../../../config/constants/routePathConstants/student";
import VedioAndScreenShot from "../../../../components/Protor/VideoAndScreenShot";
import MobChooseQuestions from "./mobChooseQuestions";
// import useDetectSuspiciousActivity from "../../../../hooks/useDetectBrowserExit";
import { Icon } from "@iconify/react/dist/iconify.js";
import VoiceExamSystem from "./textToSpeech";

const Question = () => {
  const { userInfo } = useSelector(authSelector);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { batchId, candidateId, questionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [capturedImages] = useState([]);
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const {
    questionAll = {},
    question = {},
    updatedQuestionStats = {},
    layoutColor = {},
  } = useSelector(studentSelector);

  const schemeName = userInfo?.assessment?.scheme?.toLowerCase();

  // Fetch questions list and current question
  useEffect(() => {
    dispatch(
      getAssessmentApi(setLoading, batchId, candidateId, setSerialBtnLoading)
    );
  }, []);

  // prevent the Right-Click
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  const isPartialSubmisionAllowed =
    userInfo?.batchDetails?.questionPaper?.partialSubmission;

  const isMarkAsReviewAllowed =
    userInfo?.batchDetails?.questionPaper?.markForReview;

  const isQuestionNavigationEnable =
    userInfo?.batchDetails?.questionPaper?.questionNavigation;

  const isQuestionaginationStatusEnable =
    userInfo?.batchDetails?.questionPaper?.paginationStatus;

  let qId = questionId;

  useEffect(() => {
    dispatch(getQuestion({}));
    setLoading(true);
    dispatch(getQuestionApi(batchId, candidateId, qId, setLoading));
  }, []);

  const options = question?.options?.map((opt) => opt);

  const testName = userInfo?.assessment?.jobRole;

  // State variables
  const [examSummary, setExamSummary] = useState(true);
  const [loading, setLoading] = useState(true);
  const [serialBtnLoading, setSerialBtnLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [shownav, setShowNav] = useState(false);

  // useDetectSuspiciousActivity(
  //   `Suspicious activity detected`,
  //   setLoading,
  //   batchId,
  //   candidateId,
  //   navigate
  // );

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

  // Last Question Serial No
  const lastQuestionSerialNo =
    questionLists?.[questionLists?.length - 1]?.serialNo;

  // CurrentQuestionOptions
  const currentQuestionOptions = question?.options?.map((opt) => opt);

  // Current QuestionSelected Options
  const isSelectedOptions = currentQuestionOptions?.some(
    (option) => option?.isSelect
  );

  const handleClearResponse = () => {
    const updateOptions = currentQuestionOptions.map((opt) => ({
      ...opt,
      isSelect: false,
    }));

    const updateQuestionStatus = {
      answered: false,
      answeredMarkForReview: false,
      markForReview: false,
      notAnswered: true,
      notAttempt: false,
    };

    const updatedQuestion = {
      ...question,
      options: updateOptions,
      questionStatus: updateQuestionStatus,
    };

    dispatch(getQuestion(updatedQuestion));
  };

  const handleChange = (selectedOption) => {
    const updateOptions = currentQuestionOptions?.map((opt) => ({
      ...opt,
      isSelect: opt._id === selectedOption._id,
    }));

    const updateQuestionStatus = () => {
      const { questionStatus = {} } = question;
      const answeredMarkForReview =
        questionStatus.answeredMarkForReview || questionStatus.markForReview;

      // Check if any option is selected
      const isSelected = updateOptions.some((opt) => opt.isSelect);

      // Update question status based on whether an option is selected or not
      return {
        answered: answeredMarkForReview ? false : isSelected,
        answeredMarkForReview: isSelected ? answeredMarkForReview : false,
        markForReview: isSelected ? false : questionStatus.markForReview,
        notAnswered: !isSelected,
        notAttempt: false,
      };
    };

    const updateQuestion = {
      ...question,
      options: updateOptions,
      questionStatus: updateQuestionStatus(),
    };

    dispatch(getQuestion(updateQuestion));
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

  const clickQuestionHandle = (questionId) => {
    if (questionId !== question?._id) {
      setSerialBtnLoading(false);
      setLoading(false);
      setShowNav(false);
    }
    const { questionText, ...rest } = question;
    let formData = {
      ...rest,
    };

    if (
      !formData?.questionStatus?.answered &&
      !formData?.questionStatus?.markForReview &&
      !formData?.questionStatus?.answeredMarkForReview
    ) {
      formData = {
        ...formData,
        questionStatus: {
          notAnswered: true,
          answered: false,
          markForReview: false,
          answeredMarkForReview: false,
          notAttempt: false,
        },
      };
    }

    if (questionId !== currentQuestionID) {
      dispatch(
        saveSingleQuestionPostUpdateApi(
          formData,
          batchId,
          candidateId,
          currentQuestionID,
          questionAll,
          setLoading,
          setSerialBtnLoading,
          currentQuestionSerialNo,
          questionId,
          navigate,
          setSaveBtnLoading
        )
      );
    }

    if (questionId !== currentQuestionID) {
      navigate(`${ASSESSMENT_PAGE}/${batchId}/${candidateId}/${questionId}`);
      dispatch(getQuestionApi(batchId, candidateId, questionId, setLoading));
    }
  };

  const handleBlanck = () => {};

  const handleCancel = () => {
    setExamSummary(true);
  };

  const handleSubmitResponse = (e) => {
    setExamSummary(false);
    setShowNav(false);
  };
  const handleNext = async () => {
    setSaveBtnLoading(true);
    // setLoading(true);
    setSerialBtnLoading(false);
    let nextQuestionId;
    let currentQuestionId;
    if (
      currentQuestionSerialNo >= 1 &&
      currentQuestionSerialNo < lastQuestionSerialNo
    ) {
      let nextObject = questionAll?.questionList?.questions?.find(
        (question) => question?.serialNo === currentQuestionSerialNo + 1
      );

      nextQuestionId = nextObject?._id;
    }
    if (
      currentQuestionSerialNo >= 1 &&
      currentQuestionSerialNo <= lastQuestionSerialNo
    ) {
      let currentQId = questionAll?.questionList?.questions?.find(
        (question) => question?.serialNo === currentQuestionSerialNo
      );
      currentQuestionId = currentQId?._id;
    }
    const { questionText, ...rest } = question;
    let formData = {
      ...rest,
    };

    if (
      !formData?.questionStatus?.answered &&
      !formData?.questionStatus?.markForReview &&
      !formData?.questionStatus?.answeredMarkForReview
    ) {
      formData = {
        ...formData,
        questionStatus: {
          notAnswered: true,
          answered: false,
          markForReview: false,
          answeredMarkForReview: false,
          notAttempt: false,
        },
      };
    }

    dispatch(
      saveSingleQuestionPostUpdateApi(
        formData,
        batchId,
        candidateId,
        currentQuestionId,
        questionAll,
        setLoading,
        setSerialBtnLoading,
        currentQuestionSerialNo,
        nextQuestionId,
        navigate,
        setSaveBtnLoading
      )
    );
  };

  const handlePrevious = () => {
    if (currentQuestionSerialNo > 1) {
      const previousQuestion = questionAll?.questionList?.questions?.find(
        (question) => question?.serialNo === currentQuestionSerialNo - 1
      );

      if (previousQuestion) {
        const previousQuestionId = previousQuestion?._id;

        setSaveBtnLoading(true);
        setSerialBtnLoading(false);
        let currentQuestionId;

        if (
          currentQuestionSerialNo >= 1 &&
          currentQuestionSerialNo <= lastQuestionSerialNo
        ) {
          let currentQId = questionAll?.questionList?.questions?.find(
            (question) => question?.serialNo === currentQuestionSerialNo
          );
          currentQuestionId = currentQId?._id;
        }
        let formData = {
          ...question,
        };

        if (
          !formData?.questionStatus?.answered &&
          !formData?.questionStatus?.markForReview &&
          !formData?.questionStatus?.answeredMarkForReview
        ) {
          formData = {
            ...formData,
            questionStatus: {
              notAnswered: true,
              answered: false,
              markForReview: false,
              answeredMarkForReview: false,
              notAttempt: false,
            },
          };
        }

        dispatch(
          saveSingleQuestionPostUpdateApi(
            formData,
            batchId,
            candidateId,
            currentQuestionId,
            questionAll,
            setLoading,
            setSerialBtnLoading,
            currentQuestionSerialNo,
            previousQuestionId,
            navigate,
            setSaveBtnLoading
          )
        );
      }
    }
  };

  const summary = {
    noOfQuestions: questionLists?.length,
    answered: updatedQuestionStats?.answered,
    notAnswered: updatedQuestionStats?.notAnswered,
    answeredMarkForReview: updatedQuestionStats?.answeredMarkForReview,
    markForReview: updatedQuestionStats?.markForReview,
    notAttempt: updatedQuestionStats?.notAttempt,
  };

  const handlesubmit = () => {
    setLoading(true);
    setSubmitLoading(true);
    const navigatePath =
      schemeName === "mock"
        ? `${STUDENT_RESULT_SUMMARY}/${batchId}/${candidateId}`
        : `${STUDENT_FEEDBACK_PAGE}/${batchId}/${candidateId}`;
    // navigate(navigatePath);
    dispatch(
      submitTestApi(batchId, candidateId, setSubmitLoading, navigate, navigatePath)
    );
  };

  const handleShowNav = () => {
    setShowNav(true);
  };

  return (
    <>
      <VedioAndScreenShot />
      {examSummary ? (
        <div className="assessment-question-screen question question-lists hscreen">
          <div className="card-wrapper">
            <div className="main-content assessment-layout">
              <div
                className="main-content general-assessment"
                style={{ width: isQuestionaginationStatusEnable ? "" : "100%" }}
              >
                <QuestionNav
                  testName={testName}
                  handleShowNav={handleShowNav}
                  currentQuestion={question?.serialNo}
                  lastQuestionSerialNo={lastQuestionSerialNo}
                  isQuestionaginationStatusEnable={
                    isQuestionaginationStatusEnable
                  }
                  schemeName={schemeName}
                />
                <div className="qn-card-wrapper scroll4">
                  {loading ? (
                    <div className="card question-card">
                      <TextSkeletonLoader />
                    </div>
                  ) : (
                    <div
                      style={{ margin: 0 }}
                      className="card question-card card-border"
                    >
                      <div className="question-no">
                        <div>
                          <h1 style={{ ...getTextColorStyle(layoutColor) }}>
                            Question {question?.serialNo || 1}
                          </h1>
                        </div>
                        <div className="question-marks">
                          <p>
                            <span
                              style={{
                                opacity: 1,
                                ...getTextColorStyle(layoutColor),
                              }}
                            >
                              Marks
                            </span>
                            <span style={{ ...getTextColorStyle(layoutColor) }}>
                              {padZero(question?.marks)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="question-detailes-box">
                        <div
                          className="question-title"
                          style={{ ...getTextColorStyle(layoutColor) }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: question?.questionText,
                            }}
                          ></div>
                          {question?.secondaryQuestionText !== null && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: question?.secondaryQuestionText,
                              }}
                            ></div>
                          )}
                        </div>
                        <div className="answers-wrapper">
                          <Box
                            sx={{
                              display: "flex",
                              ...getTextColorStyle(layoutColor),
                            }}
                          >
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                              >
                                {options?.map((opt) => {
                                  return (
                                    <>
                                      <FormControlLabel
                                        key={opt?._id}
                                        value={opt?._id}
                                        control={
                                          <Radio
                                            sx={{
                                              color: getTextColorStyle(layoutColor),
                                              "&.Mui-checked": {
                                                color: getTextColorStyle(layoutColor),
                                              },
                                            }}
                                            checked={opt?.isSelect}
                                            onChange={() => handleChange(opt)}
                                          />
                                        }
                                        label={
                                          opt.optionUrl ? (
                                            <>
                                              <p>{opt?.optionValue}</p>
                                              {opt.secondaryOptionValue !==
                                              null ? (
                                                <p>
                                                  {opt?.secondaryOptionValue}
                                                </p>
                                              ) : null}
                                              <img
                                                src={opt.optionUrl}
                                                alt={opt?.optionValue}
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <p>{opt?.optionValue}</p>
                                              {opt.secondaryOptionValue !==
                                              null ? (
                                                <p>
                                                  {opt?.secondaryOptionValue}
                                                </p>
                                              ) : null}
                                            </>
                                          )
                                        }
                                      />
                                    </>
                                  );
                                })}
                              </RadioGroup>
                            </FormControl>
                          </Box>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* <VoiceExamSystem/> */}
              {isQuestionaginationStatusEnable && (
                <ChooseQuestions
                  questions={questionAll?.questionList?.questions}
                  loading={loading}
                  clickQuestionHandle={
                    isQuestionNavigationEnable
                      ? clickQuestionHandle
                      : handleBlanck
                  }
                />
              )}
            </div>
            <div className="actions-contain-wrap card-border">
              <div className="general-assessment-buttons">
                <div className="btn-layout">
                  <div className="left-side-btn">
                    <div className="left-side-btn-box">
                      {currentQuestionSerialNo !== 1 && (
                        <div className="action-btn_userProfile">
                          <button
                            className={`question-screens_button`}
                            variant="contained"
                            onClick={handlePrevious}
                            style={{
                              padding: 0,
                              textTransform: "unset",
                              ...getDynamicStyle(layoutColor),
                            }}
                            disabled={
                              !loading && currentQuestionSerialNo == 0
                                ? true
                                : false
                            }
                          >
                            {loading ? (
                              <PulseLoader size="10px" color="white" />
                            ) : (
                              <Icon
                                style={{ fontSize: 27 }}
                                icon="iconamoon:arrow-left-2-duotone"
                              />
                            )}
                          </button>
                        </div>
                      )}
                      {isMarkAsReviewAllowed && (
                        <div className="action-btn_userProfile">
                          <button
                            className={`question-screens_button`}
                            variant="contained"
                            onClick={() => markAsReviewHandle()}
                            style={{
                              textTransform: "unset",
                              cursor: "pointer",
                              ...getDynamicStyle(layoutColor),
                            }}
                            disabled={loading ? true : false}
                          >
                            {loading ? (
                              <PulseLoader size="10px" color="white" />
                            ) : question?.questionStatus?.markForReview ||
                              question?.questionStatus
                                ?.answeredMarkForReview ? (
                              "Unmark"
                            ) : (
                              "Mark Review"
                            )}
                          </button>
                        </div>
                      )}

                      <div className="action-btn_userProfile">
                        <button
                          className={`question-screens_button`}
                          variant="contained"
                          onClick={() => handleClearResponse()}
                          style={{
                            textTransform: "unset",
                            cursor: "pointer",
                            ...getDynamicStyle(layoutColor),
                          }}
                          disabled={loading ? true : false}
                        >
                          {loading ? (
                            <PulseLoader size="10px" color="white" />
                          ) : (
                            "Clear"
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="action-btn_userProfile">
                      <button
                        className={`question-screens_button`}
                        variant="contained"
                        onClick={handleNext}
                        style={{
                          opacity: saveBtnLoading ? 0.6 : 1,
                          cursor: "pointer",
                          ...getDynamicStyle(layoutColor),
                        }}
                        sx={{
                          textTransform: "unset",
                        }}
                        disabled={loading || saveBtnLoading ? true : false}
                      >
                        {saveBtnLoading ? (
                          <PulseLoader size="10px" color="white" />
                        ) : currentQuestionSerialNo === lastQuestionSerialNo ? (
                          "Save"
                        ) : (
                          "Save & Next"
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="right-side-btn">
                    <div className="action-btn_userProfile">
                      <button
                        className={`question-screens_button`}
                        onClick={handleSubmitResponse}
                        style={getDynamicStyle(layoutColor)}
                        disabled={
                          loading ||
                          isPartialSubmisionAllowed ||
                          updatedQuestionStats?.notAttempt === 0
                            ? false
                            : true
                        }
                      >
                        {loading ? (
                          <PulseLoader size="10px" color="white" />
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mob-submit-box">
                <div className="mob-submit-btn">
                  <button
                    onClick={handleSubmitResponse}
                    disabled={
                      loading ||
                      isPartialSubmisionAllowed ||
                      updatedQuestionStats?.notAttempt === 0
                        ? false
                        : true
                    }
                  >
                    {loading ? (
                      <PulseLoader size="10px" color="white" />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* {capturedImages.map((image, index) => (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img
              key={index}
              src={image}
              alt={`Captured Image ${index + 1}`}
              style={{ width: "200px", height: "auto", marginRight: "10px" }}
            />
          ))} */}
        </div>
      ) : (
        <ExamSummary
          handlesubmit={handlesubmit}
          handleCancel={handleCancel}
          loading={submitLoading}
          summary={summary}
          testName={testName}
        />
      )}
      <MobChooseQuestions
        setShowNav={setShowNav}
        shownav={shownav}
        serialNo={currentQuestionSerialNo}
        lastQuestionSerialNo={lastQuestionSerialNo}
        handleShowNav={handleShowNav}
        loading={loading}
        questions={questionAll?.questionList?.questions}
        clickQuestionHandle={
          isQuestionNavigationEnable ? clickQuestionHandle : handleBlanck
        }
        handleSubmitResponse={handleSubmitResponse}
        isPartialSubmisionAllowed={isPartialSubmisionAllowed}
        noOfNotAttempt={updatedQuestionStats?.notAttempt === 0}
      />
    </>
  );
};

export default Question;
