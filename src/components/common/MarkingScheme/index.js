import React from "react";
import "./MarkingScheme.css";
import { useSelector } from "react-redux";
import { studentSelector } from "../../../redux/slicers/studentSlice";

const MarkingScheme = () => {
  const { candidateResultSummary = {} } = useSelector(studentSelector);

  const score = candidateResultSummary?.percentageScored || 0;

  return (
    <div className="marking-container">
      <h3 className="marking-title">Marking Scheme</h3>
      <p className="performance-label">Your Performance</p>

      <div className="marking-bar-wrapper">
        <div className="marking-bar">
          <div className="range poor"></div>
          <div className="range average"></div>
          <div className="range good"></div>
        </div>

        {/* User Indicator */}
        <div
          className="indicator"
          style={{ left: `${score}%`, transform: "translateX(-50%)" }}
        >
          <div className="label">You Scored</div>
          <div className="arrow" />
        </div>
      </div>

      {/* Range Labels */}
      <div className="range-labels">
        <span className="label-poor">Poor (0–25%)</span>
        <span className="label-average">Average (26–85%)</span>
        <span className="label-good">Good (86–100%)</span>
      </div>
    </div>
  );
};

export default MarkingScheme;
