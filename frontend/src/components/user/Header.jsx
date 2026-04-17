import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { MdMenu, MdClose, MdLogin, MdPersonAdd, MdLogout, MdDashboard } from "react-icons/md";
import clsx from "clsx";
import { openLoginModal, openSignupModal, userLogout } from "../../pages/user/auth/slice";


import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.userAuth);

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
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-main italic">Welcome, {user?.user_name || 'Student'}</span>
                {user?.role?.type === 'admin' && (
                  <Link to="/admin" className="px-4 py-2 rounded-xl bg-gray-100 text-main hover:bg-gray-200 text-xs font-bold transition flex items-center gap-1">
                    <MdDashboard /> Admin
                  </Link>
                )}
                <button 
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="p-2 rounded-full text-red-500 hover:bg-red-50 transition flex items-center justify-center"
                  title="Logout"
                >
                  <MdLogout size={20} />
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => dispatch(openLoginModal())}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-main hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <MdLogin size={18} />
                  Login
                </button>
                <button 
                  onClick={() => dispatch(openSignupModal())}
                  className="px-6 py-2.5 rounded-full text-sm font-bold bg-primary text-white hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <MdPersonAdd size={18} />
                  Free Signup
                </button>
              </>
            )}
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
            {isAuthenticated ? (
               <button onClick={() => { setIsLogoutModalOpen(true); setIsMobileMenuOpen(false); }} className="col-span-2 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold">
                 <MdLogout size={18}/> Logout
               </button>
            ) : (
               <>
                 <button onClick={() => { dispatch(openLoginModal()); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-sm font-bold text-main">
                   Login
                 </button>
                 <button onClick={() => { dispatch(openSignupModal()); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg">
                   Signup
                 </button>
               </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <Transition appear show={isLogoutModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsLogoutModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
             <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                   as={Fragment}
                   enter="ease-out duration-300"
                   enterFrom="opacity-0 scale-95"
                   enterTo="opacity-100 scale-100"
                   leave="ease-in duration-200"
                   leaveFrom="opacity-100 scale-100"
                   leaveTo="opacity-0 scale-95"
                >
                   <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-3xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
                      <div className="flex flex-col items-center justify-center text-center">
                         <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                            <MdLogout size={32} />
                         </div>
                         <Dialog.Title as="h3" className="text-xl font-black text-main uppercase italic mb-2">
                           Confirm Logout
                         </Dialog.Title>
                         <p className="text-xs font-medium text-gray-500 mb-8">
                           Are you sure you want to log out of your session?
                         </p>

                         <div className="flex gap-3 w-full">
                            <button
                               onClick={() => setIsLogoutModalOpen(false)}
                               className="flex-1 py-3 rounded-2xl bg-gray-50 text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors"
                            >
                               Cancel
                            </button>
                            <button
                               onClick={() => {
                                 dispatch(userLogout());
                                 setIsLogoutModalOpen(false);
                               }}
                               className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5"
                            >
                               Logout
                            </button>
                         </div>
                      </div>
                   </Dialog.Panel>
                </Transition.Child>
             </div>
          </div>
        </Dialog>
      </Transition>
    </header>
  );
};

export default Header;
