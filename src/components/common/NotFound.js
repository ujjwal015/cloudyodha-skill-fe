import React from "react";
import { Link, Navigate } from "react-router-dom";
import { SIGNIN } from "../../config/constants/routePathConstants/auth";
import { ReactComponent as Logo } from "../../assets/temp/Testa_logo.svg";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/slicers/authSlice";
const NotFound = () => {
  const { userInfo = {} } = useSelector(authSelector);

  if (!userInfo || Object.keys(userInfo).length === 0) {
    return <Navigate to={SIGNIN} replace />;
  }

  return (
    <div style={{ padding: "5%", textAlign: "center" }}>
      <div className="testa_logo">{<Logo />}</div>
      <h1>Sorry, you are not logged in. Please log in and try again.</h1>
      <Link to={SIGNIN}>Go to Signin</Link>
    </div>
  );
};
export default NotFound;
