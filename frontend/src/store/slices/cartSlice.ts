import { createSlice } from '@reduxjs/toolkit';
import { ICartItem } from 'types/backend';

interface IState {
  items: ICartItem[];
  total: number;
  itemCount: number;
}

const initialState: IState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.itemCount += 1;
      state.total += action.payload.price;
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload);

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.total -= item.price * item.quantity;
        state.itemCount -= item.quantity;
        state.items.splice(itemIndex, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item && quantity > 0) {
        const quantityDiff = quantity - item.quantity;
        item.quantity = quantity;
        state.itemCount += quantityDiff;
        state.total += item.price * quantityDiff;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;