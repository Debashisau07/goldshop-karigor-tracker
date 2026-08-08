import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center text-lg shadow-md">
          💛
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800 leading-none">
            Gold Karigor Tracker
          </h1>
          <p className="text-xs text-gray-400 leading-none mt-0.5">
            Workshop Management
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* User Info */}
        <div className="hidden sm:flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 leading-none">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 leading-none mt-0.5 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </nav>
  );
}