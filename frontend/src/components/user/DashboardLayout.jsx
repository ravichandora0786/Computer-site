import React from "react";
import UserSidebar from "./UserSidebar";
import Header from "./Header";
import AuthModals from "./AuthModals";
import { motion } from "framer-motion";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header hideNavbar={true} />
      <div className="flex pt-16">
        <aside className="sticky top-16 h-[calc(100vh-64px)] hidden md:block border-r border-gray-100 bg-white">
          <UserSidebar />
        </aside>
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto"
        >
          {children}
        </motion.main>
      </div>
      <AuthModals />
    </div>
  );
};

export default DashboardLayout;
