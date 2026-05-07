import React, { useRef } from 'react';
import { MdArrowBack, MdArrowForward, MdChevronRight } from 'react-icons/md';
import CourseCard from './CourseCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CourseSlider = ({ 
  courses = [], 
  title = "Featured Programs", 
  subtitle = "", 
  viewAllLink = null 
}) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (!courses || courses.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white tracking-tighter uppercase italic leading-none">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-400 font-bold uppercase italic text-[10px] tracking-widest mt-2">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {viewAllLink && (
            <button 
              onClick={() => navigate(viewAllLink)}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline italic mr-4"
            >
              View All <MdChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all"
            >
              <MdArrowBack size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all"
            >
              <MdArrowForward size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-10 -mx-4 px-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {courses.map((course, index) => (
            <motion.div 
              key={course.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-[285px] sm:w-[350px] snap-start"
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSlider;
