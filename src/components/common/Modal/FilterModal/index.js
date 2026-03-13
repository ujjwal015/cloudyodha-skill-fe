import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import SelectInput from "../../SelectInput";
import {
  ASSESSOR_MODES,
  CONFIRMATION,
  SCHEME_NAME,
  GET_DEMO_USER_TYPE_MENUS,
  MOBILE_VERIFIED,
  MODE_OF_AGREEMENT_OPTIONS,
  STATES,
  SUB_ADMIN_ORGANISATION_TYPE_MENUS,
  VERIFIED,
} from "../../../../config/constants/projectConstant";
import DateInput from "../../DateInput";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/close-icon.svg";
import "../../../../pages/superAdmin/LeadsManagement/style.css";
import "./style.css";
import { Menu } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch, useSelector } from "react-redux";
import { callSchemeApi } from "../../../../api/superAdminApi/examManagement";
import {
  authSelector,
  getSchemeList,
} from "../../../../redux/slicers/authSlice";
import { getClientManagementListsApi } from "../../../../api/superAdminApi/clientManagement";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { getAllClientsApi } from "../../../../api/superAdminApi/dashboard";
export default function FilterModal({
  handleClose,
  focusHandler,
  blurHandler,
  changeHandler,
  setFormValues,
  formValues,
  handleDateChange,
  handleClearAll,
  handleSubmit,
  showStatus = false,
  showFilter = false,
  showAssessorField = false,
  showIsMobileVerified = false,
  showVerified = false,
  showToDate = false,
  showFromDate = false,
  showRoleType = false,
  showDateInputs = false,
  filterFields,
  initialFormValues,
  formValue,
  setActionBtn,
  // organizationName,
  isMobileVerified,
  setIsFilterOpen,
  isFilterOpen,
  showProctorMode,
  showAgreementSigned,
  showBatch = false,
  batchClientName,
  batchJobRole,
  batchScheme,
  showScheme = false,
  showOrganisation = false,
  showState = false,
  stateList,
  assessorNameList,
  showAssessorFilter = false,
  errorMessage = {},
  showQuestionLanguage = false,
  languageOptions = [],
  showQuestionBankFilter = false,
  sections = [],
  languageOptions2 = [],
  isFilerApplied,
  isFilterFromVerificationTab = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { schemeList = [] } = useSelector(authSelector);
  const { clientManagementLists = [], allClients = [] } = useSelector(
    clientManagementSelector
  );

  const open = Boolean(anchorEl); // Menu is open if there's an anchor element

  // Handler to open the Menu and set its anchor to the button element
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Adjust handleClose to manage the Menu's closed state
  const handleCloseMenu = () => {
    handleClose(); // Call the passed handleClose to manage outside state if needed
    setAnchorEl(null); // Reset anchorEl to close the Menu
  };
  const modalHandleSubmit = (e) => {
    handleSubmit(e);
    handleCloseMenu();
  };
  const modalHandleClearAll = (e) => {
    handleClearAll(e);
    handleCloseMenu();
  };

  const onLoad = async () => {
    if (showAssessorFilter) {
      const response = await callSchemeApi();
      const data = response?.details?.map((scheme) => {
        return { label: scheme.schemeName, value: scheme._id };
      });
      dispatch(getSchemeList(data));
    }
    if (showAssessorField || showAssessorFilter) {
      if (isFilterFromVerificationTab) {
        dispatch(getAllClientsApi(setLoading, 1, 100));
      } else {
        dispatch(getClientManagementListsApi(null, 1, 38));
      }
    }
  };

  const removeDuplicates = useCallback(() => {
    const uniqueOrganisation = new Set();

    const uniqueUsers = clientManagementLists.filter((user) => {
      if (!uniqueOrganisation.has(user.clientname)) {
        uniqueOrganisation.add(user.clientname);
        return true;
      }
      return false;
    });
    return uniqueUsers;
  }, [clientManagementLists]);

  const removeDuplicateClients = () => {
    const uniqueOrganisation = new Set();

    const uniqueUsers = allClients?.filter((user) => {
      if (!uniqueOrganisation.has(user.clientname)) {
        uniqueOrganisation.add(user.clientname);
        return true;
      }
      return false;
    });
    return uniqueUsers;
  };

  const clientNames = removeDuplicates();
  const allClientNames = removeDuplicateClients();

  const structuredClientNames = useMemo(
    () =>
      clientNames?.map((item) => {
        return {
          label: item?.clientname,
          value: item?._id,
        };
      }),
    [clientNames]
  );

  const structuredClientNamesNew = useMemo(
    () =>
      allClientNames?.map((item) => {
        return {
          label: item?.clientname,
          value: item?._id,
        };
      }),
    [allClientNames]
  );
  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div>
      <div className="filter-modal__container">
        {isFilerApplied && (
          <button className="clear-btn" onClick={(e) => modalHandleClearAll(e)}>
            <Icon className="clear-btn__icon" icon="mynaui:trash" />
            Clear
          </button>
        )}

        <button className="filter-btn" onClick={handleClick}>
          Filter
        </button>
      </div>

      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        getcontentanchorel={null}
        autoFocus={false}
        key="menu"
        MenuListProps={{
          "aria-labelledby": "filter-button",
        }}
        PaperProps={{
          style: {
            marginTop: 5,
            padding: "10px 20px",
            borderRadius: 10,
            width: "250px",
          },
        }}
      >
        <div>
          <div className="filter-header">
            <h2>Filter Options</h2>
            <CloseIcon className="close-icon" onClick={handleCloseMenu} />
          </div>

          {/* {showLanguageField && (
              <div
                className="status-filter"
                style={{
                  display: [showLanguageField ? "" : "none"],
                }}
              >
                <div>
                  <SelectInput
                    name="language"
                    label="Language"
                    placeHolder="Select"
                    value={formValues?.language}
                    handleChange={changeHandler}
                    options={language}
                  />
                </div>
              </div>
            )} */}

          <div
            className="status-filter"
            style={{
              display: [showAssessorField ? "" : "none"],
            }}
          >
            <div>
              <SelectInput
                name="assessorName"
                label="Assessor Name"
                placeHolder="Select"
                value={formValues?.assessorName || ""}
                handleChange={changeHandler}
                options={assessorNameList}
              />
            </div>
          </div>
          <div
            className="status-filter"
            style={{
              display: [showAssessorField ? "" : "none"],
            }}
          >
            <div>
              <SelectInput
                name="clientId"
                label="Client"
                placeHolder="Client"
                value={formValues?.clientId || ""}
                handleChange={changeHandler}
                options={ isFilterFromVerificationTab ? structuredClientNamesNew:structuredClientNames }
              />
            </div>
          </div>
          <div
            className="status-filter"
            style={{
              display: [showStatus ? "" : "none"],
            }}
          >
            <div>
              <SelectInput
                name="F_status"
                label="Status"
                placeHolder="Select Status"
                value={formValues?.F_status || ""}
                handleChange={changeHandler}
                options={VERIFIED}
              />
            </div>
          </div>
          <div>
            <div
              className="status-filter"
              style={{
                display: [showIsMobileVerified ? "" : "none"],
              }}
            >
              <div>
                <SelectInput
                  name="mobileVerified"
                  label="Mobile Verified"
                  placeHolder="Select Type"
                  value={formValues?.mobileVerified || ""}
                  handleChange={changeHandler}
                  options={MOBILE_VERIFIED}
                />
              </div>
            </div>

            <div
              className="date_input_container"
              style={{
                display: [showDateInputs ? "" : "none"],
              }}
            >
              <div
                className="status-filter"
                style={{
                  display: [showFromDate ? "" : "none"],
                }}
              >
                <div>
                  <DateInput
                    name="from"
                    label="From"
                    placeholder="Select date"
                    value={formValues?.from || ""}
                    setFormValues={setFormValues}
                    onFocus={focusHandler}
                    onBlur={blurHandler}
                    handleDateChange={(e) => handleDateChange(e, "from")}
                  />
                </div>
              </div>
              <div
                className="status-filter"
                style={{
                  display: [showToDate ? "" : "none"],
                }}
              >
                <div>
                  <DateInput
                    name="to"
                    label="To"
                    placeholder="Select date"
                    value={formValues?.to || ""}
                    onBlur={blurHandler}
                    onFocus={focusHandler}
                    handleDateChange={(e) => handleDateChange(e, "to")}
                    setFormValues={setFormValues}
                  />
                </div>
              </div>
              <div
                className="status-filter"
                style={{
                  display: [showVerified ? "" : "none"],
                }}
              >
                <div>
                  <SelectInput
                    name="verified"
                    label="Verified"
                    placeHolder="Select"
                    value={formValues?.verified || ""}
                    handleChange={changeHandler}
                    options={VERIFIED}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="status-filter"
            style={{
              display: [showRoleType ? "" : "none"],
            }}
          >
            <div>
              <SelectInput
                name="userRole"
                label="Role Type"
                placeHolder="Select Role"
                value={formValues?.userRole || ""}
                handleChange={changeHandler}
                options={GET_DEMO_USER_TYPE_MENUS}
              />
            </div>
          </div>
          <div
            className="status-filter"
            style={{
              display: [showVerified ? "" : "none"],
            }}
          >
            <div>
              <SelectInput
                name="status"
                label="Verified"
                placeHolder="Select"
                value={formValues?.status || ""}
                handleChange={changeHandler}
                options={VERIFIED}
              />
            </div>
          </div>

          {/* Filter for Assign batch */}
          <div
            className="status-filter"
            style={{
              display: [showBatch ? "" : "none"],
            }}
          >
            <div>
              <SelectInput
                name="clientName"
                label="Client Name"
                placeHolder="Select"
                value={formValues?.clientName || ""}
                handleChange={changeHandler}
                options={batchClientName}
                error={errorMessage?.clientName}
              />
            </div>
            <div>
              <SelectInput
                name="jobRole"
                label="Job Role"
                placeHolder="Select"
                value={formValues?.jobRole || ""}
                handleChange={changeHandler}
                options={batchJobRole}
                error={errorMessage?.jobRole}
              />
            </div>
            <div>
              <SelectInput
                name="schemeName"
                label="Scheme Filter"
                placeHolder="Select"
                value={formValues?.schemeName || ""}
                handleChange={changeHandler}
                options={batchScheme}
                error={errorMessage?.schemeName}
              />
            </div>
            <div className="status-filter">
              <div>
                <DateInput
                  name="from"
                  label="From"
                  placeholder="Select date"
                  value={formValues?.from || ""}
                  setFormValues={setFormValues}
                  onFocus={focusHandler}
                  onBlur={blurHandler}
                  handleDateChange={(e) => handleDateChange(e, "from")}
                  error={errorMessage?.from}
                />
              </div>
            </div>
            <div>
              <div>
                <DateInput
                  name="to"
                  label="To"
                  placeholder="Select date"
                  value={formValues?.to || ""}
                  onBlur={blurHandler}
                  onFocus={focusHandler}
                  handleDateChange={(e) => handleDateChange(e, "to")}
                  setFormValues={setFormValues}
                  error={errorMessage?.to}
                />
              </div>
            </div>
          </div>
          <div
            className="status-filter"
            style={{
              display: [showScheme ? "" : "none"],
            }}
          >
            <div>
              <SelectInput
                name="scheme"
                label="Scheme"
                placeHolder="Select"
                value={formValues?.scheme || ""}
                handleChange={changeHandler}
                options={VERIFIED}
              />
            </div>
          </div>

          {showState && showOrganisation && (
            <>
              <div className="status-filter">
                <SelectInput
                  name="organisationType"
                  label="Organization Type"
                  placeHolder="Select Organization Type"
                  value={formValues?.organisationType}
                  handleChange={changeHandler}
                  options={SUB_ADMIN_ORGANISATION_TYPE_MENUS}
                  error={errorMessage?.organisationType}
                />
              </div>
              <div className="status-filter">
                <SelectInput
                  name="state"
                  label="State"
                  placeHolder="State"
                  value={formValues?.state}
                  handleChange={changeHandler}
                  options={stateList}
                  error={errorMessage?.state}
                />
              </div>
            </>
          )}

          {showAssessorFilter && (
            <>
              <div className="status-filter">
                <SelectInput
                  name="modeofAgreement_filter"
                  label="Mode of Agreement"
                  placeHolder="Select Mode"
                  value={formValues?.modeofAgreement_filter}
                  handleChange={changeHandler}
                  options={MODE_OF_AGREEMENT_OPTIONS}
                  error={errorMessage?.modeofAgreement_filter}
                />
              </div>
              <div className="status-filter">
                <SelectInput
                  name="agreementSigned"
                  label="Agreement Signed"
                  placeHolder="Agreement Signed"
                  value={formValues?.agreementSigned}
                  handleChange={changeHandler}
                  options={CONFIRMATION}
                  error={errorMessage?.agreementSigned}
                />
              </div>
              <div className="status-filter">
                <SelectInput
                  name="schemeType"
                  label="Scheme Type"
                  placeHolder="Select Scheme"
                  value={formValues?.schemeType}
                  handleChange={changeHandler}
                  options={SCHEME_NAME}
                  error={errorMessage?.schemeType}
                />
                <SelectInput
                  name="state"
                  label="State"
                  placeHolder="State"
                  value={formValues?.state}
                  handleChange={changeHandler}
                  options={STATES}
                  error={errorMessage?.state}
                />
              </div>
              {/* <div className="status-filter">
                <SelectInput
                  name="schemeId"
                  label="Scheme"
                  placeHolder="Scheme"
                  value={formValues?.schemeId}
                  handleChange={changeHandler}
                  options={schemeList}
                  error={errorMessage?.schemeId}
                />
              </div>
              <div className="status-filter">
                <SelectInput
                  name="clientId"
                  label="Client Name"
                  placeHolder="Select Client"
                  value={formValues?.clientId}
                  handleChange={changeHandler}
                  options={structuredClientNames}
                  error={errorMessage?.clientId}
                />
              </div> */}
              <div className="status-filter">
                <DateInput
                  name="from"
                  label="From"
                  placeholder="Select date"
                  value={formValues?.from}
                  setFormValues={setFormValues}
                  onFocus={focusHandler}
                  onBlur={blurHandler}
                  handleDateChange={(e) => handleDateChange(e, "from")}
                  error={errorMessage?.from}
                />
              </div>
              <div className="status-filter">
                <DateInput
                  name="to"
                  label="To"
                  placeholder="Select date"
                  value={formValues?.to}
                  onBlur={blurHandler}
                  onFocus={focusHandler}
                  handleDateChange={(e) => handleDateChange(e, "to")}
                  setFormValues={setFormValues}
                  error={errorMessage?.to}
                />
              </div>
            </>
          )}

          {showQuestionLanguage && (
            <div className="status-filter">
              <SelectInput
                name="language"
                label="Language"
                placeHolder="Select Language"
                value={formValues?.language}
                handleChange={changeHandler}
                options={languageOptions2}
                error={errorMessage?.language}
              />
            </div>
          )}

          {showQuestionBankFilter && (
            <>
              <div className="status-filter">
                <SelectInput
                  name="clientId"
                  label="Client Name"
                  placeHolder="Select Client"
                  value={formValues?.clientId}
                  handleChange={changeHandler}
                  options={batchClientName}
                  error={errorMessage?.clientId}
                />
              </div>
              <div className="status-filter">
                <SelectInput
                  name="jobRole"
                  label="Job Role"
                  placeHolder="Select Job Role"
                  value={formValues?.jobRole}
                  handleChange={changeHandler}
                  options={batchJobRole}
                  error={errorMessage?.jobRole}
                />
              </div>
              {/* <div className="status-filter">
                    <SelectInput
                      name="section"
                      label="Section"
                      placeHolder="Select section"
                      value={formValues?.section}
                      handleChange={changeHandler}
                      options={sections}
                      error={errorMessage?.section}
                    />
                </div> */}
              {/* <div className="status-filter">
                    <SelectInput
                      name="language"
                      label="Language"
                      placeHolder="Select Language"
                      value={formValues?.language}
                      handleChange={changeHandler}
                      options={languageOptions}
                      error={errorMessage?.language}
                    />
                </div> */}
            </>
          )}
          <div className="filter-btn-wrapper">
            <button
              className="outlined-btn"
              style={{
                backgroundColor:
                  formValues?.organisationName?.length < 1 &&
                  formValues?.userRole?.length < 1 &&
                  formValues?.status?.length < 1
                    ? "lightgray"
                    : "",
              }}
              disabled={
                formValues?.organisationName?.length < 1 &&
                formValues?.userRole?.length < 1 &&
                formValues?.status?.length < 1
                  ? true
                  : false
              }
              onClick={(e) => modalHandleClearAll(e)}
            >
              Clear All
            </button>
            <button
              className="light-blue-btn"
              onClick={(e) => modalHandleSubmit(e)}
              style={{
                backgroundColor:
                  formValues?.organisationName?.length < 1 &&
                  formValues?.userRole?.length < 1 &&
                  formValues?.status?.length < 1
                    ? "lightgray"
                    : "",
              }}
              disabled={
                formValues?.organisationName?.length < 1 &&
                formValues?.userRole?.length < 1 &&
                formValues?.status?.length < 1
                  ? true
                  : false
              }
            >
              Apply
            </button>
          </div>
        </div>
      </Menu>
    </div>
  );
}
