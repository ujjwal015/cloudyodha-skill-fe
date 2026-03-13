import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { PulseLoader } from "react-spinners";

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 240,
    },
  },
  MenuListProps: {
    sx: {
      "li.MuiButtonBase-root span.MuiTypography-root": {
        fontSize: "11px",
      },
      "li.MuiButtonBase-root": {
        p: 0,
      },
    },
  },
};

const CustomMultiSelect = (props) => {
  const { selected = [], onChange, options, setter, label,filterType=false, isPermissions = {}, isDisable = false } = props?.data;
  const { loading } = props;
console.log('filterType',filterType)
  const handleSelectAll = (event, selectAll = false) => {
    event.preventDefault();
    event.stopPropagation();

    if (selectAll) {
      onChange({ target: { value: options.map((option) => option.name) } }, setter);
    } else if (selected.length === options.length) {
      onChange({ target: { value: [] } }, setter);
    } else {
      onChange({ target: { value: options.map((option) => option.name) } }, setter);
    }
  };
  const handleSelect = (event,id,name) => {
    event.preventDefault();
    event.stopPropagation();
     console.log(filterType,'filtertype')
      onChange({ target: { value:id ,valueName:name } }, setter);
    
  };

  const isAllSelected = options?.length !== 0 && selected?.length !== 0 && selected?.length === options?.length;

  return (
    <div>
      <FormControl sx={{ width: 240 }} size="small">
        {selected.length == 0 && <InputLabel size="small" InputLabeid="demo-multiple-checkbox-label-12">{label}</InputLabel>}
        <Select
          labelId="demo-multiple-checkbox-label-12"
          id="demo-multiple-checkbox"
          multiple
          size="small"
          value={selected}
          onChange={(event) => onChange(event, setter)}
          input={<OutlinedInput label={selected.length == 0 ? label : ""} />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
          disabled={isDisable}
        >
          {loading ? (
            <MenuItem disabled>
              <span>
                <ListItemText primary="Loading" />
              </span>
              <PulseLoader size="6px" color="grey" />
            </MenuItem>
          ) : (
            <>
              {options?.length > 0 ? (
                <>
                  <MenuItem>
                    <Checkbox
                      size="small"
                      sx={{ padding: "3px 10px" }}
                      checked={isAllSelected}
                      indeterminate={selected.length > 0 && selected.length < options.length}
                      // onChange={(e)=>handleSelectAll(e, !isAllSelected)}
                      onClick={(e) => handleSelectAll(e, !isAllSelected)}
                    />
                    <ListItemText primary="Select All" onClick={(e) => handleSelectAll(e, !isAllSelected)} />
                  </MenuItem>
                  {options?.map((option) => {
                    if(filterType){
                      return (
                      <MenuItem key={option?.name} value={option?.name}>
                      <Checkbox
                        size="small"
                        sx={{ padding: "3px 10px" }}
                        checked={selected.indexOf(option?.name) > -1}
                        onClick={(e) => handleSelect(e,option.id,option.name)}
                      />
                      <ListItemText primary={option?.name} onClick={(e) => handleSelect(e,option.id,option.name)}/>
                    </MenuItem>)
                    }else{
                      return (<MenuItem key={option?.name} value={option?.name}>
                      <Checkbox
                        size="small"
                        sx={{ padding: "3px 10px" }}
                        checked={selected.indexOf(option?.name) > -1}
                        // onClick={(e) => handleSelect(e)}
                      />
                      <ListItemText primary={option?.name} 
                      // onClick={(e) => handleSelect(e)}
                      />
                    </MenuItem>)
                    }
                   
                  })}
                </>
              ) : (
                <h1>No Options</h1>
              )}
            </>
          )}
        </Select>
      </FormControl>
    </div>
  );
};
export default CustomMultiSelect;
