import React from "react";

/**
 * PageTitle Component
 * 
 * A minimalistic typography component for the professional Studio title and subtitle.
 * 
 * @param {string} title - Main header text (italicized)
 * @param {string} subtitle - Secondary tagline below the title with pulse indicator
 */
const PageTitle = ({ title, subtitle }) => {
  return (
    <div className="flex-shrink-0">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-4 mb-1">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
