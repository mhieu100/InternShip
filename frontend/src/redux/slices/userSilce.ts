import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { callGetUsers } from 'services/user.api'
import { IUser } from 'types/backend'

interface IState {
  isFetching: boolean
  meta: {
    page: number
    pageSize: number
    pages: number
    total: number
  }
  result: IUser[]
}

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await callGetUsers()
  return response.data
})

const initialState: IState = {
  isFetching: true,
  meta: {
    page: 1,
    pageSize: 10,
    pages: 0,
    total: 0
  },
  result: []
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.isFetching = true
    })

    builder.addCase(fetchUser.rejected, (state) => {
      state.isFetching = false
    })

    builder.addCase(fetchUser.fulfilled, (state, action) => {
      if (action.payload && action.payload) {
        state.isFetching = false
        state.meta = action.payload.meta
        state.result = action.payload.result
      }
    })
  }
})

export default userSlice.reducer
