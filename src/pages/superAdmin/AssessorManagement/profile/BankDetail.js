import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import SelectInput from "./../../../../components/common/SelectInput";
import Input from "./../../../../components/common/input";
import { getCityListsApi, getStateListsApi } from "./../../../../api/authApi";
import { Button } from "@mui/material";
import { BANKS } from "../../../../config/constants/projectConstant";
import { authSelector, getCityLists } from "./../../../../redux/slicers/authSlice";
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
} from "../../../../api/superAdminApi/assessorManagement";
import { getClientManagementListsApi } from "../../../../api/superAdminApi/clientManagement";
import axios from "axios";
import { API_ROOT } from "../../../../config/constants/apiConstants/auth";
import { UPLOAD_FILES_S3_API } from "../../../../config/constants/apiConstants/superAdmin";
import {
  assessorAttendanceSelector,
  getAssessorBasicDetails,
  getAssessorPersonalDetails,
} from "../../../../redux/slicers/superAdmin/assessorAttendanceSlice";

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

const BankDetail = ({ schemeType,handleClearScheme }) => {
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
  const assessorMDBId = localStorage.getItem("bscInf_AsR");
  const { assessorBankDetails = [] } = useSelector(assessorAttendanceSelector);

  // useEffect(() => {
  //   if (Object.entries(assessorBankDetails).length > 0) {
  //     setFormValues({ ...assessorBankDetails });
  //   }
  // }, [assessorBankDetails.length]);

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

  // const sendData = (data) => {
  //   const sipFormArr = data?.sipDetails;
  //   const sipDoc = sipFormArr.map((el) => {
  //     return el.sipCertificate;
  //   });
  //   const promiseArr = sipDoc.map((file, index) => {
  //     const formData = new FormData();
  //     formData.append(`sipCertificate`, file);
  //     formData.append("jobRoleId", sipFormArr?.[index]?.jobroleId);
  //     // return dispatch(uploadFilesS3Api(formData));
  //     const localData = window.localStorage.getItem("token");
  //     return axios.post(`${API_ROOT}${UPLOAD_FILES_S3_API}`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         "X-Auth-Token": localData,
  //       },
  //     });
  //   });
  //   Promise.all(promiseArr)
  //     .then((res) => {
  //       const responseArr = res.map((el) => {
  //         return el?.data?.details;
  //       });
  //       return Promise.all(responseArr);
  //     })
  //     .then((dataArray) => {
  //       const sipCopy = [...sipFormArr];
  //       const updatedSIPArr = sipCopy.map((el, index) => {
  //         const newDetail = {
  //           jobroleId: el?.jobroleId,
  //           sipCertificateKey: dataArray?.[index]?.sipCertificateKey,
  //           sipValidity: el?.sipValidity,
  //           jobroleName: el?.jobRoleName,
  //           sipCertificateName: el?.sipCertificateName,
  //         };
  //         return newDetail;
  //       });
  //       const newData = { ...data, sipDetails: updatedSIPArr };
  //       const dataFinalFormData = createFormData(newData);
  //       dispatch(
  //         createAssessorProfileApi(
  //           dataFinalFormData,
  //           setLoading,
  //           clearFormValues,
  //           navigate
  //         )
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("An error occurred:", error);
  //       errorToast("Unable to upload files");
  //       setLoading(false);
  //     });
  // };

  const clearFormValues = () => {
    setFormValues(initialFormValues());
    localStorage.removeItem("bscInf_AsR");
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!assessorMDBId) return errorToast("Please fill Basic Info first");
    const formErrors = {};

    if (getSchemeType(schemeType).includes("Non PMKVY") || getSchemeType(schemeType).includes("PMKVY")) {
      Object.keys(formValues).forEach((name) => {
        const value = formValues[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      });
      setErrors(formErrors);

      if (formValues?.bankAccount !== formValues?.confBankAccount) {
        formErrors["confBankAccount"] = "Account Number Doesn't Match";
        setErrors(formErrors);
      }

      if (Object.keys(formErrors).length === 0) {
        delete formValues?.confBankAccount;

        const edit = false;
        setLoading(true);
        dispatch(createAssessorBankDetailsApi(setLoading, assessorMDBId, formValues, clearFormValues, navigate, edit));
      }
    } else {
      const formError = {};
      Object.keys(formValues).forEach((name) => {
        const value = formValues[name];
        const fieldError = validateField(name, value);
        if (fieldError) {
          formError[name] = fieldError;
        }
      });

      if (formValues?.bankAccount !== formValues?.confBankAccount && Object.keys(formError).length > 0) {
        formErrors["confBankAccount"] = "Account Number Doesn't Match";
        setErrors(formErrors);
      }

      if (Object.keys(formError).length === 0) {
        delete formValues?.confBankAccount;
        const edit = false;
        setLoading(true);
        dispatch(createAssessorBankDetailsApi(setLoading, assessorMDBId, formValues, clearFormValues, navigate, edit));
      } else {
        dispatch(getAssessorBasicDetails({}));
        dispatch(getAssessorPersonalDetails([]));
        localStorage.removeItem("bscInf_AsR");
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
                    }}>
                    <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                      <SelectInput
                        name="bankName"
                        label="Bank Name"
                        placeHolder="Select Bank Name"
                        value={formValues?.bankName}
                        handleChange={changeHandler}
                        options={BANKS}
                        error={errors?.bankName}
                        mandatory={
                          getSchemeType(schemeType)?.includes("Non PMKVY") ||
                          getSchemeType(schemeType)?.includes("PMKVY")
                        }
                      />
                    </div>
                    <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                      <Input
                        label="Branch Name"
                        name="bankBranchName"
                        placeholder="Enter Branch Name"
                        onFocus={focusHandler}
                        error={errors?.bankBranchName}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.bankBranchName}
                        mandatory={
                          getSchemeType(schemeType)?.includes("Non PMKVY") ||
                          getSchemeType(schemeType)?.includes("PMKVY")
                        }
                      />
                    </div>

                    <div style={{ width: "calc(50% - 10px)" }} className="form-group">
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
                        mandatory={
                          getSchemeType(schemeType)?.includes("Non PMKVY") ||
                          getSchemeType(schemeType)?.includes("PMKVY")
                        }
                      />
                    </div>

                    <div style={{ width: "calc(50% - 10px)" }} className="form-group">
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
                        mandatory={
                          getSchemeType(schemeType)?.includes("Non PMKVY") ||
                          getSchemeType(schemeType)?.includes("PMKVY")
                        }
                        hideExponants={true}
                      />
                    </div>

                    <div style={{ width: "calc(50% - 10px)" }} className="form-group">
                      <Input
                        label="Confirm Account No"
                        type={"number"}
                        name="confBankAccount"
                        placeholder="Enter Bank Account Number"
                        onFocus={focusHandler}
                        error={errors?.confBankAccount}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.confBankAccount}
                        mandatory={
                          getSchemeType(schemeType)?.includes("Non PMKVY") ||
                          getSchemeType(schemeType)?.includes("PMKVY")
                        }
                      />
                    </div>

                    <div style={{ width: "calc(50% - 10px)" }} className="form-group">
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
                        mandatory={
                          getSchemeType(schemeType)?.includes("Non PMKVY") ||
                          getSchemeType(schemeType)?.includes("PMKVY")
                        }
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
            localStorage.removeItem("bscInf_AsR");
            navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=${SECTION}`);
          }}>
          Cancel
        </Button>
        <Button
          className={`light-blue-btn submit-btn`}
          variant="contained"
          disabled={loading ? true : false}
          onClick={handleSave}>
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
