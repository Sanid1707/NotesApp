

import React, { useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Typography,
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { convertToBase64 } from "../../utils/fileUtils";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null, // For Base64 image
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload and convert to Base64
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await convertToBase64(file); // Convert file to Base64
        console.log("Base64 Image:", base64Image); // Log the Base64 string
        setFormData({ ...formData, profilePicture: base64Image });
        setPreviewImage(base64Image); // Preview the uploaded image
        setErrorMessage("");
      } catch (error) {
        console.error("Image conversion error:", error);
        setErrorMessage("Failed to upload image. Please try again.");
      }
    }
  };

  // Submit form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting Data:", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profilePicture: formData.profilePicture,
      });

      const response = await axios.post("http://localhost:5189/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profilePicture: formData.profilePicture, // Send Base64 image
      });

      setSuccessMessage("Registration successful! You can now log in.");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePicture: null,
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Registration Error:", error.response || error.message);
      setErrorMessage("Registration failed. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ padding: 3, width: "100%" }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Create Your Account
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <Avatar
                  src={previewImage || "https://via.placeholder.com/150"}
                  alt="Profile"
                  sx={{
                    width: 120,
                    height: 120,
                    margin: "0 auto",
                    backgroundColor: "#f0f0f0",
                  }}
                />
                <IconButton color="primary" component="label">
                  <PhotoCamera />
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </IconButton>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  type="email"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              type={showPassword ? "text" : "password"}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              type={showConfirmPassword ? "text" : "password"}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              sx={{ mb: 2 }}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
          <Typography align="center">
            Already have an account?{" "}
            <Button href="/login" variant="text">
              Login Here
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;