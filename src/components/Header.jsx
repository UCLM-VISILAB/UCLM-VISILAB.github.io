import React from 'react';
import { Menu, QrCode } from 'lucide-react';

export function Header({ 
  presentation, 
  currentSlideIndex, 
  totalSlides, 
  onOpenDrawer, 
  onOpenQR 
}) {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/90 backdrop-blur-md px-5 py-3.5 select-none border-b border-white/5">
      <div className="flex items-center justify-between max-w-md mx-auto">
        
        {/* Left: Slides list */}
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-1.5 py-1 px-2.5 -ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition"
          aria-label="Abrir lista de slides"
        >
          <Menu className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium tracking-wide">Slides</span>
        </button>

        {/* Center: Presentation title & slide progress */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-white">
            {presentation.title}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {currentSlideIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Right: QR Code */}
        <button
          onClick={onOpenQR}
          className="p-1.5 -mr-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition"
          aria-label="Ver código QR de este slide"
          title="Código QR"
        >
          <QrCode className="w-4 h-4" />
        </button>

      </div>
    </header>
  );
}
