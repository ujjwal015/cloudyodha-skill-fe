import React, { useEffect, useState } from "react";
import { ROLESPERMISSIONS } from "../../../../../config/constants/projectConstant";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { PulseLoader } from "react-spinners";
import { FormSwitch } from "../../../../../components/common/input";
import {
    exportData,
    getSubRole,
    userRoleType,
  } from "../../../../../utils/projectHelper";
  import {
    Button,
    Checkbox,
  } from "@mui/material";
  import {
    SKILL_ASSESSMENT_BATCH_VIEW_ACTION_PAGE,
    SKILL_ASSESSMENT_RESULT_VIEW_CANDIDATE_PAGE,
  } from "../../../../../config/constants/routePathConstants/superAdmin";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CustomTable from "../../../../../components/common/CustomTable";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../../../components/common/PageTitle";
import BreadCrumbs from "../../../../../components/common/Breadcrumbs";
import { resultMarksViewtApi } from "../../../../../api/superAdminApi/skillAssessment";
import { skilAssessmentSelector } from "../../../../../redux/slicers/superAdmin/skillAssessment";
import { useDispatch, useSelector } from "react-redux";


const SkillAssessmentResultViewNosMarks = () => {
    //states
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedData, setSortedData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedRows, setCheckedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [totalPages, setTotalPages] = useState(1);
    
    
    const { userInfo = {} } = useSelector(authSelector);
    const { resultMarksViewList = {} } = useSelector(skilAssessmentSelector);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {id} = useParams(); 

    //permissions
    const { SKILL_ASSESSMENT, SKILL_ASSESSMENT_BATCH } =
    ROLESPERMISSIONS;
    const userRole = userInfo?.userRole;
    const featureName = SKILL_ASSESSMENT;
    const roleType = userRoleType(userRole, featureName);
    const subFeatureName = SKILL_ASSESSMENT_BATCH;
    const isRolePermission = getSubRole(roleType?.subFeatures, subFeatureName);
  
    //Methods
    const getResultList=async()=>{
      setLoading(true);
      dispatch(resultMarksViewtApi(setLoading,page,searchQuery,limit,setTotalPages,setSortedData,id));
    }

    useEffect(()=>{
      getResultList();
    },[page,limit]);



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
        e.preventDefault();
        if (searchQuery !== "") setLoading(true);
        dispatch(
            resultMarksViewtApi(
            setLoading,
            page,
            limit,
            searchQuery,
            setTotalPages,
          )
        );
    };

    const exportresultListData = () => {
      let exportData;
  
      if (allChecked) {
        console.log("inside all checked");
        exportData = sortedData&&sortedData?.map((item) => {
          return {
            jobRole: item?.batchid||"NA",
            thoeyMarks: item?.name||"NA",
            practicalMarks: item?.jobRoleName||"NA",
            vivaMarks: item?.assesmentsName||"NA",
            totalMarks: item?.language_code1||"NA",
          };
        });
      } else if (checkedRows?.length > 0) {
        console.log("inside all few checked")
        exportData = checkedRows.map((item) => {
          return {
            jobRole: item?.batchid||"NA",
            thoeyMarks: item?.name||"NA",
            practicalMarks: item?.jobRoleName||"NA",
            vivaMarks: item?.assesmentsName||"NA",
            totalMarks: item?.language_code1||"NA",
          };
        });
      } else {
        exportData = sortedData&&sortedData?.map((item) => {
        console.log("inside no checked")
          return {
            jobRole: item?.batchid||"NA",
            thoeyMarks: item?.name||"NA",
            practicalMarks: item?.jobRoleName||"NA",
            vivaMarks: item?.assesmentsName||"NA",
            totalMarks: item?.language_code1||"NA",
          };
        });
      }
      return exportData;
    };

    const handleExport=(event)=>{
      event.preventDefault();
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData(exportresultListData(), getColumns()));
  
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Batch List");
  
      // Convert the workbook to an array buffer
      const buffer = XLSX.write(workbook, { type: "array" });
  
      // Create a blob with the array buffer and trigger a download
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "skillAssessmentresultList.xlsx");
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
          name: "jobRole",
          label: "JOB ROLE NAME",
          sorting: false,
          selector: (row) => row?.name || "NA",
          },
          {
            name: "thoeyMarks",
            label: "THOERY MARKS",
            sorting: false,
            selector: (row) => row?.nos_theory_marks || "NA",
          },

          {
            name: "practicalMarks",
            label: "PRACTICAL MARKS",
            sorting: false,
            selector: (row) => row?.nos_practical_marks || "NA",
          },
    
          {
            name: "vivaMarks",
            label: "VIVA MARKS",
            sorting: false,
            selector: (row) => row?.assesmentsName || "NA",
          },
          {
            name: "totalMarks",
            label: "TOTAL MARKS",
            sorting: false,
            selector: (row) => row?.schemes?.length>0
            ? row?.schemes.map(scheme=>scheme.name).join(", ") : "NA",
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
      apiHandler: resultMarksViewtApi,
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
        bodyData: resultMarksViewList,
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
          name: "Results",
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
      <PageTitle title={<h1 style={{ fontSize: "larger", fontWeight: "bold" }}>NOS MARKS</h1>} />
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

export default SkillAssessmentResultViewNosMarks;


//columns for export use
const getColumns = (isRolePermission) => {
  let columns = [
    { name: "jobRole", label: "JOB ROLE NAME" },
    { name: "thoeyMarks", label: "THOERY MARKS" },
    { name: "practicalMarks", label: "PRACTICAL MARKS" },
    { name: "vivaMarks", label: "VIVA MARKS" },
    { name: "totalMarks", label: "TOTAL MARKS" },
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
