import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  MdStars, MdVerified, MdAccessTime, MdLocalFireDepartment, 
  MdChevronRight, MdOpenInNew, MdSearch, MdMoreVert
} from "react-icons/md";
import clsx from "clsx";

const UserDashboard = () => {
  const user = useSelector((state) => state.userAuth.user);

  const stats = [
    { label: "XP", value: "5", icon: MdStars, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Certificates", value: "0", icon: MdVerified, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Learning Streak", value: "1", icon: MdLocalFireDepartment, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Total Learning Hours", value: "0", icon: MdAccessTime, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const inProgressCourses = user?.enrolled_courses || [
    { 
      id: "demo-1", 
      title: "JavaScript - Working with the Document Object Model and jQuery Plugins", 
      progress: 0,
      thumbnail: "https://marketing-assets.alison.com/images/courses/2361/preview.jpg",
      timeRemaining: "3 hrs 0 mins left"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
             {user?.user_name}'s Dashboard – let's jump back in.
          </h1>
          <div className="flex gap-6 mt-4 border-b border-gray-100">
             <button className="pb-3 text-sm font-bold text-primary border-b-2 border-primary">Learn & Get Certificates</button>
             <button className="pb-3 text-sm font-medium text-gray-500 hover:text-primary flex items-center gap-1.5">
                Career Ready Plan <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">3</span>
             </button>
             <button className="pb-3 text-sm font-medium text-gray-500 hover:text-primary">Get Hired</button>
             <button className="pb-3 text-sm font-medium text-gray-500 hover:text-primary flex items-center gap-1.5">
                Your Earnings <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">1</span>
             </button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={clsx("p-3 rounded-full", stat.bg)}>
              <stat.icon className={clsx("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
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
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center">
               <h2 className="font-bold text-gray-800">Courses In Progress ({inProgressCourses.length})</h2>
               <button className="text-gray-400 hover:text-primary"><MdOpenInNew className="w-5 h-5" /></button>
            </div>
            <div className="divide-y divide-gray-50">
              {inProgressCourses.map((course) => (
                <div key={course.id} className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-28 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={course.thumbnail || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400"} alt="Course" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="font-bold text-gray-800 leading-tight pr-4">{course.title}</h3>
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${course.progress || 10}%` }}></div>
                      </div>
                      <p className="text-xs font-bold text-gray-500">{course.progress || 0}% Complete</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold py-0.5 px-2 bg-slate-100 text-slate-500 rounded uppercase">Last Active: Today</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center md:items-end gap-2">
                    <button className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/5">
                       Continue Learning
                    </button>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">{course.timeRemaining || "New Activity"}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Marketing Banner */}
          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 flex items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">📱</div>
                <p className="text-primary font-medium">No internet? No problem! Download any course on the app and learn on the go.</p>
             </div>
             <button className="bg-white px-6 py-2 rounded-lg font-bold text-primary border border-primary/20 shadow-sm whitespace-nowrap">Get App</button>
          </div>
        </div>

        {/* Sidebar Mini Components */}
        <div className="space-y-6">
           {/* Profile Completion Card */}
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2"><MdMoreVert className="text-gray-300" /></div>
              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 relative mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                       <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="276" strokeDashoffset="184" className="text-primary" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-xl font-bold text-gray-800">33%</span>
                       <span className="text-[8px] font-bold text-gray-400 uppercase">Complete</span>
                    </div>
                 </div>
                 <h4 className="font-bold text-gray-800">Finish Your Profile</h4>
                 <p className="text-sm text-gray-500 mt-1">Get noticed by employers by completing your profile details.</p>
                 <button className="mt-4 w-full py-2 border-2 border-primary/10 text-primary font-bold rounded-lg hover:bg-primary/5 transition">Update Now</button>
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
