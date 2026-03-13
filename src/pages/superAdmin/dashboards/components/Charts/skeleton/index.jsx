import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function CurveChartSkeleton() {
  return (
    <div className="SectorWiseOverviewAreaChart">
      <div className="SectorWiseOverviewAreaChart__header">
        <Skeleton width={80} height={30} style={{ marginTop: "10px" }} />
        <div className="SectorWiseOverviewAreaChart__legend">
          {[1, 2, 3]?.map((item, idx) => (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span></span>
                <div>
                  <Skeleton
                    width={30}
                    height={20}
                    style={{ marginTop: "10px" }}
                  />
                  <Skeleton
                    width={50}
                    height={20}
                    style={{ marginTop: "10px" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Skeleton width={60} height={40} style={{ marginTop: "10px" }} />
      </div>
      <Skeleton width={430} height={160} />
    </div>
  );
}

export default CurveChartSkeleton;
