import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdAccessTime, MdMenuBook, MdArrowOutward, MdCheckCircle } from "react-icons/md";
import clsx from "clsx";

const CourseCard = ({ course }) => {
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

  const isEnrolled = course.isEnrolled;
  console.log(course,isEnrolled);

  const getThumbnail = () => {
    const imageMedia = course.media?.find(m => m.media_type === 'image');
    if (imageMedia?.url) return `${apiBase}${imageMedia.url}`;
    return "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200";
  };

  const isNew = () => {
    const diff = new Date() - new Date(course.createdAt);
    return diff < 7 * 24 * 60 * 60 * 1000;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      <Link to={`/course-detail/${course.id}`} className="flex flex-col h-full">
        {/* Image Header */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={getThumbnail()}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
              <MdArrowOutward className="size-5 md:size-7" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNew() && (
              <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg bg-primary text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest shadow-xl italic">
                New
              </div>
            )}
          </div>
          <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg text-[7px] md:text-[9px] font-black text-primary uppercase shadow-lg">
            {course.category?.title || ""}
          </div>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-1">
          <h2 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-main mb-2 md:mb-6 line-clamp-2 leading-tight group-hover:text-primary transition-colors italic uppercase">
            {course.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 md:gap-6 mt-auto">
            <div className="flex items-center gap-1 md:gap-2 text-gray-500">
              <MdAccessTime className="text-primary size-3 md:size-5" />
              <span className="text-[10px] md:text-[13px] font-bold italic">{course.duration_month || "10"} weeks</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 text-gray-500">
              <MdMenuBook className="text-primary size-3 md:size-5" />
              <span className="text-[10px] md:text-[13px] font-bold italic">{course.total_lessons || 0} lessons</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 md:pt-3 mt-4 border-t border-gray-50">
            <div className="text-sm md:text-lg font-black text-green-600 italic">
              {course.access_type === "Free" ? "Free" : `₹${course.fixed_amount}`}
            </div>
            <div
              className={clsx(
                "text-[10px] md:text-[14px] font-black italic uppercase tracking-wider flex items-center gap-1.5 transition-all",
                isEnrolled ? "text-green-500" : "text-main group-hover:text-primary border-b-2 border-transparent group-hover:border-primary"
              )}
            >
              {isEnrolled ? (
                <>
                  <MdCheckCircle size={18} /> 
                  Enrolled
                </>
              ) : (
                "Enroll now"
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
