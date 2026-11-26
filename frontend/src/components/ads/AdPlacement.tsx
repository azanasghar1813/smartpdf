import React from 'react';

interface AdPlacementProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'sidebar';
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({
  slotId,
  format = 'horizontal',
  className = '',
}) => {
  const adsenseClient = (import.meta as any).env?.VITE_GOOGLE_ADSENSE_CLIENT_ID;
  const isConfigured =
    Boolean(adsenseClient) &&
    !String(adsenseClient).startsWith('%') &&
    adsenseClient !== 'ca-pub-xxxxxxxxxxxxxxxx' &&
    Boolean(slotId);

  // Do not render fake placeholder boxes when AdSense is not configured
  if (!isConfigured) {
    return null;
  }

  const formatClasses = {
    horizontal: 'h-24 sm:h-28 w-full max-w-4xl mx-auto',
    rectangle: 'h-64 w-full max-w-sm mx-auto',
    sidebar: 'h-96 w-full max-w-xs',
  }[format];

  return (
    <div className={`my-8 px-4 flex flex-col items-center ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 select-none">
        Advertisement
      </span>
      <ins
        className={`adsbygoogle block ${formatClasses}`}
        data-ad-client={adsenseClient}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
