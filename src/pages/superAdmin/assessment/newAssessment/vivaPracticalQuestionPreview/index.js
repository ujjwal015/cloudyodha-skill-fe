import React, { useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../../../../../assets/icons/chevron-left.svg";
import { useState } from "react";
import { SUPER_ADMIN_ASSESSMENT_LIST_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import { SyncLoader } from "react-spinners";
import "../../../assessment/style.css";
import "../style.css";

const PerviewAssessment = ({ setActiveStep }) => {
  const myComponentRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const { previewType } = params;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const questions = location.state;

  return (
    <div className="main-container assessment-page">
      <div className="title">
        <div
          className="title-text"
          style={{
            justifyContent: "flex-start",
            padding: "20px 0px 20px 25px",
          }}
        >
          <ArrowLeft
            onClick={() => navigate(SUPER_ADMIN_ASSESSMENT_LIST_PAGE)}
          />
          <h1>Preview {previewType}</h1>
        </div>
      </div>
      {loading ? (
        <div className="loading-preview-assessment">
          <SyncLoader color="#2ea8db" />
        </div>
      ) : questions?.length > 0 ? (
        <>
          <section>
            <div>
              <div className="questions">
                <div>
                  {questions?.map((question, index) => {
                    return (
                      <div
                        key={question?._id}
                        className="question-card"
                        id={"qn" + ((page - 1) * limit + (index + 1))}
                        ref={myComponentRef}
                      >
                        <div className="title">
                          <h2>{`Question ${
                            (page - 1) * limit + (index + 1)
                          }`}</h2>
                          <div>
                            <p>
                              <span>Marks</span>
                              {question?.marks}
                            </p>
                          </div>
                        </div>
                        <div className="ques-opt">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: question?.questionText,
                            }}
                          ></div>
                          <h1>Answer : </h1>
                          <ul>
                            <li>{question?.answer}</li>
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="no-preview-assessment">No Questions Added</div>
      )}
    </div>
  );
};

export default PerviewAssessment;
