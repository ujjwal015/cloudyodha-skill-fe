import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import { Button } from "@mui/material";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { ReactComponent as ArrowLeft } from "../../../../assets/images/pages/examManagement/back-arrow.svg";
import PulseLoader from "react-spinners/PulseLoader";
import validateField from "../../../../utils/validation/superAdmin/examManagement";
import SelectInput from "../../../../components/common/SelectInput";
import Input from "../../../../components/common/input";
import {
  editExamCenterApi,
  getSingleExamCenterDetailApi,
  getTrainingPartnerListApi,
} from "../../../../api/superAdminApi/examManagement";
import { SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import {
  STATES,
  POC_DESIGNATION,
} from "../../../../config/constants/projectConstant";
import AutoCompleteInput from "../../../../components/common/AutoCompleteInput";
import { getCityListsApi, getStateListsApi } from "../../../../api/authApi";
import {
  authSelector,
  getCityLists,
} from "../../../../redux/slicers/authSlice";
import { errorToast } from "../../../../utils/projectHelper";

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

const EditExamCenter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stateLists = [], cityLists = [] } = useSelector(authSelector);
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState("");
  const { examCenterId } = useParams();
  const [fipsCode, setFipsCode] = useState("");
  const [options, setOptions] = useState([
    {
      label: "",
      value: "",
    },
  ]);

  useEffect(() => {
    const formData = {
      country: "India",
    };
    setLoading(true);
    dispatch(getStateListsApi(formData, setLoading));
    dispatch(
      getSingleExamCenterDetailApi(setLoading, setFormValues, examCenterId)
    );
    dispatch(getTrainingPartnerListApi(setLoading, setOptions));
  }, []);

  useEffect(() => {
    const fipsCode = stateLists?.find(
      (state) => state?.label === formValues?.state
    )?.value;

    const formData = {
      fipsCode: fipsCode,
    };

    dispatch(getCityLists([]));
    setCityLoading(true);
    if (formValues.state && formData.fipsCode) {
      dispatch(getCityListsApi(formData, setCityLoading));
    }
  }, [formValues.state, stateLists]);

  const StateLists = stateLists?.map((item) => {
    return { ...item, value: item.label };
  });

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

  const changeHandlerPOC = (e, index) => {
    const { name, value, type, checked } = e.target;
    const fieldError = validateField(name, value);

    let targetPOC = formValues?.poc[index];
    const updatedPOC = { ...targetPOC, [name]: value };
    var existingPOC = [...formValues?.poc];
    existingPOC[index] = updatedPOC;

    setFormValues({ ...formValues, poc: existingPOC });

    if (fieldError) {
      setErrors({
        [`${name}${index}`]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const getCityListsHandler = (event) => {
    dispatch(getCityLists([]));
    const { value } = event.target;
    const fipsCode = stateLists?.find((state) => state.label === value).value;
    console.log(fipsCode, value, "valueee");
    const formData = {
      fipsCode: fipsCode,
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
      setLoading(true);
      const { trainingPartner, ...rest } = formValues;
      const pocData = rest.poc?.map((pocItem) => {
        const tempPoc = pocItem;
        delete tempPoc?._id;
        return tempPoc;
      });
      dispatch(
        editExamCenterApi(
          setLoading,
          examCenterId,
          { ...rest, poc: pocData },
          navigate
        )
      );
      console.log(trainingPartner);
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
    const newPOCArr = [...(existingPOC ?? []), newPOC];
    setFormValues({ ...formValues, poc: newPOCArr });
  };
  const removePOCHandler = (index) => {
    const existingPOC = formValues?.poc;
    existingPOC.splice(index, 1);
    setFormValues({ ...formValues, poc: existingPOC });
    setErrors({});
    errorToast(`POC Form ${index + 1} Removed`);
  };

  return (
    <div className="main-content">
      <div className="main-container exam-management-page">
        <div className="title">
          <div className="title-text">
            <ArrowLeft
              onClick={() => navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE)}
            />
            <h1> Exam Centre</h1>
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
              <h1>EDIT EXAM CENTRE</h1>
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
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
                    >
                      <AutoCompleteInput
                        label="Training Partner"
                        name="trainingPartner"
                        value={formValues?.trainingPartner}
                        placeHolder="Training Partner"
                        handleChange={changeHandler}
                        options={options}
                        error={errors?.trainingPartner}
                        mandatory
                        disabled={true}
                      />
                    </div>
                    <div
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
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
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
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
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
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
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
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
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
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

                    <div className="form-group" style={{ width: "calc(50% - 10px)" }}>
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
        {formValues?.poc?.length > 0 ? (
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
                                    // onPaste={(e) =>
                                    //   // handlePOCTrimPaste(e, index)
                                    // }
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
                                    value={formValues?.poc[index].designation}
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
                                    // onPaste={(e) =>
                                    //   handlePOCTrimPaste(e, index)
                                    // }
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
                                    // onPaste={(e) =>
                                    //   handlePOCTrimPaste(e, index)
                                    // }
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
                                      // display: [
                                      //   formValues?.poc.length > 1
                                      //     ? "inline-flex"
                                      //     : "none",
                                      // ],
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
        <section className="buttonsBox">
          <div className="action-btn">
            <div className="action-btn-card">
              <Button
                className={`outlined-btn back-btn`}
                variant="outlined"
                onClick={() => {
                  navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE);
                }}
              >
                Cancel
              </Button>
              <Button
                className={`light-blue-btn  create-btn`}
                variant="contained"
                onClick={handleSubmit}
                disabled={loading ? true : false}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "Save"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditExamCenter;
