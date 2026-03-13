import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Grid, IconButton, Modal, Typography } from "@mui/material";

export default function FileUploadModal({ open, onClose, submit,loading }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilsUrls, setSelectedFilesUrls] = useState([]);


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setSelectedFilesUrls((prevFiles) => [
      ...prevFiles,
      ...files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFilesUrls((prevFiles) => {
      const newFiles = [...prevFiles];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const modalClose = () => {
    setSelectedFiles([]);
    setSelectedFilesUrls([]);
    onClose();
  };


  const handleSubmit = () => {
    if(selectedFiles.length>0){
        const payload={
            image:selectedFiles[0]
        }
        const formdata=new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formdata.append('image', selectedFiles[i]);
          }
        submit(formdata,modalClose)
    }
  };

 
  return (
    <Modal open={open} onClose={modalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Upload Files
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Choose Files
            </Button>
          </label>
        </Box>
        <Grid container spacing={1} justifyContent="center">
          {selectedFilsUrls.map((file, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  overflow: "hidden",
                  borderRadius: 1,
                  "&:hover": {
                    "& img": {
                      opacity: 0.3,
                    },
                    "& .deleteButton": {
                      opacity: 1,
                    },
                  },
                }}>
                <img
                  src={file.preview}
                  alt={`preview ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 0.3s",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile(index)}
                  className="deleteButton"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button variant="outlined" onClick={modalClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={selectedFiles.length === 0 || loading}>
            {loading ? "Uploading":"Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
