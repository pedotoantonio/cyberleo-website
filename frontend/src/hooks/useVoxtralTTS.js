/**
 * useVoxtralTTS - Hook React per Voxtral TTS (Mistral AI)
 *
 * Integrazione con l'API Voxtral TTS per generare audio di alta qualita
 * in italiano per le storie di CyberLeo.
 *
 * Caratteristiche:
 * - Sintesi vocale on-demand via API
 * - Cache automatica degli audio generati
 * - Fallback a Web Speech API se API non disponibile
 * - Controlli velocita, pausa, seek
 * - Sincronizzazione parola per karaoke
 *
 * Utilizzo:
 *   const { speak, stop, isLoading, isPlaying, error } = useVoxtralTTS();
 *   await speak("Ciao piccoli amici!");
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// Configurazione API
const VOXTRAL_API_URL = import.meta.env.VITE_VOXTRAL_API_URL || '/api/tts';
const DEFAULT_SPEED = 0.9; // Velocita per bambini
const WORDS_PER_SECOND = 2.5; // Stima per sincronizzazione karaoke

/**
 * Hook per Voxtral TTS
 * @param {Object} options - Opzioni configurazione
 * @param {number} options.speed - Velocita (0.5-2.0), default 0.9
 * @param {boolean} options.useVoiceCloning - Usa voice cloning Leo
 * @param {boolean} options.useCache - Usa cache per audio
 * @param {Function} options.onWordChange - Callback per cambio parola (karaoke)
 */
export function useVoxtralTTS(options = {}) {
  const {
    speed = DEFAULT_SPEED,
    useVoiceCloning = true,
    useCache = true,
    onWordChange = null
  } = options;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(null);

  // Refs
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const wordsRef = useRef([]);
  const startTimeRef = useRef(0);
  const playbackRateRef = useRef(speed);

  // Cache locale per audio generati
  const audioCacheRef = useRef(new Map());

  /**
   * Verifica disponibilita API Voxtral
   */
  const checkApiAvailability = useCallback(async () => {
    try {
      const response = await fetch(`${VOXTRAL_API_URL}/status`);
      if (response.ok) {
        const data = await response.json();
        setApiAvailable(data.voxtral_available || data.piper_available);
        return data.voxtral_available || data.piper_available;
      }
    } catch (e) {
      console.warn('Voxtral API non raggiungibile, uso fallback');
    }
    setApiAvailable(false);
    return false;
  }, []);

  // Check API on mount
  useEffect(() => {
    checkApiAvailability();
  }, [checkApiAvailability]);

  /**
   * Genera hash per cache key
   */
  const getCacheKey = useCallback((text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `voxtral_${Math.abs(hash)}_${speed}_${useVoiceCloning}`;
  }, [speed, useVoiceCloning]);

  /**
   * Sintetizza testo usando API Voxtral
   */
  const synthesizeWithAPI = useCallback(async (text) => {
    // Check cache
    const cacheKey = getCacheKey(text);
    if (useCache && audioCacheRef.current.has(cacheKey)) {
      console.log('Audio from cache:', cacheKey);
      return audioCacheRef.current.get(cacheKey);
    }

    const response = await fetch(`${VOXTRAL_API_URL}/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        speed,
        use_voice_cloning: useVoiceCloning,
        format: 'mp3',
        cache: useCache
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Errore API TTS');
    }

    const data = await response.json();

    if (!data.success || !data.audio_base64) {
      throw new Error('Risposta API invalida');
    }

    // Converti base64 in blob URL
    const audioBlob = base64ToBlob(data.audio_base64, 'audio/mpeg');
    const audioUrl = URL.createObjectURL(audioBlob);

    // Salva in cache
    if (useCache) {
      audioCacheRef.current.set(cacheKey, audioUrl);
    }

    return audioUrl;
  }, [speed, useVoiceCloning, useCache, getCacheKey]);

  /**
   * Fallback a Web Speech API
   */
  const synthesizeWithWebSpeech = useCallback((text) => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Web Speech API non supportata'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = speed;
      utterance.pitch = 1.0;

      // Trova voce italiana
      const voices = window.speechSynthesis.getVoices();
      const italianVoice = voices.find(v =>
        v.lang.startsWith('it') ||
        v.name.toLowerCase().includes('italian')
      );
      if (italianVoice) {
        utterance.voice = italianVoice;
      }

      utteranceRef.current = utterance;
      setIsUsingFallback(true);

      utterance.onstart = () => {
        setIsPlaying(true);
        startTimeRef.current = Date.now();
        startWordTracking(text);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
        resolve();
      };

      utterance.onerror = (e) => {
        reject(new Error(e.error));
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [speed]);

  /**
   * Avvia tracking parole per karaoke
   */
  const startWordTracking = useCallback((text) => {
    // Estrai parole
    wordsRef.current = text.split(/\s+/).filter(w => w.length > 0);

    const updateWordIndex = () => {
      if (!isPlaying) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const adjustedElapsed = elapsed * playbackRateRef.current;
      const estimatedIndex = Math.floor(adjustedElapsed * WORDS_PER_SECOND);

      if (estimatedIndex !== currentWordIndex && estimatedIndex < wordsRef.current.length) {
        setCurrentWordIndex(estimatedIndex);
        if (onWordChange) {
          onWordChange(estimatedIndex, wordsRef.current[estimatedIndex]);
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateWordIndex);
    };

    animationFrameRef.current = requestAnimationFrame(updateWordIndex);
  }, [isPlaying, currentWordIndex, onWordChange]);

  /**
   * Riproduce audio da URL
   */
  const playAudioUrl = useCallback((audioUrl, text) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.playbackRate = playbackRateRef.current;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);

        // Word tracking per karaoke
        if (wordsRef.current.length > 0) {
          const wordDuration = audio.duration / wordsRef.current.length;
          const estimatedIndex = Math.floor(audio.currentTime / wordDuration);
          if (estimatedIndex !== currentWordIndex && estimatedIndex < wordsRef.current.length) {
            setCurrentWordIndex(estimatedIndex);
            if (onWordChange) {
              onWordChange(estimatedIndex, wordsRef.current[estimatedIndex]);
            }
          }
        }
      };

      audio.onplay = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      audio.onpause = () => {
        setIsPaused(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
        setProgress(0);
        setCurrentWordIndex(-1);
        resolve();
      };

      audio.onerror = (e) => {
        reject(new Error('Errore riproduzione audio'));
      };

      // Estrai parole per tracking
      wordsRef.current = text.split(/\s+/).filter(w => w.length > 0);

      audio.play().catch(reject);
    });
  }, [currentWordIndex, onWordChange]);

  /**
   * Sintetizza e riproduce testo
   */
  const speak = useCallback(async (text) => {
    if (!text || text.trim().length === 0) {
      setError('Testo vuoto');
      return;
    }

    // Stop any current playback
    stop();

    setIsLoading(true);
    setError(null);
    setIsUsingFallback(false);

    try {
      // Prova API Voxtral
      if (apiAvailable !== false) {
        try {
          const audioUrl = await synthesizeWithAPI(text);
          setIsLoading(false);
          await playAudioUrl(audioUrl, text);
          return;
        } catch (apiError) {
          console.warn('API Voxtral fallita:', apiError);
        }
      }

      // Fallback a Web Speech
      setIsLoading(false);
      await synthesizeWithWebSpeech(text);

    } catch (e) {
      setError(e.message);
      setIsPlaying(false);
      setIsLoading(false);
      console.error('Errore TTS:', e);
    }
  }, [apiAvailable, synthesizeWithAPI, synthesizeWithWebSpeech, playAudioUrl]);

  /**
   * Ferma riproduzione
   */
  const stop = useCallback(() => {
    // Stop audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Stop Web Speech
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setProgress(0);
    setCurrentWordIndex(-1);
  }, []);

  /**
   * Pausa riproduzione
   */
  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPaused(true);
    } else if (isUsingFallback && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isUsingFallback]);

  /**
   * Riprende riproduzione
   */
  const resume = useCallback(() => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else if (isUsingFallback && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPaused, isUsingFallback]);

  /**
   * Toggle play/pause
   */
  const togglePlayPause = useCallback(() => {
    if (isPaused) {
      resume();
    } else if (isPlaying) {
      pause();
    }
  }, [isPlaying, isPaused, pause, resume]);

  /**
   * Salta a tempo specifico (solo audio file)
   */
  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  /**
   * Cambia velocita
   */
  const setSpeed = useCallback((newSpeed) => {
    playbackRateRef.current = newSpeed;
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  }, []);

  /**
   * Pulisci cache
   */
  const clearCache = useCallback(() => {
    for (const url of audioCacheRef.current.values()) {
      URL.revokeObjectURL(url);
    }
    audioCacheRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      clearCache();
    };
  }, [stop, clearCache]);

  return {
    // Azioni
    speak,
    stop,
    pause,
    resume,
    togglePlayPause,
    seek,
    setSpeed,
    clearCache,
    checkApiAvailability,

    // Stato
    isLoading,
    isPlaying,
    isPaused,
    error,
    currentTime,
    duration,
    progress,
    currentWordIndex,
    isUsingFallback,
    apiAvailable,

    // Utilities
    canSeek: !isUsingFallback && audioRef.current !== null
  };
}

/**
 * Converte base64 in Blob
 */
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export default useVoxtralTTS;
