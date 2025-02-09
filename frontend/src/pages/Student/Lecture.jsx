import { useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { Typography, Box, Paper, Button, Rating, TextField, Grow, Container, Grid, Tabs, Tab } from "@mui/material";
import OfflineBoltRoundedIcon from "@mui/icons-material/OfflineBoltRounded";
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DescriptionIcon from '@mui/icons-material/Description';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ChatIcon from '@mui/icons-material/Chat';
import { ChatFeed, Message } from 'react-chat-ui';

const styles = {
  container: { mt: 4 },
  videoBox: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%", // 16:9 aspect ratio
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
    boxShadow: "inset 0px 1px 2px 1px rgba(0,0,0,0.2), inset 0px 4px 5px 0px rgba(0, 0, 0, 0.03)",
  },
  chatBox: { display: 'flex', mt: 2 },
  textField: { mr: 1 },
};

function Lecture() {
  const [value, setValue] = useState(0);
  const [comment, setComment] = useState('');
  const [messages, setMessages] = useState([
    new Message({ id: 1, message: 'Welcome to the lecture chat! Feel free to discuss the content here.' }),
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() === '') return;

    const userMessage = new Message({ id: 0, message: newMessage });
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Simulate an automated response
    setTimeout(() => {
      const responseMessage = new Message({ id: 1, message: 'Thank you for your message. We will get back to you shortly.' });
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);

    setNewMessage('');
  }, [newMessage]);

  const handleTabChange = useCallback((event, newValue) => {
    setTabIndex(newValue);
  }, []);

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Lecture Name
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={styles.videoBox}>
            <iframe
              style={styles.iframe}
              src="https://www.youtube.com/embed/p4D8-brdrZo?si=A4EN9dSP1qcRlgzk"
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
            sx={{ borderBottom: 1, borderColor: 'divider' }}
            aria-label="Lecture Tabs"
          >
            <Tab icon={<DescriptionIcon />} label="Summary" />
            <Tab icon={<RateReviewIcon />} label="Review" />
            <Tab icon={<ChatIcon />} label="Chat" />
          </Tabs>
          {tabIndex === 0 && (
            <Paper elevation={3} sx={{ ...styles.tabPanel, backgroundColor: '#fafafa', p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Lecture Summary
              </Typography>
              <Box sx={{ ...styles.summaryBox, overflowY: 'auto' }}>
                <Typography variant="body1" color="text.secondary">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
                  eveniet, non laborum facilis atque vero eligendi nisi cum a quo ab
                  possimus quaerat nihil ipsa ea tenetur? Tempore, ipsum nostrum?
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<OfflineBoltRoundedIcon />}
                sx={{ mt: 2 }}
                onClick={() => console.log("Generate Summary")}
              >
                Summarize
              </Button>
            </Paper>
          )}
          {tabIndex === 1 && (
            <Paper elevation={3} sx={{ ...styles.tabPanel, backgroundColor: '#fafafa', p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Review
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography component="legend">Rating:</Typography>
                  <Rating
                    name="lecture-rating"
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    precision={0.5}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Your Review"
                  multiline
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => console.log({ rating: value, comment })}
                >
                  Submit Review
                </Button>
              </Box>
            </Paper>
          )}
          {tabIndex === 2 && (
            <Grow in>
              <Paper elevation={3} sx={{ ...styles.tabPanel, borderRadius: 2, backgroundColor: '#fafafa', p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Lecture Chat
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  <ChatFeed
                    messages={messages}
                    showSenderName
                    bubblesCentered={false}
                    bubbleStyles={{
                      text: {
                        fontSize: 16
                      },
                      chatbubble: {
                        borderRadius: 20,
                        padding: 10
                      }
                    }}
                  />
                </Box>
                <Box sx={styles.chatBox}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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