import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import { InputLabel, TextField } from "@mui/material";
import moment from "moment";

function DateTimePickerComponent({
    name = "",
    label,
    mandatory,
    value,
    handleTimeChange,
    error,
    placeholder,
    disableFuture = false,
    minDateTime = false,
    maxDateTime = false,
    disablePast = false,
}) {
    const [selectedDate, setSelectedDate] = useState("");
    useEffect(() => {
        if (value) {
            // Convert the time string to a Moment.js object in 24-hour format
            const time24 = moment(value, 'hh:mma').format('HH:mm');
            const dateParse = `1970-01-01T${time24}:00`;
            setSelectedDate(dateParse);
        } else {

            setSelectedDate(null);
        }
    }, [value]);
    
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <InputLabel htmlFor={`outlined-adornment-${name}`} className="input-label">
                {label}
                {mandatory ? <span className="mandatory">&nbsp;*</span> : ""}
            </InputLabel>
            <div className="datepicker-input">
                <MobileTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    value={value || error ? dayjs(selectedDate) : null}
                    // onChange={handleTimeChange}
                    error={Boolean(error)}
                    disablePast={disablePast}
                    disableFuture={disableFuture}
                    sx={{
                        width: "100%",
                        "& input": { p: "8.5px 14px" },
                    }}
                    onAccept={handleTimeChange}

                />
            </div>
            {error && <p className="error-input">{error}</p>}
        </LocalizationProvider>
    );
}

export default DateTimePickerComponent;
