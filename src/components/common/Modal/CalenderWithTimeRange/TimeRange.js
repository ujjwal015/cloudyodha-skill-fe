import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { MultiSectionDigitalClock } from "@mui/x-date-pickers/MultiSectionDigitalClock";

export default function TimeRange({setStartMeetingTime,setEndMeetingTime}) {
  // const [value, setValue] = React.useState(dayjs("2022-04-17T15:30"));
  const [startTime, setStartTime]=React.useState(dayjs("2022-04-17T00:00"));
  const [endTime,setEndTime]=React.useState(dayjs("2022-04-17T00:00"));
  console.log("########",dayjs("2022-04-17T15:30"))
  // const [selectedOptions, setSelectedOptions] = React.useState([]);
console.log("Start time",startTime);
  console.log("END_TIME",endTime);

React.useEffect(()=>{
  const time= TimeFormator(startTime);
  setStartMeetingTime(time)
},[startTime])

React.useEffect(()=>{
  const time= TimeFormator(endTime);
  setEndMeetingTime(time)
},[endTime])
  
const TimeFormator=(time={})=>{
  const hours = time.$H;
const minutes = time.$m;

// Function to format the time into 12-hour format (AM/PM)
const formatTime = (hours, minutes) => {
  const ampm = hours >= 12 ? 'PM' : 'AM';
  let formattedHours = hours % 12;
  formattedHours = formattedHours ? formattedHours : 12; // Handle midnight (0 hours)
  const formattedMinutes = minutes.toString().padStart(2, '0'); // Add leading zero to minutes if needed
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};
// Format the time using the extracted hour and minute values
const formattedTime = formatTime(hours, minutes);
return formattedTime;

}


const handleStartTimeChange=(e)=>{
  setStartTime(e);
}

const handleEndTimeChange=(e)=>{
  setEndTime(e);
}
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <DemoContainer
        components={[
          "DigitalClock",
          "DigitalClock",
          "MultiSectionDigitalClock",
          "MultiSectionDigitalClock",
        ]}
      > */}
        <DemoContainer components={["DigitalClock", "DigitalClock"]} sx={{width:"100%"}}>
          {/* <DemoItem label="Uncontrolled digital clock">
            <DigitalClock defaultValue={dayjs("2022-04-17T15:30")} />
          </DemoItem> */}
          <DemoItem label="Start Time">
            <DigitalClock
              value={startTime}
              // onChange={(newValue) => setStartTime(newValue)}
              onChange={(e)=>handleStartTimeChange(e)}
              sx={{ overflow:"scroll", scrollbarWidth:"none", width:"100%" }}
            />
          </DemoItem>
          <DemoItem label="End Time">
            <DigitalClock
              value={endTime}
              // onChange={(newValue) => setEndTime(newValue)}
              onChange={(e)=>handleEndTimeChange(e)}
              sx={{ overflow:"scroll", scrollbarWidth:"none", width:"100%" }}
              // selectedOptions={selectedOptions}
            />
          </DemoItem>
        </DemoContainer>
      {/* </DemoContainer> */}
    </LocalizationProvider>
  );
}
