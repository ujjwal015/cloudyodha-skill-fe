import React, { useEffect, useRef } from "react";
import "./style.css";
import Logo from "../../../../../assets/images/common/Main_Logo.svg";
import Logo_white from "../../../../../assets/images/pages/student/header/logo_1.svg";
import { ReactComponent as BellIcon } from "../../../../../assets/icons/bell-icon.svg";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { ReactComponent as Logout } from "../../../../../assets/images/pages/student/registrationDetails/power.svg";
import { ReactComponent as DownArrow } from "../../../../../assets/icons/down-arrow.svg";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  STUDENT_BASIC_INFORMATION,
  STUDENT_DETAILS_PAGE,
  STUDENT_FACE_CAPTURE,
  STUDENT_FEEDBACK_PAGE,
  STUDENT_GENERAL_INSTRUCTIONS,
  STUDENT_ID_CAPTURE,
} from "../../../../../config/constants/routePathConstants/student";
import {
  LogOutStudentApi,
  changeExamLanguageApi,
  submitTestApi,
} from "../../../../../api/studentApi";
import StudentName from "./nameAvtar";
import speaker_icon from "../../../../../assets/images/pages/student/header/speacker_icon.png";
import TextToSpeech from "./text-to-speech";
import {
  setLayoutBackgroundColor,
  studentSelector,
} from "../../../../../redux/slicers/studentSlice";
import ColorHeader from "./contrast color";
import FontSizeAdjuster from "./fontAdjust";

const NavBar = ({ role = "guest" }) => {
  const navigate = useNavigate();
  const { userInfo = {} } = useSelector(authSelector);
  const { layoutColor = {} } = useSelector(studentSelector);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [examLanguage, setExamLanguage] = useState("Choose-Language");

  const fullName = userInfo?.name;
  const dispatch = useDispatch();
  const location = useLocation();
  const batchId = userInfo?.assessment?.batch_id;
  console.log(userInfo?.batchDetails?.colorAndTTSEnabled)
  const candidateId = userInfo?._id;
  const params = useParams();
  const { questionId } = params;
  const isQuestionPage = location.pathname.includes("/assessment");

  const handleLogout = (e) => {
    setLoading(true);
    setProfileDropdown(false);
    dispatch(LogOutStudentApi(setLoading, navigate));
  };

  const handlesubmit = () => {
    setLoading(true);
    const navigatePath = `${STUDENT_FEEDBACK_PAGE}/${batchId}/${candidateId}`;
    dispatch(
      submitTestApi(batchId, candidateId, setLoading, navigate, navigatePath)
    );
  };

  const changeExamLanguage = (formData) => {
    dispatch(
      changeExamLanguageApi(
        formData,
        batchId,
        candidateId,
        questionId,
        isQuestionPage,
        setLoading
      )
    );
  };

  const handleExamLanguageChange = (event) => {
    setExamLanguage(event.target.value);
    const formData = {
      secondaryLanguage: event.target.value,
    };
    changeExamLanguage(formData);
  };

  const handleBackgroundColor = () => {
    dispatch(setLayoutBackgroundColor({}));
  };

  const logo = layoutColor.bgColor==="#1ab6f7"?Logo_white:Logo
  return (
    <nav
      style={{
        backgroundColor: `${layoutColor.bgColor}`,
        color: `${layoutColor.textColor}`,
      }}
    >
      <div className="user-nav">
        <div
          className="logo"
          // onClick={logoHandler}
        >
          <img src={logo} alt="logo" />
        </div>

        {userInfo?.name && (
          <div className="right-nav">
            {/* <NotifyDropdown open={open} setOpen={setOpen} /> */}

            {isQuestionPage && userInfo?.batchDetails?.colorAndTTSEnabled &&(
              <>
                <FontSizeAdjuster />
                <ColorHeader />
                <TextToSpeech />
              </>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {/* <div className="profile-img">
              <img src={profile} alt="profile" />
            </div> */}

              <div className="profile-img-wrapper">
                {/* <img src={UserPic} alt="profile" onClick={() => ""} height="30px" /> */}
                {<StudentName />}
              </div>
              {userInfo && (
                <>
                  <div
                    className="dropdown"
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: "relative" }}
                  >
                    <p onClick={() => setProfileDropdown(!profileDropdown)}>
                      {fullName}

                      <span>
                        <DownArrow />
                      </span>
                    </p>

                    <div
                      className="dropdown-options"
                      id="drop-down"
                      style={{ display: profileDropdown ? "block" : "none" }}
                    >
                      <ul className="option">
                        <li onClick={handleLogout}>
                          <span>
                            <Logout />
                          </span>
                          Log out
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

export const NotifyDropdown = ({ setOpen, open }) => {
  // close more option popup
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="notification-wrapper">
      <BellIcon
        id="bell-icon"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
        className="bell-icon"
        ref={ref}
      />

      <div
        className="notification-dropdown"
        style={{ display: open ? "block" : "none" }}
      >
        <div className="title-wrapper">
          <h6 className="title">Notifications</h6>
          <span>10 new</span>
        </div>
        <ul className="notification-lists">
          {[1, 2, 3, 4, 5]?.map((item) => (
            <li key={item}>
              <div className="img">{/* <img src={dummyUser} /> */}</div>
              <div className="info">
                <h5>John Joined the Team?</h5>
                <p>Congratulations him</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="see-all">
          <Button variant="outlined">See All Notifications</Button>
        </div>
      </div>
    </div>
  );
};
