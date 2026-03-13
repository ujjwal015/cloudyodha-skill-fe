import { Skeleton } from "@mui/material";
import React from "react";

function CalenderSkeleton() {
  return (
    <div>
      <Skeleton width={100} height={35} />
      <div className="ScheduleCalendar__body">
        <div
          className="ScheduleCalendar__calendar"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton width={"90%"} height={"95%"} />
        </div>
        <div className="ScheduleCalendar__events">
          <div className="events_topheader">
            <Skeleton width={60} height={20} />
            <Skeleton width={10} height={10} />
          </div>
          <div className="events-wrappers meetings">
            <div className="ScheduleCalendar__events-card">
              <div className="event-time-head">
                <div className="event-period">
                  <span>
                    <Skeleton width={30} height={20} />
                  </span>
                  <Skeleton width={30} height={20} />
                  <span></span>
                </div>
              </div>
              <div className="event-details-list">
                <p>
                  <Skeleton width={90} height={20} />
                </p>
                <p>
                  <Skeleton width={90} height={20} />
                </p>
                <p>
                  <Skeleton width={90} height={20} />
                </p>
                <p>
                  <Skeleton width={90} height={20} />
                </p>
              </div>
            </div>

            <div className="ScheduleCalendar__events-card">
              <div className="event-time-head">
                <div className="event-period">
                  <span>
                    <Skeleton width={30} height={20} />
                  </span>
                  <Skeleton width={30} height={20} />
                  <span></span>
                </div>
              </div>
              <div className="event-details-list">
                <p>
                  <Skeleton width={90} height={20} />
                </p>
                <p>
                  <Skeleton width={90} height={20} />
                </p>
                <p>
                  <Skeleton width={90} height={20} />
                </p>
                <p>
                  <Skeleton width={90} height={20} />
                </p>
              </div>
            </div>

            <div className="ScheduleCalendar__events-card">
              <div className="event-time-head">
                <div className="event-period">
                  <span>
                    <Skeleton width={30} height={20} />
                  </span>
                  <Skeleton width={30} height={20} />
                  <span></span>
                </div>
              </div>
              <div className="event-details-list">
                <p>
                  <Skeleton width={90} height={20} />
                </p>
                <p>
                  <Skeleton width={90} height={20} />
                </p>
                <p>
                  <Skeleton width={90} height={20} />
                </p>
                <p>
                  <Skeleton width={90} height={20} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalenderSkeleton;
