import React from "react";
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
    customPaging: (i) => <div className="line-dots"></div>,
  };
  return (
    <div className="login-banner">
      <div className="login-logo">
        <img
          onClick={() => navigate(SIGNIN)}
          src={TestaLogo}
          alt="logo"
          style={{ width: "150px !important" }}
        />
      </div>
      <div className="login-slide-container">
        <Slider {...settings}>
          {[1, 2, 3]?.map((item) => (
            <div className="login-slide" key={item}>
              <h3>Unleash Your Potential with Modernized Skill Assessments.</h3>
              <p>
                Testa offers an AI-Driven Online Assessment Platform for
                corporates, Educational institutes, & government organizations.
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Banner;
