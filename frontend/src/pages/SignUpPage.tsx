import React, { useState } from "react";
import { signup } from "../api/auth";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Restaurant as RestaurantIcon,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const validateForm = () => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.password) return "Password is required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      return "Passwords don't match";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return "Please enter a valid email address";

    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const data = await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      console.log(formData);
      console.log("Signup response:", data);

      if (data.success) {
        setSuccess("Account created successfully!");
        // await login(formData.email, formData.password);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // Handle specific error messages
        if (data.error === "User already exists") {
          setError(
            "This email address is already registered. Please try logging in instead."
          );
        } else {
          setError(data.error || data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff5f2 0%, #ffffff 50%, #fef2f2 100%)",
        display: "flex",
        alignItems: "center",
        py: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          {/* Logo Section */}
          <Paper
            elevation={0}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "#ff7043",
              mb: 3,
              boxShadow: `0 8px 32px ${alpha("#ff7043", 0.3)}`,
            }}
          >
            <RestaurantIcon sx={{ fontSize: 40, color: "white" }} />
          </Paper>

          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#ff7043",
              mb: 1,
              fontSize: { xs: "2rem", sm: "2.5rem" },
            }}
          >
            Meal.io
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Your AI-powered meal companion
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha("#000", 0.08)}`,
            overflow: "hidden",
            maxWidth: 480,
            mx: "auto",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              fontWeight="bold"
              sx={{
                color: "text.primary",
                mb: 1,
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              Create Account
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Join thousands of users planning better meals
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: alpha("#f44336", 0.1),
                  border: `1px solid ${alpha("#f44336", 0.2)}`,
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: alpha("#4caf50", 0.1),
                  border: `1px solid ${alpha("#4caf50", 0.2)}`,
                }}
              >
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSignup}>
              {/* Name Fields */}
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff7043",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff7043",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#ff7043",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff7043",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff7043",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#ff7043",
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff7043",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff7043",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ff7043",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff7043",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff7043",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ff7043",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff7043",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff7043",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ff7043",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  bgcolor: "#ff7043",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  boxShadow: `0 4px 16px ${alpha("#ff7043", 0.3)}`,
                  "&:hover": {
                    bgcolor: "#ff5722",
                    boxShadow: `0 6px 20px ${alpha("#ff7043", 0.4)}`,
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Account"
                )}
              </Button>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Or sign up with
                </Typography>
              </Divider>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "#ff7043",
                      textDecoration: "none",
                      fontWeight: 600,
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "#ff5722",
                      },
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SignupPage;
