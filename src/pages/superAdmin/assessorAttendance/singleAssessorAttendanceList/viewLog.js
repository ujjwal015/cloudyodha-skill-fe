import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ReactComponent as ActionDots } from "../../../../assets/images/common/action-dots.svg";
import moment from "moment/moment";
import "./style.css";
import ArrowDown from "../../../../assets/icons/arrow-down-right.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/CloseIcon.svg";
import { capitalizeFirstLetter } from "../../../../utils/projectHelper";

export default function ViewLog1({
  date,
  clockInTime,
  clockOutTime,
  reason,
  status,
  actionOpen,
  setActionOpen,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
        <div className="more-wrapper" style={{cursor:'pointer'}}>
          <ActionDots
            onClick={handleClick}
            className="three-dot-icon"
          />
        </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
          <div className="view-log-wrapper">
            <div style={{ display: "flex" }}>
              <div className="date-card">
                <div className="req-date">
                  <h6>{moment(date).format("MMM")}</h6>
                  <h3>{moment(date).format("Do")}</h3>
                  <p>{moment(date).format("dddd")}</p>
                </div>
                <div className="req-txt">
                  <h3>Attendance Request</h3>
                  <p>
                    {moment(date).format(" MMM Do YYYY")},{clockInTime||"NA"}-
                    {clockOutTime||"NA"}
                  </p>
                </div>
              </div>
              <div className="closed-icon">
                <CloseIcon onClick={handleClose} />
              </div>
            </div>
            <div className="on-duty-wrapper">
              <div className="on-duty-title">
                <h2>On Duty</h2>
              </div>
              <div className="clock-in-out-wrapper">
                <div className="clock-in">
                  <img src={ArrowDown} alt="clock-in-img" />
                  {clockInTime||"NA"}
                </div>
                <div className="clock-out">
                  <img src={ArrowDown} alt="clock-out-img" />
                  {clockOutTime || "Missing"}
                </div>
              </div>
            </div>

            <div className="message-wrapper">
              <div className="message-title">
                <h2>Reason</h2>
              </div>
              <div className="message">
                <p>{capitalizeFirstLetter(reason||'NA')}</p>
              </div>
            </div>

            <div className="status-wrapper">
              <div className="status-title">
                <h2>Status</h2>
              </div>
              <div className="status">
                <p>{capitalizeFirstLetter(status||"NA")}</p>
              </div>
            </div>
          </div>
      </Menu>
    </div>
  );
}
