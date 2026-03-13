import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import "./style.css";
import {
  LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH,
   LOGS_MANAGEMENT_PROCTOR_THEORY_BY_CANDIDATE_PATH,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { FormSwitch } from "../../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import { deleteClientDetails } from "../../../../../api/superAdminApi/clientManagement";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { PropagateLoader, ClipLoader } from "react-spinners";
import { ReactComponent as ArrowLeft } from "../../../../../assets/icons/chevron-left.svg";
import { TextField } from "@mui/material";
import {
  getSubRole,
  userRoleType,
} from "../../../../../utils/projectHelper";

import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../../redux/slicers/authSlice";

import {
  getCandidateByBatchId,

} from "../../../../../api/superAdminApi/examManagement";
import { examManagementSelector, getSectionTableList } from "../../../../../redux/slicers/superAdmin/examManagementSlice";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";
import { downloadCandidateLogsByBatchId } from "../../../../../api/superAdminApi/proctorManagement";






const CandidateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnloading,setBtnLoading]=useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const { userInfo } = useSelector(authSelector);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
 
  const { batchId } = useParams();

  const { candiateByBatch = [], exportCandaiteList = [],sectionTableList=[] } = useSelector(
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
      getCandidateByBatchId(
        batchId,
        setLoad,
        page,
        limit,
        setTotalPages,
        searchQuery
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



  const handleNaviageProctorLogs = (e, data) => {
    e.preventDefault();
    const sectionWiseData = sectionTableList?.reduce((acc, section) => {
      acc[section.sectionName] = {
        sectionName: section.sectionName,
        isSelected: section.isSelected,
        _id: section._id
      };
      return acc;
    }, {});
    dispatch(getSectionTableList(sectionWiseData));
    const selectedSection = Object.values(sectionWiseData).find(section => section.isSelected);
    navigate(
      `${LOGS_MANAGEMENT_PROCTOR_THEORY_BY_CANDIDATE_PATH}/${batchId}/${data?._id}?section=${selectedSection.sectionName}`,
        { state: { batchMode: data?.batchMode,
          sectionWiseData:sectionWiseData
        } }
    );
  };

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
          setTotalPages,
          ""
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
        setTotalPages,
        searchQuery
      )
    );
    setPage(1);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
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

  const handleDownloadProctorLogsByBatchId = () => {
    setBtnLoading(true)
    dispatch(downloadCandidateLogsByBatchId(batchId, setBtnLoading));
  }

  return (
    <>
      <div className="main-content">
        <div className="title">
          <h1>
            <ArrowLeft
              onClick={() =>
                navigate(LOGS_MANAGEMENT_PROCTOR_ACTIVITY_LOGS_BATCHS_LIST_PATH)
              }
            />
            <span>Candidate List</span>
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
            <div className="search-input">
              <div className="assesment-stats-btn">
                <button
                  className="table-green-btn"
                  onClick={
                    handleDownloadProctorLogsByBatchId
                  }
                  disabled={btnloading}
                >
                  {btnloading ? "Downloading" : "Download Logs"}
                </button>
              </div>
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
                        <td>{item?.batchId || "NA"}</td>
                        <td>{item?.userName || "NA"}</td>
                        <td>{item?.candidateId || "NA"}</td>
                        <td>{item?.name || "NA"}</td>

                        <td style={{ textAlign: "center" }}>
                          <button
                            className={item.isSuspiciousTheory||item.isSuspiciousVivaPractical?"table-green-btn":"table-grey-btn"}
                            value={item?.status}
                            onClick={(e) =>
                              handleNaviageProctorLogs(e, item)
                            }
                            disabled={!(item.isSuspiciousTheory || item.isSuspiciousVivaPractical)} 
                          >
                            View Logs
                          </button>
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
  { name: "batchId", label: "Batch ID" },
  { name: "userName", label: "Username" },
  { name: "candidateId", label: "Candidate ID (SIP)" },
  { name: "name", label: "Candidate Name" },
  { name: "viewLogs", label: "View Logs" },
];
