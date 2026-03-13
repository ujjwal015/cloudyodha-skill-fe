import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import SelectInput from "./../../../../components/common/SelectInput";
import Input from "./../../../../components/common/input";
import { getStateListsApi } from "./../../../../api/authApi";
import { Button } from "@mui/material";
import {
  ALPHABETIC_SORT,
  CLIENT_ALPHABETIC_SORT,
  errorToast,
} from "./../../../../utils/projectHelper";
import { ReactComponent as ArrowLeft } from "./../../../../assets/icons/chevron-left.svg";
import { BDA_JOB_ROLE_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import { RingLoader } from "react-spinners";
import { addJobRoleApi } from "../../../../api/superAdminApi/jobRoleManagement";
import { getAssignedClientsListsApi } from "../../../../api/superAdminApi/clientManagement";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
const initialFormValues = {
  clientName_JR: "",
  jobRole: "",
  qpCode: "",
};

const DUMMY_CLIENTNAME = [
  {
    label: "dummy",
    value: "dummy",
  },
];

const ClientManagementProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [focusedInput ,setFocusedInput] = useState("");
  const [clientId, setClientId] = useState();
  const { assignedClientsList = [] } = useSelector(clientManagementSelector);
  const [allClients, setAllClients] = useState(DUMMY_CLIENTNAME);
  const [dropLoading, setDropLoading] = useState(true);
  const params = useParams();

  const getClientDetails = () => {
    setLoading(true);
    // dispatch(getClientManagementListsApi(setLoading));
    dispatch(getAssignedClientsListsApi(setLoading));
  };

  useEffect(() => {
    getClientDetails();
    if (params.id) {
      setClientId(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if (assignedClientsList.length > 0) {
      const clientsMappedList = new Array();
      assignedClientsList.map((el) => {
        // if (el?.client_status !== "Inactive") {
        const newEntry = {
          label: el?.clientname,
          value: el?._id,
        };
        clientsMappedList.push(newEntry);
        // }
      });

      setAllClients(clientsMappedList);
      setDropLoading(false);
    }
  }, [assignedClientsList.length]);

  useEffect(() => {
    const formData = {
      country: "India",
    };
    dispatch(getStateListsApi(formData, setLoading));
  }, []);

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

    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      formValues["clientId"] = formValues.clientName_JR;
      const newFormValues = {
        jobRole: formValues?.jobRole,
        qpCode: formValues?.qpCode,
        clientId: formValues?.clientName_JR,
      };

      dispatch(
        addJobRoleApi(newFormValues, setLoading, clearFormValues, navigate)
      );
    } else errorToast("Please fill all details");
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
    navigate(BDA_JOB_ROLE_PAGE);
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
          <span>Job Role Form</span>
        </h1>
      </div>
      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="jobRoleFormWrapper" style={{ display: "block" }}>
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
                    <div className="form-group" style={{ width: "100%" }}>
                      <SelectInput
                        name="clientName_JR"
                        label="Client Name"
                        placeHolder="Select Client Name"
                        value={formValues?.clientName_JR}
                        handleChange={(e) => changeHandler(e)}
                        options={ALPHABETIC_SORT(allClients)}
                        error={errors?.clientName_JR}
                        mandatory
                        disabled={dropLoading}
                        loading={loading}
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
          onClick={clearFormValues}
          disabled={loading ? true : false}
        >
          Cancel
        </Button>
        <Button
          className={`light-blue-btn submit-btn`}
          variant="contained"
          onClick={handleSubmit}
          disabled={loading ? true : false}
        >
          {loading ? (
            <RingLoader size="25px" color="white" />
          ) : (
            [clientId ? "Update" : "Save"]
          )}
        </Button>
      </div>
    </div>
  );
};

export default ClientManagementProfile;
