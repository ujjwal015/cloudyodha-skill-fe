import React, { useState } from "react";
import EditProfile from "./tabs/editProfile";
import Password from "./tabs/password";
import SocialProfile from "./tabs/socialProfile";
import "./style.css";
const MyAccount = () => {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { id: 1, label: "Edit Profile", content: <EditProfile /> },
    { id: 2, label: "Password", content: <Password /> },
    { id: 3, label: "Social Profiles", content: <SocialProfile /> },
  ];

  const activeTabContent = tabs.find((tab) => tab.id === activeTab).content;

  return (
    <div className="main-content">
      <div className="title">
        <h1>My Account</h1>
      </div>
      <section className="my-account-wrapper">
        <div className="tabs-wrapper">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className="tab-content">{activeTabContent}</div>
      </section>
    </div>
  );
};

export default MyAccount;
