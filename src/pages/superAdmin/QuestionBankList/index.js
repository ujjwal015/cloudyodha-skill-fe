import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../questionBank/createQuestionBank/module.createQuestionBank.css";
import { ReactComponent as PlusIcon } from "../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  SUPER_ADMIN_BULK_UPLOAD_QUESTION,
  SUPER_ADMIN_QUESTION_ADD,
  SUPER_ADMIN_QUESTION_BANK_PAGE,
  SUPER_ADMIN_QUESTION_PREVIEW_PAGE,
  SUPER_ADMIN_SECTION_EDIT_PAGE,
} from "../../../config/constants/routePathConstants/superAdmin";

import { ReactComponent as Uparrow } from "../../../assets/images/common/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../../assets/images/common/down-arrow.svg";
import { ReactComponent as UploadIcon } from "../../../assets/icons/upload-cloud.svg";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { FormSwitch } from "../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionListApi, changeQuestionListStatusApi } from "../../../api/authApi";
import { authSelector } from "../../../redux/slicers/authSlice";
import { Button, Card, CardActions, InputAdornment, TextField } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../assets/icons/search-icon-grey.svg";
import { SyncLoader, PulseLoader, PropagateLoader } from "react-spinners";
import TablePagination from "@mui/material/TablePagination";
import Table from "../../../components/common/table";
import { exportData, getLocal, successToast } from "../../../utils/projectHelper";
import { deleteSectionApi, getSectionDetailsByJobRoleApi } from "../../../api/superAdminApi/questionBank";
import { clientSelector } from "../../../redux/slicers/clientSlice";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DeleteModal from "../../../components/common/Modal/DeleteModal";
import { ActionDropdown } from "../../../components/common/DropDown";

const QuestionBankList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");

  const { getQuestionList = {}, paginate } = useSelector(authSelector);
  const { sectionsByJobRole = {} } = useSelector(clientSelector);
  const { totalPages = 1, totalCount = 1 } = paginate;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionBtn, setActionBtn] = useState(null);
  const [showActionBtn, setShowActionBtn] = useState(false);

  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const location=useLocation();

  const [deleteModal, setDeleteModal] = useState(false);

  const getList = () => {
    dispatch(getQuestionListApi(setLoading, page + 1, rowsPerPage));
  };

  useEffect(() => {
    getList();
  }, [page, rowsPerPage]);

  useEffect(() => {
    setSortedData(getQuestionList);
    setTotalPagesUser(totalPages);
  }, [getQuestionList, totalPages]);

  useEffect(() => {
    if (sectionsByJobRole.length > 0) {
      setSortedData(sectionsByJobRole);
    }
  }, [sectionsByJobRole]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (e, id) => {
    setStatusLoading(false);
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(id);
    const formData = {
      status: value,
      section_id: id,
    };
    // setStatusLoading(true);
    dispatch(changeQuestionListStatusApi(formData, getQuestionList, setStatusLoading));
  };

  const handleQuestionPreview = (id) => {
    setId(id);
    navigate(`${SUPER_ADMIN_QUESTION_PREVIEW_PAGE}/${id}`);
  };

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find((columnName) => sortOrders[columnName] !== null);
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...getQuestionList].sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
          } else {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
          }
        });
        setSortedData(sortedData);
      }
    };

    sortData();
  }, [getQuestionList, sortOrders]);

  const handleChangeSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "" || undefined) {
      setSortedData(getQuestionList);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery !== "" || undefined) {
      setLoading(true);
      dispatch(getSectionDetailsByJobRoleApi(setLoading, searchQuery));
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };
  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    dispatch(deleteSectionApi(setLoading, setDeleteModal, actionId, getList));
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const actionHandler = (id) => {
    setActionBtn(id);
    setShowActionBtn(!showActionBtn);
  };
  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const editBtnHandler = () => {
    setShowActionBtn(false);
    navigate(`${SUPER_ADMIN_SECTION_EDIT_PAGE}/${actionId}`);
  };

  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData(sortedData, columns));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Question Bank Sections List.xlsx");
  };

  return (
    <div className="main-content">
      <div className="title">
        <div className="title-text">
          <KeyboardBackspaceOutlinedIcon
            sx={{ marginRight: "10px", cursor: "pointer", fontSize: "20px" }}
            onClick={() => {
              navigate(SUPER_ADMIN_QUESTION_BANK_PAGE);
            }}
          />
          <h1>Question List</h1>
        </div>
        <div className="title-btn">
          <button onClick={() => navigate(SUPER_ADMIN_BULK_UPLOAD_QUESTION)} style={{ marginRight: "15px" }}>
            <UploadIcon />
            <span>Upload Bulk Questions</span>
          </button>
          <button onClick={() => navigate(SUPER_ADMIN_QUESTION_ADD)}>
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
              style={{ background: "#F8F8F8" }}
              onChange={handleChangeSearch}
              onKeyDown={handleKeyDown}
            />
            <button className="search-icon" onClick={handleSearchSubmit}>
              <SearchIcon style={{ color: "#231F20" }} />
            </button>
          </div>
          <div className="subadmin-btn">
            <button className="export-btn" onClick={loading ? undefined : handleExport}>
              {loading ? "loading..." : "Export"}
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <TableHeader columns={columns} sortOrders={sortOrders} setSortOrders={setSortOrders} />
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
                    <tr key={item._id}>
                      <td>{page * rowsPerPage + index + 1}</td>
                      <td>{item.question_bank_id?.questionBankId}</td>
                      <td>{item.question_bank_id?.questionBankName}</td>
                      <td>{item.jobRole}</td>
                      <td>{item.questionType}</td>
                      <td>{item.nos}</td>
                      <td>{item.section}</td>
                      <td>{item.language == 2 ? "Hindi" : "English"}</td>

                      <td>
                        <div
                          style={{
                            backgroundColor: "#2ea8db26",
                            display: "inline-flex",
                            textAlign: "center ",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "2px 10px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            gap: 3,
                            cursor: "pointer",
                            color: "skyblue",
                          }}
                          onClick={() => {
                            handleQuestionPreview(item._id);
                          }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: "14px", verticalAlign: "middle" }} />
                          Preview
                        </div>
                      </td>

                      <td>
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
                      <td>
                        <div className="action-btn">
                          <ActionDropdown
                            actionOpen={actionOpen}
                            setActionOpen={setActionOpen}
                            deleteHandler={deleteHandler}
                            editBtnHandler={editBtnHandler}
                            MoreBtnHandler={MoreBtnHandler}
                            id={item._id}
                            actionId={actionId}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>
                      <p>No List Found</p>
                    </td>
                  </tr>
                )}
                {}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <DeleteModal
        title="Delete Question Bank Section"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      <TablePagination
        component="div"
        count={totalPagesUser}
        page={page}
        labelRowsPerPage={"Items per page:"}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        backIconButtonProps={{ disabled: page === 0 }}
        nextIconButtonProps={{
          disabled: (page + 1) * rowsPerPage >= totalCount,
        }}
        rowsPerPageOptions={[2, 3, 10, 15, 20]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => {
          const totalPages = Math.ceil(count / rowsPerPage);
          return `${page + 1} of ${count} pages`;
        }}
      />
    </div>
  );
};

export default QuestionBankList;

function TableHeader({ columns, sortOrders, setSortOrders }) {
  const handleSortClick = (columnName) => {
    const sortOrder = sortOrders[columnName] === "asc" ? "desc" : "asc";
    setSortOrders({ [columnName]: sortOrder });
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => {
          return (
            <th key={column.name}>
              <div className="subadmin-title">
                <p>{column.label}</p>
                <div className="title-arrow" onClick={() => handleSortClick(column.name)}>
                  {sortOrders[column.name] === "asc" && (
                    <button className="up-arrow">
                      <Uparrow />
                    </button>
                  )}
                  {sortOrders[column.name] !== "asc" && (
                    <button className="up-arrow grayed-out">
                      <Uparrow />
                    </button>
                  )}
                  {sortOrders[column.name] === "desc" && (
                    <button className="down-arrow">
                      <Downarrow />
                    </button>
                  )}
                  {sortOrders[column.name] !== "desc" && (
                    <button className="down-arrow grayed-out">
                      <Downarrow />
                    </button>
                  )}
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

const columns = [
  { name: "id", label: "S.NO" },
  { name: "questionId", label: "QUESTION ID" },
  { name: "questionBankName", label: "QUESTION Bank Name" },
  { name: "jobRole", label: "JOB ROLE" },
  { name: "questionType", label: "QUESTION TYPE" },
  { name: "nos", label: "NOS" },
  { name: "section", label: "SECTION" },
  { name: "languageAvailability", label: "LANGUAGE AVAILABILITY" },
  { name: "question", label: "QUESTION" },
  { name: "status", label: "STATUS" },
  { name: "actions", label: "ACTIONS" },
];
