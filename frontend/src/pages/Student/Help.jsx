import React, { useState } from 'react';
import { Typography, TextField, Button, Paper, Grow, Box, Container } from '@mui/material';
import { ChatFeed, Message } from 'react-chat-ui';

function Help() {
  const [messages, setMessages] = useState([
    new Message({ id: 1, message: 'Welcome to the help chat! How can I assist you today?' }),
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const userMessage = new Message({ id: 0, message: newMessage });
    setMessages([...messages, userMessage]);

    // Simulate an automated response
    setTimeout(() => {
      const responseMessage = new Message({ id: 1, message: 'Thank you for your message. We will get back to you shortly.' });
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);

    setNewMessage('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          HELP AND DOCUMENTATION
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ mb: 4, textAlign: 'center' }}
        >
          Welcome to the help section. Here you can find answers to your questions and get assistance from our support team.
        </Typography>

        <Grow in>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f5f5f5', maxWidth: '600px', width: '100%' }}>
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

            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                sx={{ mr: 1 }}
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
      </Box>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2">
          Need more help? Visit our <a href="/faq">FAQ</a> or <a href="/contact">Contact Us</a>.
        </Typography>
      </Box>
    </Container>
  );
}

export default Help;