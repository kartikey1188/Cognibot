import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weeklyAnswers: {},
  feedback: {},
  performanceSummary: {},
  questionAssessments: {},
  isSubmitted: {},
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    saveAnswers: (state, action) => {
      const { weekId, answers } = action.payload;

      // Ensure all necessary objects exist
      if (!state.weeklyAnswers) state.weeklyAnswers = {};
      if (!state.isSubmitted) state.isSubmitted = {};

      // Initialize the weekId if it doesn't exist
      state.weeklyAnswers[weekId] = answers || {};
      state.isSubmitted[weekId] = false;
    },
    saveFeedback: (state, action) => {
      const { weekId, feedback, performanceSummary, questionAssessments } =
        action.payload;

      // Ensure all necessary objects exist
      if (!state.feedback) state.feedback = {};
      if (!state.performanceSummary) state.performanceSummary = {};
      if (!state.questionAssessments) state.questionAssessments = {};
      if (!state.isSubmitted) state.isSubmitted = {};

      // Initialize the weekId if it doesn't exist
      state.feedback[weekId] = feedback || "";
      state.performanceSummary[weekId] = performanceSummary || {};
      state.questionAssessments[weekId] = questionAssessments || [];
      state.isSubmitted[weekId] = true;
    },
    resetAnswers: (state, action) => {
      const weekId = action.payload;

      // Ensure necessary objects exist
      if (!state.weeklyAnswers) state.weeklyAnswers = {};
      if (!state.isSubmitted) state.isSubmitted = {};

      // Reset answers and submission status
      state.weeklyAnswers[weekId] = {};
      state.isSubmitted[weekId] = false;
    },
    resetWeek: (state, action) => {
      const weekId = action.payload;

      // Ensure all necessary objects exist
      if (!state.weeklyAnswers) state.weeklyAnswers = {};
      if (!state.feedback) state.feedback = {};
      if (!state.performanceSummary) state.performanceSummary = {};
      if (!state.questionAssessments) state.questionAssessments = {};
      if (!state.isSubmitted) state.isSubmitted = {};

      // Reset all values for the given week
      state.weeklyAnswers[weekId] = {};
      state.feedback[weekId] = "";
      state.performanceSummary[weekId] = {};
      state.questionAssessments[weekId] = [];
      state.isSubmitted[weekId] = false;
    },
    resetFeedback: (state, action) => {
      const weekId = action.payload;

      // Ensure all necessary objects exist
      if (!state.feedback) state.feedback = {};
      if (!state.performanceSummary) state.performanceSummary = {};
      if (!state.questionAssessments) state.questionAssessments = {};

      // Reset feedback-related data
      state.feedback[weekId] = "";
      state.performanceSummary[weekId] = {};
      state.questionAssessments[weekId] = [];
    },
    resetAll: (state) => {
      // Reset the entire state
      state.weeklyAnswers = {};
      state.feedback = {};
      state.performanceSummary = {};
      state.questionAssessments = {};
      state.isSubmitted = {};
    },
  },
});

export const {
  saveAnswers,
  saveFeedback,
  resetAnswers,
  resetFeedback,
  resetWeek,
  resetAll,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
