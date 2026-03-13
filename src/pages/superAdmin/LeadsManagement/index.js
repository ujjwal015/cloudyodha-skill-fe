/* eslint-disable no-useless-concat */
import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import "../../../components/common/table/style.css";
import { TableHeader } from "../../../components/common/table";
import { FormSwitch } from "../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import {
  getDemoUserListApi,
  changeSingleDemoUserStatusApi,
  deleteSingleLeadApi,
} from "../../../api/authApi";
import { authSelector } from "../../../redux/slicers/authSlice";
import { InputAdornment, TextField } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../assets/icons/search-icon-grey.svg";
import { ReactComponent as DeleteIcon } from "./../../../assets/icons/delete-icon.svg";
import { PropagateLoader } from "react-spinners";
import {
  capitalizeFirstLetter,
  convertDateToDDYYMM,
  exportData,
  getLocal,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import CustomPagination from "../../../components/common/customPagination";
import validateField from "../../../utils/validateField";
import FilterModal from "../../../components/common/Modal/FilterModal";
import { ActionDropdown } from "../../../components/common/DropDown";
import DeleteModal from "../../../components/common/Modal/DeleteModal";
import RemarksModel from "./remarksMode";
import {
  MOBILE_VERIFIED,
  ROLESPERMISSIONS,
} from "../../../config/constants/projectConstant";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SearchInput from "../../../components/common/searchInput";
const LeadManagementList = () => {
  const initialFormValues = {
    mobileVerified: "",
    userRole: "",
    status: "",
  };
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const { demoUserList = [] } = useSelector(authSelector);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [actionOpen, setActionOpen] = useState(false);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [open, setOpen] = useState(false);
  const { userInfo = {} } = useSelector(authSelector);
  const [statusFromDashboard, setStatusFromDashboard] = useState(
    getLocal("leadManagemntList")
  );
  const [updatedLeadManagementList, setUpdatedLeadManagementList] = useState(
    []
  );
  // storeLocal({status:"Active"},"leadManagemntList")

  const handleFilterRemove = () => {
    window.localStorage.removeItem("leadManagemntList");
    setStatusFromDashboard("");
  };

  useEffect(() => {
    return window.localStorage.removeItem("leadManagemntList");
  }, []);

  // permission
  const { LEAD_MANAGEMENT_FEATURE, LEAD_MANAGEMENT_LIST_FEATURE } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = LEAD_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = LEAD_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  useEffect(() => {
    setSortedData(demoUserList);
    setTotalPagesUser(totalPages);
  }, [totalPages, sortedData, demoUserList]);

  const getDemoUserList = () => {
    if(isFilterApplied){
      dispatch(
        getDemoUserListApi(
          setLoading,
          page,
          searchQuery,
          limit,
          setTotalPages,
          formValues?.mobileVerified,
          formValues?.userRole,
          formValues?.status
        )
      );
    }
    else{
      dispatch(
        getDemoUserListApi(
          setLoading,
          page,
          searchQuery,
          limit,
          setTotalPages,
        )
      );
    }
    
  };

  useEffect(() => {
    getDemoUserList();
  }, [page,searchQuery, formValues, limit]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(
      getDemoUserListApi(
        setLoading,
        nxtPage,
        searchQuery,
        limit,
        totalPagesUser,
        formValues?.mobileVerified,
        formValues?.userRole,
        formValues?.status
      )
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getDemoUserListApi(
        setLoading,
        1,
        searchQuery,
        event.target.value,
        setTotalPages,
        formValues?.mobileVerified,
        formValues?.userRole,
        formValues?.status
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };
  const handleStatusChange = (e, id) => {
    setStatusLoading(false);
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(id);
    const formData = {
      status: value,
    };
    dispatch(
      changeSingleDemoUserStatusApi(setLoading, id, formData, getDemoUserList)
    );
  };
  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...demoUserList]?.sort((a, b) => {
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
  }, [demoUserList, sortOrders]);

  useEffect(() => {
    if (sortedData?.length > 0) {
      if (statusFromDashboard?.status) {
        const arr = [];
        for (let item of sortedData) {
          if (item?.status === statusFromDashboard?.status) {
            arr.push(item);
          }
        }
        if (arr?.length > 0) {
          setUpdatedLeadManagementList(arr);
        } else {
          setUpdatedLeadManagementList([]);
        }
      } else {
        setUpdatedLeadManagementList(sortedData);
      }
    } else {
      setUpdatedLeadManagementList([]);
    }
  }, [sortedData, statusFromDashboard]);

  const exportDemoUserData = () => {
    const exportData = demoUserList?.map((item, index) => {
      return {
        userName: `${item?.firstName}` + " " + `${item?.lastName}`||"NA",
        email: item?.email||"NA",
        mobile: item?.mobile||"NA",
        organisationName: item?.organisationName || "NA",
        userRole: item?.userRole||"NA",
        remarks: item?.remark || "NA",
        updatedOn:convertDateToDDYYMM(item?.createdAt)||"NA",
        createdOn:convertDateToDDYYMM(item?.updatedAt)||"NA",
        status: item?.status||"NA",
      };
    });
    return exportData;
  };

  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportDemoUserData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads_Management_list");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Leads List.xlsx");
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
  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = demoUserList?.length;
    dispatch(
      deleteSingleLeadApi(
        setLoading,
        actionId,
        len,
        getDemoUserList,
        setDeleteModal
      )
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
      setIsFilterApplied(true);
      const mobileVerified = formValues?.mobileVerified;
      const userRole = formValues?.userRole;
      const status = formValues?.status;
      formValues[mobileVerified] !== "" &&
        formValues[userRole] !== "" &&
        formValues[status] !== "" &&
        dispatch(
          getDemoUserListApi(
            setLoading,
            page,
            searchQuery,
            limit,
            setTotalPages,
            mobileVerified,
            userRole,
            status,
            isFilterOpen
          )
        );
      handleClose();
    }
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const handleClearAll = () => {
    setFormValues(initialFormValues);
    setLoading(true);
    dispatch(
      getDemoUserListApi(
        setLoading,
        page,
        searchQuery,
        limit,
        setTotalPages,
        formValues?.mobileVerified,
        formValues?.userRole,
        formValues?.status
      )
    );
    handleCloseFilter();
    setIsFilterApplied(false);
  };

  const handleModelOpen = () => {
    setOpen(true);
  };

  return (
    <div className="main-content">
      <div className="title">
        <div className="title-text">
          <h1>Leads Management</h1>
        </div>
      </div>

      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            <SearchInput
              searchQuery={searchQuery}
              handleTrimPaste={handleTrimPaste}
              setSearchQuery={setSearchQuery}
              apiHandler={getDemoUserListApi}
              setLoading={setLoading}
              page={page}
              limit={limit}
              setTotalPages={setTotalPages}
            />
          </div>
          <div className="subadmin-btn">
            <FilterModal
              handleClose={handleClose}
              focusHandler={focusHandler}
              blurHandler={blurHandler}
              changeHandler={changeHandler}
              formValues={formValues}
              setFormValues={setFormValues}
              handleClearAll={handleClearAll}
              handleSubmit={handleSubmit}
              showIsMobileVerified={true}
              showRoleType={true}
              showVerified={true}
              isMobileVerified={MOBILE_VERIFIED}
              setIsFilterOpen={setIsFilterOpen}
              isFilterOpen={isFilterOpen}
              isFilerApplied={isFilterApplied}
            />

            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={loading ? undefined : handleExport}
              >
                {loading ? "loading..." : "Export"}
              </button>
            )}
          </div>
        </div>
        <div className="table-wrapper">
          {statusFromDashboard?.status && (
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
                Active Clients
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
                <tr className="table-loading-wrapper ">
                  <td className="sync-loader-wrapper">
                    <PropagateLoader color="#2ea8db" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {updatedLeadManagementList?.length > 0 ? (
                  updatedLeadManagementList.map((item, index) => (
                    <tr key={item._id}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>{item?.firstName + " " + item?.lastName}</td>
                      <td>{item?.email}</td>
                      <td>{item?.mobile}</td>
                      <td>
                        {capitalizeFirstLetter(item?.organisationName || "NA")}
                      </td>
                      <td>{capitalizeFirstLetter(item?.userRole)}</td>

                      <td>
                        <RemarksModel
                          id={item?._id}
                          getDemoUserList={getDemoUserList}
                          remarks={item?.remark}
                          isRemarks={item?.isremark}
                          setLoading={setLoading}
                          isFilterOpen={isFilterOpen}
                        />
                      </td>
                      <td>
                        {convertDateToDDYYMM(item?.createdAt)}
                      </td>
                      <td>
                        {convertDateToDDYYMM(item?.updatedAt)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {item?.isMobileVerified === true ? (
                          <CheckOutlinedIcon
                            sx={{
                              color: "white",
                              backgroundColor: "#4cd964",
                              borderRadius: "7px",
                            }}
                          />
                        ) : (
                          <CloseOutlinedIcon
                            sx={{
                              color: "white",
                              backgroundColor: "#e74c3c",
                              borderRadius: "7px",
                            }}
                          />
                        )}
                      </td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td style={{ textAlign: "center" }}>
                          {statusLoading && id === item._id ? (
                            {
                              /* <PulseLoader size="10px" color="#0bbbfe" /> */
                            }
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
                              showEditButton={false}
                              showDelete={
                                item?.status === "active" ? false : true
                              }
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
                    <td>No Lead Found</td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <DeleteModal
        title="Delete lead"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      <div
        style={{
          display: [totalPages > 0 ? "" : "none"],
        }}
      >
        <CustomPagination
          count={totalPages}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default LeadManagementList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "Sr.No" },
    { name: "userName", label: "User Name" },
    { name: "email", label: "Email Address" },
    { name: "mobile", label: "Mobile No" },
    { name: "organisationName", label: "Organization Name" },
    { name: "userRole", label: "Role Type" },
    { name: "remarks", label: "Remarks" },
    { name: "createdOn", label: "Created On" },
    { name: "updatedOn", label: "Updated On" },
    { name: "mobileVerified", label: "Mobile Verified" },
    { name: "status", label: "Verified" },
    { name: "action", label: "Action" },
  ];
  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns?.filter((column) => column?.name !== "status");
  }
  if (
    !isRolePermission?.permissions?.["3"] &&
    !isRolePermission?.permissions?.["4"]
  ) {
    columns = columns?.filter((column) => column?.name !== "action");
  }
  return columns;
};
