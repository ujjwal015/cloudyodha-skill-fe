import * as React from "react";
import "./style.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { ReactComponent as ConfirmIcon } from "../../../assets/icons/success.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
  justifyContent: "center",
  alignItems: "center",
};
export default function ConfirmModal({ visible, onConfirm, onCancel }) {
  const deleteHandler = () => {
    onConfirm?.();
  };

  if (!visible) return <></>;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={visible}
      onClose={onCancel}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={visible}>
        <Box sx={style}>
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ConfirmIcon />
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Are you sure ?
            </Typography>
            <Typography
              id="transition-modal-description"
              sx={{ mt: 2, textAlign: "center" }}
            >
              Are you sure you want to regenerate the results. You will not be
              able to reverse this action.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                width: "100%",
              }}
            >
              <Button
                onClick={onCancel}
                sx={{
                  border: "solid 1px #1AB6F7",
                  color: "#1AB6F7",
                  textTransform: "capitalize",
                  "&:hover": {
                    border: "solid 1px #1AB6F7",
                    color: "#1AB6F7",
                  },
                  width: "45%",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={deleteHandler}
                sx={{
                  backgroundColor: "#1AB6F7",
                  color: "#F5F5F5",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#1AB6F7",
                    color: "#F5F5F5",
                  },
                  width: "45%",
                }}
              >
                Confirm
              </Button>
            </Box>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
