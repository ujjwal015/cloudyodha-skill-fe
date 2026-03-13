import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { ProfileCard } from "./cards/profile";
import Model from "./model";
import UserAbout from "./About";
import DeviceInfoCard from "./cards/deviceInfo";
import BasicDetails from "./../../examManagement/batch/editBatch/BasicDetails";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../../redux/slicers/authSlice";
import { ExperienceProfileCard } from "./cards/ExperienceCard/experienceProfile";
import ExperienceModel from "./ExperienceModel";
import { DeleteProfileEducationApi, DeleteProfileExperienceApi } from "../../../../api/authApi";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ basicDetails, getUserProfile, userId}) {
  const { stateLists = [], getProfileDetails = {} } = useSelector(authSelector);
  const [value, setValue] = useState(0);
  const [cardId, setCardId] = useState("")
  const [experienceData, setExperienceData] = useState();
  const [degreeData, setDegreeData] = useState();
  const [identity_docs, setIdentity_docs] = useState({})
  const [selectedCard, setSelectedCard] = useState(null);
  const [open, setOpen] = useState(false);
  const [addExperience, setAddExperience] = useState(false);
  const [loading,setloading]=useState(false);
  const [errors,setErrors]=useState({});
  const dispatch=useDispatch();

  useEffect(() => {
    const aadharCardS3Url = basicDetails?.personalDetail?.find((item) => item?.cardType === 'AadharCard')?.cardFileName
    const panCardS3Url = basicDetails?.personalDetail?.find((item) => item?.cardType === 'Pancard')?.cardFileName
    setIdentity_docs({ aadharCardS3Url, panCardS3Url })
  }, [basicDetails])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleExperienceData = () => {
    if (!getProfileDetails?.experiences) {
      return [];
    }

    return getProfileDetails?.experiences?.map((item) => {
      return {
        _id: item._id,
        contents: [
          {
            label: "COMPANY NAME",
            value: item?.companyName || "",
            key: "companyName",
            type: "text",
          },
          {
            label: "JOB TITLE",
            value: item?.jobTitle || "",
            key: "jobTitle",
            type: "text",
          },
          {
            label: "DATE OF JOINING",
            value: item?.dateOfJoining || "",
            type: "date",
            key: "dateOfJoining",
          },
          {
            label: "DATE OF RELIEVING",
            value: item?.dateOfReceiving || "",
            type: "date",
            key: "dateOfReceiving",
          },
          {
          label: 'EXPERIENCE CERTIFICATE',
          value: item?.experienceCertificateName || "",
          type: 'file',
          key: 'experienceCertificate'
          },
          {
            label: "EXPERIENCE CERTIFICATE NAME",
            value: item?.experienceCertificateName || "",
            type: "none",
            key: "experienceCertificateName",
          },
          {
            label: "EXPERIENCE CERTIFICATE SIZE",
            value: item?.experienceCertificateSize || "",
            type: "none",
            key: "experienceCertificateSize",
          },
          {
            label: "EXPERIENCE CERTIFICATE KEY",
            value: item?.experienceCertificateKey || "",
            type: "none",
            key: "experienceCertificateKey",
          },
          {
            label: "IS EXPERIENCE UPLOADED",
            value: item?.isExperienceUploaded || "",
            type: "none",
            key: "isExperienceUploaded",
          },
        ],
      };
    });
  };


  const handleDegreeData = () => {
    if (!getProfileDetails?.education) {
      return [];
    }

    return getProfileDetails?.education?.map((item) => {
      return {
        _id: item._id,
        contents: [
          {
            label: "DEGREE",
            value: item?.degree,
            key: "degree",
            type: "text",
          },
          {
            label: "BRANCH/SPECIALIZATION",
            value: item?.specilization,
            key: "specilization",
            type: "text",
          },
          {
            label: "YEAR OF JOINING",
            value: item?.yearOfJoining,
            type: "date",
            key: "yearOfJoining",
          },
          {
            label: "YEAR OF COMPLETING",
            value: item?.yearOfCompletion,
            type: "date",
            key: "yearOfCompletion",
          },
          {
          label: 'DEGREE CERTIFICATE',
          value: item?.educationCertificateName || "",
          type: 'file',
          key: 'degreeCertificate'
          },
          {
            label: "EDUCATION CERTIFICATE NAME",
            value: item?.educationCertificateName || "",
            type: "none",
            key: "educationCertificateName",
          },
          {
            label: "EDUCATION CERTIFICATE SIZE",
            value: item?.educationCertificateSize || "",
            type: "none",
            key: "educationCertificateSize",
          },
          {
            label: "EDUCATION CERTIFICATE KEY",
            value: item?.educationCertificateKey || "",
            type: "none",
            key: "educationCertificateKey",
          },
          {
            label: "IS EDUCATION UPLOADED",
            value: item?.isEducationUploaded || "",
            type: "none",
            key: "isEducationUploaded",
          },
        ],
      };
    });
  };

  useEffect(() => {
    setDegreeData(handleDegreeData())
    setExperienceData(handleExperienceData())
  }, [getProfileDetails])

  //basic details tab data
  const cardsData = {
    noOfCards: 4,
    cardsInfo: [
      {
        title: "Basic Details",
        content: [
          {
            label: "Full Name",
            value: `${basicDetails?.firstName} ${basicDetails?.lastName}` || "NA",
            key: "fullName",
            type: "text",
          },
          {
            label: "Designation",
            value: basicDetails?.designation || "NA",
            key: "designation",
            type: "text",
          },
          {
            label: "Phone Number",
            value: basicDetails?.mobile || "NA",
            type: "text",
            key: "mobile",
          },
          {
            label: "Email Address",
            value: basicDetails?.email || "NA",
            type: "text",
            key: "email",
          },
          {
            label: "Gender",
            value: basicDetails?.gender || "NA",
            type: "select",
            options: [
              { label: "male", value: "male" },
              { label: "female", value: "female" },
              { label: "transgender", value: "transgender" },
              { label: "notSpecify", value: "notSpecify" },
            ],
            key: "gender",
          },
          {
            label: "Date Of Birth",
            value: basicDetails?.dob || "NA",
            type: "date",
            key: "dob",
          },
          {
            label: "Marital Status",
            value: basicDetails?.maritalStatus || "NA",
            type: "select",
            options: [
              { label: "single", value: "single" },
              { label: "married", value: "married" },
              {
                label: "don't prefer to disclose",
                value: "don't prefer to disclose",
              },
            ],
            key: "maritalStatus",
          },
          {
            label: "Blood Group",
            value: basicDetails?.bloodGroup || "NA",
            type: "text",
            key: "bloodGroup",
          },
          {
            label: "Nationality",
            value: basicDetails?.nationality || "NA",
            type: "text",
            key: "nationality",
          },
        ],
      },
      {
        title: "Contact Details",
        content: [
          {
            label: "Work Email",
            value: basicDetails?.workEmail || "NA",
            type: "text",
            key: "workEmail",
          },
          {
            label: "Phone Number",
            value: basicDetails?.phoneNumber || "NA",
            type: "text",
            key: "phoneNumber",
          },
          {
            label: "Work Number",
            value: basicDetails?.workNumber || "NA",
            type: "text",
            key: "workNumber",
          },
          {
            label: "Home Number",
            value: basicDetails?.homeNumber || "NA",
            type: "text",
            key: "homeNumber",
          },
          {
            label: "Teams Id",
            value: basicDetails?.teamId || "NA",
            type: "text",
            key: "teamId",
          },
        ],
      },
      {
        title: "Address",
        content: [
          {
            label: "Address 1",
            value: basicDetails?.currentAddress?.address1 || "NA",
            type: "text",
            key: "currentStreet",
            group: "currentAddress",
          },
          {
            label: "Current City",
            value: basicDetails?.currentAddress?.city || "NA",
            type: "text",
            key: "currentCity",
            group: "currentAddress",
          },
          {
            label: "Current State",
            value: basicDetails?.currentAddress?.state || "NA",
            type: "select",
            key: "currentState",
            options: stateLists,
            group: "currentAddress",
          },
          {
            label: "Current Pin Code",
            value: basicDetails?.currentAddress?.pinCode || "NA",
            type: "text",
            key: "currentPinCode",
            group: "currentAddress",
          },

          // Permanent Address
          {
            label: "Address 1",
            value: basicDetails?.permanentAddress?.address1 || "NA",
            type: "text",
            key: "permanentStreet",
            group: "permanentAddress",
          },
          {
            label: "Permanent City",
            value: basicDetails?.permanentAddress?.city || "NA",
            type: "text",
            key: "permanentCity",
            group: "permanentAddress",
          },
          {
            label: "Permanent State",
            value: basicDetails?.permanentAddress?.state || "NA",
            type: "select",
            key: "permanentState",
            options: stateLists,
            group: "permanentAddress",
          },
          {
            label: "Permanent Pin Code",
            value: basicDetails?.permanentAddress?.pinCode || "NA",
            type: "text",
            key: "permanentPinCode",
            group: "permanentAddress",
          },
          {
            label: "Same as Current Address",
            value: false,
            type: "checkbox",
            key: "sameAsCurrentAddress",
          },
        ],
      },
      {
        title: "Identity Information",
        content: [
          {
            label: "Aadhar Card",
            value: basicDetails?.personalDetail?.find((item) => item?.cardType === 'AadharCard')?.cardNo,
            type: "text",
            key: "aadharNo",
          },
          {
            label: "Uploaded Aadhar",
            value: identity_docs?.aadharCardS3Url,
            type: "file",
            key: "aadharCard",
          },
          {
            label: "Pan Card",
            value: basicDetails?.personalDetail?.find((item) => item?.cardType === 'Pancard')?.cardNo,
            type: "text",
            key: "panCardNo",
          },
          {
            label: "Uploaded Pan Card",
            value: identity_docs?.panCardS3Url,
            type: "file",
            key: "panCard",
          },
        ],
      },
    ],
  };
  // cards data for experience section
  const cardsDataExperience = {
    noOfCards: 2,
    cardsInfo: [
      {
        title: "Previous Experience",
        content: experienceData
      },
      {
        title: "Degrees & Certificates",
        content: degreeData
      },
    ],
  };
  

  const handleEdit = (card, id) => {
    setSelectedCard(card);
    setOpen(true);
  };
  const onAddHandler = (card) => {
    setSelectedCard(card);
    setAddExperience(true);
    setOpen(true);
  }
  const onDelete=(idToDelete,keyToDelete)=>{
    if(keyToDelete.cardName==='experience'){
      dispatch(DeleteProfileExperienceApi(userId,idToDelete,keyToDelete.value,setErrors,setloading))
    }else{
      dispatch(DeleteProfileEducationApi(userId,idToDelete,keyToDelete.value,setErrors,setloading))
    }
  }

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedCard(null);
    setAddExperience(false);
    setCardId("")
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="About" {...a11yProps(0)} />
          <Tab label="Profile" {...a11yProps(1)} />
          <Tab label="Experience" {...a11yProps(2)} />
          <Tab label="Device Information" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <UserAbout UserAboutData={basicDetails} />
      </TabPanel>
      <TabPanel value={value} index={1} className="card-list-wrapper">
        <div className="card-list">
          {cardsData.cardsInfo.map((card, index) => (
            <ProfileCard
              key={index}
              title={card.title}
              content={card.content}
              onEdit={() => handleEdit(card)}
            />
          ))}
        </div>
        {open && (
          <Model
            card={selectedCard}
            onClose={handleCloseModal}
            open={open}
            getUserProfile={getUserProfile}
            userId={userId}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="card-list">
          {cardsDataExperience.cardsInfo.map((card, index) => (
            <ExperienceProfileCard
              onAdd={() => onAddHandler(card)}
              onDelete={onDelete}
              CardId={setCardId}
              key={index}
              title={card.title}
              content={card.content}
              onEdit={() => handleEdit(card)}
              />
          ))}
          {open && (
            <ExperienceModel
              addExperience={addExperience}
              card={selectedCard}
              onClose={handleCloseModal}
              open={open}
              getUserProfile={getUserProfile}
              userId={cardId}
              id={userId} />
          )}
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <DeviceInfoCard />
      </TabPanel>
    </Box>
  );
}
