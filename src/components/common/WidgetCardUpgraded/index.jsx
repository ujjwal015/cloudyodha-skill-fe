import { Line } from "react-chartjs-2";
import "./style.css";
import { Icon } from "@iconify/react";

const WidgetCardUpgraded = (props) => {
  const {
    name = "",
    value = "",
    className = "",
    data,
    options,
    percentage = "",
    currentStatus = "",
    ReactComponent,
    totalCount = 0,
    growthStatus = false,
    linkText = "",
    handleRoute,
    isPermission = false,
    isLinkActive = false,
    isTodoListReq = false,
  } = props?.widgetsData;
  return (
    <>
      <div className="widget-container">
        <div className="widget-first-section">
          <div className="widget-text-section">
            <h1 style={{ fontSize: "1rem", fontWeight: "bold" }}>{totalCount}</h1>
            <h4 style={{ color: "rgba(63, 66, 84, 0.7)", fontSize: "0.7rem" }}>{name}</h4>
          </div>
          <div className="widget-svg-section">
            <ReactComponent />
          </div>
        </div>
        <div className="widget-second-section">
          {isLinkActive && (
            <Icon
              style={{
                color: growthStatus ? "rgba(25, 117, 255, 1)" : "rgba(244, 29, 29, 1)", // Example styles based on true/false
                transform: !growthStatus && "rotate(90deg)",
              }}
              icon="radix-icons:arrow-top-right"
            />
          )}
          {isLinkActive && (
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: "bold",
                color: growthStatus ? "rgba(25, 117, 255, 1)" : "rgba(244, 29, 29, 1)",
                textDecoration: "underline",
                paddingLeft: "5px",
                cursor: isPermission ? "pointer" : "not-allowed",
              }}
              onClick={handleRoute}>
              {linkText}
            </p>
          )}
          {isLinkActive && isTodoListReq && (
            <p style={{ color: "rgba(144, 149, 160, 1)", fontSize: "0.7rem", paddingLeft: "5px" }}>To-do List</p>
          )}
        </div>
      </div>
    </>
  );
};

export default WidgetCardUpgraded;
