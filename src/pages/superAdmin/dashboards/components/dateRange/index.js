import { memo } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateRangePicker = ({ data }) => {
  const { range, handleRangeChange } = data;

  return (
    <>
      <DateRange
        ranges={range}
        onChange={handleRangeChange}
        moveRangeOnFirstSelection={true}
        editableDateInputs={true}
        showDateDisplay={true}
      />
    </>
  );
};

export default memo(DateRangePicker);
