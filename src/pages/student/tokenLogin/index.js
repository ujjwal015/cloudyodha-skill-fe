import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
} from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import Banner from "../../auth/Banner";
// import { studentLoginTokenApi } from "../../../api/studentApi";
import "../login/style.css";
import { studentLoginTokenApi } from "../../../api/studentApi";

const TokenLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);
  const [deviceName, setDeviceName] = useState(null);
  const [allowedBrowser, setAllowedBrowser] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("No authentication token found. Please use a valid login link.");
      setLoading(false);
      return;
    }

    const loginWithToken = async () => {
      try {
        dispatch(
          studentLoginTokenApi(
            { token },
            setLoading,
            setError,
            setIsBrowserSupported,
            navigate,
            allowedBrowser,
            setAllowedBrowser,
            setDeviceName
          )
        );
      } catch (err) {
        setError("An error occurred during login. Please try again later.");
        setLoading(false);
      }
    };

    loginWithToken();
  }, [dispatch, location.search, navigate, allowedBrowser]);

  return (
    <div className="login-container">
      <Banner />
      <div className="login-form-container">
        <div>
          <div className="form-wrapper">
            <div className="text-wrapper">
              <p className="welcome-text">Welcome Student👋</p>
              <h4 className="login-text">Logging you in... </h4>
            </div>

            {error && (
              <div className="error-box">
                <p className="error-text">{error}</p>
              </div>
            )}

            {isBrowserSupported && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  justifyItems: "center",
                  alignItems: "center",
                  marginTop: "10px",
                  gap: "15px",
                  boxSizing: "border-box",
                }}
              >
                {allowedBrowser?.map((browser) => (
                  <div key={browser.browser}>
                    <h3>
                      {browser.browser === "Microsoft Edge"
                        ? "Edge"
                        : browser.browser}
                    </h3>
                    <div style={{ textAlign: "center" }}>
                      <a
                        href={browser.deviceLinks[deviceName]}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <img
                          src={browser.image}
                          alt={`${browser.browser} logo`}
                          style={{
                            width: "30px",
                            height: "auto",
                            cursor: "pointer",
                          }}
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="form" style={{ textAlign: "center" }}>
              {loading ? (
                <PulseLoader size="15px" color="#2EA8DB" />
              ) : (
                <div>
                  {!error && !isBrowserSupported && (
                    <p>
                      Your login was successful. You will be redirected shortly.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenLogin;
