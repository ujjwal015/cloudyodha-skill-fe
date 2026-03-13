import React, { useEffect, useState } from "react";
import "./style.css";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { PulseLoader } from "react-spinners";
import { FormSwitch } from "../../../../components/common/input";
import {
    exportData,
    getSubRole,
    userRoleType,
    convertDateFormat,
    convertDateToDDYYMM,
  } from "../../../../utils/projectHelper";
  import {
    Button,
    Checkbox,
    Tooltip,
  } from "@mui/material";
  import {
    SKILL_ASSESSMENT_BATCH_VIEW_CANDIDATE_PAGE,
    SKILL_ASSESSMENT_BATCH_VIEW_ACTION_PAGE,
  } from "../../../../config/constants/routePathConstants/superAdmin";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CustomTable from "../../../../components/common/CustomTable";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../components/common/PageTitle";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import { batchListApi ,partnerListApi} from "../../../../api/superAdminApi/skillAssessment";
import { skilAssessmentSelector } from "../../../../redux/slicers/superAdmin/skillAssessment";
import { useDispatch, useSelector } from "react-redux";




const SkillAssessmentBatch = () => {
    //states
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedData, setSortedData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedRows, setCheckedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedType, setSelectedType] = useState([]);
    const [fetchedPartner, setFetchedPartner] = useState([]);
    const [filterSelectedId,setFilterSelectedId]=useState();
    
    const { userInfo = {} } = useSelector(authSelector);
    const { batchList = {}} = useSelector(skilAssessmentSelector);
    const navigate=useNavigate();
    const dispatch=useDispatch();

    //permissions
    const { SKILL_ASSESSMENT, SKILL_ASSESSMENT_BATCH } =
    ROLESPERMISSIONS;
    const userRole = userInfo?.userRole;
    const featureName = SKILL_ASSESSMENT;
    const roleType = userRoleType(userRole, featureName);
    const subFeatureName = SKILL_ASSESSMENT_BATCH;
    const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  
    //Methods
    const handlePartnerList=()=>{
      dispatch(partnerListApi(setLoading,page,searchQuery,limit,setTotalPages,setFetchedPartner));
    }
    const getBatchList=async(filterSelectedId)=>{
      setLoading(true);
      dispatch(batchListApi(setLoading,page,searchQuery,limit,setTotalPages,setSortedData,filterSelectedId));
    }

    useEffect(()=>{
      getBatchList();
      handlePartnerList();
    },[page,limit,searchQuery]);

    useEffect(()=>{
      getBatchList(filterSelectedId);
    },[filterSelectedId]);


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

      const handleView = (id) => {
        navigate(`${SKILL_ASSESSMENT_BATCH_VIEW_CANDIDATE_PAGE}/${id}`);
      };
      
      const handleActionView=(id)=>{
        navigate(`${SKILL_ASSESSMENT_BATCH_VIEW_ACTION_PAGE}/${id}`);
      }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery !== "") setLoading(true);
        dispatch(
          batchListApi(
            setLoading,
            page,
            limit,
            searchQuery,
            setTotalPages,
          )
        );
    };

    const exportBatchListData = () => {
      let exportData;
  
      if (allChecked) {
        exportData = sortedData&&sortedData?.map((item) => {
          return {
            batchId: item?.batchid,
            name: item?.name,
            jobRole: item?.jobRoleName,
            assessment: item?.assesmentsName,
            language: item?.language_code1,
            examCenter: item?.examcenter_id,
            examStart: item?.start_batch_time,
            examEnd: item?.end_batch_time,
            examDuration: item?.exam_time,
            assignedAssessor: item?.assessor,
            allCandidate: item?.studentCount,
            status: item?.status,
          };
        });
      } else if (checkedRows?.length > 0) {
        exportData = checkedRows.map((item) => {
          return {
            batchId: item?.batchid,
            name: item?.name,
            jobRole: item?.jobRoleName,
            assessment: item?.assesmentsName,
            language: item?.language_code1,
            examCenter: item?.examcenter_id,
            examStart: item?.start_batch_time,
            examEnd: item?.end_batch_time,
            examDuration: item?.exam_time,
            assignedAssessor: item?.assessor,
            allCandidate: item?.studentCount,
            status: item?.status,
          };
        });
      } else {
        exportData = sortedData&&sortedData?.map((item) => {
          return {
            batchId: item?.batchid,
            name: item?.name,
            jobRole: item?.jobRoleName,
            assessment: item?.assesmentsName,
            language: item?.language_code1,
            examCenter: item?.examcenter_id,
            examStart: item?.start_batch_time,
            examEnd: item?.end_batch_time,
            examDuration: item?.exam_time,
            assignedAssessor: item?.assessor,
            allCandidate: item?.studentCount,
            status: item?.status,
          };
        });
      }
      return exportData;
    };

    const handleExport=(event)=>{
      event.preventDefault();
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData(exportBatchListData(), getColumns()));
  
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Batch List");
  
      // Convert the workbook to an array buffer
      const buffer = XLSX.write(workbook, { type: "array" });
  
      // Create a blob with the array buffer and trigger a download
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "skillAssessmentBatchList.xlsx");
    }

    const handleStatusChange = (e, nosID) => {
        e.preventDefault();
        const { checked } = e.target;
        const value = checked ? "active" : "inactive";
        // setId(nosID);
        const formData = {
          status: value,
        };
        // dispatch(api_to_be_written(setLoading, nosID, formData, getList));
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
                (item) => item?._id === row?._id, // && item?.checked
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
            selector: (row) =>(
              <Tooltip title={row?.batchid || "-"} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                {row?.batchid || "-"}
              </div>
            </Tooltip>) ,
          },
          {
            name: "name",
            label: "NAME",
            sorting: false,
            selector: (row) =>(
              <Tooltip title={ row?.name || "-"} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                { row?.name || "-"}
              </div>
            </Tooltip>),
          },
    
          {
            name: "jobRole",
            label: "JOB ROLE NAME",
            sorting: false,
            selector: (row) =>(
            <Tooltip title={row?.jobRoleName || "-"} arrow>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
                maxWidth: "100px", // Set a maximum width for the cell
              }}
            >
              {row?.jobRoleName || "-"}
            </div>
          </Tooltip>),
          },
          {
            name: "assessment",
            label: "ASSESSMENT",
            sorting: false,
            selector: (row) =>(
              <Tooltip title={ row?.assesmentsName || "-"} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                { row?.assesmentsName || "-"}
              </div>
            </Tooltip>),
          },
          {
            name: "language",
            label: "LANGUAGE",
            sorting: false,
            selector: (row) => row?.language_code1==='en'?'English':0,
          },
          {
            name: "examCenter",
            label: "EXAM CENTER",
            sorting: false,
            selector: (row) =>(
              <Tooltip title={row?.examCenters[0]?.name || 'NA'} arrow>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  maxWidth: "100px", // Set a maximum width for the cell
                }}
              >
                {row?.examCenters[0]?.name || 'NA'}
              </div>
            </Tooltip>) ,
          },
    
          {
            name: "examStart",
            label: "EXAM START DATE",
            sorting: false,
            selector: (row) => {
              return convertDateToDDYYMM(row?.start_batch_time) || "NA"
            },
          },
          {
            name: "examEnd",
            label: "EXAM END DATE",
            sorting: false,
            selector: (row) => {
              return convertDateToDDYYMM(row?.end_batch_time) || 'NA'
            },
          },
          {
            name: "examDuration",
            label: "EXAM DURATION",
            sorting: false,
            selector: (row) => {
              return row?.exam_time || 'NA'
            },
          },
          {
            name: "assignedAssessor",
            label: "ASSIGNED ASSESSOR",
            sorting: false,
            selector: (row) => {
             return row?.assessor || "NA"
            },
          },
          {
            name: "allCandidate",
            label: "ALL CANDIDATE",
            sorting: false,
            selector: (row) => {
              return row?.studentCount&&(
                <h5 onClick={(e)=>handleView(row?.id)}>
                    <strong>{row?.studentCount || 'NA'}</strong>
                </h5>
              ) 
            },
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
          // {
          //   name: "action",
          //   label: "Action",
          //   sorting: false,
          //   selector: (row) => {
          //       return (
          //       <Button onClick={()=>{handleActionView(row?._id)}}>
          //           click
          //       </Button>
          //     )
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

    const handleChange = (event, setter) => {
      const {
        target: {value,valueName},
      } = event;
      setFilterSelectedId(value);
      setter(typeof valueName === "string" ? valueName.split(",") : valueName);
    };

    

    const exportDataOptions = {
      loading: loading,
      setLoading: setLoading,
      isPermissions: { 1: isRolePermission?.permissions?.["1"], 5: isRolePermission?.permissions?.["5"] },
      isExport: isRolePermission?.permissions?.["5"],
      exportDataList: exportDataList(),
    };

    const   multiSelectDataList = [ 
      {
        name: "filterbyTp",
        filterType:true,
        value: selectedType,
        setter: setSelectedType,
        label: "Filter By TP",
        onChange: handleChange,
        options: fetchedPartner,
        selected: selectedType,
        isPermission: true,
      },
    ];
    const multiSelect = {
      isPermission: true, //{}
      isUpdatedMultiselectReq: true,
      isMultiSelect:true,
      // filterType:true,
      multiSelectCategoryList: multiSelectDataList,
    };

    const search = {
      searchTitle: "",
      isSearch: true,
      searchQuery: searchQuery,
      setSearchQuery: setSearchQuery,
      endAdornment: true,
      apiHandler: batchListApi,
      isPermission: true, 
      isDisable: false,
    };

    const pagination = {
        isPagination: true,
        totalPages: totalPages,
        count: totalPages,
        page: page,
        limit:limit,
        setTotalPages: setTotalPages,
        onPageChange: handleChangePage,
        onRowsPerPageChange: handleChangeRowsPerPage,
      };

    const table = {
        isPermission: true,
        headerColumn: columns(isRolePermission),
        bodyData: batchList,
        isCheckBox: true,
        selectedCheckBoxs: checkedRows,
        canDeleteAllSelectedBox: false,
      };

      const breadCrumbsData = [
        {
          name: "Skill Assessment",
          isLink: true,
          key: "1",
          path:"",
          onClick: handleBreadCrumbClick,
          isPermissions: {},
          isDisable: false,
        },
        {
          name: "Batch list",
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
      <PageTitle title={<h1 style={{ fontSize: "larger", fontWeight: "bold" }}>Batch List</h1>} />
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
            multiSelect={multiSelect}
            exportOptions={exportDataOptions}
            />
          </div>
      </div>
    </div>
  );
};

export default SkillAssessmentBatch;


//columns for export use
const getColumns = (isRolePermission) => {
  let columns = [
    { name: "batchId", label: "BATCH ID" },
    { name: "name", label: "NAME" },
    { name: "jobRole", label: "JOB ROLE NAME" },
    { name: "assessment", label: "ASSESSMENT" },
    { name: "language", label: "LANGUAGE" },
    { name: "examCenter", label: "EXAM CENTER" },
    { name: "examStart", label: "EXAM START" },
    { name: "examEnd", label: "EXAM END" },
    { name: "examDuration", label: "EXAM DURATION" },
    { name: "assignedAssessor", label: "ASSIGNED ASSESSOR" },
    { name: "allCandidate", label: "ALL CANDIDATE" },
    { name: "status", label: "STATUS" },
    { name: "action", label: "Action" },
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
