import { ReactComponent as HorizontalMoreIcons } from "../../../assets/icons/HorizontalMoreIcons.svg";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;

export default function HorizontalActionDropdown({
  handleclose,
  data,
  editSpecificRemarkStatus,
  setEditSpecificRemarkStatus,
  handleRemarkDelete,
  getDemoUserSpecificRemarkList,
}) {
  console.log("ID-Comparision", data._id, editSpecificRemarkStatus);
  const [anchorEl, setAnchorEl] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(false);
  };
  const handleRemarkDeleteAndClose = () => {
    handleRemarkDelete();
    handleClose();
  };

  const handleEdit = (remarkId) => {
    console.log("EDIT-CLICK", remarkId);
    setEditSpecificRemarkStatus(remarkId);
  };

  const handleDelete = () => {
    console.log("DELETE_DELETE", data._id);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {/* <MoreVertIcon /> */}
        <HorizontalMoreIcons />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 3,
            width: "10ch",
          },
        }}
      >
        <MenuItem key="edit" onClick={() => handleEdit(data?._id)}>
          Edit
        </MenuItem>
        <MenuItem key="delete" onClick={handleRemarkDeleteAndClose}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
