import React from "react";
import "./style.css";
import RadiantLogo from "../../../../../assets/images/common/TestaLogo.svg";

const Footer = () => {
  return (
    <footer>
      <div className="student-footer">
        <h1>Powered by</h1>
        <div className="logo">
          <img src={RadiantLogo} alt="logo" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
