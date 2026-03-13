import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Grid, IconButton, Modal, Typography } from "@mui/material";

export default function VideoUploadModal({ open, onClose,submit,loading }) {
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedVideosUrls,setSelectedVideosUrls]=useState([]);


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));
    setSelectedVideosUrls((prevVideos) => [
      ...prevVideos,
      ...videoFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);

    setSelectedVideos((prevVideos) => [
        ...prevVideos,
        ...videoFiles.map((file) => ({
          file,
        })),
      ])
  };

  const handleRemoveVideo = (index) => {
    setSelectedVideos((prevVideos) => {
      const newVideos = [...prevVideos];
      URL.revokeObjectURL(newVideos[index].preview);
      newVideos.splice(index, 1);
      return newVideos;
    });
    setSelectedVideosUrls((prevVideos) => {
        const newVideos = [...prevVideos];
        newVideos.splice(index, 1);
        return newVideos;
      })
  };

  const modalClose = () => {
    selectedVideos.forEach((video) => URL.revokeObjectURL(video.preview));
    setSelectedVideos([]);
    setSelectedVideosUrls([])
    onClose();
  };

  const handleSubmit = () => {
    if(selectedVideos.length>0){
        let paylaod={};
        for(let item of selectedVideos){
            paylaod={...paylaod,"video":item?.file}
        }
        const formdata=new FormData();
        for (let i = 0; i < selectedVideos.length; i++) {
            formdata.append('video', selectedVideos[i].file);
          }
        submit(formdata,modalClose);
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
          Upload Videos
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <input
            accept="video/*"
            style={{ display: "none" }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Choose Videos
            </Button>
          </label>
        </Box>
        <Grid container spacing={1} justifyContent="center">
          {selectedVideosUrls.map((video, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  overflow: "hidden",
                  borderRadius: 1,
                  "&:hover": {
                    "& video": {
                      opacity: 0.3,
                    },
                    "& .deleteButton": {
                      opacity: 1,
                    },
                  },
                }}>
                <video
                  src={video.preview}
                  autoplay
                  loop
                  muted
                  style={{
                    width: "85%",
                    height: "85%",
                    objectFit: "cover",
                    transition: "opacity 0.3s",
                    borderRadius:"10px"
                  }}>
                  Your browser does not support the video tag.
                </video>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveVideo(index)}
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
          <Button variant="contained" onClick={handleSubmit} disabled={selectedVideos.length === 0 || loading}>
          {loading ? "Uploading":"Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
