import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { fetchUser } from "../redux/slice/authSlice";
import { Box, CircularProgress } from "@mui/material";

const PublicRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);


  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    const routes = {
      student: '/dashboard',
      instructor: '/instructor',
      admin: '/admin'
    };
    return <Navigate to={routes[user.role] || '/'} replace />;
  }

  return children;
};

export default PublicRoute;