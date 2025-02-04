import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import {Link} from 'react-router-dom';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BookIcon from '@mui/icons-material/Book';
import RecommendIcon from '@mui/icons-material/Recommend';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Outlet } from 'react-router-dom';
const drawerWidth = 240;

export default function PermanentDrawerLeft() {
    const items = [
        { icon: <BookIcon/>, text: 'Current Courses', path:'/dashboard' },
        { icon: <RecommendIcon />, text: 'Study Recommendations', path:'/recommendations' },
        { icon: <AccountCircleRoundedIcon/>, text: 'Profile', path:'/profile' },
    ]

  return (
    <>
      {/* <Navbar></Navbar> */}
    <Box sx={{ display: 'flex', zIndex:0,  fontFamily: "'Funnel Display', serif"}}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, zIndex:0, paddingBottom:5}}
      >
      </AppBar>
      <Drawer
        sx={{
          width: "max-content",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: "max-content",
            boxSizing: 'border-box',
            position: 'fixed',
            top:68,
            zIndex:1,
            wrap: "nowrap",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* <Toolbar /> */}
        <Divider />
        <List>
          {items.map((item, index) => (
            <ListItem key={index} style={{paddingInline:12, paddingBlock:3}} >
              <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
              }}
              >
                <ListItemIcon style={{minWidth: '40px'}}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, borderRadius:'2px', bgcolor: '#fcf8f7', p:5, position : 'absolute', top: 100, left: 330, right: 30}}
      >
        <Outlet></Outlet>
      </Box>
    </Box>
    </>
  );
}