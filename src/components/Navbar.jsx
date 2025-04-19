import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const location = useLocation();

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`px-4 py-2 hover:underline ${
        location.pathname === path ? 'font-bold underline' : ''
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-gray-800 p-4 flex gap-4 shadow-md items-center">
      {navLink('/dashboard', 'Dashboard')}
      {navLink('/commander', 'Commander')}
      {navLink('/squadron', 'Squadron')}
      {navLink('/colonization', 'Colonization')}

      <div className="ml-auto">
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
