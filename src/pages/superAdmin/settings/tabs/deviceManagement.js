import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { Button, Tooltip } from "@mui/material";
import { getUserDetails, removeLocal } from "../../../../utils/projectHelper";
import { TableHeader } from "../../../../components/common/table";
import { useSelector } from "react-redux";
import CustomTablePagination from "../../../../components/common/customPagination";
import { getdeviceListsApi } from "../../../../api/superAdminApi/clientManagement";
import { BeatLoader, PropagateLoader } from "react-spinners";
import "./style.css";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { getDeviceDetailListsApi, signOutApi } from "../../../../api/authApi";
import { useLocation } from "react-router-dom";
import PreviewLocaationModel from "./userLocation";

const DeviceManagement = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { _id = "" } = getUserDetails();

  const { deviceLists = [] } = useSelector(authSelector);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [isLogoutALlBtnLoading, setIsLogoutAllBtnLoading] = useState(false);
  const [isLogOutBtnLoading, setILogOutsBtnLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [btnLogoutId, setBtnLogoutId] = useState("");

  const getList = (pg, lmt) => {
    dispatch(
      getDeviceDetailListsApi(
        setLoading,
        _id,
        pg ? pg : page,
        lmt ? lmt : limit,
        setTotalPages
      )
    );
  };

  useEffect(() => {
    setSortedData(deviceLists);
  }, [deviceLists, totalPages]);

  useEffect(() => {
    getList(1, 50);
    setPage(1);
    setLimit(50);
  }, [pathname]);

  const handleChangePage = (e, nxtPage) => {
    setLoading(true);
    setPage(nxtPage);
    dispatch(
      getDeviceDetailListsApi(setLoading, _id, nxtPage, limit, setTotalPages)
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getDeviceDetailListsApi(
        setLoading,
        _id,
        1,
        event.target.value,
        setTotalPages
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...deviceLists].sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (typeof valueA === "string" && typeof valueB === "string") {
            if (sortColumn == "slotDate") {
              return sortOrder === "asc"
                ? new Date(valueA) - new Date(valueB)
                : new Date(valueB) - new Date(valueA);
            } else {
              return sortOrder === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
            }
          } else {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
          }
        });
        setSortedData(sortedData);
      }
    };

    sortData();
  }, [deviceLists, sortOrders]);

  const getIP = async () => {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  };

  const handleLogoutFromAllDevices = async () => {
    const formData = {
      userId: _id,
      isAllLogout: true,
      deviceId: "none",
      addreiss: await getIP(),
    };
    dispatch(
      signOutApi(
        formData,
        setIsLogoutAllBtnLoading,
        setLoading,
        _id,
        page,
        limit,
        setTotalPages,
        setBtnLogoutId
      )
    );
  };

  const handleLogout = async (id) => {
    setBtnLogoutId(id);
    const formData = {
      userId: _id,
      isAllLogout: false,
      deviceId: id,
      addreiss: await getIP(),
      isSimpleLogOut: false,
    };
    dispatch(
      signOutApi(
        formData,
        setILogOutsBtnLoading,
        setLoading,
        _id,
        page,
        limit,
        setTotalPages,
        setBtnLogoutId
      )
    );
  };
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [fieldName, setFieldName] = useState(null);
  const [batchName, setBatchName] = useState(null);
  const [locationDetails, setLocationDetails] = useState({});

  const handlePreview = async (
    fieldName,
    batchName,
    lat = null,
    long = null
  ) => {
    setIsPreviewOpen((pre) => !pre);
    setFieldName(fieldName);
    setBatchName(batchName);
    const location = { lat, long };
    setLocationDetails(location);
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  return (
    <>
      <div className="device-manager">
        <div className="top-header">
          <div className="form_title">
            <h1>Device Manager</h1>
            <p>List of all Device from which you have Logged in.</p>
          </div>
        </div>
        <div className="title-btn">
          <Button
            className={`light-blue-btn submit-btn log-out-all`}
            variant="contained"
            onClick={handleLogoutFromAllDevices}
            style={{ textTransform: "capitalize" }}
            disabled={isLogoutALlBtnLoading ? true : false}
          >
            {isLogoutALlBtnLoading ? (
              <PulseLoader size="10px" color="white" />
            ) : (
              "  Logout From all Devices"
            )}
          </Button>
        </div>
        <div className="subadmin-table">
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
                      <tr key={item?._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>{item?.device || "NA"}</td>
                        <td>{item?.browser || "NA"}</td>
                        <td>{item?.latitude || "NA"}</td>
                        <td>{item?.longitude || "NA"}</td>
                        <td>{item?.ipAddress || "NA"}</td>
                        {/* <td>{item?.location || "NA"}</td> */}
                        <td>
                          {loading ? (
                            <div className="loading">
                              <BeatLoader color="#2ea8db" />
                            </div>
                          ) : item?.latitude && item?.longitude ? (
                            <>
                              <button
                                onClick={() => {
                                  handlePreview(
                                    "location",
                                    item?.batch_id?.batchId,
                                    item?.latitude,
                                    item?.longitude
                                  );
                                }}
                                className="device-location-btn"
                              >
                                View Map
                              </button>
                              <PreviewLocaationModel
                                handlePreview={handlePreview}
                                isPreviewOpen={isPreviewOpen}
                                setIsPreviewOpen={setIsPreviewOpen}
                                handlePreviewClose={handlePreviewClose}
                                deviceType={item?.device}
                                browserName={item?.browser}
                                fieldName={fieldName}
                                locationDetails={locationDetails}
                                batchName={batchName}
                              />
                            </>
                          ) : (
                            <>
                              <p className="location-text">No Location Found</p>
                            </>
                          )}
                        </td>
                        <td>{item?.lastSession || "NA"}</td>
                        <td style={{ textAlign: "center", padding: "10px 0" }}>
                          <div>
                            <button
                              className="logout-btn"
                              onClick={() => handleLogout(item?._id)}
                              disabled={
                                !btnLogoutId
                                  ? false
                                  : item?._id === btnLogoutId
                                  ? false
                                  : true
                              }
                            >
                              <span>
                                {isLogOutBtnLoading &&
                                item?._id === btnLogoutId ? (
                                  <PulseLoader size="10px" color="#2ea8db" />
                                ) : (
                                  "  Logout"
                                )}{" "}
                              </span>
                            </button>
                          </div>
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

        <div>
          <CustomTablePagination
            count={totalPages}
            page={page}
            limit={limit}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
};

export default DeviceManagement;

const columns = [
  { name: "_id", label: "S.NO" },
  { name: "device", label: "Device" },
  { name: "browser", label: "Browser" },
  { name: "latitude", label: "Latitude" },
  { name: "longitude", label: "Longitude" },
  { name: "ipAddress", label: "IP Address" },
  { name: "location", label: "Location" },
  { name: "lastSession", label: "Last Session" },
  { name: "actions", label: "ACTIONS" },
];
