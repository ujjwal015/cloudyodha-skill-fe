import {
  SUB_ADMIN,
  SUPER_ADMIN,
  WEBSITE_RELOGIN,
} from "./routePathConstants/auth";

export const DEFAULT_TOKEN = "token";
export const USER_DATA = "userData";
export const USER_DETAILS = "user_detils";
export const CANDIDATE_TOKEN = "candidate_token";

//roles
export const SUPER_ADMIN_ROLE = "super-admin";

//role navigation
export const ROLE_NAV = {
  ADMIN: SUPER_ADMIN,
  SUBADMIN: SUB_ADMIN,
};

export const PREVENT_ROUTES = [WEBSITE_RELOGIN];

export const NETWORK_ERROR = "Network Error";

export const USER_TYPE = [
  { id: 1, name: "superadmin", label: "Super Admin" },
  { id: 2, name: "admin", label: "Admin" },
  { id: 3, name: "client", label: "Client" },
  { id: 4, name: "employee", label: "Employee" },
  { id: 5, name: "student", label: "Student" },
  { id: 6, name: "govtEmployee", label: "Govt Employee" },
  { id: 7, name: "Sub Admin", label: "Sub Admin" },
  { id: 8, name: "Examiner", label: "Examiner" },
  { id: 9, name: "Employer", label: "Employer" },
];

//user type menus
export const USER_TYPE_MENUS = [
  // { label: "Admin", value: 2 },
  { label: "Employee", value: 4 },
  { label: "Student", value: 5 },
  // { label: "Govt Employee", value: 6 },
];

//user type menus
export const SUB_ADMIN_USER_TYPE_MENUS = [
  { label: "Sub Admin", value: 7 },
  { label: "Examiner", value: 8 },
  { label: "Employer", value: 9 },
  { label: "Admin", value: 2 },
];
//organisation type menus
export const SUB_ADMIN_ORGANISATION_TYPE_MENUS = [
  { label: "Private", value: "Private" },
  { label: "Government", value: "Government" },
  { label: "Others", value: "Others" },
];

//gender
export const GENDER_MENUS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Transgender", value: "transgender" },
  { label: "Not Specify", value: "notSpecify" },
];

export const SECTORWISE_DROPDOWN = [
  { label: "Weekly", value: "weekly" },
  { label: "Montly", value: "monthly" },
];

// Steps student basic details
export const STEPS = [
  "Registration Details",
  "Capture Face",
  "Capture ID Card",
  "Basic Details",
];

//status
export const STATUS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

// Lead management filter
export const MOBILE_VERIFIED = [
  { label: "Verified", value: true },
  { label: "Non-Verified", value: "false" },
];

// Lead management filter
export const GET_DEMO_USER_TYPE_MENUS = [
  { label: "Company's Director", value: "company's director" },
  { label: "Manager", value: "manager" },
  { label: "Individual", value: "individual" },
  { label: "Others", value: "others" },
];

// Lead management filter
export const VERIFIED = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

// role type
export const ROLE_TYPE = [
  { label: "Admin", value: "Admin" },
  { label: "Subadmin", value: "Subadmin" },
  { label: "Others", value: "Others" },
];

// department list
export const DEPARTMENT_LIST = [
  { label: "Operation", value: "Operations" },
  { label: "Business Development", value: "Business Development" },
  { label: "Human Resource", value: "Human Resource" },
  { label: "Training and Quality Audit", value: "Training and Quality Audit" },
];

// role type
export const POC_DESIGNATION = [
  { label: "Admin", value: "Admin" },
  { label: "Subadmin", value: "Subadmin" },
  { label: "Others", value: "Others" },
];

const dropDownOptions = [
  { value: "Today", label: "Today" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
];

// Question Types
export const QUESTION_TYPES = [
  {
    label: "Objective",
    value: "objective",
  },
  {
    label: "Oral Questioning (viva)",
    value: "oral questioning",
  },
  {
    label: "Demonstrating (Practical)",
    value: "demonstrating",
  },
];
export const QUESTION_TYPES2 = [
  {
    label: "Oral Questioning (viva)",
    value: "oral questioning",
  },
  {
    label: "Demonstrating (Practical)",
    value: "demonstrating",
  },
];
export const QUESTIONTYPES = [
  {
    label: "Objective",
    value: "objective",
  },
  {
    label: "Viva",
    value: "viva",
  },
  {
    label: "Practicle",
    value: "practicle",
  },
];
//country
export const COUNTRY = [{ label: "India", value: "India" }];

// Sector
export const SECTOR = [
  { label: "Sector-1", value: "sector-1" },
  { label: "Sector-2", value: "sector-2" },
];

// Section
export const SECTIONS = [
  { label: "Theory", value: "theory" },
  { label: "Viva", value: "viva" },
  { label: "Practical", value: "practical" },
];

// Languages
export const LANGUAGES = [
  { label: "Hindi", value: 1 },
  { label: "English", value: 2 },
];

// instruction language
export const INSTRUCTION_LANGUAGES = [
  { label: "Hindi", value: "hindi" },
  { label: "English", value: "english" },
  { label: "Both", value: "both" },
];

// Question IDs
export const QUES_ID = [
  { label: "QST459", value: "QST459" },
  { label: "QST675", value: "QST675" },
];

export const STATES = [
  {
    label: "Andaman and Nicobar Islands",
    value: "Andaman and Nicobar Islands",
  },
  {
    label: "Andhra Pradesh",
    value: "Andhra Pradesh",
  },
  {
    label: "Arunachal Pradesh",
    value: "Arunachal Pradesh",
  },
  {
    label: "Assam",
    value: "Assam",
  },
  {
    label: "Bihar",
    value: "Bihar",
  },
  {
    label: "Chandigarh",
    value: "Chandigarh",
  },
  {
    label: "Chhattisgarh",
    value: "Chhattisgarh",
  },
  {
    label: "Dadra and Nagar Haveli and Daman and Diu",
    value: "Dadra and Nagar Haveli and Daman and Diu",
  },
  {
    label: "Delhi",
    value: "Delhi",
  },
  {
    label: "Goa",
    value: "Goa",
  },
  {
    label: "Gujarat",
    value: "Gujarat",
  },
  {
    label: "Haryana",
    value: "Haryana",
  },
  {
    label: "Himachal Pradesh",
    value: "Himachal Pradesh",
  },
  {
    label: "Jammu and Kashmir",
    value: "Jammu and Kashmir",
  },
  {
    label: "Jharkhand",
    value: "Jharkhand",
  },
  {
    label: "Karnataka",
    value: "Karnataka",
  },
  {
    label: "Kerala",
    value: "Kerala",
  },
  {
    label: "Ladakh",
    value: "Ladakh",
  },
  {
    label: "Lakshadweep",
    value: "Lakshadweep",
  },
  {
    label: "Madhya Pradesh",
    value: "Madhya Pradesh",
  },
  {
    label: "Maharashtra",
    value: "Maharashtra",
  },
  {
    label: "Manipur",
    value: "Manipur",
  },
  {
    label: "Meghalaya",
    value: "Meghalaya",
  },
  {
    label: "Mizoram",
    value: "Mizoram",
  },
  {
    label: "Nagaland",
    value: "Nagaland",
  },
  {
    label: "Odisha",
    value: "Odisha",
  },
  {
    label: "Puducherry",
    value: "Puducherry",
  },
  {
    label: "Punjab",
    value: "Punjab",
  },
  {
    label: "Rajasthan",
    value: "Rajasthan",
  },
  {
    label: "Sikkim",
    value: "Sikkim",
  },
  {
    label: "Tamil Nadu",
    value: "Tamil Nadu",
  },
  {
    label: "Telangana",
    value: "Telangana",
  },
  {
    label: "Tripura",
    value: "Tripura",
  },
  {
    label: "Uttar Pradesh",
    value: "Uttar Pradesh",
  },
  {
    label: "Uttarakhand",
    value: "Uttarakhand",
  },
  {
    label: "West Bengal",
    value: "West Bengal",
  },
];

export const BATCH_FOR = [
  {
    label: "Regular Assessment",
    value: "Regular Assessment",
  },
  {
    label: "Registration Assessment",
    value: "Registration Assessment",
  },
  {
    label: "Free Assessment",
    value: "Free Assessment",
  },
  {
    label: "NAPS Assessment",
    value: "NAPS Assessment",
  },
];

export const LANGUAGE = [
  { label: "Hindi", value: "hindi" },
  { label: "English", value: "english" },
];

export const ASSESSMENT = [
  {
    label: "Assessment",
    value: "Assessment",
  },
];

export const QUESTIONTYPE = [
  {
    label: "MCQ",
    value: "MCQ",
  },
  {
    label: "Objective",
    value: "Objective",
  },
  {
    label: "Psychometric",
    value: "Psychometric",
  },
];

// Exam management

export const DISTRICT = [
  { label: "Agra", value: "Agra" },
  { label: "Aligarh", value: "Aligarh" },
];
export const EXPERIENCE = [
  { label: "0-1 Yrs", value: "0-1 yrs" },
  { label: "1-2 Yrs", value: "1-2 yrs" },
  { label: "2-3 Yrs", value: "2-3 yrs" },
  { label: "3-5 Yrs", value: "3-5 yrs" },
  { label: "5-10 Yrs", value: "5-10 yrs" },
  { label: "10+ Yrs", value: "10+ yrs" },
];

export const SECTORS = [
  {
    label: "Retailer Association Skill Council of India",
    value: "Retailer Association Skill Council of India",
  },
  {
    label: "Agriculture Skill Council of India",
    value: "Agriculture Skill Council of India",
  },
  {
    label: "Furniture & Fittings Skill Council of India",
    value: "Furniture & Fittings Skill Council of India",
  },
  {
    label: "Construction Skill  Development Council of India",
    value: "Construction Skill  Development Council of India",
  },
];

export const SSC_CERTIFIED = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

// Education
export const EDUCATION = [
  {
    label: "10th",
    value: "10th",
  },
  {
    label: "12th",
    value: "12th",
  },
  {
    label: "Graduate",
    value: "Graduate",
  },
  {
    label: "Post Graduate",
    value: "Post Graduate",
  },
];

// Bank
export const BANKS = [
  { label: "AB Bank Ltd.", value: "AB Bank Ltd." },
  {
    label: "Abu Dhabi Commercial Bank Ltd.",
    value: "Abu Dhabi Commercial Bank Ltd.",
  },
  {
    label: "Airtel Payments Bank Limited",
    value: "Airtel Payments Bank Limited",
  },
  {
    label: "American Express Banking Corporation",
    value: "American Express Banking Corporation",
  },
  {
    label: "Andhra Pradesh Grameena Vikas Bank",
    value: "Andhra Pradesh Grameena Vikas Bank",
  },
  {
    label: "Andhra Pragathi Grameena Bank",
    value: "Andhra Pragathi Grameena Bank",
  },
  {
    label: "Arunachal Pradesh Rural Bank",
    value: "Arunachal Pradesh Rural Bank",
  },
  { label: "Aryavart Bank", value: "Aryavart Bank" },
  { label: "Assam Gramin Vikash Bank", value: "Assam Gramin Vikash Bank" },
  {
    label: "Au Small Finance Bank Limited",
    value: "Au Small Finance Bank Limited",
  },
  {
    label: "Australia and New Zealand Banking Group Ltd.",
    value: "Australia and New Zealand Banking Group Ltd.",
  },
  { label: "Axis Bank Ltd.", value: "Axis Bank Ltd." },
  { label: "Bandhan Bank Ltd.", value: "Bandhan Bank Ltd." },
  { label: "Bangiya Gramin Vikas Bank", value: "Bangiya Gramin Vikas Bank" },
  { label: "Bank of America", value: "Bank of America" },
  {
    label: "Bank of Bahrain & Kuwait BSC",
    value: "Bank of Bahrain & Kuwait BSC",
  },
  { label: "Bank of Baroda", value: "Bank of Baroda" },
  { label: "Bank of Ceylon", value: "Bank of Ceylon" },
  { label: "Bank of China", value: "Bank of China" },
  { label: "Bank of India", value: "Bank of India" },
  { label: "Bank of Maharashtra", value: "Bank of Maharashtra" },
  { label: "Bank of Nova Scotia", value: "Bank of Nova Scotia" },
  { label: "Barclays Bank Plc.", value: "Barclays Bank Plc." },
  { label: "Baroda Gujarat Gramin Bank", value: "Baroda Gujarat Gramin Bank" },
  {
    label: "Baroda Rajasthan Kshetriya Gramin Bank",
    value: "Baroda Rajasthan Kshetriya Gramin Bank",
  },
  { label: "Baroda UP Bank", value: "Baroda UP Bank" },
  { label: "BNP Paribas", value: "BNP Paribas" },
  { label: "Canara Bank", value: "Canara Bank" },
  {
    label: "Capital Small Finance Bank Limited",
    value: "Capital Small Finance Bank Limited",
  },
  {
    value: "Central Bank of India",
    label: "Central Bank of India",
  },
  {
    label: "Chaitanya Godavari Grameena Bank",
    value: "Chaitanya Godavari Grameena Bank",
  },
  {
    label: "Chhattisgarh Rajya Gramin Bank",
    value: "Chhattisgarh Rajya Gramin Bank",
  },
  { label: "Citibank N.A.", value: "Citibank N.A." },
  { label: "City Union Bank Ltd.", value: "City Union Bank Ltd." },
  { label: "Cooperatieve Rabobank U.A.", value: "Cooperatieve Rabobank U.A." },
  {
    label: "Credit Agricole Corporate & Investment Bank",
    value: "Credit Agricole Corporate & Investment Bank",
  },
  { label: "Credit Suisse A.G", value: "Credit Suisse A.G" },
  { label: "CSB Bank Ltd.", value: "CSB Bank Ltd." },
  { label: "CTBC Bank Co., Ltd.", value: "CTBC Bank Co., Ltd." },
  { label: "Dakshin Bihar Gramin Bank", value: "Dakshin Bihar Gramin Bank" },
  { label: "DBS Bank India Limited*", value: "DBS Bank India Limited*" },
  { label: "DCB Bank Ltd.", value: "DCB Bank Ltd." },
  { label: "Deutsche Bank", value: "Deutsche Bank" },
  { label: "Dhanlaxmi Bank Ltd.", value: "Dhanlaxmi Bank Ltd." },
  { label: "Doha Bank Q.P.S.C", value: "Doha Bank Q.P.S.C" },
  { label: "Ellaquai Dehati Bank", value: "Ellaquai Dehati Bank" },
  { label: "Emirates Bank NBD", value: "Emirates Bank NBD" },
  {
    label: "Equitas Small Finance Bank Limited",
    value: "Equitas Small Finance Bank Limited",
  },
  {
    label: "ESAF Small Finance Bank Limited",
    value: "ESAF Small Finance Bank Limited",
  },
  { label: "Federal Bank Ltd.", value: "Federal Bank Ltd." },
  {
    label: "Fincare Small Finance Bank Limited",
    value: "Fincare Small Finance Bank Limited",
  },
  { label: "Fino Payments Bank Limited", value: "Fino Payments Bank Limited" },
  { label: "First Abu Dhabi Bank PJSC", value: "First Abu Dhabi Bank PJSC" },
  { label: "FirstRand Bank Ltd", value: "FirstRand Bank Ltd" },
  { label: "HDFC Bank Ltd", value: "HDFC Bank Ltd" },
  {
    label: "Himachal Pradesh Gramin Bank",
    value: "Himachal Pradesh Gramin Bank",
  },
  { label: "HSBC Ltd", value: "HSBC Ltd" },
  { label: "ICICI Bank Ltd.", value: "ICICI Bank Ltd." },
  { label: "IDBI Bank Ltd.", value: "IDBI Bank Ltd." },
  { label: "IDFC First Bank Ltd.", value: "IDFC First Bank Ltd." },
  {
    label: "India Post Payments Bank Limited",
    value: "India Post Payments Bank Limited",
  },
  { label: "Indian Bank", value: "Indian Bank" },
  { label: "Indian Overseas Bank", value: "Indian Overseas Bank" },
  { label: "Induslnd Bank Ltd", value: "Induslnd Bank Ltd" },
  {
    label: "Industrial & Commercial Bank of China Ltd.",
    value: "Industrial & Commercial Bank of China Ltd.",
  },
  { label: "Industrial Bank of Korea", value: "Industrial Bank of Korea" },
  { label: "J&K Grameen Bank", value: "J&K Grameen Bank" },
  {
    label: "J.P. Morgan Chase Bank N.A.",
    value: "J.P. Morgan Chase Bank N.A.",
  },
  { label: "Jammu & Kashmir Bank Ltd.", value: "Jammu & Kashmir Bank Ltd." },
  {
    label: "Jana Small Finance Bank Limited",
    value: "Jana Small Finance Bank Limited",
  },
  {
    label: "Jharkhand Rajya Gramin Bank",
    value: "Jharkhand Rajya Gramin Bank",
  },
  { label: "JSC VTB Bank", value: "JSC VTB Bank" },
  { label: "Karnataka Bank Ltd.", value: "Karnataka Bank Ltd." },
  { label: "Karnataka Gramin Bank", value: "Karnataka Gramin Bank" },
  {
    label: "Karnataka Vikas Grameena Bank",
    value: "Karnataka Vikas Grameena Bank",
  },
  { label: "Karur Vysya Bank Ltd.", value: "Karur Vysya Bank Ltd." },
  { label: "KEB Hana Bank", value: "KEB Hana Bank" },
  { label: "Kerala Gramin Bank", value: "Kerala Gramin Bank" },
  { label: "Kookmin Bank", value: "Kookmin Bank" },
  { label: "Kotak Mahindra Bank Ltd", value: "Kotak Mahindra Bank Ltd" },
  {
    label: "Krung Thai Bank Public Co. Ltd.",
    value: "Krung Thai Bank Public Co. Ltd.",
  },
  { label: "Madhya Pradesh Gramin Bank", value: "Madhya Pradesh Gramin Bank" },
  { label: "Madhyanchal Gramin Bank", value: "Madhyanchal Gramin Bank" },
  { label: "Maharashtra Gramin Bank", value: "Maharashtra Gramin Bank" },
  { label: "Manipur Rural Bank", value: "Manipur Rural Bank" },
  { label: "Mashreq Bank PSC", value: "Mashreq Bank PSC" },
  { label: "Meghalaya Rural Bank", value: "Meghalaya Rural Bank" },
  { label: "Mizoram Rural Bank", value: "Mizoram Rural Bank" },
  { label: "Mizuho Bank Ltd.", value: "Mizuho Bank Ltd." },
  { label: "MUFG Bank, Ltd.", value: "MUFG Bank, Ltd." },
  { label: "Nagaland Rural Bank", value: "Nagaland Rural Bank" },
  { label: "Nainital Bank Ltd.", value: "Nainital Bank Ltd." },
  { label: "NatWest Markets Plc", value: "NatWest Markets Plc" },
  {
    label: "North East Small Finance Bank Limited",
    value: "North East Small Finance Bank Limited",
  },
  { label: "Odisha Gramya Bank", value: "Odisha Gramya Bank" },
  { label: "Paschim Banga Gramin Bank", value: "Paschim Banga Gramin Bank" },
  {
    label: "Paytm Payments Bank Limited",
    value: "Paytm Payments Bank Limited",
  },
  { label: "Prathama UP Gramin Bank", value: "Prathama UP Gramin Bank" },
  {
    label: "PT Bank Maybank Indonesia TBK",
    value: "PT Bank Maybank Indonesia TBK",
  },
  {
    label: "Puduvai Bharathiar Grama Bank",
    value: "Puduvai Bharathiar Grama Bank",
  },
  { label: "Punjab & Sind Bank", value: "Punjab & Sind Bank" },
  { label: "Punjab Gramin Bank", value: "Punjab Gramin Bank" },
  { label: "Punjab National Bank", value: "Punjab National Bank" },
  {
    label: "Qatar National Bank (Q.P.S.C.)",
    value: "Qatar National Bank (Q.P.S.C.)",
  },
  {
    label: "Rajasthan Marudhara Gramin Bank",
    value: "Rajasthan Marudhara Gramin Bank",
  },
  { label: "RBL Bank Ltd.", value: "RBL Bank Ltd." },
  { label: "Saptagiri Grameena Bank", value: "Saptagiri Grameena Bank" },
  { label: "Sarva Haryana Gramin Bank", value: "Sarva Haryana Gramin Bank" },
  { label: "Saurashtra Gramin Bank", value: "Saurashtra Gramin Bank" },
  { label: "Sberbank", value: "Sberbank" },
  { label: "SBM Bank (India) Limited*", value: "SBM Bank (India) Limited*" },
  { label: "Shinhan Bank", value: "Shinhan Bank" },
  {
    label: "Shivalik Small Finance Bank Limited",
    value: "Shivalik Small Finance Bank Limited",
  },
  { label: "Societe Generale", value: "Societe Generale" },
  { label: "Sonali Bank Ltd.", value: "Sonali Bank Ltd." },
  { label: "South Indian Bank Ltd.", value: "South Indian Bank Ltd." },
  { label: "Standard Chartered Bank", value: "Standard Chartered Bank" },
  { label: "State Bank of India", value: "State Bank of India" },
  {
    label: "Sumitomo Mitsui Banking Corporation",
    value: "Sumitomo Mitsui Banking Corporation",
  },
  {
    label: "Suryoday Small Finance Bank Limited",
    value: "Suryoday Small Finance Bank Limited",
  },
  { label: "Tamil Nadu Grama Bank", value: "Tamil Nadu Grama Bank" },
  {
    label: "Tamilnad Mercantile Bank Ltd.",
    value: "Tamilnad Mercantile Bank Ltd.",
  },
  { label: "Telangana Grameena Bank", value: "Telangana Grameena Bank" },
  { label: "Tripura Gramin Bank", value: "Tripura Gramin Bank" },
  { label: "UCO Bank", value: "UCO Bank" },
  {
    label: "Ujjivan Small Finance Bank Limited",
    value: "Ujjivan Small Finance Bank Limited",
  },
  { label: "Union Bank of India", value: "Union Bank of India" },
  { label: "United Overseas Bank Ltd", value: "United Overseas Bank Ltd" },
  {
    label: "Unity Small Finance Bank Limited",
    value: "Unity Small Finance Bank Limited",
  },
  { label: "Utkal Grameen bank", value: "Utkal Grameen bank" },
  {
    label: "Utkarsh Small Finance Bank Limited",
    value: "Utkarsh Small Finance Bank Limited",
  },
  { label: "Uttar Bihar Gramin Bank", value: "Uttar Bihar Gramin Bank" },
  { label: "Uttarakhand Gramin Bank", value: "Uttarakhand Gramin Bank" },
  {
    label: "Uttarbanga Kshetriya Gramin Bank",
    value: "Uttarbanga Kshetriya Gramin Bank",
  },
  {
    label: "Vidharbha Konkan Gramin Bank",
    value: "Vidharbha Konkan Gramin Bank",
  },
  {
    label: "YES Bank Ltd.",
    value: "YES Bank Ltd.",
  },
];

// Confirmation
export const CONFIRMATION = [
  {
    label: "Yes",
    value: "Yes",
  },
  {
    label: "No",
    value: "No",
  },
];
// scheme type
export const SCHEME_NAME = [
  {
    label: "PMVishwakarma",
    value: "PMVishwakarma",
  },
  {
    label: "Both",
    value: "Both",
  },
  {
    label: "General",
    value: "General",
  },
];

//TOA TYPE

export const TOA_TYPE = [
  {
    label: "Radiant",
    value: "Radiant",
  },
  {
    label: "Self",
    value: "Self",
  },
  {
    label: "None",
    value: "None",
  },
];

// Mode of Agreement
export const MODE_OF_AGREEMENT_OPTIONS = [
  {
    label: "Payroll",
    value: "payroll",
  },
  {
    label: "Freelance",
    value: "freelance",
  },
];

export const assessorTypeOption = [
  {
    label: "Assessor",
    value: "Assessor",
  },
  {
    label: "Master Assessor",
    value: "Master Assessor",
  },
];

// Sections 2
export const SECTIONS2 = [
  {
    label: "Theory",
    value: "Theory",
  },
  { label: "Practical", value: "practical" },
  { label: "Viva", value: "viva" },
];
export const SECTIONS_NOS_CREATION = [
  {
    label: "Theory",
    value: "Theory",
  },
  { label: "Viva-Practical", value: "practical" },
  // { label: "Viva", value: "viva" },
];

// Dummy Options
export const DUMMYOPTIONS = [
  {
    label: "",
    value: "",
  },
];
// Training partner
export const TRAININGPARTNER = [
  {
    label: "abc testers 65",
    value: "abc testers 65",
  },
  {
    label: "abc testers 66",
    value: "abc testers 66",
  },
];

export const ASSESEMENT_LEVEL = [
  {
    label: "Easy",
    value: "Easy",
  },
  {
    label: "Medium",
    value: "Medium",
  },
  {
    label: "Difficult",
    value: "Difficult",
  },
];

// FEATURE AND SUB FEATURE NAME FOR ROLE BASED PERMISSIONS
export const ROLESPERMISSIONS = {
  // DashBoard
  // DASHBOARD_FEATURE: "DAMA",
  DASHBOARD_FEATURE: "DA",
  // DASHBOARD_SUB_FEATURE_1: "BUDEDA",
  DASHBOARD_SUB_FEATURE_1: "ASDA",
  DASHBOARD_SUB_FEATURE_2: "COMADA",
  DASHBOARD_SUB_FEATURE_3: "HUREDA",
  DASHBOARD_SUB_FEATURE_4: "OPDA",
  DASHBOARD_SUB_FEATURE_5: "QUANDA",
  DASHBOARD_SUB_FEATURE_6: "MISDA",
  DASHBOARD_SUB_FEATURE_7: "FINDA",
  DASHBOARD_SUB_FEATURE_8: "WI1",
  DASHBOARD_SUB_FEATURE_9: "WI2",
  DASHBOARD_SUB_FEATURE_10: "NCDA",
  //Client Management
  CLIENT_MANAGEMENT_FEATURE: "CLMA",
  CLIENT_MANAGEMENT_LIST_FEATURE: "CLLI",
  // Job Role Management
  JOB_ROLE_MANAGEMENT_FEATURE: "JOROMA",
  JOB_ROLE_MANAGEMENT_LIST_FEATURE: "JOROLI",
  //Question Bank Management
  QUESTION_BANK_FEATURE: "QUBAMA",
  QUESTION_BANK_SUB_FEATURE_1: "QUBALI",
  QUESTION_BANK_SUB_FEATURE_2: "NOLI",
  //Assessment Management
  ASSESSMENT_FEATURE: "ASMA",
  ASSESSMENT_LIST_FEATURE: "ASLI",
  //Exam Management
  EXAM_MANAGEMENT_FEATURE: "EXMA",
  EXAM_MANAGEMENT_SUB_FEATURE_1: "EXCE",
  EXAM_MANAGEMENT_SUB_FEATURE_2: "BA",
  // EXAM_MANAGEMENT_SUB_FEATURE_3: "ASBA",
  EXAM_MANAGEMENT_SUB_FEATURE_3: "ASCALI",
  EXAM_MANAGEMENT_SUB_FEATURE_4: "PRASLI",
  //  this permission is duplicate with assessor List feature
  //All Batches
  ALL_BATCHES_FEATURE: "EXMA",
  ALL_BATCHES_SUB_FEATURE_1: "BARELI",
  ALL_BATCHES_SUB_FEATURE_2: "BASTLI",
  //User Management
  USER_MANAGEMENT_FEATURE: "USMA",
  USER_MANAGEMENT_SUB_FEATURE_1: "USLO",
  USER_MANAGEMENT_SUB_FEATURE_2: "RO&PE",
  USER_MANAGEMENT_SUB_FEATURE_3: "DAMA",
  //Lead management
  LEAD_MANAGEMENT_FEATURE: "LEMA",
  LEAD_MANAGEMENT_LIST_FEATURE: "LELI",
  // scheme management
  SCHEME_MANAGEMENT_FEATURE: "SCMA",
  SCHEME_MANAGEMENT_LIST_FEATURE_1: "SCLI",
  SCHEME_MANAGEMENT_LIST_FEATURE_2: "SUSCLI",

  //assessor attendance management
  ASSESSOR_ATTENDANCE_FEATURE: "ATTA",
  ASSESSOR_ATTENDANCE_LIST_FEATURE_1: "ATLI",
  ASSESSOR_ATTENDANCE_LIST_FEATURE_2: "ATLI",

  // Instructions
  INSTRUCTIONS_FEATURE: "INMA",
  INSTRUCTIONS_LIST_FEATURE: "INLI",
  //Assessor management
  ASSESSOR_MANAGEMENT_FEATURE: "AS",
  ASSESSOR_MANAGEMENT_LIST_FEATURE: "ASLI",
  //verification management
  VERIFICATION_FEATURE: "VETA",
  VERIFICATION_LIST_FEATURE: "LELI",
  // regenerate result
  REGENERATE_RESULT_FEATURE: "ADCO",
  REGENERATE_RESULT_LIST_FEATURE: "FICO",

  //Results
  RESULTS_FEATURE: "RE",
  RESULTS_SUB_FEATURE_1: "ONRE",
  RESULTS_SUB_FEATURE_2: "OFRE",
  //Proctor management
  PROCTOR_FEATURE: "PRMA",
  PROCTOR_LIST_FEATURE: "PRLI",
  // log management
  LOG_MANAGEMENT_FEATURE: "LOMA",
  LOG_MANAGEMENT_LIST_FEATURE_1: "PRLO",
  LOG_MANAGEMENT_LIST_FEATURE_2: "ACLO",

  //Dashboard Manage

  DASHBOARD_MANAGE_FEATURE: "DAMAFE",

  // Skill Assesment
  SKILL_ASSESSMENT: "SKAS",
  SKILL_ASSESSMENT_BATCH: "BA",
  SKILL_ASSESSMENT_ALL_CANDIDATES: "ALCA",
  SKILL_ASSESSMENT_ASSESSORS: "AS",
  SKILL_ASSESSMENT_RESULT: "RE",
};

export const ASSESSOR_MODES = [
  {
    label: "Online",
    value: "online",
  },
  {
    label: "Offline",
    value: "offline",
  },
];

export const dashboardConstants = {
  TimeSpentBD: "Time Spent Business",
  ClientOverviewBD: "Client overview Business",
  ClientByLocationBD: "Client by location Business",
  MasterAssessorsByLocation: "State-Wise Master Assessor Operations",
  ExamCenter: "Exam Centre Operations",
  SectorWiseOverviewBD: "Sector-wise overview Business",
  LeadAnalyticsBD: "Leads Analytics Business",
  LeadByCategoryBD: "Leads by category Business",
  ScheduleCalenderBD: "Schedule calendar Business",

  TimeSpentCD: "Time spent Content",
  DailyWorkProgressCD: "Daily work progress Content",
  QuestionAnalyticsCD: "Question analytics Content",
  LanguageDistributionCD: "Language Distribution Content",
  UpcomingBatchCD: "Upcoming batches Content",
  AssessorByLocationOD: "Assessor by location Operations",
  AssessmentAnalyticsOD: "Assessment Analytics Operations",
  UpcomingBatchCalenderOD: "Upcoming batches Operations",
  ClientWiseAssessmentOD: "Client wise assessment Operations",
  SchemeAnalysisOD: "Scheme Analysis Operations",
  AssessmentHistoryOD: "Assessment history Operations",

  TimeSpentMIS: "Time Spent MIS",
  ResultAnalysisMIS: "Result analytics MIS",
  ApplicantAnalysisMIS: "Applicant Analytics MIS",
  BatchResultStatusMIS: "Batch Result Status MIS",
  ClientWiseAssessmentMIS: "Client wise assessment MIS",
  SchemeAnalysisMIS: "Scheme Analysis MIS",
  UpcomingBatchMIS: "Upcoming batches MIS",

  TimeSpentQA: "Time Spent QA",
  AssessmentAnalysisQA: "Assessment Analysis QA",
  AssessmentAnalysisHR: "Assessment Analysis HR",
  BatchVerificationStatsQA: "Batch Verification Stats QA",
  ActivityQA: "Activity QA",
  BatchStaticsQA: "Batch Statistics QA",

  TimeSpentHR: "Time Spent HR",
  EmploymentTypeHR: "Employment Type HR",
  AssessorByLocationHR: "Assessor by location HR",

  TeamMemberBusiness: "Team Member Business",
  ClientListBusiness: "Client list Business",

  JobroleOccuranceContent: "Jobrole occurrence Content",
  TeamMemberContent: "Team Member Content",
  ClientBasedJobroleContent: "Client based jobrole Content",
  AllActivitiesContent: "All Activities Content",

  LiveBatchStatsOperation: "Live batch stats Operations",
  ClientBasedAssessorOperation: "Client based Assessor Operations",
  AssignedAssessorOperation: "Assigned Assessor Operations",
  BatchListOperation: "Batch list Operations",
  TeamMemberOperation: "Team member Operations",

  ClientWiseBatchMIS: "Client wise batch MIS",
  NOSResultMIS: "Nos Result MIS",
  TeamMemberQA: "Team member QA",

  RealTimeMoniteringAndQALISTQA: "Real Time Monitoring & QA List QA",
  ClientBasedAssessorQA: "Client based Assessor QA",
  AssessorListQA: "Assessor list QA",
  AssessorListHR: "Assessor list HR",
};
