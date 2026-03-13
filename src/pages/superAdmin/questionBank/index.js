import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { ReactComponent as MaleImage } from "../../../assets/images/pages/questionBank/left-male.svg";
import { ReactComponent as FemaleImage } from "../../../assets/images/pages/questionBank/right-female.svg";
import { SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE,SUPER_ADMIN_QUESTION_LIST } from "../../../config/constants/routePathConstants/superAdmin";


const QuestionBankHome = () => {
  const navigate = useNavigate()
  return (
    <div className="main-content">
      <div
        className="title-home"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1>Question Bank Management</h1>
        <h3>
          Choose one of the following options to start creating Questions.
        </h3>
      </div>

      <div
        className="questionBank-container"
      >
        <div className="questionbank_options">
          <div className="questionbank_card" onClick={() => { navigate(SUPER_ADMIN_CREATE_QUESTION_BANK_PAGE) }}>
            <div className="questionbank_card_imageBox">
              <MaleImage style={{ width: "90%" }} />
            </div>
            <div className="questionbank_card_title">
              <h1>Create Question Bank</h1>
            </div>
          </div>
          <div className="questionbank_card" onClick={() => { navigate(SUPER_ADMIN_QUESTION_LIST) }}>
            <div className="questionbank_card_imageBox">
              <FemaleImage style={{ width: "90%" }} />
            </div>
            <div className="questionbank_card_title">
              <h1>Questions List</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankHome;
