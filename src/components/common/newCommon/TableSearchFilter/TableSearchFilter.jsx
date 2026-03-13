import React from "react";
import "./TableSearchFilter.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Menu, MenuItem, Checkbox, ListItemText } from "@mui/material";
import MyOutlinedBtn from "../Buttons/MyOutlinedBtn";
import { Chip } from "@mui/material";

const TableSearchFilter = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="table-search-filter">
        <div className="table-search-filter__search">
          <input placeholder="Search by anything..." />
          <Icon icon="lets-icons:search" />
        </div>
        <div className="table-search-filter__filter">
          <div>
            <MyOutlinedBtn
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              text="Filter by Sector"
              iconRight="fluent:chevron-down-32-filled"
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              elevation={0}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiPaper-root": {
                  border: "1px solid rgba(232, 232, 232, 1)",
                  borderRadius: "8px",
                  marginTop: 1,
                  minWidth: 180,
                },
                "& .MuiMenuItem-root": { fontSize: 12 },
                "& .MuiCheckbox-root": { p: 0, paddingRight: 1 },
              }}
            >
              {["Select All", "Agriculture", "Cosmetology", "Food & Beverages", "Entertainment", "Medical"].map(
                (item, idx) => (
                  <MenuItem key={idx} onClick={handleClose}>
                    <Checkbox size="small" />
                    {item}
                  </MenuItem>
                ),
              )}
            </Menu>
          </div>
          <MyOutlinedBtn text="Export" iconLeft="mingcute:arrow-to-up-line" />
        </div>
      </div>
      <div className="table-search-filter__filter--result">
        <h3>
          <span>50</span> results found
        </h3>
        <div className="table-search-filter__filter--chips">
          <h4>Sector:</h4>
          {[1, 2, 3].map(() => (
            <Chip
              sx={{
                fontSize: "10px",
                background: "rgba(38, 38, 38, 1)",
                color: "#fff",
                "& .MuiChip-deleteIcon": { color: "#fff !important" },
              }}
              size="small"
              label="Deletable"
              onDelete={() => console.log("first")}
            />
          ))}
          <span className="chip--clear">
            <Icon icon="tabler:trash" />
            Clear
          </span>
        </div>
      </div>
    </>
  );
};

export default TableSearchFilter;
