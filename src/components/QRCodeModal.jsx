import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, QrCode } from 'lucide-react';

export function QRCodeModal({
  isOpen,
  onClose,
  presentation,
  currentSlide
}) {
  const [selectedSlideId, setSelectedSlideId] = useState(currentSlide ? currentSlide.id : '1');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentSlide) {
      setSelectedSlideId(currentSlide.id);
    }
  }, [currentSlide, isOpen]);

  const activeSlide = presentation.slides.find(s => s.id === selectedSlideId) || presentation.slides[0];
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const slideUrl = `${baseUrl}#/${presentation.slug}/${activeSlide.id}`;

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(slideUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error QR', err));
  }, [slideUrl, isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(slideUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `QR_${presentation.slug}_slide_${activeSlide.id}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-[0_24px_64px_rgba(0,0,0,0.85)] z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-400/20">
              <QrCode className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Código QR de Acceso</h3>
              <p className="text-[11px] text-slate-400">{presentation.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-xl transition cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Selector Pills */}
        <div className="mt-3 p-1 rounded-xl bg-slate-950/80 border border-white/[0.06] flex gap-1 overflow-x-auto scrollbar-none">
          {presentation.slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setSelectedSlideId(s.id)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                s.id === selectedSlideId
                  ? 'bg-gradient-to-r from-sky-400 to-indigo-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Pista {idx + 1}
            </button>
          ))}
        </div>

        {/* QR Code */}
        <div className="mt-4 flex flex-col items-center">
          <div className="p-3.5 bg-white rounded-2xl shadow-[0_8px_30px_rgba(56,189,248,0.15)] ring-4 ring-white/10">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Slide ${activeSlide.id}`}
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                Generando QR...
              </div>
            )}
          </div>
          {activeSlide.subtitle && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 mt-3">
              {activeSlide.subtitle}
            </span>
          )}
          <p className="text-xs sm:text-sm text-white font-semibold mt-0.5 text-center px-2">
            {activeSlide.title}
          </p>
        </div>

        {/* URL Box */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/80 border border-white/[0.07] flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-slate-400 truncate select-all">
            {slideUrl}
          </span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] cursor-pointer"
            title="Copiar enlace"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-400 hover:from-sky-300 hover:to-indigo-300 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 active:scale-98 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Descargar QR (PNG)
        </button>

      </div>
    </div>
  );
}
