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
  const [formData, setformData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    name: "",
    role: "student"
  })

  const handleChange = (e)=>{
    setformData(formData => ({
      ...formData,
      [e.target.name]: e.target.value
    }))
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const IamA = [
    { value: "student", label: "Student" },
    { value: "instructor", label: "Instructor" }
  ];

  const fields = [
    { label: "Email",  name : "email",type: "email", defaultValue: "", onChange : handleChange },
    { label: "Name", name : "name",type: "text", defaultValue: "", onChange : handleChange},
    { label: "Password", name : "password", type: "password", showPassword: showPassword, togglePassword:togglePassword, onChange : handleChange },
    { label: "Confirm Password", name : "confirm_password",type: "password", showPassword: showConfirmPassword,togglePassword: toggleConfirmPassword, onChange : handleChange },
    { label: "Sign Up As:", type: "select", name : "role", options: IamA, defaultValue: "student", onChange : handleChange  }
  ];


  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(setError(""))
    // console.log(email)
    if (!formData.email || !formData.password || !formData.confirm_password || !formData.name) {
      dispatch(setError("Oops! Don't forget to fill in all the fields."));
      return;
    }
    try {
      await axiosInstance.post("/register", formData);
      navigate("/login"); // Redirect to login page
    } catch (err) {
      
      dispatch(setError(err?.response?.data?.message ));
    }
  };

  return <AuthForm title="SIGN UP" fields={fields} buttonText="Sign Up" onSubmit={handleRegister}/>;
}

export default Signup;
