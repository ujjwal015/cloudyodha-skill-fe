import OpenEye from "../../../assets/icons/OpenEye.svg";
import CloseEye from "../../../assets/icons/CloseEye.svg";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import clsx from "clsx";
import PropTypes from "prop-types"; // Import PropTypes
import styles from "./Textfield.module.css";
import { useState } from "react";

const CustomTextField = ({
  label,
  required,
  className,
  error,
  type,
  endAdornment = false,
  ...restProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
            // sx={{padding: "0px", position: "relative"}}
          >
            {showPassword ? (
              <OpenEye style={{ width: "20px" }} />
            ) : (
              <CloseEye style={{ width: "20px" }} />
            )}
          </IconButton>
        </InputAdornment>
      );
    } else {
      return (
        <InputAdornment position="end" sx={{ paddingRight: "5px" }}>
          INR
        </InputAdornment>
      );
    }
  };

  return (
    <div className={clsx(styles.textField, className)}>
      <label>
        {label} {required && "*"}
      </label>
      <TextField
        error={!!error} // Ensure error is a boolean
        size="small"
        type={inputType}
        placeholder={"Enter " + label}
        {...restProps}
        fullWidth
        className={clsx(styles.inputField, className)}
        helperText={error ? error : " "}
        InputProps={{ endAdornment: renderEndAdornment() }}
      />
    </div>
  );
};

// PropTypes validation for props
CustomTextField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  endAdornment: PropTypes.bool,
};

export default CustomTextField;
