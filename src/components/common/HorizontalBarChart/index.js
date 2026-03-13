import { Bar } from "react-chartjs-2";
import SelectInput from "../SelectInput";
import { ReactComponent as GetReportIcon } from "../../../assets/icons/admin/get-report-icon.svg";
import RingLoaderCompoenent from "../RingLoader";
import HorizontalBarChartSkeleton from "../../../pages/superAdmin/dashboards/components/Charts/skeleton/horizontalChart";

const HorizontalBarChart = (props) => {
  const {
    horizonBarChartName = "",
    data,
    options,
    onChange,
    currentValue,
    dropDownOptions,
    buttonOptions,
    onClickButton,
    selectedButton,
    isPermissions,
    percentage,
    total,
    reference,
    loading,
  } = props?.horizonBarChartData;

  return (
    <div ref={reference}>
      {loading ? (
        // <RingLoaderCompoenent />
        <HorizontalBarChartSkeleton/>
      ) : (
        <div className="LeadsByCategoryBarChart" >
          <div className="chart-card-header">
            <div>
              <h2>{horizonBarChartName}</h2>
              {/* <div>
            <h2>{horizonBarChartName}</h2> */}
              <div>
                <p className="LeadsByCategoryBarChart-totalpercentage">
                  {total}
                  {/* <span className="percentage">
                <GetReportIcon/>  */}
                  {percentage}
                  {/* </span>  */}
                </p>
              </div>
              {/* </div> */}

              {/*  <div style={{ minWidth: "80px" }}>
          <SelectInput name="" value={currentValue} handleChange={onChange} options={dropDownOptions} />
          </div> */}
            </div>
            <div className="line-chart-options">
              {buttonOptions?.length > 0 &&
                buttonOptions.map((btnItem) => (
                  <button
                    className={`btn ${
                      selectedButton === btnItem.name ? "active" : ""
                    }`}
                    onClick={() => onClickButton(btnItem.name)}
                  >
                    {btnItem.label}
                  </button>
                ))}
            </div>
            {/* WIll have to enbale it in future */}
            {dropDownOptions?.length > 0 && (
              <div style={{ minWidth: "80px" }}>
                <SelectInput
                  name=""
                  value={currentValue}
                  handleChange={onChange}
                  options={dropDownOptions}
                />
              </div>
            )}
          </div>
          <Bar options={options} data={data} />
        </div>
      )}
    </div>
  );
};

export default HorizontalBarChart;
