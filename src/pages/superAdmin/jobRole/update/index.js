import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import Input from "./../../../../components/common/input";
import { Button } from "@mui/material";
import { ALPHABETIC_SORT, errorToast } from "./../../../../utils/projectHelper";
import { ReactComponent as ArrowLeft } from "./../../../../assets/icons/chevron-left.svg";
import { BDA_JOB_ROLE_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import { FadeLoader, RiseLoader } from "react-spinners";
import {
  getSpecificJobRoleApi,
  updateJobRoleApi,
} from "../../../../api/superAdminApi/jobRoleManagement";
import { getSpecificClient } from "../../../../api/superAdminApi/clientManagement";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { clientSelector } from "../../../../redux/slicers/clientSlice";
const initialFormValues = () => {
  return {
    clientId: "",
    jobRole: "",
    qpCode: "",
  };
};

const DUMMY_CLIENTNAME = [
  {
    label: "dummy",
    value: "dummy",
  },
];

const JobRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues());
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState("");
  const [clientId, setClientId] = useState();
  const { specificJobRole = {} } = useSelector(clientManagementSelector);
  const [allClients, setAllClients] = useState(DUMMY_CLIENTNAME);
  const [jobLoading, setJobLoading] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);
  const params = useParams();
  const { specificClientDetails = {} } = useSelector(clientSelector);

  useEffect(() => {
    if (params.id) {
      setClientId(params.id);
      setJobLoading(true);
      dispatch(getSpecificJobRoleApi(setJobLoading, params.id));
    }
  }, []);

  useEffect(() => {
    if (specificJobRole._id === params.id) {
      setJobLoading(true);
      setClientLoading(true);
      dispatch(
        getSpecificClient(setJobLoading, specificJobRole.clientId, navigate)
      );
    }
  }, [specificJobRole]);

  useEffect(() => {
    if (specificClientDetails.length > 0 && specificJobRole._id === params.id) {
      setClientLoading(false);
      const clientName = specificClientDetails[0]?.clientname;
      setFormValues({
        ...specificJobRole,
        clientId: clientName,
      });
    }
  }, [specificClientDetails]);

  const changeHandler = (event) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = {};

    delete formValues._id;
    delete formValues.status;
    delete formValues.createdAt;
    delete formValues.updatedAt;
    delete formValues.__v;
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const newFormValues = {
        ...formValues,
        clientId: specificClientDetails[0]?._id,
      };
      setLoading(true);
      dispatch(
        updateJobRoleApi(
          setLoading,
          newFormValues,
          params.id,
          clearFormValues,
          navigate
        )
      );
    } else {
      errorToast("Please fill all details");
    }
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues());
  };

  const handleCancel = () => {
    clearFormValues();
    navigate(-1);
  };

  const handleInputTrimPaste = (event) => {
    event.preventDefault();
    const { name, value, type, checked } = event.target;
    const pastedText = event.clipboardData.getData("text/plain");
    const fieldValue = type === "checkbox" ? checked : pastedText.trim();
    const fieldError = validateField(name, pastedText);

    setFormValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  return (
    <div className="main-content">
      <div className="title">
        <h1>
          <ArrowLeft onClick={() => navigate(BDA_JOB_ROLE_PAGE)} />
          <span>Edit Job Role Form</span>
        </h1>
      </div>
      {jobLoading || clientLoading ? (
        <div className="loader_container">
          <FadeLoader color="#2ea8db" />
        </div>
      ) : (
        <>
          <section className="sub-admin-wrapper">
            <div className="tab-content">
              <div className="edit-profile" style={{ display: "block" }}>
                <div className="form-wrapper">
                  <div className="form">
                    <form>
                      <div className="form_main_content">
                        <div
                          className="form-group"
                          style={{
                            width: "100%",
                          }}
                        >
                          <Input
                            name="clientId"
                            label="Client Name"
                            value={formValues?.clientId}
                            options={ALPHABETIC_SORT(allClients)}
                            error={errors?.clientId}
                            onChange={changeHandler}
                            mandatory
                            disabled={clientId ? true : false}
                          />
                        </div>

                        <div className="form-group" style={{ width: "100%" }}>
                          <Input
                            label="Job Role"
                            type="text"
                            name={"jobRole"}
                            placeholder="Enter Job Role"
                            onFocus={focusHandler}
                            error={errors?.jobRole}
                            onPaste={handleInputTrimPaste}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.jobRole}
                            mandatory
                            disabled
                          />
                        </div>
                        <div className="form-group" style={{ width: "100%" }}>
                          <Input
                            label="QP Code"
                            type="text"
                            name={"qpCode"}
                            placeholder="Enter QP Code"
                            onFocus={focusHandler}
                            error={errors?.qpCode}
                            onPaste={handleInputTrimPaste}
                            onBlur={blurHandler}
                            onChange={changeHandler}
                            value={formValues?.qpCode}
                            mandatory
                            disabled
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
              className={`outlined-btn submit-btn`}
              variant="outlined"
              onClick={handleCancel}
              disabled={loading ? true : false}
            >
              Cancel
            </Button>
            <Button
              className={`light-blue-btn submit-btn`}
              variant="contained"
              onClick={handleSubmit}
            >
              {loading ? <RiseLoader size="5px" color="white" /> : "Update"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobRole;
