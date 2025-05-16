import React from 'react';
// import { button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import logo from "../../assets/images/logo-white.png"
const Navbar = () => {
  return (
    <nav className="w-full py-5 px-4 md:px-10 flex justify-between items-center z-10 relative">
      <div className="flex items-center">
        <div className="text-white text-2xl font-bold flex items-center">
          <div className="mr-2">
            <img src={logo} alt="logo" className='h-14'/>
          </div>
          
        </div>
      </div>
      
      <div className="hidden md:flex space-x-8 text-white font-medium">
        <Link to="/" className="hover:text-opacity-80">Home</Link>
        <Link to="/about" className="hover:text-opacity-80">About Us</Link>
        <Link to="/faqs" className="hover:text-opacity-80">FAQs</Link>
        <Link to="/blog" className="hover:text-opacity-80">Blog</Link>
        <Link to="/contact" className="hover:text-opacity-80">Contact Us</Link>
      </div>
      
      <div className="hidden md:block">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full">
          Get Started
        </button>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button variant="ghost" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
