import React from 'react';

interface AdPlacementProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'sidebar';
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({
  format = 'horizontal',
  className = '',
}) => {
  // Height and aspect ratio styling based on format
  const formatClasses = {
    horizontal: 'h-24 sm:h-28 w-full max-w-4xl mx-auto',
    rectangle: 'h-64 w-full max-w-sm mx-auto',
    sidebar: 'h-96 w-full max-w-xs',
  }[format];

  return (
    <div className={`my-8 px-4 flex flex-col items-center ${className}`}>
      {/* Compliance Label: Google Policy requirement to clearly identify ads */}
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 select-none">
        Advertisement
      </span>

      <div
        className={`${formatClasses} rounded-xl border border-dashed border-slate-300 bg-slate-100/70 flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden`}
      >
        <span className="text-xs font-semibold text-slate-500">
          Google AdSense Placement
        </span>
        <span className="text-[11px] text-slate-400 mt-0.5">
          Non-intrusive, compliant sponsor display area
        </span>
      </div>
    </div>
  );
};
