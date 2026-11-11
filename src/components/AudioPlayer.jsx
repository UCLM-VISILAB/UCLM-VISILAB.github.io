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
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom,8px)+10px)] select-none">
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
            className="audio-scrubber w-full cursor-pointer focus:outline-none"
            style={{
              background: `linear-gradient(to right, #0f172a ${progressPercent}%, #e2e8f0 ${progressPercent}%)`
            }}
            aria-label="Línea de tiempo"
          />

          <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Minimal Controls */}
        <div className="mt-0.5 flex items-center justify-between">
          
          {/* Speed button */}
          <button
            onClick={onCyclePlaybackRate}
            className="text-xs font-mono font-medium text-slate-600 hover:text-slate-950 px-2 py-1 rounded-md hover:bg-slate-100 transition cursor-pointer"
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
                  ? 'text-slate-700 hover:text-slate-950 active:scale-95 cursor-pointer' 
                  : 'text-slate-300 cursor-not-allowed'
              }`}
              aria-label="Slide anterior"
              title="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Skip back 10s */}
            <button
              onClick={() => onSkip(-10)}
              className="p-2 text-slate-600 hover:text-slate-950 transition active:scale-95 cursor-pointer"
              aria-label="-10s"
              title="-10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition cursor-pointer"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white translate-x-0.5" />
              )}
            </button>

            {/* Skip forward 10s */}
            <button
              onClick={() => onSkip(10)}
              className="p-2 text-slate-600 hover:text-slate-950 transition active:scale-95 cursor-pointer"
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
                  ? 'text-slate-700 hover:text-slate-950 active:scale-95 cursor-pointer' 
                  : 'text-slate-300 cursor-not-allowed'
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
