import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";

const TablePagination = ({
  page,
  limit,
  count,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <div className="dashboard-table-pagination">
      <div className="limit">
        <p>Items per page:</p>
        <div className="limit-dropdown">
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={limit}
              onChange={onRowsPerPageChange}
            >
              {[10, 15, 20, 30, 50].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="page-num">
        <p className="page">
          {page} - {limit} of {count}{" "}
        </p>
        <div className="arrows">
          <Button
            className={`${page == 1 ? "disabled" : ""}`}
            onClick={(e) => onPageChange(e, 1)}
          >
            <FirstPageRoundedIcon />
          </Button>
          <Button
            className={`${page == 1 ? "disabled" : ""}`}
            onClick={(e) => (page != 1 ? onPageChange(e, page - 1) : undefined)}
          >
            <KeyboardArrowLeftRoundedIcon />
          </Button>
          <Button
            className={`${page == count || count == 0 ? "disabled" : ""}`}
            onClick={(e) =>
              page != count && count != 0
                ? onPageChange(e, page + 1)
                : undefined
            }
          >
            <KeyboardArrowRightRoundedIcon />
          </Button>
          <Button
            onClick={(e) => onPageChange(e, count)}
            className={`${page == count || count == 0 ? "disabled" : ""}`}
          >
            <LastPageRoundedIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
