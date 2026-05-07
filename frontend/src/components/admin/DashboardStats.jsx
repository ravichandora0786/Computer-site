import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdPeople, MdSchool, MdTrendingUp, MdCategory, 
  MdWorkspacePremium
} from "react-icons/md";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";

const MiniStat = ({ title, value, colorClass, onClick }) => (
  <div 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all cursor-pointer group/mini"
  >
    <span className="text-[9px] font-black text-gray-400 uppercase italic group-hover/mini:text-primary transition-colors">{title}</span>
    <span className={`text-sm font-black ${colorClass.replace('bg-', 'text-')} italic tracking-tight`}>{value}</span>
  </div>
);

const MainStatCard = ({ title, value, icon: Icon, colorClass, children, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all"
  >
    <div className={`absolute -right-6 -top-6 w-32 h-32 ${colorClass} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700`} />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className={`text-3xl ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">Snapshot</span>
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">{title}</p>
      <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic mb-6">{value}</h3>
      <div className="grid grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  </div>
);

const CompactStat = ({ title, value, icon: Icon, colorClass, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
  >
    <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
      <Icon className={`text-xl ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase italic tracking-widest leading-none mb-1 group-hover:text-primary transition-colors">{title}</p>
      <p className="text-xl font-black text-gray-800 dark:text-white italic tracking-tighter leading-none">{value}</p>
    </div>
  </div>
);

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await httpRequest.get(endPoints.UserCourseStats);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Identity Card */}
      <div className="lg:col-span-1">
        <MainStatCard 
          title="Total Platform Users" 
          value={stats?.totalUsers || 0} 
          icon={MdPeople} 
          colorClass="bg-blue-600"
          onClick={() => navigate('/admin/users')}
        >
          <MiniStat 
            title="Students" 
            value={stats?.totalStudents || 0} 
            colorClass="bg-blue-500" 
            onClick={() => navigate('/admin/users')}
          />
          <MiniStat 
            title="Teachers" 
            value={stats?.totalTeachers || 0} 
            colorClass="bg-purple-500" 
            onClick={() => navigate('/admin/users')}
          />
          <MiniStat 
            title="Admins" 
            value={stats?.totalAdmins || 0} 
            colorClass="bg-rose-500" 
            onClick={() => navigate('/admin/users')}
          />
          {/* Active stat removed as per request */}
        </MainStatCard>
      </div>

      {/* Actionable Metrics Grid */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompactStat 
          title="Total Courses" 
          value={stats?.totalCourses || 0} 
          icon={MdWorkspacePremium} 
          colorClass="bg-indigo-500" 
          onClick={() => navigate('/admin/courses')}
        />
        <CompactStat 
          title="Active Enrollments" 
          value={stats?.totalEnrollments || 0} 
          icon={MdSchool} 
          colorClass="bg-emerald-500" 
          onClick={() => navigate('/admin/enrollments')}
        />
        <CompactStat 
          title="Curriculum Categories" 
          value={stats?.totalCategories || 0} 
          icon={MdCategory} 
          colorClass="bg-orange-500" 
          onClick={() => navigate('/admin/course-categories')}
        />
        <CompactStat 
          title="Engagement Rate" 
          value={`${stats?.avgProgress || 0}%`} 
          icon={MdTrendingUp} 
          colorClass="bg-blue-500" 
        />
        
        {/* Quick Action bar removed as per request */}
      </div>
    </div>
  );
};

export default DashboardStats;
