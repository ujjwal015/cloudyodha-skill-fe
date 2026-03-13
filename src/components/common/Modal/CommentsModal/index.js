import React from 'react';
import { Avatar, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DummyImage from "../../../../assets/images/common/no-preview.png";
import "./style.css";
import {ReactComponent as HorizontalThreeDots} from "../../../../assets/icons/horizonal-threedots.svg";
const CommentsModal = (props) =>{
    const {open, handleCloseModal, title = "", ...restProps} = props;

    return (
        <Dialog
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{width: 'auto'}}
      >      
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
      <DialogContent sx={{minWidth: '500px'}}>
        <ul>
            <li>
                <div className='comments-modal-listitem'>
                    <div className='comments-modal-profile-wrapper'>
                        <div className='comments-modal-profile'>
                        <Avatar
            sx={{ width: 40, height: 40, border: "1px solid #ccc" }}
            // variant="rounded"
            alt={"some-alt"}
            src={"https://testa-new.s3.ap-south-1.amazonaws.com/kohigyzo%40mailinator.com?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5G2KCBXXWR3XF2UL%2F20240612%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240612T064022Z&X-Amz-Expires=36000&X-Amz-Signature=54ebde9060a3484cf05e4cb7604a0f8cbe35326fb494e62894333d7600614e18&X-Amz-SignedHeaders=host&x-id=GetObject" ?? DummyImage}
          />      
                            <div className='comments-modal-profile-title'>
                                <h1>Jane Doe</h1>
                                <span>1 week ago</span>
                            </div>
                        </div>
                        <div>
                            <HorizontalThreeDots />
                        </div>
                    </div>
                    <div>
                        <p>I really appreciate the insights and perspective shared in this article. It's definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!</p>
                    </div>
                </div>
            </li>
            <li>
                <div className='comments-modal-listitem'>
                    <div className='comments-modal-profile-wrapper'>
                        <div className='comments-modal-profile'>
                        <Avatar
            sx={{ width: 40, height: 40, border: "1px solid #ccc" }}
            // variant="rounded"
            alt={"some-alt"}
            src={"https://testa-new.s3.ap-south-1.amazonaws.com/kohigyzo%40mailinator.com?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5G2KCBXXWR3XF2UL%2F20240612%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240612T064022Z&X-Amz-Expires=36000&X-Amz-Signature=54ebde9060a3484cf05e4cb7604a0f8cbe35326fb494e62894333d7600614e18&X-Amz-SignedHeaders=host&x-id=GetObject" ?? DummyImage}
          />      
                            <div className='comments-modal-profile-title'>
                                <h1>Jane Doe</h1>
                                <span>1 week ago</span>
                            </div>
                        </div>
                        <div>
                            <HorizontalThreeDots/>
                        </div>
                    </div>
                    <div>
                        <p>I really appreciate the insights and perspective shared in this article. It's definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!</p>
                    </div>
                </div>
            </li>
        </ul>
      </DialogContent>
      </Dialog>
    )
};

export default CommentsModal