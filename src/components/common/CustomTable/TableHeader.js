import React from "react";
import { ReactComponent as Uparrow } from "../../../assets/images/common/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../../assets/images/common/down-arrow.svg";
import  "./style.css";
import "../../common/table/style.css";

export function TableHeader({ columns, sortOrders, setSortOrders, ismultiHeader=false,section }) {
  const handleSortClick = (columnName, sort) => {
    // e.stopPropagation();
    // const sortOrder = sortOrders[columnName] === "asc" ? "desc" : "asc";
    setSortOrders({ [columnName]: sort });
  };

  return (
    <thead>
      {ismultiHeader && (
        <tr>
          <td
            colSpan={`${section === "theory" ? "8" : "9"}`}
            className="blank_data"
            style={{ backgroundColor: "white" }}
          ></td>
          <th
            colSpan={`${section === "theory" ? "4" : "2"}`}
            scope="colgroup"
            style={{ backgroundColor: "#f8f4f4", textAlign: "center" }}
          >
            No of Questions
          </th>
          <th
            colSpan={`${section === "theory" ? "4" : "2"}`}
            scope="colgroup"
            style={{ backgroundColor: "#f2fafb", textAlign: "center" }}
          >
            Marks per Question
          </th>
          <th
            colSpan={`${section === "theory" ? "4" : "2"}`}
            scope="colgroup"
            style={{ backgroundColor: "#fef5f4", textAlign: "center" }}
          >
            Total Marks
          </th>
        </tr>
      )}
      <tr>
        {columns?.map(({ name, label, sorting = false }) => {
          return (
            <th key={name}>
              <div className="custom-title">
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
  