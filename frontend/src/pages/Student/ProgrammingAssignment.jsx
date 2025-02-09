import React, { useState, useCallback } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  CircularProgress,
  Alert, 
  Divider, 
  Grow, 
  IconButton 
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatFeed, Message } from 'react-chat-ui';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

function ProgrammingAssignment() {
  const [code, setCode] = useState('# Write your solution here\n');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([
    new Message({ id: 1, message: 'Welcome to the assignment chat! Feel free to discuss the questions here.', senderName: 'System', timestamp: new Date().toLocaleTimeString() }),
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  const sampleQuestion = {
    title: 'Sum of Two Numbers',
    description: 'Write a function `sum(a, b)` that takes two numbers as input and returns their sum.',
    example: 'Input: a = 5, b = 3\nOutput: 8'
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': 'YOUR_API_KEY',
        },
        body: JSON.stringify({
          script: code,
          language: 'python3',
          versionIndex: '3',
          clientId: 'YOUR_CLIENT_ID',
          clientSecret: 'YOUR_CLIENT_SECRET',
        }),
      });

      const data = await response.json();
      setResult(data.output);
      setSubmitted(true);
    } catch (err) {
      setError('An error occurred while submitting your code.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode('# Write your solution here\n');
    setSubmitted(false);
    setResult(null);
    setError(null);
  };

  const ResultMessage = () => (
    <Paper sx={{ mt: 3, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }} aria-live="polite">
      <Typography variant="h6">Output:</Typography>
      <Typography variant="body1">{result}</Typography>
    </Paper>
  );

  const ErrorMessage = () => (
    <Alert severity="error" sx={{ mt: 3 }} aria-live="assertive">
      {error}
    </Alert>
  );

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() === '') return;

    const userMessage = new Message({ id: 0, message: newMessage, senderName: 'You', timestamp: new Date().toLocaleTimeString() });
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setTimeout(() => {
      const responseMessage = new Message({ id: 1, message: 'Thank you for your message. We will get back to you shortly.', senderName: 'System', timestamp: new Date().toLocaleTimeString() });
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);

    setNewMessage('');
  }, [newMessage]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Programming Assignment
      </Typography>

      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">{sampleQuestion.title}</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{sampleQuestion.description}</Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>Example: {sampleQuestion.example}</Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" gutterBottom>
          Write your Python code below:
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your Python code here..."
          sx={{ mb: 2 }}
          aria-label="Python code editor"
        />

        <SyntaxHighlighter language="python" style={materialDark} showLineNumbers>
          {code}
        </SyntaxHighlighter>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Character count: {code.length}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ flexGrow: 1, mr: 1 }}
            aria-label="Submit code"
          >
            {loading ? <CircularProgress size={24} aria-label="Loading" /> : 'Run Code'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            disabled={loading}
            sx={{ flexGrow: 1, ml: 1 }}
            aria-label="Reset code"
          >
            Reset
          </Button>
        </Box>

        {submitted && result && <ResultMessage />}
        {error && <ErrorMessage />}
      </Paper>

      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <IconButton
          color="primary"
          onClick={() => setChatOpen(!chatOpen)}
          sx={{ bgcolor: 'background.paper', borderRadius: '50%', boxShadow: 3 }}
        >
          {chatOpen ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </Box>

      {chatOpen && (
        <Grow in>
          <Paper elevation={3} sx={{ position: 'fixed', bottom: 80, right: 16, width: 300, height: 400, p: 2, borderRadius: 2, backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Assignment Chat
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
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
            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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

export default ProgrammingAssignment;