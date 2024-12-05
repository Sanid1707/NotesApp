// import React, { useState } from 'react';
// import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Eye icons for toggle
// import axios from 'axios';
// import './Register.css';


// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const validateForm = () => {
//     // Clear previous messages
//     setErrorMessage('');
//     setSuccessMessage('');

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setErrorMessage('Invalid email format.');
//       return false;
//     }

//     // Password match validation
//     if (formData.password !== formData.confirmPassword) {
//       setErrorMessage('Passwords do not match.');
//       return false;
//     }

//     // Password length validation
//     if (formData.password.length < 6) {
//       setErrorMessage('Password must be at least 6 characters long.');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     try {
//       const response = await axios.post('http://localhost:5189/api/auth/register', {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//       });

//       setSuccessMessage('Registration successful! You can now log in.');
//       setFormData({
//         username: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//       });
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.message || 'Failed to register. Please try again later.'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="page-background">
//       <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
//         <Card className="p-5 shadow-lg register-card">
//           <Card.Body>
//             <h1 className="text-center mb-4 register-heading">Welcome to MyApp</h1>
//             <h4 className="text-center mb-4 text-muted">Create your account</h4>
//             {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//             {successMessage && <Alert variant="success">{successMessage}</Alert>}
//             <Form onSubmit={handleSubmit}>
//               {/* Username */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Username</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter your username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   required
//                   className="custom-input"
//                 />
//               </Form.Group>
//               {/* Email */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Email Address</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="Enter your email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   className="custom-input"
//                 />
//               </Form.Group>
//               {/* Password */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <InputGroup>
//                   <Form.Control
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="Enter your password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     required
//                     className="custom-input"
//                   />
//                   <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
//                     {showPassword ? <FaEye /> : <FaEyeSlash />}
//                   </InputGroup.Text>
//                 </InputGroup>
//               </Form.Group>
//               {/* Confirm Password */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Confirm Password</Form.Label>
//                 <InputGroup>
//                   <Form.Control
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     placeholder="Confirm your password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     required
//                     className="custom-input"
//                   />
//                   <InputGroup.Text onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
//                     {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
//                   </InputGroup.Text>
//                 </InputGroup>
//               </Form.Group>
//               {/* Submit Button */}
//               <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
//                 {isSubmitting ? 'Registering...' : 'Register'}
//               </Button>
//             </Form>
//           </Card.Body>
//           {/* Footer */}
//           <Card.Footer className="text-center card-footer-custom">
//             <p className="mb-2">Already have an account?</p>
//             <Button variant="outline-secondary" href="/login" className="login-button">
//               Login Here
//             </Button>
//           </Card.Footer>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from 'react';
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
} from '@mui/material';
import { PhotoCamera, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

    if (file && allowedFormats.includes(file.type)) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setErrorMessage('');
    } else {
      setErrorMessage('Unsupported file format. Allowed formats: JPG, JPEG, PNG, GIF.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    if (profileImage) {
      formDataToSend.append('profileImage', profileImage);
    }

    try {
      const response = await axios.post('http://localhost:5189/api/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Registration successful! You can now log in.');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setProfileImage(null);
      setPreviewImage(null);
    } catch (error) {
      setErrorMessage('Registration failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ padding: 3, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Create Your Account
          </Typography>
          {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                <Avatar
                  src={previewImage}
                  alt="Profile"
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto',
                    backgroundColor: '#f0f0f0',
                  }}
                />
                <IconButton
                  color="primary"
                  component="label"
                  sx={{
                    position: 'relative',
                    top: '-30px',
                    left: '30px',
                    backgroundColor: 'white',
                  }}
                >
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
              type={showPassword ? 'text' : 'password'}
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
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              type={showConfirmPassword ? 'text' : 'password'}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
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
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <Typography align="center">
            Already have an account?{' '}
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