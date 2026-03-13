import React from "react";

const PageTitle = ({ title, subTitle = "" }) => {
  return (
    <div className="pagetopheader__title">
      <h1 style={{ fontSize: "larger", fontWeight: "bold" }}>{title}</h1>
      <p style={{ color: "#00000099", fontSize: "0.7rem" }}>{subTitle}</p>
    </div>
  );
};

export default PageTitle;
