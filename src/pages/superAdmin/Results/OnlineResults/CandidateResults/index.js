import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import {
  SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW,
  SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "../../../../../assets/icons/search-icon-grey.svg";
import { Button, InputAdornment, TextField } from "@mui/material";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../../components/common/DropDown";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import {
  changeSingleQbFormStatusApi,
  deleteSingleQbFormApi,
  getNOSListVivaPracticalApi,
  getAllNosListApi,
} from "../../../../../api/superAdminApi/questionBank";
import FilterModal from "../../../../../components/common/Modal/FilterModal";
import validateField from "../../../../../utils/validateField";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";
import {
  getCandidatesResultsByBatchApi,
  getResultsByBatchApi,
} from "../../../../../api/superAdminApi/misResults";
import { misResultsSelector } from "../../../../../redux/slicers/superAdmin/misResults";
import { CANDIDATE_RESULTS_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import { ReactComponent as ArrowLeft } from "./../../../../../assets/icons/chevron-left.svg";

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
  const [limit, setLimit] = useState(10);
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

  // tabs
  const [candidateTable, setCandidateTable] = useState(true);
  const { userInfo = {} } = useSelector(authSelector);
  const { candidatesResults = [] } = useSelector(misResultsSelector);

  // permission
  const { RESULTS_FEATURE, RESULTS_SUB_FEATURE_1 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = RESULTS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = RESULTS_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const params = useParams();

  const getList = () => {
    // dispatch(
    //   getAllNosListApi(
    //     setLoading,
    //     page,
    //     searchQuery,
    //     limit,
    //     setTotalPages,
    //     section
    //   )
    // );
    // dispatch(getResultsByBatchApi(setLoading));
    dispatch(getCandidatesResultsByBatchApi(setLoading, params.id));
  };

  useEffect(() => {
    setLoading(true);
    getList();
  }, [page, limit, section]);

  useEffect(() => {
    setSortedData(candidatesResults.length > 0 ? candidatesResults : []);
    setTotalPagesUser(totalPages);
  }, [candidatesResults, totalPages]);

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
    // dispatch(changeSingleQbFormStatusApi(setLoading, formData, getList));
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
        getAllNosListApi(setLoading, page, searchQuery, limit, setTotalPages)
      );
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setLoading(true);
      dispatch(getAllNosListApi(setLoading, page, "", limit, setTotalPages));
    }
    setSearchQuery(value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };
  const exportClientData = () => {
    const exportData = candidatesResults?.map((item) => {
      return {
        clientName: item?.clientName,
        jobRole: item?.jobRole,
        qpCode: item?.qpCode,
        jobLevel: item?.jobLevel,
        nosName: item?.nos,
        version: item?.version,
        status: item?.status,
      };
    });
    return exportData;
  };
  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportClientData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Question Form List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Online Result.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = candidatesResults?.length;
    dispatch(
      deleteSingleQbFormApi(setLoading, actionId, len, getList, setDeleteModal)
    );
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
    // navigate(`${SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE}/${actionId}`);
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

  return (
    <div className="main-content">
      <div className="title">
        <div className="back_button_wrapper">
          <ArrowLeft onClick={() => navigate(-1)} />
          <h1>Candidate Results</h1>
        </div>
      </div>

      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search"
              value={searchQuery}
              style={{ background: "#F8F8F8", padding: "2px" }}
              onChange={handleChange}
              onPaste={(e)=> handleTrimPaste(e, setSearchQuery)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "#231F20", width: 15 }} />
                  </InputAdornment>
                ),
              }}
            />
            {/* <p>{candidateTable ? "Candidate Results" : "NOS Wise Results"}</p> */}
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
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>{item?.jobRole || "NA"}</td>
                      <td>{item?.name || "NA"}</td>
                      <td>{item?.examDate || "NA"}</td>
                      <td>
                        {item?.totalMarks === 0
                          ? "0"
                          : item?.totalMarks || "NA"}
                      </td>
                      <td>{item?.obtainedMarks || "NA"}</td>
                      <td>{item?.passingPercentage + "%" || "NA"}</td>
                      <td>
                        {Math.round(item?.percentageScored) + "%" || "NA"}
                      </td>
                      <td>{item?.result || "NA"}</td>
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
    { name: "jobRole", label: "Job Role" },
    { name: "name", label: "Name" },
    { name: "examDate", label: "Exam Date" },
    { name: "totalMarks", label: "Total Marks" },
    { name: "obtainMarks", label: "Obtain Marks" },
    { name: "passingPercentage", label: "Passing %" },
    { name: "scoredPercentage", label: "Scored %" },
    { name: "Reprocessed", label: "processed" },
    { name: "resultDetails", label: "Result Stats" },
  ];
  return columns;
};
