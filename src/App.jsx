import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Commander from './pages/Commander';
import Squadron from './pages/Squadron';
import Colonization from './pages/Colonization';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('commander');
    setIsAuthenticated(false);
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="/commander" element={isAuthenticated ? <Commander /> : <Navigate to="/signin" />} />
        <Route path="/squadron" element={isAuthenticated ? <Squadron /> : <Navigate to="/signin" />} />
        <Route path="/colonization" element={isAuthenticated ? <Colonization /> : <Navigate to="/signin" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

