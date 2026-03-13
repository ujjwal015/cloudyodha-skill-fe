import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import "./style.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FadeLoader } from "react-spinners";
import Input from "../../../../components/common/input";
import {
  getSingleInstructionDetailApi,
  updateInstructionDetailsApi,
} from "../../../../api/superAdminApi/instructions";
import validateField from "../../../../utils/validateField";
import SubmitButton from "../../../../components/SubmitButton";

// Configure Quill fonts
const Quill = ReactQuill.Quill;
var Font = Quill.import("formats/font");
Font.whitelist = ["Ubuntu", "Calibri", "Algerian"];
Quill.register(Font, true);

const initialFormValues = {
  instructionName: "",
  instructionListId: "",
  instructionsByLanguage: {},
};

const EditInstructionModal = ({
  isOpen,
  onClose,
  instructionId,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const quillInstructionTextRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [instructionsData, setInstructions] = useState();

  useEffect(() => {
    if (isOpen && instructionId) {
      fetchInstructionDetails();
    }
  }, [isOpen, instructionId]);

  const fetchInstructionDetails = () => {
    setLoading(true);
    dispatch(
      getSingleInstructionDetailApi(
        setLoading,
        setFormValues,
        instructionId,
        setSelectedLanguages,
        setInstructions
      )
    );
  };

  useEffect(() => {
    if (instructionsData) {
      const initialValues = {
        instructionName: instructionsData?.instructionName || "",
        instructionListId: instructionsData?._id || "",
        instructionsByLanguage: {},
      };

      instructionsData?.instructions?.forEach((item) => {
        initialValues.instructionsByLanguage[item.language?.toLowerCase()] = {
          instructionDescription: item.instructionDescription || "",
        };
      });

      setFormValues(initialValues);
    }
  }, [instructionsData]);

  const handleQuillChange = (value, language) => {
    const cleanedValue = value === "<p><br></p>" ? "" : value;
    const langKey = language?.toLowerCase();

    const error = validateField("instructionText", cleanedValue);

    setFormValues((prev) => ({
      ...prev,
      instructionsByLanguage: {
        ...prev.instructionsByLanguage,
        [langKey]: {
          ...(prev.instructionsByLanguage?.[langKey] || {}),
          instructionDescription: cleanedValue,
        },
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [`instructionText-${langKey}`]: error,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};

    if (!formValues.instructionName) {
      formErrors.instructionName = "Instruction name is required";
    }

    selectedLanguages.forEach(({ language }) => {
      const value = formValues.instructionsByLanguage?.[language] || "";
      const error = validateField("instructionText", value);
      if (error) {
        formErrors[`instructionText-${language}`] = error;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      const payload = {
        instructionName: formValues.instructionName,
        instructionListId: formValues?.instructionListId,
        instructions: instructionsData?.instructions?.map(
          ({ language, _id }) => ({
            _id,
            language,
            instructionDescription:
              formValues.instructionsByLanguage?.[language.toLowerCase()]
                ?.instructionDescription,
          })
        ),
      };

      dispatch(
        updateInstructionDetailsApi(
          payload,
          setLoading,
          formValues?.instructionListId,
          () => {
            clearFormValues();
            onSuccess && onSuccess();
          }
        )
      );
    }
  };

  const clearFormValues = () => {
    setFormValues({ instructionName: "", instructionsByLanguage: {} });
    setSelectedLanguages([]);
    onClose();
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
  };

  if (!isOpen) return null;

  const inlineStyle = {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "13px",
    lineHeight: 1.3,
    textTransform: "capitalize",
    color: "#231f20",
    opacity: 0.8,
    marginTop: "8px",
  };

  return (
    <div className="instruction-modal-overlay">
      <div className="instruction-modal-container">
        <div className="instruction-modal-header">
          <h2>Edit Instructions</h2>
          <button onClick={onClose} className="instruction-close-button">
            ×
          </button>
        </div>
        {loading ? (
          <div className="instruction-loader-container">
            <FadeLoader color="#2ea8db" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="instruction-modal-content">
            <div className="instruction-form-field">
              <Input
                label="Instruction Name"
                type="text"
                name="instructionName"
                placeholder="Enter instruction name"
                value={formValues.instructionName}
                onChange={handleInputChange}
                error={errors.instructionName}
                mandatory={true}
              />
            </div>

            {instructionsData?.instructions?.map(({ language }) => {
              const langKey = language.toLowerCase();
              const value =
                formValues.instructionsByLanguage?.[langKey]
                  ?.instructionDescription || "";

              return (
                <div key={langKey} className="instruction-form-field">
                  <label style={inlineStyle}>
                    Instruction ({language}){" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={(val) => handleQuillChange(val, language)}
                    modules={modules}
                  />
                  {errors[`instructionText-${langKey}`] && (
                    <p className="instruction-error-message">
                      {errors[`instructionText-${langKey}`]}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="instruction-modal-footer">
              <SubmitButton
                cancelBtnText="Cancel"
                submitBtnText="Save"
                handleSubmit={handleSubmit}
                clearFormValues={clearFormValues}
                loading={loading}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditInstructionModal;
