import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { Label } from "@mui/icons-material";
import "./style.css";
import DateInput from "../../DateInput";
import Calendar from "../../../../components/common/ScheduleCalendar/index";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import TimeRange from "./TimeRange";
import MyOutlinedBtn from "../../../newCommon/Buttons/MyOutlinedBtn";
import MyFilledBtn from "../../../newCommon/Buttons/MyFilledBtn";
import { RingLoader } from "react-spinners";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import { scheduleMeetingForLead } from "../../../../api/authApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CalenderWitTimeRange({
  open,
  handleClose,
  handleOpen,
  id,
  userId,
  setOpenCalenderModal
}) {
  //   const [open, setOpen] = React.useState(false);
  //   const handleOpen = () => setOpen(true);
  //   const handleClose = () => setOpen(false);
  const [addNewModal, setAddNewModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [calenderDate, setCalenderDate] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [startMeetingTime, setStartMeetingTime] = React.useState("");
  const [endMeetingTime, setEndMeetingTime] = React.useState("");
  const dispatch = useDispatch();
  console.log("Title", title);
  console.log("CALENDER_DATE", calenderDate);

  const handleScheduleMeetingForLead = (formData) => {
    dispatch(scheduleMeetingForLead(setLoading, id, formData,setOpenCalenderModal));
  };

  const handleAddNewClick = () => {
    setAddNewModal(true);
  };

  const scheduleCalendar = {
    isCalender: true,
    isPermissions: {
      1: true,
      2: false,
      3: false,
      4: true,
      5: false,
      6: true,
    },
    calenderName: "Schedule Calender",
    listName: "Schedule list",
    schedule: {
      buttonList: [
        {
          name: "Add New",
          isPermissions: {
            1: true,
            2: false,
            3: false,
            4: true,
            5: false,
            6: true,
          },
          onClick: handleAddNewClick,
        },
        /* {
        name: "View all",
        isPermission: true,
        onClick: handleViewClick,
      }, */
      ],
      listofMeetings: [
        {
          day: "THU",
          date: "04",
          meeting: "Meeting with ksdc",
          startTiming: "09:00 am",
          endTiming: "11:00 am",
          isPermissions: {
            1: true,
            2: false,
            3: false,
            4: true,
            5: false,
            6: true,
          },
          actions: [
            {
              isPermissions: {
                1: true,
                2: false,
                3: false,
                4: true,
                5: false,
                6: true,
              },
              actionName: "Edit",
            },
            {
              isPermissions: {
                1: true,
                2: false,
                3: false,
                4: true,
                5: false,
                6: true,
              },
              actionName: "Delete",
            },
          ],
        },
      ],
      /*   listOfUpcomings: [
      {
        startTiming: "23 Mar",
        endTiming: "25 Mar",
        status: "Not Started",
        batchDetails: [
          {
            batchID: "127067",
            "batch Type": "Online",
            jobRole: "Multi-Cuisine Cook",
            isPermission: true,
          },
        ],
      },
      {
        startTiming: "23 Mar",
        endTiming: "25 Mar",
        status: "Not Started",
        batchDetails: [
          {
            batchID: "127067",
            "batch Type": "Online",
            jobRole: "Multi-Cuisine Cook",
            isPermission: true,
          },
        ],
      },
    ], */
    },
  };

  const handleCancel = () => {
    // clearFormValues();
    // navigate(-1);
    setEndMeetingTime("");
    setStartMeetingTime("");
    setTitle("");
    setLoading(false);
    // setAddNewModal(false);
    handleClose(false)
    setCalenderDate(null);
  };

  const handleSubmit = () => {
    const day = calenderDate.$D;
    const month = calenderDate.$M + 1; // $M is zero-based, so we add 1
    const year = calenderDate.$y;

    const formattedDate = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;

    // console.log("FORMATED-DATE:- ",{formattedDate,title,id,startMeetingTime ,endMeetingTime,userId})
    const formData = {
      title: title,
      from_userid: userId,
      schedule_date: formattedDate,
      start_time: startMeetingTime,
      end_time: endMeetingTime,
    };
    handleScheduleMeetingForLead(formData);
    console.log("FORM====DATA", formData);
  };

  const buttonData = {
    name: "createLead",
    text: "Create Lead",
    onClick: handleSubmit,
    path: "",
    loading: loading,
    disabled: loading ? true : false,
    isPermissions: {},
  };

  const handleTitleInput = (e) => {
    setTitle(e.target.value);
  };
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleCancel}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="calender-modal-container">
              <div className="calender-modal-title">
                <p>Add New Schedule</p>
              </div>
              <div>
                <div className="calender-modal-input-field">
                  <label>Schedule Title</label>
                  <TextField
                    id="outlined-basic"
                    label=""
                    variant="outlined"
                    placeholder="Write you meeting title"
                    sx={{ width: "100%" }}
                    value={title}
                    onChange={(e) => handleTitleInput(e)}
                  />
                </div>

                <div className="calender-modal-calender-time-range">
                  <div className="calender-modal-calender">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      {/* <DateCalendar defaultValue={dayjs('2022-04-17')} /> */}
                      {/* <DateCalendar value={calenderDate} onChange={(newValue) => setCalenderDate(newValue)} /> */}
                      <DateCalendar
                        // showDaysOutsideCurrentMonth
                        fixedWeekNumber={3}
                        sx={{
                          color: "black",
                          fontSize: "large",
                          fontWeight: "bolder",
                        }}
                        value={calenderDate}
                        onChange={(newValue) => setCalenderDate(newValue)}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="calender-modal-timeRange">
                    <TimeRange
                      setStartMeetingTime={setStartMeetingTime}
                      setEndMeetingTime={setEndMeetingTime}
                    />
                  </div>
                </div>
                <div className="calender-modal-buttons">
                  <MyOutlinedBtn
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading ? true : false}
                    text="Cancel "
                  />
                  <MyFilledBtn
                    variant="contained"
                    btnItemData={buttonData}
                    disabled={loading ? true : false}
                    text={
                      loading ? (
                        <RingLoader size="25px" color="white" />
                      ) : (
                        "Create Lead"
                        // [clientId ? "Update Client" : "Create Lead"]
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
