import React, { useRef, useState, useEffect } from "react";
import ReactDOMServer from 'react-dom/server';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./style.css";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
  linearProgressClasses,
} from "@mui/material";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import userSvg from "../../../../../assets/images/pages/ReportAnalytics/profilecircle.png";
import clock from "../../../../../assets/images/pages/ReportAnalytics/clock.png";
import bell from "../../../../../assets/images/pages/ReportAnalytics/bell.png";
import mainLogo from "../../../../../assets/images/pages/ReportAnalytics/Main_Logo.png";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import { ReactComponent as ActivityFrame } from "../../../../../assets/temp/Slice 1.svg";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { useSelector } from "react-redux";
import {
  getResultPreviewTextColor,
  getCandidateResultStatusCircular,
  getCandidateResultStatusPdfIcon,
  getCandidateResultStatusPdf,
  getCandidateResultStatusIcon,
} from "../../../../../utils/projectHelper";
import { misResultsSelector } from "../../../../../redux/slicers/superAdmin/misResults";
import { getSpecificCandidateResultApi } from "../../../../../api/superAdminApi/misResults";
import { useParams } from "react-router-dom";
import AttendanceImage from "./AttendanceImage";
import { jsx } from "@emotion/react";

var candidateName = "";

const ResultPdf = () => {
  const [candidateData, setCandidateData] = useState({});
  const [red, setRed] = useState("");
  const [finalReport, setFinalReport] = useState();
  const { candidateResultPreview = {} } = useSelector(authSelector);
  const { specificCandidateResult = [] } = useSelector(misResultsSelector);
  const params = useParams();
  console.log("URLCHECK",specificCandidateResult[0]?.candidateAttendance[1][
    `${params.candId}_id`])
  console.log("Params",params)
  const [examDuration, setExamDuration] = useState();
  const [userDuration, setUserDuration] = useState(0);
  const [loading,setLoading]=useState(true)

  // console.log("%%candidateData%%",candidateData);
  // console.log("%%finalReport%%",finalReport);
  // console.log("%%examDuration%%",examDuration)
  // console.log("%%candidateName%%",candidateName)
  console.log("***SpecificCandidateResult",specificCandidateResult)
  


  useEffect(() => {
    if (specificCandidateResult.length > 0) {
      // console.log("Executted1"
      
      // console.log("Inside useEFFECt",candidateData)
      setFinalReport(specificCandidateResult[0]?.candiateReport);
      candidateName = specificCandidateResult[0]?.candiateReport.name;
      setExamDuration(
        specificCandidateResult[0]?.candidateList[0]?.batchId?.questionPaper
          ?.sectionTable[0]?.examDuration
      );
      setCandidateData(specificCandidateResult[0]);

      // console.log("Executted2")
    }
  }, [specificCandidateResult]);

  useEffect(() => {
    setCandidateData(candidateResultPreview);
  }, [candidateResultPreview]);


  const times = finalReport?.testTime?.find((time) => {
    return time;
  });

  // const convertImage = async () => {
  //   html2canvas(document.getElementById("domEl")).then(function (canvas) {
  //     var svgUrl = canvas.toDataURL();
  //     // console.log("svgUrl",svgUrl)
  //     setRed(svgUrl);
  //   });
  // };

  // useEffect(() => {
  //   convertImage();
  // }, []);

  function calculateTimeDifferenceInMinutes(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    const timeDifferenceInMilliseconds = Math.abs(date2 - date1);
    const timeDifferenceInMinutes = (
      timeDifferenceInMilliseconds /
      (1000 * 60)
    ).toFixed(2);
    const finalTime = parseFloat(timeDifferenceInMinutes);

    return finalTime;
  }

  function calculateTotalTimeProgressBar(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    const timeDifferenceInMilliseconds = Math.abs(date2 - date1);
    const timeDifferenceInMinutes = (
      timeDifferenceInMilliseconds /
      (1000 * 60)
    ).toFixed(2);
    const finalTime = parseFloat(timeDifferenceInMinutes);
    const number = parseInt(examDuration.replace("min", ""), 10);
    const totalDuration = (finalTime / number) * 100;
    const finalRes = Math.ceil(totalDuration);
    if (finalRes <= number) return finalRes;
    else return 100;
  }

  function calculateFinalResValue(total, obtained) {
    const res = (obtained / total) * 100;
    return res;
  }

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 15,
    borderRadius: 10,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: "#F4F6F9",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 10,
      backgroundColor: "#0F2830",
    },
    [`& .${linearProgressClasses.bar}::after`]: {
      content: '""',
      display: "block",
      height: "10px",
      width: "10px",
      position: "absolute",
      top: "2px",
      right: "3px",
      background: "#fff",
      borderRadius: "50%",
    },
  }));

  const processTimeStampTimeOnly = (timestamp) => {
    if (!timestamp) return "Not Found";
    const options = {
      // month: "long",
      // day: "numeric",
      // year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Date(timestamp).toLocaleString("en-US", options);
    return formattedDate;
  };

  const processTimeStampDateOnly = (timestamp) => {
    if (!timestamp) return "Not Found";
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      // hour: "numeric",
      // minute: "numeric",
      // hour12: true,
    };
    const formattedDate = new Date(timestamp).toLocaleString("en-US", options);
    return formattedDate;
  };

  const processTimeStamp = (timestamp) => {
    if (!timestamp) return "Not Found";
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Date(timestamp).toLocaleString("en-US", options);
    // console.log("FoRmAtEd-DaTa", formattedDate);
    return formattedDate;
  };


  return (
      // <div id="domEl">
      // <div id="domEl" >
      //   <div className="pdf-container">
      <>
        {examDuration && finalReport && Object.values(specificCandidateResult[0]).length > 0 ? (
        <Box id="domEl" className="main-container-pdf" >
          <div className="candidate-name">
            <p>Candidate Name</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <img src={userSvg} alt="userIcon" />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "600",
                  fontSize: "17px",
                  fontFamily: "poppins",
                }}
                alt="base"
              >
                {finalReport?.name || "NA"}
              </Typography>
            </div>
          </div>

          <Grid container spacing={4} sx={{ my: 1 }}>
            <Grid item xs={10} lg={6}>
              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  background: "#fff",
                  borderRadius: "10px",
                  height: "80%",
                  height: "auto",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "gray",
                    fontSize: "15px",
                    pb: 2,
                    fontFamily: "poppins",
                  }}
                >
                  Result
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    color: getResultPreviewTextColor(finalReport?.passedStatus),
                  }}
                >
                  {getCandidateResultStatusIcon(finalReport?.passedStatus)}
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "poppins",
                      fontSize: "20px",
                      fontWeight: "600",
                      fontStyle: "normal",
                    }}
                  >
                    {finalReport?.passedStatus === "Not-attempt"
                      ? finalReport?.passedStatus
                      : `Test ${finalReport?.passedStatus}`}
                  </Typography>
                </div>
                <p style={{ margin: "10px 40px", fontFamily: "poppins" }}>
                  Respondent result is available
                </p>
                <Grid
                  container
                  spacing={4}
                  sx={{
                    alignItems: "end",
                    justifyContent: "space-between",
                    "& .MuiGrid-item": {
                      paddingTop: "0px",
                    },
                  }}
                >
                  <Grid item xs={12} sm={7}>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <span
                        style={{
                          background: "#1AB6F7",
                          width: "8px",
                          height: "33px",
                          borderRadius: "50px",
                          marginBottom: "10px",
                        }}
                      ></span>
                      <Paper
                        variant="outlined"
                        sx={{
                          py: 1,
                          px: 2,
                          mb: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "15px",
                            margin: 0,
                            fontWeight: 500,
                            fontFamily: "poppins",
                          }}
                        >
                          TOTAL QUESTIONS
                        </p>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            margin: 0,
                            fontFamily: "poppins",
                          }}
                        >
                          {specificCandidateResult[0]?.totalQuestionCount || "NA"}
                        </p>
                      </Paper>
                    </Box>

                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <span
                        style={{
                          background: "#FFA657",
                          width: "8px",
                          height: "33px",
                          borderRadius: "50px",
                        }}
                      ></span>
                      <Paper
                        variant="outlined"
                        sx={{
                          py: 1,
                          px: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "15px",
                            margin: 0,
                            fontWeight: 500,
                            fontFamily: "poppins",
                          }}
                        >
                          OBTAIN MARKS
                        </p>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            margin: 0,
                            fontFamily: "poppins",
                          }}
                        >
                          {`${finalReport?.totalObtainMarks}/${finalReport?.totalMarks}`}
                        </p>
                      </Paper>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Box position="relative" display="inline-block">
                      <Box
                        top={20}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                      >
                        <CircularProgress
                          style={{ color: "#F1F5F8" }}
                          size={160}
                          thickness={5}
                          variant="determinate"
                          value={100}
                        />
                      </Box>
                      <Box
                        top={20}
                        left={0}
                        bottom={0}
                        right={0}
                        position="relative"
                      >
                        <CircularProgress
                          sx={{
                            color: getCandidateResultStatusCircular(
                              finalReport?.passedStatus
                            ),
                            "& circle": { strokeLinecap: "round" },
                          }}
                          size={160}
                          thickness={5}
                          variant="determinate"
                          value={
                            (finalReport?.totalObtainMarks /
                              finalReport?.totalMarks || 100) * 100
                          }
                        />
                      </Box>
                      <Box
                        top={40}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <div style={{ textAlign: "center" }}>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: "700", fontFamily: "poppins" }}
                            component="div"
                          >
                            {specificCandidateResult[0]?.candiateReport?.percentageScored}
                          </Typography>
                          <Typography
                            variant="body1"
                            component="div"
                            color="textSecondary"
                            sx={{ fontFamily: "poppins" }}
                          >
                            {`${finalReport?.totalObtainMarks || 0}/${
                              finalReport?.totalMarks || 0
                            }`}
                          </Typography>
                        </div>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={10} lg={6}>
              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  background: "#fff",
                  borderRadius: "10px",
                  height: "80%",
                  height: "auto",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "gray",
                    fontSize: "15px",
                    pb: 2,
                    fontFamily: "poppins",
                  }}
                >
                  Time
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <WatchLaterOutlinedIcon sx={{ fontSize: 30, mr: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "600",
                      fontFamily: "poppins",
                      fontSize: "20px",
                    }}
                  >
                    Total Time
                  </Typography>
                </div>
                <p
                  style={{
                    margin: "0 48px",
                    fontSize: "17px",
                    fontWeight: "700",
                    fontFamily: "poppins",
                    marginTop: "15px",
                  }}
                >
                  {calculateTimeDifferenceInMinutes(
                    specificCandidateResult[0]?.candidateLogs?.startTime,
                    specificCandidateResult[0]?.candidateLogs?.endTime
                  )}
                  <span style={{ margin: "0 10px", color: "#AEB9C6" }}>/</span>
                  <span style={{ color: "#AEB9C6", fontFamily: "poppins" }}>
                    {examDuration || "-"}
                  </span>
                </p>
                <BorderLinearProgress
                  sx={{ my: 4 }}
                  variant="determinate"
                  value={calculateTotalTimeProgressBar(
                    specificCandidateResult[0]?.candidateLogs?.startTime,
                    specificCandidateResult[0]?.candidateLogs?.endTime
                  )}
                />
                {/* {candidateData?.testTime?.map((testTimes) => ( */}
                <Grid container spacing={4}>
                  <Grid item xs={12} lg={6}>
                    <p
                      style={{
                        color: "#97999C",
                        fontSize: "18px",
                        fontWeight: "500",
                        fontSize: "15px",
                        fontFamily: "poppins",
                      }}
                    >
                      Start Time <span style={{ margin: "0 15px" }}></span>
                      <span
                        style={{
                          color: "#000",
                          fontWeight: "600",
                          fontSize: "13px",
                          fontFamily: "poppins",
                        }}
                      >
                        {/* 15:08 PM */}
                        {processTimeStampTimeOnly(
                          specificCandidateResult[0]?.candidateLogs?.startTime
                        ) || "-"}
                      </span>
                    </p>
                    <p
                      style={{
                        color: "#97999C",
                        fontSize: "20px",
                        fontWeight: "500",
                        fontSize: "15px",
                        fontFamily: "poppins",
                        marginTop: "15px",
                      }}
                    >
                      End Time <span style={{ margin: "0px 20px" }}></span>
                      <span
                        style={{
                          color: "#000",
                          fontWeight: "600",
                          fontSize: "13px",
                          fontFamily: "poppins",
                        }}
                      >
                        {/* 15:08 PM */}
                        {processTimeStampTimeOnly(
                          specificCandidateResult[0]?.candidateLogs?.endTime
                        ) || "-"}
                      </span>
                    </p>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <p
                      style={{
                        color: "#97999C",
                        fontSize: "20px",
                        fontWeight: "500",
                        fontSize: "15px",
                        fontFamily: "poppins",
                      }}
                    >
                      Date <span style={{ margin: "0 15px" }}></span>
                      <span
                        style={{
                          color: "#000",
                          fontWeight: "600",
                          fontSize: "13px",
                          fontFamily: "poppins",
                        }}
                      >
                        {/* 29-05-23 */}
                        {processTimeStampDateOnly(
                          specificCandidateResult[0]?.candidateLogs?.loginTime
                        ) || "-"}
                      </span>
                    </p>
                  </Grid>
                </Grid>
                {/* ))} */}
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              p: 3,
              background: "#fff",
              borderRadius: "10px",
              // border: "1px solid red",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "gray",
                fontSize: "15px",
                pb: 2,
                fontFamily: "poppins",
              }}
            >
              Score per Question Category
            </Typography>

            <Grid
              container
              spacing={4}
              sx={{
                mt: 1,
                // border: "1px solid blue",
                // "& .MuiGrid-item": {
                //   paddingTop: "0px",
                // },
              }}
            >
              <Grid item xs={12} lg={6}>
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <span
                    style={{
                      background: "#04D375",
                      width: "8px",
                      height: "33px",
                      borderRadius: "50px",
                    }}
                  ></span>
                  <Paper
                    variant="outlined"
                    sx={{
                      py: 1,
                      px: 2,
                      mb: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      Correct Answers
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        margin: 0,
                        fontFamily: "poppins",
                      }}
                    >
                      {finalReport?.correctAnswer}
                    </p>
                  </Paper>
                </Box>
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <span
                    style={{
                      background: "#FC4444",
                      width: "8px",
                      height: "33px",
                      borderRadius: "50px",
                    }}
                  ></span>
                  <Paper
                    variant="outlined"
                    sx={{
                      py: 1,
                      px: 2,
                      mb: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        margin: 0,
                        fontWeight: 500,
                        fontFamily: "poppins",
                      }}
                    >
                      Incorrect Answers
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        margin: 0,
                        fontFamily: "poppins",
                      }}
                    >
                      {finalReport?.wrongAnswer}
                    </p>
                  </Paper>
                </Box>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <span
                    style={{
                      background: "#9747FF",
                      width: "8px",
                      height: "33px",
                      borderRadius: "50px",
                    }}
                  ></span>
                  <Paper
                    variant="outlined"
                    sx={{
                      py: 1,
                      px: 2,
                      mb: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        margin: 0,
                        fontWeight: 500,
                        fontFamily: "poppins",
                      }}
                    >
                      Attempts to Navigate outside
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        margin: 0,
                        fontFamily: "poppins",
                      }}
                    >
                      {finalReport?.suspiciousActivity || 0}
                    </p>
                  </Paper>
                </Box>
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <span
                    style={{
                      background: "#FFD02C",
                      width: "8px",
                      height: "33px",
                      borderRadius: "50px",
                    }}
                  ></span>
                  <Paper
                    variant="outlined"
                    sx={{
                      py: 1,
                      px: 2,
                      mb: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      Attempts to Copy/Paste
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        margin: 0,
                        fontFamily: "poppins",
                      }}
                    >
                      {finalReport?.suspiciousActivity > 0 ? "Yes" : "No"}
                    </p>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              p: 2,
              background: "#fff",
              borderRadius: "10px",
              paddingTop: "20px",
              // border: "1px solid red",
              my: 4,
            }}
          >
            <Grid container>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ border: "1px solid #ddd", p: 2, borderRadius: "10px" }}
              >
                <Box>Candidate Logs</Box>
                {/* <Box>
            {showLogs ? (
              <CollapseAccordian onClick={() => setShowLogs(!showLogs)} />
            ) : (
              <CollapseAccordian
                className="rotate"
                onClick={() => setShowLogs(!showLogs)}
              />
            )}
          </Box> */}
              </Grid>
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <Box
                  marginTop={"10px"}
                  paddingTop={"5px"}
                  // sx={{ border: "1px solid green" }}
                >
                  <div className="activityHeaderWrapper">
                    <div></div>
                    <div>
                      {processTimeStamp(
                        specificCandidateResult[0]?.candidateLogs?.startTime
                      ) || "Not Found"}
                    </div>
                    <div></div>
                    <div>
                      {processTimeStamp(specificCandidateResult[0]?.candidateLogs?.endTime)}
                    </div>
                    <div></div>
                    <div>
                      {processTimeStamp(
                        specificCandidateResult[0]?.candidateLogs?.userLogout
                      )}
                    </div>
                  </div>
                  <ActivityFrame
                    // viewBox="350 150 100 -100"
                    width={"100%"}
                    // style={{ border: "1px solid blue" }}
                  />
                  <div className="activityFooterWrapper">
                    <div>
                      {processTimeStamp(
                        specificCandidateResult[0]?.candidateLogs?.loginTime
                      )}
                    </div>
                    <div></div>
                    <div>
                      {processTimeStamp(
                        specificCandidateResult[0]?.candidateLogs?.resumeTime
                      )}
                    </div>
                    <div></div>
                    <div>{`${specificCandidateResult[0]?.candidateLogs?.passwordResetTime} times`}</div>
                    <div></div>
                  </div>
                </Box>
                {/* <Box>
            <Chrono
              items={items}
              mode="HORIZONTAL"
              itemWidth={150}
              showSingle
              flipLayout
              showAllCardsHorizontal
            />
          </Box> */}
              </Box>
            </Grid>
          </Box>

          <Box
            sx={{
              p: 2,
              background: "#fff",
              borderRadius: "10px",
              paddingTop: "20px",
              my: 4,
            }}
          >
            <Grid container>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ border: "1px solid #ddd", p: 2, borderRadius: "10px" }}
              >
                <Box>Candidate Attendance</Box>
              </Grid>
              <Box
                sx={{
                  width: "100%",
                  padding: "4px",
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-start",
                  }}
                >
                  <Box sx={{ padding: "2px" }}>
                    <h4>Candidate Image</h4>
                    <Box className="candImgContainer">
                      <img
                        className="candImage"
                        src={
                          specificCandidateResult[0]?.candidateAttendance[0][
                            `${params.candId}_face`
                          ]
                        }
                        alt="Candidate_face"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ padding: "2px" }}>
                    <h4>Candidate ID</h4>
                    <Box className="candImgContainer">
                      <AttendanceImage 
                        src={specificCandidateResult[0]?.candidateAttendance[1][
                            `${params.candId}_id`]}
                            />
                    </Box>
                  </Box>
                </Grid>
              </Box>
            </Grid>
          </Box>
        </Box>
      ) : (
        <h1 id="domEl">No Data found</h1>
      )}
      {/* // </div> */}
      {/* // </div> */}
      </>
  );
};

const ConfirmationModal = () => {
  const [open, setOpen] = useState(false);
  const componentRef = useRef();

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const options = {
      callback: function () {},
      format:"a4",
      orientation: 'portrait',  
      margin: [2, 2, 2, 2],
      width:"100%",
    };

    // Adjust font size and content size
    const contentWidth = componentRef.current.offsetWidth;
    const contentHeight = componentRef.current.offsetHeight;
    const pageSize = doc.internal.pageSize;
    // const pageWidth = pageSize.width - options.margin[1] - options.margin[3];
    const pageWidth = pageSize.width;

    const pageHeight = pageSize.height;
    const scaleFactor = Math.min(
      pageWidth / contentWidth,
      pageHeight / contentHeight
    );
    const scaledFontSize = 12 * scaleFactor; // Adjust the font size as needed

    doc.html(componentRef.current, {
      ...options,
      html2canvas: {
        scale: scaleFactor,
      },
      callback: function () {
        doc.setFontSize(scaledFontSize);
        doc.save(`${candidateName || "candidate"} Result.pdf`);
      },
    });
    setOpen(false);
  };

  // const handleDownloadPDF1=()=>{
  //   html2canvas(componentRef.current).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, 'PNG', 0, 0);
  //     pdf.save('myPDF.pdf');
  //   });
  // }


  const handleDownloadPDF1=()=>{
    const jsxcode= componentRef.current;
  
    html2canvas(jsxcode,{useCORS:true}).then((canvas)=>{
      const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF("p", "px", "a4");
          const width=pdf.internal.pageSize.width;
          pdf.setPage(1)
          pdf.addImage(imgData, 'PNG', 0, 0,pdf.internal.pageSize.width,pdf.internal.pageSize.height);

          pdf.save(`${candidateName || "candidate"} Result.pdf`);
    })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },

    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",

              right: 8,

              top: 8,

              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }
  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <>
      <Button
        disableElevation={true}
        disableFocusRipple={true}
        disableRipple={true}
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          color: "gray",
          gap: "10px",
          textTransform: "none",
        }}
        onClick={handleClickOpen}
      >
        <Typography
          variant="body1"
          sx={{ fontSize: "15px", fontFamily: "poppins" }}
        >
          Download Report
        </Typography>
        <FileDownloadOutlinedIcon />
      </Button>
      <div>
        <BootstrapDialog
          fullWidth
          maxWidth={"xs"}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            sx={{
              pb: 0,
              pl: 2,
              fontWeight: 600,
              fontFamily: "Poppins",
              color: "#54595E",
              fontSize: "18px",
            }}
          >
            Save Result as PDF
          </BootstrapDialogTitle>

          <DialogContent sx={{ padding: "5px 10px" }}>
            <Typography
              gutterBottom
              sx={{
                fontFamily: "Poppins",
                color: " rgba(84, 89, 94, 0.6)",
                fontWeight: 500,
                fontSize: "15px",
              }}
            >
              Are you sure you want to Download this
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                mt: 2,
              }}
            >
              <Button
                autoFocus
                variant="text"
                disableElevation={true}
                disableFocusRipple={true}
                disableRipple={true}
                onClick={handleClose}
                sx={{
                  fontFamily: "Poppins",
                  border: "solid 1px #1AB6F7",
                  color: "#1AB6F7",
                  textTransform: "capitalize",
                  "&:hover": {
                    border: "solid 1px #1AB6F7",
                    color: "#1AB6F7",
                  },
                }}
              >
                No, Cancel
              </Button>

              <Button
                autoFocus
                variant="text"
                disableElevation={true}
                disableFocusRipple={true}
                disableRipple={true}
                sx={{
                  fontFamily: "Poppins",
                  backgroundColor: "#1AB6F7",
                  color: "#F5F5F5",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#1AB6F7",
                    color: "#F5F5F5",
                  },
                }}
                onClick={() => {
                  handleDownloadPDF1();
                }}
              >
                Save PDF
              </Button>
            </Box>
          </DialogContent>
        </BootstrapDialog>
      </div>

      <div style={{ position: "fixed", top: "200vh" }}>
        <div>
          <div ref={componentRef}>
            <ResultPdf />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
