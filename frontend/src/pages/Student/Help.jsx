import React, { useState, useRef, useEffect } from "react";
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
  Stack,
} from "@mui/material";
import AssistantIcon from "@mui/icons-material/Assistant";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GradingIcon from "@mui/icons-material/Grading";
import axiosClient from "../../axiosClient";

function Help() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hi! I can help you with handbook and grading related queries. Please select a category to get started.",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [queryType, setQueryType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleQueryTypeChange = (_, newType) => {
    if (newType !== null) {
      setQueryType(newType);
      setMessages([
        {
          id: 1,
          type: "bot",
          content:
            "Hi! I can help you with handbook and grading related queries.",
        },
        {
          id: 2,
          type: "bot",
          content: `I'll help you with ${newType} related questions. What would you like to know?`,
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        content: newMessage,
      },
    ]);

    setIsLoading(true);
    setError(null);

    try {
      const endpoint =
        queryType === "handbook" ? "/api/handbook/query" : "/api/grading/query";
      const response = await axiosClient.post(endpoint, {
        query:
          queryType === "handbook"
            ? `Carefully analyze the following query and provide a clear, accurate, and well-reasoned answer. Do not refer to or mention any specific documents, sources, or materials used to formulate your response. Focus solely on delivering a direct, comprehensive, and self-contained explanation.\n\nQuery:\n${newMessage}`
            : `You will be provided with detailed course-related documents that include information such as exam schedules, OPPE dates, grading policies, assignment deadlines, bonus criteria, course eligibility rules, and other academic procedures. Each course entry begins with the course title and includes relevant structured content.\n\nYour task is to answer the query using **only** the relevant information from the provided content. Do **not** mention the document or its structure in your response. Your response should be accurate, self-contained, and focused entirely on the information retrieved from the content.\n\nPlease follow these rules when answering:\n- Use only verifiable information from the text.\n- Do not speculate or include information not present in the content.\n- If the answer cannot be derived from the content, clearly state that. Do not refer to or mention any specific documents, sources.\n\nQuery:\n${newMessage}`,
        k: 20,
        score_threshold: 0.2,
      });

      const formattedContent = (
        <Box>
          <Box sx={{ mb: 2 }}>{formatBotResponse(response.data.answer)}</Box>
        </Box>
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content: formattedContent,
        },
      ]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Bot response error:", err);
    } finally {
      setIsLoading(false);
      setNewMessage("");
    }
  };

  const MessageBubble = ({ message }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: message.type === "user" ? "flex-end" : "flex-start",
        mb: 2,
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: "80%",
          p: 2,
          borderRadius: 2,
          bgcolor:
            message.type === "user" ? "primary.main" : "background.paper",
          color: message.type === "user" ? "white" : "text.primary",
          boxShadow: 1,
        }}
      >
        {message.content}
      </Box>
    </Box>
  );

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
                  For Handbook/Grading Document
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
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
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
              <div ref={chatEndRef} />
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
