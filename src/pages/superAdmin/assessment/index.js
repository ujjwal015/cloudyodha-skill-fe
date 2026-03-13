import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import "../questionBank/createQuestionBank/module.createQuestionBank.css";
import {
  SUPER_ADMIN_CREATE_ASSESSMENT_PAGE,
  SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
  SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE,
} from "../../../config/constants/routePathConstants/superAdmin";
import { ReactComponent as FileIcon } from "../../../assets/images/pages/assessment/pdf-1.svg";
import { ReactComponent as PreviewIcon } from "../../../assets/images/pages/assessment/previewIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Dialog,
  DialogContent,
  Box,
  Tooltip,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as SearchIcon } from "./../../../assets/icons/search-icon.svg";
import { PropagateLoader } from "react-spinners";
import {
  deleteAssessmentApi,
  downloadTheoryVivaPracticalSet,
  getPreviewAssessmentListApi,
  getPreviewAssessmentDataForPdf,
} from "../../../api/superAdminApi/assessment";
import DeleteModal from "./../../../components/common/Modal/DeleteModal";
import { assessmentSelector } from "../../../redux/slicers/superAdmin/assessmentSlice";
import {
  exportData,
  getSubRole,
  handleTrimPaste,
  userRoleType,
} from "../../../utils/projectHelper";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { TableHeader } from "../../../components/common/table";
import CopyModal from "./../../../components/common/Modal/CopyModal";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import { authSelector } from "../../../redux/slicers/authSlice";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CustomPagination from "../../../components/common/customPagination";
import { generateMultilingualPdf, MultilingualPdfDocument } from "./vivaPdfGenerator";
import { pdf } from "@react-pdf/renderer";
import { generatePracticalPdf } from "./practicalPdfGenerator";
import { generateTheoryPdf } from "./theoryPdfGenerator";
const Assessment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessmentList = [] } = useSelector(assessmentSelector);
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [id, setId] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [statusLoading, setStatusLoading] = useState(false);
  const [actionId, setActionId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [copy, setCopy] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [openLink, setOpenlink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewSets, setViewSets] = useState(false);
  const { userInfo = {} } = useSelector(authSelector);
  const [noOfSetId, setNoOfSetId] = useState("");
  const [section, setSection] = useState();
  const [batchMode, setBatchMode] = useState();
  const [setsChecked, setSetsChecked] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [individualSetId, setIndividualSetId] = useState();
  const [vivaQuestions, setVivaQuestions] = useState();
  const [practicalQuestions, setPracticalQuestions] = useState([]);
  const [hasVivaQuestion, setHasVivaQuestion] = useState(false);
  const [hasPracticalQuestion, setHasPracticalQuestion] = useState(false);
  const [offlineTheoryData, setOfflineTheoryData] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState(); 
  const [languages, setLanguages] = useState('');
  const [clientName,setClientName]=useState("");
  const [clientLogo,setClientLogo]=useState("");

  // permission
  const { ASSESSMENT_FEATURE, ASSESSMENT_LIST_FEATURE } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = ASSESSMENT_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = ASSESSMENT_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  const getList = (search = true) => {
    setLoading(true);
    dispatch(
      getPreviewAssessmentListApi(setLoading, page, limit, search ? searchQuery : "", setTotalPages)
    );
  };
  useEffect(() => {
    getList();
  }, []);
  const handleOpenLink = (value) => {
    setOpenlink(true);
    setCopy(value);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  const handleCloseCopyModel = () => setOpenlink(false);
  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(
      getPreviewAssessmentListApi(setLoading, nxtPage, limit, "", setTotalPages)
    );
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getPreviewAssessmentListApi(
        setLoading,
        1,
        event.target.value,
        searchQuery,
        setTotalPages
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };
  const handleQuestionPreviewModelOpen = (
    id,
    setIds,
    setDetails,
    section,
    batchMode,
    vivaQuestions,
    practicalQuestions,
    clientName,
    clientLogo
  ) => {
    // setNoOfSetId(setIds);
    setNoOfSetId(setDetails);
    setViewSets(true);
    setId(id);
    setSection(section);
    setBatchMode(batchMode);
    setVivaQuestions(vivaQuestions);
    setPracticalQuestions(practicalQuestions);
    setClientName(clientName);
    setClientLogo(clientLogo)
  };

  const handleQuestionPreview = () => {
    setViewSets(false);
    if (batchMode === 'offline') {
      navigate(`${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/${id}/${offlineTheoryData?.setID}`);
    } else {
      navigate(`${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/${id}/${selectedValue}`);
    }
  };
  const handleVivaQuestionPreview = () => {
    setViewSets(false);
    navigate(`${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/viva`, {
      state: vivaQuestions,
    });
  };
  const handlePracticalQuestionPreview = () => {
    setViewSets(false);
    navigate(`${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/practical`, {
      state: practicalQuestions,
    });
  };
  useEffect(() => {
    setSortedData(assessmentList?.assesmentDetails);
    setTotalPagesUser(totalPages);
  }, [assessmentList?.assesmentDetails, totalPages]);
  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...assessmentList?.assesmentDetails].sort(
          (a, b) => {
            const valueA = a[sortColumn];
            const valueB = b[sortColumn];
            if (typeof valueA === "string" && typeof valueB === "string") {
              return sortOrder === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
            } else {
              return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
            }
          }
        );
        setSortedData(sortedData);
      }
    };
    sortData();
  }, [assessmentList?.assesmentDetails, sortOrders]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };
  const confirmDelete = () => {
    dispatch(
      deleteAssessmentApi(setLoading, setDeleteModal, actionId, getList)
    );
  };
  const editBtnHandler = (id, index) => {
    setActionOpen(false);
    navigate(`${SUPER_ADMIN_CREATE_ASSESSMENT_PAGE}/${actionId}`);
  };
  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const handleClosesetsModal = () => {
    setViewSets(false);
    setActionOpen(false);
    setSetsChecked([])
  };
  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const getLinkHandler = (item) => {
    handleOpenLink(item);
  };
  const handleStatusChange = (e, id) => {
    setStatusLoading(false);
    const { checked } = e.target;
    const value = checked ? "active" : "inactive";
    setId(id);
    const formData = {
      status: value,
    };
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value == "") {
      getList(false);
    }
    setSearchQuery(value);
  };
  const handleSearch = () => {
    if (searchQuery !== "")
      dispatch(
        getPreviewAssessmentListApi(setLoading, 1, limit, searchQuery, setTotalPages)
      );
    setPage(1);
  };
  const exportAssessmentData = () => {
    const exportData = assessmentList?.assesmentDetails?.map((item, index) => {
      return {
        batchSipId: item?.batch?.client?.clientcode || "NA",
        clientName: item?.batch?.client?.clientname || "NA",
        jobRole: item?.jobRole || "NA",
        examCenter: item?.batch?.examCenter?.examCenterName || "NA",
        assessmentDate: item?.batch?.assessmentDate || "NA",
        section: Object.keys(item?.section)
          .filter((key) => item?.section[key] === true)
          .join(","),
        batchMode: item?.batchMode || "NA",
        noOfSet: item?.set_id?.length || "NA",
      };
    });
    return exportData;
  };
  const handleExport = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportAssessmentData(), getColumns())
    );
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");
    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });
    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Assessment List.xlsx");
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div>
            <div>{children}</div>
          </div>
        )}
      </div>
    );
  }
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const handleFileChange = (e, questions, section) => {
    if (section === "viva") {
      setHasVivaQuestion(e.target.checked);
    }
    if (section === "practical") {
      setHasPracticalQuestion(e.target.checked);
    }
  };

  const downloadTheorySet = () => {
    downloadTheoryVivaPracticalSet(setsChecked, generateTheoryPdf,selectedLanguage,clientName,clientLogo);
    setSelectedLanguage('')
    setSetsChecked([]);
  };

  const downloadVivaQuestions = () => {
    const assessmentData = [];

    vivaQuestions.forEach((question, index) => {
    // Base English question
    assessmentData.push({
      nos: question?.nosName, 
      sno: (index + 1).toString(),
      question: question.questionText,
      answer: `The candidate mentioned:\n${question.answer.replace(/\r\n|\r|\n/g, "\n")}`,
    });

    // Translated versions
    if (Array.isArray(question.lang)) {
      question.lang.forEach((translation) => {
        assessmentData.push({
          nos: "",
          sno: "",
          question: translation.questionText,
          answer: "", // No answer provided for translated questions in given data
        });
      });
    }
  });

    const filename="Viva Assesment";
    const title=`Viva Assessment Preview \n \t\t ${clientName}`;
    generateMultilingualPdf(assessmentData,title,filename);
  };
  const downloadPracticalQuestions = () => {
    const assessmentData = [];

    practicalQuestions.forEach((question, index) => {
    // Base English question
      assessmentData.push({
        nos: question?.nosName, // You can fill NOS code if available elsewhere
        passage: question.questionText,
        rubric: `The candidate mentioned:\n${question.answer.replace(/\r\n|\r|\n/g, "\n")}`,
      });

      // Translated versions
      if (Array.isArray(question.lang)) {
        question.lang.forEach((translation) => {
          assessmentData.push({
            nos: "",
            passage: translation.questionText,
            rubric: "", // No answer provided for translated questions in given data
          });
        });
      }
    });

    const filename="Practical Assesment";
    const title=`Practical Assessment Preview \n \t\t ${clientName}`;
    generatePracticalPdf(assessmentData,title,filename);
  };
  
  //used earlier
  const downloadPdfDocument = (jsonData) => {
    const doc = new jsPDF();
    const columns = Object.keys(jsonData[0]).map((key) => ({
      title: key.toUpperCase(),
      dataKey: key,
    }));
    autoTable(doc, {
      columns: columns,
      body: jsonData,
    });
    doc.save("data.pdf");
  };

  const collectSets = (e, item) => {
    const setName = item?.setName;
    const setID = item?._id;
    const isChecked = e.target.checked;
    const targetSet = {
      setName,
      isChecked,
      setID,
    };
    setOfflineTheoryData({ ...targetSet, assessmentId: item?.assesment_id });

    setIndividualSetId(setID);

    const prevSets = [...setsChecked];
    const findDup = prevSets.find((el, index) => {
      if (el?.setName === setName) {
        return true;
      }
    });
    if (findDup) {
      const updatedSets = prevSets.map((el, index) => {
        if (el.setName === findDup.setName) {
          el.isChecked = !el.isChecked;
          return el;
        } else return el;
      });
      setSetsChecked([...updatedSets]);
    } else {
      prevSets.push(targetSet);
      setSetsChecked([...prevSets]);
    }
    dispatch(
      getPreviewAssessmentDataForPdf(
            id,
            setID,
            setLanguages
          )
        );
  };
  const handlePreviewChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const uppercaseAlphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode("A".charCodeAt(0) + i)
  );

  const selectCheckBoxDynamic = (index) => {
    const findCheck = setsChecked.find((el) => {
      if (
        el?.setName === `Set-${uppercaseAlphabets[index]}` &&
        el?.isChecked === true
      )
        return true;
    });

    if (findCheck) return true;
    return false;
  };

  useEffect(() => {
    if (searchQuery) {
      const getData = setTimeout(() => {
        getList();
      }, 500);

      return () => clearTimeout(getData);
    }
  }, [searchQuery]);

  const MAX_LENGTH_FOR_TOOLTIP=13;

  return (
    <div className="main-content assessment">
      <div className="title">
        <div className="title-text">
          <h1 onClick={() => navigate(SUPER_ADMIN_ASSESSMENT_LIST_PAGE)}>
            Assessment List
          </h1>
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
              onChange={handleChange}
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
          </div>
          <div className="subadmin-btn">
            {isRolePermission?.permissions?.["5"] && (
              <button
                className="export-btn"
                onClick={
                  assessmentList?.assesmentDetails?.length > 0
                    ? handleExport
                    : undefined
                }
              >
                Export
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
                      <td>
                        {item?.batchSIPId?.length > 10 ? (
                          <Tooltip title={item?.batchSIPId || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "120px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.batchSIPId || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.batchSIPId || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {item?.clientName?.length > 12 ? (
                          <Tooltip title={item?.clientName || "NA"} arrow>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "120px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.clientName || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>{item?.clientName || "NA"}</div>
                        )}
                      </td>
                      <td>
                        {Array.isArray(item.jobRole) ? (
                          item.jobRole.join(", ").length >
                          MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip
                              title={
                                <ul style={{ paddingLeft: "16px" }}>
                                  {item.jobRole.map((role, index) => (
                                    <li key={index}>{`${
                                      index + 1
                                    }. ${role}`}</li>
                                  ))}
                                </ul>
                              }
                              arrow
                            >
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px",
                                }}
                              >
                                {item.jobRole.join(", ")}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item.jobRole.join(", ")}</div>
                          )
                        ) : typeof item.jobRole === "string" ? (
                          item.jobRole.length > MAX_LENGTH_FOR_TOOLTIP ? (
                            <Tooltip title={item.jobRole} arrow>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  maxWidth: "100px",
                                }}
                              >
                                {item.jobRole.replaceAll("\n", " ")}
                              </div>
                            </Tooltip>
                          ) : (
                            <div>{item.jobRole.replaceAll("\n", " ")}</div>
                          )
                        ) : (
                          <div>NA</div>
                        )}
                      </td>
                      <td>
                        {item?.examCenter?.length > 12 ? (
                          <Tooltip
                            title={
                              item?.examCenter || "NA"
                            }
                            arrow
                          >
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                maxWidth: "120px", // Set a maximum width for the cell
                              }}
                            >
                              {item?.examCenter || "NA"}
                            </div>
                          </Tooltip>
                        ) : (
                          <div>
                            {item?.examCenter || "NA"}
                          </div>
                        )}
                      </td>
                      <td>
                        {item?.assessmentStartDate + " - " + item?.assessmentEndDate ||
                          "NA"}
                      </td>
                      <td>
                        {capitalizeFirstLetter(
                          Object.keys(item?.section)
                            .filter((key) => item?.section[key] === true)
                            .join(",")
                        )}
                      </td>
                      <td>{capitalizeFirstLetter(item?.batchMode) || "NA"}</td>
                      <td>
                        <div
                          className="preview-btn"
                          onClick={() => {
                            handleQuestionPreviewModelOpen(
                              item?._id,
                              item?.set_id,
                              item?.setDetails,
                              item?.section,
                              item?.batchMode,
                              item?.vivaQuestions,
                              item?.practicalQuestions,
                              item?.batch?.client?.clientname +
                                " : " +
                                item?.jobRole,
                              item?.batch?.client
                            );
                          }}
                        >
                          {item?.noOfSets || 0}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>
                      <p>No Assessment Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <CopyModal
        handleClose={handleCloseCopyModel}
        handleCopy={handleCopy}
        copy={copy}
        copied={copied}
        openLink={openLink}
      />
      <DeleteModal
        title="Deleting Assessment"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
      <Dialog
        open={viewSets}
        onClose={handleClosesetsModal}
        maxWidth="xs"
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        section-display={section}
      >
        <DialogContent>
          <div className="download-docs-dialog">
            <div className="download-docs-dialog-head">
              <h2>Number of sets</h2>
              <div onClick={handleClosesetsModal}>
                <CloseIcon />
              </div>
            </div>
            <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
              {batchMode && (
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                  <Tab label="Theory" sx={{ textTransform: "capitalize" }} />
                  <Tab label="Viva" sx={{ textTransform: "capitalize" }} />
                  <Tab label="Practical" sx={{ textTransform: "capitalize" }} />
                </Tabs>
              )}

              {batchMode === "online" ? (
                <>
                  <CustomTabPanel value={tabValue} index={0}>
                    {noOfSetId && noOfSetId?.length > 0 ? (
                      noOfSetId?.map((item, index) => (
                        <div
                          key={index}
                          className={
                            selectedValue === item?._id
                              ? "docs-checkbox-card-preview-selected"
                              : "docs-checkbox-card"
                          }
                        >
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Radio
                                  icon={<CircleOutlinedIcon />}
                                  checkedIcon={
                                    <CheckCircleIcon
                                      sx={{ color: "#2EA8DB" }}
                                    />
                                  }
                                  onChange={(e) => handlePreviewChange(e)}
                                  value={item?._id}
                                  checked={selectedValue === item?._id}
                                />
                              }
                              label={
                                <div className="docs-checkbox-label">
                                  <PreviewIcon /> {item?.setName}
                                </div>
                              }
                              labelPlacement="start"
                            />
                          </FormGroup>
                        </div>
                      ))
                    ) : (
                      <div className="no-question-found">
                        <p className="no-question-text">No sets for preview</p>
                      </div>
                    )}
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={1}>
                    {vivaQuestions && vivaQuestions?.length > 0 ? (
                      <div
                        className={
                          hasVivaQuestion
                            ? "docs-checkbox-card-preview-selected"
                            : "docs-checkbox-card"
                        }
                      >
                        <FormControlLabel
                          value="start"
                          control={
                            <Checkbox
                              icon={<CircleOutlinedIcon />}
                              checkedIcon={
                                <CheckCircleIcon sx={{ color: "#2EA8DB" }} />
                              }
                              onChange={(e) => {
                                handleFileChange(e, vivaQuestions, "viva");
                              }}
                              checked={hasVivaQuestion ? true : false}
                            />
                          }
                          label={
                            <div className="docs-checkbox-label">
                              <PreviewIcon /> {"Viva-questions "}
                            </div>
                          }
                          labelPlacement="start"
                        />
                      </div>
                    ) : (
                      <div className="no-question-found">
                        <p className="no-question-text">
                          No viva questions for preview
                        </p>
                      </div>
                    )}
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={2}>
                    {practicalQuestions && practicalQuestions?.length > 0 ? (
                      <div
                        className={
                          hasPracticalQuestion
                            ? "docs-checkbox-card-preview-selected"
                            : "docs-checkbox-card"
                        }
                      >
                        <FormControlLabel
                          value="start"
                          control={
                            <Checkbox
                              icon={<CircleOutlinedIcon />}
                              checkedIcon={
                                <CheckCircleIcon sx={{ color: "#2EA8DB" }} />
                              }
                              onChange={(e) => {
                                handleFileChange(
                                  e,
                                  practicalQuestions,
                                  "practical"
                                );
                              }}
                              checked={hasPracticalQuestion ? true : false}
                            />
                          }
                          label={
                            <div className="docs-checkbox-label">
                              <PreviewIcon /> {"Practical-questions "}
                            </div>
                          }
                          labelPlacement="start"
                        />
                      </div>
                    ) : (
                      <div className="no-question-found">
                        <p className="no-question-text">
                          No practical questions for preview
                        </p>
                      </div>
                    )}
                  </CustomTabPanel>
                </>
              ) : (
                <>
                  {/* Offline Assessment preview */}

                  <CustomTabPanel value={tabValue} index={0}>
                    {noOfSetId && noOfSetId?.length > 0 ? (
                      noOfSetId?.map((item, index) => (
                        <div
                          key={index}
                          className={
                            selectCheckBoxDynamic(index)
                              ? "docs-checkbox-card-selected"
                              : "docs-checkbox-card"
                          }
                        >
                          <FormControlLabel
                            // value="start"
                            value={item?._id}
                            control={
                              <Checkbox
                                icon={<CircleOutlinedIcon />}
                                checkedIcon={
                                  <CheckCircleIcon
                                    sx={{ color: "rgb(211, 13, 13)" }}
                                  />
                                }
                                onChange={(e) => collectSets(e, item)}
                                checked={selectCheckBoxDynamic(index)}
                              />
                            }
                            label={
                              <div className="docs-checkbox-label">
                                <FileIcon /> {item?.setName}
                              </div>
                            }
                            labelPlacement="start"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="no-question-found">
                        <p className="no-question-text">No theory set found</p>
                      </div>
                    )}
                    {setsChecked?.length > 0 && (
                      <FormControl fullWidth sx={{ marginTop: 2 }}>
                        <InputLabel id="language-select-label">
                          Languages
                        </InputLabel>
                        <Select
                          labelId="language-select-label"
                          id="language-select"
                          value={selectedLanguage}
                          label="Languages"
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                          {languages?.length > 0 ? (
                            languages.map((lang, index) => (
                              <MenuItem key={index} value={lang.value || ""}>
                                {lang.label}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disable value={"others" || ""}>
                              No Secondary languages
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    )}
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={1}>
                    {vivaQuestions && vivaQuestions?.length > 0 ? (
                      <>
                        <div
                          className={
                            hasVivaQuestion
                              ? "docs-checkbox-card-selected"
                              : "docs-checkbox-card"
                          }
                        >
                          <FormControlLabel
                            value="start"
                            control={
                              <Checkbox
                                icon={<CircleOutlinedIcon />}
                                checkedIcon={
                                  <CheckCircleIcon
                                    sx={{ color: "rgb(211, 13, 13)" }}
                                  />
                                }
                                onChange={(e) => {
                                  handleFileChange(e, vivaQuestions, "viva");
                                }}
                                checked={hasVivaQuestion ? true : false}
                              />
                            }
                            label={
                              <div className="docs-checkbox-label">
                                <FileIcon /> {"Viva-questions "}
                              </div>
                            }
                            labelPlacement="start"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="no-question-found">
                        <p className="no-question-text">
                          No viva questions found
                        </p>
                      </div>
                    )}
                  </CustomTabPanel>
                  <CustomTabPanel value={tabValue} index={2}>
                    {practicalQuestions && practicalQuestions?.length > 0 ? (
                      <>
                        <div
                          className={
                            hasPracticalQuestion
                              ? "docs-checkbox-card-selected"
                              : "docs-checkbox-card"
                          }
                        >
                          <FormControlLabel
                            value="start"
                            control={
                              <Checkbox
                                icon={<CircleOutlinedIcon />}
                                checkedIcon={
                                  <CheckCircleIcon
                                    sx={{ color: "rgb(211, 13, 13)" }}
                                  />
                                }
                                onChange={(e) => {
                                  handleFileChange(
                                    e,
                                    practicalQuestions,
                                    "practical"
                                  );
                                }}
                                checked={hasPracticalQuestion ? true : false}
                              />
                            }
                            label={
                              <div className="docs-checkbox-label">
                                <FileIcon /> {"Practical-Questions"}
                              </div>
                            }
                            labelPlacement="start"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="no-question-found">
                        <p className="no-question-text">
                          No practical questions found
                        </p>
                      </div>
                    )}
                  </CustomTabPanel>
                </>
              )}
            </Box>
            {batchMode && batchMode === "offline" && (
              <div className="view-docs">
                <button
                  onClick={
                    setsChecked?.length > 0 && tabValue === 0
                      ? downloadTheorySet
                      : hasVivaQuestion && tabValue === 1
                      ? downloadVivaQuestions
                      : practicalQuestions?.length > 0 && tabValue === 2
                      ? downloadPracticalQuestions
                      : null
                  }
                  disabled={
                    setsChecked[tabValue]?.isChecked ||
                    hasVivaQuestion ||
                    hasPracticalQuestion
                      ? false
                      : true
                  }
                  className="outlined-btn"
                >
                  Download
                </button>
                <button
                  onClick={
                    hasVivaQuestion
                      ? handleVivaQuestionPreview
                      : tabValue === 2
                      ? handlePracticalQuestionPreview
                      : handleQuestionPreview
                  }
                  className="light-blue-btn"
                  // disabled={true}
                  disabled={
                    Object.keys(offlineTheoryData)?.length > 0 && tabValue === 0
                      ? false
                      : hasVivaQuestion && tabValue === 1
                      ? false
                      : hasPracticalQuestion && tabValue === 2
                      ? false
                      : true
                  }
                >
                  View Documents
                </button>
              </div>
            )}

            {batchMode && batchMode === "online" && (
              <div style={{ marginTop: "10px" }}>
                <button
                  style={{ width: "100%" }}
                  onClick={
                    hasVivaQuestion
                      ? handleVivaQuestionPreview
                      : tabValue === 2
                      ? handlePracticalQuestionPreview
                      : handleQuestionPreview
                  }
                  className="light-blue-btn"
                  disabled={
                    (noOfSetId?.length > 0 && selectedValue) ||
                    hasVivaQuestion ||
                    hasPracticalQuestion
                      ? false
                      : true
                  }
                >
                  Preview
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {sortedData && sortedData?.length > 0 && (
        <CustomPagination
          count={totalPages}
          page={page}
          limit={limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};
export default Assessment;
const getColumns = (isRolePermission) => {
  let columns = [
    { name: "_id", label: "S.NO" },
    { name: "batchSipId", label: "BATCH SIP ID" },
    { name: "clientName", label: "CLIENT NAME" },
    { name: "jobRole", label: "JOB ROLE" },
    { name: "examCenter", label: "EXAM CENTER" },
    { name: "assessmentDate", label: "ASSESSMENT DATE" },
    { name: "section", label: "SECTION" },
    { name: "batchMode", label: "BATCH MODE" },
    { name: "noOfSet", label: "NO OF SETS" },
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
