import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function CurveSkeletonCircle() {
  return (
    <div
      className="time-spent_pieChart"
      style={{ gridColumn: 1 / 3, width: "auto", height: "auto" }}
    >
      <div
        className="chart-card-header"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Skeleton width={70} height={20} />
        {/* {totalAssessedApplicants && ( */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Skeleton width={50} height={20} />
        </div>
        {/* )} */}
        <Skeleton width={80} height={20} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom:"10px"
        }}
      >
        <Skeleton circle width={250} height={250} />
      </div>

      <div
        className="time-spent_pieChart__footer"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Skeleton width={150} height={20} />
      </div>
    </div>
  );
}

export default CurveSkeletonCircle;
