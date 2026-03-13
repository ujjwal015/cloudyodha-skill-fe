import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";
import { ReactComponent as ActiveBatchIcon } from "../../../../assets/icons/admin/active-batch-icon.svg";
import { ReactComponent as TotalBatchIcon } from "../../../../assets/icons/admin/total-batch-icon.svg";
import { ReactComponent as TotalCandidateIcon } from "../../../../assets/icons/admin/total-candidate-icon.svg";
import { ReactComponent as ExamCenterIcon } from "../../../../assets/icons/admin/exam-center-icon.svg";
import CardInfoNew from "../../../../components/common/CardInfo_New";


import { ReactComponent as SuitcaseIcon } from "../../../../assets/icons/suitcase-svg.svg";
import { ReactComponent as ToDoIcon } from "../../../../assets/icons/todotaskIcon.svg";

import { ReactComponent as CheckMarkIcon } from "../../../../assets/icons/checkmarkIcon.svg";
import { ReactComponent as CalenderIcon } from "../../../../assets/icons/calenderIconNew.svg";
import { getWidgetStatsData_CD } from "../../../../api/adminApi/dashboard";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { ROLESPERMISSIONS } from "../../../../config/constants/projectConstant";
import { getSubRole, userRoleType } from "../../../../utils/projectHelper";
import { BDA_JOB_ROLE_PAGE, QUESTION_BANK_NOS, SUPER_ADMIN_ASSESSMENT_LIST_PAGE } from "../../../../config/constants/routePathConstants/superAdmin";
import { useNavigate } from "react-router-dom";


const DashboardInfoCards = ({clientId=[]}) => {
  const {contentDashboardWidgetsData={} } = useSelector(dashboardSelector);
  console.log("contentDashboardWidgetsData",contentDashboardWidgetsData)
  const [loading,setLoading]=useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();
 
  const getWidgetStatsData=()=>{
    dispatch(getWidgetStatsData_CD(setLoading,clientId.join(",")))
  }

  useEffect (()=>{
    getWidgetStatsData()
  },[clientId])

  const { userInfo = {} } = useSelector(authSelector);

const { QUESTION_BANK_FEATURE, QUESTION_BANK_SUB_FEATURE_2,JOB_ROLE_MANAGEMENT_FEATURE, JOB_ROLE_MANAGEMENT_LIST_FEATURE} =
ROLESPERMISSIONS;
const userRole = userInfo?.userRole;
const featureName = QUESTION_BANK_FEATURE;
const roleType = userRoleType(userRole, featureName);
const subFeatureName = QUESTION_BANK_SUB_FEATURE_2;
const isRolePermissionAssessment_creation= getSubRole(roleType?.subFeatures, subFeatureName);


const userRoleforjobRole = userInfo?.userRole;
const featureName_jobRole = JOB_ROLE_MANAGEMENT_FEATURE;
const roleType_jobRole = userRoleType(userRoleforjobRole, featureName_jobRole);
const subFeatureName_jobrole = JOB_ROLE_MANAGEMENT_LIST_FEATURE;
const isRolePermission_jobrole = getSubRole(roleType_jobRole?.subFeatures, subFeatureName_jobrole);
  

  const handleTotalJobroleroute=()=>{
    isRolePermission_jobrole?.permissions?.["1"] && navigate(BDA_JOB_ROLE_PAGE);
  }

  const handleTotalBlueprintRoute=()=>{
    isRolePermissionAssessment_creation?.permissions?.["1"] && navigate(QUESTION_BANK_NOS,{state:{fromBlueprint:true}});
  }

  
  const handleTotalQuestionRoute=()=>{
    isRolePermissionAssessment_creation?.permissions?.["1"] &&  navigate(QUESTION_BANK_NOS,{state:{fromQuestionbank:true}});

  }
  
  const handlePrimaryQuestionRoute=()=>{
    isRolePermissionAssessment_creation?.permissions?.["1"] && navigate(QUESTION_BANK_NOS);

  }

  const ListItems = [
    {
      name: "Total Jobrole",
      Icon: ActiveBatchIcon,
      totalCount:contentDashboardWidgetsData.jobRoleCount || 0,
      growthStatus:true,
      ReactComponent:SuitcaseIcon,
      linkText:"View Jobrole",
      handleRoute:handleTotalJobroleroute,
      isPermission: isRolePermission_jobrole?.permissions?.["1"],
      isLinkActive:true,
      isTodoListReq:false
    },
    {
      name: "Total Blueprint",
      Icon: TotalBatchIcon,
      totalCount:contentDashboardWidgetsData.totalBluePrintCount || 0,
      growthStatus:false,
      ReactComponent:CalenderIcon,
      linkText:`${contentDashboardWidgetsData.toDoBluePrint} Blueprint`,
      handleRoute:handleTotalBlueprintRoute,
      isPermission: isRolePermissionAssessment_creation?.permissions?.["1"],
      isLinkActive:Boolean(contentDashboardWidgetsData.toDoBluePrint),
      isTodoListReq:true
    },
    {
      name: "Total Question Bank",
      Icon: TotalCandidateIcon,
      totalCount:contentDashboardWidgetsData.totalQuestionBankCount || 0,
      growthStatus:false,
      ReactComponent:ToDoIcon,
      linkText:`${contentDashboardWidgetsData.toDoQuestionBank} Question Banks`,
      handleRoute:handleTotalQuestionRoute,
      isPermission: isRolePermissionAssessment_creation?.permissions?.["1"],
      isLinkActive:Boolean(contentDashboardWidgetsData.toDoQuestionBank),
      isTodoListReq:true
    },
    {
      name: "Primary Language Question",
      Icon: ExamCenterIcon,
      totalCount:contentDashboardWidgetsData.primaryQuestionCount || 0,
      growthStatus:true,
      ReactComponent:CheckMarkIcon,
      linkText:"View Primary Questions",
      handleRoute:handlePrimaryQuestionRoute,
      isPermission:isRolePermissionAssessment_creation?.permissions?.["1"],
      isLinkActive:true,
      isTodoListReq:false
    },
  ];

  return (
    <div className="dashboard-totalview">
      <CardInfoNew cardLists={ListItems} />
    </div>
  );
};

export default DashboardInfoCards;
