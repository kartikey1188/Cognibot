import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

function App() {
  return (
    <Router>
      <nav className="flex fixed top-0 gap-4 p-4 bg-gray-200">
        <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} /> {/* Redirect unknown routes to Login */}
      </Routes>
    </Router>
  );
}

export default App;
