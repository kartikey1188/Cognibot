import * as React from "react";
import { Link, useLocation } from "react-router-dom";
//prettier-ignore
import {Box, Drawer,CssBaseline,List,Typography,Divider,ListItem,ListItemButton,ListItemIcon,ListItemText,useMediaQuery,} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../redux/slice/uiSlice";
const drawerWidth = 215;
import { useSelector } from "react-redux";
import DataUsageIcon from '@mui/icons-material/DataUsage';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';

export default function AdminDashboardLayout() {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const dispatch = useDispatch();
  const location = useLocation();

  const items = [
    { icon: <DataUsageIcon />, text: "Query limits", path: "/admin" },
    // {
    //   icon: <AccountCircleRoundedIcon />,
    //   text: "User Management",
    //   path: "/admin/management",
    // },
    // { icon: <SettingsIcon />, text: "System Settings", path: "/admin/settings" },
  ];

  const drawerContent = (
    <Box sx={{ }}>
      <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
        ADMIN
      </Typography>
      <Divider />
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#3db9f2",
                  "&:hover": {
                    backgroundColor: "#3db9f2",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px" }}>{item.icon}</ListItemIcon>
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
          keepMounted: true, // Helps with performance on mobile
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          wrap: "nowrap",
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            zIndex: 0,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}
