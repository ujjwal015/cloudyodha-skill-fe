import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as ExamCenterIcon } from "../../../assets/images/pages/examManagement/exam-center.svg";
import { ReactComponent as BatchIcon } from "../../../assets/images/pages/examManagement/batch-icon.svg";
import { ReactComponent as AssignBatchIcon } from "../../../assets/images/pages/examManagement/assign-batch.svg";
import {
  SUPER_ADMIN_ASSIGN_BATCH,
  SUPER_ADMIN_BATCH_LIST_PAGE,
  SUPER_ADMIN_CREATE_BATCH_PAGE,
  SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE,
  SUPER_ADMIN_QUESTION_LIST,
} from "../../../config/constants/routePathConstants/superAdmin";

const ExamManagement = () => {
  const navigate = useNavigate();
  return (
    <div className="main-content">
      <div
        className="title-home"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1>Create Exam</h1>
        <h3>Choose one of the following options to start creating Exams.</h3>
      </div>

      <div className="create-exam-container">
        <div className="create-exam-option-wrapper">
          <div
            className="create-exam-card"
            onClick={() => {
              navigate(SUPER_ADMIN_EXAM_MANAGEMENT_LIST_PAGE);
            }}
          >
            <div className="create-exam-icon">
              <ExamCenterIcon />
            </div>
            <div className="questionbank_card_title">
              <h1>Exam Centre</h1>
            </div>
          </div>
          <div
            className="create-exam-card"
            onClick={() => {
              navigate(SUPER_ADMIN_BATCH_LIST_PAGE);
            }}
          >
            <div className="create-exam-icon">
              <BatchIcon />
            </div>
            <div className="questionbank_card_title">
              <h1>Batch</h1>
            </div>
          </div>
          <div
            className="create-exam-card"
            onClick={() => {
              navigate(SUPER_ADMIN_ASSIGN_BATCH);
            }}
          >
            <div className="create-exam-icon">
              <AssignBatchIcon />
            </div>
            <div className="questionbank_card_title">
              <h1>Assign Batch</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamManagement;
