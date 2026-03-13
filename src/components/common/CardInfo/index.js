import { Line } from "react-chartjs-2";
import "./style.css";
import { Icon } from "@iconify/react";

const CardInfo = (props) => {
  const { cardLists = [] } = props;
  return (
    <>
      {cardLists?.map((cartItem) => {
        const {
          name = "",
          value = "",
          className = "",
          data,
          options,
          percentage = "",
          currentStatus = "",
        } = cartItem ?? {};
        return (
          <div className={`dashboard-total-listitem`} key={name}>
            <div className="card-title">
              <p>{name}</p>
            </div>
            <div className="info">
              <div className="val-txt">
                <h3>{value}</h3>
              </div>
              <div className="chart">
                <Line data={data} options={options} />
              </div>
            </div>
            <div className="report">
              <div className="report-current-status">
                {/* <Icon icon="streamline:graph-arrow-increase"/> */}
                <p>{percentage}</p>
              </div>
              <p>{currentStatus}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CardInfo;
