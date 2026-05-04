import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MdCheckCircle, MdSchool, MdStars, MdEdit, 
  MdChevronRight, MdWorkspacePremium, MdFileDownload,
  MdShare, MdVerified, MdEmojiEvents, MdLibraryBooks,
  MdHourglassEmpty, MdSend, MdLocationOn, MdInfo
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "./slice";
import * as selectors from "./selector";

const ClaimCertificate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, dashboardStats } = useSelector((state) => state.userAuth);
  
  const dbCertificates = useSelector(selectors.selectUserCertificates);
  const loading = useSelector(selectors.selectUserLoading);
  const applying = useSelector(selectors.selectApplyingStatus);

  const [name, setName] = useState(user?.user_name || "");

  const enrolledCourses = dashboardStats?.enrolledCourses || [];
  const completedCourses = enrolledCourses.filter(c => c.progress === 100 || c.timeRemaining === 'Completed');

  useEffect(() => {
    dispatch(actions.fetchUserCertificates());
  }, [dispatch]);

  const handleApply = (courseId) => {
    dispatch(actions.applyForCertificate({
      courseId,
      custom_name: name
    }));
  };

  // View 1: Placeholder/Empty State (No courses completed)
  const PlaceholderView = () => (
    <div className="min-h-[calc(100vh-160px)] flex flex-col lg:flex-row overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="flex-1 bg-[#011F3F] p-8 lg:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -ml-32 -mb-32" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 max-w-lg">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight uppercase italic tracking-tighter">Once you complete a course, you will be able to claim your Certification!</h1>
          <div className="relative group perspective-1000 mb-12">
            <div className="bg-white p-4 rounded-xl shadow-2xl transform transition-transform group-hover:scale-105 duration-500">
              <div className="border-8 border-emerald-500/20 p-6 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 p-4 opacity-10"><MdSchool size={100} className="text-gray-900" /></div>
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2"><MdStars size={24} /></div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Digital Credential</p>
                   </div>
                   <p className="text-[10px] font-bold text-gray-400 italic uppercase">SAMPLE CERT</p>
                </div>
                <div className="space-y-4 py-4">
                   <h2 className="text-lg font-black text-gray-900 tracking-tighter uppercase italic">Certificate</h2>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest">This awards that</p>
                   <p className="text-2xl font-black text-primary tracking-tighter uppercase italic py-2 border-b-2 border-gray-100">{name || "Your Name Here"}</p>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest">has successfully completed the course</p>
                   <p className="text-sm font-bold text-gray-800 tracking-tight italic uppercase">Sample Professional Program</p>
                </div>
                <div className="mt-8 flex justify-between items-end border-t pt-4">
                   <div><div className="w-12 h-0.5 bg-gray-200 mb-1" /><p className="text-[6px] font-bold text-gray-400 uppercase">Director Signature</p></div>
                   <div className="w-12 h-12"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VerifyCertificate" className="w-full opacity-30" alt="QR" /></div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-left max-w-md mx-auto">
             {["Highlight your skills to potential employers", "Share your abilities on professional social media", "Show your current employer your initiative and drive to learn"].map((text, i) => (
               <div key={i} className="flex items-center gap-3 text-gray-300 text-sm italic font-medium"><MdCheckCircle className="text-primary flex-shrink-0" /><span>{text}</span></div>
             ))}
          </div>
        </motion.div>
      </div>
      <div className="flex-1 p-8 lg:p-16 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="max-w-md w-full">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4 leading-relaxed uppercase italic tracking-tighter">So, start learning now, and get closer to earning your Certification!</h2>
          <div className="space-y-6">
            <button onClick={() => navigate("/user/courses")} className="w-full py-4 bg-[#00A8E8] hover:bg-[#0096D1] text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 active:scale-95 group uppercase italic tracking-widest text-xs">
              Start Learning <MdChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full py-4 bg-[#F7A600] hover:bg-[#E59900] text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-500/20 active:scale-95 group uppercase italic tracking-widest text-xs"><MdWorkspacePremium size={24} />Premium Learning</button>
            <div className="relative mt-12">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Edit Name" className="w-full py-4 px-12 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all shadow-sm italic font-black uppercase text-sm" />
              <MdEdit className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // View 2: Professional List View (1 or more courses completed)
  const CertificateListView = () => (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none"><MdEmojiEvents size={200} className="text-primary" /></div>
         <div className="z-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tighter uppercase italic mb-2">My Achievements</h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold italic uppercase text-xs tracking-widest">You have earned {completedCourses.length} professional certificates. Keep up the great work!</p>
         </div>
         <div className="flex gap-4 z-10 font-black italic">
            <div className="bg-primary/10 px-6 py-4 rounded-2xl text-center border border-primary/20">
               <div className="text-2xl text-primary leading-none">{completedCourses.length}</div>
               <div className="text-[9px] text-primary/60 uppercase tracking-widest mt-1">Earned</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {completedCourses.map((course, index) => {
          const isPaid = course.access_type !== 'Free';
          const isOffline = course.course_mode === 'Offline';
          const dbCert = dbCertificates.find(c => c.courseId === course.courseId);
          const isPending = dbCert?.status === 'pending';
          const isApproved = !isPaid || (dbCert?.status === 'approved');
          const hasApplied = !!dbCert;
          const canDownload = isApproved && !isOffline;

          return (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              
              {/* Type & Mode Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic shadow-lg ${isPaid ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {isPaid ? 'Premium Program' : 'Free Learning'}
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic shadow-lg flex items-center gap-1 ${isOffline ? 'bg-blue-600 text-white' : 'bg-primary text-white'}`}>
                  {isOffline ? <><MdLocationOn size={10} /> Offline Mode</> : <><MdVerified size={10} /> Online Mode</>}
                </div>
              </div>

              <div className="aspect-[16/10] bg-[#011F3F] p-4 relative flex items-center justify-center overflow-hidden">
                {isPaid && !isApproved && (
                  <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                    <MdHourglassEmpty className="text-orange-500 mb-2 animate-bounce" size={32} />
                    <p className="text-white font-black italic uppercase text-[10px] tracking-widest">
                      {isPending ? 'Application Sent' : 'Application Required'}
                    </p>
                    <p className="text-white/60 text-[8px] mt-1 font-medium italic">
                      {isPending ? 'Your request is being reviewed by the admin.' : 'Click below to apply for your official certificate.'}
                    </p>
                  </div>
                )}
                
                {isApproved && isOffline && (
                  <div className="absolute inset-0 bg-blue-900/60 z-10 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                    <MdLocationOn className="text-white mb-2" size={32} />
                    <p className="text-white font-black italic uppercase text-[10px] tracking-widest">Offline Collection</p>
                    <p className="text-white/80 text-[8px] mt-2 font-bold italic leading-relaxed">
                      This is an offline course certificate. Please collect your physical copy from the main office.
                    </p>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-full h-full bg-white rounded shadow-2xl p-2 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 origin-bottom-right scale-90 group-hover:scale-100 flex flex-col justify-center items-center text-center">
                  <MdVerified className="text-primary mb-1" size={20} />
                  <p className="text-[6px] font-black text-gray-900 uppercase tracking-tighter line-clamp-1">{course.title}</p>
                  {isApproved && isPaid && dbCert && <p className="text-[4px] font-black text-primary uppercase mt-1 tracking-widest">ID: {dbCert.certificate_number}</p>}
                </div>
                {canDownload && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="p-2 bg-white rounded-full text-primary shadow-lg hover:scale-110 transition-transform"><MdFileDownload size={20} /></button>
                    <button className="p-2 bg-white rounded-full text-gray-600 shadow-lg hover:scale-110 transition-transform"><MdShare size={20} /></button>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-gray-800 dark:text-white leading-tight uppercase italic line-clamp-1">{course.title}</h3>
                    {isApproved && isPaid && dbCert ? (
                      <p className="text-[10px] text-primary font-black uppercase mt-1 tracking-widest"># {dbCert.certificate_number}</p>
                    ) : (
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest italic">
                        {isPaid ? (isPending ? 'Review In Progress' : 'Action Required') : 'Open Access'}
                      </p>
                    )}
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isApproved ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'}`}>
                    {isApproved ? <MdCheckCircle size={20} /> : <MdHourglassEmpty size={20} />}
                  </div>
                </div>
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-[9px] font-black text-gray-400 uppercase italic tracking-widest">
                      COMPLETED: {new Date(course.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {canDownload && (
                      <button className="text-primary font-black text-[10px] italic hover:underline flex items-center gap-1 uppercase tracking-widest">View Full <MdChevronRight /></button>
                    )}
                  </div>

                  {/* Offline Collection Info */}
                  {isApproved && isOffline && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                       <MdInfo className="text-blue-500 flex-shrink-0" size={18} />
                       <p className="text-[9px] font-bold text-blue-600 uppercase italic tracking-tight">
                         Visit office with ID proof to collect your certificate.
                       </p>
                    </div>
                  )}

                  {/* Apply Button for Paid Courses */}
                  {isPaid && !hasApplied && (
                    <button 
                      onClick={() => handleApply(course.courseId)}
                      disabled={applying === course.courseId}
                      className="w-full py-2.5 bg-primary text-white rounded-xl font-black italic uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {applying === course.courseId ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Apply for Certificate <MdSend /></>
                      )}
                    </button>
                  )}
                  {isPending && (
                    <div className="w-full py-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-xl font-black italic uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 border border-orange-200 dark:border-orange-800">
                      Application Pending
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="transition-all duration-500">
      {completedCourses.length === 0 ? <PlaceholderView /> : <CertificateListView />}
    </div>
  );
};

export default ClaimCertificate;
