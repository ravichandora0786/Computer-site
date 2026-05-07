import React from "react";
import { MdVerified, MdWorkspacePremium, MdSchool } from "react-icons/md";

const CertificatePreview = ({ course, user, certificate, previewRef }) => {
  // Hex Colors to avoid oklch parsing errors in html2canvas (Tailwind 4 compatibility)
  const COLORS = {
    primary: "#011F3F",
    emerald600: "#059669",
    emerald500: "#10b981",
    emerald400: "#34d399",
    emerald50: "#ecfdf5",
    white: "#ffffff",
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray800: "#1f2937",
    gray900: "#111827"
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[400px]">
      <div className="scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-center transition-transform duration-500">
        
        <div 
          ref={previewRef}
          id="certificate-content"
          className="w-[800px] h-[560px] relative overflow-hidden flex-shrink-0 shadow-2xl border"
          style={{ 
            backgroundColor: COLORS.white,
            borderColor: COLORS.gray200,
            transform: 'none'
          }}
        >
          {/* Left Side Ribbon & Seal Area */}
          <div 
            className="absolute top-0 left-0 bottom-0 w-[200px] flex flex-col items-center pt-12 border-r"
            style={{ backgroundColor: COLORS.gray50, borderColor: COLORS.gray100 }}
          >
            <div 
              className="w-[100px] h-[200px] relative flex flex-col items-center justify-center shadow-lg"
              style={{ backgroundColor: COLORS.emerald600 }}
            >
              <div 
                className="absolute -bottom-6 left-0 right-0 h-12"
                style={{ 
                    backgroundColor: COLORS.emerald600, 
                    clipPath: 'polygon(0%_0%, 100%_0%, 50%_100%)' 
                }} 
              />
              <div 
                className="w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-inner"
                style={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: COLORS.emerald500 }}
              >
                 <div 
                    className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                    style={{ 
                        borderColor: 'rgba(255,255,255,0.5)',
                        background: `linear-gradient(to bottom right, ${COLORS.emerald400}, ${COLORS.emerald600})`
                    }}
                 >
                    <MdVerified style={{ color: COLORS.white }} size={32} />
                 </div>
              </div>
            </div>
            
            <div className="mt-auto mb-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white border p-1 rounded shadow-sm">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VerifyCert_${certificate?.certificate_number || "TEST"}`} 
                    className="w-full h-full opacity-80" 
                    alt="QR" 
                    crossOrigin="anonymous"
                  />
              </div>
              <div className="space-y-1">
                <p className="text-[12px] font-black italic uppercase" style={{ color: COLORS.gray800 }}>
                  {certificate?.issue_date ? new Date(certificate.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <div className="w-24 h-[1px] mx-auto" style={{ backgroundColor: COLORS.gray300 }} />
                <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: COLORS.gray400 }}>Date of Award</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="ml-[200px] p-12 h-full flex flex-col items-center text-center relative">
            {/* Subtle Watermark Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
               <MdSchool size={500} className="rotate-12" style={{ color: COLORS.gray900 }} />
            </div>

            {/* Logo Area */}
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded flex items-center justify-center text-white" style={{ backgroundColor: COLORS.primary }}>
                  <MdWorkspacePremium size={20} />
                </div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none" style={{ color: COLORS.primary }}>Computer Site</h1>
              </div>
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] italic" style={{ color: COLORS.emerald600 }}>Empower Your Learning</p>
            </div>

            <div className="relative z-10 w-full">
              <h2 className="text-xl font-bold uppercase tracking-[0.2em] mb-8" style={{ color: COLORS.gray400 }}>Certificate</h2>
              
              <p className="text-sm italic mb-2" style={{ color: COLORS.gray500 }}>This is to certify that</p>
              <h3 
                className="text-3xl font-black uppercase italic tracking-tighter mb-8 border-b-2 inline-block px-8 py-2"
                style={{ color: COLORS.gray900, borderColor: COLORS.gray100 }}
              >
                {certificate?.custom_name || user?.user_name || "Valued Learner"}
              </h3>

              <p className="text-sm italic mb-4" style={{ color: COLORS.gray500 }}>has successfully completed the professional course:</p>
              <h4 className="text-xl font-black uppercase italic tracking-tight max-w-lg mx-auto leading-tight" style={{ color: COLORS.primary }}>
                {course?.title || "Professional Development Program"}
              </h4>
            </div>

            {/* Footer Area */}
            <div className="mt-auto w-full flex justify-between items-end relative z-10 pt-8">
              <div className="text-left">
                  <p className="text-[8px] font-bold uppercase" style={{ color: COLORS.gray400 }}>Verification ID</p>
                  <p className="text-[10px] font-black" style={{ color: COLORS.gray800 }}>{certificate?.certificate_number || "CS-CERT-2024-001"}</p>
                  <p className="text-[8px] font-bold mt-0.5" style={{ color: COLORS.emerald600 }}>computersite.com/verify</p>
              </div>

              <div className="text-right">
                 <div className="w-32 h-[1px] ml-auto" style={{ backgroundColor: COLORS.gray300 }} />
                 <p className="text-[10px] font-black uppercase italic mt-1" style={{ color: COLORS.gray800 }}>Academic Director</p>
                 <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: COLORS.gray400 }}>Computer Site Studio</p>
              </div>
            </div>
          </div>

          {/* Outer Frame Border */}
          <div 
            className="absolute inset-0 border-[8px] pointer-events-none" 
            style={{ borderColor: 'rgba(5, 150, 105, 0.1)' }} // Emerald 600 with 0.1 opacity
          />
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
