import { InputAdornment, TextField } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { ReactComponent as SearchIcon } from "../../assets/icons/search-icon-grey.svg";

function SearchInput({
  searchQuery,
  handleTrimPaste,
  setSearchQuery,
  isDisabled,
}) {
  const [inputValue, setInputValue] = useState(searchQuery || "");
  const debounceTimeout = useRef(null);

  const handleChange = (e) => {
    const { value } = e.target;
    setInputValue(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearchQuery(value);
    }, 1000);
  };

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder="Search"
      value={inputValue}
      disabled={isDisabled}
      style={{ background: "#F8F8F8", padding: "2px" }}
      onChange={handleChange}
      onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon style={{ color: "#231F20", width: 15 }} />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default memo(SearchInput);
