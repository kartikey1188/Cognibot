import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Student/Dashboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { useEffect } from 'react';
import {useDispatch } from 'react-redux';
import { Navbar } from './components/Navbar';
import { setError } from './redux/slice/authSlice';

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(setError(""));
   }, [dispatch, location]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Other protected routes for instructors/admin (you can add similar routes for them) */}
        {/* <Route
          path="/instructor/*"
          element={
            <PrivateRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}