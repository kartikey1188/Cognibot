import { FormControl, TextField, InputAdornment, IconButton, InputLabel, OutlinedInput, Button, MenuItem } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useSelector } from "react-redux";

function AuthForm({ title, fields, buttonText, onSubmit}) {
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  return (
    <section className="auth-section min-h-screen flex justify-center items-center">
      <form className="flex flex-col gap-[1em]">
      { error && (<div className="error-div border border-red-800 rounded p-4 text-red-500 bg-red-200">{error}</div>) }
        <h1 className="font-bold text-[2.5rem]">{title}</h1>
        {fields.map((field, index) => (
          <FormControl key={index} fullWidth>
            {field.type === "password" ? (
              <PasswordField {...field} />
            ) : field.type === "select" ? (
              <TextField select {...field} fullWidth>
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField {...field} fullWidth />
            )}
          </FormControl>
        ))}
        <Button variant="contained" size="large" onClick={onSubmit}>
          {buttonText}
        </Button>
      </form>
    </section>
  );
}

function PasswordField({ label, showPassword, togglePassword, onChange }) {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        required
        type={showPassword ? "text" : "password"}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={togglePassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  );
}

export default AuthForm;
