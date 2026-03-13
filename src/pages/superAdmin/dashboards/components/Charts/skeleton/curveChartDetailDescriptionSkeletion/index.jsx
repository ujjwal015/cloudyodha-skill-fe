import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function CurveChartDetailsDescriptionSkeleton() {
  return (
    <div className="languageDistrubution-overview_PieChart">
      <div className="chart-card-header">
        <div>
          <Skeleton width={190} height={30} />
          <Skeleton width={80} height={20} />
        </div>
        <Skeleton width={60} height={30} />
      </div>
      <div style={{display:"flex",justifyContent:"center"}}>
        <Skeleton circle width={200} height={200} />
      </div>
    </div>
  );
}

export default CurveChartDetailsDescriptionSkeleton;
