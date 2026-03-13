import { InputAdornment, TextField } from "@mui/material";
import { memo } from "react";
import { ReactComponent as SearchIcon } from "../../assets/icons/search-icon-grey.svg";

function SearchInput({
  searchQuery,
  handleTrimPaste,
  setSearchQuery,
  isDisabled,
}) {
  const handleChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder="Search"
      value={searchQuery}
      disabled={isDisabled}
      style={{ background: "#F8F8F8", padding: "2px" }}
      onChange={(e) => handleChange(e)}
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
