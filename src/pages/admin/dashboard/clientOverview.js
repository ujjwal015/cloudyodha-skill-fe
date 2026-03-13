import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";
import { ActionComp } from ".";
import dummyUser from "../../../assets/images/pages/admin/dummy-user.png";
import TablePagination from "./tablePagination";
import { getClientListsApi } from "../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../redux/slicers/admin/dashboardSlice";
import { capitalizeFunc } from "../../../utils/projectHelper";

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
      <div
        className="card-title select-and-more-wrapper"
        style={{ position: "relative" }}
      >
        <h2>Clients Roles overview</h2>
        <ActionComp
          open={open}
          setOpen={setOpen}
          handleRefresh={handleRefresh}
          handleRemove={handleRemove}
        />
      </div>
      <div className="table">
        <table>
          <thead>
            <td>Client Name</td>
            <td>Email</td>
            <td>Organisation Type</td>
            <td>Status</td>
          </thead>
          {loading ? (
            <tbody>
              <tr className="table-loading-wrapper">
                <div className="sync-loader-wrapper">
                  <SyncLoader color="#2ea8db" />
                </div>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {clientLists?.length > 0 ? (
                clientLists?.map((client) => (
                  <tr key={client?._id}>
                    <td>
                      <div className="client-prof">
                        {client?.url ? (
                          <div className="img">
                            <img src={client?.url} />
                          </div>
                        ) : (
                          <div className="avatar">
                            <p>{client?.clientname?.slice(0, 1)}</p>
                          </div>
                        )}
                        <div className="info">
                          <h6>{client?.clientname}</h6>
                        </div>
                      </div>
                    </td>
                    <td>{client?.email}</td>
                    <td>{client?.organisationType}</td>
                    <td>
                      <div className={`status ${client?.client_status}`}>
                        {capitalizeFunc(client?.client_status)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-list-table">
                  <td>
                    <p>No Result Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          )}
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
