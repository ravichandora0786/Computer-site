import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { MdMenu, MdClose, MdLogin, MdPersonAdd, MdLogout, MdDashboard } from "react-icons/md";
import clsx from "clsx";
import { openLoginModal, openSignupModal, userLogout } from "../../pages/user/auth/slice";


import { Dialog, Transition, Menu } from "@headlessui/react";
import { Fragment } from "react";
import { 
  MdStars, MdAssignment, MdLibraryBooks, 
  MdDescription, MdAssessment, MdVerified, MdSettings,
  MdHelpOutline, MdCardGiftcard, MdPerson, MdEdit,
  MdLightMode, MdDarkMode
} from "react-icons/md";
import { toggleDarkMode } from "../../pages/admin/common/slice";

const Header = ({ hideNavbar = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.userAuth);
  const { darkMode } = useSelector((state) => state.common);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: MdDashboard },
    { name: "Courses", path: "/user/courses", icon: MdLibraryBooks },
    { name: "My Courses", path: "/user/my-courses", icon: MdLibraryBooks },
    { name: "Learner Report", path: "/user/report", icon: MdAssessment },
    { name: "Claim Your Certificates", path: "/user/certificates", icon: MdVerified },
  ];

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        hideNavbar 
          ? "bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 shadow-sm"
          : (isScrolled 
              ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm py-3" 
              : "bg-transparent py-5")
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
          {!hideNavbar && !isAuthenticated && (
            <div className="hidden lg:block">
              <Navbar isScrolled={isScrolled} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 lg:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all active:scale-90"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <MdLightMode size={22} className="text-amber-400" /> : <MdDarkMode size={22} />}
            </button>

            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="w-10 h-10 rounded-full border-2 border-gray-100 p-0.5 overflow-hidden hover:border-primary transition-all active:scale-95 flex items-center justify-center">
                  <img 
                    src={user?.profile_img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    alt="User" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden z-[110]">
                    {/* User Profile Header in Dropdown */}
                    <div className="px-5 py-4 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Student Profile</p>
                        <p className="text-sm font-black text-main dark:text-white italic truncate">{user?.user_name || "Nexus Student"}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link 
                        to="/user/profile" 
                        className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                        title="Edit Profile"
                      >
                         <MdEdit size={16} />
                      </Link>
                    </div>

                    <div className="p-2">
                      {menuItems.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link
                              to={item.path}
                              className={clsx(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all",
                                active ? "bg-primary/5 dark:bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-400"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className={clsx("w-5 h-5", active ? "text-primary" : "text-gray-400")} />
                                <span className={clsx("text-xs font-bold uppercase italic tracking-tight", item.color)}>
                                  {item.name}
                                </span>
                              </div>
                              {item.badge && (
                                <span className={clsx("text-[8px] px-1.5 py-0.5 rounded text-white font-black uppercase italic", item.badgeColor)}>
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>

                    <div className="p-2">
                       <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className={clsx(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                              active ? "bg-red-50 text-red-600" : "text-gray-600"
                            )}
                          >
                            <MdLogout className={clsx("w-5 h-5", active ? "text-red-600" : "text-gray-400")} />
                            <span className="text-xs font-bold uppercase italic tracking-tight">Logout</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
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
          {!hideNavbar && !isAuthenticated && <Navbar isMobile onItemClick={() => setIsMobileMenuOpen(false)} />}
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
