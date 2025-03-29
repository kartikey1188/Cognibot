import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import RecommendIcon from '@mui/icons-material/Recommend';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { useSelector, useDispatch } from 'react-redux';
import { resetWeek } from '../redux/slice/assignmentSlice';

const AssignmentRecommendations = ({ weekId }) => {
  const dispatch = useDispatch();
  const recommendations = useSelector(state => state.assignment.recommendations[weekId]);
  const feedback = useSelector(state => state.assignment.feedback[weekId]);

  if (!recommendations && !feedback) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Assignment Feedback</Typography>
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => dispatch(resetWeek(weekId))}
          >
            Reset
          </Button>
        </Box>

        {feedback && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FeedbackIcon sx={{ mr: 1 }} />
              Feedback
            </Typography>
            <Typography variant="body2">{feedback}</Typography>
          </Box>
        )}

        {recommendations && (
          <Box>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <RecommendIcon sx={{ mr: 1 }} />
              Recommendations
            </Typography>
            <List>
              {recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 32 }}>•</ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AssignmentRecommendations;