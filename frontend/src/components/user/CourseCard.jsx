import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MdAccessTime, MdPeople, MdPerson, MdCheck, 
  MdInfo, MdPlayArrow, MdBarChart, MdWorkspacePremium 
} from "react-icons/md";
import clsx from "clsx";

const CourseCard = ({ course }) => {
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

  const isEnrolled = course.isEnrolled;

  const calculateDuration = () => {
    if (course.course_mode === 'Offline') {
      if (course.publish_date && course.expire_date) {
        const start = new Date(course.publish_date);
        const end = new Date(course.expire_date);
        const diffTime = Math.abs(end - start);
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        return `${diffWeeks} weeks`;
      }
      return "TBD";
    } else {
      const totalMin = parseFloat(course.total_duration_min || 0);
      if (totalMin < 1 && totalMin > 0) {
        return `${Math.round(totalMin * 60)} secs`;
      }
      if (totalMin >= 60) {
        return `${(totalMin / 60).toFixed(1)} hrs`;
      }
      return `${Number(totalMin.toFixed(1))} mins`;
    }
  };

  const getThumbnail = () => {
    const imageMedia = course.media?.find(m => m.media_type === 'image');
    if (imageMedia?.url) return `${apiBase}${imageMedia.url}`;
    return "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200";
  };

  // Extract learning outcomes from overview (assuming newline or comma separated)
  const learningOutcomes = course.overview 
    ? course.overview.split(/[,\n]/).slice(0, 3).map(item => item.trim())
    : ["Master the core concepts", "Practical hands-on exercises", "Industry best practices"];

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      {/* Top Banner - Level */}
      <div className="bg-purple-50 dark:bg-purple-900/20 py-2 px-6 flex items-center justify-center gap-2">
        <MdBarChart className="text-purple-600 dark:text-purple-400 rotate-90" size={18} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-700 dark:text-purple-300 italic">
          {course.course_level || "Beginner Level"}
        </span>
      </div>

      {/* Image Section */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={getThumbnail()}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Certificate Badge */}
        <div className="absolute top-4 right-[-35px] rotate-45 bg-white dark:bg-gray-800 px-10 py-1 shadow-xl flex items-center gap-1">
            <MdWorkspacePremium className="text-amber-500 -rotate-45" size={14} />
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-800 dark:text-white -rotate-45">Certificate</span>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
             <Link 
                to={`/course-detail/${course.id}`}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500"
             >
                <MdPlayArrow size={32} />
             </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
          {course.title}
        </h2>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <MdAccessTime size={16} />
            <span className="text-xs font-bold">{calculateDuration()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <MdPeople size={16} />
            <span className="text-xs font-bold">{course.total_reviews ? (course.total_reviews * 123).toLocaleString() : '12,450'} learners</span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-gray-400 font-medium italic">By</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700 pb-0.5">
            {course.author_details?.user_name || "Academy Expert"}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full mb-6" />

        {/* Learning Outcomes */}
        <div className="mb-8 flex-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">You Will Learn How To</h4>
          <ul className="space-y-3">
            {learningOutcomes?.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-3 group/item">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <MdCheck className="text-emerald-500" size={12} />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {outcome}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto pt-4">
          <Link
            to={`/course-detail/${course.id}`}
            className="flex-1 py-3 px-2 rounded-xl border border-gray-200 dark:border-gray-700 text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-center flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <MdInfo size={16} className="flex-shrink-0" /> More Info
          </Link>
          <Link
            to={`/course-detail/${course.id}`}
            className="flex-[1.5] py-3 px-2 rounded-xl bg-[#00966b] text-white text-[10px] font-black uppercase tracking-wider hover:bg-[#007a57] transition-all shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="truncate">{isEnrolled ? "Continue" : "Start Learning"}</span> <MdPlayArrow size={16} className="flex-shrink-0" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
