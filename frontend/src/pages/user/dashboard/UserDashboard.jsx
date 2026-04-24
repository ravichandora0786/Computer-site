import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MdStars, MdVerified, MdAccessTime, MdLocalFireDepartment, 
  MdChevronRight, MdOpenInNew, MdSearch, MdMoreVert
} from "react-icons/md";
import { httpRequest, endPoints } from "../../../request";
import clsx from "clsx";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, dashboardStats } = useSelector((state) => state.userAuth);
  const stats = dashboardStats;

  const statCards = [
    { label: "XP", value: "5", icon: MdStars, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Certificates", value: "0", icon: MdVerified, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Learning Streak", value: "1", icon: MdLocalFireDepartment, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Total Learning Hours", value: "0", icon: MdAccessTime, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const inProgressCourses = stats?.enrolledCourses || [];
  const profileCompletion = stats?.profileCompletion || 0;
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

  if (!stats) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
             {stats?.userName || user?.user_name}'s Dashboard – let's jump back in.
          </h1>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={clsx("p-3 rounded-full", stat.bg)}>
              <stat.icon className={clsx("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white uppercase italic">{stat.value}</p>
            </div>
          </div>
        ))}
        <button className="col-span-1 flex items-center justify-center text-sm font-semibold text-primary hover:text-primary/80">
           View All Achievements <MdChevronRight className="w-5 h-5" />
         </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Courses In Progress */}
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
               <h2 className="font-bold text-gray-800 dark:text-white">Enrolled Courses ({inProgressCourses.length})</h2>
               <button 
                 onClick={() => navigate("/user/my-courses")}
                 className="text-gray-400 hover:text-primary"
               >
                 <MdOpenInNew className="w-5 h-5" />
               </button>
            </div>
            <div className="divide-y divide-gray-50">
              {inProgressCourses.length > 0 ? inProgressCourses.map((course) => {
                const getThumbnail = (thumb) => {
                  if (!thumb) return null;
                  try {
                    const parsed = typeof thumb === 'string' && thumb.startsWith('[') ? JSON.parse(thumb) : thumb;
                    return Array.isArray(parsed) ? parsed[0] : parsed;
                  } catch (e) {
                    return thumb;
                  }
                };
                const displayThumb = getThumbnail(course.thumbnail);

                return (
                  <div key={course.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 relative group border border-gray-100 dark:border-gray-700/50">
                      <img 
                        src={displayThumb ? `${apiBase}${displayThumb}` : "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400"} 
                        alt="Course" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="font-bold text-gray-800 dark:text-white leading-tight pr-4">{course.title}</h3>
                      <div className="space-y-1">
                        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${course.progress || 0}%` }}></div>
                        </div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{course.progress || 0}% Complete</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold py-0.5 px-2 bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-300 rounded uppercase">Last Active: Recently</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center md:items-end gap-2">
                      <button 
                        onClick={() => navigate(`/course-detail/${course.courseId}`)}
                        className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/5"
                      >
                         Continue Learning
                      </button>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">{course.timeRemaining}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-12 text-center text-gray-500 font-medium">
                  You haven't enrolled in any courses yet.
                </div>
              )}
            </div>
          </section>

          {/* Marketing Banner */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/10 flex items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl shadow-sm">📱</div>
                <p className="text-primary font-medium">No internet? No problem! Download any course on the app and learn on the go.</p>
             </div>
             <button className="bg-white dark:bg-gray-800 px-6 py-2 rounded-lg font-bold text-primary border border-primary/20 shadow-sm whitespace-nowrap">Get App</button>
          </div>
        </div>

        {/* Sidebar Mini Components */}
        <div className="space-y-6">
           {/* Profile Completion Card */}
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2"><MdMoreVert className="text-gray-300 dark:text-gray-600" /></div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 relative mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                       <circle 
                         cx="48" 
                         cy="48" 
                         r="44" 
                         stroke="currentColor" 
                         strokeWidth="8" 
                         fill="transparent" 
                         strokeDasharray="276" 
                         strokeDashoffset={276 - (276 * profileCompletion) / 100} 
                         className="text-primary transition-all duration-1000" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-xl font-bold text-gray-800 dark:text-white">{profileCompletion}%</span>
                       <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase">Complete</span>
                    </div>
                 </div>
                 <h4 className="font-bold text-gray-800 dark:text-white">{profileCompletion === 100 ? "Profile Complete" : "Finish Your Profile"}</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                   {profileCompletion === 100 
                    ? "Great job! Your profile is fully updated and looking professional." 
                    : "Get noticed by employers by completing your profile details."}
                 </p>
                 <button className="mt-4 w-full py-2 border-2 border-primary/10 dark:border-primary/20 text-primary font-bold rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition">
                    {profileCompletion === 100 ? "View Profile" : "Update Now"}
                 </button>
              </div>
           </div>

           {/* Quick Search */}
           <div className="bg-primary/90 p-6 rounded-xl text-white shadow-lg shadow-primary/10">
              <h4 className="font-bold text-lg mb-2">Find Your Next Lesson</h4>
              <p className="text-white/80 text-sm mb-4">Continue your journey with thousands of free courses.</p>
              <div className="relative">
                 <input type="text" placeholder="What do you want to learn?" className="w-full bg-white/20 placeholder-white/60 border-none rounded-lg py-2.5 px-10 text-sm focus:ring-2 focus:ring-white/40" />
                 <MdSearch className="absolute left-3 top-3 text-white/60" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

