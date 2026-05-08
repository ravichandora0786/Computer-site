import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MdChevronRight, MdOpenInNew, MdSearch, MdMoreVert,
  MdInfo, MdVerified
} from "react-icons/md";
import clsx from "clsx";
import CourseSlider from "@/components/user/CourseSlider";
import { fetchCourses } from "@/pages/user/courses/slice";
import CourseProgressCard from "@/components/user/CourseProgressCard";
import LearnerStats from "@/components/user/LearnerStats";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, dashboardStats } = useSelector((state) => state.userAuth);
  const { items: allCourses } = useSelector((state) => state.courses);
  const stats = dashboardStats;

  const [activeTab, setActiveTab] = useState("progress");

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch({ type: "userAuth/fetchDashboardStatsRequest" });
  }, [dispatch]);

  const enrolledCourses = stats?.enrolledCourses || [];
  const inProgressCourses = enrolledCourses.filter(c => c.progress < 100 && c.timeRemaining !== 'Completed');
  const completedCourses = enrolledCourses.filter(c => c.progress === 100 || c.timeRemaining === 'Completed');
  const claimedCertificates = stats?.certificates || [];

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

  if (!stats) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Title */}
      <h1 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight italic">
        Courses & Certificates
      </h1>

      {/* Stats Row */}
      <LearnerStats 
        stats={stats} 
        enrolledCount={enrolledCourses.length} 
        completedCount={completedCourses.length} 
        claimedCount={claimedCertificates.length} 
      />

      {/* Tabs System */}
      <div className="space-y-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700 gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: "progress", label: `Courses in Progress (${inProgressCourses.length})` },
            { id: "completed", label: `Completed Courses (${completedCourses.length})` },
            { id: "claimed", label: `Claimed Certificates (${claimedCertificates.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "pb-4 text-sm font-bold uppercase tracking-tight transition-all relative whitespace-nowrap",
                activeTab === tab.id 
                  ? "text-primary border-b-4 border-primary" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MdInfo className="text-emerald-500" size={24} />
            <p className="text-emerald-800 dark:text-emerald-400 text-sm font-medium">
              Your daily learning time matches the Average Computer Site Learner.
            </p>
          </div>
          <button className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest hover:underline whitespace-nowrap">
            View Your Learning Stats
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === "progress" && (
              <motion.div 
                key="progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {inProgressCourses.length > 0 ? inProgressCourses.map((course) => (
                  <CourseProgressCard key={course.id} course={course} apiBase={apiBase} navigate={navigate} />
                )) : (
                  <EmptyState message="No courses in progress. Explore our library to start learning!" />
                )}
              </motion.div>
            )}

            {activeTab === "completed" && (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {completedCourses.length > 0 ? completedCourses.map((course) => (
                  <CourseProgressCard key={course.id} course={course} apiBase={apiBase} navigate={navigate} />
                )) : (
                  <EmptyState message="You haven't completed any courses yet. Finish one to see it here!" />
                )}
              </motion.div>
            )}

            {activeTab === "claimed" && (
              <motion.div 
                key="claimed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {claimedCertificates.length > 0 ? claimedCertificates.map((cert) => (
                  <div key={cert.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center">
                      <MdVerified size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 dark:text-white truncate uppercase italic">{cert.course?.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">ID: {cert.certificate_number}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/user/certificates')}
                      className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline"
                    >
                      View
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full">
                    <EmptyState message="No certificates claimed yet." />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recommended Slider */}
      <section className="pt-10">
        <CourseSlider 
          courses={allCourses} 
          title="Recommended For You" 
          subtitle="Explore the latest mastery programs"
          viewAllLink="/user/courses"
        />
      </section>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
    <p className="text-gray-400 font-bold italic uppercase tracking-widest text-xs">{message}</p>
  </div>
);

export default UserDashboard;
