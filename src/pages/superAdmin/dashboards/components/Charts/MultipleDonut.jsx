import React, {
  lazy,
  memo,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import MulltipleDonutChart from "../../../../../components/common/MultipleDonutChart";
import { useDispatch } from "react-redux";
import { getMultipleCurveDataApi } from "../../../../../api/superAdminApi/dashboard";
import { useInView } from "react-intersection-observer";
import MultipleDonutSkeleton from "./skeleton/multipleDonutSkeleton";
import SelectInput from "../../../../../components/common/SelectInput";

const DatePickerModal = lazy(() => import("../dateRange/modal"));

const MultipleDonut = ({
  title,
  dashboardType,
  componentSpecificData,
  componentList,
  clientId = "",
}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [componentSpecificUrl, setComponentSpecificUrl] = useState("");
  const [multipleCurveData, setMultipleCurveData] = useState({});
  const [totalBatches, setTotalBatches] = useState(0);
  const [completeBatches, setCompleteBatches] = useState(0);
  const [pendingBatches, setPendingBatches] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const prevTextRef = useRef(clientId);
  const [currentOption, setCurrentOption] = useState("monthly");
  const [open, setOpen] = useState(false);

  const dropDownOptions = [
    { label: "Monthly", value: "monthly" },
    { label: "Quaterly", value: "quarterly" },
    { label: "Yearly", value: "yearly" },
  ];
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [tempRange, setTempRange] = useState(range);
  const prevCurrentOptionRef = useRef(currentOption);
  const prevCurrentRangeRef = useRef(range);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setCurrentOption(e.target.value);
  };

  const handleOkClick = () => {
    setRange(tempRange);
    setShowCalendar(false);

    getMultipleCurveData(componentSpecificUrl, tempRange);
  };

  const handleRangeChange = (item) => {
    setRange([item?.selection]);
    setTempRange([item.selection]);
  };

  useEffect(() => {
    if (Object.keys(multipleCurveData)?.length > 0) {
      setTotalBatches(multipleCurveData?.totalBatchCount);
      setCompleteBatches(multipleCurveData?.completedBatchCount);
      setPendingBatches(multipleCurveData?.pendingBatchCount);
    }
  }, [multipleCurveData]);

  const updateData = (data) => {
    if (data) {
      setMultipleCurveData(data);
    }
  };

  const getMultipleCurveData = (url) => {
    dispatch(
      getMultipleCurveDataApi(url, clientId, setLoading, updateData, range)
    );
  };

  const dateRangeData = {
    range: range,
    handleRangeChange: handleRangeChange,
    showCalendar: showCalendar,
    setShowCalendar: setShowCalendar,
    handleOkClick: handleOkClick,
  };

  const modalData = {
    open,
    handleOpen,
    handleClose,
  };

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
    if (componentSpecificUrl && inView && clientId !== prevTextRef.current) {
      prevTextRef.current = clientId;
      setLoading(true);
      getMultipleCurveData(componentSpecificUrl);
    } else if (
      componentSpecificUrl &&
      inView &&
      clientId === "" &&
      !Object.keys(multipleCurveData)?.length > 0
    ) {
      setLoading(true);
      getMultipleCurveData(componentSpecificUrl);
    } else if (
      componentSpecificUrl &&
      inView &&
      // currentOption !== prevCurrentOptionRef.current
      range !== prevCurrentRangeRef.current
    ) {
      prevCurrentRangeRef.current = range;
      setLoading(true);
      getMultipleCurveData(componentSpecificUrl);
    }
  }, [componentSpecificUrl, inView, clientId]);

  const data = [
    {
      labels: ["Total Batches"],
      datasets: [
        {
          label: "Total Batches",
          data: [totalBatches, 0],
          backgroundColor: ["#8b5cf6", "#e4e4e7"],
        },
      ],
    },
    {
      labels: ["Completed Batches"],
      datasets: [
        {
          label: "Completed Batches",
          data: [completeBatches, pendingBatches],
          backgroundColor: ["#10b981", "#e4e4e7"],
        },
      ],
    },
    {
      labels: ["Pending Batches"],
      datasets: [
        {
          label: "Pending Batches",
          data: [pendingBatches, completeBatches],
          backgroundColor: ["#f59e0b", "#e4e4e7"],
        },
      ],
    },
  ];

  return (
    <div ref={ref}>
      {loading ? (
        <MultipleDonutSkeleton />
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <h2 style={{ fontSize: "large", fontWeight: "bold" }}>
              Batch Statistics
            </h2>
            {/* <SelectInput
              name="inputselect"
              placeHolder={"Select"}
              value={currentOption}
              handleChange={handleChange}
              options={dropDownOptions}
              loading={false}
              // width={40}
            /> */}
            <Suspense fallback={<div>Loading...</div>}>
              <DatePickerModal dateRangeData={dateRangeData} data={modalData} />
            </Suspense>
          </div>

          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {totalBatches}
          </h3>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {data.map((chartData, index) => (
              <MulltipleDonutChart
                key={index}
                data={chartData}
                title={
                  index === 0
                    ? "Total Batches"
                    : index === 1
                    ? "Completed Batches"
                    : "Pending Batches"
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MultipleDonut);
