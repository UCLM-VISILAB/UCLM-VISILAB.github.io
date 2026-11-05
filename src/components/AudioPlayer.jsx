import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight
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
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-white/5 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,8px)+12px)] select-none">
      <div className="max-w-md mx-auto">
        
        {/* Scrubber / Timeline Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
            style={{
              background: `linear-gradient(to right, #ffffff ${progressPercent}%, #1e293b ${progressPercent}%)`
            }}
            aria-label="Línea de tiempo"
          />

          <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Minimal Controls */}
        <div className="mt-1 flex items-center justify-between">
          
          {/* Speed button */}
          <button
            onClick={onCyclePlaybackRate}
            className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded transition"
            title="Velocidad"
          >
            {playbackRate}x
          </button>

          {/* Main Controls */}
          <div className="flex items-center gap-3">
            
            {/* Prev Slide */}
            <button
              onClick={onPrevSlide}
              disabled={!hasPrevSlide}
              className={`p-2 transition ${
                hasPrevSlide 
                  ? 'text-slate-300 hover:text-white active:scale-95' 
                  : 'text-slate-700 cursor-not-allowed'
              }`}
              aria-label="Slide anterior"
              title="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Skip back 10s */}
            <button
              onClick={() => onSkip(-10)}
              className="p-2 text-slate-400 hover:text-white transition active:scale-95"
              aria-label="-10s"
              title="-10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition"
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
              className="p-2 text-slate-400 hover:text-white transition active:scale-95"
              aria-label="+10s"
              title="+10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Next Slide */}
            <button
              onClick={onNextSlide}
              disabled={!hasNextSlide}
              className={`p-2 transition ${
                hasNextSlide 
                  ? 'text-slate-300 hover:text-white active:scale-95' 
                  : 'text-slate-700 cursor-not-allowed'
              }`}
              aria-label="Slide siguiente"
              title="Slide siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* Placeholder spacer to balance layout */}
          <div className="w-8" />

        </div>

      </div>
    </div>
  );
}
