import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/auth/Login';
import Register from './Pages/auth/Register';
import Dashboard from './Pages/dashboard/NotesDash';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';




function App() {
 
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null while loading

  useEffect(() => {
    const checkAuth = async () => {
      if (!localStorage.getItem('token')) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/validate-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Token validation failed');
        setIsAuthenticated(true);
        // assign user id to session storage
        const result = await response.json();
        sessionStorage.setItem('userId', result.userId);
        
      } catch (error) {
        console.error('Error:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);



  return (
  
    <Router>
    {isAuthenticated === null ? (
      // Show a loading spinner or placeholder while checking authentication
      <div>Loading...</div>
    ) : (
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    )}
  </Router>
  );
}

export default App;
