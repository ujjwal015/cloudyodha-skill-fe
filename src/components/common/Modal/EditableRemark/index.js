import React, { useState } from "react";
import HorizontalActionDropdown from "../../../newCommon/HorizontalActionDropdown/HorizontalActionDropdown";
import UserImage from "../RemarkModal/UserImage";
import EditRemark from "../../../../pages/superAdmin/LeadsManagement/EditRemark";
import UserProfile from "../../../../assets/images/pages/clientManagement/dummy-user-profile.png";
import { useDispatch } from "react-redux";
import { deleteSingleRemarkOfSpecificLeadApi } from "../../../../api/authApi";
import "./style.css"
import TimeAgoComponent from "../../TimeConverter";

export default function ViewAndEditRemark({ item,leadId,getDemoUserSpecificRemarkList,userId }) {

  const calculateTimeAgo = (dateTime) => {
    const currentDate = new Date();
    console.log("currentDate",currentDate);
    const previousDate = new Date(dateTime);
    console.log('previousDate',previousDate)
    let time="";
    
    const seconds = Math.floor((currentDate - previousDate) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      time=(`${interval} years ago`);
      return time;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      time=(`${interval} weeks ago`);
      return time;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      time=(`${interval} days ago`);
      return time;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      time=(`${interval} hours ago`);
      return time;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      time=(`${interval} minutes ago`);
      return time;
    }
    time=(`${Math.floor(seconds)} seconds ago`);
    return time

  };
  console.log("ITEM_ITEM_2",item.userId.ProfileUrl)

  const [editSpecificRemarkStatus, setEditSpecificRemarkStatus] = useState(false);
  const dispatch=useDispatch();
  const [loading,setLoading]=useState();
  console.log("ITEM_ITEM",item);
  
  const handleRemarkDelete=()=>{
    dispatch(deleteSingleRemarkOfSpecificLeadApi(setLoading,item._id, getDemoUserSpecificRemarkList));
  }
  return (
    <>
    {editSpecificRemarkStatus ? 
    <EditRemark item={item} leadId={leadId} getDemoUserSpecificRemarkList={getDemoUserSpecificRemarkList} setEditSpecificRemarkStatus={setEditSpecificRemarkStatus} userId={userId}/>:
    <div>
      <div className="listitems-header-section">
        <div className="listitems-header-title">
          {/* <UserImage imageUrl={} /> */}
          <img src={UserProfile||item.userId.ProfileUrl} alt='' style={{height:"40px",width:"40px"}}className="leadmanagement-remark-specificProfile"/>
          <h2>{item.userId.firstName}</h2>
          {/* <h3 className="add-remark-timestamp">{calculateTimeAgo(item.createdAt) || "-"}</h3> */}
          <TimeAgoComponent dateTime={item.createdAt}/>
        </div>
        <HorizontalActionDropdown
          data={item}
          editSpecificRemarkStatus={editSpecificRemarkStatus}
          setEditSpecificRemarkStatus={setEditSpecificRemarkStatus}
          handleRemarkDelete={handleRemarkDelete}
          getDemoUserSpecificRemarkList={getDemoUserSpecificRemarkList}
        />
      </div>
      <div>
        <HtmlToText htmlString={item?.remark} />
      </div>
    </div>}
    </>
    
  );
}

const HtmlToText = ({ htmlString }) => {
  // const [bold,setBold]=useState(false);
  // const [italic,setItalic]=useState(false);
  // const [plainText,setPlainText]=useState("");
  console.log("htmlString", htmlString);

  let bold = false;
  let italic = false;
  let plainText = "";

  if (
    htmlString.includes("<b>") &&
    htmlString.includes("</b>") &&
    htmlString.includes("<i>") &&
    htmlString.includes("</i>")
  ) {
    const newStringWithoutTag = htmlString
      .replace("<b>", "")
      .replace("</b>", "")
      .replace("<i>", "")
      .replace("</i>", "");
    // setPlainText(newStringWithoutTag);
    // plainText=newStringWithoutBold.replace(/<\s*i[^>]*>.*?<\s*\/\s*i\s*>/gi,"")
    plainText = newStringWithoutTag;
    // setBold(true)
    bold = true;
    // setItalic(true)
    italic = true;
  } else if (
    htmlString.includes("<b>") &&
    htmlString.includes("</b>") &&
    !htmlString.includes("<i>") &&
    !htmlString.includes("</i>")
  ) {
    // setBold(true)
    // setItalic(false)
    bold = true;
    italic = false;

    // plainText=htmlString.replace("<b>","").replace("</b>","");
    // setPlainText(htmlString.replace("<b>","").replace("</b>",""));
  } else if (
    !htmlString.includes("<b>") &&
    !htmlString.includes("</b>") &&
    htmlString.includes("<i>") &&
    htmlString.includes("</i>")
  ) {
    // setBold(false)
    // setItalic(true)
    bold = false;
    italic = true;
    // setPlainText(htmlString.replace("<i>","").replace("</i>",""));
    plainText = htmlString.replace("<i>", "").replace("</i>", "");
  } else if (
    !htmlString.includes("<b>") &&
    !htmlString.includes("</b>") &&
    !htmlString.includes("<i>") &&
    !htmlString.includes("</i>")
  ) {
    // setBold(false)
    // setItalic(false)
    bold = false;
    italic = false;
    // setPlainText(htmlString);
    plainText = htmlString;
  }
  return (
    <h1 style={{paddingLeft:"40px"}}>
      {bold && italic ? (
        <b>
          <i>{plainText}</i>
        </b>
      ) : bold && !italic ? (
        <b>{plainText}</b>
      ) : italic && !bold ? (
        <i>{plainText}</i>
      ) : (
        plainText
      )}
    </h1>
  );
};
