import React from "react";
import "./OMRSheet.css";

let columns = 6;
let rows = 10;

const OMRSheet = ({ numOfQuestions = 0, selectedAnswerKey = [] }) => {
  rows = numOfQuestions > 10 ? 10 : numOfQuestions;
  columns = Math.ceil(numOfQuestions / rows);

  return (
    <div className="section-container">
      <div className="header">OMR Sheet Preview</div>
      <div className="sheet">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="column">
            <div className="column-header">
              {["A", "B", "C", "D"].map((option) => (
                <div key={option} className="header-option">
                  {option}
                </div>
              ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => {
              const questionNumber = colIndex * rows + rowIndex + 1;
              const question = selectedAnswerKey.find(
                (q) => q.id === questionNumber
              );
              const selectedOption = question ? question.selected : null;

              return (
                <div
                  key={rowIndex}
                  className={`question ${
                    rowIndex % 2 === 1 ? "alternate-row" : ""
                  }`}
                >
                  <div className="question-number">
                    {questionNumber.toString().padStart(2, "0")}
                  </div>
                  <div className="options">
                    {["A", "B", "C", "D"].map((option) => (
                      <div
                        key={option}
                        className={`option ${
                          selectedOption === option ? "selected" : ""
                        }`}
                      >
                        {questionNumber > numOfQuestions
                          ? String.fromCharCode(88)
                          : option}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OMRSheet;
