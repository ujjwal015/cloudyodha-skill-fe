import React, { useEffect, useState } from "react";
import CustomTable from "../../../../components/common/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement";
import { Avatar } from "@mui/material";
import { getClientListsApi, getTeamMemberListApi } from "../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";

const TeamMembersTable = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const { jobRolesListAll = {} } = useSelector(clientManagementSelector);
  const { clientLists = [], teamMemberList = [] } = useSelector(dashboardSelector);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [resultCounts, setResultCounts] = useState();

  const MAX_LENGTH_FOR_TOOLTIP = 13;

  const getClientList = () => {
    dispatch(getTeamMemberListApi(setLoading, page, limit, setTotalPages, setResultCounts));
  };
  useEffect(() => {
    getClientList();
  }, [page, limit]);

  const headerColumns = [
    {
      name: "memberName",
      label: "MEMBER NAME",
      sorting: false,
      selector: (row) => (
        <div className="username-cell">
          <Avatar
            sx={{ width: 35, height: 35, border: "1px solid #ccc" }}
            variant="rounded"
            alt={"some-alt"}
            src={"https://www.ficsi.in/public/front/images/favicon.png"}
          />
          <div>
            <h2>{row?.firstName + " " + row?.lastName || "NA"}</h2>
            <p>{row?.email || "NA"}</p>
          </div>
        </div>
      ),
    },
    {
      name: "designation",
      label: "DESIGNATION",
      sorting: false,
      selector: (row) => {
        return <div>{row?.userRole[0]?.userRoleName || "-"}</div>;
      },
    },

    {
      name: "reportingManager",
      label: "REPORTING MANAGER",
      sorting: false,
      selector: (row) => (
        <div>{row?.userRole[0]?.userId?.firstName + " " + row?.userRole[0]?.userId?.lastName || "-"}</div>
      ),
    },
  ];

  const table = {
    isPermission: true,
    headerColumn: headerColumns,
    bodyData: teamMemberList,
    isCheckBox: false,
    canDeleteAllSelectedBox: false,
  };
  const handleChangePage = (e, nxtPage) => {
    setLoading(true);
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const pagination = {
    isPagination: true,
    count: totalPages,
    totalPages: totalPages,
    page: page,
    limit: limit,
    setTotalPages: setTotalPages,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  };

  return (
    <div className="ClientsJobRole">
      <div className="chart-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Team Members</h2>
      </div>
      <CustomTable table={table} loading={loading} setLoading={setLoading} pagination={pagination} />
    </div>
  );
};

export default TeamMembersTable;
