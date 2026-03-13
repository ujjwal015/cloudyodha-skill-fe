import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";
import { ActionComp } from ".";
import dummyUser from "../../../../assets/images/pages/admin/dummy-user.png";
import TablePagination from "./tablePagination";
import { getClientListsApi } from "../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";
import { capitalizeFunc } from "../../../../utils/projectHelper";
import { Link } from "react-router-dom";

const ClientOverview = () => {
  const dispatch = useDispatch();
  const { clientLists = [] } = useSelector(dashboardSelector);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    dispatch(getClientListsApi(setLoading, page, limit, setTotalPages));
  }, []);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(getClientListsApi(setLoading, nxtPage, limit, setTotalPages));
  };

  const handleChangeRowsPerPage = (event) => {
    const { value } = event.target;
    setLimit(parseInt(value, 10));
    dispatch(getClientListsApi(setLoading, 1, value, setTotalPages));
    setPage(1);
  };

  const handleRemove = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    setLoading(true);
    dispatch(getClientListsApi(setLoading));
    setOpen(false);
  };
  return (
    <div className="list-card client-overview">
      <div className="card-title select-and-more-wrapper" style={{ position: "relative" }}>
        <h2>Clients Roles overview</h2>
        <ActionComp open={open} setOpen={setOpen} handleRefresh={handleRefresh} handleRemove={handleRemove} />
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Logo</th>
              <th>Client Code</th>
              <th>Client Name</th>
              <th>Email Address</th>
              <th>Website</th>
              <th>State</th>
              <th>Organisation Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="table-loading-wrapper">
                <td colSpan="9">
                  <div className="sync-loader-wrapper">
                    <SyncLoader color="#2ea8db" />
                  </div>
                </td>
              </tr>
            ) : clientLists?.length > 0 ? (
              clientLists.map((client, index) => (
                <tr key={client?._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="client-prof">
                      {client?.url ? (
                        <div className="img">
                          <img src={client?.url} alt="Client Logo" />
                        </div>
                      ) : (
                        <div className="avatar">
                          <p>{client?.clientname?.slice(0, 1)}</p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{client?.clientcode || "NA"}</td>
                  <td>
                    <div className="info">
                      <h6>{client?.clientname || "NA"}</h6>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${client?.email}`}>{client?.email || "NA"}</a>
                  </td>
                  <td>
                    <a href={client?.webpage} target="_blank" rel="noopener noreferrer">
                      {client?.webpage || "NA"}
                    </a>
                  </td>
                  <td>{client?.state || "NA"}</td>
                  <td>{client?.organisationType || "NA"}</td>
                  <td>
                    <div className={`status ${client?.client_status}`}>{capitalizeFunc(client?.client_status)}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-list-table">
                <td colSpan="9">
                  <p>No Result Found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        count={totalPages}
        page={page}
        limit={limit}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ClientOverview;
