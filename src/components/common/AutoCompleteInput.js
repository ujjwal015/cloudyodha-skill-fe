import React from "react";
import PropTypes from "prop-types";
import { TextField, Autocomplete, InputLabel } from "@mui/material";
import { ScaleLoader } from "react-spinners";

const AutoCompleteInput = ({
  label,
  name,
  value,
  placeHolder,
  handleChange,
  mandatory = false,
  disabled = false,
  loading = false,
  error,
  options,
}) => {
  const isInputEmpty = !value;

  const handleSelectChange = (value) => {
    const event = {
      target: {
        name: name,
        value: typeof value == "object" ? value?.value : value,
      },
    };
    handleChange(event);
  };

  return (
    <>
      <InputLabel
        id="outlined-adornment-select"
        className={`input-label ${isInputEmpty ? "hidden-label" : ""}`}
      >
        {label}
        {mandatory && <span className="mandatory">&nbsp;*</span>}
      </InputLabel>
      <div>
        <Autocomplete
          freeSolo
          id="autocomplete"
          options={options}
          inputprops={{ "aria-label": "Without label" }}
          onChange={(_event, value) => handleSelectChange(value)}
          loading={loading}
          size="small"
          fullWidth={true}
          value={value}
          disableClearable
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              value={value}
              {...params}
              placeholder={placeHolder}
              variant="outlined"
              error={!!error}
              onChange={handleChange}
              name={name}
            />
          )}
        />
        {loading && <ScaleLoader height={10} color="#2ea8db" />}
        {error && <p className="error-input">{error}</p>}
      </div>
    </>
  );
};

AutoCompleteInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeHolder: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  mandatory: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
      schemeName: PropTypes.string,
    })
  ),
};

export default AutoCompleteInput;
