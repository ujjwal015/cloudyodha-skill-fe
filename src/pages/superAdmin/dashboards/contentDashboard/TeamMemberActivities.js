import React, { useState } from "react";
import CustomTable from "../../../../components/common/CustomTable/index";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";

import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";
import "./style.css";
const statusColorMap = {
  "In Progress": "#FFA500",
  Completed: "#008000",
  Pending: "#0000FF",
  "Not Started": "#808080",
  default: "#000000",
};

const dummyData = [
  {
    id: 1,
    titleName: "Project Launch and Initial Stakeholder Meeting",
    activityType: "Meeting",
    createdBy: "Alice",
    dueDate: "2024-07-20",
    status: "In Progress",
  },
  {
    id: 2,
    titleName:
      "Comprehensive Design Review Session with Team and Stakeholders Comprehensive Design Review Session with Team and Stakeholders",
    activityType: "Review",
    createdBy: "Bob",
    dueDate: "2024-07-18",
    status: "Completed",
  },
  {
    id: 3,
    titleName: "Detailed Code Implementation for New Feature Development in Sprint 4",
    activityType: "Development",
    createdBy: "Charlie",
    dueDate: "2024-07-25",
    status: "Pending",
  },
  {
    id: 4,
    titleName: "Extensive User Testing and Feedback Collection for Beta Release",
    activityType: "Testing",
    createdBy: "Dana",
    dueDate: "2024-07-22",
    status: "In Progress",
  },
  {
    id: 5,
    titleName: "Strategic Planning and Coordination for Upcoming Product Release",
    activityType: "Planning",
    createdBy: "Eve",
    dueDate: "2024-07-30",
    status: "Not Started",
  },
];

// You can use this dummyData array to populate your table.

const TeamMemberActivities = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const headerColumns = [
    {
      name: "titleName",
      label: "TITLE NAME",
      sorting: true,
      selector: (row) => (
        <div className="titleName-cell">
          <h2>{row?.titleName ?? "N/A"}</h2>
        </div>
      ),
      style: {
        maxWidth: "300px",
      },
    },
    {
      name: "activityType",
      label: "ACTIVITY TYPE",
      sorting: true,
      selector: (row) => row?.activityType ?? "N/A",
    },
    {
      name: "createdBy",
      label: "CREATED BY",
      sorting: true,
      selector: (row) => row?.createdBy ?? "N/A",
    },
    {
      name: "dueDate",
      label: "DUE DATE",
      sorting: true,
      selector: (row) => row?.dueDate ?? "N/A",
    },
    {
      name: "status",
      label: "STATUS",
      sorting: false,
      selector: (row) => (
        <div
          className="status-cell"
          style={{
            borderColor: statusColorMap?.[row?.status] ?? "#000",
            backgroundColor: `${statusColorMap?.[row?.status]}30` ?? "#000000",
          }}>
          {row?.status ?? "N/A"}
        </div>
      ),
    },
  ];

  const table = {
    isPermission: true,
    headerColumn: headerColumns,
    bodyData: dummyData,
    isCheckBox: false,
    canDeleteAllSelectedBox: true,
  };

  return (
    <div className="TeamMemberActivities">
      <div className="chart-card-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>All Activites</h2>
      </div>
      <CustomTable table={table} loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default TeamMemberActivities;
