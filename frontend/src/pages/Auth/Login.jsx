import { useState, useEffect } from "react";
import AuthForm from "@/components/AuthForm.jsx";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { loginUser} from "../../redux/slice/authSlice";
import { setError } from "../../redux/slice/authSlice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [password, setPassword] = useState("");
  

  const fields = [
    { label: "Email", type: "email", onChange: (e) => setEmail(e.target.value) },
    { label: "Password", type: "password", showPassword, togglePassword, onChange: (e) => setPassword(e.target.value) }
  ];


  useEffect(() => {
    if(user) {
      switch (user.role) {
        case 'student':
          navigate('/dashboard');
          break;
        case 'instructor':
          navigate('/dashboard/instructor');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      dispatch(setError("Oops! Don't forget to fill in all the fields."));
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <>
      <AuthForm title="Log In" fields={fields} buttonText="Log In" onSubmit={handleLogin} />
    </>
);
}

export default Login;
