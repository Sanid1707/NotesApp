import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Eye icons for toggle
import axios from 'axios';
import './Register.css';


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Invalid email format.');
      return false;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return false;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5189/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage('Registration successful! You can now log in.');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to register. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-background">
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Card className="p-5 shadow-lg register-card">
          <Card.Body>
            <h1 className="text-center mb-4 register-heading">Welcome to MyApp</h1>
            <h4 className="text-center mb-4 text-muted">Create your account</h4>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
              {/* Username */}
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="custom-input"
                />
              </Form.Group>
              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="custom-input"
                />
              </Form.Group>
              {/* Password */}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="custom-input"
                  />
                  <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {/* Confirm Password */}
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="custom-input"
                  />
                  <InputGroup.Text onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {/* Submit Button */}
              <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </Form>
          </Card.Body>
          {/* Footer */}
          <Card.Footer className="text-center card-footer-custom">
            <p className="mb-2">Already have an account?</p>
            <Button variant="outline-secondary" href="/login" className="login-button">
              Login Here
            </Button>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};

export default Register;