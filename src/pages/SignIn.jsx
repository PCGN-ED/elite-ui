import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://elite-backend-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('commander', JSON.stringify(data.commander));

      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-[#0d0d0d] text-[#e0e0e0]">
      <h2 className="text-2xl font-bold mb-4 text-[#ffa500]">Commander Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-[#1c1c1c] text-white border border-[#333]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-[#1c1c1c] text-white border border-[#333]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 p-2 rounded font-semibold text-white"
        >
          Log In
        </button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
        <p className="text-sm text-[#aaa] mt-4">
          Don’t have an account?{' '}
          <a href="/signup" className="text-[#ffcc00] hover:underline">
            Create one here
          </a>
        </p>
      </form>
    </div>
  );
}
