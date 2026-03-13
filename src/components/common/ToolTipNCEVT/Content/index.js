import React, { useEffect, useState } from "react";
import "./style.css"

const Content = ({data}) => {
    const [valueArray,setValueArray]=useState([])
    useEffect(()=>{

    },[])
  return (
    <div 
    style={{display:!data.length>0 && "none" }}
    >
        <ol  style={{listStyleType:"decimal",padding:"5px", maxHeight:"200px",overflowY:"scroll", scrollbarWidth:"none"}}>
      {data.length>0 && data.map((item)=>{
        return <li>{item.jobRole.length>50 ? item.jobRole.slice(0,50) : item.jobRole}</li>
      })}
</ol>
    </div>
  );
};

export default Content;
