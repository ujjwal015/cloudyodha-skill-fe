import React, { useCallback, useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import "./style.css";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import {
  getSubRole,
  getUserDetails,
  // navigate,
  userRoleType,
} from "../../../utils/projectHelper";
import { authSelector } from "../../../redux/slicers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  SUPER_ADMIN_ASSESSMENT_BATCH,
  SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE,
} from "../../../config/constants/routePathConstants/superAdmin";

const ScheduleBatch = ({ calendar, handleSelectedDate, scheduledBatch = [] }) => {
  function getTodaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); //
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const { calenderName, listName } = calendar;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userInfo = {} } = useSelector(authSelector);

  const [value, setValue] = React.useState(dayjs(getTodaysDate()));
  const handleDateSelect = (e) => {
    setValue(e);
  };

  const { EXAM_MANAGEMENT_FEATURE, EXAM_MANAGEMENT_SUB_FEATURE_2 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = EXAM_MANAGEMENT_SUB_FEATURE_2;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  useEffect(() => {
    handleSelectedDate(dayjs(value).format("DD/MM/YYYY"));
  }, [value]);

  const convertDateFormat = useCallback((originalDate) => {
    const date = dayjs(originalDate, "DD/MM/YYYY");
    const day = date.format("D");
    const month = date.format("MMM");
    const formattedDate = `${day} ${month}`;
    return formattedDate;
  }, []);

  const handleViewAllButtonClick = useCallback(() => {
    if (isRolePermission?.permissions?.["1"]) {
      navigate(SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE);
    }
  }, [navigate]);

  const handleColorOfText = (value) => {
    if (value === "online") {
      return "rgba(20, 201, 92, 1)";
    } else if (value === "offline") {
      return "rgba(245, 37, 37, 1)";
    } else {
      return "rgba(35, 31, 32, 0.7)";
    }
  };

  return (
    <div className="ScheduleCalendar" style={{}}>
      <h1 style={{ fontSize: "14px" }}>{calenderName}</h1>
      <div className="ScheduleCalendar__body">
        <div className="ScheduleCalendar__calendar">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              showDaysOutsideCurrentMonth
              fixedWeekNumber={6}
              value={value}
              onChange={(e) => handleDateSelect(e)}
            />
          </LocalizationProvider>
        </div>
        <div className="ScheduleCalendar__events">
          <div className="events_topheader">
            <h4>{listName}</h4>
            <button
              onClick={handleViewAllButtonClick}
              style={{
                color: isRolePermission?.permissions?.["1"] ? "rgba(25, 117, 255, 1)" : "#d6d3d3",
                cursor: isRolePermission?.permissions?.["1"] ? "pointer" : "not-allowed",
              }}>
              View all
            </button>
          </div>
          <div className="events-wrappers meetings">
            {scheduledBatch.length > 0 &&
              scheduledBatch.map((item) => (
                <div className="ScheduleCalendar__events-card">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}>
                      <div style={{ fontSize: "small", fontWeight: "bold", color: "rgba(59, 130, 246, 1)" }}>
                        <span>{convertDateFormat(item?.startDate) || ""}</span>
                        <span>-</span>
                        <span>{convertDateFormat(item?.endDate) || ""}</span>
                      </div>
                      <div className="event-status-CD">
                        <span>Not Started</span>
                      </div>
                    </div>

                    <div style={{ fontWeight: "bold", fontSize: "x-small" }}>
                      <p>
                        Batch ID:{" "}
                        <span style={{ color: "rgba(35, 31, 32, 0.7)", fontWeight: "normal" }}>
                          {item?.batchId || ""}
                        </span>
                      </p>
                      <p>
                        Batch Type:{" "}
                        <span
                          style={{
                            color: handleColorOfText(item?.batchMode),
                            fontWeight: "normal",
                          }}>
                          {item?.batchMode || ""}
                        </span>
                      </p>
                      <p>
                        Job Role:{" "}
                        <span style={{ color: "rgba(35, 31, 32, 0.7)", fontWeight: "normal" }}>
                          {item?.jobRole?.jobRole || "-"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {!scheduledBatch.length > 0 && (
            <div
              className="events-wrappers meetings"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                fontSize: "small",
              }}>
              <p>No Batch</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleBatch;
