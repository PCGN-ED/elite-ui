import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Commander from './pages/Commander';
import Squadron from './pages/Squadron';
import Colonization from './pages/Colonization';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/commander" element={isAuthenticated ? <Commander /> : <Navigate to="/signin" />} />
          <Route path="/squadron" element={isAuthenticated ? <Squadron /> : <Navigate to="/signin" />} />
          <Route path="/colonization" element={isAuthenticated ? <Colonization /> : <Navigate to="/signin" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}
