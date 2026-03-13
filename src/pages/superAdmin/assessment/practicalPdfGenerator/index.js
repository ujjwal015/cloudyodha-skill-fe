import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, pdf } from "@react-pdf/renderer";

// Font registration
Font.register({
  family: "Noto Sans",
  src: "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.11/files/noto-sans-all-400-normal.woff",
});

Font.register({
  family: "Noto Sans Hindi",
  src: "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-devanagari@4.5.9/files/noto-sans-devanagari-devanagari-400-normal.woff",
});

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Noto Sans",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 30,
    flexGrow: 1,
  },
  headerRow: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCol: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    justifyContent: "center",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  tableCellHindi: {
    margin: 5,
    fontSize: 10,
    fontFamily: "Noto Sans Hindi",
  },
  nosCol: { width: "15%" },
  passageCol: { width: "35%" },
  rubricCol: { width: "50%", borderRightWidth: 0 },
  title: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});

const isNonLatinScript = (text) => /[\u0900-\u097F]/.test(text); // Devanagari check

export const PdfDocumentWithRubrics = ({ data, title }) => {
  const processData = () => {
    const rows = [
      { nos: "NOS", passage: "Passage/Scenario", rubric: "Rubrics", isHeader: true },
    ];

    let currentNos = null;

    data.forEach((item) => {
      const isFirstRow = item.nos !== currentNos;

      rows.push({
        nos: isFirstRow ? item.nos : "",
        passage: item.passage,
        rubric: item.rubric,
        isHeader: false,
      });

      currentNos = item.nos;
    });

    return rows;
  };

  const TableRow = ({ item, isHeader }) => {
    const rowStyle = isHeader ? { ...styles.tableRow, ...styles.headerRow } : styles.tableRow;

    return (
      <View style={rowStyle}>
        <View style={{ ...styles.tableCol, ...styles.nosCol }}>
          <Text style={styles.tableCell}>{item.nos}</Text>
        </View>
        <View style={{ ...styles.tableCol, ...styles.passageCol }}>
          <Text style={isNonLatinScript(item.passage) ? styles.tableCellHindi : styles.tableCell}>
            {item.passage}
          </Text>
        </View>
        <View style={{ ...styles.tableCol, ...styles.rubricCol }}>
          <Text style={isNonLatinScript(item.rubric) ? styles.tableCellHindi : styles.tableCell}>
            {item.rubric}
          </Text>
        </View>
      </View>
    );
  };

  const processedData = processData();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.table}>
          {processedData.map((row, index) => (
            <TableRow key={index} item={row} isHeader={row.isHeader} />
          ))}
        </View>
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

// Add global CSS for loader animation
const addLoaderStyles = () => {
  const styleTag = document.createElement('style');
  styleTag.id = 'practical-pdf-loader-styles';
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

// Run once when module is imported
addLoaderStyles();

// Enhanced PDF generation helper with error handling and loading state
export const generatePracticalPdf = async (data, title = "Rubric Table", filename = null) => {
  // Create and append loader
  const loaderContainer = document.createElement('div');
  loaderContainer.id = 'practical-pdf-loader-container';
  document.body.appendChild(loaderContainer);
  
  // Render loader using ReactDOM
  const renderLoader = () => {
    try {
      // Use ReactDOM if available
      if (window.ReactDOM) {
        window.ReactDOM.render(<PdfLoader />, loaderContainer);
      } else {
        // Fallback to basic HTML loader
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
      // Simple fallback if all else fails
      loaderContainer.innerHTML = '<div style="position:fixed;top:10px;right:10px;background:white;padding:10px;border:1px solid #ccc;z-index:9999">Generating PDF...</div>';
    }
  };
  
  // Remove loader function
  const removeLoader = () => {
    if (window.ReactDOM && window.ReactDOM.unmountComponentAtNode) {
      window.ReactDOM.unmountComponentAtNode(loaderContainer);
    }
    if (loaderContainer && loaderContainer.parentNode) {
      loaderContainer.parentNode.removeChild(loaderContainer);
    }
  };
  
  // Show loader
  renderLoader();
  
  try {
    // Generate PDF with a small delay to ensure loader is displayed
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const blob = await pdf(<PdfDocumentWithRubrics data={data} title={title} />).toBlob();

    // Download file
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `${title.replace(/\s+/g, "_")}.pdf`;
    link.click();
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      removeLoader();
    }, 100);
    
    return blob;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Failed to generate PDF. Please try again or contact support.");
    removeLoader();
    return null;
  }
};

// Download button component
const RubricPdfDownloadButton = ({
  data,
  title = "Rubric Table",
  filename = null,
  buttonText = "Download Rubrics PDF",
  className = "",
  style = {},
}) => {
  const handleClick = () => generatePracticalPdf(data, title, filename);

  return (
    <button onClick={handleClick} className={className} style={style}>
      {buttonText}
    </button>
  );
};

export default RubricPdfDownloadButton;