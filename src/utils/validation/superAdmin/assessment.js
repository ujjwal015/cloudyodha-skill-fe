import { jobRoleValidation, statusValidation } from "./../validationHelper";

const validateField = (name, value) => {
  switch (name) {
    case "assessmentName":
      if (value === "") return "Assessment Name is Required";
      break;
    case "assessmentCode":
      if (value === "") return "Assessment Code is Required";
      break;
    case "totalMarks":
      if (value === "") return "Total Marks Field is Required";
      break;
    case "passingPercentage":
      if (value === "") return "Passing Percentage Field is Required";
      else if (isNaN(value) || value < 1 || value > 100)
        return "Passing Percentage should be between 1 and 100";
      break;
    case "status":
      return statusValidation(value);
    case "jobRole":
      return jobRoleValidation(value);

    default:
      break;
  }
  return "";
};

export default validateField;
