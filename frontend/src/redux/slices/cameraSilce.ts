import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { callGetCameras } from 'services/camera.api'
import { ICamera } from 'types/backend'

interface IState {
  isFetching: boolean
  meta: {
    page: number
    pageSize: number
    pages: number
    total: number
  }
  result: ICamera[]
}

export const fetchCamera = createAsyncThunk('camera/fetchCamera', async () => {
  const response = await callGetCameras()
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

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCamera.pending, (state) => {
      state.isFetching = true
    })

    builder.addCase(fetchCamera.rejected, (state) => {
      state.isFetching = false
    })

    builder.addCase(fetchCamera.fulfilled, (state, action) => {
      if (action.payload && action.payload) {
        state.isFetching = false
        state.meta = action.payload.meta
        state.result = action.payload.result
      }
    })
  }
})

export default cameraSlice.reducer
