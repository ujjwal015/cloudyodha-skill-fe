import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { changeExamLanguageApi, submitTestApi } from "../../../../api/studentApi";
import "./style.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import NewTimer from "../../../../utils/timer/newTimer";
import {
  STUDENT_BASIC_INFORMATION,
  STUDENT_DETAILS_PAGE,
  STUDENT_FACE_CAPTURE,
  STUDENT_FEEDBACK_PAGE,
  STUDENT_GENERAL_INSTRUCTIONS,
  STUDENT_ID_CAPTURE,
  STUDENT_RESULT_SUMMARY,
} from "../../../../config/constants/routePathConstants/student";
import { getSecondoryLanguage, studentSelector } from "../../../../redux/slicers/studentSlice";
import { getDynamicStyle, getTextColorStyle } from "../../../../utils/projectHelper";

const QuestionNav = ({
  testName,
  handleShowNav,
  lastQuestionSerialNo,
  currentQuestion,
  isQuestionaginationStatusEnable,
  schemeName
}) => {
  const { userInfo = {} } = useSelector(authSelector);
  const { layoutColor={},fontSizes={}} = useSelector(studentSelector);

  const [examLanguage, setExamLanguage] = useState(userInfo?.uniqueLanguages[0]);
  const isQuestionPage = useLocation().pathname.includes("/assessment");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const batchId = userInfo?.assessment?.batch_id;
  const candidateId = userInfo?._id;
  const { questionId } = useParams();

  const changeExamLanguage = (formData) => {
    dispatch(changeExamLanguageApi(formData, batchId, candidateId, questionId, isQuestionPage, setLoading));
  };

  const handleExamLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    console.log('selectedLanguage',selectedLanguage)
    dispatch(getSecondoryLanguage(selectedLanguage));
    setExamLanguage(selectedLanguage);
    const formData = { secondaryLanguage: selectedLanguage };
    changeExamLanguage(formData);
  };

  const handlesubmit = () => {
    setLoading(true);
    // const navigatePath = `${STUDENT_FEEDBACK_PAGE}/${batchId}/${candidateId}`;
     const navigatePath =
          schemeName === "mock"
            ? `${STUDENT_RESULT_SUMMARY}/${batchId}/${candidateId}`
            : `${STUDENT_FEEDBACK_PAGE}/${batchId}/${candidateId}`;
    dispatch(submitTestApi(batchId, candidateId, setLoading, navigate, navigatePath));
  };

  return (
    <div className="question-header-box card-border" style={{fontSize:`${fontSizes.title}px`,...getTextColorStyle(layoutColor)}}>
      <div className="title">
        <h2>{testName}</h2>
      </div>

      <div className="question-header_navigation">
        <div className="question-nav-btn">
          {location?.pathname.includes(STUDENT_DETAILS_PAGE) ||
          location?.pathname === "/" ||
          location?.pathname.includes(STUDENT_FACE_CAPTURE) ||
          location?.pathname.includes(STUDENT_ID_CAPTURE) ||
          location?.pathname.includes(STUDENT_GENERAL_INSTRUCTIONS) ||
          location?.pathname.includes(STUDENT_FEEDBACK_PAGE) ||
          location?.pathname.includes(STUDENT_BASIC_INFORMATION) ? (
            ""
          ) : (
            <NewTimer handlesubmit={handlesubmit} layoutColor={layoutColor}/>
          )}
        </div>
        <div className="question-nav-btn">
          {userInfo?.batchDetails?.questionPaper?.examLanguageConduct && isQuestionPage && (
            <div className="langauge">
              <FormControl>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-lang"
                  value={examLanguage}
                  onChange={handleExamLanguageChange}
                  renderValue={(value) => (
                    <Box sx={{ display: "flex", gap: "2px", alignItems: "center", paddingRight: 3.5, ...getDynamicStyle(layoutColor) }}>
                      <Icon icon="heroicons:language-20-solid" />
                      {value}
                    </Box>
                  )}
                  className="selecteddd"
                  // disabled={!userInfo?.batchDetails?.questionPaper?.multiLanguage}
                >
                  {userInfo?.uniqueLanguages?.length > 0 &&
                    userInfo?.uniqueLanguages.map((lang) => (
                      <MenuItem value={lang} className="lang-opt" key={lang}>
                        {lang}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          )}
        </div>
        <div className="question-nav-btn">
          <h6>
            {currentQuestion} / {lastQuestionSerialNo}
          </h6>
          {isQuestionaginationStatusEnable && (
            <p className="arrow-p" onClick={handleShowNav}>
              <Icon style={{ fontSize: 20, color: "#757575" }} icon="ic:baseline-arrow-drop-down" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionNav;
