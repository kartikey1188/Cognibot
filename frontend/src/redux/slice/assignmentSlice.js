import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  weeklyAnswers: {}, // Store answers by week
  recommendations: {}, // Store recommendations by week
  feedback: {} // Store feedback by week
};

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    saveAnswers: (state, action) => {
      const { weekId, answers } = action.payload;
      state.weeklyAnswers[weekId] = answers;
    },
    saveFeedback: (state, action) => {
      const { weekId, feedback, recommendations } = action.payload;
      state.recommendations[weekId] = recommendations;
      state.feedback[weekId] = feedback;
    },
    resetWeek: (state, action) => {
      const weekId = action.payload;
      delete state.weeklyAnswers[weekId];
      delete state.recommendations[weekId];
      delete state.feedback[weekId];
    },
    resetAll: (state) => {
      state.weeklyAnswers = {};
      state.recommendations = {};
      state.feedback = {};
    }
  }
});

export const { saveAnswers, saveFeedback, resetWeek, resetAll } = assignmentSlice.actions;
export default assignmentSlice.reducer;