export const firstNameValidation = (value) => {
  if (!value) {
    return "First name is required";
  } else if (!/^[a-zA-Z]+$/.test(value)) {
    return "First name can only contain letters";
  } else if (value.trim().length < 3) {
    return "First name must be at least 3 characters";
  } else if (value.trim().length > 50) {
    return "First name must be at most 50 characters";
  }
};

export const lastNameValidation = (value) => {
  if (!value) {
    return "Last name is required";
  } else if (!/^[a-zA-Z]+$/.test(value)) {
    return "Last name can only contain letters";
  } else if (value.trim().length < 3) {
    return "Last name must be at least 3 characters";
  } else if (value.trim().length > 50) {
    return "Last name must be at most 50 characters";
  }
};

export const emailValidation = (value) => {
  if (!value) {
    return "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(value)) {
    return "Invalid email address";
  } else if (value.trim().length < 5) {
    return "Email must be at least 3 characters";
  } else if (value.trim().length > 255) {
    return "Email must be at most 255 characters";
  }
};

export const passwordValidation = (value) => {
  if (!value) {
    return "Password is required";
  } else if (value.trim().length < 8 || value.trim().length > 20) {
    return "Password must be between 8 and 20 characters";
  } else if (!/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(value)) {
    return "Password must contain at least one letter, one number, and one special character (!@#$%^&*)";
  }
};

export const newPasswordValidation = (value, oldPassword) => {
  if (!value) {
    return "New password is required";
  } else if (value === oldPassword) {
    return "New password must not be the same as the old password";
  } else if (value.trim().length < 8 || value.trim().length > 20) {
    return "New password must be between 8 and 20 characters";
  } else if (!/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(value)) {
    return "New password must contain at least one letter, one number, and one special character (!@#$%^&*)";
  }
};

export const confirmPasswordValidation = (value, confirmPassword) => {
  if (!value) {
    return "Confirm password is required";
  } else if (value !== confirmPassword) {
    return "Passwords do not match";
  }
};

export const userTypeValidation = (value) => {
  if (!value) {
    return "User type is required";
  } else if (typeof value !== "number") {
    return "User type must be a number";
  }
};

export const mobileNumValidation = (value) => {
  if (!value) {
    return "Mobile number is required";
  } else if (value.trim().length !== 10) {
    return "Mobile number must be exactly 10 characters";
  } else if (!/^[0-9]+$/.test(value)) {
    return "Invalid mobile number";
  }
};

export const pinCodeValidation = (value) => {
  if (!value) {
    return "Pincode is required";
  } else if (value.trim().length !== 6) {
    return "Pincode must be exactly 6 digits";
  } else if (!/^[0-9]+$/.test(value)) {
    return "Invalid pincode";
  }
};

export const genderValidation = (value) => {
  if (!value) return "Gender is required";
};

export const addressLineValidation = (value) => {
  if (!value) return "Address Line is required";
};

export const addressLine1Validation = (value) => {
  if (value === "") return "Address Line 1 is Required";
};

export const addressLine2Validation = (value) => {
  if (value === "") return "Address Line 2 is Required";
};

export const countryValidation = (value) => {
  if (!value) return "Country is required";
};

export const stateValidation = (value) => {
  if (!value) return "State is required";
};
export const districtValidation = (value) => {
  if (!value) return "District is required";
};

export const cityValidation = (value) => {
  if (!value) return "City is required";
};

export const statusValidation = (value) => {
  if (value === "") return "Status is required";
};

export const jobRoleValidation = (value) => {
  if (value === "") return "Job Role is required";
};

export const startDateValidation = (value, endDate) => {
  if (!value) return "Start Date is required";
  else if (value === "Invalid Date") return "Start Date is required";
  else if (endDate) {
    if (endDate && new Date(value) > new Date(endDate)) {
      return "Start Date must be before or equal to End Date";
    } else {
      return null; // No error
    }
  }
};

export const endDateValidation = (value, startDate) => {
  if (!value || value === "Invalid Date") {
    return "End Date is required";
  } else if (startDate && new Date(value) < new Date(startDate)) {
    return "End Date must be after or equal to Start Date";
  } else {
    return null; // No error
  }
};

export const startTimeValidation = (value, endTime) => {
  // console.log(endTime, "endTime");
  if (!value) return "Start Time is required";
  else if (value === "Invalid Date") return "Start Time is invalid";
  else if (endTime) {
    const startTimeObj = new Date(`1970-01-01T${value}`);
    const endTimeObj = new Date(`1970-01-01T${endTime}`);

    if (endTimeObj < startTimeObj) {
      return "Start Time must be before End Time";
    }
    /* 
    if (!startTimeObj < endTimeObj) {
      return "Start Time must be before End Time";
    } */
    return null;
  }
};

export const endTimeValidation = (value, startTime) => {
  if (!value || value === "Invalid Date") {
    return "End Time is required";
  } else if (startTime) {
    const startTimeObj = new Date(`1970-01-01T${startTime}`);
    const endTimeObj = new Date(`1970-01-01T${value}`);

    // if (endTimeObj < startTimeObj) {
    //   return "End Time must be after Start Time";
    // }
    if (startTimeObj > endTimeObj) {
      return "End Time must be after Start Time";
    }
  }
  return null; // No error
};
