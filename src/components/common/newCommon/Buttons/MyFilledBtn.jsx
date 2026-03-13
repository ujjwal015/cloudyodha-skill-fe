import React from "react";
import PropTypes from 'prop-types';
import "./MyFilledBtn.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PulseLoader } from "react-spinners";
const MyFilledBtn = (props) => {
  const {
    text,
    iconLeft,
    iconRight,
    isRightIcon,
    onClick,
    loading,
    disabled,
    isPermissions,
    ...restProps
  } = props?.btnItemData;
  console.log("text_TEXT",text,props?.btnItemData)
  return (
    <button
      className="btn"
      onClick={onClick}
      disabled={disabled}
      {...restProps}
    >
      {!isRightIcon && iconLeft && <Icon icon={iconLeft} />}
      {/* {loading ? <PulseLoader size="10px" color="white" /> :  text } */}
      {text}
      {isRightIcon && iconRight && <Icon icon={iconRight} />}
    </button>
  );
};

MyFilledBtn.propTypes = {
  text: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  isRightIcon: PropTypes.bool,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  isPermissions: PropTypes.object,
   // restProps can accept any additional props
   restProps: PropTypes.object,
};

export default MyFilledBtn;
