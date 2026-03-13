import "./toolTipContent.css";

const TooltipContent = ({
  data = [],
  stateName = " ",
  section = "all",
  colorSelectorForTooltip
}) => {
  const filteredData = (Array.isArray(data) && data?.filter((item) => item?.label === section)) || [];
  return (
    <div className="tooltip-container">
      <div className="tooltip-container-tophead">
        <p>{stateName}</p>
      </div>
      {section === "all" ? (
        <div className="tooltip-container-body">
          {data?.length > 0 &&
            data?.map((item) => (
              <div>
                <p style={{ marginRight: "10px" }}>
                  <span
                    className="icon"
                    style={{ background: `${item?.color}` }}
                  ></span>
                  <span>{item?.label?.toUpperCase()}</span>
                </p>
                <p style={{ fontWeight: "bold" }}>{item?.value}</p>
              </div>
            ))}
        </div>
      ) : (
        <div className="tooltip-container-body">
          {filteredData?.length > 0 &&
            filteredData?.map((item) => (
              <div>
                <p style={{ marginRight: "10px" }}>
                  <span
                    className="icon"
                    style={{ background: `${item?.color}` }}
                  ></span>
                  {item?.label?.toUpperCase()}
                </p>
                <p  style={{ fontWeight: "bold" }} >{item?.value}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TooltipContent;
