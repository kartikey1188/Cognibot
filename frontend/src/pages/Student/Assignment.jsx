import React, { useState, useCallback } from "react";
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
  Divider,
  TextField,
  Grow,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ChatFeed, Message } from "react-chat-ui";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation , useSearchParams} from "react-router-dom";

const pythonQuestions = [
  {
    id: 1,
    type: "mcq",
    question: "What is the output of: print(type([]))?",
    options: [
      "<class 'list'>",
      "<class 'tuple'>",
      "<class 'set'>",
      "<class 'dict'>",
    ],
    correctAnswer: "<class 'list'>",
  },
  {
    id: 2,
    type: "msq",
    question:
      "Which of the following are valid Python data types? (Select all that apply)",
    options: ["int", "char", "bool", "String"],
    correctAnswers: ["int", "bool"],
  },
  {
    id: 3,
    type: "mcq",
    question: "What is the value of x after: x = 1 + 2 ** 3 // 4?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "3",
  },
  {
    id: 4,
    type: "msq",
    question:
      "Which of these are valid ways to create an empty list in Python? (Select all that apply)",
    options: ["list()", "[]", "list[]", "array()"],
    correctAnswers: ["list()", "[]"],
  },
];

function Assignment() {
 const [searchParams] = useSearchParams();
 const isGraded = searchParams.get("isGraded") === "true";
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    new Message({
      id: 1,
      message:
        "Welcome to the assignment chat! Feel free to discuss the questions here.",
      senderName: "System",
      timestamp: new Date().toLocaleTimeString(),
    }),
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const handleAnswerChange = (questionId, value, type) => {
    if (type === "mcq") {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    } else {
      // Handle MSQ (multiple answers)
      setAnswers((prev) => ({
        ...prev,
        [questionId]: prev[questionId]
          ? prev[questionId].includes(value)
            ? prev[questionId].filter((v) => v !== value)
            : [...prev[questionId], value]
          : [value],
      }));
    }
  };

  const calculateScore = () => {
    return pythonQuestions.reduce((score, question) => {
      if (question.type === "mcq") {
        return (
          score + (answers[question.id] === question.correctAnswer ? 1 : 0)
        );
      } else {
        const userAnswers = answers[question.id] || [];
        const correctAnswers = question.correctAnswers;
        const isCorrect =
          userAnswers.length === correctAnswers.length &&
          userAnswers.every((answer) => correctAnswers.includes(answer));
        return score + (isCorrect ? 1 : 0);
      }
    }, 0);
  };

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() === "") return;

    const userMessage = new Message({
      id: 0,
      message: newMessage,
      senderName: "You",
      timestamp: new Date().toLocaleTimeString(),
    });
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setTimeout(() => {
      const responseMessage = new Message({
        id: 1,
        message: "Thank you for your message. We will get back to you shortly.",
        senderName: "System",
        timestamp: new Date().toLocaleTimeString(),
      });
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);

    setNewMessage("");
  }, [newMessage]);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
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
              backgroundColor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Question {index + 1}: {question.question}
            </Typography>

            <FormControl component="fieldset" sx={{ width: "100%" }}>
              {question.type === "mcq" ? (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value, "mcq")
                  }
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
                          checked={(answers[question.id] || []).includes(
                            option
                          )}
                          onChange={(e) =>
                            handleAnswerChange(question.id, option, "msq")
                          }
                          disabled={submitted}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              )}

              {submitted && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    color={
                      question.type === "mcq"
                        ? answers[question.id] === question.correctAnswer
                          ? "success.main"
                          : "error.main"
                        : JSON.stringify(answers[question.id]?.sort()) ===
                          JSON.stringify(question.correctAnswers.sort())
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {question.type === "mcq"
                      ? `Correct answer: ${question.correctAnswer}`
                      : `Correct answers: ${question.correctAnswers.join(
                          ", "
                        )}`}
                  </Typography>
                </Box>
              )}
            </FormControl>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitted || loading}
          sx={{ flexGrow: 1, mr: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Quiz"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
          disabled={!submitted}
          sx={{ flexGrow: 1, ml: 1 }}
        >
          Reset Quiz
        </Button>
      </Box>

      {submitted && (
        <Paper
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "primary.light",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="h6">
            Score: {calculateScore()}/{pythonQuestions.length}
          </Typography>
        </Paper>
      )}

      {!isGraded && (
        <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
          <IconButton
            color="primary"
            onClick={() => setChatOpen(!chatOpen)}
            sx={{
              bgcolor: "background.paper",
              borderRadius: "50%",
              boxShadow: 3,
            }}
          >
            {chatOpen ? <CloseIcon /> : <ChatIcon />}
          </IconButton>
        </Box>
      )}

      {chatOpen && (
        <Grow in>
          <Paper
            elevation={3}
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              width: 300,
              height: 400,
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fafafa",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Assignment Chat
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
              <ChatFeed
                messages={messages}
                showSenderName
                bubblesCentered={false}
                bubbleStyles={{
                  text: {
                    fontSize: 16,
                  },
                  chatbubble: {
                    borderRadius: 20,
                    padding: 10,
                  },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                sx={{ mr: 1 }}
                aria-label="Type your message"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Grow>
      )}
    </Box>
  );
}

export default Assignment;
