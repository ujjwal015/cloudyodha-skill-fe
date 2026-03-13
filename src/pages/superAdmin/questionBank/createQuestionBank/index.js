import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./module.createQuestionBank.css";
import { ReactComponent as PlusIcon } from "../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  // SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE,
  SUPER_ADMIN_QUESTION_BANK_PAGE,
} from "../../../../config/constants/routePathConstants/superAdmin";
import Table from "../../../../components/common/table";

import { ReactComponent as Uparrow } from "../../../../assets/images/common/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../../../assets/images/common/down-arrow.svg";
import { ReactComponent as ActionDots } from "../../../../assets/images/common/action-dots.svg";
import { ReactComponent as ApproveIcon } from "../../../../assets/images/pages/userManagement/approve-icon.svg";
import { ReactComponent as DeclineIcon } from "../../../../assets/images/pages/userManagement/decline-icon.svg";
import { FormSwitch } from "../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import { acceptOrRejectApi, getQuestionBankListApi, changeQuestionBankListStatus } from "../../../../api/authApi";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { USER_TYPE } from "../../../../config/constants/projectConstant";
import Input from "../../../../components/common/input";
import { Button, Card, CardActions, InputAdornment, TextField } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../../assets/icons/search-icon-grey.svg";
import { SyncLoader, PulseLoader, PropagateLoader } from "react-spinners";
import { exportData, getUserType, successToast } from "../../../../utils/projectHelper";
import TablePagination from "@mui/material/TablePagination";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { BorderColorOutlined, DeleteForever, } from "@mui/icons-material";
import { ReactComponent as EditBtn } from '../../../../assets/icons/edit-icon.svg'
import { ReactComponent as DeleteBtn } from '../../../../assets/icons/delete-icon.svg';
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { deleteQuestionBankFormApi, getQuestionBankSearchResultApi, getQuestionBankSearchResultNewApi } from "../../../../api/superAdminApi/questionBank";
import { clientSelector } from "../../../../redux/slicers/clientSlice";
import TransitionsModal from "../../../../components/common/Layout/SuperAdmin/DeleteModal/DeleteModal";
import { ActionDropdown } from "../../../../components/common/DropDown";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";

const CreateQuestionBank = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const { getQuestionBankList = {}, paginate } = useSelector(authSelector);
  const { searchResultsQuestionBank = {} } = useSelector(clientSelector)
  const { totalPages = 1, totalCount = 1 } = paginate;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionBtn, setActionBtn] = useState(null);
  const [showActionBtn, setShowActionBtn] = useState(false);

  // Delete Modal States=>
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);

  const getQuestionList = () => {
    dispatch(getQuestionBankListApi(setLoading, page + 1, rowsPerPage));
  }
  useEffect(() => {
    getQuestionList()
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (searchResultsQuestionBank.length > 0) {
      setSortedData(searchResultsQuestionBank)
    }
  }, [searchResultsQuestionBank])

  useEffect(() => {
    setSortedData(getQuestionBankList);
    setTotalPagesUser(totalPages);
  }, [getQuestionBankList, totalPages]);

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
      question_bank_id: id

    };
    dispatch(changeQuestionBankListStatus(formData, getQuestionList, setStatusLoading));
  };

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...getQuestionBankList]?.sort((a, b) => {
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
  }, [getQuestionBankList, sortOrders]);


  const newData = getQuestionBankList.map((item, index) => {
    const newItem = [];
    newItem["id"] = {
      value: index + 1,
    };
    newItem["userId"] = {
      value: 30100 + index,
    };
    newItem["questionBankId"] = {
      value: item?.questionBankId,
    };
    // newItem["userType"] = {
    //   value: getUserType(item?.userType),
    // };
    newItem["jobRole"] = {
      value: item?.jobRole,
    };
    newItem["jobLevel"] = {
      value: item?.jobLevel,
    };
    newItem["code"] = {
      value: item?.code,
    };
    newItem["sector"] = {
      value: item?.sector,
    };
    newItem["subSector"] = {
      value: item?.subSector,
    };
    newItem["schemeName"] = {
      value: item?.schemeName,
    };
    newItem["schemeCode"] = {
      value: item.schemeCode,
    };
    newItem["nos"] = {
      value: item.nos,

    };
    newItem["nosCode"] = {
      value: item.nosCode,
    };
    newItem["theoryMarks"] = {
      value: item.theoryMarks,
    };
    newItem["practicalMarks"] = {
      value: item.practicalMarks,
    };
    newItem["status"] = {
      value: "",
    };
    return newItem;
  });

  const handleChangeSearch = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value === '' || undefined) {
      setSortedData(getQuestionBankList);
    }
    const searchInterv = setTimeout(() => {
    }, 1500)
  }
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    
    if (searchQuery != "" || undefined) {
      setLoading(true)
      dispatch(getQuestionBankSearchResultNewApi(setLoading, searchQuery))
    }

  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit(event);
    }
  };
  const actionHandler = (id) => {
    setActionBtn(id);
    setShowActionBtn(!showActionBtn);
  };
  const confirmDelete = () => {
    dispatch(
      deleteQuestionBankFormApi(setLoading, setDeleteModal, actionId, getQuestionList)
    );
  };
  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const editBtnHandler = () => {
    setActionOpen(false);
    // navigate(`${SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE}/${actionId}`)
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

  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData(sortedData, columns));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table');

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: 'array' });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Question Bank List.xlsx');
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
          <h1>Question Bank Management</h1>
        </div>
        <div className="title-btn">
          <button
            // onClick={() => navigate(SUPER_ADMIN_CREATE_QUESTION_BANK_FORM_PAGE)}
          >
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
              style={{ background: "#F8F8F8", padding: "2px" }}
              onChange={handleChangeSearch}
              onKeyDown={handleKeyDown}
            />
            <button className="search-icon"
              onClick={handleSearchSubmit}>
              <SearchIcon style={{ color: "#231F20" }} />
            </button>
          </div>
          <div className="subadmin-btn">
            <button
              className="export-btn"
              onClick={loading ? undefined : handleExport}
            >
              {loading ? "loading..." : "Export"}
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
                {sortedData.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(page) * rowsPerPage + index + 1}</td>
                    <td>{item?.questionBankName}</td>
                    <td>{item.jobRole}</td>
                    <td>{item.jobLevel}</td>
                    <td>{item.code}</td>
                    <td>{item.sector}</td>
                    <td>{item.subSector}</td>
                    <td>{item.schemeName}</td>
                    <td>{item.questionType}</td>
                    <td>{item.nos}</td>
                    <td>{item.nosCode}</td>
                    <td>{item.theoryMarks}</td>
                    <td>{item.practicalMarks}</td>

                    <td>
                      {statusLoading && id === item._id ? (
                        {/* <PulseLoader size="10px" color="#0bbbfe" /> */ }
                      ) : (
                        <FormSwitch
                          value={item.status === "active" ? true : false}
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
                          editBtnHandler={editBtnHandler}
                          MoreBtnHandler={MoreBtnHandler}
                          id={item._id}
                          actionId={actionId}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <DeleteModal
        title="Delete Question Bank"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      <TablePagination
        component="div"
        count={totalPagesUser}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={"Items per page:"}
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

export default CreateQuestionBank;

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
                <div
                  className="title-arrow"
                  onClick={() => handleSortClick(column.name)}
                >
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
  { name: "Question Bank Name", label: "QUESTION BANK NAME" },
  { name: "jobRole", label: "JOB ROLE" },
  { name: "jobLevel", label: "JOB LEVEL" },
  { name: "code", label: "JOB CODE" },
  { name: "sector", label: "SECTOR" },
  { name: "subSector", label: "SUB-SECTOR" },
  { name: "schemeName", label: "SCHEME" },
  { name: "questionType", label: "QUESTION TYPE" },
  { name: "nos", label: "NOS NAME" },
  { name: "nosCode", label: "NOS CODE" },
  { name: "theoryMarks", label: "THEORY MARKS" },
  { name: "practicalMarks", label: "PRACTICAL MARKS" },
  { name: "status", label: "STATUS" },
  { name: "actions", label: "ACTIONS" },
];
