import {
  districtValidation,
  pinCodeValidation,
  mobileNumValidation,
  statusValidation,
  stateValidation,
  addressLine1Validation,
  addressLine2Validation,
  startDateValidation,
  endDateValidation,
  addressLineValidation,
  startTimeValidation,
  endTimeValidation,
} from "./../validationHelper";

const validateField = (name, value, options = {}) => {
  const {
    startDate = null,
    startTime = null,
    checked = null,
    len = null,
    endTime = null,
    endDate = null,
    assignAssessorProctor = null,
  } = options;
  switch (name) {
    // Exam Centre
    case "trainingPartner":
      if (value === "") {
        return "Training Partner is Required";
      }
      break;

    case "examCenterName":
      if (value === "") {
        return "Exam Centre Name is Required";
      }
      break;

    case "trainingCenterId":
      if (value === "") {
        return "Training Center Id is required";
      }
      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        return "Training Center Id must be alphanumeric";
      }
      break;

    case "locationURL":
      if (!value) {
        return "Location URL is Required";
      } else {
        // Regular expression to match Google Maps location URL format
        const urlRegex = /^https?:\/\/maps\.app\.goo\.gl\/[a-zA-Z0-9]+$/;
        if (!urlRegex.test(value)) {
          return "Invalid Location URL format";
        }
      }
      break;

    case "email":
      if (!value) {
        return "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        return "Invalid email address";
      } else if (value.trim().length < 5) {
        return "Email must be at least 3 characters";
      } else if (value.trim().length > 50) {
        return "Email must be at most 50 characters";
      }
      break;

    case "mobile":
      if (value !== "") {
        if (value.trim().length !== 10)
          return "Mobile number must be exactly 10 characters";
        else if (!/^[0-9]+$/.test(value)) return "Invalid mobile number";
      } else {
        return "Mobile is required";
      }

      break;

    case "name":
      if (!value) return "Name is required";
      else if (!/^[a-zA-Z\s]+$/.test(value)) {
        return "Name can only contain letters";
      } else if (value.trim().length < 3) {
        return "Name must be at least 3 characters";
      } else if (value.trim().length > 50) {
        return "Name must be at most 50 characters";
      }
      break;
    // Add more cases as needed

    case "examCenterCode":
      if (!value) {
        return "Exam Centre Code is Required";
      } else if (value.trim().length < 3 || value.trim().length >= 8) {
        return "Exam Centre Code must be between 3 and 8 characters";
      }
      break;
    case "mobile":
      return mobileNumValidation(value);
    case "state":
      return stateValidation(value);
    case "district":
      return districtValidation(value);
    case "pincode":
      return pinCodeValidation(value);
    case "address":
      return addressLineValidation(value);
    case "addressLineOne":
      return addressLine1Validation(value);
    case "addressLineTwo":
      return addressLine2Validation(value);
    case "noOfSeats":
      if (!value) return "No. of Seats is Required";
      else if (value.trim().length < 1 || value.trim().length > 4)
        return "Enter a value between 1 and 4 characters";
      break;
    case "status":
      return statusValidation(value);
    // Batch creation
    case "batchId":
      if (value === "") {
        return "Batch ID is Required";
      }
      // else if (!/^[a-zA-Z0-9_]*$/.test(value)) {
      //   return "Batch ID should only contain letters, numbers, and underscores";
      // }
      break;

    case "batchSize":
      if (!value) return "Batch Size is Required";
      // else if (value.trim().length < 1 || value.trim().length > 4)
      else if (value.length < 1 || value.length > 4)
        return "Enter a value between 1 and 4 characters";
      break;
    case "batchMode":
      if (value === "") return "Batch Mode is Required";
      break;
    case "batchName":
      if (value === "") return " Batch Name is Required";
      else if (value.trim().length < 5)
        return "Batch Name must be at least 5 characters";
      break;
    case "schemeId":
      if (!value) return "Scheme is required";
      break;
    // case "subSchemeId":
    //   if (!value) return "Sub-Scheme is required";
    //   break;
    case "assessmentDate":
      if (!value) return "Assessment Date is required";
      break;
    case "startDate":
      return startDateValidation(value, endDate);
    case "endDate":
      return endDateValidation(value, startDate);
    case "startTime":
      return startTimeValidation(value, endTime);
    case "endTime":
      return endTimeValidation(value, startTime);
    case "batchType":
      if (value === "") return " Batch For is Required";
      break;
    case "examCenterId":
      if (value === "") return "Exam Center Name is Required";
      break;
    //create-batch proctoring
    case "imageProctorStatus":
      if (!value) return "Image Proctoring is required";
      break;
    case "imageProctoringTime":
      if (value == "" && checked) return "Image Proctoring Time is required";
      break;
    case "videoStreaming":
      if (!value) return "Video Streaming is required";
      break;
    case "videoDuration":
      if (value == "" && checked) return "Video Duration is required";
      break;
    case "videoScreensharingProctoringStatus":
      if (!value) return "Video Screen Sharing Proctoring is required";
      break;
    case "capturingImageStatus":
      if (!value) return "Capture Image Status is required";
      break;
    case "faceRecognition":
      if (!value) return "Face Recognition is required";
      break;
    case "wrongLoginStatus":
      if (!value) return "Wrong Login Status is required";
      break;
    case "noOfWrongLogin":
      if (value == "" && checked) return "Wrong Login is required";
      else if (isNaN(value) || value <= 0) {
        return "Enter wrong login at least 1";
      }
      break;
    case "attendencePage":
      if (!value) return "Advanced Page is required";
      break;
    case "faceDetection":
      if (!value) return "Face Detection is required";
      break;
    case "browserExitAlert":
      if (!value) return "Browser Exit Alert is required";
      break;
    // case "colorAndTTSEnabled":
    //   if (!value) return "Color contrast and TTS is required";
    //   break;
    case "noOfBrowserExit":
      if (value == "" && checked) {
        return "Suspicious Activity is required";
      } else if (value <= 0) {
        return "Enter browser exit alert at least 1";
      }
      break;
    case "identityProofStatus":
      if (!value) return "Identity Proof Status is required";
      break;
    //Batch creation Question Paper
    case "suffleQuestion":
      if (!value) return "Shuffle Question is required";
      break;
    case "markForReview":
      if (!value) return "Mark Review is required";
      break;
    case "paginationStatus":
      if (!value) return "Pagination Status is required";
      break;
    case "chooseInstructions":
      if (!value) return "Choose Instructions is required";
      break;
    case "primaryLanguage":
      if (!value) return "Language is required";
      break;
    case "secondaryLanguage":
      if (!value) return "Secondary Language is required";
      break;
    case "assessment":
      if (!value) return "Assessment is required";
      break;
    case "qpCode":
      if (!value) return "QP Code is required";
      break;
    case "level":
      if (!value) return "Level is required";
      break;
    case "version":
      if (!value) return "Version is required";
      break;
    case "questionType":
      if (!value) return "Question Type is required";
      break;
    case "optionRandom":
      if (!value) return "Option Randomization is required";
      break;
    case "questionNavigation":
      if (!value) return "Question Navigation is required";
      break;
    case "examLanguageConduct":
      if (!value) return "This field is required";
      break;
    case "secondaryLanguage":
      if (value == "" && checked) return "Secondary Language is required";
      break;
    case "jobRole":
      if (!value) return "Job Role is required";
      break;
    case "sectionTable":
    case "sectionName":
      if (len == false) return "Section is required";
      break;
    case "sectionOrder":
      if (!value) return "Section Order is required";
      break;
    case "examDuration":
      if (!value) {
        return "Exam Duration is required";
      } else if (!/\d{2,}/.test(value)) {
        return "Exam Duration must contain at least two digits";
      }
      break;

    case "assignAssessorProctor":
      if (!value) return "Assign Assessor is required";
      break;
    case "assesmentId":
      if (!value) return "Assessment is required";
      break;
    case "questionSet":
      if (!value) return "Question Set is required";
      break;
    // eslint-disable-next-line no-duplicate-case
    case "status":
      if (!value) return "Status is required";
      break;
    case "passingPercentage":
      if (!value) return "Percentage is required";
      else if(value>100) return "Percentage should be less than or equal to 100"
      break;

    case "assesmentStatus":
      // if (value == null || "" || undefined) {
      //   return "Assessment Status is required";
      // }
      if (!value) return "Assessment Status is required";
      break;
    //Assessor/proctor Assignment
    case "accessorStatus":
      if (!value) return " Assessor Status is required";
      break;
    case "accessorId":
      // Only validate if assignAssessorProctor is true
      if (assignAssessorProctor === "true" || assignAssessorProctor === true) {
        if (!value) return "Assessor Name is required";
      }
      break;
    // case "proctorId":
    //   if (!value) return "Proctor Name is required";
    //   break;
    case "assessorFeePerCandidate":
      // Only validate if assignAssessorProctor is true
      if (assignAssessorProctor === "true" || assignAssessorProctor === true) {
        if (!value || value === "") return "Assessor Fee per Candidate is required";
        if (isNaN(value)) return "Assessor fee must be a number";
        if (Number(value) < 0) return "Assessor fee cannot be negative";
      } else if (value !== "" && value !== undefined) {
        // Only validate format if value is provided when not required
        if (isNaN(value)) return "Assessor fee must be a number";
        if (Number(value) < 0) return "Assessor fee cannot be negative";
      }
      break;
    default:
      break;
  }
  return "";
};

export default validateField;
