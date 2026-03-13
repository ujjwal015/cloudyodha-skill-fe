import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import { Button } from "@mui/material";
import { ReactComponent as ArrowLeft } from "../../../../assets/icons/chevron-left.svg";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../utils/validation/superAdmin/examManagement";
import Input from "../../../../components/common/input";
import {
  updateCandidateData,
  getSingleCandidateDetailApi,
} from "../../../../api/superAdminApi/examManagement";
import { SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import { examManagementSelector } from "../../../../redux/slicers/superAdmin/examManagementSlice";

const initialFormValues = {
  batchId: "",
  _id: "",
  name: "",
  email: "",
  mobile: "",
  aadharNumber: "",
  userName: "",
  logInSendViaEmail: false,
};
const EditCandidateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const { batchId, candidateId } = useParams();

  // Redux data
  const { singleCandiateData = {} } = useSelector(examManagementSelector);

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;

    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);
    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });
    setErrors(formErrors);

    const { examCenterCode, ...formData } = formValues;

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const updatedFormData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        aadharNumber: formData.aadharNumber,
        logInSendViaEmail: formData.logInSendViaEmail,
      };
      dispatch(
        updateCandidateData(
          setLoading,
          candidateId,
          singleCandiateData,
          updatedFormData,
          navigate
        )
      );
    }
  };

  useEffect(() => {
    dispatch(
      getSingleCandidateDetailApi(setLoading, setFormValues, candidateId)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-content">
      <div className="main-container exam-management-page">
        <div className="title">
          <h1>
            <ArrowLeft
              onClick={() =>
                navigate(
                  `${SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE}/${singleCandiateData.batchId_mongoId}`
                )
              }
            />
            <span>Edit Candidate Form</span>
          </h1>
        </div>
        <section className="sub-admin-wrapper">
          <div className="tab-content">
            <div className="form-title">
              <h1>CANDIDATE FORM</h1>
            </div>
            <div className="form-wrapper">
              <div className="form">
                {/* ============Form Starts here ========= */}
                <form>
                  <div className="inputFeilds">
                    <div className="form-group input_half">
                      <Input
                        name="batchId"
                        label="Batch ID"
                        placeHolder="Select Batch ID"
                        value={formValues?.batchId}
                        onChange={changeHandler}
                        error={errors?.batchId}
                        mandatory
                        disabled={true}
                      />
                    </div>
                    <div className="form-group input_half">
                      <Input
                        label="Candidate ID"
                        name="_id"
                        placeholder="Candidate ID"
                        error={errors?._id}
                        onChange={changeHandler}
                        value={formValues?._id}
                        disabled={true}
                        mandatory
                      />
                    </div>

                    <div className="form-group input_half">
                      <Input
                        label="Candidate Name"
                        name="name"
                        placeholder="Enter First Name"
                        error={errors?.name}
                        onChange={changeHandler}
                        value={formValues?.name}
                        mandatory
                      />
                    </div>

                    <div className="form-group input_half">
                      <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="Enter mail here"
                        error={errors?.email}
                        onChange={changeHandler}
                        value={formValues?.email || ""}
                      />
                    </div>
                    <div className="form-group input_half">
                      <Input
                        label="Contact Number"
                        type={"number"}
                        name="mobile"
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        placeholder="Enter Contact No."
                        error={errors?.mobile}
                        onChange={changeHandler}
                        value={formValues?.mobile || ""}
                        hideExponants={true}
                        mandatory
                      />
                    </div>

                    <div className="form-group input_half">
                      <Input
                        label="Aadhar No"
                        type={"text"}
                        name="aadharNumber"
                        placeholder="Enter Aadhar No"
                        error={errors?.aadharNumber}
                        onChange={changeHandler}
                        value={formValues?.aadharNumber || ""}
                        mandatory
                      />
                    </div>
                    <div className="form-group input_half">
                      <Input
                        label="Username"
                        name="userName"
                        placeholder="Enter Username"
                        error={errors?.userName}
                        onChange={changeHandler}
                        value={formValues?.userName}
                        disabled={true}
                        mandatory
                      />
                    </div>

                    <div className="form-group">
                      <div className={`text-check edit-contact-checkbox`}>
                        <label className="input_label">
                          Send Log in Details via SMS/Email
                        </label>
                        <div className="input_wrap">
                          <input
                            type="checkbox"
                            name={"logInSendViaEmail"}
                            id={"sms"}
                            label={"send sms"}
                            value={formValues?.logInSendViaEmail}
                            checked={formValues?.logInSendViaEmail}
                            onChange={changeHandler}
                          />
                          <label htmlFor={""}>Send</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="buttonsBox">
          <div className="action-btn">
            <div className="action-btn-card">
              <Button
                className={`outlined-btn back-btn`}
                onClick={() => {
                  navigate(
                    `${SUPER_ADMIN_EXAM_MANAGEMENT_CANDIDATE_LIST_PAGE}/${batchId}`
                  );
                }}
              >
                Cancel
              </Button>
              <Button
                className={`light-blue-btn  create-btn`}
                onClick={handleSubmit}
                disabled={loading ? true : false}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "Update"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditCandidateForm;
