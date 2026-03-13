import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Button, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Banner from "../../auth/Banner";
import { studentLoginApi } from "../../../api/studentApi";
import PulseLoader from "react-spinners/PulseLoader";
import Input from "./../../../components/common/input";
import safari from "../../../assets/icons/safari.svg";
import chrome from "../../../assets/icons/google_chrome.svg";
import edge from "../../../assets/icons/microsoft-edge.svg";
import opera from "../../../assets/icons/opera.svg";
import firefox from "../../../assets/icons/firefox.svg";
import { ReactComponent as Logo } from "../../../assets/images/common/TestaLogo.svg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({ userName: "", password: "" });
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);
  const [deviceName, setDeviceName] = useState(null);
  const [allowedBrowser, setAllowedBrowser] = useState([
    {
      browser: "Chrome",
      deviceLinks: {
        Windows: "https://www.google.com/intl/en_in/chrome/",
        Android:
          "https://play.google.com/store/apps/details?id=com.android.chrome&hl=en_IN",
        iOS: "https://apps.apple.com/us/app/google-chrome/id535886823",
      },
      image: chrome,
    },
    {
      browser: "Safari",
      deviceLinks: {
        Windows: "https://www.apple.com/in/safari/",
        Android: "https://apps.apple.com/us/app/safari/id1146562112",
        iOS: "https://apps.apple.com/us/app/safari/id1146562112",
      },
      image: safari,
    },
    {
      browser: "Edge",
      deviceLinks: {
        Windows: "https://www.microsoft.com/en-us/edge/download?form=MA13FJ",
        Android:
          "https://play.google.com/store/apps/details?id=com.microsoft.emmx",
        iOS: "https://apps.apple.com/us/app/microsoft-edge-ai-browser/id1288723196",
      },
      image: edge,
    },
    {
      browser: "Firefox",
      deviceLinks: {
        Windows: "https://www.mozilla.org/en-US/firefox/new/",
        Android:
          "https://play.google.com/store/apps/details?id=org.mozilla.firefox",
        iOS: "https://apps.apple.com/us/app/firefox-private-safe-browser/id989804926",
      },
      image: firefox,
    },
    {
      browser: "Opera",
      deviceLinks: {
        Windows: "https://www.opera.com/browsers/opera",
        Android:
          "https://play.google.com/store/apps/details?id=com.opera.browser",
        iOS: "https://apps.apple.com/us/app/opera-ai-browser-with-vpn/id1411869974",
      },
      image: opera,
    },
  ]);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    const filteredBrowsers = allowedBrowser.filter((browser) => {
      if (
        (deviceName === "Windows" || deviceName === "Android") &&
        browser.browser === "Safari"
      ) {
        return false;
      }
      return true;
    });

    setAllowedBrowser(filteredBrowsers);
  }, [deviceName]);

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = "";

    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formErrors = {};
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = "";
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const formData = {
        ...formValues,
      };
      dispatch(
        studentLoginApi(
          formData,
          setLoading,
          setErr,
          setIsBrowserSupported,
          navigate,
          allowedBrowser,
          setAllowedBrowser,
          setDeviceName
          // true
        )
      );
    }
  };

  const renderDesktopView = () => (
    <div className="login-container">
      <Banner />
      <div className="login-form-container">
        <div className="form-wrapper">
          <div className="text-wrapper">
            <p className="welcome-text">Welcome Student👋</p>
            <h4 className="login-text">Login to your account</h4>
            <p className="credential-text">
              Please enter your credentials to login
            </p>
          </div>

          {err && (
            <div className="error-box">
              <p className="error-text">{err}</p>
            </div>
          )}
          {isBrowserSupported && (
            <div className="browser-support">
              {allowedBrowser?.map((browser) => (
                <div key={browser.browser} className="browser-item">
                  <h3>
                    {browser.browser === "Microsoft Edge"
                      ? "Edge"
                      : browser.browser}
                  </h3>
                  <div>
                    <a
                      href={browser.deviceLinks[deviceName]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={browser.image}
                        alt={`${browser.browser} logo`}
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <Input
                  label="Username"
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  onFocus={focusHandler}
                  error={errors?.email}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.userName}
                />
              </div>
              <div className="form-group">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your Password"
                  onFocus={focusHandler}
                  error={errors?.password}
                  onBlur={blurHandler}
                  onChange={changeHandler}
                  value={formValues?.password}
                  endAdornment={
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                />
              </div>
              <Button
                className="light-blue-btn"
                variant="contained"
                disabled={
                  formValues?.userName === "" && formValues?.password === ""
                }
                onClick={handleSubmit}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="mobile-login-container">
      <div className="mobile-header">
        <Logo className="mobile-logo" />
        <p className="mobile-title">
          Unleash Your Potential with Modernized Skill Assessments
        </p>
        <p className="mobile-subtitle">
          Testa offers an AI-Driven Online Assessment Plateform for corporates,
          higher educational institutes, and government organizations.
        </p>
      </div>
      <div className="mobile-login-form">
        <div className="form-header">
          <p className="welcome-text">Welcome Student👋</p>
          <h2 className="login-text">Login to your account</h2>
        </div>
        {err && (
          <div className="error-box">
            <p className="error-text">{err}</p>
          </div>
        )}
        {isBrowserSupported && (
          <div className="browser-support">
            {allowedBrowser?.map((browser) => (
              <div key={browser.browser} className="browser-item">
                <h3>
                  {browser.browser === "Microsoft Edge"
                    ? "Edge"
                    : browser.browser}
                </h3>
                <div>
                  <a
                    href={browser.deviceLinks[deviceName]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={browser.image} alt={`${browser.browser} logo`} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              label="Username"
              type="text"
              name="userName"
              placeholder="Enter your username"
              onFocus={focusHandler}
              error={errors?.email}
              onBlur={blurHandler}
              onChange={changeHandler}
              value={formValues?.userName}
            />
          </div>
          <div className="form-group">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your Password"
              onFocus={focusHandler}
              error={errors?.password}
              onBlur={blurHandler}
              onChange={changeHandler}
              value={formValues?.password}
              endAdornment={
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
          </div>
          <Button
            className="submit-btn"
            variant="contained"
            disabled={
              formValues?.userName === "" && formValues?.password === ""
            }
            onClick={handleSubmit}
          >
            {loading ? <PulseLoader size="10px" color="white" /> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {renderDesktopView()}
      {renderMobileView()}
    </>
  );
};

export default Login;
