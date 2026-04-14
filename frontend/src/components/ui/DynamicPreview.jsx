import React from "react";
import { MdPlayCircle } from "react-icons/md";
import clsx from "clsx";

const DynamicPreview = ({
  src,
  type = "image",
  isProfile = false,
  showPlayer = false,
  className = "",
  size = "md", // sm, md, lg
}) => {
  const placeholder = "/assets/images/no-image.png";

  const sizeClasses = {
    sm: isProfile ? "w-8 h-8" : "w-12 h-8",
    md: isProfile ? "w-10 h-10" : "w-16 h-10",
    lg: isProfile ? "w-14 h-14" : "w-24 h-16",
  };

  const getMediaUrl = (url) => {
    if (!url) return placeholder;
    if (url.startsWith("blob:") || url.startsWith("http")) return url;
    
    const apiOrigin = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";
    const normalizedPath = url.startsWith("/") 
      ? url 
      : (url.includes("media/") ? `/${url}` : `/media/gallery/${url}`);
    
    const cleanOrigin = apiOrigin.endsWith("/") ? apiOrigin.slice(0, -1) : apiOrigin;
    return `${cleanOrigin}${normalizedPath}`;
  };

  const finalUrl = getMediaUrl(src);

  // YouTube Embed Helper
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1]?.split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
  };

  return (
    <div 
      className={clsx(
        "overflow-hidden bg-gray-100 border border-gray-100 shadow-sm flex items-center justify-center group relative transition-all",
        isProfile ? "rounded-full" : "rounded-xl",
        !showPlayer && sizeClasses[size],
        className
      )}
    >
      {!src ? (
        <img 
          src={placeholder} 
          alt="Placeholder" 
          className={clsx("object-cover opacity-60", isProfile ? "w-full h-full" : "w-[90%] h-[90%]")} 
        />
      ) : type === "image" ? (
        <img 
          src={finalUrl} 
          alt="Preview" 
          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
        />
      ) : showPlayer ? (
        <div className="w-full h-full bg-black">
           {type === 'youtube' ? (
             <iframe 
               src={getYouTubeEmbedUrl(src)}
               className="w-full h-full border-none"
               allow="autoplay; encrypted-media; picture-in-picture"
               allowFullScreen
               title="YouTube Player"
             />
           ) : (
             <video 
               src={finalUrl}
               controls
               autoPlay
               className="w-full h-full object-contain"
             />
           )}
        </div>
      ) : (
        <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
          <MdPlayCircle size={size === "sm" ? 16 : 20} className="text-white drop-shadow-lg" />
          {!isProfile && (
            <span className="absolute bottom-0 inset-x-0 bg-black/40 text-[8px] text-white font-black uppercase text-center py-0.5">
               {type === 'youtube' ? 'Digital' : 'Motion'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicPreview;
