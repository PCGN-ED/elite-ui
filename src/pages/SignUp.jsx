import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp({ setIsAuthenticated }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const siteKey = '6LcP6R0rAAAAAKlj9l30Kx7h1qdjqUSJEkITDDOr';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const recaptchaToken = window.grecaptcha.getResponse();
      if (!recaptchaToken) {
        setError('Please complete the reCAPTCHA.');
        setLoading(false);
        return;
      }

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

      localStorage.setItem('token', data.token);
      localStorage.setItem('commander', JSON.stringify(data.commander));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      console.error('reCAPTCHA error:', err);
      setError('reCAPTCHA failed to load. Please refresh and try again.');
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

        <div
          className="g-recaptcha"
          data-sitekey="6LcP6R0rAAAAAKlj9l30Kx7h1qdjqUSJEkITDDOr"
        ></div>

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
      <p className="text-sm text-gray-400 mt-4">
        Already have an account?{' '}
        <Link to="/signin" className="text-blue-400 hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
