import React, { useRef, useState } from "react";
import "./style.css";
import "../../../../../styles/main.css";
import Logo from "../../../../../assets/images/common/TestaLogo.svg";
// import Logo from "../../../../../assets/images/common/Testa blue1.webp";
import { ReactComponent as BellIcon } from "../../../../../assets/new-icons/bell.svg";
import { ReactComponent as UserIcon } from "../../../../../assets/icons/userIcon.svg";
import { ReactComponent as Setting } from "../../../../../assets/new-icons/settings.svg";
import { ReactComponent as LogOut } from "../../../../../assets/new-icons/power.svg";
import { ReactComponent as DownArrow } from "../../../../../assets/icons/down-arrow.svg";
import dummyUser from "../../../../../assets/images/pages/admin/dummy-notify-user.png";
import {
  capitalizeFunc,
  getIP,
  getLocation,
  getUserDetails,
  getUserType,
} from "../../../../../utils/projectHelper";
import { useNavigate } from "react-router-dom";
import {
  SUPER_ADMIN_DASHBOARD_PAGE,
  SUPER_ADMIN_MY_ACCOUNT_PAGE,
  SUPER_ADMIN_MY_PROFILE_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { logoutFromDeviceApi } from "../../../../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import {
  activitySelector,
  setMenu,
  setProfileDropdown,
} from "../../../../../redux/slicers/activitySlice";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { useEffect } from "react";
import UserTour from "../UserTour/index";
import { Button } from "@mui/material";
import AvatarImg from "../../../../../assets/images/pages/userProfile/dummy-user-profile.png";
import NameAvatars from "./nameAvtar";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profileDropdown } = useSelector(activitySelector);
  const { userInfo = {}, profileImageUrl = null } = useSelector(authSelector);
  const { _id = "", deviceId = "" } = getUserDetails();

  const {
    userType = 1,
    firstName = "",
    lastName = "",
    isTourComplete,
    // ProfileUrl,
  } = userInfo;

  const [profilePic, setProfilePic] = useState(null);
  const fullName = firstName + " " + lastName;

  const handleLogout = async () => {
    const [geolocation, userIp] = await Promise.all([getLocation(), getIP()]);

    const formData = {
      userId: _id,
      isAllLogout: false,
      deviceId: deviceId,
      addreiss: userIp,
      latitude: geolocation.latitude,
      longitude: geolocation.longitude,
      isSimpleLogOut: true,
    };

    dispatch(logoutFromDeviceApi(formData));
    dispatch(setProfileDropdown(false));
  };
  const isDropDownOpen = isTourComplete
    ? profileDropdown
      ? "block"
      : "none"
    : "block";

  const handleMenu = () => {
    dispatch(setMenu(true));
  };

  const menuState = useSelector(activitySelector);

  const handleDropdown = (pathname) => {
    navigate(pathname);
    dispatch(setProfileDropdown(false));
  };

  useEffect(() => {
    setProfilePic(profileImageUrl);
  }, [profileImageUrl]);

  const handleNaviagteToProfilePage = () => {
    navigate(SUPER_ADMIN_MY_PROFILE_PAGE);
  };

  return (
    <>
      <UserTour userInfo={userInfo} />
      <nav onClick={() => dispatch(setProfileDropdown(false))}>
        <div className="dashboard-nav">
          <div
            className="logo"
            onClick={() => navigate(SUPER_ADMIN_DASHBOARD_PAGE)}
          >
            <img
              src={Logo}
              alt="logo"
              height="50"
              width="200"
              loading="lazy"
              fetchpriority="high"
              decoding="async"
            />
          </div>

          <div className="right-nav">
            {/* <NotifyDropdown open={open} setOpen={setOpen} /> */}
            <span
              style={{ display: "flex", alignItems: "center" }}
              id="admin-profile"
            >
              {profilePic ? (
                <div className="profile-img-wrapper">
                  <img
                    src={profilePic}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = AvatarImg;
                    }}
                    alt="profile"
                    onClick={handleNaviagteToProfilePage}
                  />
                </div>
              ) : (
                <NameAvatars
                  firstName={firstName}
                  lastName={lastName}
                  handleClick={handleNaviagteToProfilePage}
                />
              )}

              <div
                className="dropdown"
                onClick={(e) => e.stopPropagation()}
                style={{ position: "relative" }}
              >
                <p
                  onClick={() => dispatch(setProfileDropdown(!profileDropdown))}
                >
                  {capitalizeFunc(fullName)}
                  <span>
                    <DownArrow />
                  </span>
                </p>
                <div
                  className="dropdown-options"
                  id="drop-down"
                  style={{ display: isDropDownOpen }}
                >
                  <div className="option">
                    <p className="check-admin">{getUserType(userType)}</p>
                    <p
                      onClick={() =>
                        handleDropdown(SUPER_ADMIN_MY_PROFILE_PAGE)
                      }
                    >
                      <span>
                        <UserIcon />
                      </span>
                      My Profile
                    </p>
                    <p
                      onClick={() =>
                        handleDropdown(`${SUPER_ADMIN_MY_ACCOUNT_PAGE}/${_id}`)
                      }
                    >
                      <span>
                        <Setting />
                      </span>
                      Settings
                    </p>

                    <p onClick={handleLogout}>
                      <span>
                        <LogOut />
                      </span>
                      Log out
                    </p>
                  </div>
                </div>
              </div>
              <div className="menu-box">
                <button className="hamburger-menu" onClick={handleMenu}>
                  ☰
                </button>
              </div>
            </span>
          </div>
        </div>
        <div
          id="overlay"
          style={{ display: menuState.isMenuOpen ? "block" : "" }}
        ></div>
      </nav>
    </>
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
              <div className="img">
                <img src={dummyUser} />
              </div>
              <div className="info">
                <h5>Ajay Kumar Joined the Team?</h5>
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
