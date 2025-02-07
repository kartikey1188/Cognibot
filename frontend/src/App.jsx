import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Courses from './pages/Student/Courses';
import StudentDashboardLayout from './layouts/StudentDashboardLayout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Recommendations from './pages/Student/Recommendations';
import Profile from './pages/Student/Profile';
import { useEffect } from 'react';
import {useDispatch } from 'react-redux';
import CourseLayout from './layouts/CourseLayout';
import Course from './pages/Student/Course';
import Lecture from './pages/Student/Lecture';
import { setError } from './redux/slice/authSlice';
import Layout from './layouts/Layout';

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(setError(""));
   }, [dispatch, location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<StudentDashboardLayout/>}>
            <Route
              index
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <Courses />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/recommendations"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <Recommendations />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <Profile />
                </PrivateRoute>
              }
            />
  
          </Route>

          <Route path="/course" element={<CourseLayout/>}>
            <Route index element={
                <PrivateRoute allowedRoles={['student']}>
                  <Course/>
                </PrivateRoute>
              } />
            <Route path="/course/lecture" element={
                <PrivateRoute allowedRoles={['student']}>
                  <Lecture/>
                </PrivateRoute>
              } />
          </Route>

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
        </Route>
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