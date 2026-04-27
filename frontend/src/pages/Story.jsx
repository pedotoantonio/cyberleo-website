import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import useVoiceReader from '../hooks/useVoiceReader';
import AudioPlayer from '../components/AudioPlayer';
import KaraokeText from '../components/KaraokeText';

// Emoji decorative per le pagine
const pageDecorations = ['🌟', '✨', '💫', '⭐', '🎀', '🎈', '🌈', '🦋', '🌸', '🍀'];

// Colori per le pagine alternate
const pageColors = [
  'from-amber-50 to-orange-50',
  'from-blue-50 to-cyan-50',
  'from-pink-50 to-rose-50',
  'from-green-50 to-emerald-50',
  'from-yellow-50 to-amber-50',
  'from-purple-50 to-violet-50',
  'from-teal-50 to-cyan-50',
];

export default function Story() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState('large');
  const [sceneImages, setSceneImages] = useState({});
  const [audioFiles, setAudioFiles] = useState({});

  // Hook per la lettura vocale avanzata
  const voiceReader = useVoiceReader();

  useEffect(() => {
    fetch(`/api/stories/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Story not found');
        return res.json();
      })
      .then(data => {
        setStory(data);
        setLoading(false);

        const storySlug = data.slug || slug;

        // Cerca immagini delle scene
        const checkSceneImages = async () => {
          const images = {};
          for (let i = 1; i <= 30; i++) {
            const scenePath = `/uploads/stories/${storySlug}/scene_${i}.jpg`;
            try {
              const response = await fetch(scenePath, { method: 'HEAD' });
              if (response.ok) {
                images[i] = scenePath;
              }
            } catch (e) {
              // Immagine non trovata
            }
          }
          setSceneImages(images);
        };

        // Cerca file audio pre-generati
        const checkAudioFiles = async () => {
          const audio = {};
          for (let i = 1; i <= 30; i++) {
            const audioPath = `/uploads/stories/${storySlug}/audio_${i}.mp3`;
            try {
              const response = await fetch(audioPath, { method: 'HEAD' });
              if (response.ok) {
                audio[i] = audioPath;
              }
            } catch (e) {
              // Audio non trovato
            }
          }
          setAudioFiles(audio);
        };

        checkSceneImages();
        checkAudioFiles();
      })
      .catch(err => {
        console.error('Error fetching story:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  // Pagine della storia
  const pages = useMemo(() => {
    if (!story) return [];

    if (story.pages && story.pages.length > 0) {
      return story.pages.map(p => p.text);
    }

    if (!story.content) return [];

    const sections = story.content.split(/(?=##\s)|(?=\n\n(?=[A-Z"🦁✨]))/g)
      .filter(s => s.trim().length > 50)
      .map(s => s.trim());

    return sections;
  }, [story]);

  // Immagine per la pagina
  const getPageImage = useCallback((pageContent, pageIndex) => {
    const sceneNumber = pageIndex;
    if (sceneImages[sceneNumber]) {
      return sceneImages[sceneNumber];
    }
    if (story?.image_url) {
      return story.image_url;
    }
    return '/images/heroes/cyberleo-hero.jpg';
  }, [story, sceneImages]);

  const totalPages = pages.length;

  // Ferma lettura quando cambia pagina
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      voiceReader.stop();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Avvia lettura della pagina corrente
  const handlePlay = useCallback(() => {
    const pageIndex = currentPage;
    const audioUrl = audioFiles[pageIndex];
    const pageText = pages[pageIndex - 1] || '';

    voiceReader.play(audioUrl, pageText);
  }, [currentPage, audioFiles, pages, voiceReader]);

  // Verifica se c'è audio per la pagina corrente
  const hasAudioForCurrentPage = audioFiles[currentPage] !== undefined;
  const currentPageText = currentPage > 0 ? pages[currentPage - 1] : '';

  const fontSizeClasses = {
    medium: 'text-xl md:text-2xl leading-relaxed',
    large: 'text-2xl md:text-3xl leading-loose',
    xlarge: 'text-3xl md:text-4xl leading-loose',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-100 to-orange-100">
        <div className="text-8xl mb-6 animate-bounce">🦁</div>
        <div className="w-20 h-20 border-4 border-cyberleo-gold border-t-transparent rounded-full animate-spin" />
        <p className="mt-6 text-2xl font-bold text-amber-800 animate-pulse">
          Preparando la storia...
        </p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-100 to-orange-100">
        <div className="text-center p-8">
          <span className="text-[120px] mb-6 block">😿</span>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Ops! Storia non trovata
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Questa avventura non esiste ancora...
          </p>
          <Link to="/storie" className="inline-flex items-center gap-3 bg-cyberleo-gold text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform">
            <Home className="w-6 h-6" />
            Torna alle Storie
          </Link>
        </div>
      </div>
    );
  }

  const currentDecoration = pageDecorations[currentPage % pageDecorations.length];
  const currentColor = pageColors[currentPage % pageColors.length];
  const currentImage = currentPage === 0
    ? (story.image_url || '/images/heroes/cyberleo-hero.jpg')
    : getPageImage(pages[currentPage], currentPage);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentColor} transition-colors duration-700`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/storie"
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-amber-700" />
              <span className="font-bold text-amber-700 hidden sm:inline">Storie</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-3xl">🦁</span>
              <span className="font-bold text-xl text-gray-800 hidden md:inline">CyberLeo</span>
            </div>

            <button
              onClick={() => setFontSize(f => f === 'medium' ? 'large' : f === 'large' ? 'xlarge' : 'medium')}
              className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
            >
              <span className="text-lg font-bold text-blue-700">
                {fontSize === 'medium' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Copertina */}
      {currentPage === 0 && (
        <div className="relative">
          <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
            <img
              src={story.image_url || '/images/heroes/cyberleo-hero.jpg'}
              alt={story.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-4 leading-tight">
                {story.title}
              </h1>
              <div className="flex items-center justify-center gap-2 text-white/90 mb-6">
                <Sparkles className="w-6 h-6" />
                <span className="text-xl md:text-2xl">Una storia di CyberLeo</span>
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="text-center py-10 -mt-6 relative z-10">
            <button
              onClick={nextPage}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-12 py-6 rounded-full text-2xl md:text-3xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all animate-pulse border-4 border-white"
            >
              <span>Inizia a Leggere</span>
              <ArrowRight className="w-10 h-10" />
            </button>
          </div>
        </div>
      )}

      {/* Pagine della storia */}
      {currentPage > 0 && (
        <main className="container mx-auto px-4 py-6 md:py-10">
          {/* Decorazione pagina */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">{currentDecoration}</span>
            <span className="text-xl font-bold text-gray-600">
              Pagina {currentPage} di {totalPages - 1}
            </span>
            <span className="text-4xl">{currentDecoration}</span>
          </div>

          {/* AUDIO PLAYER AVANZATO */}
          <div className="max-w-2xl mx-auto mb-6">
            <AudioPlayer
              isPlaying={voiceReader.isPlaying}
              isPaused={voiceReader.isPaused}
              currentTime={voiceReader.currentTime}
              duration={voiceReader.duration}
              playbackRate={voiceReader.playbackRate}
              isUsingFallback={voiceReader.isUsingFallback}
              error={voiceReader.error}
              progress={voiceReader.progress}
              canSeek={voiceReader.canSeek}
              onPlay={handlePlay}
              onPause={voiceReader.pause}
              onResume={voiceReader.resume}
              onStop={voiceReader.stop}
              onSeek={voiceReader.seek}
              onSpeedChange={voiceReader.setSpeed}
            />

            {/* Info fallback */}
            {!hasAudioForCurrentPage && (
              <p className="text-center text-sm text-gray-500 mt-2">
                💡 Audio pre-generato non disponibile. Verrà usata la voce del browser.
              </p>
            )}
          </div>

          {/* Contenitore libro */}
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-4xl mx-auto border-8 border-amber-200">
            {/* Illustrazione */}
            <div className="relative">
              <div className="p-4 md:p-6 bg-gradient-to-b from-amber-100 to-amber-50">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-amber-300">
                  <div className="aspect-[16/10] relative">
                    <img
                      src={currentImage}
                      alt={`Scena ${currentPage} della storia`}
                      className="w-full h-full object-cover transition-all duration-700"
                      onError={(e) => {
                        e.target.src = story?.image_url || '/images/heroes/cyberleo-hero.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-amber-100/10" />
                  </div>

                  {sceneImages[currentPage] && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <span>🎨</span>
                      <span>Scena {currentPage}</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 text-4xl opacity-80 animate-pulse">✨</div>
                  <div className="absolute bottom-2 left-2 text-4xl opacity-80 animate-pulse" style={{animationDelay: '0.3s'}}>✨</div>
                </div>
              </div>
            </div>

            {/* Testo con KARAOKE */}
            <div className="p-6 md:p-10 lg:p-14">
              <KaraokeText
                text={currentPageText}
                currentWordIndex={voiceReader.currentWordIndex}
                isPlaying={voiceReader.isPlaying && !voiceReader.isPaused}
                className={fontSizeClasses[fontSize]}
              />
            </div>

            <div className="h-6 bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300" />
          </div>

          {/* Navigazione */}
          <div className="flex items-center justify-between mt-10 max-w-4xl mx-auto">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-3 px-8 py-5 rounded-full text-xl font-bold transition-all ${
                currentPage === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white shadow-xl hover:shadow-2xl hover:scale-105 text-amber-700 border-2 border-amber-200'
              }`}
            >
              <ChevronLeft className="w-8 h-8" />
              <span className="hidden sm:inline">Indietro</span>
            </button>

            <div className="flex flex-col items-center gap-2">
              <span className="text-amber-700 font-semibold text-lg">
                Pagina {currentPage + 1} di {totalPages}
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {Array.from({ length: Math.min(totalPages, 8) }).map((_, idx) => {
                  const numDots = Math.min(totalPages, 8);
                  const pageIdx = totalPages > numDots
                    ? Math.floor(idx * (totalPages - 1) / (numDots - 1))
                    : idx;
                  const isActive = totalPages > numDots
                    ? Math.round(currentPage * (numDots - 1) / (totalPages - 1)) === idx
                    : currentPage === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => goToPage(pageIdx)}
                      className={`w-4 h-4 rounded-full transition-all ${
                        isActive
                          ? 'bg-amber-500 w-8 shadow-lg'
                          : 'bg-amber-200 hover:bg-amber-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              className={`flex items-center gap-3 px-8 py-5 rounded-full text-xl font-bold transition-all ${
                currentPage >= totalPages - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl hover:shadow-2xl hover:scale-105 text-white'
              }`}
            >
              <span className="hidden sm:inline">Avanti</span>
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </main>
      )}

      {/* Fine storia */}
      {currentPage === totalPages - 1 && totalPages > 1 && (
        <div className="container mx-auto px-4 py-10">
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-3xl p-10 md:p-14 text-center text-white max-w-4xl mx-auto shadow-2xl">
            <span className="text-[100px] block mb-6">🦁</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Fine della Storia!
            </h2>
            <p className="text-2xl md:text-3xl mb-10 opacity-90">
              Ti e piaciuta questa avventura?
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => { voiceReader.stop(); setCurrentPage(0); }}
                className="inline-flex items-center justify-center gap-3 bg-white text-amber-600 px-10 py-5 rounded-full text-2xl font-bold hover:scale-105 transition-transform shadow-xl"
              >
                <ArrowLeft className="w-8 h-8" />
                Rileggi
              </button>
              <Link
                to="/storie"
                className="inline-flex items-center justify-center gap-3 bg-amber-600 text-white px-10 py-5 rounded-full text-2xl font-bold hover:scale-105 transition-transform shadow-xl"
              >
                Altre Storie
                <ArrowRight className="w-8 h-8" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Pulsanti laterali desktop */}
      {currentPage > 0 && (
        <>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="fixed left-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/95 backdrop-blur rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40 hidden lg:flex disabled:opacity-50"
          >
            <ChevronLeft className="w-10 h-10 text-amber-600" />
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages - 1}
            className="fixed right-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40 hidden lg:flex disabled:opacity-50"
          >
            <ChevronRight className="w-10 h-10 text-white" />
          </button>
        </>
      )}

      <style>{`
        .story-content {
          word-spacing: 0.15em;
          letter-spacing: 0.03em;
        }
        .story-content p:first-of-type::first-letter {
          font-size: 2em;
          font-weight: bold;
          color: #d97706;
          float: left;
          margin-right: 0.1em;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}
