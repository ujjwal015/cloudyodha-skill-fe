import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../jobRole/style.css";
import { ReactComponent as PlusIcon } from "../../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  SUPER_ADMIN_USER_MANAGEMENT_CREATE_USER_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_EDIT_USER_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { FormSwitch } from "../../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "./../../../../../assets/icons/search-icon-grey.svg";
import { InputAdornment, TextField } from "@mui/material";
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
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import {
  getUsersListApi,
  deleteSingleUserApi,
  changeSingleUserStatusApi,
  unlockUserAccountApi,
} from "../../../../../api/superAdminApi/userManagement";
import FilterModal from "../../../../../components/common/Modal/FilterModal";
import validateField from "../../../../../utils/validateField";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";
import UserVerifiedIcon from "../../../../../assets/images/pages/userManagement/checked.png";
import UserUnVerifiedIcon from "../../../../../assets/images/pages/userManagement/red-check.png";
import UserVerifiedIconendingIcon from "../../../../../assets/images/pages/userManagement/yellow-check.png";

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
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { usersList = [] } = useSelector(authSelector);
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

  // permission
  const { USER_MANAGEMENT_FEATURE, USER_MANAGEMENT_SUB_FEATURE_2 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = USER_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = USER_MANAGEMENT_SUB_FEATURE_2;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} arrow />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: "12px",
      padding: "8px 12px",
    },
  });

  const getList = (setStatusBtnLoading) => {
    const setLoad = setStatusBtnLoading ? setStatusBtnLoading : setLoading;
    dispatch(
      getUsersListApi(setLoading, page, searchQuery, limit, setTotalPages)
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit]);

  useEffect(() => {
    setSortedData(usersList);
    setTotalPagesUser(totalPages);
  }, [usersList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...usersList].sort((a, b) => {
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
  }, [usersList, sortOrders]);

  const handleStatusChange = (e, userId) => {
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(userId);
    const formData = {
      status: value,
    };
    dispatch(changeSingleUserStatusApi(setLoading, userId, formData, getList));
  };

  const handleUnlockUserAccount = (userId) => {
    setStatusLoading(true);
    setId(userId);
    dispatch(unlockUserAccountApi(setStatusLoading, userId, getList));
  };

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "")
      dispatch(
        getUsersListApi(setLoading, page, searchQuery, limit, setTotalPages)
      );
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      dispatch(getUsersListApi(setLoading, page, "", limit, setTotalPages));
    }
    setSearchQuery(value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };
  const exportClientData = () => {
    const exportData = usersList?.map((item) => {
      return {
        firstName: item?.firstName,
        lastName: item?.lastName,
        userName: item?.userName,
        userRole: item?.userRole
          ?.map((userRole) => userRole?.userRoleName)
          .join(","),
        assigndClients: item?.assigndClients
          .map((assignedClient) => assignedClient?.clientname)
          .join(","),
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Users List.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = usersList?.length;
    dispatch(
      deleteSingleUserApi(setLoading, actionId, len, getList, setDeleteModal)
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
    navigate(`${SUPER_ADMIN_USER_MANAGEMENT_EDIT_USER_PAGE}/${actionId}`);
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

  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        getList();
      }, 500);

      return () => clearTimeout(getData);
    }
  }, [searchQuery]);

  return (
    <div className="main-content">
      <div className="title">
        <h1>User Management List</h1>
        <div className="title-btn">
          {isRolePermission?.permissions?.["2"] && (
            <button
              onClick={() =>
                navigate(SUPER_ADMIN_USER_MANAGEMENT_CREATE_USER_PAGE)
              }
            >
              <PlusIcon />
              <span>New User</span>
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
            {/* <button className="filter-btn" onClick={handleFilter}>
              Filter
            </button>
             {isFilterOpen ? (
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
              />
            ) : (
              ""
            )} */}
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
                      <td className="multipleName-chips-box">
                        <Stack direction="column" spacing={3} key={index}>
                          <Chip
                            label={item?.userRole[0]?.userRoleName}
                            size="small"
                            sx={{
                              backgroundColor: "#A7E5FF",
                              fontFamily: "'Inter'",
                              color: "#231F20",
                              fontWeight: 600,
                              fontSize: 10,
                              padding: "5px 8px",
                            }}
                          />
                        </Stack>
                        {item?.userRole.length > 1 ? (
                          <CustomWidthTooltip
                            title={item?.userRole
                              ?.slice(1, item?.userRole?.length)
                              ?.map((clientName) => clientName?.userRoleName)
                              .join(", ")}
                          >
                            <Chip
                              label={`+${item?.userRole?.length - 1}`}
                              size="small"
                              sx={{
                                fontFamily: "'Inter'",
                                color: "#231F20",
                                backgroundColor: "#A7E5FF",
                                fontWeight: 600,
                                fontSize: 10,
                                width: 22,
                                height: 22,
                                cursor: "pointer",
                                "& span": {
                                  padding: 0,
                                },
                              }}
                            />
                          </CustomWidthTooltip>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>{item?.firstName}</td>
                      <td>{item?.lastName}</td>
                      <td>
                        {item?.isInitialPasswordChanged &&
                        item?.status === "active" ? (
                          <img
                            src={UserVerifiedIcon}
                            alt="user-verified"
                            style={{ height: "15px", marginRight: "5px" }}
                          />
                        ) : item?.isInitialPasswordChanged &&
                          item?.status === "inactive" ? (
                          <img
                            src={UserVerifiedIconendingIcon}
                            alt="user-unverified"
                            style={{ height: "15px", marginRight: "5px" }}
                          />
                        ) : (
                          <img
                            src={UserUnVerifiedIcon}
                            alt="user-unverified"
                            style={{ height: "15px", marginRight: "5px" }}
                          />
                        )}
                        {item?.userName}
                      </td>
                      <td className="multipleName-chips-box">
                        <Stack direction="column" spacing={3} key={index}>
                          <Chip
                            label={item?.assigndClients[0]?.clientname}
                            size="small"
                            sx={{
                              backgroundColor: "#9ba6b8c4",
                              fontFamily: "'Inter'",
                              color: "#231F20",
                              fontWeight: 600,
                              fontSize: 10,
                              padding: "5px 8px",
                            }}
                          />
                        </Stack>
                        {item?.assigndClients.length > 1 ? (
                          <CustomWidthTooltip
                            title={item?.assigndClients
                              ?.slice(1, item?.assigndClients?.length)
                              ?.map((clientName) => clientName?.clientname)
                              .join(",")}
                          >
                            <Chip
                              label={`+${item?.assigndClients?.length - 1}`}
                              size="small"
                              sx={{
                                fontFamily: "'Inter'",
                                color: "#231F20",
                                backgroundColor: "#9ba6b8c4",
                                fontWeight: 600,
                                fontSize: 10,
                                width: 22,
                                height: 22,
                                cursor: "pointer",
                                "& span": {
                                  padding: 0,
                                },
                              }}
                            />
                          </CustomWidthTooltip>
                        ) : (
                          ""
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {item?.isAccountLocked ? (
                          <button
                            onClick={() => handleUnlockUserAccount(item?._id)}
                            disabled={statusLoading && item._id === id}
                            style={{
                              background: "#ff6b6b",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: statusLoading && item._id === id ? "not-allowed" : "pointer",
                              opacity: statusLoading && item._id === id ? 0.6 : 1
                            }}
                          >
                            {statusLoading && item._id === id ? "..." : "Unlock Account"}
                          </button>
                        ) : (
                          <span style={{ color: "#4caf50", fontSize: "12px" }}>Account Unlocked</span>
                        )}
                      </td>
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
                              showDelete={item?.status === "inactive"}
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
        title="Delete User"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      {sortedData && sortedData?.length > 0 && (
        <div>
          <CustomTablePagination
            count={totalPagesUser}
            page={page}
            limit={limit}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default UserManagementList;
const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "Sr.No." },
    { name: "userRole", label: "Role Type" },
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "userName", label: "User Name" },
    { name: "assigndClients", label: "Client Assigned" },
    { name: "accountLockStatus", label: "Account Lock Status" },
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
