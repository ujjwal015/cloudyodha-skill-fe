import { Skeleton } from "@mui/material";
import React from "react";

function WidgetSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "auto" }}>
      <div className="card-title">
        <div>
          <Skeleton width={30} height={30} />
          <div className="val-txt">
            <Skeleton width={30} height={30} />
          </div>
        </div>
        <div className="chart" style={{ width: 80 }}>
          <Skeleton width={60} height={60} />
        </div>
      </div>
      <div className="info"></div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Skeleton width={120} height={20} />
      </div>
    </div>
  );
}

export default WidgetSkeleton;
