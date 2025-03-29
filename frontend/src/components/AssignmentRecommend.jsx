import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import RecommendIcon from '@mui/icons-material/Recommend';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { useSelector, useDispatch } from 'react-redux';
import { resetFeedback } from '../redux/slice/assignmentSlice';

const AssignmentRecommendations = ({ weekId }) => {
  const dispatch = useDispatch();
  const feedback = useSelector(state => state.assignment.feedback[weekId]);

  if (!feedback) return null;
  const formatBotResponse = (text) => {
    if (!text) return "";

    // Split text into paragraphs
    const paragraphs = text
    .replace(/^\* /gm, '- ') // Replace * with - for consistency
    .split('\n\n');

  return paragraphs.map((paragraph, index) => {
    // Handle headings (##)
    if (paragraph.startsWith('## ')) {
      return (
        <Typography 
          key={index}
          variant="h6" 
          sx={{ 
            color: 'primary.main',
            mt: 3,
            mb: 2,
            fontWeight: 600 
          }}
        >
          {paragraph.substring(3)}
        </Typography>
      );
    }

    if (paragraph.includes('\n- ')) {
      const items = paragraph
        .split('\n- ')
        .filter(Boolean);
      return (
        <Box key={index} sx={{ mb: 2 }}>
          <ul style={{ 
            paddingLeft: '20px',
            marginBottom: '16px',
            listStyleType: 'disc' 
          }}>
            {items.map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                <Typography>
                  {item.split(/\*\*(.*?)\*\*/).map((part, j) => 
                    j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                  )}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
      );
    }

      if (paragraph.includes('`')) {
        return (
          <Box key={index} sx={{ mb: 2 }}>
            {paragraph.split(/`(.*?)`/).map((part, i) => 
              i % 2 === 0 ? (
                <Typography key={i} component="span">
                  {part.split(/\*\*(.*?)\*\*/).map((boldPart, j) => 
                    j % 2 === 0 ? boldPart : <strong key={j}>{boldPart}</strong>
                  )}
                </Typography>
              ) : (
                <code key={i} style={{
                  backgroundColor: '#f5f5f5',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}>
                  {part}
                </code>
              )
            )}
          </Box>
        );
      }
      return (
        <Typography key={index} sx={{ mb: 2, lineHeight: 1.6 }}>
          {paragraph.split(/\*\*(.*?)\*\*/).map((part, i) => 
            i % 2 === 0 ? part : <strong key={i}>{part}</strong>
          )}
        </Typography>
      );
    });
  };

      const res = formatBotResponse(feedback)
  return (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Assignment Feedback</Typography>
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => dispatch(resetFeedback(weekId))}
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
            {res}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AssignmentRecommendations;