import {
  dashboardConstants,
  DEFAULT_TOKEN,
  USER_DATA,
  USER_TYPE,
} from "../config/constants/projectConstant.js";
import { SIGNIN } from "../config/constants/routePathConstants/auth";
import { toast } from "react-toastify";
import { navigatePath, sessionFail } from "../redux/slicers/activitySlice";
import store from "../redux/store";
import validateField from "./validateField.js";
import Swal from "sweetalert2";
import { setUserInfo } from "../redux/slicers/authSlice.js";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import crossSvg from "../assets/images/pages/ReportAnalytics/failcross.png";
import testPass from "../assets/images/pages/ReportAnalytics/pass-check-icon.png";
import moment from "moment";
import {
  STUDENT_BASIC_INFORMATION,
  STUDENT_DETAILS_PAGE,
  STUDENT_FACE_CAPTURE,
  STUDENT_GENERAL_INSTRUCTIONS,
  STUDENT_ID_CAPTURE,
} from "../config/constants/routePathConstants/student.js";
import { Tooltip } from "@mui/material";
import { LogOutStudentApi } from "../api/studentApi/index.js";

export const numberWithCommasString = (x) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const numberWithoutCommasString = (x) => {
  const beforeDecimalStr = x.toString()?.split(".");

  if (beforeDecimalStr[1] !== undefined) {
    return (
      beforeDecimalStr[0]?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      "." +
      beforeDecimalStr[1]
    );
  } else {
    return beforeDecimalStr[0]
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

export const numberWithCommasTrunc = (x) => {
  const trunc = x?.toFixed(2);
  return trunc?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const numberWithCommasMath = (x) => {
  const trunc = Math?.trunc(x);
  return trunc?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const isDev = () => {
  return process.env.NODE_ENV === "development";
};

export const devConsoleLog = (...a) => {
  if (a) {
    if (isDev()) {
    }
  }
};

export const storeLocal = (data = "", tokenName = DEFAULT_TOKEN) => {
  if (typeof data === "object") {
    data = JSON.stringify(data);
  }
  window.localStorage.setItem(tokenName, data);
};
export const storeSession = (data = "", tokenName = "userData") => {
  if (typeof data === "object") {
    data = JSON.stringify(data);
  }
  window.sessionStorage.setItem(tokenName, data);
};
export const getLocal = (tokenName = DEFAULT_TOKEN) => {
  const localData = window.localStorage.getItem(tokenName);
  let res;
  try {
    res = JSON.parse(localData);
  } catch (err) {
    res = localData;
  }
  return res;
};
export const getSession = (tokenName = DEFAULT_TOKEN) => {
  const localData = window.localStorage.getItem(tokenName);
  let res;
  try {
    res = JSON.parse(localData);
  } catch (err) {
    res = localData;
  }
  return res;
};
export const getUserData = (userData = USER_DATA) => {
  const localData = window.localStorage.getItem(userData);
  let res = {};
  try {
    res = JSON.parse(localData) || {};
  } catch (err) {
    res = localData || {};
  }
  return res;
};
export const getUserDetails = (userData = USER_DATA) => {
  const localData = window.localStorage.getItem(userData);
  let res = {};
  try {
    res = JSON.parse(localData) || {};
  } catch (err) {
    res = localData || {};
  }
  return res;
};
export const removeLocal = (tokenName = DEFAULT_TOKEN) => {
  window.localStorage.removeItem(tokenName);
  return navigate(SIGNIN);
};

export const removeLocalWithoutNavigatingTosignin = (tokenName) => {
  window.localStorage.removeItem(tokenName);
};

export const sessionDestroy = (path = SIGNIN) => {
  removeLocal();
  removeLocal(USER_DATA);
  dispatcher(sessionFail());
  navigate(path);
  dispatcher(setUserInfo({}));
};

export const uploadPathBuilder = (root, a) => {
  return root + a;
};

export const navigate = (path) => {
  dispatcher(navigatePath(path));
};

export const dispatcher = (a) => {
  store.dispatch(a);
};

export function toolTip(title, maxWidth = "100px") {
  return (
    <Tooltip title={title} arrow>
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: "pointer",
          maxWidth: maxWidth, // Set a maximum width for the cell
        }}
      >
        {title || "-"}
      </div>
    </Tooltip>
  );
}

export const successToast = (a) =>
  toast.success(a, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

export const errorToast = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const warningToast = (msg) => {
  toast.warn(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
export const infoToast = () => {
  toast.info("Network Error!", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const errorValidator = (a, setState) => {
  const { name, value = "", password } = a;
  if (value.trim()) {
    const { error = null } = validateField(name, value, password);
    setState((err) => {
      return { ...err, [name]: error };
    });
  } else {
    setState((err) => {
      return { ...err, [name]: null };
    });
  }
};
export const errorValidatorPassword = (a, setState) => {
  const { name, value = "" } = a;
  if (value.trim()) {
    const { error = null } = validateField(name, value);
    setState((err) => {
      return { ...err, [name]: error };
    });
  } else {
    setState((err) => {
      return { ...err, [name]: null };
    });
  }
};

export const errorAlert = (msg) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: msg,
  });
};

export const SuccessAlert = (msg) => {
  Swal.fire({
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: 5000,
  });
};
export const ConfirmAlert = (msg, navigate, path) => {
  Swal.fire({
    title: msg,
    icon: "success",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "GO BACK TO LOGIN",
  }).then((result) => {
    if (result.isConfirmed) {
      navigate(path);
    }
  });
};

export const ExitFullscreenModeAlert = async (
  msg,
  enterFullscreen,
  dispatch,
  navigate
  // swalName
) => {
  let timerInterval;
  let timerExpired = false;
  let swalInstance;

  const showLogoutButton = () => {
    timerExpired = true;
    if (swalInstance && typeof swalInstance.update === "function") {
      swalInstance.update({
        showDenyButton: true,
        denyButtonText: "Log Out",
        denyButtonColor: "#d33",
        timer: null,
        showConfirmButton: true,
      });
    }
  };

  const logoutTimeout = setTimeout(showLogoutButton, 10000);

  try {
    swalInstance = await Swal.fire({
      title: msg,
      icon: "error",
      timer: 10000,
      html: "Your exam will be terminated in <b></b> seconds.",
      showConfirmButton: true,
      confirmButtonText: "Enable Fullscreen",
      confirmButtonColor: "#3085d6",
      showDenyButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          const timeLeft = Swal.getTimerLeft();
          if (timeLeft !== null) {
            timer.textContent = Math.ceil(timeLeft / 1000);
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
        clearTimeout(logoutTimeout);
      },
      preConfirm: async () => {
        clearInterval(timerInterval);
        clearTimeout(logoutTimeout);
        try {
          await enterFullscreen();
          // localStorage.setItem(swalName, "true");
          return true;
        } catch (err) {
          Swal.showValidationMessage("Failed to enable fullscreen.");
          return false;
        }
      },
    });

    // Handle user action
    if (swalInstance.isDenied) {
    } else if (timerExpired && !swalInstance.isConfirmed) {
      dispatch(LogOutStudentApi(() => {}, navigate));
    }
  } catch (error) {
    console.error("SweetAlert error:", error);
    dispatch(LogOutStudentApi(() => {}, navigate));
  }
};

export const capitalizeFunc = (value) => {
  if (!value) {
    return null;
  }

  const arr = value?.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const capitalizeStr = arr.join(" ");

  return capitalizeStr;
};

export const getUserType = (userType) => {
  return USER_TYPE?.find((type) => type.id === userType).label;
};

export const getTimeDifference = (date) => {
  const currentDate = new Date(); // current date/time
  const pastDate = new Date(date); // the past date/time you want to compare

  // calculate the time difference in milliseconds
  const timeDiff = currentDate.getTime() - pastDate.getTime();

  // convert the time difference from milliseconds to seconds, minutes, hours, and days
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "a few seconds ago";
  }
};

export const blockInvalidChar = (e) => {
  var event = window.event ? window.event : e;
  ["e", "E", "+", "-", "."].includes(e.key) && event.preventDefault();
  if (event.keyCode === 40 || event.keyCode === 38) {
    event.preventDefault();
  }
};

export const exportData = (sortedData, columns) => {
  const result =
    sortedData &&
    sortedData?.map((item, ind) => {
      const newObj = {};
      Object.keys(item)?.map((val) =>
        columns?.map((col) => {
          if (col?.name === "_id") {
            newObj[col?.label] = ind + 1;
          }
          if (col?.name === val) {
            newObj[col?.label] = item[val];
          } else if (val === "clientName") {
            newObj["Client Name"] = item[val];
          }
        })
      );
      return newObj;
    });
  return result;
};

export const exportDataAssessormanagement = (sortedData, columns) => {
  const result =
    sortedData &&
    sortedData?.map((item, ind) => {
      const newObj = {};
      Object.keys(item)?.map((val) =>
        columns?.map((col) => {
          if (col?.name === val) {
            newObj[col?.label] = item[val];
          } else if (val === "clientName") {
            newObj["Client Name"] = item[val];
          }
        })
      );
      return newObj;
    });
  return result;
};

export const exportCandidateListData = (sortedData, columns) => {
  const result = sortedData?.map((item, ind) => {
    const newObj = {};
    columns?.forEach((col) => {
      if (col?.name === "_id") {
        newObj[col?.label] = ind + 1;
      } else if (item.hasOwnProperty(col?.name)) {
        newObj[col?.label] = item[col?.name];
      }
    });
    return newObj;
  });
  return result;
};

export const getResultColor = (result) => {
  switch (result) {
    case "Pass":
      return "rgba(202, 251, 197, 0.5)";
    case "Fail":
      return "rgba(255, 69, 69, 0.05)";
    case "Not-attempt":
      return "rgba(197, 197, 197, 0.5)";
    default:
      return "white";
  }
};
export const getResultTextColor = (resultText) => {
  switch (resultText) {
    case "Pass":
      return "#04D375";
    case "Fail":
      return "#FF0000";
    case "Not-attempt":
      return "#323232";
    default:
      return "blue";
  }
};
export const getResultPreviewTextColor = (resultText) => {
  switch (resultText) {
    case "Pass":
      return "#04D375";
    case "Fail":
      return "#FF0000";
    case "Not-attempt":
      return "#9C9C9C";
    default:
      return "blue";
  }
};
export const getCandidateResultStatus = (resultStatus) => {
  switch (resultStatus) {
    case "Pass":
      return "#04D375";
    case "Fail":
      return "#FF0000";
    case "Not-attempt":
      return "#9C9C9C";
    default:
      return "blue";
  }
};
export const getCandidateResultStatusCircular = (resultStatusCircular) => {
  switch (resultStatusCircular) {
    case "Pass":
      return "#04D375";
    case "Fail":
      return "#F52121";
    case "Not-attempt":
      return "#F1F5F8";
    default:
      return "blue";
  }
};
export const getCandidateResultStatusIcon = (resultStatusIcon) => {
  switch (resultStatusIcon) {
    case "Pass":
      return (
        <CheckBoxOutlinedIcon
          sx={{ fontSize: 20, mr: 2, borderRadius: "5px" }}
        />
      );
    case "Fail":
      return (
        <DisabledByDefaultOutlinedIcon
          sx={{ fontSize: 20, mr: 2, borderRadius: "5px" }}
        />
      );
    case "Not-attempt":
      return (
        <DisabledByDefaultOutlinedIcon
          sx={{ fontSize: 20, mr: 2, borderRadius: "5px" }}
        />
      );
    default:
      return "blue";
  }
};
export const getCandidateResultStatusPdfIcon = (resultStatusPdfIcon) => {
  switch (resultStatusPdfIcon) {
    case "Pass":
      return (
        <img
          width={"20px"}
          src={testPass}
          style={{ marginTop: "4px" }}
          alt="userIcon"
        />
      );
    case "Fail":
      return (
        <img
          width={"20px"}
          src={crossSvg}
          style={{ marginTop: "4px" }}
          alt="userIcon"
        />
      );
    case "Not-attempt":
      return (
        <img
          width={"20px"}
          src={crossSvg}
          style={{ marginTop: "4px" }}
          alt="userIcon"
        />
      );
    default:
      return "blue";
  }
};
export const getCandidateResultStatusPdf = (resultStatus) => {
  switch (resultStatus) {
    case "Pass":
      return "Congratulations !";
    case "Fail":
      return "Unfortunately your score was too low to pass the test.";
    case "Not-attempt":
      return "You have not attempt Exam.";
    default:
      return "blue";
  }
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getUniqueValue = (arr, key) => {
  const uniqueValue = new Set(arr.map((item) => item[key]));
  const resultArr = [...uniqueValue]
    .filter((val) => val !== "" && val !== undefined)
    ?.map((item) => {
      return { label: item, value: item };
    });
  return resultArr;
};

export const convertOptions = (options, value, label, label2) => {
  return options?.map((item) => ({
    label: label
      ? label2
        ? `${item[label]} ${item[label2]}`
        : item[label]
      : item[value],
    value: item[value],
  }));
};

export const userRoleType = (userRole, featureName) => {
  return userRole?.find((item) => item.featureName === featureName);
};
export const getSubRole = (userRole, subFeatureName) => {
  return userRole?.find((item) => item.subFeatureName === subFeatureName);
};

export function padZero(number) {
  return (number < 10 ? "0" : "") + number;
}

export const handleCopyInput = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error("Copy failed:", error);
  }
};

export const getConvertedMinutesToSeconds = (minutes) => {
  return minutes * 60;
};

export const retriveMatchedWithPath = (path, regex) => {
  const activeTab = path.match(regex);
  return activeTab.join("");
};

export const handleTrimPaste = (event, setter) => {
  // Prevent the default paste behavior
  event.preventDefault();
  // Get the pasted text from the clipboard
  const pastedText = event.clipboardData.getData("text/plain");
  // Remove leading and trailing white spaces and set the state
  setter(pastedText.trim());
};

export function convertPercentageStringToNumber(str) {
  const number = parseInt(str?.replace("%", ""));
  if (!isNaN(number)) {
    return number;
  } else {
    console.error("Invalid percentage string");
    return null;
  }
}

export function checkTimeFormat(timeString) {
  // Check for AM/PM indicator for 12-hour format
  const regex = /AM|PM/i; // The 'i' makes it case-insensitive
  const isValidTime = regex.test(timeString);
  if (!isValidTime) {
    console.log("Matched");
    const newTime = moment(timeString, "HH:mm").format("hh:mmA");
    return newTime;
  }
  return timeString;
}

export const convertDateFormat = (dateString) => {
  // Parse the input date string
  const inputDate = new Date(dateString);

  // Define the days of the week and months arrays
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the day, month, and year components
  const dayOfWeek = daysOfWeek[inputDate.getUTCDay()];
  const month = months[inputDate.getUTCMonth()];
  const day = inputDate.getUTCDate();
  const year = inputDate.getUTCFullYear();

  // Create the formatted date string
  const formattedDate = `${dayOfWeek}, ${month} ${day}, ${year}`;

  return formattedDate;
};
export const convertDateToDDYYMM = (dateString) => {
  // Parse the input date string
  const date = new Date(dateString);

  if (isNaN(date)) {
    return "NA";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const ExamConductLanguages = [
  { label: "Telugu", value: "Telugu" },
  { label: "Assamese", value: "Assamese" },
  { label: "Hindi", value: "Hindi" },
  { label: "Konkani", value: "Konkani" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Kannada", value: "Kannada" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Hindi", value: "Hindi" },
  { label: "Marathi", value: "Marathi" },
  { label: "Meiteilon (Manipuri)", value: "Meiteilon (Manipuri)" },
  { label: "Mizo", value: "Mizo" },
  { label: "Odia", value: "Odia" },
  { label: "Punjabi", value: "Punjabi" },
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu & Urdu", value: "Telugu & Urdu" },
  { label: "Kokborok", value: "Kokborok" },
  { label: "Bengali", value: "Bengali" },
  { label: "Kashmiri", value: "Kashmiri" },
  { label: "Dogri", value: "Dogri" },
  { label: "Urdu", value: "Urdu" },
  { label: "Ladakhi", value: "Ladakhi" },
  { label: "Purgi", value: "Purgi" },
  { label: "Sanskrit", value: "Sanskrit" },
];

export const getDynamicRoute = (data, batchId, candidateId, questionId) => {
  switch (Number(data?.screen)) {
    case 1:
      return {
        step: 1,
        route: navigate(`${STUDENT_DETAILS_PAGE}/${batchId}/${candidateId}`),
      };
    case 2:
      return {
        step: 2,
        route: navigate(
          `${STUDENT_FACE_CAPTURE}/${batchId}/${candidateId}/${questionId}`
        ),
      };
    case 3:
      return {
        step: 3,
        route: navigate(
          `${STUDENT_ID_CAPTURE}/${batchId}/${candidateId}/${questionId}`
        ),
      };
    case 4:
      return {
        step: 4,
        route: navigate(
          `${STUDENT_BASIC_INFORMATION}/${batchId}/${candidateId}/${questionId}`
        ),
      };
    case 5:
      return {
        step: 5,
        route: navigate(
          `${STUDENT_GENERAL_INSTRUCTIONS}/${batchId}/${candidateId}/${questionId}`
        ),
      };
    default:
      return { step: "default", route: "some_navigation_route" };
  }
};

// sort alphabetic order

export const ALPHABETIC_SORT = (data = []) => {
  const sortedData = [...data].sort((a, b) => a.label.localeCompare(b.label));
  return sortedData;
};

export const CLIENT_ALPHABETIC_SORT = (data = []) => {
  const sortedData = [...data].sort((a, b) =>
    a.clientname.localeCompare(b.clientname)
  );
  return sortedData;
};

// cookieHandler.js
export const setCookie = (name, value, days) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  const cookieValue = `${name}=${value};expires=${expirationDate.toUTCString()};path=/`;
  document.cookie = cookieValue;
};

export const getCookie = (name) => {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
};

export function formatDateInStringFormat(isoString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const date = new Date(isoString);
  return date.toLocaleString("en-US", options);
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const stayBackFilter = (label) => {
  if (label !== "QB Management") {
    localStorage.removeItem("qbFilter");
    localStorage.removeItem("qbSearch");
  }
};

export const ButtonList_IndiaMap = (value) => {
  if (value === dashboardConstants?.ClientByLocationBD) {
    return [
      { name: "all", value: "all", label: "All" },
      { name: "private", value: "Private", label: "Private" },
      { name: "government", value: "Government", label: "Government" },
      { name: "others", value: "Others", label: "Others" },
    ];
  } else if (
    value === dashboardConstants?.AssessorByLocationOD ||
    value === dashboardConstants?.AssessorByLocationHR
  ) {
    return [
      { name: "all", value: "all", label: "All" },
      { name: "payroll", value: "payroll", label: "Full-Time" },
      { name: "freelance", value: "freelance", label: "Freelance" },
    ];
  } else if (value === dashboardConstants?.ExamCenter) {
    return [
      {
        name: "examCenterCount",
        value: "examCenterCount",
        label: "Exam Center",
      },
      { name: "batchCount", value: "batchCount", label: "Batch" },
    ];
  }
};

export const ColorCodes_IndianStates = {
  payroll: [
    "#083344",
    "#155E75",
    "#0E7490",
    "#0891B2",
    "#06B6D4",
    "#22D3EE",
    "#67E8F9",
    "#A5F3FC",
  ],
  freelance: [
    "#713F12",
    "#A16207",
    "#CA8A04",
    "#EAB308",
    "#FACC15",
    "#FDE047",
    "#FEF08A",
    "#FEF9C3",
  ],
  Private: [
    "#054701",
    "#086303",
    "#0a8004",
    "#129c0b",
    "#16ba0d",
    "#1dd613",
    "#32ed28",
    "#57fc4e",
  ],
  Government: [
    "#350438",
    "#410145",
    "#66076b",
    "#85048c",
    "#a50cad",
    "#b806c2",
    "#d71fe0",
    "#f039fa",
  ],
  Others: [
    "#02565c",
    "#015557",
    "#046466",
    "#048285",
    "#029b9e",
    "#08c6c9",
    "#09e4e8",
    "#0ff6fa",
  ],
  batchCount: [
    "#960808",
    "#bf0606",
    "#d90b0b",
    "#fc0808",
    "#ff2929",
    "#f73434",
    "#fc4949",
    "#f77272",
  ],
  examCenterCount: [
    "#0a0245",
    "#0f026e",
    "#150399",
    "#1a04ba",
    "#2209db",
    "#260af5",
    "#381efa",
    "#5d48fa",
  ],
  masterAssessorCount: [
    "#7a2e02",
    "#ba4704",
    "#d4550b",
    "#fa6711",
    "#fc8b49",
    "#f79d68",
    "#fcaf81",
    "#ffc19c",
  ],
  total: [
    "#099186",
    "#0bb0a2",
    "#1dbfb2",
    "#15d6c6",
    "#17ebd9",
    "#33f2e2",
    "#5bf5e8",
    "#c2f2ee",
  ],
};

export function currentClockTime(inputDate) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateParts = inputDate.split("/");
  const month = parseInt(dateParts[0], 10); // Month is in MM format
  const day = parseInt(dateParts[1], 10); // Day is in DD format
  const year = parseInt(dateParts[2], 10); // Year is in YYYY format

  // Create a new Date object
  const inputDateObj = new Date(year, month - 1, day);
  const dayOfWeek = daysOfWeek[inputDateObj.getDay()];
  const monthName = months[month - 1];

  const dayFormatted = day.toString().padStart(2, "0");

  // Format the date as "DayOfWeek, DD MonthName YYYY"
  return `${monthName} ${dayFormatted}, ${year}`;
}

export const schemeOptions = [
  { label: "PMKVY", value: "65aa7bf1b19149328d4ec965" },
  { label: "Non PMKVY", value: "65aa7ca8b19149328d4ecc61" },
  { label: "PM Vishvakarma", value: process.env.REACT_APP_PM_VISHWAKARMA },
];

export const getSchemeType = (data = []) => {
  if (data.length > 0) {
    const selectedLabels = data?.map((id) => {
      const option = schemeOptions?.find((option) => option.value === id);
      return option ? option.label : null;
    });
    return selectedLabels;
  }
};

export const getWidthAndHeightOfComponentDashboard = (dashboardType = "") => {
  // if(dashboardConstants===)
  let w = 0;
  let h = 0;
  switch (dashboardType) {
    case dashboardConstants?.TimeSpentBD:
      w = 1;
      h = 3.5;
      break;
    case dashboardConstants?.ClientOverviewBD:
      w = 1;
      h = 3;
      break;
    case dashboardConstants?.ClientByLocationBD:
      w = 1;
      h = 4.5;
      break;
    case dashboardConstants?.SectorWiseOverviewBD:
      w = 1;
      h = 3;
      break;

    case dashboardConstants?.MasterAssessorsByLocation:
      w = 1;
      h = 3;
      break;

    // case dashboardConstants?.LeadAnalyticsBD:  //need to change
    //   w = 1;
    //   h = 4;
    //   break;
    // case dashboardConstants?.LeadByCategoryBD: //need to change
    //   w = 1;
    //   h = 4;
    //   break;
    case dashboardConstants?.ScheduleCalenderBD:
      w = 1;
      h = 3;
      break;

    case dashboardConstants?.TimeSpentCD: //check which one coming
      w = 1;
      h = 3.5;
      break;
    case dashboardConstants?.DailyWorkProgressCD: //need to change height withing it
      w = 1;
      h = 3;
      break;
    case dashboardConstants?.QuestionAnalyticsCD:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.LanguageDistributionCD:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.UpcomingBatchCD: //to change
      w = 1;
      h = 3;
      break;
    case dashboardConstants?.AssessorByLocationOD:
      w = 1;
      h = 4;
      break;
    case dashboardConstants?.AssessmentAnalyticsOD: //to change width and height
      w = 1;
      h = 3;
      break;
    case dashboardConstants?.UpcomingBatchCalenderOD:
      w = 1;
      h = 3;
      break;
    case dashboardConstants?.ClientWiseAssessmentOD:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.SchemeAnalysisOD:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.AssessmentHistoryOD:
      w = 1;
      h = 2.5;
      break;
    // case dashboardConstants?.TimeSpentMIS:
    //   w = 0.5;
    //   h = 3.5;
    //   break;
    case dashboardConstants?.ResultAnalysisMIS: //to change height of inner height
      w = 1;
      h = 3;
      break;
    case dashboardConstants?.ApplicantAnalysisMIS:
      w = 1;
      h = 2.5;
      break;
    // case dashboardConstants?.BatchResultStatusMIS: //to change lateron
    //   w = 1;
    //   h = 4;
    //   break;
    // case dashboardConstants?.ClientWiseAssessment:
    //   w = 1;
    //   h = 2.5;
    //   break;
    case dashboardConstants?.SchemeAnalysisMIS:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.UpcomingBatchMIS:
      w = 1;
      h = 3;
      break;
    // case dashboardConstants?.TimeSpentQA:
    //   w = 1;
    //   h = 4;
    //   break;
    // case dashboardConstants?.AssessmentAnalysisQA:
    //   w = 1;
    //   h = 2.5;
    //   break;
    case dashboardConstants?.BatchVerificationStatsQA:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.ActivityQA:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.BatchStaticsQA:
      w = 1;
      h = 2.5;
      break;

    // case dashboardConstants?.TimeSpentHR:
    //   w = 0.5;
    //   h = 2.5;
    //   break;
    case dashboardConstants?.EmploymentTypeHR:
      w = 1;
      h = 3;
      break;
    case dashboardConstants?.AssessmentAnalysisHR: //need to change inner height
      w = 1;
      h = 3;
      break;
    case dashboardConstants?.AssessorByLocationHR:
      w = 1;
      h = 4;
      break;

    case dashboardConstants?.TeamMemberBusiness:
      w = 1;
      h = 3.5;
      break;
    case dashboardConstants?.ClientListBusiness:
      w = 2;
      h = 3.6;
      break;

    case dashboardConstants?.JobroleOccuranceContent:
      w = 1;
      h = 3.5;
      break;
    // case dashboardConstants?.TeamMemberContent: // to change lateron
    //   w = 1;
    //   h = 4;
    //   break;
    case dashboardConstants?.ClientBasedJobroleContent:
      w = 1;
      h = 3.8;
      break;
    // case dashboardConstants?.AllActivitiesContent: //to change lateron
    //   w = 2;
    //   h = 4;
    //   break;

    case dashboardConstants?.LiveBatchStatsOperation:
      w = 1;
      h = 3;
      break;
    case dashboardConstants?.ClientBasedAssessorOperation:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.AssignedAssessorOperation:
      w = 1;
      h = 3.6;
      break;
    case dashboardConstants?.BatchListOperation:
      w = 2;
      h = 3;
      break;

    case dashboardConstants?.ClientWiseBatchMIS:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.NOSResultMIS:
      w = 2;
      h = 3;
      break;
    case dashboardConstants?.TeamMemberQA:
      w = 1;
      h = 3.2;
      break;

    case dashboardConstants?.TeamMemberOperation:
      w = 1;
      h = 3.2;
      break;
    case dashboardConstants?.RealTimeMoniteringAndQALISTQA:
      w = 2;
      h = 3;
      break;
    case dashboardConstants?.ClientBasedAssessorQA:
      w = 1;
      h = 2.5;
      break;
    case dashboardConstants?.AssessorListHR:
      w = 2;
      h = 4.2;
      break;
    default:
      w = 1;
      h = 4.5;
      break;
  }
  return { w: w, h: h };
};

export const findKeyByValue = (object, value) => {
  for (const key in object) {
    if (object[key] === value) {
      return key;
    }
  }
  return null;
};

export const generateRandomColors = (numColors) => {
  const colors = [];
  const usedColors = new Set();

  for (let i = 0; i < numColors; i++) {
    let color;
    do {
      color =
        "#" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0");
    } while (usedColors.has(color));

    colors.push(color);
    usedColors.add(color);
  }

  return colors;
};

export function processWidgets(value) {
  let widgets_arr = [];

  value.map((item) => {
    if (Array.isArray(item?.options)) {
      widgets_arr = widgets_arr.concat(item?.options);
      return true;
    }
    return false;
  });
  return widgets_arr;
}

export function generateRandomColorsArrayBased(arrayLength = 0) {
  const colors = [];
  const usedColors = new Set();

  for (let i = 0; i < arrayLength; i++) {
    let color;
    do {
      color =
        "#" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0");
    } while (usedColors.has(color));

    colors.push(color);
    usedColors.add(color);
  }

  return colors;
}

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true } // Request high accuracy for better results
    );
  });
};

export const getIP = async () => {
  const response = await fetch("https://api64.ipify.org?format=json");
  const data = await response.json();
  return data.ip;
};

export function getBrowser() {
  const userAgent = navigator.userAgent;

  if (
    window.navigator?.userAgentData?.brands
      ?.map((item) => item.brand)
      .includes("Brave")
  ) {
    return "Brave";
  }

  if (
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("Brave")
  ) {
    return "Chrome";
  }

  if (userAgent.includes("Firefox")) {
    return "Firefox";
  }

  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return "Safari";
  }

  if (userAgent.includes("Edg")) {
    return "Edge";
  }

  if (userAgent.includes("Trident")) {
    return "Internet Explorer";
  }

  if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    return "Opera";
  }

  return "Unknown";
}

export const instructionsData = {
  english: {
    title: "Please read the following instructions carefully",
    heading: "General Instructions :",
    sections: [
      "1. Please be aware that the exam timer is centrally managed. A countdown counter appears at the upper right of the question screen, indicating how much time you have left to finish the exam. It is critical to note that when the timer runs out, the exam will immediately end. You are not required to manually submit the test.",
      "2. The question palette is located on the right side of your screen and displays the following statuses for each numbered question:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "You have not yet answered the question.",
      },
      { id: "2", class: "two", text: "You have answered the question." },
      {
        id: "3",
        class: "three",
        text: "You have NOT answered the question but marked it for review.",
      },
      {
        id: "4",
        class: "four",
        text: "You responded to the question but marked it for review.",
      },
      {
        id: "5",
        class: "five",
        text: 'Please be aware that if you do not respond to a question at all, it will be marked as "Not Answered."',
      },
    ],
    additional: [
      "3. There will be no deductions for wrong responses. To increase your chances of success, you are advised to attempt all questions.",
      "4. To answer to a question, please use the following format:",
    ],
    format: [
      "1. Navigate to the appropriate numbered question using the Question Navigation on your screen.",
      '2. Click "Save & Next" to preserve your answers for the current question and go on to the next.',
      '3. To store your answers and indicate that you want to revisit a question later, click on "Mark for Review & Next" after answering.',
    ],
    conclusion: [
      "5. When faced with MCQs, thoroughly analyze each choice and choose the best answer before saving or marking for review.",
      "Please adhere to these instructions throughout the examination to ensure a smooth and successful testing experience. Best of luck!",
    ],
    chooseLanguage: "Choose secondry language",
    termAndCondition: "I have read and understand the instructions",
    startExamBtn: "Start Assessment",
    additionalIntructions: "Additional Instructions",
  },
  hindi: {
    title: "कृपया निम्नलिखित निर्देशों को ध्यान से पढ़ें",
    heading: "सामान्य निर्देश: :",
    sections: [
      "1. कृपया ध्यान रखें कि परीक्षा टाइमर केंद्रीय रूप से प्रबंधित है। प्रश्न स्क्रीन के ऊपरी दाएँ भाग में एक उलटी गिनती काउंटर दिखाई देता है, जो दर्शाता है कि परीक्षा समाप्त करने के लिए आपके पास कितना समय बचा है। यह ध्यान रखना महत्वपूर्ण है कि जब टाइमर समाप्त हो जाता है, तो परीक्षा तुरंत समाप्त हो जाएगी। आपको मैन्युअल रूप से परीक्षा सबमिट करने की आवश्यकता नहीं है।",
      "2. प्रश्न पैलेट आपकी स्क्रीन के दाईं ओर स्थित है और प्रत्येक क्रमांकित प्रश्न के लिए निम्नलिखित स्थितियाँ प्रदर्शित करता है|",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "आपने अभी तक प्रश्न का उत्तर नहीं दिया है|",
      },
      {
        id: "2",
        class: "two",
        text: "आपने प्रश्न का उत्तर दे दिया है",
      },
      {
        id: "3",
        class: "three",
        text: "आपने प्रश्न का उत्तर नहीं दिया है, लेकिन इसे समीक्षा के लिए चिह्नित किया है।",
      },
      {
        id: "4",
        class: "four",
        text: "आपने प्रश्न का उत्तर तो दे दिया लेकिन उसे समीक्षा के लिए चिह्नित कर दिया।",
      },
      {
        id: "5",
        class: "five",
        text: 'कृपया ध्यान रखें कि यदि आप किसी प्रश्न का उत्तर नहीं देते हैं तो उसे "उत्तर नहीं दिया गया" के रूप में चिह्नित कर दिया जाएगा।"',
      },
    ],
    additional: [
      "3. गलत उत्तरों के लिए कोई कटौती नहीं है। आपकी सफलता के अवसरों को बढ़ाने के लिए, आपको सभी प्रश्नों का प्रयास करने की सलाह दी जाती है।",
      "4. प्रश्न का उत्तर देने के लिए कृपया निम्नलिखित प्रारूप का उपयोग करें:",
    ],
    format: [
      "1. अपने स्क्रीन पर प्रश्न नेविगेशन का उपयोग करके सही क्रमांकित प्रश्न पर जाएं।",
      '2. वर्तमान प्रश्न के लिए अपने उत्तरों को सहेजने और अगले की ओर बढ़ने के लिए "सहेजें और अगले" पर क्लिक करें।',
      '3. अपने उत्तरों को सहेजने और बाद में पुनः समीक्षा के लिए एक प्रश्न को चिह्नित करने के लिए, उत्तर देने के बाद "पुनरावलोकन के लिए चिह्नित करें और अगले" पर क्लिक करें।',
    ],
    conclusion: [
      "5. MCQs का सामना करते समय, प्रत्येक विकल्प का सावधानीपूर्वक विश्लेषण करें और सहेजने या समीक्षा के लिए चिह्नित करने से पहले सबसे अच्छा उत्तर चुनें।",
      "परीक्षा के दौरान इन निर्देशों का पालन करें और एक सुचारू और सफल परीक्षण अनुभव सुनिश्चित करें। शुभकामनाएँ!",
    ],
    chooseLanguage: "द्वितीयक भाषा चुनें",
    termAndCondition: "मैंने निर्देश पढ़ लिए हैं और समझ लिया है",
    startExamBtn: "परीक्षा शुरू करें",
    additionalIntructions: "अतिरिक्त निर्देश",
  },

  telugu: {
    title: "దయచేసి క్రింది సూచనలను జాగ్రత్తగా చదవండి",
    heading: "సామాన్య సూచనలు: :",
    sections: [
      "1. పరీక్ష టైమర్ కేంద్రంగా నిర్వహించబడుతుందని దయచేసి గమనించండి. పరీక్షను ముగించడానికి మీకు ఎంత సమయం మిగిలి ఉందో చూపించే కౌంట్డౌన్ కౌంటర్ ప్రశ్న స్క్రీన్ యొక్క కుడి భాగంలో కనిపిస్తుంది. టైమర్ ముగిసినప్పుడు, పరీక్ష వెంటనే ముగుస్తుంది అని గమనించడం చాలా ముఖ్యమైనది. మీరు మాన్యువల్‌గా పరీక్షను సమర్పించాల్సిన అవసరం లేదు.",
      "2. ప్రశ్న ప్యాలెట్ మీ స్క్రీన్ యొక్క కుడి వైపున ఉంది మరియు ప్రతి సంఖ్యా ప్రశ్నకు ఈ క్రింది స్థితులను ప్రదర్శిస్తుంది:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "మీరు ఇంకా ప్రశ్నకు సమాధానం ఇవ్వలేదు.",
      },
      {
        id: "2",
        class: "two",
        text: "మీరు ప్రశ్నకు సమాధానం ఇచ్చారు.",
      },
      {
        id: "3",
        class: "three",
        text: "మీరు ప్రశ్నకు సమాధానం ఇవ్వలేదు కానీ సమీక్ష కోసం గుర్తించారు.",
      },
      {
        id: "4",
        class: "four",
        text: "మీరు ప్రశ్నకు సమాధానం ఇచ్చారు కానీ సమీక్ష కోసం గుర్తించారు.",
      },
      {
        id: "5",
        class: "five",
        text: 'దయచేసి మీరు ప్రశ్నకు సమాధానం ఇవ్వకపోతే, దానిని "సమాధానం ఇవ్వలేదు" అని గుర్తించబడుతుందని గమనించండి.',
      },
    ],
    additional: [
      "3. తప్పు సమాధానాలకు ఎలాంటి తగ్గింపులు ఉండవు. మీ విజయావకాశాలను పెంచడానికి, మీరు అన్ని ప్రశ్నలకు ప్రయత్నించడానికి సిఫారసు చేయబడుతున్నారు.",
      "4. ప్రశ్నకు సమాధానం ఇవ్వడానికి, దయచేసి ఈ క్రింది ఫార్మాట్‌ను ఉపయోగించండి:",
    ],
    format: [
      "1. మీ స్క్రీన్‌పై ప్రశ్న నావిగేషన్‌ను ఉపయోగించి సరైన సంఖ్యా ప్రశ్నకు నావిగేట్ చేయండి.",
      '2. ప్రస్తుత ప్రశ్నకు మీ సమాధానాలను నిల్వ చేయడానికి మరియు తదుపరి దిశగా వెళ్లడానికి "సేవ్ & నెక్స్ట్" క్లిక్ చేయండి.',
      '3. మీ సమాధానాలను నిల్వ చేయడానికి మరియు తరువాత పునఃసమీక్షించాలనుకుంటున్న ప్రశ్నను గుర్తించడానికి, సమాధానం ఇచ్చిన తర్వాత "సమీక్ష కోసం & నెక్స్ట్" క్లిక్ చేయండి.',
    ],
    conclusion: [
      "5. MCQలను ఎదుర్కొన్నప్పుడు, ప్రతి ఎంపికను జాగ్రత్తగా విశ్లేషించండి మరియు సేవ్ చేయడానికి లేదా సమీక్ష కోసం గుర్తించడానికి ముందు ఉత్తమ సమాధానాన్ని ఎంచుకోండి.",
      "సమావేశ సమయంలో ఈ సూచనలను అనుసరించండి మరియు సాఫీగా మరియు విజయవంతమైన పరీక్షా అనుభవాన్ని నిర్ధారించండి. శుభాకాంక్షలు!",
    ],
    chooseLanguage: "రెండవ భాషను ఎంచుకోండి",
    termAndCondition: "నేను సూచనలను చదివాను మరియు అర్థం చేసుకున్నాను",
    startExamBtn: "పరీక్ష ప్రారంభించండి",
    additionalIntructions: "అదనపు సూచనలు",
  },
  maithili: {
    title: "कृपया निम्नलिखित निर्देश ध्यान स पढ़ू।",
    heading: "सामान्य जानकारी",
    sections: [
      "1. ध्यान राखब जे परीक्षा टाइमर केंद्रीय रूप स प्रबंधित अछि। प्रश्न स्क्रीन कें दाहिना कोना मे उलटी गिनती काउंटर आबै छै, जे इ दर्शाबै छै कि अहां कें परीक्षा पूरा करय मे कतेक समय बचल छै. ई जानना अत्यंत जरूरी छै कि जब॑ टाइमर खतम होय जैतै त॑ परीक्षा तुरंत खतम होय जैतै । अहां के मैन्युअल रूप सं परीक्षा जमा करय के जरूरत नहिं.",
      "2. प्रश्न पैलेट अहां कें स्क्रीन कें दाहिना तरफ स्थित छै आ प्रत्येक नंबर वाला प्रश्न कें लेल निम्नलिखित स्थिति दिखायत छै:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "अहाँ एखन धरि प्रश्नक उत्तर नहि देलहुँ अछि।",
      },
      {
        id: "2",
        class: "two",
        text: "प्रश्नक उत्तर अहाँ दऽ देने छी।",
      },
      {
        id: "3",
        class: "three",
        text: "अहाँ प्रश्नक उत्तर नहि देलहुँ मुदा समीक्षा लेल चिन्हित कएल गेल अछि ।",
      },
      {
        id: "4",
        class: "four",
        text: "प्रश्नक उत्तर अहाँ दऽ देने छी मुदा समीक्षाक लेल चिन्हित कएल गेल अछि ।",
      },
      {
        id: "5",
        class: "five",
        text: 'कृपया ध्यान राखब जे जँ अहाँ कोनो प्रश्नक उत्तर नहि देने छी तँ ओकरा "उत्तर नहि देल गेल" केर रूप मे चिन्हित कएल जाएत ।',
      },
    ],
    additional: [
      "3. गलत उत्तर लेल कोनो कटौती नहि होइत अछि। अहां सभ सं कहल गेल अछि जे अहां सभ सवाल के जवाब दिअ जाहि सं अहां के सफलता के संभावना बढ़य|",
      "4.प्रश्नक उत्तर देबाक लेल नीचा देल गेल प्रारूपक प्रयोग करू।",
    ],
    format: [
      "1. अपन स्क्रीन पर प्रश्न नेविगेशन के उपयोग क' सही नंबर वाला प्रश्न पर जाउ |",
      '2. वर्तमान प्रश्नक लेल अपन उत्तर सहेजू आ आगू बढ़बाक लेल "सहेजू आ आगू" पर क्लिक करू।',
      "3. अपनऽ जवाब क॑ सेव करै लेली आरू बाद म॑ दोबारा देखै ल॑ चाहै वाला सवाल क॑ इंगित करै लेली, जवाब दै के बाद समीक्षा लेली चिह्नित करी क॑ जारी रखै प॑ क्लिक करी क॑ देखै ल॑ मिलतै ।",
    ],
    conclusion: [
      "5. जखन कोनों एमसीक्यू कें सामना करय पड़य छै, तखन प्रत्येक विकल्प कें ध्यान सं विश्लेषण करूं आ समीक्षा कें लेल सेव करय या अंकित करय सं पहिले सबसे अच्छा जवाब चुनूं.",
      "परीक्षा के दौरान एहि निर्देश के पालन करू आओर एकटा सुचारू आ सफल परीक्षण के अनुभव सुनिश्चित करू. शुभकामना!",
    ],
    chooseLanguage: "गौण भाषा चुनें",
    termAndCondition: "हम निर्देश पढ़लहुँ आ बुझलहुँ",
    startExamBtn: "परीक्षा शुरू करू",
    additionalIntructions: "अतिरिक्त जानकारी",
  },
  marathi: {
    title: "कृपया खालील सूचना काळजीपूर्वक वाचा",
    heading: "सामान्य सूचना :",
    sections: [
      "1. कृपया लक्षात घ्या की परीक्षा टाइमर केंद्रीय व्यवस्थापित आहे. प्रश्न स्क्रीनच्या उजव्या कोपर्यात उलट मोजणी काउंटर दिसतो, जो तुम्हाला परीक्षा पूर्ण करण्यासाठी किती वेळ बाकी आहे हे दर्शवतो. टाइमर संपल्यावर परीक्षा त्वरित संपेल हे लक्षात घेणे अत्यंत महत्त्वाचे आहे. तुम्हाला मॅन्युअली परीक्षा सादर करण्याची आवश्यकता नाही.",
      "2. प्रश्न पॅलेट तुमच्या स्क्रीनच्या उजव्या बाजूला आहे आणि प्रत्येक क्रमांकित प्रश्नासाठी खालील स्थिती दर्शवते:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "तुम्ही अद्याप प्रश्नाचे उत्तर दिलेले नाही.",
      },
      {
        id: "2",
        class: "two",
        text: "तुम्ही प्रश्नाचे उत्तर दिले आहे.",
      },
      {
        id: "3",
        class: "three",
        text: "तुम्ही प्रश्नाचे उत्तर दिलेले नाही पण ते पुनरावलोकनासाठी चिन्हांकित केले आहे.",
      },
      {
        id: "4",
        class: "four",
        text: "तुम्ही प्रश्नाचे उत्तर दिले आहे पण ते पुनरावलोकनासाठी चिन्हांकित केले आहे.",
      },
      {
        id: "5",
        class: "five",
        text: 'कृपया लक्षात ठेवा की तुम्ही प्रश्नाचे उत्तर दिलेले नाही, तर ते "उत्तर दिलेले नाही" म्हणून चिन्हांकित केले जाईल.',
      },
    ],
    additional: [
      "3. चुकीच्या उत्तरांसाठी कोणतेही कपात नाही. तुमच्या यशाच्या संधी वाढवण्यासाठी तुम्हाला सर्व प्रश्नांची उत्तरे देण्यास सांगितले जाते.",
      "4. प्रश्नाचे उत्तर देण्यासाठी, कृपया खालील स्वरूप वापरा:",
    ],
    format: [
      "1. तुमच्या स्क्रीनवरील प्रश्न नेव्हिगेशनचा वापर करून योग्य क्रमांकित प्रश्नावर जा.",
      '2. चालू प्रश्नासाठी तुमची उत्तरे जतन करण्यासाठी आणि पुढे जाण्यासाठी "जतन करा आणि पुढे" क्लिक करा.',
      '3. तुमची उत्तरे जतन करण्यासाठी आणि तुम्हाला नंतर पुन्हा पाहायच्या प्रश्नाचे संकेत देण्यासाठी, उत्तर दिल्यानंतर "पुनरावलोकनासाठी चिन्हांकित करा आणि पुढे" क्लिक करा.',
    ],
    conclusion: [
      "5. MCQला सामोरे जाताना, प्रत्येक पर्यायाचे काळजीपूर्वक विश्लेषण करा आणि जतन करण्यापूर्वी किंवा पुनरावलोकनासाठी चिन्हांकित करण्यापूर्वी सर्वोत्तम उत्तर निवडा.",
      "परीक्षेदरम्यान या सूचनांचे पालन करा आणि सुरळीत आणि यशस्वी चाचणी अनुभव सुनिश्चित करा. शुभेच्छा!",
    ],
    chooseLanguage: "द्वितीयक भाषा निवडा",
    termAndCondition: "मी सूचना वाचल्या आहेत आणि समजल्या आहेत",
    startExamBtn: "परीक्षा सुरू करा",
    additionalIntructions: "अतिरिक्त सूचना",
  },
  assamese: {
    title: "অনুগ্ৰহ কৰি তলত উল্লেখ কৰা নিৰ্দেশনাবোৰ মনোযোগৰে পঢ়ক",
    heading: "সাধাৰণ নিৰ্দেশনাবলী :",
    sections: [
      "1. পৰীক্ষাৰ টাইমাৰ কেন্দ্ৰীয়ভাৱে পৰিচালিত হয়। প্ৰশ্নৰ স্ক্ৰীনৰ সোঁফালে এখন কাউণ্টডাউন কাউণ্টাৰ দেখা যায়, যি আপোনাক পৰীক্ষা শেষ কৰিবলৈ কিমান সময় বাকী আছে সেয়া দেখুৱায়। টাইমাৰ শেষ হ'লে পৰীক্ষা তৎক্ষণাৎ শেষ হ'ব বুলি লক্ষ্য কৰা অত্যন্ত গুৰুত্বপূর্ণ। আপোনাক মেনুৱেলভাৱে পৰীক্ষা দাখিল কৰাৰ প্ৰয়োজন নাই।",
      "2. প্ৰশ্নৰ প্যালেট আপোনাৰ স্ক্ৰীনৰ সোঁফালে অৱস্থিত আৰু প্ৰতিটো সংখ্যাবাচক প্ৰশ্নৰ বাবে তলত উল্লেখ কৰা অৱস্থাসমূহ দেখুৱায়:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "আপুনি এতিয়াও প্ৰশ্নৰ উত্তৰ নিদিয়েই আছে।",
      },
      {
        id: "2",
        class: "two",
        text: "আপুনি প্ৰশ্নৰ উত্তৰ দিছে।",
      },
      {
        id: "3",
        class: "three",
        text: "আপুনি প্ৰশ্নৰ উত্তৰ নিদিয়েই আছে কিন্তু ইয়াক পৰ্যালোচনাৰ বাবে চিহ্নিত কৰিছে।",
      },
      {
        id: "4",
        class: "four",
        text: "আপুনি প্ৰশ্নৰ উত্তৰ দিছে কিন্তু ইয়াক পৰ্যালোচনাৰ বাবে চিহ্নিত কৰিছে।",
      },
      {
        id: "5",
        class: "five",
        text: 'অনুগ্ৰহ কৰি লক্ষ্য কৰক যে যদি আপুনি কোনো প্ৰশ্নৰ উত্তৰ নিদিয়ে, তেন্তে ইয়াক "উত্তৰ নিদিয়া" হিচাপে চিহ্নিত কৰা হ’ব।',
      },
    ],
    additional: [
      "3. ভুল উত্তৰসমূহৰ বাবে কোনো হ্ৰাস নাই। আপোনাৰ সফলতাৰ সম্ভাৱনাসমূহ বৃদ্ধি কৰিবলৈ, আপোনাক সকলো প্ৰশ্নৰ চেষ্টা কৰিবলৈ পৰামৰ্শ দিয়া হৈছে।",
      "4. প্ৰশ্নৰ উত্তৰ দিবলৈ, অনুগ্ৰহ কৰি তলত উল্লেখ কৰা ফৰ্মেট ব্যৱহাৰ কৰক:",
    ],
    format: [
      "1. আপোনাৰ স্ক্ৰীনৰ প্ৰশ্ন নেভিগেশ্বন ব্যৱহাৰ কৰি সঠিক সংখ্যাবাচক প্ৰশ্নলৈ যাত্ৰা কৰক।",
      '2. বৰ্তমান প্ৰশ্নৰ বাবে আপোনাৰ উত্তৰসমূহ সংৰক্ষণ কৰিবলৈ আৰু পৰৱৰ্তীলৈ যাবলৈ "সংৰক্ষণ কৰক আৰু পৰৱৰ্তী" ক্লিক কৰক।',
      '3. আপোনাৰ উত্তৰসমূহ সংৰক্ষণ কৰিবলৈ আৰু আপোনাৰ দ্বাৰা পুনৰ পৰ্যালোচনা কৰিব বিচৰা প্ৰশ্নটো চিহ্নিত কৰিবলৈ, উত্তৰ দিয়াৰ পিছত "পুনৰ পৰ্যালোচনাৰ বাবে চিহ্নিত কৰক আৰু পৰৱৰ্তী" ক্লিক কৰক।',
    ],
    conclusion: [
      "5. MCQৰ সৈতে সন্মুখীন হ'লে, প্ৰতিটো বিকল্পৰ মনোযোগ সহকাৰে বিশ্লেষণ কৰক আৰু সংৰক্ষণ কৰিবলৈ বা পুনৰ পৰ্যালোচনাৰ বাবে চিহ্নিত কৰাৰ আগতে সৰ্বশ্ৰেষ্ঠ উত্তৰ বাচি লওক।",
      "পৰীক্ষাৰ সময়ত এই নিৰ্দেশনাবোৰ অনুসৰণ কৰক আৰু এটি মসৃণ আৰু সফল পৰীক্ষা অভিজ্ঞতা নিশ্চিত কৰক। শুভকামনা!",
    ],
    chooseLanguage: "দ্বিতীয় ভাষা বাছনি কৰক",
    termAndCondition: "মই নিৰ্দেশনাবোৰ পঢ়িছোঁ আৰু বুজিছোঁ",
    startExamBtn: "পৰীক্ষা আৰম্ভ কৰক",
    additionalIntructions: "অতিৰিক্ত নিৰ্দেশনাবলী",
  },
  konkani: {
    title: "कृपया खालील सूचना काळजीपूर्वक वाचा",
    heading: "सामान्य सूचना :",
    sections: [
      "1. कृपया लक्षात ठेवा की परीक्षा टाइमर केंद्रीय व्यवस्थापित आहे. प्रश्न स्क्रीनच्या उजव्या कोपर्यात उलट मोजणी काउंटर दिसतो, जो तुम्हाला परीक्षा पूर्ण करण्यासाठी किती वेळ बाकी आहे हे दर्शवतो. टाइमर संपल्यावर परीक्षा त्वरित संपेल हे लक्षात घेणे अत्यंत महत्त्वाचे आहे. तुम्हाला मॅन्युअली परीक्षा सादर करण्याची आवश्यकता नाही.",
      "2. प्रश्न पॅलेट तुमच्या स्क्रीनच्या उजव्या बाजूला आहे आणि प्रत्येक क्रमांकित प्रश्नासाठी खालील स्थिती दर्शवते:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "तुम्ही अद्याप प्रश्नाचे उत्तर दिलेले नाही.",
      },
      {
        id: "2",
        class: "two",
        text: "तुम्ही प्रश्नाचे उत्तर दिले आहे.",
      },
      {
        id: "3",
        class: "three",
        text: "तुम्ही प्रश्नाचे उत्तर दिलेले नाही पण ते पुनरावलोकनासाठी चिन्हांकित केले आहे.",
      },
      {
        id: "4",
        class: "four",
        text: "तुम्ही प्रश्नाचे उत्तर दिले आहे पण ते पुनरावलोकनासाठी चिन्हांकित केले आहे.",
      },
      {
        id: "5",
        class: "five",
        text: 'कृपया लक्षात ठेवा की तुम्ही प्रश्नाचे उत्तर दिलेले नाही, तर ते "उत्तर दिलेले नाही" म्हणून चिन्हांकित केले जाईल.',
      },
    ],
    additional: [
      "3. चुकीच्या उत्तरांसाठी कोणतेही कपात नाही. तुमच्या यशाच्या संधी वाढवण्यासाठी तुम्हाला सर्व प्रश्नांची उत्तरे देण्यास सांगितले जाते.",
      "4. प्रश्नाचे उत्तर देण्यासाठी, कृपया खालील स्वरूप वापरा:",
    ],
    format: [
      "1. तुमच्या स्क्रीनवरील प्रश्न नेव्हिगेशनचा वापर करून योग्य क्रमांकित प्रश्नावर जा.",
      '2. चालू प्रश्नासाठी तुमची उत्तरे जतन करण्यासाठी आणि पुढे जाण्यासाठी "जतन करा आणि पुढे" क्लिक करा.',
      '3. तुमची उत्तरे जतन करण्यासाठी आणि तुम्हाला नंतर पुन्हा पाहायच्या प्रश्नाचे संकेत देण्यासाठी, उत्तर दिल्यानंतर "पुनरावलोकनासाठी चिन्हांकित करा आणि पुढे" क्लिक करा.',
    ],
    conclusion: [
      "5. MCQला सामोरे जाताना, प्रत्येक पर्यायाचे काळजीपूर्वक विश्लेषण करा आणि जतन करण्यापूर्वी किंवा पुनरावलोकनासाठी चिन्हांकित करण्यापूर्वी सर्वोत्तम उत्तर निवडा.",
      "परीक्षेदरम्यान या सूचनांचे पालन करा आणि सुरळीत आणि यशस्वी चाचणी अनुभव सुनिश्चित करा. शुभेच्छा!",
    ],
    chooseLanguage: "द्वितीयक भाषा निवडा",
    termAndCondition: "मी सूचना वाचल्या आहेत आणि समजल्या आहेत",
    startExamBtn: "परीक्षा सुरू करा",
    additionalIntructions: "अतिरिक्त सूचना",
  },
  gujarati: {
    title: "કૃપા કરીને નીચેની સૂચનાઓ ધ્યાનથી વાંચો",
    heading: "સામાન્ય સૂચનાઓ :",
    sections: [
      "1. કૃપા કરીને નોંધો કે પરીક્ષા ટાઇમર કેન્દ્રિય રીતે સંચાલિત છે. પ્રશ્નની સ્ક્રીનના જમણા ખૂણામાં એક કાઉન્ટડાઉન કાઉન્ટર દેખાય છે, જે તમને પરીક્ષા પૂર્ણ કરવા માટે કેટલો સમય બાકી છે તે દર્શાવે છે. ટાઇમર સમાપ્ત થાય ત્યારે પરીક્ષા તરત જ સમાપ્ત થશે તે નોંધવું અત્યંત મહત્વપૂર્ણ છે. તમને મેન્યુઅલી પરીક્ષા સબમિટ કરવાની જરૂર નથી.",
      "2. પ્રશ્ન પેલેટ તમારી સ્ક્રીનની જમણી બાજુ પર છે અને દરેક નંબરવાળા પ્રશ્ન માટે નીચેની સ્થિતિઓ દર્શાવે છે:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "તમે હજુ સુધી પ્રશ્નનો જવાબ આપ્યો નથી.",
      },
      {
        id: "2",
        class: "two",
        text: "તમે પ્રશ્નનો જવાબ આપ્યો છે.",
      },
      {
        id: "3",
        class: "three",
        text: "તમે પ્રશ્નનો જવાબ આપ્યો નથી પરંતુ તેને સમીક્ષાના માટે ચિહ્નિત કર્યું છે.",
      },
      {
        id: "4",
        class: "four",
        text: "તમે પ્રશ્નનો જવાબ આપ્યો છે પરંતુ તેને સમીક્ષાના માટે ચિહ્નિત કર્યું છે.",
      },
      {
        id: "5",
        class: "five",
        text: 'કૃપા કરીને નોંધો કે જો તમે કોઈ પ્રશ્નનો જવાબ ન આપતા હો, તો તેને "જવાબ ન આપ્યું" તરીકે ચિહ્નિત કરવામાં આવશે.',
      },
    ],
    additional: [
      "3. ખોટા જવાબો માટે કોઈ કપાત નથી. તમારા સફળતા માટેની શક્યતાઓ વધારવા માટે, તમને તમામ પ્રશ્નોનો પ્રયાસ કરવા માટે સૂચવવામાં આવે છે.",
      "4. પ્રશ્નનો જવાબ આપવા માટે, કૃપા કરીને નીચેની ફોર્મેટનો ઉપયોગ કરો:",
    ],
    format: [
      "1. તમારી સ્ક્રીનની પ્રશ્ન નેવિગેશનનો ઉપયોગ કરીને યોગ્ય નંબરવાળા પ્રશ્ન પર જાઓ.",
      '2. વર્તમાન પ્રશ્ન માટે તમારા જવાબોને સાચવવા અને આગળ વધવા માટે "સાચવો અને આગળ" ક્લિક કરો.',
      '3. તમારા જવાબોને સાચવવા અને તમે પછી ફરીથી જોવા માંગતા પ્રશ્નને સંકેત આપવા માટે, ઉત્તર આપવા પછી "સમીક્ષાના માટે ચિહ્નિત કરો અને આગળ" ક્લિક કરો.',
    ],
    conclusion: [
      "5. MCQ સામે આવતી વખતે, દરેક વિકલ્પનું ધ્યાનપૂર્વક વિશ્લેષણ કરો અને સાચવવા અથવા સમીક્ષાના માટે ચિહ્નિત કરવા પહેલાં શ્રેષ્ઠ જવાબ પસંદ કરો.",
      "પરીક્ષાના સમય દરમિયાન આ સૂચનાઓનું પાલન કરો અને એક સરળ અને સફળ પરીક્ષા અનુભવ સુનિશ્ચિત કરો. શુભકામનાઓ!",
    ],
    chooseLanguage: "દ્વિતીય ભાષા પસંદ કરો",
    termAndCondition: "મેં સૂચનાઓ વાંચી છે અને સમજી છે",
    startExamBtn: "પરીક્ષા શરૂ કરો",
    additionalIntructions: "વધુ સૂચનાઓ",
  },
  kannada: {
    title: "ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಸೂಚನೆಗಳನ್ನು ಗಮನದಿಂದ ಓದಿ",
    heading: "ಸಾಮಾನ್ಯ ಸೂಚನೆಗಳು :",
    sections: [
      "1. ಪರೀಕ್ಷಾ ಟೈಮರ್ ಕೇಂದ್ರವಾಗಿ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ ಎಂದು ದಯವಿಟ್ಟು ಗಮನಿಸಿ. ಪ್ರಶ್ನೆಯ ಪರದೆಗೆ ಬಲಭಾಗದಲ್ಲಿ ಕೌಂಟ್‌ಡೌನ್ ಕೌಂಟರ್ ಕಾಣಿಸುತ್ತದೆ, ಇದು ನೀವು ಪರೀಕ್ಷೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಎಷ್ಟು ಸಮಯ ಉಳಿಯಿದೆ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತದೆ. ಟೈಮರ್ ಮುಗಿದಾಗ, ಪರೀಕ್ಷೆ ತಕ್ಷಣವೇ ಮುಗಿಯುತ್ತದೆ ಎಂದು ಗಮನಿಸುವುದು ಅತ್ಯಂತ ಮುಖ್ಯವಾಗಿದೆ. ನೀವು ಕೈಯಿಂದ ಪರೀಕ್ಷೆಯನ್ನು ಸಲ್ಲಿಸಲು ಅಗತ್ಯವಿಲ್ಲ.",
      "2. ಪ್ರಶ್ನೆಗಳ ಪ್ಯಾಲೆಟ್ ನಿಮ್ಮ ಪರದೆಗೆ ಬಲಭಾಗದಲ್ಲಿ ಇದೆ ಮತ್ತು ಪ್ರತಿಯೊಂದು ಸಂಖ್ಯೆಯ ಪ್ರಶ್ನೆಗೆ ಕೆಳಗಿನ ಸ್ಥಿತಿಗಳನ್ನು ತೋರಿಸುತ್ತದೆ:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "ನೀವು ಇನ್ನೂ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿಲ್ಲ.",
      },
      {
        id: "2",
        class: "two",
        text: "ನೀವು ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿದ್ದೀರಿ.",
      },
      {
        id: "3",
        class: "three",
        text: "ನೀವು ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿಲ್ಲ ಆದರೆ ಅದನ್ನು ಪುನರಾವಲೋಕನಕ್ಕಾಗಿ ಗುರುತಿಸಲಾಗಿದೆ.",
      },
      {
        id: "4",
        class: "four",
        text: "ನೀವು ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿದ್ದೀರಿ ಆದರೆ ಅದನ್ನು ಪುನರಾವಲೋಕನಕ್ಕಾಗಿ ಗುರುತಿಸಲಾಗಿದೆ.",
      },
      {
        id: "5",
        class: "five",
        text: 'ದಯವಿಟ್ಟು ಗಮನಿಸಿ ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸದಿದ್ದರೆ, ಅದನ್ನು "ಉತ್ತರಿಸಲಿಲ್ಲ" ಎಂದು ಗುರುತಿಸಲಾಗುತ್ತದೆ.',
      },
    ],
    additional: [
      "3. ತಪ್ಪು ಉತ್ತರಗಳಿಗೆ ಯಾವುದೇ ಕಡಿತವಿಲ್ಲ. ನಿಮ್ಮ ಯಶಸ್ಸಿನ ಸಾಧ್ಯತೆಗಳನ್ನು ಹೆಚ್ಚಿಸಲು, ನಿಮಗೆ ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಪ್ರಯತ್ನಿಸಲು ಸಲಹೆ ನೀಡಲಾಗಿದೆ.",
      "4. ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಲು, ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಸ್ವರೂಪವನ್ನು ಬಳಸಿರಿ:",
    ],
    format: [
      "1. ನಿಮ್ಮ ಪರದೆಗೆ ಪ್ರಶ್ನೆ ನಾವಿಗೇಶನ್ ಬಳಸಿಕೊಂಡು ಸರಿಯಾದ ಸಂಖ್ಯೆಯ ಪ್ರಶ್ನೆಗೆ ಹೋಗಿ.",
      '2. ಪ್ರಸ್ತುತ ಪ್ರಶ್ನೆಗೆ ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ಉಳಿಸಲು ಮತ್ತು ಮುಂದಕ್ಕೆ ಹೋಗಲು "ಉಳಿಸಿ ಮತ್ತು ಮುಂದಕ್ಕೆ" ಕ್ಲಿಕ್ ಮಾಡಿ.',
      '3. ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ಉಳಿಸಲು ಮತ್ತು ನಂತರ ಪುನರಾವಲೋಕನ ಮಾಡಲು ನೀವು ಬಯಸುವ ಪ್ರಶ್ನೆಯನ್ನು ಸೂಚಿಸಲು, ಉತ್ತರಿಸಿದ ನಂತರ "ಪುನರಾವಲೋಕನಕ್ಕಾಗಿ ಗುರುತಿಸಿ ಮತ್ತು ಮುಂದಕ್ಕೆ" ಕ್ಲಿಕ್ ಮಾಡಿ.',
    ],
    conclusion: [
      "5. MCQಗೆ ಎದುರಿಸುತ್ತಿರುವಾಗ, ಪ್ರತಿಯೊಂದು ಆಯ್ಕೆಯನ್ನು ಗಮನದಿಂದ ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ಉಳಿಸುವ ಅಥವಾ ಪುನರಾವಲೋಕನಕ್ಕಾಗಿ ಗುರುತಿಸುವ ಮೊದಲು ಉತ್ತಮ ಉತ್ತರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
      "ಪರೀಕ್ಷೆಯ ಸಮಯದಲ್ಲಿ ಈ ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ ಮತ್ತು ಸುಗಮ ಮತ್ತು ಯಶಸ್ವಿ ಪರೀಕ್ಷಾ ಅನುಭವವನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ. ಶುಭಾಶಯಗಳು!",
    ],
    chooseLanguage: "ದ್ವಿತೀಯ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
    termAndCondition: "ನಾನು ಸೂಚನೆಗಳನ್ನು ಓದಿದ್ದೇನೆ ಮತ್ತು ಅರ್ಥ ಮಾಡಿಕೊಂಡಿದ್ದೇನೆ",
    startExamBtn: "ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ",
    additionalIntructions: "ಹೆಚ್ಚಿನ ಸೂಚನೆಗಳು",
  },
  malayalam: {
    title: "ദയവായി താഴെപ്പറയുന്ന നിർദ്ദേശങ്ങൾ ശ്രദ്ധയിൽക്കൊള്ളുക",
    heading: "സാധാരണ നിർദ്ദേശങ്ങൾ :",
    sections: [
      "1. പരീക്ഷാ ടൈമർ കേന്ദ്രമായി നിയന്ത്രിക്കപ്പെടുന്നു എന്ന് ദയവായി ശ്രദ്ധിക്കുക. ചോദ്യത്തിന്റെ സ്ക്രീനിന്റെ വലത് കോണിൽ ഒരു കൗണ്ട്ഡൗൺ കൗണ്ടർ കാണാം, ഇത് നിങ്ങൾക്ക് പരീക്ഷ പൂർത്തിയാക്കാൻ എത്ര സമയം ബാക്കി ഉണ്ട് എന്ന് കാണിക്കുന്നു. ടൈമർ അവസാനിക്കുമ്പോൾ, പരീക്ഷ ഉടൻ അവസാനിക്കും എന്നത് ശ്രദ്ധിക്കുക വളരെ പ്രധാനമാണ്. നിങ്ങൾക്ക് കൈമാറ്റം ചെയ്യേണ്ടതില്ല.",
      "2. ചോദ്യ പെയ്ലറ്റ് നിങ്ങളുടെ സ്ക്രീനിന്റെ വലത് ഭാഗത്ത് ആണ്, ഓരോ നമ്പർ ചോദ്യത്തിനും താഴെപ്പറയുന്ന സ്ഥിതികൾ കാണിക്കുന്നു:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "നിങ്ങൾ ഇപ്പോഴും ചോദ്യത്തിന് മറുപടി നൽകിയിട്ടില്ല.",
      },
      {
        id: "2",
        class: "two",
        text: "നിങ്ങൾ ചോദ്യത്തിന് മറുപടി നൽകിയിട്ടുണ്ട്.",
      },
      {
        id: "3",
        class: "three",
        text: "നിങ്ങൾ ചോദ്യത്തിന് മറുപടി നൽകിയിട്ടില്ല, പക്ഷേ അത് അവലോകനത്തിനായി അടയാളപ്പെടുത്തിയിട്ടുണ്ട്.",
      },
      {
        id: "4",
        class: "four",
        text: "നിങ്ങൾ ചോദ്യത്തിന് മറുപടി നൽകിയിട്ടുണ്ട്, പക്ഷേ അത് അവലോകനത്തിനായി അടയാളപ്പെടുത്തിയിട്ടുണ്ട്.",
      },
      {
        id: "5",
        class: "five",
        text: 'ദയവായി ശ്രദ്ധിക്കുക നിങ്ങൾക്ക് ഒരു ചോദ്യത്തിന് മറുപടി നൽകാത്ത പക്ഷം, അത് "മറുപടി നൽകാത്തത്" എന്ന നിലയിൽ അടയാളപ്പെടുത്തും.',
      },
    ],
    additional: [
      "3. തെറ്റായ മറുപടികൾക്കു വേണ്ടി ഏതെങ്കിലും കുറവ് ഇല്ല. നിങ്ങളുടെ വിജയ സാധ്യതകൾ വർദ്ധിപ്പിക്കാൻ, നിങ്ങൾക്ക് എല്ലാ ചോദ്യങ്ങൾക്കും ശ്രമിക്കാൻ ശുപാർശ ചെയ്യുന്നു.",
      "4. ചോദ്യത്തിന് മറുപടി നൽകാൻ, ദയവായി താഴെപ്പറയുന്ന ഫോർമാറ്റ് ഉപയോഗിക്കുക:",
    ],
    format: [
      "1. നിങ്ങളുടെ സ്ക്രീനിലെ ചോദ്യ നാവിഗേഷൻ ഉപയോഗിച്ച് ശരിയായ നമ്പർ ചോദ്യത്തിലേക്ക് പോവുക.",
      '2. നിലവിലെ ചോദ്യത്തിന് നിങ്ങളുടെ മറുപടികൾ സംരക്ഷിക്കാൻ, "സംരക്ഷിക്കുക & മുന്നോട്ട്" ക്ലിക്ക് ചെയ്യുക.',
      '3. നിങ്ങളുടെ മറുപടികൾ സംരക്ഷിക്കാൻ, നിങ്ങൾക്ക് പിന്നീട് അവലോകനം ചെയ്യാൻ ആഗ്രഹിക്കുന്ന ചോദ്യത്തെ അടയാളപ്പെടുത്താൻ, മറുപടി നൽകിയ ശേഷം "അവലോകനത്തിനായി അടയാളിക്കുക & മുന്നോട്ട്" ಕ್ಲിക്ക് ചെയ്യുക.',
    ],
    conclusion: [
      "5. MCQ-കൾ നേരിടുമ്പോൾ, ഓരോ ഓപ്ഷനും ശ്രദ്ധയോടെ വിശകലനം ചെയ്യുക, മറുപടി നൽകുന്നതിന് മുമ്പ് മികച്ച മറുപടി തിരഞ്ഞെടുക്കുക.",
      "പരീക്ഷയുടെ സമയത്ത് ഈ നിർദ്ദേശങ്ങൾ പാലിക്കുക, എളുപ്പവും വിജയകരവുമായ പരീക്ഷാ അനുഭവം ഉറപ്പാക്കുക. എല്ലാ ആശംസകളും!",
    ],
    termAndCondition: "ഞാൻ നിർദ്ദേശങ്ങൾ വായിച്ചു, മനസ്സിലാക്കി",
    chooseLanguage: "രണ്ടാം ഭാഷ തിരഞ്ഞെടുക്കുക",
    startExamBtn: "പരീക്ഷ ആരംഭിക്കുക",
    additionalIntructions: "കൂടുതൽ നിർദ്ദേശങ്ങൾ",
  },
  odia: {
    title: "ଦୟାକରି ନିମ୍ନଲିଖିତ ନିର୍ଦ୍ଦେଶାବଳୀଗୁଡ଼ିକୁ ଧ୍ୟାନଦେଇ ପଢନ୍ତୁ",
    heading: "ସାଧାରଣ ନିର୍ଦ୍ଦେଶାବଳୀ :",
    sections: [
      "1. ପରୀକ୍ଷା ଟାଇମର କେନ୍ଦ୍ରୀୟଭାବେ ପରିଚାଳିତ ହୋଇଛି ବୋଲି ଦୟାକରି ଧ୍ୟାନ ଦିଅନ୍ତୁ। ପ୍ରଶ୍ନ ସ୍କ୍ରୀନର ଡାହାଣ କୋଣରେ ଏକ କାଉଣ୍ଟଡଉନ କାଉଣ୍ଟର ଦେଖାଯିବ, ଯାହା ଆପଣଙ୍କୁ ପରୀକ୍ଷା ସମାପ୍ତ କରିବାକୁ କେତେ ସମୟ ବାକୀ ଅଛି ବୋଲି ଦେଖାଯିବ। ଟାଇମର ସମାପ୍ତ ହେଲେ, ପରୀକ୍ଷା ସମୟରେ ସମସ୍ତଙ୍କୁ ସମସ୍ତଙ୍କୁ ବୋଲି ଧ୍ୟାନ ଦିଅନ୍ତୁ।",
      "2. ପ୍ରଶ୍ନ ପେଲେଟ ବଡ ସ୍କୃନର ଡାହାଣ ପଟଟେ, ପ୍ରତିଟି ସଂଖ୍ୟା ପ୍ରଶ୍ନ ପାଇଁ କେତେଗୁଡ଼ିକ ବସବସ କରୁଛନ୍ତି:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "ଆପଣଙ୍କୁ ପୂରଣ କରିବାକୁ ପୂଣ କରନଥିବେ।",
      },
      {
        id: "2",
        class: "two",
        text: "ଆପଣ ପ୍ରଶ୍ନକୁ ଉତ୍ତର ଦେଇଛନ୍ତି।",
      },
      {
        id: "3",
        class: "three",
        text: "ଆପଣ ପ୍ରଶ୍ନକୁ ଉତ୍ତର ଦେଇନାହାନ୍ତି କିନ୍ତୁ ଏହାକୁ ପୁନରାବଲୋକନ ପାଇଁ ଚିହ୍ନଟ କରାଯାଇଛି।",
      },
      {
        id: "4",
        class: "four",
        text: "ଆପଣ ପ୍ରଶ୍ନକୁ ଉତ୍ତର ଦେଇଛନ୍ତି କିନ୍ତୁ ଏହାକୁ ପୁନରାବଲୋକନ ପାଇଁ ଚିହ୍ନଟ କରାଯାଇଛି।",
      },
      {
        id: "5",
        class: "five",
        text: 'ଦୟାକରି ଧ୍ୟାନ ଦିଅନ୍ତୁ, ଯଦି ଆପଣ କୌଣସି ପ୍ରଶ୍ନକୁ ଉତ୍ତର ଦେବେ, ସେଥିରେ "ଉତ୍ତର ନଥିବା" ବୋଲି ସୂଚୀଭୂକ୍ତ କରାଯିବ।',
      },
    ],
    additional: [
      "3. ତ୍ରୁଟି ଉତ୍ତର ପାଇଁ କୌଣସି କମ୍ ନାହିଁ। ଆପଣଙ୍କର ସଫଳତାର ସମ୍ଭାବନା ବୃଦ୍ଧି କରିବାକୁ, ଆପଣଙ୍କୁ ସମସ୍ତ ପ୍ରଶ୍ନଗୁଡ଼ିକୁ ପ୍ରୟୋଗ କରିବାକୁ ସୁପାରିଶ କରାଯାଇଛି।",
      "4. ପ୍ରଶ୍ନକୁ ଉତ୍ତର ଦେବାକୁ, ଦୟାକରି ନିମ୍ନଲିଖିତ ଫର୍ମାଟ୍ ବ୍ୟବହାର କରନ୍ତୁ:",
    ],
    format: [
      "1. ଆପଣଙ୍କର ସ୍କ୍ରିନରେ ପ୍ରଶ୍ନ ନାଭିଗେସନ୍ ବ୍ୟବହାର କରି ସଠିକ୍ ସଂଖ୍ୟା ପ୍ରଶ୍ନକୁ ଯାଆନ୍ତୁ।",
      "2. ଆପଣଙ୍କର ସ୍କ୍ରିନରେ ପ୍ରଶ୍ନ ନାଭିଗେସନ୍ ବ୍ୟବହାର କରି ସଠିକ୍ ସଂଖ୍ୟା ପ୍ରଶ୍ନକୁ ଯାଆନ୍ତୁ।",
      '3. ଆପଣଙ୍କର ଉତ୍ତରଗୁଡ଼ିକୁ ସୁରକ୍ଷିତ କରିବା ପାଇଁ, ଆପଣ ପୁନରାବଲୋକନ ପାଇଁ ଚିହ୍ନଟ କରିବାକୁ ଚାହାଁଥିବା ପ୍ରଶ୍ନକୁ ଚିହ୍ନଟ କରିବା ପାଇଁ, "ସୁରକ୍ଷିତ & ଆଗକୁ" କଲିକ କରନ୍ତୁ।',
    ],
    conclusion: [
      "5. MCQ ମୁହାଁକୁ ମୁହାଁ କରିବା ସମୟରେ, ପ୍ରତିଟି ବିକଳ୍ପକୁ ଧ୍ୟାନଦେଇ ବିଶ୍ଲେଷଣ କରନ୍ତୁ, ଉତ୍ତର ଦେବାକୁ ପୂର୍ଣ୍ଣ ଉତ୍ତର ବାଛନ୍ତୁ।",
      "ପରୀକ୍ଷା ସମୟରେ ଏହି ନିର୍ଦ୍ଦେଶାବଳୀଗୁଡ଼ିକୁ ପାଳନ କରନ୍ତୁ, ସହଜ ଏବଂ ସଫଳ ପରୀକ୍ଷା ଅନୁଭବକୁ ସୁନିଶ୍ଚିତ କରନ୍ତୁ। ସମସ୍ତଙ୍କୁ ଶୁଭେଚ୍ଛା!",
    ],
    termAndCondition: "ମୁଁ ନିର୍ଦ୍ଦେଶାବଳୀଗୁଡ଼ିକୁ ପଢିଛି, ବୁଝିଛି",
    chooseLanguage: "ଦ୍ୱିତୀୟ ଭାଷା ବାଛନ୍ତୁ",
    startExamBtn: "ପରୀକ୍ଷା ଆରମ୍ଭ କରନ୍ତୁ",
    additionalIntructions: "ଅଧିକ ନିର୍ଦ୍ଦେଶାବଳୀଗୁଡ଼ିକୁ ଦୟାକରି ପଢନ୍ତୁ",
  },
  punjabi: {
    title: "ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਦਿੱਤੇ ਨਿਰਦੇਸ਼ਾਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ",
    heading: "ਆਮ ਨਿਰਦੇਸ਼ :",
    sections: [
      "1. ਪਰੀਖਿਆ ਟਾਈਮਰ ਕੇਂਦਰੀ ਤੌਰ 'ਤੇ ਚਲਾਇਆ ਗਿਆ ਹੈ। ਪ੍ਰਸ਼ਨ ਸਕਰੀਨ ਦੇ ਸੱਜੇ ਕੋਨੇ 'ਤੇ ਇੱਕ ਗਿਣਤੀਗਿਣਤੀ ਵੇਖੀ ਜਾਵੇਗੀ, ਜੋ ਤੁਹਾਨੂੰ ਦੱਸੇਗੀ ਕਿ ਤੁਹਾਨੂੰ ਪਰੀਖਿਆ ਪੂਰੀ ਕਰਨ ਲਈ ਕਿੰਨਾ ਸਮਾਂ ਬਾਕੀ ਹੈ। ਜਦੋਂ ਟਾਈਮਰ ਖਤਮ ਹੋਵੇਗਾ, ਤਾਂ ਪਰੀਖਿਆ ਸਮਾਪਤ ਹੋ ਜਾਵੇਗੀ।",
      "2. ਪ੍ਰਸ਼ਨ ਪੈਲੇਟ ਵੱਡੀ ਸਕਰੀਨ ਦੇ ਸੱਜੇ ਪਾਸੇ ਹੈ, ਹਰ ਨੰਬਰ ਲਈ ਕਿੰਨੇ ਪ੍ਰਸ਼ਨ ਹਨ:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "ਤੁਸੀਂ ਹੁਣ ਤੱਕ ਕਿਸੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਨਹੀਂ ਦਿੱਤਾ ਹੈ।",
      },
      {
        id: "2",
        class: "two",
        text: "ਤੁਸੀਂ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿੱਤਾ ਹੈ।",
      },
      {
        id: "3",
        class: "three",
        text: "ਤੁਸੀਂ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਨਹੀਂ ਦਿੱਤਾ ਹੈ ਪਰ ਇਸ ਨੂੰ ਦੁਬਾਰਾ ਵੇਖਣ ਲਈ ਚਿੰਨਤ ਕੀਤਾ ਗਿਆ ਹੈ।",
      },
      {
        id: "4",
        class: "four",
        text: "ਤੁਸੀਂ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿੱਤਾ ਹੈ ਪਰ ਇਸ ਨੂੰ ਦੁਬਾਰਾ ਵੇਖਣ ਲਈ ਚਿੰਨਤ ਕੀਤਾ ਗਿਆ ਹੈ।",
      },
      {
        id: "5",
        class: "five",
        text: 'ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ ਕਿ ਜੇ ਤੁਸੀਂ ਕਿਸੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਨਹੀਂ ਦਿੰਦੇ ਤਾਂ ਇਸ ਨੂੰ "ਉੱਤਰ ਨਹੀਂ ਦਿੱਤਾ" ਵਜੋਂ ਚਿੰਨਤ ਕੀਤਾ ਜਾਵੇਗਾ।',
      },
    ],
    additional: [
      "3. ਗਲਤ ਉੱਤਰਾਂ ਲਈ ਕੋਈ ਘਾਟ ਨਹੀਂ ਹੈ। ਤੁਹਾਡੇ ਸਫਲਤਾ ਦੇ ਮੌਕੇ ਨੂੰ ਵਧਾਉਣ ਲਈ, ਤੁਹਾਨੂੰ ਸਾਰੇ ਪ੍ਰਸ਼ਨਾਂ 'ਤੇ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",
      "4. ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦੇਣ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਦਿੱਤੇ ਫਾਰਮੈਟ ਦੀ ਵਰਤੋਂ ਕਰੋ:",
    ],
    format: [
      "1. ਆਪਣੇ ਸਕਰੀਨ 'ਤੇ ਪ੍ਰਸ਼ਨ ਨੈਵੀਗੇਸ਼ਨ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਹੀ ਨੰਬਰ ਦੇ ਪ੍ਰਸ਼ਨ 'ਤੇ ਜਾਓ।",
      "'2. ਆਪਣੇ ਸਕਰੀਨ 'ਤੇ ਪ੍ਰਸ਼ਨ ਨੈਵੀਗੇਸ਼ਨ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਹੀ ਨੰਬਰ ਦੇ ਪ੍ਰਸ਼ਨ 'ਤੇ ਜਾਓ।'",
      '3. ਆਪਣੇ ਉੱਤਰਾਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਕਰਨ ਲਈ, ਤੁਸੀਂ ਦੁਬਾਰਾ ਵੇਖਣ ਲਈ ਚਿੰਨਤ ਕੀਤੇ ਪ੍ਰਸ਼ਨਾਂ ਨੂੰ ਚਿੰਨਤ ਕਰਨ ਲਈ "ਸੁਰੱਖਿਅਤ & ਅੱਗੇ" ਤੇ ਕਲਿੱਕ ਕਰੋ।',
    ],
    conclusion: [
      "5. MCQ ਦਾ ਸਾਹਮਣਾ ਕਰਨ ਦੇ ਸਮੇਂ, ਹਰ ਵਿਕਲਪ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ, ਪੂਰਨ ਉੱਤਰ ਦੇਣ ਲਈ ਚੁਣੋ।",
      "ਪਰੀਖਿਆ ਦੇ ਸਮੇਂ ਇਹ ਨਿਰਦੇਸ਼ਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ, ਇੱਕ ਆਸਾਨ ਅਤੇ ਸਫਲ ਪਰੀਖਿਆ ਦੇ ਅਨੁਭਵ ਨੂੰ ਯਕੀਨੀ ਬਣਾਓ। ਸਭ ਨੂੰ ਸ਼ੁਭਕਾਮਨਾਵਾਂ!",
    ],
    termAndCondition: "ਮੈਂ ਨਿਰਦੇਸ਼ਾਂ ਨੂੰ ਪੜ੍ਹਿਆ ਹੈ, ਸਮਝਿਆ ਹੈ",
    chooseLanguage: "ਦੂਜੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    startExamBtn: "ਪਰੀਖਿਆ ਸ਼ੁਰੂ ਕਰੋ",
    additionalIntructions: "ਕਿਰਪਾ ਕਰਕੇ ਹੋਰ ਨਿਰਦੇਸ਼ਾਂ ਨੂੰ ਪੜ੍ਹੋ",
  },
  tamil: {
    title: "தயவுசெய்து கீழே உள்ள வழிமுறைகளை கவனமாக படிக்கவும்",
    heading: "பொது வழிமுறைகள் :",
    sections: [
      "1. தேர்வு டைமர் மையமாக இயக்கப்படுகிறது. கேள்வி திரையின் வலது மூலையில் ஒரு எண்ணிக்கை கணக்கீடு காணப்படும், இது நீங்கள் தேர்வை முடிக்க எவ்வளவு நேரம் மீதமுள்ளது என்பதை உங்களுக்கு தெரிவிக்கும். டைமர் முடிந்தால், தேர்வு முடிவடையும்.",
      "2. கேள்வி பேலெட் பெரிய திரையின் வலது பக்கத்தில் உள்ளது, ஒவ்வொரு எண்ணிக்கைக்காக எத்தனை கேள்விகள் உள்ளன:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "நீங்கள் இப்போது வரை எந்த கேள்விக்கும் பதிலளிக்கவில்லை.",
      },
      {
        id: "2",
        class: "two",
        text: "நீங்கள் கேள்விக்கு பதிலளித்துள்ளீர்கள்.",
      },
      {
        id: "3",
        class: "three",
        text: "நீங்கள் கேள்விக்கு பதிலளிக்கவில்லை ஆனால் இதனை மறுபரிசீலனை செய்ய அடையாளம் காட்டப்பட்டுள்ளது.",
      },
      {
        id: "4",
        class: "four",
        text: "நீங்கள் கேள்விக்கு பதிலளித்துள்ளீர்கள் ஆனால் இதனை மறுபரிசீலனை செய்ய அடையாளம் காட்டப்பட்டுள்ளது.",
      },
      {
        id: "5",
        class: "five",
        text: 'தயவுசெய்து கவனிக்கவும், நீங்கள் எந்த கேள்விக்கும் பதிலளிக்கவில்லை என்றால், இதனை "பதில் இல்லை" என அடையாளம் காட்டப்படும்.',
      },
    ],
    additional: [
      "3. தவறான பதில்களுக்கு எந்த குறைப்பு இல்லை. உங்கள் வெற்றியின் வாய்ப்புகளை அதிகரிக்க, நீங்கள் அனைத்து கேள்விகளிலும் முயற்சிக்க பரிந்துரை செய்யப்படுகிறது.",
      "4. கேள்விக்கு பதில் அளிக்க, தயவுசெய்து கீழே உள்ள வடிவத்தைப் பயன்படுத்தவும்:",
    ],
    format: [
      "1. உங்கள் திரையில் கேள்வி நெவிகேஷனைப் பயன்படுத்தி சரியான எண்ணிக்கையிலான கேள்விக்கு செல்லவும்.",
      "'2. உங்கள் திரையில் கேள்வி நெவிகேஷனைப் பயன்படுத்தி சரியான எண்ணிக்கையிலான கேள்விக்கு செல்லவும்.'",
      '3. உங்கள் பதில்களை பாதுகாக்க, நீங்கள் மறுபரிசீலனை செய்ய விரும்பும் கேள்விகளை அடையாளம் காட்ட "பாதுகாப்பு மற்றும் அடுத்தது" என்பதைக் கிளிக் செய்யவும்.',
    ],
    conclusion: [
      "5. MCQ க்கு எதிராக இருக்கும் போது, ஒவ்வொரு விருப்பத்திற்கும் கவனமாக ஆய்வு செய்யவும், முழுமையான பதிலைத் தேர்ந்தெடுக்கவும்.",
      "தேர்வின் போது இந்த வழிமுறைகளைப் பின்பற்றுங்கள், எளிதான மற்றும் வெற்றிகரமான தேர்வு அனுபவத்தை உறுதிசெய்யுங்கள். அனைவருக்கும் வாழ்த்துகள்!",
    ],
    termAndCondition: "நான் வழிமுறைகளைப் படித்தேன், புரிந்தேன்",
    chooseLanguage: "இரண்டாவது மொழியைத் தேர்ந்தெடுக்கவும்",
    startExamBtn: "தேர்வை தொடங்கவும்",
    additionalIntructions: "மேலும் வழிமுறைகளைப் படிக்கவும்",
  },
  bengali: {
    title: "অনুগ্রহ করে নীচের নির্দেশাবলী মনোযোগ সহকারে পড়ুন",
    heading: "সাধারণ নির্দেশাবলী :",
    sections: [
      "1. পরীক্ষার টাইমার কেন্দ্রীয়ভাবে চালিত হয়। প্রশ্নের স্ক্রীনের ডান কোণে একটি গণনা গণনা দেখা যাবে, যা আপনাকে পরীক্ষাটি সম্পূর্ণ করতে কত সময় বাকি আছে তা বলবে। যখন টাইমার শেষ হবে, পরীক্ষা শেষ হয়ে যাবে।",
      "2. প্রশ্ন প্যালেট বড় স্ক্রীনের ডান পাশে রয়েছে, প্রতিটি সংখ্যার জন্য কতগুলি প্রশ্ন রয়েছে:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "আপনি এখন পর্যন্ত কোন প্রশ্নের উত্তর দেননি।",
      },
      {
        id: "2",
        class: "two",
        text: "আপনি প্রশ্নের উত্তর দিয়েছেন।",
      },
      {
        id: "3",
        class: "three",
        text: "আপনি প্রশ্নের উত্তর দেননি কিন্তু এটি পুনরায় দেখার জন্য চিহ্নিত করা হয়েছে।",
      },
      {
        id: "4",
        class: "four",
        text: "আপনি প্রশ্নের উত্তর দিয়েছেন কিন্তু এটি পুনরায় দেখার জন্য চিহ্নিত করা হয়েছে।",
      },
      {
        id: "5",
        class: "five",
        text: 'অনুগ্রহ করে লক্ষ্য করুন যে আপনি যদি কোন প্রশ্নের উত্তর না দেন তবে এটি "উত্তর দেওয়া হয়নি" হিসাবে চিহ্নিত করা হবে।',
      },
    ],
    additional: [
      "3. ভুল উত্তরের জন্য কোন কাটা নেই। আপনার সাফল্যের সম্ভাবনা বাড়ানোর জন্য, আপনাকে সমস্ত প্রশ্নে চেষ্টা করার পরামর্শ দেওয়া হচ্ছে।",
      "4. প্রশ্নের উত্তর দিতে, অনুগ্রহ করে নীচের ফর্ম্যাটটি ব্যবহার করুন:",
    ],
    format: [
      "1. আপনার স্ক্রীনে প্রশ্ন নেভিগেশন ব্যবহার করে সঠিক সংখ্যার প্রশ্নে যান।",
      "'2. আপনার স্ক্রীনে প্রশ্ন নেভিগেশন ব্যবহার করে সঠিক সংখ্যার প্রশ্নে যান।'",
      '3. আপনার উত্তরগুলি সুরক্ষিত করতে, আপনি পুনরায় দেখার জন্য চিহ্নিত করা প্রশ্নগুলিকে চিহ্নিত করতে "সুরক্ষিত এবং পরবর্তী" ক্লিক করুন।',
    ],
    conclusion: [
      "5. এমসিকিউয়ের বিরুদ্ধে থাকার সময়, প্রতিটি বিকল্পটি মনোযোগ সহকারে বিশ্লেষণ করুন, সম্পূর্ণ উত্তর দিতে নির্বাচন করুন।",
      "পরীক্ষার সময় এই নির্দেশাবলীর অনুসরণ করুন, একটি সহজ এবং সফল পরীক্ষার অভিজ্ঞতা নিশ্চিত করুন। সকলকে শুভকামনা!",
    ],
    termAndCondition: "আমি নির্দেশাবলী পড়েছি, বুঝেছি",
    chooseLanguage: "দ্বিতীয় ভাষা নির্বাচন করুন",
    startExamBtn: "পরীক্ষা শুরু করুন",
    additionalIntructions: "অনুগ্রহ করে আরও নির্দেশাবলী পড়ুন",
  },
  kashmiri: {
    title: "مہربانی کرکے نیچے دی گئی ہدایات کو توجہ سے پڑھیں",
    heading: "عام ہدایات :",
    sections: [
      "1. امتحان کا ٹائمر مرکزی طور پر چلتا ہے۔ سوالات کی اسکرین کے دائیں کونے میں ایک گنتی نظر آئے گی، جو آپ کو بتائے گی کہ امتحان مکمل کرنے کے لیے آپ کے پاس کتنا وقت باقی ہے۔ جب ٹائمر ختم ہو جائے گا، امتحان ختم ہو جائے گا۔",
      "2. سوالات کا پیلیٹ بڑی اسکرین کے دائیں جانب ہے، ہر نمبر کے لیے کتنے سوالات ہیں:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "آپ نے اب تک کسی سوال کا جواب نہیں دیا ہے۔",
      },
      {
        id: "2",
        class: "two",
        text: "آپ نے سوال کا جواب دیا ہے۔",
      },
      {
        id: "3",
        class: "three",
        text: "آپ نے سوال کا جواب نہیں دیا لیکن اسے دوبارہ دیکھنے کے لیے نشان زد کیا گیا ہے۔",
      },
      {
        id: "4",
        class: "four",
        text: "آپ نے سوال کا جواب دیا ہے لیکن اسے دوبارہ دیکھنے کے لیے نشان زد کیا گیا ہے۔",
      },
      {
        id: "5",
        class: "five",
        text: 'براہ کرم نوٹ کریں کہ اگر آپ کسی سوال کا جواب نہیں دیتے ہیں تو اسے "جواب نہیں دیا" کے طور پر نشان زد کیا جائے گا۔',
      },
    ],
    additional: [
      "3. غلط جوابات کے لیے کوئی کٹوتی نہیں ہے۔ آپ کی کامیابی کے امکانات کو بڑھانے کے لیے، آپ کو تمام سوالات پر کوشش کرنے کی تجویز دی جاتی ہے۔",
      "4. سوال کا جواب دینے کے لیے، براہ کرم نیچے دیے گئے فارمیٹ کا استعمال کریں:",
    ],
    format: [
      "1. اپنی اسکرین پر سوالات کی نیویگیشن کا استعمال کرتے ہوئے صحیح نمبر کے سوال پر جائیں۔",
      "'2. اپنی اسکرین پر سوالات کی نیویگیشن کا استعمال کرتے ہوئے صحیح نمبر کے سوال پر جائیں۔'",
      '3. اپنے جوابات کو محفوظ کرنے کے لیے، آپ دوبارہ دیکھنے کے لیے نشان زد کردہ سوالات کو نشان زد کرنے کے لیے "محفوظ کریں اور اگلا" پر کلک کریں۔',
    ],
    conclusion: [
      "5. ایم سی کیو کا سامنا کرتے وقت، ہر آپشن کا توجہ سے تجزیہ کریں، مکمل جواب دینے کے لیے منتخب کریں۔",
      "امتحان کے دوران ان ہدایات کی پیروی کریں، ایک آسان اور کامیاب امتحانی تجربے کو یقینی بنائیں۔ سب کو نیک خواہشات!",
    ],
    termAndCondition: "میں نے ہدایات پڑھ لی ہیں، سمجھ لیا ہے",
    chooseLanguage: "دوسری زبان منتخب کریں",
    startExamBtn: "امتحان شروع کریں",
    additionalIntructions: "براہ کرم مزید ہدایات پڑھیں",
  },
  urdu: {
    title: "براہ کرم نیچے دی گئی ہدایات کو توجہ سے پڑھیں",
    heading: "عام ہدایات :",
    sections: [
      "1. امتحان کا ٹائمر مرکزی طور پر چلتا ہے۔ سوالات کی اسکرین کے دائیں کونے میں ایک گنتی نظر آئے گی، جو آپ کو بتائے گی کہ امتحان مکمل کرنے کے لیے آپ کے پاس کتنا وقت باقی ہے۔ جب ٹائمر ختم ہو جائے گا، امتحان ختم ہو جائے گا۔",
      "2. سوالات کا پیلیٹ بڑی اسکرین کے دائیں جانب ہے، ہر نمبر کے لیے کتنے سوالات ہیں:",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "آپ نے اب تک کسی سوال کا جواب نہیں دیا ہے۔",
      },
      {
        id: "2",
        class: "two",
        text: "آپ نے سوال کا جواب دیا ہے۔",
      },
      {
        id: "3",
        class: "three",
        text: "آپ نے سوال کا جواب نہیں دیا لیکن اسے دوبارہ دیکھنے کے لیے نشان زد کیا گیا ہے۔",
      },
      {
        id: "4",
        class: "four",
        text: "آپ نے سوال کا جواب دیا ہے لیکن اسے دوبارہ دیکھنے کے لیے نشان زد کیا گیا ہے۔",
      },
      {
        id: "5",
        class: "five",
        text: 'براہ کرم نوٹ کریں کہ اگر آپ کسی سوال کا جواب نہیں دیتے ہیں تو اسے "جواب نہیں دیا" کے طور پر نشان زد کیا جائے گا۔',
      },
    ],
    additional: [
      "3. غلط جوابات کے لیے کوئی کٹوتی نہیں ہے۔ آپ کی کامیابی کے امکانات کو بڑھانے کے لیے، آپ کو تمام سوالات پر کوشش کرنے کی تجویز دی جاتی ہے۔",
      "4. سوال کا جواب دینے کے لیے، براہ کرم نیچے دیے گئے فارمیٹ کا استعمال کریں:",
    ],
    format: [
      "1. اپنی اسکرین پر سوالات کی نیویگیشن کا استعمال کرتے ہوئے صحیح نمبر کے سوال پر جائیں۔",
      "'2. اپنی اسکرین پر سوالات کی نیویگیشن کا استعمال کرتے ہوئے صحیح نمبر کے سوال پر جائیں۔'",
      '3. اپنے جوابات کو محفوظ کرنے کے لیے، آپ دوبارہ دیکھنے کے لیے نشان زد کردہ سوالات کو نشان زد کرنے کے لیے "محفوظ کریں اور اگلا" پر کلک کریں۔',
    ],
    conclusion: [
      "5. ایم سی کیو کا سامنا کرتے وقت، ہر آپشن کا توجہ سے تجزیہ کریں، مکمل جواب دینے کے لیے منتخب کریں۔",
      "امتحان کے دوران ان ہدایات کی پیروی کریں، ایک آسان اور کامیاب امتحانی تجربے کو یقینی بنائیں۔ سب کو نیک خواہشات!",
    ],
    termAndCondition: "میں نے ہدایات پڑھ لی ہیں، سمجھ لیا ہے",
    chooseLanguage: "دوسری زبان منتخب کریں",
    startExamBtn: "امتحان شروع کریں",
    additionalIntructions: "براہ کرم مزید ہدایات پڑھیں",
  },
  ladakhi: {
    title:
      "ཁྱེད་རང་གིས་འདི་ལ་བརྗེ་བ་འབྱོར་གྱི་སྐབས་ཁྱེད་རང་གིས་འདི་ལ་བརྗེ་བ་འབྱོར་",
    heading: "གཞི་འབྱོར་གྱི་སྐབས་ :",
    sections: [
      "1. དངོས་གནས་བརྗེ་བ་འབྱོར་གྱི་སྐབས་ཁྱེད་རང་གིས་འདི་ལ་བརྗེ་བ་འབྱོར་",
      "2. དངོས་གནས་བརྗེ་བ་འབྱོར་གྱི་སྐབས་",
    ],
    statuses: [
      {
        id: "1",
        class: "one",
        text: "ཁྱེད་རང་གིས་འདི་ལ་བརྗེ་བ་འབྱོར་",
      },
      {
        id: "2",
        class: "two",
        text: "ཁྱེད་རང་གིས་འདི་ལ་བརྗེ་བ་འབྱོར་",
      },
      {
        id: "3",
        class: "three",
        text: "སྐྱོ་མ་",
      },
      {
        id: "4",
        class: "four",
        text: "སྐྱོ་མ་",
      },
      {
        id: "5",
        class: "five",
        text: "སྐྱོ་མ་",
      },
    ],
    additional: [
      "3. དངོས་གནས་བརྗེ་བ་འབྱོར་གྱི་སྐབས་",
      "4. དངོས་གནས་བརྗེ་བ་འབྱོར་གྱི་སྐབས་",
    ],
    format: [
      "1. དངོས་གནས་བརྗེ་བ་འབྱོར་གྱི་སྐབས་",
      "'2. དངོས་གནས་བརྗེ་བ་འབྱོར་གྱི་སྐབས་'",
      "3. དངོས་གནས་བརྗེ་བ་འབྱོར་གྱི་སྐབས་",
    ],
    conclusion: ["5. དངོས་གནས་བརྗེ་བ་འབྱོར་གྱི་སྐབས་", "སྐྱོ་མ་"],
    termAndCondition: "ཁྱེད་རང་གིས་འདི་ལ་བརྗེ་བ་འབྱོར་",
    chooseLanguage: "གཞི་འབྱོར་གྱི་སྐབས་",
    startExamBtn: "སྐྱོ་མ་",
    additionalIntructions: "ཁྱེད་རང་གིས་འདི་ལ་བརྗེ་བ་འབྱོར་",
  },
};

export const availableLanguages = [
  "Hindi",
  "Bengali",
  "Marathi",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Urdu",
  "Kannada",
  "Odia",
  "Malayalam",
  "Punjabi",
  "Assamese",
  "Maithili",
  "English",
];

export const getDynamicStyle = (layoutColor) => {
  return {
    ...(layoutColor.bgColor !== "#FFFFFF" && {
      backgroundColor: layoutColor.bgColor,
    }),
    ...(layoutColor.textColor !== "#000000" && {
      color: layoutColor.textColor,
    }),
  };
};

export const getTextColorStyle = (layoutColor) => {
  return {
    ...(layoutColor?.bgColor !== "#FFFFFF" && {
      color: layoutColor.bgColor,
    }),
  };
};

export const getTextColorValue = (layoutColor) =>
  layoutColor?.textColor !== "#000000" ? layoutColor.textColor : undefined;

export const renderWithTooltip = (value, maxWidth = "100px") => {
  const MAX_LENGTH_FOR_TOOLTIP = 10;

  if (!value || (Array.isArray(value) && value.length === 0)) return "-";

  let displayText = value;
  let tooltipText = value;

  if (Array.isArray(value)) {
    displayText = value.join(", ");
    tooltipText = value.map((v, i) => `${i + 1}. ${v}`).join("\n");
  }

  const shouldShowTooltip = displayText.length > MAX_LENGTH_FOR_TOOLTIP;

  const text = (
    <div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: shouldShowTooltip ? "pointer" : "default",
        maxWidth,
      }}
    >
      {shouldShowTooltip
        ? displayText.slice(0, MAX_LENGTH_FOR_TOOLTIP) + "..."
        : displayText}
    </div>
  );

  return shouldShowTooltip ? (
    <Tooltip
      title={
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: 300,
            margin: 0,
          }}
        >
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{tooltipText}</pre>
        </div>
      }
      arrow
    >
      {text}
    </Tooltip>
  ) : (
    text
  );
};

export const getNameAvatar = (firstName = "", lastName = "") => {
  const f = firstName?.trim();
  const l = lastName?.trim();

  if (!f && !l) return null;

  const avatarLetter = `${f ? f[0]?.toUpperCase() : ""}${
    l ? l[0]?.toUpperCase() : ""
  }`;

  return avatarLetter;
};

export const shouldAppendDateParams = (range) => {
  if (!range || !range[0]?.startDate || !range[0]?.endDate) return false;

  const start = moment(range[0].startDate).startOf("day");
  const end = moment(range[0].endDate).startOf("day");
  const today = moment().startOf("day");

  // Return false ONLY when both dates are today
  const bothAreToday = start.isSame(today, "day") && end.isSame(today, "day");

  return !bothAreToday;
};
