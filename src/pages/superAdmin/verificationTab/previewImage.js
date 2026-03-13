import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./previewImage.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function PreviewImageModel({
  handlePreview,
  isPreviewOpen,
  setIsPreviewOpen,
  handlePreviewClose,
  url = null,
  name = null,
  batchName,
}) {
  return (
    <Dialog
      onClose={handlePreviewClose}
      aria-labelledby="customized-dialog-title"
      open={isPreviewOpen}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <div className="header-wrapper">
          <div className="section-wrapper">
            <div style={{ display: "flex", gap: 5 }}>
              <h2>Section -</h2>
              <p>{name ?? ""}</p>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <h2>Batch Name -</h2>
              <p>{batchName ?? ""}</p>
            </div>
          </div>
          <IconButton aria-label="close" onClick={handlePreviewClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      {name && name !== null && name.includes("Video") ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "30px",
            height: "500px",
          }}
        >
          <video controls={true}>
            <source src={url} />
          </video>
        </div>
      ) : (
        <div className="img-preview">
          <img src={url !== null ? url : ""} alt="preview" />
        </div>
      )}
    </Dialog>
  );
}
