import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Typography,
} from "@mui/material";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 300,
    boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
  },
}));

export default function FilterDrop() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        startIcon={<TuneSharpIcon />}
      >
        Filter
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Typography px={1} sx={{ fontWeight: "bold" }}>
          Filters
        </Typography>

        <List
          dense
          component="div"
          role="list"
          sx={{
            span: { padding: "0 3px" },
            ".MuiFormControlLabel-label": { fontSize: "13px" },
          }}
        >
          <ListItem>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Question ID"
            />
          </ListItem>
          <ListItem>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Question Туpе"
            />
          </ListItem>
          <ListItem>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Job Role"
            />
          </ListItem>
          <ListItem>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Sector"
            />
          </ListItem>
        </List>
        <Box sx={{ textAlign: "right", mb: 1 }}>
          <Button sx={{ mr: 1 }} size="small" variant="outlined">
            Clear
          </Button>
          <Button
            sx={{ mr: 2 }}
            size="small"
            variant="contained"
            onClick={handleClose}
          >
            Apply
          </Button>
        </Box>
      </StyledMenu>
    </div>
  );
}
