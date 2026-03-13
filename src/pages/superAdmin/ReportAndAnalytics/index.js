import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import "./style.css";
import "../questionBank/createQuestionBank/module.createQuestionBank.css";
import { ReactComponent as Uparrow } from "../../../assets/images/common/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../../assets/images/common/down-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { getCandidateResultApi } from "../../../api/authApi";
import { authSelector } from "../../../redux/slicers/authSlice";
import { TextField } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../assets/icons/search-icon.svg";
import { SyncLoader, PulseLoader, PropagateLoader } from "react-spinners";
import TablePagination from "@mui/material/TablePagination";
import Table from "../../../components/common/table";
import { SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW } from "../../../config/constants/routePathConstants/superAdmin";
import {
  getResultColor,
  getResultTextColor,
} from "../../../utils/projectHelper";

import { exportData } from "../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
const CandidateResult = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [candidate, setCandidate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { candidateResult = [], paginate } = useSelector(authSelector);
  const { totalPages = 1, totalCount = 1 } = paginate;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalPagesUser, setTotalPagesUser] = useState(0);

  useEffect(() => {
    setCandidate(candidateResult?.candidateDetails);
    setTotalPagesUser(totalPages);
  }, [totalPages, candidate, candidateResult]);

  useEffect(() => {
    dispatch(getCandidateResultApi(setLoading, page + 1, "", rowsPerPage));
  }, [page, rowsPerPage]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...candidate].sort((a, b) => {
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
        setCandidate(sortedData);
      }
    };

    sortData();
  }, [candidate, sortOrders]);

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "")
      dispatch(
        getCandidateResultApi(setLoading, page + 1, searchQuery, rowsPerPage)
      );
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value == "") {
      dispatch(getCandidateResultApi(setLoading, page + 1, "", rowsPerPage));
    }
    setSearchQuery(value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };

  const handlerViewResult = (id) => {
    setId(id);
    navigate(`${SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW}/${id}`);
  };
  const exportCandidateData = () => {
    const exportData = candidate?.map((item) => {
      return {
        _id: item?._id,
        batch: item?._id ?? "",
        jobRole: item?.candidateId.jobRole,
        name: item?.candidateId.name,
        contactNumber: item?.candidateId.contactNumber,
        date: "03 May 2023",
        totalMarks: item?.assesmentId?.totalMarks,
        totalObtainMarks: item?.totalObtainMarks,
        passingPercentage: item?.assesmentId?.passingPercentage,
        percentageScored: item?.passingPercentage
          ? item?.passingPercentage + "&"
          : "",
        passedStatus: item?.passedStatus,
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
    saveAs(blob, "Candidate Result List.xlsx");
  };
  return (
    <div className="main-content">
      <div className="title">
        <div className="title-text">
          <h1>Candidate Result</h1>
        </div>
      </div>
      <div className="subadmin-table">
        <div className="subadmin-header">
          <div
            className="search-input"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search by Id, Name etc"
              style={{ background: "#F8F8F8" }}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              sx={{ marginRight: "10px" }}
            />
            <span
              style={{
                backgroundColor: "#2ea8db1a",
                padding: "8px 10px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              onClick={(e) => {
                handleSearchSubmit(e);
              }}
            >
              <SearchIcon />
            </span>
          </div>
          <div className="subadmin-btn">
            {/* <button className="filter-btn">Filters</button> */}
            <button
              className="export-btn"
              onClick={candidate?.length > 0 ? handleExport : undefined}
            >
              Export
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
                  <div className="sync-loader-wrapper">
                    <PropagateLoader color="#2ea8db" />
                  </div>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {candidate?.length > 0 ? (
                  candidate?.map((item, index) => (
                    <tr key={item?._id}>
                      <td>{page * rowsPerPage + (index + 1)}</td>
                      <td>{1001 + index}</td>
                      <td>{item?.candidateId.jobRole}</td>
                      <td>{item?.candidateId.name}</td>
                      <td>{item?.candidateId.contactNumber}</td>
                      <td>03 May 2023</td>
                      <td>{item?.assesmentId?.totalMarks}</td>
                      <td>{item?.totalObtainMarks}</td>
                      <td>{item?.assesmentId?.passingPercentage}</td>
                      <td>{item?.passingPercentage}%</td>
                      <td>
                        <div
                          style={{
                            backgroundColor: getResultColor(item?.passedStatus),
                            color: getResultTextColor(item?.passedStatus),
                            width: "80px",
                            textAlign: "center",
                            borderRadius: "5px",
                            padding: "5px 10px",
                            fontWeight: 500,
                          }}
                        >
                          {item?.passedStatus}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            fontSize: "12px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            gap: 3,
                            cursor: "pointer",
                            color: "skyblue",
                          }}
                          onClick={() => {
                            handlerViewResult(item?._id);
                          }}
                        >
                          View Details
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>
                      <p>No Result Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
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
        rowsPerPageOptions={[50, 100, 200, 500, 1000]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => {
          const totalPages = Math.ceil(count / rowsPerPage);
          return `${page + 1} of ${count} pages`;
        }}
      />
    </div>
  );
};

export default CandidateResult;

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
  { name: "_id", label: "S No." },
  { name: "batch", label: "Batch" },
  { name: "jobRole", label: "Job Role" },
  { name: "name", label: "Name" },
  { name: "contactNumber", label: "Contact No." },
  { name: "date", label: "Exam Date" },
  { name: "totalMarks", label: "Total Marks" },
  { name: "totalObtainMarks", label: "Obtain Marks" },
  { name: "passingPercentage", label: "passing %" },
  { name: "percentageScored", label: "Percentage Scored" },
  { name: "passedStatus", label: "Result" },
  { name: "resultStatus", label: "Result Status" },
];
