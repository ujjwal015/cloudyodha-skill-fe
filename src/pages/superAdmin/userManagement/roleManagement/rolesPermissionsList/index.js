import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../jobRole/style.css";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_EDIT_ROLE_AND_PERMISSION_PAGE,
  SUPER_ADMIN_USER_MANAGEMENT_EDIT_ASSIGNED_PERMISSION_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader } from "react-spinners";
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
import {
  getRolesListApi,
  deleteSingleRoleApi,
} from "../../../../../api/superAdminApi/userManagement";
import FilterModal from "../../../../../components/common/Modal/FilterModal";
import validateField from "../../../../../utils/validateField";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";

const UserRoleManagementList = () => {
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
  const { rolesList = {} } = useSelector(authSelector);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [roleId, setRoleId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionBtn, setActionBtn] = useState(null);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { userInfo = {} } = useSelector(authSelector);

  // permission
  const { USER_MANAGEMENT_FEATURE, USER_MANAGEMENT_SUB_FEATURE_1 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = USER_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = USER_MANAGEMENT_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = (setStatusBtnLoading) => {
    setLoading(true);
    dispatch(
      getRolesListApi(setLoading, page, searchQuery, limit, setTotalPages)
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit]);

  useEffect(() => {
    setSortedData(rolesList);
  }, [rolesList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...rolesList].sort((a, b) => {
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
  }, [rolesList, sortOrders]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleChangeSearch = (e) => {
    const { value } = e.target;
    if (value === "") {
      setLoading(true);
      dispatch(getRolesListApi(setLoading, page, "", limit, setTotalPages));
    }
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") setLoading(true);
    dispatch(
      getRolesListApi(setLoading, page, searchQuery, limit, setTotalPages)
    );
    setPage(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };
  const exportClientData = () => {
    const exportData = rolesList?.map((item) => {
      return {
        userRoleName: item?.userRoleName,
        noOfUserAssigned: item?.userAssigned,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "User Role List.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setRoleId(id);
  };

  const confirmDelete = () => {
    const len = rolesList?.length;
    dispatch(
      deleteSingleRoleApi(setLoading, roleId, len, getList, setDeleteModal)
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
    navigate(
      `${SUPER_ADMIN_USER_MANAGEMENT_EDIT_ROLE_AND_PERMISSION_PAGE}/${roleId}`
    );
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
      // dispatch(
      //   getDemoUserListApi(
      //     setLoading,
      //     page,
      //     "",
      //     limit,
      //     setTotalPages,
      //     from,
      //     to,
      //     status
      //   )
      // );
      handleClose();
    }
  };
  const handleClearAll = () => {
    setFormValues(initialFormValues);
  };

  const permissionHandler = (roleId) => {
    setId(roleId);
    navigate(
      `${SUPER_ADMIN_USER_MANAGEMENT_EDIT_ASSIGNED_PERMISSION_PAGE}/${roleId}`
    );
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
        <h1>Roles</h1>
        <div className="title-btn">
          {isRolePermission?.permissions?.["2"] && (
            <button
              onClick={() =>
                navigate(SUPER_ADMIN_USER_MANAGEMENT_ROLE_AND_PERMISSION_PAGE)
              }
            >
              <PlusIcon />
              <span>New Role</span>
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
              onChange={handleChangeSearch}
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
                      <td>{item?.userRoleName}</td>
                      <td>{item?.userAssigned}</td>
                      <td>
                        <span
                          className="permissions"
                          onClick={() => {
                            permissionHandler(item?._id);
                          }}
                        >
                          Assign Permission
                        </span>
                      </td>
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
                              actionId={roleId}
                              featureName={featureName}
                              subFeatureName={subFeatureName}
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
        title="Delete Role"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      {sortedData && sortedData?.length > 0 && (
        <div>
          <CustomTablePagination
            count={totalPages}
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

export default UserRoleManagementList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "Sr.No." },
    { name: "userRoleName", label: "Role Name" },
    { name: "noOfUserAssigned", label: "No. Of User Assigned" },
    { name: "permission", label: "Permission" },
    { name: "actions", label: "ACTIONS" },
  ];
  if (
    !isRolePermission?.permissions?.["3"] &&
    !isRolePermission?.permissions?.["4"]
  ) {
    columns = columns?.filter((column) => column?.name !== "actions");
  }
  return columns;
};
