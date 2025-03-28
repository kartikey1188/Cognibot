import { createSlice } from '@reduxjs/toolkit';

const questionsSlice = createSlice({
  name: 'questions',
  initialState: {
    generatedQuestions: null,
    isLoading: false,
    error: null
  },
  reducers: {
    setGeneratedQuestions: (state, action) => {
      state.generatedQuestions = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearQuestions: (state) => {
      state.generatedQuestions = null;
    }
  }
});

export const { 
  setGeneratedQuestions, 
  setLoading, 
  setError,
  clearQuestions 
} = questionsSlice.actions;

export default questionsSlice.reducer;