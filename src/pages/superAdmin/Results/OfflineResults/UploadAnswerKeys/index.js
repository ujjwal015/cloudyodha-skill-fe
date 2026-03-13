import React, { useEffect, useState } from "react";
import "./styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as ArrowLeft } from "./../../../../../assets/icons/chevron-left.svg";
import {
  getCandidatesWithQuestionsApi,
  uploadCandidatesAnswerSheetApi,
} from "../../../../../api/superAdminApi/misResults";
import { misResultsSelector } from "../../../../../redux/slicers/superAdmin/misResults";
import SubmitButton from "../../../../../components/SubmitButton";

const validOptions = ["A", "B", "C", "D", "E"];

const UploadAnswerKeys = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { candidateListWithQuestions } = useSelector(misResultsSelector);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState(
    JSON.parse(JSON.stringify(candidateListWithQuestions))
  );

  useEffect(() => {
    dispatch(getCandidatesWithQuestionsApi(setLoading, params?.id));
  }, [dispatch, params]);

  useEffect(() => {
    setResponses(JSON.parse(JSON.stringify(candidateListWithQuestions)));
  }, [candidateListWithQuestions]);

  const handleUploadCandidateAnswerSheet = () => {
    let payload = [];
    for (let i = 0; i < responses?.length; i++) {
      let studentResponse = {
        candidateName: responses[i]?.candidateId?.name,
        candidateId: responses[i]?.candidateId?._id,
        questions: [],
      };
      for (let j = 0; j < responses[i]?.questions?.length; j++) {
        const selectedOption = responses?.[i]?.questions?.[j]?.options?.find(
          (option) => option?.isSelect
        );
        selectedOption &&
          studentResponse.questions?.push({
            questionId: responses[i]?.questions?.[j]?._id,
            questionNumber: `${j + 1}`,
            optionId: selectedOption?._id,
            optionKey: selectedOption?.optionKey,
          });
      }
      payload.push(studentResponse);
    }
    setLoading(true);
    dispatch(uploadCandidatesAnswerSheetApi(setLoading, params?.id, payload));
  };

  const handleChange = (studentIndex, questionIndex, value) => {
    value = value.toUpperCase();
    if (value === "" || validOptions.includes(value)) {
      const selectedOptionIndex = responses?.[studentIndex]?.questions?.[
        questionIndex
      ]?.options?.findIndex((option) => option?.optionKey?.slice(-1) === value);
      setResponses((prevState) => {
        const updatedData = JSON.parse(JSON.stringify(prevState));
        let updatedOptions = JSON.parse(
          JSON.stringify(
            updatedData[studentIndex].questions[questionIndex].options
          )
        );
        if (selectedOptionIndex !== -1)
          updatedOptions[selectedOptionIndex].isSelect = true;
        else {
          for (let i = 0; i < updatedOptions?.length; i++) {
            updatedOptions[i].isSelect = false;
          }
        }
        updatedData[studentIndex].questions[questionIndex].options =
          updatedOptions;
        return updatedData;
      });
    }
  };

  return (
    <div className="main-content">
      <div className="uploadAnswerKey_title">
        <ArrowLeft onClick={() => navigate(-1)} />

        <h1>Applicant List</h1>
      </div>
      <div className="offline-result-upload-table">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Applicant Name</th>
                {responses?.[0]?.questions.map((_, i) => (
                  <th key={i}>{String(i + 1).padStart(2, "0")}</th>
                ))}
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr className="table-loading-wrapper">
                  <td className="sync-loader-wrapper">
                    <PropagateLoader color="#2ea8db" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {responses.map((candidate, candidateIndex) => (
                  <tr key={candidateIndex}>
                    <td>{candidate?.candidateId?.name ?? "-"}</td>
                    {candidate?.questions?.map((question, questionIndex) => {
                      const selectedOption = responses?.[
                        candidateIndex
                      ]?.questions?.[questionIndex]?.options?.find(
                        (option) => option?.isSelect
                      );
                      return (
                        <td key={questionIndex}>
                          <input
                            type="text"
                            value={selectedOption?.optionKey?.slice(-1) ?? ""}
                            onChange={(e) =>
                              handleChange(
                                candidateIndex,
                                questionIndex,
                                e.target.value
                              )
                            }
                            maxLength={1}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 20,
          marginTop: 20,
          gap: 20,
        }}
      >
        {responses?.length > 0 && (
          <SubmitButton
            cancelBtnText="Cancel"
            submitBtnText="Save"
            handleSubmit={handleUploadCandidateAnswerSheet}
            loading={loading}
            navigate={navigate}
            clearFormValues={() => {
              navigate(-1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UploadAnswerKeys;
