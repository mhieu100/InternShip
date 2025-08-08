import { createSlice } from '@reduxjs/toolkit';
import type { IUserInfo } from '../../types/backend';

interface IState {
  isAuthenticated: boolean,
  userInfo: IUserInfo,
  loading: boolean,
  error: string | null,
}

const initialState : IState = {
  isAuthenticated: false,
  userInfo: {
    id: 0,
    avatar: "",
    name: "",
    email: "",
  },
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = {
        avatar: "",
        name: "",
        email: "",
      };
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart, 
  registerSuccess, 
  registerFailure, 
  logout, 
  clearError 
} = userSlice.actions;
export default userSlice.reducer;