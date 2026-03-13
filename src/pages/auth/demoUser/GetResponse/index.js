import React from "react";
import "./style.css";
import { ReactComponent as ThankyouImg } from "../../../../assets/images/common/ThankyouImg.svg";
import { ReactComponent as ResponseArrowImg } from "../../../../assets/images/common/responseArrow.svg";
// import { ReactComponent as Logo } from "../../../../assets/images/common/Logo.svg";
import { useNavigate } from "react-router-dom";
import { SIGNIN, GET_DEMO } from "../../../../config/constants/routePathConstants/auth";

export default function GetResponse() {
    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate(SIGNIN);
    };

    const renderDesktopView = () => (
        <div className="login-container">
            <div className="login-banner">
                <ThankyouImg
                    style={{
                        width: "100%",
                        margin: "auto",
                        boxSizing: "border-box",
                    }}
                />
            </div>
            <div className="login-form-container">
                <div className="thank-you-text-wrapper">
                    <div className="thank-you-arrow">
                        <ResponseArrowImg />
                    </div>
                    <div className="thank-you-text">
                        <h2>Thank you for your request</h2>
                    </div>
                    <div className="thank-you-disclaimer">
                        <p>
                            Thank you for reaching out. We have received your response. Our
                            dedicated team will review it and get back to you within 24-48
                            hours. For immediate assistance, please contact us directly. We
                            appreciate your patience and look forward to assisting you soon.
                        </p>
                    </div>
                    <div className="back-to-home">
                        <button onClick={onClickHandler}>Go Back to Home</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMobileView = () => (
        <div className="mobile-response-container">
            <div className="mobile-header">
                {/* <Logo /> */}
                <div className="header-text">
                    <h2>Thank you for your request</h2>
                    <p>We have received your response and will get back to you soon.</p>
                </div>
            </div>
            <div className="mobile-response-form adjusted-form">
                <div className="form-header">
                    <p className="welcome-text">Your request has been submitted successfully</p>
                </div>
                <div className="thank-you-disclaimer">
                    <p>
                        Thank you for reaching out. We have received your response. Our
                        dedicated team will review it and get back to you within 24-48
                        hours. For immediate assistance, please contact us directly. We
                        appreciate your patience and look forward to assisting you soon.
                    </p>
                </div>
                <button className="submit-btn" onClick={onClickHandler}>
                    Go Back to Home
                </button>
            </div>
        </div>
    );

    return (
        <>
            {renderDesktopView()}
            {renderMobileView()}
        </>
    );
}
