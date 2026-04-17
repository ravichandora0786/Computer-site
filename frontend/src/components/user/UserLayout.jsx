import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import AuthModals from "./AuthModals";
import { motion, AnimatePresence } from "framer-motion";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white selection:bg-primary/20">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-24 min-h-[calc(100vh-400px)]"
      >
        {children}
      </motion.main>
      <Footer />
      <AuthModals />
    </div>
  );
};

export default UserLayout;
