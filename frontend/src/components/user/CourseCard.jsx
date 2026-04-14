import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdAccessTime, MdMenuBook, MdArrowOutward } from "react-icons/md";
import clsx from "clsx";

const CourseCard = ({ course }) => {
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

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
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={getThumbnail()}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
            <MdArrowOutward size={28} />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew() && (
            <div className="px-3 py-1 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-xl italic">
              New
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black text-primary uppercase shadow-lg">
          {course.category?.title || "Hot"}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-main mb-6 line-clamp-2 leading-tight group-hover:text-primary transition-colors italic uppercase">
          {course.title}
        </h3>

        <div className="flex items-center gap-6 mb-8 mt-auto">
          <div className="flex items-center gap-2 text-gray-500">
            <MdAccessTime className="text-primary" size={20} />
            <span className="text-[13px] font-bold italic">{course.duration_month || "10"} weeks</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MdMenuBook className="text-primary" size={20} />
            <span className="text-[13px] font-bold italic">{course.total_lessons || 0} lessons</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="text-lg font-black text-green-600 italic">
            {course.access_type === "Free" ? "Free" : `₹${course.selling_price || course.price}`}
          </div>
          <Link
            to={`/course-detail/${course.id}`} // Placeholder path
            className="text-[14px] font-black text-main hover:text-primary border-b-2 border-transparent hover:border-primary transition-all italic uppercase tracking-wider"
          >
            Enroll now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
