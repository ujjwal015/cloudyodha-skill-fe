import { ReactComponent as BoldIcon } from "../../../../assets/icons/BoldIcon.svg";
import { ReactComponent as AttachementIcon } from "../../../../assets/icons/AttachementIcon.svg";
import { ReactComponent as ItalicIcon } from "../../../../assets/icons/ItalicIcon.svg";
import { ReactComponent as HorizontalMoreIcons } from "../../../../assets/icons/HorizontalMoreIcons.svg";

import { Button, Dialog, DialogContent, TextField } from "@mui/material";
import { ReactComponent as PrfileImage } from "../../../../assets/icons/users.svg";
import "./style.css";
import { useEffect, useState } from "react";
import { Margin } from "@mui/icons-material";
// import LongMenu from "../../../newCommon/HorizontalActionDropdown/HorizontalActionDropdown";
import EditRemark from "../../../../pages/superAdmin/LeadsManagement/EditRemark/index";
import HorizontalActionDropdown from "../../../newCommon/HorizontalActionDropdown/HorizontalActionDropdown";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  createSingleRemarkToSpecificLead,
  getSpecificLeadRemarkLists,
} from "../../../../api/authApi";
import UserImage from "./UserImage";
import ViewAndEditRemark from "../EditableRemark";
import AttachementInRemark from "../../../../pages/superAdmin/LeadsManagement/uploadAttachment";
import AttachedFile from "../../../../pages/superAdmin/LeadsManagement/AttachedFile";
// import { fontStyle } from "html2canvas/dist/types/css/property-descriptors/font-style";

const RemarksModel = ({
  open,
  handleModelClose,
  leadId,
  userId,
  modelData,
}) => {
  // console.log("leadId", leadId);
  const [newRemark, setNewRemark] = useState("");
  const [attachement, setAttachement] = useState("");

  console.log("newRemark222", newRemark);
  const disptach = useDispatch();
  const { remarkList } = useSelector(authSelector);
  const [remarkListData, setRemarkListData] = useState([]);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [editSpecificRemarkStatus, setEditSpecificRemarkStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const getDemoUserSpecificRemarkList = () => {
    setNewRemark("");
    disptach(getSpecificLeadRemarkLists(leadId, setLoading, setNewRemark));
  };

  const handleDeleteAttachedFile = (e) => {
    e.preventDefault();
    setAttachement("");
  };

  const postRemark = (formData) => {
    disptach(
      createSingleRemarkToSpecificLead(
        setLoading,
        leadId,
        formData,
        setNewRemark,
        getDemoUserSpecificRemarkList
      )
    );
  };

  useEffect(() => {
    if (leadId) {
      getDemoUserSpecificRemarkList();
    }
  }, [leadId]);

  useEffect(() => {
    setRemarkListData(remarkList);
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  }, [remarkList]);

  const handleBoldButtonClick = (event) => {
    event.preventDefault();
    if (bold) {
      setBold(false);
    } else {
      setBold(true);
    }
  };

  const handleItalicButtonClick = (event) => {
    event.preventDefault();
    if (italic) {
      setItalic(false);
    } else {
      setItalic(true);
    }
  };

  const handleRemarkSubmit = () => {
    let remark="";
    if (bold && italic) {
      remark=`<b><i>${newRemark}</i></b>`;
    } else if (!bold && italic) {
      remark=`<i>${newRemark}</i>`;
    } else if (bold && !italic) {
      remark=`<b>${newRemark}</b>`;
    }else{
      remark=newRemark
    }
    const data = { remark: remark, userId: userId };
    postRemark(data);
  };

  const handleModalClose = () => {
    setNewRemark("");
    handleModelClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleModalClose}
        fullWidth={true}
        maxWidth="md"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <div className="addRemark-model-wrapper">
          <div className="addRemark-title">
            <div className="addRemark-title-info">
              <div>
                <h2 style={{ fontSize: "x-large", fontWeight: "bolder" }}>
                  Remarks
                </h2>
              </div>
              <div>
                <h1
                  onClick={handleModalClose}
                  className="addRemark--model-close"
                >
                  X
                </h1>
              </div>
            </div>
          </div>

          <DialogContent>
            <ul className="leadList-list">
              {remarkListData.length > 0
                ? remarkListData.map((item) => (
                    <li className="listitems">
                      <ViewAndEditRemark
                        item={item}
                        leadId={leadId}
                        getDemoUserSpecificRemarkList={
                          getDemoUserSpecificRemarkList
                        }
                        userId={userId}
                      />
                    </li>
                  ))
                : ""}
            </ul>
            <div className="add-remark-input-container">
              <div className="add-remark-input-field">
                <TextField
                  id="standard-multiline-static"
                  // label="Multiline"
                  className="add-remark-input-textfield"
                  multiline
                  rows={1}
                  placeholder="Default Value"
                  variant="standard"
                  value={newRemark}
                  // sx={{fontSize:"larger", fontWeight:"bold"}}
                  InputProps={{
                    style: {
                      fontSize: "50px",
                      fontWeight: `${bold ? "bold" : ""}`,
                      fontStyle: `${italic ? "italic" : ""}`,
                    },
                  }}
                  onChange={(e) => {
                    setNewRemark(e.target.value);
                  }}
                />
                <AttachedFile
                  data={attachement}
                  handleDeleteAttachedFile={handleDeleteAttachedFile}
                />
              </div>
              <div className="add-remark-buttons">
                <div className="add-remark-input-modification-buttons">
                  <BoldIcon
                    style={{ backgroundColor: `${bold ? "#e1e6e5" : ""}` }}
                    onClick={handleBoldButtonClick}
                  />
                  <ItalicIcon
                    style={{ backgroundColor: `${italic ? "#e1e6e5" : ""}` }}
                    onClick={handleItalicButtonClick}
                  />
                  {/* <AttachementIcon /> */}
                  <AttachementInRemark
                    value={attachement}
                    setter={setAttachement}
                  />
                </div>
                <div className="add-remark-comment-add-button">
                  {/* <button onClick={handleRemarkSubmit}> Comment </button> */}
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#363837",
                      borderRadius: "10px",
                      boxShadow: "none",
                    }}
                    onClick={handleRemarkSubmit}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

const HtmlToText = ({ htmlString }) => {
  // const [bold,setBold]=useState(false);
  // const [italic,setItalic]=useState(false);
  // const [plainText,setPlainText]=useState("");
  console.log("htmlString", htmlString);

  let bold = false;
  let italic = false;
  let plainText = "";

  if (
    htmlString.includes("<b>") &&
    htmlString.includes("</b>") &&
    htmlString.includes("<i>") &&
    htmlString.includes("</i>")
  ) {
    const newStringWithoutTag = htmlString
      .replace("<b>", "")
      .replace("</b>", "")
      .replace("<i>", "")
      .replace("</i>", "");
    // setPlainText(newStringWithoutTag);
    // plainText=newStringWithoutBold.replace(/<\s*i[^>]*>.*?<\s*\/\s*i\s*>/gi,"")
    plainText = newStringWithoutTag;
    // setBold(true)
    bold = true;
    // setItalic(true)
    italic = true;
  } else if (
    htmlString.includes("<b>") &&
    htmlString.includes("</b>") &&
    !htmlString.includes("<i>") &&
    !htmlString.includes("</i>")
  ) {
    // setBold(true)
    // setItalic(false)
    bold = true;
    italic = false;

    // plainText=htmlString.replace("<b>","").replace("</b>","");
    // setPlainText(htmlString.replace("<b>","").replace("</b>",""));
  } else if (
    !htmlString.includes("<b>") &&
    !htmlString.includes("</b>") &&
    htmlString.includes("<i>") &&
    htmlString.includes("</i>")
  ) {
    // setBold(false)
    // setItalic(true)
    bold = false;
    italic = true;
    // setPlainText(htmlString.replace("<i>","").replace("</i>",""));
    plainText = htmlString.replace("<i>", "").replace("</i>", "");
  } else if (
    !htmlString.includes("<b>") &&
    !htmlString.includes("</b>") &&
    !htmlString.includes("<i>") &&
    !htmlString.includes("</i>")
  ) {
    // setBold(false)
    // setItalic(false)
    bold = false;
    italic = false;
    // setPlainText(htmlString);
    plainText = htmlString;
  }
  return (
    <h1>
      {bold && italic ? (
        <b>
          <i>{plainText}</i>
        </b>
      ) : bold && !italic ? (
        <b>{plainText}</b>
      ) : italic && !bold ? (
        <i>{plainText}</i>
      ) : (
        plainText
      )}
    </h1>
  );
};

export default RemarksModel;
