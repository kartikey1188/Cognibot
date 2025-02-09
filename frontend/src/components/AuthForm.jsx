import { FormControl, TextField, InputAdornment, IconButton, InputLabel, OutlinedInput, Button, MenuItem } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useSelector } from "react-redux";

function AuthForm({ title, fields, buttonText, onSubmit }) {
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  return (
    <section className="auth-section min-h-screen p-5 pt-20 flex justify-center items-center">
      <form className="flex flex-col gap-[0.75em]" onSubmit={onSubmit}>
        {error && (
          <div className="error-div border border-red-800 lg:text-[0.8rem] text-[0.75rem] rounded p-[1em] text-red-500 bg-red-200">
            {error}
          </div>
        )}
        <h1 className="font-bold md:text-[2.5rem] text-[1.75rem] text-center">{title}</h1>
        {fields.map((field, index) => (
          <FormControl key={index} fullWidth error={field.error && field.touched}>
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
            {field.error && field.touched && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>{field.error}</div>
            )}
          </FormControl>
        ))}

        <Button variant="contained" type="submit" disabled={loading}>
          {buttonText}
        </Button>
      </form>
    </section>
  );
}

function PasswordField({ label, showPassword, togglePassword, onChange, name }) {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        required
        type={showPassword ? "text" : "password"}
        onChange={onChange}
        name={name}
        id={name}
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