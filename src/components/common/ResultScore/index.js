import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import "./ResultScore.css";
import { useSelector } from "react-redux";
import { studentSelector } from "../../../redux/slicers/studentSlice";

ChartJS.register(ArcElement, Tooltip);

const ResultScore = () => {
  const { candidateResultSummary = {} } = useSelector(studentSelector);

  const totalQuestions = candidateResultSummary?.numberOfQuestion || 0;
  const correct = candidateResultSummary?.correctAnswer || 0;
  const incorrect = candidateResultSummary?.wrongAnswer || 0;
  const notAttempted = candidateResultSummary?.notAttemptQuestion || 0;

  const data = {
    labels: ["Correct", "Incorrect", "Not Attempted"],
    datasets: [
      {
        data: [correct, incorrect, notAttempted],
        backgroundColor: ["#22c55e", "#fbbf24", "#c7d2fe"],
        borderWidth: 10,
        cutout: "70%",
        borderRadius: 10,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="result-container" style={{ width: "100%", height: "100%" }}>
      <div className="result-header">
        <h2>Score Per Question Category</h2>
        <span>Total Question : {totalQuestions}</span>
      </div>

      <div className="result-body">
        <div className="chart-area">
          <Doughnut data={data} options={options} />
        </div>

        <div className="result-stats">
          <div className="stat">
            <span className="dot correct" />
            <p>Correct Answers</p>
            <span>{correct}</span>
          </div>
          <div className="stat">
            <span className="dot incorrect" />
            <p>Incorrect Answers</p>
            <span>{incorrect}</span>
          </div>
          <div className="stat">
            <span className="dot not-attempted" />
            <p>Not Attempted</p>
            <span>{notAttempted}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScore;
