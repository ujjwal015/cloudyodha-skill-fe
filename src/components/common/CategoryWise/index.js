import { Icon } from "@iconify/react/dist/iconify.js";
import { Line } from "react-chartjs-2";
import SelectInput from "../SelectInput";
import MapSkeleton from "../../../pages/superAdmin/dashboards/components/Charts/skeleton";
import CurveChartSkeleton from "../../../pages/superAdmin/dashboards/components/Charts/skeleton";


const CategoryWise = (props) => {
  const {
    categoryName = "",
    data,
    options,
    isPermissions,
    currentOption,
    dropDownOptions = [],
    onClick,
    isSelectFieldRequired,
    loading,
    ref,
  } = props?.catergoryWiseData;
  return (
    <div ref={ref}>
      {loading ? (
        <CurveChartSkeleton/>
      ) : (
        <div className="SectorWiseOverviewAreaChart">
          <div className="SectorWiseOverviewAreaChart__header">
            <h2>{categoryName}</h2>
            <div className="SectorWiseOverviewAreaChart__legend">
              {data?.datasets.map((item, idx) => (
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ background: item.borderColor }}>
                      <Icon style={{ marginTop: 3 }} icon={item?.icon} />
                    </span>
                    <div>
                      <p>{item.label}</p>
                      <p style={{ fontWeight: "bold " }}>{item?.totalCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {isSelectFieldRequired && (
              <SelectInput
                name="inputselect"
                placeHolder={"Select"}
                value={currentOption}
                handleChange={onClick}
                options={dropDownOptions}
                loading={false}
                width={40}
              />
            )}
          </div>
          <Line height={150} data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default CategoryWise;
