import { Icon } from "@iconify/react/dist/iconify.js";
import { Line } from "react-chartjs-2";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactComponent as OnlineIcon } from "../../../assets/icons/onlineIcon_dashboard.svg";
import { ReactComponent as OfflineIcon } from "../../../assets/icons/offlineIcon_dashboard.svg";

import { Button } from "@mui/material";
import { styled } from "@mui/system";
import MyFilledBtn from "./../newCommon/Buttons/MyFilledBtn";
import MyOutlinedBtn from "../newCommon/Buttons/MyOutlinedBtn";

const CategoryWise = (props) => {
  const {
    categoryName = "",
    className,
    data,
    options,
    isPermissions,
    style = {},
    isAssessmentAnalyticsSection = false,
    setFilterValue,
  } = props?.catergoryWiseData;

  const [selectedButton, setSelectedButton] = useState("weekly");

  const handleButtonClick = useCallback(
    (e) => {
      e.preventDefault();
      setFilterValue(e.target.value);
      if (e.target.value === "weekly") {
        setSelectedButton("weekly");
      } else if (e.target.value === "monthly") {
        setSelectedButton("monthly");
      }
    },
    [setFilterValue],
  );

  useEffect(() => {
    setFilterValue("weekly");
  }, []);

  const buttons = useMemo(() => {
    return [
      { bordercolor: "#9787FF", label: "Online" },
      { bordercolor: "#FBBF24", label: "Offline" },
    ];
  }, []);

  const handleStyleChange = useCallback(() => {
    if (selectedButton === "weekly") {
      return { backgroundColor: "#1975FF", color: "#FFFFFF" };
    } else if (selectedButton === "monthly") {
      return { backgroundColor: "#1975FF", color: "#FFFFFF" };
    } else {
      return {};
    }
  }, [selectedButton]);

  return (
    <div className={`SectorWiseOverviewAreaChart chart-card ${className}`}>
      <div className="SectorWiseOverviewAreaChart__header">
        <h2 style={{ fontSize: "large" }}>{categoryName}</h2>
        <div className="SectorWiseOverviewAreaChart__legend">
          {buttons.map((item, idx) => (
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {item.label == "Online" && <OnlineIcon />}
              {item.label == "Offline" && <OfflineIcon />}
              <p>{item.label}</p>
            </div>
          ))}
          {isAssessmentAnalyticsSection && (
            selectedButton==="weekly" ? <MyFilledBtn btnItemData={{ text: "Weekly", value:"weekly", onClick: (e) => handleButtonClick(e) }} /> :
            <MyOutlinedBtn  text= "Weekly" value="weekly" onClick={(e) => handleButtonClick(e)} />
          )}

          {isAssessmentAnalyticsSection && (
            selectedButton==="monthly" ? <MyFilledBtn btnItemData={{ text: "Monthly", value:"monthly",onClick: (e) => handleButtonClick(e) }} /> :
            <MyOutlinedBtn  text= "Monthly" value="monthly" onClick={(e) => handleButtonClick(e)} />
          )}
         
        </div>
      </div>
      <div style={{ flexGrow: 1 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryWise;
