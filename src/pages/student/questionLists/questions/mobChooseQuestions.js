import React from "react";
import "./style.css";
import { useSelector } from "react-redux";
import { studentSelector } from "../../../../redux/slicers/studentSlice";
import {
  QuestionButtonSkeletonLoader,
  SerialNoTextSkeletonLoader,
  SingleQuestionButtonSkeletonLoader,
} from "../../../../components/common/skeleton";

const ChooseQuestion = (props) => {
  const { data, clickQuestionHandle, serialNo, loading } = props;

  const backgroundColor = data.questionStatus?.notAttempt
    ? "#F2F2F2"
    : data.questionStatus?.answered
    ? "#04d375"
    : data.questionStatus?.markForReview
    ? "#a378d9"
    : data.questionStatus?.notAnswered
    ? "#FF3F3F"
    : data.questionStatus?.answeredMarkForReview
    ? "#000000"
    : "#FF3F3F";

  const color = data.questionStatus?.notAttempt
    ? "#263238"
    : data.questionStatus?.answered
    ? "white"
    : data.questionStatus?.markForReview
    ? "white"
    : data.questionStatus?.notAnswered
    ? "white"
    : data.questionStatus?.answeredMarkForReview
    ? "#ffffff"
    : "white";

  return (
    <div className="question-num-box-btn">
      {loading ? (
        <SingleQuestionButtonSkeletonLoader />
      ) : (
        <button
          style={{
            backgroundColor,
            color,
          }}
          onClick={() => clickQuestionHandle(data?._id)}
        >
          {serialNo}
        </button>
      )}
    </div>
  );
};

function MobChooseQuestions({
  setShowNav,
  shownav,
  serialNo,
  lastQuestionSerialNo,
  loading,
  questions,
  clickQuestionHandle,
  handleSubmitResponse,
  isPartialSubmisionAllowed,
  noOfNotAttempt,
}) {
  const { updatedQuestionStats = {} } = useSelector(studentSelector);

  const questionCount = [
    { key: "answered", className: "answered", label: "Total Answered" },
    { key: "notAnswered", className: "not-answer", label: "Not Answered" },
    { key: "markForReview", className: "marked", label: "Marked for Review" },
    { key: "notAttempt", className: "not-attempt", label: "Not Attempt" },
    {
      key: "answeredMarkForReview",
      className: "answered-marked",
      label: "Answered & Marked for Review",
    },
  ];

  return (
    <div onClick={() => setShowNav(false)} className={`mob-nav-step-overlay ${shownav ? "show" : ""}`}>
      <div onClick={(event) => event.stopPropagation()} className={`mob-nav-step ${shownav ? "show" : ""}`}>
        <div>
          <div className="nav-dash-box">
            <div className="nav-dash"></div>
          </div>

          <div className="head-nav">
            <h3>Choose Questions</h3>
            <h3>{true ? <SerialNoTextSkeletonLoader /> : serialNo / lastQuestionSerialNo}</h3>
          </div>

          {/* <div className="instruction-info-box"> */}
          <div className="answer-instroduction">
            <div className="answer-num-main">
              {questionCount?.map((stat) => (
                <p key={stat.key}>
                  <span className={stat?.className}>{updatedQuestionStats?.[stat?.key] || 0}</span>
                  <span>{stat?.label}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="question-num-box">
            {loading ? (
              <QuestionButtonSkeletonLoader />
            ) : (
              questions?.map((_question, index) => (
                <ChooseQuestion
                  data={_question}
                  clickQuestionHandle={clickQuestionHandle}
                  key={_question?._id}
                  loading={loading}
                  serialNo={_question?.serialNo}
                />
              ))
            )}
          </div>
        </div>
        {(isPartialSubmisionAllowed || noOfNotAttempt) && (
          <button className="light-blue-btn" onClick={handleSubmitResponse}>
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
}

export default MobChooseQuestions;
