import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  QUESTION_BANK_NOS,
  QUESTION_BANK_NOS_TABLE,
  QUESTION_BANK_NOS_UPLOAD,
  SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../components/common/table";
import { FormSwitch } from "../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "../../../../assets/icons/search-icon-grey.svg";
import { Button, InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../components/common/DropDown";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { qbManagementSelector } from "../../../../redux/slicers/superAdmin/questionBankSlice";
import {
  getQuestionFormListApi,
  changeSingleQbFormStatusApi,
  deleteSingleQbFormApi,
  getNOSListVivaPracticalApi,
  getAllNosListApi,
  deleteNOSApi,
  changeStatusNOSApi,
} from "../../../../api/superAdminApi/questionBank";
import FilterModal from "../../../../components/common/Modal/FilterModal";
import validateField from "../../../../utils/validateField";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import moment from "moment";

const UserManagementList = () => {
  const initialFormValues = {
    F_status: "",
    from: "",
    to: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const sectionMatch = location?.search.match(/(?<=section=)[^&]*/);
  const section1 = sectionMatch ? sectionMatch[0] : '';
  
  const searchMatch = location?.search.match(/(?<=search=)[^&]*/);
  const search1 = searchMatch ? searchMatch[0] : '';


  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState(search1);
  const { nosList } = useSelector(qbManagementSelector);

  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionBtn, setActionBtn] = useState(null);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { userInfo = {} } = useSelector(authSelector);
  const [section, setSection] = useState(section1 || "All");

  // permission
  const { QUESTION_BANK_FEATURE, QUESTION_BANK_SUB_FEATURE_2 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = QUESTION_BANK_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = QUESTION_BANK_SUB_FEATURE_2;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);


  const getList = () => {
    dispatch(
      getAllNosListApi(
        setLoading,
        page,
        searchQuery,
        limit,
        setTotalPages,
        section
      )
    );
  };
  useEffect(() => {
    setLoading(true);
    getList();
  }, [page, limit, section]);

  useEffect(() => {
    setSortedData(nosList);
    setTotalPagesUser(totalPages);
  }, [nosList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...nosList].sort((a, b) => {
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
  }, [nosList, sortOrders]);

  const handleStatusChange = (e, nosID, section) => {
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(nosID);
    const formData = {
      status: value,
      nos_id: nosID,
      section: section.toLowerCase(),
    };

    dispatch(changeStatusNOSApi(setLoading, formData, getList));
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
        getAllNosListApi(
          setLoading,
          page,
          searchQuery,
          limit,
          setTotalPages,
          section
        )
      );
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setLoading(true);
      dispatch(
        getAllNosListApi(setLoading, page, "", limit, setTotalPages, section)
      );
    }
    setSearchQuery(value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };
  const exportNOSData = () => {
    const exportData = nosList?.map((item) => {
      return {
        clientName: item?.clientName,
        jobRole: item?.jobRole,
        qpCode: item?.nosData[0]?.qpCode,
        level: item?.nosData[0]?.level,
        version: item?.nosData[0]?.version,
        section: item?.section,
        // language: item?.nosData[0]?.language,
      };
    });
    return exportData;
  };
  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportNOSData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Question Form List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "NOS List.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = nosList?.length;
    dispatch(deleteNOSApi(setLoading, actionId, len, getList, setDeleteModal));
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
    setSection(data);
  };

  useEffect(()=>{
    let url = `${QUESTION_BANK_NOS}?section=${section}`
    if(searchQuery){
      navigate(`${url}&search=${searchQuery}`)
    }
    else{
      navigate(url);
    }
  },[section,searchQuery])

  useEffect(() => {
    const getData = setTimeout(() => {
      handleSearchSubmit();
    }, 500);

    return () => clearTimeout(getData);
  }, [searchQuery]);

  return (
    <div className="main-content">
      <div className="title" style={{ display: "block" }}>
        <h1>Assessment Blueprint</h1>
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
              <span>Viva-Practical</span>
            </button>
          </div>
          {isRolePermission?.permissions?.["2"] && (
            <button onClick={() => navigate(QUESTION_BANK_NOS_UPLOAD)}>
              <PlusIcon />
              <span>Upload NOS</span>
            </button>
          )}
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
                      <td>
                        {item?.jobRole?.length > 10 ? (
                          <Tooltip title={item?.jobRole || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "120px",
                              }}
                            >
                              {item?.jobRole || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.jobRole || "NA"}</div>
                        )}
                      </td>
                      <td>{item?.nosData[0]?.qpCode}</td>
                      <td>{item?.nosData[0]?.level}</td>
                      <td>{item?.nosData[0]?.version}</td>
                      <td>
                        {item?.section === "Theory"
                          ? "Theory"
                          : "Viva-Practical"}
                      </td>
                      <td>
                        {
                          <Button
                            sx={{
                              textTransform: "none",
                            }}
                            onClick={(e) =>
                              navigate(
                                `${QUESTION_BANK_NOS_TABLE}/${item?._id}/${item?.section}`
                              )
                            }
                          >
                            View Details
                          </Button>
                        }
                      </td>
                      <td>{moment(item?.createdAt).format("LLL")}</td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td>
                          {statusLoading && id === item._id ? (
                            <PulseLoader size="10px" color="#0bbbfe" />
                          ) : (
                            <FormSwitch
                              value={item.status === "active" ? true : false}
                              onChange={(e) =>
                                handleStatusChange(e, item?._id, item?.section)
                              }
                            />
                          )}
                        </td>
                      )}
                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
                        <td>
                          <div>
                            {item?.status === "inactive" && (
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
                                showEdit={false}
                                showDelete={item.status === "inactive"}
                              />
                            )}
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
    { name: "jobRole", label: "Job Role" },
    { name: "qpCode", label: "QP Code" },
    { name: "level", label: "Level" },
    { name: "version", label: "Version" },
    { name: "section", label: "Section" },
    // { name: "language", label: "Language" },
    { name: "nosName", label: "NOS Name" },
    {name:"createdOn",label:"Created On"},
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
