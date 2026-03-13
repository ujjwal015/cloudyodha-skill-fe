import { useState, useEffect } from "react";
import { getSuspiciousActivityApi } from "../api/studentApi";
import { warningToast } from "../utils/projectHelper";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../redux/slicers/authSlice";
import useFullscreen from "./useFullscreen";

const useDetectSuspiciousActivity = (
  message,
  setLoading,
  batchId,
  candidateId,
  navigate
) => {
  const dispatch = useDispatch();
  const [exitCount, setExitCount] = useState(() => {
    const storedExitCount = localStorage.getItem("exitCount");
    return storedExitCount ? parseInt(storedExitCount, 10) : 0;
  });

  const { userInfo } = useSelector(authSelector);
  const { batchDetails } = userInfo;

  let updatedExitCount;
  const handleBeforeUnload = (event) => {
    updatedExitCount = exitCount + 1;
    const confirmationMessage =
      message ||
      `Are you sure you want to leave? (Attempt ${updatedExitCount})`;
    // Save the updated exitCount to local storage
    localStorage.setItem("exitCount", updatedExitCount.toString());
    event.preventDefault();
    event.returnValue = confirmationMessage;
    setExitCount(updatedExitCount);
    return confirmationMessage;
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden" && message) {
      setExitCount((prevCount) => prevCount + 1);
      localStorage.setItem("exitCount", exitCount.toString());
    }
  };
  const handleUnload = () => {
    alert("Custom alert: You are leaving the page.");
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [message, exitCount]);

  useEffect(() => {
    if (
      batchDetails?.proctoring?.browserExit?.browserExitAlert &&
      exitCount !== 0
    ) {
      warningToast(message);
      dispatch(
        getSuspiciousActivityApi(setLoading, batchId, candidateId, navigate)
      );
    }
  }, [exitCount]);

  return { exitCount, updatedExitCount };
};

export default useDetectSuspiciousActivity;
