import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import RecommendIcon from "@mui/icons-material/Recommend";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/slice/uiSlice";
const drawerWidth = 300;
import { useSelector } from "react-redux";
import HelpIcon from '@mui/icons-material/Help';

export default function StudentDashboardLayout() {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const dispatch = useDispatch();
  const location = useLocation();

  const items = [
    { icon: <BookIcon />, text: "Current Courses", path: "/dashboard" },
    // {
    //   icon: <RecommendIcon />,
    //   text: "Study Recommendations",
    //   path: "/dashboard/recommendations",
    // },
    { icon: <AccountCircleRoundedIcon />, text: "Profile", path: "/dashboard/profile" },
    { icon: <HelpIcon/> , text: "Help", path: "/dashboard/help" },
  ];

  const drawerContent = (
    <Box sx={{ width: 'fit-content' }}>
      <Typography variant="h6" sx={{ p: 3, textAlign: "center"}}>
        STUDENT
      </Typography>
      <Divider />
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton component={Link} to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#3db9f2',
                '&:hover': {
                  backgroundColor: '#3db9f2',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            >
              <ListItemIcon sx={{minWidth:'40px'}}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? sidebarOpen : true}
        onClose={() => dispatch(toggleSidebar())}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          wrap : 'nowrap',
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            zIndex: 0,
           
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}
