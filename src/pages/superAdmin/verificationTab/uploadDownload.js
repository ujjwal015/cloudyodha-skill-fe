import * as React from "react";
import { PropagateLoader } from "react-spinners";
import { Dialog, DialogContent, Tooltip } from "@mui/material";
import "./download.style.css";

export default function DownloadAndUploadVerification({
  handleUpload,
  fileInfo,
  loading,
  submitSheet,
  setOpen,
  open,
  handleClose,
  handleDownloadSample,
}) {
  const handleOpen = () => setOpen(true);

  return (
    <div>
      <button
        onClick={() => {
          handleOpen();
        }}
        className="upload-btn"
      >
        {"Upload"}
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
            <div className="download_btn_wrapper">
              <p>Download Sample File</p>
              <button className="light-blue-btn" onClick={handleDownloadSample}>
                Download
              </button>
            </div>
            <div className="upload_wrapper">
              <input
                id="verificationFile_input"
                type="file"
                name="verificationFile_input"
                onChange={handleUpload}
                value={""}
                style={{ display: "none" }}
              />
              <div className="input_label_container">
                <label htmlFor="verificationFile_input">
                  Upload Excel Sheet
                </label>
              </div>
              <h6>
                {fileInfo?.name && fileInfo?.name.length > 15 ? (
                  <Tooltip title={fileInfo?.name || "No file selected"} arrow>
                    <p
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                        maxWidth: "300px", // Set a maximum width for the cell
                        textAlign: "center",
                      }}
                    >
                      {fileInfo?.name || "No file selected"}
                    </p>
                  </Tooltip>
                ) : (
                  <span>{fileInfo?.name || "No file selected"}</span>
                )}
              </h6>
              <div className="btn_container">
                <button className="light-blue-btn">
                  <label htmlFor="verificationFile_input">Select File</label>
                </button>
                <button onClick={submitSheet} className="light-blue-btn">
                  {loading ? <PropagateLoader color="#2ea8db" /> : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
