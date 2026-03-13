import { createSlice } from "@reduxjs/toolkit";

const instructionsSlice = createSlice({
  name: "instructionsManagement",
  initialState: {
    instructionsList: [],
   
  },
  reducers: {
    getInstructionsList: (state, { payload }) => {
      state.instructionsList = payload;
    },
    

  },
});

export const {
    getInstructionsList,
} = instructionsSlice.actions;

export const instructionsManagementSelector = (state) => state.superAdmin.instructionsManagement;
const instructionsManagementReducer = instructionsSlice.reducer;

export default instructionsManagementReducer;
