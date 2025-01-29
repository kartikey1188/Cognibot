import {
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";
import { VisibilityOff, Visibility } from "@mui/icons-material";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <section
        className="login-section min-h-screen flex justify-center items-center"
        id="login"
      >
        <div className="flex flex-col gap-[1em]">
          <h1 className="font-semibold text-[2rem]">Log In</h1>
          <FormControl>
            <TextField required label="Email" defaultValue="" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              required
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button variant="contained" size="large">
            Log In
          </Button>
        </div>
      </section>
    </>
  );
}

export default Login;
