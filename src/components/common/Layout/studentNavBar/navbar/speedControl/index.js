import "./style.css";

const SpeedControl = ({ isPlaying,rate, setRate }) => {
  const speedOptions = [
    { value: 1, label: "Normal" },
    { value: 1.25, label: "1.25" },
    { value: 1.5, label: "1.5" },
    { value: 1.75, label: "1.75" },
    { value: 2, label: "2" }
  ];

  return (
    <div className="speed-control">
      {speedOptions?.map((option) => (
        <button
          key={option.value}
          className={`speed-option ${rate === option.value ? "active" : ""}`}
          onClick={() => setRate(option.value)}
          aria-label={`Set speed to ${option.label}`}
          disabled={isPlaying}
        >
          {option?.label}
        </button>
      ))}
    </div>
  );
};

export default SpeedControl;