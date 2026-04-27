/**
 * AudioPlayer - Player audio avanzato per CyberLeo
 *
 * Features:
 * - Progress bar cliccabile con scrubbing
 * - Controllo velocità (0.5x - 2x)
 * - Timer (tempo corrente / durata totale)
 * - Pulsanti play/pause/stop
 * - Indicatore fallback Web Speech
 * - Design child-friendly
 */
import { Play, Pause, Square, Volume2, Zap, Snail, Rabbit, Mic2 } from 'lucide-react';

// Formatta secondi in mm:ss
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Velocità disponibili
const SPEEDS = [
  { value: 0.5, label: 'Lento', icon: Snail, color: 'text-blue-500' },
  { value: 0.75, label: 'Piano', icon: null, color: 'text-blue-400' },
  { value: 1, label: 'Normale', icon: Zap, color: 'text-green-500' },
  { value: 1.25, label: 'Veloce', icon: null, color: 'text-orange-400' },
  { value: 1.5, label: 'Rapido', icon: Rabbit, color: 'text-orange-500' },
];

export default function AudioPlayer({
  isPlaying,
  isPaused,
  currentTime,
  duration,
  playbackRate,
  isUsingFallback,
  error,
  progress,
  canSeek,
  onPlay,
  onPause,
  onResume,
  onStop,
  onSeek,
  onSpeedChange,
  className = '',
}) {
  // Trova la velocità corrente
  const currentSpeed = SPEEDS.find(s => s.value === playbackRate) || SPEEDS[2];

  // Cicla tra le velocità
  const cycleSpeed = () => {
    const currentIndex = SPEEDS.findIndex(s => s.value === playbackRate);
    const nextIndex = (currentIndex + 1) % SPEEDS.length;
    onSpeedChange?.(SPEEDS[nextIndex].value);
  };

  // Handle click sulla progress bar
  const handleProgressClick = (e) => {
    if (!canSeek || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    onSeek?.(newTime);
  };

  // Mostra errore
  if (error) {
    return (
      <div className={`bg-red-50 border-2 border-red-200 rounded-2xl p-4 ${className}`}>
        <div className="flex items-center justify-center gap-3 text-red-600">
          <Volume2 className="w-6 h-6" />
          <span className="font-semibold">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-4 shadow-lg ${className}`}>
      {/* Header con titolo e indicatore */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-purple-500" />
          <span className="font-bold text-purple-700">
            {isPlaying ? (isPaused ? 'In pausa' : 'In ascolto...') : 'Lettore Vocale'}
          </span>
        </div>

        {/* Badge fallback */}
        {isUsingFallback && (
          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            <Mic2 className="w-4 h-4" />
            <span>Voce browser</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div
          className={`h-4 bg-gray-200 rounded-full overflow-hidden ${canSeek ? 'cursor-pointer hover:bg-gray-300' : ''}`}
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full transition-all duration-100 relative"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          >
            {/* Pallino indicatore */}
            {isPlaying && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-purple-500 rounded-full shadow-md transform translate-x-1/2" />
            )}
          </div>
        </div>

        {/* Tempo */}
        <div className="flex justify-between mt-1 text-sm text-gray-500 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controlli */}
      <div className="flex items-center justify-between gap-4">
        {/* Pulsanti principali */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          {!isPlaying ? (
            <button
              onClick={onPlay}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Ascolta</span>
            </button>
          ) : (
            <>
              <button
                onClick={isPaused ? onResume : onPause}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-all ${
                  isPaused
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-400 text-yellow-900'
                }`}
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Continua</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pausa</span>
                  </>
                )}
              </button>

              <button
                onClick={onStop}
                className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-3 rounded-full font-bold hover:bg-red-200 hover:scale-105 transition-all"
              >
                <Square className="w-5 h-5 fill-current" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            </>
          )}
        </div>

        {/* Controllo velocità */}
        <div className="flex items-center gap-2">
          <button
            onClick={cycleSpeed}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold border-2 hover:scale-105 transition-all ${currentSpeed.color} bg-white border-current`}
            title={`Velocità: ${currentSpeed.label}`}
          >
            {currentSpeed.icon && <currentSpeed.icon className="w-5 h-5" />}
            <span className="text-sm font-mono">{playbackRate}x</span>
          </button>
        </div>
      </div>

      {/* Indicatore animato durante la riproduzione */}
      {isPlaying && !isPaused && (
        <div className="mt-4 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-purple-400 rounded-full animate-pulse"
              style={{
                height: `${12 + Math.random() * 12}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
