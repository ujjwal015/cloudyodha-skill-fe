import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import validateField from "./../../../../utils/validateField";
import Input from "./../../../../components/common/input";
import { getStateListsApi } from "./../../../../api/authApi";
import { ReactComponent as PaperClip } from "./../../../../assets/icons/paperclip.svg";
import { ReactComponent as InfoIcon } from "./../../../../assets/icons/informationIcon.svg";
import UserProfile from "./../../../../assets/images/pages/clientManagement/dummy-user-profile.png";
import { ASSESSOR_MANAGEMENT_HOME } from "../../../../config/constants/routePathConstants/superAdmin";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { getAllJobRoles } from "../../../../api/superAdminApi/jobRoleManagement";
import { getClientManagementListsApi } from "../../../../api/superAdminApi/clientManagement";
import { Button } from "@mui/material";
import { FadeLoader, RiseLoader } from "react-spinners";
import { Icon } from "@iconify/react";
import {
  createAssessorPersonalDetailsApi,
  deleteAssessorPersonalDetailsApi,
  updateAssessorPersonalDetailsApi,
  viewAllAssessorDetailsApi,
} from "../../../../api/superAdminApi/assessorManagement";
import { assessorAttendanceSelector } from "../../../../redux/slicers/superAdmin/assessorAttendanceSlice";
import { getSchemeType } from "../../../../utils/projectHelper";

const initialFormValues = [
  { cardType: "AadharCard", cardNo: "", card: "" },
  { cardType: "Pancard", cardNo: "", card: "" },
];

const initialFormValuesForPMVishvakarma = [{ cardType: "Pancard", cardNo: "", card: "" }];

const PersonalDetail = (props) => {
  const { controlFunc, currentTab, schemeType } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const SECTION = location?.search?.split("=")?.["1"];
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState([]);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState("");
  const { jobRolesListAll = [] } = useSelector(clientManagementSelector);
  const [jobRoles, setJobRoles] = useState();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const params = useParams();
  const assessorMDBId = params.id;
  const { assessorPersonalDetails = [] } = useSelector(assessorAttendanceSelector);

  useEffect(() => {

    if (schemeType.length > 0) {
      if (getSchemeType(schemeType).includes("Non PMKVY") || getSchemeType(schemeType).includes("PMKVY")) {
        setFormValues(initialFormValues);
      } else {
        setFormValues(initialFormValuesForPMVishvakarma);
      }
    }
  }, [schemeType]);

  useEffect(() => {
    if (assessorPersonalDetails.length > 0) {
      setFormValues([...assessorPersonalDetails]);
    }
  }, [assessorPersonalDetails]);

  const changeHandler = (event, index) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    // Create a copy of the formValues array to update the specific element at the given index
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = {
      ...updatedFormValues[index],
      ["cardNo"]: value,
    };

    // Update the formValues state
    setFormValues(updatedFormValues);
    // Update the errors state for the specific field at the given index
    if (fieldError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "", // Reset the error message if there is no error
      }));
    }
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

  const loadFile = (e, index) => {
    const file = e.target.files[0];

    const updatedFormValues = [...formValues];
    updatedFormValues[index] = {
      ...updatedFormValues[index],
      ["card"]: file, // Update the respective field with the file object
    };

    // Update the formValues state
    setFormValues(updatedFormValues);
  };

  const deleteImage = (e, index) => {
    const name = e.target.getAttribute("name");

    // Ensure formValues is initialized as an array of objects
    const existingFormData = Array.isArray(formValues) ? [...formValues] : [];

    // Reset the uploaded image and remove it from formValues at the specified index
    if (existingFormData[index]) {
      existingFormData[index].card = ""; // Reset the card value at the specified index
      setFormValues(existingFormData);
    }

    // Reset the file input to allow re-uploading
    const fileInput = document.getElementById(name);
    if (fileInput) {
      fileInput.value = null; // Reset the file input value to allow re-uploading the same file
    }
  };

  const handleIconHover = (event) => {
    const { clientX, clientY } = event;
    setShowTooltip(true);
    setTooltipPosition({ x: clientX, y: clientY + 10 });
  };

  const handleIconLeave = () => {
    setShowTooltip(false);
  };

  const abortProfileCreation = () => {
    clearFormValues();
    navigate(`${ASSESSOR_MANAGEMENT_HOME}?section=${SECTION}`);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formErrors = {};
  //   formValues.map((el) => {
  //     Object.keys(el).forEach((name) => {
  //       if (el?.cardType === "AadharCard") {
  //         if (name === "card") {
  //           const value = el[name];
  //           if (value === "") {
  //             formErrors["AadharCard"] = "Please attatch your Aadhar Card";
  //           }
  //         }
  //         if (name === "cardNo") {
  //           const value = el[name];
  //           const fieldError = validateField("aadharNo", value);
  //           if (fieldError) {
  //             formErrors["aadharNo"] = fieldError;
  //           }
  //         }
  //       } else if (el?.cardType === "Pancard") {
  //         if (name === "card") {
  //           const value = el[name];
  //           if (value === "") {
  //             formErrors["Pancard"] = "Please attatch your Pan Card";
  //           }
  //         }
  //         if (name === "cardNo") {
  //           const value = el[name];
  //           const fieldError = validateField("panCardNo", value);
  //           if (fieldError) {
  //             formErrors["panCardNo"] = fieldError;
  //           }
  //         }
  //       }
  //     });
  //   });
  //   setErrors(formErrors);

  //   if (Object.keys(formErrors).length === 0) {
  //     formValues.map((doc) => {
  //       const pId = doc?._id || false;
  //       if (!pId) {
  //         dispatch(createAssessorPersonalDetailsApi(setLoading, assessorMDBId, doc, clearFormValues, controlFunc));
  //       } else
  //         dispatch(updateAssessorPersonalDetailsApi(setLoading, assessorMDBId, doc, clearFormValues, controlFunc, pId));
  //     });
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    if(getSchemeType(schemeType).includes("Non PMKVY") || getSchemeType(schemeType).includes("PMKVY")){
      formValues.map((el) => {
        Object.keys(el).forEach((name) => {
          if (el?.cardType === "AadharCard") {
            if (name === "card") {
              const value = el[name];
              if (value === "") {
                formErrors["AadharCard"] = "Please attatch your Aadhar Card";
              }
            }
            if (name === "cardNo") {
              const value = el[name];
              const fieldError = validateField("aadharNo", value);
              if (fieldError) {
                formErrors["aadharNo"] = fieldError;
              }
            }
          } else if (el?.cardType === "Pancard") {
            if (name === "card") {
              const value = el[name];
              if (value === "") {
                formErrors["Pancard"] = "Please attatch your Pan Card";
              }
            }
            if (name === "cardNo") {
              const value = el[name];
              const fieldError = validateField("panCardNo", value);
              if (fieldError) {
                formErrors["panCardNo"] = fieldError;
              }
            }
          }
        });
      });
      setErrors(formErrors);
      if (Object.keys(formErrors).length === 0) {
        formValues.map((doc) => {
          const pId = doc?._id || false;
          if (!pId) {
            dispatch(
              createAssessorPersonalDetailsApi(
                setLoading,
                assessorMDBId,
                doc,
                clearFormValues,
                controlFunc
              )
            );
          } else
            dispatch(
              updateAssessorPersonalDetailsApi(
                setLoading,
                assessorMDBId,
                doc,
                clearFormValues,
                controlFunc,
                pId
              )
            );
        });
      }
    }
    else{
      const error=[];
      formValues.map((el) => {
        Object.keys(el).forEach((name) => {
          if (el?.cardType === "Pancard") {
            if (name === "card") {
              const value = el[name];
              if (value === "") {
                error.push("value not found")
              }
            }
            if (name === "cardNo") {
              const value = el[name];
              const fieldError = validateField("panCardNo", value);
              if (fieldError) {
                error.push("cardnumber missing")
              }
            }
          }
          return error
        });
      });

      if (error.length > 0) {
        controlFunc(2);
      }
      else{
        formValues.map((doc) => {
          const pId = doc?._id || false;
          if (!pId) {
            dispatch(
              createAssessorPersonalDetailsApi(
                setLoading,
                assessorMDBId,
                doc,
                clearFormValues,
                controlFunc
              )
            );
          } else
            dispatch(
              updateAssessorPersonalDetailsApi(
                setLoading,
                assessorMDBId,
                doc,
                clearFormValues,
                controlFunc,
                pId
              )
            );
        });
      }
    }
  };


  const deleteDetailsHandler = (e, id) => {
    dispatch(deleteAssessorPersonalDetailsApi(setLoading, assessorMDBId, id));
  };

  var existingDocType = formValues[0]?.cardType;
  const handleAddNewDocument = () => {
    const requiredDocType = existingDocType === "Pancard" ? "AadharCard" : "Pancard";
    const existingDocs = [...formValues];
    const newDoc = { cardType: requiredDocType, cardNo: "", card: "" };
    existingDocs.push(newDoc);
    setFormValues(existingDocs);
  };

  return (
    <>
      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "block" }}>
            {loading ? (
              <>
                <div className="loader_container">
                  <FadeLoader color="#2ea8db" />
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="form__wrapper">
              <div className="add_btn_wrapper">
                {(getSchemeType(schemeType).includes("Non PMKVY") || getSchemeType(schemeType).includes("PMKVY")) && <Button
                  className={`light-blue-btn submit-btn`}
                  variant="contained"
                  onClick={handleAddNewDocument}
                  style={{ display: [formValues.length >= 2 ? "none" : ""] }}>
                  {`Add ${existingDocType === "Pancard" ? "Aadhar Card" : "Pan Card"}`}
                </Button>}
              </div>
              <div className="form">
                <form>
                  {formValues?.map((el, index) => {
                    return (
                      <div key={index}>
                        {el?.cardType === "AadharCard" ? (
                          <>
                            <div className="PersonalDetail__title">
                              <h4>Aadhar Details</h4>
                              <p>Edit user Aadhar details here</p>
                            </div>
                            <div className="form-group">
                              <Input
                                label="Aadhar No"
                                type="number"
                                name="aadharNo"
                                placeholder="Enter Aadhar Number"
                                onFocus={focusHandler}
                                error={errors?.aadharNo}
                                onBlur={blurHandler}
                                onChange={(event) => changeHandler(event, index)} // Pass the index 0 for AadharCard
                                value={formValues?.[index].cardNo}
                                mandatory
                                hideExponents={true} // Corrected spelling
                              />

                              <div className="card_upload__doc">
                                <input
                                  type="file"
                                  accept=".png, .jpg, .jpeg, .pdf, .doc, .docx"
                                  name="aadharCard"
                                  id="aadharCard"
                                  style={{ display: "none" }}
                                  onChange={(e) => loadFile(e, index)}
                                />
                                <div className="img_upload_title_extention">
                                  <PaperClip width={15} height={15} />
                                  <label htmlFor="aadharCard" style={{ cursor: "pointer" }}>
                                    Add Attachment
                                  </label>
                                  <div className="info_icon_container">
                                    <InfoIcon
                                      width={15}
                                      className="infoIcon"
                                      onMouseOver={handleIconHover}
                                      onMouseLeave={handleIconLeave}
                                    />

                                    {showTooltip && (
                                      <div
                                        className="dialog-box"
                                        style={{
                                          left: `${tooltipPosition.x}px`,
                                          top: `${tooltipPosition.y}px`,
                                        }}>
                                        <p>
                                          Allowed formats are .png.jpg, .jpeg, .doc, .docx, .pdf. The file size should
                                          not exceed 20MB
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="link_wrapper">
                                  <a
                                    href={formValues[index]?.url}
                                    target="location"
                                    className="img_upload_title_extention">
                                    {formValues[index]?.cardFileName || "No File Provided"}
                                  </a>
                                  <Icon
                                    className="trash__icon"
                                    icon="formkit:trash"
                                    name="aadharCard"
                                    width={13}
                                    style={{
                                      cursor: "pointer",
                                      display: [formValues[index]?.cardFileName ? "" : "none"],
                                    }}
                                    onClick={(e) => deleteDetailsHandler(e, formValues[index]?._id)}
                                  />
                                </div>
                                <div
                                  className="uploaded_image_container"
                                  style={{
                                    display: [formValues?.[index].card ? "" : "none"],
                                  }}>
                                  <p>{formValues?.[index].card ? formValues?.[index].card?.name : ""}</p>
                                  <Icon
                                    className="trash__icon"
                                    icon="formkit:trash"
                                    name="aadharCard"
                                    onClick={(e) => deleteImage(e, index)}
                                  />
                                </div>
                                <p className="error-input">{errors?.AadharCard || ""}</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="PersonalDetail__title">
                              <h4>PAN Card Details</h4>
                              <p>Edit user PAN Card details here</p>
                            </div>
                            <div className="form-group">
                              <Input
                                label="PAN Card No"
                                type={"text"}
                                name="panCardNo"
                                placeholder="Enter PAN Card Number"
                                onFocus={focusHandler}
                                error={errors?.panCardNo}
                                onBlur={blurHandler}
                                onChange={(event) => changeHandler(event, index)} // Pass the index 0 for AadharCard
                                value={formValues?.[index].cardNo}
                                mandatory={false}
                              />
                              <div className="card_upload__doc">
                                <input
                                  type="file"
                                  accept=".png, .jpg, .jpeg, .pdf, .doc, .docx"
                                  name="panCard"
                                  id="panCard"
                                  style={{ display: "none" }}
                                  onChange={(e) => loadFile(e, index)}
                                />
                                <div className="img_upload_title_extention">
                                  <PaperClip width={15} height={15} />
                                  <label htmlFor="panCard" style={{ cursor: "pointer" }}>
                                    Add Attachment
                                  </label>
                                  <div className="info_icon_container">
                                    <InfoIcon
                                      width={15}
                                      className="infoIcon"
                                      onMouseOver={handleIconHover}
                                      onMouseLeave={handleIconLeave}
                                    />

                                    {showTooltip && (
                                      <div
                                        className="dialog-box"
                                        style={{
                                          left: `${tooltipPosition.x}px`,
                                          top: `${tooltipPosition.y}px`,
                                        }}>
                                        <p>
                                          Allowed formats are .png.jpg, .jpeg, .doc, .docx, .pdf. The file size should
                                          not exceed 20MB
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="link_wrapper">
                                  <a
                                    href={formValues[index]?.url}
                                    target="location"
                                    className="img_upload_title_extention">
                                    {formValues[index]?.cardFileName || "No File Provided"}
                                  </a>
                                  <Icon
                                    className="trash__icon"
                                    icon="formkit:trash"
                                    name="Pancard"
                                    width={13}
                                    style={{
                                      cursor: "pointer",
                                      display: [formValues[index]?.cardFileName ? "" : "none"],
                                    }}
                                    onClick={(e) => deleteDetailsHandler(e, formValues[index]?._id)}
                                  />
                                </div>
                                <div
                                  className="uploaded_image_container"
                                  style={{
                                    display: [formValues?.[index].card ? "" : "none"],
                                  }}>
                                  <p>{formValues?.[index].card ? formValues?.[index].card?.name : ""}</p>
                                  <Icon
                                    className="trash__icon"
                                    icon="formkit:trash"
                                    name="panCard"
                                    onClick={(e) => deleteImage(e, index)}
                                  />
                                </div>
                                <p className="error-input">{errors?.Pancard || ""}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {/* <>
                    <div className="PersonalDetail__title">
                      <h4>PAN Card Details</h4>
                      <p>Edit user PAN Card details here</p>
                    </div>
                    <div className="form-group">
                      <Input
                        label="PAN Card No"
                        type={"text"}
                        name="panCardNo"
                        placeholder="Enter PAN Card Number"
                        onFocus={focusHandler}
                        error={errors?.panCardNo}
                        onBlur={blurHandler}
                        onChange={(event) => changeHandler(event, 1)} // Pass the index 0 for AadharCard
                        value={formValues?.[1].cardNo}
                        mandatory
                      />
                      <div className="card_upload__doc">
                        <input
                          type="file"
                          name="panCard"
                          id="panCard"
                          style={{ display: "none" }}
                          onChange={(e) => loadFile(e, 1)}
                        />
                        <div className="img_upload_title_extention">
                          <PaperClip width={15} height={15} />
                          <label
                            htmlFor="panCard"
                            style={{ cursor: "pointer" }}
                          >
                            Add Attachment
                          </label>
                          <div className="info_icon_container">
                            <InfoIcon
                              width={15}
                              className="infoIcon"
                              onMouseOver={handleIconHover}
                              onMouseLeave={handleIconLeave}
                            />

                            {showTooltip && (
                              <div
                                className="dialog-box"
                                style={{
                                  left: `${tooltipPosition.x}px`,
                                  top: `${tooltipPosition.y}px`,
                                }}
                              >
                                <p>
                                  Allowed formats are .png.jpg, .jpeg, .doc,
                                  .docx, .pdf. The file size should not exceed
                                  20MB
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className="uploaded_image_container"
                          style={{
                            display: [formValues?.[1].card ? "" : "none"],
                          }}
                        >
                          <p>
                            {formValues?.[1].card
                              ? formValues?.[1].card?.name
                              : ""}
                          </p>
                          <Icon
                            className="trash__icon"
                            icon="formkit:trash"
                            name="panCard"
                            onClick={(e) => deleteImage(e, 1)}
                          />
                        </div>
                        <p className="error-input">{errors?.panCard || ""}</p>
                      </div>
                    </div>
                  </> */}
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
          onClick={abortProfileCreation}
          disabled={loading ? true : false}>
          Cancel
        </Button>
        <Button
          className={`light-blue-btn submit-btn`}
          variant="contained"
          onClick={handleSubmit}
          disabled={loading ? true : false}>
          {loading ? <RiseLoader size="5px" color="white" /> : "Save"}
        </Button>
      </div>
    </>
  );
};

export default PersonalDetail;
