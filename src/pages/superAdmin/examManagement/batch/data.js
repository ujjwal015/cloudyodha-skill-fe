import moment from "moment";
import { checkTimeFormat } from "../../../../utils/projectHelper";

export const groupItems = [
  {
    name: true,
    label: "Enable",
  },
  {
    name: false,
    label: "Disable",
  },
];
export const languageStatus = [
  {
    label: "Primary",
    value: "primary",
  },
  {
    label: "Secondary",
    value: "secondary",
  },
];

export const yesNo = [
  {
    name: true,
    label: "Yes",
  },
  {
    name: false,
    label: "No",
  },
];

export const clientType = [
  {
    name: "ssc",
    label: "SSC",
  },
  {
    name: "private",
    label: "Private",
  },
];

export const JOBROLES = [
  {
    name: "Retail Store Manager",
    label: "Retail Store Manager",
  },
  {
    name: "Sales Supervisor",
    label: "Sales Supervisor",
  },
  {
    name: "Retail Sales Associate",
    label: "Retail Sales Associate",
  },
];

export const ASSESSMENTSTATUS = [
  {
    name: true,
    label: "Start",
  },
  {
    name: false,
    label: "Stop",
  },
];

export const BATCHMODE = [
  {
    label: "online",
    value: "online",
  },
  {
    label: "offline",
    value: "offline",
  },
];

const convertBoolean = (value) => {
  return value == "true" ? true : false;
};
export const convertString = (value) => {
  return value == true ? "true" : "false";
};

export function convertToLowerCase(inputString) {
  return inputString.toLowerCase();
}

export const unFormattedPayload = (formValues) => {
  return {
    //Basic Details
    // basicDetails: {
    //   batchId: formValues?.batchId,
    //   startDate: moment(formValues?.startDate, "DD/MM/YYYY").toDate(),
    //   endDate: moment(formValues?.endDate, "DD/MM/YYYY").toDate(),
    //   startTime: formValues?.startTime,
    //   endTime: formValues?.endTime,
    //   examCenterId: formValues?.examCenterId,
    //   batchMode: formValues?.batchMode,
    //   batchSize: formValues?.batchSize.toString(),
    //   schemeId: formValues?.schemeId,
    //   subSchemeId: formValues?.subSchemeId,
    // },
    //Proctoring
    // proctoring: {
    //   imageProctorStatus: convertString(
    //     formValues?.proctoring?.imageProctor?.imageProctorStatus
    //   ),
    //   imageProctoringTime:
    //     formValues?.proctoring?.imageProctor?.imageProctoringTime, //need to check
    //   videoStreaming: convertString(
    //     formValues?.proctoring?.videoStream?.videoStreaming
    //   ),
    //   videoDuration: formValues?.proctoring?.videoStream?.videoDuration, //need to check
    //   videoInterval: formValues?.proctoring?.videoStream?.videoInterval,
    //   wrongLoginStatus: convertString(
    //     formValues?.proctoring?.wrongLogin?.wrongLoginStatus
    //   ),
    //   noOfWrongLogin:
    //     formValues?.proctoring?.wrongLogin?.noOfWrongLogin?.toString(),
    //   browserExitAlert: convertString(
    //     formValues?.proctoring?.browserExit?.browserExitAlert
    //   ), //need to check
    //   noOfBrowserExit:
    //     formValues?.proctoring?.browserExit?.noOfBrowserExit?.toString(), //need to check
    //   faceRecognition: convertString(formValues?.proctoring?.faceRecognition),
    //   faceDetection: convertString(formValues?.proctoring?.faceDetection),
    //   videoScreensharingProctoringStatus: convertString(
    //     formValues?.proctoring?.videoScreensharingProctoringStatus
    //   ),
    //   capturingImageStatus: convertString(
    //     formValues?.proctoring?.capturingImageStatus
    //   ),
    //   identityProofStatus: convertString(
    //     formValues?.proctoring?.identityProofStatus
    //   ),
    // },
    // Question Paper
    // questionPaper: {
    //   suffleQuestion: convertString(formValues?.questionPaper?.suffleQuestion),
    //   optionRandom: convertString(formValues?.questionPaper?.optionRandom),
    //   markForReview: convertString(formValues?.questionPaper?.markForReview),
    //   questionNavigation: convertString(
    //     formValues?.questionPaper?.questionNavigation
    //   ),
    //   paginationStatus: convertString(
    //     formValues?.questionPaper?.paginationStatus
    //   ),
    //   examLanguageConduct: convertString(
    //     formValues?.questionPaper?.examLanguageConduct
    //   ),
    //   chooseInstructions: formValues?.questionPaper?.chooseInstructions,
    //   primaryLanguage: formValues?.questionPaper?.primaryLanguage,
    //   secondaryLanguage: convertToLowerCase(
    //     formValues?.questionPaper?.secondaryLanguage
    //   ),
    //   questionSet: convertString(formValues?.questionPaper?.questionSet),
    //   assesmentStatus: convertString(
    //     formValues?.questionPaper?.assesmentStatus
    //   ),
    //   status: convertString(formValues?.questionPaper?.status),
    //   sectionTable: formValues?.questionPaper?.sectionTable,
    //   jobRole: formValues?.jobRole,
    //   passingPercentage: formValues?.questionPaper?.passingPercentage,
    //   questionType: formValues?.questionPaper?.questionType,
    //   qpCode: formValues?.questionPaper?.qpCode,
    //   level: formValues?.questionPaper?.level,
    //   questionSet: formValues?.questionPaper?.questionSet,
    //   version: formValues?.questionPaper.version,
    // },
    //accessor
    // accessor: {
    //   assignAssessorProctor: convertString(formValues?.assignAssessorProctor),
    //   accessorId: formValues?.accessorId,
    //   clientId: formValues?.clientId,
    //   financeRemarks: formValues?.financeRemarks,
    //   proctorId: formValues?.proctorId,
    // },
  };
};

export const formattedPayload = (formValues, isOnline) => {
  return {
    batchSize: formValues.batchSize,
    batchId: formValues.batchId,
    startDate: moment(formValues.startDate).format("DD/MM/YYYY"),
    endDate: moment(formValues.endDate).format("DD/MM/YYYY"),
    startTime: checkTimeFormat(formValues.startTime),
    endTime: checkTimeFormat(formValues.endTime),
    examCenterId: formValues.examCenterId,
    schemeId: formValues.schemeId,
    subSchemeId: formValues.subSchemeId,
    batchMode: formValues.batchMode,
    proctoring: {
      imageProctor: {
        imageProctorStatus: formValues.imageProctorStatus,
        imageProctoringTime: formValues.imageProctoringTime,
      },
      videoStream: {
        videoStreaming: formValues.videoStreaming,
        videoDuration: formValues.videoDuration,
        videoInterval: formValues.videoInterval,
      },
      wrongLogin: {
        wrongLoginStatus: formValues.wrongLoginStatus,
        noOfWrongLogin: formValues.noOfWrongLogin,
      },
      browserExit: {
        browserExitAlert: formValues.browserExitAlert,
        noOfBrowserExit: formValues.noOfBrowserExit,
      },
      isAutoLogout: formValues.isAutoLogout,
      faceRecognition: formValues.faceRecognition,
      faceDetection: formValues.faceDetection,
      videoScreensharingProctoringStatus:
        formValues.videoScreensharingProctoringStatus,
      capturingImageStatus: formValues.capturingImageStatus,
      identityProofStatus: formValues.identityProofStatus,
    },
    questionPaper: {
      suffleQuestion: formValues.suffleQuestion,
      optionRandom: formValues.optionRandom,
      markForReview: isOnline ? formValues.markForReview : false,
      questionNavigation: isOnline ? formValues.questionNavigation : false,
      paginationStatus: isOnline ? formValues.paginationStatus : false,
      examLanguageConduct: formValues.examLanguageConduct,
      primaryLanguage: formValues.primaryLanguage,
      secondaryLanguage: formValues.secondaryLanguage,
      questionSet: formValues.questionSet,
      assesmentStatus: formValues.assesmentStatus,
      questionType: formValues.questionType,
      sectionTable: formValues.sectionTable,
      passingPercentage: formValues.passingPercentage,
      chooseInstructions: formValues.chooseInstructions,
      level: formValues?.level,
      qpCode: formValues?.qpCode,
      version: formValues?.version,
      isMultiJobRole: formValues?.isMultiJobRole === "false" ? false : true,
      multipleJobRole: formValues?.multipleJobRole,
      colorAndTTSEnabled: formValues?.colorAndTTSEnabled,
    },
    jobRole: formValues?.jobRole,
    clientId: formValues.clientId,
    assignAssessorProctor: formValues.assignAssessorProctor,
    accessorId: formValues.accessorId,
    proctorId: formValues.proctorId,
    assessorFeePerCandidate: formValues.assessorFeePerCandidate,
    batchStartDate: moment(formValues?.batchStartDate).format("DD/MM/YYYY"),
    batchEndDate: moment(formValues?.batchEndDate).format("DD/MM/YYYY"),
  };
};
