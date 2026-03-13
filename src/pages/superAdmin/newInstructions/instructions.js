import React, { useCallback, useEffect, useState } from "react";
import "../../../pages/superAdmin/jobRole/style.css";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { authSelector } from "../../../redux/slicers/authSlice";
import { ROLESPERMISSIONS } from "../../../config/constants/projectConstant";
import {
  exportData,
  getSubRole,
  userRoleType,
} from "../../../utils/projectHelper";
import PageTitle from "../../../components/common/PageTitle";
import BreadCrumbs from "../../../components/common/Breadcrumbs";
import CustomTable from "../../../components/common/CustomTable";
import { FormSwitch } from "../../../components/common/input";
import { instructionsManagementSelector } from "../../../redux/slicers/superAdmin/instructionsSlice";
import {
  changeSingleInstructionStatusApi,
  deleteSingleInstructionApi,
  getInstructionListApi,
} from "../../../api/superAdminApi/instructions";
import { GENERAL_INSTRUCTIONS } from "../../../config/constants/routePathConstants/superAdmin";
import { ReactComponent as PlusIcon } from "../../../assets/images/pages/clientManagement/plus-icon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/Edit_result.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete_Icon.svg";
import InstructionDialog from "./addNewModel";
import EditInstructionModal from "./editModal";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import moment from "moment";
import DeleteModal from "../../../components/common/Modal/DeleteModal";
import AddLanguageModel from "./addLanguageModel";
import { Tooltip } from "@mui/material";

const Instruction = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instructionsList = {} } = useSelector(instructionsManagementSelector);

  //states
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [id, setId] = useState("");
  const [addModelOpen, setAddModalOpen] = useState(false);
  const [addLangModelOpen, setAddLangModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInstructionId, setSelectedInstructionId] = useState(null);
  const [statusBtnLoading, setStatusBtnLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // permission
  const { userInfo = {} } = useSelector(authSelector);
  const { INSTRUCTIONS_FEATURE, INSTRUCTIONS_LIST_FEATURE } = ROLESPERMISSIONS;
  const userRole = userInfo?.userRole;
  const featureName = INSTRUCTIONS_FEATURE;
  const roleType = userRoleType(userRole, featureName);
  const subFeatureName = INSTRUCTIONS_LIST_FEATURE;
  const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);

  const fetchInstructions = useCallback(() => {
    dispatch(
      getInstructionListApi(
        setLoading,
        page,
        limit,
        setTotalPages,
        searchQuery,
        setSortedData
      )
    );
  }, [dispatch, page, limit, searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      const handler = setTimeout(() => {
        fetchInstructions();
      }, 2000);
      return () => clearTimeout(handler);
    } else {
      fetchInstructions();
    }
  }, [searchQuery, fetchInstructions]);

  const handleAddLang = (id) => {
    setSelectedInstructionId(id);
    setAddLangModalOpen(true);
  };

  const handleEditClick = (instructionId) => {
    setSelectedInstructionId(instructionId);
    setIsEditModalOpen(true);
  };
  const handleEditSuccess = () => {
    fetchInstructions();
    setIsEditModalOpen(false);
    setSelectedInstructionId(null);
  };

  const confirmDelete = () => {
    const len = instructionsList?.length;
    dispatch(
      deleteSingleInstructionApi(
        setLoading,
        id,
        len,
        fetchInstructions,
        handleCloseModal
      )
    );
  };
  const deleteHandler = (id) => {
    setId(id);
    setDeleteModal(true);
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
  };

  // const handleAllCheckedChange = () => {
  //   const newCheckedRows = allChecked
  //     ? []
  //     : sortedData?.map((row) => ({ _id: row._id, checked: true }));
  //   setAllChecked((prev) => !prev);
  //   setCheckedRows(newCheckedRows);
  // };

  // const handleCheckedChange = (row) => {
  //   setCheckedRows((prev) => {
  //     const isChecked = prev.some((item) => item._id === row._id); //&& item?.checked
  //     if (isChecked) {
  //       return prev.filter((item) => item._id !== row._id);
  //     } else {
  //       return [...prev, { ...row }]; //_id: rowId, checked: true
  //     }
  //   });
  // };

  const handleView = (instructionId) => {
    navigate(`${GENERAL_INSTRUCTIONS}/${instructionId}`);
  };

  const exportCandidateListData = () => {
    let exportData;

    if (allChecked) {
      //this case is for checkbox functionality
      exportData = sortedData?.map((item) => {
        return {
          //add your desired data
        };
      });
    } else if (checkedRows?.length > 0) {
      //this case is for checkbox functionality
      exportData = checkedRows.map((item) => {
        return {
          //add your desired data
        };
      });
    } else {
      exportData = [];
      instructionsList?.map((item) => {
        if (item?.instructions?.length > 1) {
          // first row when instructions are more then one
          let firstRow = {
            instructionID: item?.instructionId,
            instructionName: item?.instructionName,
            instruction: item?.instructions[0].instructionDescription?.replace(
              /<[^>]+>/g,
              ""
            ),
            availableLanguage: item?.instructions[0].language
              .replace(/<[^>]+>/g, "")
              .replace(/\s+/g, " ")
              .trim(),
            createdOn:
              moment(item?.createdAt).format("MMMM Do YYYY, h:mm A") || "NA",
            status: item?.status === "active" ? "Active" : "Inactive",
          };
          exportData.push(firstRow);

          // otherRows added which has only language and instructions
          item?.instructions?.slice(1).forEach((element) => {
            const otherRow = {
              instructionID: "",
              instructionName: "",
              instruction: element?.instructionDescription
                .replace(/<[^>]+>/g, "")
                .replace(/\s+/g, " ")
                .trim(),
              availableLanguage: element?.language
                .replace(/<[^>]+>/g, "")
                .replace(/\s+/g, " ")
                .trim(),
              createdOn: "",
              status: "",
            };
            exportData.push(otherRow);
          });
        } else {
          // console.log("inside the else case",exportData);
          let normalRow = {
            instructionID: item?.instructionId,
            instructionName: item?.instructionName,
            instruction:
              item?.instructions?.length > 0
                ? item.instructions
                    .filter((item) => item.language === "English")
                    .map((item) =>
                      item.instructionDescription
                        .replace(/<[^>]+>/g, "")
                        .replace(/\s+/g, " ")
                        .trim()
                    )
                    .join(",")
                : "-",
            availableLanguage:
              item?.instructions?.length > 0 &&
              item?.instructions
                ?.map((item, index) => item?.language)
                ?.join("\n"),
            createdOn:
              moment(item?.createdAt).format("MMMM Do YYYY, h:mm A") || "NA",
            status: item?.status === "active" ? "Active" : "Inactive",
          };
          exportData.push(normalRow);
        }
      });
    }
    return exportData;
  };

  const handleExport = (event) => {
    event.preventDefault();
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      exportData(exportCandidateListData(), getColumns())
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Batch List");

    // Convert the workbook to an array buffer
    const buffer = XLSX.write(workbook, { type: "array" });

    // Create a blob with the array buffer and trigger a download
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "instructionsList.xlsx");
  };

  const handleTooltipData = (s) => {
    return s?.length > 50 ? s.slice(0, 100) + ".." : s;
  };

  const handleStatusChange = (e, nosID) => {
    e.preventDefault();
    const { checked } = e.target;
    setStatusBtnLoading(false);
    const value = checked ? "active" : "inactive";
    setId(nosID);
    dispatch(
      changeSingleInstructionStatusApi(
        setStatusBtnLoading,
        nosID,
        { status: value },
        fetchInstructions
      )
    );
  };

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleBreadCrumbClick = (event, name, path) => {
    event.preventDefault();
    path && navigate(path);
  };

  const handleDescription = (description) => {
    return <div dangerouslySetInnerHTML={{ __html: description }}></div>;
  };

  const columns = (isRolePermission) => {
    return [
      //if checkbox functionality needed this code can be used
      //   {
      //     name: "checkBox",
      //     label:
      //       // isPermission
      //       isRolePermission?.permissions?.["5"] && (
      //         <Checkbox
      //           checked={allChecked}
      //           onChange={handleAllCheckedChange}
      //           inputProps={{ "aria-label": "controlled" }}
      //         />
      //       ),
      //     sorting: false,
      //     selector: (row) => {
      //       const isChecked = checkedRows?.some(
      //         (item) => item?._id === row._id, // && item?.checked
      //       );
      //       return (
      //         // isPermission
      //         isRolePermission?.permissions?.["5"] && (
      //           <Checkbox
      //             checked={isChecked}
      //             onChange={() => handleCheckedChange(row)}
      //             inputProps={{ "aria-label": "controlled" }}
      //           />
      //         )
      //       );
      //     },
      //   },
      {
        name: "instructionID",
        label: "INSTRUCTION ID",
        sorting: false,
        selector: (row) => {
          return (
            <>
              <Tooltip title={row?.instructionId || "NA"} arrow>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                    maxWidth: "100px", // Set a maximum width for the cell
                  }}
                >
                  {row?.instructionId || "-"}
                </div>
              </Tooltip>
            </>
          );
        },
      },
      {
        name: "instructionName",
        label: "INSTRUCTION NAME",
        sorting: false,
        selector: (row) => (
          <Tooltip title={row?.instructionName || "NA"} arrow>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
                maxWidth: "100px", // Set a maximum width for the cell
              }}
            >
              {row?.instructionName || "-"}
            </div>
          </Tooltip>
        ),
      },
      {
        name: "instruction",
        label: "INSTRUCTIONS",
        sorting: false,
        selector: (row) =>
          row?.instructions?.length > 0
            ? row.instructions
                .filter((item) => item.language === "English")
                .map((item) => (
                  <Tooltip
                    key={item._id}
                    title={handleDescription(item.instructionDescription)}
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
                      dangerouslySetInnerHTML={{
                        __html: handleTooltipData(item.instructionDescription),
                      }}
                    />
                  </Tooltip>
                ))
            : "-",
      },
      {
        name: "availableLanguage",
        label: "AVAILABLE LANGUAGE",
        sorting: false,
        selector: (row) => {
          const lang =
            row.instructions?.length > 0 &&
            row?.instructions?.map((item, index) => item?.language)?.join(",");
          return (
            <Tooltip title={lang || "NA"} arrow>
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px",
                  display: "inline-block",
                }}
              >
                {lang}
              </span>
            </Tooltip>
          );
        },
      },
      {
        name: "preview",
        label: "PREVIEW",
        sorting: false,
        selector: (row) => (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              maxWidth: "100px", // Set a maximum width for the cell
            }}
          >
            <button onClick={() => handleView(row?._id)} className="view-btn">
              <span>View</span>
            </button>
          </div>
        ),
      },
      {
        name: "createdOn",
        label: "CREATED ON",
        sorting: false,
        selector: (row) => (
          <Tooltip
            title={
              moment(row?.createdAt).format("MMMM Do YYYY, h:mm A") || "NA"
            }
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
              {moment(row?.createdAt).format("MMMM Do YYYY, h:mm A") || "NA"}
            </div>
          </Tooltip>
        ),
      },
      {
        name: "status",
        label: "STATUS",
        sorting: false,
        selector: (row) => {
          return (
            isRolePermission?.permissions?.["6"] && (
              <td>
                {statusBtnLoading && id === row._id ? (
                  <PulseLoader size="10px" color="#0bbbfe" />
                ) : (
                  <FormSwitch
                    value={row?.status === "active" ? true : false}
                    onChange={(e) => handleStatusChange(e, row?._id)}
                  />
                )}
              </td>
            )
          );
        },
      },
      {
        name: "action",
        label: "ACTIONS",
        sorting: false,
        selector: (row) => (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              maxWidth: "100px", // Set a maximum width for the cell
            }}
          >
            {" "}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  padding: "2px",
                  margin: "2px",
                  gap: "5px",
                }}
              >
                <ControlPointIcon
                  onClick={() => handleAddLang(row._id)}
                  sx={{ fontSize: "16px" }}
                />

                {row?._id === selectedInstructionId && (
                  <AddLanguageModel
                    open={addLangModelOpen}
                    onClose={() => setAddLangModalOpen(false)}
                    instructionId={selectedInstructionId}
                    navigate={navigate}
                  />
                )}
                <EditIcon
                  onClick={() => handleEditClick(row._id)}
                  style={{ width: "16px", height: "16px" }}
                />
                <DeleteIcon
                  onClick={() => {
                    deleteHandler(row?._id);
                  }}
                  style={{ width: "16px", height: "16px" }}
                />
              </div>
            </div>
          </div>
        ),
      },
    ];
  };

  const exportDataList = () => {
    return [
      {
        name: "export",
        isPermission: true,
        label: "Export",
        isDisable: false,
        handleExport: (e) => handleExport(e),
      },
    ];
  };

  const exportDataOptions = {
    loading: loading,
    setLoading: setLoading,
    isPermissions: {
      1: isRolePermission?.permissions?.["1"],
      5: isRolePermission?.permissions?.["5"],
    },
    isExport: isRolePermission?.permissions?.["5"],
    exportDataList: exportDataList(),
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

  const table = {
    isPermission: true,
    headerColumn: columns(isRolePermission),
    bodyData: instructionsList,
    isCheckBox: true,
    selectedCheckBoxs: checkedRows,
    canDeleteAllSelectedBox: false,
  };

  const breadCrumbsData = [
    {
      name: "Content Management",
      isLink: true,
      key: "1",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "Instructions",
      isLink: false,
      key: "2",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
  ];

  return (
    <div className="main-content">
      <div className="title">
        <div className="breadcrumbs">
          <PageTitle
            title={
              <h1 style={{ fontSize: "20", fontWeight: "bold" }}>
                Instructions List
              </h1>
            }
          />
          <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
        </div>
        <div className="title-btn">
          {isRolePermission?.permissions?.["2"] && (
            <button onClick={() => setAddModalOpen(true)}>
              <PlusIcon />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>
      <div className="subadmin-table">
        <div className="table-wrapper">
          <CustomTable
            table={table}
            loading={loading}
            setLoading={setLoading}
            pagination={pagination}
            search={search}
            // multiSelect={mulitSelect}
            exportOptions={exportDataOptions}
          />
        </div>
      </div>

      <InstructionDialog
        open={addModelOpen}
        onClose={() => setAddModalOpen(false)}
        navigate={navigate}
      />

      <EditInstructionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        instructionId={selectedInstructionId}
        onSuccess={handleEditSuccess}
      />

      <DeleteModal
        title="Delete Instruction"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default Instruction;

//columns for export use
const getColumns = (isRolePermission) => {
  let columns = [
    { name: "instructionID", label: "INSTRUCTION ID" },
    { name: "instructionName", label: "INSTRUCTION NAME" },
    { name: "instruction", label: "INSTRUCTIONS" },
    { name: "availableLanguage", label: "AVAILABLE LANGUAGE" },
    { name: "createdOn", label: "CREATED ON" },
    { name: "status", label: "STATUS" },
  ];
  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns?.filter((column) => column?.name !== "status");
  }
  return columns;
};
