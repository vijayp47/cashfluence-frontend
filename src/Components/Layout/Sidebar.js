import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-green-50 h-screen p-4">
      {/* Dashboard Link */}
      <NavLink
        to="/admin/dashboard"  // Use absolute path
        className={({ isActive }) =>
          isActive
            ? 'flex items-center p-3 mb-4 bg-green-500 text-white rounded-lg'
            : 'flex items-center p-3 mb-4 text-gray-600 hover:bg-green-500 hover:text-white rounded-lg'
        }
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"
          ></path>
        </svg>
        Dashboard
      </NavLink>

      {/* Settings Link */}
      <NavLink
        to="admin/settings"
        className={({ isActive }) =>
          isActive
            ? 'flex items-center p-3 mb-4 bg-green-500 text-white rounded-lg'
            : 'flex items-center p-3 mb-4 text-gray-600 hover:bg-green-500 hover:text-white rounded-lg'
        }
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        Settings
      </NavLink>
    </div>
  );
};

export default Sidebar;
