import React, { useEffect, useState } from "react";
import "./style.css";
import { STUDENT_FEEDBACK_PAGE, STUDENT_RESULT_SUMMARY } from "../../../config/constants/routePathConstants/student";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getResultSummaryApi, submitTestApi } from "../../../api/studentApi";
import ficsi from "../../../assets/images/ficsi.svg";
import { Icon } from "@iconify/react";
import stopwatchIcon from "@iconify/icons-mdi/stopwatch";
import ResultScore from "../../../components/common/ResultScore";
import TimeDetails from "../../../components/common/TimeDetails";
import MarkingScheme from "../../../components/common/MarkingScheme";
import { Button } from "@mui/material";

function ResultSummary() {
  const { batchId, candidateId, questionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getResultSummaryApi(batchId, candidateId, setLoading));
  }, []);

  const handlesubmit = () => {
    setLoading(true);
    const navigatePath = `${STUDENT_FEEDBACK_PAGE}/${batchId}/${candidateId}`;
    navigate(navigatePath);
    // dispatch(
    //   submitTestApi(batchId, candidateId, setLoading, navigate, navigatePath)
    // );
  };
  

  return loading ? (
    "...Loading..."
  ) : (
    <>
      <div className="resultSummary_main_container">
        {/* <div className="resultSummary_inner_container">
          <div className="resultSummary_content">
            <div>
              <img src={ficsi} alt="FICSI Logo" />
            </div>
            <div>
              <h1>FICSI</h1>
              <p>Assistant Technician – Cold Storage</p>
            </div>
          </div>
          <div className="resultSummary_watch_details">
            <Icon icon={stopwatchIcon} width={24} height={24} />
            <span>3 h 5 min</span>
          </div>
        </div> */}
        <div className="score_main_container">
          <ResultScore />
          <TimeDetails />
        </div>
        <div className="marking_scheme_container">
          <MarkingScheme />
        </div>
        <div className="resultSummary_button_container">
          {/* <Button className="cancel_button">Cancel</Button> */}
          <Button className="submit_button" onClick={handlesubmit}>Proceed</Button>
        </div>
      </div>
    </>
  );
}

export default ResultSummary;
