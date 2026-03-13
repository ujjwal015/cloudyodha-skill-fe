import React from "react";
import Skeleton from "react-loading-skeleton";

function MultipleDonutSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: "50px" }}>
        <Skeleton width={120} height={30} />
        <Skeleton width={70} height={20} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          paddingTop: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Skeleton circle width={140} height={140} />
          <Skeleton width={100} height={20} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Skeleton circle width={140} height={140} />
          <Skeleton width={100} height={20} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Skeleton circle width={140} height={140} />
          <Skeleton width={100} height={20} />
        </div>
      </div>
    </div>
  );
}

export default MultipleDonutSkeleton;
