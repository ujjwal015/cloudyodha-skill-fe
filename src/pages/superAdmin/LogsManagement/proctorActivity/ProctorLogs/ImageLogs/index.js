/* eslint-disable no-useless-concat */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "../../../../userManagement/AssessorList/style.css"
import "./../style.css";

import "../../../../../../components/common/table/style.css";
import {
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH,
  LOGS_MANAGEMENT_PROCTOR_IMAGE_BY_CANDIDATE_PATH,
  LOGS_MANAGEMENT_PROCTOR_VIDEO_BY_CANDIDATE_PATH,
} from "../../../../../../config/constants/routePathConstants/superAdmin";
import { batch, useDispatch } from "react-redux";
import { getSuspiciousImageActivityApi } from "../../../../../../api/superAdminApi/suspicousActivityManagementApi";
import { retriveMatchedWithPath } from "../../../../../../utils/projectHelper";
import { ReactComponent as ArrowLeft } from "./../../../../../../assets/icons/chevron-left.svg";
import NoDataImg from "../../../../../../assets/images/common/No-data-found 2.png";

const SuspiciousImageList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { batchId, candidateId } = useParams();
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);

  // const activeTab = retriveMatchedWithPath(pathname, /image/g);

  const handleActive = (tab) => {
    navigate(
      tab === "image"
        ? `${LOGS_MANAGEMENT_PROCTOR_IMAGE_BY_CANDIDATE_PATH}/${batchId}/${candidateId}`
        : `${LOGS_MANAGEMENT_PROCTOR_VIDEO_BY_CANDIDATE_PATH}/${batchId}/${candidateId}`,
    );
  };

  useEffect(() => {
    dispatch(getSuspiciousImageActivityApi(setLoading, candidateId, setImageList));
  }, []);

  const handleNavigateProctoring = () => {
    navigate(`${LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_CANDIDATE_BY_BATCH_LIST_PATH}/${batchId}`);
  };
  return (
    <>
      <div className="main-content">
        <div className="client-image-header">
          <div className="client-title">
            <div className="client-title-text">
              <ArrowLeft width={16} onClick={handleNavigateProctoring} />
              <h2>{imageList?.candidateName}</h2>
            </div>
            <div className="client-title-time">
              <h3>
                Duration : <span>{imageList?.examDuration ?? 0} min</span>
              </h3>
            </div>
          </div>
        </div>

        <div className="subadmin-table">
          <div className="proctor-wrapper">
            {/* <div className="scheme-tab">
              <button className={activeTab === "image" ? "active" : "scheme-btn"} onClick={() => handleActive("image")}>
                Image Proctoring
              </button>
              <button className={activeTab === "video" ? "active" : "scheme-btn"} onClick={() => handleActive("video")}>
                Video Proctoring
              </button>
            </div> */}
            <div className="proctor-wrapper__ele">
              {imageList?.imageUrls?.length > 0 ? (
                imageList.imageUrls.map((item) => (
                  <div className="proctor__element">
                    <img src={item?.url} alt="image" width={"100%"} height={"100%"} />
                  </div>
                ))
              ) : (
                <div className="notfound-component">
                  <img width={100} src={NoDataImg} />
                  <h6>No Data Found !</h6>
                  <p>we’ll notify you when there is something new.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuspiciousImageList;
