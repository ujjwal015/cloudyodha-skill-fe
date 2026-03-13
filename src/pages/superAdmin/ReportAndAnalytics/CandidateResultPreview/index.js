import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactComponent as BackIcon } from "../../../../assets/icons/chevron-left.svg";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import userSvg from "../../../../assets/icons/profilecircle.svg";
import "./style.css";
import "../../../../styles/main.css";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";
import { NOS_WISE_RESULTS_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getResultPreviewTextColor,
  getCandidateResultStatusIcon,
  getCandidateResultStatusCircular,
} from "../../../../utils/projectHelper";
import ReactLoading from "react-loading";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./style.css";
import ResultPdf from "./CandiateResultPdf/index";
import {
  getSpecificCandidateResultApi,
  getSpecificCandidateFeedbackApi,
  getOnlineResultDownloadSheetApi,
} from "../../../../api/superAdminApi/misResults";
import { misResultsSelector } from "../../../../redux/slicers/superAdmin/misResults";
import { ReactComponent as CollapseAccordian } from "../../../../assets/icons/chevron-up.svg";
import { ReactComponent as ActivityFrame } from "../../../../assets/temp/Slice 1.svg";
import { PropagateLoader } from "react-spinners";
import { TableHeader } from "../../../../components/common/table";
import DownloadIcon from "@mui/icons-material/Download";

const CandidateResultPreviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [candidateData, setCandidateData] = useState({});
  const [finalReport, setFinalReport] = useState();
  const [loading, setLoading] = useState(true);
  const { specificCandidateResult = [], candidateFeedback = {} } =
    useSelector(misResultsSelector);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [attendance, setShowAttendance] = useState(false);
  const [sortOrders, setSortOrders] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [examDuration, setExamDuration] = useState();
  const [feedbackData, setFeedbackData] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const questions = [
      {
        qText:
          "Quality of the trainer (in terms of Friendliness, Clarity in Instructions Given, etc.)",
        option: candidateFeedback?.assessmentFeedback?.trainerQuality,
      },
      {
        qText:
          "Quality of the trainer material provided to the candidates (in terms of Relevance,Depth,Coverage,etc.)",
        option: candidateFeedback?.assessmentFeedback?.trainerMaterialQuality,
      },
      {
        qText:
          "Infrastructure present at the training center (in terms of No of classrooms, State of Laboratories, etc.)",
        option: candidateFeedback?.assessmentFeedback?.infrastructureQuality,
      },
      {
        qText:
          "Counseling and Mentoring support (in terms of Relevance, Usability, etc.)",
        option: candidateFeedback?.assessmentFeedback?.counselingMentoring,
      },
      {
        qText:
          "Overall training effectiveness (in terms of knowledge gained, upskilling, etc.)",
        option: candidateFeedback?.assessmentFeedback?.trainingEffectiveness,
      },
      {
        qText: "Candidate Comment and suggestion:",
        option: candidateFeedback?.assessmentFeedback?.comments,
      },
    ];

    setFeedbackData(questions);
  }, [candidateFeedback]);
  const getDetails = () => {
    dispatch(
      getSpecificCandidateResultApi(
        setLoading,
        params.id,
        params.candId,
        navigate
      )
    );
  };

  useEffect(() => {
    dispatch(
      getSpecificCandidateFeedbackApi(
        setLoading,
        params.id,
        params.candId,
        getDetails
      )
    );
  }, []);

  useEffect(() => {
    if (specificCandidateResult.length > 0) {
      setCandidateData(specificCandidateResult[0]);
      setFinalReport(specificCandidateResult[0]?.candiateReport);
      setExamDuration(
        specificCandidateResult[0]?.candidateList[0]?.batchId?.questionPaper
          ?.sectionTable[0]?.examDuration
      );
    }
  }, [specificCandidateResult]);

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

  const handleCandidateResultList = () => {
    navigate(`${NOS_WISE_RESULTS_PAGE}/${params?.id}`);
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

  const items = [
    {
      title: "January 2022",
      cardTitle: "Event 1",
      cardSubtitle: "Event 1 Subtitle",
      cardDetailedText: "This is the first event on the timeline.",
    },
    {
      title: "Event 2",
      cardTitle: "Event 2",
      date: "February 1, 2022",
    },
    {
      title: "March 2022",
      cardTitle: "Event 3",
      cardSubtitle: "Event 3 Subtitle",
      cardDetailedText: "This is the third event on the timeline.",
    },
  ];

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
    const number = parseInt(examDuration?.replace("min", ""), 10);
    const totalDuration = (finalTime / number) * 100;
    const finalRes = Math.ceil(totalDuration);

    if (finalRes <= number) return finalRes;
    else return 100;
  }

  return (
    <>
      {loading ? (
        <div className="react-loading-div">
          <ReactLoading
            className="react-loading"
            type={"spinningBubbles"}
            color={"#2ea8db"}
            height={"15%"}
            width={"15%"}
          />
        </div>
      ) : specificCandidateResult.length > 0 ? (
        <Box className="main-container">
          <h5 className="result-review">
            <BackIcon
              onClick={handleCandidateResultList}
              sx={{ cursor: "pointer" }}
            />
            Result Review
          </h5>
          <div className="general-duty-container">
            <p className="general-duty">
              {
                specificCandidateResult[0]?.candidateList[0]?.batchId?.jobRole
                  ?.jobRole
              }
            </p>
            <Box>
              <ResultPdf />
            </Box>
          </div>
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
                          {candidateData?.totalQuestionCount || "NA"}
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
                            {candidateData?.candiateReport?.percentageScored}
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
                    candidateData?.candidateLogs?.startTime,
                    candidateData?.candidateLogs?.endTime
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
                    candidateData?.candidateLogs?.startTime,
                    candidateData?.candidateLogs?.endTime
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
                          candidateData?.candidateLogs?.startTime
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
                          candidateData?.candidateLogs?.endTime
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
                          candidateData?.candidateLogs?.loginTime
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
                      Number of Suspicious Activity
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        margin: 0,
                        fontFamily: "poppins",
                      }}
                    >
                      {finalReport?.suspiciousActivity}
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
                <Box>Question Wise Result</Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button>
                    <Tooltip title="Download">
                      <DownloadIcon
                        sx={{
                          width: "30px !important",
                          height: "30px !important",
                        }}
                        onClick={() => {
                          dispatch(
                            getOnlineResultDownloadSheetApi(
                              null,
                              params.id,
                              params.candId,
                              finalReport?.name || "Single Candidate"
                            )
                          );
                        }}
                      />
                    </Tooltip>
                  </Button>
                  {showQuestions ? (
                    <CollapseAccordian
                      onClick={() => setShowQuestions(!showQuestions)}
                    />
                  ) : (
                    <CollapseAccordian
                      className="rotate"
                      onClick={() => setShowQuestions(!showQuestions)}
                    />
                  )}
                </Box>
              </Grid>
              <Box
                sx={{
                  display: [showQuestions ? "" : "none"],
                  width: "100%",
                }}
              >
                <Box className="subadmin-table">
                  <div className="subadmin-header"></div>
                  <div
                    className="table-wrapper"
                    // style={{ border: "1px solid red" }}
                  >
                    <table className="Result-Review-table">
                      <TableHeader
                        columns={getColumns()}
                        sortOrders={sortOrders}
                        setSortOrders={setSortOrders}
                      />
                      {loading ? (
                        <tbody>
                          <tr className="table-loading-wrapper">
                            <td className="sync-loader-wrapper">
                              <PropagateLoader color="#2ea8db" />
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          {candidateData?.answerDetail?.questions.length > 0 ? (
                            candidateData?.answerDetail?.questions?.map(
                              (item, index) => (
                                <tr key={item?._id} className="main_row">
                                  <td>{(page - 1) * limit + (index + 1)}</td>
                                  <td>
                                    {specificCandidateResult[0]
                                      ?.candidateList[0]?.batchId?.jobRole
                                      ?.jobRole || "NA"}
                                  </td>
                                  {/* <td>{item?.section || "NA"}</td> */}
                                  <td>
                                    {item?.questionText?.length > 10 ? (
                                      <Tooltip
                                        title={
                                          <div
                                            className="img-tooltip"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.questionText,
                                            }}
                                          />
                                        }
                                        placement="top-start"
                                        arrow
                                      >
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: item?.questionText,
                                          }}
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            cursor: "pointer",
                                            maxWidth: "80px", // Set a maximum width for the cell
                                          }}
                                        ></div>
                                      </Tooltip>
                                    ) : (
                                      <div>{item?.questionText || "NA"}</div>
                                    )}
                                  </td>
                                  {item?.options.map((op, ind) => {
                                    if (ind <= 5) {
                                      return (
                                        <td key={ind}>
                                          {op?.optionValue?.length > 10 ? (
                                            <Tooltip
                                              title={
                                                <div
                                                  dangerouslySetInnerHTML={{
                                                    __html: op?.optionValue,
                                                  }}
                                                />
                                              }
                                              arrow
                                            >
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html: op?.optionValue,
                                                }}
                                                style={{
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  cursor: "pointer",
                                                  maxWidth: "150px", // Set a maximum width for the cell
                                                }}
                                              >
                                                {/* {item?.questionText || "NA"} */}
                                              </div>
                                            </Tooltip>
                                          ) : (
                                            <div>
                                              {op?.optionValue || "-"}
                                              {op?.optionUrl && (
                                                <img
                                                  src={op?.optionUrl}
                                                  alt="no img"
                                                />
                                              )}
                                            </div>
                                          )}
                                        </td>
                                      );
                                    }
                                  })}
                                  {item?.options?.length === 4 && (
                                    <>
                                      <td>{"-"}</td> <td>{"-"}</td>
                                    </>
                                  )}
                                  {item?.options?.length === 3 && (
                                    <>
                                      <td>{"-"}</td> <td>{"-"}</td>
                                      <td>{"-"}</td>
                                    </>
                                  )}
                                  {item?.options?.length === 2 && (
                                    <>
                                      <td>{"-"}</td> <td>{"-"}</td>
                                      <td>{"-"}</td>
                                      <td>{"-"}</td>
                                    </>
                                  )}

                                  <td>
                                    {`Option${item?.answer[0]?.rawAnswer.toUpperCase()}` ||
                                      "NA"}
                                  </td>
                                  <td>
                                    {item?.options.find((el) => {
                                      if (el?.isSelect) {
                                        return el?.optionKey;
                                      }
                                    })?.optionKey || "Not Answered"}
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr className="no-list-table">
                              <td>
                                <p>No Results Found</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      )}
                    </table>
                  </div>
                </Box>
              </Box>
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
                <Box>
                  {showLogs ? (
                    <CollapseAccordian onClick={() => setShowLogs(!showLogs)} />
                  ) : (
                    <CollapseAccordian
                      className="rotate"
                      onClick={() => setShowLogs(!showLogs)}
                    />
                  )}
                </Box>
              </Grid>
              <Box
                sx={{
                  display: [showLogs ? "" : "none"],
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
                        candidateData?.candidateLogs?.startTime
                      ) || "Not Found"}
                    </div>
                    <div></div>
                    <div>
                      {processTimeStamp(candidateData?.candidateLogs?.endTime)}
                    </div>
                    <div></div>
                    <div>
                      {processTimeStamp(
                        candidateData?.candidateLogs?.userLogout
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
                        candidateData?.candidateLogs?.loginTime
                      )}
                    </div>
                    <div></div>
                    <div>
                      {processTimeStamp(
                        candidateData?.candidateLogs?.resumeTime
                      )}
                    </div>
                    <div></div>
                    <div>{`${candidateData?.candidateLogs?.passwordResetTime} times`}</div>
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
                <Box>
                  {attendance ? (
                    <CollapseAccordian
                      onClick={() => setShowAttendance(!attendance)}
                    />
                  ) : (
                    <CollapseAccordian
                      className="rotate"
                      onClick={() => setShowAttendance(!attendance)}
                    />
                  )}
                </Box>
              </Grid>
              <Box
                sx={{
                  display: [attendance ? "" : "none"],
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
                          candidateData?.candidateAttendance?.["0"][
                            `${params.candId}_face`
                          ]
                        }
                        alt="student-img"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ padding: "2px" }}>
                    <h4>Candidate ID</h4>
                    <Box className="candImgContainer">
                      <img
                        className="candImage"
                        src={
                          candidateData?.candidateAttendance?.["1"][
                            `${params.candId}_id`
                          ]
                        }
                        alt="student-id-img"
                      />
                    </Box>
                  </Box>
                </Grid>
              </Box>
            </Grid>
          </Box>
          {/* FeedbackPage */}

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
                <Box>Candidate Feedback</Box>
                <Box>
                  <CollapseAccordian
                    className="rotate"
                    style={{ rotate: [showFeedback ? "180deg" : ""] }}
                    onClick={() => setShowFeedback(!showFeedback)}
                  />
                </Box>
              </Grid>
              <div
                className="question_container"
                style={{ display: [showFeedback ? "" : "none"] }}
              >
                {candidateFeedback?.assessmentFeedback &&
                Object.keys(candidateFeedback?.assessmentFeedback).length > 0 &&
                feedbackData?.length > 0
                  ? feedbackData?.map((Qtext, i) => {
                      return (
                        <React.Fragment key={i}>
                          <h3>
                            <span>{i + 1} &nbsp;.&nbsp;</span>
                            {Qtext?.qText}
                          </h3>
                          <p>{Qtext?.option || "NA"}</p>
                          <hr />
                        </React.Fragment>
                      );
                    })
                  : "No Data found"}
              </div>
            </Grid>
          </Box>
        </Box>
      ) : (
        <>NO RESULTS TO DISPLAY</>
      )}
    </>
  );
};

export default CandidateResultPreviewPage;

const getColumns = () => {
  let columns = [
    { name: "_id", label: "S.No." },
    { name: "jobRole", label: "Job Role" },
    // { name: "section", label: "Section" },
    { name: "question", label: "Question" },
    { name: "option1", label: "option 1" },
    { name: "option2", label: "option 2" },
    { name: "option3", label: "option 3" },
    { name: "option4", label: "option 4" },
    { name: "option5", label: "option 5" },
    { name: "option6", label: "option 6" },
    { name: "correctAnswer", label: "Correct Answer" },
    { name: "selectedAnswer", label: "Selected Answer" },
    // { name: "edit", label: "Edit" },
  ];
  return columns;
};

// lastQuestionSavedTime
