import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  isLoading: false,
  theme: 'light',
  rateLimit: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setRateLimit: (state, action) => {
      state.rateLimit = action.payload;
    },
    
  },
});

export const { toggleSidebar, setLoading, toggleTheme, setRateLimit } = uiSlice.actions;
export default uiSlice.reducer;