import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
} from "@mui/material";
import { ScaleLoader } from "react-spinners";

const SelectInput = ({
  label,
  name,
  value,
  placeHolder,
  handleChange,
  mandatory = false,
  disabled = false,
  loading = false,
  error,
  options=[],
  width = 250,
  maxTooltipLength = 50,
}) => {
  const theme = useTheme();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.3 + ITEM_PADDING_TOP,
        width: width,
      },
    },
  };

  function getStyles(name, value, theme) {
    return {
      fontWeight:
        name !== value
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  return (
    <>
      <InputLabel id="outlined-adornment-select" className="input-label">
        {label}
        {mandatory && label && <span className="mandatory">&nbsp;*</span>}
      </InputLabel>
      <div>
        <FormControl sx={{ width: "100%" }}>
          <Select
            className="form-control-select"
            labelId="outlined-adornment-select"
            displayEmpty
            name={name}
            size="small"
            value={value ?? ""}
            disabled={disabled}
            onChange={handleChange}
            error={error ? true : false}
            input={<OutlinedInput />}
            sx={{ "& .MuiOutlinedInput-input": { padding: "6.3px 14px" } }}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem
              value=""
              sx={{ paddingLeft: "24px", fontSize: "13px" }}
              disabled={mandatory}
            >
              <em>{placeHolder}</em>
            </MenuItem>
            {loading ? (
              <MenuItem value="">
                {<ScaleLoader height={10} color="#2ea8db" />}
              </MenuItem>
            ) : (
              options?.map((menu, index) => {
                return (
                  <MenuItem
                    disabled={menu?.disabled ?? false}
                    key={index}
                    className="select-options"
                    value={menu?.value ?? menu._id}
                    style={getStyles(menu?.value, value, theme)}
                  >
                    {menu?.label?.length > maxTooltipLength ? (
                      <Tooltip title={menu?.label || "NA"} arrow>
                        <div>{menu?.label ?? menu?.schemeName}</div>
                      </Tooltip>
                    ) : (
                      <>{menu?.label ?? menu?.schemeName}</>
                    )}
                  </MenuItem>
                );
              })
            )}
          </Select>
        </FormControl>
      </div>

      {error && <p className="error-input">{error}</p>}
    </>
  );
};

export default SelectInput;

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  placeHolder: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  mandatory: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};
