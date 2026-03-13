import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import validateField from "../../../../utils/validateField";
import Input from "../../../../components/common/input";
import "./quill.style.css";
import "../../userManagement/users/users.style.css";
import { ReactComponent as ArrowLeft } from "../../../../assets/icons/chevron-left.svg";
import { FadeLoader, RotateLoader } from "react-spinners";
import { createInstructionApi } from "../../../../api/superAdminApi/instructions";
import SubmitButton from "../../../../components/SubmitButton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SelectInput from "../../../../components/common/SelectInput";
import { INSTRUCTION_LANGUAGES } from "../../../../config/constants/projectConstant";
import { useRef } from "react";
import { INSTRUCTIONS_LIST } from "../../../../config/constants/routePathConstants/superAdmin";
const Quill = ReactQuill.Quill;
var Font = Quill.import("formats/font");
Font.whitelist = ["Ubuntu", "Calibri", "Algerian"];
Quill.register(Font, true);
const initialFormValues = {
  instructionName: "",
  selectedLanguage: "",
  hindiInstructionText: "",
  englishInstructionText: "",
};

const CreateInstruction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quillHindiRef = useRef(null);
  const quillEnglishRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const { instructionName, selectedLanguage } = formValues;

  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    const selectedValue = value;
    const fieldError = validateField(name, selectedValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError || undefined,
      ...(selectedLanguage === "Hindi" && { englishInstructionText: "" }),
      ...(selectedLanguage === "English" && { hindiInstructionText: "" }),
    }));

    if (selectedValue === "both") {
      setSelectedLanguages(["hindi", "english"]);
    } else {
      setSelectedLanguages([selectedValue]);
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: selectedValue,
    }));
  };

  const handleTextChange = (content, language) => {
    const fieldValue = content;
    const fieldError = validateField(`${language}InstructionText`, fieldValue);
    if (
      content === "<p><br></p>" &&
      `${language}InstructionText` === "hindiInstructionText"
    ) {
      formValues.hindiInstructionText = "";
      errors.hindiInstructionText = fieldError;
    } else if (
      content === "<p><br></p>" &&
      `${language}InstructionText` === "englishInstructionText"
    ) {
      formValues.englishInstructionText = "";
      errors.englishInstructionText = fieldError;
    } else {
      setFormValues({
        ...formValues,
        [`${language}InstructionText`]: fieldValue,
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${language}InstructionText`]: fieldError,
      }));
    }
  };

  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const fieldError = validateField(name, fieldValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: fieldValue,
    }));
  };

  const focusHandler = (event) => {
    setFocusedInput(event.target.name);
  };

  const blurHandler = () => {
    setFocusedInput("");
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
    setSelectedLanguages([]);
    navigate(INSTRUCTIONS_LIST);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    const instructionNameError = validateField(
      "instructionName",
      formValues?.instructionName
    );
    if (instructionNameError) {
      formErrors.instructionName = instructionNameError;
    }
    const selectedLanguageError = validateField(
      "selectedLanguage",
      formValues?.selectedLanguage
    );
    if (selectedLanguageError) {
      formErrors.selectedLanguage = selectedLanguageError;
    }

    if (formValues.selectedLanguage === "both") {
      const hindiInstructionTextError = validateField(
        "hindiInstructionText",
        formValues?.hindiInstructionText
      );
      const englishInstructionTextError = validateField(
        "englishInstructionText",
        formValues?.englishInstructionText
      );

      if (englishInstructionTextError || hindiInstructionTextError) {
        formErrors.englishInstructionText = englishInstructionTextError;
        formErrors.hindiInstructionText = hindiInstructionTextError;
      }
    } else if (formValues.selectedLanguage === "hindi") {
      const hindiInstructionTextError = validateField(
        "hindiInstructionText",
        formValues?.hindiInstructionText
      );
      if (hindiInstructionTextError) {
        formErrors.hindiInstructionText = hindiInstructionTextError;
      }
    } else if (formValues.selectedLanguage === "english") {
      const englishInstructionTextError = validateField(
        "englishInstructionText",
        formValues?.englishInstructionText
      );
      if (englishInstructionTextError) {
        formErrors.englishInstructionText = englishInstructionTextError;
      }
    }

    setErrors(formErrors);

    if (
      Object.keys(formErrors).length === 0 &&
      (formValues.selectedLanguage === "both" ||
        (formValues.selectedLanguage === "hindi" &&
          formValues.hindiInstructionText !== "") ||
        (formValues.selectedLanguage === "english" &&
          formValues.englishInstructionText !== ""))
    ) {
      setLoading(true);
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
      let formData = {
        instructionName: formValues.instructionName,
        language: capitalizeFirstLetter(formValues.selectedLanguage),
      };
      if (formValues.selectedLanguage === "hindi") {
        formData.descriptionHindi = formValues.hindiInstructionText;
      } else if (formValues.selectedLanguage === "english") {
        formData.descriptionEnglish = formValues.englishInstructionText;
      } else {
        formData.descriptionHindi = formValues.hindiInstructionText;
        formData.descriptionEnglish = formValues.englishInstructionText;
      }
      dispatch(
        createInstructionApi(formData, setLoading, clearFormValues, navigate)
      );
    }
  };

  const format = [
    "header",
    "font",
    "background",
    "color",
    "code",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "script",
    "align",
    "direction",
    "link",
    "image",
    "code-block",
    "formula",
    "video",
    "hindi",
  ];

  const modules = {
    clipboard: {
      matchVisual: false,
    },
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // header dropdown
      [{ font: [] }], // font family
      [{ color: [] }, { background: [] }], // dropdown with defaults
      ["bold", "italic", "underline", "strike"], // toggled buttons
      [{ align: [] }], // text align
      // ['blockquote', 'code-block'],                    // blocks
      // [{ 'header': 1 }, { 'header': 2 }],              // custom button values
      [{ list: "ordered" }, { list: "bullet" }], // lists
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      // [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
      // [{ 'direction': 'rtl' }],                        // text direction
      // [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ "code-block": "code" }],
      ["clean"], // remove formatting
    ],
  };
  const styles = {
    hindi: {
      border: Object.keys(errors).includes("hindiInstructionText")
        ? "solid  #d70000 1px"
        : "",
      borderRadius: Object.keys(errors).includes("hindiInstructionText")
        ? "5px 5px 0px 0px"
        : "",
    },
    english: {
      border: Object.keys(errors).includes("englishInstructionText")
        ? "solid  #d70000 1px"
        : "",
      borderRadius: Object.keys(errors).includes("englishInstructionText")
        ? "5px 5px 0px 0px"
        : "",
    },
  };

  return (
    <div className="main-content">
      {loading ? (
        <div className="loader_container">
          {/* <RotateLoader size={50} margin={100} color="#2ea8db" /> */}
          <FadeLoader color="#2ea8db" />
        </div>
      ) : (
        <>
          <div className="title">
            <h1>
              <ArrowLeft onClick={() => navigate(-1)} />
              <span>Add Instruction</span>
            </h1>
          </div>

          <section className="sub-admin-wrapper">
            <div className="tab-content">
              <div className="edit-profile" style={{ display: "block" }}>
                <div className="form-wrapper user-role-tb">
                  <h2>Instruction Form</h2>
                  <div className="flex-form">
                    <div className="form-group">
                      <Input
                        label="Instruction Name"
                        type="text"
                        name="instructionName"
                        placeholder="Enter instruction name"
                        onBlur={blurHandler}
                        onChange={changeHandler}
                        error={errors?.instructionName}
                        onFocus={focusHandler}
                        value={instructionName}
                        mandatory
                      />
                    </div>

                    <div className="form-group">
                      <SelectInput
                        name="selectedLanguage"
                        label="Language"
                        placeHolder="Select language"
                        options={INSTRUCTION_LANGUAGES}
                        value={selectedLanguage}
                        handleChange={handleLanguageChange}
                        error={errors?.selectedLanguage}
                        mandatory
                      />
                    </div>
                    {selectedLanguages.includes("hindi") && (
                      <div className="form-group-full">
                        <ReactQuill
                          ref={quillHindiRef}
                          name="hindiInstructionText"
                          theme="snow"
                          value={formValues?.hindiInstructionText}
                          onChange={(content) =>
                            handleTextChange(content, "hindi")
                          }
                          modules={modules}
                          formats={format}
                          error={errors?.hindiInstructionText}
                          bounds={".app"}
                          placeholder={"निर्देश यहाँ से लिखें..."}
                          // style={styles.hindi}
                        />
                        <p className="error-input">
                          {errors?.hindiInstructionText}
                        </p>
                      </div>
                    )}
                    {selectedLanguages.includes("english") && (
                      <div className="form-group-full">
                        <ReactQuill
                          ref={quillEnglishRef}
                          name="englishInstructionText"
                          theme="snow"
                          value={formValues?.englishInstructionText}
                          modules={modules}
                          formats={format}
                          error={errors?.englishInstructionText}
                          onChange={(content) =>
                            handleTextChange(content, "english")
                          }
                          bounds={".app"}
                          placeholder={"Enter instructions from here..."}
                          // style={styles.english}
                        />
                        <p className="error-input">
                          {errors?.englishInstructionText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <SubmitButton
            cancelBtnText="Cancel"
            submitBtnText="Submit"
            handleSubmit={handleSubmit}
            clearFormValues={clearFormValues}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default CreateInstruction;
