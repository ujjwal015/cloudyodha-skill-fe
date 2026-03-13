import React, { useEffect, useState } from "react";
import "./newProfile.css";
import Avatar from "../../../../assets/images/pages/userProfile/dummy-user-profile.png";
import { ReactComponent as Desig } from "../../../../assets/images/pages/userProfile/Vector.svg";
import { ReactComponent as Email } from "../../../../assets/images/pages/userProfile/mdi_email-outline.svg";
import { ReactComponent as Phone } from "../../../../assets/images/pages/userProfile/tdesign_call.svg";
import { ReactComponent as Location } from "../../../../assets/images/pages/userProfile/tdesign_location.svg";
import { ReactComponent as Edit } from "../../../../assets/images/pages/userProfile/Icon.svg";
import BasicTabs from "./tab.js";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../../redux/slicers/authSlice.js";
import { deleteProfileImageApi, updateProfileImageApi } from "../../../../api/authApi.js";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
function NewMyProfile({
  userInfo,
  getUserProfile,
  userId,
  setImgURL,
  imageURL,
  setUserId,
}) {
  const dispatch = useDispatch();
  const { getProfileDetails = {} } = useSelector(authSelector);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({});
  const [isHover, setIsHover] = useState(false);

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} arrow />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: "12px",
      padding: "8px 12px",
    },
  });

  useEffect(() => {
    setUserData(getProfileDetails);
  }, [getProfileDetails]);

  const handleUpload = (event) => {
    if (event.type === "click") {
      document.getElementById("file-upload").click();
    } else if (event.type === "change") {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImgURL(imageUrl);
        const payload = { isProfilePicUploaded: true, userPhoto: file };

        dispatch(
          updateProfileImageApi(
            userId,
            payload,
            setLoading,
            setErrors,
            setImgURL
          )
        );
      }
    }
  };

  const handleDelete=()=>{
      dispatch(
          deleteProfileImageApi(
            userId,
            setLoading,
            setErrors,
            setImgURL
          )
        );
  }
  return (
    <div className="main_container">
      <div className="details_section">
        <div
          className="profile_pic"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <img
            src={imageURL || Avatar}
            alt="profile_photo"
            className="profilePic"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = Avatar; 
            }}
          />
          {isHover && (
            <div style={{display:'flex',flexDirection:'row',width:"50px"}}>
              <div
                className="upload_icon"
                onClick={handleUpload}
                title="Upload Profile Picture"
              >
                <Edit />
              </div>
              <div
                className="delete_icon"
                onClick={handleDelete}
                title="Upload Profile Picture"
              >
                <DeleteOutlineIcon/>
              </div>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleUpload}
          />
        </div>
        <div className="profile_description">
          <div className="name_container">
            <h3>{`${userData?.firstName} ${userData?.lastName}`}</h3>
            {/* <Edit /> */}
          </div>
          <hr />
          <div className="designation_bedge">
            <div className="details_group">
              <Desig />
              <p>{userData?.designation || "NA"}</p>
            </div>
            <div className="details_group">
              <Email />
              <p>{userData?.email || "NA"}</p>
            </div>
            <div className="details_group">
              <Phone />
              <p>+91 {userData?.mobile || "NA"}</p>
            </div>
            <div className="details_group">
              <Location />
              <p>
                {userData?.currentAddress?.city},{" "}
                {userData?.currentAddress?.state}
              </p>
            </div>
          </div>
          <div className="roles_details">
            <div className="role_items">
              <h6>ROLE</h6>
              <p>
                {userData?.userRole?.["0"]?.userRoleName || "NA"}
                &nbsp;
                {userData?.userRole?.length > 1 ? (
                  <CustomWidthTooltip
                    title={userData?.userRole
                      ?.slice(1, userData?.userRole?.length)
                      ?.map((roleName) => roleName?.userRoleName)
                      .join(",")}
                  >
                    <Chip
                      label={`+${userData?.userRole?.length - 1}`}
                      size="small"
                      sx={{
                        fontFamily: "'Inter'",
                        color: "#231F20",
                        backgroundColor: "#9ba6b8c4",
                        fontWeight: 600,
                        fontSize: 10,
                        width: 22,
                        height: 22,
                        cursor: "pointer",
                        "& span": {
                          padding: 0,
                        },
                      }}
                    />
                  </CustomWidthTooltip>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div className="role_items">
              <h6>REPORTING MANAGER</h6>
              <div className="reporting_manager">
                <img src={Avatar} alt="reporting_manager" />
                <p>
                  {userData?.reportinManager?.firstName || "NA"}{" "}
                  {userData?.reportinManager?.lastName || "NA"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: "100%", boxSizing: "border-box" }}>
        <BasicTabs
          basicDetails={userData}
          getUserProfile={getUserProfile}
          userId={userId}
        />
      </div>
    </div>
  );
}

export default NewMyProfile;
