import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import "../users.style.css";
import "../../../schemeManagement/schemeManagementList/scheme/createScheme";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import validateField from "../../../../../utils/validateField";
import { ReactComponent as ArrowLeft } from "./../../../../../assets/icons/chevron-left.svg";
import Input from "../../../../../components/common/input";
import { getAssignedClientsListsApi } from "../../../../../api/superAdminApi/clientManagement";
import {
  getRolesListApi,
  updateSingleUserApi,
  getSingleUserApi,
  getUsersListApi,
} from "../../../../../api/superAdminApi/userManagement";
import { clientManagementSelector } from "../../../../../redux/slicers/superAdmin/clientManagement";
import { useEffect } from "react";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { FadeLoader } from "react-spinners";
import SubmitButton from "../../../../../components/SubmitButton";
import { SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import { CLIENT_ALPHABETIC_SORT } from "../../../../../utils/projectHelper";
import SelectInput from "../../../../../components/common/SelectInput";
import { getAllDashboardListApi } from "../../../../../api/superAdminApi/dashboardManage";
import { clientSelector } from "../../../../../redux/slicers/clientSlice";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const whiteCloseIcon = <CloseIcon style={{ fill: "white", fontSize: 16 }} />;

export default function EditUser() {
  const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    userRole: [],
    assigndClients: [],
    assignedDashboard: "",
    reportinManager: ""
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [userRoleError, setUserRoleError] = useState("");
  const [allRolesSelected, setAllRolesSelected] = useState(false);
  const [allClientSelected, setAllClientSelected] = useState(false);
  const [assignedClientsError, setAssignedClientsError] = useState("");
  const [dashboardDropdown, setDashboardDropdown] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const { assignedClientsList = [] } = useSelector(clientManagementSelector);
  const { rolesList = [], usersList = [] } = useSelector(authSelector);
  const { getAllDashboardList = [] } = useSelector(clientSelector);

  const getClientList = () => {
    setLoading(true);
    dispatch(
      getUsersListApi(setLoading, 1, "", Infinity, () => { })
    );
    dispatch(getAssignedClientsListsApi(setLoading));
    dispatch(getRolesListApi(setLoading, 1, "", Infinity, ""));
    dispatch(getSingleUserApi(setLoading, setFormValues, userId));
    dispatch(getAllDashboardListApi(setLoading, 1, Infinity, ""));
  };

  useEffect(() => {
    getClientList();
  }, []);

  useEffect(() => {
    const list = getAllDashboardList?.filter((item) => item?.status)
      .map((item) => ({
        label: item?.dashboard_name,
        value: item?._id,
      }));
    const activeUserDropDown = usersList?.filter((item) => item?.status === 'active')
      ?.map((item) => ({
        label: `${item?.firstName} ${item?.lastName}`,
        value: item?._id,
      }));
    setActiveUsers(activeUserDropDown)
    setDashboardDropdown(list);
  }, [getAllDashboardList]);

  useEffect(() => {
    if (errors?.lastName === "Last name is required") {
      setErrors({});
    }
  }, [errors]);

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
    delete errors['reportinManager'];
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };

  const roleHandleChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
    setAllRolesSelected(
      field === "userRole" &&
      formValues.userRole.length === rolesList.length - 1
    );
    if (field === "userRole") setUserRoleError("");
    if (field === "assigndClients") setAssignedClientsError("");
  };
  const clientHandleChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
    setAllClientSelected(
      formValues.assigndClients.length === assignedClientsList.length - 1
    );
    if (field === "userRole") setUserRoleError("");
    if (field === "assigndClients") setAssignedClientsError("");
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
    navigate(SUPER_ADMIN_USER_MANAGEMENT_LIST_PAGE);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    let hasError = false;
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });
    if (!formValues?.lastName) delete formErrors["lastName"];
    if (!formValues?.reportinManager) delete formErrors["reportinManager"];
    setErrors(formErrors);
    if (formValues?.userRole.length === 0) {
      setUserRoleError("User role is required");
      hasError = true;
    }
    if (formValues?.assigndClients.length === 0) {
      setAssignedClientsError("Client name is required");
      hasError = true;
    }

    if (hasError) return;
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      dispatch(
        updateSingleUserApi(
          setLoading,
          userId,
          formValues,
          initialFormValues,
          setFormValues,
          navigate
        )
      );
    }
  };
  return (
    <div className="main-content">
      {loading ? (
        <div className="loader_container">
          <FadeLoader color="#2ea8db" />
        </div>
      ) : (
        <>
          <div className="title">
            <h1>
              <ArrowLeft onClick={() => navigate(-1)} />
              <span>User Login Form</span>
            </h1>
          </div>
          <section className="sub-admin-wrapper">
            <div className="tab-content">
              <div className="edit-profile" style={{ display: "block" }}>
                <div className="form-wrapper">
                  <div className="flex-form">
                    <div className="form-group">
                      <Input
                        label="First Name"
                        type="text"
                        name="firstName"
                        placeholder="Enter First Name"
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        error={errors.firstName}
                        onFocus={focusHandler}
                        value={formValues?.firstName}
                        mandatory
                      />
                    </div>

                    <div className="form-group">
                      <Input
                        label="Last Name"
                        type="text"
                        name="lastName"
                        placeholder="Enter Last Name"
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        error={errors.lastName}
                        onFocus={focusHandler}
                        value={formValues?.lastName}
                      // mandatory
                      />
                    </div>

                    <div className="form-group-full">
                      <Input
                        label="Email ID"
                        type="text"
                        name="email"
                        placeholder="Enter Email ID"
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        error={errors.email}
                        onFocus={focusHandler}
                        value={formValues?.email}
                        disabled={true}
                        mandatory
                      />
                    </div>

                    <div className="form-group-full">
                      <Input
                        label="User Name"
                        type="text"
                        name="userName"
                        placeholder="Enter User Name"
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        error={errors.userName}
                        onFocus={focusHandler}
                        value={formValues?.userName}
                        mandatory
                      />
                    </div>
                    {/* <div className="form-group">
                      <SelectInput
                        name="status"
                        label="Status"
                        placeHolder="Select status"
                        options={STATUS}
                        value={formValues?.status}
                        handleChange={changeHandler}
                        error={errors?.status}
                        mandatory
                      />
                    </div> */}

                    <div className="form-group">
                      <label>
                        Role Type
                        <span className="mandatory">&nbsp;*</span>
                      </label>
                      <Autocomplete
                        multiple
                        id="user-role"
                        disableCloseOnSelect
                        options={rolesList}
                        limitTags={4}
                        size="small"
                        getOptionLabel={(option) => option?.userRoleName}
                        value={rolesList.filter((role) =>
                          formValues.userRole.includes(role._id)
                        )}
                        onChange={(_, value) =>
                          roleHandleChange(
                            "userRole",
                            value?.map((role) => role?._id)
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            sx={{ mt: 1 }}
                            {...params}
                            // placeholder="Select role type"
                            placeholder={
                              allRolesSelected ? "" : "Select role type"
                            }
                          />
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li
                            key={option?._id}
                            {...props}
                            style={{
                              padding: "0 8px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {option?.userRoleName}
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                          </li>
                        )}
                        ChipProps={{
                          style: {
                            backgroundColor: "#00B2FF",
                            color: "white",
                            fontSize: "12px",
                          },
                          deleteIcon: whiteCloseIcon,
                        }}
                      />

                      <p className="error-input">{userRoleError}</p>
                    </div>
                    <div className="form-group-full">
                      <label>
                        Client Name
                        <span className="mandatory">&nbsp;*</span>
                      </label>
                      <Autocomplete
                        multiple
                        id="clients"
                        disableCloseOnSelect
                        options={CLIENT_ALPHABETIC_SORT(assignedClientsList)}
                        limitTags={4}
                        size="small"
                        getOptionLabel={(option) => option?.clientname}
                        value={CLIENT_ALPHABETIC_SORT(
                          assignedClientsList
                        )?.filter((clientId) =>
                          formValues?.assigndClients.includes(clientId?._id)
                        )}
                        onChange={(_, value) =>
                          clientHandleChange(
                            "assigndClients",
                            value?.map((clientId) => clientId?._id)
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            sx={{ mt: 1 }}
                            {...params}
                            // placeholder="Select client name"
                            placeholder={
                              allClientSelected ? "" : "Select client name"
                            }
                          />
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li
                            key={option?._id}
                            {...props}
                            style={{
                              padding: "0 8px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {option?.clientname}
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                          </li>
                        )}
                        ChipProps={{
                          style: {
                            backgroundColor: "#00B2FF",
                            color: "white",
                            fontSize: "12px",
                          },
                          deleteIcon: whiteCloseIcon,
                        }}
                      />
                      <p className="error-input">{assignedClientsError}</p>
                    </div>
                    <div className="form-group-full">
                      <SelectInput
                        name="assignedDashboard"
                        label="Assigned Dashboard"
                        placeHolder="Select dashboard"
                        value={formValues?.assignedDashboard}
                        handleChange={(e) => {
                          changeHandler(e);
                        }}
                        options={dashboardDropdown}
                        error={errors?.assignedDashboard}
                        mandatory
                      />
                    </div>
                    <div className="form-group-full">
                      <SelectInput
                        name="reportinManager"
                        label="Reporting Manager"
                        placeHolder="Select reporting manager"
                        value={formValues?.reportinManager}
                        handleChange={(e) => {
                          changeHandler(e);
                        }}
                        options={activeUsers}
                        error={errors?.reportinManager}
                      // mandatory
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <SubmitButton
            cancelBtnText="Cancel"
            submitBtnText="Update"
            saveAndNextBtnText="Save and Next"
            handleSubmit={handleSubmit}
            clearFormValues={clearFormValues}
            navigate={navigate}
            loading={loading}
            showSaveAndNextBtn={false}
          />
        </>
      )}
    </div>
  );
}
