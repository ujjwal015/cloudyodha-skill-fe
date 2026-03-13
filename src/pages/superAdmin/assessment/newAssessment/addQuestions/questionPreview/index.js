import React, { useEffect, useState } from "react";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { ReactComponent as SearchIcon } from "../../../../../../assets/icons/search-icon.svg";
import { ReactComponent as ArrowLeft } from "../../../../../../assets/images/pages/clientManagement/arrow-left.svg";
import { SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE } from "../../../../../../config/constants/routePathConstants/superAdmin";
import {
  getAssessmentQuestionPreviewApi,
  getPreviewAssessmentForAddQnApi,
  selectAssessmentQuestionApi,
} from "../../../../../../api/superAdminApi/assessment";
import { assessmentSelector } from "../../../../../../redux/slicers/superAdmin/assessmentSlice";
import DeleteModal from "../../../../../../components/common/Modal/DeleteModal";
import { SyncLoader } from "react-spinners";
import CustomTablePagination from "../../../../../../components/common/customPagination";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const QuestionPreview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessmentPreview = [] } = useSelector(assessmentSelector);
  const { assessmentId, questionBankId } = useParams();

  const [questionIds, setQuestionIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [questionType, setQuestionType] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(
      getAssessmentQuestionPreviewApi(
        setLoading,
        questionBankId,
        page,
        limit,
        setTotalPages,
        setQuestionType
      )
    );
    dispatch(getPreviewAssessmentForAddQnApi(assessmentId, setLoading, setQuestionIds));
  }, []);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
    dispatch(
      getAssessmentQuestionPreviewApi(
        setLoading,
        questionBankId,
        nxtPage,
        limit,
        setTotalPages,
        setQuestionType
      )
    );
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getAssessmentQuestionPreviewApi(
        setLoading,
        questionBankId,
        1,
        event.target.value,
        setTotalPages,
        setQuestionType
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const formValues = {
    assessment_id: assessmentId,
    question_id: questionIds,
  };

  const handleSubmit = () => {
      setBtnLoading(true);
      dispatch(
        selectAssessmentQuestionApi(formValues, setBtnLoading, navigate)
      );
  };
  
  const handleChange = (id) => {
    setQuestionIds((pre) =>
      pre.includes(id) ? pre.filter((item) => item !== id) : [...pre, id]
    );
  };

  const del = (id) => assessmentPreview?.find(item => item?._id == id)?._id;

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    const arr = assessmentPreview?.map((item) => item?._id);
    setQuestionIds((pre) =>
      checked
        ? Array.from(new Set([...pre, ...arr]))
        : pre.filter((id) => id !== del(id))
    );
  };

  const confirmDelete = () => {
    setDeleteModal(true);
  };

  const handleCloseModal = () => {
    setDeleteModal(false);
  };
  
  const selectAllChecked = assessmentPreview?.every((value) => questionIds.includes(value?._id));

  return (
    <div className="main-content">
      <div className="main-container assessment-preview">
        <div className="title">
          <div className="title-text">
            <ArrowLeft
              onClick={() => {
                navigate(
                  `${SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE}/${assessmentId}`
                );
              }}
            />
            <h1> Add Questions</h1>
          </div>
          {assessmentPreview?.length > 0 && (
            <div className="view-list-btn">
              <button
                className="view-list-btn-text"
                disabled={btnLoading}
                style={{ minWidth: "212px" }}
                onClick={handleSubmit}
              >
                {btnLoading ? (
                  <SyncLoader color="#fff" />
                ) : (
                  "Add Selected Question"
                )}
              </button>
            </div>
          )}
        </div>
        {loading ? (
          <div className="loading-qn-preview">
            <SyncLoader color="#2ea8db" />
          </div>
        ) : assessmentPreview?.length > 0 ? (
          <>
            <Grid
              container
              sx={{
                my: 3,
              }}
              className="select-all-question-wrapper"
            >
              <Grid item xs={12} md={12}>
                <Box className="select-all-question">
                  <Checkbox
                    {...label}
                    className="checkbox"
                    checked={selectAllChecked}
                    onChange={handleSelectAll}
                  />
                  <Typography variant="h6">All Questions</Typography>
                </Box>
              </Grid>
            </Grid>
            {assessmentPreview?.map((item, index) => (
              <Grid
                container
                sx={{ my: 3, bgcolor: "#fff", borderRadius: "10px" }}
                key={index}
                className="question-wrapper"
              >
                <Grid item xs={12} md={10}>
                  <Box
                    sx={{
                      display: "flex",
                      height: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "5px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        padding: "10px 0 0 0",
                        fontWeight: "600",
                        fontFamily: "poppins",
                        fontSize: "18px",
                        color: "rgba(0, 0, 0, 0.7)",
                        lineHeight: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        {...label}
                        checked={questionIds.includes(item?._id)}
                        className="checkbox"
                        onChange={() => handleChange(item?._id) }
                      />
                      Q.{(page - 1) * limit + (index + 1)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                      <span
                        style={{
                          opacity: 0.5,
                          fontFamily: "poppins",
                          fontWeight: "600",
                          fontSize: "18px",
                          color: "#000000",
                        }}
                      >
                        {" "}
                        Type
                      </span>
                      <span
                        style={{
                          opacity: 1.0,
                          margin: "0 10px",
                          fontFamily: "poppins",
                          fontWeight: "700",
                          fontSize: "18px",
                          color: "#000000",
                        }}
                      >
                        {questionType}
                      </span>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box
                    sx={{
                      ml: 1,
                      height: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "5px",
                    }}
                  >
                    <Divider
                      sx={{ height: 28, m: 0.5 }}
                      orientation="vertical"
                    />
                    <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                      <span
                        style={{
                          opacity: 0.5,
                          fontFamily: "poppins",
                          fontWeight: "600",
                          fontSize: "18px",
                          color: "#000000",
                        }}
                      >
                        {" "}
                        Marks
                      </span>
                      <span
                        style={{
                          opacity: 1.0,
                          margin: "0 10px",
                          fontFamily: "poppins",
                          fontWeight: "700",
                          fontSize: "18px",
                          color: "#000000",
                        }}
                      >
                        {item?.questionMarks}
                      </span>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ px: 4, marginTop: "30px" }}>
                  <Typography
                    dangerouslySetInnerHTML={{ __html: item.questionText }}
                    className="question-text"
                  ></Typography>

                  {item?.options?.map((option) => (
                    <Box
                      sx={{
                        my: 2,
                        padding: "20px 14px",
                        backgroundColor: `${
                          option.optionId === item.correctAnswer.slice(-1)
                            ? "rgba(174, 231, 255, 0.15)"
                            : ""
                        }`,
                        borderRadius: "5px",
                      }}
                      key={option?.optionId}
                    >
                      <p
                        style={{
                          fontFamily: "Poppins",
                          fontSize: "15px",
                          textTransform: "capitalize",
                          color: "#231F20",
                          fontWeight: "700",
                          opacity: 0.9,
                        }}
                      >
                        Option {option.optionId}
                      </p>
                      <p
                        style={{
                          padding: "15px 0 0 0",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          textTransform: "capitalize",
                          color: "#231F20",
                          fontWeight: "700",
                          opacity: 0.6,
                        }}
                      >
                        {option.title}
                      </p>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            ))}

            <DeleteModal
              confirmDelete={confirmDelete}
              open={deleteModal}
              handleCloseModal={handleCloseModal}
            />
            <CustomTablePagination
              count={totalPages}
              page={page}
              limit={limit}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <div className="no-qn-text">
            <h2>No Questions Available</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPreview;
