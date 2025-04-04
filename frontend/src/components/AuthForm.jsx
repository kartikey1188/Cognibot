import {
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  Button,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useSelector } from "react-redux";

function AuthForm({ title, fields, buttonText, onSubmit, redirectLink }) {
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  return (
    <section className="w-full min-h-[100vh] flex justify-center items-start pt-[80px] px-4 bg-gradient-to-br from-gray-100 to-gray-300 overflow-hidden pb-10">
      <div className="backdrop-blur-xl bg-white/70 w-full max-w-md rounded-2xl shadow-xl p-8 sm:p-10 animate-fade-in">
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/graduation-cap-circular-button-svgrepo-com.svg"
              alt="logo"
              className="h-16 w-16 object-contain bg-black rounded-full border border-2"
            />
          </div>

          {/* Title */}
          {title && (
            <Typography
              variant="h5"
              fontWeight={700}
              textAlign="center"
              sx={{ color: "#1f2937" }}
            >
              {title}
            </Typography>
          )}

          {/* Subtitle */}
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mt: "-0.5rem" }}
          >
            {title === "SIGN UP"
              ? "Create your account to get started"
              : "Enter your credentials to access your account"}
          </Typography>

          {/* Error */}
          {error && (
            <Box
              sx={{
                border: "1px solid #ef4444",
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                fontSize: "0.875rem",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
              }}
            >
              {error}
            </Box>
          )}

          {/* Fields */}
          {fields.map((field, index) => (
            <FormControl
              key={index}
              fullWidth
              error={Boolean(field.error && field.touched)}
            >
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
                <Typography variant="caption" color="error" mt={0.5}>
                  {field.error}
                </Typography>
              )}
            </FormControl>
          ))}

          {/* Submit Button */}
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
          </Button>

          {/* Redirect Link */}
          {redirectLink && (
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              {redirectLink.text}{" "}
              <a
                href={redirectLink.href}
                style={{
                  color: "#3b82f6",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                {redirectLink.linkText}
              </a>
            </Typography>
          )}

          {/* Footer */}
          <Typography
            variant="caption"
            align="center"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            © {new Date().getFullYear()} CogniBot. All rights reserved.
          </Typography>
        </form>
      </div>
    </section>
  );
}

function PasswordField({
  label,
  showPassword,
  togglePassword,
  onChange,
  name,
  value,
}) {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        required
        type={showPassword ? "text" : "password"}
        onChange={onChange}
        name={name}
        id={name}
        value={value}
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
