import React from "react";
import "./style.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ReactComponent as AttendanceExitIcon } from "../../../../assets/icons/attendance-clock-exit.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/close-icon.svg";
import "./style.css";

const AttendenceClockModal = (props) => {
  const { open, handleClose, attendanceData } = props;
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div className="attendance-clock-modal">
            <AttendanceExitIcon />

            <div>
              <p>Web Clock in/Clock out</p>
            </div>
            <div>
              <CloseIcon onClick={handleClose}/>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="attendance-clock-wrapper">
            <h1>{attendanceData?.locationName}</h1>
            <div>
              <h2>{attendanceData?.formattedTime}</h2>
              <p>{attendanceData?.formattedDate}</p>
            </div>
          </div>
          <div className="attendance-clock-actions-btn">            
            {attendanceData?.isClockIn ? (
            <button
              onClick={ () => attendanceData?.onClick(true)}
              className="btn btn-clockout"
            >
              Clock-Out
            </button>
          ) : (
            <button className="btn btn-clockin" onClick={ () => attendanceData?.onClick(false)}>
              Clock-In
            </button>
          )}
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default AttendenceClockModal;
