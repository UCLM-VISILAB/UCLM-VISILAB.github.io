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
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm px-5 py-3 select-none border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center justify-between max-w-md mx-auto">
        
        {/* Left: Slides list */}
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-1.5 py-1.5 px-2.5 -ml-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
          aria-label="Abrir lista de pistas"
        >
          <Menu className="w-4 h-4 text-slate-600" />
          <span className="text-xs font-medium">Pistas</span>
        </button>

        {/* Center: Presentation title & slide progress */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {presentation.title}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {currentSlideIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Right: QR Code */}
        <button
          onClick={onOpenQR}
          className="p-1.5 -mr-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
          aria-label="Ver código QR de este slide"
          title="Código QR"
        >
          <QrCode className="w-4 h-4" />
        </button>

      </div>
    </header>
  );
}
