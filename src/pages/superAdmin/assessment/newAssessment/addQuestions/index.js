import React, { useEffect, useState } from "react";
import "./../style.css";

import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useNavigate, useParams } from "react-router-dom";
import {
  SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE,
  SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE,
  SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
  SUPER_ADMIN_CREATE_ASSESSMENT_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";

import { ReactComponent as Uparrow } from "../../../../../assets/images/common/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../../../../assets/images/common/down-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import { ReactComponent as SearchIcon } from "../../../../../assets/icons/search-icon.svg";
import { SyncLoader, PulseLoader } from "react-spinners";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  getAssessmentDetailApi,
  getSelectionQuestionApi,
} from "../../../../../api/superAdminApi/assessment";
import { assessmentSelector } from "../../../../../redux/slicers/superAdmin/assessmentSlice";

import CustomTablePagination from "../../../../../components/common/customPagination";
import { TableHeader } from "../../../../../components/common/table";

const SelectQuestions = ({ setActiveStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortOrders, setSortOrders] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { assessmentId = "" } = useParams();
  const { questionBankList = [], singleAssessmentDetail = {} } =
    useSelector(assessmentSelector);

  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const JOBROLE = singleAssessmentDetail?.jobRole;

  useEffect(() => {
    setActiveStep(1);
    dispatch(getAssessmentDetailApi(assessmentId, getQuestionList));
  }, []);

  const getQuestionList = (jobRole) => {
    dispatch(
      getSelectionQuestionApi(
        setLoading,
        jobRole ?? JOBROLE,
        page,
        limit,
        "",
        setTotalPages
      )
    );
  };

  useEffect(() => {
    setSortedData(questionBankList);
  }, [questionBankList]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(
      getSelectionQuestionApi(
        setLoading,
        JOBROLE,
        nxtPage,
        limit,
        searchQuery,
        setTotalPages
      )
    );
  };

  useEffect(() => {
    const sortData = () => {
      const sortColumn = Object.keys(sortOrders).find(
        (columnName) => sortOrders[columnName] !== null
      );
      if (sortColumn) {
        const sortOrder = sortOrders[sortColumn];
        const sortedData = [...questionBankList]?.sort((a, b) => {
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
  }, [questionBankList, sortOrders]);
  const newData = questionBankList.map((item, index) => {
    const newItem = [];
    newItem["id"] = {
      value: index + 1,
    };
    newItem["userId"] = {
      value: 30100 + index,
    };
    newItem["questionBankId"] = {
      value: item?.questionBankId,
    };
    // newItem["userType"] = {
    //   value: getUserType(item?.userType),
    // };
    newItem["jobRole"] = {
      value: item?.jobRole,
    };
    newItem["jobLevel"] = {
      value: item?.jobLevel,
    };
    newItem["code"] = {
      value: item?.code,
    };
    newItem["sector"] = {
      value: item?.sector,
    };
    newItem["subSector"] = {
      value: item?.subSector,
    };
    newItem["schemeName"] = {
      value: item?.schemeName,
    };
    newItem["schemeCode"] = {
      value: item.schemeCode,
    };
    newItem["nos"] = {
      value: item.nos,
    };
    newItem["nosCode"] = {
      value: item.nosCode,
    };
    newItem["theoryMarks"] = {
      value: item.theoryMarks,
    };
    newItem["practicalMarks"] = {
      value: item.practicalMarks,
    };
    newItem["status"] = {
      value: "",
      // statusLoading && id == item._id ? (
      //   <PulseLoader size="10px" color="#0bbbfe" />
      // ) : (
      //   <FormSwitch
      //     value={item.status == "active" ? true : false}
      //     onChange={(e) => handleStatusChange(e, item?._id)}
      //   />
      // ),
    };
    return newItem;
  });

  const handleQuestionPreview = (id) => {
    navigate(
      `${SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE}/${assessmentId}/${id}`
    );
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value == "") {
      getQuestionList();
    }
    setSearchQuery(value);
  };

  const handleSearch = () => {
    if (searchQuery !== "")
      dispatch(
        getSelectionQuestionApi(
          setLoading,
          JOBROLE,
          1,
          limit,
          searchQuery,
          setTotalPages
        )
      );
    setPage(1);
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getSelectionQuestionApi(
        setLoading,
        JOBROLE,
        1,
        event.target.value,
        searchQuery,
        setTotalPages
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <div className="main-container assessment-page">
      <div className="title">
        <div className="title-text">
          <h1> Select Questions</h1>
        </div>
        <div className="view-list-btn">
          <button
            className="view-list-btn-text"
            onClick={() => navigate(SUPER_ADMIN_ASSESSMENT_LIST_PAGE)}
          >
            <ListOutlinedIcon
              sx={{ fontSize: "20px", color: "#FFFFFF", mr: 1 }}
            />
            View List
          </button>
        </div>
      </div>
      <div className="subadmin-table">
        <div className="subadmin-header">
          <div className="search-input">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search"
              style={{ background: "#F8F8F8" }}
              onChange={handleChange}
            />
            <span
              className={`${searchQuery == "" ? "disabled" : ""} search-icon`}
              onClick={handleSearch}
            >
              <SearchIcon />
            </span>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
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
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr key={item?._id}>
                      <td>{index + 1}</td>
                      <td>{item?.questionBankId}</td>
                      <td>{item?.jobRole}</td>
                      <td>{item?.jobLevel}</td>
                      <td>{item?.code}</td>
                      <td>{item?.sector}</td>
                      <td>{item?.subSector}</td>
                      <td>{item.schemeName ?item?.schemeName: "NA"}</td>
                      <td>{item?.questionType}</td>
                      <td>{item?.nos}</td>
                      <td>{item?.nosCode}</td>
                      <td>
                        <div
                          className="preview-btn"
                          onClick={() => {
                            handleQuestionPreview(item?._id);
                          }}
                        >
                          <VisibilityOutlinedIcon
                            sx={{
                              fontSize: "14px",
                              verticalAlign: "middle",
                              paddingRight: "5px",
                            }}
                          />
                          Preview
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-list-table">
                    <td>
                      <p>No Questions Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <CustomTablePagination
        count={totalPages}
        page={page}
        limit={limit}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <section className="buttonsBox">
        <div className="action-btn">
          <div
            className="action-btn-card"
          >
            <Button
              className={`outlined-btn submit-btn`}
              variant="outlined"
              onClick={() => navigate(SUPER_ADMIN_CREATE_ASSESSMENT_PAGE)}
              disabled={loading ? true : false}
            >
              Previous Step
            </Button>
            <Button
              className={`light-blue-btn submit-btn`}
              onClick={() =>
                navigate(
                  `${SUPER_ADMIN_ASSESSMENT_PREVIEW_PAGE}/${assessmentId}`
                )
              }
              disabled={loading ? true : false}
            >
              {loading ? (
                <PulseLoader size="10px" color="white" />
              ) : (
                "Next Step"
              )}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SelectQuestions;

const columns = [
  { name: "SerialNo", label: "S.NO" },
  { name: "QuestionId", label: "Question Bank ID" },
  { name: "jobRole", label: "JOB ROLE" },
  { name: "jobLevel", label: "JOB LEVEL" },
  { name: "code", label: "JOB CODE" },
  { name: "sector", label: "SECTOR" },
  { name: "subSector", label: "SUB-SECTOR" },
  { name: "schemeName", label: "SCHEME" },
  { name: "questionType", label: "Question Type" },
  { name: "nos", label: "NOS NAME" },
  { name: "nosCode", label: "NOS CODE" },
  { name: "question", label: "QUESTION", sorting: false },
];
