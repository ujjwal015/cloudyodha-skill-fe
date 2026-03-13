import { Fragment, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { TableHeader } from "./TableHeader";
import SearchInput from "../searchInput";
import { handleTrimPaste } from "../../../utils/projectHelper";
import CustomMultiSelect from "../CustomMultiSelect";
import ChipsArray from "../Chips";
import CustomPagination from "../customPagination";
import DeleteModal from "../Modal/DeleteModal";
import MyOutlinedBtn from "../newCommon/Buttons/MyOutlinedBtn";
import MultipleSelect from "../MultiSelect";

const CustomTable = (props) => {
  const {
    table,
    loading = false,
    // setLoading=false,
    pagination,
    search,
    multiSelect,
    exportOptions,
    // ismultiHeader,
    iscommonRowDataAvailable = false,
    ismultiHeader = false,
    isUpdatedMultiselectReq = false,
    section,
    // filterOptions,
    deleteMultipleData = {},
  } = props;

  const {
    isSearch,
    searchQuery,
    setSearchQuery,
    searchTitle = "",
  } = search ?? {};

  const {
    isMultiDelete = false,
    deletehandler = () => {},
    selectedRows = 0,
    // icon,
  } = deleteMultipleData;

  // const { isFilter, filters, setFilters, data, onChange } = filterOptions || {};
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);

  // Delete Modal for Selected
  const [isSelectedDelteModal, setIsSelectedDelteModal] = useState(false);

  useEffect(() => {
    setSortedData(table?.bodyData);
  }, [table?.bodyData]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...table?.bodyData].sort((a, b) => {
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
  }, [table?.bodyData, sortOrders]);

  const handleConfirmSelectedDelete = () => {
    table?.handleDeleteAllSelectedRows(() => setIsSelectedDelteModal(false));
  };

  const handleSelectedDeleteCloseModal = () => {
    setIsSelectedDelteModal(false);
  };

  const handleDeleteAllCheckBox = () => {
    setIsSelectedDelteModal(true);
  };

  return (
    <div className="custom-table">
      <div className="custom__header">
        <div className="custom__header_left">
          {isSearch && (
            <div>
              <h2>{searchTitle}</h2>
              <SearchInput
                searchQuery={searchQuery}
                handleTrimPaste={handleTrimPaste}
                setSearchQuery={setSearchQuery}
                isDisabled={search?.isDisable}
              />
            </div>
          )}

          {isMultiDelete && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                onClick={deletehandler}
                style={{
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {/* {icon} */}
                <span>
                  Delete {selectedRows}{" "}
                  {selectedRows > 1 ? "Candidates" : "Candidate"}
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="custom__header_right">
          {!isUpdatedMultiselectReq &&
            multiSelect?.isMultiSelect &&
            multiSelect?.multiSelectCategoryList?.length > 0 && (
              <div>
                {multiSelect?.multiSelectCategoryList?.map((multiItem) => {
                  return (
                    <Fragment key={multiItem?.label}>
                      <CustomMultiSelect
                        data={multiItem}
                        key={multiItem}
                        loading={loading}
                      />
                    </Fragment>
                  );
                })}
              </div>
            )}

          {isUpdatedMultiselectReq &&
            multiSelect?.isMultiSelect &&
            multiSelect?.multiSelectCategoryList?.length > 0 && (
              <div>
                {multiSelect?.multiSelectCategoryList?.map((multiItem) => {
                  return (
                    <Fragment key={multiItem?.label}>
                      <div>
                        <MultipleSelect
                          setSelectedIds={multiItem.setSelectedIds || null}
                          selectedIds={multiItem.selectedIds || []}
                          options={multiItem.assignedClientList || []}
                          handleChange={multiItem.handleChange || null}
                          label={multiItem.label || ""}
                        />
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            )}

          {(exportOptions?.isPermissions?.[1] ||
            exportOptions?.isPermissions?.[5]) &&
            exportOptions?.isExport && (
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                {exportOptions?.exportDataList?.length > 0 &&
                  exportOptions?.exportDataList?.map((exportItem) => {
                    return (
                      // <button
                      //   className="export-btn "
                      //   onClick={
                      //     loading || sortedData?.length == 0
                      //       ? undefined
                      //       : exportItem?.handleExport
                      //   }
                      //   key={exportItem?.label}
                      // >
                      //   {loading ? (
                      //     <ClipLoader size={14} color="#24273" />
                      //   ) : (
                      //     exportItem?.label
                      //   )}
                      // </button>
                      <Fragment key={exportItem?.name}>
                        <div>
                          <MyOutlinedBtn
                            variant="outlined"
                            onClick={
                              loading || sortedData?.length === 0
                                ? undefined
                                : exportItem?.handleExport
                            }
                            disabled={exportItem?.isDisable}
                            text={exportItem?.label}
                            iconLeft="f7:arrow-down-to-line"
                            loading={loading}
                          />
                        </div>
                      </Fragment>
                    );
                  })}
              </div>
            )}
        </div>
      </div>
      <div className="result-wrapper">
        <div className="table-search-filter__filter--result">
          {sortedData?.length > 0 &&
            !loading &&
            searchQuery !== "" &&
            searchQuery &&
            pagination?.count > 0 &&
            (loading ? (
              <SyncLoader color="#2ea8db" />
            ) : (
              <h3>
                <span>{sortedData?.length}</span> results found
              </h3>
            ))}
        </div>
        <ul>
          {multiSelect?.multiSelectCategoryList?.map((item) => {
            return (
              <li key={item}>
                {item?.selected?.length > 0 && (
                  <div className="table-search-filter__filter--chips">
                    {item.name}: <ChipsArray data={item} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {iscommonRowDataAvailable && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "",
          }}
        >
          <div style={{ fontSize: "small", fontWeight: "bold" }}>
            Jobrole:{" "}
            <span
              style={{
                fontWeight: "normal",
                color: "rgba(86, 94, 108, 1)",
                paddingLeft: "5px",
              }}
            >
              Retail Sales Associate
            </span>
          </div>
          <div
            style={{
              marginLeft: "30px",
              fontSize: "small",
              fontWeight: "bold",
            }}
          >
            QP Code:{" "}
            <span
              style={{
                fontWeight: "normal",
                color: "rgba(86, 94, 108, 1)",
                paddingLeft: "5px",
              }}
            >
              RAS/Q02013R
            </span>
          </div>
          <div
            style={{
              marginLeft: "30px",
              fontSize: "small",
              fontWeight: "bold",
            }}
          >
            Level:{" "}
            <span
              style={{
                fontWeight: "normal",
                color: "rgba(86, 94, 108, 1)",
                paddingLeft: "5px",
              }}
            >
              04
            </span>
          </div>
          <div
            style={{
              marginLeft: "30px",
              fontSize: "small",
              fontWeight: "bold",
            }}
          >
            Version:{" "}
            <span
              style={{
                fontWeight: "normal",
                color: "rgba(86, 94, 108, 1)",
                paddingLeft: "5px",
              }}
            >
              01
            </span>
          </div>
          <div
            style={{
              marginLeft: "30px",
              fontSize: "small",
              fontWeight: "bold",
            }}
          >
            Section:{" "}
            <span
              style={{
                fontWeight: "normal",
                color: "rgba(86, 94, 108, 1)",
                paddingLeft: "5px",
              }}
            >
              Theory
            </span>
          </div>
          <div
            style={{
              marginLeft: "30px",
              fontSize: "small",
              fontWeight: "bold",
            }}
          >
            Question Type:{" "}
            <span
              style={{
                fontWeight: "normal",
                color: "rgba(86, 94, 108, 1)",
                paddingLeft: "5px",
              }}
            >
              Objective
            </span>
          </div>
        </div>
      )}

      <div className="custom-table__container">
        <div className="table-wrapper">
          <table>
            <TableHeader
              columns={table?.headerColumn}
              sortOrders={sortOrders}
              setSortOrders={setSortOrders}
              ismultiHeader={ismultiHeader}
              section={section}
            />
            {loading ? (
              <tbody>
                <tr className="table-loading-wrapper">
                  <td colSpan="100%">
                    <div className="sync-loader-wrapper">
                      <SyncLoader color="#2ea8db" />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {sortedData?.length > 0 ? (
                  sortedData?.map((row, index, array) => (
                    <tr key={row["id"]?.value || index}>
                      {table?.headerColumn.map(
                        (column, indexColumn, arrayColumn) => {
                          const { selector } = column;
                          return (
                            <td
                              key={column.name}
                              className={column?.className ?? ""}
                              style={column?.style}
                              // onClick={
                              //   columnInfo?.action ? columnInfo?.action : () => {}
                              // }
                            >
                              {typeof selector == "function"
                                ? selector(row, index)
                                : ""}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td colSpan={table?.headerColumn.length}>
                      <img
                        width={200}
                        src={
                          "https://eastcampus.shcollege.ac.in/wp-content/themes/eastcampas-2024/assets/no-results.png"
                        }
                        alt="no-data"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
          {table?.canDeleteAllSelectedBox &&
            table?.selectedCheckBoxs?.length > 0 && (
              <div className="custom-table_multi_wrapper">
                <div className="custom_table__multi_delete">
                  <h2>
                    <span className="number_select">
                      {table?.selectedCheckBoxs?.length}
                    </span>{" "}
                    Selected
                    {table?.canDeleteAllSelectedBox && (
                      <span
                        className="rows__delete_action"
                        onClick={handleDeleteAllCheckBox}
                      >
                        Delete All
                      </span>
                    )}
                  </h2>
                  {/* <MyFilledBtn
                  text={`Download ${table?.selectedCheckBoxs?.length} File`}
                  onClick={handleDownloadCheckBox}
                /> */}
                </div>
              </div>
            )}
        </div>
      </div>
      {!loading && pagination?.isPagination && (
        <CustomPagination
          count={pagination?.count}
          totalPages={pagination?.totalPages}
          page={pagination?.page}
          limit={pagination?.limit}
          onPageChange={pagination?.onPageChange}
          onRowsPerPageChange={pagination?.onRowsPerPageChange}
        />
      )}
      <DeleteModal
        title="Delete All Selected"
        confirmDelete={
          table?.canDeleteAllSelectedBox ? handleConfirmSelectedDelete : null
        }
        open={isSelectedDelteModal}
        handleCloseModal={handleSelectedDeleteCloseModal}
      />
    </div>
  );
};
export default CustomTable;
