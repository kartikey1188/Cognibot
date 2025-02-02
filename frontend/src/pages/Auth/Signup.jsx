import { useState, useEffect} from "react";
import AuthForm from "@/components/AuthForm.jsx";
import axiosInstance from "@/axiosClient.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slice/authSlice";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((pre) => !pre);
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm_password, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("student")


  const dispatch = useDispatch()
  const navigate = useNavigate()
  const IamA = [
    { value: "student", label: "Student" },
    { value: "instructor", label: "Instructor" }
  ];

  const fields = [
    { label: "Email", type: "email", defaultValue: "", onChange : (e) => setEmail(e.target.value) },
    { label: "Name", type: "text", defaultValue: "", onChange : (e) => setName(e.target.value) },
    { label: "Password", type: "password", showPassword: showPassword, togglePassword:togglePassword, onChange : (e) => setPassword(e.target.value) },
    { label: "Confirm Password", type: "password", showPassword: showConfirmPassword,togglePassword: toggleConfirmPassword, onChange : (e) => setConfirmPassword(e.target.value) },
    { label: "Sign Up As:", type: "select", options: IamA, defaultValue: "student", onChange : (e)=>setRole(e.target.value) }
  ];


  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(setError(""))
    // console.log(email)
    if (!email || !password || !name || !confirm_password) {
      dispatch(setError("Oops! Don't forget to fill in all the fields."));
      return;
    }
    try {
      await axiosInstance.post("/register", {name, email, password, confirm_password, role});
      navigate("/login"); // Redirect to login page
    } catch (err) {
      
      dispatch(setError(err?.response?.data?.message ));
    }
  };

  return <AuthForm title="Sign Up" fields={fields} buttonText="Sign Up" onSubmit={handleRegister}/>;
}

export default Signup;
