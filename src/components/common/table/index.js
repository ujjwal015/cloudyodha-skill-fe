import React, { useEffect, useState } from "react";
import "./style.css";
import { ReactComponent as Uparrow } from "../../../assets/images/common/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../../assets/images/common/down-arrow.svg";
import { SyncLoader } from "react-spinners";

export function TableHeader({ columns, sortOrders, setSortOrders }) {
  const handleSortClick = (columnName, sort) => {
    // e.stopPropagation();
    // const sortOrder = sortOrders[columnName] === "asc" ? "desc" : "asc";
    setSortOrders({ [columnName]: sort });
  };

  return (
    <thead>
      <tr>
        {columns?.map(({ name, label, sorting = false }) => {
          return (
            <th key={name}>
              <div className="subadmin-title">
                <p>{label}</p>
                {sorting && (
                  <div
                    className="title-arrow"
                    // onClick={() => handleSortClick(name)}
                  >
                    {sortOrders[name] === "asc" && (
                      <button
                        className="up-arrow"
                        onClick={(e) => handleSortClick(name, "desc")}
                      >
                        <Uparrow />
                      </button>
                    )}
                    {sortOrders[name] !== "asc" && (
                      <button
                        className="up-arrow grayed-out"
                        onClick={(e) => handleSortClick(name, "asc")}
                      >
                        <Uparrow />
                      </button>
                    )}
                    {sortOrders[name] === "desc" && (
                      <button
                        className="down-arrow"
                        onClick={(e) => handleSortClick(name, "asc")}
                      >
                        <Downarrow />
                      </button>
                    )}
                    {sortOrders[name] !== "desc" && (
                      <button
                        className="down-arrow grayed-out"
                        onClick={(e) => handleSortClick(name, "desc")}
                      >
                        <Downarrow />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

const Table = ({ columns, data, loading }) => {
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState(data);
  useEffect(() => {
    setSortedData(data);
  }, [data]);
  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...data].sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc"
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          } else {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
          }
        });
        setSortedData(sortedData);
      }
    };

    sortData();
  }, [data, sortOrders]);

  return (
    <div className="table-wrapper">
      <table  le>
        <TableHeader
          columns={columns}
          sortOrders={sortOrders}
          setSortOrders={setSortOrders}
        />
        {loading ? (
          <tbody>
            <tr className="table-loading-wrapper">
              <div className="sync-loader-wrapper">
                <SyncLoader color="#2ea8db" />
              </div>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {sortedData.map((row, index, array) => (
              <tr key={row["id"]?.value}>
                {columns.map((column, indexColumn, arrayColumn) => {
                  const columnInfo = row[column.name] || {};
                  return (
                    <td
                      key={column.name}
                      className={columnInfo?.className ?? ""}
                      style={columnInfo?.style}
                      onClick={
                        columnInfo?.action ? columnInfo?.action : () => {}
                      }
                    >
                      {columnInfo?.value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};
export default Table;
