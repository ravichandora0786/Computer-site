import React from "react";
import { MdLibraryBooks, MdPieChart, MdStars, MdEmojiEvents } from "react-icons/md";
import clsx from "clsx";

const LearnerStats = ({ stats, enrolledCount, completedCount, claimedCount }) => {
  const statCards = [
    { 
      label: "Courses Completed", 
      value: `${completedCount} of ${enrolledCount}`, 
      icon: MdLibraryBooks, 
      color: "text-emerald-500", 
      bg: "bg-emerald-50" 
    },
    { 
      label: "Start to Completion %", 
      value: `${stats?.avgProgress || 0}%`, 
      icon: MdPieChart, 
      color: "text-gray-700", 
      bg: "bg-gray-100" 
    },
    { 
      label: "Average Score", 
      value: `${stats?.avgScore || 0}%`, 
      icon: MdStars, 
      color: "text-amber-500", 
      bg: "bg-amber-50" 
    },
    { 
      label: "Certificates Claimed", 
      value: `${claimedCount} of ${completedCount}`, 
      icon: MdEmojiEvents, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
          <div className={clsx("p-3 rounded-xl", stat.bg)}>
            <stat.icon className={clsx("w-6 h-6", stat.color)} />
          </div>
          <div>
            <p className="text-lg font-black text-gray-800 dark:text-white leading-none">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearnerStats;
