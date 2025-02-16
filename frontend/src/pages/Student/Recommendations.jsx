import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  List,
  Tooltip,
  Avatar,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Book as BookIcon,
  TrendingUp as TrendingUpIcon,
  Warning as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import AssistantIcon from "@mui/icons-material/Assistant";

const Recommendations = () => {
  const recommendations = [
    {
      id: 1,
      subject: "Python",
      strength: 78,
      recommendationType: "practice",
      recommendation: "Improve your understanding of list comprehensions and generators.",
      feedback: "Good grasp of basic syntax, but needs more practice with advanced concepts.",
      suggestedResources: ["Online Python Tutor", "Real Python Tutorials"],
      priority: "high"
    },
    {
      id: 2,
      subject: "Machine Learning Practices",
      strength: 65,
      recommendationType: "practice",
      recommendation: "Focus on understanding different types of neural networks.",
      feedback: "Needs more practice with model selection and hyperparameter tuning.",
      suggestedResources: ["TensorFlow Documentation", "Keras Tutorials"],
      priority: "medium"
    }
  ];

  const getRecommendationIcon = (type) => {
    switch(type) {
      case 'practice': return <BookIcon color="primary" />;
      case 'advancement': return <TrendingUpIcon color="success" />;
      default: return <AlertCircleIcon color="warning" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold">
        PERSONALIZED RECOMMENDATIONS
      </Typography>
      
      <Typography variant="body1" color="text.secondary" marginBottom={4}>
        Based on your recent performance and learning patterns, here are your personalized study recommendations.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center',mt:0, justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          Generated using
        </Typography>
        <Tooltip title="CogniBot AI Agent">
           <AssistantIcon></AssistantIcon>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {recommendations.map((rec) => (
          <Card key={rec.id} sx={{ width: '100%' }}>
            <CardHeader
              sx={{
                paddingBottom: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {getRecommendationIcon(rec.recommendationType)}
                  <Box>
                    <Typography variant="h6" fontWeight="semibold">
                      {rec.subject}
                    </Typography>
                    <Chip
                      label={`${rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority`}
                      color={getPriorityColor(rec.priority)}
                      size="small"
                      sx={{ marginTop: 1 }}
                    />
                  </Box>
                </Box>
              }
              action={
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary" marginBottom={1}>
                    Current Strength
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress variant="determinate" value={rec.strength} sx={{ width: 96 }} />
                    <Typography variant="body2" fontWeight="medium">
                      {rec.strength}%
                    </Typography>
                  </Box>
                </Box>
              }
            />

            <CardContent>
              <Box sx={{ backgroundColor: 'primary.50', padding: 4, borderRadius: 2, marginBottom: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CheckCircleIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight="semibold">
                    Recommendation
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {rec.recommendation}
                </Typography>
              </Box>

              <Box marginBottom={4}>
                <Typography variant="subtitle2" fontWeight="semibold" marginBottom={1}>
                  Feedback
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {rec.feedback}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight="semibold" marginBottom={1}>
                  Suggested Resources
                </Typography>
                <List>
                  {rec.suggestedResources.map((resource, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        
                      </ListItemIcon>
                      <ListItemText primary={resource} primaryTypographyProps={{ color: 'text.secondary' }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      
    </Box>
  );
};

export default Recommendations;