import { Doughnut } from "react-chartjs-2";
import SelectInput from "../SelectInput";
import { ReactComponent as GetReportIcon } from "../../../assets/icons/admin/get-report-icon.svg";

const SectorWiseDohNut = (props) => {
  const {
    doughNutName = "",
    data,
    options,
    currentValue,
    dropDownOptions,
    onChange,
    plugins,
    isPermission,
    total,
    percentage,
    isdropDownOptions,
    issectorValueRequired = true,
  } = props?.doughNutData;
  return (
    <div className="LeadsAnalyticsDoughnutChart">
      <div className="chart-card-header">
        <div>
          <h2 style={{ fontSize: "large" }}>{doughNutName}</h2>
          <div>
            <p style={{ fontSize: "x-large", fontWeight: "bold" }}>
              {total} <span>{/* <GetReportIcon /> {percentage} */}</span>{" "}
            </p>
          </div>
        </div>
        <div style={{ minWidth: "80px" }}>
          {isdropDownOptions ? (
            <SelectInput name="" value={currentValue} handleChange={onChange} options={dropDownOptions} />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="LeadsAnalyticsDoughnutChart__chart-container">
        <div className="chart-wrapper" style={{ marginTop: "10%" }}>
          <Doughnut type={"doughnut"} options={options} data={data} plugins={plugins} />
        </div>
        <div className="chart-wrapper-legend" style={{ marginTop: "10%" }}>
          {data.labels.map((item, idx) => (
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ background: data?.datasets[0].backgroundColor[idx] }}></span>
              <div>
                <p>{item}</p>
                {issectorValueRequired && <h5>{data?.datasets[0].data[idx]}</h5>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorWiseDohNut;
