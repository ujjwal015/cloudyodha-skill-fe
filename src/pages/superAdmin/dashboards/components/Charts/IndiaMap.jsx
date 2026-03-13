import { memo, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as ExportIcon } from "../../../../../assets/icons/exportIcon_downarrow.svg";
import CustomIndiaMap from "../../../../../components/common/CustomIndiaMap";
import { ColorCodes_IndianStates } from "../../../../../utils/projectHelper";
import { getDataForIndiaMapAPI } from "../../../../../api/superAdminApi/dashboard";
import { dashboardConstants } from "../../../../../config/constants/projectConstant";
import { useInView } from "react-intersection-observer";

function IndiaMap({
  clientId = "",
  title = "",
  dashboardType = "",
  isButtonRequired = true,
  componentList = {},
  buttonsDetails,
}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [totalAssessorCount, setTotalAssessorCount] = useState(0);
  const [stateWiseData, setStateWiseData] = useState([]);
  const [totalPayrollCount, setTotalPayrollCount] = useState(0);
  const [totalFreelanceCount, setTotalFreelanceCount] = useState(0);
  const [totalMasterAssessorCount,setTotalMasterAssessorCount]=useState(0)
  const [componentSpecificUrl, setComponentSpecificUrl] = useState("");

  console.log("endpoint_endpoint", componentSpecificUrl);

  const [mapData, setMapData] = useState({});
  const prevTextRef = useRef(clientId);

  const { ref, inView } = useInView({ threshold: 0.5 });

  const updateMapData = (data) => {
    setMapData(data);
  };

  useEffect(() => {
    if (mapData && Object?.keys(mapData)?.length > 0) {
      if (
        title + " " + dashboardType ===
          dashboardConstants?.AssessorByLocationOD ||
        title + " " + dashboardType === dashboardConstants?.AssessorByLocationHR
      ) {
        setTotalFreelanceCount(mapData?.assessorStats?.totalFreelanceCounts);
        setTotalPayrollCount(mapData?.assessorStats?.totalPayrollCounts);
        setTotalAssessorCount(mapData?.assessorStats?.totalAssessorCounts);
        if (
          mapData.assessorStats?.statewiseCounts &&
          mapData.assessorStats?.statewiseCounts.length > 0
        ) {
          let obj = {};
          for (let item of mapData?.assessorStats?.statewiseCounts) {
            const arr = [];
            for (let data in item) {
              if (data !== "state") {
                arr.push({ label: data, value: item[data] || Number("0") });
              }
            }
            obj = { ...obj, [item?.state]: arr };
          }
          setStateWiseData(obj);
        } else {
          setStateWiseData({});
        }
      } else if (
        title + " " + dashboardType ===
        dashboardConstants?.ClientByLocationBD
      ) {
        setTotalAssessorCount(mapData?.totalClientCount);
        if (mapData?.clientStats && mapData?.clientStats?.length > 0) {
          let obj = {};
          for (let item of mapData?.clientStats) {
            const arr = [];
            for (let data in item) {
              if (data !== "state") {
                arr.push({ label: data, value: item[data] || Number("0") });
              }
            }
            obj = { ...obj, [item?.state]: arr };
          }
          setStateWiseData(obj);
        } else {
          setStateWiseData({});
        }
      }
      else if( title + " " + dashboardType === dashboardConstants?.MasterAssessorsByLocation){

        if (mapData?.statewiseMasterAssessors && mapData?.statewiseMasterAssessors?.length > 0) {
          let obj = {};
          for (let item of mapData?.statewiseMasterAssessors) {
            const arr = [];
            for (let data in item) {
              if (data !== "state") {
                arr.push({ label: data, value: item[data] || Number("0") });
              }
            }
            obj = { ...obj, [item?.state]: arr };
          }
          setStateWiseData(obj);
        } else {
          setStateWiseData({});
        }
      }
      else if(title + " " + dashboardType === dashboardConstants?.ExamCenter){
         if (mapData?.statewiseStats && mapData?.statewiseStats?.length > 0) {
          let obj = {};
          for (let item of mapData?.statewiseStats) {
            const arr = [];
            for (let data in item) {
              if (data !== "state") {
                arr.push({ label: data, value: item[data] || Number("0") });
              }
            }
            obj = { ...obj, [item?.state]: arr };
          }
          setStateWiseData(obj);
        } else {
          setStateWiseData({});
        }
      }
    }
  }, [mapData]);

  const buttonData = {
    name: "upload",
    text: `${(<ExportIcon />)} Export`,
    onClick: () => {},
    path: "",
    loading: loading,
    disabled: loading ? true : false,
    isPermissions: {},
    style: {
      fontSize: "small",
      paddingTop: "5px",
      paddingBottom: "5px",
      paddingRight: "5px",
      paddingLeft: "5px",
      marginLeft: "5px",
    },
  };

  const getDataForIndiaMap = (url) => {
    dispatch(getDataForIndiaMapAPI(url, setLoading, clientId, updateMapData));
  };

  useEffect(() => {
    if (componentSpecificUrl && inView && clientId !== prevTextRef.current) {
      prevTextRef.current = clientId;
      setLoading(true);
      getDataForIndiaMap(componentSpecificUrl);
    } else if (
      componentSpecificUrl &&
      inView &&
      clientId === "" &&
      !Object?.keys(mapData)?.length > 0
    ) {
      setLoading(true);
      getDataForIndiaMap(componentSpecificUrl);
    }
  }, [componentSpecificUrl, inView, clientId]);

  useEffect(() => {
    if (componentList?.length > 0) {
      const element = componentList?.find((item) => {
        return (
          `${item?.componentId?.component_name} ${item?.componentId?.component_category}` ===
          `${title} ${dashboardType}`
        );
      });
      if (element) {
        setComponentSpecificUrl(element?.componentId?.endpoint);
      }
    }
  }, [componentList]);

  return (
    <div>
      <CustomIndiaMap
        totalAssessorCount={totalAssessorCount}
        totalPayrollCount={totalPayrollCount}
        totalFreelanceCount={totalFreelanceCount}
        stateWiseData={stateWiseData}
        buttons={buttonsDetails}
        color={ColorCodes_IndianStates}
        locationName={`${title} ${dashboardType}`}
        btnItemData={buttonData}
        reference={ref}
        loading={loading}
        title={title} 
      />
    </div>
  );
}

export default memo(IndiaMap);
