import React, { useEffect, useState } from "react";
import "./style.css";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { useDispatch,useSelector } from "react-redux";
import { PropagateLoader, ClipLoader,PulseLoader } from "react-spinners";
import { FormSwitch } from "../../../../components/common/input";
import {
    exportData,
    getSubRole,
    handleTrimPaste,
    userRoleType,
  } from "../../../../utils/projectHelper";
  import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    InputAdornment,
    TextField,
    Tooltip,
    Checkbox,
  } from "@mui/material";
  import {
    SKILL_ASSESSMENT_BATCH_VIEW_CANDIDATE_PAGE,
    SKILL_ASSESSMENT_BATCH_VIEW_ACTION_PAGE,
    SKILL_ASSESSMENT_BATCH_PAGE,
  } from "../../../../config/constants/routePathConstants/superAdmin";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ReactComponent as SearchIcon } from "./../../../../assets/icons/search-icon-grey.svg";
import CustomTable from "../../../../components/common/CustomTable";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../../components/common/PageTitle";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import { allCandidateListApi } from "../../../../api/superAdminApi/skillAssessment";
import { skilAssessmentSelector } from "../../../../redux/slicers/superAdmin/skillAssessment";



const SkillAssessmentAllCandidate = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const { allCandidateList={} } = useSelector(skilAssessmentSelector);
    
    //states
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedData, setSortedData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedRows, setCheckedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [totalPages, setTotalPages] = useState(1);


    //permissions
    const { userInfo = {} } = useSelector(authSelector);
    const { SKILL_ASSESSMENT, SKILL_ASSESSMENT_BATCH } =
    ROLESPERMISSIONS;
    const userRole = userInfo?.userRole;
    const featureName = SKILL_ASSESSMENT;
    const roleType = userRoleType(userRole, featureName);
    const subFeatureName = SKILL_ASSESSMENT_BATCH;
    const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);


    //Methods

    const handleAllCheckedChange = () => {
        const newCheckedRows = allChecked ? [] : sortedData?.map((row) => ({ _id: row._id, checked: true }));
        setAllChecked((prev) => !prev);
        setCheckedRows(newCheckedRows);
      };

      const handleCheckedChange = (row) => {
        setCheckedRows((prev) => {
          const isChecked = prev.some((item) => item._id === row._id); //&& item?.checked
          if (isChecked) {
            return prev.filter((item) => item._id !== row._id);
          } else {
            return [...prev, { ...row }]; //_id: rowId, checked: true
          }
        });
      };

    const handleSearch = (e) => {
        // e.preventDefault();
        // if (searchQuery !== "") setLoading(true);
        // dispatch(
        //   getClientManagementListsApi(
        //     setLoading,
        //     1,
        //     limit,
        //     searchQuery,
        //     setTotalPages,
        //     formValues?.organisationType
        //   )
        // );
        // setPage(1);
    };

    const exportCandidateListData = () => {
      let exportData;
  
      if (allChecked) {
        exportData = sortedData?.map((item) => {
          return {
            batchId: item?.batch_id,
            username: item?.user_name,
            candidateId: item?.candidate_id,
            firstName: item?.firstname,
            emailAddress: item?.email,
            mobileNumber: item?.mobile,
            // schemeName: item?.schemes.length>0?item?.schemes[0]:"NA",
          };
        });
      } else if (checkedRows?.length > 0) {
        exportData = checkedRows.map((item) => {
          return {
            batchId: item?.batch_id,
            username: item?.user_name,
            candidateId: item?.candidate_id,
            firstName: item?.firstname,
            emailAddress: item?.email,
            mobileNumber: item?.mobile,
            // schemeName: item?.schemes.length>0?item?.schemes[0]:"NA",
          };
        });
      } else {
        exportData = sortedData?.map((item) => {
          return {
            batchId: item?.batch_id,
            username: item?.user_name,
            candidateId: item?.candidate_id,
            firstName: item?.firstname,
            emailAddress: item?.email,
            mobileNumber: item?.mobile,
            // schemeName: item?.schemes.length>0?item?.schemes[0]:"NA",
          };
        });
      }
      return exportData;
    };


    const handleExport=(event)=>{

      event.preventDefault();
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData(exportCandidateListData(), getColumns()));
  
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Batch List");
  
      // Convert the workbook to an array buffer
      const buffer = XLSX.write(workbook, { type: "array" });
  
      // Create a blob with the array buffer and trigger a download
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "skillAssessmentAllCandidateList.xlsx");
    }

    const handleStatusChange = (e, nosID) => {
        e.preventDefault();
        const { checked } = e.target;
        const value = checked ? "active" : "inactive";
        // setId(nosID);
        const formData = {
          status: value,
        };
        // dispatch(ChangeAssessmentCreationstatusChangeAPI(setLoading, nosID, formData, getList));
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

    const columns = (isRolePermission) => {
        return [
          {
            name: "checkBox",
            label:
              // isPermission
              isRolePermission?.permissions?.["5"] && (
                <Checkbox
                  checked={allChecked}
                  onChange={handleAllCheckedChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              ),
            sorting: false,
            selector: (row) => {
              const isChecked = checkedRows?.some(
                (item) => item?._id === row._id, // && item?.checked
              );
              return (
                // isPermission
                isRolePermission?.permissions?.["5"] && (
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleCheckedChange(row)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                )
              );
            },
          },
          {
            name: "batchId",
            label: "BATCH ID",
            sorting: false,
            selector: (row) => (
              <Tooltip title={row?.batch_id || 'NA'} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                {row?.batch_id || "-"}
              </div>
            </Tooltip>),
          },
          {
            name: "username",
            label: "UAERNAME",
            sorting: false,
            selector: (row) =>(
              <Tooltip title={ row?.user_name|| 'NA'} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                { row?.user_name || "-"}
              </div>
            </Tooltip>),
          },
          {
            name: "candidateId",
            label: "CANDIDATE ID",
            sorting: false,
            selector: (row) => (
              <Tooltip title={row?.candidate_id  || 'NA'} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                {row?.candidate_id || "-"}
              </div>
            </Tooltip>),
          },
          {
            name: "firstName",
            label: "FIRSTNAME",
            sorting: false,
            selector: (row) =>(
              <Tooltip title={ row?.firstname  || 'NA'} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                { row?.firstname || "-"}
              </div>
            </Tooltip>),
          },
          {
            name: "emailAddress",
            label: "EMAIL ADDRESS",
            sorting: false,
            selector: (row) => (
              <Tooltip title={row?.email || 'NA'} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                {row?.email || "NA"}
              </div>
            </Tooltip>),
          },
          {
            name: "mobileNumber",
            label: "MOBILE NUMBER",
            sorting: false,
            selector: (row) => (
              <Tooltip title={row?.mobile || 'NA'} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                {row?.mobile || 'NA'}
              </div>
            </Tooltip>),
          },
          {
            name: "schemeName",
            label: "SCHEME NAME",
            sorting: false,
            selector: (row) => (
              <Tooltip title={row?.schemes[0]?.name || "NA"} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                {row?.schemes[0]?.name || "NA"}
              </div>
            </Tooltip>),
          },
          // {
          //   name: "status",
          //   label: "STATUS",
          //   sorting: false,
          //   selector: (row) => {
          //     return (
          //       isRolePermission?.permissions?.["6"] && (
          //         <td>
          //           {loading && " " === row._id ? (
          //             <PulseLoader size="10px" color="#0bbbfe" />
          //           ) : (
          //             <FormSwitch
          //               value={row?.status === "active" ? true : false}
          //               onChange={(e) => handleStatusChange(e, row?._id)}
          //             />
          //           )}
          //         </td>
          //       )
          //     );
          //   },
          // },
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
        isPermissions: { 1: isRolePermission?.permissions?.["1"], 5: isRolePermission?.permissions?.["5"] },
        isExport: isRolePermission?.permissions?.["5"],
        exportDataList: exportDataList(),
      };

      const search = {
        searchTitle: "",
        isSearch: true,
        searchQuery: searchQuery,
        setSearchQuery: setSearchQuery,
        endAdornment: true,
        apiHandler: allCandidateListApi,
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
        bodyData: allCandidateList,
        isCheckBox: true,
        selectedCheckBoxs: checkedRows,
        canDeleteAllSelectedBox: false,
      };

      const breadCrumbsData = [
        {
          name: "Skill Assessment",
          isLink: true,
          key: "1",
          path: "",
          onClick: handleBreadCrumbClick,
          isPermissions: {},
          isDisable: false,
        },
        {
          name: "All Candidates",
          isLink: false,
          key: "2",
          path: "",
          onClick: handleBreadCrumbClick,
          isPermissions: {},
          isDisable: false,
        },
      ];


      useEffect(()=>{
        dispatch(allCandidateListApi(setLoading,page,searchQuery,limit,setTotalPages,setSortedData));
      },[page, searchQuery, limit, dispatch])

  return (
    <div className="main-content">
      <div className="title">
        <PageTitle title={<h1 style={{ fontSize: "larger", fontWeight: "bold" }}>All Candidates</h1>} />
            <div className="breadcrumbs">
              <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
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
    </div>
  );
};

export default SkillAssessmentAllCandidate;


//columns for export use
const getColumns = (isRolePermission) => {
  let columns = [
    { name: "batchId", label: "BATCH ID" },
    { name: "username", label: "UAERNAME" },
    { name: "candidateId", label: "CANDIDATE ID" },
    { name: "firstName", label: "FIRSTNAME" },
    { name: "emailAddress", label: "EMAIL ADDRESS" },
    { name: "mobileNumber", label: "MOBILE NUMBER" },
    { name: "schemeName", label: "SCHEME NAME" },
    { name: "status", label: "STATUS" },
  ];
  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns?.filter((column) => column?.name !== "status");
  }
  return columns;
};
