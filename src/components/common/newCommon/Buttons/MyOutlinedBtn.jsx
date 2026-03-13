import React from "react";
import "./MyOutlinedBtn.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PulseLoader } from "react-spinners";
const MyOutlinedBtn = ({
  text,
  iconLeft,
  iconRight,
  loading,
  onClick,
  ...restProps
}) => {
  return (
    <button className="myoutlined-btn" {...restProps} onClick={onClick}>
      {iconLeft && <Icon icon={iconLeft} />}
      {loading ? <PulseLoader size="10px" color="black" /> : text}
      {iconRight && <Icon icon={iconRight} />}
    </button>
  );
};

export default MyOutlinedBtn;
