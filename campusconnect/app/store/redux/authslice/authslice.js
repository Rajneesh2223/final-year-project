import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Store user details
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set user details
    },
    clearUser: (state) => {
      state.user = null; // Clear user on logout
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
