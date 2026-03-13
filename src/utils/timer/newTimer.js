import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { studentSelector } from "../../redux/slicers/studentSlice";
import { saveRemainingExamTimeApi } from "../../api/studentApi";
import { useParams } from "react-router-dom";
import { TimerSkeletonLoader } from "../../components/common/skeleton";
import { getTextColorStyle } from "../projectHelper";

function NewTimer({ handlesubmit, layoutColor }) {
  const { newResumeTimer } = useSelector(studentSelector);
  const dispatch = useDispatch();
  const params = useParams();
  const { batchId, candidateId } = params;
  const initialMiliSeconds = 50000;
  const [time, setTime] = useState(initialMiliSeconds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setTime(newResumeTimer);
  }, [newResumeTimer]);

  useEffect(() => {
    let timerIntervalId;
    let autoClickIntervalId;

    timerIntervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1000 : prevTime));
    }, 1000);

    // Interval for triggering handleClick every 15 seconds
    autoClickIntervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          dispatch(
            saveRemainingExamTimeApi(
              { remainingMiliseconds: prevTime },
              batchId,
              candidateId,
              setLoading
            )
          );
        } else if (prevTime === 0) {
          handlesubmit();
        }
        return prevTime; // Return the previous time to keep the timer running
      });
    }, 120000);

    return () => {
      clearInterval(timerIntervalId);
      clearInterval(autoClickIntervalId);
    };
  }, []);

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function convertMsToTime(milliseconds) {
    if (!milliseconds) return "0 H: 0 Min :0 Sec";
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    return `${padTo2Digits(hours)} : ${padTo2Digits(minutes)} : ${padTo2Digits(
      seconds
    )}`;
  }

  return (
    <>
      {loading ? (
        <TimerSkeletonLoader />
      ) : (
        <p className="exam-timer">
          Time :
          <span style={{ ...getTextColorStyle(layoutColor) }}>
            {convertMsToTime(time)}
          </span>
        </p>
      )}
    </>
  );
}

export default NewTimer;
