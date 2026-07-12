import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stories?page=${page}&limit=12`)
      .then(res => res.json())
      .then(data => {
        setStories(data.stories || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stories:', err);
        setLoading(false);
      });
  }, [page]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-sparkle py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-5 h-5 text-cyberleo-gold" />
            <span className="font-semibold text-cyberleo-orange">Biblioteca di CyberLeo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-800 mb-4">
            Le Storie di CyberLeo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scopri tutte le avventure di CyberLeo e i suoi amici nella Città Digitale!
          </p>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-cyberleo-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stories.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <Link key={story.id} to={`/storie/${story.slug}`} className="story-card group">
                  <div className="relative h-52 bg-gradient-to-br from-cyberleo-warm to-cyberleo-gold/20 overflow-hidden">
                    {story.image_url ? (
                      <img
                        src={story.image_url}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl">📖</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Clock className="w-4 h-4" />
                        {formatDate(story.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-display text-gray-800 mb-3 group-hover:text-cyberleo-orange transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {story.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-cyberleo-orange font-semibold">
                      <span>Leggi la storia</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Pagina precedente"
                  className="p-3 rounded-xl bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <ChevronLeft className="w-6 h-6 text-cyberleo-orange" />
                </button>
                <span className="text-lg font-semibold text-gray-700">
                  Pagina {page} di {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Pagina successiva"
                  className="p-3 rounded-xl bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <ChevronRight className="w-6 h-6 text-cyberleo-orange" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white/50 rounded-3xl">
            <span className="text-8xl mb-6 block">📚</span>
            <h2 className="text-2xl font-bold font-display text-gray-800 mb-4">
              Le storie stanno arrivando!
            </h2>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              CyberLeo sta preparando nuove avventure per te. Torna presto!
            </p>
            <Link to="/" className="btn-cyberleo inline-flex items-center gap-2 mt-8">
              Torna alla Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
