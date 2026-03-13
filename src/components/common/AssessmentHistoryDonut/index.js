import { Doughnut } from "react-chartjs-2";
import SelectInput from "../SelectInput";
import { ReactComponent as GetReportIcon } from "../../../assets/icons/admin/get-report-icon.svg";

const index = (props) => {
  const {
    doughNutName = "",
    data,
    options,
    plugins,
    isPermission,
    total,
    percentage,
  } = props?.doughNutData;
  return (
    <div className="LeadsAnalyticsDoughnutChart">
      <div className="chart-card-header">
        <div>
          <h2>{doughNutName}</h2>
          <div>
            <p>
              {total}{" "}
              <span>
                <GetReportIcon /> {percentage}
              </span>{" "}
            </p>
          </div>
        </div>
      </div>
      <div
        className="LeadsAnalyticsDoughnutChart__chart-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="chart-wrapper">
          <Doughnut
            type={"doughnut"}
            options={options}
            data={data}
            plugins={plugins}
          />
        </div>
        <div
          className="chart-wrapper-legend"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            columnGap: "15px",
            alignItems: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default index;
