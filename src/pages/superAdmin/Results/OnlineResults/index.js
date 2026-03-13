import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import {
  NOS_WISE_RESULTS_PAGE,
  UPLOAD_OFFLINE_RESULTS,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox } from "@mui/material";
import {
  getSubRole,
  renderWithTooltip,
  userRoleType,
} from "../../../../utils/projectHelper";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { getOnlineResultsByBatchListApi } from "../../../../api/superAdminApi/misResults";
import { misResultsSelector } from "../../../../redux/slicers/superAdmin/misResults";
import PageTitle from "../../../../components/common/PageTitle";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import CustomTable from "../../../../components/common/CustomTable";
import DownloadOptionsMenu from "./downloadOptionMenu";

const OnlineResultBatchList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedRows, setCheckedRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("onlineResultsPage");
    return savedPage ? parseInt(savedPage) : 1;
  });

  const [limit, setLimit] = useState(() => {
    const savedLimit = localStorage.getItem("onlineResultsLimit");
    return savedLimit ? parseInt(savedLimit) : 50;
  });
  const [totalPages, setTotalPages] = useState(1);

  // tabs
  const { userInfo = {} } = useSelector(authSelector);
  const { resultsList = [] } = useSelector(misResultsSelector);

  // permission
  const { RESULTS_FEATURE, RESULTS_SUB_FEATURE_1 } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = RESULTS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = RESULTS_SUB_FEATURE_1;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = () => {
    setLoading(true);
    dispatch(
      getOnlineResultsByBatchListApi(
        setLoading,
        page,
        searchQuery,
        limit,
        setTotalPages
      )
    );
  };

  useEffect(() => {
    getList();
  }, [page, limit, searchQuery]);

  useEffect(() => {
    setSortedData(resultsList);
    setTotalPagesUser(totalPages);
  }, [resultsList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...resultsList].sort((a, b) => {
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
  }, [resultsList, sortOrders]);

  useEffect(() => {
    return () => {
      localStorage.setItem("onlineResultsPage", page);
      localStorage.setItem("onlineResultsLimit", limit);
    };
  }, [page, limit]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    localStorage.setItem("onlineResultsPage", nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(1);
    localStorage.setItem("onlineResultsLimit", newLimit);
    localStorage.setItem("onlineResultsPage", 1);
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

  const handleBreadCrumbClick = (event, path) => {
    event.preventDefault();
    path && navigate(path);
  };

  const breadCrumbsData = [
    {
      name: "Online Result",
      isLink: false,
      key: "1",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "Online Result List",
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
    isPermission: true,
    isDisable: false,
  };

  const handleAllCheckedChange = () => {
    const newCheckedRows = allChecked
      ? []
      : sortedData?.map((row) => ({ _id: row._id, checked: true }));

    setAllChecked((prev) => !prev);
    setCheckedRows(newCheckedRows);
  };

  const columns_NOS = (isRolePermission) => [
    // {
    //   name: "checkBox",
    //   label: true && (
    //     <Checkbox
    //       checked={allChecked}
    //       onChange={handleAllCheckedChange}
    //       inputProps={{ "aria-label": "controlled" }}
    //       sx={{
    //         color: "black",
    //         "&.Mui-checked": {
    //           color: "black",
    //         },
    //       }}
    //     />
    //   ),
    //   sorting: false,
    //   selector: (row) => {
    //     const isChecked = checkedRows?.some((item) => item?._id === row._id);
    //     return (
    //       // isPermission
    //       true && (
    //         <Checkbox
    //           checked={isChecked}
    //           onChange={() => handleCheckedChange(row)}
    //           inputProps={{ "aria-label": "controlled" }}
    //           sx={{
    //             color: "black",
    //             "&.Mui-checked": {
    //               color: "black",
    //             },
    //           }}
    //         />
    //       )
    //     );
    //   },
    // },
    {
      name: "batchId",
      label: "Batch SIP ID",
      sorting: false,
      selector: (row) => renderWithTooltip(row?.batchId),
    },
    {
      name: "clientName",
      label: "Client Name",
      sorting: false,
      selector: (row) => renderWithTooltip(row?.clientName),
    },
    {
      name: "jobRole",
      label: "Job Role",
      sorting: false,
      selector: (row) => renderWithTooltip(row?.jobRole),
    },
    {
      name: "assessmentStartDate",
      label: "Assessment Start Date",
      sorting: false,
      selector: (row) => row?.assessmentStartDate || "-",
    },
    {
      name: "assessmentEndDate",
      label: "Assessment End Date",
      sorting: false,
      selector: (row) => row?.assessmentEndDate || "-",
    },
    {
      name: "accessorName",
      label: "Assessor Name",
      sorting: false,
      selector: (row) => renderWithTooltip(row?.accessorName),
    },
    {
      name: "batchSize",
      label: "Batch Size",
      sorting: false,
      selector: (row) => row?.batchSize || "-",
    },
    {
      name: "appearedCandidate",
      label: "Appeared Candidate",
      sorting: false,
      selector: (row) =>
        `${row?.candidate_Appeared_In_Batch?.candidateAttended || 0}/${
          row?.candidate_Appeared_In_Batch?.totalCandidates || 0
        }`,
    },
    {
      name: "nosResult",
      label: "NOS Result",
      sorting: false,
      selector: (row) => (
        <Button
          sx={{ textTransform: "none" }}
          onClick={() => navigate(`${NOS_WISE_RESULTS_PAGE}/${row._id}`)}
        >
          View
        </Button>
      ),
    },
    {
      name: "uploadResult",
      label: "Upload Result",
      sorting: false,
      selector: (row) => (
        <Button
          sx={{ textTransform: "none" }}
          disabled={
            !(
              isRolePermission?.permissions?.["2"] ||
              isRolePermission?.permissions?.["3"]
            )
          }
          onClick={() =>
            navigate(
              `${UPLOAD_OFFLINE_RESULTS}/${encodeURIComponent(
                row._id
              )}/${encodeURIComponent(row.batchId)}/online`
            )
          }
        >
          Upload
        </Button>
      ),
    },
    {
      name: "download",
      label: "Download",
      sorting: false,
      selector: (row) => <DownloadOptionsMenu row={row} />,
    },
  ];

  const table = {
    isPermission: true,
    headerColumn: columns_NOS(isRolePermission),
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
            <PageTitle title={"Online Result"} />
            <div className="breadcrumbs">
              <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
            </div>
          </div>
        </div>
        <CustomTable
          table={table}
          loading={loading}
          setLoading={setLoading}
          pagination={pagination}
          search={search}
        />
      </div>
    </div>
  );
};

export default OnlineResultBatchList;
