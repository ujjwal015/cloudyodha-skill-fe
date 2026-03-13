/* eslint-disable no-useless-concat */
import React, { useEffect, useState } from "react";
import "../../LeadsManagement/style.css";
import "../../../../components/common/table/style.css";
import "./style.css";
import { TableHeader } from "../../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { InputAdornment, TextField } from "@mui/material";
import { ReactComponent as SearchIcon } from "../../../../assets/icons/search-icon-grey.svg";
import { ReactComponent as BackIcon } from "../../../../assets/icons/chevron-left.svg";
import ArrowDown from "../../../../assets/icons/arrow-down-right.svg";
import { PropagateLoader } from "react-spinners";
import {
  capitalizeFirstLetter,
  convertDateFormat,
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import CustomPagination from "../../../../components/common/customPagination";
import validateField from "../../../../utils/validateField";
import FilterModal from "../../../../components/common/Modal/FilterModal";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";
import {
  MOBILE_VERIFIED,
  ROLESPERMISSIONS,
} from "../../../../config/constants/projectConstant";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAssessorAttendanceBatchWiseApi } from "../../../../api/superAdminApi/assessorManagement";
import { assessorAttendanceSelector } from "../../../../redux/slicers/superAdmin/assessorAttendanceSlice";
import { ReactComponent as ActionDots } from "../../../../assets/images/common/action-dots.svg";
import ViewLog from "./viewLog";
import { ASSESSOR_ATTENDANCE_LIST } from "../../../../config/constants/routePathConstants/superAdmin";

const SingleAssessorAttendanceLogList = () => {
  const initialFormValues = {
    mobileVerified: "",
    userRole: "",
    status: "",
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { assessorId } = params;
  const assessorName = location?.state;
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { attendanceLogBatchWise = [] } = useSelector(
    assessorAttendanceSelector
  );

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

  // permission
  const { LEAD_MANAGEMENT_FEATURE, LEAD_MANAGEMENT_LIST_FEATURE } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = LEAD_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = LEAD_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getAssessorAttendanceLogList = () => {
    dispatch(
      getAssessorAttendanceBatchWiseApi(
        setLoading,
        assessorId,
        page,
        "",
        limit,
        totalPagesUser
      )
    );
  };
  useEffect(() => {
    getAssessorAttendanceLogList();
  }, []);

  useEffect(() => {
    setSortedData(attendanceLogBatchWise);
    setTotalPagesUser(totalPages);
  }, [totalPages, sortedData, attendanceLogBatchWise]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(
      getAssessorAttendanceBatchWiseApi(
        setLoading,
        assessorId,
        nxtPage,
        "",
        limit,
        totalPagesUser
      )
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getAssessorAttendanceBatchWiseApi(
        setLoading,
        assessorId,
        1,
        "",
        event.target.value,
        totalPagesUser
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...attendanceLogBatchWise]?.sort((a, b) => {
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
  }, [attendanceLogBatchWise, sortOrders]);

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "")
      dispatch(
        getAssessorAttendanceBatchWiseApi(
          setLoading,
          assessorId,
          page,
          searchQuery,
          limit,
          totalPagesUser
        )
      );
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      dispatch(
        getAssessorAttendanceBatchWiseApi(
          setLoading,
          assessorId,
          1,
          "",
          limit,
          totalPagesUser
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

  // { name: "batchSipId", label: "Batch Sip Id" },
  // { name: "jobRole", label: "Job Role" },
  // { name: "date", label: "Date" },
  // { name: "clockIn", label: "Clock In" },
  // { name: "clockOut", label: "Clock Out" },
  // { name: "effectiveHours", label: "Effective Hours" },
  // { name: "action", label: "Action" },
  const exportDemoUserData = () => {
    const exportData = attendanceLogBatchWise?.map((item, index) => {
      return {
        date: convertDateFormat(item?.createdAt),
        batchSipId: item?.batch_id?.batchId || "NA",
        jobRole: item?.batch_id?.jobRole?.jobRole || "NA",
        clockIn: item?.clockInTime,
        clockOut: item?.clockOutTime || "NA",
        effectiveHours: item?.duration || "NA",
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance_Log_list");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Single Assessor Attendance List.xlsx");
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
    setActionOpen(true);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = attendanceLogBatchWise?.length;
    // dispatch(
    //   deleteSingleLeadApi(
    //     setLoading,
    //     actionId,
    //     len,
    //     getAssessorAttendanceLogList,
    //     setDeleteModal
    //   )
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
    // setIsFilterOpen(!isFilterOpen);
    setIsFilterOpen(false);
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
        // dispatch(
        //   getDemoUserListApi(
        //     setLoading,
        //     page,
        //     "",
        //     limit,
        //     setTotalPages,
        //     mobileVerified,
        //     userRole,
        //     status,
        //     isFilterOpen
        //   )
        // );
        handleClose();
    }
  };

  const handleClearAll = () => {
    setFormValues(initialFormValues);
    // dispatch(getDemoUserListApi(setLoading, page, "", limit, setTotalPages));
  };

  const handleModelOpen = () => {
    setOpen(true);
  };

  return (
    <div className="main-content">
      <div className="title">
        <div className="title-text">
          <BackIcon
            onClick={() => {
              navigate(ASSESSOR_ATTENDANCE_LIST);
            }}
          />
          <h1>{capitalizeFirstLetter(assessorName)}</h1>
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
            <button className="filter-btn" onClick={handleFilter}>
              Filters
            </button>
            {isFilterOpen ? (
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
              />
            ) : (
              ""
            )}
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
                {sortedData?.length > 0 ? (
                  sortedData?.map((item, index) => (
                    <tr key={item?._id}>
                      <td className="clock-in-date">
                        {item?.batch_id?.batchId || "NA"}
                      </td>
                      <td className="clock-in-date">
                        {item?.batch_id?.jobRole?.jobRole || "NA"}
                      </td>
                      <td className="clock-in-date">
                        {convertDateFormat(item?.createdAt)}
                      </td>
                      <td className="clock-in">
                        <img src={ArrowDown} alt="clock-in-img" />{" "}
                        {item?.clockInTime}
                      </td>
                      <td className="clock-out">
                        <img src={ArrowDown} alt="clock-out-img" />
                        {item?.clockOutTime || "Missing"}
                      </td>
                      <td>
                        <div className="eff-wrapper">
                          {item?.duration === null
                            ? "00:00:00 Hrs"
                            : `${item?.duration} Hrs`}
                        </div>
                      </td>
                      <td>
                        <StatusBtn
                          status={
                            item?.regularise_Id === null
                              ? null
                              : item?.regularise_Id?.isApprove
                          }
                        />
                      </td>
                      <td>
                        <ViewLog
                          date={item?.createdAt}
                          clockInTime={item?.clockInTime}
                          clockOutTime={item?.clockOutTime}
                          reason={item?.regularise_Id?.remark}
                          status={item?.regularise_Id?.isApprove}
                          actionOpen={actionOpen}
                          setActionOpen={setActionOpen}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>No record Found</td>
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

export default SingleAssessorAttendanceLogList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "batchSipId", label: "Batch Sip Id" },
    { name: "jobRole", label: "Job Role" },
    { name: "date", label: "Date" },
    { name: "clockIn", label: "Clock In" },
    { name: "clockOut", label: "Clock Out" },
    { name: "effectiveHours", label: "Effective Hours" },
    { name: "status", label: "Status" },
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

const StatusBtn = (status) => {
  return (
    <>
      {status?.status === (null || "approve") || status.status === null ? (
        <p className="approve-status">Approved</p>
      ) : status?.status === "pending" ? (
        <p className="pending-status">Pending</p>
      ) : status?.status === "reject" ? (
        <p className="reject-status">Rejected</p>
      ) : (
        ""
      )}
    </>
  );
};
