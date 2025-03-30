import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
//prettier-ignore
import {Typography,Box,Paper,Button,Rating,TextField,Grow,Container,Grid,Tabs,Tab,} from "@mui/material";
import OfflineBoltRoundedIcon from "@mui/icons-material/OfflineBoltRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ChatIcon from "@mui/icons-material/Chat";
import { ChatFeed, Message } from "react-chat-ui";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosClient";
import DownloadIcon from "@mui/icons-material/Download";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearQuestions } from "../../redux/slice/questionsSlice";
const styles = {
  container: { mt: 4 },
  videoBox: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
    boxShadow: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
  tabPanel: { p: 2, mt: 2 },
  summaryBox: {
    height: 200,
    mb: 2,
    overflow: "auto",
    p: 1,
    boxShadow:
      "inset 0px 1px 2px 1px rgba(0,0,0,0.2), inset 0px 4px 5px 0px rgba(0, 0, 0, 0.03)",
  },
  chatBox: { display: "flex", mt: 0 },
  textField: { mr: 1 },
};

function Lecture() {
  const { _, lid } = useParams();
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});
  const [value, setValue] = useState(ratings[lid] || 0);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [Loading, setIsLoading] = useState(false)
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { generatedQuestions, isLoading, error } = useSelector(
    (state) => state.questions
  );
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearQuestions());
    };
  }, [lid]);
  const convertToEmbedLink = (url) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[7].length === 11 ? match[7] : null;

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  useEffect(() => {
    setMessages([
      new Message({
        id: 1,
        message:
          "Welcome! Ask your lecture-related questions here—they'll go straight to the instructor.",
      }),
    ]);
    axiosInstance.get(`/get_lecture_by_id/${lid}`).then((response) => {
      setContent((c) => ({
        title: response.data.title,
        link: convertToEmbedLink(response.data.lecture_link),
      }));
    });
  }, [lid]);

  useEffect(() => {
    setValue(ratings[lid] || 0);

    setComments((prev) => ({ ...prev, [lid]: prev?.lid || "" }));
  }, [lid, ratings]);

  const handleCommentChange = (e) => {
    setComments((prev) => ({
      ...prev,
      [lid]: e.target.value,
    }));
  };

  const formatResponse = (text) => {
    if (!text) return "";

    return text.split("\n").map((paragraph, pIndex) => (
      <React.Fragment key={`p-${pIndex}`}>
        {paragraph.split(/(\*\*.*?\*\*)/).map((part, index) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={`${pIndex}-${index}`}>{part.slice(2, -2)}</strong>
            );
          }
          return part;
        })}
        <br />
      </React.Fragment>
    ));
  };
  const generateSummary = () => {
    setIsLoading(true);
    axiosInstance
      .get(`/lecture_summary/${lid}`)
      .then((res) => {
        setContent((c) => ({
          ...c,
          summary: res.data.lecture_summary,
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const summary = formatResponse(content?.summary);
  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() === "") return;
    const userMessage = new Message({ id: 0, message: newMessage });
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    axiosInstance
      .post("/receive_doubt", {
        lecture_id: lid,
        doubt: newMessage,
      })
      .then((response) => {
        setTimeout(() => {
          const responseMessage = new Message({
            id: 1,
            message: response.data.Message,
          });
          setMessages((prevMessages) => [...prevMessages, responseMessage]);
        }, 1000);

        setNewMessage("");
      });
  }, [newMessage]);

  const handleTabChange = useCallback((event, newValue) => {
    setTabIndex(newValue);
  }, []);

  const handleDownloadSummary = () => {
    if (!content?.summary) return;
    const plainText = content?.summary.replace(/\*\*/g, "");
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${content?.title ?? "lecture"}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleReviewSubmit = () => {
    axiosInstance
      .post('/submit_feedback', {
        lecture_id: lid,
        rating: value,
        feedback: comments[lid],
      },
      )
      .then((response) => {
        setComments((prev) => ({
          ...prev,
          [lid]: "",
        }));
      })
      .catch((error) => {
        console.error('Submission error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      });
  };

  const handleRatingChange = (event, newValue) => {
    setValue(newValue);
    setRatings((prev) => ({
      ...prev,
      [lid]: newValue,
    }));
  };

  const formatQuestions = (questions) => {
    if (!questions || !questions.questions) return null;
  
    const handleOptionClick = (questionIndex, selectedOption) => {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: selectedOption
      }));
    };
  
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {questions.questions.map((q, index) => {
          const selectedOption = selectedAnswers[index];
          const isAnswered = selectedOption !== undefined;
  
          return (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "background.paper",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Question {index + 1}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {q.question}
              </Typography>
  
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                {Object.entries(q.options).map(([key, value]) => {
                  const isSelected = selectedOption === key;
                  const isCorrect = key === q.correct_answer;
                  const showCorrect = isAnswered && isCorrect;
                  const showIncorrect = isAnswered && isSelected && !isCorrect;
  
                  return (
                    <Paper
                      key={key}
                      variant="outlined"
                      onClick={() => !isAnswered && handleOptionClick(index, key)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        borderColor: showCorrect 
                          ? 'success.main'
                          : showIncorrect 
                            ? 'error.main' 
                            : 'divider',
                        backgroundColor: showCorrect 
                          ? 'success.light'
                          : showIncorrect 
                            ? 'error.light'
                            : 'background.paper',
                        "&:hover": {
                          backgroundColor: !isAnswered && "action.hover",
                        },
                        cursor: isAnswered ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        transition: "all 0.2s ease-in-out"
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: showCorrect 
                            ? 'success.dark'
                            : showIncorrect 
                              ? 'error.dark'
                              : 'primary.main',
                          fontWeight: 600,
                          minWidth: "24px"
                        }}
                      >
                        {key}.
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{
                          color: showCorrect 
                            ? 'success.dark'
                            : showIncorrect 
                              ? 'error.dark'
                              : 'text.primary'
                        }}
                      >
                        {value}
                        {showCorrect && " ✓"}
                        {showIncorrect && " ✗"}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
              {isAnswered && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 2, 
                    color: selectedOption === q.correct_answer ? 'success.main' : 'error.main',
                    fontWeight: 500
                  }}
                >
                  {selectedOption === q.correct_answer 
                    ? "Correct!" 
                    : `Incorrect. The correct answer is ${q.correct_answer}.`}
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>
    );
  };
  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {content?.title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={styles.videoBox}>
            <iframe
              style={styles.iframe}
              src={content?.link}
              title="Lecture Video"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Tabs
            orientation="horizontal"
            value={tabIndex}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: "divider" }}
            aria-label="Lecture Tabs"
          >
            <Tab icon={<DescriptionIcon />} label="Summary" />
            <Tab icon={<RateReviewIcon />} label="Review" />
            <Tab icon={<ChatIcon />} label="Chat" />
          </Tabs>
          {tabIndex === 0 && (
            <Paper
              elevation={3}
              sx={{ ...styles.tabPanel, backgroundColor: "#fafafa", p: 3 }}
            >
              <Typography variant="h5" gutterBottom>
                Lecture Summary
              </Typography>
              <Box sx={{ ...styles.summaryBox, overflowY: "auto" }}>
                <Typography variant="body1" color="text.secondary">
                  {summary || "Generated summary appears here..."}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={
                    Loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <OfflineBoltRoundedIcon />
                    )
                  }
                  onClick={generateSummary}
                >
                  {Loading ? "Generating..." : "Summarize"}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={!content?.summary}
                  onClick={handleDownloadSummary}
                >
                  <DownloadIcon></DownloadIcon>
                </Button>
              </Box>
            </Paper>
          )}
          {tabIndex === 1 && (
            <Paper
              elevation={3}
              sx={{ ...styles.tabPanel, backgroundColor: "#fafafa", p: 3 }}
            >
              <Typography variant="h5" gutterBottom>
                Review
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography component="legend">Rating:</Typography>
                  <Rating
                    name="lecture-rating"
                    value={value}
                    onChange={handleRatingChange}
                    precision={0.5}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Your Review"
                  multiline
                  rows={3}
                  value={comments[lid]}
                  onChange={handleCommentChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.paper",
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleReviewSubmit}
                >
                  Submit Review
                </Button>
              </Box>
            </Paper>
          )}
          {tabIndex === 2 && (
            <Grow in>
              <Paper
                elevation={3}
                sx={{
                  ...styles.tabPanel,
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                  p: 3,
                  pt: 1,
                }}
              >
                <Box sx={{ maxHeight: 220, overflowY: "auto" }}>
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
                <Box sx={styles.chatBox}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    sx={styles.textField}
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
        </Grid>
      </Grid>
      {generatedQuestions && (
        <Paper
          elevation={2}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <OfflineBoltRoundedIcon color="primary" />
            <Typography variant="h5">Practice Questions</Typography>
          </Box>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
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

Lecture.propTypes = {
  value: PropTypes.number,
  comment: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
  newMessage: PropTypes.string,
  tabIndex: PropTypes.number,
  handleSendMessage: PropTypes.func,
  handleTabChange: PropTypes.func,
};

export default Lecture;
