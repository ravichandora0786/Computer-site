import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { MdMenu, MdClose, MdLogin, MdPersonAdd } from "react-icons/md";
import clsx from "clsx";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container max-w-full mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transform group-hover:rotate-6 transition-transform">
              <span className="text-white font-black text-xl italic leading-none">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-main leading-none uppercase">Computer Site</span>
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase leading-tight italic">Studio LMS</span>
            </div>
          </Link>

          {/* Desktop Navbar */}
          <div className="hidden lg:block">
            <Navbar isScrolled={isScrolled} />
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-6 py-2.5 rounded-full text-sm font-bold text-main hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <MdLogin size={18} />
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-primary text-white hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <MdPersonAdd size={18} />
              Free Signup
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-main"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="lg:hidden bg-white overflow-hidden border-b border-gray-100"
      >
        <div className="px-4 py-6 flex flex-col gap-4">
          <Navbar isMobile onItemClick={() => setIsMobileMenuOpen(false)} />
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
             <Link to="/login" className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-sm font-bold text-main">Login</Link>
             <Link to="/signup" className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg">Signup</Link>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
