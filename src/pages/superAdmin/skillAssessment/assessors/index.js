import React, { useEffect, useRef, useState } from "react";
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
    SKILL_ASSESSMENT_ASSESSORS_USERNAME_PAGE,
  } from "../../../../config/constants/routePathConstants/superAdmin";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ReactComponent as SearchIcon } from "./../../../../assets/icons/search-icon-grey.svg";
import CustomTable from "../../../../components/common/CustomTable";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../../components/common/PageTitle";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import { assessorsListApi } from "../../../../api/superAdminApi/skillAssessment";
import { skilAssessmentSelector } from "../../../../redux/slicers/superAdmin/skillAssessment";



const SkillAssessmentAssessors = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const { accessorList={}} = useSelector(skilAssessmentSelector);
    
    //states
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedData, setSortedData] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedRows, setCheckedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [totalPages, setTotalPages] = useState(1);
    const isInitialRender=useRef(true);

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

    const handleUsername=(id)=>{
      navigate(`${SKILL_ASSESSMENT_ASSESSORS_USERNAME_PAGE}/${id}`);
    }

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
        exportData = sortedData&&sortedData?.map((item) => {
          return {
            assessorID: item?.batch_id||"-",
            accessorName: item?.firstname||"-",
            mobileNumber: item?.mobile||"-",
            dob: item?.dob||"-",
            gender: item?.gender||"-",
            adhaar: item?.aadhar||"-",
            pancard:item?.pan||"-",
            numberOfBatch: item?.batchCount||"-",
            mou: item?.mou_signed||"-",
            toa: item?.toa_certified||"-",
            toaSigned: item?.toaSigned||"-",
          };
        });
      } else if (checkedRows?.length > 0) {
        exportData = checkedRows.map((item) => {
          return {
            assessorID: item?.batch_id||"-",
            accessorName: item?.firstname||"-",
            mobileNumber: item?.mobile||"-",
            dob: item?.dob||"-",
            gender: item?.gender||"-",
            adhaar: item?.aadhar||"-",
            pancard:item?.pan||"-",
            numberOfBatch: item?.batchCount||"-",
            mou: item?.mou_signed||"-",
            toa: item?.toa_certified||"-",
            toaSigned: item?.toaSigned||"-",
          };
        });
      } else {
        exportData = sortedData?.map((item) => {
          return {
            assessorID: item?.batch_id||"-",
            accessorName: item?.firstname||"-",
            mobileNumber: item?.mobile||"-",
            dob: item?.dob||"-",
            gender: item?.gender||"-",
            adhaar: item?.aadhar||"-",
            pancard:item?.pan||"-",
            numberOfBatch: item?.batchCount||"-",
            mou: item?.mou_signed||"-",
            toa: item?.toa_certified||"-",
            toaSigned: item?.toaSigned||"-",
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
      saveAs(blob, "skillAssessment Assessor list.xlsx");
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
            name: "assessorID",
            label: "ASSESSOR ID",
            sorting: false,
            selector: (row) => row?.batch_id || "NA",
          },
          {
            name: "accessorName",
            label: "ASSESSOR NAME",
            sorting: false,
            selector: (row) => {
              return row?.user_name&&(
              <h5 onClick={()=>handleUsername(row?.id)}>
                    {row?.firstname}
                    <br></br>
                    <strong>{row?.user_name || 'NA'}</strong>
             </h5>
            )
          }
         },
          {
            name: "mobileNumber",
            label: "MOBILE NUMBER",
            sorting: false,
            selector: (row) => row?.mobile || "NA",
          },
          {
            name: "dob",
            label: "DATE OF BIRTH",
            sorting: false,
            selector: (row) => row?.dob || "NA",
          },
          {
            name: "gender",
            label: "GENDER",
            sorting: false,
            selector: (row) =>  row?.gender ||"NA",
          },
          {
            name: "adhaar",
            label: "ADHAAR CARD",
            sorting: false,
            selector: (row) =>  row?.aadhar || "NA",
          },
          {
            name: "pancard",
            label: "PAN CARD",
            sorting: false,
            selector: (row) =>  row?.pan || "NA"
          },
          {
            name: "numberOfBatch",
            label: "NUMBER OF BATCH",
            sorting: false,
            selector: (row) => row?.batchCount || "NA"
          },
          {
            name: "mou",
            label: "MOU SIGNED",
            sorting: false,
            selector: (row) => row?.mou_signed || "NA",
          },
          {
            name: "toa",
            label: "TOA CERTIFIED",
            sorting: false,
            selector: (row) => row?.toa_certified || "NA",
          },
          {
            name: "toaSigned",
            label: "TOA SIGNED",
            sorting: false,
            selector: (row) => {
              return "NA" 
            },
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
        apiHandler: assessorsListApi,
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
        bodyData: accessorList,
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
          name: "Assessors List",
          isLink: false,
          key: "2",
          path: "",
          onClick: handleBreadCrumbClick,
          isPermissions: {},
          isDisable: false,
        },
      ];

      useEffect(()=>{
        setLoading(true);
        dispatch(assessorsListApi(setLoading,page,searchQuery,limit,setTotalPages,setSortedData));
      },[page, limit, dispatch, searchQuery]);

      // useEffect(() => {
      //   if (isInitialRender.current) {
      //     isInitialRender.current = false;
      //     return;
      //   }
      //   setLoading(true);
      //   dispatch(assessorsListApi(setLoading,page,searchQuery,limit,setTotalPages,setSortedData));
      // }, [page, limit, dispatch, searchQuery]);
  return (
    <div className="main-content">
      <div className="title">
        <PageTitle title={<h1 style={{ fontSize: "larger", fontWeight: "bold" }}>Assessor List</h1>}/>
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

export default SkillAssessmentAssessors;


//columns for export use
const getColumns = (isRolePermission) => {
  let columns = [
    { name: "assessorID", label: "ASSESSOR NAME" },
    { name: "accessorName", label: "ASSESSOR NAME" },
    { name: "mobileNumber", label: "MOBILE NUMBER" },
    { name: "dob", label: "DATE OF BIRTH" },
    { name: "gender", label: "GENDER" },
    { name: "adhaar", label: "ADHAAR CARD" },
    { name: "pancard", label: "PAN CARD" },
    { name: "numberOfBatch", label: "numberOfBatch" },
    { name: "mou", label: "MOU SIGNED"},
    { name: "toa", label: "TOA CERTIFIED"},
    { name: "toaSigned", label: "TOA SIGNED" },
  ];
  if (!isRolePermission?.permissions?.["6"]) {
    columns = columns?.filter((column) => column?.name !== "status");
  }
  return columns;
};
