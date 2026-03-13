import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Banner from "../Banner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestaLogo from "../../../assets/images/common/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmailApi } from "../../../api/authApi";
import PulseLoader from "react-spinners/PulseLoader";
import {
  EDIT_PROFILE,
  SIGNIN,
} from "./../../../config/constants/routePathConstants/auth";

const Index = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  useEffect(() => {
    const formData = { token };
    setLoading(true);
    dispatch(verifyEmailApi(formData, navigate, setLoading));
  }, []);

  return (
    <div className="login-container">
      <Banner />
      <div className="login-form-container">
        <div className="form-wrapper center-wrapper">
          <div
            className="text-wrapper"
            style={{ borderBottom: "0", textAlign: "center" }}
          >
            <div className="logo">
              <img src={TestaLogo} alt="logo" />
            </div>

            {loading ? (
              ""
            ) : (
              <>
                <h4 className="verify-title">
                  Congratulations! Your email has been successfully verified.
                </h4>
                <p className="cred-text">
                  Do you want to continue to your account?
                </p>
              </>
            )}
          </div>
          {loading ? (
            <PulseLoader
              size="25px"
              color="#2ea8db"
              style={{ display: "flex", justifyContent: "center" }}
            />
          ) : (
            <div className="form">
              <div className="action-btn">
                <Button
                  className="outlined-btn"
                  variant="outlined"
                  sx={{ width: "100%", textTransform: "unset" }}
                  disabled={loading ? true : false}
                  onClick={() => navigate(SIGNIN)}
                >
                  CANCEL
                </Button>
                <Button
                  className="light-blue-btn"
                  variant="contained"
                  sx={{ width: "100%", textTransform: "unset" }}
                  disabled={loading ? true : false}
                  onClick={() => navigate(EDIT_PROFILE)}
                >
                  CONTINUE
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
