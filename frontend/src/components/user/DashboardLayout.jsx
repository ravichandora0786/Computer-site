import React, { useEffect } from "react";
import UserSidebar from "./UserSidebar";
import Header from "./Header";
import Footer from "./Footer";
import AuthModals from "./AuthModals";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { httpRequest, endPoints } from "../../request";
import { setDashboardStats } from "../../pages/user/auth/slice";

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await httpRequest.get(endPoints.UserDashboardStats);
        dispatch(setDashboardStats(response.data));
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className="min-h-screen bg-page transition-colors duration-300">
      <Header hideNavbar={true} />
      <div className="flex pt-16">
        <aside className="sticky top-16 h-[calc(100vh-64px)] hidden md:block border-r border-gray-100 dark:border-gray-800 bg-card">
          <UserSidebar />
        </aside>
        
        <div className="flex-1 flex flex-col min-h-[calc(100vh-128px)]">
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-4 lg:p-6 max-w-[1400px] mx-auto w-full"
          >
            {children}
          </motion.main>
          <Footer />
        </div>
      </div>
      <AuthModals />
    </div>
  );
};

export default DashboardLayout;
