import React, { useEffect, useState } from "react";
import { ClipLoader, SyncLoader } from "react-spinners";
import { TableHeader } from "./TableHeader";
import SearchInput from "../searchInput";
import { handleTrimPaste } from "../../../utils/projectHelper";
import CustomMultiSelect from "../CustomMultiSelect";
import ChipsArray from "../Chips";
import CustomPagination from "../customPagination";
import DeleteModal from "../Modal/DeleteModal";
import MyFilledBtn from "../newCommon/Buttons/MyFilledBtn";
import MyOutlinedBtn from "../newCommon/Buttons/MyOutlinedBtn";
import SelectInput from "../SelectInput";
const CustomTable = (props) => {
  const {
    table,
    loading = false,
    setLoading,
    pagination,
    search,
    multiSelect,
    exportOptions,
    headerRequired = true,
    countDetails,
    selectInputDetails={}
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

  const {currentOption=[],onClick,dropDownOptions,isDropdownSelectRequired=false}=selectInputDetails;

  const {isCountReq=false,countValue}=countDetails ?? {};
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

  const handleConfirmSelectedDelete = () => {
    //
  };

  const handleSelectedDeleteCloseModal = () => {
    setIsSelectedDelteModal(false);
  };

  const handleDeleteAllCheckBox = () => {
    setIsSelectedDelteModal(true);
  };

  const handleDownloadCheckBox = () => {
    //
  };

  return (
    <div className="custom-table">
      <div className="custom__header">
        <div className="custom__header_left">
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"flex-start"}}>
          <h2 style={{alignSelf:"flex-start",marginBottom:"10px"}}>{searchTitle}</h2>
          {isCountReq && <h1 style={{fontWeight:"bold",fontSize:"large"}}>{countValue}</h1>}
          </div>
       
          {isSearch && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}>
              <SearchInput
                searchQuery={searchQuery}
                handleTrimPaste={handleTrimPaste}
                setSearchQuery={setSearchQuery}
                apiHandler={apiHandler}
                setLoading={setLoading}
                page={pagination?.page}
                limit={pagination?.limit}
                setTotalPages={pagination?.setTotalPages}
                endAdornment={endAdornment}
                handleSearchSubmit={handleSearchSubmit}
                isDisabled={search?.isDisable}
                style={{ border: "1px solid black" }}
              />
            </div>
          )}
        </div>
        <div className="custom__header_right">
          {multiSelect?.isMultiSelect && multiSelect?.multiSelectCategoryList?.length > 0 && (
            <div>
              {multiSelect?.multiSelectCategoryList?.map((multiItem) => {
                return <CustomMultiSelect data={multiItem} key={multiItem} loading={loading} />;
              })}
            </div>
          )}
          {(isDropdownSelectRequired ||false) && <SelectInput
                  name="inputselect"
                  placeHolder={"Select"}
                  value={currentOption}
                  handleChange={onClick}
                  options={dropDownOptions}
                  loading={false}
                  width={70}
                />}
          {(exportOptions?.isPermissions?.[1] || exportOptions?.isPermissions?.[5]) && exportOptions?.isExport && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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

                    <div>
                      <MyOutlinedBtn
                        variant="outlined"
                        onClick={loading || sortedData?.length == 0 ? undefined : exportItem?.handleExport}
                        disabled={exportItem?.isDisable}
                        text={exportItem?.label}
                        iconLeft="f7:arrow-up-to-line"
                        loading={loading}
                      />
                    </div>
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
                <span>{pagination?.count}</span> results found
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
      <div className="custom-table__container">
        <div className="table-wrapper">
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
                {sortedData?.length > 0 ?(
                  sortedData?.map((row, index, array) => (
                    <tr key={row["id"]?.value || index}>
                      {table?.headerColumn.map((column, indexColumn, arrayColumn) => {
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
                        alt="alt"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
          {table?.canDeleteAllSelectedBox && table?.selectedCheckBoxs?.length > 0 && (
            <div className="custom-table_multi_wrapper">
              <div className="custom_table__multi_delete">
                <h2>
                  <span className="number_select">{table?.selectedCheckBoxs?.length}</span> Selected
                  {table?.canDeleteAllSelectedBox && (
                    <span className="rows__delete_action" onClick={handleDeleteAllCheckBox}>
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
        confirmDelete={table?.canDeleteAllSelectedBox ? handleConfirmSelectedDelete : null}
        open={isSelectedDelteModal}
        handleCloseModal={handleSelectedDeleteCloseModal}
      />
    </div>
  );
};
export default CustomTable;
