import React, { useEffect } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  pdf,
  Image,
} from '@react-pdf/renderer';
import RadiantLogo from "../../../../assets/icons/Radiant/Radiant logo.png";
import { binaryToBlobImageConverter } from '../../../../utils/binaryToBlobConverter';
import { base64ToBlobUrl } from '../../../../utils/base64ToBlobConverter';

// Define map of Indian languages to their font files
const INDIAN_LANGUAGE_FONTS = {
  Hindi: {
    family: 'Noto Sans Devanagari',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@4.5.9/files/noto-sans-devanagari-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Bengali: {
    family: 'Noto Sans Bengali',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-bengali@4.5.9/files/noto-sans-bengali-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Tamil: {
    family: 'Noto Sans Tamil',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-tamil@4.5.9/files/noto-sans-tamil-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Telugu: {
    family: 'Noto Sans Telugu',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-telugu@4.5.9/files/noto-sans-telugu-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Kannada: {
    family: 'Noto Sans Kannada',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kannada@4.5.9/files/noto-sans-kannada-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Malayalam: {
    family: 'Noto Sans Malayalam',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-malayalam@4.5.9/files/noto-sans-malayalam-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Gujarati: {
    family: 'Noto Sans Gujarati',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-gujarati@4.5.9/files/noto-sans-gujarati-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Odia: {
    family: 'Noto Sans Oriya',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-oriya@4.5.9/files/noto-sans-oriya-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Punjabi: {
    family: 'Noto Sans Gurmukhi',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-gurmukhi@4.5.9/files/noto-sans-gurmukhi-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Assamese: {
    family: 'Noto Sans Bengali', // Assamese uses Bengali script
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-bengali@4.5.9/files/noto-sans-bengali-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Marathi: { 
    family: 'Noto Sans Devanagari', // Marathi uses Devanagari script
    fonts: [
      { 
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@4.5.9/files/noto-sans-devanagari-all-400-normal.woff',
        fontWeight: 'normal',
      },
      { 
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@4.5.9/files/noto-sans-devanagari-all-700-normal.woff',
        fontWeight: 'bold',
      }
    ]
  },
  Sanskrit: {
    family: 'Noto Sans Devanagari',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@4.5.9/files/noto-sans-devanagari-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Kashmiri: {
    family: 'Noto Sans Devanagari',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@4.5.9/files/noto-sans-devanagari-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Konkani: {
    family: 'Noto Sans Devanagari',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@4.5.9/files/noto-sans-devanagari-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Nepali: {
    family: 'Noto Sans Devanagari',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@4.5.9/files/noto-sans-devanagari-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Sindhi: {
    family: 'Noto Sans Arabic',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-arabic@4.5.9/files/noto-sans-arabic-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Urdu: {
    family: 'Noto Sans Arabic',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-arabic@4.5.9/files/noto-sans-arabic-all-400-normal.woff',
    fontWeight: 'normal',
  },
  Manipuri: {
    family: 'Noto Sans Bengali',
    src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-bengali@4.5.9/files/noto-sans-bengali-all-400-normal.woff',
    fontWeight: 'normal',
  },
};

// Register base fonts that are always needed
Font.register({
  family: 'Noto Sans',
  src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.11/files/noto-sans-all-400-normal.woff',
});

// Main fonts for the document
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-all-400-normal.woff', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto@4.5.8/files/roboto-all-700-normal.woff', fontWeight: 'bold' },
  ],
});

// Track registered fonts to avoid duplicate registration
const registeredFonts = new Set();

// Dynamic font registration function with error handling
const registerFontForLanguage = (language) => {
  if (!language || !INDIAN_LANGUAGE_FONTS[language]) {
    console.warn(`No font configuration found for language: ${language}`);
    return null;
  }

  const fontConfig = INDIAN_LANGUAGE_FONTS[language];
  const fontFamily = fontConfig.family;
  
  // Skip if already registered
  if (registeredFonts.has(fontFamily)) {
    return fontFamily;
  }
  
  try {
    // Handle fonts array structure for Marathi
    if (fontConfig.fonts) {
      Font.register({
        family: fontFamily,
        fonts: fontConfig.fonts
      });
    } else {
      // Standard registration
      Font.register({
        family: fontFamily,
        src: fontConfig.src,
        fontWeight: fontConfig.fontWeight || 'normal'
      });
    }
    
    // Mark as registered
    registeredFonts.add(fontFamily);
    return fontFamily;
  } catch (error) {
    console.error(`Error registering font for ${language}:`, error);
    return null;
  }
};

// Register all fonts during module initialization
const registerAllFonts = () => {
  Object.keys(INDIAN_LANGUAGE_FONTS).forEach(language => {
    registerFontForLanguage(language);
  });
};

// Helper to get font family for a language
const getFontFamilyForLanguage = (language) => {
  return INDIAN_LANGUAGE_FONTS[language]?.family || 'Roboto';
};

// Enhanced styles with improved image handling and layout
const styles = StyleSheet.create({
  page: {
    padding: 12,
    fontSize: 10,
    fontFamily: 'Roboto',
    lineHeight: 1.4,
  },
  outerBorder: {
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 4,
    flex: 1,
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 10,
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'nowrap',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logo: {
    width: 80,
    height: 28,
    objectFit: 'contain',
  },
  subHeader: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  guideline: {
    textAlign: 'start',
    fontSize: 10,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  labelRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  labelItem: {
    minWidth: '45%',
    marginBottom: 2,
  },
  section: {
    marginBottom: 4,
  },
  questionBlock: {
    marginBottom: 8, // Slightly increased spacing between questions
    breakInside: 'avoid',
  },
  questionText: {
    fontWeight: 'bold',
  },
  questionImageContainer: {
    marginTop: 4,
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  questionImage: {
    maxWidth: 240,
    maxHeight: 160,
    objectFit: 'contain',
    marginLeft: 10,
  },
  regionalQuestion: {
    fontSize: 9,
    marginTop: 2,
    color: '#444',
  },
  optionsContainer: {
    marginLeft: 10,
    marginTop: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2, // Minimal gap between options
  },
  option: {
    marginVertical: 1, // Minimal vertical spacing 
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'nowrap', // Prevent wrapping
  },
  optionKey: {
    fontSize: 9,
    marginRight: 4,
    minWidth: 12, // Adjusted for consistent spacing
  },
  optionTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  optionText: {
    fontSize: 9,
  },
  optionImageContainer: {
    marginTop: 2,
    marginBottom: 2,
    alignItems: 'flex-start',
    maxWidth: '100%',
  },
  optionImage: {
    width: 90,
    height: 60,
    objectFit: 'contain',
  },
  footerLine: {
    fontSize: 9,
    marginTop: 5,
    textAlign: 'center',
    color: '#888',
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 4,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 9,
    fontStyle: 'italic',
  },
  // Container for all questions with better spacing
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6, // Better gap between questions
  }
});

// Improved Option component with better image handling
const Option = ({ option, language }) => {
  // Default to Roboto if language font isn't available
  const fontFamily = language && INDIAN_LANGUAGE_FONTS[language] ? 
    INDIAN_LANGUAGE_FONTS[language].family : 'Roboto';
  
  // Check if an image exists in this option
  const hasImage = option?.optionUrl && option?.binaryUrl?.buffer;
  
  return (
    <View style={styles.option} wrap={false}>
      <Text style={styles.optionKey}>
        {option?.optionKey?.replace("Option", "")}){" "}
      </Text>
      <View style={styles.optionTextContainer}>
        {option?.optionValue && (
          <Text style={[styles.optionText, { fontFamily }]}>
            {option?.optionValue}
          </Text>
        )}
        
        {hasImage && (
          <View style={styles.optionImageContainer}>
            <Image
              src={binaryToBlobImageConverter(option?.binaryUrl?.buffer)}
              style={styles.optionImage}
              cache={true}
            />
          </View>
        )}
      </View>
    </View>
  );
};

// Improved Question component with better image handling
const Question = ({ question, index, secondaryLanguage }) => {
  const translations = question.lang?.filter(
    (l) => l.language === secondaryLanguage
  ) || [];
  
  // Improved image extraction
  let cleanedText = '';
  let imageUrl = null;
  let imageType = null;
  
  // Extract image if present in question text
  if (question?.questionText) {
    // Check for img tag
    const imageMatch = question.questionText.match(/<img\s+[^>]*src="([^"]+)"/);
    
    if (imageMatch) {
      imageUrl = imageMatch[1];
      
      // Handle base64 images
      if (imageUrl.startsWith('data:')) {
        const typeMatch = imageUrl.match(/data:([^;]+);/);
        if (typeMatch) {
          imageType = typeMatch[1].split('/')[1];
        }
      }
      
      // Remove the img tag from question text
      cleanedText = question.questionText.replace(/<img[^>]*>/g, '');
    } else {
      cleanedText = question.questionText;
    }
    
    // Clean up HTML tags
    cleanedText = cleanedText.replace(/<\/?[^>]+(>|$)/g, '').trim();
  }
  
  const regionalFontFamily = secondaryLanguage && INDIAN_LANGUAGE_FONTS[secondaryLanguage] ? 
    INDIAN_LANGUAGE_FONTS[secondaryLanguage].family : 'Roboto';
  
  return (
    <View style={styles.questionBlock} wrap={false}>
      {/* English Question */}
      <Text style={styles.questionText}>
        {index + 1}. {cleanedText}
      </Text>
      
      {/* Question Image */}
      {imageUrl && (
        <View style={styles.questionImageContainer}>
          <Image 
            src={imageUrl && base64ToBlobUrl(imageUrl, imageType)} 
            style={styles.questionImage} 
          />
        </View>
      )}
      
      {/* Question Options */}
      <View style={styles.optionsContainer}>
        {Array.isArray(question.options) ? 
          question.options.map((opt, idx) => (
            <Option 
              key={opt._id || `opt-${opt.optionKey || idx}`} 
              option={opt} 
            />
          )) : 
          <Text style={styles.errorText}>Options unavailable</Text>
        }
      </View>

      {/* Regional Language Question */}
      {translations.map((lang) =>
        lang.language !== 'English' ? (
          <View
            key={`${question._id || index}-lang-${lang.language}`}
            style={[styles.questionBlock, { marginTop: 4 }]}
            wrap={false}
          >
            <Text style={[styles.regionalQuestion, { fontFamily: regionalFontFamily }]}>
              {index + 1}. {lang.questionText}
            </Text>
            
            <View style={styles.optionsContainer}>
              {Array.isArray(lang.options) ? 
                lang.options.map((opt, idx) => (
                  <Option 
                    key={opt._id || `${lang.language}-opt-${opt.optionKey || idx}`} 
                    option={opt}
                    language={secondaryLanguage}
                  />
                )) : 
                <Text style={styles.errorText}>Regional options unavailable</Text>
              }
            </View>
          </View>
        ) : null
      )}
    </View>
  );
};

// Modified document component with better pagination
const PdfExamDocument = ({ 
  setName, 
  questionList = [], 
  secondaryLanguage, 
  clientName,
  clientLogo 
}) => {
  // Register appropriate fonts
  useEffect(() => {
    registerAllFonts();
    
    if (secondaryLanguage) {
      registerFontForLanguage(secondaryLanguage);
    }
  }, [secondaryLanguage]);

  // Make sure logos exist or use placeholders
  const actualRadiantLogo = RadiantLogo || 'https://via.placeholder.com/80x30?text=Radiant';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            {/* Header section */}
            <View style={styles.headerRow}>
              <Image 
                src={clientLogo ? binaryToBlobImageConverter(clientLogo) : 'https://via.placeholder.com/80x30?text=Client'} 
                style={styles.logo} 
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.header}>Question Paper - Theory</Text>
                <Text style={styles.subHeader}>{clientName || 'Client Name'}</Text>
              </View>
              <Image src={actualRadiantLogo} style={styles.logo} />
            </View>

            <View style={styles.horizontalLine} />
            
            <View style={styles.labelRow}>
              <Text style={styles.labelItem}>Name: _____________________</Text>
              <Text style={styles.labelItem}>Batch: _____________________</Text>
            </View>
            
            <View style={styles.labelRow}>
              <Text style={styles.labelItem}>Roll No./UID No: ________________</Text>
              <Text style={styles.labelItem}>Date: _______________________</Text>
            </View>
            
            <View style={styles.horizontalLine} />
            
            <View style={styles.section}>
              <Text style={styles.guideline}>Exam Guidelines</Text>
              <Text>• In this question set, you will get {questionList.length} multiple choice questions related to {setName || 'QB_Baking Technician'}.</Text>
              <Text>• There is no negative marking.</Text>
              <Text>• At the end, there is a practical exam participant has to perform in front of the assessor.</Text>
              <Text style={{ marginTop: 2 }}>Marks Description: Theory Marks - 200, Practical - 150 & Viva Marks - 150</Text>
            </View>
            
            <View style={styles.horizontalLine} />

            {/* Render all questions with auto pagination */}
            <View style={styles.questionsContainer}>
              {questionList.map((question, index) => (
                <Question 
                  key={question._id || `question-${index}`}
                  question={question} 
                  index={index}
                  secondaryLanguage={secondaryLanguage}
                />
              ))}
            </View>
          </View>
        </View>
        
        {/* Page number at bottom of each page */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </Page>
    </Document>
  );
};

// Loading component to show during PDF generation
const PdfLoader = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTopColor: '#3498db',
          animation: 'spin 1s ease-in-out infinite'
        }} />
        <div style={{
          marginTop: '10px',
          fontFamily: 'Roboto, sans-serif',
          fontSize: '14px'
        }}>
          Generating PDF...
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Improved PDF generation helper with better error handling
export const generateTheoryPdf = async (
  setName, 
  questions, 
  selectedLanguage, 
  clientName, 
  clientLogo,
  filename = null
) => {
  // Create and append loader
  const loaderContainer = document.createElement('div');
  loaderContainer.id = 'pdf-loader-container';
  document.body.appendChild(loaderContainer);
  
  // Render loader
  const renderLoader = () => {
    try {
      if (window.ReactDOM) {
        window.ReactDOM.render(<PdfLoader />, loaderContainer);
      } else {
        loaderContainer.innerHTML = `
          <div style="position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(255,255,255,0.7);display:flex;justify-content:center;align-items:center;z-index:9999">
            <div style="background-color:white;padding:20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);text-align:center">
              <div style="display:inline-block;width:40px;height:40px;border:3px solid rgba(0,0,0,0.1);border-radius:50%;border-top-color:#3498db;animation:spin 1s linear infinite"></div>
              <div style="margin-top:10px;font-family:sans-serif">Generating PDF...</div>
            </div>
          </div>
          <style>
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        `;
      }
    } catch (err) {
      console.warn("Error showing loader:", err);
      loaderContainer.innerHTML = '<div style="position:fixed;top:10px;right:10px;background:white;padding:10px;border:1px solid #ccc;z-index:9999">Generating PDF...</div>';
    }
  };
  
  // Remove loader function
  const removeLoader = () => {
    try {
      if (window.ReactDOM && window.ReactDOM.unmountComponentAtNode) {
        window.ReactDOM.unmountComponentAtNode(loaderContainer);
      }
      if (loaderContainer && loaderContainer.parentNode) {
        loaderContainer.parentNode.removeChild(loaderContainer);
      }
    } catch (err) {
      console.warn("Error removing loader:", err);
    }
  };
  
  // Show loader
  renderLoader();
  
  try {
    // Register all fonts first
    registerAllFonts();
    
    // Register the selected language font
    if (selectedLanguage) {
      registerFontForLanguage(selectedLanguage);
    }
    
    // Check if questions array is valid
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions provided or invalid question data");
    }
    
    // Generate PDF with a small delay to ensure loader is displayed
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const blob = await pdf(
      <PdfExamDocument
        setName={setName}
        questionList={questions}
        secondaryLanguage={selectedLanguage}
        clientName={clientName}
        clientLogo={clientLogo}
      />
    ).toBlob();

    // Download file
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `Question-Paper-${setName || 'Exam'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      removeLoader();
    }, 100);
    
    return blob;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert(`Failed to generate PDF: ${error.message}. Please try again or contact support.`);
    removeLoader();
    return null;
  }
};

// Add global CSS for loader animation
const addLoaderStyles = () => {
  // Avoid creating duplicate styles
  if (document.getElementById('pdf-loader-styles')) return;
  
  const styleTag = document.createElement('style');
  styleTag.id = 'pdf-loader-styles';
  styleTag.innerHTML = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .pdf-loader-spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #3498db;
      animation: spin 1s ease-in-out infinite;
    }
  `;
  document.head.appendChild(styleTag);
};

// Register all fonts when module is imported
registerAllFonts();

// Run once when module is imported
addLoaderStyles();

export default PdfExamDocument;