import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./navbar";
import Footer from "./footer";
import {
  STUDENT_LOGIN_PAGE,
  STUDENT_TOKEN_LOGIN_PAGE,
} from "../../../../config/constants/routePathConstants/student";
import { SIGNIN } from "../../../../config/constants/routePathConstants/auth";
import FullscreenGuard from "./fullscreenGuard";

const noLayout = [STUDENT_LOGIN_PAGE, SIGNIN, STUDENT_TOKEN_LOGIN_PAGE];
const StudentLayout = () => {
  const { pathname = "" } = useLocation();
  const hasLayout = noLayout.find((item) => pathname.includes(item));
  return hasLayout || pathname == SIGNIN ? (
    <Outlet />
  ) : (
    <div className="user-page">
      <FullscreenGuard>
        <NavBar />
        <Outlet />
        <Footer />
      </FullscreenGuard>
    </div>
  );
};

export default StudentLayout;
