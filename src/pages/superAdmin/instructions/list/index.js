import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../superAdmin/jobRole/style.css";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  CREATE_INSTRUCTIONS,
  EDIT_INSTRUCTIONS,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../components/common/table";
import { FormSwitch } from "../../../../components/common/input";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader, PulseLoader } from "react-spinners";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../components/common/DropDown";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { instructionsManagementSelector } from "../../../../redux/slicers/superAdmin/instructionsSlice";
import {
  getInstructionListApi,
  deleteSingleInstructionApi,
  changeSingleInstructionStatusApi,
} from "../../../../api/superAdminApi/instructions";
import FilterModal from "../../../../components/common/Modal/FilterModal";
import validateField from "../../../../utils/validateField";
import { ReactComponent as EyeIcon } from "../../../../assets/icons/eye.svg";
import InstructionModel from "../instructionModel";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import SearchInput from "../../../../components/common/searchInput";
const UserManagementList = () => {
  const initialFormValues = {
    F_status: "",
    from: "",
    to: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { instructionsList = [] } = useSelector(instructionsManagementSelector);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionBtn, setActionBtn] = useState(null);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { userInfo = {} } = useSelector(authSelector);

  // permission
  const { INSTRUCTIONS_FEATURE, INSTRUCTIONS_LIST_FEATURE } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = INSTRUCTIONS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = INSTRUCTIONS_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const getList = () => {
    setLoading(true);
    dispatch(getInstructionListApi(setLoading, page, "", limit, setTotalPages));
  };

  useEffect(() => {
    setSortedData(instructionsList);
    setTotalPagesUser(totalPages);
  }, [instructionsList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...instructionsList].sort((a, b) => {
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
  }, [instructionsList, sortOrders]);

  const handleStatusChange = (e, instructionId) => {
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(instructionId);
    const formData = {
      status: value,
    };
    dispatch(
      changeSingleInstructionStatusApi(
        setLoading,
        instructionId,
        formData,
        getList
      )
    );
  };

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(getInstructionListApi(setLoading, page, "", limit, setTotalPages));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getInstructionListApi(
        setLoading,
        1,
        "",
        event.target.value,
        setTotalPages
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const exportClientData = () => {
    console.log("InstructionList",instructionsList)
    const exportData = instructionsList?.map((item) => {
      return {
        instruction: item?.instructionName,
        language: item?.language,
        description: item?.islanguageHindi
          ? item?.descriptionHindi
          : item?.islanguageEnglish || item?.islanguageBoth
          ? item?.descriptionEnglish
          : "NA",
        status: item?.status,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Instructions List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Instructions List.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = instructionsList?.length;
    dispatch(
      deleteSingleInstructionApi(
        setLoading,
        actionId,
        len,
        getList,
        setDeleteModal
      )
    );
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const editBtnHandler = () => {
    setShowActionBtn(false);
    navigate(`${EDIT_INSTRUCTIONS}/${actionId}`);
  };
  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;

    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);

    if (fieldError) {
      setErrors({
        [name]: fieldError,
      });
    } else {
      setErrors({});
    }
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };
  const handleDateChange = (newDate, name) => {
    const formattedDate = newDate.format("YYYY-MM-DD");
    const fieldError = validateField(
      name,
      formattedDate,
      formValues?.startDate
    );
    setFormValues((pre) => ({ ...pre, [name]: formattedDate }));
    if (fieldError) {
      setErrors({ [name]: fieldError });
    } else {
      setErrors({});
    }
  };
  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const handleClose = () => {
    setIsFilterOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(formValues).forEach((name) => {
      const value = formValues[name];
      const fieldError = validateField(name, value);
      if (fieldError) {
        formErrors[name] = fieldError;
      }
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const from = formValues?.from;
      const to = formValues?.to;
      const status = formValues?.F_status;
      handleClose();
    }
  };
  const handleClearAll = () => {
    setFormValues(initialFormValues);
  };

  const handleOpen = (insId) => {
    setOpen(true);
    setId(insId);
  };
  const handleModelClose = () => setOpen(false);

  return (
    <div className="main-content">
      <div className="title">
        <h1>Instruction List</h1>
        <div className="title-btn">
          {isRolePermission?.permissions?.["2"] && (
            <button onClick={() => navigate(CREATE_INSTRUCTIONS)}>
              <PlusIcon />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            <SearchInput
              searchQuery={searchQuery}
              handleTrimPaste={handleTrimPaste}
              setSearchQuery={setSearchQuery}
              apiHandler={getInstructionListApi}
              setLoading={setLoading}
              page={page}
              limit={limit}
              setTotalPages={setTotalPages}
            />
          </div>
          <div className="subadmin-btn">
            {/* <button className="filter-btn" onClick={handleFilter}>
                            Filter
                        </button>
                        {isFilterOpen ? (
                            <FilterModal
                                handleClose={handleClose}
                                focusHandler={focusHandler}
                                blurHandler={blurHandler}
                                changeHandler={changeHandler}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                handleDateChange={handleDateChange}
                                handleClearAll={handleClearAll}
                                handleSubmit={handleSubmit}
                            />
                        ) : (
                            ""
                        )} */}
            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={
                  loading || sortedData?.length === 0 ? undefined : handleExport
                }
              >
                {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
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
                  sortedData?.map((item, index) => (
                    <tr key={item?._id}>
                      <td>{(page - 1) * limit + (index + 1)}</td>
                      <td>{item?.instructionName}</td>
                      <td>{item?.language}</td>
                      {item?.islanguageHindi && (
                        <td>
                          <div
                            className="text-elip-list"
                            dangerouslySetInnerHTML={{
                              __html: item?.descriptionHindi || "NA",
                            }}
                          ></div>
                        </td>
                      )}

                      {item?.islanguageEnglish && (
                        <td>
                          <div
                            className="text-elip-list"
                            dangerouslySetInnerHTML={{
                              __html: item?.descriptionEnglish || "NA",
                            }}
                          ></div>
                        </td>
                      )}

                      {item?.islanguageBoth && (
                        <td>
                          <div
                            className="text-elip-list"
                            dangerouslySetInnerHTML={{
                              __html: item?.descriptionEnglish || "NA",
                            }}
                          ></div>
                        </td>
                      )}
                      <td>
                        <InstructionModel
                          handleOpen={handleOpen}
                          handleClose={handleModelClose}
                          loading={loading}
                          id={item?._id}
                          open={open}
                          descriptionLanguage={item?.language}
                          descriptionHindi={item?.descriptionHindi}
                          descriptionEnglish={item?.descriptionEnglish}
                        />
                      </td>
                      {isRolePermission?.permissions?.["6"] && (
                        <td>
                          {statusLoading && id === item._id ? (
                            <PulseLoader size="10px" color="#0bbbfe" />
                          ) : (
                            <FormSwitch
                              value={
                                item?.client_status === "active" ? true : false
                              }
                              onChange={(e) => handleStatusChange(e, item?._id)}
                            />
                          )}
                        </td>
                      )}
                      {isRolePermission?.permissions?.["3"] ||
                      isRolePermission?.permissions?.["4"] ? (
                        <td>
                          <div>
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
                              showDelete={
                                item?.client_status !== "active" ? true : false
                              }
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
        title="Delete Instruction"
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
          count={totalPagesUser}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default UserManagementList;

const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "Sr.No." },
    { name: "instruction", label: "Instruction" },
    { name: "language", label: "Language" },
    { name: "description", label: "Description" },
    { name: "preview", label: "preview" },
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
