import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const ViewModal = ({ open, handleViewModalClose, children }) => {    
  return (
    <React.Fragment>      
      <Dialog
        open={open}
        onClose={handleViewModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{width: 'auto'}}
      >        
        <DialogContent>
        {children}
        </DialogContent>          
      </Dialog>
    </React.Fragment>
  );
}

export default ViewModal;