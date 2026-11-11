import React from 'react';
import { Layers, QrCode, Headphones } from 'lucide-react';

export function Header({ 
  presentation, 
  currentSlideIndex, 
  totalSlides, 
  onOpenDrawer, 
  onOpenQR 
}) {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-xl px-4 pt-3 pb-2.5 select-none border-b border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between max-w-md mx-auto gap-2">
        
        {/* Left: Slides list button */}
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-200 hover:text-white active:scale-95 transition-all shadow-sm cursor-pointer"
          aria-label="Abrir lista de pistas"
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-medium tracking-wide">Pistas</span>
        </button>

        {/* Center: Presentation title & slide progress badge */}
        <div className="flex flex-col items-center min-w-0">
          <div className="flex items-center gap-1.5 max-w-[180px] sm:max-w-[220px]">
            <Headphones className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white truncate">
              {presentation.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentSlideIndex
                    ? 'w-5 bg-gradient-to-r from-sky-400 to-indigo-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                    : idx < currentSlideIndex
                    ? 'w-2 bg-sky-400/40'
                    : 'w-2 bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Step counter & QR Code */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-lg">
            {currentSlideIndex + 1}/{totalSlides}
          </span>
          <button
            onClick={onOpenQR}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white active:scale-95 transition-all shadow-sm cursor-pointer"
            aria-label="Ver código QR de este slide"
            title="Código QR"
          >
            <QrCode className="w-4 h-4 text-sky-400" />
          </button>
        </div>

      </div>
    </header>
  );
}
