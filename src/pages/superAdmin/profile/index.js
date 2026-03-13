import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import PulseLoader from "react-spinners/PulseLoader";

import { Button } from "@mui/material";

import UserProfile from "../../../assets/images/pages/userManagement/msd_profile-pic.jpg";
import { SUPER_ADMIN_MY_ACCOUNT_PAGE } from "../../../config/constants/routePathConstants/superAdmin";
import { getUserDetails } from "../../../utils/projectHelper";
import { authSelector } from "../../../redux/slicers/authSlice";
import { getUserProfileApi } from "../../../api/authApi";
import Avatar from "../../../assets/images/pages/userProfile/dummy-user-profile.png";
import NewMyProfile from "./newProfile";
// import NewMyProfile from "./newProfile/index.js";
const initialFormValues = {
  firstName: "",
  lastName: "",
  gender: "",
  mobile: "",
  email: "",
  address: "",
  country: "",
  state: "",
  ProfileUrl: "",
};

const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo = {} } = useSelector(authSelector);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [userId, setUserId] = useState("");
  const [imageURL, setImgURL] = useState();

  const { _id = "" } = getUserDetails();
  const { id } = useParams();
  const getUserProfile = () => {
    setLoading(true);
    dispatch(
      getUserProfileApi(_id, setUserId, setLoading, setImgURL)
    );
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleSubmit = () => {
    navigate(`${SUPER_ADMIN_MY_ACCOUNT_PAGE}/${_id}`);
  };
  const fullName = formValues?.firstName + " " + formValues?.lastName;

  return (
    <>
      <NewMyProfile
        userInfo={userInfo}
        getUserProfile={getUserProfile}
        userId={_id}
        setImgURL={setImgURL}
        imageURL={imageURL}
      />
    </>
    // <div className="main-content">
    //   <NewMyProfile />
    //   {/* <div className="title">
    //     <h1>
    //       <span>My Profile</span>
    //     </h1>
    //   </div>
    //   <section className="sub-admin-wrapper">
    //     <div className="tab-content">
    //       <div className="form_title">
    //         <h1> Profile </h1>
    //         <p>Update your photo and personal details here.</p>
    //       </div>
    //       <div className="profile">
    //         <div className="profile-wrapper">
    //           <div className="profile-list-wrap">
    //             <div className="profile-list">
    //               <span className="profile-label">First Name</span>
    //               <span className="input-text">{formValues?.firstName || "NA"}</span>
    //             </div>
    //             <div className="profile-list">
    //               <span className="profile-label">Last Name </span>
    //               <span className="input-text">{formValues?.lastName || "NA"}</span>
    //             </div>
    //             <div className="profile-list">
    //               <span className="profile-label">Gender</span>
    //               <span className="input-text">{formValues?.gender || "NA"}</span>
    //             </div>
    //             <div className="profile-list">
    //               <span className="profile-label">Mobile No. </span>
    //               <span className="input-text">{formValues?.mobile || "NA"}</span>
    //             </div>

    //             <div className="profile-list">
    //               <span className="profile-label">Email ID</span>
    //               <span className="input-text">{formValues?.email || "NA"}</span>
    //             </div>
    //             <div className="profile-list">
    //               <span className="profile-label">Address </span>
    //               <span className="input-text">{formValues?.address || "NA"}</span>
    //             </div>

    //             <div className="profile-list">
    //               <span className="profile-label">Country</span>
    //               <span className="input-text">{formValues?.country || "NA"}</span>
    //             </div>

    //             <div className="profile-list">
    //               <span className="profile-label">State</span>
    //               <span className="input-text">{formValues?.state || "NA"}</span>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="img-wrapper">
    //           <div className="img-upload">
    //             <div className="img_container">
    //               <img
    //                 src={formValues?.ProfileUrl}
    //                 onError={({ currentTarget }) => {
    //                   currentTarget.onerror = null; // prevents looping
    //                   currentTarget.src = Avatar;
    //                 }}
    //                 alt="profile-pic"
    //               />
    //             </div>
    //             <span className="user_name">{fullName || "NA"}</span>
    //             <span className="user_role">
    //               {userInfo?.userRole !== 1 ? "Super Admin" : userInfo?.userRole !== 1 ? "Admin" : "NA"}
    //             </span>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="action-btn_userProfile">
    //         <button
    //           className={`light-blue-btn submit-btn`}
    //           variant="contained"
    //           onClick={handleSubmit}
    //           disabled={loading ? true : false}
    //         >
    //           {loading ? <PulseLoader size="10px" color="white" /> : "Edit Profile"}
    //         </button>
    //       </div>
    //     </div>
    //   </section> */}
    // </div>
  );
};

export default MyProfile;
