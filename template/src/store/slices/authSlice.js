import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthentication: false,
    user: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.isAuthentication = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthentication = false;
      state.user = {};
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  }
});

export const { setUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer; 