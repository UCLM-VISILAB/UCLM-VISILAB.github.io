import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  SkipBack, 
  SkipForward
} from 'lucide-react';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function AudioPlayer({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  onTogglePlay,
  onSeek,
  onSkip,
  onCyclePlaybackRate,
  onPrevSlide,
  onNextSlide,
  hasPrevSlide,
  hasNextSlide
}) {
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-12px_40px_rgba(0,0,0,0.7)] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,8px)+12px)] select-none">
      <div className="max-w-md mx-auto">
        
        {/* Scrubber / Timeline Slider */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="audio-scrubber w-full cursor-pointer focus:outline-none"
            style={{
              background: `linear-gradient(to right, #38bdf8 0%, #818cf8 ${progressPercent}%, rgba(255, 255, 255, 0.12) ${progressPercent}%)`
            }}
            aria-label="Línea de tiempo"
          />

          <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-slate-400">
            <span className="text-sky-300/90 font-medium">{formatTime(currentTime)}</span>
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5 px-2" aria-hidden="true">
                <span className="w-0.5 bg-sky-400 rounded-full animate-eq-1" />
                <span className="w-0.5 bg-indigo-400 rounded-full animate-eq-2" />
                <span className="w-0.5 bg-sky-400 rounded-full animate-eq-3" />
              </div>
            ) : (
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-sans">
                Audioguía
              </span>
            )}
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls Row */}
        <div className="mt-1.5 flex items-center justify-between">
          
          {/* Speed pill button */}
          <button
            onClick={onCyclePlaybackRate}
            className="min-w-[46px] text-xs font-mono font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] px-2.5 py-1.5 rounded-xl transition active:scale-95 cursor-pointer"
            title="Velocidad de reproducción"
          >
            {playbackRate}x
          </button>

          {/* Center Transport Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Prev Slide */}
            <button
              onClick={onPrevSlide}
              disabled={!hasPrevSlide}
              className={`p-2.5 rounded-xl transition ${
                hasPrevSlide 
                  ? 'text-slate-300 hover:text-white hover:bg-white/[0.06] active:scale-90 cursor-pointer' 
                  : 'text-slate-700 cursor-not-allowed'
              }`}
              aria-label="Slide anterior"
              title="Slide anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Skip back 10s */}
            <button
              onClick={() => onSkip(-10)}
              className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition active:scale-90 cursor-pointer"
              aria-label="Retroceder 10 segundos"
              title="-10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause Hero Button */}
            <button
              onClick={onTogglePlay}
              className={`relative w-13 h-13 rounded-full flex items-center justify-center transition-all duration-200 active:scale-92 cursor-pointer ${
                isPlaying
                  ? 'bg-gradient-to-tr from-sky-400 via-cyan-300 to-white text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.55)]'
                  : 'bg-white text-slate-950 hover:bg-sky-50 shadow-[0_4px_20px_rgba(255,255,255,0.25)]'
              }`}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
              )}
            </button>

            {/* Skip forward 10s */}
            <button
              onClick={() => onSkip(10)}
              className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition active:scale-90 cursor-pointer"
              aria-label="Adelantar 10 segundos"
              title="+10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Next Slide */}
            <button
              onClick={onNextSlide}
              disabled={!hasNextSlide}
              className={`p-2.5 rounded-xl transition ${
                hasNextSlide 
                  ? 'text-slate-300 hover:text-white hover:bg-white/[0.06] active:scale-90 cursor-pointer' 
                  : 'text-slate-700 cursor-not-allowed'
              }`}
              aria-label="Slide siguiente"
              title="Slide siguiente"
            >
              <SkipForward className="w-4 h-4" />
            </button>

          </div>

          {/* Right spacer to keep transport centered */}
          <div className="min-w-[46px] flex justify-end">
            <span className="text-[10px] font-mono text-slate-500 px-1.5 py-1">
              ±10s
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
