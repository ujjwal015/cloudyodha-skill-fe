import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../NOS/style.css";
import { ReactComponent as PlusIcon } from "../../../../../assets/images/pages/clientManagement/plus-icon.svg";
import { ReactComponent as DeleteIcon } from "../../../../../assets/icons/delete-icon.svg";

import {
  SUPER_ADMIN_CREATE_QUESTION_FORM_PAGE,
  SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE,
  SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
  SUPER_ADMIN_VIEW_QUESTIONS_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { FormSwitch } from "../../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "../../../../../assets/icons/search-icon-grey.svg";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  ALPHABETIC_SORT,
  ExamConductLanguages,
  capitalizeFirstLetter,
  exportData,
  getLocal,
  getSubRole,
  handleTrimPaste,
  storeLocal,
  userRoleType,
} from "../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../../components/common/DropDown";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { qbManagementSelector } from "../../../../../redux/slicers/superAdmin/questionBankSlice";
import {
  getQuestionFormListApi,
  changeSingleQbFormStatusApi,
  deleteSingleQbFormApi,
  getAllJobRoleforBatchApi,
} from "../../../../../api/superAdminApi/questionBank";
import FilterModal from "../../../../../components/common/Modal/FilterModal";
import AddNewBtn from "../../../../../components/addNewBtn";
import validateField from "../../../../../utils/validateField";
import {
  ROLESPERMISSIONS,
  SECTIONS2,
} from "../../../../../config/constants/projectConstant";
import { clientManagementSelector } from "../../../../../redux/slicers/superAdmin/clientManagement";
import { getAssignedClientManagementListsApi } from "../../../../../api/superAdminApi/clientManagement";
import moment from "moment";

const UserManagementList = () => {
  const initialFormValues = {
    section: "",
    clientId: "",
    jobRole: "",
    language: "",
    customFilter: false,
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchMatch = location?.search.match(/(?<=search=)[^&]*/);
  const search1 = searchMatch ? searchMatch[0] : "";
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const selectedClient = getLocal("SelectedClient");
  const [id, setId] = useState("");
  const qbSearch = localStorage?.getItem("qbSearch");
  const [searchQuery, setSearchQuery] = useState(
    qbSearch?.replace(/^"|"$/g, "") || search1
  );
  const { qbFormList = [], jobRoleListForFilter = [] } =
    useSelector(qbManagementSelector);
  const { clientManagementLists = [] } = useSelector(clientManagementSelector);
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
  const { userInfo = {} } = useSelector(authSelector);
  const params = useParams();
  const [isFilerApplied, setIsFilterApplied] = useState(false);

  // permission
  const { QUESTION_BANK_FEATURE, QUESTION_BANK_SUB_FEATURE_1 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = QUESTION_BANK_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = QUESTION_BANK_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const [section, setSection] = useState(
    localStorage.getItem("selectedSection") || "All"
  );
  const [jobRolesFilter, setJobRolesFilter] = useState([]);


  useEffect(() => {
    return window.localStorage.removeItem("primaryQuestionBank");
  }, []);

 

  useEffect(() => {
    setSearchQuery(selectedClient);
  }, [selectedClient]);



  useEffect(() => {
    setSection(
      params?.section ?? localStorage.getItem("selectedSection") ?? "All"
    );
  }, [params?.section]);

  const getList = () => {
    setLoading(true);
    dispatch(
      getQuestionFormListApi(
        setLoading,
        page,
        searchQuery,
        limit,
        setTotalPages,
        section,
        formValues?.language,
        formValues?.jobRole,
        formValues?.clientId,
        formValues?.customFilter,
        setIsFilterApplied,
        setFormValues
      )
    );
  };

  const updateFilters = (newFilters) => {
    localStorage.setItem("qbFilter", JSON.stringify(newFilters));
    setFormValues(newFilters);
  };

  const clearFilters = () => {
    localStorage.removeItem("qbFilter");
    setFormValues(initialFormValues);
  };

  useEffect(() => {
    setSortedData(qbFormList);
    setTotalPagesUser(totalPages);
  }, [qbFormList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...qbFormList].sort((a, b) => {
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
  }, [qbFormList, sortOrders]);

  const getQbFilterList = () => {
    if (!formValues?.clientId) {
      dispatch(
        getAssignedClientManagementListsApi(setLoading, Infinity, Infinity)
      );
    }

    if (formValues?.clientId) {
      dispatch(
        getAllJobRoleforBatchApi(
          setLoading,
          formValues?.clientId,
          setFormValues
        )
      );
    } else {
      dispatch(getAllJobRoleforBatchApi(setLoading));
    }
  };

  useEffect(() => {
    getQbFilterList();
  }, [formValues?.clientId]);

  useEffect(() => {
    getList();
  }, [page, limit, section, formValues?.language]);

  const handleStatusChange = (e, qbFormId) => {
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(qbFormId);
    const formData = {
      status: value,
      question_bank_id: qbFormId,
    };
    dispatch(changeSingleQbFormStatusApi(setLoading, formData, getList));
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
      localStorage.setItem("qbSearch", JSON.stringify(searchQuery));
      setLoading(true);
      dispatch(
        getQuestionFormListApi(
          setLoading,
          page,
          searchQuery,
          limit,
          setTotalPages,
          section,
          formValues?.language,
          formValues?.jobRole,
          formValues?.clientId,
          formValues?.customFilter,
          setIsFilterApplied,
          setFormValues
        )
      );
    } else {
      if (!searchQuery) {
        localStorage.removeItem("qbSearch");
      }
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setLoading(true);
      dispatch(
        getQuestionFormListApi(
          setLoading,
          page,
          "",
          limit,
          setTotalPages,
          section,
          formValues?.language,
          formValues?.jobRole,
          formValues?.clientId,
          formValues?.customFilter,
          setIsFilterApplied,
          setFormValues
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
    const exportData = qbFormList?.map((item) => {
      return {
        qbId: item?.questionBankautoId,
        jobRole: item?.jobRole,
        clientname: item?.clientId?.clientname,
        nosName: item?.nos,
        qpCode: item?.qpCode,
        questionType: item?.questionType,
        section: item?.section,
        language: item?.language,
        NoOfQuestion: item?.questionCount,
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
    saveAs(blob, "QbForm List.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = qbFormList?.length;
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
    navigate(`${SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE}/${actionId}`);
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
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      formValues.customFilter = true;
      updateFilters(formValues);
      getList();
      handleClose();
    }
  };
  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const handleClearAll = () => {
    setFormValues(initialFormValues);
    clearFilters();
    setLoading(true);
    dispatch(
      getQuestionFormListApi(setLoading, 1, "", 50, setTotalPages, section)
    );
    handleCloseFilter();
    setIsFilterApplied(false);
  };
  const handleQuestion = (questionBankId) => {
    setId(questionBankId);
  };

  const MAX_LENGTH_FOR_TOOLTIP = 10;

  const handleSection = (data) => {
    setSection(data);
    localStorage.setItem("selectedSection", data);
    let url = `${SUPER_ADMIN_QUESTION_FORM_LIST_PAGE}/${data}`;
    if (searchQuery) {
      navigate(`${url}?search=${searchQuery}`);
    } else navigate(url);
  };

  // useEffect(() => {
  //   const storedSection = localStorage.getItem("selectedSection");
  //   if (storedSection && storedSection !== section) {
  //     setSection(storedSection);
  //   }
  // }, []);

  useEffect(() => {
    let url = `${SUPER_ADMIN_QUESTION_FORM_LIST_PAGE}/${section}`;
    if (searchQuery) {
      navigate(`${url}?search=${searchQuery}`);
    } else {
      navigate(url);
    }
  }, [searchQuery]);

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
      value: item?._id,
    };
  });

  useEffect(() => {
    if (jobRoleListForFilter.length > 0) {
      const JOB_ROLES = jobRoleListForFilter?.map((item) => {
        return {
          label: item?.jobRole,
          value: item?.jobRoleName,
        };
      });
      setJobRolesFilter([...JOB_ROLES]);
    } else {
      setJobRolesFilter([]);
    }
  }, [jobRoleListForFilter]);

  useEffect(() => {
    const getData = setTimeout(() => {
      handleSearchSubmit();
    }, 500);

    return () => clearTimeout(getData);
  }, [searchQuery]);

  return (
    <div className="main-content">
      <div className="title" style={{ display: "block" }}>
        <h1>Question Bank List</h1>
        <div className="title-btn" style={{ paddingTop: "10px" }}>
          <div className="sub_sections">
            <button
              onClick={() => handleSection("All")}
              style={{
                cursor: "pointer",
                background: [section != "All" ? "white" : ""],
                color: [section != "All" ? "#00b2ff" : ""],
                border: [section != "All" ? "1px solid #00b2ff" : ""],
              }}
            >
              <span>All</span>
            </button>
            <button
              onClick={() => handleSection("Theory")}
              style={{
                cursor: "pointer",
                background: [section != "Theory" ? "white" : ""],
                color: [section != "Theory" ? "#00b2ff" : ""],
                border: [section != "Theory" ? "1px solid #00b2ff" : ""],
              }}
            >
              <span>Theory</span>
            </button>
            <button
              onClick={() => handleSection("viva")}
              style={{
                cursor: "pointer",
                background: [section != "viva" ? "white" : ""],
                color: [section != "viva" ? "#00b2ff" : ""],
                border: [section != "viva" ? "1px solid #00b2ff" : ""],
              }}
            >
              <span>Viva</span>
            </button>
            <button
              onClick={() => handleSection("practical")}
              style={{
                cursor: "pointer",
                background: [section != "practical" ? "white" : ""],
                color: [section != "practical" ? "#00b2ff" : ""],
                border: [section != "practical" ? "1px solid #00b2ff" : ""],
              }}
            >
              <span>Practical</span>
            </button>
          </div>
          {
            <AddNewBtn
              btnText={"Add New"}
              Icon={PlusIcon}
              route={SUPER_ADMIN_CREATE_QUESTION_FORM_PAGE}
              showBtn={isRolePermission?.permissions?.["2"]}
            />
          }
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
            <button
              className="filter-btn clear_all_btn"
              onClick={handleClearAll}
              style={{
                display: [
                  isFilerApplied || formValues?.customFilter ? "" : "none",
                ],
              }}
            >
              Clear Filter
            </button>
            <FilterModal
              handleClose={handleClose}
              focusHandler={focusHandler}
              blurHandler={blurHandler}
              changeHandler={changeHandler}
              formValues={formValues}
              setFormValues={setFormValues}
              handleClearAll={handleClearAll}
              handleSubmit={handleSubmit}
              initialFormValues={initialFormValues}
              formValue={formValues}
              setIsFilterOpen={false}
              showQuestionBankFilter={true}
              batchClientName={ALPHABETIC_SORT(CLIENT_NAMES)}
              batchJobRole={ALPHABETIC_SORT(jobRolesFilter)}
              sections={SECTIONS2}
              languageOptions={ExamConductLanguages}
            />

            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={
                  loading || sortedData?.length === 0 ? undefined : handleExport
                }
              >
                {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
              </button>
            )}
          </div>
        </div>
        <div className="table-wrapper">
          {/* {storequery?.language && (
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
                Primary Language Question Bank
              </p>
              <DeleteIcon
                style={{ height: "1rem", width: "1rem", marginLeft: "10px" }}
                onClick={handleFilterRemove}
              />
            </div>
          )} */}
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
                    <tr key={item?._id}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>{item?.questionBankautoId}</td>
                      <td>
                        {item?.clientId?.clientname.length > 10 ? (
                          <Tooltip
                            title={item?.clientId?.clientname || "NA"}
                            arrow
                          >
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "130px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.clientId?.clientname || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.clientId?.clientname || "-"}</div>
                        )}
                      </td>
                      {/* <td>{item?.clientId?.clientname || "-"}</td> */}
                      <td>
                        {item?.jobRole?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.jobRole || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.jobRole || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.jobRole || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.nos.length > 10 ? (
                          <Tooltip title={item?.nos || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "130px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.nos || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.nos || "NA"}</div>
                        )}
                      </td>
                      <td>{item?.jobLevel || "NA"}</td>
                      <td>{item?.version || "NA"}</td>
                      <td>{item?.qpCode || "NA"}</td>
                      <td>
                        {capitalizeFirstLetter(item?.questionType) || "NA"}
                      </td>
                      <td>{capitalizeFirstLetter(item?.section) || "NA"}</td>
                      <td>
                        {item?.secondaryLanguage
                          ? capitalizeFirstLetter(item?.language) + "\u2705"
                          : capitalizeFirstLetter(item?.language)}
                      </td>
                      <td className="view_question_wrapper">
                        <span
                          className="view_questions_btn"
                          onClick={() => {
                            navigate(
                              `${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${item?._id}/${item?.section}`,
                              { state: { from: "questionFormList" } }
                            );
                          }}
                        >
                          {item?.questionCount}
                        </span>
                      </td>
                      <td>{moment(item?.createdAt).format("LLL")}</td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td>
                          {statusLoading && id === item._id ? (
                            <PulseLoader size="10px" color="#0bbbfe" />
                          ) : (
                            <FormSwitch
                              value={item.status === "active" ? true : false}
                              onChange={(e) => handleStatusChange(e, item?._id)}
                            />
                          )}
                        </td>
                      )}
                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
                        <td>
                          <div>
                            <ActionDropdown
                              actionOpen={actionOpen}
                              setActionOpen={setActionOpen}
                              deleteHandler={deleteHandler}
                              editBtnHandler={editBtnHandler}
                              MoreBtnHandler={MoreBtnHandler}
                              id={item?._id}
                              actionId={actionId}
                              featureName={featureName}
                              subFeatureName={subFeatureName}
                              showDelete={
                                item?.status !== "active" ? true : false
                              }
                            />
                          </div>
                        </td>
                      ) : null}
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

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "Sr.No." },
    { name: "qbId", label: "Question Bank Id" },
    { name: "clientname", label: "Client Name" },
    { name: "jobRole", label: "Job Role" },
    { name: "nosName", label: "Nos Name" },
    { name: "jobLevel", label: "Level" },
    { name: "version", label: "Version" },
    { name: "qpCode", label: "QP Code" },
    { name: "questionType", label: "Question Type" },
    { name: "section", label: "Section" },
    { name: "language", label: "Language" },
    { name: "NoOfQuestion", label: "Total Questions" },
    { name: "createdOn", label: "Created On" },
    { name: "status", label: "Status" },
    { name: "actions", label: "Actions" },
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
