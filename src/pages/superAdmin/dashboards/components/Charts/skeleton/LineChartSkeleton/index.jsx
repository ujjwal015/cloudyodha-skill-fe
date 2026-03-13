import { Skeleton } from "@mui/material";
import React from "react";

function LineChartSkeleton() {
  return (
    <div className="card">
      <div className="card-header">
        <Skeleton width={120} height={40} />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="legend">
            <div className="legend-item">
              <Skeleton width={40} height={30} />
            </div>
            <div className="legend-item">
              <Skeleton width={40} height={30} />
            </div>
            <div className="legend-item">
              <Skeleton width={40} height={30} />
            </div>
          </div>
          <div className="select-container">
            <Skeleton width={70} height={40} />
          </div>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center", paddingBottom:"20px"}}>
          <Skeleton width={500} height={300} />
      </div>
    </div>
  );
}

export default LineChartSkeleton;
