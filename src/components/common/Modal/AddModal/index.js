// import * as React from "react";
import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PageTitle from "../../PageTitle";
import "./style.css";
import SelectInput from "../../SelectInput";
import { Input } from "@mui/material";
import Dropzone from "react-dropzone";
import { ReactComponent as UploadIcon } from "../../../../assets/icons/upload-cloud-file.svg";
import { ReactComponent as DownloadIcon } from "../../../../assets/images/common/download-icon.svg";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete_Icon.svg";
// import { ReactComponent as DeleteIcon1 } from "../../../../assets/icons/deleteIcon.svg";
// import { ReactComponent as DeleteIcon2 } from "../../../../assets/icons/delete_Icon.svg";
// import { ReactComponent as DeleteIcon3 } from "../../../../assets/icons/deleteIconTrashBin.svg";

import AutoCompleteAsyncInput from "../../../../components/common/AutoCompleteAsyncInput";

import MyOutlinedBtn from "../../newCommon/Buttons/MyOutlinedBtn";
import MyFilledBtn from "../../newCommon/Buttons/MyFilledBtn";
import { RingLoader } from "react-spinners";
import {
  DUMMYOPTIONS,
  SECTIONS,
} from "../../../../config/constants/projectConstant";
import validateField from "../../../../utils/validateField";
import { useDispatch, useSelector } from "react-redux";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { getAllJobRoles } from "../../../../api/superAdminApi/jobRoleManagement";
import { ALPHABETIC_SORT, errorToast } from "../../../../utils/projectHelper";
import {
  getAllJobRoleforBatchApi,
  getSampleExcelNOSPracticalApi,
  getSampleExcelNOSTheoryApi,
  postBulkUploadNOSPracticalApi,
  postBulkUploadNOSTheoryApi,
} from "../../../../api/superAdminApi/questionBank";
import {
  getAssignedClientManagementListsApi,
  getAssignedClientsListsApi,
} from "../../../../api/superAdminApi/clientManagement";
import { qbManagementSelector } from "../../../../redux/slicers/superAdmin/questionBankSlice";
import { useNavigate } from "react-router-dom";
// import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 570,
  bgcolor: "background.paper",
  border: "2px solid white",
  borderRadius: "10px",
  boxShadow: 24,
  padding: 2,
};

export default function AddNew({ open, setOpen }) {
  const initialValues = () => {
    return {
      client: "",
      jobRole: "",
      section: "",
      uploaded_file: [],
    };
  };
  const handleClose = () => setOpen(false);
  const { jobRolesListAll = [], clientManagementLists = [] } = useSelector(
    clientManagementSelector
  );
  const [jobRoles, setJobRoles] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [jobRoleList, setJobRoleList] = useState([]);
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formValues, setFormValues] = useState(initialValues());
  console.log("formValues", formValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);
  const [errors, setErrors] = useState();
  const [listLoading, setListLoading] = useState(false);
  const { assignedClientsList = [] } = useSelector(clientManagementSelector);
  const { jobRoleListForFilter = [] } = useSelector(qbManagementSelector);
  const navigate = useNavigate();
  const downloadSampleFile = () => {
    if (formValues?.section === "theory") {
      dispatch(getSampleExcelNOSTheoryApi());
    } else if (formValues?.section === "viva-practical") {
      dispatch(getSampleExcelNOSPracticalApi());
    } else {
      errorToast("Please select Section first");
    }
  };
  const getClientDetails = () => {
    setLoading(true);
    dispatch(getAssignedClientsListsApi(setLoading));
  };

  useEffect(() => {
    getClientDetails();
  }, []);

  const getList = () => {
    setListLoading(true);
    dispatch(getAllJobRoles(setLoading));
  };

  const getQbFilterList = () => {
    if (formValues?.client?.id) {
      // dispatch(getAssignedClientManagementListsApi(setLoading, Infinity, Infinity));
      // dispatch(getAllJobRoles(setLoading));
      dispatch(
        getAllJobRoleforBatchApi(
          setLoading,
          formValues?.client?.id,
          setFormValues
        )
      );
    }

    // if (formValues?.clientId) {
    //   dispatch(getAllJobRoleforBatchApi(setLoading, formValues?.clientId, setFormValues));
    // } else {
    //   dispatch(getAllJobRoleforBatchApi(setLoading));
    // }
  };

  const handleJobRoleClick = () => {
    console.log("Clicked....");
  };

  useEffect(() => {
    getQbFilterList();
  }, [formValues?.client?.id]);

  useEffect(() => {
    if (jobRoleListForFilter.length > 0) {
      const custom_options = jobRoleListForFilter.map((el) => {
        const option = {
          label: el?.jobRole,
          value: el?.jobRole,
          id: el?._id,
        };
        return option;
      });
      setJobRoleList(ALPHABETIC_SORT(custom_options));
      setListLoading(false);
    }
  }, [jobRoleListForFilter.length]);

  // useEffect(() => {
  //   getList();
  //   if (jobRolesListAll.length > 0) {
  //     const custom_options = jobRolesListAll.map((el) => {
  //       const option = {
  //         label: el?.clientId?.clientname,
  //         value: el?.clientId?.clientname,
  //       };
  //       return option;
  //     });
  //     setJobRoles(ALPHABETIC_SORT(custom_options));
  //     setListLoading(false);
  //   }
  // }, [jobRolesListAll.length]);

  useEffect(() => {
    if (assignedClientsList.length > 0) {
      const custom_options = assignedClientsList.map((el) => {
        const option = {
          label: el?.clientname,
          value: el?.clientname,
          id: el?._id,
        };
        return option;
      });
      setClientList(ALPHABETIC_SORT(custom_options));
      setListLoading(false);
    }
  }, [assignedClientsList]);

  const upload = (event) => {
    // console.log("FilesFiles", event);
    // const file = event?.target?.files[0];
    console.log("FilesFiles", event);
    // setFormValues({ ...formValues, uploaded_file: file });

    // setFormValues({ ...formValues, uploaded_file: files[0] });
    //   const currentFile = selectedFiles[0];
    // setSelectedFiles(files[0]);
  };

  const handleLoadFile = (event) => {
    const file = event.target.files[0];
    setFormValues({ ...formValues, uploaded_file: file });
  };

  const onDrop = (files) => {
    console.log("FILES_FILES_FILES", files);
    if (files.length > 0) {
      setSelectedFiles([...files]);
      setFormValues({ ...formValues, uploaded_file: [...files] });
    }
  };
  const clearFormValues = () => {
    setFormValues(initialValues);
  };

  const handleCancel = () => {
    setErrors();
    setOpen(false);
    clearFormValues();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = formValues?.uploaded_file;
    const formErrors = {};
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      console.log("FormValuesUnderEvaluation", name, "----", value)
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });
    setErrors(formErrors);

    if(Object.keys(formErrors).length ===0){
      alert("Working on this..")
    }

    // if (Object.keys(formErrors).length === 0) {
    //   // setLoading(true);
    //   // dispatch(createQbFormApi(formValues, setLoading, clearFormValues));
    //   const data = new FormData();
    //   data.append("uploaded_file", file);
    //   data.append("jobRole", formValues?.jobRole);
    //   data.append("section", formValues?.section);
    //   // setFormValues({ ...formValues, uploaded_file: data });
    //   setLoading(true);
    //   if (formValues?.section === "Theory") {
    //     dispatch(
    //       postBulkUploadNOSTheoryApi(
    //         data,
    //         setLoading,
    //         clearFormValues,
    //         navigate
    //       )
    //     );
    //   } else
    //     dispatch(
    //       postBulkUploadNOSPracticalApi(
    //         data,
    //         setLoading,
    //         clearFormValues,
    //         navigate
    //       )
    //     );
    // }
  };

  const handleDeleteUploadedFile=(index)=>{
    const arr=[...selectedFiles];
    arr.splice(index,1);
    setSelectedFiles([...arr])
  }

  const changeHandler = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors();
    }
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const buttonData = {
    name: "upload",
    text: "Upload",
    onClick: handleSubmit,
    path: "",
    loading: loading,
    disabled: loading ? true : false,
    isPermissions: {},
    style: {
      fontSize: "small",
      paddingTop: "15px",
      paddingBottom: "15px",
      paddingRight: "28px",
      paddingLeft: "28px",
      marginLeft: "10px",
    },
  };
  
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="add-new-nos-container">
              <div className="grid-cols-1" id="clientInformation">
                <div className="add-new-nos-title">
                  <PageTitle title={"Assessment Blueprint Upload"} />
                  <p className="add-new-nos-title-p">
                    Download Sample file before uploading
                  </p>
                </div>
                <div className="add-new-nos-inputfield">
                  {/* <SelectInput
                      name="client"
                      label="Client"
                      placeHolder="Select"
                      //   value={formValues?.status}
                      //   handleChange={changeHandler}
                      //   options={LEAD_ACTIVE_STATUS_LEAD_MANAGEMENT}
                      //   error={errors?.status}
                      mandatory
                    /> */}
                  <AutoCompleteAsyncInput
                    name="client"
                    label="Client"
                    placeHolder="select"
                    value={formValues?.client}
                    onchange={changeHandler}
                    setter={setFormValues}
                    optionLists={clientList}
                    error={errors?.client}
                    mandatory
                  />
                </div>
                <div className="add-new-nos-inputfield">
                  {/* <SelectInput
                    name="jobRole"
                    label="JobRole"
                    placeHolder="Select"
                    //   value={formValues?.status}
                    //   handleChange={changeHandler}
                    //   options={LEAD_ACTIVE_STATUS_LEAD_MANAGEMENT}
                    //   error={errors?.status}
                    mandatory
                  /> */}

                  {/* <Input
                    label="Jobrole"
                    type="text"
                    name="jobRole"
                    size="large"
                    placeholder="Enter JobRole"
                    //   onFocus={focusHandler}
                    //   error={errors?.organisationName}
                    //   onBlur={blurHandler}
                    //   onPaste={handleInputTrimPaste}
                    //   onChange={changeHandler}
                    //   value={formValues?.organisationName}
                    mandatory
                    sx={{
                      //   backgroundColor: "#e0db6e",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      width: "100%",
                      border: "1px solid #9b9c9e",
                      marginTop: "10px",
                      marginBottom: "15px",
                      paddingLeft: "10px",
                      borderRadius: "5px",
                    }}
                  /> */}
                  <AutoCompleteAsyncInput
                    name="jobRole"
                    label="Job Role"
                    value={formValues?.jobRole}
                    onchange={changeHandler}
                    // onClick={handleJobRoleClick}
                    // onHighlightChange={handleJobRoleClick}
                    onOpen={handleJobRoleClick}
                    setter={setFormValues}
                    optionLists={jobRoleList}
                    error={errors?.jobRole}
                    mandatory
                  />
                  {/* <SelectInput
                    name="jobRole"
                    label="Job Role"
                    placeHolder="Select Job Role"
                    options={jobRoles}
                    value={formValues?.jobRole}
                    handleChange={changeHandler}
                    error={errors?.jobRole}
                    mandatory
                  /> */}
                </div>
                <div className="add-new-nos-inputfield">
                  {/* <Input
                    label="Section"
                    type="text"
                    name="section"
                    placeholder="Enter section"
                    //   onFocus={focusHandler}
                    //   error={errors?.organisationName}
                    //   onBlur={blurHandler}
                    //   onPaste={handleInputTrimPaste}
                    //   onChange={changeHandler}
                    //   value={formValues?.organisationName}
                    mandatory
                    sx={{
                      // backgroundColor: "#e0db6e",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      width: "100%",
                      border: "1px solid #9b9c9e",
                      marginTop: "10px",
                      // marginBottom: "10px",
                      paddingLeft: "15px",
                      borderRadius: "5px",
                    }}
                  /> */}
                  <SelectInput
                    name="section"
                    label="Section"
                    placeHolder="Select section"
                    value={formValues?.section}
                    handleChange={changeHandler}
                    options={SECTIONS}
                    error={errors?.section}
                    mandatory
                  />
                  <div
                    className="download_btn"
                    style={{
                      display: [formValues?.section ? "" : "none"],
                    }}
                  >
                    <a
                      onClick={downloadSampleFile}
                      className="download-file"
                      style={{ color: "blue", fontSize: "small" }}
                    >
                      Download Sample File
                    </a>
                  </div>
                </div>
                {selectedFiles.length > 0 ? (
                  <div className="add-new-nos-uploadfield">
                  <div className="nos-upload-file" style={{ padding: "40px" }}>
                    {selectedFiles.map((item,index) => {
                      return (
                        // <li key="12">
                        <div className="upload-nos-uploaded-nos" key={index}>
                          <p>{item.name}</p>
                          <DeleteIcon onClick={()=>handleDeleteUploadedFile(index)}/>
                        </div>
                        // </li>    
                      );
                    })}
                  </div>
                  </div>
                ) : (
                  <div className="add-new-nos-uploadfield">
                    <Dropzone onDrop={onDrop} multiple={true}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />

                            <>
                              <div
                                className="nos-upload-file"
                                style={{ padding: "40px" }}
                              >
                                <div>
                                  <UploadIcon />
                                </div>
                                <div className="nos-upload-btns">
                                  <span
                                    // className="btn btn-success upload-btn"
                                    style={{
                                      marginRight: "5px",
                                      cursor: "pointer",
                                      fontWeight: "bolder",
                                    }}
                                    disabled={!selectedFiles}
                                    onClick={handleLoadFile}
                                  >
                                    Click to upload
                                  </span>

                                  <span>or drag and drop</span>
                                </div>
                                <pre style={{ fontSize: "small" }}>
                                  {" "}
                                  SVG,PNG or JPG (max. 800x400)
                                </pre>
                              </div>
                            </>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                    <div className="alert alert-light" role="alert">
                      {message}
                    </div>
                    {fileInfos.length > 0 && (
                      <div className="card">
                        <div className="card-header">List of Files</div>
                        <ul className="list-group list-group-flush">
                          {fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                              <a href={file.url}>{file.name}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="add-new-nos-button">
                  <MyOutlinedBtn
                    // style={{padding:"15px", }}
                    style={{
                      fontSize: "small",
                      border: "1px solid",
                      paddingTop: "15px",
                      paddingBottom: "15px",
                      paddingRight: "28px",
                      paddingLeft: "28px",
                      marginRight: "18px",
                    }}
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading ? true : false}
                    text="Cancel"
                  />
                  <MyFilledBtn
                    variant="contained"
                    btnItemData={buttonData}
                    disabled={loading ? true : false}

                    // text={
                    //   loading ? (
                    //     <RingLoader size="25px" color="white" />
                    //   ) : (
                    //     "Update"
                    //   )
                    // }
                  />
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
