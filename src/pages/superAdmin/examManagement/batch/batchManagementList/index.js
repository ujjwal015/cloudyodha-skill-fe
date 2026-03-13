import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  SUPER_ADMIN_ASSESSMENT_STATS,
  SUPER_ADMIN_ASSIGN_BATCH,
  SUPER_ADMIN_CREATE_BATCH_PAGE,
  SUPER_ADMIN_EDIT_BATCH_PAGE,
  SUPER_ADMIN_LIVE_MONITORING_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";

import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../../../assets/icons/search-icon.svg";
import { ReactComponent as DeleteIcon } from "./../../../../../assets/icons/delete-icon.svg";
import { SyncLoader } from "react-spinners";
import moment from "moment";
import {
  deleteBatchApi,
  editBatchListStatusApi,
  exportAllExamManagementBatchListApi,
  getBatchData,
  getExamManagementBatchListApiV2,
} from "../../../../../api/superAdminApi/examManagement";
import { examManagementSelector } from "../../../../../redux/slicers/superAdmin/examManagementSlice";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";

import { exportData, getLocal, getSubRole, handleTrimPaste, storeLocal, userRoleType } from "../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../../components/common/DropDown";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { FormSwitch } from "../../../../../components/common/input";
import { PulseLoader } from "react-spinners";
import { TableHeader } from "../../../../../components/common/table";
import FilterModal from "../../../../../components/common/Modal/FilterModal";
import validateField from "../../../../../utils/validateField";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { getClientManagementListsApi } from "../../../../../api/superAdminApi/clientManagement";
import { clientManagementSelector } from "../../../../../redux/slicers/superAdmin/clientManagement";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

const BatchList = () => {
  const initialFormValues = {
    from: "",
    to: "",
    clientName: "",
    jobRole: "",
    schemeName: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    examManagementbatchList = [],
    jobRoleList = [],
    schemeList = [],
  } = useSelector(examManagementSelector);
  const { clientManagementLists = [] } = useSelector(clientManagementSelector);

  const [sortOrders, setSortOrders] = useState({});
  
  const [sortedData, setSortedData] = useState([]);

  console.log("sortesortedDatadData", sortedData, examManagementbatchList);
  const [loading, setLoading] = useState(true);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);
  const [masterExportLoading, setMasterExportLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [actionId, setActionId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [id, setId] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { userInfo = {} } = useSelector(authSelector);
  // permission
  const { EXAM_MANAGEMENT_FEATURE, EXAM_MANAGEMENT_SUB_FEATURE_2 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = EXAM_MANAGEMENT_SUB_FEATURE_2;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const [isFilerApplied, setIsFilterApplied] = useState(false);
  const selectedClient=getLocal("SelectedClient");
  const [sortedDataModified,setSortedDataModified]=useState([]);
    const [storequery, setStorequery] = useState(getLocal("queryActiveBatch"));
    const [isAtBottom, setIsAtBottom] = useState(false);
    const contentRef = useRef(null);
    const scrollTimeout = useRef(null);
  
console.log("________HHGGGGKK",sortedData, sortedDataModified);

  const localPageNumber=getLocal("batchlistPage");
  const getList = useCallback((isQuestionDeleted = false, len, search = true, customFormValues = null,initialFormValues={}) => {
    if(Object.keys(initialFormValues).length>0){
      setLoading(true);
      const formValuesToUse = customFormValues || formValues;
      const clientName = formValuesToUse?.clientName;
      const jobRole = formValuesToUse?.jobRole?.split(" - ")[0]?.trim();
      const schemeName = formValuesToUse?.schemeName;
      const from = formValuesToUse?.from ? moment(formValuesToUse?.from).format("MM/DD/YYYY") : "";
      const to = formValuesToUse?.to ? moment(formValuesToUse?.to).format("MM/DD/YYYY") : "";
  
      dispatch(
        getExamManagementBatchListApiV2(
          setLoading,
          localPageNumber,
          limit,
          // search ? searchQuery : "",
          searchQuery,
          setTotalPages,
          setStatusLoading,
          clientName,
          jobRole,
          schemeName,
          from,
          to,
          setIsFilterApplied
        )
      );
    }
    else{
      dispatch(
        getExamManagementBatchListApiV2(
          setLoading,
          localPageNumber,
          limit,
          // search ? searchQuery : "",
          searchQuery,
          setTotalPages,
          setStatusLoading,
          "",
          "",
          "",
          "",
          "",
          setIsFilterApplied
        )
      );
    }
    
  }, [dispatch, limit, localPageNumber, searchQuery, setTotalPages, setStatusLoading, setIsFilterApplied, formValues]);

useEffect(() => {
    getList();
  }, [localPageNumber, limit, getList]);

  useEffect(() => {
      return window.localStorage.removeItem("queryActiveBatch");
    }, []);

  useEffect(()=>{
    setSearchQuery(selectedClient);
  },[selectedClient])

  const scrollToPosition = () => {
    const container = contentRef.current;
    if (!container) return;

    if (!isAtBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleCloseFilter = useCallback(() => {
    setIsFilterOpen(false);
  },[]);

  const removeDuplicates = () => {
    const uniqueOrganisation = new Set();

    const uniqueUsers = clientManagementLists.filter((user) => {
      if (!uniqueOrganisation.has(user.clientname)) {
        uniqueOrganisation.add(user.clientname);
        return true;
      }
      return false;
    });
    return uniqueUsers;
  };

  const CLIENT_NAME = removeDuplicates();

  const CLIENT_NAMES = CLIENT_NAME?.map((item) => {
    return {
      label: item?.clientname,
      value: item?.clientname,
    };
  });
  
  const JOB_ROLES = jobRoleList?.map((item) => {
    
    return {
      label: item?.label,
      value: item?.label,
    };
  });

  const SCHEME_FILTER = schemeList?.map((item) => {
    return {
      label: item?.label,
      value: item?.label,
    };
  });

  useEffect(() => {
    dispatch(getBatchData());
  }, []);

  const handleClearAll = useCallback(() => {
    setFormValues(initialFormValues);
    getList(false, 10, true, null, initialFormValues);
    setErrors({});
    // handleCloseFilter();
    setIsFilterApplied(false);
  }, [initialFormValues, getList, handleCloseFilter]);

  useEffect(() => {
    dispatch(getClientManagementListsApi(setLoading, 1, 38));
  }, []);

  const getBatchFilterList = () => {
    dispatch(getClientManagementListsApi(setLoading, 1, 38));
  };

  useEffect(() => {
    if (isFilterOpen) {
      getBatchFilterList();
      dispatch(getBatchData());
    }
  }, [isFilterOpen]);

  

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    storeLocal(nxtPage,"batchlistPage")
    dispatch(getExamManagementBatchListApiV2(setLoading, nxtPage, limit, searchQuery, setStatusLoading));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getExamManagementBatchListApiV2(
        setLoading,
        1,
        limit,
        searchQuery,
        setTotalPages,
        setStatusLoading
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
    storeLocal(1,"batchlistPage")
  };

  useEffect(() => {
    setSortedData(examManagementbatchList);
    setTotalPagesUser(totalPages);
  }, [examManagementbatchList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...examManagementbatchList].sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (sortColumn === "startDate") {
            const momentA = moment(valueA, "DD/MM/YYYY", true);
            const momentB = moment(valueB, "DD/MM/YYYY", true);
            if (momentA.isValid() && momentB.isValid()) {
              if (sortOrder === "asc") {
                if (momentA.isAfter(momentB)) return 1;
                if (momentA.isBefore(momentB)) return -1;
                return 0;
              } else {
                if (momentA.isAfter(momentB)) return -1;
                if (momentA.isBefore(momentB)) return 1;
                return 0;
              }
            }
          }
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
  }, [examManagementbatchList, sortOrders]);

  useEffect(()=>{
    if(sortedData?.length>0){
      if(storequery?.status){
        const arr=[]
        for(let item of sortedData){
          if(item?.status){
            arr.push(item);
          }
        }
        setSortedDataModified(arr)
      }
      else{
        setSortedDataModified(sortedData)
      }
    }
    else{
      setSortedDataModified(sortedData)
    }
  },[sortedData,storequery])

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // handleSearch(event);
    }
  };
  const confirmDelete = () => {
    const len = examManagementbatchList?.length;

    dispatch(
      deleteBatchApi(setLoading, actionId, setDeleteModal, getList, len)
    );
  };
  const editBtnHandler = (id, index) => {
    navigate(`${SUPER_ADMIN_EDIT_BATCH_PAGE}/${id}`);
  };

  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const trimmedValue = value.trim();
    // if (trimmedValue === "") {
    //   getList(null, null, false);
    // }
    setSearchQuery(value);
  };
  // const handleSearch = () => {
  //   // if (searchQuery !== "")
  //     dispatch(getExamManagementBatchListApiV2(setLoading, 1, limit, searchQuery, setTotalPages, setStatusLoading));
  //   // setPage(1);
  // };
  
  const handleClose = () => {
    setIsFilterOpen(false);
  };
  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    console.log(`${name} ------- ${value}`);
    
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
    const formattedDate = newDate.format("YYYY-MM-DD");
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



  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};

    if (formValues?.from != "" || formValues?.to != "") {
      if (formValues?.from == "") {
        formErrors["from"] = "Enter Date";
      } else if (formValues?.to == "") {
        formErrors["to"] = "Enter Date";
      }
    }
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const clientName = formValues?.clientName;
      const jobRole = formValues?.jobRole?.split(" - ")[0]?.trim();
      const schemeName = formValues?.schemeName;
      const from = formValues?.from
        ? moment(formValues?.from).format("MM/DD/YYYY")
        : "";
      const to = formValues?.to
        ? moment(formValues?.to).format("MM/DD/YYYY")
        : "";
      dispatch(
        getExamManagementBatchListApiV2(
          setLoading,
          // page,
          localPageNumber,
          limit,
          searchQuery,
          setTotalPages,
          setStatusLoading,
          clientName,
          jobRole,
          schemeName,
          from,
          to,
          setIsFilterApplied,
        ),
      );
      handleClose();
    }
  };

  const exportBatchData = () => {
    const exportData = examManagementbatchList?.map((item) => {
      return {
        batchId: item?.batchId,
        batchName: item?.batchName,
        clientId: item?.clientname || "N/A",
        scheme: item?.schemeName || "N/A",
        subSchemeName: item?.subSchemeName || "N/A",
        batchStartDate: item?.startDate,
        batchEndDate: item?.endDate,
        assessmentDate: item?.assessmentDate,
        batchSize: item?.batchSize,
        batchMode: item?.batchMode,
        assessorName: item?.accessorName || "N/A",
        batchProctoring: item?.batchProctoring,
        assessmentStartTime: item?.startTime,
        assessmentEndTime: item?.endTime,
      };
    });
    return exportData;
  };

  // const exportBatchData = (examManagementbatchList) => {
  //   const exportData = examManagementbatchList?.map((item, index) => {
  //     return {
  //       _id: index + 1,
  //       batchId: item?.batchId || "N/A",
  //       batchSize: item?.batchSize || "N/A",
  //       startDate: item?.startDate || "N/A",
  //       endDate: item?.endDate || "N/A",
  //       examCenterId: item?.examCenterId || "N/A",
  //       schemeId: item?.schemeId?.schemeName || "N/A",
  //       subSchemeId: item?.subSchemeId?.subSchemeName || "N/A",
  //       batchMode: item?.batchMode || "N/A",
  //       assessmentDate: item?.assessmentDate || "N/A",
  //       report_id: item?.report_id || "N/A",
  //       assignAssessorProctor: item?.assignAssessorProctor || "N/A",
  //       jobRole: item?.jobRole?.jobRole || "N/A",
  //       clientId: item?.clientId?.clientname || "N/A",
  //       status: item?.status || "N/A",
  //       candidateAssigned: item?.candidateAssigned || "N/A",
  //       // createdAt: item?.createdAt || "N/A",
  //       // updatedAt: item?.updatedAt || "N/A",
  //       // proctoring: item?.proctoring || "N/A",
  //       // passingPercentage: item?.questionPaper?.passingPercentage || "N/A",
  //       // sectionTable: item?.questionPaper?.sectionTable || [],
  //       // chooseInstructions: item?.questionPaper?.chooseInstructions || "N/A",
  //       // qpCode: item?.questionPaper?.qpCode || "N/A",
  //       // suffleQuestion: item?.questionPaper?.suffleQuestion || "N/A",
  //       // optionRandom: item?.questionPaper?.optionRandom || "N/A",
  //       // markForReview: item?.questionPaper?.markForReview || "N/A",
  //       // questionNavigation: item?.questionPaper?.questionNavigation || "N/A",
  //       // paginationStatus: item?.questionPaper?.paginationStatus || "N/A",
  //       // examLanguageConduct: item?.questionPaper?.examLanguageConduct || "N/A",
  //       // primaryLanguage: item?.questionPaper?.primaryLanguage || "N/A",
  //       // secondaryLanguage: item?.questionPaper?.secondaryLanguage || "N/A",
  //       // questionSet: item?.questionPaper?.questionSet || "N/A",
  //       // assesmentStatus: item?.questionPaper?.assesmentStatus || "N/A",
  //       // level: item?.questionPaper?.level || "N/A",
  //       // questionType: item?.questionPaper?.questionType || "N/A",
  //       // status: item?.questionPaper?.status || "N/A",
  //       // // Add more fields as needed
  //       // imageProctorStatus:
  //       //   item?.proctoring?.imageProctor?.imageProctorStatus || "N/A",
  //       // imageProctoringTime:
  //       //   item?.proctoring?.imageProctor?.imageProctoringTime || "N/A",
  //       // videoStreaming: item?.proctoring?.videoStream?.videoStreaming || "N/A",
  //       // videoDuration: item?.proctoring?.videoStream?.videoDuration || "N/A",
  //       // videoInterval: item?.proctoring?.videoStream?.videoInterval || "N/A",
  //       // wrongLoginStatus:
  //       //   item?.proctoring?.wrongLogin?.wrongLoginStatus || "N/A",
  //       // noOfWrongLogin: item?.proctoring?.wrongLogin?.noOfWrongLogin || "N/A",
  //       // browserExitAlert:
  //       //   item?.proctoring?.browserExit?.browserExitAlert || "N/A",
  //       // noOfBrowserExit:
  //       //   item?.proctoring?.browserExit?.noOfBrowserExit || "N/A",
  //       // faceRecognition: item?.proctoring?.faceRecognition || "N/A",
  //       // faceDetection: item?.proctoring?.faceDetection || "N/A",
  //       // videoScreensharingProctoringStatus:
  //       //   item?.proctoring?.videoScreensharingProctoringStatus || "N/A",
  //       // capturingImageStatus: item?.proctoring?.capturingImageStatus || "N/A",
  //       // identityProofStatus: item?.proctoring?.identityProofStatus || "N/A",
  //     };
  //   });
  //   return exportData;
  // };

  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportBatchData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Batch List.xlsx");
  };

  const handleStatusChange = (e, id) => {
    const { checked } = e.target;
    const value = checked ? true : false;
    setId(id);
    const formData = {
      status: value,
    };
    setStatusLoading(true);
    dispatch(
      editBatchListStatusApi(
        setLoading,
        id,
        formData,
        setStatusLoading,
        getList
      )
    );
  };

  const handleNavigateAssessmentStats = (id, batchId) => {
    navigate(`${SUPER_ADMIN_ASSESSMENT_STATS}/${id}/${batchId}`);
  };

  const MAX_LENGTH_FOR_TOOLTIP = 13;

  
  // useEffect(() => {
  //   if (searchQuery) {
  //     const getData = setTimeout(() => {
  //       getList();
  //     }, 500);

  //     return () => clearTimeout(getData);
  //   }
  // }, [searchQuery]);

  const getJobRoleById = (id = "") => {
    return jobRoleList?.find((item) => item?.value === id)?.label || " ";
  };

  const handleAllExport = (batchbata, column, data, successCall) => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(batchbata(data), column())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "All Batch List.xlsx");
    successCall();
  };

  
  const formatData = (data) => {
    const exportData = data?.map((item) => {
      return {
        batchId: item?.batchId,
        batchName: item?.batchName, //
        clientId: item?.clientId?.clientname || "-",
        scheme: item?.schemeId?.schemeName || "-",
        subSchemeName: item?.subSchemeId?.subSchemeName || "-",
        batchStartDate: item?.startDate || "-" ,
        batchEndDate: item?.endDate || "-",
        assessmentDate: item?.assessmentDate || "-",
        batchProctoring: item?.batchProctoring,
        jobRole: item?.questionPaper?.isMultiJobRole
          ? item?.questionPaper?.multipleJobRole
              ?.map((item1) => item1?.jobRoleId?.jobRole)
              ?.join(",")
          : item?.jobRole?.jobRole,
        level: item?.questionPaper?.isMultiJobRole
          ? item?.questionPaper?.multipleJobRole
              ?.map((item1) => item1?.level)
              ?.join(",")
          : item?.questionPaper?.level,
        version: item?.questionPaper?.isMultiJobRole
          ? item?.questionPaper?.multipleJobRole
              ?.map((item1) => item1?.version)
              ?.join(",")
          : item?.questionPaper?.version,
        startDate: item?.startDate || "-",
        endDate: item?.endTime || "-",
        assessmentStartTime: item?.startTime || "-",
        assessmentEndTime: item?.endTime || "-",
        batchSize: item?.batchSize || "-",
        batchMode: item?.batchMode || "-",
        assessorName: item?.accessorId?.length>0 ? item?.accessorId
          ?.map((data) => data?.fullName)
          ?.join(",") : "-",
        // createdAt:
        // status
      };
    });
    return exportData;
  };


  const handleMasterExport = () => {
    setMasterExportLoading(true);
    dispatch(
      exportAllExamManagementBatchListApi(
        setMasterExportLoading,
        formatData,
        getColumns,
        handleAllExport
      )
    );
  };  const handleFilterRemove=()=>{
    window.localStorage.removeItem("queryActiveBatch");
    setStorequery(false);
  }

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const scrollPosition = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const scrollThreshold = 100; // Pixels from bottom to trigger change
        
        const isNearBottom = scrollPosition + clientHeight >= scrollHeight - scrollThreshold;
        setIsAtBottom(isNearBottom);
      }, 150); // Debounce time in milliseconds
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <div ref={contentRef} className="main-content exam-management-batch-list">
      <div className="title">
        <div className="title-text">
          <h1>Batch List</h1>
        </div>
        <div className="title-btn">
          {isRolePermission?.permissions?.["2"] && (
            <button onClick={() => navigate(SUPER_ADMIN_CREATE_BATCH_PAGE)}>
              <PlusIcon />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      <div
        className="subadmin-table"
        style={{ overflow: [sortedData.length < 10 ? "visible" : ""] }}
      >
        <div className="subadmin-header">
          <div className="search-input">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search"
              value={searchQuery}
              style={{ background: "#F8F8F8", padding: "2px" }}
              onChange={handleChange}
              onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
              // onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "#231F20", width: 15 }} />
                  </InputAdornment>
                ),
              }}
            />
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
              handleClose={handleCloseFilter}
              focusHandler={focusHandler}
              blurHandler={blurHandler}
              changeHandler={changeHandler}
              formValues={formValues}
              setFormValues={setFormValues}
              handleDateChange={handleDateChange}
              handleClearAll={handleClearAll}
              handleSubmit={handleSubmit}
              showBatch
              batchClientName={CLIENT_NAMES}
              batchJobRole={JOB_ROLES}
              batchScheme={SCHEME_FILTER}
              errorMessage={errors}
            />

            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={loading ? undefined : handleExport}
              >
                {loading ? "loading..." : "Export"}
              </button>
            )}

            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={loading ? undefined : handleMasterExport}
              >
                {masterExportLoading ? "loading..." : "Export All"}
              </button>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          {storequery?.status && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "small",
                  color: "#00B2FF",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Active Batch
              </p>
              <DeleteIcon
                style={{ height: "1rem", width: "1rem", marginLeft: "10px" }}
                onClick={handleFilterRemove}
              />
            </div>
          )}
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
                    <SyncLoader color="#2ea8db" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {sortedDataModified.length > 0 ? (
                  sortedDataModified.map((item, index) => (
                    <tr key={item?._id}>
                      {/* <td>{(page - 1) * limit + (index + 1)}</td> */}
                      <td>{(localPageNumber - 1) * limit + (index + 1)}</td>
                      <td>
                        {item?.batchId?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.batchId || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.batchId || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.batchId || "NA"}</div>
                        )}
                      </td>
                      {/* <td>{item?.batchId || "N/A"}</td> */}
                      <td>
                        {item?.clientname?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.clientname || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.clientname || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.clientname || "NA"}</div>
                        )}
                      </td>
                      {/* <td>{item?.clientId?.clientname || "N/A"}</td> */}
                      <td>
                        {Array.isArray(item.jobRoleNames) ? (
                          item.jobRoleNames.join(", ").length >
                          MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={
                                <ul style={{ paddingLeft: "16px" }}>
                                  {item.jobRoleNames.map((role, index) => (
                                    <li key={index}>{`${
                                      index + 1
                                    }. ${role}`}</li>
                                  ))}
                                </ul>
                              }
                              arrow
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px",
                                }}
                              >
                                {item.jobRoleNames.join(", ")}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item.jobRoleNames.join(", ")}</div>
                          )
                        ) : typeof item.jobRoleNames === "string" ? (
                          item.jobRoleNames.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip title={item.jobRoleNames} arrow>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px",
                                }}
                              >
                                {item.jobRoleNames.replaceAll("\n", " ")}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item.jobRoleNames.replaceAll("\n", " ")}</div>
                          )
                        ) : (
                          <div>NA</div>
                        )}
                      </td>

                      <td>
                        {Array.isArray(item?.level)
                          ? item.level.length ? item.level.filter(Boolean).join(", ") : "-"
                          : item?.level || "-"}
                      </td>
                      <td>
                        {Array.isArray(item?.version)
                          ? item.version.length ? item.version.filter((v) => v !== undefined && v !== null).join(", ") : "-"
                          : item?.version || "-"}
                      </td>

                      {/* <td>{item?.questionPaper?.version || "-"}</td> */}
                      <td>
                        {item?.schemeName?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.schemeName || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.schemeName || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.schemeName || "NA"}</div>
                        )}
                      </td>
                      {/* <td>{item?.schemeId?.schemeName || "N/A"}</td> */}
                      <td>
                        {item?.subSchemeName?.length >
                        MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.subSchemeName || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.subSchemeName || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.subSchemeName || "NA"}</div>
                        )}
                      </td>
                      {/* <td>{item?.subSchemeId?.subSchemeName || "N/A"}</td> */}
                      <td>
                        {item?.startDate?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.startDate || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.startDate || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.startDate || "NA"}</div>
                        )}
                      </td>
                      {/* <td>{item?.startDate || "N/A"}</td> */}
                      <td>
                        {item?.endDate?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.endDate || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.endDate || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.endDate || "NA"}</div>
                        )}
                      </td>
                      {/* <td>{item?.endDate || "N/A"}</td> */}
                      <td>{item?.startTime || "N/A"}</td>
                      <td>{item?.endTime || "N/A"}</td>
                      <td>
                        {item?.batchSize?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.batchSize || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.batchSize || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.batchSize || "NA"}</div>
                        )}
                      </td>
                      {/* <td>{item?.batchSize || "N/A"}</td> */}
                      <td>{item?.batchMode || "N/A"}</td>
                      <td>
                        {item?.accessorName?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.accessorName || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.accessorName || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.accessorName || "NA"}</div>
                        )}
                      </td>
                      <td>
                        <div className="assesment-stats-btn">
                          <button
                            onClick={() =>
                              handleNavigateAssessmentStats(
                                item._id,
                                item?.batchId
                              )
                            }
                          >
                            <span>View Stats</span>
                          </button>
                        </div>
                      </td>
                      <td>{moment(item?.createdAt).format("DD/MM/YYYY")}</td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td>
                          {statusLoading && id == item?._id ? (
                            <PulseLoader size="10px" color="#0bbbfe" />
                          ) : (
                            <FormSwitch
                              value={item?.status}
                              onChange={(e) => handleStatusChange(e, item?._id)}
                            />
                          )}
                        </td>
                      )}
                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
                        <td>
                          <div className="action-btn">
                            <ActionDropdown
                              actionOpen={actionOpen}
                              setActionOpen={setActionOpen}
                              deleteHandler={deleteHandler}
                              editBtnHandler={() => editBtnHandler(item?._id)}
                              MoreBtnHandler={MoreBtnHandler}
                              id={item._id}
                              actionId={actionId}
                              featureName={featureName}
                              subFeatureName={subFeatureName}
                              showDelete={item?.status == false}
                              showEdit={isRolePermission?.permissions?.["3"]}
                            />
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>
                      <p>No Batch List Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <DeleteModal
        title="Deleting Batch"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      {sortedDataModified && sortedDataModified?.length > 0 && (
        <CustomTablePagination
          count={totalPages}
          page={localPageNumber}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <button
        onClick={scrollToPosition}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#2ea8db",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          zIndex: 1000,
          fontSize: "20px",
          opacity: 0.6,
          transition: "transform 0.2s ease-in-out, opacity 0.2s ease-in-out",
          "&:hover": {
            opacity: 1,
          },
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
      >
        {isAtBottom ? <ArrowUpward /> : <ArrowDownward />}
      </button>
    </div>
  );
};

export default BatchList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "SNO." },
    { name: "batchId", label: "BATCH SIP ID" },
    { name: "clientId", label: "CLIENT NAME" },
    { name: "jobRole", label: "JOB ROLE" },
    { name: "level", label: "LEVEL" },
    { name: "version", label: "VERSION" },
    { name: "scheme", label: "SCHEME" },
    { name: "subSchemeName", label: "SUB-SCHEME" },
    { name: "startDate", label: "ASSESSMENT START DATE", sorting: true },
    { name: "batchEndDate", label: "ASSESSMENT END DATE" },
    { name: "assessmentStartTime", label: "ASSESSMENT START TIME" },
    { name: "assessmentEndTime", label: "ASSESSMENT END TIME" },
    { name: "batchSize", label: "BATCH SIZE" },
    { name: "batchMode", label: "BATCH MODE" },
    { name: "assessorName", label: "ASSESSOR NAME" },
    { name: "assessorStats", label: "ASSESSMENT STATS" },
    { name: "createdAt", label: "created On", sorting: true },
    { name: "status", label: "STATUS", sorting: false },
    { name: "actions", label: "ACTIONS", sorting: false },
  ];
  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns?.filter((column) => column?.name !== "status");
  }
  if (
    !isRolePermission?.permissions?.["3"] &&
    !isRolePermission?.permissions?.["4"]
  ) {
    columns = columns?.filter((column) => column?.name !== "actions");
  }
  return columns;
};

const getExportColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "SNO." },
    { name: "batchId", label: "BATCH SIP ID" },
    { name: "batchSize", label: "BATCH SIZE" },
    { name: "startDate", label: "BATCH START DATE" },
    { name: "endDate", label: "BATCH END DATE" },
    { name: "examCenterId", label: "EXAM CENTER ID" },
    { name: "schemeId", label: "SCHEME ID" },
    { name: "subSchemeId", label: "SUB-SCHEME ID" },
    { name: "batchMode", label: "BATCH MODE" },
    { name: "assessmentDate", label: "ASSESSMENT DATE" },
    { name: "report_id", label: "REPORT ID" },
    { name: "assignAssessorProctor", label: "ASSIGN ASSESSOR PROCTOR" },
    { name: "jobRole", label: "JOB ROLE" },
    { name: "clientId", label: "CLIENT ID" },
    { name: "status", label: "STATUS" },
    { name: "candidateAssigned", label: "CANDIDATE ASSIGNED" },
    // { name: "createdAt", label: "CREATED AT" },
    // { name: "updatedAt", label: "UPDATED AT" },
    // { name: "proctoring", label: "PROCTORING" },
    // { name: "passingPercentage", label: "PASSING PERCENTAGE" },
    // { name: "sectionTable", label: "SECTION TABLE" },
    // { name: "chooseInstructions", label: "CHOOSE INSTRUCTIONS" },
    // { name: "qpCode", label: "QP CODE" },
    // { name: "suffleQuestion", label: "SHUFFLE QUESTION" },
    // { name: "optionRandom", label: "OPTION RANDOM" },
    // { name: "markForReview", label: "MARK FOR REVIEW" },
    // { name: "questionNavigation", label: "QUESTION NAVIGATION" },
    // { name: "paginationStatus", label: "PAGINATION STATUS" },
    // { name: "examLanguageConduct", label: "EXAM LANGUAGE CONDUCT" },
    // { name: "primaryLanguage", label: "PRIMARY LANGUAGE" },
    // { name: "secondaryLanguage", label: "SECONDARY LANGUAGE" },
    // { name: "questionSet", label: "QUESTION SET" },
    // { name: "assesmentStatus", label: "ASSESMENT STATUS" },
    // { name: "level", label: "LEVEL" },
    // { name: "questionType", label: "QUESTION TYPE" },
    // { name: "status", label: "STATUS" },
    // { name: "imageProctorStatus", label: "IMAGE PROCTOR STATUS" },
    // { name: "imageProctoringTime", label: "IMAGE PROCTORING TIME" },
    // { name: "videoStreaming", label: "VIDEO STREAMING" },
    // { name: "videoDuration", label: "VIDEO DURATION" },
    // { name: "videoInterval", label: "VIDEO INTERVAL" },
    // { name: "wrongLoginStatus", label: "WRONG LOGIN STATUS" },
    // { name: "noOfWrongLogin", label: "NO OF WRONG LOGIN" },
    // { name: "browserExitAlert", label: "BROWSER EXIT ALERT" },
    // { name: "noOfBrowserExit", label: "NO OF BROWSER EXIT" },
    // { name: "faceRecognition", label: "FACE RECOGNITION" },
    // { name: "faceDetection", label: "FACE DETECTION" },
    // {
    //   name: "videoScreensharingProctoringStatus",
    //   label: "VIDEO SCREENSHARING PROCTORING STATUS",
    // },
    // { name: "capturingImageStatus", label: "CAPTURING IMAGE STATUS" },
    // { name: "identityProofStatus", label: "IDENTITY PROOF STATUS" },
    // // Add more fields as needed
    // { name: "passingPercentage", label: "PASSING PERCENTAGE" },
    // { name: "sectionTable", label: "SECTION TABLE" },
    // { name: "chooseInstructions", label: "CHOOSE INSTRUCTIONS" },
    // { name: "qpCode", label: "QP CODE" },
    // { name: "suffleQuestion", label: "SHUFFLE QUESTION" },
    // { name: "optionRandom", label: "OPTION RANDOM" },
    // { name: "markForReview", label: "MARK FOR REVIEW" },
    // { name: "questionNavigation", label: "QUESTION NAVIGATION" },
    // { name: "paginationStatus", label: "PAGINATION STATUS" },
    // { name: "examLanguageConduct", label: "EXAM LANGUAGE CONDUCT" },
    // { name: "primaryLanguage", label: "PRIMARY LANGUAGE" },
    // { name: "secondaryLanguage", label: "SECONDARY LANGUAGE" },
    // { name: "questionSet", label: "QUESTION SET" },
    // { name: "assesmentStatus", label: "ASSESMENT STATUS" },
    // { name: "level", label: "LEVEL" },
    // { name: "questionType", label: "QUESTION TYPE" },
    // { name: "status", label: "STATUS" },
    // { name: "imageProctorStatus", label: "IMAGE PROCTOR STATUS" },
    // { name: "imageProctoringTime", label: "IMAGE PROCTORING TIME" },
    // { name: "videoStreaming", label: "VIDEO STREAMING" },
    // { name: "videoDuration", label: "VIDEO DURATION" },
    // { name: "videoInterval", label: "VIDEO INTERVAL" },
    // { name: "wrongLoginStatus", label: "WRONG LOGIN STATUS" },
    // { name: "noOfWrongLogin", label: "NO OF WRONG LOGIN" },
    // { name: "browserExitAlert", label: "BROWSER EXIT ALERT" },
    // { name: "noOfBrowserExit", label: "NO OF BROWSER EXIT" },
    // { name: "faceRecognition", label: "FACE RECOGNITION" },
    // { name: "faceDetection", label: "FACE DETECTION" },
    // {
    //   name: "videoScreensharingProctoringStatus",
    //   label: "VIDEO SCREENSHARING PROCTORING STATUS",
    // },
    // { name: "capturingImageStatus", label: "CAPTURING IMAGE STATUS" },
    // { name: "identityProofStatus", label: "IDENTITY PROOF STATUS" },
    // Add more fields as needed
  ];

  return columns;
};
