import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { callFetchAccount } from 'services/auth.api'

export const fetchAccount = createAsyncThunk(
  'account/fetchAccount',
  async () => {
    const response = await callFetchAccount()
    return response.data
  }
)

interface IState {
  isAuthenticated: boolean
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  isLoading: boolean
  isRefreshToken: boolean
  errorRefreshToken: string
}

const initialState: IState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: JSON.parse(localStorage.getItem('user') || '{}') || {
    id: '',
    name: '',
    email: '',
    role: ''
  },
  isLoading: false,
  isRefreshToken: false,
  errorRefreshToken: ''
}

const authSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUserLogin: (state, action) => {
      state.isAuthenticated = true
      state.isLoading = false
      state.user.id = action?.payload?.id
      state.user.email = action.payload.email
      state.user.name = action.payload.name
      state.user.role = action?.payload?.role
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    setLogout: (state) => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
      state.isAuthenticated = false
      state.user = {
        id: '',
        email: '',
        name: '',
        role: ''
      }
    },

    setRefreshTokenAction: (state, action) => {
      state.isRefreshToken = action.payload?.status ?? false
      state.errorRefreshToken = action.payload?.message ?? ''
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccount.pending, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false
        state.isLoading = true
      }
    })

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true
        state.isLoading = false
        state.user.id = action?.payload?.id
        state.user.email = action.payload.email
        state.user.name = action.payload.name
        state.user.role = action?.payload?.role
      }
    })

    builder.addCase(fetchAccount.rejected, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false
        state.isLoading = false
      }
    })
  }
})

export const { setUserLogin, setLogout, setRefreshTokenAction } =
  authSlice.actions
export default authSlice.reducer
