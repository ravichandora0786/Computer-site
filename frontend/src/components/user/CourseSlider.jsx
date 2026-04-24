import React, { useRef } from 'react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import CourseCard from './CourseCard';
import { motion } from 'framer-motion';

const CourseSlider = ({ courses = [], title = "Featured Programs" }) => {
  const scrollRef = useRef(null);

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
    <div className="relative group">
      {/* Navigation Buttons */}
      <div className="absolute -top-16 right-0 flex gap-3 z-10">
        <button 
          onClick={() => scroll('left')}
          className="p-3 rounded-full border-2 border-main/10 text-main hover:bg-main hover:text-white transition-all duration-300 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          <MdArrowBack size={24} />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="p-3 rounded-full border-2 border-main/10 text-main hover:bg-main hover:text-white transition-all duration-300 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next"
        >
          <MdArrowForward size={24} />
        </button>
      </div>

      {/* Slider Container */}
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
  );
};

export default CourseSlider;
