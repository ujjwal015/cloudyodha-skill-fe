import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css"
import SubmitButton from "../../../../../components/SubmitButton";
import { ReactComponent as Edit } from "../../../../../assets/images/pages/userProfile/Icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../../../redux/slicers/authSlice";
import { updateProfileAboutApi } from "../../../../../api/authApi";

const Quill = ReactQuill.Quill;
var Font = Quill.import("formats/font");
Font.whitelist = ["Ubuntu", "Calibri", "Algerian"];
Quill.register(Font, true);



const UserAbout = ({UserAboutData}) => {

  const [loading, setLoading] = useState(false);
  const [isActive, setActive] = useState("none");
  const [initialValues, setInitialValues] = useState({
    aboutJob: '',
    jobDescription: '',
    jobInterest: ''
  });
  const [isTruncatedAbout, setIsTruncatedAbout] = useState(true);
  const [isTruncatedJob, setIsTruncatedJob] = useState(true);
  const [isTruncatedInterest, setIsTruncatedInterest] = useState(true);
  const [formValues,setFormValues]=useState(initialValues); //set just before the Dispatch
  const [aboutJob, setAbout] = useState("");
  const [jobDescription,setJob]=useState("");
  const [jobInterest,sethobbies]=useState("");
  const [userId,setUserId]=useState();
  const [error,setError]=useState(null);
  const dispatch=useDispatch();

  const {getProfileDetails={}}=useSelector(authSelector);

  useEffect(() => {
    setAbout(getProfileDetails.aboutJob);
    setJob(getProfileDetails.jobDescription);
    sethobbies(getProfileDetails.jobInterest);
    setUserId(getProfileDetails._id);
    setInitialValues({
      aboutJob: getProfileDetails.aboutJob,
      jobDescription: getProfileDetails.jobDescription,
      jobInterest: getProfileDetails.jobInterest
    });
  }, [getProfileDetails]);

  const truncateText = (htmlContent, maxLength = 100) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const textContent = doc.body.textContent || ""; // Extract plain text for truncation
    if (textContent.length > maxLength) {
      return `${textContent.slice(0, maxLength)}...`;
    }
    return htmlContent; // Return original HTML content if not truncated
  };
  

  const validateData = (content) => {
    // This validation removes only script tags and unsafe elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    return doc.body.innerHTML;
  };
  

  const handleEdit = (section) => {
    setActive(section);
  };

  const handleSubmit = (section) => {
    let data;
    switch (section) {
      case 'aboutJob':
        data=aboutJob;
        break;
      case 'jobDescription':
        data=jobDescription;
        break;
      case 'jobInterest':
        data=jobInterest;
        break;
      default:
        break;
    }

    const newData=validateData(data);
    if(newData===""){
      setError("Please Enter Some Text");
      return ;
    }
    setFormValues((prev)=>({...prev,[section]:newData}));
    dispatch(updateProfileAboutApi(userId,{ [section]: newData },setLoading,setInitialValues,setActive,section,newData,setError))
  };

  const handleTextChange=(content,section)=>{
    if(section==='aboutJob'){
      setAbout(content);
    }else if(section==='jobDescription'){
      setJob(content);
    }else if(section==='jobInterest'){
      sethobbies(content);
    }
  }

  const clearValues = (section) => {
    setError(null);
    if (section === 'aboutJob') {
      setAbout(initialValues.aboutJob);   
    } else if (section === 'jobDescription') {
      setJob(initialValues.jobDescription);   
    } else if (section === 'jobInterest') {
      sethobbies(initialValues.jobInterest);   
    }
    setActive('none');
  };
  

  const modules = {
    clipboard: {
      matchVisual: false,
    },
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header levels
      [{ font: [] }], // Font family
      [{ size: [] }], // Font size
      [{ color: [] }, { background: [] }], // Font and background colors
      ["bold", "italic", "underline", "strike"], // Bold, italic, underline, strikethrough
      [{ align: [] }], // Text alignment (left, center, right, justify)
      [{ list: "ordered" }, { list: "bullet" }], // Ordered and bullet lists
      [{ script: "sub" }, { script: "super" }], // Subscript and superscript
      // ["blockquote", "code-block"], // Blockquote and code block
      // ["link", "image", "video"], // Links, images, and videos
      ["clean"], // Remove formatting
    ],
  };
  
  const format = [
    "header",
    "font",
    "size",
    "color",
    "background",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "script",
    "link",
    "image",
    "video",
    "code-block",
  ];
  
  


  return (
    <div className="aboutContainer">
      <div className="about">
        <h1 className="tittle">
          ABOUT <span onClick={() => handleEdit("aboutJob")}><Edit/></span>
        </h1>
        <div className="paragraph">
        {isActive !== "aboutJob" && (
            <>
              {/* <p className={isTruncatedAbout ? '' : 'expanded'}>{isTruncatedAbout ? truncateText(aboutJob) : validateData(aboutJob)}</p> */}
              <div 
                className={isTruncatedAbout ? '' : 'expanded'} 
                dangerouslySetInnerHTML={{
                  __html: isTruncatedAbout ? truncateText(aboutJob) : aboutJob
                }} 
              />
                {aboutJob?.length > 100 && (
                  <button className="edit-btn" onClick={() => setIsTruncatedAbout(!isTruncatedAbout)}>
                    {isTruncatedAbout ? "Read More" : "Read Less"}
                  </button>
                )}
            </>
          )}
        </div>
        {isActive === "aboutJob" && (
          <div className="form-group-full-about">
            <ReactQuill
              theme="snow"
              value={aboutJob}
              onChange={(content) =>  handleTextChange(content,"aboutJob")}
              modules={modules}
              formats={format}
              error={error}
              placeholder="Change your about section..."
              style={{ direction: "ltr", textAlign: "left" }}
            />
            <SubmitButton
              cancelBtnText="Cancel"
              submitBtnText="Submit"
              handleSubmit={()=>{handleSubmit('aboutJob')}}
              clearFormValues={()=>clearValues('aboutJob')}
              loading={loading}
            />
           {error&&<h3 className="error">{"*"}{error}</h3>}
          </div>
        )}
      </div>
      <div className="Job">
        <h1 className="tittle">
          WHAT I LOVE ABOUT MY JOB <span onClick={() => handleEdit("jobDescription")}><Edit/></span>
        </h1>
        <div className="paragraph">
        {isActive !== "jobDescription" && (
            <>
              {/* <p className={isTruncatedJob ? '' : 'expanded'}>{isTruncatedJob ? truncateText(jobDescription) : validateData(jobDescription)}</p> */}
              <div 
                className={isTruncatedAbout ? '' : 'expanded'} 
                dangerouslySetInnerHTML={{
                  __html: isTruncatedAbout ? truncateText(jobDescription) : jobDescription
                }} 
              />
              {jobDescription?.length > 100 && (
                <button className="edit-btn" onClick={() => setIsTruncatedJob(!isTruncatedJob)}>
                  {isTruncatedJob ? "Read More" : "Read Less"}
                </button>
              )}
            </>
          )}
        </div>
        {isActive === "jobDescription" && (
          <div className="form-group-full-about">
            <ReactQuill
              theme="snow"
              value={jobDescription}
              onChange={(content) =>  handleTextChange(content,"jobDescription")}
              modules={modules}
              formats={format}
              error={error}
              placeholder="Change your job section..."
              style={{ direction: "ltr", textAlign: "left" }}
            />
            <SubmitButton
              cancelBtnText="Cancel"
              submitBtnText="Submit"
              handleSubmit={()=>{handleSubmit('jobDescription')}}
              clearFormValues={()=>clearValues('jobDescription')}
              loading={loading}
            />
           {error&&<h3 className="error">{"*"}{error}</h3>}
          </div>
        )}
      </div>
      <div className="Hobbies">
        <h1 className="tittle">
          MY INTEREST AND HOBBIES <span onClick={() => handleEdit("jobInterest")}><Edit/></span>
        </h1>
        <div className="paragraph">
          {isActive !== "jobInterest" && (
              <>
                {/* <p className={isTruncatedInterest ? '' : 'expanded'} >{isTruncatedInterest ? truncateText(jobInterest) : validateData(jobInterest)}</p> */}
                <div 
                className={isTruncatedAbout ? '' : 'expanded'} 
                dangerouslySetInnerHTML={{
                  __html: isTruncatedAbout ? truncateText(jobInterest) : jobInterest
                }} 
              />
                  {jobInterest?.length > 100 && (
                    <button  className="edit-btn" onClick={() => setIsTruncatedInterest(!isTruncatedInterest)}>
                      {isTruncatedInterest ? "Read More" : "Read Less"}
                    </button>
                  )}
              </>
            )}
        </div>
        {isActive === "jobInterest" && (
          <div className="form-group-full-about">
            <ReactQuill
              theme="snow"
              value={jobInterest}
              onChange={(content) =>  handleTextChange(content,"jobInterest")}
              modules={modules}
              formats={format}
              error={error}
              placeholder="Change your hobbies section..."
              style={{ direction: "ltr", textAlign: "left" }}
            />
            <SubmitButton
              cancelBtnText="Cancel"
              submitBtnText="Submit"
              handleSubmit={()=>{handleSubmit('jobInterest')}}
              clearFormValues={()=>clearValues('jobInterest')}
              loading={loading}
            />
           {error&&<h3 className="error">{"*"}{error}</h3>}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAbout;
