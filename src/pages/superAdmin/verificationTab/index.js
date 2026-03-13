import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../superAdmin/jobRole/style.css";
import "./style.css";
import { TableHeader } from "../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../components/common/customPagination";
import { ClipLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { Snackbar, Tooltip } from "@mui/material";
import {
  exportData,
  getLocal,
  getSubRole,
  handleCopyInput,
  handleTrimPaste,
  removeLocal,
  storeLocal,
  userRoleType,
} from "../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { authSelector } from "../../../redux/slicers/authSlice";
import {
  deleteVerificationListSpecificTimeStamp,
  downLoadSampleVerificationApi,
  exportVerificationDataApi,
  generateAuditFilesApi,
  getAssessorNameListApi,
  getVerificationFilesCount,
  getVerificationListApi,
} from "../../../api/superAdminApi/verificationTab";
import FilterModal from "../../../components/common/Modal/FilterModal";
import validateField from "../../../utils/validateField";
import { UPLOAD_DOCUMENTS_PAGE } from "../../../config/constants/routePathConstants/superAdmin";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import { bulkUploadVerificationTabApi } from "../../../api/superAdminApi/verificationTab";
import { verificationTabSelector } from "../../../redux/slicers/superAdmin/verificationTabSlice";
import DocsDownload from "./download";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import DownloadAndUploadVerification from "./uploadDownload";
import ReminderModel from "./reminderModel";
import { API_ROOT } from "../../../config/constants/apiConstants/auth";
import DeleteModal from "../../../components/common/Modal/DeleteModal";
import SearchInput from "../../../components/common/searchInput";
import GetAppIcon from "@mui/icons-material/GetApp";
import AddLinkIcon from "@mui/icons-material/AddLink";
const VerificationList = () => {
  const initialFormValues = {
    assessorName: "",
    from: "",
    to: "",
    clientId: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [verificationFilesCount, setVerificationFilesCount] = useState("View");
  const [loading, setLoading] = useState(false);
  const [masterExportBtnLoading, setMasterExportBtnLoading] = useState(false);
  const [normalExportBtnLoading, setNormalExportBtnLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadLoading, setDownLoadLoading] = useState(false);
  const { verificationTabList = [], assessorNameList = [] } = useSelector(
    verificationTabSelector
  );
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const { userInfo = {} } = useSelector(authSelector);
  // permission
  const { VERIFICATION_FEATURE, VERIFICATION_LIST_FEATURE } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = VERIFICATION_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = VERIFICATION_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const [isFilerApplied, setIsFilterApplied] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [filterParameters, setFilterParameters] = useState({});
  const [timeStampData, setTimeStampData] = useState();
  const localPageNumber = getLocal("verificationListPage");
  const filterVerificationTab = getLocal("FilterVerificationTab");
  const assessorManagementFromDashboard = getLocal(
    "assessorManagementFromDashboard"
  );

  useEffect(() => {
    if (filterVerificationTab) {
      setFormValues({
        assessorName: filterVerificationTab?.specificAssessorName,
        from: filterVerificationTab?.fromDate,
        to: filterVerificationTab?.toDate,
        clientId: filterVerificationTab?.clientId ?? "",
      });
      setFilterParameters(filterVerificationTab);
    }
  }, []);

  const handleCloseModal = () => {
    setDeleteModal(false);
    setTimeStampData("");
  };

  const validateFieldData = (name, value, formValues) => {
    let error = "";

    switch (name) {
      case "from":
        if (value && !formValues.to) {
          error = "Please select both 'From' and 'To' dates.";
        }
        break;

      case "to":
        if (value && !formValues.from) {
          error = "Please select both 'From' and 'To' dates.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const deleteHandler = (_id) => {
    setDeleteModal(true);
    setTimeStampData(_id);
    // setSelectedRowData({batchId:batchId,batchName:batchName,date:date,_id:_id});
  };

  // const getAssessorNameList = assessorNameList?.map((name) => ({
  //   label: name,
  //   value: name,
  // }));

  const filteredAssessorNameList = assessorNameList.filter(
    (data) => data.assesorId
  );
  const assessorListWithAssessorId = filteredAssessorNameList.map((data) => {
    return { _id: data.assesorId._id, fullName: data.assesorId.fullName };
  });
  const assessorListWithNoDuplicatefields = Array.from(
    new Set(assessorListWithAssessorId.map((a) => JSON.stringify(a)))
  ).map((s) => JSON.parse(s));

  const getAssessorNameList = assessorListWithNoDuplicatefields?.map(
    (name) => ({
      label: name.fullName,
      value: name.fullName,
    })
  );

  const confirmDelete = () => {
    if (timeStampData) {
      dispatch(
        deleteVerificationListSpecificTimeStamp(
          setLoading,
          timeStampData,
          setDeleteModal,
          setTimeStampData,
          getList
        )
      );
    }
  };

  const getList = useCallback(() => {
    setLoading(true);
    dispatch(
      getVerificationListApi(
        setLoading,
        localPageNumber,
        limit,
        setTotalPages,
        searchQuery,
        formValues.assessorName,
        formValues.from,
        formValues.to,
        setIsFilterApplied,
        formValues.clientId,
        assessorManagementFromDashboard
      )
    );
    dispatch(getAssessorNameListApi(setLoading));
  }, [dispatch, limit, searchQuery, formValues, localPageNumber]);

  useEffect(() => {
    if (searchQuery) {
      const handler = setTimeout(() => {
        getList();
      }, 2000);
      return () => clearTimeout(handler);
    } else {
      getList();
    }
  }, [searchQuery, getList, assessorManagementFromDashboard?.dashboardClient]);

  useEffect(() => {
    getUploadedFilesCount();
    setSortedData(verificationTabList);
    setTotalPagesUser(totalPages);
  }, [verificationTabList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...verificationTabList].sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc"
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          } else {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
          }
        });
        setSortedData(sortedData);
      }
    };

    sortData();
  }, [verificationTabList, sortOrders]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    storeLocal(nxtPage, "verificationListPage");
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
    storeLocal(1, "verificationListPage");
  };

  const exportClientData = () => {
    const exportData = verificationTabList?.map((item) => {
      return {
        date: item?.date || "NA",
        batchId: item?.batchId?.batchId || "NA",
        assessorName: item?.assesorId?.fullName || "NA",
        checkIn: item?.checkInTime || "NA",
        checkOut: item?.checkOutTime || "NA",
        groupPhoto: item?.groupPhotoTime || "NA",
        theoryExamPhoto: item?.theoryPhotoTime || "NA",
        theoryExamVideo: item?.theoryVideoTime || "NA",
        practicalPhoto: item?.practicalPhotoTime || "NA",
        practicalVideo: item?.practicalVideoTime || "NA",
        vivaPhoto: item?.vivaPhotoTime || "NA",
        vivaVideo: item?.vivaVideoTime || "NA",
        aadharPhoto: item?.aadharHolding || "NA",
        annexureN: item?.annexureN || "NA",
        annexureM: item?.annexureM || "NA",
        attendanceSheet: item?.attendanceSheet || "NA",
        tpUnderTaking: item?.tpUndertaking || "NA",
        summaryTest: item?.summarySheet || "NA",
        questionPaper: item?.questionPaper || "NA",
        toolsList: item?.toolListTime || "NA",
        toolsPhoto: item?.toolPhotoTime || "NA",
        tpFeedback: item?.tpFeedback || "NA",
        audit: item?.audit || "NA",
        remarks: item?.remarks || "NA",
        documentsCount:
          typeof verificationFilesCount !== "string"
            ? verificationFilesCount[item.batchId._id] ?? "NA"
            : "NA",
      };
    });
    return exportData;
  };
  const handleExport = () => {
    setNormalExportBtnLoading(true);
    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(
        exportData(exportClientData(), getColumns())
      );
      XLSX.utils.book_append_sheet(workbook, worksheet, "Verification List");

      const buffer = XLSX.write(workbook, { type: "array" });
      const blob = new Blob([buffer], { type: "application/octet-stream" });

      saveAs(blob, "Verification List.xlsx");
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setTimeout(() => {
        setNormalExportBtnLoading(false);
      }, 1000);
    }
  };

  const handleExportAll = () => {
    setMasterExportBtnLoading(true);
    dispatch(exportVerificationDataApi(setMasterExportBtnLoading, true));
  };

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

  const handleDateChange = (newDate, name) => {
    const formattedDate = newDate.format("MM-DD-YYYY");
    const fieldError = validateField(
      name,
      formattedDate,
      formValues?.startDate
    );
    setFormValues((pre) => ({ ...pre, [name]: formattedDate }));
    if (fieldError) {
      setErrors({ [name]: fieldError });
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

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const handleClose = () => {
    setIsFilterOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};

    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateFieldData(name, value, formValues);

      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });
    // if (formValues?.from !== "" || formValues?.to !== "") {
    //   if (formValues?.from === "") {
    //     formErrors["from"] = "Enter Date";
    // } else if (formValues?.to === "") {
    //     formErrors["to"] = "Enter Date";
    //   }
    // }
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      const from = formValues?.from;
      const to = formValues?.to;
      const assessorName = formValues?.assessorName;

      setFilterParameters({
        specificAssessorName: assessorName || "",
        fromDate: from || "",
        toDate: to || "",
      });
      storeLocal(
        {
          specificAssessorName: assessorName || "",
          fromDate: from || "",
          toDate: to || "",
        },
        "FilterVerificationTab"
      );
      // handleClose();

      // if (
      //   formValues.assessorName !== "" ||
      //   (formValues.from !== "" && formValues.to !== "")
      // )
      // if((assessorName!=="" && from ==="" && to ==="") || (assessorName !=="" && from !=="" && to !=="") || (from !=="" && to !=="")){
      //   setLoading(true);
      //   dispatch(
      //     getVerificationListApi(
      //       setLoading,
      //       page,
      //       searchQuery,
      //       limit,
      //       setTotalPages,
      //       assessorName,
      //       from,
      //       to,
      //       isFilterOpen,
      //       setIsFilterApplied
      //     )
      //   );
      //   setFilterParameters({specificAssessorName:assessorName ||"",fromDate: from || "", toDate:to || ""})
      //   handleClose();
      // }
    } else {
      storeLocal(null, "FilterVerificationTab");
      // removeLocal("FilterVerificationTab")
    }
  };
  const handleClearAll = () => {
    setFormValues(initialFormValues);
    storeLocal(null, "FilterVerificationTab");
    // removeLocal("FilterVerificationTab")
    setErrors({});
    // handleClose();
    if (
      formValues.assessorName !== "" ||
      (formValues.from !== "" && formValues.to !== "")
    ) {
      setLoading(true);
      dispatch(
        getVerificationListApi(
          setLoading,
          // page,
          localPageNumber,
          searchQuery,
          limit,
          setTotalPages,
          "",
          "",
          "",
          ""
        )
      );
      setIsFilterApplied(false);
    }
  };

  const handleOpen = (
    batchId,
    batchName,
    date,
    assesorId,
    _id,
    viewBtnName = null
  ) => {
    if (viewBtnName !== null) {
      const viewBtn = true;
      navigate(`${UPLOAD_DOCUMENTS_PAGE}/${batchId}/${_id}`, {
        state: { batchName, viewBtn, date },
      });
    } else {
      navigate(`${UPLOAD_DOCUMENTS_PAGE}/${batchId}/${_id}`, {
        state: { batchName },
      });
    }
  };

  const handleDelete = (batchId, batchName, date, assessorId, _id) => {
    console.log("batchId", batchId);
    console.log("batchName", batchName);
    console.log("assessorId", assessorId);
    console.log("date", date);
    console.log("_id", _id);
  };

  const [progress, setProgress] = useState(0);
  const handleDownload = async (e, batchId) => {
    try {
      if (batchId) {
        let downloadZipLink = `${API_ROOT}api/get-qaFileList/${batchId}`;
        const response = await fetch(downloadZipLink);

        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }

        const totalSize =
          parseInt(response.headers.get("content-length"), 10) || 0;
        let downloaded = 0;

        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          downloaded += value.length;
          setProgress((downloaded / totalSize) * 100);
        }

        const blob = new Blob([await response.arrayBuffer()]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "file.zip";
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleDownloadZipFile = (e, batchId) => {
    let zipFileCopyLink = `${API_ROOT}api/get-qaFileList/${batchId}`;
    window.open(zipFileCopyLink);
  };

  const [batchId, setBatchId] = useState("");
  const [SingleId, setSingleId] = useState(null);

  const handleCopyZipFileLink = (batchId, id) => {
    setBatchId(batchId);
    setSingleId(id);
    let zipFileCopyLink = `${API_ROOT}api/get-qaFileList/${batchId}`;
    handleCopyInput(zipFileCopyLink);
    setIsCopied(true);
  };

  const handleClose2 = () => setOpen(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleSubmitExcel = (e) => {
    if (uploadedFile instanceof File) {
      const data = new FormData();
      data.append("uploaded_file", uploadedFile);
      setLoading(true);
      dispatch(
        bulkUploadVerificationTabApi(
          data,
          setLoading,
          setUploadedFile,
          getList,
          handleClose2
        )
      );
    }
  };

  const getBatchIds = () => {
    const ids = verificationTabList?.map((list) => list?.batchId?._id);
    return ids;
  };

  const getUploadedFilesCount = async () => {
    if (verificationTabList && verificationTabList.length && !searchQuery) {
      const batchIds = getBatchIds();
      dispatch(getVerificationFilesCount(batchIds, setVerificationFilesCount));
    }
  };

  const downLoadSample = () => {
    dispatch(downLoadSampleVerificationApi(setLoading));
  };

  const handleBreadCrumbClick = (event, path) => {
    event.preventDefault();
    path && navigate(`${path}`);
  };

  const breadCrumbsData = [
    {
      name: "Verification Management",
      isLink: false,
      key: "1",
      path: "",
      onClick: "",
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "Verification List",
      isLink: false,
      key: "2",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
  ];

  const [isLink, setIsLink] = useState(null);

  const handleGenerateAttendanceSheet = (item) => {
    setDownLoadLoading(true);
    setBatchId(item?.batchId?._id);
    dispatch(
      generateAuditFilesApi(
        setDownLoadLoading,
        item?.batchId?._id,
        verificationTabList,
        setIsLink
      )
    );
  };

  const handleDownloadAttendanceSheet = (item) => {
    setDownLoadLoading(true);
    setBatchId(item?.batchId?._id);
    window.open(item?.zipUrl);
  };

  const handleCopyAttendanceSheetLink = (item) => {
    setBatchId(item?.batchId?._id);
    handleCopyInput(item?.zipUrl);
    if (item?.zipUrl) {
      setIsCopied(true);
    }
  };

  return (
    <div className="main-content">
      <div className="title">
        <h1>Verification Details</h1>
      </div>
      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="tab-header-text">
            <div>
              <SearchInput
                searchQuery={searchQuery}
                handleTrimPaste={handleTrimPaste}
                setSearchQuery={setSearchQuery}
                isDisabled={false}
                // apiHandler={getVerificationListApi}
                // setLoading={setLoading}
                // page={page}
                // limit={limit}
                // setTotalPages={setTotalPages}
                // endAdornment={endAdornment}
                // handleSearchSubmit={handleSearchSubmit}
              />
            </div>
            <h2>Real Time Monitoring & QA Sheet</h2>
          </div>
          <div className="subadmin-btn">
            <button
              className="filter-btn clear_all_btn"
              onClick={handleClearAll}
              style={{ display: [isFilerApplied ? "" : "none"] }}
            >
              Clear All
            </button>

            <FilterModal
              handleClose={handleClose}
              focusHandler={focusHandler}
              blurHandler={blurHandler}
              changeHandler={changeHandler}
              formValues={formValues}
              setFormValues={setFormValues}
              handleDateChange={handleDateChange}
              handleClearAll={handleClearAll}
              handleSubmit={handleSubmit}
              showAssessorField={true}
              showDateInputs={true}
              showFromDate={true}
              showToDate={true}
              assessorNameList={getAssessorNameList}
              setIsFilterOpen={setIsFilterOpen}
              isFilterOpen={isFilterOpen}
              errorMessage={errors}
              isFilterFromVerificationTab={true}
            />

            {isRolePermission?.permissions?.["5"] && (
              <>
                {/* <button className="upload-btn">
                  <label htmlFor="input-file">Upload</label>
                  <input
                    id="input-file"
                    type="file"
                    name="verificationFile"
                    onChange={handleFileUpload}
                    value={""}
                  />
                </button> */}
                <DownloadAndUploadVerification
                  handleUpload={handleFileUpload}
                  fileInfo={uploadedFile}
                  loading={loading}
                  submitSheet={handleSubmitExcel}
                  setOpen={setOpen}
                  open={open}
                  handleClose={handleClose2}
                  handleDownloadSample={downLoadSample}
                />
                <button className="export-btn" onClick={handleExport}>
                  {normalExportBtnLoading ? (
                    <ClipLoader size={14} color="#24273" />
                  ) : (
                    "Export"
                  )}
                </button>
                <button className="export-btn" onClick={handleExportAll}>
                  {masterExportBtnLoading ? (
                    <ClipLoader size={14} color="#24273" />
                  ) : (
                    "Master Export"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="table-wrapper verifcation-table">
          <table>
            <TableHeader
              columns={getColumns(isRolePermission)}
              sortOrders={sortOrders}
              setSortOrders={setSortOrders}
            />
            {loading ? (
              <tbody>
                <tr className="table-loading-wrapper">
                  <td className="sync-loader-wrapper">
                    <PropagateLoader color="#2ea8db" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {sortedData?.length > 0 ? (
                  sortedData?.map((item) => (
                    <tr key={item?._id}>
                      <td>{item?.date || "NA"}</td>
                      <td>{item?.batchId?.batchId || "NA"}</td>
                      <td>{item?.batchId?.accessorId?.fullName || "NA"}</td>
                      <td>{item?.checkInTime || "NA"}</td>
                      <td>{item?.checkOutTime || "NA"}</td>
                      <td>{item?.groupPhotoTime || "NA"}</td>
                      <td>{item?.theoryPhotoTime || "NA"}</td>
                      <td>{item?.theoryVideoTime || "NA"}</td>
                      <td>{item?.practicalPhotoTime || "NA"}</td>
                      <td>{item?.practicalVideoTime || "NA"}</td>
                      <td>{item?.vivaPhotoTime || "NA"}</td>
                      <td>{item?.vivaVideoTime || "NA"}</td>
                      <td>{item?.aadharHolding || "NA"}</td>
                      <td>{item?.annexureN || "NA"}</td>
                      <td>{item?.annexureM || "NA"}</td>
                      <td>{item?.attendanceSheet || "NA"}</td>
                      <td>{item?.tpUndertaking || "NA"}</td>
                      <td>{item?.summarySheet || "NA"}</td>
                      <td>{item?.questionPaper || "NA"}</td>
                      <td>{item?.toolListTime || "NA"}</td>
                      <td>{item?.toolPhotoTime || "NA"}</td>
                      <td>{item?.tpFeedback || "NA"}</td>
                      <td>{item?.audit || "NA"}</td>
                      <td>
                        {item?.remarks?.length > 10 ? (
                          <Tooltip title={item?.remarks || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "130px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.remarks || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.remarks || "NA"}</div>
                        )}
                      </td>
                      <td>
                        <ViewButton
                          handleOpen={() =>
                            handleOpen(
                              item?.batchId?._id,
                              item?.batchId?.batchId,
                              item?.date,
                              item?.assesorId,
                              item?._id,
                              "view"
                            )
                          }
                          verificationFilesCount={verificationFilesCount}
                          batchId={item?.batchId?._id}
                        />
                      </td>
                      {isRolePermission?.permissions?.["4"] && (
                        <td>
                          <DeleteButton
                            handleOpenDialog={() => deleteHandler(item?._id)}
                          />
                        </td>
                      )}

                      <td>
                        <UploadButton
                          batchId={item?.batchId?.batchId}
                          handleOpen={() =>
                            handleOpen(
                              item?.batchId?._id,
                              item?.batchId?.batchId,
                              item?.date,
                              item?.assesorId,
                              item?._id
                            )
                          }
                        />
                      </td>
                      <td>
                        <DownloadButton
                          handleDownload={(e) =>
                            handleDownloadZipFile(
                              e,
                              item?.batchId?._id,
                              loading
                            )
                          }
                          handleCopyZipFileLink={() =>
                            handleCopyInput(item?.batchId?._id, item?._id)
                          }
                          isFileUploaded={item?.isFileUploaded}
                          batchId={batchId}
                          selectedBatchId={item?.batchId?._id}
                          selectedCopyLink={item?._id}
                          SingleId={SingleId}
                        />
                      </td>
                      <td>
                        <ReminderButton
                          batchId={item?.batchId?.batchId}
                          QAverificationTimeStampId={item?._id}
                          setLoading={setLoading}
                          loading={loading}
                          assesorId={item?.assesorId}
                          setErrors={setErrors}
                          errors={errors}
                        />
                      </td>

                      {downloadLoading && item?._id === batchId ? (
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "30px",
                          }}
                        >
                          <PulseLoader type="pulse" size="8px" />
                        </td>
                      ) : (
                        isRolePermission?.permissions?.["5"] && (
                          <td style={{ textAlign: "center" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <Tooltip
                                title={
                                  item?.zipUrl
                                    ? "Regenerate Link"
                                    : "Generate Link"
                                }
                              >
                                <AddLinkIcon
                                  sx={{ cursor: "pointer" }}
                                  color={item?.zipUrl ? "secondary" : "primary"}
                                  onClick={() =>
                                    handleGenerateAttendanceSheet(item)
                                  }
                                />
                              </Tooltip>
                              {item?.zipUrl && (
                                <Tooltip title="DownLoad">
                                  <GetAppIcon
                                    fontSize="small"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDownloadAttendanceSheet(item)
                                    }
                                  />
                                </Tooltip>
                              )}
                              {item?.zipUrl && (
                                <Tooltip title="Copy Link">
                                  <ContentCopyOutlinedIcon
                                    fontSize="small"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleCopyAttendanceSheetLink(item)
                                    }
                                  />
                                </Tooltip>
                              )}

                              <Snackbar
                                open={isCopied}
                                autoHideDuration={2000}
                                onClose={() => setIsCopied(false)}
                                message="Link copied!"
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                                sx={{
                                  "& .MuiSnackbarContent-root": {
                                    backgroundColor: "#1ab6f7",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    borderRadius: "4px",
                                    boxShadow: "none",
                                    padding: "6px 10px",
                                    minWidth: "auto",
                                  },
                                }}
                              />
                            </div>
                          </td>
                        )
                      )}
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>
                      <p>No Results Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <div
        style={{
          display: [totalPages > 0 ? "" : "none"],
        }}
      >
        <DeleteModal
          title="Delete Row"
          confirmDelete={confirmDelete}
          open={deleteModal}
          handleCloseModal={handleCloseModal}
        />
        {sortedData && sortedData?.length > 0 && (
          <CustomTablePagination
            count={totalPagesUser}
            page={localPageNumber}
            limit={limit}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </div>
    </div>
  );
};

export default VerificationList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "date", label: "Date" },
    { name: "batchId", label: "batch ID" },
    { name: "assessorName", label: "Assessor Name" },
    { name: "CheckIn", label: "Check In (Photo)" },
    { name: "CheckOut", label: "Check Out (Photo)" },
    { name: "groupPhoto", label: "Group Photo" },
    { name: "theoryExamPhoto", label: "Theory Exam Photo" },
    { name: "theoryExamVideo", label: "Theory Exam Video" },
    { name: "practicalPhoto", label: "Practical Photo" },
    { name: "practicalVideo", label: "Practical Video" },
    { name: "vivaPhoto", label: "Viva Photo" },
    { name: "vivaVideo", label: "Viva Video" },
    { name: "aadharPhoto", label: "Aadhar Photo" },
    { name: "annexureN", label: "Annexure N" },
    { name: "annexureM", label: "Annexure M" },
    { name: "attendanceSheet", label: "Attendance Sheet" },
    { name: "tpUnderTaking", label: "TP UnderTaking" },
    { name: "summaryTest", label: "Summary Test" },
    { name: "questionPaper", label: "Question Paper (if Applicable)" },
    { name: "toolsList", label: "Tools List (if Applicable)" },
    { name: "toolsPhoto", label: "Tools Photo (if Applicable)" },
    { name: "tpFeedback", label: "TP Feedback (if Applicable)" },
    { name: "audit", label: "Audit (if any)" },
    { name: "remarks", label: "Remarks (if any)" },
    { name: "viewDoc", label: "View Document" },
    { name: "delete", label: "Delete" },
    { name: "allDocuments", label: "All Documents" },
    { name: "download", label: "Download" },
    { name: "reminder", label: "Reminder" },
    { name: "auditReport", label: "Audit Report" },
  ];
  if (!isRolePermission?.permissions?.["4"]) {
    columns = columns?.filter((column) => column?.name !== "delete");
  }
  return columns;
};

export const ViewButton = ({ handleOpen, verificationFilesCount, batchId }) => {
  let btnName = "View";
  if (batchId && typeof verificationFilesCount !== "string") {
    btnName = verificationFilesCount[batchId] ?? "View";
  }
  return (
    <>
      <div className="view-btn-wrapper">
        <button onClick={handleOpen}>{btnName}</button>
      </div>
    </>
  );
};

export const DeleteButton = ({ handleOpenDialog }) => {
  return (
    <>
      <div className="delete-btn-wrapper">
        <button onClick={handleOpenDialog}>Delete</button>
        {/* <button onClick={deleteHandler}>Delete</button> */}
      </div>
    </>
  );
};

export const UploadButton = ({ batchId, handleOpen }) => {
  return (
    <>
      <div className="upload-btn-wrapper">
        <button onClick={handleOpen}>Upload</button>
      </div>
    </>
  );
};
export const DownloadButton = ({
  handleDownload,
  handleCopyZipFileLink,
  loading,
  isFileUploaded,
  batchId,
  selectedBatchId,
  SingleId,
  selectedCopyLink,
}) => {
  return (
    <div
      className={
        isFileUploaded
          ? "download-btn-wrapper"
          : "download-btn-wrapper-inactive"
      }
    >
      <DocsDownload
        handleDownload={handleDownload}
        loading={loading}
        isFileUploaded={isFileUploaded}
      />

      {SingleId !== null && SingleId === selectedCopyLink ? (
        <FileCopyRoundedIcon
          style={{ fill: SingleId === selectedCopyLink ? "#1ab6f7" : "" }}
        />
      ) : (
        <ContentCopyOutlinedIcon
          style={{
            cursor: isFileUploaded ? "pointer" : "no-drop",
            pointerEvents: isFileUploaded ? "auto" : "none",
          }}
          onClick={() => {
            handleCopyZipFileLink();
          }}
        />
      )}
    </div>
  );
};

export const ReminderButton = ({
  batchId,
  QAverificationTimeStampId,
  setLoading,
  loading,
  assesorId,
  setErrors,
  errors,
}) => {
  return (
    <>
      <div className="upload-btn-wrapper">
        <ReminderModel
          batchId={batchId}
          QAverificationTimeStampId={QAverificationTimeStampId}
          setLoading={setLoading}
          loading={loading}
          assesorId={assesorId}
          setErrors={setErrors}
          errors={errors}
        />
      </div>
    </>
  );
};
