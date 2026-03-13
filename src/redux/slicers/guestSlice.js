import { createSlice } from "@reduxjs/toolkit";

const guestSlice = createSlice({
  name: "guest",
  initialState: {
    navPath: null,
  },
  reducers: {
    navigatePath: (state, { payload }) => {
      state.navPath = payload;
    },
  },
});

export const { navigatePath } = guestSlice.actions;

export const guestSelector = (state) => state.guest;
const guestReducer = guestSlice.reducer;
export default guestReducer;
