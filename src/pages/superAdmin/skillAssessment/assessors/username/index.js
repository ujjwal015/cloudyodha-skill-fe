import PageTitle from "./../../../../../components/common/PageTitle";
import BreadCrumbs from "./../../../../../components/common/Breadcrumbs";
import { SKILL_ASSESSMENT_ASSESSORS_PAGE } from "../../../../../config/constants/routePathConstants/superAdmin";
import { useNavigate, useParams } from "react-router-dom";
import "../../style.css";
import { useDispatch, useSelector } from "react-redux";
import { skilAssessmentSelector } from "../../../../../redux/slicers/superAdmin/skillAssessment";
import { useEffect, useState } from "react";
import { assessorsDetailsListApi } from "../../../../../api/superAdminApi/skillAssessment";

const Username = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const {id}=useParams();
  const [loading,setLoading]=useState(false)
  const {accessorDetailsList={}}=useSelector(skilAssessmentSelector);
  const [assessorsDetailsData,setAssessorData]=useState();
  console.log(accessorDetailsList,"accessorDetailsList");
  const handleBreadCrumbClick = (event, name, path) => {
    event.preventDefault();
    path && navigate(path);
  };
  
  useEffect(()=>{
    setLoading(true)
    dispatch(assessorsDetailsListApi(setLoading,setAssessorData,id))
  },[])

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
      name: "Assessor",
      isLink: true,
      key: "2",
      path: SKILL_ASSESSMENT_ASSESSORS_PAGE,
      onClick: handleBreadCrumbClick,
      isPermissions: {},
      isDisable: false,
    },
    {
      name: "View Details",
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
        <PageTitle title={"Assessor List"} />
        <BreadCrumbs breadCrumbsLists={breadCrumbsData} />
      </div>
      <div className="skill-assessment-page">
        <h3>Assessor List</h3>

        <div className="skill-assessment-card">
          <div className="skill-assessment-card--header">
            <h4>Basic Information</h4>
            <p>View Basic description and necessary information from here.</p>
          </div>

          <div className="skill-assessment-card--body">
            <ul className="grid-cols-3">
                 <li>
                  <p>Assessor ID (SIP) : </p>{accessorDetailsList[0]?.assessorId||"NA"}
                  </li>
                <li>
                  <p>Assessor Name : </p>{accessorDetailsList[0]?.firstname ||"NA"}
                </li>
                <li>
                  <p>Date of Birth : </p>{accessorDetailsList[0]?.dob||"NA"}
                </li>
                <li>
                  <p>Gender :  </p>{accessorDetailsList[0]?.gender||"NA"}
                </li>
                <li>
                  <p>Email Address : </p>{accessorDetailsList[0]?.email||"NA"}
                </li>
                <li>
                  <p>Mobile Number : </p>{accessorDetailsList[0]?.firstname||"NA"}
                </li>
                <li>
                  <p>City : </p>{accessorDetailsList[0]?.City||"NA"}
                </li>
                <li>
                  <p>State : </p>{accessorDetailsList[0]?.firstname||"NA"}
                </li>
                <li>
                  <p>Address : </p>{accessorDetailsList[0]?.address1+accessorDetailsList[0]?.address2 ||"NA"}
                </li>
                <li>
                  <p>Assessor Type : </p>{accessorDetailsList[0]?.firstname||"NA"}
                </li>
                <li>
                  <p>Scheme Selection : </p>{accessorDetailsList[0]?.firstname||"NA"}
                </li>
            </ul>
          </div>
        </div>

        <div className="skill-assessment-card">
          <div className="skill-assessment-card--header">
            <h4>Proof of Identity Details</h4>
            <p>View Identity Documents Details and necessary information from here.</p>
          </div>

          <div className="skill-assessment-card--body">
            <ul className="grid-cols-4">
                <li>
                  <p>Aadhaar Number : </p>{accessorDetailsList[0]?.aadhar||"NA"}
                  </li>
                <li>
                  <p>PAN Number : </p>{accessorDetailsList[0]?.pan ||"NA"}
                </li>
            </ul>
          </div>
        </div>

        <div className="skill-assessment-card">
          <div className="skill-assessment-card--header">
            <h4>Education Details</h4>
            <p>View Education Details and necessary information from here.</p>
          </div>

          <div className="skill-assessment-card--body">
            <ul className="grid-cols-3">
                <li>
                  <p>Quatlification : </p>{accessorDetailsList[0]?.qualification||"NA"}
                </li>
            </ul>
          </div>
        </div>

        <div className="skill-assessment-card">
          <div className="skill-assessment-card--header">
            <h4>Bank Details</h4>
            <p>View Bank Details and necessary information from here.</p>
          </div>

          <div className="skill-assessment-card--body">
            <ul className="grid-cols-3">
                <li>
                  <p>Bank Name : </p>{accessorDetailsList[0]?.bankname||"NA"}
                </li>
                <li>
                  <p>Branch Name : </p>{accessorDetailsList[0]?.branchName||"NA"}
                </li>
                <li>
                  <p>Account Number : </p>{accessorDetailsList[0]?.accountNumber||"NA"}
                </li>
                <li>
                  <p>Account Holders Name : </p>{accessorDetailsList[0]?.accountHolderNumber||"NA"}
                </li>
                <li>
                  <p>IFSC Code : </p>{accessorDetailsList[0]?.ifsc||"NA"}
                </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Username;
