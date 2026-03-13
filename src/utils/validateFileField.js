const validateFileField = (
    name,
    value,
  ) => {
      console.log("name---------->", name, value)
    switch (name) {
      case "highSchoolCertificate":
        if (value && !(value.size || value.highSchoolCertificateSize))
          return "Certificate is required";
        break;
  
        case "experienceCertificate":
          if (value && !(value.size || value.experienceCertificateSize))
            return "Experience Certificate is required";
          break;
          case "aadharCard":
        if (value && !(value.size || value.aadharCertificateSize))
          return "Aadhar Card attachment is required";
        break;
      case "panCard":
        if (value && !(value.size || value.panCardCertificateSize))
          return "PAN Card attachment is required";
        break;
        case "cv":
            if (value && !(value.size || value.cvCertificateSize)) return "CV is required";
            break;
      default:
        break;
    }
    return "";
  };
  
  export default validateFileField;
  