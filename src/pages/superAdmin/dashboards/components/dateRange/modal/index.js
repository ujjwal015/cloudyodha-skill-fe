import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { format } from "date-fns";
import { Suspense } from "react";
import styles from "../DateRange.module.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { shouldAppendDateParams } from "../../../../../../utils/projectHelper";

const DateRangePicker = React.lazy(() => import("../index"));

function PaperComponent(props) {
  const nodeRef = React.useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

const DatePickerModal = ({ data, dateRangeData }) => {
  const { range, handleOkClick } = dateRangeData;
  const { open, handleOpen, handleClose } = data;

  const okClickHandler = () => {
    handleOkClick();
    handleClose();
  };

  return (
    <React.Fragment>
      {/* OPEN BUTTON */}
      <button onClick={handleOpen} className={styles.dateButton}>
        <CalendarMonthIcon className={styles.icon} />
        {!shouldAppendDateParams(range)
          ? "Select Date Range"
          : `${format(range[0].startDate, "dd MMM yyyy")} - ${format(
              range[0].endDate,
              "dd MMM yyyy"
            )}`}
      </button>

      {/* DRAGGABLE DIALOG */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move", fontSize: "20px" }}
          id="draggable-dialog-title"
        >
          Select Date Range
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            overflow: "visible",
            padding: 0,
            minWidth: "337px",
            minHeight: "360px",
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <DateRangePicker data={dateRangeData} />
          </Suspense>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={okClickHandler}>OK</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default React.memo(DatePickerModal);
