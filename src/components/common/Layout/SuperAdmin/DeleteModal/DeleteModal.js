import * as React from 'react'
import "./deleteModal.css"
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { ReactComponent as DeleteBtn } from '../../../../../assets/icons/delete-icon.svg'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    borderRadius: "5px"
};
export default function TransitionsModal(payload) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch()
    const [loading, setLoading] = React.useState(false)

    const { id, targetApi, sectionId } = payload

    const deleteHandler = () => {
        setLoading(true)
        dispatch(targetApi(setLoading, id, dispatch, sectionId))
        setOpen(false);
    }

    return (
        <div>
            <div id='trigger_button'>
                <Button
                    startIcon={<DeleteBtn />}
                    onClick={handleOpen}
                    sx={{ width: "100%", color: "#00B2FF", fontSize: "13px", textTransform: "capitalize" }}
                    >
                    Delete
                </Button>
            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Delete Question Bank
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            are you sure want to delete this ?
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 20,
                                mt: 2,
                            }}
                        >
                            <Button
                                onClick={() => setOpen(false)}
                                sx={{
                                    fontFamily: "Poppins",
                                    border: "solid 1px #1AB6F7",
                                    color: "#1AB6F7",
                                    textTransform: "capitalize",
                                    "&:hover": {
                                        border: "solid 1px #1AB6F7",
                                        color: "#1AB6F7",
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={deleteHandler}
                                sx={{
                                    fontFamily: "Poppins",
                                    backgroundColor: "#1AB6F7",
                                    color: "#F5F5F5",
                                    textTransform: "capitalize",
                                    "&:hover": {
                                        backgroundColor: "#1AB6F7",
                                        color: "#F5F5F5",
                                    },
                                }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}