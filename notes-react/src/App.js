import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/auth/Login';
import Register from './Pages/auth/Register';
import Dashboard from './Pages/dashboard/NotesDash';
import NotesCanvas from "./Pages/NotesCanvas";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePage from "./Pages/ProfilePage"; // Add SettingsPage
    

// Api  to check Validation of token

// get a context file to save user details 



function App() {
  return (

    <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/notes/:noteId" element={<NotesCanvas />} /> */}
                <Route path="/notes" element={<NotesCanvas />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
  );
}

export default App;
