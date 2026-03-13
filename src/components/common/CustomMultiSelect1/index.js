import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import "./style.css";
import { FormHelperText } from "@mui/material";

export default function GroupedSelect({
  label,
  categories,
  selectedOptions,
  handleChange,
  customStyles,
  required = false,
  placeholder = "Select option",
  name,
  grouping = false,
  error,
}) {
  const handleOptionToggle = (categoryName, option) => {
    const existingCategory = selectedOptions?.find(
      (selected) => selected.name === categoryName
    );

    let updatedOptions;
    if (existingCategory) {
      const optionExists = existingCategory.options?.some(
        (opt) => opt.value === option.value
      );
      if (optionExists) {
        updatedOptions = existingCategory.options?.filter(
          (opt) => opt.value !== option.value
        );
      } else {
        updatedOptions = [...existingCategory.options, option];
      }
    } else {
      updatedOptions = [option];
    }

    const newSelectedOptions = updatedOptions.length
      ? [
          ...selectedOptions?.filter(
            (selected) => selected.name !== categoryName
          ),
          { name: categoryName, options: updatedOptions },
        ]
      : selectedOptions?.filter((selected) => selected.name !== categoryName);

    handleChange(newSelectedOptions, name);
  };

  return (
    <div className="custom-select">
      <FormControl>
        <label>
          {label}
          {required && "*"}
        </label>
        <Select
          labelId="grouped-select-label"
          multiple
          displayEmpty
          error={error ? error : ""}
          value={selectedOptions?.flatMap((category) =>
            category.options?.map((opt) => opt.value)
          )}
          inputProps={{
            id: "grouped-select",
          }}
          sx={{ margin: 0 }}
          renderValue={(selected) => {
            if (selected?.length === 0) return placeholder;
            return selected?.join(", ");
          }}
        >
          <MenuItem disabled value="">
            {placeholder}
          </MenuItem>
          {categories?.map((category) => (
            <React.Fragment key={category.name}>
              {grouping && (
                <ListSubheader
                  sx={{ fontWeight: "bold", ...customStyles?.listSubheader }}
                >
                  {category.name}
                </ListSubheader>
              )}

              {category.options?.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  onClick={() => handleOptionToggle(category.name, option)}
                  sx={{ ...customStyles?.menuItem }}
                >
                  <Checkbox
                    checked={selectedOptions?.some(
                      (selected) =>
                        selected.name === category.name &&
                        selected.options?.some(
                          (opt) => opt.value === option.value
                        )
                    )}
                    sx={{ ...customStyles?.checkbox }}
                  />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </React.Fragment>
          ))}
        </Select>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    </div>
  );
}

