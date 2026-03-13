import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { TableHeader } from "../../../../../../components/common/CustomTableForNCEVT/TableHeader";
function TableSkeleton() {
  return (
    <div className="custom-table">
      <div className="custom__header">
        <div className="custom__header_left">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Skeleton width={200} height={40} />
            <Skeleton width={120} height={30} />
          </div>
          <div
            style={{
              display:"flex",
              flexDirection:"row",
              justifyContent:"space-between",
              alignItems:"baseline",
            }}
          >
          </div>
        </div>
      </div>

      <div className="custom-table__container">
        <div className="table-wrapper">
          <table>
            <tbody>
              <tr>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
                <td>
                  <Skeleton width={70} height={20} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style={{marginTop:"30px",display:"flex",justifyContent:"flex-end"}}>
      <Skeleton width={120} height={30} />
      </div>
    </div>
  );
}

export default TableSkeleton;
