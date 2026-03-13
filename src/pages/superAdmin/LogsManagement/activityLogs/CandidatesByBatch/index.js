import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import "./style.css";
import {
  LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST_PATH,
  SUPER_ADMIN_ASSIGN_BATCH,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import { deleteClientDetails } from "../../../../../api/superAdminApi/clientManagement";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { PropagateLoader, ClipLoader } from "react-spinners";
import { ReactComponent as ArrowLeft } from "../../../../../assets/icons/chevron-left.svg";
import { TextField, Tooltip } from "@mui/material";
import {
  exportData,
  getSubRole,
  userRoleType,
} from "../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../../redux/slicers/authSlice";

import {
  getCandidateActivityByBatchId,
  getCandidateByBatchId,
} from "../../../../../api/superAdminApi/examManagement";
import { examManagementSelector } from "../../../../../redux/slicers/superAdmin/examManagementSlice";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";

import jsPDF from "jspdf";
import LogsModal from "../../../../../components/common/Modal/LogsModal";

const exportInitialValues = {
  selectAll: false,
  candidateList: false,
  attendanceList: false,
  practicalAndVive: false,
};

let columnExport = [
  { name: "_id", label: "S.NO" },
  { name: "batchId", label: "Batch ID" },
  { name: "userName", label: "Username" },
  { name: "candidateId", label: "Candidate ID" },
  { name: "name", label: "Candidate Name" },
  { name: "mobile", label: "Mobile No" },
  { name: "email", label: "Email ID" },
  { name: "aadharNumber", label: "Aadhar ID" },
  { name: "rawPassword", label: "Password" },
  { name: "attendance", label: "Attendance" },
];

const CandidateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { userInfo } = useSelector(authSelector);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);

  const [exportType, setExportType] = useState("excel");
  const [candidateData, setCandidateData] = useState({});
  const [viewOpenModal, setViewOpenModal] = useState(false);

  const { batchId, sipID } = useParams();

  const { candiateByBatch = [], exportCandaiteList = [] } = useSelector(
    examManagementSelector
  );

  // Permission to allow edit and delete etc

  const { EXAM_MANAGEMENT_FEATURE, EXAM_MANAGEMENT_SUB_FEATURE_3 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = EXAM_MANAGEMENT_SUB_FEATURE_3;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = (setStatusBtnLoading) => {
    const setLoad = setStatusBtnLoading ? setStatusBtnLoading : setLoading;
    dispatch(
      getCandidateActivityByBatchId(
        batchId,
        setLoad,
        page,
        limit,
        searchQuery,
        setTotalPages
      )
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit]);

  useEffect(() => {
    setSortedData(candiateByBatch);
  }, [candiateByBatch, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...candiateByBatch].sort((a, b) => {
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
  }, [candiateByBatch, sortOrders]);

  const handleChangePage = (e, nxtPage) => {
    setLoading(true);
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleChangeSearch = (e) => {
    const { value } = e.target;
    if (value == "") {
      setLoading(true);
      dispatch(
        getCandidateByBatchId(
          batchId,
          setLoading,
          page,
          limit,
          "",
          setTotalPages
        )
      );
    }
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") setLoading(true);
    dispatch(
      getCandidateByBatchId(
        batchId,
        setLoading,
        1,
        limit,
        searchQuery,
        setTotalPages
      )
    );
    setPage(1);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  const exportCandidateData = () => {
    const exportData = candiateByBatch?.map((item, index) => {
      return {
        _id: item?._id,
        batchId: item?.batchId,
        userName: item?.userName || "N/A",
        candidateId: item?.candidateId || "N/A", // Candidate ID
        candidateName: item?.candidateName || "N/A", // Candidate Name
        loginTime: item?.loginTime || "N/A", // User Login
        startTime: item?.startTime || "N/A", // Exam Start Time (listed twice in columns, only need to map once)
        resumeTime: item?.resumeTime || "N/A", // Exam Resume Time
        logoutTime: item?.logoutTime || "N/A", // User Logout
        latitude: item?.latitude || "N/A", // Latitude
        longitude: item?.longitude || "N/A", // Longitude
        ipAddress: item?.ipAddress || "N/A", // IP Address
        browser: item?.browser || "N/A", // Browser Versions
      };
    });
    return exportData;
  };

  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportCandidateData(), columns)
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Activity Candidate Logs.xlsx");
  };

  const confirmDelete = () => {
    dispatch(
      deleteClientDetails(setLoading, actionId, setDeleteModal, getList)
    );
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };

  // useEffect(() => {
  //   const downloadFile = async () => {
  //     if (
  //       exportCandaiteList?.candidateList?.length > 0 ||
  //       exportCandaiteList?.practicalAndVive?.candidateList?.length > 0 ||
  //       exportCandaiteList?.attendanceList?.length > 0
  //     ) {
  //       const data = exportData(exportCandidateData(), columnExport);
  //       const tableHeaders = Object.keys(
  //         exportData(exportCandidateData(), columnExport)[0]
  //       );
  //       if (exportType === "pdf") {
  //         // Create a new jsPDF instance
  //         const doc = new jsPDF();

  //         // Convert the data to a format that can be used by jsPDF AutoTable
  //         let tableData = data.map((row) => Object.values(row));
  //         const upData = {
  //           ...data[0],
  //           ...data[data.length - 1],
  //         };
  //         const tableHeaders = Object.keys(upData);

  //         // If tableData is empty, set it to an array with a single empty array
  //         if (tableData.length === 0) {
  //           tableData = [[]];
  //         }

  //         doc.autoTable({
  //           head: [tableHeaders],
  //           body: tableData,
  //           didDrawPage: (data) => {
  //             // Add a header and footer on each page
  //             doc.text("Header", data.settings.margin.left, 10);
  //             doc.text(
  //               "Footer",
  //               data.settings.margin.left,
  //               doc.internal.pageSize.height - 10
  //             );
  //           },
  //           styles: {
  //             cellWidth: "auto",
  //             minCellHeight: 15,
  //             textColor: 20,
  //             lineColor: "black",
  //             lineWidth: 0.65,
  //           }, // Set textColor and lineColor to black, and add a lineWidth for grid lines
  //           headStyles: { fillColor: [221, 221, 221] }, // Set fillColor to a light gray for the header
  //           columnStyles: {
  //             0: { cellWidth: "auto" }, // Specify cellWidth for each column as needed
  //             // ...
  //           },
  //         });

  //         // Save the PDF
  //         doc.save("CandidateList.pdf");
  //       }

  //       if (exportType === "excel") {
  //         const workbook = XLSX.utils.book_new();
  //         const worksheet = XLSX.utils.json_to_sheet(
  //           exportData(exportCandidateData(), columnExport)
  //         );
  //         // Add the worksheet to the workbook
  //         XLSX.utils.book_append_sheet(workbook, worksheet, "Table");
  //         // Convert the workbook to an array buffer
  //         const buffer = XLSX.write(workbook, { type: "array" });
  //         // Create a blob with the array buffer and trigger a download
  //         const blob = new Blob([buffer], { type: "application/octet-stream" });
  //         saveAs(blob, "CandidateList.xlsx");
  //       }
  //     }
  //   };

  //   downloadFile();
  // }, [exportCandaiteList]);

  const handleViewModel = (e, id) => {
    setViewOpenModal(true);
    const data = sortedData.find((item) => item._id === id);
    setCandidateData(data);
  };

  const handleCloseLogsModal = () => {
    setViewOpenModal(false);
  };

  const processTimeStamp = (timestamp) => {
    if (!timestamp) return "-";
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Date(timestamp).toLocaleString("en-US", options);
    return formattedDate;
  };

  const MAX_LENGTH_FOR_TOOLTIP = 13;

  return (
    <>
      <div className="main-content">
        <div className="title">
          <h1>
            <ArrowLeft
              onClick={() =>
                navigate(LOGS_MANAGEMENT_ACIVITY_LOGS_BATCHS_LIST_PATH)
              }
            />
            <span>Candidate Logs ({sipID})</span>
          </h1>
        </div>

        <div className="subadmin-table">
          <div className="subadmin-header">
            <div className="search-input">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search"
                style={{ background: "#F8F8F8", padding: "2px" }}
                onChange={handleChangeSearch}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="subadmin-btn">
              <button
                className="export-btn"
                onClick={
                  loading || sortedData?.length == 0 ? undefined : handleExport
                }
              >
                {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <TableHeader
                columns={columns}
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
                      <tr key={index}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td style={{ cursor: "pointer" }}>
                          <span onClick={(e) => handleViewModel(e, item._id)}>
                            {item?.userName || "NA"}
                          </span>
                        </td>
                        <td>
                          {item?.candidateId?.length >
                          MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip title={item?.candidateId || "NA"} arrow>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {item?.candidateId || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item?.candidateId || "NA"}</div>
                          )}
                        </td>
                        <td>
                          {item?.candidateName?.length >
                          MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip title={item?.candidateName || "NA"} arrow>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {item?.candidateName || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item?.candidateName || "NA"}</div>
                          )}
                        </td>
                        <td>
                          {item?.loginTime?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={processTimeStamp(item?.loginTime) || "NA"}
                              arrow
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "140px", // Set a maximum width for the cell
                                }}
                              >
                                {processTimeStamp(item?.loginTime) || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>
                              {processTimeStamp(item?.loginTime) || "NA"}
                            </div>
                          )}
                        </td>
                        <td>
                          {item?.startTime?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={processTimeStamp(item?.startTime) || "NA"}
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
                                {processTimeStamp(item?.startTime) || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>
                              {processTimeStamp(item?.startTime) || "NA"}
                            </div>
                          )}
                        </td>
                        <td>
                          {item?.resumeTime?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={processTimeStamp(item?.resumeTime) || "NA"}
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
                                {processTimeStamp(item?.resumeTime) || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>
                              {processTimeStamp(item?.resumeTime) || "NA"}
                            </div>
                          )}
                        </td>
                        <td>
                          {item?.endTime?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={processTimeStamp(item?.endTime) || "NA"}
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
                                {processTimeStamp(item?.endTime) || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{processTimeStamp(item?.endTime) || "NA"}</div>
                          )}
                        </td>
                        <td>
                          {item?.logoutTime?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={processTimeStamp(item?.logoutTime) || "NA"}
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
                                {processTimeStamp(item?.logoutTime) || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>
                              {processTimeStamp(item?.logoutTime) || "NA"}
                            </div>
                          )}
                        </td>
                        <td>
                          {item?.latitude?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip title={item?.latitude || "NA"} arrow>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "130px", // Set a maximum width for the cell
                                }}
                              >
                                {item?.latitude || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item?.latitude || "NA"}</div>
                          )}
                        </td>
                        <td>
                          {item?.longitude?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip title={item?.longitude || "NA"} arrow>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {item?.longitude || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item?.longitude || "NA"}</div>
                          )}
                        </td>
                        <td>
                          {item?.ipAddress?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip title={item?.ipAddress || "NA"} arrow>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {item?.ipAddress || "NA"}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item?.ipAddress || "NA"}</div>
                          )}
                        </td>
                        <td>{item?.browser || "NA"}</td>
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

        <LogsModal
          open={viewOpenModal}
          userData={candidateData}
          handleCloseModal={handleCloseLogsModal}
        />

        <DeleteModal
          title="Delete Client"
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
    </>
  );
};

export default CandidateList;

const columns = [
  { name: "_id", label: "S.NO" },
  { name: "userName", label: "Username" },
  { name: "candidateId", label: "Candidate ID (SIP)" },
  { name: "candidateName", label: "Candidate Name" },
  { name: "loginTime", label: "User Login" },
  { name: "startTime", label: "Exam Start Time" },
  { name: "resumeTime", label: "Exam Resume Time" },
  { name: "endTime", label: "Exam End Time" },
  { name: "logoutTime", label: "User Logout" },
  { name: "latitude", label: "Latitude" },
  { name: "longitude", label: "Longitude" },
  { name: "ipAddress", label: "IP Address" },
  { name: "browser", label: "Browser Versions" },
];
