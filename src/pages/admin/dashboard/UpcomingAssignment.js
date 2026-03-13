import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import moment from "moment/moment";
import { postUpcomingAssessmentApi } from "../../../api/superAdminApi/dashboard";
import { dashboardSelector } from "../../../redux/slicers/superAdmin/dashboardSlice";
import "react-calendar/dist/Calendar.css";
import "./calendar-style.css";
import { ReactComponent as RightIcon } from "./../../../assets/icons/right-cal-icon.svg";
import { ReactComponent as LeftIcon } from "./../../../assets/icons/left-cal-icon.svg";
import { ReactComponent as MoreIcon } from "../../../assets/icons/more-icon.svg";
import NoUpcomingAssignmentImg from "../../../assets/images/pages/dashboard/upcoming-calendar.png";
import { ActionComp } from ".";

const UpcomingAssignment = () => {
  const dispatch = useDispatch();
  const { assessmentDetail = [] } = useSelector(dashboardSelector);

  const [value, setValue] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  function randomColorGenerator() {
    const colors = [
      "red",
      "orange",
      "#04D375",
      "green",
      "#1AB6F7",
      "indigo",
      "#ae67d9",
      "#FFB573",
    ];

    // const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor;
  }

  const handleRemove = () => {
    setOpen(false);
  };
  // refresh component
  const handleRefresh = () => {
    const now = moment();
    const startDate = now.format("YYYY-MM-DD");
    const endDate = now.format("YYYY-MM-DD");
    const formData = {
      startDate,
      endDate,
    };
    dispatch(postUpcomingAssessmentApi(formData, setLoading));
    setValue(new Date());
    setOpen(false);
  };

  useEffect(() => {
    const startDate = moment(value[0]).format("YYYY-MM-DD");
    const endDate = moment(value[1]).format("YYYY-MM-DD");

    const formData = {
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(postUpcomingAssessmentApi(formData, setLoading));
  }, [value]);

  return (
    <>
      <section className="dashboard-calendar">
        <div className="calendar-text-wrapper">
          <p>Calendar</p>
          <div className="select-and-more-wrapper">
            <div className="calender">
              <ActionComp
                open={open}
                setOpen={setOpen}
                handleRefresh={handleRefresh}
                handleRemove={handleRemove}
              />
            </div>
          </div>
        </div>
        <Calendar
          onChange={setValue}
          value={value}
          selectRange
          view={"month"}
          tileContent={<p></p>}
          nextLabel={<RightIcon />}
          prevLabel={<LeftIcon />}
          minDate={moment().toDate()}
        />
        <div className="upcoming-assignment">
          <h6 className="title">Upcoming Assignment</h6>
          <div className="upcoming-assignment-cards">
            {assessmentDetail?.length > 0 ? (
              assessmentDetail?.map((event) => {
                const color = randomColorGenerator();
                return (
                  <div className="upcoming-assignment-card" key={event?.date}>
                    <div
                      className="border"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div>
                      <h5>
                        {event?.date && `${event?.date} `}
                        {event?.month && event?.month.slice(0,3)}
                      </h5>
                      <p>{event?.day}</p>
                    </div>
                    <h4
                      style={{ color }}
                    >{`${event?.totalAssessment} Assessments`}</h4>
                  </div>
                );
              })
            ) : (
              <div className="no-upcoming">
                <img src={NoUpcomingAssignmentImg} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default UpcomingAssignment;
