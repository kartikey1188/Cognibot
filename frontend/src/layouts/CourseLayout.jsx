import { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import TerminalTwoToneIcon from "@mui/icons-material/TerminalTwoTone";
import TerminalIcon from "@mui/icons-material/Terminal";
import MenuIcon from "@mui/icons-material/Menu";
import AssistantIcon from "@mui/icons-material/Assistant";
import { Outlet, Link, useParams } from "react-router-dom";
import axiosClient from "../axiosClient";

const CourseLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { id } = useParams();
  const [openWeek, setOpenWeek] = useState(null);
  const drawerWidth = 280;
  const [selectedItem, setSelectedItem] = useState(null);
  const [content, setContent] = useState([]);

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
        const weekQuestions = questionResponse.data

        groupedByWeek[week].push({
          type: "Assignment",
          title: `Assignment ${week} `,
          icon: AssignmentIcon,
          path: `/course/${id}/assignment/${week}`,
          isGraded: true,
          week: parseInt(week),
          questionCount: weekQuestions.length || 0,
        });
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
          <ListItemButton>
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
    </Box>
  );
};

export default CourseLayout;
