import { FormControl, TextField, InputAdornment, IconButton, InputLabel, OutlinedInput, Button, MenuItem } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";

function AuthForm({ title, fields, buttonText, onSubmit }) {
  return (
    <section className="auth-section min-h-screen flex justify-center items-center">
      <form className="flex flex-col gap-[1em]">
        <h1 className="font-semibold text-[2rem]">{title}</h1>
        {fields.map((field, index) => (
          <FormControl key={index} fullWidth>
            {field.type === "password" ? (
              <PasswordField label={field.label} showPassword={field.showPassword} togglePassword={field.togglePassword} />
            ) : field.type === "select" ? (
              <TextField select label={field.label} defaultValue={field.defaultValue} fullWidth>
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField required label={field.label} type={field.type} defaultValue={field.defaultValue} fullWidth />
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

function PasswordField({ label, showPassword, togglePassword }) {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        required
        type={showPassword ? "text" : "password"}
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
