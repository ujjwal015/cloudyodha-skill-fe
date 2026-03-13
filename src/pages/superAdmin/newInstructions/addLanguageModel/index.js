import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Chip,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import {
  createInstructionApi,
  getSingleInstructionDetailApi,
} from "../../../../api/superAdminApi/instructions";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { availableLanguages } from "../../../../utils/projectHelper";

const initialFormValues = {
  instructionName: "",
  languageEntries: [{ language: "", description: "" }],
  primaryDescription: "",
};

const AddLanguageModel = ({ open, onClose, instructionId, navigate }) => {
  const dispatch = useDispatch();
  const primaryQuillRef = useRef(null);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("");
  const [errors, setErrors] = useState({});
  const [textCopied, setTextCopied] = useState(false);
  const [initialLanguages, setInitialLanguages] = useState([]);
  const [newLanguages, setNewLanguages] = useState([]);
  const [removedLanguages, setRemovedLanguages] = useState([]);

  const fetchInstructionDetails = useCallback(() => {
    setLoading(true);
    dispatch(
      getSingleInstructionDetailApi(
        setLoading,
        setFormValues,
        instructionId,
        setInitialLanguages
      )
    );
  }, [dispatch, instructionId]);

  useEffect(() => {
    if (open && instructionId) {
      fetchInstructionDetails();
    }
  }, [open, instructionId, fetchInstructionDetails]);

  const handleAddLang = (selectedLanguages) => {
    const lowercaseSelected = selectedLanguages?.map((lang) =>
      lang.toLowerCase()
    );

    const existingLanguages = initialLanguages?.map((lang) => lang.language);
    existingLanguages.push("english");

    const validNewLanguages = lowercaseSelected?.filter(
      (lang) => !existingLanguages?.includes(lang)
    );

    const addedLanguages = validNewLanguages?.filter(
      (lang) => !newLanguages?.some((entry) => entry.language === lang)
    );

    const removed = newLanguages?.filter(
      (entry) => !validNewLanguages?.includes(entry.language)
    );

    const addedEntries = addedLanguages?.map((lang) => ({
      language: lang,
      description: "",
    }));

    setNewLanguages((prev) => [
      ...prev?.filter((entry) => validNewLanguages?.includes(entry.language)),
      ...addedEntries,
    ]);

    setFormValues((prev) => ({
      ...prev,
      languageEntries: [
        ...prev?.languageEntries?.filter(
          (entry) =>
            entry.language === "english" ||
            existingLanguages?.includes(entry.language) ||
            validNewLanguages?.includes(entry.language)
        ),
        ...addedEntries,
      ],
    }));

    removed?.forEach((entry) => {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[`description-${entry.language}`];
        delete updated[`language-${entry.language}`];
        return updated;
      });
    });
  };

  const handleQuillChange = (lang, content) => {
    const updatedEntries = formValues.languageEntries.map((entry) =>
      entry.language === lang ? { ...entry, description: content } : entry
    );
    setFormValues((prev) => ({
      ...prev,
      languageEntries: updatedEntries,
    }));
  };

  const handleCopyQuillText = () => {
    const editorContent = primaryQuillRef.current?.getEditor().root.innerText;
    if (editorContent) {
      navigator.clipboard.writeText(editorContent).then(() => {
        setTextCopied(true);
        setTimeout(() => setTextCopied(false), 2500);
      });
    }
  };

  const validateLanguages = () => {
    const newErrors = {};

    const activeNewLanguages = newLanguages.filter(
      (lang) => !removedLanguages.includes(lang.language)
    );

    const isOnlyRemoving =
      activeNewLanguages.length === 0 && removedLanguages.length > 0;

    if (!isOnlyRemoving && activeNewLanguages.length === 0) {
      newErrors.languageEntries = "Please add at least one language";
    }

    if (!isOnlyRemoving) {
      activeNewLanguages.forEach((entry) => {
        const matchingEntry = formValues.languageEntries.find(
          (item) => item.language === entry.language
        );

        if (!entry.language) {
          newErrors[`language-${entry.language}`] = "Language is required";
        }

        if (!matchingEntry?.description?.trim()) {
          newErrors[`description-${entry.language}`] =
            "Instruction is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRemoveLanguage = (language) => {
    if (language.toLowerCase() === "english") return;

    setInitialLanguages((prev) =>
      prev.filter((entry) => entry.language !== language)
    );
    setNewLanguages((prev) =>
      prev.filter((entry) => entry.language !== language)
    );

    setFormValues((prev) => ({
      ...prev,
      languageEntries: prev.languageEntries.filter(
        (entry) => entry.language !== language
      ),
    }));

    setRemovedLanguages((prev) =>
      prev.includes(language) ? prev : [...prev, language]
    );

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[`description-${language}`];
      delete updated[`language-${language}`];
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateLanguages()) return;

    const instructions = formValues.languageEntries
      .filter(
        (entry) =>
          newLanguages.some((nl) => nl.language === entry.language) &&
          !removedLanguages.includes(entry.language)
      )
      .map((entry) => ({
        language:
          entry.language?.charAt(0)?.toUpperCase() + entry.language?.slice(1),
        description: entry.description,
      }));

    const formData = {
      instructionListId: instructionId,
      instructionName: formValues.instructionName,
      instructions,
      ...(removedLanguages.length > 0 && {
        languagesToDelete: removedLanguages,
      }),
    };

    setLoading(true);
    dispatch(createInstructionApi(formData, setLoading, clearFormValues));
  };

  const clearFormValues = () => {
    setFormValues(initialFormValues);
    onClose();
    setCurrentLanguage("");
    setNewLanguages([]);
  };

  const modules = {
    toolbar: [
      ["undo", "redo"],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "code-block",
  ];

  return (
    <Dialog
      open={open}
      onClose={clearFormValues}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: "90vh", borderRadius: "8px" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <Box>
          <Typography variant="h6">
            Add Multiple Language Instructions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add instructions in multiple languages dynamically.
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Box mb={3}>
              <Typography fontWeight={500}>Instruction Name</Typography>
              <TextField
                fullWidth
                name="instructionName"
                value={formValues.instructionName}
                disabled
                error={!!errors?.instructionName}
                helperText={errors?.instructionName}
                sx={{ mt: 1 }}
              />
            </Box>

            <Box mb={3}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography fontWeight={500}>English Instruction</Typography>
                {textCopied ? (
                  <FileCopyIcon fontSize="small" />
                ) : (
                  <ContentCopyIcon
                    onClick={handleCopyQuillText}
                    cursor="pointer"
                    fontSize="small"
                  />
                )}
              </Box>
              <ReactQuill
                ref={primaryQuillRef}
                value={formValues.primaryDescription}
                readOnly
              />
            </Box>

            <Box mb={2}>
              <Typography fontWeight={500}>Add Language</Typography>
              <Box display="flex" gap={2} mt={1}>
                <FormControl fullWidth>
                  <InputLabel>Select Languages</InputLabel>
                  <Select
                    multiple
                    value={newLanguages?.map((l) => l.language)}
                    onChange={(e) => {
                      const selected = e.target.value;
                      handleAddLang(selected);
                    }}
                    label="Select Languages"
                    renderValue={(selected) =>
                      selected
                        ?.map(
                          (lang) => lang?.charAt(0)?.toUpperCase() + lang?.slice(1)
                        )
                        ?.join(", ")
                    }
                  >
                    {availableLanguages?.map((lang) => {
                      const langLower = lang.toLowerCase();

                      const isInitialLang = initialLanguages?.some(
                        (entry) => entry.language === langLower
                      );

                      const isNewLang = newLanguages?.some(
                        (entry) => entry.language === langLower
                      );

                      const isEnglish = langLower === "english";

                      const isSelected =
                        isInitialLang || isNewLang || isEnglish;
                      const isDisabled = isInitialLang || isEnglish;

                      return (
                        <MenuItem
                          key={lang}
                          value={langLower}
                          disabled={isDisabled}
                        >
                          <Checkbox checked={isSelected} />
                          <ListItemText
                            primary={lang}
                            secondary={
                              isInitialLang || isEnglish ? "Already added" : ""
                            }
                          />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
              {errors.languageEntries && (
                <FormHelperText error>{errors?.languageEntries}</FormHelperText>
              )}
            </Box>

            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              <Chip label="English" />

              {initialLanguages?.map((entry) => (
                <Chip
                  key={entry.language}
                  label={
                    entry.language?.charAt(0)?.toUpperCase() +
                    entry.language?.slice(1)
                  }
                  onDelete={() => handleRemoveLanguage(entry.language)}
                />
              ))}

              {newLanguages?.map((entry) => (
                <Chip
                  key={entry.language}
                  label={
                    entry.language?.charAt(0)?.toUpperCase() +
                    entry.language?.slice(1)
                  }
                  onDelete={() => handleRemoveLanguage(entry.language)}
                />
              ))}
            </Box>

            {newLanguages.map((entry, idx) => {
              const langEntry = formValues.languageEntries.find(
                (e) => e.language === entry.language
              );

              return (
                <Box key={entry.language} mb={4}>
                  <Typography fontWeight={500} mb={1}>
                    {entry.language?.charAt(0)?.toUpperCase() +
                      entry.language?.slice(1)}{" "}
                    Instruction
                  </Typography>
                  <Box
                    sx={{
                      border: errors[`description-${entry.language}`]
                        ? "1px solid #d32f2f"
                        : "1px solid #e0e0e0",
                      borderRadius: "8px",
                      overflow: "hidden",
                      mb: 1,
                    }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={langEntry?.description || ""}
                      modules={modules}
                      formats={formats}
                      onChange={(val) => handleQuillChange(entry.language, val)}
                      placeholder="Enter instruction..."
                    />
                  </Box>
                  {errors[`description-${entry.language}`] && (
                    <FormHelperText error>
                      {errors[`description-${entry.language}`]}
                    </FormHelperText>
                  )}
                </Box>
              );
            })}

            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button variant="outlined" onClick={clearFormValues}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddLanguageModel;
