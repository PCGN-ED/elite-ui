import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const location = useLocation();

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`px-4 py-2 rounded hover:text-[#ffa500] transition-colors duration-150 ${
        location.pathname === path ? 'text-[#ffa500] font-semibold underline' : 'text-[#e0e0e0]'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-[#1c1c1c] p-4 flex gap-4 shadow-md items-center border-b border-[#333]">
      {navLink('/dashboard', 'Dashboard')}
      {navLink('/commander', 'Commander')}
      {navLink('/squadron', 'Squadron')}
      {navLink('/colonization', 'Colonization')}

      <div className="ml-auto">
        <button
          onClick={onLogout}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
