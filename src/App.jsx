
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Commander from './pages/Commander';
import Squadron from './pages/Squadron';
import Colonization from './pages/Colonization';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/commander" element={isAuthenticated ? <Commander /> : <Navigate to="/login" />} />
          <Route path="/squadron" element={isAuthenticated ? <Squadron /> : <Navigate to="/login" />} />
          <Route path="/colonization" element={isAuthenticated ? <Colonization /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}
