import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssessorByLocation } from "../../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../../redux/slicers/admin/dashboardSlice";
import { ReactComponent as ExportIcon} from "../../../../../assets/icons/exportIcon_downarrow.svg"

import CustomIndiaMap from "../../../../../components/common/CustomIndiaMap";
import { ButtonList_IndiaMap, ColorCodes_IndianStates } from "../../../../../utils/projectHelper";

function AssessorsByLocationMap({ clientId }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { assessorDataByLocation = {} } = useSelector(dashboardSelector);
  const [totalAssessorCount, setTotalAssessorCount] = useState(0);
  const [stateWiseData, setStateWiseData] = useState({});
  const [totalPayrollCount, setTotalPayrollCount] = useState(0);
  const [totalFreelanceCount, setTotalFreelanceCount] = useState(0);

  const getAssessorByLocationData = useCallback(() => {
    dispatch(getAssessorByLocation(setLoading, clientId));
  }, [dispatch, clientId]);

  const handleStateWiseDataSorting = (data) => {};

  useEffect(() => {
    getAssessorByLocationData();
  }, [getAssessorByLocationData, clientId]);

  useEffect(() => {
    if (assessorDataByLocation.totalAssessorCounts) {
      setTotalAssessorCount(assessorDataByLocation.totalAssessorCounts);
    } else {
      setTotalAssessorCount(0);
    }

    if (assessorDataByLocation.statewiseCounts && assessorDataByLocation.statewiseCounts.length > 0) {
      let obj = {};
      for (let item of assessorDataByLocation.statewiseCounts) {
        obj = { ...obj, [item.state]: { payroll: item.payroll, freelance: item.freelance } };
      }

      setStateWiseData(obj);
    } else {
      setStateWiseData({});
    }

    if (assessorDataByLocation.totalPayrollCounts) {
      setTotalPayrollCount(assessorDataByLocation.totalPayrollCounts);
    } else {
      setTotalPayrollCount(0);
    }

    if (assessorDataByLocation.totalFreelanceCounts) {
      setTotalFreelanceCount(assessorDataByLocation.totalFreelanceCounts);
    } else {
      setTotalFreelanceCount(0);
    }
  }, [assessorDataByLocation]);

  const colorPicker = useCallback((data = {}) => {
    let payroll = 0;
    let freelance = 0;
    let total = 0;
    if (typeof data === "object" && Object.keys(data).length > 0) {
      payroll = data.payroll || 0;
      freelance = data.freelance || 0;
      total = payroll + freelance;
    }

    if (total >= 40) {
      return "#1b3d18";
    } else if (total > 30 && total < 40) {
      return "#1d5e17";
    } else if (total > 20 && total < 30) {
      return "#43993a";
    } else if (total > 10 && total < 20) {
      return "#96f78d";
    } else if (total > 1 && total <= 10) {
      return "#c3fabe";
    } else {
      return "#e0f5df";
    }
  }, []);

  const buttonData = {
    name: "upload",
    text: `${<ExportIcon/>} Export`,
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

  console.log("buttonData_buttonData",buttonData)
  return (
    <CustomIndiaMap
      totalAssessorCount={totalAssessorCount}
      totalPayrollCount={totalPayrollCount}
      totalFreelanceCount={totalFreelanceCount}
      stateWiseData={stateWiseData}
      buttons={ButtonList_IndiaMap}
      color={ColorCodes_IndianStates}
      locationName="Assessors by Location"
      btnItemData={buttonData}
    />
  );
}

export default memo(AssessorsByLocationMap);
