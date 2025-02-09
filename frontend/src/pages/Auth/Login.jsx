import { useState } from "react";
import AuthForm from "@/components/AuthForm.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slice/authSlice";
import { useFormik } from "formik";
import * as yup from "yup";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const validationSchema = yup.object({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  const fields = [
    { label: "Email", type: "email", name: "email", onChange: formik.handleChange, value: formik.values.email, error: formik.errors.email, touched: formik.touched.email },
    { label: "Password", type: "password", showPassword, name: "password", onChange: formik.handleChange, value: formik.values.password, error: formik.errors.password, touched: formik.touched.password, togglePassword },
  ];

  return (
    <>
      <AuthForm title="LOG IN" fields={fields} buttonText="LOG IN" onSubmit={formik.handleSubmit} />
    </>
  );
}

export default Login;