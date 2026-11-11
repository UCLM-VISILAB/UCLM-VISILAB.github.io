import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function SlideViewer({ slide }) {
  const imageList = Array.isArray(slide.images) && slide.images.length > 0
    ? slide.images
    : (slide.image ? [slide.image] : []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsFocused(false);
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

  const handleImagePointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    pointerStartRef.current = { x: clientX, y: clientY };
  };

  const handleImageClick = (e) => {
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    // Open focused view only on tap/click, not after a swipe/scroll gesture
    if (dx < 12 && dy < 12 && currentImageSrc) {
      setIsFocused(true);
    }
  };

  const currentImageSrc = imageList[currentImageIndex] || '';

  return (
    <div className="h-full w-full overflow-y-auto overscroll-y-contain touch-pan-y px-5 pt-4 pb-32 select-none">
      {/* Image Container */}
      <div className="relative w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
        {currentImageSrc ? (
          <img
            src={currentImageSrc}
            alt={slide.title}
            onMouseDown={handleImagePointerDown}
            onTouchStart={handleImagePointerDown}
            onClick={handleImageClick}
            className="w-full max-h-[50vh] object-contain mx-auto block cursor-zoom-in"
          />
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center text-slate-400 text-xs">
            Sin imagen
          </div>
        )}

        {/* Carousel buttons for multiple images */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-800 shadow-sm transition active:scale-90 cursor-pointer"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-800 shadow-sm transition active:scale-90 cursor-pointer"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center items-center gap-1.5 pointer-events-none">
              {imageList.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex 
                      ? 'w-4 bg-slate-900' 
                      : 'w-1.5 bg-slate-400/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Slide Typography */}
      <div className="mt-5 space-y-2">
        {slide.subtitle && (
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {slide.subtitle}
          </p>
        )}

        <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
          {slide.title}
        </h2>

        {slide.text && (
          <p className="text-sm text-slate-600 leading-relaxed pt-1">
            {slide.text}
          </p>
        )}
      </div>

      {/* Subtle Institutional Footer */}
      <div className="mt-10 pt-5 border-t border-slate-100 flex items-center justify-between gap-4 opacity-80">
        <img
          src="image009.png"
          alt="Gobierno de España y UCLM"
          className="h-7 w-auto object-contain max-w-[58%]"
        />
        <img
          src="image005.png"
          alt="E.T.S. de Ingeniería Industrial de Ciudad Real"
          className="h-7 w-auto object-contain max-w-[38%]"
        />
      </div>

      {/* Focused Image Modal (rendered via Portal to escape transform stacking context) */}
      {isFocused && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsFocused(false)}
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-3"
        >
          <button
            onClick={() => setIsFocused(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 text-white hover:bg-white/25 transition cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <img
            src={currentImageSrc}
            alt={slide.title}
            className="max-w-full max-h-[88vh] object-contain rounded-lg"
          />

          {hasMultipleImages && (
            <p className="text-white/80 text-xs mt-2.5 font-mono">
              {currentImageIndex + 1} / {imageList.length}
            </p>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
