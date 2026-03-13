import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import validateField from "../../../../utils/validateField";

import {
  downloadSecondaryLangSampleApi,
  downloadSecondaryLangSampleVivaPracticalApi,
  getLengthOfQuestionsApi,
  getSampleQuestionsDownloadApi,
  postBulkUploadQuestionsApi,
  uploadSecondaryLangQuestionsApi,
  uploadVPSecondaryLangQuestionsApi,
} from "./../../../../api/superAdminApi/questionBank";
import { ReactComponent as ArrowLeft } from "./../../../../assets/icons/chevron-left.svg";
import { ReactComponent as UploadIcon } from "../../../../assets/images/common/upload.svg";
import { ReactComponent as DownloadIcon } from "../../../../assets/images/common/download-icon.svg";
import { RiseLoader } from "react-spinners";
import { qbManagementSelector } from "../../../../redux/slicers/superAdmin/questionBankSlice";

const initialFormValues = {
  uploaded_file_primary: "",
  uploaded_file_secondary: "",
  question_bank_id: "",
};

const UploadQuestions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const params = useParams();
  const { id } = params;
  const { questionsLength } = useSelector(qbManagementSelector);

  const getLengthOfQuestion = () => {
    dispatch(getLengthOfQuestionsApi(id, setLoading, params.section));
  };

  useEffect(() => {
    getLengthOfQuestion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formValues?.uploaded_file_primary instanceof File) {
      setLoading(true);
      const data = new FormData();
      data.append("uploaded_file", formValues?.uploaded_file_primary);
      data.append("question_bank_id", params?.id);
      dispatch(
        postBulkUploadQuestionsApi(
          data,
          setLoading,
          navigate,
          params.section || "Theory",
          params?.id
        )
      );
    }

    if (formValues?.uploaded_file_secondary instanceof File) {
      setLoading(true);
      const data2 = new FormData();
      data2.append("uploaded_file", formValues?.uploaded_file_secondary);
      data2.append("question_bank_id", params?.id);
      if (params?.section)
        dispatch(
          uploadVPSecondaryLangQuestionsApi(
            data2,
            params?.section,
            setLoading,
            navigate,
            params?.id
          )
        );
      else
        dispatch(
          uploadSecondaryLangQuestionsApi(
            data2,
            setLoading,
            navigate,
            params?.id
          )
        );
    }

    // setLoading(true);
    // Create a new FormData object
    // const data = new FormData();
    // data.append("uploaded_file", formValues?.uploaded_file);
    // data.append("question_bank_id", params?.id);

    // dispatch(postBulkUploadQuestionsApi(data, setLoading, navigate));
  };

  const handleUploadFile = (event) => {
    const file = event.target.files[0];
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormValues((pre) => ({ ...pre, [name]: file }));

    const fieldError = validateField(name, fieldValue);

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
  };

  const downloadSampleFile = (e, lang) => {
    if (lang === "primary") {
      if (params?.section)
        dispatch(getSampleQuestionsDownloadApi(params.section));
      else dispatch(getSampleQuestionsDownloadApi());
    } else {
      if (params?.section) {
        dispatch(
          downloadSecondaryLangSampleVivaPracticalApi(
            params.id,
            params.section,
            setLoading
          )
        );
      } else dispatch(downloadSecondaryLangSampleApi(params.id, setLoading));
    }
  };

  return (
    <>
      <div className="main-container upload-bulk-ques">
        <div className="title">
          <div className="title-text">
            <ArrowLeft onClick={() => navigate(-1)} />
            <h1>Upload Questions</h1>
          </div>
        </div>

        <div className="sub-admin-wrapper" style={{ marginBottom: "20px" }}>
          <div
            className="tab-content"
            style={{ backgroundColor: "white", borderRadius: "10px" }}
          >
            <div className="form-wrapper">
              <div className="form">
                <form>
                  <div>
                    <h1 className="card_title">Primary Language [English]</h1>
                    <h2 className="step-no">STEP 01</h2>
                    <div style={{ marginBottom: "10px" }}>
                      <a
                        onClick={(e) => downloadSampleFile(e, "primary")}
                        className="download-file"
                      >
                        <span>
                          <DownloadIcon width={20} />
                        </span>{" "}
                        Download Sample File
                      </a>
                    </div>
                  </div>
                  <div>
                    <h2 className="step-no">STEP 02</h2>
                    <div className="inputFeilds">
                      <div className="file-input">
                        <div style={{ marginBottom: "15px" }}>
                          <label className="upload-excel">
                            Upload Excel{" "}
                            {/* <span className="mandatory">&nbsp;*</span> */}
                          </label>
                        </div>
                        <input
                          type="file"
                          name="uploaded_file_primary"
                          id="file-input"
                          className="file-input__input"
                          onChange={handleUploadFile}
                        />
                        <label
                          className="file-input__label"
                          htmlFor="file-input"
                        >
                          <UploadIcon />
                          <span>Upload file</span>
                        </label>
                        <div className="fie_name">
                          {" "}
                          {formValues?.uploaded_file_primary?.name || ""}
                        </div>
                        {errors.uploaded_file && (
                          <p className="error-input">{errors.uploaded_file}</p>
                        )}
                      </div>
                    </div>
                    <p className="note">
                      {" "}
                      <b style={{ fontWeight: "bold" }}>Note : </b>Don't remove
                      the header row while uploading the data, as shown in
                      sample download file. Do not delete any column, if there
                      is no corresponding data leave it empty. Upload the data
                      in same sequence as in sample download file. Image
                      Question cannot be uploaded from excel.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* ======Secondary Language============= */}

        {questionsLength > 0 && (
          <div className="sub-admin-wrapper" style={{ marginBottom: "20px" }}>
            <div
              className="tab-content"
              style={{ backgroundColor: "white", borderRadius: "10px" }}
            >
              <div className="form-wrapper">
                <div className="form">
                  <form>
                    <div>
                      <h1 className="card_title">Secondary Language</h1>
                      <h2 className="step-no">STEP 01</h2>
                      <div style={{ marginBottom: "10px" }}>
                        <a
                          onClick={downloadSampleFile}
                          className="download-file"
                        >
                          <span>
                            <DownloadIcon width={20} />
                          </span>{" "}
                          Download Sample File
                        </a>
                      </div>
                    </div>
                    <div>
                      <h2 className="step-no">STEP 02</h2>
                      <div className="inputFeilds">
                        <div className="file-input">
                          <div style={{ marginBottom: "15px" }}>
                            <label className="upload-excel">
                              Upload Excel{" "}
                              {/* <span className="mandatory">&nbsp;*</span> */}
                            </label>
                          </div>
                          <input
                            type="file"
                            name="uploaded_file_secondary"
                            id="file-input_secondary"
                            className="file-input__input"
                            onChange={handleUploadFile}
                          />
                          <label
                            className="file-input__label"
                            htmlFor="file-input_secondary"
                          >
                            <UploadIcon />
                            <span>Upload file</span>
                          </label>
                          <div className="fie_name">
                            {" "}
                            {formValues?.uploaded_file_secondary.name || ""}
                          </div>
                          {errors.uploaded_file && (
                            <p className="error-input">
                              {errors.uploaded_file}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="note">
                        {" "}
                        <b style={{ fontWeight: "bold" }}>Note : </b>Don't
                        remove the header row while uploading the data, as shown
                        in sample download file. Do not delete any column, if
                        there is no corresponding data leave it empty. Upload
                        the data in same sequence as in sample download file.
                        Image Question cannot be uploaded from excel.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="Submit-btn">
          <button onClick={handleSubmit}>
            {loading ? <RiseLoader size="10px" color="white" /> : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadQuestions;
