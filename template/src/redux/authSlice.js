import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthentication : false,
    user: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.isAuthentication = true
      state.user = action.payload
    },
    logout: (state, action) => {
      state.isAuthentication = false
      state.user = []
      localStorage.removeItem("access_token")
    }
  }
})

export const { setUser, logout } = authSlice.actions
export const authReducer = authSlice.reducer 