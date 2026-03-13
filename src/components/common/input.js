import React, { useState } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { ReactComponent as OpenEye } from "../../assets/icons/OpenEye.svg";
import { ReactComponent as CloseEye } from "../../assets/icons/CloseEye.svg";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@mui/material";
import { blockInvalidChar } from "../../utils/projectHelper";
import CopyButton from "./copyButton";

const Input = ({
  label,
  type = "text",
  name,
  error,
  placeholder = "",
  onFocus,
  onBlur,
  onPaste,
  onChange,
  value = "",
  inputProps,
  rows,
  endAdornment = false,
  mandatory = false,
  multiline = false,
  disabled = false,
  hideExponants = false,
  tooltipText = false,
  copyOnClick = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const renderEndAdornment = () => {
    if (!endAdornment) {
      return false;
    }

    if (type === "password") {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            edge="end"
            onClick={handleClickShowPassword}
          >
            {showPassword ? (
              <OpenEye style={{ width: "20px" }} />
            ) : (
              <CloseEye style={{ width: "20px" }} />
            )}
          </IconButton>

          {copyOnClick && (
            <IconButton
              aria-label="copy password"
              edge="end"
              onClick={() => navigator.clipboard.writeText(value)}
            >
              <CopyButton textToCopy={value} label="" />
            </IconButton>
          )}
        </InputAdornment>
      );
    }

    if (type === "radio") {
      return (
        <>
          <label className="input-label">
            <input
              type="radio"
              disabled={disabled}
              name={name}
              onChange={onChange}
              value={value}
              checked={Boolean(inputProps?.checked)}
            />
            {label}
          </label>
          {error && <p className="error-input">{error}</p>}
        </>
      );
    }

    return endAdornment;
  };

  document.addEventListener("wheel", function (event) {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  });

  return (
    <>
      <InputLabel
        htmlFor={`outlined-adornment-${name}`}
        className="input-label"
      >
        {label}
        {mandatory ? <span className="mandatory">&nbsp;*</span> : ""}
      </InputLabel>

      {tooltipText ? (
        <>
          <Tooltip title={tooltipText || "-"} arrow>
            <OutlinedInput
              inputProps={inputProps}
              id={`outlined-adornment-${name}`}
              placeholder={placeholder}
              type={inputType}
              disabled={disabled}
              name={name}
              multiline={multiline}
              rows={rows || ""}
              onFocus={onFocus}
              onBlur={onBlur}
              //onPaste={(event) => onPaste(event)}
              onChange={onChange}
              value={value}
              size="small"
              fullWidth={true}
              error={Boolean(error)}
              endAdornment={renderEndAdornment()}
              onKeyDown={hideExponants ? blockInvalidChar : () => { }}
            />
          </Tooltip>
        </>
      ) : (
        <>
          <OutlinedInput
            inputProps={inputProps}
            id={`outlined-adornment-${name}`}
            placeholder={placeholder}
            type={inputType}
            disabled={disabled}
            name={name}
            multiline={multiline}
            rows={rows || ""}
            onFocus={onFocus}
            onBlur={onBlur}
            //onPaste={(event) => onPaste(event)}
            onChange={onChange}
            value={value}
            size="small"
            fullWidth={true}
            error={Boolean(error)}
            endAdornment={renderEndAdornment()}
            onKeyDown={hideExponants ? blockInvalidChar : () => { }}
          />
        </>
      )}

      {error && <p className="error-input">{error}</p>}
    </>
  );
};

export default Input;

Input.propTypes = {
  // label: PropTypes.string.isRequired,
  type: PropTypes.string,
  // name: PropTypes.string.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  inputProps: PropTypes.object,
  rows: PropTypes.number,
  endAdornment: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  mandatory: PropTypes.bool,
  multiline: PropTypes.bool,
  disabled: PropTypes.bool,
};

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 40,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#04D375",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 20,
    height: 20,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#CCC" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export const FormSwitch = ({ value, onChange, disabled = false }) => {
  return (
    <FormControlLabel
      sx={{ m: 0 }}
      control={
        <IOSSwitch onChange={onChange} checked={value} disabled={disabled} />
      }
    // label="iOS style"
    />
  );
};

export const RadioButton = (props) => {
  const {
    handleChange,
    options,
    name,
    label,
    error,
    mandatory,
    value,
    disabled = false,
  } = props;
  return (
    <div className="custom-radio">
      <FormControl>
        <FormLabel
          id="demo-controlled-radio-buttons-group"
          className="input-label"
        >
          {label}
          {mandatory ? <span className="mandatory">&nbsp;*</span> : ""}
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name={name}
          value={value}
          onChange={handleChange}
        >
          {options.map((item, _index) => (
            <FormControlLabel
              key={item.name}
              value={item.name}
              control={<Radio size="small" disabled={disabled} />}
              sx={{
                "& span.MuiFormControlLabel-label": {
                  color: "#231F20",
                  fontSize: 13,
                  fontWeight: "500",
                  opacity: "0.7",
                },
              }}
              label={item.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {error && <p className="error-input">{error}</p>}
    </div>
  );
};
