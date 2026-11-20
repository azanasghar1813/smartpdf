import React from 'react';
import { UploadCloud, Sliders, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Select or Drop Files',
      description: 'Upload your PDF documents directly from your device, phone, or drag-and-drop into our secure workspace.',
      icon: UploadCloud,
    },
    {
      step: '02',
      title: 'Customize & Process',
      description: 'Reorder pages, select compression levels, adjust watermark settings, or configure conversion options with real-time feedback.',
      icon: Sliders,
    },
    {
      step: '03',
      title: 'Download & Done',
      description: 'Download your finalized PDF instantaneously. Core tools process right in your browser without any waiting queues.',
      icon: DownloadCloud,
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How SimplePDF Works
          </h2>
          <p className="text-sm text-slate-500">
            No complex software installations or steep learning curves. Complete your document workflows in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, index) => {
            const IconComponent = s.icon;
            return (
              <div
                key={s.step}
                className="relative bg-slate-50/80 rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:border-brand-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-xs">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 select-none">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {index < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold shadow-xs">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
