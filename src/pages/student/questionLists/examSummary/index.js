import React from "react";
import { PulseLoader } from "react-spinners";
import "./style.css";

const ExamSummary = ({ summary, loading, handlesubmit, handleCancel, testName }) => {
  const { noOfQuestions, answered, notAnswered, markForReview, answeredMarkForReview, notAttempt } = summary;
  return (
    <>
      <div className="exam-summary hscreen">
        <div className="card-wrapper">
          <div className="card">
            <div className="title">
              <h2>Exam Summary</h2>
            </div>

            <div className="Rtable Rtable--6cols Rtable--collapse">
              <div style={{ order: 0 }} className="Rtable-cell Rtable-cell--head">
                <h3>NO. OF QUESTIONS</h3>
              </div>
              <div style={{ order: 1 }} className="Rtable-cell">
                <p>{noOfQuestions || 0}</p>
              </div>
              <div style={{ order: 0 }} className="Rtable-cell Rtable-cell--head">
                <h3>ANSWERED</h3>
              </div>
              <div style={{ order: 1 }} className="Rtable-cell">
                <p>{answered || 0}</p>
              </div>
              <div style={{ order: 0 }} className="Rtable-cell Rtable-cell--head">
                <h3>NOT ANSWERED</h3>
              </div>
              <div style={{ order: 1 }} className="Rtable-cell">
                <p>{notAnswered || 0}</p>
              </div>
              <div style={{ order: 0 }} className="Rtable-cell Rtable-cell--head">
                <h3>Answered & Marked for Review</h3>
              </div>
              <div style={{ order: 1 }} className="Rtable-cell">
                <p>{answeredMarkForReview || 0}</p>
              </div>
              <div style={{ order: 0 }} className="Rtable-cell Rtable-cell--head">
                <h3>Marked for Review</h3>
              </div>
              <div style={{ order: 1 }} className="Rtable-cell">
                <p>{markForReview || 0}</p>
              </div>
              <div style={{ order: 0 }} className="Rtable-cell Rtable-cell--head">
                <h3>Not Attempt</h3>
              </div>
              <div style={{ order: 1 }} className="Rtable-cell">
                <p>{notAttempt || 0}</p>
              </div>
            </div>

            <div className="confirm-submit-title">
              <h1>Are you sure you want to submit ?</h1>
            </div>
            <div className="submit-btn-wrapper">
              <button className="outlined-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="light-blue-btn"
                disabled={loading ? true : false}
                onClick={loading ? undefined : handlesubmit}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "Submit Test"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamSummary;
