import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import "./style.css";
import React from "react";
import { ReactComponent as CloseIcon } from "../../../../../../assets/icons/close-icon.svg";

const ViewNOSModal = ({ data, jobRoleName }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button size="small" sx={{fontSize:12,p:0}} onClick={handleOpen}>View NOS</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-wrapper increase-exam-time "
      >
        <Box className="increase-exam-time-Modal">
          <Box className="title-wrapper">
            <Box className="icon-title-wrapper">
              <DialogTitle
                id="alert-dialog-title"
                sx={{ padding: 0 }}
                className="title"
              >
                <Box>
                  <h6>{jobRoleName}</h6>
                </Box>
              </DialogTitle>
            </Box>
            <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>
          <DialogContent sx={{ padding: 0 }} className="content-body">
            <Box>
              <div className="edit-profile security">
                <div className="form-wrapper">
                  <div className="form">
                    {data.map((el, index) => {
                      return (
                        <div key={index} className="NOS_container">
                          <h3>{el?.NOS || "-"}</h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Box>
            <Divider variant="middle" sx={{ marginBottom: "20px" }} />
            <Box className="cancel_btn_wrapper" onClick={handleClose}>
              <h2>Close</h2>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default ViewNOSModal;
