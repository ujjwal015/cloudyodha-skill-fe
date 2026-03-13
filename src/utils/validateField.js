import { processWidgets } from "./projectHelper";

const validateField = (
  name,
  value,
  confirmPassword = null,
  oldPassword = null
) => {
  switch (name) {
    case "firstName":
      if (!value) {
        return "First name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        return "First name can only contain letters";
      } else if (value.trim().length < 3) {
        return "First name must be at least 3 characters";
      } else if (value.trim().length > 50) {
        return "First name must be at most 50 characters";
      }
      break;
    case "lastName":
      if (!value) {
        return "Last name is required";
      } else if (!/^[a-zA-Z]+$/.test(value)) {
        return "Last name can only contain letters";
      } else if (value.trim().length < 3) {
        return "Last name must be at least 3 characters";
      } else if (value.trim().length > 50) {
        return "Last name must be at most 50 characters";
      }
      break;
    case "email":
    case "spoke_email":
    case "workEmail":
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
    case "student_email":
      if (!/^$|\S+@\S+\.\S+/.test(value)) {
        return "Invalid email address";
      }
      break;

    case "password":
    case "olDPassword":
      if (!value) {
        return "Password is required";
      }
      break;
    case "oldPassword":
      if (!value) {
        return "Password is required";
      } else if (value.trim().length < 8 || value.trim().length > 20) {
        return "Password must be between 8 and 20 characters";
      } else if (!/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(value)) {
        return "Password must contain at least one letter, one number, and one special character (!@#$%^&*)";
      }
      break;
    case "newPassword":
      if (!value) {
        return "New password is required";
      } else if (value === oldPassword) {
        return "New password must not be the same as the old password";
      } else if (value.trim().length < 8 || value.trim().length > 20) {
        return "New password must be between 8 and 20 characters";
      } else if (!/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(value)) {
        return "New password must contain at least one letter, one number, and one special character (!@#$%^&*)";
      }
      break;
    case "confirmPassword":
    case "confirmNewPassword":
      if (!value) {
        return "Confirm New password is required";
      } else if (value !== confirmPassword) {
        return "New Password do not match";
      }
      break;
    case "userType":
      if (!value) {
        return "User type is required";
      } else if (typeof value !== "number") {
        return "User type must be a number";
      }
      break;
    case "userRoleName":
      if (!value) {
        return "User role name is required";
      } else if (!value?.trim()) {
        return "User role name can't start from space";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        return "User role name must be contain alphanumeric";
      }

      break;
    case "userName":
      if (!value) {
        return "User name is required";
      } else if (
        !/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/|\-]*$/.test(value)
      ) {
        return "User name must be contain Alphanumeric with Special Characters";
      }
      break;
    case "userRoleType":
      value?.map((item) => {
        if (item === "") {
          return "Role type is required";
        }
      });

      // if (!value.userRoleType) {
      //   return "Role type is required";
      // }
      break;
    case "userClientName":
      if (!value) {
        return "Client Name is required";
      }
      break;
    case "mobile":
    case "spoke_mobile":
    case "phoneNumber":
    case "homeNumber":
    case "workNumber":
      if (name === "mobile") {
        if (!value) return "Mobile number is required";
        else if (value.trim().length !== 10) return "Invalid mobile number";
        else if (!/^[6-9][0-9]{9}$/g.test(value)) {
          return "Invalid mobile number";
        }
      } else if (name === "spoke_mobile") {
        if (value !== "") {
          if (value.trim().length !== 10)
            return "Mobile number must be exactly 10 characters";
          else if (!/^[0-9]+$/.test(value)) return "Invalid mobile number";
        }
      } else if (name === "homeNumber") {
        if (!value) return "Mobile number is required";
        else if (value.trim().length !== 10) return "Invalid mobile number";
        else if (!/^[6-9](?!.*(\d)\1{4})[0-9]{9}$/g.test(value)) {
          return "Invalid mobile number";
        }
      } else if (name === "phoneNumber") {
        if (!value) return "Mobile number is required";
        else if (value.trim().length !== 10) return "Invalid mobile number";
        else if (!/^[6-9](?!.*(\d)\1{4})[0-9]{9}$/g.test(value)) {
          return "Invalid mobile number";
        }
      } else if (name === "workNumber") {
        if (!value) return "Mobile number is required";
        else if (value.trim().length !== 10) return "Invalid mobile number";
        else if (!/^[6-9](?!.*(\d)\1{4})[0-9]{9}$/g.test(value)) {
          return "Invalid mobile number";
        }
      }

      break;
    case "landLine":
      if (value) {
        if (!/\d{2,5}([- ]*)\d{6}/.test(value)) {
          return "Invalid telephone number";
        }
      }
      break;
    case "spoke_department":
      if (!value) return "Department is required";
      break;
    case "spoke_name":
      if (!value) return "Name is required";
      else if (!/^[a-zA-Z\s]+$/.test(value)) {
        return "Name can only contain letters";
      } else if (value.trim().length < 3) {
        return "Name must be at least 3 characters";
      } else if (value.trim().length > 50) {
        return "Name must be at most 50 characters";
      }
      break;
    case "acceptTermCondition":
      if (!value) {
        return "You must accept the terms and conditions";
      }
      break;
    case "gender":
      if (!value) {
        return "Gender is required";
      }
      break;

 case "assessorType":
      if (!value) {
        return "Assessor Type is required";
      }
      break;

      
    case "fatherName":
      if (!value) {
        return "Father Name is required";
      }
      break;
    case "organisationName":
      if (!value) {
        return false;
      } else {
        if (!/^[a-zA-Z0-9\s]+$/.test(value))
          return "Organization name only contain alpha numeric";
      }
      break;
    case "userRole":
      if (!value) {
        return "User role is required";
      }
      break;

    case "status":
      if (!value) {
        return "Status is required";
      }
      break;
    case "address":
      if (!value) {
        return "Address is required";
      }
      break;
    case "country":
      if (!value) {
        return "Country is required";
      }
      break;
    case "state":
    case "currentState":
    case "permanentState":
      if (!value) {
        return "State is required";
      }
      break;
    case "city":
    case "currentCity":
    case "permanentCity":
      if (!value) {
        return "City is required";
      }
      break;
    case "uploaded_file":
      if (!value) {
        return "File is required";
      }
      break;
    case "pincode":
    case "currentPinCode":
    case "permanentPinCode":
      if (!value) {
        return "Pincode is required";
      } else if (value.trim().length !== 6) {
        return "Pincode must be exactly 6 digits";
      } else if (!/^[0-9]+$/.test(value)) {
        return "Invalid pin code";
      }
      break;

    case "currentStreet":
    case "permanentStreet":
      if (!value) {
        return "Street is required";
      }
      break;

    // get-otp validations

    case "otp":
      if (!value) {
        return "Please enter OTP";
      } else if (value.trim().length !== 6) {
        return "OTP must be exactly 6 digits";
      }
      break;

    case "schemeName":
    case "schemeId":
      if (name === "schemeId") {
        if (!value.trim()) {
          return "Scheme name is required";
        }
      } else if (name === "schemeName") {
        if (!value.trim()) {
          return "Scheme name is required";
        }
      }

      // else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
      //   return "Scheme can contain only alpha numeric"
      // }
      break;

    case "schemeCode":
      if (!value.trim()) {
        return "Scheme code is required";
      } else if (value.trim().length > 10)
        return " Scheme code accept maximum 10 characters";
      break;

    //sub-scheme management

    case "subSchemeName":
      if (!value.trim()) {
        return "Sub-scheme name is required";
      }
      break;
    case "subSchemeCode":
      if (!value.trim()) {
        return "Sub-scheme code is required";
      } else if (value.trim().length > 10)
        return " Sub-scheme code accept maximum 10 characters";
      break;

    case "clientName":
    case "clienId":
    case "clientname":
      if (value === "") return "Client Name is required";
      else if (!/^[a-zA-Z&-\s,']+$/.test(value)) {
        return "Invalid Characters";
      }
      break;
    case "clientcode":
      if (value === "") return "Client Code is required";
      else if (!/^[a-zA-Z0-9-]+$/.test(value)) {
        return "Invalid Characters";
      }
      break;
    case "organisationType":
      if (value === "") return "Organisation type is required";
      break;
    case "qpCode":
      if (value?.trim() === "") return "QPCode type is required";
      else if (value?.trim()?.length > 25){
        return "QPCode must be at most 25 characters long";
      }
      break;
    case "code":
      if (!value?.trim()) return "QP code is required";
      else if (!/^[a-zA-Z0-9\/-]+$/.test(value)) {
        return "Invalid Characters";
      }
      break;

    //question Bank form (Blueprint)

    case "version":
      if (!value.trim()) {
        return "Version is required";
      } else if (!/^-?\d+(\.\d+)?$/.test(value)) {
        return "Invalid version";
      }
      break;

    // instruction

    case "instructionName":
      if (!value.trim()) {
        return "Instruction name is required";
      } else if (!/^[a-zA-Z0-9\-]+$/.test(value)) {
        return "Invalid instruction name";
      }
      break;

    case "hindiInstructionText":
      if (!value) {
        return "Hindi instruction text is required";
      }
      break;
    case "englishInstructionText":
      if (!value) {
        return "English instruction text is required";
      }
      break;
    case "selectedLanguage":
      if (value === "") {
        return "Select language";
      }
      break;

    // Remarks on lead management

    case "remarks":
      if (!value) {
        return "Please enter remarks";
      }
      break;

    // ======== create questionbank form  validations [start] =======
    case "questionBankName":
      if (value === "") return "Provide Question Bank Name";
    case "questionType":
      if (value === "") return "Provide question type";
    case "jobRole":
      if (value === "") return "Job Role is required";
      break;
    case "jobroleId":
      if (!value?.trim()) return "Job Role is required";
      else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        return "Invalid Characters";
      }
      break;

    case "jobLevel":
      if (!value?.trim()) {
        return "Job level is required";
      }

      break;
    case "code":
      if (value === "") return "Provide Code";
      break;
    case "nos":
      if (value === "") return "NOS name is required";
      break;
    case "nosCode":
      if (value === "") return "Provide NOS Code";
      break;
    case "theoryMarks":
      if (value === "") return "Provide Theory Marks";
      break;
    case "practicalMarks":
      if (value === "") return "Provide Question Bank ID";
      break;
    case "questionbankID":
      if (value === "") return "Provide Practical Marks";
      break;
    case "status":
      if (value === "") return "Select Status";
      break;
    // ======== create questionbank form  validations [end] =======
    case "question_bank_id":
      if (value === "") return "Select Question Bank ID";
      break;
    case "section":
      if (value === "") return "Section is required";
      break;
    case "performanceCriteria":
      if (value === "") return "Enter Performance Criteria";
      break;
    case "language":
      if (value === "") return "Select language";
      break;
    // ========= Section Details form validations [start]========
    case "diffculityLevel":
    case "difficulty_level":
      if (value == "" || undefined || null) {
        return "Select Difficulty Level";
      }
      break;
    case "questionMarks":
    case "marks":
      if (value === "" || undefined) return "Enter Marks";
      break;
    case "correctAnswer":
    case "answer":
      if (value === "" || undefined) return "Provide Correct Answer";
      break;
    case "questionText":
      if (value === "" || undefined) return "Question Field is Required";
      else if (value === "<p><br></p>") return "Question Field is Required";
      break;
    case "title":
      if (value === "" || undefined) return "Option Field is Required";
      break;
    // =========[ Create Question Validations start]===========
    case "01":
      if (value === "" || undefined) return "Enter Option Title";
      break;
    //=======ASSESSMENT VALIDATIONS=========
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

    // -----------------------create assessor form validation start---------------------------------------
    case "dob":
      if (!value || undefined) return "Date of birth is required";
      break;

    case "address":
      if (value === "" || undefined) return "Address is required";
      break;
    case "district":
      if (value === "" || undefined) return "District is required";
      break;
    case "experience":
      if (value === "" || undefined) return "Experience is required";
      break;
    case "qualification":
      if (value === "" || undefined) {
        return "Qualification is required";
      } else if (value.trim().length < 3) {
        return "Qualification contain at least 3 alphabet";
      }
      break;
    case "sscCertified":
      if (value === "" || undefined) return "SSC certified is required";
      break;
    case "agreementSigned":
      if (value === "" || undefined) return "Agreement signed is required";
      break;
    case "pinCode":
    case "pincode":
      if (!value) {
        return "Pin code is required";
      } else if (value.trim().length !== 6) {
        return "Pin Code must be exactly 6 digits";
      } else if (!/^[0-9]+$/.test(value)) {
        return "Invalid pin Code";
      }
      break;
    case "aadharNo":
      if (value === "" || undefined) {
        return "Aadhar no is required";
      } else if (value.trim().length !== 12) {
        return "Aadhar No must be exactly 12 digits";
      }
      break;
    // case "panCard":
    case "panCardNo":
      if (value === "" || undefined) {
        return "Pan card no is required";
      } else if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(value)) {
        return "Invalid PAN card no";
      }
      break;
    case "createdDate":
      if (value === "" || undefined) {
        return " Create date is required";
      }
      break;
    // case "sector":
    //   if (value === "" || undefined) {
    //     return "Sector is required";
    //   }
    //   break;
    case "education":
      if (value === "" || undefined) return "Education is required";
      break;
    case "cv":
      if (value === "" || undefined) return "CV is required";
      break;
    case "bankName":
      if (value === "" || undefined) return "Bank Name is required";
      break;
    case "bankAccount":
      if (value === "" || undefined) return "Bank Account Number is required";
      else if (!/^[0-9]{9,18}$/.test(value)) {
        return "Bank Account Number is invalid";
      }
      break;
    case "confBankAccount":
      if (value === "" || undefined) return "Bank Account Number is required";
      else if (!/^[0-9]{9,18}$/.test(value)) {
        return "Bank Account Number is invalid";
      }
      break;
    case "bankIFSC":
      if (value === "" || undefined) return "Bank IFSC is required";
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim())) {
        return "Invalid IFSC code";
      }
      break;
    case "sipId":
      if (value === "" || undefined) return "SIP ID is required";
      else if (!/[a-zA-Z0-9_]$/.test(value)) {
        return "Invalid SIP ID";
      }
      break;
    case "sipValidity":
      if (value === "" || undefined) return "SIP Validity is required";
      break;
    case "sipCertificate":
      if (value === "" || undefined) return "SIP Certificate is required";
      break;
    // case "agreementValidity":
    //   if (value === "" || undefined) return "Agreement Validity is required";
    //   break;
    // case "agreementCertificate":
    //   if (value === "" || undefined) return "Agreement Certificate is required";
    //   break;
    // case "assessorPhoto":
    //   if (value === "" || undefined) return "Assessor Photo is required";
    //   break;
    case "educationCertificate":
      if (value === "" || undefined) return "Education Certificate is required";
      break;
    case "experienceCertificate":
      if (value === "" || undefined)
        return "Experience Certificate is required";
      break;
    case "aadharCard":
      if (value === "" || undefined)
        return "Aadhar Card attachment is required";
      break;
    case "panCard":
      if (value === "" || undefined) return "PAN Card attachment is required";
      break;
    case "highSchoolCertificate":
      if (value === "" || undefined) return "Certificate is required";
      break;
    //==========[Assign Batch Validations]======================
    case "batchId":
      if (value === "") return "Select Batch Name";
      break;
    case "assessmentId":
      if (value === "") return "Select Assessment Name";
      break;
    // --------------------------------User Management--------------------------------

    case "":
      if (value === "") {
        return "User name is required";
      }
      break;

    // --------------------------------Exam Management--------------------------------
    // assign batch increase time
    case "examTime":
      if (value === "") {
        return "Exam Time Duration is required";
      } else if (value > 1440) {
        return "Exam Time Duration must not exceed 1440 minutes (24 hours)";
      }
      break;

    case "reasonToIncreaseExamTime":
      if (value === "") {
        return "Reasons is required";
      } else if (value.length > 50) {
        return "Reasons should not exceed 50 characters";
      }
      break;
    // Proctor Validation
    case "proctorName":
      if (value === "") return "Enter Name";
      break;
    case "modeofAgreement_filter":
      if (value === "") return "Select Mode";
      break;
    case "from":
      if (value === "") return "Select Date";
      break;
    case "to":
      if (value === "") return "Select Date";
      break;
    case "clientName_JR":
      if (value === "") return "Select Client";
      break;
    // Assessor New Flow -->
    case "designation":
      if (value === "") return "Enter Designation";
      break;
    case "companyName":
      if (value === "") return "Enter Company Name";
      break;
    case "fullName":
      if (value === "") return "Enter Full Name";
      break;
    case "modeofAgreement":
      if (value === "") return "Select Assessor Mode";
      break;

    case "ToaType":
      if (value === "") {
        return "TOA Type is required";
      }
      break;

    case "RadiantFundToa":
      if (value === "") {
        return "Select one option";
      }
      break;
    // send Reminder erros
    case "addNewMsg":
      if (!value) {
        return "Message is required";
      }
      break;

    case "reminderNo":
      if (!value) {
        return "Set reminder no.";
      }
      break;
    case "startDate":
      if (!value) {
        return "Enter Start Date";
      }
      break;

    // Assessor onboarding documents errors
    case "agreementName":
      if (!value) return "Enter Agreement Name";
      break;
    case "agreementValidFrom":
      if (!value) return "Enter Start Date";
      break;
    case "agreementCertificate":
      if (!value) return "Select Certificate File";
      break;
    case "collegeName":
      if (!value) return "Enter School/College Name";
      break;
    case "degree":
      if (!value) return "Enter Degree Name";
      break;
    case "jobroleName":
      if (!value) return "Select Jobrole";
      break;
    case "issueDate":
      if (!value) return "Select Start Date";
      break;
    case "jobRoleCertificate":
      if (!value) return "Select Jobrole Certificate";
      break;
    case "accountHolderName":
      if (!value) return "Enter Account Holder Name";
      break;
    case "bankBranchName":
      if (!value) return "Enter Branch Name";
      break;

    // profile validation

    case "maritalStatus":
      if (!value) {
        return "Enter marital status";
      }
      break;
    case "dashboardName":
      if (!value) {
        return "Enter dashboard name";
      }
      break;

    case "widgets":
      if (value?.length === 0) {
        return "Select any one widgets";
      } else if (processWidgets(value)?.length > 4) {
        return "You can select up to 4 widgets";
      }
      break;
    case "graphs":
      if (value?.length === 0) {
        return "Select any one graphs";
      }
      break;
    case "table":
      if (value?.length === 0) {
        return "Select any one table";
      }
      break;
    case "assignedDashboard":
      if (!value) {
        return "Select dashboard";
      }
      break;
    case "reportinManager":
      if (!value) {
        return "Select Reporting Manager";
      }
      break;
    case "bloodGroup":
      if (!value) {
        return "Enter blood group";
      }
      break;
    case "nationality":
      if (!value) {
        return "Enter natinality";
      }
      break;
    case "street":
      if (!value) {
        return "Enter street";
      }
      break;
    case "teamsId":
      if (!value) {
        return "Enter team Id";
      }
      break;
    default:
  }

  return "";
};

export default validateField;
