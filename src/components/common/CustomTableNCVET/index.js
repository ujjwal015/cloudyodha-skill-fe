import React, { useEffect, useState } from "react";
import { ClipLoader, SyncLoader } from "react-spinners";
import { TableHeader } from "./TableHeader";

const CustomTableNCVET = (props) => {
  const {
    table,
    loading = false,
    setLoading,
    pagination,
    search,
    multiSelect,
    exportOptions,
    headerRequired = true,
  } = props;

  const {
    isSearch,
    searchQuery,
    setSearchQuery,
    endAdornment,
    apiHandler,
    searchTitle = "",
    handleSearchSubmit,
    isPermissions,
  } = search ?? {};

  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState();

  // Delete Modal for Selected
  const [isSelectedDelteModal, setIsSelectedDelteModal] = useState(false);

  useEffect(() => {
    setSortedData(table?.bodyData);
  }, [table?.bodyData]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find((columnName) => sortOrders[columnName] !== null);
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...table?.bodyData].sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
          } else {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
          }
        });

        setSortedData(sortedData);
      }
    };

    sortData();
  }, [table?.bodyData, sortOrders]);

  return (
    <div className="custom-NCVET-jobRoleClientWise-tabl">
      <div>
        <div>
          <table>
            {headerRequired && (
              <TableHeader columns={table?.headerColumn} sortOrders={sortOrders} setSortOrders={setSortOrders} />
            )}
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
                {sortedData?.length > 0 ? (
                  sortedData?.map((row, index, array) => (
                    <tr key={row["id"]?.value || index}>
                      {table?.headerColumn.map((column, indexColumn, arrayColumn) => {
                        const { selector } = column;
                        return (
                          <td
                            key={column.name}
                            className={column?.className ?? ""}
                            // style={column?.style}
                            style={{ borderBottom: "1px solid #ddd", width: "calc(100% / 3)", fontSize: "small" }}
                            // onClick={
                            //   columnInfo?.action ? columnInfo?.action : () => {}
                            // }
                          >
                            {typeof selector == "function" ? selector(row, index) : ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colspan={table?.headerColumn.length} style={{ textAlign: "center" }}>
                      <img
                        width={200}
                        src={
                          "https://eastcampus.shcollege.ac.in/wp-content/themes/eastcampas-2024/assets/no-results.png"
                        }
                      />
                    </td>
                  </tr>
                  // <></>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
export default CustomTableNCVET;
