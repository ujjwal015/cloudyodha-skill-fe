import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createInstructionApi } from "../../../../api/superAdminApi/instructions";
import validateField from "../../../../utils/validateField";
import { INSTRUCTIONS_LIST } from "../../../../config/constants/routePathConstants/superAdmin";
import { INSTRUCTION_LANGUAGES } from "../../../../config/constants/projectConstant";

// Configure Quill fonts
const Quill = ReactQuill.Quill;
var Font = Quill.import("formats/font");
Font.whitelist = ["Ubuntu", "Calibri", "Algerian"];
Quill.register(Font, true);

const initialFormValues = {
  instructionName: "",
  selectedLanguage: "english",
  hindiInstructionText: "",
  englishInstructionText: "",
};

const InstructionDialog = ({ open, onClose, navigate }) => {
  const dispatch = useDispatch();
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
    onClose();
    navigate && navigate(INSTRUCTIONS_LIST);
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

      const payload = {
        instructions: [
          {
            language: formData?.language,
            description: formData?.descriptionEnglish,
          },
        ],
        instructionName: formData?.instructionName,
      };

      dispatch(
        createInstructionApi(payload, setLoading, clearFormValues, navigate)
      );
    }
  };

  const modules = {
    toolbar: [
      ["undo", "redo"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
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
  ];

  if (loading) {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress color="primary" />
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eaeaea",
          padding: "16px 24px",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="500">
            Add Secondary Instruction
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create a multiple Instruction Form here.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box component="form" noValidate>
          <Box mb={3}>
            <Typography variant="body1" fontWeight="500" mb={1}>
              Instruction Name{" "}
              <Box component="span" color="error.main">
                *
              </Box>
            </Typography>
            <TextField
              fullWidth
              name="instructionName"
              value={instructionName}
              onChange={changeHandler}
              onFocus={focusHandler}
              onBlur={blurHandler}
              error={!!errors?.instructionName}
              helperText={errors?.instructionName}
              placeholder="Enter instruction name"
              variant="outlined"
              size="medium"
              InputProps={{
                sx: { borderRadius: "8px" },
              }}
            />
          </Box>

          <Box mb={3}>
            <Typography variant="body1" fontWeight="500" mb={1}>
              Language
            </Typography>
            <FormControl fullWidth error={!!errors?.selectedLanguage} disabled>
              <Select
                name="selectedLanguage"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                displayEmpty
                variant="outlined"
                sx={{ borderRadius: "8px" }}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography color="text.secondary">Select</Typography>
                    );
                  }
                  return selected.charAt(0).toUpperCase() + selected.slice(1);
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 224 },
                  },
                }}
              >
                {INSTRUCTION_LANGUAGES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors?.selectedLanguage && (
                <FormHelperText>{errors.selectedLanguage}</FormHelperText>
              )}
            </FormControl>
          </Box>

          <Box mb={3}>
            <Typography variant="body1" fontWeight="500" mb={1}>
              Instruction{" "}
              <Box component="span" color="error.main">
                *
              </Box>
            </Typography>
            <Box
              sx={{
                border:
                  errors?.hindiInstructionText || errors?.englishInstructionText
                    ? "1px solid #d32f2f"
                    : "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                ".ql-toolbar": {
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "1px solid #e0e0e0",
                  borderRadius: "0",
                },
                ".ql-container": {
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  minHeight: "200px",
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                },
                ".ql-editor": {
                  minHeight: "200px",
                },
              }}
            >
              <ReactQuill
                ref={
                  selectedLanguage === "hindi" || selectedLanguage === "both"
                    ? quillHindiRef
                    : quillEnglishRef
                }
                theme="snow"
                value={
                  selectedLanguage === "hindi" || selectedLanguage === "both"
                    ? formValues.hindiInstructionText
                    : formValues.englishInstructionText
                }
                onChange={(content) =>
                  handleTextChange(
                    content,
                    selectedLanguage === "hindi" ? "hindi" : "english"
                  )
                }
                modules={modules}
                formats={format}
                placeholder="Enter instructions here..."
              />
            </Box>
            {(errors?.hindiInstructionText ||
              errors?.englishInstructionText) && (
              <FormHelperText error>
                {errors?.hindiInstructionText || errors?.englishInstructionText}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </DialogContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          p: 3,
          borderTop: "1px solid #eaeaea",
        }}
      >
        <Button
          variant="outlined"
          onClick={clearFormValues}
          sx={{
            minWidth: "100px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 400,
            color: "text.primary",
            borderColor: "#e0e0e0",
            "&:hover": {
              borderColor: "#bdbdbd",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            minWidth: "100px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 400,
            backgroundColor: "#0d6efd",
            "&:hover": {
              backgroundColor: "#0b5ed7",
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Add"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default InstructionDialog;
