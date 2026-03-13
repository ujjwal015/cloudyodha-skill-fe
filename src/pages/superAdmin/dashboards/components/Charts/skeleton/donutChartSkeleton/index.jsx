import "./QuestionAnalyticsSkeleton.css";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function DonutChartSkeletonWithDescription() {
  return (
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
            <Skeleton width={150} height={40} />

            <div>
              <Skeleton width={90} height={30} />
            </div>
          </div>
        </div>
        <Skeleton width={60} height={30} />
      </div>
      <div className="LeadsAnalyticsDoughnutChart__chart-container">
        <div className="chart-wrapper">
          <Skeleton circle width={190} height={190} />
        </div>
        <div>
          <Skeleton width={100} height={30} />
          <Skeleton width={100} height={30} />
          <Skeleton width={100} height={30} />
          <Skeleton width={100} height={30} />
        </div>
      </div>
    </div>
  );
}

export default DonutChartSkeletonWithDescription;
