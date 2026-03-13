import React, { useEffect, useState } from "react";
import CustomTable from "../../../../components/common/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Eye } from "../../../../assets/icons/eye_black.svg";
import { getJobRoleOccurance_CD } from "../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";
import MultipleSelect from "../../../../components/common/MultiSelect";

const JobRoleOccurance = ({ assignedClientList = [], globalSelectedIds = [] }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const { jobRoleOccuranceTableData = [] } = useSelector(dashboardSelector);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // const MAX_LENGTH_FOR_TOOLTIP = 13;

  const getClientList = (id = "") => {
    dispatch(getJobRoleOccurance_CD(setLoading, page, limit, setTotalPages, id));
  };
  useEffect(() => {
    if (selectedIds.length > 0) {
      getClientList(selectedIds.join(","));
    } else {
      getClientList("");
    }
  }, [page, selectedIds, limit]);

  useEffect(() => {
    setSelectedIds(globalSelectedIds);
  }, [globalSelectedIds]);

  const headerColumns = [
    {
      name: "jobRole",
      label: "JOB ROLE",
      sorting: false,
      selector: (row) => <h2 style={{ padding: "7px", textWrap: "wrap" }}>{row?.jobRole || "-"}</h2>,
    },
    {
      name: "qpCode",
      label: "QP CODE",
      sorting: false,
      selector: (row) => {
        return <div>{row?.qpCode || "-"}</div>;
      },
    },

    {
      name: "occurance",
      label: "OCCURANCE",
      sorting: false,
      selector: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
          }}>
          <Eye />
          <h3
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              alignSelf: "center",
            }}>
            {row?.occurred || 0}
          </h3>
        </div>
      ),
    },
  ];

  const table = {
    isPermission: true,
    headerColumn: headerColumns,
    bodyData: jobRoleOccuranceTableData || [],
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value[value.length - 1] === "all") {
      if (selectedIds.length === assignedClientList.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(assignedClientList.map((item) => item.id));
      }
      return;
    }
    setSelectedIds(value.map((item) => item.id));
  };

  return (
    <div className="ClientsJobRole">
      <div className="chart-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Jobrole Occurence</h2>
        <div>
          <MultipleSelect
            setSelectedIds={setSelectedIds}
            selectedIds={selectedIds}
            options={assignedClientList}
            handleChange={handleChange}
            label="client"
          />
        </div>
      </div>
      <CustomTable table={table} loading={loading} setLoading={setLoading} pagination={pagination} />
    </div>
  );
};

export default JobRoleOccurance;
