import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import "./style.css";
import { useSelector } from "react-redux";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { getSubRole, userRoleType } from "../../../../utils/projectHelper";

export default function ExportModel({
  handleClose,
  changeHandler,
  formValues,
  handleExportPDF,
  handleExportExcel,
  setIsFilterOpen,
  loading = {},
}) {
  const ref = useRef();
  const { userInfo } = useSelector(authSelector);
  const { EXAM_MANAGEMENT_FEATURE, EXAM_MANAGEMENT_SUB_FEATURE_3 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = EXAM_MANAGEMENT_SUB_FEATURE_3;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const exportDisabled =
    !formValues?.candidateList &&
    !formValues?.attendanceList &&
    !formValues?.practicalAndVive &&
    !formValues?.links;

  const labelStyle = {
    color: "#000000DE",
    fontSize: "12px",
    fontFamily: "Poppins, sans-serif",
  };

  const headerStyle = {
    color: "#000000DE",
    fontSize: "16px",
    fontFamily: "Poppins, sans-serif",
  };

  return (
    <Paper
      ref={ref}
      elevation={4}
      sx={{
        position: "fixed",
        top: "20vh",
        right: 17,
        width: 300,
        padding: 2,
        zIndex: 1300,
        borderRadius: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={headerStyle}>
          Export Data
        </Typography>
        <CloseIcon
          onClick={handleClose}
          style={{
            cursor: "pointer",
          }}
        />
      </Box>

      <Divider sx={{ my: 1 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <FormControlLabel
          sx={labelStyle}
          control={
            <Checkbox
              checked={formValues?.selectAll}
              name="selectAll"
              onChange={changeHandler}
            />
          }
          label="Select All"
        />
        <FormControlLabel
          sx={labelStyle}
          control={
            <Checkbox
              checked={formValues?.candidateList}
              name="candidateList"
              onChange={changeHandler}
            />
          }
          label="Candidate List"
        />
        <FormControlLabel
          sx={labelStyle}
          control={
            <Checkbox
              checked={formValues?.attendanceList}
              name="attendanceList"
              onChange={changeHandler}
            />
          }
          label="Attendance Sheet"
        />
        <FormControlLabel
          sx={labelStyle}
          control={
            <Checkbox
              checked={formValues?.practicalAndVive}
              name="practicalAndVive"
              onChange={changeHandler}
            />
          }
          label="Practical and Viva Marksheet"
        />
        <FormControlLabel
          sx={labelStyle}
          control={
            <Checkbox
              checked={formValues?.links}
              name="links"
              onChange={changeHandler}
            />
          }
          label="Links"
        />
      </div>

      <Divider sx={{ my: 2 }} />

      <div className="filter-btn-wrapper">
        <button
          className="btn btn-excel"
          onClick={handleExportExcel}
          disabled={exportDisabled}
        >
          {loading?.excel ? "Exporting..." : "Excel"}
        </button>

        <button
          className="btn btn-pdf"
          onClick={handleExportPDF}
          disabled={exportDisabled}
        >
          {loading?.pdf ? "Exporting..." : "PDF"}
        </button>
      </div>
    </Paper>
  );
}
ExportModel.propTypes = {
  handleClose: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  handleExportPDF: PropTypes.func.isRequired,
  handleExportExcel: PropTypes.func.isRequired,
  setIsFilterOpen: PropTypes.func.isRequired,
};
