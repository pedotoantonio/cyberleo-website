/**
 * useVoiceReader - Hook per la lettura vocale delle storie CyberLeo
 *
 * Priorità:
 * 1. Audio pre-generato (Piper TTS / ElevenLabs)
 * 2. Web Speech API come fallback gratuito
 *
 * Features:
 * - Play/Pause/Stop
 * - Controllo velocità (0.5x - 2x)
 * - Progress tracking per sincronizzazione karaoke
 * - Eventi per aggiornare UI
 */
import { useState, useRef, useCallback, useEffect } from 'react';

// Configurazione voci italiane per Web Speech API
const ITALIAN_VOICE_PREFERENCES = [
  'Google italiano',
  'Microsoft Elsa Online',
  'Alice',
  'Federica',
  'it-IT',
];

export default function useVoiceReader() {
  // Stato
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [error, setError] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  // Refs
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);
  const wordsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const speechSynthRef = useRef(null);

  // Trova la migliore voce italiana disponibile
  const findItalianVoice = useCallback(() => {
    if (!window.speechSynthesis) return null;

    const voices = window.speechSynthesis.getVoices();

    // Prima cerca le voci preferite
    for (const pref of ITALIAN_VOICE_PREFERENCES) {
      const voice = voices.find(v =>
        v.name.toLowerCase().includes(pref.toLowerCase()) ||
        v.lang.toLowerCase().includes(pref.toLowerCase())
      );
      if (voice) return voice;
    }

    // Fallback: qualsiasi voce italiana
    const italianVoice = voices.find(v =>
      v.lang.startsWith('it') ||
      v.lang.toLowerCase().includes('italian')
    );

    return italianVoice || voices[0];
  }, []);

  // Inizializza speech synthesis
  useEffect(() => {
    if (window.speechSynthesis) {
      speechSynthRef.current = window.speechSynthesis;
      // Forza il caricamento delle voci
      speechSynthRef.current.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        speechSynthRef.current.getVoices();
      };
    }
  }, []);

  // Update progress durante la riproduzione audio
  const updateProgress = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      setCurrentTime(audioRef.current.currentTime);

      // Stima la parola corrente basandosi sul tempo
      // (approssimazione: ~3 parole al secondo per lettura lenta bambini)
      const wordsPerSecond = 2.5 * playbackRate;
      const estimatedWordIndex = Math.floor(audioRef.current.currentTime * wordsPerSecond);
      setCurrentWordIndex(Math.min(estimatedWordIndex, wordsRef.current.length - 1));

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [playbackRate]);

  // Pulisci alla unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  /**
   * Riproduce audio da file MP3 pre-generato
   */
  const playFromFile = useCallback((audioUrl, text = '') => {
    return new Promise((resolve, reject) => {
      // Ferma qualsiasi riproduzione in corso
      stop();

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      wordsRef.current = text.replace(/[#*_~`]/g, '').split(/\s+/).filter(w => w.length > 0);

      audio.playbackRate = playbackRate;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.onplay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setIsUsingFallback(false);
        setError(null);
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      };

      audio.onpause = () => {
        setIsPaused(true);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
        setCurrentWordIndex(-1);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        resolve();
      };

      audio.onerror = (e) => {
        console.error('Audio file error:', e);
        setError('Audio non disponibile');
        reject(new Error('Audio file not available'));
      };

      audio.play().catch(reject);
    });
  }, [playbackRate, updateProgress]);

  /**
   * Riproduce testo usando Web Speech API (fallback)
   */
  const playWithSpeech = useCallback((text) => {
    return new Promise((resolve, reject) => {
      if (!speechSynthRef.current) {
        reject(new Error('Web Speech API not supported'));
        return;
      }

      // Ferma qualsiasi riproduzione in corso
      stop();

      // Pulisci il testo da markdown
      const cleanText = text
        .replace(/^#+\s*/gm, '') // Rimuovi headers
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Rimuovi bold
        .replace(/\*([^*]+)\*/g, '$1') // Rimuovi italic
        .replace(/`([^`]+)`/g, '$1') // Rimuovi code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Rimuovi link
        .replace(/[🦁✨🌟💫⭐🎀🎈🌈🦋🌸🍀🐞🦇🐻🐛🧚☁️🐦‍⬛💡🎯]/g, '') // Rimuovi emoji
        .trim();

      wordsRef.current = cleanText.split(/\s+/).filter(w => w.length > 0);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      // Configura voce italiana
      const voice = findItalianVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = 'it-IT';
      utterance.rate = playbackRate;
      utterance.pitch = 1.1; // Leggermente più alto per voce femminile

      // Stima durata (circa 150 parole al minuto)
      const estimatedDuration = (wordsRef.current.length / 150) * 60;
      setDuration(estimatedDuration);

      let startTime = 0;

      utterance.onstart = () => {
        startTime = Date.now();
        setIsPlaying(true);
        setIsPaused(false);
        setIsUsingFallback(true);
        setError(null);

        // Simula progress
        const updateSpeechProgress = () => {
          if (utteranceRef.current && !speechSynthRef.current.paused) {
            const elapsed = (Date.now() - startTime) / 1000;
            setCurrentTime(elapsed);

            const wordsPerSecond = 2.5 * playbackRate;
            const estimatedWordIndex = Math.floor(elapsed * wordsPerSecond);
            setCurrentWordIndex(Math.min(estimatedWordIndex, wordsRef.current.length - 1));

            animationFrameRef.current = requestAnimationFrame(updateSpeechProgress);
          }
        };
        animationFrameRef.current = requestAnimationFrame(updateSpeechProgress);
      };

      utterance.onpause = () => {
        setIsPaused(true);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          // Aggiorna indice parola quando disponibile
          const wordIndex = Math.floor(event.charIndex / 6); // Stima
          setCurrentWordIndex(Math.min(wordIndex, wordsRef.current.length - 1));
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
        setCurrentWordIndex(-1);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        resolve();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.error('Speech synthesis error:', e);
          setError('Errore lettura vocale');
          reject(e);
        }
      };

      speechSynthRef.current.speak(utterance);
    });
  }, [playbackRate, findItalianVoice]);

  /**
   * Riproduce: prima prova audio file, poi fallback a Web Speech
   */
  const play = useCallback(async (audioUrl, text = '') => {
    setError(null);

    if (audioUrl) {
      try {
        await playFromFile(audioUrl, text);
        return;
      } catch (e) {
        console.log('Audio file not available, falling back to Web Speech API');
      }
    }

    // Fallback a Web Speech API
    if (text) {
      try {
        await playWithSpeech(text);
      } catch (e) {
        setError('Lettura vocale non disponibile');
        setIsPlaying(false);
      }
    } else {
      setError('Nessun contenuto da leggere');
    }
  }, [playFromFile, playWithSpeech]);

  /**
   * Mette in pausa la riproduzione
   */
  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    } else if (speechSynthRef.current && speechSynthRef.current.speaking) {
      speechSynthRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  /**
   * Riprende la riproduzione
   */
  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused && audioRef.current.currentTime > 0) {
      audioRef.current.play();
      setIsPaused(false);
    } else if (speechSynthRef.current && speechSynthRef.current.paused) {
      speechSynthRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  /**
   * Ferma la riproduzione
   */
  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }

    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setCurrentWordIndex(-1);
  }, []);

  /**
   * Cambia la velocità di riproduzione
   */
  const setSpeed = useCallback((rate) => {
    const clampedRate = Math.max(0.5, Math.min(2, rate));
    setPlaybackRate(clampedRate);

    if (audioRef.current) {
      audioRef.current.playbackRate = clampedRate;
    }

    // Per Web Speech API, bisogna riavviare con la nuova velocità
    // (non supporta cambio runtime)
  }, []);

  /**
   * Salta a una posizione specifica (solo per audio file)
   */
  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration));
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

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

  return {
    // Stato
    isPlaying,
    isPaused,
    currentTime,
    duration,
    playbackRate,
    isUsingFallback,
    error,
    currentWordIndex,
    words: wordsRef.current,

    // Azioni
    play,
    pause,
    resume,
    stop,
    setSpeed,
    seek,
    togglePlayPause,

    // Utilities
    canSeek: !isUsingFallback && audioRef.current !== null,
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,
  };
}
