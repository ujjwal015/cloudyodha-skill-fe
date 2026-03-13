import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import Input from "../../../../../components/common/input";
import validateField from "../../../../../utils/validateField";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ReactComponent as RemoveIcon } from "../../../../../assets/icons/Remove_icon.svg";
import { ReactComponent as BackIcon } from "../../../../../assets/icons/chevron-left.svg";
import { Button } from "@mui/material";
import { PulseLoader } from "react-spinners";
import { SUPER_ADMIN_VIEW_QUESTIONS_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { errorToast, successToast } from "../../../../../utils/projectHelper";
import {
  getPracticalQuestionDetailsApi,
  getVivaQuestionDetailsApi,
  updatePracticalQuestionApi,
  updateVivaQuestionApi,
} from "../../../../../api/superAdminApi/questionBank";
import { qbManagementSelector } from "../../../../../redux/slicers/superAdmin/questionBankSlice";

const initialValues = () => {
  return {
    question_bank_id: "",
    questions: [
      {
        answer: "",
        questionText: "",
        marks: "",
      },
    ],
  };
};

export default function Questions() {
  const [formValues, setFormValues] = useState(initialValues());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filled, setFilled] = useState(true);
  const [imgURL, setImgURL] = useState("");
  const [imgTitle, setImgTitle] = useState("");
  const [imageLocation, setImgLocation] = useState([0, 0]);
  const params = useParams();
  const { practicalQuestionDetails = {} } = useSelector(qbManagementSelector);

  const getDetails = () => {
    if (params?.qId && formValues?.question_bank_id === "") {
      params.section === "practical"
        ? dispatch(
            getPracticalQuestionDetailsApi(setLoading, params?.qId, params.lang)
          )
        : dispatch(
            getVivaQuestionDetailsApi(setLoading, params?.qId, params.lang)
          );
    }
  };

  useEffect(() => {
    getDetails();
  }, [params?.qId, params?.qbid]);

  useEffect(() => {
    if (practicalQuestionDetails.length > 0) {
      const currentQuestions = [...formValues.questions];
      currentQuestions[0].questionText =
        practicalQuestionDetails[0]?.questionText;
      currentQuestions[0].answer = practicalQuestionDetails[0]?.answer;
      currentQuestions[0].marks = practicalQuestionDetails[0]?.marks;

      setFormValues({ ...formValues, questions: currentQuestions });
    }
  }, [practicalQuestionDetails, params.qId]);

  const RichTextEditor2 = (props) => {
    const { index } = props;
    const reactQuillRef = useRef(null);
    const [value2, setValue2] = useState("");

    const TOOLBAR_OPTIONS = [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["image"],
    ];

    const handleContentChange = (content) => {
      setValue2(content);
      formValues.questions[index].questionText = content;
    };

    return (
      <div
        style={{
          width: "50vw",
          height: "85%",
        }}
      >
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          placeholder="Enter Question Title..."
          modules={{
            toolbar: {
              container: TOOLBAR_OPTIONS,
            },
          }}
          value={formValues?.questions[index].questionText || value2}
          onChange={handleContentChange}
          style={{ width: "100%", height: "80%" }}
        />
      </div>
    );
  };

  const ErrorDialogue = ({ visibility } = visibility) => {
    return (
      <>
        <p className="rich_text_error" style={{ display: visibility }}>
          Enter question Title
        </p>
      </>
    );
  };

  const changeHandlerAnswer = (e, index) => {
    const { name, value } = e.target;
    const existingQuestionsArr = [...formValues?.questions];

    const targetQuestion = { ...existingQuestionsArr[index] };
    targetQuestion.answer = value;
    existingQuestionsArr[index] = targetQuestion;
    setFormValues({ ...formValues, questions: existingQuestionsArr });
  };

  const clearFormValues = () => {
    setFormValues(initialValues());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formValues.question_bank_id = params?.qbid;
    const formErrors = {};

    formValues.questions.map((el) => {
      if (el.questionText === "" || undefined) {
        setFilled(false);
        errorToast("Question Title Can't be empty");
      }
      if (el.questionText !== "") {
        setFilled(true);
      }
    });

    formValues.questions.map((el, index) => {
      for (let key in el) {
        const value = el[key];
        const name = key;
        if (name === "options") {
          value.map((e, index_c) => {
            if (e.title === "") {
              formErrors[`${index}+${index_c}`] = "Enter Option Title";
            }
          });
        }
        if (name === "marks") {
          const fieldError = validateField(name, value);
          if (fieldError) {
            formErrors[`questionMark${index}`] = fieldError;
          }
        }
        if (name === "difficulty_level") {
          const fieldError = validateField(name, value);
          if (fieldError) {
            formErrors[`difficulty_level${index}`] = fieldError;
          }
        }
        if (name === "answer") {
          const fieldError = validateField(name, value);
          if (fieldError) {
            formErrors[`rad-${index}`] = fieldError;
          }
        }
        const fieldError = validateField(name, value);
        if (fieldError) {
          formErrors[name] = fieldError;
        }
      }
    });
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0 && filled) {
      if (params.section === "practical") {
        dispatch(
          updatePracticalQuestionApi(
            formValues,
            navigate,
            setLoading,
            clearFormValues,
            params?.qId,
            params?.qbid,
            params?.section
          )
        );
      } else {
        dispatch(
          updateVivaQuestionApi(
            formValues,
            navigate,
            setLoading,
            clearFormValues,
            params?.qId,
            params?.qbid,
            params?.section
          )
        );
      }
    }
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const deleteQuestionHandler = (index) => {
    const existingQuestions = formValues.questions;
    existingQuestions.splice(index, 1);
    setFormValues({ ...formValues, questions: existingQuestions });
    successToast("Question Deleted");
  };

  const loadFile = (event, index, index_c) => {
    if (!event.target.files) {
      const location = [index, index_c];
      setImgLocation(location);
    }
    if (event.target.files) {
      setImgURL(URL.createObjectURL(event.target.files[0]));
      setImgTitle(event.target.files[0].name);

      const existingQuestions = formValues.questions;
      const existingOptions = formValues.questions[index].options;
      existingOptions[index_c].file = event.target.files[0];
      existingOptions[index_c].option_url = URL.createObjectURL(
        event.target.files[0]
      );
      existingQuestions[index].options = existingOptions;

      setFormValues({ ...formValues, questions: existingQuestions });
    }
  };

  const handleCancel = () => {
    clearFormValues();
    navigate(-1);
  };

  const changeHandlerMarks = (e, index) => {
    const { name, value } = e.target;
    const existingQuestionsArr = [...formValues?.questions];

    const targetQuestion = { ...existingQuestionsArr[index] };
    targetQuestion.marks = value;
    existingQuestionsArr[index] = targetQuestion;
    setFormValues({ ...formValues, questions: existingQuestionsArr });
  };

  return (
    <div className="main-container-wrapper">
      <div className="add-question-heading">
        <div className="question-heading">
          <div className="title_back_button">
            <BackIcon
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(
                  `${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${params.qbid}/${params.section}`
                )
              }
            />
            <div className="heading-text">
              Edit Question [{params.section.toUpperCase()}]
            </div>
          </div>
        </div>
      </div>
      {formValues?.questions?.map((el, index) => {
        return (
          <div key={index}>
            <section className="sub-admin-wrapper" style={{ marginBottom: 20 }}>
              <div
                className="deleteQuestionBox"
                style={{ display: [index === 0 ? "none" : "block"] }}
              >
                <div>
                  {<RemoveIcon onClick={() => deleteQuestionHandler(index)} />}
                </div>
              </div>
              <div className="tab-content">
                <div className="content-wrapper">
                  <div className="content_title_Box">
                    <div
                      className="title_card"
                      style={{ justifyContent: "flex-start" }}
                    >
                      <h1>Question {index + 1}</h1>
                    </div>
                  </div>
                  <div className="rich_input_box">
                    <RichTextEditor2 index={index} />
                    <ErrorDialogue visibility={filled ? "none" : "block"} />
                  </div>

                  <div className="form-group_question">
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <Input
                        type="number"
                        label={"Question Marks"}
                        name={`questionMark${index}`}
                        placeholder="Enter Marks"
                        onChange={(e) => changeHandlerMarks(e, index)}
                        value={formValues?.questions[index].marks}
                        onFocus={focusHandler}
                        error={errors?.[`questionMark${index}`]}
                        mandatory
                      />
                    </div>
                  </div>
                  <div className="options_box">
                    <div className="answer_container">
                      <div className="option_textInputBox">
                        <Input
                          label={"Answer"}
                          type="text"
                          name={"answer"}
                          placeholder="Enter Answer"
                          mandatory
                          onChange={(e) => changeHandlerAnswer(e, index)}
                          value={formValues?.questions?.[index]?.answer}
                        />
                      </div>
                      <div className="option_upload_viva">
                        <div style={{ display: "none" }}>
                          <input
                            type="file"
                            accept="image/*"
                            name="image"
                            id="file"
                            onChange={(e) =>
                              loadFile(e, imageLocation[0], imageLocation[1])
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      })}

      <div className="button_box">
        <Button
          className={`light-blue-btn submit-btn`}
          variant="contained"
          onClick={handleSubmit}
          sx={{
            width: "90px",
            height: "42px",
            textTransform: "unset",
          }}
          disabled={loading ? true : false}
        >
          {loading ? <PulseLoader size="10px" color="white" /> : "Submit"}
        </Button>

        <Button
          className={`outlined-btn`}
          variant="outlined"
          onClick={handleCancel}
          sx={{
            width: "90px",
            height: "42px",
            textTransform: "unset",
          }}
          disabled={loading ? true : false}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function createFormData(data) {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (let i = 0; i < data[key].length; i++) {
        const subObj = data[key][i];
        for (const subKey in subObj) {
          if (Array.isArray(subObj[subKey])) {
            for (let j = 0; j < subObj[subKey].length; j++) {
              const subObj2 = subObj[subKey][j];

              for (const subKey2 in subObj2) {
                formData.append(
                  `${key}[${i}][${subKey}][${j}][${subKey2}]`,
                  subObj2[subKey2]
                );
              }
            }
          } else formData.append(`${key}[${i}][${subKey}]`, subObj[subKey]);
        }
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
}
