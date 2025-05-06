import React, { useState } from "react";
import { useAdminAuth } from "./AdminAuthContext";
import { useAdminTheme } from "./AdminThemeProvider";

interface AdminUser {
  username: string;
}

interface Props {
  adminUser: AdminUser | null;
}

const AdminNavbar: React.FC<Props> = ({ adminUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAdminAuth();
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <nav className="w-full flex items-center justify-between mb-12">
      {/* Logo + Title */}
      <div className="flex items-center gap-4">
        <img src="/favicon.png" alt="Zemen Logo" className="w-12 h-12 rounded-full shadow-md" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Zemen Admin Dashboard
        </h1>
      </div>

      {/* Hamburger menu on mobile */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-3xl text-gray-600 dark:text-white">
          {menuOpen ? "✖️" : "☰"}
        </button>
      </div>

      {/* User controls */}
      <div
        className={`${
          menuOpen ? "flex flex-col space-y-4 p-6" : "hidden"
        } md:flex md:flex-row md:items-center md:gap-4 bg-white/90 dark:bg-gray-700 backdrop-blur rounded-xl md:rounded-full px-5 py-2 shadow-md absolute md:static right-6 top-20 md:right-0 md:top-0 z-50 transition-all`}
      >
        {adminUser && (
          <>
            <img
              src={`https://ui-avatars.com/api/?name=${adminUser.username}&background=random`}
              alt="Profile"
              className="w-12 h-12 rounded-full border"
            />
            <button
              onClick={toggleTheme}
              className="text-xl text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              {theme === "light" ? "🌙" : "🌞"}
            </button>
            <span className="font-medium text-gray-800 dark:text-white">{adminUser.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-6 py-2 rounded-full"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
