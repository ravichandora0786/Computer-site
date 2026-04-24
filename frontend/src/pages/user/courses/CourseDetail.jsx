import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAccessTime, MdMenuBook, MdPerson, MdStars,
  MdLock, MdCheckCircle, MdKeyboardArrowDown, MdPlayCircleOutline,
  MdShare, MdFavoriteBorder, MdInfoOutline, MdAssignment,
  MdChevronLeft, MdChevronRight, MdPlayCircle, MdVerified
} from "react-icons/md";
import { fetchCourseDetail } from "./slice";
import { selectCourseDetail, selectDetailLoading } from "./selector";
import { openLoginModal, enrollCourseSuccess } from "../auth/slice";
import { httpRequest, endPoints } from "../../../request";
import { toast } from "react-toastify";
import clsx from "clsx";

const CourseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const course = useSelector(selectCourseDetail);
  const loading = useSelector(selectDetailLoading);
  const { isAuthenticated, user } = useSelector((state) => state.userAuth);
  const [activeTab, setActiveTab] = useState("curriculum");
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  const [activePageByLesson, setActivePageByLesson] = useState({});
  const [enrolling, setEnrolling] = useState(false);

  // Timer & Mastery State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedPages, setCompletedPages] = useState({}); // { [lessonId]: Set([pageIds]) }
  const [isTabActive, setIsTabActive] = useState(true);
  const [totalPageSeconds, setTotalPageSeconds] = useState(0);

  // Monitor tab visibility to pause timer when inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleLesson = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const isEnrolled = course?.isEnrolled;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal());
      return;
    }

    if (isEnrolled) {
      toast.info("Transferring to Learning Portal...");
      return;
    }

    try {
      setEnrolling(true);
      const response = await httpRequest.post(endPoints.CreateUserCourse, {
        courseId: id,
        userId: user.id
      });

      dispatch(enrollCourseSuccess(response.data));
      dispatch(fetchCourseDetail(id)); // Refresh course data to update enrollment status locally
      toast.success("Welcome to the Studio! Access Granted.");
    } catch (error) {
      toast.error(error.message || "Enrollment failed. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseDetail(id));
      window.scrollTo(0, 0);
    }
  }, [id, dispatch]);

  // INITIALIZE MASTERED PAGES FROM BACKEND
  useEffect(() => {
    if (course?.modules) {
      const masters = {};
      course.modules.forEach(module => {
        module.lessons?.forEach(lesson => {
          const donePages = lesson.pages
            ?.filter(p => p.user_progress?.[0]?.is_completed)
            ?.map(p => p.id) || [];
          if (donePages.length > 0) {
            masters[lesson.id] = donePages;
          }
        });
      });
      setCompletedPages(masters);
    }
  }, [course]);

  // TIMER EFFECT: Starts when a new page is opened in the Studio Viewer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0 && isTabActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      // PAGE MASTERED (FINAL SYNC)
      setIsTimerRunning(false);
      handlePageMastery(true); // Final sync
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, isTabActive]);

  // HEARTBEAT EFFECT: Syncs time every 10 seconds to persistence
  useEffect(() => {
    let pulse = null;
    if (isTimerRunning && timerSeconds > 0 && isTabActive) {
      pulse = setInterval(() => {
        handlePageMastery(false); // Periodic sync
      }, 10000); // 10s Heartbeat
    }
    return () => clearInterval(pulse);
  }, [isTimerRunning, isTabActive]);

  const handlePageMastery = async (isFinal = false, forceSeconds = null, manualLesson = null, manualPageId = null) => {
    let activeLesson = manualLesson;
    let activePageId = manualPageId;

    if (!activeLesson || !activePageId) {
      Object.keys(activePageByLesson).forEach(lessonId => {
        const lesson = flattenedLessons.find(l => l.id === lessonId);
        if (lesson) {
          activeLesson = lesson;
          activePageId = activePageByLesson[lessonId];
        }
      });
    }

    if (!activeLesson || !activePageId) return;

    const lessonId = activeLesson.id;
    const currentCompleted = completedPages[lessonId] || [];

    // Use forced seconds (for Skip) or 10s for heartbeat, or 0 for final sync
    const secondsIncrement = forceSeconds !== null ? forceSeconds : (isFinal ? 0 : 10);

    console.log('SYNCING PROGRESS TO BACKEND:', { pageId: activePageId, lessonId, courseId: id, secondsIncrement });
    try {
      const response = await httpRequest.post("/lesson-progress/update-page-progress", {
        pageId: activePageId,
        lessonId,
        courseId: id,
        secondsIncrement
      }, { silent: true });
      console.log('BACKEND RESPONSE:', response.data);

      if (response.data?.pageProgress?.is_completed && !currentCompleted.includes(activePageId)) {
        setCompletedPages(prev => ({
          ...prev,
          [lessonId]: [...(prev[lessonId] || []), activePageId]
        }));

        // Refresh detail to get updated percentages and unlock next lessons
        dispatch(fetchCourseDetail(id));
      }
    } catch (err) {
      console.error("Heartbeat failed", err);
    }
  };

  const startPageTimer = (lessonId, page) => {
    const isAlreadyDone = (completedPages[lessonId] || []).includes(page.id) || page.user_progress?.[0]?.is_completed;
    setActivePageByLesson(prev => ({ ...prev, [lessonId]: page.id }));

    const requiredSeconds = (page.required_time || 0);
    setTotalPageSeconds(requiredSeconds);

    if (!isAlreadyDone) {
      const spent = page.user_progress?.[0]?.time_spent || 0;
      const remaining = Math.max(0, requiredSeconds - spent);

      setTimerSeconds(remaining);
      setIsTimerRunning(remaining > 0);

      if (remaining === 0) {
        if (!completedPages[lessonId]?.includes(page.id)) {
          setCompletedPages(prev => ({ ...prev, [lessonId]: [...(prev[lessonId] || []), page.id] }));
        }
        // Force a sync to DB for instant mastery
        const lesson = flattenedLessons.find(l => l.id === lessonId);
        handlePageMastery(true, 0, lesson, page.id);
      }
    } else {
      setTimerSeconds(0);
      setIsTimerRunning(false);
    }
  };

  const handleSkip = async (lesson, activePage) => {
    toast.info("Mastery Skipped - Advancing...");
    const totalTime = totalPageSeconds; // Capture current total
    setTimerSeconds(0);
    setIsTimerRunning(false);
    
    // Send total required time to backend to guarantee completion
    await handlePageMastery(true, totalTime, lesson, activePage.id);

    const idx = lesson.pages.indexOf(activePage);
    if (idx < lesson.pages.length - 1) {
      startPageTimer(lesson.id, lesson.pages[idx + 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>
          <p className="font-black italic uppercase text-primary tracking-[0.4em] text-[10px] animate-pulse">Initializing Studio Experience</p>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const thumbnail = course.media?.find(m => m.media_type === 'image')?.url;
  const thumbnailUrl = thumbnail ? `${apiBase}${thumbnail}` : "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200";

  // Flattened lessons for sequential locking
  const flattenedLessons = course.modules?.reduce((acc, module) => {
    return [...acc, ...(module.lessons || [])];
  }, []) || [];

  return (
    <div className="bg-page selection:bg-primary/20 transition-colors">
      {/* 1. PROFESSIONAL STUDIO HERO (Slim Down) */}
      <section className="relative min-h-[45vh] flex items-center pt-12 pb-14 overflow-hidden bg-main">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={thumbnailUrl}
            className="w-full h-full object-cover transition-transform duration-[15s] hover:scale-110"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-main/80 dark:from-[#050505]/80 via-transparent to-transparent" />
        </div>

        <div className="container max-w-full mx-auto px-4 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
            {/* Left: Elite Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-[30px] p-6 lg:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl max-w-3xl relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] italic">
                    {course.category?.title || "Elite Course"}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-white/40" />
                  <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[8px] font-black uppercase tracking-[0.2em] italic">
                    Studio Edition
                  </span>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic mb-8"
                >
                  {course.title}
                </motion.h1>

                <div className="flex flex-wrap items-center gap-10 text-gray-400">
                  <div className="flex items-center gap-3 group/item">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                      <MdPerson size={20} />
                    </div>
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-500 mb-0.5 italic">Lead Architect</p>
                      <p className="text-base font-black text-white italic">{course.author_details?.user_name || "Nexus Mentor"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group/item">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                      <MdAccessTime size={20} />
                    </div>
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-500 mb-0.5 italic">Duration</p>
                      <p className="text-base font-black text-white italic">{course.duration_month || "12"} Weeks</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Dynamic Visual Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden xl:flex w-32 h-32 rounded-full border border-primary/20 flex items-center justify-center relative backdrop-blur-[5px]"
            >
              <div className="absolute inset-1.5 border border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="text-center relative z-10">
                <p className="text-[8px] font-black text-primary uppercase italic tracking-[0.3em] mb-0.5">Global</p>
                <p className="text-lg font-black text-white uppercase italic tracking-tighter">NEXUS</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. MAIN ECOSYSTEM SECTION */}
      <section className="bg-gray-50/50 dark:bg-[#080808] pb-40 transition-colors">
        <div className="container max-w-full mx-auto px-4 md:px-12">
          {/* SLIM DASHBOARD NAVIGATOR */}
          <div className="flex justify-center -mt-8 relative z-40 mb-16">
            <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-1.5">
              {["overview", "curriculum", "instructor"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all italic",
                    activeTab === tab
                      ? "bg-main dark:bg-primary text-white shadow-lg shadow-main/30"
                      : "text-gray-400 hover:text-main dark:hover:text-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-16"
                  >
                    <div>
                      <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4 italic">Narrative</h3>
                      <h2 className="text-2xl font-black text-main dark:text-white uppercase italic mb-6 tracking-tight">Executive Summary</h2>
                      <div
                        className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed space-y-4 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: course.description || "Initializing narrative..." }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        { title: "Industrial Standard", desc: "Master workflows used by specialists." },
                        { title: "Elite Mentorship", desc: "Guidance from lead architects." }
                      ].map((feat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-start gap-5">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-primary border border-gray-100 dark:border-gray-600">
                            <MdVerified size={20} />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-main dark:text-white uppercase italic mb-1 tracking-tight">{feat.title}</h4>
                            <p className="text-gray-500 dark:text-gray-400 font-medium italic text-xs">{feat.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "curriculum" && (
                  <motion.div
                    key="curriculum"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-center justify-between mb-8 px-2">
                      <div>
                        <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2 italic">Path</h3>
                        <h2 className="text-2xl font-black text-main dark:text-white uppercase italic tracking-tight">Curriculum</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-gray-400 mb-0.5 italic">Total</p>
                        <p className="text-lg font-black text-main dark:text-white italic">{course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Sessions</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {course.modules?.map((module, mIdx) => (
                        <div key={module.id} className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 hover:border-primary/30 transition-all shadow-sm">
                          <div
                            onClick={() => toggleModule(module.id)}
                            className={clsx(
                              "w-full flex items-center justify-between p-4 px-6 text-left transition-all cursor-pointer group",
                              expandedModules[module.id] ? "bg-gray-50/50" : "bg-white"
                            )}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <span className="text-[10px] font-black text-primary italic w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">0{mIdx + 1}</span>
                              <h4 className="text-base font-black text-main uppercase italic tracking-tight">{module.title}</h4>

                              {/* Hover Button for Guests Only */}
                              {!isAuthenticated && (
                                <button
                                  className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-200 ml-4 italic whitespace-nowrap"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(openLoginModal());
                                  }}
                                >
                                  Start Learning <MdPlayCircle size={14} />
                                </button>
                              )}
                            </div>
                            <MdKeyboardArrowDown
                              size={20}
                              className={clsx("text-gray-300 transition-all", expandedModules[module.id] && "rotate-180 text-primary")}
                            />
                          </div>

                          <AnimatePresence>
                            {expandedModules[module.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-t border-gray-50"
                              >
                                <div className="p-4 space-y-4 bg-gray-50/10">
                                  {module.lessons?.map((lesson, lIdx) => {
                                    // SEQUENTIAL LOCKING LOGIC
                                    const lessonIndex = flattenedLessons.findIndex(l => l.id === lesson.id);
                                    const prevLesson = lessonIndex > 0 ? flattenedLessons[lessonIndex - 1] : null;
                                    const isPrevLessonComplete = !prevLesson || (prevLesson.userProgress?.[0]?.progress || 0) >= 90;

                                    const isLocked = !isEnrolled || !isPrevLessonComplete;
                                    const progress = lesson.userProgress?.[0]?.progress || 0;
                                    const isLessonComplete = progress >= 90;
                                    const activePageId = activePageByLesson[lesson.id] || lesson.pages?.[0]?.id;
                                    const activePage = lesson.pages?.find(p => p.id === activePageId);

                                    return (
                                      <div key={lesson.id} className="bg-white rounded-xl border border-gray-50 overflow-hidden shadow-sm">
                                        <button
                                          onClick={() => toggleLesson(lesson.id)}
                                          className="w-full p-3 px-5 flex items-center justify-between hover:bg-gray-50/50 transition-all border-b border-gray-50"
                                        >
                                          <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center text-primary italic font-black text-[9px]">
                                              0{lIdx + 1}
                                            </div>
                                            <h5 className="text-sm font-black uppercase italic tracking-tight text-main dark:text-white">{lesson.title}</h5>
                                          </div>
                                          <div className="flex items-center gap-4">
                                            {isLessonComplete && <div className="flex items-center gap-1 px-2 py-1 bg-green-50/10 text-green-600 text-[7px] font-black uppercase rounded border border-green-500/10 italic">Mastered</div>}
                                            <MdKeyboardArrowDown
                                              size={18}
                                              className={clsx("text-gray-300 transition-all", expandedLessons[lesson.id] && "rotate-180 text-primary")}
                                            />
                                          </div>
                                        </button>

                                        <AnimatePresence>
                                          {expandedLessons[lesson.id] && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                              {!isLocked && lesson.pages?.length > 0 ? (
                                                <div className="flex flex-col xl:flex-row min-h-[300px]">
                                                  <div className="w-full xl:w-56 border-r border-gray-50 bg-gray-50/10 p-4 space-y-1.5">
                                                        {lesson.pages.map((page, pIdx) => {
                                                          const isPageDone = (completedPages[lesson.id] || []).includes(page.id);
                                                          const activePageIndex = lesson.pages.findIndex(p => p.id === activePageId);
                                                          // Unlock if: done, or it's the current active one, or it's the very first page of an unlocked lesson
                                                          const isFuturePage = activePageIndex !== -1 && pIdx > activePageIndex;
                                                          const isLockedInSidebar = !isPageDone && isFuturePage;

                                                          return (
                                                            <button
                                                              key={page.id}
                                                              disabled={isLockedInSidebar}
                                                              onClick={() => startPageTimer(lesson.id, page)}
                                                              className={clsx(
                                                                "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 relative",
                                                                activePageId === page.id ? "bg-white shadow-sm border border-gray-100" : "text-gray-400 hover:text-main",
                                                                isLockedInSidebar && "opacity-50 cursor-not-allowed"
                                                              )}
                                                            >
                                                          <div className={clsx("w-1.5 h-1.5 rounded-full", activePageId === page.id ? "bg-primary" : isPageDone ? "bg-green-500" : "bg-gray-200")} />
                                                          <span className="text-[9px] font-black uppercase italic truncate leading-none">{page.title}</span>
                                                          {isPageDone && <MdCheckCircle size={14} className="text-green-500 ml-auto" />}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                  <div className="flex-1 p-6 bg-white dark:bg-gray-800 relative">
                                                    {/* TIMER UI */}
                                                    {isTimerRunning && activePageId && (
                                                      <div className="absolute top-6 right-6 flex items-center gap-3 bg-main px-4 py-2 rounded-xl shadow-xl z-20">
                                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                        <span className="text-[10px] font-black text-white italic tracking-[0.2em] uppercase">
                                                          Mastery Clock: {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
                                                        </span>
                                                      </div>
                                                    )}

                                                    {(!isTimerRunning && (completedPages[lesson.id] || []).includes(activePageId)) && (
                                                      <div className="absolute top-6 right-6 flex items-center gap-2 bg-green-500 px-4 py-2 rounded-xl shadow-xl z-20">
                                                        <MdVerified size={14} className="text-white" />
                                                        <span className="text-[10px] font-black text-white italic tracking-[0.2em] uppercase">Mastered</span>
                                                      </div>
                                                    )}

                                                    <AnimatePresence mode="wait">
                                                      <motion.div key={activePage?.id} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                                                        <h3 className="text-xl font-black text-main dark:text-white uppercase italic mb-6 tracking-tight leading-tight">{activePage?.title}</h3>
                                                        <div className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed italic prose max-w-none" dangerouslySetInnerHTML={{ __html: activePage?.html_content || "Loading..." }} />

                                                        {/* Define isPageDone for current active page */}
                                                        {(() => {
                                                          const isPageDone = (completedPages[lesson.id] || []).includes(activePage?.id);
                                                          const spent = totalPageSeconds - timerSeconds;
                                                          const progress = totalPageSeconds > 0 ? (spent / totalPageSeconds) : 0;
                                                          const canSkip = !isPageDone && progress >= 0.5;
                                                          const canProceed = isPageDone || progress >= 0.95;

                                                          return (
                                                            <div className="mt-10 pt-4 border-t border-gray-50 flex items-center justify-between">
                                                              <button disabled={lesson.pages.indexOf(activePage) === 0} onClick={() => { const idx = lesson.pages.indexOf(activePage); startPageTimer(lesson.id, lesson.pages[idx - 1]); }} className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-300 hover:text-primary transition-all disabled:opacity-10"><MdChevronLeft size={16} /> Prev</button>
                                                              
                                                              <div className="flex items-center gap-4">
                                                                {canSkip && (
                                                                  <button 
                                                                    onClick={() => handleSkip(lesson, activePage)}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-[8px] font-black uppercase italic rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                                                                  >
                                                                    Skip & Advance <MdCheckCircle size={14} />
                                                                  </button>
                                                                )}
                                                                <button
                                                                  disabled={lesson.pages.indexOf(activePage) === lesson.pages.length - 1 || !canProceed}
                                                                  onClick={() => { const idx = lesson.pages.indexOf(activePage); startPageTimer(lesson.id, lesson.pages[idx + 1]); }}
                                                                  className="flex items-center gap-2 text-[8px] font-black uppercase text-primary hover:text-main transition-all disabled:opacity-10"
                                                                >
                                                                  Next <MdChevronRight size={16} />
                                                                </button>
                                                              </div>
                                                            </div>
                                                          );
                                                        })()}
                                                      </motion.div>
                                                    </AnimatePresence>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="p-16 flex flex-col items-center justify-center text-center bg-gray-50/10 rounded-2xl border-2 border-dashed border-gray-100 mx-4 my-2">
                                                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center text-gray-200 mb-6 border border-gray-50 dark:border-gray-700">
                                                    <MdLock size={32} />
                                                  </div>
                                                  <h4 className="text-lg font-black text-main dark:text-white uppercase italic mb-2">Content Locked</h4>
                                                  <p className="text-[10px] font-bold text-gray-400 mb-8 uppercase tracking-widest max-w-[200px] mx-auto italic"> Enroll or Login to unlock this premium Studio session </p>
                                                  {!isAuthenticated ? (
                                                    <button
                                                      onClick={() => dispatch(openLoginModal())}
                                                      className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
                                                    >
                                                      Start Learning
                                                    </button>
                                                  ) : (
                                                    <button
                                                      onClick={handleEnroll}
                                                      className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-opacity-90 shadow-lg shadow-primary/10 transition-all active:scale-95"
                                                    >
                                                      Enroll Now
                                                    </button>
                                                  )}
                                                </div>
                                              )}
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}

                                  {/* MODULE ASSESSMENT / MOCK ASSIGNMENT */}
                                  {module.test && (
                                    <div className="mt-8 px-2 pb-6">
                                      {(() => {
                                        const isModuleComplete = module.lessons?.length > 0 && module.lessons.every(lesson => (lesson.userProgress?.[0]?.progress || 0) >= 90);
                                        return (
                                          <div className={clsx(
                                            "flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl border transition-all duration-700",
                                            isModuleComplete
                                              ? "bg-primary/[0.03] border-primary/20 shadow-lg shadow-primary/5"
                                              : "bg-gray-50 border-gray-100 opacity-60 grayscale-[0.8]"
                                          )}>
                                            <div className="flex items-center gap-5">
                                              <div className={clsx(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-700 shadow-sm border border-white",
                                                isModuleComplete ? "bg-primary text-white scale-105" : "bg-gray-200 text-gray-400"
                                              )}>
                                                {isModuleComplete ? <MdAssignment size={20} /> : <MdLock size={20} />}
                                              </div>
                                              <div>
                                                <h4 className={clsx("text-sm font-black uppercase italic tracking-tight", isModuleComplete ? "text-main" : "text-gray-400")}>Studio Mock Assignment</h4>
                                                <p className={clsx("text-[8px] font-bold italic mt-1 uppercase tracking-wider", isModuleComplete ? "text-primary/80" : "text-gray-400")}>
                                                  {isModuleComplete ? "Portal Active: Verify your mastery now." : "Complete all sessions with 90%+ mastery to unlock assessment."}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="mt-5 md:mt-0">
                                              {isModuleComplete ? (
                                                <button className="px-6 py-2.5 rounded-xl bg-main text-white text-[9px] font-black uppercase tracking-[0.2em] italic hover:bg-primary hover:-translate-y-1 transition-all shadow-md">
                                                  Begin Assessment
                                                </button>
                                              ) : (
                                                <div className="px-5 py-2 rounded-lg border border-gray-200 text-[8px] font-black text-gray-300 uppercase tracking-widest italic">
                                                  Assessment Locked
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "instructor" && (
                  <motion.div
                    key="instructor"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-10 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl flex flex-col xl:flex-row gap-8 items-center"
                  >
                    <div className="w-40 h-40 rounded-2xl overflow-hidden grayscale border-4 border-gray-50 shadow-lg">
                      <img src={course.author_details?.profile_img || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"} className="w-full h-full object-cover" alt="Mentor" />
                    </div>
                    <div className="flex-1 text-center xl:text-left">
                      <h4 className="text-[9px] font-black text-primary uppercase mb-2 italic">Mentor</h4>
                      <h2 className="text-3xl font-black text-main dark:text-white uppercase italic mb-4 tracking-tight">{course.author_details?.user_name || "Nexus Mentor"}</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed italic mb-8 max-w-2xl">Industrial craftsmanship specialized in digital architecture.</p>
                      <div className="flex justify-center xl:justify-start gap-10">
                        <div>
                          <div className="text-3xl font-black text-main dark:text-white italic">12K+</div>
                          <div className="text-[8px] font-black text-gray-400 uppercase mt-1">Alumni</div>
                        </div>
                        <div>
                          <div className="text-3xl font-black text-main dark:text-white italic">4.9</div>
                          <div className="text-[8px] font-black text-gray-400 uppercase mt-1">Score</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-5 overflow-hidden group">
                  <div className="aspect-video rounded-xl overflow-hidden mb-5 relative group cursor-pointer shadow-md border border-gray-100 dark:border-gray-700">
                    <img src={thumbnailUrl} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 dark:brightness-[0.9] dark:contrast-[1.1]" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <MdPlayCircle size={48} className="text-white drop-shadow-xl" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6 border-b border-gray-50 dark:border-gray-700 pb-4">
                    <span className="text-3xl font-black text-main dark:text-white italic tracking-tight">
                      {course.access_type === "Free" ? "Free" : `₹${course.fixed_amount || "0"}`}
                    </span>
                    {course.access_type !== "Free" && <span className="text-sm text-gray-300 line-through font-bold">₹12,499</span>}
                  </div>

                  <button onClick={handleEnroll} disabled={enrolling} className={clsx("w-full py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all mb-4 italic flex items-center justify-center gap-2", isEnrolled ? "bg-green-500 text-white" : "bg-primary text-white", "hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 shadow-lg shadow-primary/20")}>
                    {enrolling ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : isEnrolled ? "Continue Training" : "Enroll Studio"}
                  </button>

                  <div className="space-y-3">
                    <h5 className="text-[8px] font-black text-main dark:text-white uppercase italic border-b border-gray-50 dark:border-gray-700 pb-2">Assets:</h5>
                    {[
                      { icon: MdPlayCircleOutline, label: "HQ Masterclasses" },
                      { icon: MdInfoOutline, label: "Industrial Assets" },
                      { icon: MdStars, label: "Studio Cert" }
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 group/feat cursor-default">
                        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-primary group-hover/feat:bg-primary group-hover/feat:text-white transition-all">
                          <feat.icon size={16} />
                        </div>
                        <span className="text-[10px] font-black italic text-gray-600 tracking-tight">{feat.label}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 border border-gray-100 text-[8px] text-gray-400 rounded-lg font-black uppercase tracking-[0.2em] hover:bg-gray-50 hover:text-main transition-all flex items-center justify-center gap-2 italic"><MdShare size={16} /> Share</button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
