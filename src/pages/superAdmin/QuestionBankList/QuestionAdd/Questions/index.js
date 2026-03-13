import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Input, { FormSwitch } from "../../../../../components/common/input";
import SelectInput from "../../../../../components/common/SelectInput";
import validateField from "../../../../../utils/validateField";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as ImageIcon } from "../../../../../assets/icons/image.svg";
import { ReactComponent as DeleteIcon } from "../../../../../assets/icons/trash-2.svg";
import { ReactComponent as RemoveIcon } from "../../../../../assets/icons/Remove_icon.svg";
import { ReactComponent as PlusIcon } from "../../../../../assets/icons/add_icon_black.svg";
import { ReactComponent as PlusIconLarge } from "../../../../../assets/icons/plus_icon_large_black.svg";
import { ReactComponent as BackIcon } from "../../../../../assets/icons/chevron-left.svg";
import { ReactComponent as CloseIcon } from "../../../../../assets/icons/close-icon.svg";
import { Button } from "@mui/material";
import { PulseLoader } from "react-spinners";
import {
  SUPER_ADMIN_BULK_UPLOAD_QUESTION,
  SUPER_ADMIN_CREATE_QUESTION_FORM_PAGE,
  SUPER_ADMIN_VIEW_QUESTIONS_PAGE,
} from "../../../../../config/constants/routePathConstants/superAdmin";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { createQuestionFinal } from "../../../../../api/authApi";
import { errorToast, successToast } from "../../../../../utils/projectHelper";
import axios from "axios";
import { UPLOAD_OPTION_IMAGE_S3_API } from "../../../../../config/constants/apiConstants/superAdmin";
import { API_ROOT } from "../../../../../config/constants/apiConstants/auth";
import { getParticularQuestionDetailsApi } from "../../../../../api/superAdminApi/questionBank";
import { ASSESEMENT_LEVEL } from "../../../../../config/constants/projectConstant";

const initialValues = () => {
  return {
    question_bank_id: "",
    questions: [
      {
        difficulty_level: "",
        marks: "",
        answer: "",
        questionText: "",
        isTrueFalse: false,
        options: [
          {
            title: "",
            optionId: 1,
            isSelect: false,
          },
          {
            title: "",
            optionId: 2,
            isSelect: false,
          },
          {
            title: "",
            optionId: 3,
            isSelect: false,
          },
          {
            title: "",
            optionId: 4,
            isSelect: false,
          },
        ],
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

  if (params?.qId) {
    dispatch(
      getParticularQuestionDetailsApi(setLoading, params?.qId, setFormValues)
    );
  }

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

  const changeHandlerMarks = (e, index) => {
    const { value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    formValues.questions[index].marks = fieldValue;
    const prevMarksArr = formValues.questions;
    prevMarksArr[index].marks = value;
    setFormValues({ ...formValues, questions: prevMarksArr });
    const currQues = `questionMark${index}`;
    delete errors[currQues];
    setErrors(errors);
  };

  const changeHandlerDifficulty = (e, index) => {
    const { value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    formValues.questions[index].difficulty_level = fieldValue;
    setFormValues({ ...formValues });
    const currQues = `difficulty_level${index}`;
    delete errors[currQues];
    setErrors(errors);
  };

  const changeHandlerOptions = (e, index, index_c) => {
    const { value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    formValues.questions[index].options[index_c].title = fieldValue;
    setFormValues({ ...formValues });

    const currOption = `${index}+${index_c}`;
    delete errors[currOption];
    setErrors(errors);
  };

  const radioChecked = (e, index) => {
    const { value } = e.target;
    formValues.questions[index].answer = value;
    setFormValues({ ...formValues });
    const currChecked = `rad-${index}`;
    delete errors[currChecked];
    setErrors(errors);
  };

  const clearFormValues = () => {
    setFormValues(initialValues());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formValues.question_bank_id = params?.id;
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

    // console.log(formValues);
    formValues.questions.map((el, index) => {
      for (let key in el) {
        const value = el[key];
        const name = key;
        if (name === "options") {
          value.map((e, index_c) => {
            if (e.title === "") {
              if (e?.file instanceof File) {
              } else formErrors[`${index}+${index_c}`] = "Enter Option Title";
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
      // setLoading(true);
      sendData(formValues);
    }
  };

  const sendData = (data) => {
    const questionsArr = data?.questions;
    const questionFiles = questionsArr.map((el) => {
      const optionsFile = el?.options?.map((option, index) => {
        if (option?.file) return option?.file;
        else return "No File Provided";
      });
      return optionsFile;
    });

    const promiseArr = questionFiles.map((question, index_ques) => {
      const sendOptionArr = question.map((file, index_option) => {
        if (file !== "No File Provided") {
          const formData = new FormData();
          formData.append(`option_img`, file);
          formData.append("optionId", index_option + 1);
          // return dispatch(uploadFilesS3Api(formData));
          const localData = window.localStorage.getItem("token");
          return axios.post(
            `${API_ROOT}${UPLOAD_OPTION_IMAGE_S3_API}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "X-Auth-Token": localData,
              },
            }
          );
        } else return file;
      });
      return sendOptionArr;
    });

    var allQuestionsWithKey = new Array();

    promiseArr.map((qstPrms, index) => {
      Promise.all(qstPrms)
        .then((res) => {
          const responseArr = res.map((el) => {
            return el?.data?.details;
          });
          return Promise.all(responseArr);
        })
        .then((dataArray) => {
          var allQuestions = [...data?.questions];
          const targetQuestion = allQuestions[index];

          const questionCopy = { ...targetQuestion };

          const optionsCopy = [...questionCopy?.options];

          const updatedQuesOptions = optionsCopy.map((el, pos) => {
            if (dataArray?.[pos]?.optionIdKey) {
              const optionAlpha = lowercaseAlphabets[pos];
              const newDetail = {
                title: el?.title,
                optionId: `Option${optionAlpha.toUpperCase()}`,
                optionImgKey: dataArray?.[pos]?.optionIdKey || "",
                isSelect: el?.isSelect,
              };
              return newDetail;
            } else {
              const optionAlpha = lowercaseAlphabets[pos];
              const newDetail = {
                title: el?.title,
                optionId: `Option${optionAlpha.toUpperCase()}`,
                // optionImgKey: dataArray?.[pos]?.optionIdKey || "",
                isSelect: el?.isSelect,
              };
              return newDetail;
            }
          });
          const questionWithKey = {
            ...questionCopy,
            options: updatedQuesOptions,
          };

          allQuestionsWithKey.push(questionWithKey);

          allQuestions[index] = questionWithKey;

          // Final Data will be dispatched from here =>
          if (index === formValues?.questions.length - 1) {
            const newData = { ...data, questions: allQuestionsWithKey };

            // const dataFinalFormData = createFormData(newData);

            const allQsts = [...newData?.questions];
            const modAllQsts = allQsts.map((elm, ind) => {
              const selection = elm?.answer;
              const position = checkSelectionIndex(selection);
              // elm.options[position].isSelect = true;
              return elm;
            });

            const newData2 = { ...data, questions: modAllQsts };

            // console.log(newData2);

            dispatch(
              createQuestionFinal(
                newData2,
                navigate,
                setLoading,
                clearFormValues
              )
            );
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
          errorToast("Unable to upload files");
          setLoading(false);
        });
    });
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const addNewQuestionHandler = () => {
    const existingQuestions = formValues.questions;
    const newQuestion = {
      difficulty_level: "",
      marks: "",
      answer: "",
      questionText: "",
      isTrueFalse: false,
      options: [
        {
          title: "",
          optionId: 1,
          isSelect: false,
        },
        {
          title: "",
          optionId: 2,
          isSelect: false,
        },
        {
          title: "",
          optionId: 3,
          isSelect: false,
        },
        {
          title: "",
          optionId: 4,
          isSelect: false,
        },
      ],
    };
    const newQuestionsArr = [...existingQuestions, newQuestion];
    setFormValues({ ...formValues, questions: newQuestionsArr });
  };

  const deleteQuestionHandler = (index) => {
    const existingQuestions = formValues.questions;
    existingQuestions.splice(index, 1);
    setFormValues({ ...formValues, questions: existingQuestions });
    successToast("Question Deleted");
  };

  const addNewOptionHandler = (index) => {
    const existingOptions = formValues.questions[index].options;
    const totalOptions = existingOptions.length + 1;
    const newOption = {
      title: "",
      optionId: totalOptions,
      isSelect: false,
    };
    const updatedOptions = [...existingOptions, newOption];

    const existingQuestions = formValues.questions;
    existingQuestions[index].options = updatedOptions;

    setFormValues({ ...formValues, questions: existingQuestions });
  };

  const deleteOptionHandler = (index, index_c) => {
    const existingQuestions = formValues.questions;
    if (existingQuestions[index].options.length > 2) {
      existingQuestions[index].options.splice(index_c, 1);
      setFormValues({ ...formValues, questions: existingQuestions });
      successToast("Option Deleted");
    } else errorToast("Please add more options first");
  };

  const loadFile = (event, index, index_c) => {
    if (!event.target.files) {
      const location = [index, index_c];
      setImgLocation(location);
    }
    if (event.target.files) {
      if (event.target.files[0].size > 1599999)
        return errorToast("Select image less than 1.5 MB");
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

  const lowercaseAlphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode("a".charCodeAt(0) + i)
  );

  const cancelHandler = () => {
    clearFormValues();
    navigate(-1);
  };

  const checkSelectionIndex = (str) => {
    const ind = lowercaseAlphabets.indexOf(str);
    return ind;
  };

  const handleTrueFalse = (e, index) => {
    const { checked } = e.target;
    const existingQuestions = [...formValues.questions];
    const targetQuestion = existingQuestions[index];
    if (checked) {
      const trueFalseDefArr = [
        {
          title: "",
          optionId: 1,
          isSelect: false,
        },
        {
          title: "",
          optionId: 2,
          isSelect: false,
        },
      ];
      targetQuestion.options = trueFalseDefArr;
      targetQuestion.isTrueFalse = true;
      existingQuestions[index] = targetQuestion;
      setFormValues({ ...formValues, questions: existingQuestions });
    } else {
      const trueFalseDefArr = [
        {
          title: "",
          optionId: 1,
          isSelect: false,
        },
        {
          title: "",
          optionId: 2,
          isSelect: false,
        },
        {
          title: "",
          optionId: 3,
          isSelect: false,
        },
        {
          title: "",
          optionId: 4,
          isSelect: false,
        },
      ];
      targetQuestion.options = trueFalseDefArr;
      targetQuestion.isTrueFalse = false;
      existingQuestions[index] = targetQuestion;
      setFormValues({ ...formValues, questions: existingQuestions });
    }
  };

  const reInsertHTML = (index, index_c) => {
    var fileInput = document.getElementById(`file[${index}][${index_c}]`);
    var parent = fileInput.parentElement;
    var next = fileInput.nextSibling;
    parent.removeChild(fileInput);

    var newFileInput = document.createElement("input");
    newFileInput.type = "file";
    newFileInput.id = `file[${index}][${index_c}]`;
    newFileInput.accept = "image/*";
    newFileInput.name = "file";
    newFileInput.style.display = "none";
    newFileInput.addEventListener("change", (e) => loadFile(e, index, index_c));

    parent.insertBefore(newFileInput, next);
  };

  const removeImage = (index, index_c) => {
    const existingQuestions = formValues.questions;
    delete existingQuestions[index].options[index_c].option_url;
    delete existingQuestions[index].options[index_c].file;
    setFormValues({ ...formValues, questions: existingQuestions });
    reInsertHTML(index, index_c);
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
                  `${SUPER_ADMIN_VIEW_QUESTIONS_PAGE}/${params?.id}/Theory`
                )
              }
            />
            <div className="heading-text">Add Question</div>
          </div>
        </div>
        <div className="view-list-btn">
          <button
            className="view-list-btn-text"
            onClick={() =>
              navigate(`${SUPER_ADMIN_BULK_UPLOAD_QUESTION}/${params?.id}`)
            }
          >
            <ListOutlinedIcon
              sx={{ fontSize: "20px", color: "#FFFFFF", mr: 1 }}
            />
            Bulk Upload
          </button>
        </div>
      </div>
      {/* =====[ Dynamic Questions start]========================== */}
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
                      style={{ width: "calc(35% - 10px)" }}
                      className="form-group"
                    >
                      <SelectInput
                        name={`difficulty_level${index}`}
                        label="Difficulty level"
                        placeHolder={"Select Difficulty Level"}
                        value={formValues?.questions[index].difficulty_level}
                        handleChange={(e) => changeHandlerDifficulty(e, index)}
                        options={ASSESEMENT_LEVEL}
                        error={errors?.[`difficulty_level${index}`]}
                        mandatory
                      />
                    </div>
                    <div
                      style={{ width: "calc(30% - 10px)" }}
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
                    <div className="formSwitch_toggle_wrapper">
                      <label className="MuiInputLabel-root input-label">
                        True/False
                      </label>
                      <FormSwitch
                        // value={item.status === "active" ? true : false}
                        onChange={(e) => handleTrueFalse(e, index)}
                      />
                    </div>
                  </div>
                  <div className="options_box">
                    {formValues.questions[index].options.map((el, index_c) => {
                      return (
                        <div key={index_c}>
                          <div className="option_card">
                            <div className="option_title">
                              <h1>Option {index_c + 1}</h1>
                            </div>
                            <div className="option_content">
                              <Input
                                type={"radio"}
                                idName="options_radio"
                                onChange={(e) => radioChecked(e, index)}
                                name={`rad-${index}`}
                                value={lowercaseAlphabets[index_c]}
                                error={errors?.[`rad-${index}`]}
                              />
                              <div className="option_textInputBox">
                                <Input
                                  type="text"
                                  name={`${index}${index_c}`}
                                  placeholder="Enter Option"
                                  onChange={(e) =>
                                    changeHandlerOptions(e, index, index_c)
                                  }
                                  value={
                                    formValues?.questions[`${index}`].options[
                                      `${index_c}`
                                    ].title
                                  }
                                  onFocus={focusHandler}
                                  error={errors?.[`${index}+${index_c}`]}
                                />
                              </div>
                              <div className="option_upload">
                                <div style={{ display: "none" }}>
                                  <input
                                    type="file"
                                    accept="image/jpg, image/jpeg, image/png"
                                    name="image"
                                    id={`file[${index}][${index_c}]`}
                                    onChange={(e) =>
                                      loadFile(
                                        e,
                                        imageLocation[0],
                                        imageLocation[1]
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <label htmlFor={`file[${index}][${index_c}]`}>
                                    {
                                      <ImageIcon
                                        onClick={(e) =>
                                          loadFile(e, index, index_c)
                                        }
                                      />
                                    }
                                  </label>
                                </div>
                                <div>
                                  {
                                    <DeleteIcon
                                      onClick={() =>
                                        deleteOptionHandler(index, index_c)
                                      }
                                    />
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="option_image_container">
                              {imgURL && (
                                <div className="image_outline">
                                  <img
                                    src={
                                      formValues?.questions[`${index}`].options[
                                        `${index_c}`
                                      ].option_url
                                    }
                                  />
                                  <span
                                    className="close_wrapper"
                                    onClick={() => removeImage(index, index_c)}
                                    style={{
                                      display: [
                                        formValues?.questions[`${index}`]
                                          .options[`${index_c}`].option_url
                                          ? ""
                                          : "none",
                                      ],
                                    }}
                                  >
                                    <CloseIcon width={20} />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="add_options_box">
                    <Button
                      className={`outlined-btn`}
                      variant="outlined"
                      startIcon={<PlusIcon />}
                      onClick={() => addNewOptionHandler(index)}
                      sx={{
                        width: "180px",
                        height: "42px",
                        textTransform: "unset",
                        display: [
                          formValues?.questions[`${index}`]?.isTrueFalse
                            ? "none"
                            : "",
                        ],
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      })}
      {/* ======[ Dynamic Questions ends]========================= */}

      <div className="add_new_questionBox" style={{ marginTop: 30 }}>
        <Button
          className={`outlined-btn`}
          variant="outlined"
          startIcon={<PlusIconLarge />}
          onClick={addNewQuestionHandler}
        >
          Add New Question
        </Button>
      </div>

      <div className="button_box">
        <Button
          className={`light-blue-btn submit-btn`}
          variant="contained"
          onClick={handleSubmit}
          disabled={loading ? true : false}
        >
          {loading ? <PulseLoader size="10px" color="white" /> : "Submit"}
        </Button>

        <Button
          className={`outlined-btn`}
          variant="outlined"
          onClick={cancelHandler}
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
