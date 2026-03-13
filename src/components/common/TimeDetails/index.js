import React from "react";
import "./TimeDetails.css";
import { studentSelector } from "../../../redux/slicers/studentSlice";
import { useSelector } from "react-redux";
import moment from "moment";

const TimeDetails = () => {

  const { candidateResultSummary = {} } = useSelector(studentSelector);
  
  const startTime = candidateResultSummary?.startTime;
  const endTime = candidateResultSummary?.endTime;

  const totalTime = 999 * 60;
  const timeUsed = candidateResultSummary?.spentTime * 60;

  const progressPercent = (timeUsed / totalTime) * 100;

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatSpentTime = (milliseconds) => { 
  const totalSeconds = Math.floor(milliseconds / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

  

  return (
    <div className="time-card" style={{ width: "100%", height: "100%" }}>
      <h3 className="time-heading">Time Details</h3>

      <div className="time-row">
        <span className="used-time">{formatSpentTime(candidateResultSummary?.spentTime)} </span>
        <span>/</span>
        <span className="total-time">{formatTime(totalTime)}</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-filled"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="progress-knob"></div>
        </div>
      </div>

      <div className="time-metadata">
        <div className="meta-item">
          <span className="dot blue"></span>
          <p>Assessment Start Time</p>
          <span className="meta-time">{moment(startTime).format('h:mm A')}</span>
        </div>
        <div className="meta-item">
          <span className="dot red"></span>
          <p>Assessment End Time</p>
          <span className="meta-time">{moment(endTime).format('h:mm A')}</span>
        </div>
      </div>
    </div>
  );
};

export default TimeDetails;
