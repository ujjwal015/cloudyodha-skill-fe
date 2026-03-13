/* eslint-disable no-useless-concat */
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../../../../userManagement/AssessorList/style.css";
import "../../style.css";
import { SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_EDIT_SUB_SCHEME } from "../../../../../../config/constants/routePathConstants/superAdmin";
import "../../../../../../components/common/table/style.css";
import { ReactComponent as UpArrow } from "../../../../../../assets/images/common/up-arrow.svg";
import { ReactComponent as DownArrow } from "../../../../../../assets/images/common/down-arrow.svg";
import { FormSwitch } from "../../../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubSchemeListApi,
  deleteSingleSubSchemeApi,
  changeSingleSubSchemeStatusApi,
} from "../../../../../../api/superAdminApi/schemeManagement";
import { authSelector } from "../../../../../../redux/slicers/authSlice";
import { TextField, InputAdornment } from "@mui/material";
import { ReactComponent as SearchIcon } from "./../../../../../../assets/icons/search-icon-grey.svg";
import { PropagateLoader } from "react-spinners";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../../../components/common/DropDown";
import CustomPagination from "../../../../../../components/common/customPagination";
import DeleteModal from "../../../../../../components/common/Modal/DeleteModal";
import { ROLESPERMISSIONS } from "../../../../../../config/constants/projectConstant";
import { TableHeader } from "../../../../../../components/common/table";
import SearchInput from "../../../../../../components/common/searchInput";
const SubSchemeManagementList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const { subSchemeList = {} } = useSelector(authSelector);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionOpen, setActionOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [subSchemeId, setSubSchemeId] = useState();
  const { userInfo = {} } = useSelector(authSelector);

  // permission
  const { SCHEME_MANAGEMENT_FEATURE, SCHEME_MANAGEMENT_LIST_FEATURE_2 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = SCHEME_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = SCHEME_MANAGEMENT_LIST_FEATURE_2;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  useEffect(() => {
    setSortedData(subSchemeList);
    setTotalPagesUser(totalPages);
  }, [totalPages, sortedData, subSchemeList]);

  const getSubSchemeList = useCallback(() => {
    dispatch(getSubSchemeListApi(setLoading, page, searchQuery, limit, ""));
  },[dispatch, limit, page, searchQuery]);
  useEffect(() => {
    getSubSchemeList();
  }, [getSubSchemeList]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(
      getSubSchemeListApi(setLoading, nxtPage, "", limit, totalPagesUser)
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getSubSchemeListApi(setLoading, 1, "", event.target.value, setTotalPages)
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };
  const handleStatusChange = (e, id) => {
    setStatusLoading(false);
    const { checked } = e.target;
    const value = checked ? true : false;
    setId(id);
    const formData = {
      sub_scheme_id: id,
      status: value,
    };
    dispatch(
      changeSingleSubSchemeStatusApi(
        setStatusLoading,
        id,
        formData,
        getSubSchemeList
      )
    );
  };
  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...subSchemeList]?.sort((a, b) => {
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
  }, [subSchemeList, sortOrders]);

  

  const exportSubSchemeData = () => {
    const exportData = subSchemeList?.map((item, index) => {
      return {
        id: (page - 1) * limit + (index + 1),
        schemeName: item?.schemeId?.schemeName,
        subSchemeName: item?.subSchemeName,
        subSchemeCode: item?.subSchemeCode,
        status: item?.status === true ? "active" : "inactive",
      };
    });
    return exportData;
  };

  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportSubSchemeData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "SubScheme_list");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Sub Scheme List.xlsx");
  };

  const editBtnHandler = () => {
    navigate(
      `${SUPER_ADMIN_SUB_SCHEME_MANAGEMENT_EDIT_SUB_SCHEME}/${subSchemeId}`
    );
  };
  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setSubSchemeId(id);
  };

  const confirmDelete = () => {
    const len = subSchemeList?.length;
    dispatch(
      deleteSingleSubSchemeApi(
        setLoading,
        subSchemeId,
        len,
        getSubSchemeList,
        setDeleteModal
      )
    );
  };
  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  return (
    <>
      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            {/* <TextField
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
            /> */}
            <SearchInput
              searchQuery={searchQuery}
              handleTrimPaste={handleTrimPaste}
              setSearchQuery={setSearchQuery}
              apiHandler={getSubSchemeListApi}
              setLoading={setLoading}
              page={page}
              limit={limit}
              setTotalPages={setTotalPages}
            />
          </div>
          <div className="subadmin-btn">
            {/* <button className="filter-btn">Filters</button> */}
            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={loading ? undefined : handleExport}
              >
                {loading ? "loading..." : "Export"}
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
                  sortedData.map((item, index) => (
                    <tr key={item._id}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>{item?.schemeId?.schemeName}</td>
                      <td>{item?.subSchemeName}</td>
                      <td>{item?.subSchemeCode}</td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td>
                          {statusLoading && id === item._id ? (
                            {
                              /* <PulseLoader size="10px" color="#0bbbfe" /> */
                            }
                          ) : (
                            <FormSwitch
                              value={item.status === true ? true : false}
                              onChange={(e) => handleStatusChange(e, item?._id)}
                            />
                          )}
                        </td>
                      )}
                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
                        <td style={{ paddingLeft: "30px" }}>
                          <ActionDropdown
                            actionOpen={actionOpen}
                            setActionOpen={setActionOpen}
                            deleteHandler={deleteHandler}
                            editBtnHandler={editBtnHandler}
                            MoreBtnHandler={MoreBtnHandler}
                            id={item._id}
                            actionId={subSchemeId}
                            featureName={featureName}
                            subFeatureName={subFeatureName}
                            showDelete={!item?.status ? true : false}
                          />
                        </td>
                      ) : null}
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>No Sub-Scheme Found</td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <DeleteModal
        title="Delete Sub Scheme"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      {sortedData && sortedData?.length > 0 && (
        <CustomPagination
          count={totalPages}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};

export default SubSchemeManagementList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "id", label: "Sr.No" },
    { name: "schemeName", label: "Scheme Name" },
    { name: "subSchemeName", label: "Sub Scheme Name" },
    { name: "subSchemeCode", label: "Sub Scheme Code" },
    { name: "status", label: "Status" },
    { name: "actions", label: "Actions" },
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
