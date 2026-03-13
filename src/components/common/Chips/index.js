import React, { useState, useEffect } from "react";
import "./style.css";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { Icon } from "@iconify/react/dist/iconify.js";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ChipsArray = (props) => {
  const { selected, setter, name } = props?.data ?? {};

  const handleDelete = (chipToDelete) => () => {
    setter((prev) => prev.filter((chip) => chip !== chipToDelete));
  };

  const handleClearAll = () => {
    setter([]);
  };

  return (
    <>
      {selected?.map((data) => {
        let icon;

        if (data === "React") {
          icon = <TagFacesIcon />;
        }

        return (
          <Chip
            sx={{
              fontSize: "10px",
              background: "rgba(38, 38, 38, 1)",
              color: "#fff",
              "& .MuiChip-deleteIcon": { color: "#fff !important" },
            }}
            size="small"
            label={data}
            onDelete={handleDelete(data)}
            key={data}
          />
        );
      })}
      {selected?.length > 0 && (
        <span
          className="chip--clear"
          onClick={handleClearAll}      
        >
          <Icon icon="tabler:trash" />
          Clear
        </span>
      )}
    </>
  );
};

export default ChipsArray;
{
  /* <ListItem key={data}>
            <Chip icon={icon} label={data} onDelete={handleDelete(data)} />
          </ListItem> */
}
