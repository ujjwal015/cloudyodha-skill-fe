import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import { Button } from "@mui/material";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { ReactComponent as ArrowLeft } from "../../../../../assets/icons/chevron-left.svg";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../../utils/validation/superAdmin/examManagement";
import {
  createBatchApi,
  getAssessorsApi,
  getBatchData,
} from "../../../../../api/superAdminApi/examManagement";
import {
  SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE,
  SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE,
  SUPER_ADMIN_BATCH_LIST_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import BasicDetails from "./BasicDetails";
import Proctoring from "./Proctoring";
import QuestionPaper from "./QuestionPaper";
import AssessorProctorAssign from "./AssessorProctorAssign";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { formattedPayload } from "../data";
import {
  examManagementSelector,
  getJobRoleLevelVersion,
} from "../../../../../redux/slicers/superAdmin/examManagementSlice";

const defaultInstructionId = process.env.REACT_APP_DEFAULT_INSTRUCTION_ID;

const checkValues = [
  {
    name: "imageProctorStatus",
    value: "imageProctoringTime",
  },
  {
    name: "videoStreaming",
    value: "videoDuration",
  },
  {
    name: "wrongLoginStatus",
    value: "noOfWrongLogin",
  },
  {
    name: "browserExitAlert",
    value: "noOfBrowserExit",
  },
  {
    name: "examLanguageConduct",
    value: "secondaryLanguage",
  },
];
const basicDetailsInitialFormValues = {
  batchId: "",
  batchSize: "",
  schemeId: "",
  subSchemeId: "",
  startDate: "",
  endDate: "",
  // assessmentDate: "",
  batchMode: "",
  examCenterId: "",
  startTime: "",
  endTime: "",
  trainingPartner:"",
};
const proctoringInitialFormValues = {
  imageProctorStatus: "true",
  imageProctoringTime: 1,
  videoStreaming: "true",
  videoDuration: 5,
  videoInterval: 1,
  wrongLoginStatus: "true",
  noOfWrongLogin: 3,
  browserExitAlert: "true",
  noOfBrowserExit: 7,
  faceRecognition: "false",
  faceDetection: "false",
  videoScreensharingProctoringStatus: "true",
  capturingImageStatus: "true",
  identityProofStatus: "true",
  isAutoLogout: "false",
};
const questionPaperInitialFormValues = {
  isMultiJobRole: "false",
  multipleJobRole: [
    // {
    //   level: "",
    //   version: "",
    //   jobRoleId: "",
    // },
  ],
  markForReview: true,
  questionNavigation: true,
  paginationStatus: true,
  assesmentStatus: true,
  suffleQuestion: true,
  optionRandom: "false",
  examLanguageConduct: "false",
  chooseInstructions: defaultInstructionId,
  primaryLanguage: "english",
  secondaryLanguage: "",
  questionSet: "",
  questionType: "objective",
  passingPercentage: "",
  qpCode: "",
  level: "",
  version: "",
  sectionTable: [
    {
      sectionName: "theory",
      sectionOrder: null,
      examDuration: null,
      isSelected: false,
    },
    {
      sectionName: "viva",
      sectionOrder: null,
      examDuration: null,
      isSelected: false,
    },
    {
      sectionName: "practical",
      sectionOrder: null,
      examDuration: null,
      isSelected: false,
    },
  ],
  jobRole: "",
  colorAndTTSEnabled: false,
};

const CreateBatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo: { _id = "" } = {} } = useSelector(authSelector);
  const { subSchemeList = [] } = useSelector(examManagementSelector);
  const assessorProctorValues = {
    assignAssessorProctor: "",
    accessorId: "",
    proctorId: "",
    // financeRemarks: "", //This is removed after abhijeet's confirmation
    assessorFeePerCandidate: "",
    // clientId: _id,
  };

  const [loading, setLoading] = useState(false);
  const [basicDetailsFormValues, setBasicDetailsFormValues] = useState(
    basicDetailsInitialFormValues
  );
  const [proctoringformValues, setProctoringFormValues] = useState(
    proctoringInitialFormValues
  );

  const [questionPaperformValues, setQuestionPaperFormValues] = useState(
    questionPaperInitialFormValues
  );

  const [assessorProctor, setAssessorProctor] = useState(assessorProctorValues);
  const [errors, setErrors] = useState({});
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    dispatch(getJobRoleLevelVersion([]));
    dispatch(getBatchData("active"));
  }, []);

  useEffect(() => {
    if (basicDetailsFormValues.batchMode == "offline") {
      setIsOnline(false);
      setQuestionPaperFormValues((prevState) => {
        return {
          ...prevState,
          isMultiJobRole: "false",
          multipleJobRole: [],
          suffleQuestion: false,
          optionRandom: false,
        };
      });
    }
    if (basicDetailsFormValues.batchMode == "online") {
      setIsOnline(true);
    }
  }, [basicDetailsFormValues]);

  const formValues = {
    ...basicDetailsFormValues,
    ...proctoringformValues,
    ...questionPaperformValues,
    ...assessorProctor,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    const filteredFormValues = { ...formValues };

    // ExamCenterId if empty
    if (formValues.examCenterId == "") {
      const fieldsToRemove = ["examCenterId","trainingPartner"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }

    // For Online or Offline
    if (!isOnline) {
      const fieldsToRemove = [
        "imageProctorStatus",
        "imageProctoringTime",
        "videoStreaming",
        "videoDuration",
        "videoInterval",
        "wrongLoginStatus",
        "noOfWrongLogin",
        "browserExitAlert",
        "noOfBrowserExit",
        "faceRecognition",
        "faceDetection",
        "videoScreensharingProctoringStatus",
        "capturingImageStatus",
        "identityProofStatus",
        "markForReview",
        "questionNavigation",
        "paginationStatus",
        "multipleJobRole",
        "optionRandom",
        "suffleQuestion",
        "colorAndTTSEnabled",
      ];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }

    if (formValues?.isMultiJobRole === "true" && isOnline) {
      const fieldsToRemove = ["qpCode", "level", "version", "jobRole"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }
    if (formValues?.isMultiJobRole === "false" && isOnline) {
      const fieldsToRemove = ["multipleJobRole"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }

    if (formValues.assignAssessorProctor == "") {
      const fieldsToRemove = ["proctorId"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }

    // For assignAssessorProctor true or false
    if (formValues.assignAssessorProctor == "false") {
      const fieldsToRemove = ["accessorId", "proctorId"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    } else if (formValues.assignAssessorProctor == "true") {
      if (formValues.proctorId == "") {
        const fieldsToRemove = ["proctorId"];
        for (const key of fieldsToRemove) {
          delete filteredFormValues[key];
        }
      }
    }

    // For imageProctorStatus true or false
    if (formValues?.imageProctorStatus == "false") {
      const fieldsToRemove = ["imageProctoringTime"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }

    // For wrongLoginStatus true or false
    if (formValues?.wrongLoginStatus == "false") {
      const fieldsToRemove = ["noOfWrongLogin"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }

    // For browserExitAlert true or false
    if (formValues?.browserExitAlert == "false") {
      const fieldsToRemove = ["noOfBrowserExit"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }

    // For videoStreaming true or false
    if (formValues?.videoStreaming == "false") {
      const fieldsToRemove = ["videoDuration", "videoInterval"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }

    if (subSchemeList.length === 0) {
      delete filteredFormValues.subSchemeId;
    }
    if (formValues.examLanguageConduct === "false" || isOnline) {
      const fieldsToRemove = ["secondaryLanguage"];
      for (const key of fieldsToRemove) {
        delete filteredFormValues[key];
      }
    }

    Object.keys(filteredFormValues).forEach((name) => {
      const value = filteredFormValues[name];

      if (!(name === "subSchemeId" && subSchemeList.length === 0)) {
        const fieldError = formValues.assignAssessorProctor 
          ? validateField(name, value, { assignAssessorProctor: formValues.assignAssessorProctor })
          : validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      }

      if (name === "multipleJobRole") {
        formValues?.multipleJobRole?.forEach((item) => {
          const levelError = validateField("level", item?.level);
          const versionError = validateField("version", item?.version);
          if (levelError) formErrors[`${item?.jobRoleId}/level`] = levelError;
          if (versionError)
            formErrors[`${item?.jobRoleId}/version`] = versionError;
        });
      }

      if (
        name !== "secondaryLanguage" ||
        formValues.examLanguageConduct === "true"
      ) {
        const options = {};
        if (formValues.startDate) options.startDate = formValues.startDate;
        if (formValues.assignAssessorProctor) options.assignAssessorProctor = formValues.assignAssessorProctor;
        const fieldError = Object.keys(options).length > 0 
          ? validateField(name, value, options)
          : validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      }
      const len = formValues.sectionTable.some(
        (item) => item.isSelected == true
      );

      formValues.sectionTable
        ?.filter((item) => item.isSelected == true)
        ?.map((item) => {
          Object.keys(item).map((val) => {
            const fieldError = len ? validateField(val, item[val], { len: len }) : validateField(val, item[val]);
            if (fieldError) {
              formErrors[item?.sectionName + val] = fieldError;
            }
          });
        });
      const res = checkValues.find((item) => item.value == name);
      if (res?.value) {
        const options = {};
        if (formValues?.startDate) options.startDate = formValues?.startDate;
        if (formValues?.startTime) options.startTime = formValues?.startTime;
        if (formValues[res?.name] == "true") options.checked = true;
        if (len) options.len = len;
        if (formValues.assignAssessorProctor) options.assignAssessorProctor = formValues.assignAssessorProctor;
        
        const fieldError = Object.keys(options).length > 0 
          ? validateField(name, value, options)
          : validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      } else {
        const options = {};
        if (formValues?.startDate) options.startDate = formValues?.startDate;
        if (formValues?.startTime) options.startTime = formValues?.startTime;
        if (len) options.len = len;
        if (formValues.assignAssessorProctor) options.assignAssessorProctor = formValues.assignAssessorProctor;
        
        const fieldError = Object.keys(options).length > 0 
          ? validateField(name, value, options)
          : validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      }
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      dispatch(
        createBatchApi(
          formattedPayload(filteredFormValues, isOnline),
          setLoading,
          navigate
        )
      );
    }
  };

  // useEffect(() => {
  //   if(formValues?.schemeId || formValues?.jobRole){
  //     dispatch(getAssessorsApi(formValues?.jobRole, formValues?.schemeId));
  //   }
  // }, [formValues?.schemeId, formValues?.jobRole]);

  return (
    <div className="main-content">
      <div className="main-container exam-management-batch-page">
        <div className="title">
          <div className="title-text">
            <ArrowLeft
              onClick={() => navigate(SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE)}
            />
            <h1> Create New Batch</h1>
          </div>
          <div className="view-list-btn">
            <button
              className="view-list-btn-text"
              onClick={() => navigate(SUPER_ADMIN_BATCH_MANAGEMNET_LIST_PAGE)}
            >
              <ListOutlinedIcon
                sx={{ fontSize: "20px", color: "#FFFFFF", mr: 1 }}
              />
              View List
            </button>
          </div>
        </div>
        <BasicDetails
          formValues={basicDetailsFormValues}
          setFormValues={setBasicDetailsFormValues}
          errors={errors}
          setErrors={setErrors}
        />
        {isOnline && (
          <Proctoring
            formValues={proctoringformValues}
            setFormValues={setProctoringFormValues}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        <QuestionPaper
          formValues={questionPaperformValues}
          setFormValues={setQuestionPaperFormValues}
          errors={errors}
          setErrors={setErrors}
          isOnline={isOnline}
        />
        <AssessorProctorAssign
          formValues={assessorProctor}
          setFormValues={setAssessorProctor}
          errors={errors}
          setErrors={setErrors}
        />
        <section className="buttonsBox">
          <div className="action-btn">
            <div className="action-btn-card">
              <Button
                className={`outlined-btn back-btn`}
                onClick={() => {
                  navigate(SUPER_ADMIN_BATCH_LIST_PAGE);
                }}
              >
                Cancel
              </Button>
              <Button
                className={`light-blue-btn  create-btn`}
                variant="contained"
                onClick={handleSubmit}
                disabled={loading ? true : false}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "Submit"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateBatch;
