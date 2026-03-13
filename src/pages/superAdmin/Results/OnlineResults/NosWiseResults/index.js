import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import {
  NOS_WISE_RESULTS_MAIN_TABLE,
  ONLINE_RESULTS_TAB_PAGE,
  SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader } from "react-spinners";
import { Button, InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import {
  deleteSingleQbFormApi,
  getAllNosListApi,
} from "../../../../../api/superAdminApi/questionBank";
import validateField from "../../../../../utils/validateField";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";
import {
  getCandidatesResultsByBatchApi,
  getMasterDownloadSheetApi,
  getNOSWiseResultApi,
  getOnlineResultDownloadSheetApiWithCandidateData,
} from "../../../../../api/superAdminApi/misResults";
import {
  getCandidatesResult,
  getNOSWiseResultsList,
  misResultsSelector,
} from "../../../../../redux/slicers/superAdmin/misResults";
import { ReactComponent as ArrowLeft } from "./../../../../../assets/icons/chevron-left.svg";
import { ReactComponent as SearchIcon } from "../../../../../assets/icons/search-icon-grey.svg";
import { useMediaQuery } from 'react-responsive';
import { formatToTwoDecimals } from "../../../../../utils/formatToTwoDecimals";

const UserManagementList = () => {
  const initialFormValues = {
    F_status: "",
    from: "",
    to: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [section, setSection] = useState();
  const [exportLoading, setExportLoading] = useState(false);

  // tabs
  const [candidateTable, setCandidateTable] = useState(true);
  const { userInfo = {} } = useSelector(authSelector);
  const { candidatesResults = {}, NOSWiseResults = [] } =
    useSelector(misResultsSelector);
  const { candiateReport, sectionTable, batch } = candidatesResults;


  // permission
  const { RESULTS_FEATURE, RESULTS_SUB_FEATURE_1 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = RESULTS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = RESULTS_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const params = useParams();

  const getList = () => {
    dispatch(getCandidatesResult([]));
    dispatch(
      getCandidatesResultsByBatchApi(
        setLoading,
        params.id,
        page,
        searchQuery,
        limit,
        setTotalPages
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    getList();
  }, [page, limit, section, params.id]);

  useEffect(() => {
    setSortedData(candiateReport?.length > 0 ? candiateReport : []);
    setTotalPagesUser(totalPages);
  }, [candidatesResults, totalPages]);

  const sectionWiseData = candidatesResults.batch?.questionPaper?.sectionTable?.reduce((acc, section) => {
    acc[section.sectionName] = {
      sectionName: section.sectionName,
      isSelected: section.isSelected,
      _id: section._id,
    };
    return acc;
  }, {});

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...candidatesResults].sort((a, b) => {
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
  }, [candidatesResults, sortOrders]);

  const handleStatusChange = (e, qbFormId) => {
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(qbFormId);
    const formData = {
      status: value,
      question_bank_id: qbFormId,
    };
  };

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "") {
      setLoading(true);
      dispatch(
        getCandidatesResultsByBatchApi(
          setLoading,
          params.id,
          page,
          searchQuery,
          limit,
          setTotalPages
        )
      );
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setLoading(true);
      dispatch(
        getCandidatesResultsByBatchApi(
          setLoading,
          params.id,
          page,
          "",
          limit,
          setTotalPages
        )
      );
    }
    setSearchQuery(value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };

  const exportClientData = () => {
    const exportData = candidatesResults?.candiateReport?.map((item) => {
      return {
        username: item?.userName,
        name: item?.name,
        candidateID: item?.candidateId,
        dob: item?.dob,
        gender: item?.gender,
        aadharNo: item?.aadharNo,
        mobile: item?.mobile,
        email: item?.email,
        obtainedTotalTheoryMarks: item?.obtainedTotalTheoryMarks,
        obtainedTotalPracticalMarks: item?.obtainedTotalPracticalMarks,
        obtainedTotalVivaMarks: item?.obtainedTotalVivaMarks,
        obtainedGrandTotalMarks:
          item?.obtainedGrandTotalMarks + "/" + item?.totalTheoryMarks,
        percentage: item?.percentage,
        grade: item?.grade,
        result: item?.result,
      };
    });
    console.log("exportData", exportData);
    return exportData;
  };

  const handleExport = () => {
    try {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(
        exportData(exportClientData(), getColumns())
      );

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `${candidatesResults?.candiateReport[0]?.batchId || "Batch"}.xlsx`
      );

      // Convert the workbook to an array buffer
      const buffer = XLSX.write(workbook, { type: "array" });

      // Create a blob with the array buffer and trigger a download
      const blob = new Blob([buffer], { type: "application/octet-stream" });

      candidatesResults?.candiateReport?.length > 0 &&
        saveAs(
          blob,
          `${candidatesResults?.candiateReport[0]?.batchId || "Batch"
          } Results.xlsx`
        );
    } catch (error) {
      console.log("Error", error.message);
    }
    // Create a new workbook and worksheet
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = candidatesResults?.length;
    // dispatch(
    //   deleteSingleQbFormApi(setLoading, actionId, len, getList, setDeleteModal)
    // );
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const editBtnHandler = () => {
    setShowActionBtn(false);
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
  const handleClose = () => {
    setIsFilterOpen(false);
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
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const from = formValues?.from;
      const to = formValues?.to;
      const status = formValues?.F_status;
      handleClose();
    }
  };
  const handleClearAll = () => {
    setFormValues(initialFormValues);
  };

  const handleSection = (data) => {
    setCandidateTable(!candidateTable);
    setSection(data);
  };

  const handleDownloadAllData = () => {
    setExportLoading(true);
    dispatch(
      getMasterDownloadSheetApi(
        setExportLoading,
        params.id,
        "online",
        batch?.batchId,
        batch?.questionPaper?.isMultiJobRole
      )
    );
  };

  const handleDownloadCandidateDataWithResult = () => {
    let batchName = "";
    if (candidatesResults?.candiateReport?.length) {
      batchName = candidatesResults.candiateReport?.[0]?.batchId ?? "Batch";
    } else {
      batchName = candidatesResults.batchName;
    }
    dispatch(
      getOnlineResultDownloadSheetApiWithCandidateData(
        setExportLoading,
        params.id,
        batchName
      )
    );
  };

  const MAX_LENGTH_FOR_TOOLTIP = 13;

  const MarksCell = ({ item }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });

    console.log("isMobileOrTablet", isMobileOrTablet);

    const tooltipContent = (
      <div>
        {item?.distributedMarks?.map((jobRole, jobIndex) => (
          <div key={jobIndex} style={{ marginBottom: "16px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              {jobRole?.jobRoleName}: {jobRole?.obtainedTheoryMarks}/{jobRole?.totalTheoryMarks}
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <Tooltip
        title={tooltipContent}
        arrow
        trigger={!isMobileOrTablet ? 'click' : 'hover'}
        open={!isMobileOrTablet ? isTooltipVisible : undefined}
        onOpenChange={(visible) => !isMobileOrTablet && setIsTooltipVisible(visible)}
        overlayStyle={{ maxWidth: '300px' }}
      >
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => !isMobileOrTablet && setIsTooltipVisible(!isTooltipVisible)}
        >
          {`${item?.obtainedTotalTheoryMarks}/${item?.totalTheoryMarks}`}
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="main-content">
      <div className="title">
        <div className="back_button_wrapper">
          <ArrowLeft onClick={() => navigate(ONLINE_RESULTS_TAB_PAGE)} />
          <h1>Results</h1>
        </div>
      </div>

      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search by Name"
              value={searchQuery}
              style={{ background: "#F8F8F8", padding: "2px" }}
              onChange={handleChange}
              onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
              onKeyDown={handleKeyDown}
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
            <div className="single_export_wrapper">
              {isRolePermission?.permissions?.["5"] && (
                <>
                  <button
                    className="export-btn"
                    // onClick={
                    //   loading || sortedData?.length == 0
                    //     ? undefined
                    //     : handleExport
                    // }
                    onClick={() => {
                      if (loading) {
                        return;
                      }
                      // handleDownloadCandidateDataWithResult(
                      //   sortedData[0].batchId
                      // );
                      handleDownloadCandidateDataWithResult();
                    }}
                  >
                    {loading ? (
                      <ClipLoader size={14} color="#24273" />
                    ) : (
                      "Export"
                    )}
                  </button>

                  <button
                    className="export-btn"
                    onClick={() => handleDownloadAllData()}
                  >
                    {exportLoading ? (
                      <ClipLoader size={14} color="#24273" />
                    ) : (
                      "Master Export"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="table-wrapper">
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
                  sortedData?.map((item, index) => (
                    <tr key={item?._id} className="main_row">
                      <td >{(page - 1) * limit + (index + 1)}</td>
                      <td>
                        {item?.userName?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.userName || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.userName || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.userName || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.name?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.name || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.name || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.name || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.candidateId?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.candidateId || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.candidateId || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.candidateId || "-"}</div>
                        )}
                      </td>

                      <td>
                        {item?.fatherName?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.fatherName || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.fatherName || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.fatherName || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.dob?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.dob || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.dob || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.dob || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.gender?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.gender || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.gender || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.gender || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.aadharNo?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.aadharNo || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.aadharNo || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.aadharNo || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.mobile?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.mobile || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.mobile || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.mobile || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.email?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.email || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.email || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.email || "-"}</div>
                        )}
                      </td>
                      <td>
                        {sectionWiseData?.theory?.sectionName === "theory" &&
                          sectionWiseData?.theory?.isSelected ? (
                          item?.obtainedTotalTheoryMarks && item?.totalTheoryMarks ? (
                            item?.distributedMarks?.length > 0 ? (
                              <Tooltip
                                title={
                                  <div>
                                    {item?.distributedMarks?.map((jobRole, jobIndex) => (
                                      <div key={jobIndex} style={{ marginBottom: "16px" }}>
                                        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                                          {jobRole?.jobRoleName}: {jobRole?.obtainedTheoryMarks}/{jobRole?.totalTheoryMarks}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                }
                                arrow
                              >
                                <div>{`${item?.obtainedTotalTheoryMarks}/${item?.totalTheoryMarks}`}</div>
                              </Tooltip>
                            ) : (
                              <div>{`${item?.obtainedTotalTheoryMarks}/${item?.totalTheoryMarks}`}</div>
                            )
                          ) : (
                            "-"
                          )
                        ) : (
                          "NA"
                        )}
                      </td>
                      <td>
                        {sectionWiseData?.practical?.sectionName === "practical" &&
                          sectionWiseData?.practical?.isSelected ? (
                          item?.obtainedTotalPracticalMarks && item?.totalPracticalMarks ? (
                            item?.distributedMarks?.length > 0 ? (
                              <Tooltip
                                title={
                                  <div>
                                    {item?.distributedMarks?.map((jobRole, jobIndex) => (
                                      <div key={jobIndex} style={{ marginBottom: "16px" }}>
                                        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                                          {jobRole?.jobRoleName}: {jobRole?.obtainedPracticalMarks}/{jobRole?.totalPracticalMarks}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                }
                                arrow
                              >
                                <div>{`${item?.obtainedTotalPracticalMarks}/${item?.totalPracticalMarks}`}</div>
                              </Tooltip>
                            ) : (
                              <div>{`${item?.obtainedTotalPracticalMarks}/${item?.totalPracticalMarks}`}</div>
                            )
                          ) : (
                            "-"
                          )
                        ) : (
                          "NA"
                        )}
                      </td>
                      <td>
                        {sectionWiseData?.viva?.sectionName === "viva" &&
                          sectionWiseData?.viva?.isSelected ? (
                          item?.obtainedTotalVivaMarks && item?.totalVivaMarks ? (
                            item?.distributedMarks?.length > 0 ? (
                              <Tooltip
                                title={
                                  <div>
                                    {item?.distributedMarks?.map((jobRole, jobIndex) => (
                                      <div key={jobIndex} style={{ marginBottom: "16px" }}>
                                        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                                          {jobRole?.jobRoleName}: {jobRole?.obtainedVivaMarks}/{jobRole?.totalVivaMarks}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                }
                                arrow
                              >
                                <div>{`${item?.obtainedTotalVivaMarks}/${item?.totalVivaMarks}`}</div>
                              </Tooltip>
                            ) : (
                              <div>{`${item?.obtainedTotalVivaMarks}/${item?.totalVivaMarks}`}</div>
                            )
                          ) : (
                            "-"
                          )
                        ) : (
                          "NA"
                        )}
                      </td>
                      <td>
                        {item?.obtainedGrandTotalMarks && item?.grandTotalMarks ? (
                          item?.distributedMarks?.length > 0 ? (
                            <Tooltip
                              title={
                                <div>
                                  {item?.distributedMarks?.map((jobRole, jobIndex) => (
                                    <div key={jobIndex} style={{ marginBottom: "16px" }}>
                                      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                                        {jobRole?.jobRoleName}: {formatToTwoDecimals(jobRole?.obtainedTheoryMarks + jobRole?.obtainedPracticalMarks + jobRole?.obtainedVivaMarks)}/
                                        {jobRole?.totalTheoryMarks + jobRole?.totalPracticalMarks + jobRole?.totalVivaMarks}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              }
                              arrow
                            >
                              <div>
                                {item?.obtainedGrandTotalMarks + "/" + item?.grandTotalMarks}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>
                              {item?.obtainedGrandTotalMarks + "/" + item?.grandTotalMarks}
                            </div>
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {item?.percentage ? (
                          item?.distributedMarks?.length > 0 ? (
                            <Tooltip
                              title={
                                <div>
                                  {item?.distributedMarks?.map((jobRole, jobIndex) => (
                                    <div key={jobIndex} style={{ marginBottom: "16px" }}>
                                      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                                        {jobRole?.jobRoleName}: {((jobRole?.obtainedTheoryMarks + jobRole?.obtainedPracticalMarks + jobRole?.obtainedVivaMarks) /
                                          (jobRole?.totalTheoryMarks + jobRole?.totalPracticalMarks + jobRole?.totalVivaMarks) * 100).toFixed(2)}%
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              }
                              arrow
                            >
                              <div>{item?.percentage}</div>
                            </Tooltip>
                          ) : (
                            <div>{item?.percentage || "-"}</div>
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                      <td
                        style={{
                          color: [
                            item?.result === "Fail"
                              ? "red"
                              : item?.result === "Pass"
                                ? "#026e00"
                                : "",
                          ],
                        }}
                      >
                        {item?.result ? (
                          item?.distributedMarks?.length > 0 ? (
                            <Tooltip
                              title={
                                <div>
                                  {item?.distributedMarks?.map((jobRole, jobIndex) => (
                                    <div key={jobIndex} style={{ marginBottom: "16px" }}>
                                      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                                        {jobRole?.jobRoleName}: {((jobRole?.obtainedTheoryMarks + jobRole?.obtainedPracticalMarks + jobRole?.obtainedVivaMarks) /
                                          (jobRole?.totalTheoryMarks + jobRole?.totalPracticalMarks + jobRole?.totalVivaMarks) * 100) >= 70 ? "Pass" : "Fail"}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              }
                              arrow
                            >
                              <div
                                className="result_wrapper"
                                style={{
                                  background: [
                                    item?.result === "Fail"
                                      ? "#EDE0D4"
                                      : item?.result === "Pass"
                                        ? "#EFFDEE"
                                        : "",
                                  ],
                                }}
                              >
                                {item?.result}
                              </div>
                            </Tooltip>
                          ) : (
                            <div
                              className="result_wrapper"
                              style={{
                                background: [
                                  item?.result === "Fail"
                                    ? "#EDE0D4"
                                    : item?.result === "Pass"
                                      ? "#EFFDEE"
                                      : "",
                                ],
                              }}
                            >
                              {item?.result || "-"}
                            </div>
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {
                          <Button
                            sx={{
                              textTransform: "none",
                            }}
                            onClick={(e) =>
                              navigate(
                                `${NOS_WISE_RESULTS_MAIN_TABLE}/${params?.id}/${item?._id}`
                              )
                            }
                          >
                            View Details
                          </Button>
                        }
                      </td>
                      <td>
                        {
                          <Button
                            sx={{
                              textTransform: "none",
                            }}
                            onClick={(e) =>
                              navigate(
                                `${SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW}/${params.id}/${item?._id}`
                              )
                            }
                          >
                            View Details
                          </Button>
                        }
                      </td>
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
      <DeleteModal
        title="Delete Question Bank Form"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      <div
        style={{
          display: [totalPages > 0 ? "" : "none"],
        }}
      >
        <CustomTablePagination
          count={totalPagesUser}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default UserManagementList;

const getColumns = () => {
  let columns = [
    { name: "_id", label: "S.No." },
    { name: "username", label: "Username" },
    { name: "name", label: "Name" },
    { name: "candidateID", label: "Candidate ID (SIP)" },
    { name: "fatherName", label: "Father Name" },
    { name: "dob", label: "DOB" },
    { name: "gender", label: "Gender" },
    { name: "aadharNo", label: "Aadhar No" },
    { name: "mobile", label: "Mobile No" },
    { name: "email", label: "Email ID" },
    { name: "obtainedTotalTheoryMarks", label: "Theory Marks" },
    { name: "obtainedTotalPracticalMarks", label: "Practical Marks" },
    { name: "obtainedTotalVivaMarks", label: "Viva Marks" },
    { name: "obtainedGrandTotalMarks", label: "Total Marks" },
    { name: "percentage", label: "Percentage" },
    // { name: "grade", label: "Grade" },
    { name: "result", label: "Result" },
    { name: "NOS", label: "Results" },
    { name: "portal", label: "Portal Stats" },
  ];
  return columns;
};
