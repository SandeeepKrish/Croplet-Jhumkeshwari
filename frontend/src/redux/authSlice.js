import { createSlice } from '@reduxjs/toolkit';

// Load persisted auth state from localStorage
const loadAuthState = () => {
  try {
    const serialized = localStorage.getItem('authState');
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch {
    return null;
  }
};

const persistedAuth = loadAuthState();

const initialState = {
  user: persistedAuth?.user || null,
  isLoggedIn: persistedAuth?.isLoggedIn || false,
  isAuthModalOpen: false,
  token: persistedAuth?.token || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleAuthModal: (state) => {
      state.isAuthModalOpen = !state.isAuthModalOpen;
    },
    login: (state, action) => {
      state.user = action.payload.user || action.payload;
      state.token = action.payload.token || null;
      state.isLoggedIn = true;
      state.isAuthModalOpen = false;
      // Persist to localStorage
      localStorage.setItem('authState', JSON.stringify({
        user: state.user,
        token: state.token,
        isLoggedIn: true,
      }));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
      // Clear localStorage
      localStorage.removeItem('authState');
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
});

export const { toggleAuthModal, login, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
