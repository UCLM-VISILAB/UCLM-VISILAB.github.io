import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles } from 'lucide-react';

export function SlideViewer({ slide }) {
  const imageList = Array.isArray(slide.images) && slide.images.length > 0
    ? slide.images
    : (slide.image ? [slide.image] : []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [slide.id]);

  const hasMultipleImages = imageList.length > 1;

  const handleNextImage = (e) => {
    e?.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
    }
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    }
  };

  const currentImageSrc = imageList[currentImageIndex] || '';

  return (
    <div className="flex-1 flex flex-col px-4 pt-3.5 pb-32 overflow-y-auto w-full select-none">
      {/* Image Showcase Card with Ambient Glow */}
      <div className="relative w-full flex-shrink-0 group">
        {/* Subtle ambient glow behind the image card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-purple-500/15 blur-xl opacity-80 pointer-events-none" />

        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900/90 border border-white/[0.1] shadow-[0_12px_36px_rgba(0,0,0,0.55)]">
          {currentImageSrc ? (
            <img
              src={currentImageSrc}
              alt={slide.title}
              onClick={() => setIsFullscreen(true)}
              className="w-full max-h-[52vh] object-contain mx-auto block cursor-zoom-in transition-transform duration-300"
            />
          ) : (
            <div className="w-full aspect-[4/3] flex items-center justify-center text-slate-500 text-xs">
              Sin imagen
            </div>
          )}

          {/* Carousel controls for multiple images */}
          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950/90 border border-white/15 text-white backdrop-blur-md transition active:scale-90 cursor-pointer shadow-lg"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950/90 border border-white/15 text-white backdrop-blur-md transition active:scale-90 cursor-pointer shadow-lg"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots Pill */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center items-center pointer-events-none">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10">
                  {imageList.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex 
                          ? 'w-4 bg-sky-400' 
                          : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Expand button */}
          {currentImageSrc && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 hover:bg-slate-950/90 border border-white/15 text-slate-200 hover:text-white backdrop-blur-md transition active:scale-95 shadow-lg cursor-pointer"
              aria-label="Ampliar imagen"
            >
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px] font-medium">Ampliar</span>
            </button>
          )}
        </div>
      </div>

      {/* Slide Typography & Content Card */}
      <div className="mt-4 space-y-2.5">
        {slide.subtitle && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-[11px] font-semibold tracking-wide">
              <Sparkles className="w-3 h-3 text-sky-400" />
              {slide.subtitle}
            </span>
          </div>
        )}

        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
          {slide.title}
        </h2>

        {slide.text && (
          <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.07] p-3.5 sm:p-4 shadow-inner">
            <div className="flex gap-3">
              <div className="w-1 rounded-full bg-gradient-to-b from-sky-400 via-indigo-400 to-purple-500 flex-shrink-0 opacity-80" />
              <p className="text-sm text-slate-300 leading-relaxed">
                {slide.text}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      {isFullscreen && (
        <div 
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-200"
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <img
            src={currentImageSrc}
            alt={slide.title}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl border border-white/10"
          />

          <div className="mt-3 text-center max-w-sm px-4">
            <p className="text-white text-xs sm:text-sm font-medium truncate">
              {slide.title}
            </p>
            {hasMultipleImages && (
              <p className="text-sky-400 text-xs mt-0.5 font-mono">
                Imagen {currentImageIndex + 1} de {imageList.length}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
