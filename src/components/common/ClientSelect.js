import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function ClientSelect({ options, handleClientChange, clientList }) {
  const [selectedClient, setSelectedClient] = React.useState("");

  const handleChange = (event) => {
    setSelectedClient(event.target.value);
    handleClientChange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="demo-simple-select-label" shrink={true}>Client</InputLabel>
        <Select
          autoFocus
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          displayEmpty
          value={selectedClient}
          label="Client"
          onChange={handleChange}>
          <MenuItem value={""}>All Clients</MenuItem>
          {options.map((item) => {
            return <MenuItem value={item.clientId}>{item.clientName}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
