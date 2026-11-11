import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

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
    <div className="flex-1 flex flex-col px-5 pt-3 pb-24 overflow-y-auto w-full select-none">
      {/* Image Container / Minimal Carousel */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-md flex-shrink-0 group">
        {currentImageSrc ? (
          <img
            src={currentImageSrc}
            alt={slide.title}
            className="w-full max-h-[55vh] object-contain mx-auto pointer-events-none block"
          />
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center text-zinc-500 text-xs">
            Sin imagen
          </div>
        )}

        {/* Carousel buttons for multiple images */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition active:scale-90"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition active:scale-90"
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
                      ? 'w-4 bg-white' 
                      : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Expand button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white transition"
          aria-label="Ampliar imagen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Slide Typography */}
      <div className="mt-5 space-y-1.5">
        {slide.subtitle && (
          <p className="text-xs font-medium text-zinc-400">
            {slide.subtitle}
          </p>
        )}

        <h2 className="text-xl font-semibold text-white tracking-tight leading-snug">
          {slide.title}
        </h2>

        {slide.text && (
          <p className="text-sm text-zinc-300 leading-relaxed pt-1">
            {slide.text}
          </p>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      {isFullscreen && (
        <div 
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <img
            src={currentImageSrc}
            alt={slide.title}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />

          {hasMultipleImages && (
            <p className="text-zinc-400 text-xs mt-3">
              {currentImageIndex + 1} de {imageList.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
