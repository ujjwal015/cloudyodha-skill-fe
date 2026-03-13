import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Paper,
  Container,
  Divider,
} from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import BreadCrumbs from "../../../../components/common/Breadcrumbs";
import PageTitle from "../../../../components/common/PageTitle";
import { getSingleInstructionDetailPreviewApi } from "../../../../api/superAdminApi/instructions";
import { useDispatch } from "react-redux";
import { instructionsData } from "../../../../utils/projectHelper";

const InstructionsView = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [customInstructions, setCustomInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generalIns, setGeneralIns] = useState({});
  console.log("generalIns", generalIns);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { instructionId } = useParams();
  const [formValues, setFormValues] = useState();
  const [currentLanguageData, setCurrentLanguageData] = useState({});

  // Available languages from instructionsData
  const availableLanguages = formValues?.map(
    (item) =>
      item?.language?.charAt(0)?.toLowerCase() + item?.language?.slice(1)
  );

  const handleBreadCrumbClick = (event, name, path) => {
    event.preventDefault();
    path && navigate(path);
  };

  const breadCrumbsData = [
    {
      name: "Content Management",
      isLink: true,
      key: "1",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "Instructions",
      isLink: false,
      key: "2",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
  ];

  const createInstructionItems = () => {
    const items = [];

    currentLanguageData?.sections?.forEach((section, index) => {
      items?.push({
        id: index + 1,
        text: section,
      });
    });

    currentLanguageData?.statuses?.forEach((status) => {
      items?.push({
        id: `status-${status.id}`,
        text: status.text,
        status: parseInt(status.id),
      });
    });

    currentLanguageData?.additional?.forEach((additional, index) => {
      items?.push({
        id: items.length + 1,
        text: additional,
      });
    });

    currentLanguageData?.format?.forEach((format, index) => {
      items?.push({
        id: `format-${index + 1}`,
        text: format,
      });
    });

    currentLanguageData?.conclusion?.forEach((conclusion, index) => {
      items?.push({
        id: items.length + 1,
        text: conclusion,
      });
    });

    return items;
  };
  const handleLanguageChange = (event) => {
    const { value } = event.target;
    setSelectedLanguage(value);
    const data = formValues
      ?.filter(
        (item) =>
          item?.language === value.charAt(0).toUpperCase() + value.slice(1)
      )
      .map((item, index) => ({
        id: index,
        text: item?.instructionDescription,
      }));
    setCustomInstructions(data);
  };

  const fetchInstructionDetails = () => {
    setLoading(true);
    dispatch(
      getSingleInstructionDetailPreviewApi(
        setLoading,
        setFormValues,
        instructionId,
        setGeneralIns
      )
    );
  };

  useEffect(() => {
    fetchInstructionDetails();
  }, []);

  useEffect(() => {
    const data = formValues
      ?.filter(
        (item) =>
          item?.language ===
          selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
      )
      .map((item, index) => ({
        id: index,
        text: item?.instructionDescription,
      }));

    setCustomInstructions(data);

    const currentLanguageData = instructionsData[selectedLanguage];
    setCurrentLanguageData(currentLanguageData);
  }, [selectedLanguage, formValues]);

  const renderStatusCircle = (status) => {
    const colors = {
      1: "#c0c0c0",
      2: "#4caf50",
      3: "#f44336",
      5: "#9c27b0",
    };

    return (
      <Box
        component="span"
        className="status-circle"
        sx={{
          backgroundColor: colors[status] || "#c0c0c0",
        }}
      >
        {status}
      </Box>
    );
  };

  const renderInstructionItem = (instruction, index) => {
    const isSubItem =
      typeof instruction.id === "string" &&
      (instruction.id.includes(".") ||
        instruction.id.includes("status") ||
        instruction.id.includes("format"));

    return (
      <Box
        key={instruction.id}
        className={`instruction-item ${isSubItem ? "sub-instruction" : ""}`}
      >
        {instruction.status ? (
          renderStatusCircle(instruction.status)
        ) : (
          <Typography
            variant="body1"
            component="span"
            className="instruction-number"
          >
            {!isSubItem ? `${index + 1}.` : ""}
          </Typography>
        )}
        <Typography
          variant="body1"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          {instruction.text}
        </Typography>
      </Box>
    );
  };
  const renderCustomInstructionItem = (instruction, index) => {
    const isSubItem =
      typeof instruction.id === "string" && instruction.id.includes(".");

    return loading ? (
      <>
        <p>...Please wait</p>
      </>
    ) : (
      <Box
        key={instruction.id}
        className={`instruction-item ${isSubItem ? "sub-instruction" : ""}`}
      >
        {instruction.status ? (
          renderStatusCircle(instruction.status)
        ) : (
          <Typography
            variant="body1"
            component="span"
            className="instruction-number"
          >
            {`${index + 1}.`}
          </Typography>
        )}
        <Typography
          variant="body1"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: instruction.text }}></div>
        </Typography>
      </Box>
    );
  };

  const instructions = createInstructionItems();

  return (
    <div className="instructions-view-container">
      <Container
        maxWidth="lg"
        sx={{
          mt: 2,
          mb: 2,
          px: { xs: 1, sm: 2, md: 3 },
          width: "100%",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <div className="breadcrumbs">
            <PageTitle
              title={
                <h1 style={{ fontSize: "20", fontWeight: "bold" }}>
                  {currentLanguageData?.heading}
                </h1>
              }
            />
            <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mb: 3,
              gap: 2,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: "500",
                background: "#EDF2FB",
                width: "100%",
                textAlign: "center",
              }}
            >
              {currentLanguageData?.title}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <FormControl
                sx={{
                  minWidth: 120,
                }}
              >
                <Select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  displayEmpty
                  disabled={formValues?.length === 1}
                  renderValue={(selected) =>
                    selected ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TranslateIcon fontSize="small" />
                        <span>
                          {selected.charAt(0).toUpperCase() + selected.slice(1)}
                        </span>
                      </Box>
                    ) : (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TranslateIcon fontSize="small" />
                        <span>{currentLanguageData?.chooseLanguage}</span>
                      </Box>
                    )
                  }
                  sx={{ height: 40 }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {availableLanguages?.map((lang, index) => {
                    const langStr = typeof lang === "string" ? lang : "NA";
                    return (
                      <MenuItem key={index} value={langStr}>
                        {langStr?.charAt(0)?.toUpperCase() + langStr?.slice(1)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Typography
            variant="body1"
            color="error"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            {currentLanguageData?.title}
          </Typography>

          <Box
            sx={{
              mb: 4,
              overflow: "hidden",
              "& .instruction-item": {
                mb: 1.5,
              },
            }}
          >
            {instructions?.map((instruction, index) => {
              const displayIndex =
                typeof instruction.id === "number" ? instruction.id - 1 : null;
              return renderInstructionItem(instruction, displayIndex);
            })}
          </Box>

          {customInstructions?.length > 0 &&
            generalIns?.instructionName !== "Default" && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {
                    instructionsData[selectedLanguage?.toLowerCase()]
                      ?.additionalIntructions
                  }
                </Typography>
                <Box sx={{ overflow: "hidden" }}>
                  {customInstructions.map((instruction, index) =>
                    renderCustomInstructionItem(instruction, index)
                  )}
                </Box>
              </>
            )}
        </Paper>
      </Container>
    </div>
  );
};

export default InstructionsView;
