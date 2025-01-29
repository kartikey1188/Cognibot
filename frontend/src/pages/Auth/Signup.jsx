import { useState } from "react";
import AuthForm from "@/components/AuthForm.jsx";

function Signup() {
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((pre) => !pre);

  const IamA = [
    { value: "student", label: "Student" },
    { value: "instructor", label: "Instructor" }
  ];

  const fields = [
    { label: "Email", type: "email", defaultValue: "" },
    { label: "Password", type: "password", showPassword: showPassword, togglePassword:togglePassword },
    { label: "Confirm Password", type: "password", showPassword: showConfirmPassword,togglePassword: toggleConfirmPassword },
    { label: "Sign Up As:", type: "select", options: IamA, defaultValue: "student" }
  ];

  return <AuthForm title="Sign Up" fields={fields} buttonText="Sign Up" onSubmit={() => console.log("Signing up...")} />;
}

export default Signup;
