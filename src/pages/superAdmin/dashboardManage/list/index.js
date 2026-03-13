import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DASHBOARD_MANAGE_CREATE_PAGE,
  DASHBOARD_MANAGE_EDIT_PAGE,
  DASHBOARD_MANAGE_LIST,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { FormSwitch } from "../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import { Checkbox } from "@mui/material";
import {
  exportData,
  getSubRole,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../redux/slicers/authSlice";
import validateField from "../../../../utils/validateField";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import PageTitle from "../../../../components/common/PageTitle";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import MyFilledBtn from "../../../../components/common/newCommon/Buttons/MyFilledBtn";
import CustomTable from "../../../../components/common/CustomTable";
import { ReactComponent as EditIcon } from "../../../../assets/icons/edit-icon.svg";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete-icon.svg";
import AddNew from "../../../../components/common/Modal/AddModal";
import { deleteDashboardApi, getAllDashboardListApi, updateDashboardStatusApi } from "../../../../api/superAdminApi/dashboardManage";
import { clientSelector } from "../../../../redux/slicers/clientSlice";

const DashboardManage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nosId, setNOSId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [singleDashboardId, setSingleDashboardId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const { userInfo = {} } = useSelector(authSelector);
  const [checkedRows, setCheckedRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [resultCounts, setResultCounts] = useState(0);
  const [addNewModalOpen, setAddNewModalOpen] = useState(false);

  const { getAllDashboardList = [] } = useSelector(clientSelector);

  // permission
  const { QUESTION_BANK_FEATURE, QUESTION_BANK_SUB_FEATURE_2 } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = QUESTION_BANK_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = QUESTION_BANK_SUB_FEATURE_2;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = () => {
    dispatch(
      getAllDashboardListApi(
        setLoading,
        page,
        limit,
        searchQuery,
        setTotalPages,
        setResultCounts
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    getList();
  }, [page, limit, searchQuery]);

  useEffect(() => {
    setSortedData(getAllDashboardList);
    setTotalPagesUser(totalPages);
  }, [getAllDashboardList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...getAllDashboardList].sort((a, b) => {
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
  }, [getAllDashboardList, sortOrders]);

  const handleStatusChange = (e, nosID = "", status) => {
    const { checked } = e.target;
    const value = checked;
    setNOSId(nosID);
    const formData = {
      status: value,
    };
    if (nosID) {
      dispatch(updateDashboardStatusApi(formData, nosID, setLoading, getList));
    }
  };

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const exportNOSData = () => {
    let exportData;
    if (allChecked) {
      exportData = sortedData?.map((item) => {
        return {
          id: item?._id,
          dashboardName: item?.dashboard_name,
          widgets: item?.widgets_count,
          graph: item?.graphs_count,
          tables: item?.tables_count,
          assignedUser: item?.assigned_user,
          createdOn: item?.createdAt,
          status: item?.status,
        };
      });
    } else if (checkedRows.length > 0) {
      exportData = checkedRows.map((item) => {
        return {
          id: item?._id,
          dashboardName: item?.dashboard_name,
          widgets: item?.widgets_count,
          graph: item?.graphs_count,
          tables: item?.tables_count,
          assignedUser: item?.assigned_user,
          createdOn: item?.createdAt,
          status: item?.status,
        };
      });
    } else {
      exportData = sortedData?.map((item) => {
        return {
          id: item?._id,
          dashboardName: item?.dashboard_name,
          widgets: item?.widgets_count,
          graph: item?.graphs_count,
          tables: item?.tables_count,
          assignedUser: item?.assigned_user,
          createdOn: item?.createdAt,
          status: item?.status,
        };
      });
    }

    return exportData;
  };
  const handleExport = (event) => {
    event.preventDefault();
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportNOSData(), getColumns())
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard List");
    const buffer = XLSX.write(workbook, { type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "DashboardList.xlsx");
  };

  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const deleteHandler = (row) => {
    setSingleDashboardId(row._id);
    setDeleteModal(true);
    setActionOpen(false);
  };
  const editHandler = (row) => {
    setSingleDashboardId(row._id);
    navigate(`${DASHBOARD_MANAGE_EDIT_PAGE}/${row._id}`);
  };

  const confirmDelete = () => {
    const len = getAllDashboardList?.length;
    dispatch(deleteDashboardApi(singleDashboardId, setLoading, getList, setDeleteModal));
  };


  const handleAddClick = (e) => {
    e.preventDefault();
    // setAddNewModalOpen(true);
    navigate(DASHBOARD_MANAGE_CREATE_PAGE);
  };

  const buttonData = [
    {
      name: "Add Dashboard",
      text: "Add Dashboard",
      iconRight: "",
      isRightIcon: false,
      iconLeft: "line-md:plus",
      onClick: (e) => handleAddClick(e),
      path: "",
      loading: loading,
      disabled: loading ? true : false,
      isPermissions: {},
    },
  ];

  const handleBreadCrumbClick = (event, name, path) => {
    event.preventDefault();
    path && navigate(path);
  };

  const handleCheckedChange = (row) => {
    setCheckedRows((prev) => {
      const isChecked = prev.some((item) => item._id === row._id);
      if (isChecked) {
        return prev.filter((item) => item._id !== row._id);
      } else {
        return [...prev, { ...row }];
      }
    });
  };
  const breadCrumbsData = [
    {
      name: "Dashboard Management",
      isLink: true,
      key: "1",
      path: DASHBOARD_MANAGE_LIST,
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "Dashboard List",
      isLink: false,
      key: "2",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
  ];

  const pagination = {
    isPagination: true,
    totalPages: totalPages,
    count: totalPages,
    page: page,
    limit: limit,
    setTotalPages: setTotalPages,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  };

  const search = {
    searchTitle: "",
    isSearch: true,
    searchQuery: searchQuery,
    setSearchQuery: setSearchQuery,
    endAdornment: true,
    // apiHandler: getAllNosListApi,
    isPermission: true, //{}
    isDisable: false,
  };

  const exportDataList = () => {
    return [
      {
        name: "export",
        isPermission: true, //{}
        label: "Export",
        isDisable: false,
        handleExport: (e) => handleExport(e),
      },
    ];
  };

  const exportDataOptions = {
    loading: loading,
    setLoading: setLoading,
    isPermissions: {
      1: isRolePermission?.permissions?.["1"],
      5: isRolePermission?.permissions?.["5"],
    },
    isExport: isRolePermission?.permissions?.["5"],
    // isExport: true,
    exportDataList: exportDataList(),
  };

  const handleAllCheckedChange = () => {
    const newCheckedRows = allChecked
      ? []
      : sortedData?.map((row) => ({ _id: row._id, checked: true }));

    setAllChecked((prev) => !prev);
    setCheckedRows(newCheckedRows);
  };

  const formatDate = (isoDateString = "") => {
    if (isoDateString) {
      const date = new Date(isoDateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  };

  const columns = (isRolePermission) => {
    return [
      {
        name: "checkBox",
        label: true && (
          <Checkbox
            checked={allChecked}
            onChange={handleAllCheckedChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        ),
        sorting: false,
        selector: (row) => {
          const isChecked = checkedRows?.some(
            (item) => item?._id === row._id // && item?.checked
          );
          return (
            // isPermission
            true && (
              <Checkbox
                checked={isChecked}
                onChange={() => handleCheckedChange(row)}
                inputProps={{ "aria-label": "controlled" }}
              />
            )
          );
        },
      },
      {
        name: "dashboardName",
        label: "Dashboard Name",
        sorting: false,
        selector: (row) => row?.dashboard_name || " ",
      },
      {
        name: "widgets",
        label: "Widgets",
        sorting: false,
        selector: (row) => row?.widgets_count || 0,
      },

      {
        name: "graph",
        label: "Graph",
        sorting: false,
        selector: (row) => row?.graphs_count || 0,
      },
      {
        name: "tables",
        label: "Tables",
        sorting: false,
        selector: (row) => row?.tables_count || 0,
      },
      {
        name: "assignedUser",
        label: "Assigned User",
        sorting: false,
        selector: (row) => row?.assigned_user || 0,
      },
      {
        name: "createdAt",
        label: "CREATED ON",
        sorting: false,
        selector: (row) => formatDate(row?.created_at) || " ",
      },
      {
        name: "status",
        label: "STATUS",
        sorting: false,
        selector: (row) =>
          isRolePermission?.permissions?.["6"] && (
            <td>
              {loading && nosId === row._id ? (
                <PulseLoader size="10px" color="#0bbbfe" />
              ) : (
                <FormSwitch
                  value={row.status}
                  onChange={(e) =>
                    handleStatusChange(e, row?._id, row?.status)
                  }
                />
              )}
            </td>
          ),
      },
      {
        name: "action",
        label: "Action",
        sorting: false,
        selector: (row) => (
          <div>
            <ul
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {isRolePermission?.permissions?.["4"] &&
                !(row?.status === "active") && (
                  <>
                    <li>
                      <EditIcon onClick={() => editHandler(row)} />
                    </li>
                    <li>
                      <DeleteIcon onClick={() => deleteHandler(row)} />
                    </li>
                  </>
                )}
            </ul>
          </div>
        ),
      },
    ];
  };

  const commonRowData = {
    jobRole: sortedData[0]?.jobRole || " ",
    qpCode: sortedData[0]?.qpCode || " ",
    level: sortedData[0]?.jobLevel || " ",
    version: sortedData[0]?.version || " ",
    section: sortedData[0]?.section || " ",
    questionType: sortedData[0]?.questionType || " ",
  };

  const table = {
    isPermission: true,
    headerColumn: columns(isRolePermission),
    bodyData: sortedData,
    isCheckBox: true,
    selectedCheckBoxs: checkedRows,
    canDeleteAllSelectedBox: true,
  };

  return (
    <div className="main-content">
      <div className="content--page">
        <div
          className="page-header-wrapper"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <PageTitle
              title={
                <h1 style={{ fontSize: "larger", fontWeight: "bold" }}>
                  Dashboard List
                </h1>
              }
            />
            <div className="breadcrumbs">
              <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
            </div>
          </div>
          <div className="page--header__actions">
            {isRolePermission?.permissions?.["2"] &&
              buttonData?.map((btnItem) => {
                return <MyFilledBtn btnItemData={btnItem} />;
              })}
          </div>
        </div>
        <CustomTable
          table={table}
          loading={loading}
          setLoading={setLoading}
          pagination={pagination}
          search={search}
          // multiSelect={mulitSelect}
          exportOptions={exportDataOptions}
          iscommonRowDataAvailable={false}
          commonRowDataForHeader={sortedData.length > 0 ? sortedData[0] : {}}
          commonRowData={commonRowData}
        />
      </div>

      <AddNew open={addNewModalOpen} setOpen={setAddNewModalOpen} />
      <DeleteModal
        title="Delete Dashboard"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default DashboardManage;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "Sr.No." },
    { name: "dashboardName", label: "Dashboard Name" },
    { name: "widgets", label: "Widgets" },
    { name: "graph", label: "Graph" },
    { name: "tables", label: "Tables" },
    { name: "assignedUser", label: "Assigned User" },
    { name: "createdAt", label: "Created On" },
    { name: "status", label: "Status" },
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
