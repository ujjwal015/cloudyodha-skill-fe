import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import "./adminDashboard.css";
import { navigate } from "./../../../../utils/projectHelper";
import BreadCrumbs from "../../../../components/common/Breadcrumbs/index.js";
import HeaderTitle from "../../../../components/common/HeaderTitle/index.js";
import SectorWiseAssessmentDoughnutChart from "./components/SectorWiseAssessment.jsx";
import AssessorsByLocationMap from "./components/AssessorsByLocationMap.jsx";
import ClientBasedJobRoleTable from "./components/ClientBasedJobRoleTable.jsx";
import ScheduledBatchCalendar from "./components/ScheduledBatchesCalender.jsx";
import AssessmentAnalyticsAreaChart from "./components/AssessmentAnalyticsAreaChart.jsx";
import AssessmentApplicantDonut from "./AssessmentApplicantDonut.jsx";
import LiveBatchesLogTable from "./components/LiveBatchesLogTable.jsx";
import { getAllClientListsApi } from "../../../../api/superAdminApi/clientManagement.js";

import { useDispatch, useSelector } from "react-redux";
import { clientManagementSelector } from "../../../../redux/slicers/superAdmin/clientManagement.js";
import AdminDashboardInfoCard from "./components/AdminDashboardInfoCard.jsx";
import ClientSelect from "../../../../components/common/ClientSelect.js";
import ToolTipNCEVT from "../../../../components/common/ToolTipNCEVT/index.js";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [selectedClientName, setSelectedClientName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const { clientManagementLists = [] } = useSelector(clientManagementSelector);
  const dispatch = useDispatch();

  const handleClientChange = useCallback((data) => {
    setSelectedClientId(data);
  }, []);

  useEffect(() => {
    dispatch(getAllClientListsApi(setLoading, 1, 100));
  }, [dispatch]);

  useEffect(() => {
    let newArr = [];
    if (clientManagementLists.length > 0) {
      for (let item of clientManagementLists) {
        // if(ListedClients.includes(item.clientcode)){
        newArr.push({
          clientName: item.clientCode,
          clientId: item._id,
        });
        // }
      }
    }
    setClientList(newArr);
  }, [clientManagementLists]);

  const handleBreadCrumbClick = useCallback((event, name, path) => {
    navigate(path);
  }, []);

  const breadCrumbsData = useMemo(() => {
    return [
      {
        name: "Overview",
        isLink: true,
        key: "1",
        path: "/",
        onClick: handleBreadCrumbClick,
        isPermissions: {
          1: true,
          2: false,
          3: false,
          4: true,
          5: false,
          6: true,
        }, // User Role permission
        isDisable: false,
      },
      {
        name: "NCVET Dashboard",
        isLink: false,
        key: "2",
        path: "",
        onClick: handleBreadCrumbClick,
        isPermissions: {
          1: true,
          2: false,
          3: false,
          4: true,
          5: false,
          6: true,
        },
        isDisable: false,
      },
    ];
  }, [handleBreadCrumbClick]);

  return (
    <div className="main-content adm-dashboard">
      <div className="dashboard-topheader">
        <div className="dashboard-welcome">
          <HeaderTitle greeting="Welcome" userName={"Team NCVET!!"} />
          <div className="breadcrumbs">
            <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
          </div>
        </div>

        <ClientSelect
          label="Select"
          value={selectedClientName}
          options={clientList}
          handleClientChange={handleClientChange}
          clientList={clientList}
        />
      </div>
      {loading ? (
        "loading..."
      ) : (
        <>
          <div className="card-info-wrapper">
            <AdminDashboardInfoCard clientId={selectedClientId} />
          </div>

          <div className="cards-grid grid-cols-2">
            <SectorWiseAssessmentDoughnutChart clientId={selectedClientId}/>
            <AssessorsByLocationMap clientId={selectedClientId} />
          </div>

          <div className="cards-grid grid-cols-2">
            <ClientBasedJobRoleTable />
            <ScheduledBatchCalendar clientId={selectedClientId} />
          </div>

          <div className="cards-grid grid-cols-3">
            <AssessmentAnalyticsAreaChart className="col-span-2" clientId={selectedClientId} />
            <AssessmentApplicantDonut clientId={selectedClientId} />
          </div>

          <div className="cards-grid">
            <LiveBatchesLogTable clientId={selectedClientId}/>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
