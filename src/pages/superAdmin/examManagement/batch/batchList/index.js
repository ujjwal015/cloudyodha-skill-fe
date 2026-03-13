import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  SUPER_ADMIN_ASSESSMENT_STATS,
  SUPER_ADMIN_ASSIGN_BATCH,
  SUPER_ADMIN_CREATE_BATCH_PAGE,
  SUPER_ADMIN_EDIT_BATCH_PAGE,
  SUPER_ADMIN_LIVE_MONITORING_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";

import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, TextField } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../../../assets/icons/search-icon.svg";
import { SyncLoader } from "react-spinners";
import {
  deleteBatchApi,
  editBatchListStatusApi,
  getExamManagementBatchListApi,
} from "../../../../../api/superAdminApi/examManagement";
import { examManagementSelector } from "../../../../../redux/slicers/superAdmin/examManagementSlice";
import DeleteModal from "./../../../../../components/common/Modal/DeleteModal";

import {
  exportData,
  handleTrimPaste,
} from "../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../../components/common/DropDown";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { FormSwitch } from "../../../../../components/common/input";
import { PulseLoader } from "react-spinners";
import { TableHeader } from "../../../../../components/common/table";

const BatchList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { examManagementbatchList = [] } = useSelector(examManagementSelector);

  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [actionId, setActionId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [id, setId] = useState("");

  const getList = (isQuestionDeleted = false, len) => {
    const pageNum = len && len == 1 ? (page == 1 ? page : page - 1) : page;

    dispatch(
      getExamManagementBatchListApi(
        setLoading,
        id,
        pageNum,
        limit,
        "",
        "",
        setStatusLoading
      )
    );
    setPage(pageNum);
  };
  useEffect(() => {
    getList();
  }, []);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(
      getExamManagementBatchListApi(
        setLoading,
        id,
        nxtPage,
        limit,
        searchQuery,
        setStatusLoading
      )
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getExamManagementBatchListApi(
        setLoading,
        id,
        1,
        event.target.value,
        searchQuery,
        setTotalPages,
        setStatusLoading
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    setSortedData(examManagementbatchList);
    setTotalPagesUser(totalPages);
  }, [examManagementbatchList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...examManagementbatchList].sort((a, b) => {
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
  }, [examManagementbatchList, sortOrders]);

  // const getformattedData = (data) => {
  //   const formattedData = columns.reduce((acc, column) => {
  //     acc[column.name] = data[column.name];
  //     return acc;
  //   }, {});
  //   return formattedData;
  // };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
    }
  };
  const confirmDelete = () => {
    const len = examManagementbatchList?.length;

    dispatch(
      deleteBatchApi(setLoading, actionId, setDeleteModal, getList, len)
    );
  };
  const editBtnHandler = (id, index) => {
    navigate(`${SUPER_ADMIN_EDIT_BATCH_PAGE}/${id}`);
  };

  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value == "") {
      getList();
    }
    setSearchQuery(value);
  };
  const handleSearch = () => {
    if (searchQuery !== "")
      dispatch(
        getExamManagementBatchListApi(
          setLoading,
          id,
          page,
          limit,
          searchQuery,
          setTotalPages,
          setStatusLoading
        )
      );
    setPage(1);
  };
  const exportBatchData = () => {
    const exportData = examManagementbatchList?.map((item) => {
      return {
        batchId: item?.batchId,
        batchName: item?.batchName,
        batchProctoring: item?.batchProctoring,
        assesmentStats: item?.assesmentStats,
        language: item?.questionPaper?.primaryLanguage,
        assessment: item?.assesmentId,
        jobRole: item?.jobRole,
        examCenter: item?.examCenterId?.examCenterName,
        examStartDate: item?.startDate,
        imageProctorStatus:
          item?.proctoring?.imageProctor?.imageProctorStatus === true
            ? "Enabled"
            : "Disabled",
        imageProctorTime: item.proctoring.imageProctor.imageProctoringTime
          ? `${item?.proctoring?.imageProctor?.imageProctoringTime} sec`
          : "NA",
        VideoStreaming:
          item?.proctoring?.videoStream?.videoStreaming === true
            ? "Enabled"
            : "Disabled",
        videoDurationTime: item.proctoring.videoStream.videoDuration
          ? `${item?.proctoring?.videoStream?.videoDuration} sec`
          : "NA",
        faceDetection:
          item?.proctoring?.faceDetection === true ? "Enabled" : "Disabled",
        faceRecognition:
          item?.proctoring?.faceRecognition === true ? "Enabled" : "Disabled",
        AssessmentStatus:
          item?.questionPaper?.assesmentStatus === true ? "Start" : "Stop",
        status: item?.status === true ? "Active" : "Inactive",
      };
    });
    return exportData;
  };

  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportBatchData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Batch List.xlsx");
  };

  const handleStatusChange = (e, id) => {
    const { checked } = e.target;
    const value = checked ? true : false;
    setId(id);
    const formData = {
      status: value,
    };
    setStatusLoading(true);
    dispatch(
      editBatchListStatusApi(
        setLoading,
        id,
        formData,
        setStatusLoading,
        getList
      )
    );
  };

  const handleStatus = (id) => {
    navigate(`${SUPER_ADMIN_ASSESSMENT_STATS}/${id}`);
  };
  return (
    <div className="main-content exam-management-batch-list">
      <div className="title">
        <div className="title-text">
          <h1>Batch List</h1>
        </div>
        <div className="title-btn">
          <button onClick={() => navigate(SUPER_ADMIN_CREATE_BATCH_PAGE)}>
            <PlusIcon />
            <span>Add New</span>
          </button>
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
              style={{ background: "#F8F8F8" }}
              onChange={handleChange}
              onPaste={(e) => handleTrimPaste(e, setSearchQuery)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <span
              className={`${searchQuery == "" ? "disabled" : ""} search-icon`}
              onClick={handleSearch}
            >
              <SearchIcon />
            </span>
          </div>
          <div className="subadmin-btn">
            <button
              className="export-btn"
              onClick={sortedData?.length > 0 ? handleExport : undefined}
            >
              Export
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <TableHeader
              columns={getColumns()}
              sortOrders={sortOrders}
              setSortOrders={setSortOrders}
            />
            {loading ? (
              <tbody>
                <tr className="table-loading-wrapper">
                  <div className="sync-loader-wrapper">
                    <SyncLoader color="#2ea8db" />
                  </div>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr key={item?._id}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>
                        <span
                          className="click-here-link"
                          onClick={() =>
                            navigate(`${SUPER_ADMIN_ASSIGN_BATCH}/${item?._id}`)
                          }
                        >
                          Click Here
                        </span>
                      </td>
                      <td>{item?.batchId}</td>
                      <td>{item?.batchName}</td>
                      <td>
                        <div
                          className="batch-proctoring-btn"
                          onClick={() =>
                            navigate(
                              `${SUPER_ADMIN_LIVE_MONITORING_PAGE}/${item?._id}`
                            )
                          }
                        >
                          <button>Live monitoring</button>
                        </div>
                      </td>
                      <td>
                        <div className="assesment-stats-btn">
                          <button onClick={() => handleStatus(item?._id)}>
                            Assessment Stats
                          </button>
                        </div>
                      </td>
                      <td>{item?.questionPaper?.primaryLanguage}</td>
                      <td>{item?.assesmentId}</td>
                      <td>{item?.jobRole}</td>
                      <td>{item?.examCenterId?.examCenterName}</td>
                      <td>{item?.startDate}</td>
                      <td>
                        {item?.proctoring?.imageProctor?.imageProctorStatus ===
                        true
                          ? "Enabled"
                          : "Disabled"}
                      </td>
                      <td>
                        {item.proctoring.imageProctor.imageProctoringTime
                          ? `${item?.proctoring?.imageProctor?.imageProctoringTime} sec`
                          : "NA"}
                      </td>
                      <td>
                        {item?.proctoring?.videoStream?.videoStreaming === true
                          ? "Enabled"
                          : "Disabled"}
                      </td>
                      <td>
                        {item.proctoring.videoStream.videoDuration
                          ? `${item?.proctoring?.videoStream?.videoDuration} sec`
                          : "NA"}
                      </td>
                      <td>
                        {item?.proctoring?.faceDetection === true
                          ? "Enabled"
                          : "Disabled"}
                      </td>
                      <td>
                        {item?.proctoring?.faceRecognition === true
                          ? "Enabled"
                          : "Disabled"}
                      </td>
                      <td>
                        {item?.questionPaper?.assesmentStatus === true
                          ? "Start"
                          : "Stop"}
                      </td>
                      <td>
                        {statusLoading && id == item?._id ? (
                          <PulseLoader size="10px" color="#0bbbfe" />
                        ) : (
                          <FormSwitch
                            value={item?.status}
                            onChange={(e) => handleStatusChange(e, item?._id)}
                          />
                        )}
                      </td>
                      <td style={{ textAlign: "center", position: "absolute" }}>
                        <div className="action-btn">
                          <ActionDropdown
                            actionOpen={actionOpen}
                            setActionOpen={setActionOpen}
                            deleteHandler={deleteHandler}
                            editBtnHandler={() => editBtnHandler(item?._id)}
                            MoreBtnHandler={MoreBtnHandler}
                            id={item._id}
                            actionId={actionId}
                            showDelete={item?.status}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>
                      <p>No Batch List Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <DeleteModal
        title="Deleting Batch"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      {sortedData && sortedData?.length > 0 && (
        <CustomTablePagination
          count={totalPages}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};

export default BatchList;

const getColumns = () => {
  const columns = [
    { name: "_id", label: "SNO." },
    { name: "assignedAssessment", label: "ASSIGNED ASSESSMENT" },
    { name: "batchId", label: "BATCH ID" },
    { name: "batchName", label: "BATCH NAME" },
    { name: "batchProctoring", label: "BATCH PROCTORING" },
    { name: "assesmentStats", label: "ASSESSMENT STATUS" },
    { name: "language", label: "LANGAUGE" },
    { name: "assessment", label: "ASSESSMENT" },
    { name: "jobRole", label: "JOB ROLE" },
    { name: "examCenter", label: "EXAMINATION CENTER" },
    { name: "examStartDate", label: "EXAM START DATE" },
    { name: "imageProctorStatus", label: "IMAGE PROCTOR" },
    { name: "imageProctorTime", label: "IMAGE PROCTOR TIME" },
    { name: "VideoStreaming", label: "VIDEO STREAMING" },
    { name: "videoDurationTime", label: "VIDEO DURATION TIME" },
    { name: "faceDetection", label: "FACE DETECTION" },
    { name: "faceRecognition", label: "FACE RECOGNITION" },
    { name: "AssessmentStatus", label: "ASSESSMENT STATUS" },
    { name: "status", label: "STATUS", sorting: false },
    { name: "actions", label: "ACTIONS", sorting: false },
  ];
  return columns;
};
