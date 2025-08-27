import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import cartReducer from './slices/cartSlice'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSilce'
import cameraReducer from './slices/cameraSilce'
import chatReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    account: authReducer,
    user: userReducer,
    camera: cameraReducer,
    products: productsReducer,
    cart: cartReducer,
    chat: chatReducer
  }
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
