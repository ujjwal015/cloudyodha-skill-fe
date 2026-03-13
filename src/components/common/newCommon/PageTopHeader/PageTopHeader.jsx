import React from "react";
import "./PageTopHeader.css";
// import MyOutlinedBtn from "../Buttons/MyOutlinedBtn";
import MyFilledBtn from "../Buttons/MyFilledBtn";

const PageTopHeader = (props) => {
  return (
    <div className="pagetopheader">
      <div className="pagetopheader__title">
        <h1>{props.header}</h1>
        
      </div>

      <div className="page--header__actions">
        <MyFilledBtn text="Add New" iconLeft="line-md:plus" />
      </div>
    </div>
  );
};

export default PageTopHeader;
