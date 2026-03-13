const validateFieldQST = (name, value, confirmPassword = null, oldPassword = null) => {
    switch (name) {
      case "questionBankName":
        // console.log(value, value.length)
        if (value.length>9) return "Name size must be less than 10"
      default:
        break;
    }
    return "";
  };
  
  export default validateFieldQST;
  