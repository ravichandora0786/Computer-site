import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd, MdRemove } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { fetchFaqData } from "./slice";
import { selectFaqData } from "./slice"; // Using the selector from slice as verified earlier

const FAQ = () => {
  const [activeId, setActiveId] = React.useState(null);
  const dispatch = useDispatch();
  const faqs = useSelector(selectFaqData) || [];

  useEffect(() => {
    dispatch(fetchFaqData());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-main tracking-tight mb-4 italic underline decoration-primary decoration-4 underline-offset-8">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-500 font-medium">Everything you need to know about the Computer Site platform.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = activeId === (faq.id || index);
            return (
              <div key={faq.id || index} className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all hover:border-primary/20">
                <button 
                  onClick={() => setActiveId(isOpen ? null : (faq.id || index))}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={clsx("text-lg font-bold transition-colors", isOpen ? "text-primary" : "text-main")}>{faq.question}</span>
                  <div className={clsx("h-8 w-8 rounded-full flex items-center justify-center transition-all", isOpen ? "bg-primary text-white" : "bg-gray-50 text-main")}>
                    {isOpen ? <MdRemove size={20} /> : <MdAdd size={20} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-gray-500 font-medium leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
