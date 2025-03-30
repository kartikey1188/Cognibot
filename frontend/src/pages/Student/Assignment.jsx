import React, { useState, useEffect } from "react";
import { Typography, Box, Checkbox, Radio, RadioGroup, FormControlLabel, FormControl, Button, Paper, FormGroup, TextField, CircularProgress, } from "@mui/material";
import { useSearchParams, useParams } from "react-router-dom";
import axiosInstance from "../../axiosClient";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDispatch, useSelector } from 'react-redux';
import { saveAnswers, saveFeedback, resetFeedback, resetAnswers, resetWeek } from '@/redux/slice/assignmentSlice';
import AssignmentRecommendations from '@/components/AssignmentRecommend';

function Assignment() {
  const { id, aid } = useParams();
  const [searchParams] = useSearchParams();
  const isGraded = searchParams.get("isGraded") === "true";
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const savedAnswers = useSelector(state => state.assignment.weeklyAnswers);
  const isSubmitted = useSelector(state => state.assignment.isSubmitted[aid]);
const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/api/questions')
      .then(response => {
        setQuestions(c=>response.data);
        if (savedAnswers[aid]?.submitted_answers) {
          const restoredAnswers = {};
          savedAnswers[aid].submitted_answers.forEach(answer => {
            const question = response.data.find(q => q.qid === answer.qid);
            
            if (question?.type === "CAT") {
              restoredAnswers[answer.qid] = Array.isArray(answer.answer) 
                ? answer.answer 
                : [answer.answer];
            } else {
              restoredAnswers[answer.qid] = Array.isArray(answer.answer) && answer.answer.length === 1
                ? answer.answer[0]
                : answer.answer;
            }
          });
          setAnswers(restoredAnswers);
          setSubmitted(true);
        }else {
          setAnswers({});
          setSubmitted(false);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        setError('Failed to load questions');
        setLoading(false);
      });
  }, [aid]);

  const handleAnswerChange = (qid, value, type) => {
    if (isSubmitted) return;
    if (type === "MCQ") {
      setAnswers(prev => ({
        ...prev,
        [qid]: value
      }));
    } else if (type === "MSQ") {
      setAnswers(prev => ({
        ...prev,
        [qid]: prev[qid] 
          ? prev[qid].includes(value)
            ? prev[qid].filter(v => v !== value)
            : [...prev[qid], value].sort()
          : [value]
      }));
    } else if (type === "CAT") {
      setAnswers(prev => ({
        ...prev,
        [qid]: [value]
      }));
    }
  };

  const calculateScore = () => {
    return questions?.reduce((score, question) => {
      const userAnswer = answers[question.qid];
      if (!userAnswer) return score;

      if (question.type === "MCQ") {
        return score + (userAnswer === question.answer[0] ? question.points : 0);
      } else if (question.type === "MSQ") {
        const isCorrect = 
          userAnswer.length === question.answer.length &&
          userAnswer.every(ans => question.answer.includes(ans));
        return score + (isCorrect ? question.points : 0);
      } else if (question.type === "CAT") {
        return score + (userAnswer[0]?.trim().toLowerCase() === question.answer[0].toLowerCase() ? 1 : 0); // replace with question.points
      }
      return score;
    }, 0);
  };

  // Update the handleSubmit function
const handleSubmit = async () => {
  if (isSubmitted) return;
  const submittedAnswers = {
    submitted_answers: questions.map(q => ({
      qid: q.qid,
      answer: answers[q.qid] 
        ? Array.isArray(answers[q.qid]) 
          ? answers[q.qid] 
          : [answers[q.qid]]
        : []
    }))
  };

  try {
    setLoading(true);
    dispatch(saveAnswers({
      weekId: aid,
      answers: submittedAnswers
    }));

    const response = await axiosInstance.post('/api/feedback-recommendations', submittedAnswers);
    dispatch(saveFeedback({
      weekId: aid,
      feedback: response.data?.comprehensive_feedback,
      performanceSummary: response.data?.performance_summary,
      questionAssessments: response.data?.question_assessments
    }));

    setSubmitted(true);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    setError('Failed to submit assignment');
  } finally {
    setLoading(false);
  }
};


const handleAnswersReset = () => {
  dispatch(resetAnswers(aid));
  setAnswers({});
    setSubmitted(false);
};

  const renderQuestion = (question) => (
    <Paper 
      key={question.qid} 
      sx={{ p: 3, mb: 3, backgroundColor: "background.paper", borderRadius: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        {question.question}
      </Typography>

      {question.description && (
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {question.description}
        </Typography>
      )}

      {question.code && (
        <Box sx={{ my: 2 }}>
          <SyntaxHighlighter language="python" style={materialDark}>
            {question.code}
          </SyntaxHighlighter>
        </Box>
      )}

      {question.input && (
        <Box sx={{ my: 2, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Input:
          </Typography>
          {question.input.map((line, index) => (
            <Typography key={index} variant="body2" fontFamily="monospace">
              {line}
            </Typography>
          ))}
        </Box>
      )}

      <FormControl component="fieldset" sx={{ width: "100%", mt: 2 }}>
        {question.type === "MCQ" && (
          <RadioGroup
            value={answers[question.qid] || ""}
            onChange={(e) => handleAnswerChange(question.qid, e.target.value, "MCQ")}
          >
            {Object.entries(question.options).map(([key, value]) => (
              <FormControlLabel
                key={key}
                value={key}
                control={<Radio />}
                label={value}
                disabled={submitted}
              />
            ))}
          </RadioGroup>
        )}

        {question.type === "MSQ" && (
          <FormGroup>
            {Object.entries(question.options).map(([key, value]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={(answers[question.qid] || []).includes(key)}
                    onChange={() => handleAnswerChange(question.qid, key, "MSQ")}
                    disabled={submitted}
                  />
                }
                label={value}
              />
            ))}
          </FormGroup>
        )}

        {question.type === "CAT" && (
          <TextField
            fullWidth
            multiline
            rows={2}
            value={answers[question.qid] || ""}
            onChange={(e) => handleAnswerChange(question.qid, e.target.value, "CAT")}
            disabled={submitted}
            placeholder="Enter your answer here"
          />
        )}

        {submitted && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="body2" color={
           question.type === "CAT"
           ? (answers[question.qid] && answers[question.qid][0]?.trim().toLowerCase() === question.answer[0]?.trim().toLowerCase())
             ? "success.main"
             : "error.main"
              : question.type === "MCQ"
              ? answers[question.qid] === question.answer[0] 
                ? "success.main" 
                : "error.main"
              : (answers[question.qid] && 
                  JSON.stringify([...answers[question.qid]].sort()) === JSON.stringify([...question.answer].sort())) 
                ? "success.main" 
                : "error.main"
          }>
            Correct answer{question.answer.length > 1 ? 's' : ''}: {question.answer.join(", ")}
          </Typography>
        </Box>
        )}
      </FormControl>
    </Paper>
  );

  if (loading && !questions?.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx : "auto", pb: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {isGraded ? "Graded" : "Practice"} Assignment - Week {aid}
      </Typography>

      <Box sx={{ mt: 4 }}>
        {questions?.map(renderQuestion)}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitted || loading}
          sx={{ flexGrow: 1, mr: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Assignment"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleAnswersReset}
          disabled={!submitted}

          sx={{ flexGrow: 1, ml: 1 }}
        >
          Reset
        </Button>
      </Box>

      {submitted && (
        <Paper sx={{ mt: 3, p: 2, bgcolor: "primary.light", color: "primary.contrastText" }}>
          <Typography variant="h6">
            Score: {calculateScore()}/{questions.reduce((sum, q) => sum + (q.points || 1), 0)}
          </Typography>
        </Paper>
      )}
       <AssignmentRecommendations weekId={aid} />
    </Box>
  );
}

export default Assignment;