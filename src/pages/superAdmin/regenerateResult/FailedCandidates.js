import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import { TableHeader } from "../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../components/common/customPagination";
import { PropagateLoader, ClipLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "../../../assets/icons/search-icon-grey.svg";
import { InputAdornment, TextField } from "@mui/material";
import {
  errorToast,
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { authSelector } from "../../../redux/slicers/authSlice";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import {
  getFailedCandidatesResultsByBatchApi,
  regenerateReseltByBatchIdApi,
} from "../../../api/superAdminApi/misResults";
import { misResultsSelector } from "../../../redux/slicers/superAdmin/misResults";
import { ReactComponent as ArrowLeft } from "../../../assets/icons/chevron-left.svg";
import ConfirmModal from "./ConfirmModal";

const FailedCandidates = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // tabs
  const { userInfo = {} } = useSelector(authSelector);
  const { failedCandidateResults = [] } = useSelector(misResultsSelector);

  // permission
  const { RESULTS_FEATURE, RESULTS_SUB_FEATURE_1 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = RESULTS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = RESULTS_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const params = useParams();

  const getList = () => {
    setSelectAllChecked(false);
    setSelectedRows(new Set());
    dispatch(
      getFailedCandidatesResultsByBatchApi(
        setLoading,
        params.batchId,
        page,
        searchQuery,
        limit,
        setTotalPages
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    getList();
  }, [page, limit]);

  useEffect(() => {
    setSortedData(
      failedCandidateResults.length > 0 ? failedCandidateResults : []
    );
    setTotalPagesUser(totalPages);
  }, [failedCandidateResults, totalPages]);

  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        getList();
      }, 500);

      return () => clearTimeout(getData);
    }
  }, [searchQuery]);

  const handleSelectRow = (rowId) => {
    setSelectedRows((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedRows(new Set());
    } else {
      const allRows = new Set(failedCandidateResults.map((item) => item?._id));
      setSelectedRows(allRows);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...failedCandidateResults].sort((a, b) => {
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
  }, [failedCandidateResults, sortOrders]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "") {
      setLoading(true);
      dispatch(
        getFailedCandidatesResultsByBatchApi(
          setLoading,
          params.batchId,
          page,
          searchQuery,
          limit,
          setTotalPages
        )
      );
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setLoading(true);
      dispatch(
        getFailedCandidatesResultsByBatchApi(
          setLoading,
          params.batchId,
          page,
          "",
          limit,
          setTotalPages
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
  const exportClientData = () => {
    const exportData = failedCandidateResults?.map((item) => {
      return {
        candidateId: item?.candidateId,
        name: item?.name,
        userName: item?.userName,
        theoryMarks: `${item?.obtainedTotalTheoryMarks} /${item?.totalTheoryMarks}`,
        passingPercentage: item?.passingPercentage,
        scoredPercentage: item?.percentage,
        result: item?.result,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Candidate List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "First console.xlsx");
  };

  const handleRegenerateResult = async () => {
    setShowConfirmModal(false);
    const payload = {
      batchId: params.batchId,
      candidateIds: [...selectedRows],
    };
    setLoading(true);
    dispatch(
      regenerateReseltByBatchIdApi(
        setLoading,
        payload,
        setSelectedRows,
        getList
      )
    );
  };

  const onRegenerateResultClick = () => {
    if (selectedRows?.size <= 0) {
      errorToast("Please select atleast one candidate");
      return;
    }
    setShowConfirmModal(true);
  };

  return (
    <div className="main-content">
      <div className="title">
        <div className="back_button_wrapper">
          <ArrowLeft onClick={() => navigate(-1)} />
          {/* <h1>Candidate Results</h1> */}
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
            <button
              className="light-blue-btn"
              onClick={onRegenerateResultClick}
            >
              {loading ? <ClipLoader size={14} color="#24273" /> : "Proceed"}
            </button>
            <button
              className="export-btn"
              onClick={
                exportLoading || sortedData?.length == 0
                  ? undefined
                  : handleExport
              }
            >
              {exportLoading ? (
                <ClipLoader size={14} color="#24273" />
              ) : (
                "Export"
              )}
            </button>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {getColumns(isRolePermission)?.map(({ name, label }) => {
                  return (
                    <th key={name}>
                      <div className="subadmin-title">
                        {label === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={selectAllChecked}
                            onChange={handleSelectAll}
                          />
                        ) : (
                          <p>{label}</p>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
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
                    <tr key={item?._id} className="main_row">
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(item?._id)}
                          onChange={() => handleSelectRow(item?._id)}
                        />
                      </td>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>{item?.candidateId || "NA"}</td>
                      <td>{item?.name || "NA"}</td>
                      <td>{item?.userName || "NA"}</td>
                      <td>
                        {`${item?.obtainedTotalTheoryMarks ?? 0}/${
                          item?.totalTheoryMarks ?? "0"
                        }`}
                      </td>
                      <td>
                        {item?.passingPercentage
                          ? `${item?.passingPercentage} %`
                          : "NA"}
                      </td>
                      <td>{item?.percentage ? item?.percentage : "NA"}</td>
                      <td
                        style={{
                          color: [
                            item?.result === "Fail"
                              ? "red"
                              : item?.result === "Pass"
                              ? "#026e00"
                              : "",
                          ],
                        }}
                      >
                        {
                          <div
                            className="result_wrapper"
                            style={{
                              background: [
                                item?.result === "Fail"
                                  ? "#EDE0D4"
                                  : item?.result === "Pass"
                                  ? "#EFFDEE"
                                  : "",
                              ],
                            }}
                          >
                            {item?.result || "-"}
                          </div>
                        }
                      </td>
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

      <div
        style={{
          display: [totalPages > 0 ? "" : "none"],
        }}
      >
        <CustomTablePagination
          count={totalPagesUser}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <ConfirmModal
        visible={showConfirmModal}
        onCancel={() => {
          setShowConfirmModal(false);
        }}
        onConfirm={handleRegenerateResult}
      />
    </div>
  );
};

export default FailedCandidates;

const getColumns = () => {
  let columns = [
    { name: "_id", label: "checkbox" },
    { name: "_id", label: "S.NO" },
    { name: "candidateId", label: "Candidate ID" },
    { name: "name", label: "Name" },
    { name: "userName", label: "Username" },
    { name: "theoryMarks", label: "Theory Marks" },
    { name: "passingPercentage", label: "Passing %" },
    { name: "scoredPercentage", label: "Scored %" },
    { name: "result", label: "Result" },
  ];
  return columns;
};
