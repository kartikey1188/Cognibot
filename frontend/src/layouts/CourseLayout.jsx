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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import TerminalTwoToneIcon from "@mui/icons-material/TerminalTwoTone";
import TerminalIcon from "@mui/icons-material/Terminal";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet } from "react-router-dom";

const CourseLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openWeek, setOpenWeek] = useState(null);
  const drawerWidth = 280;

  const weeks = [
    {
      week: 1,
      content: [
        { type: "Lecture", title: "Introduction", icon: OndemandVideoIcon },
        {
          type: "PA",
          title: "Practice Assignment 1",
          icon: AssignmentOutlinedIcon,
        },
        { type: "GA", title: "Graded Assignment 1", icon: AssignmentIcon },
        {
          type: "PPA",
          title: "Practice Programming 1",
          icon: TerminalTwoToneIcon,
        },
        { type: "GRPA", title: "Graded Programming 1", icon: TerminalIcon },
      ],
    },
    {
      week: 2,
      content: [
        {
          type: "Lecture",
          title: "Advanced Concepts",
          icon: OndemandVideoIcon,
        },
        {
          type: "PA",
          title: "Practice Assignment 2",
          icon: AssignmentOutlinedIcon,
        },
        { type: "GA", title: "Graded Assignment 2", icon: AssignmentIcon },
        {
          type: "PPA",
          title: "Practice Programming 2",
          icon: TerminalTwoToneIcon,
        },
        { type: "GRPA", title: "Graded Programming 2", icon: TerminalIcon },
      ],
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: isOpen ? drawerWidth : 65,
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
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? 'space-between' : 'center',
            bgcolor: "primary.main",
            color: "primary.contrastText",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {isOpen && <Typography variant="subtitle1">Course Content</Typography>}
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{ color: "inherit" }}
          >
            {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
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
                    <ListItemButton key={idx} sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ transition: "color 0.2s", minWidth: 36 }}>
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
      </Drawer>
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        mt: '100px', // match navbar height
        mx: '10px',
        // backgroundColor: 'yellow',
        transition: 'margin-left 0.3s ease-in-out',
        width: { sm: `calc(100% - ${isOpen ? drawerWidth : 65}px)` }
      }}
    >
      <Outlet />
    </Box>
    </Box>
  );
};

export default CourseLayout;
