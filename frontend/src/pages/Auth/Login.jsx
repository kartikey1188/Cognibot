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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setformData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e)=>{
    setformData(formData => ({
      ...formData,
      [e.target.name]: e.target.value
    }))
  }
  

  const fields = [
    { label: "Email", type: "email", name:"email", onChange: handleChange },
    { label: "Password", type: "password", showPassword, name:"password",onChange: handleChange, togglePassword }
  ];



  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(setError("Oops! Don't forget to fill in all the fields."));
      return;
    }
    dispatch(loginUser( formData ));
  };

  return (
    <>
      <AuthForm title="LOG IN" fields={fields} buttonText="LOG IN" onSubmit={handleLogin} />
    </>
);
}

export default Login;
