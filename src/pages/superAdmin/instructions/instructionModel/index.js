import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import "./style.css";
import { ReactComponent as EyeIcon } from "../../../../assets/icons/eye.svg";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/close-icon.svg";
import SelectInput from "../../../../components/common/SelectInput";
import { LANGUAGE } from "../../../../config/constants/projectConstant";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const PreviewTooltip = styled(Tooltip)(({ theme }) => ({
  ".& .MuiTooltip-tooltip": {
    backgroundColor: "#2DB6F5",
    color: "#ffff",
    border: "1px solid #ccc",
  },
}));

export default function InstructionModel({ descriptionHindi, descriptionEnglish, descriptionLanguage }) {
  const initialValues = {
    language: "english",
  };
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const { language } = formValues;
  return (
    <div>
      <PreviewTooltip title="Preview" arrow>
        <EyeIcon onClick={handleOpen} />
      </PreviewTooltip>

      <Dialog
        open={open}
        fullWidth
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ py: 1 }} id="scroll-dialog-title">
          <div className="wrapper">
            <h2 className="title"> Instructions</h2>
            <div className="select-btn-wrapper">
              {descriptionLanguage === "Both" && (
                <div>
                  <SelectInput
                    // label=""
                    name="language"
                    placeHolder="Select language"
                    options={LANGUAGE}
                    value={formValues?.language}
                    handleChange={handleChange}
                    mandatory
                  />
                </div>
              )}

              <CloseIcon onClick={handleClose} />
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={"paper"}>
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <Box>
              <div className="content">
                {language === "hindi" || descriptionLanguage === "Hindi" ? (
                  <p dangerouslySetInnerHTML={{ __html: descriptionHindi }} style={{ fontWeight: 600 }}></p>
                ) : (
                  ""
                )}
                {language === "english" && <p dangerouslySetInnerHTML={{ __html: descriptionEnglish }}></p>}
              </div>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
