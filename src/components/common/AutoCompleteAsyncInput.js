import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { InputLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const AutoCompleteAsyncInput = ({
  label,
  name,
  value,
  placeHolder,
  handleChange,
  mandatory = false,
  disabled = false,
  isLoading = false,
  error,
  setter,
  optionLists,
  qpCodeList,
  enableMultiSelect = false,
}) => {

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [val, setVal] = useState("");
  const [multiSelectValue, setMultiSelectValue] = useState([]);

  const loading = open && options.length === 0;

  useEffect(() => {
    if (optionLists && optionLists?.length > 0) {
      const val = optionLists?.find((option) => option.value == value)?.label;
      setVal(val);
    }
  }, [optionLists]);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...optionLists]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
  
  if (multiSelectValue?.length === 1 || multiSelectValue?.length === 0) {
    // Reload options when an option is selected
    (async () => {
      await sleep(1e3); // For demo purposes.
      setOptions([...optionLists]);
    })();
  }
}, [optionLists]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (enableMultiSelect) {
      let tempData = value?.map((item) => {
        return {
          value: item?.jobRoleId||item?.value,
          label: item?.jobRoleLabel||item?.label,
        };
      });
      setMultiSelectValue([...tempData]);
    }
  }, [value, enableMultiSelect]);

  const handleInputChange = (event, newInputValue) => {
    !enableMultiSelect && setVal(newInputValue);
  };


  const handleOptionSelect = (event, selectedOption) => {
    if (enableMultiSelect) {
      setMultiSelectValue(selectedOption);
      let tempData = selectedOption?.map((item) => {
        const qpcodeData = qpCodeList?.find((qp) => qp?.value === item?.value);        // Find existing data for this item if it exists
        const existingData = value?.find(
          (existing) => existing.jobRoleId === item.value || existing.value === item.value
        );
        return {
          // level: "",
          // version: "",
           // Spread existing data if found, otherwise use default values
           ...(existingData || {
            level: "",
            version: "",
          }),
          jobRoleId: item?.value,
          jobRoleLabel: item?.label,
          qpCode: qpcodeData?.label,
        };
      });
      setter((prev) => ({
        ...prev,
        [name]: tempData,
      }));
    } else setter((prev) => ({ ...prev, [name]: selectedOption?.value }));
  };

  return (
    <>
      <InputLabel id="outlined-adornment-select" className="input-label">
        {label}
        {mandatory && label && <span className="mandatory">&nbsp;*</span>}
      </InputLabel>
      <Autocomplete
        multiple={enableMultiSelect}
        id="asynchronous-demo"
        size="small"
        fullWidth
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        ListboxProps={{
          sx: { fontSize: 12 },
        }}
        value={enableMultiSelect ? multiSelectValue : val}
        onInputChange={handleInputChange}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        // getOptionLabel={(option) => option.label}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option?.label || "";
        }}
        options={options}
        loading={loading}
        disabled={disabled}
        disableCloseOnSelect={enableMultiSelect}
        onChange={handleOptionSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={label}
            //   label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              {enableMultiSelect && (
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
              )}
              {option?.label}
            </li>
          );
        }}
      />
      {error && <p className="error-input">{error}</p>}
    </>
  );
};

export default AutoCompleteAsyncInput;