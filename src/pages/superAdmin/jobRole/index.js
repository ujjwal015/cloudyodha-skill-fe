import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../assets/images/pages/clientManagement/plus-icon.svg";
import { BDA_JOB_ROLE_CREATE_PAGE } from "../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../components/common/table";
import { FormSwitch } from "../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import { clientManagementSelector } from "../../../redux/slicers/superAdmin/clientManagement";
import CustomTablePagination from "../../../components/common/customPagination";
import { ClipLoader, PropagateLoader, PulseLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "./../../../assets/icons/search-icon-grey.svg";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  exportData,
  getLocal,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../components/common/DropDown";
import DeleteModal from "../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../redux/slicers/authSlice";
import {
  changeStatusJobRoleApi,
  deleteJobRoleApi,
  getAllJobRoles,
} from "../../../api/superAdminApi/jobRoleManagement";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";

const JobRoles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location=useLocation();
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  console.log("search@ueryy",searchQuery)
  const { jobRolesListAll = {} } = useSelector(clientManagementSelector);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionBtn, setActionBtn] = useState(null);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const { userInfo = {} } = useSelector(authSelector);
  const selectedClient=getLocal("SelectedClient");

  useEffect(()=>{
    setSearchQuery(selectedClient)
  },[selectedClient])

  // permission
  const { JOB_ROLE_MANAGEMENT_FEATURE, JOB_ROLE_MANAGEMENT_LIST_FEATURE } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = JOB_ROLE_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = JOB_ROLE_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = (setStatusBtnLoading) => {
    const setLoad = setStatusBtnLoading ? setStatusBtnLoading : setLoading;
    setLoading(true);
    dispatch(getAllJobRoles(setLoad, page, limit, searchQuery, setTotalPages));
  };

  useEffect(() => {
    getList();
  }, [page, limit]);

  useEffect(() => {
    setSortedData(jobRolesListAll);
    setTotalPagesUser(totalPages);
  }, [jobRolesListAll, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...jobRolesListAll].sort((a, b) => {
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
  }, [jobRolesListAll, sortOrders]);

  const handleStatusChange = (e, id) => {
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(id);
    const formData = {
      job_role_id: id,
      status: checked,
    };
    dispatch(changeStatusJobRoleApi(id, formData, getList));
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
      dispatch(getAllJobRoles(setLoading));
    }
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") setLoading(true);
    dispatch(getAllJobRoles(setLoading, 1, limit, searchQuery, setTotalPages));
    setPage(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };
  const exportClientData = () => {
    const exportData = jobRolesListAll?.map((item) => {
      return {
        clientName: item?.clientId?.clientname,
        jobRole: item?.jobRole,
        qpCode: item?.qpCode,
        status: item?.status,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "JobRoles List.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    dispatch(deleteJobRoleApi(setLoading, setDeleteModal, actionId, getList));
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
    navigate(`${BDA_JOB_ROLE_CREATE_PAGE}/${actionId}`);
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      getList();
    }, 500);

    return () => clearTimeout(getData);
  }, [searchQuery]);

  return (
    <div className="main-content">
      <div className="title" style={{ display: "block" }}>
        <div
          className="title_JobRole"
          style={{ justifyContent: "space-between" }}
        >
          <h1>Job Roles List</h1>
          <div className="title-btn">
            {isRolePermission?.permissions?.["2"] && (
              <button onClick={() => navigate(BDA_JOB_ROLE_CREATE_PAGE)}>
                <PlusIcon />
                <span>Add New</span>
              </button>
            )}
          </div>
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
              onChange={handleChangeSearch}
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
            {/* <button
              className={`${searchQuery == "" ? "disabled" : ""} search-icon`}
              onClick={handleSearch}
            >
              <SearchIcon style={{ color: "#231F20" }} />
            </button> */}
          </div>
          <div className="subadmin-btn">
            {/* <button className="filter-btn">
              Filter
            </button> */}
            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={
                  loading || sortedData?.length == 0 ? undefined : handleExport
                }
              >
                {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
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
                  sortedData?.map((item, index) => (
                    <tr key={item?._id}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>
                        {item?.clientId?.clientname?.length > 0 ? (
                          <Tooltip
                            title={item?.clientId?.clientname || "NA"}
                            arrow
                          >
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "120px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.clientId?.clientname || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.clientId?.clientname || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.jobRole?.length > 13 ? (
                          <Tooltip title={item?.jobRole || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "150px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.jobRole || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.jobRole || "NA"}</div>
                        )}
                      </td>
                      <td>{item?.qpCode}</td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td>
                          {statusLoading && id == item._id ? (
                            <PulseLoader size="10px" color="#0bbbfe" />
                          ) : (
                            <FormSwitch
                              value={item?.status}
                              onChange={(e) => handleStatusChange(e, item?._id)}
                            />
                          )}
                        </td>
                      )}

                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
                        <td>
                          <div>
                            <ActionDropdown
                              actionOpen={actionOpen}
                              setActionOpen={setActionOpen}
                              deleteHandler={deleteHandler}
                              editBtnHandler={editBtnHandler}
                              MoreBtnHandler={MoreBtnHandler}
                              id={item?._id}
                              actionId={actionId}
                              featureName={featureName}
                              subFeatureName={subFeatureName}
                              showDelete={item?.status === false}
                            />
                          </div>
                        </td>
                      ) : null}
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
      <div
        style={{
          display: [totalPages > 0 ? "" : "none"],
        }}
      >
        <CustomTablePagination
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

export default JobRoles;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "S.NO" },
    { name: "clientName", label: "Client Name" },
    { name: "jobRole", label: "Job Role" },
    { name: "qpCode", label: "QP Code" },
    { name: "status", label: "STATUS" },
    { name: "actions", label: "ACTIONS" },
  ];
  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns.filter((column) => column?.name !== "status");
  }
  if (
    !isRolePermission?.permissions?.["3"] &&
    !isRolePermission?.permissions?.["4"]
  ) {
    columns = columns?.filter((column) => column?.name !== "actions");
  }
  return columns;
};
