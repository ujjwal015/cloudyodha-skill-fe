import * as React from "react";
import { PropagateLoader } from "react-spinners";
import { Dialog, DialogContent } from "@mui/material";
import "./download.style.css";
import { ReactComponent as SuccesIcon } from "../../../assets/icons/check-one.svg";

export default function DocsDownload({
  handleDownload,
  loading,
  isFileUploaded,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button
        onClick={() => {
          handleOpen();
          handleDownload();
        }}
        disabled={isFileUploaded ? false : true}
      >
        {loading ? <PropagateLoader color="#2ea8db" /> : "Download"}
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="download-dialog">
            <SuccesIcon />
            <h2>Download Successfully</h2>
            <p>
              This means sending anonymous location data to Google, even when no
              apps are running.
            </p>
            <button onClick={handleClose} className="light-blue-btn">
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
