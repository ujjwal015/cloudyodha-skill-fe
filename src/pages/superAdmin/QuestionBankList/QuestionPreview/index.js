import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardActions,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  TablePagination,
  Typography,
} from "@mui/material";
import "./styles.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  SUPER_ADMIN_QUESTION_EDIT_PAGE,
  SUPER_ADMIN_QUESTION_LIST,
} from "../../../../config/constants/routePathConstants/superAdmin";
import { getQuestionPreviewApi } from "../../../../api/authApi";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteParticularQuestionApi } from "../../../../api/superAdminApi/questionBank";
import { BarLoader, DotLoader, MoonLoader, PulseLoader } from "react-spinners";
import { ActionDropdown } from "../../../../components/common/DropDown";
import DeleteModal from "../../../../components/common/Modal/DeleteModal";

const QuestionPreview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const { questionPreview = {}, paginate } = useSelector(authSelector);
  const { totalPages = 1, totalCount = 1 } = paginate;
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('')
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [actionBtn, setActionBtn] = useState(null);

  const [actionOpen, setActionOpen] = useState(false);
  const [actionId, setActionId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);


  const getList = () => {
    setLoading(true)
    dispatch(getQuestionPreviewApi(id, setLoading, page + 1, rowsPerPage));
  }

  useEffect(() => {
    getList()
  }, [page, rowsPerPage]);

  useEffect(() => {
    setQuestion(questionPreview?.questions);
    setTotalPagesUser(totalPages);
  }, [questionPreview, totalPages]);

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 8));
    setPage(0);
  };

  const actionHandler = (id) => {
    setActionBtn(id);
    setShowActionBtn(!showActionBtn);

  };
  const handleCloseModal = () => {
    setDeleteModal(false);
    setActionOpen(false);
  };
  const MoreBtnHandler = (event, id) => {
    event.stopPropagation();
    setActionOpen(!actionOpen);
    setActionId(id);
  };
  const confirmDelete = () => {
    dispatch(
      deleteParticularQuestionApi(setLoading, setDeleteModal, actionId, getList)
    );
  };
  const deleteHandler = (id) => {
    setDeleteModal(true);
    setActionOpen(false);

  };
  const editBtnHandler = (id_edit, index) => {
    setShowActionBtn(false);
    localStorage.setItem("section_id", id);
    navigate(`${SUPER_ADMIN_QUESTION_EDIT_PAGE}/${actionId}`);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery != "" || undefined) {
      setLoading(true)
      dispatch(getQuestionPreviewApi(id, setLoading, page + 1, rowsPerPage, searchQuery));
    }

  }
  const handleChangeSearch = (e) => {
    const { value } = e.target
    setSearchQuery(value)
    if (e.target.value === '' || undefined) {
      setLoading(true)
      dispatch(getQuestionPreviewApi(id, setLoading, page + 1, rowsPerPage));
    }
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit(event);
    }
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <>
      <Box sx={{ p: 3 }} className="main-container">
        <Typography
          variant="h5"
          sx={{
            fontFamily: "poppins",
            fontSize: "20px",
            fontWeight: "600",
            color: "#231F20",
            lineHeight: "20px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <KeyboardBackspaceIcon
            sx={{ cursor: "pointer", fontSize: "20px", color: "#161E29" }}
            onClick={() => {
              navigate(SUPER_ADMIN_QUESTION_LIST);
            }}
          />
          Questions manager
        </Typography>

        <Grid
          container
          sx={{
            my: 3,
          }}
        >
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                display: "flex",
                height: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#fff",
                borderRadius: "5px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  padding: "10px 20px",
                  fontWeight: "600",
                  fontFamily: "poppins",
                  fontSize: "20px",
                  color: "rgba(0, 0, 0, 0.7)",
                  lineHeight: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Questions
              </Typography>
              <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                <span
                  style={{
                    opacity: 0.5,
                    fontFamily: "poppins",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#000000",
                  }}
                >
                  {" "}
                  Category
                </span>
                <span
                  style={{
                    opacity: 1.0,
                    margin: "0 10px",
                    fontFamily: "poppins",
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#000000",
                  }}
                >
                  All categories
                </span>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                ml: 1,
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#fff",
                borderRadius: "5px",
              }}
            >
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>

              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Questions"
                inputProps={{ "aria-label": "" }}
                onChange={handleChangeSearch}
                onKeyDown={handleKeyDown}
              />

              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton sx={{ p: "10px" }} aria-label="directions">
                <ClearIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        {loading ? <Box className="loader_box"
        > <PulseLoader color={"#00b2ff"} /></Box> : question?.map((item, index) => (
          <Grid
            container
            sx={{ my: 3, bgcolor: "#fff", borderRadius: "5px" }}
            key={index}
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
                    padding: "10px 20px",
                    fontWeight: "600",
                    fontFamily: "poppins",
                    fontSize: "16px",
                    color: "rgba(0, 0, 0, 0.7)",
                    lineHeight: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Q.{index + 1}
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                  <span
                    style={{
                      opacity: 0.5,
                      fontFamily: "poppins",
                      fontWeight: "600",
                      fontSize: "13px",
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
                      fontSize: "13px",
                      color: "#000000",
                    }}
                  >
                    {questionPreview?.questionType}
                  </span>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box className="prev-option-menu">
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
                  <span
                    style={{
                      opacity: 0.5,
                      fontFamily: "poppins",
                      fontWeight: "600",
                      fontSize: "13px",
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
                      fontSize: "13px",
                      color: "#000000",
                    }}
                  >
                    {item.questionMarks}
                  </span>
                </Typography>

                <Divider sx={{ height: 28 }} orientation="vertical" />
                <div className="action-btn">
                  <ActionDropdown
                    actionOpen={actionOpen}
                    setActionOpen={setActionOpen}
                    deleteHandler={deleteHandler}
                    editBtnHandler={editBtnHandler}
                    MoreBtnHandler={MoreBtnHandler}
                    id={item._id}
                    actionId={actionId}
                    horizontal={true}
                  />
                </div>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ px: 4 }}>
              <Typography
                dangerouslySetInnerHTML={{ __html: item.questionText }}
                sx={{
                  ".& .MuiTypography-paragraph": {
                    fontFamily: "poppins",
                    color: "#000000",
                    opacity: 0.9,
                  },
                }}
              ></Typography>

              {item?.options?.map((option, optIndex) => (
                <Box
                  sx={{
                    my: 2,
                    p: 1,
                    backgroundColor: `${option.optionId === item.correctAnswer
                      ? "rgba(174, 231, 255, 0.15)"
                      : ""
                      }`,
                  }}
                  key={optIndex}
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
                      padding: "15px 0px",
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
                  {option.option_url && <img src={option.option_url}
                    style={{ width: "200px" }} />}
                </Box>
              ))}
            </Grid>
          </Grid>
        ))}
        <DeleteModal
          title="Delete Question?"
          confirmDelete={confirmDelete}
          open={deleteModal}
          handleCloseModal={handleCloseModal}
        />
        <TablePagination
          component="div"
          count={totalPagesUser}
          page={page}
          labelRowsPerPage={"Question per page:"}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          backIconButtonProps={{ disabled: page === 0 }}
          nextIconButtonProps={{
            disabled: (page + 1) * rowsPerPage >= totalCount,
          }}
          rowsPerPageOptions={[2, 4, 6, 8]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => {
            const totalPages = Math.ceil(count / rowsPerPage);
            return `${page + 1} of ${count} pages`;
          }}
          sx={{
            "& .MuiTablePagination-selectLabel": {
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#6E6B7B",
              fontWeight: "500",
            },
            "& .MuiTablePagination-select": {
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#231F20",
              fontWeight: "500",
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#022A50",
            },
          }}
        />
      </Box>
    </>
  );
};

export default QuestionPreview;
