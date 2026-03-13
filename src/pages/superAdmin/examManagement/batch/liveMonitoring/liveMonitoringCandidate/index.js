import React from "react";
import "./style.css";
import studentImg from "../../../../../../assets/images/pages/examManagement/first-img.png";
import cameraIcon from "../../../../../../assets/images/pages/examManagement/camera.png";
import pauseIcon from "../../../../../../assets/images/pages/examManagement/pause.png";
import stopIcon from "../../../../../../assets/images/pages/examManagement/stop-btn.png";
export default function LiveMonitoringCandidate() {
  return (
    <div className="main-content">
      <div className="batch-id-header-container">
        <div className="candidate-name">Aditya Narayan</div>
        <div className="duration-title">
          <p>Duration :</p>
          <span>60min</span>
        </div>
      </div>
      <div className="candidate-live-monitoring-container">
        <div className="candidate-live-monitoring-heading">
          <div className="candidate-live-monitoring-text">
            <p>Live Monitoring</p>
          </div>
        </div>
        <div className="candidate-status-container">
          <div className="face-status">
            <div className="face-status-heading">
              <p>Face Status</p>
              <h3>Normal</h3>
            </div>
          </div>
          <div className="browser-status">
            <div className="browser-status-heading">
              <p>Browser Proctoring</p>
              <h3>Suspicious</h3>
            </div>
          </div>
          <div className="browser-status">
            <div className="browser-status-heading">
              <p>Video Proctoring</p>
              <h3>Suspicious</h3>
            </div>
          </div>
          <div className="browser-status">
            <div className="browser-status-heading">
              <p>Red Flag Alert</p>
              <h3>Suspicious</h3>
            </div>
          </div>
        </div>
        <div className="test-control-container">
          <div className="test-control-image">
            <img src={studentImg} alt="candidate-img" />
            <div className="text-live-test">
              <p>Live</p>
              <div></div>
            </div>
            <div className="bottom-all-icons">
              <div className="all-icons">
                <img src={cameraIcon} alt="camera-icon" />
                <p>Screenshot</p>
              </div>
              <div className="all-icons">
                <img src={pauseIcon} alt="pause-icon" />
                <p>Pause Test</p>
              </div>
              <div className="all-icons">
                <img src={stopIcon} alt="stop-icon" />
                <p>End Test</p>
              </div>
            </div>
          </div>
          <div className="candidate-details-container">
            <div className="candidate-header">
              <p>Student Details</p>
            </div>
            <div className="candidate-details">
              <p>Login Time : 12:45, 27th Sep 2023</p>
              <p>Browser: Chrome 75.03770.342</p>
              <p>Operating System : Windows 10</p>
              <div className="activity-status">
                <p className="time">01:41PM</p>
                <p className="status">Candidate Internet Connection Restored</p>
              </div>
              <div className="activity-status">
                <p className="time">01:40PM</p>
                <p className="status">Candidate Internet Connection Restored</p>
              </div>
              <div className="activity-status">
                <p className="time">01:38PM</p>
                <p className="status">Away from test window</p>
              </div>
              <div className="activity-status">
                <p className="time">01:38PM</p>
                <p className="status">Candidate face not visible</p>
              </div>
            </div>
          </div>
        </div>
        <div className="candidate-screenshots-container">
          <p>Candidate Screenshots</p>
          <div className="screenshot-img">
            <div className="screenshot-images">
              <img src={studentImg} alt="screenshots" />
            </div>
            <div className="screenshot-images">
              <img src={studentImg} alt="screenshots" />
            </div>
            <div className="screenshot-images">
              <img src={studentImg} alt="screenshots" />
            </div>
            <div className="screenshot-images">
              <img src={studentImg} alt="screenshots" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
