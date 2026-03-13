import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

const CustomPagination = ({
  page,
  limit,
  limitRange=[50, 100, 200, 500, 1000],
  count,
  onPageChange,
  onRowsPerPageChange,
  shouldSetWidth = false
}) => {
  return (
    <div className="custom-pagination">
      <div className="limit">
        <p>Items per page:</p>
        <div className="limit-dropdown">
             
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={limit}
              onChange={onRowsPerPageChange}
              MenuProps={{
              PaperProps: {
                sx: shouldSetWidth ? { width: "67px" } : {}//this line is for solving the issue of limit dropdown having large width
              }
            }}
            >
              {limitRange?.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="page">
        <p>
          <span>{page}</span> of {count}
        </p>
        <div className="arrows">
          <div
            className={`leftArrow ${page == 1 ? "disabled" : ""}`}
            onClick={(e) => (page != 1 ? onPageChange(e, page - 1) : undefined)}
          >
            <KeyboardArrowLeftRoundedIcon />
          </div>
          <div
            className={`rightArrow ${
              page == count || count == 0 ? "disabled" : ""
            }`}
            onClick={(e) =>
              page != count && count != 0
                ? onPageChange(e, page + 1)
                : undefined
            }
          >
            <KeyboardArrowRightRoundedIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPagination;
