import React from "react";
import "./style.css"; // Import the CSS file
import { useDispatch, } from "react-redux";
import { setLayoutBackgroundColor,  } from "../../../../../../redux/slicers/studentSlice";

const ColorHeader = () => {
  const dispatch = useDispatch();
  
  const colors = [
  { bgColor: "#FFFFFF", textColor: "#000000" },
  { bgColor: "#E1983D", textColor: "#000000" },
  { bgColor: "#FF69B4", textColor: "#000000" },
  { bgColor: "#5CA177", textColor: "#000000" },
  { bgColor: "#1ab6f7", textColor: "#FFFFFF" }
]

  const handleColorContrast = (color) => {
    dispatch(setLayoutBackgroundColor(color))
  };

  return (
    <header className="custom-header">
      {colors.map((color, index) => (
        <div
          key={index}
          onClick={()=>{handleColorContrast(color)}}
          className="color-box"
          style={{ backgroundColor: color?.bgColor,cursor:'pointer' }}
        />
      ))}
    </header>
  );
};

export default ColorHeader;
