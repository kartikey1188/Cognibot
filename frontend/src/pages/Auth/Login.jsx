import { useState } from "react";
import AuthForm from "@/components/AuthForm.jsx";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const fields = [
    { label: "Email", type: "email", defaultValue: "" },
    { label: "Password", type: "password", showPassword, togglePassword }
  ];

  return <AuthForm title="Log In" fields={fields} buttonText="Log In" onSubmit={() => console.log("Logging in...")} />;
}

export default Login;
