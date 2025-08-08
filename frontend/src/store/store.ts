import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice.ts';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice.ts';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    user: userReducer,
    chat: chatReducer,
  },
});
  
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
