import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import { getSubRole, userRoleType } from "../../../utils/projectHelper";
import { authSelector } from "../../../redux/slicers/authSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ReactComponent as ActionDots } from "../../../assets/images/common/action-dots.svg";
import { ReactComponent as VerticalDotsIcon } from "../../../assets/icons/Vertical_threeDots.svg";

export const VerticalDropdown = ({
  setActionOpen,
  actionOpen,
  editBtnHandler,
  deleteHandler,
  horizontal = false,
  MoreBtnHandler,
  id,
  actionId,
  extraOption = false,
  featureName = "",
  subFeatureName = "",
  showDelete = true,
  extraOptions = [],
  isCustomized = false,
  customOptions = [],
  showEdit = true,  
}) => {
  const ref = useRef();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setActionOpen(false);
      }
    }

    const handleClick = handleClickOutside;
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref]);

  // PERMISSION
  const { userInfo = {} } = useSelector(authSelector);
  const userRole = userInfo?.userRole;
  const roleType = userRoleType(userRole, featureName);
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const handleMenuOpen = (event) => {
    setAnchorEl(ref.current);
    MoreBtnHandler(event, id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="action-menu__component">
      <VerticalDotsIcon
        onClick={(event) => handleMenuOpen(event)}
        className="three-dot-icon"
        ref={ref}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        getcontentanchorel={null}
        autoFocus={false}
        key="menu"
      >
        {isCustomized ? (
          customOptions
            ?.filter((item) => item !== null)
            ?.map((item, index) => (
              <MenuItem
                sx={{
                  gap: 2,
                  fontSize: "12px",
                  backgroundColor: "white",
                }}
                onClick={() => {
                  handleMenuClose();
                  item.handler();
                }}
                key={index}
              >
                {item.icon}
                {item.text}
              </MenuItem>
            ))
        ) : (
          <div>
            {isRolePermission?.permissions?.["3"] && showEdit && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  editBtnHandler();
                }}
                sx={{ gap: 2, fontSize: "12px" }}
                key="edit"
              >
                <EditIcon />
                Edit
              </MenuItem>
            )}
            {extraOption &&
              extraOptions.map((item, index) => (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    item.handler();
                  }}
                  sx={{ gap: 2, fontSize: "12px" }}
                  key={index}
                >
                  {item.icon}
                  {item.text}
                </MenuItem>
              ))}
            {isRolePermission?.permissions?.["4"] && showDelete && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  deleteHandler();
                }}
                sx={{ gap: 2, fontSize: "12px" }}
                key="delete"
              >
                <DeleteIcon />
                Delete
              </MenuItem>
            )}
          </div>
        )}
      </Menu>
    </div>
  );
};
