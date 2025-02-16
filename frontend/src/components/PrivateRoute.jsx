import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { fetchUser } from "../redux/slice/authSlice";
import { Box, CircularProgress } from "@mui/material";

const PrivateRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const fetchAttempted = useRef(false);

  useEffect(() => {
    if (!fetchAttempted.current) {
      fetchAttempted.current = true;
      dispatch(fetchUser())
        .unwrap()
        .catch(() => {
          fetchAttempted.current = false;
        });
    }
  }, [dispatch]);

  if (loading || !fetchAttempted.current) {
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

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;