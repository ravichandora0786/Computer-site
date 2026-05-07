import React, { useState } from "react";
import { MdInfo, MdMoreVert, MdDeleteSweep, MdVisibility, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { httpRequest, endPoints } from "@/request";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { useDispatch } from "react-redux";
import { setDashboardStats } from "@/pages/user/auth/slice";

const CourseProgressCard = ({ course, apiBase, navigate }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const displayThumb = course.thumbnail;
  const isCompleted = course.progress === 100 || course.timeRemaining === 'Completed';

  const refreshStats = async () => {
    try {
      const response = await httpRequest.get(endPoints.UserDashboardStats);
      dispatch(setDashboardStats(response.data));
    } catch (error) {
      console.error("Error refreshing dashboard stats:", error);
    }
  };

  const handleUnenroll = async () => {
    setIsUnenrolling(true);
    try {
      await httpRequest.delete(endPoints.UnenrollCourse, { data: { userCourseId: course.user_course_id } });
      toast.success("Successfully unenrolled from course");
      setShowConfirmModal(false);
      refreshStats();
    } catch (error) {
      toast.error(error.message || "Failed to unenroll");
    } finally {
      setIsUnenrolling(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:shadow-md transition-all relative">
      
      {/* Thumbnail */}
      <div className="w-full md:w-32 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        <img 
          src={displayThumb ? `${apiBase}${displayThumb}` : "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400"} 
          alt="Course" 
          className="w-full h-full object-cover" 
        />
      </div>
      
      {/* Title and Progress */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h3 className="font-bold text-gray-800 dark:text-white truncate uppercase italic">{course.title}</h3>
          <span className={clsx(
            "text-[9px] font-bold py-1 px-2 rounded uppercase tracking-widest whitespace-nowrap",
            isCompleted ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
          )}>
            {isCompleted ? "Completed" : "Last Active: Today"}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
             <div className={clsx("h-full rounded-full transition-all duration-1000", isCompleted ? "bg-emerald-500" : "bg-primary")} style={{ width: `${course.progress || 0}%` }} />
           </div>
           <span className="text-xs font-black text-gray-400 italic">{course.progress || 0}%</span>
        </div>
      </div>

      {/* Main Action Button */}
      <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => isCompleted ? navigate('/user/certificates') : navigate(`/course-detail/${course.courseId}`)}
            className={clsx(
              "flex-1 md:flex-none px-8 py-3 rounded-xl font-black italic uppercase text-xs tracking-widest transition shadow-lg",
              isCompleted 
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20" 
                : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
            )}
          >
             {isCompleted ? "Claim Certificate" : "Continue Learning"}
          </button>
        </div>
        
        <div className={clsx(
          "px-3 py-1 rounded-full",
          isCompleted ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-blue-50 dark:bg-blue-900/20"
        )}>
          <p className={clsx(
            "text-[10px] font-black uppercase tracking-tighter italic",
            isCompleted ? "text-emerald-600" : "text-blue-600"
          )}>
            {isCompleted ? 'Finalized' : `${course.timeRemaining || 'Few hours'} left`}
          </p>
        </div>
      </div>

      {/* Options Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className={clsx(
            "p-2 rounded-xl transition-colors",
            showMenu ? "bg-gray-100 text-primary" : "text-gray-300 hover:text-gray-500"
          )}
        >
          <MdMoreVert size={24} />
        </button>

        <AnimatePresence>
          {showMenu && (
            <>
              {/* Backdrop for closing */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20"
              >
                <div className="p-2 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      navigate(`/course-detail/${course.courseId}`);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all italic"
                  >
                    <MdVisibility className="text-blue-500" size={18} />
                    View Info
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmModal(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all italic"
                  >
                    <MdDeleteSweep className="text-red-500" size={18} />
                    Unenroll
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleUnenroll}
        isLoading={isUnenrolling}
        title="Unenroll Course?"
        message={`Are you sure you want to unenroll from "${course.title}"? Your progress and test scores for this course will be permanently deleted.`}
        confirmLabel="Unenroll Now"
        variant="red"
      />
    </div>
  );
};

export default CourseProgressCard;
