import React, { useState } from "react";
import "./style.css";
import { SKILL_ASSESSMENT_BATCH_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../../components/common/PageTitle";
import BreadCrumbs from "../../../../../components/common/Breadcrumbs";

const SkillAssessmentBatchAllCandidate = () => {
  //states
  const navigate = useNavigate();
  const handleBreadCrumbClick = (event, name, path) => {
    event.preventDefault();
    path && navigate(path);
  };

  const breadCrumbsData = [
    {
      name: "Skill Assessment",
      isLink: true,
      key: "1",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "Batch list",
      isLink: true,
      key: "2",
      path: SKILL_ASSESSMENT_BATCH_PAGE,
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "View Batch",
      isLink: false,
      key: "3",
      path: "",
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
  ];

  return (
    <div className="main-content">
      <div>
        <PageTitle title={"Batch Details"} />
        <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
      </div>
      <div className="batch-details-page">
        <h3>Batch Details</h3>

        <div className="batch-details-card">
          <div className="batch-details-card--header">
            <h4>Basic Details</h4>
            <p>View Basic details and necessary information from here.</p>
          </div>

          <div className="batch-details-card--body">
            <ul className="grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, idx) => (
                <li key={idx}>
                  <p>Batch ID : </p>
                  Ador Welding Academy Pvt. Ltd.
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="batch-details-card">
          <div className="batch-details-card--header">
            <h4>Proctoring Details</h4>
            <p>Adjust Batch Proctoring as per requirements.</p>
          </div>

          <div className="batch-details-card--body">
            <ul className="grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, idx) => (
                <li key={idx}>
                  <p>Image Proctoring Time : </p>1 min
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="batch-details-card">
          <div className="batch-details-card--header">
            <h4>Question Paper Details</h4>
            <p>Edit your Question Details here</p>
          </div>

          <div className="batch-details-card--body">
            <ul className="grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, idx) => (
                <li key={idx}>
                  <p>Jobrole : </p>Retail Sales Associate
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillAssessmentBatchAllCandidate;
