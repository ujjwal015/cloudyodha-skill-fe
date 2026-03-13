import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { TimerSkeletonLoader } from "../../../../components/common/skeleton";
import { studentSelector } from "../../../../redux/slicers/studentSlice";

const QuestionNav = ({ testName, handlesubmit, loading, handleShowNav }) => {
  const { resumeTimer } = useSelector(studentSelector);
  const initialSeconds = parseTimeString("2:0:0");
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const time =
      typeof resumeTimer == "string"
        ? parseTimeString(resumeTimer)
        : initialSeconds;
    setSeconds(time);
  }, [resumeTimer]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          submitTest(intervalId);
          return 0;
        } else {
          return prevSeconds - 1;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const submitTest = (intervalId) => {
    clearInterval(intervalId);
    handlesubmit();
  };

  const timer = secondsToHMS(seconds);
  const t = timer?.split(":");

  const formattedDuration = `${t[0]} h ${t[1]} min ${t[2]} sec`;

  return (
    <>
      {loading ? (
        <TimerSkeletonLoader />
      ) : (
        <p className="exam-timer">
          Time:
          <span>{isNegative(seconds) ? "00:00:00" : formattedDuration}</span>
        </p>
      )}
    </>
  );
};

export default QuestionNav;

function parseTimeString(timeString) {
  const [hours, minutes, seconds] = timeString?.split(":")?.map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToHMS(seconds) {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = seconds % 60;

  var formattedTime = `${hours}:${minutes}:${remainingSeconds}`;
  return formattedTime;
}

function isNegative(num) {
  if (Math.sign(num) === -1) {
    return true;
  }
  return false;
}
