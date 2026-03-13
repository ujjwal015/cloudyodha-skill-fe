import { Skeleton } from "@mui/material";
import React from "react";

function HorizontalBarChartSkeleton() {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"flex-start",paddingBottom:"20px"}}>
      <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between", gap:"50px"}}>
        <div>
          <Skeleton width={150} height={40} />
          <Skeleton width={50} height={50} />
        </div>
        <div className="line-chart-options">
          <Skeleton width={70} height={30} />
        </div>
      </div>
      <div>
        <Skeleton width={430} height={200} />
      </div>
      {/* <Bar options={options} data={data} /> */}
    </div>
  );
}

export default HorizontalBarChartSkeleton;
