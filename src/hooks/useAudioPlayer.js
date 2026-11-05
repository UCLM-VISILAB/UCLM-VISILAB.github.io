import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioPlayer({ audioSrc, transcript, durationSec = 60, onEnded }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSec);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [hasRealAudio, setHasRealAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fallback timer & speech reference
  const fallbackIntervalRef = useRef(null);
  const speechUtteranceRef = useRef(null);

  // App pasa una función nueva en cada render: se guarda en una ref para que
  // no reinicie los efectos que crean y reproducen el audio.
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // Stop everything
  const stopAll = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // When audio source changes (e.g. changing slide)
  useEffect(() => {
    stopAll();
    setCurrentTime(0);
    setIsFallbackMode(false);
    setHasRealAudio(false);
    setIsLoading(true);

    if (!audioSrc) {
      setIsFallbackMode(true);
      setDuration(durationSec || 60);
      setIsLoading(false);
      return;
    }

    const audio = new Audio();
    audioRef.current = audio;
    audio.preload = 'metadata';
    audio.src = audioSrc;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else {
        setDuration(durationSec || 60);
      }
      setHasRealAudio(true);
      setIsFallbackMode(false);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEndedRef.current?.();
    };

    const handleError = () => {
      // Audio file not found or cannot be played -> switch gracefully to fallback simulation
      setIsFallbackMode(true);
      setHasRealAudio(false);
      setDuration(durationSec || 60);
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc, durationSec, stopAll]);

  // Update playback rate when changed
  useEffect(() => {
    if (audioRef.current && hasRealAudio) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, hasRealAudio]);

  // Handle fallback playback simulation (Speech or Timer)
  useEffect(() => {
    if (!isFallbackMode) return;

    if (isPlaying) {
      // Try speech synthesis if available and transcript exists
      if ('speechSynthesis' in window && transcript && !speechUtteranceRef.current) {
        try {
          const utter = new SpeechSynthesisUtterance(transcript);
          utter.lang = 'es-ES';
          utter.rate = playbackRate;
          utter.onend = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            speechUtteranceRef.current = null;
            onEndedRef.current?.();
          };
          utter.onerror = () => {
            speechUtteranceRef.current = null;
          };
          speechUtteranceRef.current = utter;
          window.speechSynthesis.speak(utter);
        } catch (e) {
          console.warn('Speech synthesis error', e);
        }
      }

      // Timer progression
      const interval = 100; // ms
      fallbackIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (interval / 1000) * playbackRate;
          if (next >= duration) {
            clearInterval(fallbackIntervalRef.current);
            fallbackIntervalRef.current = null;
            setIsPlaying(false);
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            speechUtteranceRef.current = null;
            onEndedRef.current?.();
            return 0;
          }
          return next;
        });
      }, interval);
    } else {
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
        fallbackIntervalRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    }

    return () => {
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
        fallbackIntervalRef.current = null;
      }
    };
  }, [isPlaying, isFallbackMode, duration, playbackRate, transcript]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (!isFallbackMode && audioRef.current) {
        audioRef.current.pause();
      } else if (isFallbackMode && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
    } else {
      // No se espera a hasRealAudio: algunos móviles no cargan los metadatos hasta play().
      if (!isFallbackMode && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn('Playback error, switching to fallback:', err);
          setIsFallbackMode(true);
          setHasRealAudio(false);
          setIsPlaying(true);
        });
      } else {
        // Fallback mode play
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        setIsPlaying(true);
      }
    }
  }, [isPlaying, isFallbackMode]);

  // Seek to specific second
  const seek = useCallback((newTime) => {
    const clamped = Math.max(0, Math.min(newTime, duration));
    setCurrentTime(clamped);
    if (hasRealAudio && audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
  }, [duration, hasRealAudio]);

  // Skip relative seconds (+10 or -10)
  const skip = useCallback((deltaSeconds) => {
    seek(currentTime + deltaSeconds);
  }, [currentTime, seek]);

  // Cycle playback speed (1x -> 1.25x -> 1.5x -> 2x -> 1x)
  const cyclePlaybackRate = useCallback(() => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current && hasRealAudio) {
      audioRef.current.playbackRate = nextRate;
    }
  }, [playbackRate, hasRealAudio]);

  return {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isLoading,
    isFallbackMode,
    hasRealAudio,
    togglePlay,
    seek,
    skip,
    setPlaybackRate,
    cyclePlaybackRate,
    stopAll
  };
}

