import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssessorByLocation } from "../../../../../../api/adminApi/dashboard";
import { dashboardSelector } from "../../../../../../redux/slicers/admin/dashboardSlice";

import CustomIndiaMap from "../../../../../../components/common/CustomIndiaMap";
import { ButtonList_IndiaMap, ColorCodes_IndianStates } from "../../../../../../utils/projectHelper";

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

  const buttonData = {
    name: "upload",
    iconRight: "",
    isRightIcon: false,
    // iconLeft: "line-md:plus",
    text: `Export`,
    onClick: () => {},
    path: "",
    loading: loading,
    disabled: loading ? true : false,
    isPermissions: {},
    style: {
      fontSize: "small",
      paddingTop: "10px",
      paddingBottom: "10px",
      paddingRight: "10px",
      paddingLeft: "10px",
      marginLeft: "10px",
    },
  };

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
