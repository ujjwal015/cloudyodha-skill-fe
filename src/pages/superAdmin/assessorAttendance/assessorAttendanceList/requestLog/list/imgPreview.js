import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./imgPreview.css";
import GoogleMapReact from 'google-map-react';

const Marker = ({ image, lat, lng }) => (
  <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'solid red 1px', overflow: 'hidden' }}>
    <img src={image} alt="Marker" style={{ width: '100%', height: '100%' }} loading="lazy" />
  </div>
);



export default function PreviewImageModel({
  handlePreview,
  isPreviewOpen,
  setIsPreviewOpen,
  handlePreviewClose,
  url = null,
  assessorName = null,
  fieldName,
  locationDetails,
  batchName
}) {

  const defaultProps = {
    center: {
      lat: parseFloat(locationDetails?.latitude),
      lng: parseFloat(locationDetails?.longitude),
    },
    zoom: 12,
  };
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
                <h2>Assessor Name -</h2>
              </label>
              <p>{assessorName !== null ? assessorName : "NA"}</p>
            </div>
            <div className="section-wrapper">
              <label>
                <h2>Batch Name -</h2>
              </label>
              <p>{(batchName && batchName) || "NA"}</p>
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
          {fieldName === "image" ? (
            <img
              src={url !== null ? url : ""}
              alt="preview"
              loading="lazy"
              height="100%"
              width="100%"
            />
          ) : (
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyChSN-Ry_1nH_VMtqU4cASXT41YKQwmcWU",
              }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
            >
              <Marker
                image={url !== null ? url : ""}
                lat={parseFloat(locationDetails?.latitude)}
                lng={parseFloat(locationDetails?.longitude)}
              />
            </GoogleMapReact>
          )}
        </div>
      </Dialog>
    </React.Fragment>
  );
}
