import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp({ setIsAuthenticated }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const siteKey = '6LcP6R0rAAAAAKlj9l30Kx7h1qdjqUSJEkITDDOr'; // ⬅️ Replace with your real site key

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let recaptchaToken = '';

if (window.grecaptcha) {
  await window.grecaptcha.ready(async () => {
    recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'submit' });
  });
} else {
  setError('reCAPTCHA failed to load. Please refresh and try again.');
  setLoading(false);
  return;
}

    try {
      const res = await fetch('https://elite-backend-production.up.railway.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Save token & commander data
      localStorage.setItem('token', data.token);
      localStorage.setItem('commander', JSON.stringify(data.commander));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Commander Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          type="text"
          placeholder="Commander Name"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 p-2 rounded font-semibold hover:bg-blue-700"
        >
          {loading ? 'Registering...' : 'Create Account'}
        </button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>
      <div className="mt-4 text-xs text-gray-400">
        Protected by reCAPTCHA. <a href="https://policies.google.com/privacy" className="underline">Privacy</a> • <a href="https://policies.google.com/terms" className="underline">Terms</a>
      </div>
      {/* reCAPTCHA script */}
      <script src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}></script>
    </div>
  );
}
