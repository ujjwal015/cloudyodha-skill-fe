import React from "react";
import ITI_logo from "../../assets/images/common/WhiteITILogo.jpeg";
import TestaLogo from "../../assets/images/common/TestaLogo.svg";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { SIGNIN } from "../../config/constants/routePathConstants/auth";

function Banner() {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div>
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: () => <div className="line-dots"></div>,
  };

  return (
    <div className="login-banner">

      {/* Top Logo (Replacing TestaLogo with BLACK.png) */}
      <div className="login-logo">
        <img
          onClick={() => navigate(SIGNIN)}
          src={TestaLogo}
          alt="Setu Logo"
          style={{ width: "150px", cursor: "pointer" }}
        />
      </div>

      {/* Slider */}
      <div className="login-slide-container">
        <Slider {...settings}>
          {[1, 2, 3].map((item) => (
            <div className="login-slide" key={item}>
              <h3>Unleash Your Potential with Modernized Skill Assessments.</h3>
              <p>
                SETU 100 offers an AI-Driven Online Assessment Platform for
                corporates, Educational institutes, & government organizations.
              </p>
            </div>
          ))}
        </Slider>
      </div>

      {/* Bottom ITI Logo */}
      {/* <div className="banner-bottom-logo">
        <img
          src={ITI_logo}
          alt="ITI Logo"
          style={{ width: "200px" }}
        />
      </div> */}

    </div>
  );
}

export default Banner;