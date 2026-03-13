import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";
import "./styles.css";
import { ReactComponent as ArrowLeft } from "./../../../../../assets/icons/chevron-left.svg";
import { getSingleCandidatePortalStatsOfflineApi } from "../../../../../api/superAdminApi/misResults";
import {
  misResultsSelector,
  getOfflineSingleCandidatePortalStats,
} from "../../../../../redux/slicers/superAdmin/misResults";

import OMRSheet from "./OMRSheet";

export default function OfflineExamResultStats() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { offlineSingleCandidatePortalStats: candidateStats = {} } =
    useSelector(misResultsSelector);

  const [loading, setLoading] = useState(false);
  const [selectedAnswerKeys, setSelectedAnswerKeys] = useState([]);

  console.log("motiiii", candidateStats);

  useEffect(() => {
    dispatch(getOfflineSingleCandidatePortalStats({}));
    setLoading(true);
    dispatch(
      getSingleCandidatePortalStatsOfflineApi(setLoading, params?.candID)
    );
  }, [params, dispatch]);

  useEffect(() => {
    let tempAnswerKeys = candidateStats?.answerKey?.questions?.map(
      (question, index) => {
        const selectedOption = question?.options?.find(
          (option) => option?.isSelect
        );
        return {
          id: index + 1,
          selected: selectedOption?.optionKey?.[6],
        };
      }
    );
    setSelectedAnswerKeys([...(tempAnswerKeys || [])]);
  }, [candidateStats]);

  const renderApplicantBasicDetails = () => {
    console.log("", candidateStats?.answerKey?.candidateId);
    const basicData = candidateStats?.answerKey?.candidateId;
    return (
      <div className="section-container">
        <h2 className="header">Applicant Details</h2>
        <div className="basic-details-container">
          <p className="basic-text">
            <strong>Applicant ID :</strong> {basicData?.candidateId}
          </p>
          <p className="basic-text">
            <strong>Applicant Name :</strong> {basicData?.name}
          </p>
          <p className="basic-text">
            <strong>Batch ID :</strong> {candidateStats?.answerKey?.batchId.batchId}
          </p>
          <p className="basic-text">
            <strong>Batch Mode :</strong> {candidateStats?.answerKey?.batchId.batchMode}
          </p>
          <p className="basic-text">
            <strong>Assessment Date :</strong> {candidateStats?.answerKey?.batchId.startDate}
          </p>
          <p className="basic-text">
            <strong>Scheme Name :</strong> {candidateStats?.answerKey?.batchId.schemeName}
          </p>
          <p className="basic-text">
            <strong>Sub-scheme Name :</strong> {candidateStats?.answerKey?.batchId.subSchemeName}
          </p>
          <p className="basic-text">
            <strong>Client Name :</strong> {candidateStats?.answerKey?.batchId.clientname}
          </p>
          <p className="basic-text">
            <strong>Jobrole/QPCode :</strong> {`${candidateStats?.answerKey?.batchId.jobRoleNames}/${candidateStats?.answerKey?.batchId.qpCode}`}
          </p>
        </div>
      </div>
    );
  };

  if (!candidateStats?.OMRsheet) {
    return (
      <div className="main-content">
        <div className="resultStats_title">
          <ArrowLeft onClick={() => navigate(-1)} />
          <h1>Result Stats</h1>
        </div>
        <div className="section-container">
          <p>No data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="resultStats_title">
        <ArrowLeft onClick={() => navigate(-1)} />
        <h1>Result Stats/{candidateStats?.answerKey?.candidateId?.name}</h1>
      </div>
      {loading ? (
        <div className="loader_container">
          <PropagateLoader color="#2ea8db" />
        </div>
      ) : (
        <>
          {renderApplicantBasicDetails()}
          <OMRSheet
            numOfQuestions={candidateStats?.answerKey?.questions?.length || 0}
            selectedAnswerKey={selectedAnswerKeys}
          />
          <div className="section-container">
            <div className="header">OMR Sheet By Assessor</div>
            <div style={{ width: "100%", padding: "1%" }}>
              {(Array.isArray(candidateStats?.OMRsheet)
                ? candidateStats?.OMRsheet
                : [candidateStats?.OMRsheet]
              )?.map((fileObj, index) => {
                const fileLink = Object.values(fileObj)?.[0]; // extract first value (the URL)

                return (
                  <div key={index} style={{ margin: 10 }}>
                    {fileLink?.includes("pdf") ? (
                      <embed
                        src={fileLink}
                        type="application/pdf"
                        width="90%"
                        height={600}
                        style={{ border: "none" }}
                      />
                    ) : (
                      <img
                        src={fileLink}
                        alt={`Preview ${index}`}
                        style={{ height: 500, maxWidth: "90%" }}
                      />
                    )}
                  </div>
                );
              })}

              {/* {(Array.isArray(candidateStats?.OMRsheet)
                ? candidateStats?.OMRsheet
                : [candidateStats?.OMRsheet]
              )?.map((fileLink, index) => {
                return (
                  <div
                    style={{
                      margin: 10,
                    }}
                  >
                    {fileLink?.includes("pdf") ? (
                      <embed
                        src={fileLink}
                        type="application/pdf"
                        width="90%"
                        height={600}
                        style={{ border: "none" }}
                      />
                    ) : (
                      <img
                        src={fileLink}
                        alt={`Preview`}
                        style={{ height: 500, maxWidth: "90%" }}
                      />
                    )}
                  </div>
                );
              })} */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
