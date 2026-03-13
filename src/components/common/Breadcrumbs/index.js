import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Icon } from "@iconify/react/dist/iconify.js";

const BreadCrumbs = (props) => {
  const {
    breadCrumbsLists = [],
    separator = <Icon icon="fluent:chevron-right-32-filled" />,
  } = props;

  return (
    <Breadcrumbs
      sx={{ fontSize: 12, marginBottom: 1 }}
      separator={separator}
      aria-label="breadcrumb"
    >
      {breadCrumbsLists?.map((breaditem) => {
        const { isLink, onClick, key, path, name, isPermissions, isDisable } =
          breaditem ?? {};
        return isLink ? (
          <Link
            underline="hover"
            style={{ cursor: "pointer" }}
            key={key}
            color="inherit"
            onClick={(e) => onClick(e, name, path)}
          >
            {name}
          </Link>
        ) : (
          <Typography
            sx={{ fontSize: "13px !important" }}
            key={key}
            color="inherit"
          >
            {name}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};
export default BreadCrumbs;
