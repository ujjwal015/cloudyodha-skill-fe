import React from "react";
import Tooltip from "./Tooltip";
import "./styles.css";
import Content from "./Content";

export default function ToolTipNCEVT({data=[],children}) {
  return (
    <div>
        <Tooltip content={data.length>0 ? <Content data={data}/> : ""} data={data} direction="right"  >
            {children}            
        </Tooltip>
    </div>
  );
}
