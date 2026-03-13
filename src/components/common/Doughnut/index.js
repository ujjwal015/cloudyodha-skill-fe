import { Doughnut } from "react-chartjs-2";
import SelectInput from "../SelectInput";
import { ReactComponent as GetReportIcon } from "../../../assets/icons/admin/get-report-icon.svg";
import MultipleSelect from "../MultiSelect";
import { NULL } from "sass";
import RingLoaderCompoenent from "../RingLoader";
import DonutChartSkeletonWithDescription from "../../../pages/superAdmin/dashboards/components/Charts/skeleton/donutChartSkeleton";

const DoughNut = (props) => {
  const {
    doughNutName = "",
    data,
    options,
    currentValue,
    onChange,
    plugins,
    isPermission,
    total,
    percentage,
    isFilterRequired = false,
    filterData = {},
    isSelectFieldRequired = false,
    currentOption,
    dropDownOptions,
    onClick,
    loading,
    ref,
  } = props?.doughNutData;
  return (
    <div ref={ref}>
      {loading ? (
        // <RingLoaderCompoenent />
        <DonutChartSkeletonWithDescription/>
      ) : (
        <div className="LeadsAnalyticsDoughnutChart">
          <div className="chart-card-header">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 className="LeadsAnalyticsDoughnutChart-header-1">
                  {doughNutName}
                </h2>
                <div>
                  <h3 className="LeadsAnalyticsDoughnutChart-header-2">
                    {total}
                    {/* <span>
                  <GetReportIcon/>
                   {percentage}
                  </span>  */}
                  </h3>
                </div>
              </div>
            </div>
            {isSelectFieldRequired && (
              <SelectInput
                name="inputselect"
                placeHolder={"Select"}
                value={currentOption}
                handleChange={onClick}
                options={dropDownOptions}
                loading={loading}
                width={70}
              />
            )}
            {isFilterRequired && (
              <div>
                <MultipleSelect
                  setSelectedIds={filterData.setSelectedIds || null}
                  selectedIds={filterData.selectedIds || []}
                  options={filterData.assignedClientList || []}
                  handleChange={filterData.handleChange || null}
                  label={filterData.label || ""}
                />
              </div>
            )}
          </div>
          <div className="LeadsAnalyticsDoughnutChart__chart-container">
            <div className="chart-wrapper">
              <Doughnut
                type={"doughnut"}
                options={options}
                data={data}
                plugins={plugins}
              />
            </div>
            <div className="chart-wrapper-legend">
              {data.labels.map((item, idx) => (
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <span
                    style={{
                      background: data?.datasets[0].backgroundColor[idx],
                    }}
                  ></span>
                  <div>
                    <p>{item}</p>
                    <h5>{data?.datasets[0].data[idx]}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoughNut;
