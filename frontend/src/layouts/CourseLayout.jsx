import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  TextField,
  Paper,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import TerminalIcon from "@mui/icons-material/Terminal";
import MenuIcon from "@mui/icons-material/Menu";
import AssistantIcon from "@mui/icons-material/Assistant";
import { Outlet, Link, useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { 
  setGeneratedQuestions, 
  setLoading, 
  setError 
} from '../redux/slice/questionsSlice';

const CourseLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { id, lid } = useParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [openWeek, setOpenWeek] = useState(null);
  const drawerWidth = 280;
  const [selectedItem, setSelectedItem] = useState(null);
  const [content, setContent] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content: "Hi! I'm CogniBot. Chat with me to seek clarifications.",
    },
  ]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    Promise.all([
      axiosClient.get(`/lectures/${id}`),
      axiosClient.get(`/api/questions`),
    ]).then(([lectureResponse, questionResponse]) => {
      const groupedByWeek = lectureResponse.data.reduce((acc, lecture) => {
        const week = lecture.week;
        if (!acc[week]) {
          acc[week] = [];
        }
        acc[week].push({
          type: "Lecture",
          title: lecture.title,
          icon: OndemandVideoIcon,
          path: `/course/${id}/lecture/${lecture.lecture_id}`,
          isGraded: false,
          lectureNumber: lecture.lecture_number,
          lecture_link: lecture.lecture_link,
        });
        return acc;
      }, {});

      Object.keys(groupedByWeek).forEach((week) => {
        const weekQuestions = questionResponse.data;

        groupedByWeek[week].push({
          type: "Assignment",
          title: `Assignment ${week} `,
          icon: AssignmentIcon,
          path: `/course/${id}/assignment/${week}`,
          isGraded: true,
          week: parseInt(week),
          questionCount: weekQuestions.length || 0,
        });
        if (id === "1") {
          groupedByWeek[week].push({
            type: "Programming",
            title: `Programming Assignment ${week}`,
            icon: TerminalIcon,
            path: `/course/${id}/programming/${week}`,
            isGraded: true,
            week: parseInt(week),
          });
        }
      });

      const formattedWeeks = Object.keys(groupedByWeek)
        .map((weekNum) => ({
          week: parseInt(weekNum),
          content: groupedByWeek[weekNum].sort((a, b) => {
            if (a.type !== b.type) {
              return a.type === "Lecture" ? -1 : 1;
            }
            return (a.lectureNumber || 0) - (b.lectureNumber || 0);
          }),
        }))
        .sort((a, b) => a.week - b.week);

      setContent(formattedWeeks);
    });
  }, [id]);

  const weeks = content;
  const handleGenerateQuestions = async () => {
    if (!lid) return;

    setIsGenerating(true);
    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        content: "Generate extra questions for this lecture",
      },
    ]);

    try {
      const response = await axiosClient.post("/extra_questions", {
        lecture_id: lid,
      });
      dispatch(setGeneratedQuestions(response.data))
      console.log(response.data)
      setChatOpen(false);
    } catch (error) {
      dispatch(setError("Failed to generate questions"));
      setChatHistory((prev) => [
        ...prev.filter((msg) => !msg.loading),
        {
          role: "system",
          content: "Sorry, I couldn't generate questions at this time.",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
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

  const handleChatMessage = async () => {
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        content: chatMessage,
      },
    ]);
    setChatHistory((prev) => [
      ...prev,
      {
        role: "system",
        content: "Thinking...",
        loading: true,
      },
    ]);

    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("quest", chatMessage);

      const response = await axiosClient.post("/clarification", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setChatHistory((prev) => [
        ...prev.filter((msg) => !msg.loading),
        {
          role: "system",
          content: response.data.response
            ? formatResponse(response.data.response)
            : "I couldn't process your request. Please try again.",
        },
      ]);
      setChatMessage("");
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [
        ...prev.filter((msg) => !msg.loading),
        {
          role: "system",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setChatMessage("");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: isOpen ? drawerWidth : 65,
          zIndex: 2,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isOpen ? drawerWidth : 65,
            top: "68px",
            zIndex: 0,
            height: "calc(100% - 64px)",
            transition: "width 0.3s ease-out",
            overflowX: "hidden",
            backgroundColor: "background.default",
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "space-between" : "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {isOpen && (
            <Typography
              variant="subtitle1"
              component={Link}
              to={`/course/${id}`}
            >
              Course Overview
            </Typography>
          )}
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{ color: "inherit" }}
          >
            {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <List>
            {weeks.map((week, index) => (
              <div key={index}>
                <ListItemButton
                  onClick={() => setOpenWeek(openWeek === index ? null : index)}
                  sx={{
                    minHeight: 48,
                    justifyContent: isOpen ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  {!isOpen ? (
                    <Typography
                      sx={{
                        minWidth: 36,
                        textAlign: "center",
                        fontSize: "1rem",
                      }}
                    >
                      {week.week}
                    </Typography>
                  ) : (
                    <>
                      <ListItemText primary={`Week ${week.week}`} />
                      {openWeek === index ? <ExpandLess /> : <ExpandMore />}
                    </>
                  )}
                </ListItemButton>
                <Collapse in={openWeek === index && isOpen} timeout="auto">
                  <List component="div" disablePadding>
                    {week.content.map((item, idx) => (
                      <ListItemButton
                        key={idx}
                        sx={{ pl: 4 }}
                        component={Link}
                        to={{
                          pathname: item.path,
                          search: `?isGraded=${item.isGraded}`,
                        }}
                        selected={selectedItem === `${week.week}-${idx}`}
                        onClick={() => setSelectedItem(`${week.week}-${idx}`)}
                      >
                        <ListItemIcon
                          sx={{ transition: "color 0.2s", minWidth: 36 }}
                        >
                          <item.icon />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={
                            item.type === "Assignment"
                              ? `${item.questionCount} questions`
                              : null
                          }
                          sx={{
                            transition: "opacity 0.2s",
                            opacity: isOpen ? 1 : 0,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </div>
            ))}
          </List>
        </Box>

        <List
          sx={{
            borderTop: 1,
            paddingTop: 0,
            borderColor: "divider",
            width: "100%",
          }}
        >
          <ListItemButton onClick={() => setChatOpen(true)}>
            <ListItemIcon>
              <AssistantIcon></AssistantIcon>
            </ListItemIcon>
            <ListItemText primary="CogniBot" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "100px",
          mx: "10px",
          transition: "margin-left 0.3s ease-in-out",
          width: { sm: `calc(100% - ${isOpen ? drawerWidth : 65}px)` },
        }}
      >
        <Outlet />
      </Box>
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 500,
            p: 2,
            height: "100%",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">CogniBot</Typography>
            <IconButton onClick={() => setChatOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {chatHistory.map((msg, index) => (
              <Paper
                key={index}
                sx={{
                  p: 1,
                  bgcolor:
                    msg.role === "user" ? "primary.light" : "background.paper",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}
              >
                <Typography variant="body2">
                  {msg.loading ? <CircularProgress size={20} /> : msg.content}
                </Typography>
              </Paper>
            ))}
            {lid && (
              <Button
                variant="outlined"
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                startIcon={
                  isGenerating ? (
                    <CircularProgress size={20} />
                  ) : (
                    <AssignmentIcon />
                  )
                }
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                {isGenerating
                  ? "Generating Questions..."
                  : "Generate Extra Questions"}
              </Button>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleChatMessage()}
              placeholder="Type your message..."
            />
            <IconButton
              color="primary"
              onClick={handleChatMessage}
              disabled={!chatMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CourseLayout;
