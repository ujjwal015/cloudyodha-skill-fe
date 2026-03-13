import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ReactComponent as FlagIcon } from "../../../../assets/icons/flag-reset.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/x-close.svg";

import React from "react";
import "./style.css";

const LogsModal = ({ open, handleCloseModal, userData }) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseModal}
        scroll={"paper"}
        fullWidth={true}
        maxWidth={"xs"}
        className="logs-Modal"
      >
        <DialogTitle className="logs-header">
          <div className="logs-title">
            <div className="logs-title-icon">
              <FlagIcon />
            </div>
            <div>
              <h6>Student Details</h6>
              <p>See All Details of Poc here.</p>
            </div>
          </div>
          <div>
            <CloseIcon style={{cursor:"pointer"}} onClick={handleCloseModal} width={20}/>
          </div>
        </DialogTitle>

        <DialogContent className="no-scrollbar">
          <div>
            {Object.keys(userData).map((key) => {
              return (
                <div key={key} style={{ display: "flex",fontSize:"14px",fontWeight:"500" }}>
                  <p style={{ width: "40%",textTransform:"capitalize",opacity:"0.9" }}>{key} :</p>
                  <p style={{ width: "60%",opacity:"0.7" }}>{userData[key]}</p>
                </div>
              );
            })}
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogsModal;
