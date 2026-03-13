import React from "react";
import "./MyFilledBtn.css";

const ExportButton = ({ text="", onClick, ...restProps }) => {
  return (
    <button className="btn"  onClick={onClick} {...restProps}>
      {text}
    </button>
  );
};

export default ExportButton;