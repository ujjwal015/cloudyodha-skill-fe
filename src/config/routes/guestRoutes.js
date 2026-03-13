import { lazy } from "react";
import { Link, Outlet } from "react-router-dom";
import AuthBackgroundImage from "../../assets/images/auth/AuthBackgroundImage.png";
import TestaLogo from "../../assets/images/common/TestaLogo.svg";
import {
  SIGNIN,
  GET_DEMO,
  EDIT_DEMO_USER,
  SIGNUP,
  EDIT_PROFILE,
  FORGOT_PASSWORD,
  GET_OTP,
  GET_RESPONSE,
  RESET_PASSWORD,
  VERIFY_EMAIL,
  FORGET_RESET_PASSWORD,
  TRAINING_PARTNER_FEEDBACK,
  ASSESSOR_FEEDBACK,
} from "../constants/routePathConstants/auth";
import {
  STUDENT_FACE_CAPTURE,
  STUDENT_FEEDBACK_PAGE,
  STUDENT_ID_CAPTURE,
  STUDENT_LOGIN_PAGE,
  STUDENT_TOKEN_LOGIN_PAGE,
} from "../constants/routePathConstants/student";
import "./landing.css";
import bowser from "bowser";
import Footer from "../../components/common/Layout/SuperAdmin/footer";

const Login = lazy(() => import("../../pages/auth/login"));
const Register = lazy(() => import("../../pages/auth/register"));
const GetDemo = lazy(() => import("../../pages/auth/demoUser/getDemo"));
const EditDemoUser = lazy(() =>
  import("../../pages/auth/demoUser/editDemoUser")
);
const GetOtp = lazy(() => import("../../pages/auth/demoUser/getOtp"));
const GetResponse = lazy(() => import("../../pages/auth/demoUser/GetResponse"));
const EditProfile = lazy(() => import("../../pages/auth/editProfile"));
const ResetPassword = lazy(() => import("../../pages/auth/resetPassword"));
const ForgetResetPassword = lazy(() =>
  import("../../pages/auth/forgetResetPassword")
);
const ForgotPassword = lazy(() => import("../../pages/auth/forgotPassword"));
const VerifyEmail = lazy(() => import("../../pages/auth/verifyEmail"));
const StudentLogin = lazy(() => import("../../pages/student/login"));
const StudentTokenLogin = lazy(() => import("../../pages/student/tokenLogin"));
const NotFound = lazy(() => import("../../components/common/NotFound"));

const StudentFaceCapture = lazy(() =>
  import("../../pages/student/faceCapture")
);
const StudentIdCapture = lazy(() => import("../../pages/student/idCapture"));
const StudentFeedback = lazy(() => import("../../pages/student/feedback"));
const TrainingPartnerFeedback = lazy(() =>
  import("../../pages/auth/trainingPartnerFeedback/TrainingPartnerFeedbackMain")
);
const AssessorFeedback = lazy(() =>
  import("../../pages/auth/assessorFeedback/AssessorFeedbackMain")
);
const ASSESSOR_URL = process.env.REACT_APP_ASSESSOR_BASE_URL;

const Guest = () => {
  const operating_system = bowser.getParser(window.navigator.userAgent);
  const deviceType = operating_system?.parsedResult?.os?.name;

  return (
    <div
      className="landing_main_wrapper"
      style={{
        backgroundImage: `url(${AuthBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="landing_header">
        <img
          src={TestaLogo}
          alt="Logo"
          className="landing_logo"
          style={{ width: "150px;" }}
        />
      </div>
      <div className="landing_container">
        <div className="title_wrapper">
          <h1>Welcome to Testa</h1>
        </div>
        <div className="links_wrapper">
          <Link to={SIGNIN} className="links_card">
            Admin Login
          </Link>
          <Link to={STUDENT_LOGIN_PAGE} className="links_card">
            Student Login
          </Link>
          <Link to={ASSESSOR_URL} className="links_card">
            Assessor Login
          </Link>
          {/* {(deviceType?.toLowerCase() === "android" ||
            deviceType?.toLowerCase() === "ios") && (
            <Link to={ASSESSOR_URL} className="links_card">
              Assessor Login
            </Link>
          )} */}
        </div>
      </div>
    </div>
  );
};

const guestRoutes = () => {
  return [
    {
      path: "/",
      element: (
        <div>
          <Outlet />
          <Footer />
        </div>
      ),
      children: [
        {
          index: true,
          element: <Guest />,
        },
        {
          path: SIGNUP,
          element: <Register />,
        },
        {
          path: GET_DEMO,
          element: <GetDemo />,
        },
        {
          path: GET_OTP,
          element: <GetOtp />,
        },
        {
          path: GET_RESPONSE,
          element: <GetResponse />,
        },
        {
          path: `${EDIT_DEMO_USER}`,
          element: <EditDemoUser />,
        },
        {
          path: VERIFY_EMAIL,
          element: <VerifyEmail />,
        },
        {
          path: SIGNIN,
          element: <Login />,
        },
        {
          path: EDIT_PROFILE,
          element: <EditProfile />,
        },
        {
          path: FORGOT_PASSWORD,
          element: <ForgotPassword />,
        },

        {
          path: RESET_PASSWORD,
          element: <ResetPassword />,
        },
        {
          path: FORGET_RESET_PASSWORD,
          element: <ForgetResetPassword />,
        },
        {
          path: STUDENT_LOGIN_PAGE,
          element: <StudentLogin />,
        },
        {
          path: STUDENT_TOKEN_LOGIN_PAGE,
          element: <StudentTokenLogin />,
        },
        {
          path: STUDENT_FACE_CAPTURE,
          element: <StudentFaceCapture />,
        },
        {
          path: STUDENT_ID_CAPTURE,
          element: <StudentIdCapture />,
        },
        {
          path: STUDENT_FEEDBACK_PAGE,
          element: <StudentFeedback />,
        },
        {
          path: TRAINING_PARTNER_FEEDBACK,
          element: <TrainingPartnerFeedback />,
        },
        {
          path: ASSESSOR_FEEDBACK,
          element: <AssessorFeedback />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ];
};

export default guestRoutes;
