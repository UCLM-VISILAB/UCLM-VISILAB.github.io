import React, { useState, useEffect } from 'react';
import { X, Volume2 } from 'lucide-react';

function AudioDuration({ src }) {
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio();
    audio.preload = 'metadata';
    const handleLoaded = () => setDuration(audio.duration);
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.src = src;
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.src = '';
    };
  }, [src]);

  if (!Number.isFinite(duration)) return null;

  const minutes = Math.floor(duration / 60);
  const seconds = String(Math.floor(duration % 60)).padStart(2, '0');
  return <span className="text-xs font-mono text-slate-400">{minutes}:{seconds}</span>;
}

export function SlideDrawer({
  isOpen,
  onClose,
  presentations = [],
  presentation,
  currentSlide,
  onSelectPresentation,
  onSelectSlide,
  isPlaying
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md mx-auto bg-white border-t border-slate-200 rounded-t-2xl p-5 pb-8 shadow-xl flex flex-col max-h-[75vh] z-10">
        
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">
            Pistas • {presentation.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 rounded-lg transition cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presentation Selector (when multiple presentations exist) */}
        {presentations.length > 1 && onSelectPresentation && (
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {presentations.map((p) => {
              const isCurrentPres = p.id === presentation.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPresentation(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isCurrentPres
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Slides List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-1 pr-1">
          {presentation.slides.map((slide, index) => {
            const isActive = slide.id === currentSlide.id;

            return (
              <button
                key={slide.id}
                onClick={() => {
                  onSelectSlide(slide);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition text-left cursor-pointer ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className={`text-xs font-mono ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm truncate">
                    {slide.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isActive && isPlaying && (
                    <Volume2 className="w-3.5 h-3.5 text-slate-900 animate-pulse" />
                  )}
                  <AudioDuration src={slide.audio} />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
