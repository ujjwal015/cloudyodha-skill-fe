import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "../../assessorAttendance/assessorAttendanceList/requestLog/list/imgPreview.css";
import GoogleMapReact from "google-map-react";
import location_marker from "../../../../assets/images/common/location_marker.png";
import { capitalizeFirstLetter } from "../../../../utils/projectHelper";

const Marker = () => (
  <div
    style={{
      width: "50px",
      height: "50px",
      overflow: "hidden",
    }}
  >
    <img
      src={location_marker}
      alt="Marker"
      style={{ width: "100%", height: "100%" }}
      loading="lazy"
    />
  </div>
);

export default function PreviewLocationModel({
  handlePreview,
  isPreviewOpen,
  setIsPreviewOpen,
  handlePreviewClose,
  deviceType = null,
  browserName = null,
  fieldName,
  locationDetails = {},
  batchName,
}) {
  const { lat, long } = locationDetails;

  return (
    <React.Fragment>
      <Dialog
        open={isPreviewOpen}
        onClose={handlePreviewClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <div className="header-wrapper">
            <div className="section-wrapper">
              <label>
                <h2>Device Type -</h2>
              </label>
              <p>
                {deviceType !== null ? capitalizeFirstLetter(deviceType) : "NA"}
              </p>
            </div>
            <div className="section-wrapper">
              <label>
                <h2>Browser Name -</h2>
              </label>
              <p>{(browserName && browserName) || "NA"}</p>
            </div>
            <div>
              <IconButton
                aria-label="close"
                onClick={handlePreviewClose}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <div className="map-preview">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyChSN-Ry_1nH_VMtqU4cASXT41YKQwmcWU",
            }}
            defaultCenter={{ lat: parseFloat(lat), lng: parseFloat(long) }}
            defaultZoom={13}
          >
            <Marker lat={parseFloat(lat)} lng={parseFloat(long)} />
          </GoogleMapReact>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
