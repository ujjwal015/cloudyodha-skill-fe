import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader ,ClipLoader} from "react-spinners";
import { Tooltip } from "@mui/material";
import * as XLSX from "xlsx";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { qbManagementSelector } from "../../../../../redux/slicers/superAdmin/questionBankSlice";
import {
  deleteSingleQbFormApi,
  getSpecificNOSApi,
} from "../../../../../api/superAdminApi/questionBank";
import { ReactComponent as ArrowLeft } from "./../../../../../assets/icons/chevron-left.svg";

const UserManagementList = () => {
  const initialFormValues = {
    F_status: "",
    from: "",
    to: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { nosList, specificNosDetails } = useSelector(qbManagementSelector);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);

  // conditional rendering
  const { renderDecider = {} } = useSelector(authSelector);
  const [renderDetails, setRenderDetails] = useState();
  const [deletePermitted, setDeletePermitted] = useState();
  const [editPermitted, setEditPermitted] = useState();
  const [createPermitted, setCreatePermitted] = useState();
  const params = useParams();
  const [nosId, setNosId] = useState();

  const getList = (id) => {
    dispatch(getSpecificNOSApi(setLoading, params.id, searchQuery));
  };

  useEffect(() => {
    if (renderDecider.length > 0) {
      setRenderDetails(renderDecider[8].userManagement);
      setDeletePermitted(renderDecider[8].userManagement?.delete);
      setEditPermitted(renderDecider[8].userManagement?.edit);
      setCreatePermitted(renderDecider[8].userManagement?.create);
    }
  }, [renderDecider.length]);

  useEffect(() => {
    if (params?.id) setNosId(params.id);
    getList(params.id);
  }, [page, limit]);

  useEffect(() => {
    setSortedData(specificNosDetails);
    setTotalPagesUser(totalPages);
  }, [nosList, totalPages]);

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...specificNosDetails].sort((a, b) => {
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
  }, [nosList, sortOrders]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    if (searchQuery !== "") {
      setLoading(true);
      dispatch(
        getSpecificNOSApi(setLoading, params.id, searchQuery, setTotalPages)
      );
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setLoading(true);
      dispatch(getSpecificNOSApi(setLoading, params.id, searchQuery));
    }
    setSearchQuery(value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };

  const clientData = (examType) => {
    const exportData = 
     examType==='practical'
     ?(specificNosDetails[0]?.nosData?.map((item,index) => {
      return [
       index+1,
       item?.NOS || "NA",
       item?.qpCode || "NA",
       item?.level || "NA",
       item?.version || "NA",
       item?.outOf || "NA",
       item?.viva || "0",
       item?.practical || "0",
       item?.vivaNOQ || "0",
       item?.practicalNOQ || "0",
       item?.vivaMPQ || "0",
       item?.practicalMPQ || "0",
       item?.vivaTM || "0",
       item?.practicalTM || "0",
      ];
    }))
    : (specificNosDetails[0]?.nosData?.map((item,index) => {
      return [
       index+1,
       item?.NOS || "NA",
       item?.qpCode || "NA",
       item?.level || "NA",
       item?.version || "NA",
       item?.outOf || "NA",
       item?.theory || "NA",
       item?.easyNOQ || "0",
       item?.mediumNOQ || "0",
       item?.difficultNOQ || "0",
       item?.totalNOQ || "0",
       item?.easyMPQ || "0",
       item?.mediumMPQ || "0",
       item?.difficultMPQ || "0",
       item?.totalMPQ || "0",
       item?.easyTMPQ || "0",
       item?.mediumTMPQ || "0",
       item?.difficultTMPQ || "0",
       item?.totalTMPQ || "0",
      ];
    }))

    return exportData;
  };
  
  const colToMerge=(examType)=>{
    if(examType==='practical'){
      return [
        { s: { r: 0, c: 8 }, e: { r: 0, c: 9 } },
        { s: { r: 0, c: 10 }, e: { r: 0, c: 11 } },
        { s: { r: 0, c: 12 }, e: { r: 0, c: 13 } }, 
      ];
    }else{
      return [
        { s: { r: 0, c: 7 }, e: { r: 0, c: 10 } },
        { s: { r: 0, c: 11 }, e: { r: 0, c: 14 } },
        { s: { r: 0, c: 15 }, e: { r: 0, c: 18 } }, 
      ];
    }
  }

  const handleExport = () => {

    const examType=params?.section;
    const data = [
      ...getColumns(examType),
      ...clientData(examType)
    ];
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();

    // Add the worksheet to the workbook
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    worksheet['!merges'] = colToMerge(examType);

    // Convert the workbook to an array buffer
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TableData');
    XLSX.writeFile(workbook, 'NOS table.xlsx');

  };


  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    const len = nosList?.length;
    dispatch(
      deleteSingleQbFormApi(setLoading, actionId, len, getList, setDeleteModal)
    );
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const deleteHandler = () => {
    setDeleteModal(true);
    setActionOpen(false);
  };

  return (
    <div className="main-content">
      <div className="title">
        <div className="back_button_wrapper">
          <ArrowLeft onClick={() => navigate(-1)} />
          <h1>NOS Table</h1>
        </div>
        <div className="subadmin-btn">
        <button
          className="export-btn"
          onClick={
            loading || sortedData?.length === 0 ? undefined : handleExport
          }
        >
          {loading ? <ClipLoader size={14} color="#24273" /> : "Export"}
        </button>
      </div>
      </div>
      <div className="subadmin-table">
        <div className="table-wrapper">
          {params?.section === "Theory" ? (
            <>
              <table className="NOS_table">
                <thead>
                  <tr>
                    <td colSpan="7" className="blank_data"></td>
                    <th
                      colSpan="4"
                      scope="colgroup"
                      style={{ backgroundColor: "#f8f4f4" }}
                    >
                      No of Questions
                    </th>
                    <th
                      colSpan="4"
                      scope="colgroup"
                      style={{ backgroundColor: "#f2fafb" }}
                    >
                      Marks per Question
                    </th>
                    <th
                      colSpan="4"
                      scope="colgroup"
                      style={{ backgroundColor: "#fef5f4" }}
                    >
                      Total Marks
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">NOS</th>
                    <th scope="col">QP Code</th>
                    <th scope="col">Level</th>
                    <th scope="col">Version</th>
                    <th scope="col">Out Of</th>
                    <th scope="col">Theory</th>
                    <th scope="col">Easy </th>
                    <th scope="col">Medium </th>
                    <th scope="col">Difficult</th>
                    <th scope="col">Total</th>
                    <th scope="col">Easy </th>
                    <th scope="col">Medium </th>
                    <th scope="col">Difficult</th>
                    <th scope="col">Total</th>
                    <th scope="col">Easy </th>
                    <th scope="col">Medium </th>
                    <th scope="col">Difficult</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                {loading ? (
                  <tbody>
                    <tr className="table-loading-wrapper">
                      <td className="sync-loader-wrapper">
                        <PropagateLoader color="#2ea8db" />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {specificNosDetails?.length > 0 ? (
                      specificNosDetails[0]?.nosData.map((item, index) => (
                        <tr key={item?._id}>
                          <td>{(page - 1) * limit + (index + 1)}</td>
                          <td>
                            {item?.NOS?.length > 15 ? (
                              <Tooltip title={item?.NOS || "NA"} arrow>
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                    maxWidth: "200px", // Set a maximum width for the cell
                                  }}
                                >
                                  {item?.NOS || "NA"}
                                </div>
                              </Tooltip>
                            ) : (
                              <div>{item?.NOS || "NA"}</div>
                            )}
                          </td>
                          <td>{item?.qpCode}</td>
                          <td>{item?.level}</td>
                          <td>{item?.version}</td>
                          <td>{item?.outOf}</td>
                          <td>{item?.theory}</td>
                          <td>{item?.easyNOQ}</td>
                          <td>{item?.mediumNOQ}</td>
                          <td>{item?.difficultNOQ}</td>
                          <td>{item?.totalNOQ}</td>
                          <td>{item?.easyMPQ}</td>
                          <td>{item?.mediumMPQ}</td>
                          <td>{item?.difficultMPQ}</td>
                          <td>{item?.totalMPQ}</td>
                          <td>{item?.easyTMPQ}</td>
                          <td>{item?.mediumTMPQ}</td>
                          <td>{item?.difficultTMPQ}</td>
                          <td>{item?.totalTMPQ}</td>

                          {/* <td>
                        <div>
                          <ActionDropdown
                            actionOpen={actionOpen}
                            setActionOpen={setActionOpen}
                            deleteHandler={deleteHandler}
                            editBtnHandler={editBtnHandler}
                            MoreBtnHandler={MoreBtnHandler}
                            id={item?._id}
                            actionId={actionId}
                          />
                        </div>
                      </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr className="no-list-table">
                        <td>
                          <p>No Results Found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </>
          ) : (
            <>
              <table className="NOS_table">
                <thead>
                  <tr>
                    <td colSpan="8" className="blank_data"></td>
                    <th
                      colSpan="2"
                      scope="colgroup"
                      style={{ backgroundColor: "#f8f4f4" }}
                    >
                      No of Questions
                    </th>
                    <th
                      colSpan="2"
                      scope="colgroup"
                      style={{ backgroundColor: "#f2fafb" }}
                    >
                      Marks per Question
                    </th>
                    <th
                      colSpan="2"
                      scope="colgroup"
                      style={{ backgroundColor: "#fef5f4" }}
                    >
                      Total Marks
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">NOS</th>
                    <th scope="col">QP Code</th>
                    <th scope="col">Level</th>
                    <th scope="col">Version</th>
                    <th scope="col">Out Of</th>
                    <th scope="col">Viva</th>
                    <th scope="col">Practical</th>
                    <th scope="col">Viva</th>
                    <th scope="col">Practical</th>
                    <th scope="col">Viva</th>
                    <th scope="col">Practical</th>
                    <th scope="col">Viva</th>
                    <th scope="col">Practical</th>
                  </tr>
                </thead>
                {loading ? (
                  <tbody>
                    <tr className="table-loading-wrapper">
                      <td className="sync-loader-wrapper">
                        <PropagateLoader color="#2ea8db" />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {specificNosDetails?.length > 0 ? (
                      specificNosDetails[0]?.nosData.map((item, index) => (
                        <tr key={item?._id}>
                          <td>{(page - 1) * limit + (index + 1)}</td>
                          <td>
                            {item?.NOS?.length > 15 ? (
                              <Tooltip title={item?.NOS || "NA"} arrow>
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                    maxWidth: "200px", // Set a maximum width for the cell
                                  }}
                                >
                                  {item?.NOS || "NA"}
                                </div>
                              </Tooltip>
                            ) : (
                              <div>{item?.NOS || "NA"}</div>
                            )}
                          </td>
                          <td>{item?.qpCode}</td>
                          <td>{item?.level}</td>
                          <td>{item?.version}</td>
                          <td>{item?.outOf}</td>
                          <td>{item?.viva}</td>
                          <td>{item?.practical}</td>
                          <td>{item?.vivaNOQ}</td>
                          <td>{item?.practicalNOQ}</td>
                          <td>{item?.vivaMPQ}</td>
                          <td>{item?.practicalMPQ}</td>
                          <td>{item?.vivaTM}</td>
                          <td>{item?.practicalTM}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="no-list-table">
                        <td>
                          <p>No Results Found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </>
          )}
        </div>
      </div>
      <DeleteModal
        title="Delete Question Bank Form"
        confirmDelete={confirmDelete}
        open={deleteModal}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default UserManagementList;

const getColumns=(exam)=>{
  //write the name of the column in the first column of all columns to be merged
  if(exam ==='Theory'){
    return [
      ["","","","","","","","NO OF QUESTIONS","","","","MARKS PER QUESTION","","","","TOTAL MARKS","","", ""],
      ["S.NO", "NOS", "QP CODE", "LEVEL", "VERSION","OUT OF","THEORY", "EASY", "MEDIUM", "DEFFCULT", "TOTAL","EASY", "MEDIUM", "DEFFCULT", "TOTAL","EASY", "MEDIUM", "DEFFCULT", "TOTAL"],
    ]
  }else{
    return [
      ["", "", "", "", "", "", "", "", "NO OF QUESTIONS", "", "MARKS PER QUESTION", "", "TOTAL MARKS", ""],
      ["S.NO", "NOS", "QP CODE", "LEVEL", "VERSION","OUT OF","VIVA", "PRACTICAL", "VIVA", "PRACTICAL", "VIVA", "PRACTICAL", "VIVA", "PRACTICAL"],
    ]
  }
}
