import React, { useEffect, useRef, useState } from "react";
import { Pie } from "react-chartjs-2";
// import moment from "moment";
// import MultipleSelect from "../../../../components/common/MultiSelect";
import { useDispatch } from "react-redux";
// import { getLanguageDistributionData_CD } from "../../../../api/adminApi/dashboard";
// import { dashboardSelector } from "../../../../redux/slicers/admin/dashboardSlice";
import { getDonutDataWithColorCodeAPI } from "../../../../../api/superAdminApi/dashboard";
import { dashboardConstants } from "../../../../../config/constants/projectConstant";
import SelectInput from "../../../../../components/common/SelectInput";
import {
  generateRandomColors,
  generateRandomColorsArrayBased,
} from "../../../../../utils/projectHelper";
import { useInView } from "react-intersection-observer";
import RingLoaderCompoenent from "../../../../../components/common/RingLoader";
import CurveChartDetailsDescriptionSkeleton from "./skeleton/curveChartDetailDescriptionSkeletion";

const DonutChartWithDetailDescription = ({
  dashboardType,
  title,
  componentSpecificData = {},
  componentList = [],
  selectInputRequired = true,
  clientId = "",
}) => {
  const dispatch = useDispatch();
  const [componentSpecificUrl, setComponentSpecificUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [componentDonutData, setComponentData] = useState([]);
  const [label, setLabel] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [percentageList, setPercentageList] = useState([]);
  const [optionSelected, setOptionSelected] = useState("weekly");
  const { ref, inView } = useInView({ threshold: 0.5 });
  const prevTextRef = useRef(clientId);


  const handleChange = (e) => {
    e.preventDefault();
    setOptionSelected(e.target.value);
  };

  const updateData = (data) => {
    setComponentData(data);
  };

  const getDonutDataWithColorCode = (url) => {
    setLoading(true)
    dispatch(
      getDonutDataWithColorCodeAPI(
        url,
        clientId,
        setLoading,
        optionSelected,
        updateData
      )
    );
  };

  useEffect(() => {
    if (optionSelected && componentSpecificUrl && inView) {
      setLoading(true)
      dispatch(
        getDonutDataWithColorCodeAPI(
          componentSpecificUrl,
          clientId,
          setLoading,
          optionSelected,
          updateData
        )
      );
    }
  }, [optionSelected]);



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

  useEffect(() => {
    if (componentSpecificUrl && inView && (clientId !== prevTextRef.current)) {
      prevTextRef.current = clientId;
      getDonutDataWithColorCode(componentSpecificUrl);
    }
    else if(componentSpecificUrl && inView && (clientId === "" && !percentageList?.length>0)){
      getDonutDataWithColorCode(componentSpecificUrl);
    }
  }, [componentSpecificUrl, inView, clientId]);


  useEffect(() => {
    if (componentDonutData?.length > 0) {
      if (title + " " + dashboardType === "Assessment history Operations") {
        const data = [];
        const label = [];
        let totalCount = 0;
        for (let item of componentDonutData) {
          data.push(item?.assessmentCount);
          label.push(item?.year);
          totalCount = totalCount + item?.assessmentCount;
        }

        if (data?.length > 0) {
          setPercentageList(data);
        }
        if (label?.length > 0) {
          setLabel(label);
        }
        if (totalCount) {
          setTotalCount(totalCount);
        }
      } else if (
        `${title} ${dashboardType}` ===
        dashboardConstants?.BatchVerificationStatsQA
      ) {
        const data = [];
        const label = [];
        let totalCount = 0;
        for (let item of componentDonutData) {
          data.push(componentDonutData[item]);
          label.push(item);
          totalCount = totalCount + componentDonutData[item];
        }
        if (data?.length > 0) {
          setPercentageList(data);
        }
        if (label?.length > 0) {
          setLabel(label);
        }
        if (totalCount) {
          setTotalCount(totalCount);
        }
      } else if (
        title + " " + dashboardType ===
        "Language Distribution Content"
      ) {
        const data = [];
        const label = [];
        let totalCount = 0;
        for (let item of componentDonutData) {
          data.push(item?.percentage);
          label.push(item?.language);
          totalCount = totalCount + item?.count;
        }
        if (data?.length > 0) {
          setPercentageList(data);
        }
        if (label?.length > 0) {
          setLabel(label);
        }
        if (totalCount) {
          setTotalCount(totalCount);
        }
      } else if (
        title + " " + dashboardType ===
        "Client wise assessment Operations"
      ) {
        const data = [];
        const label = [];
        let totalCount = 0;
        for (let item of componentDonutData) {
          data.push(item?.assessmentCount);
          label.push(item?.clientName);
          totalCount = totalCount + item?.assessmentCount;
        }
        if (data?.length > 0) {
          setPercentageList(data);
        }
        if (label?.length > 0) {
          setLabel(label);
        }
        if (totalCount) {
          setTotalCount(totalCount);
        }
      }
    } else if (
      Object.keys(componentDonutData)?.length > 0 &&
      !Array.isArray(componentDonutData)
    ) {
      if (
        `${title} ${dashboardType}` ===
        dashboardConstants?.BatchVerificationStatsQA
      ) {
        const data = [];
        const label = [];
        let totalCount = 0;
        for (let item of Object.keys(componentDonutData)) {
          data.push(componentDonutData[item]);
          label.push(item && item?.toUpperCase());
          totalCount = totalCount + componentDonutData[item];
        }
        if (data?.length > 0) {
          setPercentageList(data);
        }
        if (label?.length > 0) {
          setLabel(label);
        }
        if (totalCount) {
          setTotalCount(totalCount);
        }
      }
    }
  }, [componentDonutData]);

  const data = {
    labels: label,
    datasets: [
      {
        // data: [20, 12, 34, 23, 12, 34, 22], //percentageList
        data: percentageList,
        backgroundColor: generateRandomColorsArrayBased(percentageList?.length),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      tooltip: {
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 10,
        },
      },
      legend: {
        display: true,
        position: "right",
        labels: {
          font: {
            size: 12,
            weight: "500",
          },
          color: "#637381",
          boxWidth: 15,
          boxHeight: 15,
          borderRadius: 4,
          padding: 12,
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    radius: "100%",
  };

  const dropOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div ref={ref}>
      {loading ? (
        // <RingLoaderCompoenent />
        <CurveChartDetailsDescriptionSkeleton/>
      ) : (
        <div className="languageDistrubution-overview_PieChart" >
          <div className="chart-card-header">
            <div>
              <h1 style={{ fontSize: "normal", fontWeight: "bold" }}>
                {componentSpecificData?.title}
              </h1>
              <h1 style={{ fontSize: "large", fontWeight: "bold" }}>
                {totalCount}
              </h1>
            </div>
            {selectInputRequired && (
              <div style={{ width: "auto" }}>
                <SelectInput
                  name="Filter by Time spent"
                  value={optionSelected}
                  handleChange={handleChange}
                  options={dropOptions}
                  placeHolder={""}
                />
              </div>
            )}
            <div></div>
          </div>
          <div>
            <Pie data={data} options={options} height={180} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DonutChartWithDetailDescription;
