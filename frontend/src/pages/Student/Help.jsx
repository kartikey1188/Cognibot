import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Grow,
  Box,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import AssistantIcon from "@mui/icons-material/Assistant";
import { ChatFeed, Message } from "react-chat-ui";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GradingIcon from "@mui/icons-material/Grading";
import ReactMarkdown from "react-markdown";
import axiosClient from "../../axiosClient";

function Help() {
  const [messages, setMessages] = useState([
    new Message({
      id: 1,
      message:
        "Hi, I am CogniBot! I can help you with handbook and grading related queries. Please select a category to get started.",
    }),
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [queryType, setQueryType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQueryTypeChange = (_, newType) => {
    if (newType !== null) {
      setQueryType(newType);
      setMessages([
        new Message({
          id: 1,
          message:
            "Hi, I am CogniBot! I can help you with handbook and grading related queries.",
        }),
        new Message({
          id: 2,
          message: `I'll help you with ${newType} related questions. What would you like to know?`,
        }),
      ]);
    }
  };

  const formatBotResponse = (text) => {
    if (!text) return "";

    const sections = [];
    let currentSection = [];

    text.split("\n").forEach((paragraph, index) => {
      if (!paragraph.trim()) {
        if (currentSection.length > 0) {
          sections.push([...currentSection]);
          currentSection = [];
        }
        return;
      }

      // Format headings
      if (paragraph.includes(":")) {
        const [title, ...content] = paragraph.split(":");
        currentSection.push(
          <Typography
            variant="h6"
            sx={{ color: "primary.main", mb: 1 }}
            key={`h-${index}`}
          >
            {title.trim()}
          </Typography>
        );
        if (content.length > 0) {
          currentSection.push(
            <Typography variant="body1" sx={{ mb: 1 }} key={`p-${index}`}>
              {content.join(":").trim()}
            </Typography>
          );
        }
      } else {
        // Format bullet points and regular text
        const formattedText = paragraph
          .trim()
          .replace(/^\*\s*/, "• ")
          .replace(/\*\s*/g, "• ");

        currentSection.push(
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              pl: formattedText.startsWith("•") ? 2 : 0,
            }}
            key={`p-${index}`}
          >
            {formattedText}
          </Typography>
        );
      }
    });

    if (currentSection.length > 0) {
      sections.push([...currentSection]);
    }

    return sections.map((section, idx) => (
      <Box key={`section-${idx}`} sx={{ mb: 2 }}>
        {section}
      </Box>
    ));
  };
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userMessage = new Message({ id: 0, message: newMessage });
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const endpoint =
        queryType === "handbook" ? "/api/handbook/query" : "/api/grading/query";
      const response = await axiosClient.post(endpoint, {
        query: newMessage,
        k: 5,
        score_threshold: 0.2,
      });

      const formattedContent = (
        <Box>
          <Box sx={{ mb: 2 }}>
            {formatBotResponse(response.data.answer)}
          </Box>
          {response?.data?.documents?.map((document, index) => {
            
            return document?.content.trim() && (
              <Box 
                key={index} 
                sx={{ 
                  mt: 2,
                  p: 2,
                  bgcolor: 'rgba(0,0,0,0.03)',
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    color: 'text.secondary',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {document.content}
                </Typography>
                {(document.source || document.page_number) && (
                  <Box 
                    sx={{ 
                      mt: 1,
                      pt: 1,
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontStyle: 'italic'
                      }}
                    >
                      Source: {document.source}
                    </Typography>
                    {document?.page_number && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 'medium',
                          bgcolor: 'rgba(0,0,0,0.05)',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        Page {document.page_number}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      );
      const botResponse = new Message({
        id: 1,
        message: formattedContent,
      });

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Bot response error:", err);
    } finally {
      setIsLoading(false);
      setNewMessage("");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: "85vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          height: "100%",
        }}
      >
        <Grow in>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#f8f9fa",
              width: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                pb: 2,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  bgcolor: "primary.main",
                  boxShadow: 2,
                }}
              >
                <AssistantIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: 500 }}
                >
                  Help and Documentation
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  using CogniBot
                </Typography>
              </Box>
              <Box sx={{ ml: "auto" }}>
                <ToggleButtonGroup
                  value={queryType}
                  exclusive
                  onChange={handleQueryTypeChange}
                  size="small"
                >
                  <ToggleButton value="handbook" aria-label="handbook queries">
                    <MenuBookIcon sx={{ mr: 1 }} />
                    Handbook
                  </ToggleButton>
                  <ToggleButton value="grading" aria-label="grading queries">
                    <GradingIcon sx={{ mr: 1 }} />
                    Grading
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                mb: 3,
                overflowY: "auto",
                minHeight: 0,
              }}
            >
              <ChatFeed
                messages={messages}
                showSenderName
                bubblesCentered={false}
                bubbleStyles={{
                  text: {
                    fontSize: 16,
                  },
                  chatbubble: {
                    borderRadius: 16,
                    padding: 16,
                    maxWidth: "80%",
                    whiteSpace: "pre-wrap",
                    "& p": {
                      margin: "8px 0",
                    },
                    "& strong": {
                      color: "primary.main",
                    },
                  },
                }}
                customBubble={(props) => (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor:
                        props.message.id === 0
                          ? "primary.main"
                          : "background.paper",
                      color: props.message.id === 0 ? "white" : "text.primary",
                      maxWidth: "80%",
                      alignSelf:
                        props.message.id === 0 ? "flex-end" : "flex-start",
                      boxShadow: 1,
                      "& .section": {
                        mb: 2,
                      },
                      "& h3": {
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        mb: 1,
                        color: "primary.main",
                      },
                      "& ul": {
                        ml: 2,
                        mb: 1,
                      },
                      "& li": {
                        mb: 0.5,
                      },
                    }}
                  >
                    {props.message.message}
                    {props.message.source && (
                      <Typography className="source" variant="body2">
                        Source: {props.message.source}
                      </Typography>
                    )}
                  </Box>
                )}
              />
              {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <CircularProgress size={32} />
                </Box>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isLoading && handleSendMessage()
                }
                placeholder={
                  queryType
                    ? `Ask about ${queryType}...`
                    : "Select a category to start"
                }
                disabled={isLoading || !queryType}
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: "1rem",
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim() || !queryType}
                sx={{
                  px: 4,
                  borderRadius: 2,
                  fontSize: "1rem",
                }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Grow>
      </Box>
    </Container>
  );
}
export default Help;
