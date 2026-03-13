import { createSlice } from "@reduxjs/toolkit";

const clientManagementSlice = createSlice({
  name: "clientManagement",
  initialState: {
    clientManagementLists: [],
    clientListAll:[],
    jobRolesListAll: [],
    specificJobRole: {},
    assignedClientsList: [],
    allClients:[],
    sectorList:[],
  },
  reducers: {
    getclientManagementLists: (state, { payload }) => {
      state.clientManagementLists = payload;
    },
    getAllClient:(state, { payload }) => {
      state.allClients = payload;
    },
    getclientListAll: (state,{payload})=>{
      state.clientListAll=payload;
    },
    getAllJobRolesListNew: (state, { payload }) => {
      state.jobRolesListAll = payload;
    },
    getSpecificJobRole: (state, { payload }) => {
      state.specificJobRole = payload;
    },
    getAssignedClientsList: (state, { payload }) => {
      state.assignedClientsList = payload;
    },
    getJobRoleSectorList: (state, { payload }) => {
      state.sectorList = payload;
    }
  },
});

export const {
  getclientManagementLists,
  getclientListAll,
  getAllJobRolesListNew,
  getSpecificJobRole,
  getAssignedClientsList,
  getAllClient,
  getJobRoleSectorList,
} = clientManagementSlice.actions;

export const clientManagementSelector = (state) =>
  state.superAdmin.clientManagement;
const clientManagementReducer = clientManagementSlice.reducer;

export default clientManagementReducer;
