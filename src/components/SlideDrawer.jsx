import React from 'react';
import { X, Volume2 } from 'lucide-react';

export function SlideDrawer({
  isOpen,
  onClose,
  presentation,
  currentSlide,
  onSelectSlide,
  isPlaying
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md mx-auto bg-slate-900 border-t border-white/10 rounded-t-2xl p-5 pb-8 shadow-2xl flex flex-col max-h-[75vh] z-10 animate-in slide-in-from-bottom duration-200">
        
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">
            Slides • {presentation.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slides List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-1.5 pr-1">
          {presentation.slides.map((slide, index) => {
            const isActive = slide.id === currentSlide.id;

            return (
              <button
                key={slide.id}
                onClick={() => {
                  onSelectSlide(slide);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition text-left ${
                  isActive 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-mono ${isActive ? 'text-white font-bold' : 'text-slate-500'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm truncate">
                    {slide.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isActive && isPlaying && (
                    <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
                  )}
                  <span className="text-xs font-mono text-slate-500">
                    {slide.durationFormatted}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
