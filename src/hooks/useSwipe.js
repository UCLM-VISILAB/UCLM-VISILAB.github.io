import { useRef } from 'react';

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 60 }) {
  const touchStartCoords = useRef({ x: 0, y: 0 });
  const touchEndCoords = useRef({ x: 0, y: 0 });

  const onTouchStart = (e) => {
    touchStartCoords.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const onTouchMove = (e) => {
    touchEndCoords.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const onTouchEnd = () => {
    const diffX = touchStartCoords.current.x - touchEndCoords.current.x;
    const diffY = touchStartCoords.current.y - touchEndCoords.current.y;

    // Check if horizontal movement is greater than vertical movement to avoid triggering during page scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swiped left -> Next slide
        if (onSwipeLeft) onSwipeLeft();
      } else {
        // Swiped right -> Previous slide
        if (onSwipeRight) onSwipeRight();
      }
    }

    // Reset
    touchStartCoords.current = { x: 0, y: 0 };
    touchEndCoords.current = { x: 0, y: 0 };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}

