import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MdTrendingUp, MdSchool, MdGroups, MdStars, 
  MdPlayCircleOutline, MdChevronRight, MdSupportAgent,
  MdFormatQuote, MdArrowForward
} from "react-icons/md";
import { fetchHomeData } from "./slice";
import { selectHomeLoading, selectHomeData } from "./selector";
import CourseCard from "@/components/user/CourseCard";
import CourseSlider from "@/components/user/CourseSlider";
import { apiBase } from "@/request";
import clsx from "clsx";

const Home = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectHomeLoading);
  const data = useSelector(selectHomeData);
  const { 
    courses = [], 
    mentors = [], 
    ratings = [], 
    about = [] 
  } = (data || {});

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const heroData = about?.find(s => s.is_hero_section && s.is_active);

  const stats = [
    { label: "Active Learners", value: "50K+", icon: MdGroups, color: "text-blue-500" },
    { label: "Expert Mentors", value: mentors.length > 0 ? `${mentors.length}+` : "200+", icon: MdSchool, color: "text-primary" },
    { label: "Premium Courses", value: courses.length > 0 ? `${courses.length}+` : "1.2K+", icon: MdTrendingUp, color: "text-green-500" },
    { label: "Quality Rating", value: "4.9/5", icon: MdStars, color: "text-yellow-500" },
  ];

  return (
    <div className="overflow-hidden bg-white selection:bg-primary/20">
      {/* 1. Immersive Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-main">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full opacity-50 animate-pulse" />
        </div>

        <div className="container max-w-full mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] italic">Premium Educational Studio</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase italic mb-8">
                {heroData?.title?.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-primary block" : "block text-white"}>{word}</span>
                )) || (
                  <>
                    MASTER THE <span className="text-primary block">FUTURE</span> OF CODING
                  </>
                )}
              </h1>
              <p className="text-lg text-gray-400 font-medium max-w-lg mb-12 leading-relaxed italic">
                {heroData?.content || "Experience high-fidelity learning with Computer Site. We bridge the gap between amateur skills and industrial mastery."}
              </p>
              
              <div className="flex flex-wrap items-center gap-8">
                <Link to="/courses" className="px-10 py-5 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-white hover:text-primary transition-all shadow-xl shadow-primary/20 active:scale-95 italic">
                  Explore Catalog
                </Link>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-main" alt="learner" />
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-main bg-primary flex items-center justify-center text-[10px] font-black text-white italic">
                    +12K
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden border-[12px] border-white/5 shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-700">
                <img 
                  src={heroData?.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200"} 
                  className="w-full h-full object-cover"
                  alt="Hero Studio"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Excellence Showcase Section */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="container max-w-full mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4 italic">Platform Excellence</h2>
            <h3 className="text-4xl md:text-6xl font-black text-main tracking-tighter uppercase italic">Why Studio Learning Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Live Mastery", desc: "Interactive sessions with industry leaders.", icon: MdStars, color: "bg-blue-500" },
              { title: "Project Plus", desc: "Real-world industrial project matching.", icon: MdTrendingUp, color: "bg-green-500" },
              { title: "Career Vault", desc: "Lifetime access to placement resources.", icon: MdSchool, color: "bg-primary" },
              { title: "Pro Network", desc: "Exclusive access to elite alumni circles.", icon: MdGroups, color: "bg-purple-500" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg", feature.color)}>
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-black text-main uppercase italic mb-4">{feature.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Analytics */}
      <section className="py-20 border-y border-gray-50">
        <div className="container max-w-full mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className={clsx("text-5xl font-black mb-2 italic transition-transform group-hover:scale-110", stat.color)}>
                  {stat.value}
                </div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dynamic Course Catalog */}
      <section className="py-32 bg-white relative">
        <div className="container max-w-full mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 text-main uppercase italic">
            <div>
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">Mastery Library</h2>
              <h3 className="text-4xl md:text-7xl font-black tracking-tighter">Elite Programs</h3>
            </div>
            <Link to="/courses" className="group flex items-center gap-4 text-xs font-black tracking-[0.2em] border-b-2 border-main pb-2 hover:text-primary hover:border-primary transition-all">
              Universal Catalog <MdArrowForward size={22} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="relative">
            <CourseSlider courses={courses} />
          </div>
        </div>
      </section>

      {/* 5. Expert Mentors */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container max-w-full mx-auto px-4 text-center mb-20">
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4 italic">Learn from the Best</h2>
          <h3 className="text-5xl md:text-6xl font-black text-main tracking-tighter leading-none mb-6 italic uppercase">Expert Mentors</h3>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto italic font-bold text-sm">Our instructors are industry leaders with decades of collective experience in digital craftsmanship and strategy.</p>
        </div>

        <div className="container max-w-full mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12">
            {mentors.length > 0 ? (
              mentors.slice(0, 4).map((mentor) => (
                <div key={mentor.id} className="group relative w-full sm:w-[280px]">
                  <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden mb-6 shadow-xl grayscale-[0.8] group-hover:grayscale-0 transition-all duration-700">
                    <img 
                      src={mentor.profile_img ? `${apiBase}${mentor.profile_img}` : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"} 
                      alt={mentor.user_name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="text-2xl font-black text-white italic">{mentor.user_name || "Member"}</div>
                      <div className="text-xs font-bold text-primary uppercase tracking-widest">{mentor.designation || "Studio Mentor"}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full py-20 text-center text-gray-400 font-bold italic border-2 border-dashed border-gray-100 rounded-[3rem]">
                Our expert mentors are preparing the next digital experience.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Global Student Reviews */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container max-w-full mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4 italic">Student Voices</h2>
              <h3 className="text-5xl md:text-7xl font-black text-main tracking-tighter leading-[0.9] mb-8 uppercase italic">What Our People Say</h3>
              <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10 italic">We pride ourselves on delivering a premium learning experience that leads to tangible outcomes and professional growth.</p>
              <div className="flex items-center gap-10">
                <div>
                  <div className="text-4xl font-black text-main italic group-hover:text-primary transition-colors">4.9/5</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Global Rating</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <div className="text-4xl font-black text-main italic">12K+</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Graduates</div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {ratings.length > 0 ? (
                ratings.slice(0, 3).map((review, i) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500"
                  >
                    <MdFormatQuote className="absolute top-6 right-8 text-primary/10 text-6xl group-hover:text-primary/20 transition-colors" />
                    <div className="flex gap-1 text-primary mb-4">
                      {[1, 2, 3, 4, 5].map(s => <MdStars key={s} />)}
                    </div>
                    <p className="text-main font-bold italic mb-6 leading-relaxed relative z-10">"{review.comment}"</p>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden shadow-sm">
                        <img src={review.user?.profile_img || "https://i.pravatar.cc/100"} alt="avatar" />
                      </div>
                      <div>
                        <div className="text-main font-black italic">{review.user?.user_name || "Anonymous Learner"}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Student</div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-300 font-bold italic py-10">No public reviews yet...</div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
