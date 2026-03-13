import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import "./style.css";

const DeleteModal = ({
  title,
  content,
  cancelText,
  confirmText,
  setOpen,
  open,
  handleCloseModal,
  confirmDelete,
}) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseModal}
        fullWidth={true}
        maxWidth={"xs"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-wrapper"
      >
        <Box className="delete-Modal">
          <DialogTitle
            id="alert-dialog-title"
            sx={{ padding: 0 }}
            className="title"
          >
            <Box>
              <h6>{title ?? "Deleting Question"}</h6>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ padding: 0 }} className="content-body">
            <Box>
              <p>{content ?? "Are you sure you want to delete this"}</p>
            </Box>
            <Box sx={{ padding: 0 }}>
              <Box className="action-btn-wrapper">
                <Button className="outlined-btn" onClick={handleCloseModal}>
                  {cancelText ?? "No"}
                </Button>
                <Button className="light-blue-btn" onClick={confirmDelete}>
                  {confirmText ?? "Yes"}
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default DeleteModal;
