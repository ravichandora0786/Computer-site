import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdFilterList, MdSearch, MdStars, MdArrowForward,
  MdChevronLeft, MdChevronRight, MdClose, MdRefresh
} from "react-icons/md";
import {
  fetchCourses, setFilters, resetFilters
} from "./slice";
import {
  selectCourseItems, selectCoursesLoading,
  selectCoursesFilters, selectCoursesPagination
} from "./selector";
import CourseCard from "@/components/user/CourseCard";
import FilterModal from "./components/FilterModal";
import { httpRequest, endPoints } from "@/request";
import clsx from "clsx";

const CoursesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const items = useSelector(selectCourseItems);
  const loading = useSelector(selectCoursesLoading);
  const filters = useSelector(selectCoursesFilters);
  const pagination = useSelector(selectCoursesPagination);

  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

  useEffect(() => {
    dispatch(resetFilters());
    dispatch(fetchCourses({ page: 1 }));
    loadCategories();
  }, [dispatch]);

  const loadCategories = async () => {
    try {
      const res = await httpRequest.get(endPoints.CourseCategoryOptions);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleApplyFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
    setIsModalOpen(false);
  };

  const isDashboardView = location.pathname.startsWith("/user/courses") || location.pathname.startsWith("/user/my-courses");
  const isMyCoursesRoute = location.pathname.includes("/user/my-courses");

  const [activeTab, setActiveTab] = useState(isMyCoursesRoute ? "enrolled" : "all");

  useEffect(() => {
    setActiveTab(isMyCoursesRoute ? "enrolled" : "all");
  }, [isMyCoursesRoute]);

  const handlePageChange = (page) => {
    dispatch(fetchCourses({ page }));
  };

  const filteredItems = activeTab === "enrolled" 
    ? items.filter(item => item.isEnrolled) 
    : items;

  return (
    <div className={clsx("min-h-screen bg-page pb-20", isDashboardView ? "pt-0" : "pt-32")}>
      <div className={clsx("mx-auto", isDashboardView ? "w-full" : "container max-w-full px-4 md:px-6")}>

        {/* Header Section */}
        <div className={clsx(isDashboardView ? "mb-8" : "mb-12")}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {!isDashboardView && (
                <h1 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4 italic">Elite Library</h1>
              )}
              <h2 className={clsx(
                "tracking-tighter leading-none uppercase italic transition-colors",
                isDashboardView 
                  ? "text-2xl md:text-3xl font-bold text-gray-800 dark:text-white" 
                  : "text-5xl md:text-7xl font-black text-main dark:text-white"
              )}>
                {activeTab === "enrolled" ? "My Journey" : "Mastery Catalog"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <MdSearch className={clsx(
                  "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors",
                  isDashboardView ? "w-5 h-5" : "w-6 h-6"
                )} />
                <input
                  type="text"
                  placeholder="Search mastery..."
                  className={clsx(
                    "pl-12 pr-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl w-full md:w-80 shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold italic dark:text-white",
                    isDashboardView ? "py-2.5 text-sm" : "py-4"
                  )}
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className={clsx(
                  "rounded-2xl flex items-center justify-center transition-all bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95",
                  isDashboardView ? "h-11 w-11" : "h-14 w-14"
                )}
              >
                <MdFilterList size={isDashboardView ? 24 : 28} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">

          <AnimatePresence>
            {isModalOpen && (
              <FilterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
                currentFilters={filters}
                onApply={handleApplyFilters}
              />
            )}
          </AnimatePresence>

          {/* Main Content Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-[2.5rem] h-[400px] animate-pulse border border-gray-50 dark:border-gray-700" />
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                  {filteredItems.map((course, i) => (
                    <CourseCard key={course.id || i} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-4">
                    <button
                      disabled={pagination.currentPage === 1}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-main dark:text-white hover:bg-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      <MdChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={clsx(
                            "h-12 w-12 rounded-2xl text-[10px] font-black tracking-widest transition-all italic",
                            pagination.currentPage === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-main dark:text-white hover:bg-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      <MdChevronRight size={24} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-40 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                <div className="text-gray-300 font-black text-2xl uppercase tracking-[0.2em] italic mb-4">No Mastery Found</div>
                <p className="text-gray-400 font-medium">Clear your filters to reveal the elite database.</p>
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="mt-8 text-primary font-black uppercase tracking-widest text-[10px] italic border-b-2 border-primary"
                >
                  Universal Reset
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
