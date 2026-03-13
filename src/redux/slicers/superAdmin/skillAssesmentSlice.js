import { createSlice } from "@reduxjs/toolkit";
const skillAssesmentSlice = createSlice({
    name: "skillAssesment",
    initialState: {
      batchList: [],
      
    },
    reducers: {
      getBatchList: (state, { payload }) => {
        state.batchList = payload;
      },
     
    },
  });
  
  export const {
    getBatchList,
    
  } = skillAssesmentSlice.actions;
  
  export const skillAssesmentSelector = (state) => state.superAdmin.skillAssesment;
  const skillAssesmentReducer = skillAssesmentSlice.reducer;
  
  export default skillAssesmentReducer;