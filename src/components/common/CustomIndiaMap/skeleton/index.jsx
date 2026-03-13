import { Skeleton } from "@mui/material";
import React from "react";

function IndiaMapSkeleton() {
  return (
    <div className="LeadsAnalyticsDoughnutChart">
      <div
        className="india-map-chart-location__header"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Skeleton width={140} height={50} />
          <Skeleton width={90} height={40} />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            marginTop: 5,
            width: "50%",
          }}
        >
          <Skeleton width={50} height={40} />
          <Skeleton width={50} height={40} />
          <Skeleton width={50} height={40} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Skeleton width={300} height={500} />
      </div>
    </div>
  );
}

export default IndiaMapSkeleton;
