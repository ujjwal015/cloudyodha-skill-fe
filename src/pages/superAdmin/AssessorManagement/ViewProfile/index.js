import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.css";
import { ReactComponent as ArrowLeft } from "./../../../../assets/icons/chevron-left.svg";
import { ReactComponent as AcceptMini } from "./../../../../assets/new-icons/Approved.svg";
import { ReactComponent as AcceptFull } from "./../../../../assets/new-icons/ApprovedFull.svg";
import { ReactComponent as RejectMini } from "./../../../../assets/new-icons/Decline.svg";
import { ReactComponent as RejectFull } from "./../../../../assets/new-icons/DeclineFull.svg";
import UserProfile from "./../../../../assets/images/pages/clientManagement/dummy-user-profile.png";
import { ASSESSOR_MANAGEMENT_HOME } from "../../../../config/constants/routePathConstants/superAdmin";
import {
  acceptRejectAssessorDocumentApi,
  viewAllAssessorDetailsApi,
} from "../../../../api/superAdminApi/assessorManagement";
import { assessorAttendanceSelector } from "../../../../redux/slicers/superAdmin/assessorAttendanceSlice";

const AssessorProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const section = location?.search?.split("=")?.["1"];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const {
    assessBasicDetails = {},
    assessorPersonalDetails = [],
    assessorEducationDetails = [],
    assessorExperienceDetails = [],
    assessorAgreementDetails = [],
    assessorTrainingDetails = [],
    assessorBankDetails = {},
  } = useSelector(assessorAttendanceSelector);
  const params = useParams();
  const getDetails = () => {
    setLoading(true);
    dispatch(viewAllAssessorDetailsApi(params?.id, setLoading));
  };

  useEffect(() => {
    getDetails();
  }, []);

  function DocumentList({ documents }) {
    return (
      <div>
        {documents.length < 1 && <p>No Data Found</p>}
        {documents.map((el, index) => {
          return (
            <div className="details_card" key={index}>
              <div>
                <h6 className="field_title">
                  {el?.cardType === "AadharCard" ? "Aadhar Card" : "PAN Card"}
                </h6>
                <p className="field_value">{el?.cardNo || "-"}</p>
              </div>
              <div className="document_wrapper">
                <h6 className="field_title">{"Attatchment"}</h6>
                <p className="field_value">
                  {
                    <a href={el?.url} target="location">
                      {el?.cardFileName || "-"}
                    </a>
                  }
                </p>
              </div>
              <div className="doc_link_wrapper">
                {el?.status === "noAction" ? (
                  <p className="controls_wrapper">
                    <AcceptMini
                      width={25}
                      onClick={(e) =>
                        handleAcceptRejctAssessor(
                          e,
                          "personalDetail",
                          el?._id,
                          "accepted"
                        )
                      }
                    />
                    <RejectMini
                      width={25}
                      onClick={(e) =>
                        handleAcceptRejctAssessor(
                          e,
                          "personalDetail",
                          el?._id,
                          "rejected"
                        )
                      }
                    />
                  </p>
                ) : el?.status === "accepted" ? (
                  <p className="controls_wrapper">
                    <AcceptFull />
                  </p>
                ) : (
                  <p className="controls_wrapper">
                    <RejectFull />
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  function EducationList({ documents }) {
    return (
      <div className="grid">
        {documents.length < 1 && <p>No Data Found</p>}
        {documents.map((el, index) => {
          return (
            <div className={"details_card"} key={index}>
              <div className="document_wrapper">
                <h6 className="field_title">{el?.degree}</h6>
                <p className="field_value">
                  {
                    <a href={el?.url} target="location">
                      {el?.educationCertificateName || "-"}
                    </a>
                  }
                </p>
              </div>
              <div className="doc_link_wrapper">
                {el?.status === "noAction" ? (
                  <p className="controls_wrapper">
                    <AcceptMini
                      width={25}
                      onClick={(e) =>
                        handleAcceptRejctAssessor(
                          e,
                          "education",
                          el?._id,
                          "accepted"
                        )
                      }
                    />
                    <RejectMini
                      width={25}
                      onClick={(e) =>
                        handleAcceptRejctAssessor(
                          e,
                          "education",
                          el?._id,
                          "rejected"
                        )
                      }
                    />
                  </p>
                ) : el?.status === "accepted" ? (
                  <p className="controls_wrapper">
                    <AcceptFull />
                  </p>
                ) : (
                  <p className="controls_wrapper">
                    <RejectFull />
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  function ExperienceDetails({ documents }) {
    return (
      <div>
        {documents.length < 1 && <p>No Data Found</p>}
        {documents.map((el, index) => {
          return (
            <div className={"details_card grid3x3 exp_container"} key={index}>
              <div className="document_wrapper">
                <h6 className="field_title">{"Company Name"}</h6>
                <p className="field_value">{el?.companyName || "-"}</p>
              </div>
              <div className="document_wrapper">
                <h6 className="field_title">{"Designation"}</h6>
                <p className="field_value">{el?.designation || "-"}</p>
              </div>
              <div className="document_wrapper">
                <h6 className="field_title">{"Start Date"}</h6>
                <p className="field_value">{el?.startDate || "-"}</p>
              </div>
              <div className="document_wrapper">
                <h6 className="field_title">{"End Date"}</h6>
                <p className="field_value">{el?.endDate || "-"}</p>
              </div>
              <div className="document_wrapper nuclear">
                <div>
                  <h6 className="field_title">{"Attachment"}</h6>
                  <p className="field_value">
                    {
                      <a href={el?.url} target="location">
                        {el?.experienceCertificateName || "-"}
                      </a>
                    }
                  </p>
                </div>
                <div className="doc_link_wrapper">
                  {el?.status === "noAction" ? (
                    <p className="controls_wrapper">
                      <AcceptMini
                        width={25}
                        onClick={(e) =>
                          handleAcceptRejctAssessor(
                            e,
                            "experiences",
                            el?._id,
                            "accepted"
                          )
                        }
                      />
                      <RejectMini
                        width={25}
                        onClick={(e) =>
                          handleAcceptRejctAssessor(
                            e,
                            "experiences",
                            el?._id,
                            "rejected"
                          )
                        }
                      />
                    </p>
                  ) : el?.status === "accepted" ? (
                    <p className="controls_wrapper">
                      <AcceptFull />
                    </p>
                  ) : (
                    <p className="controls_wrapper">
                      <RejectFull />
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  function AgrementDetails({ documents }) {
    return (
      <div>
        {documents.length < 1 && <p>No Data Found</p>}
        {documents.map((el, index) => {
          return (
            <div className={"details_card grid"} key={index}>
              <div className="document_wrapper">
                <h6 className="field_title">{"Mode of Agreement"}</h6>
                <p className="field_value">
                  {assessBasicDetails?.modeofAgreement || "-"}
                </p>
              </div>
              <div className="document_wrapper">
                <h6 className="field_title">{"Agreement Validity"}</h6>
                <p className="field_value">{el?.agreementValidTo || "-"}</p>
              </div>
              <div className="document_wrapper nuclear">
                <div>
                  <h6 className="field_title">{"Agreement Certificate"}</h6>
                  <p className="field_value">
                    {
                      <a href={el?.url} target="location">
                        {el?.agreementCertificateName || "-"}
                      </a>
                    }
                  </p>
                </div>
                <div className="doc_link_wrapper">
                  {el?.status === "noAction" ? (
                    <p className="controls_wrapper">
                      <AcceptMini
                        width={25}
                        onClick={(e) =>
                          handleAcceptRejctAssessor(
                            e,
                            "agreement",
                            el?._id,
                            "accepted"
                          )
                        }
                      />
                      <RejectMini
                        width={25}
                        onClick={(e) =>
                          handleAcceptRejctAssessor(
                            e,
                            "agreement",
                            el?._id,
                            "rejected"
                          )
                        }
                      />
                    </p>
                  ) : el?.status === "accepted" ? (
                    <p className="controls_wrapper">
                      <AcceptFull />
                    </p>
                  ) : (
                    <p className="controls_wrapper">
                      <RejectFull />
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  function TrainingDetails({ documents }) {
    return (
      <div>
        {documents.length < 1 && <p>No Data Found</p>}
        {documents.map((el, index) => {
          return (
            <div className={"details_card grid3x3"} key={index}>
              <div className="document_wrapper">
                <h6 className="field_title">{"Job Role"}</h6>
                <p className="field_value">{el?.jobroleName || "-"}</p>
              </div>
              <div className="document_wrapper">
                <h6 className="field_title">{"Certificate Validity"}</h6>
                <p className="field_value">{el?.validUpto || "-"}</p>
              </div>
              <div className="document_wrapper nuclear">
                <div>
                  <h6 className="field_title">{"Certificate"}</h6>
                  <p className="field_value">
                    {
                      <a href={el?.url} target="location">
                        {el?.jobRoleCertificateName || "-"}
                      </a>
                    }
                  </p>
                </div>
                <div className="doc_link_wrapper">
                  {el?.status === "noAction" ? (
                    <p className="controls_wrapper">
                      <AcceptMini
                        width={25}
                        onClick={(e) =>
                          handleAcceptRejctAssessor(
                            e,
                            "jobRole",
                            el?._id,
                            "accepted"
                          )
                        }
                      />
                      <RejectMini
                        width={25}
                        onClick={(e) =>
                          handleAcceptRejctAssessor(
                            e,
                            "jobRole",
                            el?._id,
                            "rejected"
                          )
                        }
                      />
                    </p>
                  ) : el?.status === "accepted" ? (
                    <p className="controls_wrapper">
                      <AcceptFull />
                    </p>
                  ) : (
                    <p className="controls_wrapper">
                      <RejectFull />
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  function BankDetails({ documents }) {
    return (
      <div>
        {
          <div className={"details_card"}>
            <div className="grid" style={{ gap: "30px" }}>
              <div className="document_wrapper">
                <h6 className="field_title">{"Bank Name"}</h6>
                <p className="field_value">{documents?.bankName || "-"}</p>
              </div>
              <div className="document_wrapper">
                <h6 className="field_title">{"Branch Name"}</h6>
                <p className="field_value">
                  {documents?.bankBranchName || "-"}
                </p>
              </div>
              <div className="document_wrapper">
                <h6 className="field_title">{"Bank Account Number"}</h6>
                <p className="field_value">{documents?.bankAccount || "-"}</p>
              </div>
              <div className="document_wrapper">
                <h6 className="field_title">{"IFSC Code"}</h6>
                <p className="field_value">{documents?.bankIFSC || "-"}</p>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }

  const handleAcceptRejctAssessor = (e, objectName, imageId, newStatus) => {
    e.preventDefault();

    const payload = {
      assessor_Id: params?.id,
      imageUpdates: [
        {
          objectName,
          imageId,
          newStatus,
        },
      ],
    };
    dispatch(acceptRejectAssessorDocumentApi(setLoading, payload, getDetails));
  };

  return (
    <div className="main-content">
      <div className="title">
        <h1>
          <ArrowLeft
            onClick={() =>
              navigate(`${ASSESSOR_MANAGEMENT_HOME}?search=${section}`)
            }
          />
          <span>View Assessor Details</span>
        </h1>
      </div>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "flex" }}>
            <div className="form-wrapper" style={{ width: "100%" }}>
              <div className="form_title">
                <h1>BASIC DETAILS</h1>
              </div>
              <div className="form_mainContainer">
                <div className="form">
                  {/* <form> */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <h6 className="field_title">AR ID (SIP)</h6>
                      <p className="field_value">
                        {assessBasicDetails?.assessorSipId || "-"}
                      </p>
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <h6>Assessor Name</h6>
                      <p className="field_value">
                        {assessBasicDetails?.fullName}
                      </p>
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <h6>Email Address</h6>
                      <p className="field_value">{assessBasicDetails?.email}</p>
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <h6>Contact Number</h6>
                      <p className="field_value">
                        {assessBasicDetails?.mobile}
                      </p>
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <h6>Gender</h6>
                      <p className="field_value">
                        {assessBasicDetails?.gender}
                      </p>
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <h6>Date of Birth</h6>
                      <p className="field_value">{assessBasicDetails?.dob}</p>
                    </div>
                    <div
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
                    >
                      <h6>Address</h6>
                      <p className="field_value">
                        {assessBasicDetails?.address}
                      </p>
                    </div>
                    <div
                      className="form-group"
                      style={{ width: "calc(50% - 10px)" }}
                    >
                      <h6>Address</h6>
                      <p className="field_value">{assessBasicDetails?.state}</p>
                    </div>

                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <h6>Pincode</h6>
                      <p className="field_value">
                        {assessBasicDetails?.pinCode}
                      </p>
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <h6>District</h6>
                      <p className="field_value">
                        {assessBasicDetails?.district}
                      </p>
                    </div>
                    <div
                      style={{ width: "calc(50% - 10px)" }}
                      className="form-group"
                    >
                      <h6>Toa Type</h6>
                      <p className="field_value">
                        {assessBasicDetails?.ToaType}
                      </p>
                    </div>
                    {assessBasicDetails?.ToaType === "Radiant" && (
                      <div
                        style={{ width: "calc(50% - 10px)" }}
                        className="form-group"
                      >
                        <h6>Does Radiant Funded For Your Training?</h6>
                        <p className="field_value">
                          {assessBasicDetails?.RadiantFundToa ? "Yes" : "No"}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* </form> */}
                </div>
                <div className="img-upload-wrapper_assessor">
                  <div
                    className="new_img_upload"
                    style={{
                      border: [
                        errors?.assessorPhoto ? "1px solid #D70000" : "",
                      ],
                    }}
                  >
                    <img src={assessBasicDetails?.url || UserProfile} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "flex" }}>
            <div className="form-wrapper" style={{ width: "100%" }}>
              <div className="form_title">
                <h1>PERSONAL DETAILS</h1>
              </div>
              <div className="info_wrapper">
                <div className="form">
                  <div>
                    <div
                      style={{
                        width: "calc(100% - 10px)",
                      }}
                      className="form-group"
                    >
                      <DocumentList documents={assessorPersonalDetails} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "flex" }}>
            <div className="form-wrapper" style={{ width: "100%" }}>
              <div className="form_title">
                <h1>EDUCATION DETAILS</h1>
              </div>
              <div className="info_wrapper">
                <div className="form">
                  <div>
                    <div
                      style={{
                        width: "calc(100% - 10px)",
                      }}
                      className="form-group"
                    >
                      <EducationList documents={assessorEducationDetails} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "flex" }}>
            <div className="form-wrapper" style={{ width: "100%" }}>
              <div className="form_title">
                <h1>PREVIOUS EXPERIENCE DETAILS</h1>
              </div>
              <div className="info_wrapper">
                <div className="form">
                  <div>
                    <div
                      style={{
                        width: "calc(100% - 10px)",
                      }}
                      className="form-group"
                    >
                      <ExperienceDetails
                        documents={assessorExperienceDetails}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "flex" }}>
            <div className="form-wrapper" style={{ width: "100%" }}>
              <div className="form_title">
                <h1>ASSESSOR TRAINING DETAILS</h1>
              </div>
              <div className="info_wrapper">
                <div className="form">
                  <div>
                    <div
                      style={{
                        width: "calc(100% - 10px)",
                      }}
                      className="form-group"
                    >
                      <TrainingDetails documents={assessorTrainingDetails} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "flex" }}>
            <div className="form-wrapper" style={{ width: "100%" }}>
              <div className="form_title">
                <h1>BANK DETAILS</h1>
              </div>
              <div className="info_wrapper">
                <div className="form">
                  <div>
                    <div
                      style={{
                        width: "calc(100% - 10px)",
                      }}
                      className="form-group"
                    >
                      <BankDetails documents={assessorBankDetails} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sub-admin-wrapper">
        <div className="tab-content">
          <div className="edit-profile" style={{ display: "flex" }}>
            <div className="form-wrapper" style={{ width: "100%" }}>
              <div className="form_title">
                <h1>AGREEMENT DETAILS</h1>
              </div>
              <div className="info_wrapper">
                <div className="form">
                  <div>
                    <div
                      style={{
                        width: "calc(100% - 10px)",
                      }}
                      className="form-group"
                    >
                      <AgrementDetails documents={assessorAgreementDetails} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssessorProfile;
