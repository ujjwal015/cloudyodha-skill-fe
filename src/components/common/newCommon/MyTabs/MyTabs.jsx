import "./MyTabs.css";
import React from "react";
import { Tab, Tabs } from "@mui/material";

const MyTabs = (props) => {
  const {tabsData, activeTab, handleTab} = props;
  const {isPermissions} = activeTab || {};
  
  return (
    <div className="myTabs">
      <Tabs value={0} aria-label="basic tabs example">
        {tabsData?.map((item, idx) => (
          <Tab
            key={idx}
            className={`${activeTab?.name === item?.name ? "myTabs selected" : ""}`}
            disabled={item?.isDisable}
            label={
              <p>
                {item.tabName}
              {item?.isCount && item?.count !== null && activeTab?.name === item?.name &&  <span>{item?.count}</span>}
              </p>
            }
            onClick={() => !item.isDisable && handleTab(item)}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default MyTabs;
