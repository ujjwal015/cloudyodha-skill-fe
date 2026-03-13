import { useDispatch, useSelector } from "react-redux";
import {
  setTitleFontSize,
  setSubtitleFontSize,
  setContentFontSize,
  resetFontSizes,
  studentSelector,
} from "../../../../../../redux/slicers/studentSlice";
import "./style.css";
import { useEffect } from "react";

const FontSizeAdjuster = () => {
  const dispatch = useDispatch();
  const { fontSizes } = useSelector(studentSelector);

  const increaseFont = () => {
    dispatch(setTitleFontSize(fontSizes.title + 1));
    dispatch(setSubtitleFontSize(fontSizes.subtitle + 1));
    dispatch(setContentFontSize(fontSizes.content + 1));
  };

  const decreaseFont = () => {
    dispatch(setTitleFontSize(Math.max(1, fontSizes.title - 1)));
    dispatch(setSubtitleFontSize(Math.max(1, fontSizes.subtitle - 1)));
    dispatch(setContentFontSize(Math.max(1, fontSizes.content - 1)));
  };

  const resetFont = () => dispatch(resetFontSizes());


   useEffect(() => {
    document.documentElement.style.setProperty(
      "--title-font-size",
      `${fontSizes.title}px`
    );
    document.documentElement.style.setProperty(
      "--subtitle-font-size",
      `${fontSizes.subtitle}px`
    );
    document.documentElement.style.setProperty(
      "--content-font-size",
      `${fontSizes.content}px`
    );
  }, [fontSizes]);

  return (
    <>
      <button class="transparent-button" onClick={resetFont}>
        A
      </button>
      <button class="transparent-button" onClick={decreaseFont}>
        A-
      </button>
      <button class="transparent-button" onClick={increaseFont}>
        A+
      </button>
    </>
  );
};

export default FontSizeAdjuster;
