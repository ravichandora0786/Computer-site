import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchAboutData } from "./slice";
import { selectAboutData, selectAboutLoading } from "./selector";

const About = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectAboutData) || [];
  const loading = useSelector(selectAboutLoading);

  useEffect(() => {
    dispatch(fetchAboutData());
  }, [dispatch]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center text-primary font-bold">Loading Computer Site Story...</div>;

  const heroSection = data.find((s) => s.is_hero_section);
  const otherSections = data.filter((s) => !s.is_hero_section);

  return (
    <div className="container mx-auto px-4 py-20 animate-fadeIn">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {heroSection ? (
          <>
            <h1 className="text-4xl md:text-5xl font-black text-main tracking-tight mb-6">
              {heroSection.title}
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-12">
              {heroSection.content}
            </p>
          </>
        ) : (
          <h1 className="text-4xl md:text-5xl font-black text-main tracking-tight mb-6">
            Empowering the World Through <span className="text-primary italic underline decoration-primary/20 decoration-8 underline-offset-8">Next-Gen Education</span>
          </h1>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-10">
          {otherSections.map((section, index) => (
            <motion.div 
              key={section.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-gray-50 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-bold text-main mb-4">{section.title}</h3>
              {section.subtitle && <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{section.subtitle}</p>}
              <p className="text-sm text-gray-500 font-medium">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
