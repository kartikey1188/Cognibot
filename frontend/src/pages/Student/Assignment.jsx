import React, { useState } from 'react';
import { 
  Typography, 
  Box,
  Checkbox,
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  Button, 
  Paper,
  FormGroup,
  Divider 
} from '@mui/material';

const pythonQuestions = [
  {
    id: 1,
    type: 'mcq',
    question: "What is the output of: print(type([]))?",
    options: ["<class 'list'>", "<class 'tuple'>", "<class 'set'>", "<class 'dict'>"],
    correctAnswer: "<class 'list'>"
  },
  {
    id: 2,
    type: 'msq',
    question: "Which of the following are valid Python data types? (Select all that apply)",
    options: ["int", "char", "bool", "String"],
    correctAnswers: ["int", "bool"]
  },
  {
    id: 3,
    type: 'mcq',
    question: "What is the value of x after: x = 1 + 2 ** 3 // 4?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "3"
  },
  {
    id: 4,
    type: 'msq',
    question: "Which of these are valid ways to create an empty list in Python? (Select all that apply)",
    options: ["list()", "[]", "list[]", "array()"],
    correctAnswers: ["list()", "[]"]
  }
];

function Assignment() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId, value, type) => {
    if (type === 'mcq') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    } else {
      // Handle MSQ (multiple answers)
      setAnswers(prev => ({
        ...prev,
        [questionId]: prev[questionId]
          ? prev[questionId].includes(value)
            ? prev[questionId].filter(v => v !== value)
            : [...prev[questionId], value]
          : [value]
      }));
    }
  };

  const calculateScore = () => {
    return pythonQuestions.reduce((score, question) => {
      if (question.type === 'mcq') {
        return score + (answers[question.id] === question.correctAnswer ? 1 : 0);
      } else {
        const userAnswers = answers[question.id] || [];
        const correctAnswers = question.correctAnswers;
        const isCorrect = 
          userAnswers.length === correctAnswers.length &&
          userAnswers.every(answer => correctAnswers.includes(answer));
        return score + (isCorrect ? 1 : 0);
      }
    }, 0);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Assignment 1
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        {pythonQuestions.map((question, index) => (
          <Paper 
            key={question.id} 
            sx={{ 
              p: 3, 
              mb: 3,
              backgroundColor: 'background.paper',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              Question {index + 1}: {question.question}
            </Typography>
            
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              {question.type === 'mcq' ? (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value, 'mcq')}
                >
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                      disabled={submitted}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <FormGroup>
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={(answers[question.id] || []).includes(option)}
                          onChange={(e) => handleAnswerChange(question.id, option, 'msq')}
                          disabled={submitted}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              )}
              
              {submitted && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography 
                    variant="body2" 
                    color={
                      question.type === 'mcq'
                        ? answers[question.id] === question.correctAnswer
                          ? 'success.main'
                          : 'error.main'
                        : JSON.stringify(answers[question.id]?.sort()) === 
                          JSON.stringify(question.correctAnswers.sort())
                          ? 'success.main'
                          : 'error.main'
                    }
                  >
                    {question.type === 'mcq'
                      ? `Correct answer: ${question.correctAnswer}`
                      : `Correct answers: ${question.correctAnswers.join(', ')}`}
                  </Typography>
                </Box>
              )}
            </FormControl>
          </Paper>
        ))}
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setSubmitted(true)}
        disabled={submitted}
        sx={{ mt: 2 }}
      >
        Submit Quiz
      </Button>

      {submitted && (
        <Paper sx={{ mt: 3, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h6">
            Score: {calculateScore()}/{pythonQuestions.length}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default Assignment;