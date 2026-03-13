import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from "@mui/material";

const MultipleSelect= ({selectedIds=[], setSelectedIds,options=[], handleChange,label=""}) => {
  console.log("selectedIds", selectedIds)

  // Example options
 

 

  return (
    <FormControl sx={{ width: 120 }} size="small">
      <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={options.filter(item => selectedIds.includes(item.id))}
        onChange={handleChange}
        input={<OutlinedInput label={label}/>}
        renderValue={(selected) => selected.map(item => item.label).join(", ")}
      >
         <MenuItem
          value="all"
          onClick={() =>
            selectedIds.length === options.length ? setSelectedIds([]) : setSelectedIds(options.map(item => item.id))
          }
        >
          <Checkbox
          size="small"
            checked={selectedIds.length === options.length}
            indeterminate={selectedIds.length > 0 && selectedIds.length < options.length}
          />
          <ListItemText primary="Select All" />
        </MenuItem>
        {options.map((item) => (
          <MenuItem key={item.id} value={item} size="small">
            <Checkbox checked={selectedIds.indexOf(item.id) > -1} size="small" />
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultipleSelect
