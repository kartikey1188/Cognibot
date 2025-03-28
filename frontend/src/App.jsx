import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Courses from "./pages/Student/Courses";
import StudentDashboardLayout from "./layouts/StudentDashboardLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Recommendations from "./pages/Student/Recommendations";
import Profile from "./pages/Student/Profile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import CourseLayout from "./layouts/CourseLayout";
import Course from "./pages/Student/Course";
import Help from "./pages/Student/Help";
import Assignment from "./pages/Student/Assignment";
import Lecture from "./pages/Student/Lecture";
import ProgrammingAssignment from "./pages/Student/ProgrammingAssignment";
import { setError } from "./redux/slice/authSlice";
import Layout from "./layouts/Layout";
import PublicRoute from "./components/PublicRoute";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import QueryLimits from "./pages/Admin/QueryLimits";
import LandingPage from "./pages/Landing";
import Analytics from "./pages/Admin/Analytics";
import InstructorDashboard from "./pages/Instructor/InstructorDashboard";

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(setError(""));
  }, [dispatch, location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PublicRoute>
                <LandingPage></LandingPage>
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route path="/dashboard" element={<StudentDashboardLayout />}>
            <Route
              index
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <Courses />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/recommendations"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <Recommendations />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/help"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <Help />
                </PrivateRoute>
              }
            />
          </Route>

          <Route path="/course/:id" element={<CourseLayout />}>
            <Route
              index
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <Course />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:id/lecture/:lid"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <Lecture />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:id/assignment/:aid"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <Assignment />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:id/programming/:paid"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <ProgrammingAssignment />
                </PrivateRoute>
              }
            />
          </Route>

          <Route
            path="/instructor"
            element={
              <PrivateRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route
              index
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <QueryLimits />
                </PrivateRoute>
              }
            />
            <Route path="/admin/analytics" element={
              <PrivateRoute>
                <Analytics></Analytics>
              </PrivateRoute>
            }>
            </Route>
          </Route>
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
