import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LazyLoader from "./components/common/LazyLoader";
import { getRoutes } from "./config/routes";
import { authSelector, setUserInfo } from "./redux/slicers/authSlice";
import { getLocal, getUserDetails } from "./utils/projectHelper";
import { USER_TYPE } from "./config/constants/projectConstant";
import ActivityContainer from "./container/Activity";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GetUserPermissionApi, updateUserLoggedInStatusApi } from "./api/authApi";
// import { io } from "socket.io-client";

function App() {
  const [loading, setLoading] = useState(false);
  const { userInfo = {} } = useSelector(authSelector);
  const userData = getUserDetails();
  const dispatch = useDispatch();
  const token = getLocal();

  const location = useLocation();

  useEffect(() => {
    dispatch(setUserInfo(getUserDetails()));
    if (token && userData?.userType !== 3) {
      setLoading(true);
      dispatch(GetUserPermissionApi(setLoading));
    }
  }, []);

  useEffect(() => {
    // Remove existing script if present
    const existingScript = document.getElementById("google-analytics");
    if (existingScript) {
      existingScript.remove();
    }

    // Determine the correct GA tracking ID based on path
    const isStudentPath = location.pathname.includes("student");
    const trackingId = isStudentPath ? "G-380TECTD0N" : "G-NMVRER6LW2";

    // Create GA script dynamically
    const script = document.createElement("script");
    script.id = "google-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Add GA configuration script
    const scriptContent = document.createElement("script");
    scriptContent.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}');
    `;
    document.head.appendChild(scriptContent);

    return () => {
      // Cleanup scripts when route changes
      script.remove();
      scriptContent.remove();
    };
  }, [location.pathname]);

  const theme = createTheme({
    typography: {
      fontFamily: "Poppins",
    },
  });

  const userRole = userInfo?.userRole;
  const routeType = userData.userType ?? 1;
  const router = useRoutes(getRoutes(routeType, userRole));

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ActivityContainer>
          {loading ? <LazyLoader /> : <LazyLoader>{router}</LazyLoader>}
          <ToastContainer />
        </ActivityContainer>
      </ThemeProvider>
    </>
  );
}

export default App;
