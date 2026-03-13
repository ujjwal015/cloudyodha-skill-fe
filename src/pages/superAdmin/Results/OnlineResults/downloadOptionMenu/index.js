import React, { Fragment, memo, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Checkbox,
  Divider,
  ListItemText,
  Box,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { PulseLoader } from "react-spinners";
import {
  DOWNLOAD_BATCH_ATTENDANCE_API,
  DOWNLOAD_BATCH_RESULTS_ZIP_API,
} from "../../../../../config/constants/apiConstants/superAdmin";
import {
  API_ROOT,
  GET_FEEDBACK_API,
} from "../../../../../config/constants/apiConstants/auth";
import { getLocal } from "../../../../../utils/projectHelper";

const DownloadOptionsMenu = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setLoading(false);
    setAnchorEl(null);
  };

  const isAvailable = {
    response: !!row?.candidate_Appeared_In_Batch?.candidateAttended,
    attendance: !!row?.candidate_Appeared_In_Batch?.candidateAttended,
    tp: !!row?.isTrainingPartnerSubmittedFeedback,
    assessor: !!row?.isAssessorSubmittedFeedback,
  };

  const allAvailable = Object.values(isAvailable).every(Boolean);
  const isAllEmpty = Object.values(isAvailable).every((val) => !val);

  const availableOptions = [
    { key: "response", label: "Response" },
    { key: "attendance", label: "Attendance Sheet" },
    { key: "tp", label: "TP Feedback" },
    { key: "assessor", label: "Assessor Feedback" },
  ].filter((item) => isAvailable[item.key]);

  const toggleItem = (key) => {
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  return (
    <Fragment>
      <Tooltip title="Download Options">
        <span>
          <IconButton onClick={handleClick} disabled={isAllEmpty}>
            <DownloadIcon
              style={{
                width: "18px",
                cursor: "pointer",
                color: !isAllEmpty ? "black" : "#D3D3D3",
              }}
            />
          </IconButton>
        </span>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {availableOptions?.map((item) => (
          <MenuItem key={item.key} onClick={() => toggleItem(item.key)}>
            <Checkbox
              key={item.key}
              checked={selectedItems.includes(item.key)}
              size="small"
              sx={{
                color: "black",
                "&.Mui-checked": {
                  color: "black",
                },
              }}
            />
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}

        {availableOptions?.length > 0 && [
          <Divider key="divider-download" />,

          <Box
            key={row?._id}
            display="flex"
            justifyContent="center"
            gap={1}
            marginY={1}
          >
            <MenuItem
              onClick={() => {
                handleDownloadAllAsZip(
                  row,
                  selectedItems,
                  handleClose,
                  setLoading
                );
              }}
              disabled={selectedItems?.length === 0 || loading}
              style={{
                fontWeight: 500,
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "4px",
                width: "45%",
                height: "40px",
                textAlign: "center",
                justifyContent: "center",
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              {loading ? <PulseLoader size={10} color="#fff" /> : "Download"}
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleDownloadAllAsZip(
                  row,
                  selectedItems,
                  handleClose,
                  setLoading
                );
              }}
              disabled={loading}
              style={{
                fontWeight: 500,
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "4px",
                width: "45%",
                height: "40px",
                textAlign: "center",
                justifyContent: "center",
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#2e7d32",
                },
              }}
            >
              {loading ? (
                <PulseLoader size={10} color="#fff" />
              ) : (
                "Download All"
              )}
            </MenuItem>
          </Box>,
        ]}

        {allAvailable && (
          <MenuItem
            onClick={() => {
              handleDownloadAllAsZip(
                row,
                selectedItems,
                handleClose,
                setLoading
              );
            }}
            disabled={selectedItems?.length === 0 || loading}
            style={{ fontWeight: "bold" }}
          >
            {loading ? <PulseLoader size={10} color="#fff" /> : "Download All"}
          </MenuItem>
        )}
      </Menu>
    </Fragment>
  );
};

export default memo(DownloadOptionsMenu);

const handleDownloadAllAsZip = async (
  row,
  downloadTypes = [],
  handleClose = () => {},
  setLoading = () => {}
) => {
  const zip = new JSZip();
  const token = getLocal();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-auth-token": token,
  };

  setLoading(true);
  const batchId = row.batchId;
  const batchName = row.batchName || batchId;

  const fetchBlob = async (url, filename) => {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`Failed to download: ${filename}`);
      const blob = await response.blob();
      return { blob, filename };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const finalDownloadTypes =
    downloadTypes?.length > 0
      ? downloadTypes
      : ["response", "attendance", "assessor", "tp"];
  const filePromises = [];

  for (const type of finalDownloadTypes) {
    switch (type) {
      case "response":
        filePromises.push(
          fetchBlob(
            `${API_ROOT}${DOWNLOAD_BATCH_RESULTS_ZIP_API}/${row._id}`,
            `${batchName}_Response.zip`
          )
        );
        break;

      case "attendance":
        filePromises.push(
          fetchBlob(
            `${API_ROOT}${DOWNLOAD_BATCH_ATTENDANCE_API}/${row._id}`,
            `${batchName}_Attendance.xlsx`
          )
        );
        break;

      case "assessor":
        filePromises.push(
          fetchBlob(
            `${API_ROOT}${GET_FEEDBACK_API}/${batchId}?type=assessor`,
            `${batchName}_Assessor_Feedback.pdf`
          )
        );
        break;

      case "tp":
      case "trainingPartner":
        filePromises.push(
          fetchBlob(
            `${API_ROOT}${GET_FEEDBACK_API}/${batchId}?type=trainingPartner`,
            `${batchName}_TP_Feedback.pdf`
          )
        );
        break;

      default:
        console.warn(`Unknown download type: ${type}`);
        break;
    }
  }

  const files = await Promise.all(filePromises);
  handleClose();
  files.forEach((file) => {
    if (file && file.blob) {
      zip.file(file.filename, file.blob);
    }
  });

  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, `${batchName}.zip`);
  });
};
