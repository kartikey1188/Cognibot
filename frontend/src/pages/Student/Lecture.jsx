// Final Refined Lecture UI with Toggle Controls
import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  Rating,
  TextField,
  Container,
  CircularProgress,
  Grow,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ChatIcon from "@mui/icons-material/Chat";
import OfflineBoltRoundedIcon from "@mui/icons-material/OfflineBoltRounded";
import DownloadIcon from "@mui/icons-material/Download";
import { ChatFeed, Message } from "react-chat-ui";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../axiosClient";
import { clearQuestions } from "../../redux/slice/questionsSlice";

const styles = {
  container: { mt: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } },
  videoBox: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
    boxShadow: 4,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
    borderRadius: "inherit",
  },
};

function Lecture() {
  const { lid } = useParams();
  const dispatch = useDispatch();
  const { generatedQuestions, isLoading, error } = useSelector((state) => state.questions);
  const user = useSelector((state) => state.auth.user);

  const [content, setContent] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [comments, setComments] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [visibleSection, setVisibleSection] = useState(null);

  useEffect(() => {
    dispatch(clearQuestions());
    setSelectedAnswers({});
    setMessages([
      new Message({ id: 1, message: "Welcome! Ask your lecture-related questions here—they'll go straight to the instructor." })
    ]);
    axiosInstance.get(`/get_lecture_by_id/${lid}`).then((res) => {
      setContent({
        title: res.data.title,
        link: convertToEmbedLink(res.data.lecture_link),
      });
    });
  }, [lid]);

  const convertToEmbedLink = (url) => {
    const match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
    const videoId = match && match[7].length === 11 ? match[7] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const formatResponse = (text) => text?.split("\n").map((line, i) => <p key={i}>{line}</p>);

  const handleGenerateSummary = () => {
    setSummaryLoading(true);
    axiosInstance.get(`/lecture_summary/${lid}`).then((res) => {
      setContent((prev) => ({ ...prev, summary: res.data.lecture_summary }));
    }).finally(() => setSummaryLoading(false));
  };

  const handleReviewSubmit = () => {
    axiosInstance.post("/submit_feedback", {
      lecture_id: lid,
      rating: value,
      feedback: comments[lid],
      user_id: user.id,
    }).then(() => {
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
      setComments((prev) => ({ ...prev, [lid]: "" }));
      setValue(0);
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const userMessage = new Message({ id: 0, message: newMessage });
    setMessages((prev) => [...prev, userMessage]);
    axiosInstance.post("/receive_doubt", { lecture_id: lid, doubt: newMessage }).then((res) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, new Message({ id: 1, message: res.data.Message })]);
      }, 1000);
      setNewMessage("");
    });
  };

  const handleDownloadSummary = () => {
    if (!content?.summary) return;
    const blob = new Blob([content.summary.replace(/\*\*/g, "")], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${content.title}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatQuestions = (questions) => {
    if (!questions?.questions) return null;
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
        {questions.questions.map((q, index) => {
          const selectedOption = selectedAnswers[index];
          const isAnswered = selectedOption !== undefined;

          const handleOptionClick = (selected) => {
            if (!isAnswered) {
              setSelectedAnswers((prev) => ({ ...prev, [index]: selected }));
            }
          };

          return (
            <Grow in timeout={index * 150} key={index}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6">Question {index + 1}</Typography>
                <Typography>{q.question}</Typography>
                <Box mt={2} display="flex" flexDirection="column" gap={1}>
                  {Object.entries(q.options).map(([key, value]) => {
                    const isSelected = selectedOption === key;
                    const isCorrect = key === q.correct_answer;
                    const showCorrect = isAnswered && isCorrect;
                    const showIncorrect = isAnswered && isSelected && !isCorrect;

                    return (
                      <Paper
                        key={key}
                        variant="outlined"
                        onClick={() => handleOptionClick(key)}
                        sx={{
                          p: 1.5,
                          cursor: isAnswered ? "default" : "pointer",
                          borderColor: showCorrect ? "success.main" : showIncorrect ? "error.main" : "divider",
                          backgroundColor: showCorrect
                            ? "success.light"
                            : showIncorrect
                            ? "error.light"
                            : "background.paper",
                        }}
                      >
                        <Typography fontWeight={600}>{key}. {value}</Typography>
                      </Paper>
                    );
                  })}
                </Box>
                {isAnswered && (
                  <Typography mt={2} color={selectedOption === q.correct_answer ? "success.main" : "error.main"}>
                    {selectedOption === q.correct_answer ? "Correct!" : `Incorrect. Correct answer is ${q.correct_answer}`}
                  </Typography>
                )}
              </Paper>
            </Grow>
          );
        })}
      </Box>
    );
  };

  const renderSectionToggles = () => (
    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
      <ToggleButtonGroup
        value={visibleSection}
        exclusive
        onChange={(e, val) => setVisibleSection(val)}
        aria-label="Section toggles"
      >
        <ToggleButton value="summary" sx={{ flexDirection: "column", py: 1.5 }}>
          <DescriptionIcon />
          <Typography variant="caption">Summary</Typography>
        </ToggleButton>
        <ToggleButton value="review" sx={{ flexDirection: "column", py: 1.5 }}>
          <RateReviewIcon />
          <Typography variant="caption">Review</Typography>
        </ToggleButton>
        <ToggleButton value="chat" sx={{ flexDirection: "column", py: 1.5 }}>
          <ChatIcon />
          <Typography variant="caption">Chat</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {content?.title}
      </Typography>

      <Box sx={styles.videoBox}>
        <iframe
          style={styles.iframe}
          src={content?.link}
          title="Lecture Video"
          allowFullScreen
        />
      </Box>

      {renderSectionToggles()}

      {visibleSection === "summary" && (
        <Paper sx={{ mt: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h6">Lecture Summary</Typography>
          <Typography variant="body2" color="text.secondary">
            {formatResponse(content?.summary) || "Click 'Summarize' to generate summary."}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={summaryLoading ? <CircularProgress size={20} /> : <OfflineBoltRoundedIcon />}
              onClick={handleGenerateSummary}
            >
              {summaryLoading ? "Generating..." : "Summarize"}
            </Button>
            <Button variant="outlined" disabled={!content?.summary} onClick={handleDownloadSummary}>
              <DownloadIcon />
            </Button>
          </Box>
        </Paper>
      )}

      {visibleSection === "review" && (
        <Paper sx={{ mt: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h6">Leave a Review</Typography>
          <Rating value={value} onChange={(e, newVal) => setValue(newVal)} />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your Review"
            value={comments[lid] || ""}
            onChange={(e) => setComments({ ...comments, [lid]: e.target.value })}
            sx={{ mt: 2 }}
          />
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            disabled={!value || !comments[lid]?.trim()}
            onClick={handleReviewSubmit}
          >
            Submit Review
          </Button>
          {reviewSubmitted && (
            <Typography mt={1} color="success.main">
              ✓ Review submitted successfully!
            </Typography>
          )}
        </Paper>
      )}

      {visibleSection === "chat" && (
        <Paper sx={{ mt: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h6">Lecture Chat</Typography>
          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            <ChatFeed messages={messages} showSenderName bubblesCentered={false} />
          </Box>
          <Box sx={{ display: "flex", mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your question..."
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </Box>
        </Paper>
      )}

      {generatedQuestions && (
        <Paper sx={{ mt: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Practice Questions
          </Typography>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            formatQuestions(generatedQuestions)
          )}
        </Paper>
      )}
    </Container>
  );
}

export default Lecture;
