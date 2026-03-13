import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import "../../questionBank/createQuestionBank/module.createQuestionBank.css";
import { ReactComponent as PlusIcon } from "../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE,
  SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE,
  SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE_BULK_UPLOAD,
  SUPER_ADMIN_EDIT_EXAM_CENTER_PAGE,
} from "../../../../config/constants/routePathConstants/superAdmin";

import { ReactComponent as Uparrow } from "../../../../assets/images/common/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../../../assets/images/common/down-arrow.svg";
import { ReactComponent as LinkIcon } from "../../../../assets/icons/copy-link.svg";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Tooltip } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../../assets/icons/search-icon.svg";
import { PropagateLoader, PulseLoader, SyncLoader } from "react-spinners";
import { ReactComponent as UploadIcon } from "../../../../assets/images/common/upload.svg";
import {
  deleteExamCenterApi,
  getExamCenterListApi,
  putExamManagementStatus,
} from "../../../../api/superAdminApi/examManagement";
import { examManagementSelector } from "../../../../redux/slicers/superAdmin/examManagementSlice";
import DeleteModal from "./../../../../components/common/Modal/DeleteModal";

import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../components/common/DropDown";
import CustomTablePagination from "../../../../components/common/customPagination";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { TableHeader } from "../../../../components/common/table";
import { FormSwitch } from "../../../../components/common/input";

const ExamCenterList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { examCenterList = [] } = useSelector(examManagementSelector);
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [actionId, setActionId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [id, setId] = useState("");
  const { userInfo = {} } = useSelector(authSelector);

  // permission
  const { EXAM_MANAGEMENT_FEATURE, EXAM_MANAGEMENT_SUB_FEATURE_1 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = EXAM_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = EXAM_MANAGEMENT_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = (search = true) => {
    // const pageNum = len && len == 1 ? (page == 1 ? page : page - 1) : page;
    // console.log(id)
    setLoading(true);
    dispatch(
      getExamCenterListApi(
        setLoading,
        id,
        page,
        limit,
        search ? searchQuery : "",
        setTotalPages,
        setStatusLoading
      )
    );
    setPage(page);
  };

  const handleChangePage = (e, nxtPage) => {
    setLoading(true);
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };
  const confirmDelete = () => {
    dispatch(
      deleteExamCenterApi(setLoading, actionId, setDeleteModal, getList)
    );
  };
  const editBtnHandler = (id, index) => {
    navigate(`${SUPER_ADMIN_EDIT_EXAM_CENTER_PAGE}/${actionId}`);
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
    setActionId(id);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value == "") {
      getList(false);
    }
    setSearchQuery(value);
  };
  const handleSearch = () => {
    if (searchQuery !== "")
      dispatch(
        getExamCenterListApi(
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

  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(sortedData, getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Exam Management List.xlsx");
  };

  const handleStatusChange = (e, id) => {
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(id);
    const formData = {
      status: value,
    };
    setStatusLoading(true);
    dispatch(
      putExamManagementStatus(
        setLoading,
        id,
        formData,
        setStatusLoading,
        page,
        limit,
        searchQuery,
        setTotalPages
      )
    );
  };

  useEffect(() => {
    setSortedData(examCenterList);
  }, [examCenterList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...examCenterList].sort((a, b) => {
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
  }, [examCenterList, sortOrders]);

  useEffect(() => {
    getList();
  }, [page, limit]);

  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        getList();
      }, 500);

      return () => clearTimeout(getData);
    }
  }, [searchQuery]);

  const MAX_LENGTH_FOR_TOOLTIP = 13;

  return (
    <div className="main-content assessment">
      <div className="title">
        <div className="title-text">
          <h1>Exam Centre List</h1>
        </div>
        <div className="title-btn">
          {isRolePermission?.permissions?.["2"] && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
            <button
            onClick={() =>
            navigate(SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE_BULK_UPLOAD)
            }
            style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: '#2ea8db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            }}
            >
            <UploadIcon width={18} height={18} />
            <span>Upload Bulk Exam Centre</span>
            </button>

            <button
            onClick={() => navigate(SUPER_ADMIN_CREATE_EXAM_CENTER_PAGE)}
            style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: '#2ea8db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            }}
            >
            <PlusIcon />
            <span>Add New</span>
            </button>
            </div>

          )}
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
            />
            {/* <span
              className={`${searchQuery == "" ? "disabled" : ""} search-icon`}
              onClick={handleSearch}
            >
              <SearchIcon />
            </span> */}
          </div>
          <div className="subadmin-btn">
            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={sortedData?.length > 0 ? handleExport : undefined}
              >
                Export
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
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr key={item?._id}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>
                        {item?.trainingPartner?.trainingPartner?.length >
                        MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip
                            title={
                              item?.trainingPartner?.trainingPartner || "-"
                            }
                            arrow
                          >
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.trainingPartner?.trainingPartner || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>
                            {item?.trainingPartner?.trainingPartner || "-"}
                          </div>
                        )}
                      </td>
                      <td>
                        {item?.examCenterName?.length >
                        MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.examCenterName || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.examCenterName || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.examCenterName || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.mobile?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.mobile || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.mobile || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.mobile || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.address?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.address || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.address || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.address || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.state?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.state || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.state || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.state || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.district?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.district || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.district || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.district || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.pincode?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.pincode || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.pincode || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.pincode || "-"}</div>
                        )}
                      </td>
                      <td>
                        {item?.noOfSeats?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.noOfSeats || "-"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.noOfSeats || "-"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.noOfSeats || "-"}</div>
                        )}
                      </td>
                      <td style={{textAlign: "center"}}>
                      {
                        item.locationURL ?
                      
                        <a href={item.locationURL} target="_blank" className="exam-viewlocation-btn">View Location</a> : "-"
                      }
                      </td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td>
                          {statusLoading && id === item._id ? (
                            <PulseLoader size="10px" color="#0bbbfe" />
                          ) : (
                            <FormSwitch
                              value={item.status === "active" ? true : false}
                              onChange={(e) => handleStatusChange(e, item?._id)}
                            />
                          )}
                        </td>
                      )}
                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
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
                              featureName={featureName}
                              subFeatureName={subFeatureName}
                              showDelete={item?.status === "inactive"}
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
        title="Deleting Exam Centre"
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

export default ExamCenterList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "S.NO" },
    { name: "trainingPartner.trainingPartner", label: "TRAINING PARTNER" },
    { name: "examCenterName", label: "EXAM CENTER" },
    { name: "mobile", label: "MOBILE No." },
    { name: "addressLineOne", label: "ADDRESS" },
    { name: "state", label: "STATE" },
    { name: "district", label: "DISTRICT" },
    { name: "pincode", label: "PINCODE" },
    { name: "noOfSeats", label: "NO OF SEATS" },
    { name: "locationURL", label: "Location" },
    { name: "status", label: "Status" },
    { name: "actions", label: "ACTIONS", sorting: false },
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
