import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import "./style.css";
import { ReactComponent as LinkIcon } from "../../../../assets/icons/copy-link.svg";
import CloseIcon from "@mui/icons-material/Close";

const CopyModal = ({ handleCopy, handleClose, copy, copied, openLink }) => {
  const isCopyCreated = copy === "not created";
  const isButtonDisabled = isCopyCreated ? "disabled" : "";
  const copyButtonClass = copied ? "copied-btn" : "copy-btn";
  const copyButtonText = copied ? "Copied" : "Copy";
  return (
    <>
      <Dialog
        open={openLink}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="copy-link-dialog-wrapper"
      >
        <Box className="getLink-Modal">
          <DialogTitle id="alert-dialog-title" sx={{ padding: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <h6>Copy Link </h6>
              <DialogActions sx={{ padding: 0 }}>
                <Box
                  onClick={handleClose}
                  sx={{
                    justifyContent: "end",
                    padding: 0,
                    color: "#00000",
                    display: "grid",
                  }}
                >
                  <CloseIcon sx={{ color: "#5E6A7B", cursor: "pointer" }} />
                </Box>
              </DialogActions>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ padding: 0 }}>
            <Box className="copy-link-wrapper">
              <div className="text-wrapper">
                <div className="icon">
                  <LinkIcon />
                </div>
                <span>{copy}</span>
              </div>
              <div className="copy-button-wrapper">
                <Button
                  className={`${isButtonDisabled || copyButtonClass}`}
                  onClick={handleCopy}
                  disabled={isCopyCreated}
                >
                  {copyButtonText}
                </Button>
              </div>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default CopyModal;
