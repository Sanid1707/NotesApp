
// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import Login from './Pages/auth/Login';
// import Register from './Pages/auth/Register';
// import Dashboard from './Pages/dashboard/NotesDash';
// import NotesCanvas from "./Pages/NotesCanvas";
// import ProfilePage from "./Pages/ProfilePage";
// import React, { useEffect, useState } from 'react';
// import { UserProvider } from './Pages/auth/Context'; // Import the UserProvider
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(null); // null while loading

//   return (
//     <UserProvider>
//       <Router>
//         <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
//       </Router>
//     </UserProvider>
//   );
// }

// const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
//   const navigate = useNavigate(); // Initialize navigate hook

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setIsAuthenticated(false);
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:5189/api/auth/validate-token`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Token validation failed');
//         }

//         const result = await response.json();

//         // Store user details
//         localStorage.setItem('userId', result.userId);
//         localStorage.setItem('username', result.username);

//         setIsAuthenticated(true);

//         // Navigate to the dashboard on successful validation
//         navigate('/dashboard');
//       } catch (error) {
//         console.error('Error:', error);
//         setIsAuthenticated(false);
//       }
//     };

//     checkAuth();
//   }, [navigate, setIsAuthenticated]);

//   return (
//     <>
//       {isAuthenticated === null ? (
//         // Show a loading spinner or placeholder while checking authentication
//         <div>Loading...</div>
//       ) : (
//         <Routes>
//           <Route
//             path="/"
//             element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route
//             path="/dashboard"
//             element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/notes/:id" // Accept noteId in URL
//             element={isAuthenticated ? <NotesCanvas /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/profile"
//             element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
//           />
//         </Routes>
//       )}
//     </>
//   );
// };

// export default App;

import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/auth/Login';
import Register from './Pages/auth/Register';
import Dashboard from './Pages/dashboard/NotesDash';
import NotesCanvas from "./Pages/NotesCanvas";
import ProfilePage from "./Pages/ProfilePage";
import React, { useEffect, useState } from 'react';
import { UserProvider } from './Pages/auth/Context';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null while loading

  return (
    <UserProvider>
      <Router>
        <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </Router>
    </UserProvider>
  );
}

const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5189/api/auth/validate-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        const result = await response.json();

        // Store user details
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('username', result.username);

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error validating token:', error);
        setIsAuthenticated(false);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setIsAuthenticated]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '24px',
        color: '#555',
      }}>
        Loading...
      </div>
    );
  }

  return (
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
      <Route
        path="/notes/:id"
        element={isAuthenticated ? <NotesCanvas /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;