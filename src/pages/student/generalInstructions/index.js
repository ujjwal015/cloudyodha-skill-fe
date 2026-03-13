import React, { useCallback, useState } from "react";
import "./style.css";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LanguageIcon from "@mui/icons-material/Language";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { PulseLoader } from "react-spinners";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ASSESSMENT_PAGE,
  STUDENT_DETAILS_PAGE,
} from "../../../config/constants/routePathConstants/student";
import { studentSelector } from "../../../redux/slicers/studentSlice";
import { authSelector } from "../../../redux/slicers/authSlice";
import {
  changeExamLanguageApi,
  getAllStepCompletedApi,
} from "../../../api/studentApi";
import { getDynamicRoute } from "../../../utils/projectHelper";
import { getSingleInstructionDetailApi } from "../../../api/superAdminApi/instructions";
import { instructionsData } from "../../../utils/projectHelper";

const GeneralInstructions = () => {
  const dispatch = useDispatch();
  const [instructions, setInstructions] = useState({});
  const [examLanguage, setExamLanguage] = useState("Choose-Language");
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [insLanguage, setInsLanguage] = useState("English");
  const [languageDropDown, setLanguageDropdown] = useState([]);
  const [additionalIns, setAdditionalIns] = useState([]);
  const [ins, setIns] = useState(instructionsData["english"]);

  useEffect(() => {
    const data =
      instructionsData[insLanguage.toLowerCase()] ||
      instructionsData["english"];
    setIns(data);
  }, [insLanguage]);

  const {
    userInfo,
    allStepsCompleted = [],
    allStepsCompletedStatus = false,
  } = useSelector(authSelector);
  const { questionAll = {} } = useSelector(studentSelector);
  const batchId = userInfo?.assessment?.batch_id;
  const instructionId =
    userInfo?.batchDetails?.questionPaper?.chooseInstructions;
  const candidateId = userInfo?._id;
  const navigate = useNavigate();
  const params = useParams();
  const { questionId } = params;
  const schemeName = userInfo?.assessment?.scheme;
  const isDisabled = userInfo?.batchDetails?.questionPaper?.examLanguageConduct
    ? userInfo?.uniqueLanguages?.length > 0
      ? schemeName === "NAPS" && isChecked
        ? false
        : userInfo?.uniqueLanguages.includes(examLanguage) && isChecked
        ? false
        : true
      : true
    : !isChecked;

  const fetchInstructionDetails = useCallback(() => {
    setLoading(true);
    dispatch(
      getSingleInstructionDetailApi(
        setLoading,
        () => {},
        instructionId,
        () => {},
        setInstructions,
        "student"
      )
    );
  }, [instructionId, dispatch]);

  useEffect(() => {
    if (instructionId) {
      fetchInstructionDetails();
    }
  }, [instructionId, fetchInstructionDetails]);

  useEffect(() => {
    const language = instructions?.instructions?.map((item) => item?.language);
    const selectedIns = instructions?.instructions?.find(
      (item) => item.language?.toLowerCase() === "english"
    )?.instructionDescription;
    setLanguageDropdown(language);
    setAdditionalIns(selectedIns);
  }, [instructions]);

  const changeExamLanguage = (formData) => {
    dispatch(changeExamLanguageApi(formData, batchId, candidateId, setLoading));
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setInsLanguage(value);
    const normalizedLang = value.toLowerCase();
    const selectedIns = instructions?.instructions?.find(
      (item) => item.language?.toLowerCase() === normalizedLang
    )?.instructionDescription;

    const availableLanguages = normalizedLang in instructionsData;

    if (availableLanguages) {
      setAdditionalIns(selectedIns);
    } else {
      const data = instructionsData["english"];
      const selectedIns = instructions?.instructions?.find(
        (item) => item.language?.toLowerCase() === "english"
      )?.instructionDescription;
      setIns(data);
      setAdditionalIns(selectedIns);
    }
  };

  const handleExamLanguageChange = (event) => {
    setExamLanguage(event.target.value);
    const formData = {
      secondaryLanguage: event.target.value,
    };
    changeExamLanguage(formData);
  };
  const NAV_PATH = `${ASSESSMENT_PAGE}/${batchId}/${candidateId}/${questionId}`;
  const handleStartAssesement = (event) => {
    dispatch(
      getAllStepCompletedApi(setLoading, candidateId, navigate, NAV_PATH)
    );
  };

  useEffect(() => {
    if (questionAll?.questionList?.questions?.length > 0) {
      navigate(`${ASSESSMENT_PAGE}/${batchId}/${candidateId}/${questionId}`);
    }
  }, [questionAll]);

  React.useEffect(() => {
    const screenStep = JSON.parse(localStorage.getItem("screenStep"));
    if (screenStep) {
      if (
        screenStep?.allStepsCompletedStatus &&
        screenStep?.isResumeNavigate === false
      ) {
        navigate(`${STUDENT_DETAILS_PAGE}/${batchId}/${candidateId}`);
      } else {
        if (
          screenStep?.allStepsCompletedStatus &&
          screenStep?.isResumeNavigate === true
        ) {
          navigate(
            `${ASSESSMENT_PAGE}/${batchId}/${candidateId}/${questionId}`
          );
        }
      }
    }
  }, []);

  const handleCheck = () => {
    if (isChecked == true) {
      setIsChecked(false);
    } else {
      setIsChecked(true);
    }
  };

  return (
    <div className="light-blue-container">
      <div className="genral-ins">
        <div className="card-wrapper">
          <div className="main-content general-instructions">
            <div className="card">
              <div className="title">
                <h2>{ins?.title}</h2>
                {instructions?.instructionName !== "Default" && (
                  <div style={{ width: "200px" }}>
                    <FormControl fullWidth>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select-lang"
                        value={insLanguage}
                        onChange={handleChange}
                        disabled={instructions?.instructions?.length === 1}
                        renderValue={(value) => (
                          <Box
                            sx={{
                              display: "flex",
                              gap: "4px",
                              alignItems: "center",
                            }}
                          >
                            <LanguageIcon />
                            {value}
                          </Box>
                        )}
                        className="selecteddd"
                      >
                        {languageDropDown?.map((lang) => (
                          <MenuItem
                            key={lang}
                            value={lang}
                            className="lang-opt"
                          >
                            {lang}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>
              <div className="cnt">
                <div style={{ width: "100%" }}>
                  <p className="instruction">{ins?.heading}</p>
                </div>
                <ul>
                  {ins?.sections?.map((text, index) => (
                    <li key={`section-${index}`}>{text}</li>
                  ))}

                  {ins?.statuses?.map((status, index) => (
                    <li key={`status-${index}`} className="ins-list">
                      <span className={`ins-no ${status.class}`}>
                        {status.id}
                      </span>
                      <span>{status.text}</span>
                    </li>
                  ))}

                  {ins?.additional?.map((text, index) => (
                    <li key={`additional-${index}`}>{text}</li>
                  ))}

                  {ins?.format?.map((text, index) => (
                    <li
                      key={`format-${index}`}
                      className="ins-lists"
                      style={{ paddingLeft: "20px" }}
                    >
                      <span className="ins-format">{text.split(".")[0]}.</span>
                      <span>{text.slice(text.indexOf(".") + 1)}</span>
                    </li>
                  ))}

                  {ins?.conclusion?.map((text, index) => (
                    <li key={`conclusion-${index}`}>{text}</li>
                  ))}
                </ul>

                {instructions?.instructionName !== "Default" && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {ins?.additionalIntructions}
                    </Typography>
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography
                        variant="body1"
                        sx={{
                          wordBreak: "break-word",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "Poppins",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "13px",
                            lineHeight: "22px",
                            color: "rgba(0, 0, 0, 0.7)",
                            marginBottom: "10px",
                            width: "89%",
                          }}
                          dangerouslySetInnerHTML={{ __html: additionalIns }}
                        ></div>
                      </Typography>
                    </Box>
                  </>
                )}
                <Divider sx={{ my: 3 }} />

                {userInfo?.batchDetails?.questionPaper?.examLanguageConduct && (
                  <>
                    <p>
                      {ins?.chooseLanguage}
                      {schemeName !== "NAPS" && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </p>
                    <div className="langauge">
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select-lang"
                          value={examLanguage}
                          onChange={handleExamLanguageChange}
                          renderValue={(value) => {
                            return (
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "2px",
                                  alignItems: "center",
                                }}
                              >
                                <LanguageIcon />
                                {value}
                              </Box>
                            );
                          }}
                          className="selecteddd"
                        >
                          {userInfo?.uniqueLanguages &&
                          userInfo?.uniqueLanguages?.length > 0
                            ? userInfo?.uniqueLanguages?.map((lang) => (
                                <MenuItem
                                  value={lang}
                                  className="lang-opt"
                                  key={lang}
                                >
                                  {lang}
                                </MenuItem>
                              ))
                            : null}
                        </Select>
                      </FormControl>
                    </div>
                  </>
                )}
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox checked={isChecked} onChange={handleCheck} />
                    }
                    label={ins?.termAndCondition}
                  />
                </FormGroup>
              </div>
              <div className="general-btns" style={{ textAlign: "center" }}>
                <Button
                  onClick={handleStartAssesement}
                  size="small"
                  className={`generel-instructions-btn ${
                    isChecked ? "enabled" : "disabled"
                  }`}
                  variant="contained"
                  sx={{
                    textTransform: "unset",
                  }}
                  disabled={isDisabled}
                >
                  {loading ? (
                    <PulseLoader size="10px" color="white" />
                  ) : (
                    <>{ins?.startExamBtn}</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInstructions;
