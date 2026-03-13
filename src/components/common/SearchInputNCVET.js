import { InputAdornment, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { ReactComponent as SearchIcon } from "../../assets/icons/search-icon-grey.svg";
import { useDispatch } from "react-redux";
function SearchInputNCVETTable({
  searchQuery,
  handleTrimPaste,
  setSearchQuery,
  apiHandler,
  setLoading,
  page,
  limit,
  setTotalPages,  
  endAdornment = false,
  handleSearchSubmit = null,
  isDisabled = false,
}) {
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

 /*  const handleSearchSubmit = (e) => {
    if (searchQuery !== null) {
      setLoading(true);
      dispatch(apiHandler(setLoading, page, searchQuery, limit, setTotalPages));
    }
  }; */

  useEffect(() => {
    const getData = setTimeout(() => {
      handleSearchSubmit && handleSearchSubmit();
    }, 500);

    return () => clearTimeout(getData);
  }, [searchQuery]);

  return (
    <>
      <TextField
        size="medium"
        variant="outlined"
        placeholder="Search by anything..."
        value={searchQuery}
        onChange={handleChange}
        disabled={isDisabled}
        onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
        style={{backgroundColor:"#DFDFDF01",borderRadius:"20px"}}
        sx={{borderRadius:"20px"}}
        InputProps={endAdornment ? {
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon style={{ color: "#231F20"  }} />
            </InputAdornment>
          ),
        }: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: "#231F20" }} />
            </InputAdornment>
          ),
        } }
      />
    </>
  );
}

export default SearchInputNCVETTable;
