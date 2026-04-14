import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdRefresh, MdCheck } from "react-icons/md";
import clsx from "clsx";

const FilterModal = ({ 
  isOpen, 
  onClose, 
  categories, 
  currentFilters, 
  onApply 
}) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  const handleLocalChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setLocalFilters({
      category_id: "",
      access_type: "",
      course_mode: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-main/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1 italic">Filter Catalog</h2>
            <h3 className="text-3xl font-black text-main tracking-tighter uppercase italic">Mastery Setup</h3>
          </div>
          <button 
            onClick={onClose}
            className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-main hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 space-y-12">
          
          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 italic">Disciplines</h4>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleLocalChange("category_id", "")}
                className={clsx(
                  "px-6 py-3 rounded-xl text-xs font-bold transition-all border-2",
                  localFilters.category_id === "" ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" : "border-gray-100 text-gray-500 hover:border-primary/30"
                )}
              >
                All Subjects
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.value}
                  onClick={() => handleLocalChange("category_id", cat.value)}
                  className={clsx(
                    "px-6 py-3 rounded-xl text-xs font-bold transition-all border-2",
                    localFilters.category_id === cat.value ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" : "border-gray-100 text-gray-500 hover:border-primary/30"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-12">
            {/* Access Type */}
            <div>
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 italic">Access Type</h4>
              <div className="flex flex-wrap gap-3">
                {["Free", "Paid"].map(type => (
                  <button 
                    key={type}
                    onClick={() => handleLocalChange("access_type", localFilters.access_type === type ? "" : type)}
                    className={clsx(
                      "px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-2",
                      localFilters.access_type === type ? "border-primary bg-primary text-white shadow-xl shadow-primary/20" : "border-gray-100 text-gray-400 hover:bg-gray-50 bg-white"
                    )}
                  >
                    {localFilters.access_type === type && <MdCheck size={16} />} {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Mode */}
            <div>
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 italic">Learning Mode</h4>
              <div className="flex flex-wrap gap-3">
                {["Online", "Offline"].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => handleLocalChange("course_mode", localFilters.course_mode === mode ? "" : mode)}
                    className={clsx(
                      "px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-2",
                      localFilters.course_mode === mode ? "border-primary bg-primary text-white shadow-xl shadow-primary/20" : "border-gray-100 text-gray-400 hover:bg-gray-50 bg-white"
                    )}
                  >
                    {localFilters.course_mode === mode && <MdCheck size={16} />} {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/50 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handleReset}
            className="w-full sm:w-auto px-8 py-5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <MdRefresh size={20} /> Reset Setup
          </button>
          <button 
            onClick={() => onApply(localFilters)}
            className="flex-1 w-full px-12 py-5 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95 italic text-center"
          >
            Apply Mastery Filters
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterModal;
