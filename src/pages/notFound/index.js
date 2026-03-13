import * as React from "react";
import Grid from "@mui/material/Grid";
import "./style.css";
import { Container } from "@mui/material";
import Image from "../../assets/images/common/404-image.png";


const NotFound = () => {

  return (
    <div className="pagenot_found">
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center">
          <Grid item sm={12} md={6}>
            <h1>404</h1>
            <h3>Oops!</h3>
            <h3>Page Not Found...</h3>
            <p>
              We're sorry, but something went wrong.        
            </p>
          </Grid>
          <Grid item sm={12} md={6}>
            <img width={"100%"} src={Image} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default NotFound;
