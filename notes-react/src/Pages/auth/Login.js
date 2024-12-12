// import React, { useState } from "react";
// import "./Login.css";
// import dashboard from "../dashboard/NotesDash";

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         const data = { email, password }; // Prepare data to send
    
//         try {
//             const response = await fetch('http://localhost:5189/api/auth/register', {
//                 method: 'POST', // HTTP method
//                 headers: {
//                     'Content-Type': 'application/json', // Ensure JSON payload
//                 },
//                 body: JSON.stringify(data), // Convert data to JSON
//             });
    
//             if (!response.ok) {
//                 // Handle HTTP errors
//                 throw new Error(`Error: ${response.status} ${response.statusText}`);
                
//             }

//             if (response.ok) 
//             {
//                 console.log("Login successful!");
//                 alert("Login successful!"); // Replace with real logic
//             }
//             const result = await response.json(); // Parse JSON response
//             console.log('Success:', result);
//             // Add your success logic here, e.g., updating state, showing a message
//         } catch (error) {
//             console.error('Error:', error);
//             // Handle error logic, e.g., showing an error message
//         }
//     };
    
//     return (
//         <div className="login-container">
//             <h2>Login</h2>
//             <form onSubmit={handleSubmit} className="login-form">
//                 <div className="form-group">
//                     <label htmlFor="email">Email</label>
//                     <input
//                         type="email"
//                         id="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="Enter your email"
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="password">Password</label>
//                     <input
//                         type="password"
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Enter your password"
//                         required
//                     />
//                 </div>
//                 <a href="/register">Don't have an account? Register here</a>
//                 <button type="submit" className="login-button">Login</button>
//             </form>
//         </div>
//     );
// };

// export default Login;


import "./Login.css";
import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff, Google, SportsEsports } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    const data = { email, password };
  
    try {
      const response = await fetch(`http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (result.success) {
        // Remove the incomplete line
        setSuccessMessage("Login successful!");
        console.log("Success:", result);
        
        // Save the token and user details in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("username", result.username);
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        // Handle unsuccessful login
        setErrorMessage(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic (e.g., OAuth) here
  };

  return (
    <div
      style={{
        background: `url('../../../public/images/AuthBg1.jpg') no-repeat center center fixed`,
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            padding: 3,
            background: "rgba(255, 255, 255, 0.85)",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Login to Your Account
            </Typography>
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type={showPassword ? "text" : "password"}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
            <Typography align="center" sx={{ mb: 1 }}>
              Or login with
            </Typography>
            <Grid container spacing={1} justifyContent="center" sx={{ mb: 1 }}>
              <Grid item>
                <IconButton
                  onClick={() => handleSocialLogin("Google")}
                  sx={{
                    backgroundColor: "#4285F4",
                    color: "white",
                    "&:hover": { backgroundColor: "#357ae8" },
                  }}
                >
                  <Google />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={() => handleSocialLogin("Discord")}
                  sx={{
                    backgroundColor: "#5865F2",
                    color: "white",
                    "&:hover": { backgroundColor: "#4752c4" },
                  }}
                >
                  <SportsEsports />
                </IconButton>
              </Grid>
            </Grid>
            <Typography align="center" sx={{ mt: 1 }}>
              Don't have an account?{" "}
              <Button href="/register" variant="text">
                Register Here
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Login;