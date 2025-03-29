import React from 'react';
import { Box, Typography, Paper, LinearProgress, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';

const AssignmentRecommendations = ({ weekId }) => {
  const feedback = useSelector(state => state.assignment.feedback[weekId]);
  const performanceSummary = useSelector(
    state => state.assignment.performanceSummary[weekId]
  );

  if (!feedback || !performanceSummary) return null;

  return (
    <Box sx={{ mt: 4 }}>
      {/* Performance Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Summary
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Total Questions: {performanceSummary.total_questions}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={performanceSummary.percent_correct}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Score: {performanceSummary.percent_correct}%
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="success.main">
            Correct: {performanceSummary.correct}
          </Typography>
          <Typography variant="body2" color="warning.main">
            Partially Correct: {performanceSummary.partially_correct}
          </Typography>
          <Typography variant="body2" color="error.main">
            Incorrect: {performanceSummary.incorrect}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Feedback & Recommendations
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ 
          '& p': { mb: 2 },
          '& h2': { mt: 3, mb: 2, fontSize: '1.2rem' },
          '& ul': { pl: 3 },
          '& li': { mb: 1 }
        }}>
          {feedback}
        </Box>
      </Paper>
    </Box>
  );
};

export default AssignmentRecommendations;