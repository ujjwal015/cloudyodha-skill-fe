import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  SUPER_ADMIN_CLIENT_MANAGEMENT_BULK_UPLOAD,
  SUPER_ADMIN_CLIENT_MANAGEMENT_PROFILE_PAGE,
  UPDATE_CLIENT_PROFILE_PAGE,
} from "../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../components/common/table";

// import { ReactComponent as ActionDots } from "../../../assets/images/common/action-dots.svg";
import { ReactComponent as UploadIcon } from "../../../assets/icons/upload-cloud.svg";
import { FormSwitch } from "../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientManagementListsApi,
  clientManagementChangeStatusApi,
  deleteClientDetails,
  getClientManagementAllListsApi,
} from "../../../api/superAdminApi/clientManagement";
import { clientManagementSelector } from "../../../redux/slicers/superAdmin/clientManagement";
import CustomTablePagination from "../../../components/common/customPagination";
import { PropagateLoader, ClipLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "./../../../assets/icons/search-icon-grey.svg";
import { ReactComponent as DeleteIcon } from "./../../../assets/icons/delete-icon.svg";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
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
import DummyImage from "../../../assets/images/common/no-preview.png";
import { ReactComponent as POCFlag } from "../../../assets/icons/featureFlagIcon.svg";

//modal
import Box from "@mui/material/Box";
// import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
import FilterModal from "../../../components/common/Modal/FilterModal";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import { getStateListsApi } from "../../../api/authApi";
import AutoCompleteTextField from "./../../../components/common/AutoCompleteTextField";


const initialFormValues = {
  organisationType: "",
  state: "",
};

const ClientManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { clientManagementLists = [] } = useSelector(clientManagementSelector);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionBtn, setActionBtn] = useState(null);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [spokeData, setSpokeData] = useState();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [focusedInput, setFocusedInput] = useState("");
  const [clientList,setClientList]=useState([]);
  const {clientListAll} =useSelector(clientManagementSelector);
  const { userInfo = {} } = useSelector(authSelector);
  const [isFilerApplied, setIsFilterApplied] = useState(false);
  // permission
  const { CLIENT_MANAGEMENT_FEATURE, CLIENT_MANAGEMENT_LIST_FEATURE } =
    ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = CLIENT_MANAGEMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = CLIENT_MANAGEMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const { stateLists = [] } = useSelector(authSelector);
  const [stateListModified, setStateListModified] = useState([
    { label: "", value: "" },
  ]);

  // modal
  const [open, setOpen] = React.useState(false);
  const [autocompleteSuggestedData,setAutocompleteSuggestedData] =
    useState("");
  const [store, setStore] = useState(getLocal("query"));

  // const store= getLocal("query");

  useEffect(() => {
    return window.localStorage.removeItem("query");
  }, []);


  const handleFilterRemove=()=>{
    window.localStorage.removeItem("query");
    setStore("");
  }


  // useEffect(()=>{
  //   if(store?.status){
  //     clientManagementLists
  //     setSortedData
  //   }
  // },[store])

  const handleOpen = (data) => {
    setOpen(true);
    setSpokeData(data);
  };
  const handleClose = () => setOpen(false);

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  const getList = (setStatusBtnLoading) => {
    setLoading(true);
    dispatch(
      getClientManagementListsApi(
        setLoading,
        page,
        limit,
        searchQuery,
        setTotalPages,
        formValues?.organisationType,
        formValues?.state
      )
    );
  };

  useEffect(()=>{
    setLoading(true);
    dispatch(
      getClientManagementListsApi(
        setLoading,
        page,
        limit,
        autocompleteSuggestedData,
        setTotalPages
      )
    );
  }, [autocompleteSuggestedData]);

  useEffect(() => {
    getList();
  }, [page, limit]);

  useEffect(() => {
    const formData = {
      country: "India",
    };

    dispatch(getStateListsApi(formData, setLoading));
  }, []);

  useEffect(() => {
    if (stateLists.length > 0) {
      const modifiedStates = stateLists.map((el) => {
        const newData = {
          label: el?.label,
          value: el?.label,
        };
        return newData;
      });
      setStateListModified(modifiedStates);
    }
  }, [stateLists.length]);

  useEffect(() => {
    if (store?.status) {
      const arr = [];
      console.log(
        "clientManagementLists_clientManagementLists",
        clientManagementLists
      );
      for (let item of clientManagementLists) {
        if (item?.client_status === store?.status) {
          arr.push(item);
        }
      }
      if (arr?.length > 0) {
        setSortedData(arr);
      } else {
        setSortedData([]);
      }
      setTotalPagesUser(totalPages);
    } else {
      setSortedData(clientManagementLists);
      setTotalPagesUser(totalPages);
    }
  }, [clientManagementLists, totalPages, store]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...clientManagementLists].sort((a, b) => {
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

    // sortData();
  }, [clientManagementLists, sortOrders]);

  useEffect(()=>{
    setClientList(sortedData);
  },[])

  const handleStatusChange = (e, id) => {
    const { checked } = e.target;
    const value = checked ? "Active" : "Inactive";
    setId(id);
    const formData = {
      clientstatus: value,
    };
    // setStatusLoading(true);
    dispatch(
      clientManagementChangeStatusApi(id, formData, setStatusLoading, getList)
    );
  };

  const handleChangePage = (e, nxtPage) => {
    setLoading(true);
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      getList();
    }, 500);

    return () => clearTimeout(getData);
  }, [searchQuery]);

  const handleChangeSearch = (e) => {
    const { value } = e.target;
    if (value == "") {
      setLoading(true);
      getClientManagementListsApi(setLoading, page, limit, "", setTotalPages)
    }
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery !== "") setLoading(true);
    dispatch(
      getClientManagementListsApi(
        setLoading,
        1,
        limit,
        searchQuery,
        setTotalPages,
        formValues?.organisationType
      )
    );
    setPage(1);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  const exportClientData = () => {
    const exportData = clientManagementLists?.map((item) => {
      return {
        clientname: item?.clientname,
        clientcode: item?.clientcode,
        email: item?.email,
        mobile: item?.mobile,
        address: item?.address,
        state: item?.state,
        city: item?.client_city,
        pincode: item?.pincode,
        sector:item?.sector.map((el)=>el?.sectorName).join(", "),
        status: item?.client_status,
        spoke: item?.spoke[0].spoke_name,
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
    saveAs(blob, "Clients List.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    dispatch(
      deleteClientDetails(setLoading, actionId, setDeleteModal, getList)
    );
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
    navigate(`${UPDATE_CLIENT_PROFILE_PAGE}/${actionId}`);
  };

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;

    const fieldValue = type === "checkbox" ? checked : value;

    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const handleClearAll = () => {
    setFormValues(initialFormValues);
    setLoading(true);
    dispatch(getClientManagementListsApi(setLoading, 1, 50, "", setTotalPages));
    handleCloseFilter();
    setIsFilterApplied(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    const organisationType = formValues?.organisationType;
    const state = formValues?.state;
    dispatch(
      getClientManagementListsApi(
        setLoading,
        page,
        limit,
        false, // search
        setTotalPages,
        organisationType,
        state,
        setIsFilterApplied
      )
    );
    handleCloseFilter();
    // setFormValues(initialFormValues);
  };

  const MAX_LENGTH_FOR_TOOLTIP = 13;

  function POCModal() {
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="sm"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <div className="poc-title">
            {<POCFlag />}
            <h2>Point of Contact</h2>
            <p>See All Details of Poc here.</p>
          </div>

          <DialogContent>
            {spokeData?.length > 0 ? (
              <>
                <Box>
                  {spokeData?.map((el, index) => {
                    return (
                      <div key={index}>
                        <div className="POC_card">
                          <h1>{`POC : ${index + 1}`}</h1>
                          <Grid container>
                            <Grid item xs={12} sm={6}>
                              <p>
                                <span>Name :</span> {el?.spoke_name}
                              </p>
                              <p>
                                <span>Department :</span> {el?.spoke_department}
                              </p>
                              <p>
                                <span>Contact Number :</span>{" "}
                                {el?.spoke_mobile || "Not Provided"}
                              </p>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <p>
                                <span>Email :</span> {el?.spoke_email}
                              </p>
                              <p>
                                <span>Designation :</span>{" "}
                                {el?.spoke_designation || "Not provided"}
                              </p>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    );
                  })}
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Point of Contact Details
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    No Results to show
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="title">
        <h1>Client Management List</h1>
        <div
          className="title-btn"
          style={{ justifyContent: "flex-end !important" }}
        >
          {isRolePermission?.permissions?.["2"] && (
            <>
              <button
                onClick={() =>
                  navigate(SUPER_ADMIN_CLIENT_MANAGEMENT_BULK_UPLOAD)
                }
              >
                <UploadIcon width={18} height={18} />

                <span>Upload Bulk Client </span>
              </button>

              <button
                onClick={() =>
                  navigate(SUPER_ADMIN_CLIENT_MANAGEMENT_PROFILE_PAGE)
                }
              >
                <PlusIcon />
                <span>New Client</span>
              </button>
            </>
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
            {/* <AutoCompleteTextField handleChangeSearch={handleChangeSearch} handleKeyDown={handleKeyDown} clientData={clientListAll} autocompleteSuggestedData={autocompleteSuggestedData} SetAutocompleteSuggestedData={setAutocompleteSuggestedData} /> */}

          </div>
          <div className="subadmin-btn">
            <button
              className="filter-btn clear_all_btn"
              onClick={handleClearAll}
              style={{ display: [isFilerApplied ? "" : "none"] }}
            >
              Clear All
            </button>

            <FilterModal
              handleClose={handleCloseFilter}
              focusHandler={focusHandler}
              blurHandler={blurHandler}
              changeHandler={changeHandler}
              formValues={formValues}
              setFormValues={setFormValues}
              handleClearAll={handleClearAll}
              handleSubmit={handleSubmit}
              showOrganisation
              showState
              stateList={stateListModified}
              errorMessage={errors}
            />

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
          {store?.status && (
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"flex-start"}}>
                      <p
                        style={{
                          fontSize: "small",
                          color: "#00B2FF",
                          fontWeight: "bold",
                          marginBottom: "10px",
                        }}
                      >
                         Active Clients
                      </p>
                      <DeleteIcon style={{height:"1rem",width:"1rem",marginLeft:"10px"}} onClick={handleFilterRemove}/>
                    </div>
                    )}
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
                    <tr key={index}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>
                        {item?.url ? (
                          <img src={item?.url} className="client_logo" />
                        ) : (
                          <img src={DummyImage} className="client_logo" />
                        )}
                      </td>
                      <td>{item?.clientcode || "NA"}</td>
                      <td>
                        {item?.clientname?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.clientname || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.clientname || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.clientname || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.email?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.email || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.email || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.email || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.address?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.address || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.address || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.address || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.webpage?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.webpage || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.webpage || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.webpage || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.state?.length > MAX_LENGTH_FOR_TOOLTIP ? (
                          <Tooltip title={item?.state || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.state || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.state || "NA"}</div>
                        )}
                      </td>
                      <td>{item?.organisationType || ""}</td>
                      <td>
                        {item?.sector?.length > 1 ? (
                          <Tooltip title={item?.sector?.map((el) => el?.sectorName).join(", ") || ""} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "100px",
                              }}
                            >
                              {item?.sector?.map((el) => el?.sectorName).join(", ") || ""}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.sector?.[0]?.sectorName || ""}</div>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {
                          <Button
                            sx={{
                              textTransform: "none",
                            }}
                            onClick={(e) => handleOpen(item?.spoke)}
                          >
                            View Details
                          </Button>
                        }
                      </td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td style={{ textAlign: "center" }}>
                          {statusLoading && id == item._id ? (
                            <FormSwitch
                              value={
                                item?.client_status == "Active" ? true : false
                              }
                              onChange={(e) => handleStatusChange(e, item?._id)}
                            />
                          ) : (
                            <FormSwitch
                              value={
                                item?.client_status == "Active" ? true : false
                              }
                              onChange={(e) => handleStatusChange(e, item?._id)}
                            />
                          )}
                        </td>
                      )}
                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
                        <td style={{ textAlign: "center" }}>
                          <div className="action-btn">
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
                              showDelete={item?.client_status === "Inactive"}
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
      <POCModal data={setSpokeData} />
    </div>
  );
};

export default ClientManagement;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "S.NO" },
    { name: "logo", label: "Logo" },
    { name: "clientcode", label: "Client Code" },
    { name: "clientname", label: "Client Name" },
    { name: "email", label: "Email" },
    { name: "address", label: "Address" },
    { name: "webpage", label: "Website" },
    { name: "state", label: "State" },
    { name: "organisationType", label: "Organisation Type" },
    { name: "sector", label: "Sector" },
    { name: "spoke", label: "Point Of Contact" },
    { name: "client_status", label: "STATUS" },
    { name: "actions", label: "ACTIONS" },
  ];
  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns?.filter((column) => column?.name !== "client_status");
  }
  if (
    !isRolePermission?.permissions?.["3"] &&
    !isRolePermission?.permissions?.["4"]
  ) {
    columns = columns?.filter((column) => column?.name !== "actions");
  }
  return columns;
};
