import React, { useState } from "react";
import { FiSearch, FiUser, FiMapPin, FiCheck, FiX, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

function NavBar({ setShowLogin }) {
  

  return (
    <div className="relative">
      <nav className="bg-gradient-to-r from-pink-200 to-white py-3 px-6 shadow-md fixed top-0 left-0 w-full z-30">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="text-2xl tracking-wide font-normal text-pink-600">
              <Link to="/">SafeHer</Link>
            </div>
            <ul className="hidden md:flex space-x-12 text-lg font-medium">
              <Link to="/dashboard" className="font-normal text-base hover:text-pink-600 cursor-pointer transition-colors duration-300">Home</Link>
              <Link to="/dashboard" className="font-normal text-base hover:text-pink-600 cursor-pointer transition-colors duration-300">Explore</Link>
              <Link to="https://github.com/ritik-gupta-2022/Women-Safety/" className="font-normal text-base hover:text-pink-600 cursor-pointer transition-colors duration-300">About me</Link>

            </ul>
          </div>
          <div className="flex items-center space-x-6">
            <button
              className="text-pink-600 p-2 rounded-full border-2 border-pink-600 hover:bg-pink-600 hover:text-white transition-all duration-300"
            >
              <FiSearch className="text-xl" />
            </button>

            <Link to="/dashboard" className="hidden md:block text-pink-600 border-2 border-pink-600 px-4 py-1 rounded-md hover:bg-pink-600 hover:text-white transition-all duration-300">
              Get Started
            </Link>
            
          </div>
        </div>
      </nav>
      
    </div>
  );
}

export default NavBar;
