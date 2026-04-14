import React from "react";

export default function FullScreenLoader({ show = false, message = "Loading..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center p-8 bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
        <div className="relative h-16 w-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-white/10 border-b-white/60 animate-spin-slow"></div>
        </div>
        <p className="text-white font-semibold text-lg tracking-wider animate-pulse">
          {message}
        </p>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}} />
    </div>
  );
}
