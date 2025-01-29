import {
    FormControl,
    TextField,
    InputAdornment,
    IconButton,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Button
  } from "@mui/material";
  import { useState } from "react";
  import { VisibilityOff, Visibility } from "@mui/icons-material";
  
  function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
  
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };
  
    const IamA = [{
      value: 'student',
      label: 'Student',
    },
    {
      value: 'instructor',
      label: 'Instructor',
    },]
    return (
      <>
        <section
          className="login-section min-h-screen flex justify-center items-center"
          id="login"
        >
          <div className="flex flex-col gap-[1em]">
          <h1 className="font-semibold text-[2rem]">Sign Up</h1>
            <FormControl>
              <TextField
                required
                label="Email"
                defaultValue=""
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput required
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
            <FormControl>
              <TextField
                required
                id="outlined-required"
                label="Confirm Password"
                defaultValue=""
                type="password"
              />
            </FormControl>
            <TextField
            id="outlined-select-currency"
            select
            label="Sign Up As:"
            defaultValue="student"
            // helperText="Please select your currency"
          >
            {IamA.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <p className="text-gray-500 m-1 mb-0 text-[1em]">Already have an account? <br /> Please Login</p>
            <Button variant="contained" size="large">Sign Up</Button>
          </div>
        </section>
      </>
    );
  }
  
  export default SignUp;
  