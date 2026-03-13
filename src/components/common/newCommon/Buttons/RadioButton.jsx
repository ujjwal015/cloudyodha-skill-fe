import React from "react";

const RadioButtons = ({
  name,
  value,
  options,
  handleChange,
  isLabelRequired = true,
  error,
}) => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "bold",
    },
    radioGroup: {
      display: "flex",
      gap: "16px",
      alignItems: "center",
    },
    radioLabel: {
      display: "flex",
      alignItems: "center",
      color: "black",
      gap: "8px",
      cursor: "pointer",
    },
    radioInput: {
      accentColor: "black",
    },
    errorText: {
      color: "red",
      fontSize: "12px",
      marginTop: "4px",
    },
  };

  return (
    <div style={styles.container}>
      {isLabelRequired && (
        <label style={styles.label} htmlFor={name}>
          {name}
        </label>
      )}
      <div style={styles.radioGroup}>
        {options.map((option) => (
          <label key={option.value} style={styles.radioLabel}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
              style={styles.radioInput}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

export default RadioButtons;
