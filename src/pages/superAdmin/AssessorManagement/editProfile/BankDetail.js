import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import SelectInput from "./../../../../components/common/SelectInput";
import Input from "./../../../../components/common/input";
import { getCityListsApi, getStateListsApi } from "./../../../../api/authApi";
import { Button } from "@mui/material";
import { BANKS } from "../../../../config/constants/projectConstant";
import {
  authSelector,
  getCityLists,
} from "./../../../../redux/slicers/authSlice";
import { errorToast, getSchemeType } from "./../../../../utils/projectHelper";
import UserProfile from "./../../../../assets/images/pages/clientManagement/dummy-user-profile.png";
import { ASSESSOR_MANAGEMENT_HOME } from "../../../../config/constants/routePathConstants/superAdmin";
import { RiseLoader } from "react-spinners";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { getAllJobRoles } from "../../../../api/superAdminApi/jobRoleManagement";
import {
  createAssessorBankDetailsApi,
  createAssessorBasicInfoApi,
  createAssessorProfileApi,
  uploadFilesS3Api,
  viewAllAssessorDetailsApi,
} from "../../../../api/superAdminApi/assessorManagement";
import { getClientManagementListsApi } from "../../../../api/superAdminApi/clientManagement";
import axios from "axios";
import { API_ROOT } from "../../../../config/constants/apiConstants/auth";
import { UPLOAD_FILES_S3_API } from "../../../../config/constants/apiConstants/superAdmin";
import { assessorAttendanceSelector, getAssessorBasicDetails, getAssessorPersonalDetails } from "../../../../redux/slicers/superAdmin/assessorAttendanceSlice";

const initialFormValues = () => {
  return {
    bankName: "",
    bankAccount: "",
    bankBranchName: "",
    accountHolderName: "",
    confBankAccount: "",
    bankIFSC: "",
  };
};

const BankDetail = ({schemeType}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const SECTION = location?.search?.split("=")?.["1"];
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues());
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState("");
  const { stateLists = [], cityLists = [] } = useSelector(authSelector);
  const { jobRolesListAll = [] } = useSelector(clientManagementSelector);
  const [jobRoles, setJobRoles] = useState();
  const params = useParams();
  const assessorMDBId = params.id;

  const { assessorBankDetails = [] } = useSelector(assessorAttendanceSelector);

  useEffect(() => {
    if (Object.entries(assessorBankDetails).length > 0) {
      const fetchedDetails = {
        bankName: assessorBankDetails?.bankName || "",
        bankAccount: assessorBankDetails?.bankAccount || "",
        bankBranchName: assessorBankDetails?.bankBranchName || "",
        accountHolderName: assessorBankDetails?.accountHolderName || "",
        bankIFSC: assessorBankDetails?.bankIFSC || "",
      };
      setFormValues({ ...fetchedDetails });
    }
  }, [assessorBankDetails.length]);

  const changeHandler = (event, section) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);
    
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues());
    localStorage.removeItem('bscInf_AsR');
  };

  // const handleSave = (e) => {
  //   e.preventDefault();
  //   const formErrors = {};

  //   Object.keys(formValues).forEach((name) => {
  //     const value = formValues[name];
  //     const fieldError = validateField(name, value);
  //     if (fieldError) {
  //       formErrors[name] = fieldError;
  //     }
  //   });

  //   setErrors(formErrors);

  //   if (Object.keys(formErrors).length === 0) {
  //     setLoading(true);
  //     const edit = true;
  //     dispatch(
  //       createAssessorBankDetailsApi(
  //         setLoading,
  //         assessorMDBId,
  //         formValues,
  //         clearFormValues,
  //         navigate,
  //         edit
  //       )
  //     );
  //   }
  // };

  const handleSave = (e) => {
    e.preventDefault();
    const formErrors = {};

    if(getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY")){
      Object.keys(formValues).forEach((name) => {
        const value = formValues[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);
  
      if (Object.keys(formErrors).length === 0) {
        delete formValues?.confBankAccount;
  
        const edit = false;
        setLoading(true);
        dispatch(
          createAssessorBankDetailsApi(
            setLoading,
            assessorMDBId,
            formValues,
            clearFormValues,
            navigate,
            edit
          )
        );
      }
    }
    else{
      const formError={}
      Object.keys(formValues).forEach((name) => {
        const value = formValues[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formError[name] = fieldError;
        }
      });

      if (Object.keys(formError).length === 0) {
        delete formValues?.confBankAccount;
        const edit = false;
        setLoading(true);
        dispatch(
          createAssessorBankDetailsApi(
            setLoading,
            assessorMDBId,
            formValues,
            clearFormValues,
            navigate,
            edit
          )
        );
      }
      else{
        dispatch(getAssessorBasicDetails({}));
        dispatch(getAssessorPersonalDetails([]));
        localStorage.removeItem('bscInf_AsR');
        navigate(ASSESSOR_MANAGEMENT_HOME);
      }
    } 
  };

  return (
    <>
      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile">
            <div className="PersonalDetail__title">
              <h4>Bank Account Details</h4>
              <p>Add your Bank Account Details</p>
            </div>
            <div className="form-wrapper">
              <div className="form">
                <form>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <SelectInput
                        name="bankName"
                        label="Bank Name"
                        placeHolder="Select Education"
                        value={formValues?.bankName || ""}
                        handleChange={changeHandler}
                        options={BANKS}
                        error={errors?.bankName}
                        mandatory={getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY")}
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Branch Name"
                        name="bankBranchName"
                        placeholder="Enter Branch Name"
                        onFocus={focusHandler}
                        error={errors?.bankBranchName}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.bankBranchName}
                        mandatory={getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY")}
                      />
                    </div>

                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Account Holder Name"
                        type={"text"}
                        name="accountHolderName"
                        placeholder="Enter Account Holder Name"
                        onFocus={focusHandler}
                        error={errors?.accountHolderName}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.accountHolderName}
                        mandatory={getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY")}
                      />
                    </div>

                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Bank Account No"
                        type={"number"}
                        name="bankAccount"
                        placeholder="Enter Bank Account Number"
                        onFocus={focusHandler}
                        error={errors?.bankAccount}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.bankAccount}
                        mandatory={getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY")}
                        hideExponants={true}
                      />
                    </div>

                    {/* <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Confirm Account No"
                        type={"number"}
                        name="confBankAccount"
                        placeholder="Enter Bank Account Number"
                        onFocus={focusHandler}
                        error={errors?.confBankAccount}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.confBankAccount || ""}
                      />
                    </div> */}

                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="IFSC Code"
                        type={"text"}
                        name="bankIFSC"
                        placeholder="Enter IFSC Code"
                        onFocus={focusHandler}
                        error={errors?.bankIFSC}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.bankIFSC}
                        mandatory={getSchemeType(schemeType)?.includes("Non PMKVY") || getSchemeType(schemeType)?.includes("PMKVY")}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="action-btn-card">
        <Button
          className={`outlined-btn`}
          variant="outlined"
          disabled={loading ? true : false}
          onClick={() => {
            navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=${SECTION}`);
          }}
        >
          Cancel
        </Button>
        <Button
          className={`light-blue-btn submit-btn`}
          variant="contained"
          disabled={loading ? true : false}
          onClick={handleSave}
        >
          {loading ? <RiseLoader size="5px" color="white" /> : "Save"}
        </Button>
      </div>
    </>
  );
};

export default BankDetail;

function createFormData(data) {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (let i = 0; i < data[key].length; i++) {
        const subObj = data[key][i];
        for (const subKey in subObj) {
          formData.append(`${key}[${i}][${subKey}]`, subObj[subKey]);
        }
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
}
