import React, { useEffect, useState } from "react";
import "./style.css";
import BackIcon from "../../../../../assets/icons/back-arrow.svg";
import FirstImg from "../../../../../assets/images/pages/examManagement/first-img.png";
import SecondImg from "../../../../../assets/images/pages/examManagement/second-img.png";
import ThirdImg from "../../../../../assets/images/pages/examManagement/Third-img.png";
import FourthImg from "../../../../../assets/images/pages/examManagement/Fourth-img.png";
import StopBtn from "../../../../../assets/images/pages/examManagement/stop-button.png";
import PauseBtn from "../../../../../assets/images/pages/examManagement/video-pause-button.png";
import CustomPagination from "../../../../../components/common/customPagination";
import { useNavigate, useParams } from "react-router-dom";
import {
  SUPER_ADMIN_BATCH_LIST_PAGE,
  SUPER_ADMIN_LIVE_MONITORING__CANDIDATE_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";

export default function LiveMonitoring() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const page = Math.ceil(liveMonitoringArr.length / limit);
    setTotalPages(page);
  }, []);
  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
    const val =
      event.target.value > liveMonitoringArr.length
        ? liveMonitoringArr.length
        : event.target.value;
    const page = Math.ceil(liveMonitoringArr.length / val);
    setTotalPages(page);
  };

  const start = (page - 1) * limit;
  const end = page * limit;
  return (
    <div className="main-content">
      <div className="batch-id-header-container">
        <div className="back-arrow-container">
          <div
            className="back-arrow"
            onClick={() => navigate(SUPER_ADMIN_BATCH_LIST_PAGE)}
          >
            <img src={BackIcon} alt="backIcon" />
          </div>
          <div className="batch-id-title">Batch ID : 268341</div>
        </div>
        <div className="duration-container">
          <div className="duration-title">
            <p>Duration :</p>
            <span>60min</span>
          </div>
          <div className="candidate-title">
            <p>Total Candidates : </p>
            <span>24</span>
          </div>
        </div>
      </div>
      <div className="live-monitoring-container">
        <div className="live-monitoring-heading">
          <div className="live-monitoring-text">
            <p>Live Monitoring</p>
          </div>
        </div>
        <div className="all-image-container">
          <div className="first-all-image-container">
            {liveMonitoringArr?.slice(start, end)?.map((item) => (
              <div
                key={item?.id}
                className="first-image-wrapper"
                onClick={() =>
                  navigate(`${SUPER_ADMIN_LIVE_MONITORING__CANDIDATE_PAGE}/${id}`)
                }
              >
                <div className="first-image">
                  <img
                    src={item?.src}
                    alt="first-image"
                    className="user-image"
                  />
                  <div className="top-corner">
                    <p>10</p>
                  </div>
                  <div className="right-corner">
                    <p>Live</p>
                    <div></div>
                  </div>
                  <div className="bottom-left-corner">
                    <div className="bottom-text">
                      <p>Aditya Narayan</p>
                    </div>
                    <div className="bottom-right-icon">
                      <img src={StopBtn} alt="stop btn" className="stop-btn" />
                      <img
                        src={PauseBtn}
                        alt="pause btn"
                        className="pause-btn"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pagination-container">
          <CustomPagination
            count={totalPages}
            page={page}
            limit={limit}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
}

const liveMonitoringArr = [
  {
    id: 1,
    src: FirstImg,
  },
  {
    id: 2,
    src: SecondImg,
  },
  {
    id: 3,
    src: ThirdImg,
  },
  {
    id: 4,
    src: FourthImg,
  },
  {
    id: 5,
    src: FourthImg,
  },
  {
    id: 6,
    src: ThirdImg,
  },
  {
    id: 7,
    src: FirstImg,
  },
  {
    id: 8,
    src: SecondImg,
  },
  {
    id: 9,
    src: SecondImg,
  },
  {
    id: 10,
    src: FirstImg,
  },
  {
    id: 11,
    src: FourthImg,
  },
  {
    id: 12,
    src: ThirdImg,
  },
];
