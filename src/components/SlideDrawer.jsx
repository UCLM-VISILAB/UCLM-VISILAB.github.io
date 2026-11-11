import React, { useState, useEffect } from 'react';
import { X, Volume2, Clock } from 'lucide-react';

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
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 rounded-md">
      <Clock className="w-2.5 h-2.5 text-slate-500" />
      {minutes}:{seconds}
    </span>
  );
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
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-5 pb-8 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] flex flex-col max-h-[78vh] z-10 animate-in slide-in-from-bottom duration-200">
        
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-700/80 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Pistas de la Audioguía
            </h3>
            {presentation.subtitle && (
              <p className="text-[11px] text-slate-400 truncate max-w-[260px] mt-0.5">
                {presentation.subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-xl transition cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presentation Selector (when multiple presentations exist) */}
        {presentations.length > 1 && onSelectPresentation && (
          <div className="mt-3 p-1 rounded-xl bg-slate-950/80 border border-white/[0.06] flex gap-1 overflow-x-auto scrollbar-none">
            {presentations.map((p) => {
              const isCurrentPres = p.id === presentation.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPresentation(p)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isCurrentPres
                      ? 'bg-gradient-to-r from-sky-400 to-indigo-400 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {p.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Slides List */}
        <div className="flex-1 overflow-y-auto mt-3.5 space-y-2 pr-1">
          {presentation.slides.map((slide, index) => {
            const isActive = slide.id === currentSlide.id;
            const thumbSrc = slide.images?.[0] || slide.image;

            return (
              <button
                key={slide.id}
                onClick={() => {
                  onSelectSlide(slide);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all text-left border cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-sky-500/15 to-indigo-500/10 border-sky-400/30 text-white shadow-md' 
                    : 'bg-white/[0.02] border-white/[0.05] text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {/* Thumbnail or Track Badge */}
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0 flex items-center justify-center">
                    {thumbSrc ? (
                      <img
                        src={thumbSrc}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-slate-950/45 flex items-center justify-center">
                      <span className={`text-xs font-mono font-bold ${isActive ? 'text-sky-300' : 'text-white/90'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    {slide.subtitle && (
                      <p className={`text-[10px] font-semibold uppercase tracking-wider truncate ${
                        isActive ? 'text-sky-300' : 'text-slate-400'
                      }`}>
                        {slide.subtitle}
                      </p>
                    )}
                    <p className={`text-xs sm:text-sm truncate ${isActive ? 'font-semibold text-white' : 'font-medium text-slate-200'}`}>
                      {slide.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isActive && isPlaying && (
                    <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
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
