/* eslint-disable no-useless-concat */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SINGLE_ASSESSOR_ATTENDANCE_PAGE,
  SUPER_ADMIN_SCHEME_MANAGEMENT_EDIT_SCHEME,
} from "../../../../../../config/constants/routePathConstants/superAdmin";
import "../../../../../../components/common/table/style.css";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../../../../redux/slicers/authSlice";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../../../../assets/icons/search-icon-grey.svg";
import { PropagateLoader } from "react-spinners";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import CustomPagination from "../../../../../../components/common/customPagination";
import DeleteModal from "../../../../../../components/common/Modal/DeleteModal";
import { ROLESPERMISSIONS } from "../../../../../../config/constants/projectConstant";
import { TableHeader } from "../../../../../../components/common/table";
import DummyUserImg from "../../../../../../assets/images/common/no-preview.png";
import { getAssessorAttendanceListApi } from "../../../../../../api/superAdminApi/assessorManagement";
import { assessorAttendanceSelector } from "../../../../../../redux/slicers/superAdmin/assessorAttendanceSlice";
const AssessorList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const { assessorAttendanceList = {} } = useSelector(
    assessorAttendanceSelector
  );
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionOpen, setActionOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [schemeId, setSchemeId] = useState();
  const { userInfo = {} } = useSelector(authSelector);
  const MAX_LENGTH_FOR_TOOLTIP = 10;
  // permission
  const { SCHEME_MANAGEMENT_FEATURE, SCHEME_MANAGEMENT_LIST_FEATURE_1 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = SCHEME_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = SCHEME_MANAGEMENT_LIST_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  useEffect(() => {
    setSortedData(assessorAttendanceList);
    setTotalPagesUser(totalPages);
  }, [totalPages, sortedData, assessorAttendanceList]);

  const getAssessorAttendanceList = () => {
    dispatch(
      getAssessorAttendanceListApi(setLoading, 1, "", limit, totalPagesUser)
    );
  };
  useEffect(() => {
    getAssessorAttendanceList();
  }, []);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(
      getAssessorAttendanceListApi(
        setLoading,
        nxtPage,
        "",
        limit,
        totalPagesUser
      )
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getAssessorAttendanceListApi(
        setLoading,
        1,
        "",
        event.target.value,
        setTotalPages
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
        const sortedData = [...assessorAttendanceList]?.sort((a, b) => {
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
  }, [assessorAttendanceList, sortOrders]);

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "")
      dispatch(
        getAssessorAttendanceListApi(
          setLoading,
          page,
          searchQuery,
          limit,
          setTotalPages
        )
      );
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      dispatch(
        getAssessorAttendanceListApi(setLoading, page, "", limit, setTotalPages)
      );
    }
    setSearchQuery(value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };

  const exportSchemeData = () => {
    const exportData = assessorAttendanceList?.map((item, index) => {
      return {
        assessorId: item?.[0].assessorId || "NA",
        assessorName: item?.[0].fullName || "NA",
        AssessorMode: item?.[0].modeofAgreement || "NA",
        jobRole: item?.[0].jobRole?.[0].jobroleName || "NA",
      };
    });
    return exportData;
  };

  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportSchemeData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Assessor_Attendance_list"
    );

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Assessor Attendance list.xlsx");
  };

  const editBtnHandler = () => {
    navigate(`${SUPER_ADMIN_SCHEME_MANAGEMENT_EDIT_SCHEME}/${schemeId}`);
  };
  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setSchemeId(id);
  };

  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };

  return (
    <>
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
            {/* <button className="filter-btn">Filters</button> */}
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
                <tr className="table-loading-wrapper">
                  <td className="sync-loader-wrapper">
                    <PropagateLoader color="#2ea8db" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {sortedData?.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr key={index}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>
                        <div>
                          {item?.length > 1 &&
                          item[1]?.key === "assessorPhoto" ? (
                            <img
                              src={item[1]?.url}
                              alt="assessor-img"
                              style={{
                                height: "50px",
                                width: "50px",
                                borderRadius: "50%",
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <img
                              src={DummyUserImg}
                              alt="dummy-user"
                              style={{
                                height: "50px",
                                width: "50px",
                                borderRadius: "50%",
                              }}
                              loading="lazy"
                            />
                          )}
                        </div>
                      </td>

                      <td>{item?.[0]?.assessorId || "NA"}</td>

                      <td>
                        {item?.[0]?.jobRole?.[0]?.jobroleName.length >
                        MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.[0]?.jobRole?.[0]?.jobroleName || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.[0]?.jobRole?.[0]?.jobroleName || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.[0]?.jobRole?.[0]?.jobroleName || "NA"}</div>
                        )}
                      </td>                      
                      <td>{item?.[0]?.fullName}</td>
                      <td>
                        <p
                          className={
                            item?.[0].modeofAgreement === "payroll"
                              ? "payRoll"
                              : item?.[0].modeofAgreement === "freelance"
                              ? "freelancer"
                              : item?.[0].modeofAgreement === "paid"
                              ? "payRoll"
                              : ""
                          }
                        >
                          {item?.[0].modeofAgreement || "NA"}
                        </p>
                      </td>
                      <td>
                        <p
                          style={{
                            textDecoration: "underline",
                            color: "#048BC3",
                            cursor: "pointer",
                            textAlign: "center",
                            userSelect: "none",
                          }}
                          onClick={() =>
                            navigate(
                              `${SINGLE_ASSESSOR_ATTENDANCE_PAGE}/${item?.[0]?._id}`,
                              {
                                state: `${item?.[0]?.fullName}`,
                              }
                            )
                          }
                        >
                          View Attendance
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>No Result Found</td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <DeleteModal
        title="Delete Scheme"
        // confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      {sortedData && sortedData?.length > 0 && (
        <CustomPagination
          count={totalPages}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};

export default AssessorList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "Sr.No" },
    { name: "assessorImage", label: "Image" },
    { name: "assessorId", label: "Assessor ID" },
    { name: "jobRole", label: "Job Role" },
    { name: "assessorName", label: "Assessor Name" },
    { name: "AssessorMode", label: "Assessor Mode" },
    { name: "attendance", label: "Attendance" },
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
