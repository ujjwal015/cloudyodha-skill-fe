import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    navPath: null,
  },
  reducers: {
    navigatePath: (state, { payload }) => {
      state.navPath = payload;
    },
  },
});

export const { navigatePath } = employeeSlice.actions;

export const employeeSelector = (state) => state.employee;
const employeeReducer = employeeSlice.reducer;
export default employeeReducer;
