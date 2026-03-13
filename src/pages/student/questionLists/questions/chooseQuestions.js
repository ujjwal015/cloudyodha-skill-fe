import React from "react";
import { Button } from "@mui/material";
import {
  QuestionButtonSkeletonLoader,
  SingleQuestionButtonSkeletonLoader,
} from "../../../../components/common/skeleton";
import { studentSelector } from "../../../../redux/slicers/studentSlice";
import { useSelector } from "react-redux";
import { getTextColorStyle } from "../../../../utils/projectHelper";
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
    <li>
      {loading ? (
        <SingleQuestionButtonSkeletonLoader />
      ) : (
        <Button
          variant="contained"
          className={`question-num `}
          style={{
            backgroundColor,
            color,
          }}
          onClick={() => clickQuestionHandle(data?._id)}
        >
          {/* {data?.serialNo} */}
          {serialNo}
        </Button>
      )}
    </li>
  );
};

const ChooseQuestions = ({ questions, loading, clickQuestionHandle, shownav }) => {
  const { updatedQuestionStats = {},layoutColor={} } = useSelector(studentSelector);

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
    // <div className="choose-question">
    <div className={shownav ? "show" : "choose-question card-border"}>
      <h2 style={{...getTextColorStyle(layoutColor)}}>Choose your Question</h2>
      <div className="question-numlist">
        <ul>
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
        </ul>
      </div>

      <div className="answer-instroduction">
        <div className="answer-num-main">
          {questionCount?.map((stat) => (
            <p key={stat.key}>
              <span className={stat?.className}>{updatedQuestionStats?.[stat?.key] || 0}</span>
              <span style={{...getTextColorStyle(layoutColor)}}>{stat?.label}</span>
            </p>
          ))}
        </div>
      </div>

      {/* <div className="action-btn_submit-test-box">
        <button className="action-btn_submit-test-btn">Submit Test</button>
      </div> */}
    </div>
  );
};

export default ChooseQuestions;
