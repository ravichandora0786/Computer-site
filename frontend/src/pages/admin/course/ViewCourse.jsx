import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOutlineModeEdit, MdArrowBack, MdCalendarToday, MdPerson, MdLayers, MdAttachMoney } from "react-icons/md";
import { httpRequest } from "@/request";
import { endPoints } from "../../../request";
import DynamicPreview from "../../../components/ui/DynamicPreview";
import LoadingButton from "../../../components/ui/LoadingButton";
import clsx from "clsx";

const ViewCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.get(`${endPoints.CourseById}/${id}`);
      setCourse(response?.data);
    } catch (error) {
      console.error("Failed to fetch course details", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft": return "text-gray-600 bg-gray-100 border-gray-200";
      case "active": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "inactive": return "text-rose-700 bg-rose-50 border-rose-200";
      case "archived": return "text-amber-700 bg-amber-50 border-amber-200";
      case "coming soon": return "text-blue-700 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) return <div className="p-20 text-center text-primary font-bold animate-pulse">Establishing studio link...</div>;
  if (!course) return <div className="p-20 text-center text-red-500 font-bold">Course not found in the studio.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate("/admin/courses")}
          className="flex items-center gap-2 text-muted hover:text-primary transition-colors font-bold uppercase text-xs tracking-widest"
        >
          <MdArrowBack size={18} /> Back to Studio
        </button>
        <Link
          to={`/admin/courses/edit/${id}`}
          className="bg-primary text-white px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
        >
          <MdOutlineModeEdit size={16} /> Edit Profile
        </Link>
      </div>

      {/* Hero Section */}
      <div className="rounded-[32px] bg-white border border-gray-100 p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="w-full md:w-80 shrink-0">
            <DynamicPreview 
              src={course.media?.sort((a,b) => (a.order_index || 0) - (b.order_index || 0))[0]?.url} 
              type={course.media?.[0]?.media_type || 'image'}
              size="lg"
              className="!w-full !h-52 !rounded-[24px] shadow-2xl"
            />
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                  {course.category?.title || "Uncategorized"}
                </span>
                <span className={clsx(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  getStatusColor(course.status)
                )}>
                  {course.status}
                </span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none italic uppercase underline decoration-primary decoration-4 underline-offset-8">
                {course.title}
              </h1>
            </div>

            <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
              {course.description || "No concept description provided for this studio project."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-gray-50">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted flex items-center gap-1"><MdPerson size={10} /> Lead Teacher</p>
                <p className="font-bold text-gray-900">{course.author_details?.user_name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted flex items-center gap-1"><MdLayers size={10} /> Experience</p>
                <p className="font-bold text-gray-900 capitalize">{course.course_level}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted flex items-center gap-1"><MdCalendarToday size={10} /> Launch</p>
                <p className="font-bold text-gray-900 italic">{course.publish_date || "Coming Soon"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted flex items-center gap-1"><MdAttachMoney size={10} /> Price Tiers</p>
                <p className="font-bold text-emerald-600">${course.fixed_amount || "0.00"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Media Gallery */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-[32px] bg-white border border-gray-100 p-8 shadow-xl">
             <h3 className="text-xl font-black text-main tracking-tight uppercase italic mb-6">Gallery Assets</h3>
             {course.media?.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {course.media.map((item, idx) => (
                   <div key={idx} className="aspect-video rounded-2xl overflow-hidden shadow-sm hover:scale-105 transition-transform">
                      <DynamicPreview src={item.url} type={item.media_type} className="!w-full !h-full border-none" />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-10 border-2 border-dashed border-gray-100 rounded-[28px] text-center text-muted font-bold text-xs uppercase tracking-widest">
                 No studio assets deployed for this project.
               </div>
             )}
          </div>
        </div>

        {/* Studio Pricing Card */}
        <div className="space-y-6">
          <div className="rounded-[32px] bg-gray-900 p-8 shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/30 transition-all pointer-events-none" />
            <h3 className="text-lg font-black tracking-tight uppercase italic mb-6">Pricing Tiers</h3>
            <div className="space-y-6">
               <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly</span>
                  <p className="text-2xl font-black italic underline decoration-primary decoration-2 underline-offset-4">${course.monthly_amount || "0.00"}</p>
               </div>
               <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Yearly</span>
                  <p className="text-2xl font-black italic underline decoration-primary decoration-2 underline-offset-4">${course.yearly_amount || "0.00"}</p>
               </div>
               <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Lifetime</span>
                  <p className="text-2xl font-black italic text-primary underline decoration-white decoration-2 underline-offset-4">${course.fixed_amount || "0.00"}</p>
               </div>
            </div>
            
            <div className="mt-10 bg-white/5 order-2 p-4 rounded-2xl border border-white/10">
               <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-2">Studio Discount</p>
               <p className="text-4xl font-black italic">{course.discount_percentage}% OFF</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewCourse;
