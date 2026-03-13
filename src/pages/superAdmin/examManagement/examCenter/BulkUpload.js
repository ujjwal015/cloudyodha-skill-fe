import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style-upload.css";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useDispatch } from "react-redux";
import { PulseLoader } from "react-spinners";
import {
  postBulkUploadAdminApi,
} from "./../../../../api/superAdminApi/clientManagement";
import { ReactComponent as ArrowLeft } from "./../../../../assets/icons/chevron-left.svg";
import { ReactComponent as UploadIcon } from "../../../../assets/images/common/upload.svg";
import { ReactComponent as DownloadIcon } from "../../../../assets/images/common/download-icon.svg";
import { SUPER_ADMIN_CLIENT_MANAGEMENT_PAGE, SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE, SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import { getExamCentreSampleExcelAdminApi, postExamCentreBulkUploadAdminApi } from "../../../../api/superAdminApi/examManagement";

const ExamCentreUploadBulkAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState("");

  const handleUploadFile = (event) => {
    const file = event.target.files[0];
    setFormValues(file);

    const data = new FormData();
    data.append("uploaded_file", file);

    setLoading(true);
    dispatch(postExamCentreBulkUploadAdminApi(data, setLoading, setFormValues, navigate));
  };

  const downloadSampleFile = () => {
    dispatch(getExamCentreSampleExcelAdminApi());
  };

  // const handleSubmit = () => {};

  return (
    <>
      <div className="main-container upload-bulk">
        <div className="title">
          <div className="title-text">
            <ArrowLeft
              onClick={() => navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE)}
            />
            <h1>Upload Bulk Exam Centre</h1>
          </div>
        </div>

        <div className="sub-admin-wrapper">
          <div className="tab-content">
            <div className="form-wrapper">
              <div className="form">
                <form>
                  <div style={{ marginBottom: "49px" }}>
                    <h2 className="step-no">STEP 01</h2>
                    <div className="inputFeilds">
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
                  </div>
                  <div>
                    <h2 className="step-no">STEP 02</h2>
                    <div className="inputFeilds">
                      <div className="file-input">
                        <div style={{ marginBottom: "15px" }}>
                          <label className="upload-excel">
                            Upload Excel{" "}
                            <span className="mandatory">&nbsp;*</span>
                          </label>
                        </div>
                        <input
                          type="file"
                          name="uploaded_file"
                          id="file-input"
                          className="file-input__input"
                          value={""}
                          onChange={handleUploadFile}
                        />
                        <p className="fileName">{formValues?.name}</p>
                        <label
                          className="file-input__label"
                          htmlFor="file-input"
                        >
                          {loading ? (
                            <PulseLoader size="10px" color="white" />
                          ) : (
                            <>
                              <UploadIcon />
                              <span>Upload file</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    <p className="note">
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
      </div>
    </>
  );
};

export default ExamCentreUploadBulkAdmin;
