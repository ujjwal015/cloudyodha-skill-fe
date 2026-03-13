import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { InputLabel, TextField } from "@mui/material";

const DateInput = ({
  name = "",
  label,
  mandatory,
  value,
  handleDateChange,
  onFocus,
  onBlur,
  error,
  placeholder,
  disableFuture = false,
  minDate = "",
  maxDate = "",
  disablePast = false,
  format = "MM-DD-YYYY",
  disabled = false,
}) => {
  if (minDate || maxDate) {
    return (
      <>
        <InputLabel
          htmlFor={`outlined-adornment-${name}`}
          className="input-label"
        >
          {label}
          {mandatory ? <span className="mandatory">&nbsp;*</span> : ""}
        </InputLabel>
        <div className="datepicker-input">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              placeholder={placeholder}
              value={value || error ? dayjs(value) : null}
              onChange={handleDateChange}
              onFocus={onFocus}
              onBlur={onBlur}
              sx={{
                width: "100%",
                "& input": { p: "8.5px 14px" },
              }}
              error={Boolean(error)}
              disableFuture={disableFuture}
              disablePast={disablePast}
              minDate={minDate}
              maxDate={maxDate}
              format={format}
              disabled={disabled}
            />
          </LocalizationProvider>
          {error && <p className="error-input">{error}</p>}
        </div>
      </>
    );
  } else
    return (
      <>
        <InputLabel
          htmlFor={`outlined-adornment-${name}`}
          className="input-label"
        >
          {label}
          {mandatory ? <span className="mandatory">&nbsp;*</span> : ""}
        </InputLabel>
        <div className="datepicker-input">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              placeholder={placeholder}
              value={value || error ? dayjs(value) : null}
              onChange={handleDateChange}
              onFocus={onFocus}
              onBlur={onBlur}
              sx={{ width: "100%", "& input": { p: "8.5px 14px" } }}
              error={Boolean(error)}
              disablePast={disablePast}
              disableFuture={disableFuture}
              format={format}
              disabled={disabled}
            />
          </LocalizationProvider>
          {error && <p className="error-input">{error}</p>}
        </div>
      </>
    );
};

export default DateInput;
