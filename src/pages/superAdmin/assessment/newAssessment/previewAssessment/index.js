import React, { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../../../../../assets/icons/chevron-left.svg";
import DeleteModal from "../../../../../components/common/Modal/DeleteModal";
import { useState } from "react";
import {
  SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE,
  SUPER_ADMIN_ASSESSMENT_LIST_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
  getPreviewAssessmentApi,
  deleteQuestionApi,
} from "../../../../../api/superAdminApi/assessment";
import { assessmentSelector } from "../../../../../redux/slicers/superAdmin/assessmentSlice";
import CustomTablePagination from "../../../../../components/common/customPagination";
import { SyncLoader } from "react-spinners";
import "../../../assessment/style.css";
import "../style.css";
import SelectInput from "../../../../../components/common/SelectInput";

const PreviewAssessment = ({ setActiveStep }) => {
  const initialFormValues = {
    language: "",
  };
  const myComponentRef = useRef(null);

  const { previewAssessment = [], assessmentLangs = [] } =
    useSelector(assessmentSelector);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [checked, setChecked] = useState([true, false]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [qnId, setQnId] = useState("");
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCounts, setTotalCounts] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  let { assessmentId = "", setId = "", previewType } = useParams();

  const [actionId, setActionId] = useState();
  const [fetchedLanguages, setFetchedLanguages] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);

  const getList = (isQuestionDeleted = false, len) => {
    setLoading(true);
    const pageNum = len && len == 1 ? (page == 1 ? page : page - 1) : page;
    if (previewType !== "viva" || previewType !== "practical")
      previewType = "Theory";
    dispatch(
      getPreviewAssessmentApi(
        assessmentId,
        setId,
        setLoading,
        pageNum,
        limit,
        setTotalPages,
        setTotalCounts,
        formValues?.language,
        previewType
      )
    );
    setPage(pageNum);
    if (isQuestionDeleted && page == 1 && len == 1) {
      navigate(`${SUPER_ADMIN_ASSESSMENT_ADD_QUESTIONS_PAGE}/${assessmentId}`);
    }
  };

  useEffect(() => {
    getList();
  }, [formValues.language, page]);

  useEffect(() => {
    if (assessmentLangs.length > 0) {
      const filteredLangs = assessmentLangs.map((el) => {
        return {
          label: el,
          value: el,
        };
      });
      setFetchedLanguages([...filteredLangs]);
    } else setFetchedLanguages([]);
  }, [assessmentLangs.length]);

  const handleChange = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChangePage = (e, nxtPage) => {
    setPage(nxtPage);

    dispatch(
      getPreviewAssessmentApi(
        assessmentId,
        setId,
        setLoading,
        nxtPage,
        limit,
        setTotalPages,
        setTotalCounts,
        formValues?.language,
        previewType
      )
    );
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getPreviewAssessmentApi(
        assessmentId,
        setId,
        setLoading,
        1,
        event.target.value,
        setTotalPages,
        setTotalCounts,
        formValues?.language,
        previewType
      )
    );
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };
  const openDelDialog = (id) => {
    setActionId(id);
    setDeleteModal(true);
  };
  const confirmDelete = () => {
    const formData = {
      assessment_id: assessmentId,
      question_id: actionId,
    };
    const len = previewAssessment?.length;
    dispatch(
      deleteQuestionApi(setLoading, setDeleteModal, formData, getList, len)
    );
  };
  const handleCloseModal = () => {
    setDeleteModal(false);
  };

  function handleQuestion(id) {
    const element = document.getElementById("qn" + id);

    const pages = Math.round(id / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const isBet = startIndex < id && endIndex >= id;

    if (!isBet) {
      setPage(pages);
      dispatch(
        getPreviewAssessmentApi(
          assessmentId,
          setLoading,
          pages,
          limit,
          setTotalPages,
          setTotalCounts,
          formValues?.language,
          previewType,
          setQnId,
          id
        )
      );
    } else {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
  useEffect(() => {
    if (qnId) {
      setTimeout(function () {
        const element = document.getElementById("qn" + qnId);
        element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [qnId]);

  const totalQuestions = [...new Array(totalCounts)];

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormValues({
      ...formValues,
      [name]: fieldValue,
    });
  };

  return (
    <div className="main-container assessment-page">
      <div className="title">
        <div
          className="title-text"
          style={{
            justifyContent: "flex-start",
            padding: "20px 0px 20px 25px",
          }}
        >
          <ArrowLeft
            onClick={() => navigate(SUPER_ADMIN_ASSESSMENT_LIST_PAGE)}
          />
          <div className="heading_wrapper">
            <h1>Preview {previewAssessment?.setName}</h1>
            <div className="select_wrapper">
              <SelectInput
                label=""
                name="language"
                placeHolder={
                  fetchedLanguages.length > 0
                    ? "Select Language"
                    : "No Language Found"
                }
                options={fetchedLanguages}
                value={formValues?.language || ""}
                handleChange={changeHandler}
                disabled={fetchedLanguages.length < 1}
              />
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="loading-preview-assessment">
          <SyncLoader color="#2ea8db" />
        </div>
      ) : previewAssessment?.question_id?.length > 0 ? (
        <>
          <section>
            <div>
              <div className="questions">
                <div>
                  {previewAssessment?.question_id?.map((question, index) => {
                    return (
                      <div
                        key={question?._id}
                        className="question-card"
                        id={"qn" + ((page - 1) * limit + (index + 1))}
                        ref={myComponentRef}
                      >
                        <div className="title">
                          <h2>{`Question ${
                            (page - 1) * limit + (index + 1)
                          }`}</h2>
                          <div>
                            <p>
                              <span>Marks</span>
                              {question?.marks}
                            </p>
                          </div>
                        </div>
                        <div className="ques-opt">
                          {question?.questionImgKey !== null ? (
                            <>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: question?.questionImgKey,
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: question?.questionText,
                                }}
                              />
                              <div
                                className="title_secondary_value"
                                dangerouslySetInnerHTML={{
                                  __html: question?.secondaryQuestionText || "",
                                }}
                              ></div>
                            </>
                          )}

                          <ul>
                            {question?.options?.map((option, srN) => {
                              return (
                                <div key={option?._id}>
                                  {option?.optionImgKey ? (
                                    <>
                                      <li key={option?.optionId}>
                                        {option?.optionKey?.split("n")[1] ||
                                          srN + 1}{" "}
                                        : {option?.optionValue}
                                      </li>
                                      <li className="option_secondary_value">
                                        {option?.secondaryOptionValue ? (
                                          <> {option?.secondaryOptionValue}</>
                                        ) : (
                                          ""
                                        )}
                                      </li>
                                      {/* <img
                                        src={
                                          <img
                                            src={option?.optionUrl}
                                            alt={option?.optionUrl}
                                          />
                                        }
                                        alt={option?.optionUrl}
                                      /> */}
                                      <img
                                      className="option-image"
  src={option?.optionUrl}
  alt={option?.optionUrl}
  //alt={option?.optionValue || "Option image"}
  //style={{ maxWidth: "150px", marginTop: "8px" }}
  // style={{
  //   maxWidth: "150px",
  //   maxHeight: "150px", // Ensure it fits nicely
  //   marginTop: "8px",
  //   padding: "5px", // Adds space around image
  //   objectFit: "contain", // Ensures full image is visible
  //   display: "block" // Prevents inline cutting
  // }}
/>
                                    </>
                                  ) : (
                                    <>
                                      <li key={option?.optionId}>
                                        {option?.optionKey?.split("n")[1] ||
                                          srN + 1}{" "}
                                        : {option?.optionValue}
                                      </li>
                                      <li className="option_secondary_value">
                                        {option?.secondaryOptionValue ? (
                                          <> {option?.secondaryOptionValue}</>
                                        ) : (
                                          ""
                                        )}
                                      </li>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <DeleteModal
                  confirmDelete={confirmDelete}
                  open={deleteModal}
                  handleCloseModal={handleCloseModal}
                />
                <CustomTablePagination
                  count={totalPages}
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="no-preview-assessment">No Questions Added</div>
      )}
    </div>
  );
};

export default PreviewAssessment;
