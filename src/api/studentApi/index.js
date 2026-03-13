import bowser from "bowser";
import {
  getAllStepCompleted,
  getAllStepCompletedStatus,
  setUserInfo,
} from "../../redux/slicers/authSlice.js";
import {
  CAPTURE_STUDENT_INFO_API,
  CAPTURE_STUDENT_DEVICE_INFO_API,
  GET_SINGLE_QUESTION_API,
  GET_STUDENT_ASSESSMENT_API,
  GET_STUDENT_FEEDBACK_API,
  SAVE_SINGLE_QUESTION_POST_UPDATE,
  START_STUDENT_ASSESSMENT_API,
  STUDENT_FACE_CAPTURE_API,
  STUDENT_ID_CAPTURE_API,
  STUDENT_LOGIN_API,
  STUDENT_LOGIN_OUT_API,
  SUBMIT_STUDENT_TEST_API,
  SAVE_REMAINING_EXAM_TIME_API,
  GET_SUSPICIOUS_ACTIVITY_API,
  CHANGE_EXAM_LANGUAGE_API,
  GET_ALL_STEP_COMPLETED_API,
  GET_STUDENT_RESULT_SUMMARY_API,
} from "../../config/constants/apiConstants/student.js";
import {
  devConsoleLog,
  errorToast,
  getBrowser,
  getDynamicRoute,
  getLocal,
  storeLocal,
  successToast,
  warningToast,
} from "../../utils/projectHelper";
import { API_ROOT } from "../../config/constants/apiConstants/auth.js";
import api from "../../utils/apiHelper.js";
import {
  CANDIDATE_TOKEN,
  DEFAULT_TOKEN,
  USER_DATA,
} from "../../config/constants/projectConstant";
import {
  ASSESSMENT_PAGE,
  STUDENT_DETAILS_PAGE,
  STUDENT_LOGIN_PAGE,
} from "../../config/constants/routePathConstants/student.js";
import {
  getQuestion,
  getAssessment,
  updateResumeTimer,
  updateResumeNewTimer,
  detectHumanFace,
  getLastQuestionId,
  getUpdatedStats,
  getCandidateResultSummary,
  suspiciousActivityLeft,
} from "../../redux/slicers/studentSlice.js";
import { browserName } from "react-device-detect";

export const studentLoginApi =
  (
    formValues,
    setLoading,
    setErr,
    setIsBrowserSupported,
    navigate,
    allowedBrowser,
    setAllowedBrowser,
    setDeviceName
    // viaButton = false
  ) =>
  async (dispatch) => {
    let browserName1 = getBrowser();
    const browser = bowser.getParser(window.navigator.userAgent);
    setDeviceName(browser?.parsedResult?.os?.name);
    const browserName = browser.getBrowserName();
    if (!allowedBrowser?.map((item) => item?.browser)?.includes(browserName1)) {
      setIsBrowserSupported(true);
      setErr(
        "Your browser is not supported. Please use any below mentioned browsers & click to download."
      );
      setAllowedBrowser(allowedBrowser);
      setLoading(false);
      return;
    }

    const getLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(error),
          { enableHighAccuracy: true } // Request high accuracy for better results
        );
      });
    };

    const getIP = async () => {
      const response = await fetch("https://api64.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    };

    try {
      const [geolocation, userIp] = await Promise.all([getLocation(), getIP()]);

      const browserDetails = {
        browserName: browserName1,
        userIP: userIp,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
      };
      api()
        .root(API_ROOT)
        .post(`${STUDENT_LOGIN_API}`)
        .data(formValues)
        .success((a) => {
          // const { message: msg = "" } = a;
          if (a.statusCode === 200) {
            storeLocal(true, "initialLogin");
            storeLocal("pageReloadCount", 0);
            storeLocal(a?.details?.candidate_token);
            storeLocal(a?.details, USER_DATA);
            dispatch(setUserInfo(a?.details));
            dispatch(getAllStepCompleted(a?.details?.userUpdated?.steps));
            dispatch(
              getAllStepCompletedStatus(
                a?.details?.userUpdated?.allStepsCompletedStatus
              )
            );
            localStorage.setItem(
              "screenStep",
              JSON.stringify({
                steps: a?.details?.userUpdated?.steps,
                allStepsCompletedStatus:
                  a?.details?.userUpdated?.allStepsCompletedStatus,
                isResumeNavigate: false,
              })
            );
            const batchId = a?.details?.assessment?.batch_id;
            const candidateId = a?.details?._id;
            if (!a?.details?.isAssessmentSubmited) {
              dispatch(
                capturestudentDeviceInfoApi(
                  browserDetails,
                  candidateId,
                  setLoading
                )
              );
            }
            if (a?.details?.isAssessmentSubmited) {
              localStorage?.removeItem("initialLogin");
              localStorage?.removeItem("pageReloadCount");
              localStorage?.removeItem(USER_DATA);
              localStorage?.removeItem(DEFAULT_TOKEN);
              localStorage?.removeItem("exitCount");
              errorToast("Your test has been submitted ");
            } else {
              navigate(`${STUDENT_DETAILS_PAGE}/${batchId}/${candidateId}`);
            }
          }
          setLoading && setLoading(false);
        })
        .error((e) => {
          const { message: msg = "", statusCode, error } = e;
          if (statusCode === 400 && msg === "login attempts over") {
            errorToast("Please contact to admin");
            return false;
          }
          errorToast(msg);
          // warningToast(
          //   error?.loginAttemptLeft + " " + "Login attempt remaining "
          // );
          setLoading && setLoading(false);
          devConsoleLog(e);
        })
        .send(() => {
          setLoading && setLoading(false);
        }, CANDIDATE_TOKEN);
    } catch (error) {
      setLoading(false);
      setErr("Please enable location services to log in.");
    }
  };

export const capturestudentDeviceInfoApi =
  (browserDetails, candidateId, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${CAPTURE_STUDENT_DEVICE_INFO_API}/${candidateId}`)
      .data(browserDetails)
      .success((a) => {
        // const { message: msg = "" } = a;
        if (a.statusCode === 200) {
        }
        setLoading && setLoading(false);
      })
      .error((e) => {
        setLoading && setLoading(false);
        // const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const studentFaceCaptureApi =
  (formData, candidateId, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${STUDENT_FACE_CAPTURE_API}/${candidateId}`)
      .data(formData)
      .success((a) => {
        // const { message: msg = "" } = a;
        // setLoading(false);
        if (a.statusCode === 200) {
          if (a?.details?.response?.FaceRecords?.length > 0) {
            successToast("Face captured successfully.");
            dispatch(detectHumanFace(a?.details?.response?.FaceRecords));
            dispatch(getAllStepCompleted(a?.details?.stepperUpdated?.steps));
            dispatch(
              getAllStepCompletedStatus(
                a?.details?.stepperUpdated?.allStepsCompletedStatus
              )
            );
            const screenStep = JSON.parse(localStorage.getItem("screenStep"));
            if (screenStep) {
              screenStep.steps = a?.details?.stepperUpdated?.steps;
              screenStep.allStepsCompletedStatus =
                a?.details?.stepperUpdated?.allStepsCompletedStatus;
              localStorage.setItem("screenStep", JSON.stringify(screenStep));
            }
          } else {
            errorToast("Human face not detected.");
          }
        }
      })
      .error((e) => {
        // setLoading(false);
        const { message: msg = "" } = e;
        errorToast("Human face not detected.");
      })
      .upload(() => {
        setLoading(false);
      });
    // .send(() => {
    //   // setLoading && setLoading(false);
    // });
  };

export const capturestudentBasicDetailsApi =
  (
    formData,
    candidateId,
    setFormValues,
    initialFormValues,
    setLoading,
    nav = null,
    navigate,
    batchId,
    questionId
  ) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${CAPTURE_STUDENT_INFO_API}/${candidateId}`)
      .data(formData)
      .success((a) => {
        // const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          setFormValues(initialFormValues);
          // nav && navigate(nav);
          dispatch(getAllStepCompleted(a?.details?.stepperUpdated?.steps));
          dispatch(
            getAllStepCompletedStatus(
              a?.details?.stepperUpdated?.allStepsCompletedStatus
            )
          );
          const screenStep = JSON.parse(localStorage.getItem("screenStep"));
          if (screenStep) {
            screenStep.steps = a?.details?.stepperUpdated?.steps;
            screenStep.allStepsCompletedStatus =
              a?.details?.stepperUpdated?.allStepsCompletedStatus;
            localStorage.setItem("screenStep", JSON.stringify(screenStep));
          }

          const screenStepS = JSON.parse(localStorage.getItem("screenStep"));
          const allSteps = screenStepS?.steps;
          if (!screenStepS?.allStepsCompletedStatus) {
            if (allSteps && allSteps?.length > 0) {
              const currentStep = allSteps?.find(
                (step) => step?.isCompleted === false
              );
              if (currentStep) {
                return getDynamicRoute(
                  currentStep,
                  batchId,
                  candidateId,
                  questionId
                );
              }
            }
          }
        }
        setLoading && setLoading(false);
      })
      .error((e) => {
        setLoading && setLoading(false);
        const { error: msg = "" } = e;
        errorToast(msg);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const studentIdCaptureApi =
  (formData, candidateId, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${STUDENT_ID_CAPTURE_API}/${candidateId}`)
      .data(formData)
      .success((a) => {
        // const { message: msg = "" } = a;
        // setLoading(false);
        if (a.statusCode === 200) {
          if (a?.details?.response?.TextDetections?.length > 0) {
            successToast("Aadhar capture successfully.");
            dispatch(detectHumanFace(a?.details?.response?.TextDetections));
            dispatch(getAllStepCompleted(a?.details?.stepperUpdated?.steps));
            dispatch(
              getAllStepCompletedStatus(
                a?.details?.stepperUpdated?.allStepsCompletedStatus
              )
            );
            const screenStep = JSON.parse(localStorage.getItem("screenStep"));
            if (screenStep) {
              screenStep.steps = a?.details?.stepperUpdated?.steps;
              screenStep.allStepsCompletedStatus =
                a?.details?.stepperUpdated?.allStepsCompletedStatus;
              localStorage.setItem("screenStep", JSON.stringify(screenStep));
            }
          } else {
            dispatch(detectHumanFace([]));
            errorToast(
              "Aadhar picture is not clearly visible, Please capture again."
            );
          }
        }
      })
      .error((e) => {
        setLoading(false);
        dispatch(detectHumanFace([]));
        const { message: msg = "" } = e;
        errorToast(msg);
        devConsoleLog();
      })
      .upload(() => {
        setLoading(false);
      });
    // .send(() => {
    //   // setLoading && setLoading(false);
    // });
  };

export const startAssessmentApi =
  (setLoading, batchId, candidateId, nav = null, url = null, enterFullscreen) =>
  (dispatch) => {
    const URL = `${START_STUDENT_ASSESSMENT_API}/${batchId}/${candidateId}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        // const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          enterFullscreen();
          // storeLocal(false, "initialLogin");
          dispatch(getAssessment(a?.details));
          dispatch(getLastQuestionId(a.details?.lastQuestionId));
          localStorage.setItem("LID", a?.details?.lastQuestionId);
          const screenStep = JSON.parse(localStorage.getItem("screenStep"));
          const allSteps = screenStep?.steps;
          if (!screenStep?.allStepsCompletedStatus) {
            if (allSteps && allSteps?.length > 0) {
              const currentStep = allSteps?.find(
                (step) => step?.isCompleted === false
              );
              if (currentStep) {
                return getDynamicRoute(
                  currentStep,
                  batchId,
                  candidateId,
                  a?.details?.lastQuestionId
                );
              }
            }
          }
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        // const { message: msg = "" } = e;
        // devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getAssessmentApi =
  (
    setLoading,
    batchId,
    candidateId,
    setSerialBtnLoading,
    nav = null,
    url = null,
    enterFullscreen
  ) =>
  (dispatch) => {
    const URL = `${GET_STUDENT_ASSESSMENT_API}/${batchId}/${candidateId}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        // const { message: msg = "" } = a;
        setLoading && setLoading(false);
        setSerialBtnLoading && setSerialBtnLoading(false);
        if (a.statusCode === 200) {
          // storeLocal(false, "initialLogin");
          const stats = {
            notAnswered: a?.details?.notAnswered,
            answered: a?.details?.answered,
            notAttempt: a?.details?.notAttempt,
            markForReview: a?.details?.markForReview,
            answeredMarkForReview: a?.details?.answeredMarkForReview,
          };
          dispatch(getAssessment(a?.details));
          dispatch(updateResumeTimer(a?.details?.remainingTime));
          dispatch(
            updateResumeNewTimer(a?.details?.questionList?.remainingMiliseconds)
          );
          dispatch(getLastQuestionId(a.details?.questionList?.lastQuestionId));
          dispatch(getUpdatedStats(stats));
          enterFullscreen();
          if (url) {
            nav(`${url}/${a.details?.questionList?.lastQuestionId}`);
          }
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        // const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const saveSingleQuestionPostUpdateApi =
  (
    formData,
    batchId,
    candidateId,
    currentQuestionID,
    questionAll,
    setLoading,
    setSerialBtnLoading,
    currentQuestionSerialNo = null,
    nextQuestionId = null,
    navigate = null,
    setSaveBtnLoading = false
  ) =>
  (dispatch) => {
    const findUpdate = (savedQuestion) => {
      const updatedQuestions = questionAll.questionList.questions.map(
        (question) => {
          const updatedQuestion = savedQuestion.questions.find(
            (updated) => updated.serialNo === question.serialNo
          );

          return updatedQuestion ? updatedQuestion : question;
        }
      );

      const newData = {
        ...questionAll,
        questionList: {
          ...questionAll.questionList,
          questions: updatedQuestions,
        },
      };
      return newData;
    };

    api()
      .root(API_ROOT)
      .put(
        `${SAVE_SINGLE_QUESTION_POST_UPDATE}/${batchId}/${candidateId}/${currentQuestionID}`
      )
      .data(formData)
      .success((a) => {
        // const { message: msg = "" } = a;
        setLoading && setLoading(false);
        setSaveBtnLoading(false);
        setSerialBtnLoading && setSerialBtnLoading(false);
        if (a.statusCode === 200) {
          if (
            questionAll?.questionList?.questions?.length !==
            currentQuestionSerialNo
          ) {
            navigate(
              `${ASSESSMENT_PAGE}/${batchId}/${candidateId}/${nextQuestionId}`
            );
            dispatch(
              getQuestionApi(batchId, candidateId, nextQuestionId, setLoading)
            );
          }
          if (
            questionAll?.questionList?.questions?.length ===
            currentQuestionSerialNo
          ) {
            dispatch(
              getAssessmentApi(
                setLoading,
                batchId,
                candidateId,
                setSerialBtnLoading
              )
            );
          }
          const updatedQuestions = findUpdate(a.details);
          dispatch(getAssessment(updatedQuestions));
        }
      })
      .error((e) => {
        setLoading(false);
        // const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading(false);
      });
  };

export const getQuestionApi =
  (batchId, candidateId, qId, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_SINGLE_QUESTION_API}/${batchId}/${candidateId}/${qId}`)
      .success((a) => {
        const { details } = a;
        const stats = {
          notAnswered: details?.notAnswered,
          answered: details?.answered,
          notAttempt: details?.notAttempt,
          markForReview: details?.markForReview,
          answeredMarkForReview: details?.answeredMarkForReview,
        };
        dispatch(getUpdatedStats(stats));
        dispatch(getQuestion(a?.details?.questionList?.questions?.[0]));
        // dispatch(getQuestionStats(details));
        // const { message: msg = "" } = a;
        setLoading && setLoading(false);
      })
      .error((e) => {
        const { message } = e;
        setLoading && setLoading(false);
        if (message === "This assessment is already submitted") {
        }
        // const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const submitTestApi =
  (batchId, candidateId, setLoading, navigate, navigatePath) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${SUBMIT_STUDENT_TEST_API}/${batchId}/${candidateId}`)
      .success((a) => {
        const { details } = a;
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        localStorage.setItem("isAssessmentSubmitted", JSON.stringify(true));
        successToast(msg);
        navigate(navigatePath);
      })
      .error((e) => {
        const { message } = e;
        setLoading && setLoading(false);
        if (message === "this has already been sumbmitted for this candidate") {
        }
        // const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getStudentFeedbackApi =
  (payload, batchId, candidateId, setLoading, feedbackData, navigate) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .put(`${GET_STUDENT_FEEDBACK_API}/${batchId}/${candidateId}`)
      .data(payload)
      .success((a) => {
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          dispatch(LogOutStudentApi(setLoading, navigate));
          const {
            trainerQuality,
            trainerMetricalQuality,
            infrastructureQuality,
            counselingMentoring,
            trainingEffectiveness,
            comments,
          } = feedbackData;

          if (
            trainerQuality ||
            trainerMetricalQuality ||
            infrastructureQuality ||
            counselingMentoring ||
            trainingEffectiveness ||
            comments
          ) {
            successToast("Feedback submitted successfully!");
          }
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        errorToast(e.message);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const LogOutStudentApi =
  (setLoading, navigate) => (dispatch) => {
    const URL = `${STUDENT_LOGIN_OUT_API}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {

          setLoading(true);

          // exitFullscreen();
          localStorage.clear(); 

          navigate(STUDENT_LOGIN_PAGE);
          successToast(msg);
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        // const { message: msg = "" } = e;
        // devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const saveRemainingExamTimeApi =
  (formData, batchId, candidateId, setLoading) => () => {
    api()
      .root(API_ROOT)
      .post(`${SAVE_REMAINING_EXAM_TIME_API}/${batchId}/${candidateId}`)
      .data(formData)
      .success((a) => {
        // const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          setLoading(false);
        }
        setLoading && setLoading(false);
      })
      .error((e) => {
        setLoading && setLoading(false);
        // const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getSuspiciousActivityApi =
  (setLoading, batchId, candidateId, navigate, reloadAttemptLeftCount) =>
  (dispatch) => {
    const URL = `${GET_SUSPICIOUS_ACTIVITY_API}/${batchId}/${candidateId}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        // const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          setLoading(true);
          dispatch(suspiciousActivityLeft(a?.details?.suspiciousActivityLeft));
          if (
            a?.details?.suspiciousActivityLeft < 0 ||
            reloadAttemptLeftCount > 1
          ) {
            // errorToast("logout due to suspicious activity");
            dispatch(LogOutStudentApi(setLoading, navigate));
          }
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        // const { message: msg = "" } = e;
        // devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

// change language api
export const changeExamLanguageApi =
  (formData, batchId, candidateId, questionId, isQuestionPage, setLoading) =>
  (dispatch) => {
    api()
      .root(API_ROOT)
      .post(`${CHANGE_EXAM_LANGUAGE_API}/${batchId}/${candidateId}`)
      .data(formData)
      .success((a) => {
        // const { message: msg = "" } = a;
        if (a.statusCode === 200) {
          if (isQuestionPage) {
            dispatch(
              getQuestionApi(batchId, candidateId, questionId, setLoading)
            );
          }
          setLoading(false);
        }
        setLoading && setLoading(false);
      })
      .error((e) => {
        setLoading && setLoading(false);
        // const { message: msg = "" } = e;
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const getAllStepCompletedApi =
  (setLoading, candidateId, navigate, NAV) => (dispatch) => {
    const URL = `${GET_ALL_STEP_COMPLETED_API}/${candidateId}`;
    api()
      .root(API_ROOT)
      .get(URL)
      .success((a) => {
        // const { message: msg = "" } = a;
        setLoading && setLoading(false);
        if (a.statusCode === 200) {
          // storeLocal(a?.details, USER_DATA);
          // dispatch(setUserInfo(a?.details))
          dispatch(getAllStepCompleted(a?.details?.response?.steps));
          dispatch(
            getAllStepCompletedStatus(
              a?.details?.response?.allStepsCompletedStatus
            )
          );
          const screenStep = JSON.parse(localStorage.getItem("screenStep"));
          if (screenStep) {
            screenStep.steps = a?.details?.response?.steps;
            screenStep.allStepsCompletedStatus =
              a?.details?.response?.allStepsCompletedStatus;
            localStorage.setItem("screenStep", JSON.stringify(screenStep));
          }
          const screenSteps = JSON.parse(localStorage.getItem("screenStep"));
          if (screenStep?.allStepsCompletedStatus) {
            navigate(NAV);
          }
        }
      })
      .error((e) => {
        setLoading && setLoading(false);
        // const { message: msg = "" } = e;
        // devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };

export const studentLoginTokenApi =
  (
    tokenData,
    setLoading,
    setErr,
    setIsBrowserSupported,
    navigate,
    allowedBrowser,
    setAllowedBrowser,
    setDeviceName
  ) =>
  async (dispatch) => {
    // Client-side detection using react-device-detect and feature detection
    const isBrowserAllowed = () => {
      // Check if the browser is one of the allowed ones
      const isAllowedName = ["Chrome", "Firefox", "Opera", "Safari"].includes(
        browserName
      );

      // Additional feature detection to confirm browser identity
      const features = {
        isChrome: () => {
          return (
            typeof window.chrome === "object" &&
            !/Edg|Edge|OPR|Opera|Brave|Vivaldi/.test(navigator.userAgent)
          );
        },
        isFirefox: () => {
          return typeof InstallTrigger !== "undefined";
        },
        isOpera: () => {
          return (
            (!!window.opr && !!window.opr.addons) ||
            !!window.opera ||
            navigator.userAgent.indexOf(" OPR/") >= 0
          );
        },
        isSafari: () => {
          return (
            /Safari/.test(navigator.userAgent) &&
            !/Chrome/.test(navigator.userAgent)
          );
        },
      };

      // Verify identity through feature detection
      if (browserName === "Chrome" && !features.isChrome()) return false;
      if (browserName === "Firefox" && !features.isFirefox()) return false;
      if (browserName === "Opera" && !features.isOpera()) return false;
      if (browserName === "Safari" && !features.isSafari()) return false;

      return isAllowedName;
    };

    const isAllowed = isBrowserAllowed();

    let browserName1 = getBrowser();
    const browser = bowser.getParser(window.navigator.userAgent);
    setDeviceName(browser?.parsedResult?.os?.name);
    if (!isAllowed) {
      setIsBrowserSupported(true);
      setErr(
        "Your browser is not supported. Please use any below mentioned browsers & click to download."
      );
      setAllowedBrowser(allowedBrowser);
      setLoading(false);
      return;
    }
    const getLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(error),
          { enableHighAccuracy: true } // Request high accuracy for better results
        );
      });
    };
    const getIP = async () => {
      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error("Error fetching IP:", error);
        return "unknown";
      }
    };
    try {
      const [geolocation, userIp] = await Promise.all([getLocation(), getIP()]);
      const browserDetails = {
        browserName: browserName1,
        userIP: userIp,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
      };

      api()
        .root(API_ROOT)
        .post(`${STUDENT_LOGIN_API}`)
        .data(tokenData)
        .success((a) => {
          if (a.statusCode === 200) {
            storeLocal(true, "initialLogin");
            storeLocal(a?.details?.candidate_token);
            storeLocal(a?.details, USER_DATA);
            dispatch(setUserInfo(a?.details));
            dispatch(getAllStepCompleted(a?.details?.userUpdated?.steps));
            dispatch(
              getAllStepCompletedStatus(
                a?.details?.userUpdated?.allStepsCompletedStatus
              )
            );
            localStorage.setItem(
              "screenStep",
              JSON.stringify({
                steps: a?.details?.userUpdated?.steps,
                allStepsCompletedStatus:
                  a?.details?.userUpdated?.allStepsCompletedStatus,
                isResumeNavigate: false,
              })
            );
            const batchId = a?.details?.assessment?.batch_id;
            const candidateId = a?.details?._id;
            if (!a?.details?.isAssessmentSubmited) {
              dispatch(
                capturestudentDeviceInfoApi(
                  browserDetails,
                  candidateId,
                  setLoading
                )
              );
            }
            if (a?.details?.isAssessmentSubmited) {
              localStorage?.removeItem(USER_DATA);
              localStorage?.removeItem(DEFAULT_TOKEN);
              localStorage?.removeItem("exitCount");
              errorToast("Your test has been submitted ");
            } else {
              navigate(`${STUDENT_DETAILS_PAGE}/${batchId}/${candidateId}`);
            }
          }
          setLoading && setLoading(false);
        })
        .error((e) => {
          const { message: msg = "", statusCode, error } = e;
          if (statusCode === 400 && msg === "login attempts over") {
            errorToast("Please contact to admin");
            return false;
          }
          setErr(msg || "Login failed. Please try again.");
          errorToast(msg);
          setLoading && setLoading(false);
          devConsoleLog(e);
        })
        .send(() => {
          setLoading && setLoading(false);
        }, CANDIDATE_TOKEN);
    } catch (error) {
      setLoading(false);
      setErr("Please enable location services to log in.");
    }
  };


  export const getResultSummaryApi =
  (batchId, candidateId, setLoading) => (dispatch) => {
    api()
      .root(API_ROOT)
      .get(`${GET_STUDENT_RESULT_SUMMARY_API}/${batchId}/${candidateId}`)
      .success((a) => {
        const { details } = a;
        dispatch(getCandidateResultSummary(details?.candidateReport));
        setLoading && setLoading(false);
      })
      .error((e) => {
        setLoading && setLoading(false);
        devConsoleLog(e);
      })
      .send(() => {
        setLoading && setLoading(false);
      });
  };
