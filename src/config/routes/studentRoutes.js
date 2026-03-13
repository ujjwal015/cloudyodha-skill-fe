import { lazy } from "react";
import { Link } from "react-router-dom";
import {
  STUDENT_LOGIN_PAGE,
  STUDENT_DETAILS_PAGE,
  STUDENT_GENERAL_INSTRUCTIONS,
  ASSESSMENT_PAGE,
  STUDENT_FACE_CAPTURE,
  STUDENT_ID_CAPTURE,
  STUDENT_FEEDBACK_PAGE,
  STUDENT_BASIC_INFORMATION,
  STUDENT_RESULT_SUMMARY,
} from "../constants/routePathConstants/student";
import StudentLayout from "../../components/common/Layout/studentNavBar/studentLayout";
const NotFound = lazy(() => import("../../pages/notFound"));
const StudentLogin = lazy(() => import("../../pages/student/login"));
const StudentDetails = lazy(() =>
  import("../../pages/student/registrationDetails")
);
const StudentGeneralInstruction = lazy(() =>
  import("../../pages/student/generalInstructions")
);
const GetQuestions = lazy(() =>
  import("../../pages/student/questionLists/questions")
);
const StudentFaceCapture = lazy(() =>
  import("../../pages/student/faceCapture")
);
const StudentIdCapture = lazy(() => import("../../pages/student/idCapture"));
const StudentFeedback = lazy(() => import("../../pages/student/feedback"));
const StudentBasicInfo = lazy(() =>
  import("../../pages/student/studentBasicInfo")
);
const StudentResultSummary = lazy(() =>
  import("../../pages/student/resultSummary")
);

const StudentSignIn = () => {
  return (
    <div>
      <h1>Hello World (Student)</h1>
      <Link to={STUDENT_LOGIN_PAGE}>Go to Sign In</Link>
    </div>
  );
};

const studentRoutes = () => {
  return [
    {
      path: "/",
      element: (
        <div>
          <StudentLayout />
          {/* <Outlet /> */}
        </div>
      ),
      children: [
        {
          index: true,
          element: <StudentDetails />,
        },
        // {
        //   path: STUDENT_LOGIN_PAGE,
        //   element: <StudentLogin />,
        // },
        {
          path: `${STUDENT_DETAILS_PAGE}/:batchId/:candidateId`,
          element: <StudentDetails />,
        },
        {
          path: `${STUDENT_FACE_CAPTURE}/:batchId/:candidateId/:questionId`,
          element: <StudentFaceCapture />,
        },
        {
          path: `${STUDENT_ID_CAPTURE}/:batchId/:candidateId/:questionId`,
          element: <StudentIdCapture />,
        },
        {
          path: `${STUDENT_BASIC_INFORMATION}/:batchId/:candidateId/:questionId`,
          element: <StudentBasicInfo />,
        },
        {
          path: `${STUDENT_GENERAL_INSTRUCTIONS}/:batchId/:candidateId/:questionId`,
          element: <StudentGeneralInstruction />,
        },
        {
          path: `${ASSESSMENT_PAGE}/:batchId/:candidateId/:questionId`,
          element: <GetQuestions />,
        },
        {
          path: `${STUDENT_RESULT_SUMMARY}/:batchId/:candidateId`,
          element: <StudentResultSummary />,
        },
        {
          path: `${STUDENT_FEEDBACK_PAGE}/:batchId/:candidateId`,
          element: <StudentFeedback />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ];
};

export default studentRoutes;
