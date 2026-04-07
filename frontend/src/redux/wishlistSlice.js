import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of products
  isOpen: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    toggleWishlist: (state) => {
      state.isOpen = !state.isOpen;
    },
    addToWishlistLocal: (state, action) => {
      const existing = state.items.find(item => item._id === action.payload._id);
      if (!existing) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlistLocal: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    // When logout is dispatched from authSlice, clear the wishlist
    builder.addCase('auth/logout', (state) => {
      state.items = [];
    });
  },
});

export const { setWishlist, toggleWishlist, addToWishlistLocal, removeFromWishlistLocal, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
