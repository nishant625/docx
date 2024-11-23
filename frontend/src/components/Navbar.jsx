// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-2xl font-bold tracking-wider hover:text-gray-300 transition-all">
              MyApp
            </Link>
          </div>
          <div className="flex space-x-6 items-center">
            <Link
              to="/"
              className="text-white text-lg hover:text-gray-200 px-3 py-2 rounded-md transition-all"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white text-lg hover:text-gray-200 px-3 py-2 rounded-md transition-all"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
