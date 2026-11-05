import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  presentations, 
  getPresentation, 
  getSlide, 
  getSlideIndex 
} from './data/presentations';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { Header } from './components/Header';
import { SlideViewer } from './components/SlideViewer';
import { AudioPlayer } from './components/AudioPlayer';
import { SlideDrawer } from './components/SlideDrawer';
import { QRCodeModal } from './components/QRCodeModal';

export default function App() {
  // Parse presentation and slide from URL Hash (e.g. #/acua/1)
  const parseHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const parts = hash.split('/').filter(Boolean);
    const presSlug = parts[0] || 'acua';
    const slideSlug = parts[1] || '1';

    const pres = getPresentation(presSlug);
    const slide = getSlide(pres, slideSlug);
    return { presentation: pres, slide: slide };
  }, []);

  const [currentPresentation, setCurrentPresentation] = useState(() => parseHash().presentation);
  const [currentSlide, setCurrentSlide] = useState(() => parseHash().slide);

  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

  // Drag / Slide tracking state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef(null);
  const isPointerDown = useRef(false);

  // Indices
  const currentSlideIndex = useMemo(() => {
    return getSlideIndex(currentPresentation, currentSlide);
  }, [currentPresentation, currentSlide]);

  const hasPrevSlide = currentSlideIndex > 0;
  const hasNextSlide = currentSlideIndex < currentPresentation.slides.length - 1;

  // Navigate dynamically without page reloads
  const navigateTo = useCallback((presentation, slide, replace = false) => {
    const targetUrl = `#/${presentation.slug}/${slide.id}`;
    if (replace) {
      window.history.replaceState(null, '', targetUrl);
    } else {
      window.history.pushState(null, '', targetUrl);
    }
    setCurrentPresentation(presentation);
    setCurrentSlide(slide);
  }, []);

  // Listen to hash changes (back/forward button or external QR scan)
  useEffect(() => {
    const handleHashChange = () => {
      const { presentation, slide } = parseHash();
      setCurrentPresentation(presentation);
      setCurrentSlide(slide);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    const currentHash = window.location.hash;
    if (!currentHash || currentHash === '#' || currentHash === '#/') {
      navigateTo(currentPresentation, currentSlide, true);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [parseHash, navigateTo, currentPresentation, currentSlide]);

  // Audio player hook
  const {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    togglePlay,
    seek,
    skip,
    cyclePlaybackRate
  } = useAudioPlayer({
    audioSrc: currentSlide?.audio,
    transcript: currentSlide?.text,
    durationSec: currentSlide?.durationSec || 60,
    onEnded: () => {
      if (hasNextSlide) {
        navigateTo(currentPresentation, currentPresentation.slides[currentSlideIndex + 1]);
      }
    }
  });

  // Next / Prev slide navigation
  const handleNextSlide = useCallback(() => {
    if (hasNextSlide) {
      navigateTo(currentPresentation, currentPresentation.slides[currentSlideIndex + 1]);
    }
  }, [hasNextSlide, currentPresentation, currentSlideIndex, navigateTo]);

  const handlePrevSlide = useCallback(() => {
    if (hasPrevSlide) {
      navigateTo(currentPresentation, currentPresentation.slides[currentSlideIndex - 1]);
    }
  }, [hasPrevSlide, currentPresentation, currentSlideIndex, navigateTo]);

  // Touch handlers for horizontal full-page sliding
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Detect if movement is predominantly horizontal
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipe.current === true) {
      setIsDragging(true);
      const isAtStart = currentSlideIndex === 0 && diffX > 0;
      const isAtEnd = currentSlideIndex === currentPresentation.slides.length - 1 && diffX < 0;

      // Apply resistance at start/end
      if (isAtStart || isAtEnd) {
        setDragOffset(diffX * 0.25);
      } else {
        setDragOffset(diffX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current === true && isDragging) {
      const threshold = 55; // Pixels to trigger slide change
      if (dragOffset < -threshold && hasNextSlide) {
        handleNextSlide();
      } else if (dragOffset > threshold && hasPrevSlide) {
        handlePrevSlide();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    isHorizontalSwipe.current = null;
  };

  // Mouse handlers for desktop testing
  const handleMouseDown = (e) => {
    // Only left click and avoid inputs/buttons
    if (e.button !== 0 || e.target.closest('button, input')) return;
    isPointerDown.current = true;
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
    isHorizontalSwipe.current = true;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isPointerDown.current) return;
    const diffX = e.clientX - touchStartX.current;
    const isAtStart = currentSlideIndex === 0 && diffX > 0;
    const isAtEnd = currentSlideIndex === currentPresentation.slides.length - 1 && diffX < 0;

    if (isAtStart || isAtEnd) {
      setDragOffset(diffX * 0.25);
    } else {
      setDragOffset(diffX);
    }
  };

  const handleMouseUp = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    const threshold = 55;
    if (dragOffset < -threshold && hasNextSlide) {
      handleNextSlide();
    } else if (dragOffset > threshold && hasPrevSlide) {
      handlePrevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
    isHorizontalSwipe.current = null;
  };

  return (
    <div 
      className="h-full w-full flex justify-center bg-zinc-950 text-zinc-100 font-sans"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <main className="relative flex flex-col h-full w-full max-w-md overflow-hidden bg-zinc-950 border-x border-zinc-800/80">
        
        {/* Top Minimal Header */}
        <Header
          presentation={currentPresentation}
          currentSlideIndex={currentSlideIndex}
          totalSlides={currentPresentation.slides.length}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenQR={() => setIsQROpen(true)}
        />

        {/* Whole Page Horizontal Slide Track */}
        <div 
          className="flex-1 w-full overflow-hidden flex relative touch-pan-y cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div 
            className="flex w-full h-full will-change-transform"
            style={{
              transform: `translateX(calc(-${currentSlideIndex * 100}% + ${dragOffset}px))`,
              transition: isDragging ? 'none' : 'transform 280ms cubic-bezier(0.2, 0.9, 0.4, 1)'
            }}
          >
            {currentPresentation.slides.map((slide) => (
              <div 
                key={slide.id} 
                className="w-full h-full flex-shrink-0 flex flex-col overflow-hidden"
              >
                <SlideViewer slide={slide} />
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Audio Player */}
        <AudioPlayer
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onSkip={skip}
          onCyclePlaybackRate={cyclePlaybackRate}
          onPrevSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
          hasPrevSlide={hasPrevSlide}
          hasNextSlide={hasNextSlide}
        />

        {/* Minimal Slides Drawer */}
        <SlideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          presentation={currentPresentation}
          currentSlide={currentSlide}
          onSelectSlide={(s) => navigateTo(currentPresentation, s)}
          isPlaying={isPlaying}
        />

        {/* Minimal QR Code Modal */}
        <QRCodeModal
          isOpen={isQROpen}
          onClose={() => setIsQROpen(false)}
          presentation={currentPresentation}
          currentSlide={currentSlide}
        />

      </main>
    </div>
  );
}
