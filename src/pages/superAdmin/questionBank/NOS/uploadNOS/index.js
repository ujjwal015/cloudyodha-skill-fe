import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useDispatch, useSelector } from "react-redux";
import { FadeLoader, PulseLoader } from "react-spinners";
import {
  getSampleExcelAdminApi,
  postBulkUploadAdminApi,
} from "../../../../../api/superAdminApi/clientManagement";
import { ReactComponent as ArrowLeft } from "../../../../../assets/icons/chevron-left.svg";
import { ReactComponent as UploadIcon } from "../../../../../assets/images/common/upload.svg";
import { ReactComponent as DownloadIcon } from "../../../../../assets/images/common/download-icon.svg";
import {
  QUESTION_BANK_NOS,
  SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import {
  getSampleExcelNOSPracticalApi,
  getSampleExcelNOSTheoryApi,
  postBulkUploadNOSPracticalApi,
  postBulkUploadNOSTheoryApi,
} from "../../../../../api/superAdminApi/questionBank";
import { Button } from "@mui/material";
import SelectInput from "../../../../../components/common/SelectInput";
import { getAllJobRoles } from "../../../../../api/superAdminApi/jobRoleManagement";
import { useEffect } from "react";
import { clientManagementSelector } from "../../../../../redux/slicers/superAdmin/clientManagement";
import {
  DUMMYOPTIONS,
  SECTIONS2,
  SECTIONS_NOS_CREATION,
} from "../../../../../config/constants/projectConstant";
import validateField from "../../../../../utils/validateField";
import { ALPHABETIC_SORT } from "../../../../../utils/projectHelper";

import AutoCompleteAsyncInput from "../../../../../components/common/AutoCompleteAsyncInput";

const initialFormValues = {
  jobRole: "",
  section: "",
  uploaded_file: "",
};

const UploadBulkNOS = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const { jobRolesListAll = [] } = useSelector(clientManagementSelector);
  const [jobRoles, setJobRoles] = useState(DUMMYOPTIONS);
  const [errors, setErrors] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const [listLoading, setListLoading] = useState(false);

  const getList = () => {
    setListLoading(true);
    dispatch(getAllJobRoles(setLoading));
  };

  useEffect(() => {
    getList();
    if (jobRolesListAll.length > 0) {
      const custom_options = jobRolesListAll.map((el) => {
        const option = {
          label: el?.jobRole,
          value: el?.jobRole,
        };
        return option;
      });
      setJobRoles(ALPHABETIC_SORT(custom_options));
      setListLoading(false);
    }
  }, [jobRolesListAll.length]);

  const handleLoadFile = (event) => {
    const file = event.target.files[0];
    setFormValues({ ...formValues, uploaded_file: file });
  };

  const downloadSampleFile = () => {
    if (formValues?.section === "Theory") {
      dispatch(getSampleExcelNOSTheoryApi());
    } else dispatch(getSampleExcelNOSPracticalApi());
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = formValues?.uploaded_file;

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
      // setLoading(true);
      // dispatch(createQbFormApi(formValues, setLoading, clearFormValues));
      const data = new FormData();
      data.append("uploaded_file", file);
      data.append("jobRole", formValues?.jobRole);
      data.append("section", formValues?.section);
      // setFormValues({ ...formValues, uploaded_file: data });
      setLoading(true);
      if (formValues?.section === "Theory") {
        dispatch(
          postBulkUploadNOSTheoryApi(
            data,
            setLoading,
            clearFormValues,
            navigate
          )
        );
      } else
        dispatch(
          postBulkUploadNOSPracticalApi(
            data,
            setLoading,
            clearFormValues,
            navigate
          )
        );
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <>
      <div className="main-container upload-bulk">
        {listLoading ? (
          <>
            <div className="loader_container">
              <FadeLoader color="#2ea8db" />
            </div>
          </>
        ) : (
          <>
            <div className="title">
              <div className="title-text">
                <ArrowLeft onClick={() => navigate(QUESTION_BANK_NOS)} />
                <h1>Upload NOS</h1>
              </div>
              {/* <div className="view-list-btn">
                <button
                  className="view-list-btn-text"
                  onClick={() => navigate(QUESTION_BANK_NOS)}
                >
                  <ListOutlinedIcon
                    sx={{ fontSize: "20px", color: "#FFFFFF", mr: 1 }}
                  />
                  View List
                </button>
              </div> */}
            </div>

            <div className="sub-admin-wrapper">
              <div className="tab-content">
                <div className="form-wrapper">
                  <div className="form">
                    <form>
                      <div className="main_card">
                        <div className="inputFeilds">
                          <div
                            className="file-input"
                            // style={{ border: "1px solid red" }}
                          >
                            <div className="heading_input">
                              <label className="upload-excel">Step 01</label>
                              {/* <div
                                className="download_btn"
                                style={{
                                  display: [formValues?.section ? "" : "none"],
                                }}
                              >
                                <a
                                  onClick={downloadSampleFile}
                                  className="download-file"
                                >
                                  <span>
                                    <DownloadIcon width={15} />
                                  </span>{" "}
                                  Download Sample File
                                </a>
                              </div> */}
                            </div>
                            <div className="options_container">
                              <div className="select_half">
                                <AutoCompleteAsyncInput
                                  name="jobRole"
                                  label="Job Role"
                                  value={formValues?.jobRole}
                                  onchange={changeHandler}
                                  setter={setFormValues}
                                  optionLists={jobRoles}
                                  error={errors?.jobRole}
                                  mandatory
                                />
                              </div>
                              <div className="select_half">
                                <SelectInput
                                  name="section"
                                  label="Section"
                                  placeHolder="Select Section"
                                  options={SECTIONS_NOS_CREATION}
                                  value={formValues?.section}
                                  handleChange={changeHandler}
                                  error={errors?.section}
                                  mandatory
                                />
                                <div className="download_note">
                                  <p
                                    style={{
                                      display: [
                                        formValues?.section ? "none" : "",
                                      ],
                                      fontSize: "14px",
                                      paddingTop: 5,
                                    }}
                                  >
                                    Note:{" "}
                                    <span
                                      style={{
                                        color: "#000000",
                                        textDecoration: "none",
                                        fontSize: "12px",
                                      }}
                                    >
                                      After selecting the section, Link will
                                      appear to download Sample File
                                    </span>
                                  </p>
                                </div>
                                <div
                                  className="download_btn"
                                  style={{
                                    display: [
                                      formValues?.section ? "" : "none",
                                    ],
                                  }}
                                >
                                  <a
                                    onClick={downloadSampleFile}
                                    className="download-file"
                                  >
                                    <span>
                                      <DownloadIcon width={15} />
                                    </span>{" "}
                                    Download Sample File
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="file-input"
                            // style={{ border: "1px solid red" }}
                          >
                            <div className="heading_input">
                              <div className="heading_text_container">
                                <label className="upload-excel">Step 02</label>
                                <label className="upload-excel">
                                  Upload Excel
                                  <span className="mandatory">&nbsp;*</span>
                                </label>
                              </div>
                            </div>
                            <div className="input_container">
                              <input
                                type="file"
                                name="uploaded_file"
                                id="file-input"
                                className="file-input__input"
                                value={""}
                                onChange={handleLoadFile}
                              />
                              <label
                                className="file-input__label"
                                htmlFor="file-input"
                              >
                                <UploadIcon />
                                <span>Upload file</span>
                              </label>
                              <div className="file_title">
                                {formValues?.uploaded_file
                                  ? formValues?.uploaded_file?.name
                                  : "No File Provided"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="note">
                          <b style={{ fontWeight: "bold" }}>Note : </b>Don't
                          remove the header row while uploading the data, as
                          shown in sample download file. Do not delete any
                          column, if there is no corresponding data leave it
                          empty. Upload the data in same sequence as in sample
                          download file. Image Question cannot be uploaded from
                          excel.
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="submit_container">
              <Button
                className={`light-blue-btn submit-btn`}
                variant="outlined"
                onClick={handleSubmit}
                sx={{
                  width: "110px",
                  height: "38px",
                  textTransform: "unset",
                  backgroundColor: "#00b2ff !important",
                }}
                disabled={loading ? true : false}
              >
                {loading ? <PulseLoader size="10px" color="white" /> : "Submit"}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UploadBulkNOS;
