import {
  MenuItem,
  Select,
  FormHelperText,
  FormControl,
  ListSubheader,
  Checkbox,
  ListItemText,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import PropTypes from "prop-types";
import styles from "./CustomSelectField.module.css"; // Import your CSS module

const CustomSelectField = ({
  label = "Default label *",
  options,
  required,
  name,
  className = "",
  error,
  value,
  onChange,
  multiple,
  grouping,
  defaultOption,
  ...restProps
}) => {
  return (
    <FormControl
      className={`${styles.selectField} ${className}`}
      error={!!error}
    >
      <label>
        {label} {required && "*"}
      </label>
      <Select
        displayEmpty
        name={name}
        multiple={multiple}
        size="small"
        IconComponent={KeyboardArrowDownRoundedIcon}
        value={value}
        renderValue={(selected) => {
          if (multiple) {
            return selected.length > 0
              ? selected
                  .map((val) => {
                    const selectedOption = options.find(
                      (option) => option.value === val
                    );
                    return selectedOption ? selectedOption.label : "";
                  })
                  .join(", ")
              : `Select ${label}`;
          } else {
            const selectedOption = options.find(
              (option) => option.value === selected
            );
            return selectedOption
              ? selectedOption.label
              : defaultOption || `Select ${label}`;
          }
        }}
        onChange={onChange}
        error={!!error}
        MenuProps={{
          PaperProps: {
            sx: {
              border: "1px solid #ccc",
              borderRadius: "10px",
              marginTop: "5px",
              boxShadow: "0px 3px 25px 2px rgba(0,0,0,0.1)",
            },
          },
        }}
        {...restProps}
      >
        {!multiple && (
          <MenuItem value="">
            <em>{defaultOption ? defaultOption : `Select ${label}`}</em>
          </MenuItem>
        )}

        {grouping ? (
          options?.reduce((acc, group) => {
            acc.push(
              <ListSubheader key={`group-${group.label}`}>
                {group.label}
              </ListSubheader>
            );
            acc.push(
              ...group.options.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  <Checkbox checked={value?.includes(item.value)} />
                  <ListItemText primary={item.label} sx={{ fontSize: 13 }} />
                </MenuItem>
              ))
            );
            return acc;
          }, [])
        ) : options && options.length > 0 ? (
          options.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {multiple ? (
                <>
                  <Checkbox checked={value?.includes(item.value)} />
                  <ListItemText primary={item.label} sx={{ fontSize: 10 }} />
                </>
              ) : (
                item.label
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No options found</MenuItem>
        )}
      </Select>
      <FormHelperText error={!!error}>{error || " "}</FormHelperText>
    </FormControl>
  );
};

CustomSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  grouping: PropTypes.bool,
  className: PropTypes.string,
  name: PropTypes.string,
  defaultOption: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
  ]),
};

export default CustomSelectField;
