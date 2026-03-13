import React from "react";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close-icon.svg";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

const DATA = [
  {
    title: "Terms and Conditions",
    descriptions: [
      "A User could also log in with an account generated through other portal accessibility by syncing it with an identity on the Website.",
      "By completing Registering on the Site, the User affirms that they are ready to commit as well as that the personal information they have given is correct and full, and doesn't infringe on any third-party rights.",
      "If any modifications occur within this scope, the User must promptly notify the Supplier. Minors may use the Website only with the permission of their parent or legal guardian.",
      "After the Registration Application is submitted, the Network Operator provides a message to the Patient's chosen e-mail address with an Account setup password. An Account is activated when the Customers click the user access, which validates the creation of an Account",
    ],
  },
  {
    title: "Privacy Policies",
    descriptions: [
      "An individual with legally valid capacity and, in certain cases specified by the general application provisions, also a person with constrained legal authority, a legal individual, or a juridical person without even any separate legal who utilizes the Services through an Account they have generated, and the Services are given to them digitally by the Network Operator;",
      "Cookies are used on our website to tailor its functionality to your specific requirements. As a result, you can agree to have the details and data they supply saved so you're able to utilize it the following time you come to the page without having to re-enter it. These records and details will not be accessible to the proprietors of other websites. If you do not wish to customize the Website, we recommend that you disable Cookie in your internet browser settings.",
      "Our organization, as the Personal Details Controller, processes the User's details to carry out the services that we provide to the User as well as those made available through the Website. We collect only such private details categories that are required to fulfill the aims laid out in the previous line, following the data minimization concept",
      "We never disclose personal details to other parties without the explicit agreement of the individual whose data it is. Without the approval of the individual whose personal data is being collected, these details may only be given access to entities authorized by public law.",
      "Personal data might well be given to processing on behalf of our firm as the Personal Data Master for treatment. As the Personal Details Processor in such a case, we enter into an intentional tort arrangement with processors again for handling personal details. The processor only handles the committed private details for the objectives, scope, and aims specified in the intentional tort agreement referred to in the previous paragraph. We would be unable to carry out our operations via the Website unless you entrusted us all with your details for processing.",
    ],
  },
];

const TermsAndCondition = ({ openBox, setOpenBox, setFormValues }) => {
  const handleAccept = () => {
    setFormValues((pre) => ({ ...pre, acceptTermCondition: true }))
    setOpenBox(false)
  }
  return (
    <Dialog
      open={openBox}
      onClose={() => setOpenBox(false)}
      scroll={"paper"}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog-wrapper"
      maxWidth="sm"
    >
      <Box className="terms-condition-Modal">
        <Box className="terms-condition-title">
          <CloseIcon onClick={() => setOpenBox(false)} />
        </Box>

        <DialogContent sx={{ padding: 0 }} className="terms-condition-content">
          {DATA.map((text) => (
            <div key={text?.title}>
              <h4>{text?.title}</h4>
              {text?.descriptions?.map((desc) => (
                <p key={desc}>{desc}</p>
              ))}
            </div>
          ))}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <DialogActions
              sx={{ padding: 0 }}
              className="terms-condition-action"
            >
              <Button
                variant="contained"
                onClick={handleAccept}
              // autoFocus
              >
                I Accept
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default TermsAndCondition;
