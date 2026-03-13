import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  activitySelector,
  navigatePath,
  sessionSuccess,
} from "../redux/slicers/activitySlice.js";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../utils/projectHelper";

const ActivityContainer = ({ children }) => {
  const { navPath } = useSelector(activitySelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      dispatch(sessionSuccess(userData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (navPath) {
      navigate(navPath);
      dispatch(navigatePath(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navPath]);

  return children;
};

export default ActivityContainer;
