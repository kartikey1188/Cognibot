import { useState } from "react";
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
import Divider from "@mui/material/Divider";
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
import { Outlet, Link, useLocation } from "react-router-dom";

const CourseLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openWeek, setOpenWeek] = useState(null);
  const drawerWidth = 280;
  const location = useLocation();
  const weeks = [
    {
      week: 1,
      content: [
        {
          type: "Lecture",
          title: "Introduction",
          icon: OndemandVideoIcon,
          path: "/course/lecture",
        },
        {
          type: "PA",
          title: "Practice Assignment 1",
          icon: AssignmentOutlinedIcon,
          path: "/course/assignment",
        },
        {
          type: "GA",
          title: "Graded Assignment 1",
          icon: AssignmentIcon,
          path: "/course/assignment",
        },
        {
          type: "PPA",
          title: "Practice Programming 1",
          icon: TerminalTwoToneIcon,
          path: "/course/assignment",
        },
        {
          type: "GRPA",
          title: "Graded Programming 1",
          icon: TerminalIcon,
          path: "/course/assignment",
        },
      ],
    },
    {
      week: 1,
      content: [
        {
          type: "Lecture",
          title: "Introduction",
          icon: OndemandVideoIcon,
          path: "/course/lecture",
        },
        {
          type: "PA",
          title: "Practice Assignment 1",
          icon: AssignmentOutlinedIcon,
          path: "/course/assignment",
        },
        {
          type: "GA",
          title: "Graded Assignment 1",
          icon: AssignmentIcon,
          path: "/course/assignment",
        },
        {
          type: "PPA",
          title: "Practice Programming 1",
          icon: TerminalTwoToneIcon,
          path: "/course/assignment",
        },
        {
          type: "GRPA",
          title: "Graded Programming 1",
          icon: TerminalIcon,
          path: "/course/assignment",
        },
      ],
    },
    {
      week: 1,
      content: [
        {
          type: "Lecture",
          title: "Introduction",
          icon: OndemandVideoIcon,
          path: "/course/lecture",
        },
        {
          type: "PA",
          title: "Practice Assignment 1",
          icon: AssignmentOutlinedIcon,
          path: "/course/assignment",
        },
        {
          type: "GA",
          title: "Graded Assignment 1",
          icon: AssignmentIcon,
          path: "/course/assignment",
        },
        {
          type: "PPA",
          title: "Practice Programming 1",
          icon: TerminalTwoToneIcon,
          path: "/course/assignment",
        },
        {
          type: "GRPA",
          title: "Graded Programming 1",
          icon: TerminalIcon,
          path: "/course/assignment",
        },
      ],
    },
    {
      week: 1,
      content: [
        {
          type: "Lecture",
          title: "Introduction",
          icon: OndemandVideoIcon,
          path: "/course/lecture",
        },
        {
          type: "PA",
          title: "Practice Assignment 1",
          icon: AssignmentOutlinedIcon,
          path: "/course/assignment",
        },
        {
          type: "GA",
          title: "Graded Assignment 1",
          icon: AssignmentIcon,
          path: "/course/assignment",
        },
        {
          type: "PPA",
          title: "Practice Programming 1",
          icon: TerminalTwoToneIcon,
          path: "/course/assignment",
        },
        {
          type: "GRPA",
          title: "Graded Programming 1",
          icon: TerminalIcon,
          path: "/course/assignment",
        },
      ],
    },
    {
      week: 1,
      content: [
        {
          type: "Lecture",
          title: "Introduction",
          icon: OndemandVideoIcon,
          path: "/course/lecture",
        },
        {
          type: "PA",
          title: "Practice Assignment 1",
          icon: AssignmentOutlinedIcon,
          path: "/course/assignment",
        },
        {
          type: "GA",
          title: "Graded Assignment 1",
          icon: AssignmentIcon,
          path: "/course/assignment",
        },
        {
          type: "PPA",
          title: "Practice Programming 1",
          icon: TerminalTwoToneIcon,
          path: "/course/assignment",
        },
        {
          type: "GRPA",
          title: "Graded Programming 1",
          icon: TerminalIcon,
          path: "/course/assignment",
        },
      ],
    },
    {
      week: 1,
      content: [
        {
          type: "Lecture",
          title: "Introduction",
          icon: OndemandVideoIcon,
          path: "/course/lecture",
        },
        {
          type: "PA",
          title: "Practice Assignment 1",
          icon: AssignmentOutlinedIcon,
          path: "/course/assignment",
        },
        {
          type: "GA",
          title: "Graded Assignment 1",
          icon: AssignmentIcon,
          path: "/course/assignment",
        },
        {
          type: "PPA",
          title: "Practice Programming 1",
          icon: TerminalTwoToneIcon,
          path: "/course/assignment",
        },
        {
          type: "GRPA",
          title: "Graded Programming 1",
          icon: TerminalIcon,
          path: "/course/assignment",
        },
      ],
    },
    {
      week: 1,
      content: [
        {
          type: "Lecture",
          title: "Introduction",
          icon: OndemandVideoIcon,
          path: "/course/lecture",
        },
        {
          type: "PA",
          title: "Practice Assignment 1",
          icon: AssignmentOutlinedIcon,
          path: "/course/assignment",
        },
        {
          type: "GA",
          title: "Graded Assignment 1",
          icon: AssignmentIcon,
          path: "/course/assignment",
        },
        {
          type: "PPA",
          title: "Practice Programming 1",
          icon: TerminalTwoToneIcon,
          path: "/course/assignment",
        },
        {
          type: "GRPA",
          title: "Graded Programming 1",
          icon: TerminalIcon,
          path: "/course/assignment",
        },
      ],
    },
    {
      week: 2,
      content: [
        {
          type: "Lecture",
          title: "Advanced Concepts",
          icon: OndemandVideoIcon,
          path: "/course/lecture",
        },
        {
          type: "PA",
          title: "Practice Assignment 2",
          icon: AssignmentOutlinedIcon,
        },
        {
          type: "GA",
          title: "Graded Assignment 2",
          icon: AssignmentIcon,
          path: "/course/assignment",
        },
        {
          type: "PPA",
          title: "Practice Programming 2",
          icon: TerminalTwoToneIcon,
          path: "/course/assignment",
        },
        {
          type: "GRPA",
          title: "Graded Programming 2",
          icon: TerminalIcon,
          path: "/course/assignment",
        },
      ],
    },
  ];

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
            <Typography variant="subtitle1" component={Link} to="/course">
              Course Content
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
                        to={item.path}
                        selected={location.pathname === item.path}
                      >
                        <ListItemIcon
                          sx={{ transition: "color 0.2s", minWidth: 36 }}
                        >
                          <item.icon />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
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
            paddingTop : 0,
            borderColor: "divider",
            width: '100%'
          }}
        >
          <ListItemButton >
            <ListItemIcon>
              <AssistantIcon></AssistantIcon>
            </ListItemIcon>
            <ListItemText primary="Ai agent" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "100px", // match navbar height
          mx: "10px",
          // backgroundColor: 'yellow',
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
