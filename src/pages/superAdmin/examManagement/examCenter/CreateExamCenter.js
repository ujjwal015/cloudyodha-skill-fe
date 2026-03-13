import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Box, Button } from "@mui/material";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { ReactComponent as ArrowLeft } from "../../../../assets/images/pages/examManagement/back-arrow.svg";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../utils/validation/superAdmin/examManagement";
import SelectInput from "../../../../components/common/SelectInput";
import Input from "../../../../components/common/input";
import { errorToast, successToast } from "../../../../utils/projectHelper";
import api from "../../../../utils/apiHelper";
import {
  createExamCenterApi,
  getTrainingPartnerListApi,
  createTrainingPartnerApi,
} from "../../../../api/superAdminApi/examManagement";
import { SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE_BULK_UPLOAD, SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import {
  POC_DESIGNATION,
  STATES,
} from "../../../../config/constants/projectConstant";
import { API_ROOT } from "../../../../config/constants/apiConstants/auth";
import AutoCompleteInput from "../../../../components/common/AutoCompleteInput";
import { getCityListsApi, getStateListsApi } from "../../../../api/authApi";
import {
  authSelector,
  getCityLists,
} from "../../../../redux/slicers/authSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import CommonModal from "../../../../components/common/Modal/CommonModal";
import { ReactComponent as UploadIcon } from "../../../../assets/images/common/upload.svg";

const initialFormValues = {
  trainingPartner: "",
  examCenterName: "",
  trainingCenterId:"",
  mobile: "",
  state: "",
  district: "",
  pincode: "",
  address: "",
  noOfSeats: "",
  locationURL: "",
  poc: [
    {
      designation: "",
      name: "",
      email: "",
      mobile: "",
    },
  ],
};

const trainingPartnerInitial = {
  trainingPartner: "",
  tpId: "",
  address: "",
  pincode: "",
  district: "",
  state: "",
  spocName: "",
  spocMobile: "",
  spocEmail: "",
};

// Memoized add button to prevent re-renders
const AddButton = memo(({ onClick }) => (
  <div 
    className="add-button"
    onClick={onClick}
    style={{
      cursor: 'pointer',
      padding: '0px 2px',
      backgroundColor: '#F9FAFB', 
      border: '1px solid #D1D5DB',
      borderRadius: '6px', 
      fontSize: '14px',
      fontWeight: 400,
      color: '#111827', 
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
      display: 'inline-block',
    }}
  >
    + Add New Partner
  </div>
));

// Memoized dropdown arrow component to prevent re-renders
const DropdownArrow = memo(({ onClick }) => (
  <div className="dropdown-arrow" onClick={onClick}>
    <Icon icon="mdi:chevron-down" width="20" height="20" />
  </div>
));

const CreateNewAssessment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const { stateLists = [], cityLists = [] } = useSelector(authSelector);
  const [errors, setErrors] = useState({});
  const [cityLoading, setCityLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTPModal, setShowTPModal] = useState(false);
  const [tpFormValues, setTpFormValues] = useState(trainingPartnerInitial);
  const [tpErrors, setTpErrors] = useState({});
  const [tpCityLoading, setTpCityLoading] = useState(false);
  const [tpCityLists, setTpCityLists] = useState([]);
  const [trainingPartners, setTrainingPartners] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tpSubmitLoading, setTpSubmitLoading] = useState(false);

  // Combine existing options with newly added training partners
  const trainingPartnerOptions = [
    ...options,
    ...trainingPartners.map(tp => ({ 
      label: tp.trainingPartner, 
      value: tp.trainingPartner 
    }))
  ].filter(option => option.label && option.value);
  
  // Find the selected training partner label to display in the input
  const selectedTrainingPartner = trainingPartnerOptions.find(
    option => option.value === formValues.trainingPartner
  )?.label || "";

  // Debounce search to prevent too many rerenders
  const handleSearch = useCallback((e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // Clear selection if user is editing/backspacing
    if (formValues.trainingPartner) {
      const currentSelected = trainingPartnerOptions.find(
        option => option.value === formValues.trainingPartner
      )?.label || "";
      
      if (newValue !== currentSelected) {
        setFormValues(prevValues => ({
          ...prevValues,
          trainingPartner: ""
        }));
      }
    }
    
    // Only update page and dropdown visibility once per debounce 
    setPage(1);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  }, [formValues.trainingPartner, trainingPartnerOptions, isDropdownOpen]);

  // Memoize dropdown options filtering to reduce computations on each render
  const filteredOptionsWithPagination = useMemo(() => {
    const filtered = trainingPartnerOptions.filter(
      option => option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
    
    // Update hasMore state when filtered results change
    const hasMoreItems = filtered.length > page * 10;
    if (hasMore !== hasMoreItems) {
      setHasMore(hasMoreItems);
    }
    
    return filtered.slice(0, page * 10);
  }, [trainingPartnerOptions, searchQuery, page, hasMore]);

  // Update filtered options when the memoized value changes
useEffect(() => {
    setFilteredOptions(filteredOptionsWithPagination);
  }, [filteredOptionsWithPagination]);

  const handleScroll = () => {
    if (
      dropdownRef.current &&
      dropdownRef.current.scrollTop + dropdownRef.current.clientHeight >= 
      dropdownRef.current.scrollHeight - 20 &&
      hasMore
    ) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleClickOutside = useCallback((event) => {
    if (
      inputRef.current && 
      !inputRef.current.contains(event.target) &&
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
      
      // If search query doesn't match any valid option, restore the previous selection
      const matchingOption = trainingPartnerOptions.find(
        option => option.label.toLowerCase() === searchQuery.toLowerCase()
      );
      
      if (!matchingOption) {
        // If no match found but we had a previous selection, restore it
        if (formValues.trainingPartner) {
          const previousSelected = trainingPartnerOptions.find(
            option => option.value === formValues.trainingPartner
          );
          if (previousSelected) {
            setSearchQuery(previousSelected.label);
          }
        } else {
          // Clear the search if no previous selection
          setSearchQuery("");
        }
      } else if (matchingOption.value !== formValues.trainingPartner) {
        // If we have a matching option different from current selection, select it
        setFormValues({
          ...formValues,
          trainingPartner: matchingOption.value
        });
      }
    }
  }, [formValues, trainingPartnerOptions, searchQuery]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      // Focus the input when opening dropdown
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    const formData = {
      country: "India",
    };
    dispatch(getStateListsApi(formData, setLoading));
    
    // Fetch training partners from API
    setLoading(true);
    dispatch(getTrainingPartnerListApi(setLoading, setOptions));
  }, []);

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;

    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);
    if (fieldError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...restErrors } = prevErrors;
        return restErrors;
      });
    }
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };

  const tpChangeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    if (fieldError) {
      setTpErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    } else {
      setTpErrors((prevErrors) => {
        const { [name]: removedError, ...restErrors } = prevErrors;
        return restErrors;
      });
    }
    setTpFormValues({
      ...tpFormValues,
      [name]: fieldValue,
    });
  };

  const getTpCityListsHandler = (event) => {

    const { value } = event.target;
    const fipsCode = stateLists.find((state) => state.label === value).value;
    const formData = {
      fipsCode,
    };
    setTpCityLoading(true);
    dispatch(getCityListsApi(formData, setTpCityLoading));
    setTpFormValues((prev) => ({ ...prev, district: "" }));
  };

  const changeHandlerPOC = (e, index) => {
    const { name, value, type, checked } = e.target;
    const fieldError = validateField(name, value);

    let targetPOC = formValues?.poc[index];
    const updatedPOC = { ...targetPOC, [name]: value };
    var existingPOC = [...formValues?.poc];
    existingPOC[index] = updatedPOC;

    setFormValues({ ...formValues, poc: existingPOC });

    if (fieldError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${name}${index}`]: fieldError,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [`${name}${index}`]: removedError, ...restErrors } = prevErrors;
        return restErrors;
      });
    }
  };

  const getCityListsHandler = (event) => {
    dispatch(getCityLists([]));
    const { value } = event.target;
    const fipsCode = stateLists.find((state) => state.label === value).value;
    const formData = {
      fipsCode,
    };
    setCityLoading(true);
    dispatch(getCityListsApi(formData, setCityLoading));
    setFormValues((prev) => ({ ...prev, district: "" }));
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  const StateLists = stateLists?.map((item) => {
    return { ...item, value: item.label };
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
      if (name === "poc") {
        formValues?.poc.map((el, index) => {
          Object.keys(el).forEach((poc_key) => {
            const value_poc = el[poc_key];
            const fieldError_poc = validateField(poc_key, value_poc);
            if (fieldError_poc) {
              formErrors[`${poc_key}${index}`] = fieldError_poc;
            }
          });
        });
      }
    });
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const stateLabel = StateLists.find(
        (item) => item.value == formValues.state
      ).label;
      const formDataNew = {
        ...formValues,
        state: stateLabel,
        // Ensure training partner is properly formatted for the API
        trainingPartner: formValues.trainingPartner,
      };
      
      setLoading(true);
      dispatch(
        createExamCenterApi(formDataNew, setLoading, clearFormValues, navigate)
      );
    }
  };

  const addPOCHandler = () => {
    let isValidForm = true;
    formValues?.poc?.map((el, index) => {
      Object.keys(el).forEach((poc_key) => {
        const value_poc = el[poc_key];
        const fieldError_poc = validateField(poc_key, value_poc);
        if (fieldError_poc) {
          isValidForm = false;
          setErrors((prevState) => {
            return {
              ...prevState,
              [`${poc_key}${index}`]: fieldError_poc,
            };
          });
        }
      });
    });

    if (!isValidForm) return;

    const existingPOC = formValues?.poc;
    const newPOC = {
      designation: "",
      name: "",
      email: "",
      mobile: "",
    };
    const newPOCArr = [...existingPOC, newPOC];
    setFormValues({ ...formValues, poc: newPOCArr });
  };

  const removePOCHandler = (index) => {
    const existingPOC = formValues?.poc;
    existingPOC.splice(index, 1);
    setFormValues({ ...formValues, poc: existingPOC });
    setErrors({});
    errorToast(`POC Form ${index + 1} Removed`);
  };

  const handleAddTrainingPartner = () => {
    const tpFormErrors = {};
    Object.keys(tpFormValues).forEach((name) => {
      const value = tpFormValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        tpFormErrors[name] = fieldError;
      }
    });
    setTpErrors(tpFormErrors);

    if (Object.keys(tpFormErrors).length === 0) {
      // Set loading state for the modal save button
      setTpSubmitLoading(true);
      
      // Define success callback
      const onSuccess = (data) => {
        // Handle successful response
        const newTrainingPartner = {
          ...tpFormValues,
          // Use the ID from the API response if available
          _id: data?._id,
          id: data?._id || data?.id || tpFormValues.tpId
        };
        
        // Update local state with the new training partner
        setTrainingPartners([...trainingPartners, newTrainingPartner]);
        
        // Update the main form with the selected training partner
        setFormValues({
          ...formValues, 
          trainingPartner: newTrainingPartner._id || newTrainingPartner.id || newTrainingPartner.tpId
        });
        
        // Reset the form and close modal
        setTpFormValues(trainingPartnerInitial);
        setShowTPModal(false);
        successToast("Training Partner added successfully");
      };
      
      // Define error callback
      const onError = (error) => {
        // Display error message
        if (error.response?.data?.message) {
          errorToast(error.response.data.message);
        } else {
          errorToast("Failed to create Training Partner. Please try again.");
        }
        // Don't close the modal - keep it open for corrections
      };
      
      // Call the API function from the API file
      dispatch(createTrainingPartnerApi(
        tpFormValues,
        setTpSubmitLoading,
        onSuccess,
        onError
      ));
    }
  };

  // Use selected value for display if input isn't focused, otherwise use search query
  const displayValue = inputRef.current === document.activeElement 
    ? searchQuery 
    : (selectedTrainingPartner || searchQuery);

  // Handle input focus to show the search query for editing
  const handleInputFocus = () => {
    setFocusedInput("trainingPartner");
    setIsDropdownOpen(true);
    // Show the search query when focused
    if (selectedTrainingPartner) {
      setSearchQuery(selectedTrainingPartner);
    }
  };

  // Memoize the add button handler
  const handleShowTPModal = useCallback(() => {
    setShowTPModal(true);
  }, []);

  return (
    <div className="main-content">
      <div className="main-container exam-management-page">
        <div className="title">
          <div className="title-text">
            <ArrowLeft
              onClick={() => navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE)}
            />
            <h1> Add Exam Centre </h1>
          </div>
          <div className="view-list-btn">
            <button
              className="view-list-btn-text"
              onClick={() => navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE)}
            >
              <ListOutlinedIcon
                sx={{ fontSize: "20px", color: "#FFFFFF", mr: 1 }}
              />
              View List
            </button>
          </div>
        </div>
        <section className="sub-admin-wrapper">
          <div className="tab-content">
            <div className="form-title">
              <h1>CREATE EXAM CENTRE</h1>
            </div>
            <div className="form-wrapper">
              <div className="form">
                {/* ============Form Starts here ========= */}
                <form>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ width: "calc(50% - 10px)", position: "relative" }}
                      className="form-group"
                    >
                      <div className="autocomplete-wrapper">
                        <label style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            Training Partner
                            <span className="mandatory">&nbsp;*</span>
                          </div>
                          <AddButton onClick={handleShowTPModal} />
                        </label>
                        <div className="autocomplete-container" ref={inputRef}>
                          <input
                            type="text"
                            className="search-input"
                            placeholder="Search Training Partner"
                            value={displayValue}
                            onChange={handleSearch}
                            onFocus={handleInputFocus}
                            ref={inputRef}
                          />
                          <DropdownArrow onClick={toggleDropdown} />
                          
                          {isDropdownOpen && (
                            <div 
                              className="dropdown-container" 
                              ref={dropdownRef}
                              onScroll={handleScroll}
                            >
                              {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                  <div
                                    key={option.value}
                                    className={`dropdown-item ${
                                      formValues.trainingPartner === option.value ? "selected" : ""
                                    }`}
                                    onClick={() => {
                                      setFormValues({
                                        ...formValues,
                                        trainingPartner: option.value,
                                      });
                                      setSearchQuery(option.label);
                                      setIsDropdownOpen(false);
                                    }}
                                  >
                                    {option.label}
                                  </div>
                                ))
                              ) : (
                                <div className="dropdown-no-results">
                                  No results found
                                </div>
                              )}
                              {hasMore && (
                                <div className="dropdown-loading">
                                  Loading more...
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {errors.trainingPartner && (
                          <p className="error-input">{errors.trainingPartner}</p>
                        )}
                      </div>
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Exam Centre"
                        name="examCenterName"
                        placeholder="Exam Centre"
                        onFocus={focusHandler}
                        error={errors?.examCenterName}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.examCenterName}
                        mandatory
                      />
                    </div>

                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Training Center ID"
                        name="trainingCenterId"
                        placeholder="Training Centre ID"
                        onFocus={focusHandler}
                        error={errors?.trainingCenterId}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.trainingCenterId}
                        mandatory
                      />
                    </div>

                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Mobile No "
                        name="mobile"
                        type={"number"}
                        hideExponants={true}
                        placeholder="Mobile No "
                        onFocus={focusHandler}
                        error={errors?.mobile}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.mobile}
                        mandatory
                      />
                    </div>

                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <SelectInput
                        name="state"
                        label="State"
                        placeHolder="Select State"
                        value={formValues?.state}
                        handleChange={(e) => {
                          changeHandler(e);
                          getCityListsHandler(e);
                        }}
                        options={StateLists}
                        error={errors?.state}
                        mandatory
                      />
                    </div>

                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <SelectInput
                        name="district"
                        label="District"
                        placeHolder="Select District"
                        value={formValues?.district}
                        loading={cityLoading}
                        handleChange={changeHandler}
                        options={cityLists}
                        error={errors?.district}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Pincode"
                        name="pincode"
                        type={"number"}
                        hideExponants={true}
                        placeholder="Enter Pincode"
                        onFocus={focusHandler}
                        error={errors?.pincode}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.pincode}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        label="Address Line "
                        name="address"
                        placeholder="Address Line "
                        onFocus={focusHandler}
                        error={errors?.address}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.address}
                        mandatory
                      />
                    </div>

                    <div className="form-group" style={{ width: "100%" }}>
                      <Input
                        label="location URL"
                        name="locationURL"
                        placeholder="location URL"
                        onFocus={focusHandler}
                        error={errors?.locationURL}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.locationURL}
                        mandatory
                      />
                    </div>

                    <div className="form-group" style={{ width: "100%" }}>
                      <Input
                        label="Seat Available"
                        name="noOfSeats"
                        type={"number"}
                        hideExponants={true}
                        placeholder="Enter No. of Seats "
                        onFocus={focusHandler}
                        error={errors?.noOfSeats}
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        value={formValues?.noOfSeats}
                        mandatory
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        {formValues.poc.length > 0 ? (
          <>
            {formValues?.poc?.map((el, index) => {
              return (
                <div key={index}>
                  <section className="sub-admin-wrapper">
                    <div className="tab-content" style={{ marginTop: 30 }}>
                      <div className="edit-profile">
                        <div className="form-wrapper">
                          <div className="form_title">
                            <h1>
                              POC FORM <span>{index + 1}</span>
                            </h1>
                          </div>
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
                                  className="form-group"
                                  style={{ width: "100%" }}
                                >
                                  <Input
                                    label="Name"
                                    type="text"
                                    name={"name"}
                                    placeholder="Enter Name"
                                    onFocus={focusHandler}
                                    error={errors?.[`name${index}`]}
                                    onBlur={blurHandler}
                                    onChange={(e) => changeHandlerPOC(e, index)}
                                    value={formValues?.poc[index].name}
                                    mandatory
                                  />
                                </div>

                                <div
                                  className="form-group"
                                  style={{ width: "100%" }}
                                >
                                  <SelectInput
                                    name="designation"
                                    label="Designation"
                                    placeHolder="Select Designation"
                                    value={
                                      formValues?.poc[index].designation
                                    }
                                    handleChange={(e) =>
                                      changeHandlerPOC(e, index)
                                    }
                                    options={POC_DESIGNATION}
                                    error={errors?.[`designation${index}`]}
                                  />
                                </div>
                                <div
                                  style={{ width: "calc(50% - 10px)" }}
                                  className="form-group"
                                >
                                  <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email here"
                                    onFocus={focusHandler}
                                    error={errors?.[`email${index}`]}
                                    onBlur={blurHandler}
                                    onChange={(e) => changeHandlerPOC(e, index)}
                                    value={formValues?.poc[index].email}
                                    mandatory
                                  />
                                </div>
                                <div
                                  style={{ width: "calc(50% - 10px)" }}
                                  className="form-group"
                                >
                                  <Input
                                    label="Contact Number"
                                    type={"number"}
                                    name="mobile"
                                    inputProps={{
                                      inputMode: "numeric",
                                      pattern: "[0-9]*",
                                    }}
                                    placeholder="Enter Contact No."
                                    onFocus={focusHandler}
                                    error={errors?.[`mobile${index}`]}
                                    onBlur={blurHandler}
                                    onChange={(e) => changeHandlerPOC(e, index)}
                                    value={formValues?.poc[index].mobile}
                                    hideExponants={true}
                                    mandatory
                                  />
                                </div>
                                <div className="addNewPOC_container">
                                  <Button
                                    className={`light-blue-btn submit-btn`}
                                    variant="contained"
                                    onClick={addPOCHandler}
                                    sx={{
                                      width: "100px",
                                      height: "40px",
                                      textTransform: "unset",
                                    }}
                                  >
                                    Add New
                                  </Button>
                                  <Button
                                    className={`light-red-btn submit-btn`}
                                    variant="contained"
                                    onClick={(e) => removePOCHandler(index)}
                                    sx={{
                                      width: "100px",
                                      height: "40px",
                                      textTransform: "unset",
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              );
            })}
          </>
        ) : (
          <section className="sub-admin-wrapper">
            <div className="tab-content" style={{ marginTop: 30 }}>
              <div className="edit-profile">
                <h1 className="no_poc">POC Details</h1>
                <Button
                  className={`light-blue-btn submit-btn`}
                  variant="contained"
                  onClick={addPOCHandler}
                  sx={{
                    width: "150px",
                    height: "40px",
                    textTransform: "unset",
                  }}
                >
                  Add POC Details
                </Button>
              </div>
            </div>
          </section>
        )}
        <div className="action-btn-card">
          <Button
            className={`outlined-btn back-btn`}
            onClick={() => {
              navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE);
            }}
          >
            Cancel
          </Button>
          <Button
            className={`light-blue-btn  create-btn`}
            onClick={handleSubmit}
            disabled={loading ? true : false}
          >
            {loading ? <PulseLoader size="10px" color="white" /> : "Create"}
          </Button>
        </div>
      </div>

      {/* Training Partner Modal */}
      <CommonModal open={showTPModal} handleClose={() => setShowTPModal(false)}>
        <div className="training-partner-modal">
          <div className="training-partner-modal-header">
            <h2>Add New Training Partner</h2>
            <div 
              onClick={() => setShowTPModal(false)}
              style={{ cursor: "pointer" }}
            >
              <Icon icon="mdi:close" width="24" height="24" />
            </div>
          </div>
          
          <div className="training-partner-modal-body">
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}>
              <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                <Input
                  label="TP Name"
                  type="text"
                  name="trainingPartner"
                  placeholder="Enter TP Name"
                  onBlur={blurHandler}
                  onChange={tpChangeHandler}
                  error={tpErrors?.trainingPartner}
                  onFocus={focusHandler}
                  value={tpFormValues?.trainingPartner}
                  mandatory
                />
              </div>
              
              <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                <Input
                  label="TP ID"
                  type="text"
                  name="tpId"
                  placeholder="Enter TP ID"
                  onBlur={blurHandler}
                  onChange={tpChangeHandler}
                  error={tpErrors?.tpId}
                  onFocus={focusHandler}
                  value={tpFormValues?.tpId}
                  mandatory
                />
              </div>
              
              <div className="form-group" style={{ width: "100%" }}>
                <Input
                  label="Address"
                  type="text"
                  name="address"
                  placeholder="Enter Address"
                  onBlur={blurHandler}
                  onChange={tpChangeHandler}
                  error={tpErrors?.address}
                  onFocus={focusHandler}
                  value={tpFormValues?.address}
                  mandatory
                />
              </div>
              
              <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                <SelectInput
                  name="state"
                  label="State"
                  placeHolder="Select State"
                  value={tpFormValues?.state}
                  handleChange={(e) => {
                    tpChangeHandler(e);
                    getTpCityListsHandler(e);
                  }}
                  options={StateLists}
                  error={tpErrors?.state}
                  mandatory
                />
              </div>
              
              <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                <SelectInput
                  name="district"
                  label="District"
                  placeHolder={tpCityLoading ? "Loading..." : "Select District"}
                  value={tpFormValues?.district}
                  loading={tpCityLoading}
                  handleChange={tpChangeHandler}
                  options={cityLists}
                  error={tpErrors?.district}
                  disabled={!tpFormValues.state || tpCityLoading}
                  mandatory
                />
              </div>
              
              <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                <Input
                  label="Pin Code"
                  type="number"
                  name="pincode"
                  placeholder="Enter Pin Code"
                  onBlur={blurHandler}
                  onChange={tpChangeHandler}
                  error={tpErrors?.pincode}
                  onFocus={focusHandler}
                  value={tpFormValues?.pincode}
                  mandatory
                  hideExponants
                />
              </div>
              
              <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                <Input
                  label="SPOC Name"
                  type="text"
                  name="spocName"
                  placeholder="Enter SPOC Name"
                  onBlur={blurHandler}
                  onChange={tpChangeHandler}
                  error={tpErrors?.spocName}
                  onFocus={focusHandler}
                  value={tpFormValues?.spocName}
                  mandatory
                />
              </div>
              
              <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                <Input
                  label="SPOC No."
                  type="number"
                  name="spocMobile"
                  placeholder="Enter SPOC No."
                  onBlur={blurHandler}
                  onChange={tpChangeHandler}
                  error={tpErrors?.spocMobile}
                  onFocus={focusHandler}
                  value={tpFormValues?.spocMobile}
                  mandatory
                  hideExponants
                />
              </div>
              
              <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
                <Input
                  label="SPOC E-mail"
                  type="email"
                  name="spocEmail"
                  placeholder="Enter SPOC E-mail"
                  onBlur={blurHandler}
                  onChange={tpChangeHandler}
                  error={tpErrors?.spocEmail}
                  onFocus={focusHandler}
                  value={tpFormValues?.spocEmail}
                  mandatory
                />
              </div>
            </div>
          </div>
          
          <div className="training-partner-modal-footer">
            <Button
              className="outlined-btn"
              onClick={() => setShowTPModal(false)}
              disabled={tpSubmitLoading}
            >
              Cancel
            </Button>
            <Button
              className="light-blue-btn"
              onClick={handleAddTrainingPartner}
              disabled={tpSubmitLoading}
            >
              {tpSubmitLoading ? <PulseLoader size="10px" color="white" /> : "Save"}
            </Button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};

export default CreateNewAssessment;
