import { useState } from "react";
import { Box } from "@mui/material";
import AuthForm from "@/components/AuthForm.jsx";
import axiosInstance from "@/axiosClient.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slice/authSlice";
import { useFormik } from "formik";
import * as yup from "yup";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const validationSchema = yup.object({
    email: yup.string().email("Invalid email format").required("Email is required"),
    name: yup.string().required("Name is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    role: yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirm_password: "",
      name: "",
      role: "student",
    },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(setError(""));
      try {
        await axiosInstance.post("/register", values);
        navigate("/login");
      } catch (err) {
        dispatch(setError(err?.response?.data?.message));
      }
    },
  });

  const roleOptions = [
    { value: "student", label: "Student" },
    { value: "instructor", label: "Instructor" },
  ];

  const fields = [
    {
      label: "Email",
      name: "email",
      type: "email",
      onChange: formik.handleChange,
      value: formik.values.email,
      error: formik.errors.email,
      touched: formik.touched.email,
    },
    {
      label: "Name",
      name: "name",
      type: "text",
      onChange: formik.handleChange,
      value: formik.values.name,
      error: formik.errors.name,
      touched: formik.touched.name,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      showPassword,
      togglePassword,
      onChange: formik.handleChange,
      value: formik.values.password,
      error: formik.errors.password,
      touched: formik.touched.password,
    },
    {
      label: "Confirm Password",
      name: "confirm_password",
      type: "password",
      showPassword: showConfirmPassword,
      togglePassword: toggleConfirmPassword,
      onChange: formik.handleChange,
      value: formik.values.confirm_password,
      error: formik.errors.confirm_password,
      touched: formik.touched.confirm_password,
    },
    {
      label: "Sign Up As:",
      type: "select",
      name: "role",
      options: roleOptions,
      onChange: formik.handleChange,
      value: formik.values.role,
      error: formik.errors.role,
      touched: formik.touched.role,
    },
  ];

  return (
    <Box
    sx={{
      width: "100%",
      minHeight: "100dvh", // 👈 more consistent on mobile too
      background: "linear-gradient(to bottom right, #f2f4f7, #e2e8f0)",
      display: "flex",
      justifyContent: "center",
      alignItems: "start",
      px: 2,
    }}
>
<AuthForm
  title="SIGN UP"
  fields={fields}
  buttonText="Sign Up"
  onSubmit={formik.handleSubmit}
  redirectLink={{
    text: "Already have an account?",
    linkText: "Log In",
    href: "/login"
  }}
/>

</Box>

  );
}

export default Signup;
