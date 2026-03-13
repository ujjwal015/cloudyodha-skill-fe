import { ReactComponent as POCPerson } from "../../../../assets/icons/featurePocIcon.svg";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import "./style.css";
import { Icon } from "@iconify/react/dist/iconify.js";

const POCModal = ({ open, handleModelClose, spokeData }) => {
 
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleModelClose}
        fullWidth={true}
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "12px" } }}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <div className="poc-model-wrapper">
          <div className="poc-title">
            <div className="poc-title-info">
                <POCPerson width={40} />
                <div>
                  <h2>Point of Contact</h2>
                  <p>See All Details of Poc here.</p>
                </div>
            </div>
            <Icon className="poc-model-close"  onClick={handleModelClose} icon="icon-park-outline:close"/>
          </div>

          <DialogContent sx={{p:2}}>
            <ul className="poc_list">
              {spokeData?.map((el, index) => {
                return (
                  <li className="">
                    <div>
                      <h1>Person of Contact 1</h1>
                      <p>
                        <span>Name :</span> {el?.spoke_name}r
                      </p>
                      <p>
                        <span>Email :</span> {el?.spoke_email}
                      </p>
                      <p>
                        <span>Contact No :</span> {el?.spoke_mobile}
                      </p>
                      <p>
                        <span>Designation :</span> {el?.spoke_designation || "N/A"}
                      </p>
                    </div>
                    <Icon icon="ion:copy-outline"/>
                  </li>
                );
              })}
            </ul>
            {/*  {spokeData?.length > 0 ? (
              <>
                <Box>
                  {spokeData?.map((el, index) => {
                    return (
                      <div key={index}>
                        <div className="POC_card">
                          <h1>{`POC : ${index + 1}`}</h1>
                          <Grid container>
                            <Grid item xs={12} sm={6}>
                              <p>
                                <span>Name :</span> {el?.spoke_name}
                              </p>
                              <p>
                                <span>Department :</span> {el?.spoke_department}
                              </p>
                              <p>
                                <span>Contact Number :</span>{" "}
                                {el?.spoke_mobile || "Not Provided"}
                              </p>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <p>
                                <span>Email :</span> {el?.spoke_email}
                              </p>
                              <p>
                                <span>Designation :</span>{" "}
                                {el?.spoke_designation || "Not provided"}
                              </p>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    );
                  })}
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Point of Contact Details
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    No Results to show
                  </Typography>
                </Box>
              </>
            )} */}
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default POCModal;
