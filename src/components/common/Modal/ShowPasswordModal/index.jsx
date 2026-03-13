import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Snackbar,
  Paper,
  Button,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch } from 'react-redux';
import { getPasswordAssessor, getPasswordAssessorAPI } from '../../../../api/superAdminApi/assessorManagement';

export default function ShowPasswordModal({viewPasswordModal,setViewPasswordModal,id}) {
    console.log("ID_id_ID_id_ID",id)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const dispatch=useDispatch()
  const [loading, setLoading]=useState(false)
  const [password,setPassword]=useState("2ot4dfE423wSFG5r32Bb");

  const getPasswordForAssessor=(id)=>{
    dispatch(getPasswordAssessorAPI(setLoading,id))
  }

  useEffect(()=>{
    if(id.length>0){
        getPasswordForAssessor(id);
    }
  },[id])



  const handleCloseModal = () => setViewPasswordModal(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password).then(() => {
      setSnackbarOpen(true);
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Modal
        open={viewPasswordModal}
        onClose={handleCloseModal}
        aria-labelledby="password-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography 
            id="password-modal-title" 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              textAlign: 'center',
              mb: 3,
            }}
          >
            Password
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 3,
            width: '100%'
          }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                minWidth: '200px',
                height: '40px',
              }}
            >
              <Typography variant="body1">
                {password}
              </Typography>
            </Paper>
            <IconButton 
              onClick={handleCopyPassword} 
              size="small" 
              aria-label="copy password"
              sx={{ ml: 1 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ width: '100%', textAlign: 'left' }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.8rem',
                mb: 2,
              }}
            >
              Note:
              <br />
              {/* Password is generated once, it will not be reflected anymore after this. Please save the password in your local storage for further use. */}
              Please ensure you copy this password now, as it will only be displayed once and cannot be retrieved again
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleCloseModal}
              sx={{ mt: 2, width: '100%' }}
            >
              Hello
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Password copied to clipboard"
      />
    </Box>
  );
}