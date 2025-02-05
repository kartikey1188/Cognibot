import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  isLoading: false,
  theme: 'light',
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
  },
});

export const { toggleSidebar, setLoading, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;