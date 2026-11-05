import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download } from 'lucide-react';

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
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Código QR</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Selector Pills */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {presentation.slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setSelectedSlideId(s.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                s.id === selectedSlideId
                  ? 'bg-white text-slate-950 font-semibold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Slide {idx + 1}
            </button>
          ))}
        </div>

        {/* QR Code */}
        <div className="mt-4 flex flex-col items-center">
          <div className="p-3 bg-white rounded-xl shadow-md">
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
          <p className="text-xs text-white font-medium mt-2">{activeSlide.title}</p>
        </div>

        {/* URL Box */}
        <div className="mt-3 p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-slate-400 truncate select-all">
            {slideUrl}
          </span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1 rounded text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px]"
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
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          Descargar QR (PNG)
        </button>

      </div>
    </div>
  );
}
