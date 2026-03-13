import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./style.css";
import { ReactComponent as PlusIcon } from "../../../../../assets/images/pages/clientManagement/plus-icon.svg";
import {
  SUPER_ADMIN_BULK_UPLOAD_QUESTION,
  SUPER_ADMIN_EDIT_QUESTION_VIVA_PAGE,
  SUPER_ADMIN_QUESTION,
  SUPER_ADMIN_QUESTION_FORM_LIST_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { TableHeader } from "../../../../../components/common/table";
import { useDispatch, useSelector } from "react-redux";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { ClipLoader, PropagateLoader } from "react-spinners";
import { ReactComponent as SearchIcon } from "../../../../../assets/icons/search-icon-grey.svg";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import {
  ExamConductLanguages,
  exportData,
} from "../../../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ActionDropdown } from "../../../../../components/common/DropDown";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { qbManagementSelector } from "../../../../../redux/slicers/superAdmin/questionBankSlice";
import {
  getQuestionsListApi,
  deleteParticularQuestionApi,
} from "../../../../../api/superAdminApi/questionBank";
import FilterModal from "../../../../../components/common/Modal/FilterModal";
import AddNewBtn from "../../../../../components/addNewBtn";
import validateField from "../../../../../utils/validateField";
import {
  QUESTION_TYPES,
  SECTIONS,
  LANGUAGES,
  ROLESPERMISSIONS,
} from "../../../../../config/constants/projectConstant";
import { ReactComponent as BackIcon } from "../../../../../assets/icons/chevron-left.svg";
import SelectInput from "../../../../../components/common/SelectInput";

const UserManagementList = () => {
  const initialFormValues = {
    language: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { allQuestions = [] } = useSelector(qbManagementSelector);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // conditional rendering
  const { renderDecider = {} } = useSelector(authSelector);
  const [renderDetails, setRenderDetails] = useState();
  const [deletePermitted, setDeletePermitted] = useState();
  const [editPermitted, setEditPermitted] = useState();
  const [createPermitted, setCreatePermitted] = useState();
  const [fetchedLanguages, setFetchedLanguages] = useState([]);
  // const [sample, setSample] = useState([{ label: "", value: "" }]);

  // permissions
  const { QUESTION_BANK_FEATURE, QUESTION_BANK_SUB_FEATURE_2 } =
    ROLESPERMISSIONS;
  const featureName = QUESTION_BANK_FEATURE;
  const subFeatureName = QUESTION_BANK_SUB_FEATURE_2;

  const params = useParams();

  const getList = () => {
    setLoading(true);
    dispatch(
      getQuestionsListApi(
        setLoading,
        page,
        searchQuery,
        limit,
        setTotalPages,
        params.id,
        formValues?.language,
        setFetchedLanguages
      )
    );
  };

  useEffect(() => {
    if (renderDecider?.length > 0) {
      setRenderDetails(renderDecider[8].userManagement);
      setDeletePermitted(renderDecider[8].userManagement?.delete);
      setEditPermitted(renderDecider[8].userManagement?.edit);
      setCreatePermitted(renderDecider[8].userManagement?.create);
    }
  }, [renderDecider.length]);

  useEffect(() => {
    getList();
  }, [page, limit, formValues]);

  useEffect(() => {
    setSortedData(allQuestions);
    setTotalPagesUser(totalPages);
  }, [allQuestions, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...allQuestions].sort((a, b) => {
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
  }, [allQuestions, sortOrders]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "") getList();
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setLoading(true);
      dispatch(
        getQuestionsListApi(
          setLoading,
          page,
          "",
          limit,
          setTotalPages,
          params.id,
          formValues?.language
        )
      );
    }
    setSearchQuery(value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };
  const exportClientData = () => {
    const exportData = allQuestions?.map((item) => {
      if (item?.options) {
        return {
          difficulty: item?.difficulty_level,
          question: item?.questionText.replace(/<[^>]+>/g, ""),
          option1: item?.options[0]?.optionValue,
          option2: item?.options[1]?.optionValue,
          option3: item?.options[2]?.optionValue,
          option4: item?.options[3]?.optionValue,
          correctAns: item?.answer[0]?.rawAnswer,
          marks: item?.marks,
        };
      } else {
        return {
          question: item?.questionText,
          answer: item?.answer,
          marks: item?.marks,
        };
      }
    });
    return exportData;
  };
  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(
        exportClientData(),
        allQuestions[0]?.options ? columns : columns_viva
      )
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Question Form List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "QUESTIONS LIST.xlsx");
  };

  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = allQuestions?.length;
    dispatch(
      deleteParticularQuestionApi(
        setLoading,
        setDeleteModal,
        actionId,
        getList,
        params?.section
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
    if (!allQuestions[0]?.options) {
      navigate(
        `${SUPER_ADMIN_EDIT_QUESTION_VIVA_PAGE}/${params.id}/${actionId}/${
          params.section
        }/${formValues?.language ? formValues?.language : "def"}`
      );
    } else
      navigate(
        `${SUPER_ADMIN_QUESTION}/${params?.id}/${actionId}/${
          formValues?.language ? formValues?.language : "def"
        }`
      );
  };

  const filterFields = Object.keys(formValues);

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
    // handleSubmit();
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
      if (value === "") {
        formErrors[name] = "Select Language";
      }
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      // setLoading(true);
      getList();
      handleClose();
    }
  };
  const handleClearAll = () => {
    setFormValues(initialFormValues);
  };

  return (
    <div className="main-content">
      <div className="title">
        <div className="title_container">
          <div className="title_back_button">
            <BackIcon
              style={{ cursor: "pointer" }}
              onClick={() => {
                location?.state?.from === "questionFormList"
                  ? navigate(-1)
                  : navigate(SUPER_ADMIN_QUESTION_FORM_LIST_PAGE);
                // navigate(-1);
              }}
            />
            <h1>Questions List</h1>
          </div>
          <div className="title-btn">
            <AddNewBtn
              btnText={"Add New"}
              Icon={PlusIcon}
              route={
                params?.section === "Theory"
                  ? `${SUPER_ADMIN_QUESTION}/${params.id}`
                  : `${SUPER_ADMIN_BULK_UPLOAD_QUESTION}/${params.id}/${params?.section}`
              }
              showBtn={true}
            />
          </div>
        </div>
      </div>

      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search"
              style={{ background: "#F8F8F8", padding: "2px" }}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "#231F20", width: 15 }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="subadmin-btn">
            <button
              className="filter-btn clear_all_btn"
              onClick={handleClearAll}
              style={{ display: [formValues?.language ? "" : "none"] }}
            >
              Clear All
            </button>
            <div className="language_filter_wrapper">
              <SelectInput
                label=""
                name="language"
                placeHolder={
                  fetchedLanguages.length > 0
                    ? "Select Language"
                    : "No Language Found"
                }
                options={fetchedLanguages}
                value={formValues?.language || ""}
                handleChange={changeHandler}
                disabled={fetchedLanguages.length < 1}
              />
            </div>
            {isFilterOpen ? (
              <FilterModal
                handleClose={handleClose}
                focusHandler={focusHandler}
                blurHandler={blurHandler}
                changeHandler={changeHandler}
                formValues={formValues}
                setFormValues={setFormValues}
                handleClearAll={handleClearAll}
                handleSubmit={handleSubmit}
                filterFields={filterFields}
                showQuestionLanguage={true}
                languageOptions2={fetchedLanguages}
              />
            ) : (
              ""
            )}

            <button
              className="export-btn"
              onClick={
                loading || sortedData?.length === 0 ? undefined : handleExport
              }
            >
              {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
            </button>
          </div>
        </div>
        <div className="table-wrapper">
          {loading ? (
            <>
              <div style={{ marginLeft: "50%", marginTop: 50 }}>
                <PropagateLoader color="#2ea8db" />
              </div>
            </>
          ) : !sortedData[0]?.options ? (
            <>
              <table>
                <TableHeader
                  columns={columns_viva}
                  sortOrders={sortOrders}
                  setSortOrders={setSortOrders}
                />
                <tbody>
                  {sortedData?.length > 0 ? (
                    sortedData?.map((item, index) => (
                      <tr key={item?._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>
                          {item?.questionText?.length > 10 ? (
                            <Tooltip
                              title={
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item?.questionText,
                                  }}
                                />
                              }
                              arrow
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: item?.questionText,
                                }}
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "150px", // Set a maximum width for the cell
                                }}
                              >
                                {/* {item?.questionText || "NA"} */}
                              </div>
                            </Tooltip>
                          ) : (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item?.questionText,
                              }}
                            >
                              {/* {item?.questionText || "NA"} */}
                            </div>
                          )}
                        </td>
                        <td>
                          {item?.answer?.length > 10 ? (
                            <Tooltip
                              title={
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item?.answer,
                                  }}
                                />
                              }
                              arrow
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: item?.answer,
                                }}
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "200px", // Set a maximum width for the cell
                                }}
                              ></div>
                            </Tooltip>
                          ) : (
                            <div>{item?.answer || "-"}</div>
                          )}
                        </td>
                        <td>{item?.marks || "-"}</td>
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
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="no-list-table">
                      <td>
                        <p>No questions found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <table>
                <TableHeader
                  columns={columns}
                  sortOrders={sortOrders}
                  setSortOrders={setSortOrders}
                />
                <tbody>
                  {sortedData?.length > 0 ? (
                    sortedData?.map((item, index) => (
                      <tr key={item?._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>{item?.options ? "Theory" : "" || "NA"}</td>
                        <td>{item?.difficulty_level || "-"}</td>

                        <td className="questionTitle_container">
                          {item?.questionText?.length > 10 ? (
                            <Tooltip
                              title={
                                <div
                                  className="image-tooltip"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.questionText,
                                  }}
                                />
                              }
                              arrow
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: item?.questionText,
                                }}
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {/* {item?.questionText || "NA"} */}
                              </div>
                            </Tooltip>
                          ) : (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item?.questionText,
                              }}
                            >
                              {/* {item?.questionText || "NA"} */}
                            </div>
                          )}
                        </td>

                        <td className="questionTitle_container">
                          {item?.options[0]?.optionValue?.length > 10 ? (
                            <Tooltip
                              title={item?.options[0]?.optionValue || ""}
                              arrow
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {<p>{item?.options[0]?.optionValue || "-"}</p>}
                                {item?.options[0]?.optionUrl && (
                                  <img
                                    src={item?.options[0]?.optionUrl}
                                    alt=" "
                                  />
                                )}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="questionTitle_container">
                              {<p>{item?.options[0]?.optionValue || "-"}</p>}
                              {item?.options[0]?.optionUrl && (
                                <img
                                  src={item?.options[0]?.optionUrl}
                                  alt=" "
                                />
                              )}
                            </div>
                          )}
                        </td>

                        <td className="questionTitle_container">
                          {item?.options[1]?.optionValue?.length > 10 ? (
                            <Tooltip
                              title={item?.options[1]?.optionValue || "-"}
                              arrow
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {<p>{item?.options[1]?.optionValue || "-"}</p>}
                                {item?.options[1]?.optionUrl && (
                                  <img
                                    src={item?.options[1]?.optionUrl}
                                    alt=" "
                                  />
                                )}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="questionTitle_container">
                              {<p>{item?.options[1]?.optionValue || "-"}</p>}
                              {item?.options[1]?.optionUrl && (
                                <img
                                  src={item?.options[1]?.optionUrl}
                                  alt=" "
                                />
                              )}
                            </div>
                          )}
                        </td>

                        <td className="questionTitle_container">
                          {item?.options[2]?.optionValue?.length > 10 ? (
                            <Tooltip
                              title={item?.options[2]?.optionValue || "-"}
                              arrow
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {<p>{item?.options[2]?.optionValue || "-"}</p>}
                                {item?.options[2]?.optionUrl && (
                                  <img
                                    src={item?.options[2]?.optionUrl}
                                    alt=" "
                                  />
                                )}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="questionTitle_container">
                              {<p>{item?.options[2]?.optionValue || "-"}</p>}
                              {item?.options[2]?.optionUrl && (
                                <img
                                  src={item?.options[2]?.optionUrl}
                                  alt=" "
                                />
                              )}
                            </div>
                          )}
                        </td>

                        <td className="questionTitle_container">
                          {item?.options[3]?.optionValue?.length > 10 ? (
                            <Tooltip
                              title={item?.options[3]?.optionValue || "-"}
                              arrow
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {<p>{item?.options[3]?.optionValue || "-"}</p>}
                                {item?.options[3]?.optionUrl && (
                                  <img
                                    src={item?.options[3]?.optionUrl}
                                    alt=" "
                                  />
                                )}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="questionTitle_container">
                              {<p>{item?.options[3]?.optionValue || "-"}</p>}
                              {item?.options[3]?.optionUrl && (
                                <img
                                  src={item?.options[3]?.optionUrl}
                                  alt=" "
                                />
                              )}
                            </div>
                          )}
                        </td>

                        <td className="questionTitle_container">
                          {item?.options[4]?.optionValue?.length > 10 ? (
                            <Tooltip
                              title={item?.options[4]?.optionValue || "-"}
                              arrow
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {<p>{item?.options[4]?.optionValue || "-"}</p>}
                                {item?.options[4]?.optionUrl && (
                                  <img
                                    src={item?.options[4]?.optionUrl}
                                    alt=" "
                                  />
                                )}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="questionTitle_container">
                              {<p>{item?.options[4]?.optionValue || "-"}</p>}
                              {item?.options[4]?.optionUrl && (
                                <img
                                  src={item?.options[4]?.optionUrl}
                                  alt=" "
                                />
                              )}
                            </div>
                          )}
                        </td>

                        <td className="questionTitle_container">
                          {item?.options[5]?.optionValue?.length > 10 ? (
                            <Tooltip
                              title={item?.options[5]?.optionValue || "-"}
                              arrow
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px", // Set a maximum width for the cell
                                }}
                              >
                                {<p>{item?.options[5]?.optionValue || "-"}</p>}
                                {item?.options[5]?.optionUrl && (
                                  <img
                                    src={item?.options[5]?.optionUrl}
                                    alt=" "
                                  />
                                )}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="questionTitle_container">
                              {<p>{item?.options[5]?.optionValue || "-"}</p>}
                              {item?.options[5]?.optionUrl && (
                                <img
                                  src={item?.options[5]?.optionUrl}
                                  alt=" "
                                />
                              )}
                            </div>
                          )}
                        </td>

                        <td>{item?.answer[0]?.rawAnswer || "-"}</td>
                        <td>{item?.marks || "-"}</td>
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
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="no-list-table">
                      <td>
                        <p>No questions found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      <DeleteModal
        title="Delete Question"
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
    </div>
  );
};

export default UserManagementList;

const columns = [
  { name: "_id", label: "S.No." },
  { name: "section", label: "Section" },
  { name: "difficulty", label: "Difficulty Level" },
  { name: "question", label: "Question" },
  { name: "option1", label: "Option 1" },
  { name: "option2", label: "Option 2" },
  { name: "option3", label: "Option 3" },
  { name: "option4", label: "Option 4" },
  { name: "option5", label: "Option 5" },
  { name: "option6", label: "Option 6" },
  { name: "correctAns", label: "Correct Option" },
  { name: "marks", label: "Marks" },
  { name: "actions", label: "Actions" },
];

const columns_viva = [
  { name: "_id", label: "S.No" },
  { name: "question", label: "Question" },
  { name: "answer", label: "Answer" },
  { name: "marks", label: "Marks" },
  { name: "actions", label: "Actions" },
];
