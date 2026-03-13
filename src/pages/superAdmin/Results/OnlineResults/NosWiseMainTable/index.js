import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import {
  NOS_WISE_RESULTS_PAGE,
  SUPER_ADMIN_CANDIDATE_RESULT_PREVIEW,
  SUPER_ADMIN_EDIT_QUESTION_FORM_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "../../../../../assets/icons/search-icon-grey.svg";
import { Button, InputAdornment, TextField } from "@mui/material";
import {
  exportData,
  getSubRole,
  userRoleType,
} from "../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../../components/common/DropDown";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import {
  changeSingleQbFormStatusApi,
  deleteSingleQbFormApi,
  getNOSListVivaPracticalApi,
  getAllNosListApi,
} from "../../../../../api/superAdminApi/questionBank";
import FilterModal from "../../../../../components/common/Modal/FilterModal";
import validateField from "../../../../../utils/validateField";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";
import {
  getCandidatesResultsByBatchApi,
  getNOSWiseResultApi,
  getResultsByBatchApi,
  getSingleCandidateResultOfflineApi,
  getSingleCandidateResultOnlineApi,
} from "../../../../../api/superAdminApi/misResults";
import {
  getCandidateDetailsNOSWiseOffline,
  misResultsSelector,
} from "../../../../../redux/slicers/superAdmin/misResults";
import { CANDIDATE_RESULTS_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import { ReactComponent as ArrowLeft } from "./../../../../../assets/icons/chevron-left.svg";

const UserManagementList = () => {
  const initialFormValues = {
    F_status: "",
    from: "",
    to: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [section, setSection] = useState();
  const [expandedRows, setExpandedRows] = useState([]);

  // tabs
  const { userInfo = {} } = useSelector(authSelector);
  const { CandidateDetailsNOSWiseOffline = [] } =
    useSelector(misResultsSelector);

  // permission
  const { RESULTS_FEATURE, RESULTS_SUB_FEATURE_1 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = RESULTS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = RESULTS_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const params = useParams();

  const getList = () => {
    dispatch(getCandidateDetailsNOSWiseOffline([]));
    dispatch(
      getSingleCandidateResultOnlineApi(
        setLoading,
        params?.batchID,
        params?.candID
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    getList();
  }, [page, limit, section]);

  useEffect(() => {
    setSortedData(
      CandidateDetailsNOSWiseOffline.length > 0
        ? CandidateDetailsNOSWiseOffline
        : []
    );
    setTotalPagesUser(totalPages);
  }, [CandidateDetailsNOSWiseOffline, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...CandidateDetailsNOSWiseOffline].sort((a, b) => {
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
  }, [CandidateDetailsNOSWiseOffline, sortOrders]);

  const exportClientData = () => {
    const exportData = CandidateDetailsNOSWiseOffline[0]?.nosResult.map(
      (item) => { 
        // console.log(item);
        return {
          nosName: item?.nosName,
          theoryMarks: item?.obtainedTheoryMarks,
          practicalMarks: item?.obtainedPracticalMarks,
          vivaMarks: item?.obtainedVivaMarks,
          totalMarks: item?.totalObtainedMarks,
        };
      }
    );
    const grandTotalRow = {
      nosName: "Grand Total",
      theoryMarks: exportData.reduce((acc, item) => acc + (item.theoryMarks || 0), 0),
      practicalMarks: exportData.reduce((acc, item) => acc + (item.practicalMarks || 0), 0),
      vivaMarks: exportData.reduce((acc, item) => acc + (item.vivaMarks || 0), 0),
      totalMarks: exportData.reduce((acc, item) => acc + (item.totalMarks || 0), 0),
      NOS_Total_Marks: `${CandidateDetailsNOSWiseOffline[0]?.obtainedGrandTotalMarks}/${CandidateDetailsNOSWiseOffline[0]?.grandTotalMarks} (${CandidateDetailsNOSWiseOffline[0]?.percentage || 0}%)`,
    };

    exportData.push(grandTotalRow);
    return exportData;
  };
  console.log("soreddat", sortedData[0])

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();
    const exportDataWithGrandTotal = exportClientData();
    const columns = getColumns();
    const formattedData = exportDataWithGrandTotal.map((row) => {
    const formattedRow = {};
    columns.forEach((col) => {
      formattedRow[col.label] = row[col.name];  // Map data keys to column labels
    });
    return formattedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${
        CandidateDetailsNOSWiseOffline[0]?.candidateName || "Candidate"
      } Result NOS.xlsx`
    );

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });

    CandidateDetailsNOSWiseOffline.length > 0 &&
      saveAs(
        blob,
        `${
          CandidateDetailsNOSWiseOffline[0]?.candidateName || "Candidate"
        } Result NOS.xlsx`
      );
  };

  return (
    <div className="main-content">
      <div className="title">
        <div className="back_button_wrapper">
          <ArrowLeft
            onClick={() =>
              navigate(`${NOS_WISE_RESULTS_PAGE}/${params?.batchID}`)
            }
          />
          {sortedData.length > 0 && (
            <h1>{`Batch/${sortedData[0]?.batchId || "-"}/${
              sortedData[0]?.batch_mongo_id?.questionPaper?.primaryLanguage
                .charAt(0)
                .toUpperCase() +
                sortedData[0]?.batch_mongo_id?.questionPaper?.primaryLanguage.slice(
                  1
                ) || "-"
            }/${sortedData[0]?.candidateName || "-"}`}</h1>
          )}
        </div>
      </div>

      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="subadmin-btn_new">
            <div className="single_export_wrapper">
              {isRolePermission?.permissions?.["5"] && (
                <button
                  className="export-btn"
                  onClick={
                    loading || sortedData?.length == 0
                      ? undefined
                      : handleExport
                  }
                >
                  {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>JOBROLE NAME</th>
                <th>QPCODE</th>
                <th>VERSION</th>
                <th>LEVEL</th>
                <th></th>
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
                {sortedData[0]?.jobRoleWiseDistribution ? (
                  <>
                    {sortedData[0]?.jobRoleWiseDistribution?.map((jobRole, index) => (
                      <React.Fragment key={index}>
                        {/* Job Role Header Row */}
                        <tr 
                          className="job-role-row cursor-pointer"
                          onClick={() => {
                            setExpandedRows(prev => {
                              if (prev.includes(index)) {
                                return prev.filter(item => item !== index);
                              } else {
                                return [...prev, index];
                              }
                            });
                          }}
                        >
                          <td className="font-medium">
                            <div className="flex items-center gap-2">
                              <span className={`arrow-icon ${expandedRows.includes(index) ? 'expanded' : ''}`}>
                                ▶
                              </span>
                              {jobRole?.jobRoleName || "NA"}
                            </div>
                          </td>
                          <td>{jobRole?.qpCode || "NA"}</td>
                          <td>{jobRole?.version || "NA"}</td>
                          <td>{jobRole?.level || "NA"}</td>
                          <td></td>
                        </tr>

                        {/* Expanded NOS Details */}
                        {expandedRows.includes(index) && (
                          <>
                            {/* NOS Header */}
                            <tr className="nos-header">
                              <td>NOS Name</td>
                              <td>Theory marks</td>
                              <td>Practical marks</td>
                              <td>Viva marks</td>
                              <td>Total marks</td>
                            </tr>
                            
                            {/* NOS Items */}
                            {sortedData[0]?.nosResult?.map((nos, nosIndex) => (
                              <tr key={nosIndex} className="nos-row">
                                <td className="pl-8">{nos?.nosName}</td>
                                <td>{nos?.obtainedTheoryMarks ?? 0 + "/" + nos?.theoryMarks}</td>
                                <td>{nos?.obtainedPracticalMarks ?? 0 + "/" + nos?.practicalMarks}</td>
                                <td>{nos?.obtainedVivaMarks ?? 0 + "/" + nos?.vivaMarks}</td>
                                <td>
                                {nos?.totalObtainedMarks ?? 0 + "/" + nos?.totalMarks}
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <tr className="no-list-table">
                    <td colSpan="5">
                      <p>No Results Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      <div className="total_details_container">
        <div className="summary_wrapper">
          <h1>NOS Total Marks:</h1>
          {sortedData[0]?.nosResult && (
            <h1>{`${sortedData[0]?.obtainedGrandTotalMarks}/${
              sortedData[0]?.grandTotalMarks || ""
            } (${sortedData[0]?.percentage || ""})`}</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementList;

const getColumns = () => {
  let columns = [
    // { name: "_id", label: "S.No." },
    { name: "nosName", label: "NOS Name" },
    { name: "theoryMarks", label: "Theory Marks" },
    { name: "practicalMarks", label: "Practical Marks" },
    { name: "vivaMarks", label: "Viva Marks" },
    { name: "totalMarks", label: "Total" },
  ];
  return columns;
};
