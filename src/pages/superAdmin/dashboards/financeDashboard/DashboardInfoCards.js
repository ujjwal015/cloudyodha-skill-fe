import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";

import { ReactComponent as ActiveBatchIcon } from "../../../../assets/icons/admin/active-batch-icon.svg";
import { ReactComponent as TotalBatchIcon } from "../../../../assets/icons/admin/total-batch-icon.svg";
import { ReactComponent as TotalCandidateIcon } from "../../../../assets/icons/admin/total-candidate-icon.svg";
import { ReactComponent as ExamCenterIcon } from "../../../../assets/icons/admin/exam-center-icon.svg";
import { ReactComponent as GetReportIcon } from "../../../../assets/icons/admin/get-report-icon.svg";
import { getWidgetStatsApi } from "../../../../api/adminApi/dashboard";

const DashboardInfoCards = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { widgetStats = {} } = useSelector(dashboardSelector);

  useEffect(() => {
    dispatch(getWidgetStatsApi(setLoading));
  }, []);
  
  const ListItems = [
    {
      title: "Onboarding Clients",
      value: widgetStats?.onboardingClients,
      Icon: ActiveBatchIcon,
      className: "listitem1"
    },
    {
      title: "Active Clients",
      value: widgetStats?.activeClients,
      Icon: TotalBatchIcon,
      className: "listitem2"
    },
    {
      title: "Total Assessments",
      value: widgetStats?.totalAssessments,
      Icon: TotalCandidateIcon,
      className: "listitem3"
    },
    {
      title: "Active Leads",
      value: widgetStats?.totalLeads,
      Icon: ExamCenterIcon,
      className: "listitem4"
    },
  ];

  return (
    <div className="dashboard-totalview">
      {ListItems?.map((item) => {
        const { Icon } = item;
        return (
          <div
            className={`total-listitem ${item?.className}`}
            key={item?.title}
          >
            <div className="info">
              <div className="val">
                <h3>{item?.value}</h3>
                <p>{item?.title}</p>
              </div>
              <div className="icon">
                <Icon />
              </div>
            </div>
            {/* <div className="report">
              <GetReportIcon />
              <p>Get Report</p>
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardInfoCards;
