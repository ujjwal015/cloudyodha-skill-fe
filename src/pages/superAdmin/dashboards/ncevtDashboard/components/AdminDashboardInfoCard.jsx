import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dashboardSelector } from "../../../../../redux/slicers/admin/dashboardSlice";
import { ReactComponent as ActiveBatchIcon } from "../../../../../assets/icons/admin/active-batch-icon.svg";
import { ReactComponent as TotalBatchIcon } from "../../../../../assets/icons/admin/total-batch-icon.svg";
import { ReactComponent as TotalCandidateIcon } from "../../../../../assets/icons/admin/total-candidate-icon.svg";
import { ReactComponent as ExamCenterIcon } from "../../../../../assets/icons/admin/exam-center-icon.svg";
import {
  getAssessorOnboardData,
  getJobRoleData,
  getLiveBatch,
  getassessedBatch,
} from "../../../../../api/adminApi/dashboard";
import CardInfo from "../../../../../components/common/CardInfo";

const AdminDashboardInfoCard = ({ clientId = "" }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {
    assessedBatch = {},
    liveBatch = {},
    jobRole = {},
    assessorOnboard = {},
  } = useSelector(dashboardSelector);
  const [assessedBatchArrayMonthBasis, setAssessedBatchArrayMonthBasis] =
    useState([]);
  const [liveBatchListMonthBasis, setLiveBatchListMonthBasis] = useState([]);
  const [assessorOnboardListMonthBasis, setAssessorOnBoardMonthBasis] =
    useState([]);
  const [jobRoleListMonthBasis, setJobRoleListMonthBasis] = useState([]);

  const getassessedBatchData = useCallback(() => {
    dispatch(getassessedBatch(setLoading, clientId));
  },[clientId, dispatch]);

  const getLiveBatchData = useCallback(() => {
    dispatch(getLiveBatch(setLoading, clientId));
  },[clientId, dispatch]);

  const getCompleteJobRoleData = useCallback(() => {
    dispatch(getJobRoleData(setLoading, clientId));
  },[clientId, dispatch]);

  const getAssessorOnboardedData = useCallback(() => {
    dispatch(getAssessorOnboardData(setLoading, clientId));
  },[clientId, dispatch]);

  useEffect(() => {
    getassessedBatchData();
    getLiveBatchData();
    getCompleteJobRoleData();
    getAssessorOnboardedData();
  }, [clientId]);


  useEffect(() => {
    const arrayFromData = Object.keys(assessedBatch).length > 0 ? assessedBatch.monthResponse :[];
    let sortedArray = [];
    for (let x of arrayFromData) {
      sortedArray.push(x.value);
    }
    setAssessedBatchArrayMonthBasis(sortedArray);
  }, [assessedBatch]);



  useEffect(() => {
    const arrayFromData = Object.keys(liveBatch).length > 0 ? liveBatch.monthResponse :[];
    let sortedArray = [];
    for (let x of arrayFromData) {
      sortedArray.push(x.value);
    }
    setLiveBatchListMonthBasis(sortedArray);
  }, [liveBatch]);

  useEffect(() => {
    const arrayFromData = Object.keys(jobRole).length > 0 ? jobRole.monthResponse :[];

    let sortedArray = [];
    for (let x of arrayFromData) {
      sortedArray.push(x.value);
    }
    setJobRoleListMonthBasis(sortedArray);
  }, [jobRole]);

  useEffect(() => {
    const arrayFromData = Object.keys(assessorOnboard).length > 0 ? assessorOnboard.monthResponse :[];

    let sortedArray = [];
    for (let x of arrayFromData) {
      sortedArray.push(x.value);
    }
    setAssessorOnBoardMonthBasis(sortedArray);
  }, [assessorOnboard]);

  const options = useMemo(()=>{
    return {
      scales: {
        y: {
          display: false,
        },
        x: {
          display: false,
        },
      },
      plugins: {
        tooltip: {
          display: false,
        },
        legend: {
          display: false,
        },
      },
      elements: {
        point: {
          pointRadius: 0,
          hoverRadius: 0,
        },
      },
    };
  },[])
  

  const data = useMemo(()=>{
    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ], // Extend labels to cover 12 months
      datasets: [
        {
          label: "",
          data:liveBatchListMonthBasis,
          borderColor: "rgba(0, 206, 107, 1)",
          borderWidth: 2,
          tension: 0.4,
          fill: "start",
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(
              0,
              0,
              0,
              context.chart.height
            );
            gradient.addColorStop(0, "rgba(0, 206, 107, 0.7)");
            gradient.addColorStop(1, "rgba(0, 206, 107, 0)");
            return gradient;
          },
        },
      ],
    };
  },[liveBatchListMonthBasis])

  const data1 = useMemo(()=>{
    return {
      ...data,
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ], 
      datasets: [
        {
          ...data.datasets[0],
          data: assessedBatchArrayMonthBasis,
          borderColor: "rgba(254, 138, 55, 1)",
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(
              0,
              0,
              0,
              context.chart.height
            );
            gradient.addColorStop(0, "rgba(254, 138, 55, 0.7)");
            gradient.addColorStop(1, "rgba(254, 138, 55, 0)");
            return gradient;
          },
        },
      ],
    };
  
  },[assessedBatchArrayMonthBasis, data])

  const data2 = useMemo(()=>{
    return {
      ...data,
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ], 
      datasets: [
        {
          ...data.datasets[0],
          data: jobRoleListMonthBasis,
          borderColor: "rgba(151, 71, 255, 1)",
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(
              0,
              0,
              0,
              context.chart.height
            );
            gradient.addColorStop(0, "rgba(151, 71, 255, 0.7)");
            gradient.addColorStop(1, "rgba(151, 71, 255, 0)");
            return gradient;
          },
        },
      ],
    };
  },[data, jobRoleListMonthBasis])
  

  const data3 = useMemo(()=>{
    return {
      ...data,
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ], 
      datasets: [
        {
          ...data.datasets[0],
          data: assessorOnboardListMonthBasis,
          borderColor: "rgba(255, 71, 71, 1)",
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(
              0,
              0,
              0,
              context.chart.height
            );
            gradient.addColorStop(0, "rgba(255, 71, 71, 0.7)");
            gradient.addColorStop(1, "rgba(255, 71, 71, 0)");
            return gradient;
          },
        },
      ],
    };
  },[assessorOnboardListMonthBasis, data])

  const ListItems = useMemo(()=>{
    return [
      {
        name: "Live Batches",
        value: liveBatch.liveBatch || 0,
        Icon: ActiveBatchIcon,
        className: "listitem1",
        data: data,
        options: options,
        // percentage: "-23.22%",
        // currentStatus: "Increased last month",
        // isPermissions: {
        //   1: true,
        //   2: false,
        //   3: false,
        //   4: true,
        //   5: false,
        //   6: true,
        // },
      },
      {
        name: "Assessed Batch",
        value: assessedBatch.assessedBatch || 0,
        Icon: TotalBatchIcon,
        className: "listitem2",
        data: data1,
        options: options,
        // percentage: "+23.22%",
        // currentStatus: "Increased last month",
        // isPermissions: {
        //   1: true,
        //   2: false,
        //   3: false,
        //   4: true,
        //   5: false,
        //   6: true,
        // },
      },
      {
        name: "Total Jobrole",
        value: jobRole.jobRoleCount || 0,
        Icon: TotalCandidateIcon,
        className: "listitem3",
        data: data2,
        options: options,
        // percentage: "+23.22%",
        // currentStatus: "Increased last month",
        // isPermissions: {
        //   1: true,
        //   2: false,
        //   3: false,
        //   4: true,
        //   5: false,
        //   6: true,
        // },
      },
      {
        name: "Assessor Onboard",
        value: assessorOnboard.totalAssesorOnBoardCount || 0 ,
        Icon: ExamCenterIcon,
        className: "listitem4",
        data: data3,
        options: options,
        // percentage: "+23.22%",
        // currentStatus: "Increased last month",
        // isPermissions: {
        //   1: true,
        //   2: false,
        //   3: false,
        //   4: true,
        //   5: false,
        //   6: true,
        // },
      },
    ]
  },[assessedBatch.assessedBatch, assessorOnboard.totalAssesorOnBoardCount, data, data1, data2, data3, jobRole.jobRoleCount, liveBatch.liveBatch, options])
  

  return (
    <div className="dashboard-totalview">
      <CardInfo cardLists={ListItems} />
    </div>
  );
};

export default AdminDashboardInfoCard;
